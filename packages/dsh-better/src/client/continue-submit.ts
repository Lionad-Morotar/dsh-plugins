/**
 * The send action behind the continue button.
 *
 * Separate from `entry.ts` for one reason: the entry is the wiring, and wiring is
 * the part that cannot be asserted. This function is the whole of the behaviour
 * the button triggers, so it lives where a test can hand it a fake host and pin
 * the message shape and the send mode.
 *
 * The session object belongs to the host. Its `prompt` is the host's own
 * submission path, its methods read state off `this`, and what it returns is not
 * this package's to decide, so everything below is a guard rather than an
 * assumption.
 */
import { CONTINUE_MESSAGE } from "./continue-turn.ts";

/** The session face this action needs; the host defines the rest. */
export interface ContinueSessionLike {
  readonly prompt?: unknown;
}

/** The session binding the host answers for one id. */
export interface ContinueBindingLike {
  readonly session?: unknown;
}

/** The context slice this action reads. */
export interface ContinueSubmitContextLike {
  readonly sessions?: {
    binding?(sessionId: string): ContinueBindingLike | undefined;
  };
}

/** The shape a host may return to say it refused the message. */
function refused(result: unknown): boolean {
  return typeof result === "object" && result !== null && "ok" in result && (result as { ok?: unknown }).ok === false;
}

/**
 * Send the continue message into one session.
 *
 * `queue` rather than an interrupting mode: the button exists because the user
 * stopped a turn, and the one thing they must not get is a second interruption on
 * top of the first. Queueing also means a message sent while the host is still
 * settling is delivered rather than dropped.
 *
 * Every failure is a rejection, never a synchronous throw: the caller awaits this
 * inside a click handler, and a throw before the first await would escape the
 * promise chain that turns it into the row's error text.
 * @param ctx - client context carrying the session service.
 * @param sessionId - session to send into.
 * @returns a promise settling when the host accepted the message.
 */
export async function submitContinue(ctx: ContinueSubmitContextLike, sessionId: string): Promise<void> {
  const session = ctx.sessions?.binding?.(sessionId)?.session as ContinueSessionLike | undefined;
  const prompt = session?.prompt;
  if (typeof prompt !== "function") throw new Error("这个宿主的会话不支持发送消息");
  const result: unknown = await (prompt as (...args: unknown[]) => unknown).call(
    session,
    [{ type: "text", text: CONTINUE_MESSAGE }],
    "queue",
  );
  if (refused(result)) throw new Error("继续消息没有被宿主接受");
}
