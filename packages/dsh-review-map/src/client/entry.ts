/**
 * Client half entry: the "评审" conversation view tab.
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
import { createReviewMapView, type ReviewMapViewStrings } from "./view.tsx";

/**
 * The loader hand-over, re-exported so the ModuleLoader factory can call it.
 *
 * The build appends `module.exports.boot?.(require)` to this bundle, and the
 * optional call is what keeps the entry loadable when this export is missing.
 * Re-exporting rather than defining it here keeps the chunk route in one file.
 */
export { boot } from "./chunk-loader.ts";

/** The slice of the client context this entry uses. */
export interface ReviewMapClientContext {
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
function activeLocale(ctx: ReviewMapClientContext): string {
  const snapshot = ctx.locale.getSnapshot?.();
  return typeof snapshot?.active === "string" ? snapshot.active : "zh";
}

/**
 * Register the review map tab.
 * @param ctx - the client context, with `slots` and `locale` injected.
 * @returns a disposer that unregisters the tab and the dictionary.
 */
export function apply(ctx: ReviewMapClientContext): () => void {
  ensureStyles();
  const t = ctx.locale.bind(LOCALE_NAMESPACE);
  registeredDictionaries?.();
  const offLocale = ctx.locale.register(LOCALE_NAMESPACE, { zh: ZH, en: EN });
  registeredDictionaries = offLocale;

  const View = createReviewMapView({
    strings: {
      title: t("review-map.tabTitle"),
      repoFallback: t("review-map.repoFallback"),
      scopeWorktree: t("review-map.scopeWorktree"),
      scopeBranch: t("review-map.scopeBranch"),
      refresh: t("review-map.refresh"),
      statLines: t("review-map.statLines"),
      statFiles: t("review-map.statFiles"),
      statNewImports: t("review-map.statNewImports"),
      statDroppedImports: t("review-map.statDroppedImports"),
      indexPartial: t("review-map.indexPartial"),
      unresolved: t("review-map.unresolved"),
      unresolvedHint: t("review-map.unresolvedHint"),
      mapTitle: t("review-map.mapTitle"),
      mapLoading: t("review-map.mapLoading"),
      mapEmpty: t("review-map.mapEmpty"),
      mapError: t("review-map.mapError"),
      flowImports: t("review-map.flowImports"),
      flowImportedBy: t("review-map.flowImportedBy"),
      flowUnresolved: t("review-map.flowUnresolved"),
      mapUnresolved: t("review-map.mapUnresolved"),
      mapPartial: t("review-map.mapPartial"),
      uncommitted: t("review-map.uncommitted"),
      listMetaWorktree: t("review-map.listMetaWorktree"),
      listMetaBranch: t("review-map.listMetaBranch"),
      listSort: t("review-map.listSort"),
      listEmpty: t("review-map.listEmpty"),
      markBinary: t("review-map.markBinary"),
      markUntracked: t("review-map.markUntracked"),
      markConflicted: t("review-map.markConflicted"),
      renameHint: t("review-map.renameHint"),
      statusAdded: t("review-map.statusAdded"),
      statusModified: t("review-map.statusModified"),
      statusDeleted: t("review-map.statusDeleted"),
      statusRenamed: t("review-map.statusRenamed"),
      statusCopied: t("review-map.statusCopied"),
      statusTypeChanged: t("review-map.statusTypeChanged"),
      statusUntracked: t("review-map.statusUntracked"),
      statusConflicted: t("review-map.statusConflicted"),
      statusUnknown: t("review-map.statusUnknown"),
      errorNotARepo: t("review-map.errorNotARepo"),
      errorNoBase: t("review-map.errorNoBase"),
      errorNoSession: t("review-map.errorNoSession"),
      errorTooLarge: t("review-map.errorTooLarge"),
      errorConflicted: t("review-map.errorConflicted"),
      errorUnreadable: t("review-map.errorUnreadable"),
      errorUnknown: t("review-map.errorUnknown"),
      loading: t("review-map.loading"),
      empty: t("review-map.empty"),
      emptyHint: t("review-map.emptyHint"),
      detailClose: t("review-map.detailClose"),
      detailTruncated: t("review-map.detailTruncated"),
      detailBinary: t("review-map.detailBinary"),
      detailUnknownSize: t("review-map.detailUnknownSize"),
      detailEmpty: t("review-map.detailEmpty"),
      detailErrorConflicted: t("review-map.detailErrorConflicted"),
      detailErrorTooLarge: t("review-map.detailErrorTooLarge"),
      detailErrorUnreadable: t("review-map.detailErrorUnreadable"),
      detailErrorBadRequest: t("review-map.detailErrorBadRequest"),
      detailErrorUnknown: t("review-map.detailErrorUnknown"),
    } satisfies ReviewMapViewStrings,
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
        label: () => (activeLocale(ctx).startsWith("zh") ? ZH["review-map.tabTitle"] : EN["review-map.tabTitle"]),
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
