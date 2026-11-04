/**
 * The "continue this turn" offer: its identity and the one decision behind it.
 *
 * A turn that the user stopped leaves the conversation in a state the shell has
 * no affordance for. The host marks it (任务已停止) but offers no way back, so
 * resuming means typing "continue" into the composer by hand. This module owns
 * the two facts such an affordance needs and nothing else: where it sits, and
 * when it is honest to show it. Rendering lives in the component slice.
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
 * What the decision reads.
 *
 * `end` is the turn's closing event, and its absence is meaningful rather than
 * a gap: a turn still running has no end, and offering to continue it would
 * queue a message behind work that is already happening.
 */
export interface ContinueOfferInput {
  /** 本轮收尾事件的数据；undefined 表示这一轮还没收尾（仍在跑）。 */
  readonly end: { readonly reason?: { readonly kind?: string } } | undefined;
  /** 这一轮是否是当前对话的最后一轮。 */
  readonly latest: boolean;
  /** 当前是否还有未落定的用户提交（正在发送/排队）。 */
  readonly pending: boolean;
}

/**
 * Whether the turn tail should offer to continue.
 *
 * Three conditions, all required:
 *
 * - the turn ended with `reason.kind === "interrupted"`, which is the same test
 *   the host uses to paint its stop notice, so the button and the notice can
 *   never disagree;
 * - it is the last turn, because continuing an older one would append to a
 *   conversation the user has already moved past;
 * - nothing is pending, because a queued submission means the user has already
 *   answered the stop themselves.
 *
 * Any other reason (`stop`, `error`, `aborted`) is a turn that reached its own
 * conclusion. Continuing those is a new request, not a resume, and guessing at
 * it would put a button on every finished turn.
 * @param input - the turn's closing state and the conversation's position.
 * @returns true only when all three conditions hold.
 */
export function shouldOfferContinue(input: ContinueOfferInput): boolean {
  if (input.end?.reason?.kind !== "interrupted") return false;
  return input.latest && !input.pending;
}
