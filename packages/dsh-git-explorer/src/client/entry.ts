/**
 * Browser-half entry.
 *
 * Registers the Git conversation view. The core service arrives through
 * `inject`, never through a cross-package module import; the Git data service
 * is read lazily from `ctx.remote.gitExplorer` so an unloaded host half renders
 * the panel's "service unavailable" state instead of keeping the tab hidden.
 */
import { EN, ZH } from "./copy.ts";
import { LOCALE_NAMESPACE, VIEW_ID, VIEW_ORDER, VIEW_SLOT } from "../shared.ts";
import { computeWindow, createJump, formatCommitDetail, groupChanges } from "./model.ts";
import { insertStyles } from "./styles.ts";
import { createGitExplorerView, type WorkbenchFace } from "./view.tsx";
import type { GitRemoteFace, RemoteResolver } from "./wire.ts";

/** The slice of the client context this entry uses. */
export interface ClientContextLike {
  readonly slots: {
    inject(slot: string, factory: () => () => void): unknown;
    register(options: Record<string, unknown>, component: unknown): () => void;
  };
  readonly locale: {
    register(namespace: string, dictionaries: Record<string, Record<string, string>>): () => void;
    bind(namespace: string): (key: string) => string;
  };
  readonly workbench: WorkbenchFace;
  /** Typert's client namespace table; `gitExplorer` appears when the host half is loaded. */
  readonly remote?: { readonly gitExplorer?: GitRemoteFace };
  /** Cordis's non-throwing resolver, used to probe a namespace not injected. */
  get?(name: string): unknown;
}

/**
 * Services this plugin waits for before applying.
 *
 * `remote.gitExplorer` is deliberately not listed: waiting for it would hide the
 * tab when the host half is missing, which is exactly the case the panel has an
 * empty state for.
 */
export const inject = ["slots", "locale", "workbench", "remote"];

/** Whether a value is the generated Git namespace rather than a cordis stub. */
function isGitRemote(value: unknown): value is GitRemoteFace {
  if (value === null || typeof value !== "object") return false;
  const record = value as Record<string, unknown>;
  return typeof record.snapshot === "function" && typeof record.query === "function" && typeof record.commit === "function";
}

/**
 * Read the optional Git namespace on every call.
 *
 * The documented path is `ctx.remote.gitExplorer`. A host that enforces the
 * inject whitelist throws when that nested service was not declared, and the
 * page needs an empty state instead of an exception, so the non-throwing
 * resolver is the second probe.
 */
export function createRemoteResolver(ctx: ClientContextLike): RemoteResolver {
  return () => {
    try {
      const direct = ctx.remote?.gitExplorer;
      if (isGitRemote(direct)) return direct;
    } catch {
      // Namespace not injected or not mounted yet; fall through to the resolver.
    }
    try {
      const viaGet = ctx.get?.("remote.gitExplorer");
      if (isGitRemote(viaGet)) return viaGet;
    } catch {
      // A resolver that rejects an unknown name is the same as an absent face.
    }
    return undefined;
  };
}

/** Mount the Git workbench view. */
/** Disposer of the dictionary currently sitting in the host's locale table.
* A repeat apply on one host process (the desktop sync pass followed by the
* mount pass) meets the same table, and the table refuses a second
* registration for the same namespace and locale. Dropping ours first turns
* that would-be throw into a plain replacement: the disposer deletes by
* dictionary identity, so the module-singleton dictionaries are always
* removable by the very disposer that registered them. */
let registeredDictionaries: (() => void) | undefined;

export function apply(ctx: ClientContextLike): () => void {
  const workbench = ctx.workbench;
  if (workbench === undefined || workbench === null) return () => {};

  const t = ctx.locale.bind(LOCALE_NAMESPACE);
  registeredDictionaries?.();
  const offLocale = ctx.locale.register(LOCALE_NAMESPACE, { zh: ZH, en: EN });
  registeredDictionaries = offLocale;
  const offStyles = insertStyles(typeof document === "undefined" ? undefined : document);
  const View = createGitExplorerView({ workbench, version: workbench.version, t, remote: createRemoteResolver(ctx) });

  ctx.slots.inject(VIEW_SLOT, () =>
    ctx.slots.register(
      {
        name: VIEW_SLOT,
        id: VIEW_ID,
        order: VIEW_ORDER,
        label: () => t("tab.label"),
        locale: LOCALE_NAMESPACE,
      },
      View,
    ),
  );

  return () => {
    offStyles();
    offLocale();
    if (registeredDictionaries === offLocale) registeredDictionaries = undefined;
  };
}

/**
 * Pure surfaces for the acceptance probe and the unit tests.
 *
 * They are attached to the default export because the loader hands the browser
 * bundle's default export to the host; there is no other module handle.
 */
export const __test = { groupChanges, formatCommitDetail, createJump, computeWindow };

/** The plugin object the loader mounts. */
export const clientPlugin = { name: "dsh-git-explorer", inject, apply, __test };

export default clientPlugin;
