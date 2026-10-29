/**
 * Browser-half entry. The build wraps this module's compiled text inside a
 * ModuleLoader factory, so this file only assembles the plugin object: bind the
 * clipboard writer every copy button goes through, then register the command.
 *
 * The client half exists because `/resume` cannot live on the host: switching
 * sessions is a client-side UI navigation (`ctx.uiWorkspace`), and the host has
 * no such capability. The two halves share one package name, one Loader row and
 * one manifest; only the entry each surface imports differs.
 *
 * The clipboard binding is not this package's feature either, it is damage control
 * for the surface it runs on: the copy buttons rendered by the shell await the
 * platform clipboard without a bound, so a write that never settles leaves the
 * button permanently inert. A plugin cannot replace those buttons, but every one
 * of them funnels through `navigator.clipboard.writeText`, which is a seam a
 * plugin can put a bound in front of for the whole page.
 *
 * cordis calls `apply(ctx, config)` — context first — so the context stays
 * untouched here and every service is read through the declared inject list.
 */
import { bindExecCommandCopy, installBoundedClipboard } from "./clipboard-shim.ts";
import { installCommaFold } from "./comma-listener.ts";
import { createResumeContribution, type ResumeWiringContext } from "./resume-command.ts";

/** Services the wiring reads; declared so Cordis resolves them before apply. */
export const inject = ["commandUi", "sessions", "workspaces", "uiWorkspace"];

/** The client context this plugin reads: the wiring's collaborators plus the
 *  fiber-scoped effect `apply` registers through. Cordis supplies the services. */
export type ClientContextLike = ResumeWiringContext & {
  effect(callback: () => () => void, label?: string): void;
};

/** The page globals the clipboard binding touches; absent outside a browser. */
interface ClipboardHost {
  readonly navigator?: { readonly clipboard?: { writeText?: (text: string) => Promise<void> } };
  readonly document?: Document;
}

/** The page globals the fold touches; same absence rules as the clipboard. */
interface FoldHost {
  readonly document?: Document;
}

/**
 * Install the 顿号→斜杠 fallback, if this surface has a document.
 *
 * Best-effort by design: the client boot is fail-closed, so an install that
 * cannot happen must degrade to "absent" instead of failing the whole page.
 */
function commaFold(host: FoldHost): (() => void) | undefined {
  const doc = host.document;
  if (doc === undefined) return undefined;
  try {
    return installCommaFold(doc);
  } catch {
    return undefined;
  }
}

/**
 * Bound the page's clipboard writer, if this surface has one.
 *
 * Installed at apply time rather than on first copy: the buttons it protects are
 * already mounted by then, and one that is clicked before the plugin loads would
 * otherwise be the one that hangs.
 */
function boundClipboard(host: ClipboardHost): (() => void) | undefined {
  const clipboard = host.navigator?.clipboard;
  const document = host.document;
  if (clipboard === undefined || document === undefined) return undefined;
  return installBoundedClipboard(clipboard, {
    scheduler: {
      // Node's timer types differ from the browser's, and this half runs in the
      // browser; the browser build is what actually supplies these values.
      setTimeout: (callback, ms) => globalThis.setTimeout(callback, ms) as unknown as number,
      clearTimeout: handle => globalThis.clearTimeout(handle),
    },
    fallback: bindExecCommandCopy(document),
  });
}

export const clientPlugin = {
  name: "dsh-slash-commands",
  inject,
  apply(ctx: ClientContextLike): void {
    // Every registration goes through `effect` so a profile reload drops them
    // instead of leaving a second copy: a duplicate command would throw on
    // registration, a second clipboard wrapper would stack budgets, and a
    // second beforeinput listener would fold one keystroke twice.
    ctx.effect(() => boundClipboard(globalThis) ?? (() => {}), "dsh-slash-commands: bounded clipboard");
    ctx.effect(() => ctx.commandUi.register(createResumeContribution(ctx)), "dsh-slash-commands: /resume");
    ctx.effect(() => commaFold(globalThis) ?? (() => {}), "dsh-slash-commands: comma fold");
  },
};

export default clientPlugin;
