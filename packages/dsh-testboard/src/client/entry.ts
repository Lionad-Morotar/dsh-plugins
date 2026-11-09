/**
 * Client half entry: the "测试" conversation view tab.
 *
 * Two host behaviours shape this file:
 * - The desktop applies a client plugin twice on one host process (the sync
 *   pass, then the mount pass). The locale table refuses a second registration
 *   for the same namespace and locale, so the module holds the previous
 *   disposer and drops it before registering again.
 * - Reading a service the plugin did not declare in `inject` throws from the
 *   property read instead of yielding undefined, so `inject` names exactly the
 *   two services used here.
 */
import { LOCALE_NAMESPACE, PACKAGE_NAME, VIEW_ID, VIEW_ORDER, VIEW_SLOT } from "../shared.ts";
import { EN, ZH } from "./copy.ts";
import { boot as bootSnapshot, loadSnapshotChunk, type LoaderRequire } from "./snapshot-loader.ts";
import { bootEditor, loadEditorChunk } from "./editor-loader.ts";
import { bootSources, loadSourcesChunk } from "./sources-loader.ts";
import { ensureStyles } from "./styles.ts";
import { createTestboardView, type TestboardViewStrings } from "./view.tsx";

/** The `require` the ModuleLoader factory hands over. */
export type { LoaderRequire } from "./snapshot-loader.ts";

/**
 * The loader hand-over, re-exported so the ModuleLoader factory can reach it.
 *
 * The factory appends `module.exports.boot?.(require)` to this bundle, which is
 * the only point where the chunk-capable `require` exists; each loader keeps it
 * until the board mounts. Re-exporting (rather than importing for side effects)
 * is also what keeps both chunk file names in this bundle: the build asserts the
 * startup half still names the files it emitted.
 *
 * One `boot` for both loaders rather than two exports: the factory calls exactly
 * one hand-over point, so a second name would never be called and its chunk
 * would be fetched by nobody.
 * @param require - the factory's require, with `async` attached.
 */
export function boot(require: LoaderRequire): void {
  bootSnapshot(require);
  bootSources(require);
  bootEditor(require);
}

/** The slice of the client context this entry uses. */
export interface TestboardClientContext {
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
function activeLocale(ctx: TestboardClientContext): string {
  const snapshot = ctx.locale.getSnapshot?.();
  return typeof snapshot?.active === "string" ? snapshot.active : "zh";
}

/**
 * Register the test board tab.
 * @param ctx - the client context, with `slots` and `locale` injected.
 * @returns a disposer that unregisters the tab and the dictionary.
 */
export function apply(ctx: TestboardClientContext): () => void {
  ensureStyles();
  const t = ctx.locale.bind(LOCALE_NAMESPACE);
  registeredDictionaries?.();
  const offLocale = ctx.locale.register(LOCALE_NAMESPACE, { zh: ZH, en: EN });
  registeredDictionaries = offLocale;

  const View = createTestboardView({
    strings: {
      title: t("testboard.tabTitle"),
      subtitle: t("testboard.subtitle"),
      ago: t("testboard.ago"),
      passed: t("testboard.passed"),
      failed: t("testboard.failed"),
      took: t("testboard.took"),
      filterAll: t("testboard.filterAll"),
      filterFailed: t("testboard.filterFailed"),
      searchPlaceholder: t("testboard.searchPlaceholder"),
      sortFailFirst: t("testboard.sortFailFirst"),
      sortSlowFirst: t("testboard.sortSlowFirst"),
      peak: t("testboard.peak"),
      perSecond: t("testboard.perSecond"),
      empty: t("testboard.empty"),
      cases: t("testboard.cases"),
      detailEmpty: t("testboard.detailEmpty"),
      line: t("testboard.line"),
      sourceMissing: t("testboard.sourceMissing"),
      paneResize: t("testboard.paneResize"),
      paneResizeHint: t("testboard.paneResizeHint"),
      listLabel: t("testboard.listLabel"),
    } satisfies TestboardViewStrings,
    loadSnapshot: () => loadSnapshotChunk().then(chunk => chunk.snapshot),
    loadSources: () => loadSourcesChunk().then(chunk => chunk.sources),
    loadEditor: () => loadEditorChunk(),
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
        label: () => (activeLocale(ctx).startsWith("zh") ? ZH["testboard.tabTitle"] : EN["testboard.tabTitle"]),
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
