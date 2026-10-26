/**
 * Browser-half entry. The build wraps this module's compiled text inside a
 * ModuleLoader factory, so this file only assembles the plugin object.
 *
 * The client half exists to put a bound in front of the page's clipboard writer.
 * That is damage control for the surface it runs on rather than this package's
 * feature: the copy buttons rendered by the shell await the platform clipboard
 * without a bound, so a write that never settles leaves the button permanently
 * inert. A plugin cannot replace those buttons, but every one of them funnels
 * through `navigator.clipboard.writeText`, which is a seam a plugin can put a
 * bound in front of for the whole page.
 *
 * cordis calls `apply(ctx, config)` — context first — so the context stays
 * untouched here and every service is read through the declared inject list.
 */
import { bindExecCommandCopy, installBoundedClipboard } from "./clipboard-shim.ts";

/** Services this half reads. The clipboard binding needs none of the host's. */
export const inject: readonly string[] = [];

/** The client context shape, narrowed to the one facility this half uses. */
export interface ClientContextLike {
  effect(callback: () => () => void, label?: string): void;
}

/** The page globals the clipboard binding touches; absent outside a browser. */
interface ClipboardHost {
  readonly navigator?: { readonly clipboard?: { writeText?: (text: string) => Promise<void> } };
  readonly document?: Document;
}

/**
 * Bound the page's clipboard writer, if this surface has one.
 *
 * Installed at apply time rather than on first copy: the buttons it protects are
 * already mounted by then, and one clicked before the plugin loads would
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
    // Through `effect` so a profile reload restores the original writer instead
    // of stacking a second bound on top of the first.
    ctx.effect(() => boundClipboard(globalThis) ?? (() => {}), "dsh-slash-commands: bounded clipboard");
  },
};

export default clientPlugin;
