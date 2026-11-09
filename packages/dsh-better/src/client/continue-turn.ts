/**
 * The "continue this turn" offer: its identity and the one decision behind it.
 *
 * A turn that was cut short leaves the conversation in a state the shell has no
 * affordance for. The host paints the turn's own row as 已停止 and offers no way
 * back, so resuming means typing "continue" into the composer by hand. This
 * module owns the two facts such an affordance needs and nothing else: where it
 * sits, and when it is honest to show it. Rendering lives in the component slice.
 *
 * Kept free of React and of host types on purpose. The decision is the part
 * worth asserting on its own, and a plain structural input lets the component
 * pass whatever the projection hands it without importing the projection.
 */

/** The user message the button sends. One spelling, so the copy cannot drift. */
export const CONTINUE_MESSAGE = "continue";

/** The turn tail slot: one row under the last turn, where the stop notice lands. */
export const CONTINUE_SLOT = "conversation.chat.turnTail";

/**
 * Slot entry id.
 *
 * Distinct from the cost meter's `cost-meter-turn` because both are mounted in
 * the same slot; a shared id would have one silently replace the other.
 */
export const CONTINUE_ID = "better-continue";

/** Order within the slot, after the cost meter at 10. */
export const CONTINUE_ORDER = 20;

/**
 * The turn-end reasons the host itself paints as 已停止.
 *
 * `aborted` is a live turn the harness cancelled: the user's stop, a parent
 * session or hook cancelling it, or the host disposing the session before the
 * turn finished. `interrupted` is a turn the DSH process never closed and
 * recovery appended a closer for afterwards. The host's turn-process row labels
 * exactly those two 已停止 (`aborted || interrupted`) and nothing else, so this
 * set is that same decision read from the outside.
 */
const STOPPED_REASON_KINDS: ReadonlySet<string> = new Set(["aborted", "interrupted"]);

/**
 * What the decision reads.
 *
 * `end` is the turn's closing event, and its absence is meaningful rather than
 * a gap: a turn still running has no end, and offering to continue it would
 * queue a message behind work that is already happening.
 */
export interface ContinueOfferInput {
  /**
   * 本轮收尾事件的数据；undefined 表示这一轮还没收尾（仍在跑）。
   *
   * `aborted` 的收尾在 `reason.reason` 里还带一层取消原因
   * （`user` / `parent` / `hook` / `disposed` / `legacy`）。这里把它建模出来只是
   * 为了让调用方可以原样转交宿主给的值，判定刻意不读它：宿主画「已停止」时也
   * 不区分这些原因。
   */
  readonly end:
    | {
        readonly reason?:
          | {
              readonly kind?: string;
              readonly reason?: { readonly kind?: string } | undefined;
            }
          | undefined;
      }
    | undefined;
  /** 这一轮是否是当前对话的最后一轮。 */
  readonly latest: boolean;
  /**
   * 当前是否还有未落定的用户提交。
   *
   * 包含宿主已接受的待处理提交（0.2.2 在**接受之后**才发布）与仍在发送窗口
   * 里的那一次（由 composer 的 phase 判定），两者都不该再给「继续」。
   */
  readonly pending: boolean;
}

/**
 * Whether the turn tail should offer to continue.
 *
 * Three conditions, all required:
 *
 * - the turn ended with a reason the host paints as 已停止 (`aborted` or
 *   `interrupted`), which is the same test the host uses for that row, so the
 *   button and the row can never disagree;
 * - it is the last turn, because continuing an older one would append to a
 *   conversation the user has already moved past;
 * - nothing is pending, because a submission being sent or queued means the user
 *   has already answered the stop themselves.
 *
 * Any other reason (`completed`, `blocked`, `error`, `max-tokens`, `forked`) is
 * a turn that reached its own conclusion. Continuing those is a new request, not
 * a resume, and guessing at it would put a button on every finished turn.
 * @param input - the turn's closing state and the conversation's position.
 * @returns true only when all three conditions hold.
 */
export function shouldOfferContinue(input: ContinueOfferInput): boolean {
  const kind = input.end?.reason?.kind;
  if (kind === undefined || !STOPPED_REASON_KINDS.has(kind)) return false;
  return input.latest && !input.pending;
}
