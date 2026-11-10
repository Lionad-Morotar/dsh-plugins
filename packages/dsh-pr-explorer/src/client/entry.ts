/**
 * Client half entry: the "PR" conversation view tab.
 *
 * Two host behaviours shape this file:
 * - The desktop applies a client plugin twice on one host process (the sync
 *   pass, then the mount pass). The locale table refuses a second registration
 *   for the same namespace and locale, so the module holds the previous
 *   disposer and drops it before registering again.
 * - Reading a service the plugin did not declare in `inject` throws from the
 *   property read instead of yielding undefined, so `inject` names exactly the
 *   two services used here.
 *
 * The view is built once per apply from the strings resolved at that moment;
 * the tab label is a thunk instead, because the shell re-resolves labels on
 * every locale revision and a frozen string would keep the boot language.
 */
import { LOCALE_NAMESPACE, PACKAGE_NAME, VIEW_ID, VIEW_ORDER, VIEW_SLOT } from "../shared.ts";
import { EN, ZH } from "./copy.ts";
import { ensureStyles } from "./styles.ts";
import { createPrExplorerView, type PrExplorerViewStrings } from "./view.tsx";

/** The slice of the client context this entry uses. */
export interface PrExplorerClientContext {
  readonly slots: {
    inject(slot: string, factory: () => () => void): unknown;
    register(options: Record<string, unknown>, component: unknown): () => void;
  };
  readonly locale: {
    register(namespace: string, dictionaries: Record<string, Record<string, string>>): () => void;
    bind(namespace: string): (key: string) => string;
    /** Locale snapshot; absent on hosts that only expose the binder. */
    getSnapshot?(): { readonly active?: string };
  };
}

/** Services this plugin waits for before applying. */
export const inject = ["slots", "locale"];

/**
 * Disposer of the dictionary currently in the host's locale table.
 *
 * A repeat apply meets the same table, and the table refuses a second
 * registration for the same namespace and locale; dropping ours first turns
 * that refusal into a plain replacement.
 */
let registeredDictionaries: (() => void) | undefined;

/**
 * Disposer of the tab currently on the slot.
 *
 * Module scope so a repeat apply can drop the registration it is replacing; a
 * per-call local would leave the first tab live beside the second. It is cleared
 * inside the inject factory rather than before it, because the factory is
 * deferred and may run after the second `apply` returned: whichever factory runs
 * second is the one that clears the first.
 */
let registeredSlot: (() => void) | undefined;

/**
 * The host's active locale id.
 *
 * The slot label is re-resolved by the shell on every locale revision, so the
 * thunk reads this at call time instead of freezing the boot language.
 * @param ctx - the client context carrying the locale service.
 * @returns the active id, or `zh` when the host exposes no snapshot.
 */
function activeLocale(ctx: PrExplorerClientContext): string {
  const snapshot = ctx.locale.getSnapshot?.();
  return typeof snapshot?.active === "string" ? snapshot.active : "zh";
}

/**
 * Register the PR explorer tab.
 * @param ctx - the client context, with `slots` and `locale` injected.
 * @returns a disposer that unregisters the tab and the dictionary.
 */
export function apply(ctx: PrExplorerClientContext): () => void {
  ensureStyles();
  const t = ctx.locale.bind(LOCALE_NAMESPACE);
  registeredDictionaries?.();
  const offLocale = ctx.locale.register(LOCALE_NAMESPACE, { zh: ZH, en: EN });
  registeredDictionaries = offLocale;

  const View = createPrExplorerView({
    strings: {
      title: t("pr-explorer.tabTitle"),
      repoFallback: t("pr-explorer.repoFallback"),
      baseLabel: t("pr-explorer.baseLabel"),
      headLabel: t("pr-explorer.headLabel"),
      swap: t("pr-explorer.swap"),
      refresh: t("pr-explorer.refresh"),
      tabCommits: t("pr-explorer.tabCommits"),
      tabFiles: t("pr-explorer.tabFiles"),
      ahead: t("pr-explorer.ahead"),
      behind: t("pr-explorer.behind"),
      filesCount: t("pr-explorer.filesCount"),
      commitsTruncated: t("pr-explorer.commitsTruncated"),
      markBinary: t("pr-explorer.markBinary"),
      markUnknown: t("pr-explorer.markUnknown"),
      statusAdded: t("pr-explorer.statusAdded"),
      statusModified: t("pr-explorer.statusModified"),
      statusDeleted: t("pr-explorer.statusDeleted"),
      statusRenamed: t("pr-explorer.statusRenamed"),
      statusCopied: t("pr-explorer.statusCopied"),
      statusTypeChanged: t("pr-explorer.statusTypeChanged"),
      statusUnknown: t("pr-explorer.statusUnknown"),
      loading: t("pr-explorer.loading"),
      empty: t("pr-explorer.empty"),
      emptyHint: t("pr-explorer.emptyHint"),
      noDifference: t("pr-explorer.noDifference"),
      detailEmpty: t("pr-explorer.detailEmpty"),
      detailTruncated: t("pr-explorer.detailTruncated"),
      detailBinary: t("pr-explorer.detailBinary"),
      detailUnknownSize: t("pr-explorer.detailUnknownSize"),
      commitHash: t("pr-explorer.commitHash"),
      commitAuthor: t("pr-explorer.commitAuthor"),
      commitDate: t("pr-explorer.commitDate"),
      commitSubject: t("pr-explorer.commitSubject"),
      commitRefs: t("pr-explorer.commitRefs"),
      errorNotARepo: t("pr-explorer.errorNotARepo"),
      errorInvalidRef: t("pr-explorer.errorInvalidRef"),
      errorNoMergeBase: t("pr-explorer.errorNoMergeBase"),
      errorNoSession: t("pr-explorer.errorNoSession"),
      errorTooLarge: t("pr-explorer.errorTooLarge"),
      errorUnreadable: t("pr-explorer.errorUnreadable"),
      errorBadRequest: t("pr-explorer.errorBadRequest"),
      errorUnknown: t("pr-explorer.errorUnknown"),
    } satisfies PrExplorerViewStrings,
  });

  // `inject` is a deferred registration: the factory runs when the slot itself
  // appears, which can be after `apply` returned, so the disposer it hands back
  // is the only handle on the registration. `ownSlot` is this application's
  // handle on it, captured per call: the module-level `registeredSlot` moves on
  // to the next application, and this one must not follow it there.
  let ownSlot: (() => void) | undefined;
  ctx.slots.inject(VIEW_SLOT, () => {
    registeredSlot?.();
    const offSlot = ctx.slots.register(
      {
        name: VIEW_SLOT,
        id: VIEW_ID,
        order: VIEW_ORDER,
        label: () => (activeLocale(ctx).startsWith("zh") ? ZH["pr-explorer.tabTitle"] : EN["pr-explorer.tabTitle"]),
        locale: LOCALE_NAMESPACE,
      },
      View,
    );
    registeredSlot = offSlot;
    ownSlot = offSlot;
    return () => {
      offSlot();
      if (registeredSlot === offSlot) registeredSlot = undefined;
    };
  });

  // Only tear down what this application still owns. The desktop applies the
  // plugin twice and may dispose the first application afterwards; by then the
  // module-level handles point at the second application's registrations, and
  // unregistering those would take down a tab that is still on screen. A
  // superseded disposer therefore does nothing, which is what makes it safe to
  // call in any order.
  return () => {
    if (ownSlot !== undefined && registeredSlot === ownSlot) {
      registeredSlot();
      registeredSlot = undefined;
    }
    ownSlot = undefined;
    if (registeredDictionaries === offLocale) {
      offLocale();
      registeredDictionaries = undefined;
    }
  };
}

/** The plugin object the loader mounts. */
export const clientPlugin = { name: PACKAGE_NAME, inject, apply };

export default clientPlugin;
