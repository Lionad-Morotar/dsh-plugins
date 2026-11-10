/**
 * The interop seam: the focus grammar this package speaks, and the jump that
 * hands one to another view.
 *
 * Two things live here rather than in the view. The grammar is a wire format
 * shared with other packages, so it is pinned on its own: a parser that accepted
 * `compare:a:b:c` would compare the wrong pair and say nothing. And the jump's
 * ordering is the whole reason it exists: the focus queue holds one request per
 * view, so a request that was delivered has to be taken back out, or the next
 * mount of that view replays a target the reader has already seen.
 *
 * Nothing here imports another package. The workbench seam is a structural slice,
 * so this file compiles and tests without the core being present.
 */

/** The prefix this package's focus strings carry. */
const COMPARE_PREFIX = "compare:";

/** A parsed x...y request. */
export interface CompareFocus {
  readonly base: string;
  readonly head: string;
}

/**
 * The focus string that asks the PR view for one pair.
 * @param base - the base ref, as the caller spells it.
 * @param head - the head ref, as the caller spells it.
 * @returns the focus string.
 */
export function formatCompareFocus(base: string, head: string): string {
  return `${COMPARE_PREFIX}${base}:${head}`;
}

/**
 * Parse a `compare:<base>:<head>` focus string.
 *
 * The split is on the *first* colon after the prefix, because a git ref name
 * cannot contain one: that is what makes `origin/release/2.0` a single segment
 * while `compare:a:b:c` is still recognisably not a pair. A payload with more
 * than two segments is refused rather than truncated: comparing `a` to `b` and
 * silently dropping `c` would answer a question nobody asked.
 * @param focus - the focus handed over with a view request.
 * @returns the pair, or undefined when this is not a compare focus.
 */
export function parseCompareFocus(focus: string | undefined): CompareFocus | undefined {
  if (focus === undefined || !focus.startsWith(COMPARE_PREFIX)) return undefined;
  const rest = focus.slice(COMPARE_PREFIX.length);
  const cut = rest.indexOf(":");
  if (cut < 0) return undefined;
  const base = rest.slice(0, cut);
  const head = rest.slice(cut + 1);
  if (base === "" || head === "" || head.includes(":")) return undefined;
  return { base, head };
}

/** The focus queue, as this package consumes it. */
export interface ViewFocusFace {
  request?(view: string, focus: string): void;
  take(view: string): string | undefined;
  subscribe?(listener: () => void): () => void;
}

/** The session-scoped view seam, on cores that publish one. */
export interface ViewSeamFace {
  open(sessionId: string, id: string, focus?: string): boolean | void;
}

/**
 * The slice of the workbench service this package reads.
 *
 * Every member but `version` is optional: a core older than the focus hand-off
 * still switches views, and a view that required the newer members would refuse
 * to mount on it at all.
 */
export interface WorkbenchFace {
  readonly version: number;
  currentSessionId?(): string | undefined;
  readonly views?: ViewSeamFace;
  openView?(id: string, focus?: string): boolean;
  openViewOrSwitch?(id: string, focus?: string): { readonly opened: boolean; readonly focused: boolean };
  readonly viewFocus?: ViewFocusFace;
}

/** What one jump needs. */
export interface ViewJumpSeam {
  readonly views?: ViewSeamFace;
  openView?(id: string, focus?: string): boolean;
  openViewOrSwitch?(id: string, focus?: string): { readonly opened: boolean; readonly focused: boolean };
  readonly viewFocus?: ViewFocusFace;
}

/** One jump: switch to a view and tell it what to open. */
export type ViewJump = (view: string, focus: string) => void;

/**
 * Build a jump over one workbench seam.
 *
 * The order is request, then switch, then take-if-delivered:
 *
 * - Request first, because the target view may not be mounted yet and the queue
 *   is the only thing that survives that gap.
 * - Switch second, because the switch is what puts the view on screen.
 * - Take third, and only when the switch reported `focused: true`, because that
 *   is the case where the focus was delivered directly. When the switch only
 *   changed tabs it could not pass a focus, so the queue entry is the only way
 *   the target ever learns what to open and must be left alone.
 *
 * A core with neither `openViewOrSwitch` nor `openView` still gets the request
 * left in the queue: a view that mounts later takes it.
 * @param wiring - the seam and the session the jump is scoped to.
 * @returns the jump.
 */
export function createViewJump({ seam, sessionId }: { readonly seam: ViewJumpSeam; readonly sessionId: string }): ViewJump {
  return (view, focus) => {
    if (focus === "") return;

    if (seam.openViewOrSwitch !== undefined) {
      seam.viewFocus?.request?.(view, focus);
      const result = seam.openViewOrSwitch(view, focus);
      if (result.focused) {
        seam.viewFocus?.take?.(view);
        return;
      }
      if (result.opened) return;
      seam.viewFocus?.take?.(view);
    }
    if (seam.views?.open(sessionId, view, focus) === true) return;
    if (seam.openView?.(view, focus) === true) return;
    seam.viewFocus?.request?.(view, focus);
  };
}

/**
 * The focus string that asks the file workbench for one path.
 * @param path - the repository-relative path.
 * @returns the focus string.
 */
export function formatPathFocus(path: string): string {
  return `path:${path}`;
}

/**
 * The focus string that asks the Git workbench for one commit.
 * @param hash - the commit hash.
 * @returns the focus string.
 */
export function formatCommitFocus(hash: string): string {
  return `commit:${hash}`;
}
