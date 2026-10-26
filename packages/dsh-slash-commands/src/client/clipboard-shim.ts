/**
 * A clipboard write that always settles.
 *
 * `navigator.clipboard.writeText` is the only clipboard surface a page has, and it
 * is not a total function in practice: an unfocused document rejects it, and a
 * document without a live user activation can leave the returned promise pending
 * forever. A caller that awaits it before releasing its "copy in flight" flag is
 * then stuck: the flag is never released, the first click never completes, and
 * every later click is ignored. That is a dead button, not a failed copy, and it
 * is the difference between "nothing happened" and "nothing will ever happen".
 *
 * The write installed here is bounded on purpose. It gives the platform call a
 * short budget, falls back to the legacy selection copy, and settles either way,
 * so a caller always learns the outcome and can show it. Both paths are tried
 * because neither covers the other: the platform call is the only one that works
 * on an unfocused document that has already been granted permission, and the
 * legacy command is the only one that works where the platform call is missing.
 *
 * The wrapper replaces the page's own method rather than offering a parallel
 * helper, because the copy buttons that break are rendered by the harness and not
 * by this plugin: wrapping the platform method is the only place a plugin can put
 * a bound in front of them.
 */

/** Timer functions, injected so the budget is testable without real time. */
export interface ClipboardScheduler {
  setTimeout(callback: () => void, ms: number): number;
  clearTimeout(handle: number): void;
}

/** The legacy copy path, given the text and answering whether it landed. */
export type ClipboardFallback = (text: string) => boolean;

/** What one bounded write needs from the environment. */
export interface WriteBoundedDeps {
  readonly scheduler: ClipboardScheduler;
  readonly fallback: ClipboardFallback;
  /** Budget for the platform call before the fallback is tried. */
  readonly budgetMs?: number;
}

/** The platform clipboard shape this module wraps; only `writeText` is used. */
export interface PlatformClipboard {
  writeText?: (text: string) => Promise<void>;
}

/**
 * How long the platform call gets before the fallback takes over.
 *
 * Short enough that a dead button recovers within one frame or two of the click,
 * long enough that a healthy permission check and IPC round trip is not cut off:
 * a granted write resolves in single-digit milliseconds, so this only ever fires
 * on the pathological path.
 */
export const DEFAULT_CLIPBOARD_BUDGET_MS = 120;

/** Marks a wrapped method, so installing twice cannot stack budgets. */
const WRAPPED = Symbol.for("dsh-slash-commands.bounded-clipboard");

/** The text a bounded write is currently trying, keyed by promise, for the fallback. */
interface WrappedWriteText {
  (text: string): Promise<void>;
  readonly [WRAPPED]?: { readonly dispose: () => void };
}

/**
 * Write `text`, bounding the platform call and falling back when it fails.
 *
 * Resolves true when either path landed, false when neither did. Never rejects:
 * "the copy failed" is an outcome the caller must be able to render, not an
 * exception that would leave its in-flight flag set.
 *
 * `clipboard.writeText` must be the platform method, not the wrapper this module
 * installs: the caller that installs the wrapper passes the captured original, so
 * a bounded write can never re-enter itself.
 */
export async function writeBounded(
  clipboard: PlatformClipboard,
  text: string,
  deps: WriteBoundedDeps,
): Promise<boolean> {
  const writeText = clipboard.writeText;
  if (typeof writeText !== "function") return deps.fallback(text);

  const budget = deps.budgetMs ?? DEFAULT_CLIPBOARD_BUDGET_MS;
  const settled = await new Promise<"landed" | "failed" | "timeout">(resolve => {
    let done = false;
    const finish = (outcome: "landed" | "failed" | "timeout") => {
      if (done) return;
      done = true;
      deps.scheduler.clearTimeout(handle);
      resolve(outcome);
    };
    const handle = deps.scheduler.setTimeout(() => finish("timeout"), budget);
    // The platform call is invoked with the clipboard as receiver: a detached
    // call loses the brand check and rejects on some browsers.
    let attempt: Promise<void>;
    try {
      attempt = writeText.call(clipboard, text);
    } catch {
      finish("failed");
      return;
    }
    Promise.resolve(attempt).then(
      () => finish("landed"),
      () => finish("failed"),
    );
  });

  if (settled === "landed") return true;
  // A timed-out platform call may still land later. It cannot be cancelled, so the
  // fallback runs alongside it: two writes of the same text are indistinguishable
  // to the user, while waiting for the wedged promise is what froze the button.
  return deps.fallback(text);
}

/**
 * Build the legacy selection copy for one document.
 *
 * `execCommand('copy')` still works where the async clipboard API is missing or
 * refused, and it is synchronous, so it cannot wedge. The element it needs must be
 * focusable but invisible and outside the accessibility tree, and it must be
 * removed even when the copy fails: leaving it behind would put a stray node in
 * the body after every failed attempt.
 *
 * `select()` focuses the scratch field, so the fallback briefly takes focus from
 * whatever had it. Removing the field does not give it back: the page is left with
 * no focused element, and a user typing into the composer while a copy runs finds
 * their next keystrokes going nowhere. The element that had focus is therefore
 * captured first and focused again on the way out, failure included, because the
 * field took it in both cases.
 */
export function bindExecCommandCopy(document: Document): ClipboardFallback {
  return (text: string): boolean => {
    // `activeElement` is the body when nothing is focused; focusing the body back
    // would hand the page a target it never had.
    const active = document.activeElement;
    const restore = active !== null && active !== document.body ? active : null;
    const field = document.createElement("textarea");
    field.value = text;
    field.setAttribute("readonly", "");
    field.setAttribute("aria-hidden", "true");
    field.style.position = "fixed";
    field.style.top = "0";
    field.style.left = "0";
    field.style.opacity = "0";
    field.style.pointerEvents = "none";
    document.body.appendChild(field);
    try {
      field.select();
      field.setSelectionRange(0, text.length);
      return document.execCommand("copy");
    } catch {
      return false;
    } finally {
      document.body.removeChild(field);
      if (restore !== null) (restore as HTMLElement).focus?.();
    }
  };
}

/**
 * Replace a page's `writeText` with the bounded writer.
 *
 * The wrapper keeps the platform semantics a caller expects: it resolves when the
 * copy landed and rejects when it did not, which is what the harness' copy buttons
 * check. The difference is that it always settles, so a wedged platform call can
 * no longer hold a caller's in-flight flag.
 *
 * @param clipboard - the page's clipboard object (usually `navigator.clipboard`).
 * @param deps - scheduler and legacy fallback.
 * @returns disposer restoring the original method.
 */
export function installBoundedClipboard(clipboard: PlatformClipboard, deps: WriteBoundedDeps): () => void {
  const target = clipboard as PlatformClipboard & { writeText?: WrappedWriteText };
  const existing = target.writeText;
  if (typeof existing !== "function") return () => {};
  if (existing[WRAPPED] !== undefined) return existing[WRAPPED].dispose;

  // A view over the captured original, not over the page object: the page's own
  // `writeText` is about to be this wrapper, and reading it back here would call
  // the wrapper from inside the wrapper.
  const original = { writeText: (text: string) => existing.call(clipboard, text) };
  const wrapped: WrappedWriteText = async (text: string) => {
    const landed = await writeBounded(original, text, deps);
    if (!landed) throw new Error("clipboard write failed");
  };
  // `writeText` normally lives on the prototype, so restoring means removing the
  // shadow this installed rather than copying the prototype method onto the
  // instance. An own property that was already there is restored in place.
  const own = Object.prototype.hasOwnProperty.call(target, "writeText");
  const dispose = () => {
    if (target.writeText !== wrapped) return;
    if (own) {
      target.writeText = existing;
      return;
    }
    delete (target as { writeText?: unknown }).writeText;
  };
  Object.defineProperty(wrapped, WRAPPED, { get: () => ({ dispose }) });
  target.writeText = wrapped;
  return dispose;
}
