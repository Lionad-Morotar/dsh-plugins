/**
 * The continue button under an interrupted turn.
 *
 * A turn the user stopped leaves the conversation in a state the shell has no
 * affordance for: it paints 任务已停止 and offers no way back, so resuming means
 * typing "continue" into the composer by hand. This is that affordance, and the
 * decision behind it lives in `continue-turn.ts` so it can be asserted without a
 * renderer.
 *
 * Everything it needs arrives as a prop rather than through an import. The slot
 * hands a turn-tail entry the owner's position value plus the standard kit, and
 * reading the host's real hooks here would make this component untestable and
 * would couple it to a package it does not depend on. A missing prop is therefore
 * a normal state, not a bug: the host may not offer that seam at all, and a row
 * that disappears is better than a row that throws.
 */
import { useState, type ReactNode } from "react";

import { shouldOfferContinue } from "./continue-turn.ts";
import { CONTINUE_BUTTON_CLASS, CONTINUE_ERROR_CLASS } from "./continue-styles.ts";

/** The slot entry's translator, bound to this package's namespace. */
export type ContinueTranslate = (key: string, params?: Record<string, unknown>) => string;

/** The owner's position value for one turn, as the slot passes it. */
export interface ContinueTurnLike {
  /** The turn number this row belongs to. */
  readonly turn: number;
  /** The turn's closing event, absent while the turn is still running. */
  readonly end?: { readonly data?: { readonly reason?: { readonly kind?: string } } } | undefined;
}

/**
 * The chat snapshot this component reads.
 *
 * Only the turn order is needed: "is this the last turn" is a question about the
 * conversation, and the turn's own prop cannot answer it, because a stale row can
 * outlive its position.
 */
export interface ContinueChatSnapshotLike {
  readonly timeline: { readonly turnOrder: readonly number[] };
}

/** The session snapshot this component reads: anything still unsettled. */
export interface ContinueSessionSnapshotLike {
  readonly pendingSubmissions?: readonly unknown[];
}

/** Everything the slot hands this entry that it reads. */
export interface ContinueButtonProps {
  /** 层主给的 owner prop：本轮位置值，含 `.turn`（轮次号）与 `.end`（收尾事件）。 */
  readonly turn?: ContinueTurnLike | undefined;
  /** 标准套件注入：当前会话 id。 */
  readonly sessionId?: string | undefined;
  /** 标准套件注入：层主的 chat 快照选择器。 */
  readonly useChat?: ((select: (snapshot: ContinueChatSnapshotLike) => unknown) => unknown) | undefined;
  /** 标准套件注入：会话快照选择器，用来读未落定的提交。 */
  readonly useSession?: ((select: (snapshot: ContinueSessionSnapshotLike) => unknown) => unknown) | undefined;
  /** 标准套件注入：本包命名空间的翻译函数。 */
  readonly t?: ContinueTranslate | undefined;
  /** 注册时 inject 进来的发送动作；缺失时按钮不渲染。 */
  readonly submitContinue?: ((sessionId: string) => Promise<void>) | undefined;
}

/**
 * The text of a failed send.
 *
 * Anything can be thrown, and a rejection with no message would otherwise render
 * an empty alert that reads as a layout bug rather than a failure.
 * @param error - whatever the send rejected with.
 * @returns the message to show.
 */
export function continueFailureText(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

/**
 * Whether the given turn is the conversation's last.
 *
 * The turn order is the authority, not the row's own number: a row can be
 * re-rendered after the conversation moved on, and offering to continue a turn
 * the user has already scrolled past would append to the wrong place.
 * @param turnOrder - the timeline's turn numbers, oldest first.
 * @param turn - the turn this row belongs to.
 * @returns true when the row is the last turn in the timeline.
 */
function isLatestTurn(turnOrder: readonly number[], turn: number): boolean {
  return turnOrder.length > 0 && turnOrder[turnOrder.length - 1] === turn;
}

/**
 * Read one snapshot without a host hook, for hosts that hand none.
 * @returns always undefined.
 */
function noSnapshot(): undefined {
  return undefined;
}

/**
 * The turn-tail entry.
 *
 * Both selectors are called before any early return. React requires the same
 * hooks in the same order on every render, and this component returns null for
 * most of the states it can be in, so a conditional call would break the moment
 * the host's state changed between two renders of the same row.
 * @param props - the turn's position, the injected kit, and the send action.
 * @returns the button, or null when continuing is not on offer.
 */
export function ContinueButton({
  turn,
  sessionId,
  useChat,
  useSession,
  t,
  submitContinue,
}: ContinueButtonProps): ReactNode {
  const readChat = useChat ?? noSnapshot;
  const readSession = useSession ?? noSnapshot;
  const chat = readChat(select => select) as ContinueChatSnapshotLike | undefined;
  const session = readSession(select => select) as ContinueSessionSnapshotLike | undefined;

  const [sending, setSending] = useState(false);
  const [failure, setFailure] = useState<string | null>(null);

  const latest = turn !== undefined && isLatestTurn(chat?.timeline.turnOrder ?? [], turn.turn);
  const pending = (session?.pendingSubmissions?.length ?? 0) > 0;

  if (turn === undefined || sessionId === undefined || submitContinue === undefined || t === undefined) return null;
  if (!shouldOfferContinue({ end: turn.end?.data, latest, pending })) return null;

  const send = (): void => {
    setSending(true);
    setFailure(null);
    void submitContinue(sessionId).catch((error: unknown) => {
      // The button comes back so the user can retry; staying disabled after a
      // failure would leave the row permanently inert with no way to recover.
      setSending(false);
      setFailure(continueFailureText(error));
    });
  };

  return (
    <>
      <button
        type="button"
        className={CONTINUE_BUTTON_CLASS}
        data-testid="better-continue"
        disabled={sending}
        onClick={send}
      >
        {sending ? t("continue.sending") : t("continue.label")}
      </button>
      {failure === null ? null : (
        <span className={CONTINUE_ERROR_CLASS} role="alert">
          {failure}
        </span>
      )}
    </>
  );
}
