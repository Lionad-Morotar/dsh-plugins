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
import { LOCALE_NAMESPACE, PACKAGE_NAME, VIEW_ID, VIEW_ORDER, VIEW_SLOT, type LoaderRequire } from "../shared.ts";
import { EN, ZH } from "./copy.ts";
import { bootEditor, loadEditorChunk } from "./editor-loader.ts";
import { createHttpRuntime } from "./runtime.ts";
import { ensureStyles } from "./styles.ts";
import {
  registerTestboardReferenceSource,
  testboardReferenceSeam,
  type ReferenceContextLike,
  type ReferenceWiring,
  type ReferenceWiringResolver,
  type TestboardReferenceInsert,
  type TestboardReferenceSourceHandle,
  type TestboardReferenceSpan,
} from "./reference.ts";
import { createTestboardView, type TestboardViewStrings } from "./view.tsx";

/** The `require` the ModuleLoader factory hands over. */
export type { LoaderRequire } from "../shared.ts";

/**
 * The loader hand-over, re-exported so the ModuleLoader factory can reach it.
 *
 * The factory appends `module.exports.boot?.(require)` to this bundle, which is
 * the only point where the chunk-capable `require` exists; the editor loader
 * keeps it until a reader selects a file.
 *
 * One hand-over point, not one per loader: the factory calls exactly one, so a
 * second export would never be called and its chunk would be fetched by nobody.
 * @param require - the factory's require, with `async` attached.
 */
export function boot(require: LoaderRequire): void {
  bootEditor(require);
}

/** The slice of the client context this entry uses. */
export interface TestboardClientContext {
  /** The host services, read through the non-throwing resolver. */
  get?(name: string): unknown;
  inject?<T>(names: string[], apply: (scope: T) => void): unknown;
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
 * Handle of the reference source currently registered on the host.
 *
 * Module scope for the same reason as the slot: the desktop applies the plugin
 * twice, and the trigger service refuses a duplicate `trigger`/`name` pair, so
 * the second apply has to drop the first registration before making its own.
 */
let registeredReferenceSource: TestboardReferenceSourceHandle | undefined;

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

/** The slice of the session input facade the reference writer calls. */
interface SessionInputFace {
  insertReference?(insert: TestboardReferenceInsert, span: TestboardReferenceSpan): boolean;
  focus?(): void;
  notify?(level: "info" | "error", text: string): void;
}

/**
 * Build the per-session reference writer.
 *
 * Every service is read on each call. The facade is per session generation and
 * throws once that generation is released, so caching one would hand a stale
 * composer to the next click; and this resolver is built during `apply`, which
 * can run before `sessions` and `conversation` are up.
 * @param ctx - client context, read through the non-throwing resolver.
 * @returns a resolver that answers undefined when the input plane is absent.
 */
export function createReferenceResolver(ctx: TestboardClientContext): ReferenceWiringResolver {
  return (sessionId: string): ReferenceWiring | undefined => {
    const sessions = ctx.get?.("sessions") as { scope?(id: string): unknown } | undefined;
    const conversation = ctx.get?.("conversation") as
      | { input?: { for(actx: unknown): SessionInputFace } }
      | undefined;
    if (sessions?.scope === undefined || conversation?.input?.for === undefined) return undefined;
    let facade: SessionInputFace;
    try {
      const actx = sessions.scope(sessionId);
      if (actx === undefined) return undefined;
      facade = conversation.input.for(actx);
    } catch {
      // The controller refuses a Context whose generation was released: the
      // session was switched away from between the render and this click.
      return undefined;
    }
    if (facade === undefined || facade === null) return undefined;
    // Only the methods the facade really has are wrapped. A host can hand back a
    // facade without `insertReference`; a wrapper that always provides it would
    // pass the caller's capability check and then throw on the write.
    const insertReference = facade.insertReference;
    const focus = facade.focus;
    const notify = facade.notify;
    return {
      ...(typeof insertReference === "function"
        ? { insertReference: (insert, span) => insertReference.call(facade, insert, span) }
        : {}),
      ...(typeof focus === "function" ? { focus: () => focus.call(facade) } : {}),
      ...(typeof notify === "function"
        ? { notify: (level: "info" | "error", text: string) => notify.call(facade, level, text) }
        : {}),
    };
  };
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

  // The chip's send-time identity and its click target. Registered before the
  // view so a draft that already holds a chip can be sent the moment the tab
  // paints. The seam resolves per click: the workbench service may mount after
  // this registration, and a snapshot taken here would leave the chip inert.
  registeredReferenceSource?.dispose();
  const referenceSource = registerTestboardReferenceSource(ctx as ReferenceContextLike, () =>
    testboardReferenceSeam(ctx.get?.("workbench")),
  );
  registeredReferenceSource = referenceSource;

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
      runAll: t("testboard.runAll"),
      cancel: t("testboard.cancel"),
      runFile: t("testboard.runFile"),
      running: t("testboard.running"),
      notRunYet: t("testboard.notRunYet"),
      notRunYetHint: t("testboard.notRunYetHint"),
      noSession: t("testboard.noSession"),
      errorNoSession: t("testboard.errorNoSession"),
      errorUnknownWorkspace: t("testboard.errorUnknownWorkspace"),
      errorNoVitest: t("testboard.errorNoVitest"),
      errorNoSubprocess: t("testboard.errorNoSubprocess"),
      errorBusy: t("testboard.errorBusy"),
      errorBadScope: t("testboard.errorBadScope"),
      errorRunFailed: t("testboard.errorRunFailed"),
      rerunning: t("testboard.rerunning"),
      finished: t("testboard.finished"),
      failing: t("testboard.failing"),
      run: t("testboard.run"),
      rerun: t("testboard.rerun"),
      tests: t("testboard.tests"),
      chartTitle: t("testboard.chartTitle"),
      fixing: t("testboard.fixing"),
      fixingModel: t("testboard.fixingModel"),
      menuReference: t("testboard.menuReference"),
      menuRunFile: t("testboard.menuRunFile"),
      menuCopyPath: t("testboard.menuCopyPath"),
      referenceNoSession: t("testboard.referenceNoSession"),
      referenceNoComposer: t("testboard.referenceNoComposer"),
      referenceNoSource: t("testboard.referenceNoSource"),
      menuRunInFlight: t("testboard.menuRunInFlight"),
      noticeReferenced: t("testboard.noticeReferenced"),
      noticeReferencedText: t("testboard.noticeReferencedText"),
      noticeReferenceFailed: t("testboard.noticeReferenceFailed"),
      noticeCopied: t("testboard.noticeCopied"),
      noticeCopyFailed: t("testboard.noticeCopyFailed"),
    } satisfies TestboardViewStrings,
    // The board reads the host's live state; the committed snapshot is the
    // preview's fixture and the tests' corpus, not something the tab fetches.
    runtime: createHttpRuntime(),
    loadEditor: () => loadEditorChunk(),
    reference: createReferenceResolver(ctx),
    // A getter, not a snapshot: the inject path may register the source after
    // this view is built.
    referenceSourceAvailable: () => referenceSource.available,
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
    if (registeredReferenceSource === referenceSource) {
      referenceSource.dispose();
      registeredReferenceSource = undefined;
    }
  };
}

/** The plugin object the loader mounts. */
export const clientPlugin = { name: PACKAGE_NAME, inject, apply };

export default clientPlugin;
