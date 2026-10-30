/**
 * Turn one host terminal state into the line the dock shows.
 *
 * The host reports a phase, a writability flag and a failure issue; the dock owes
 * the reader a sentence and an affordance. Keeping that mapping pure means the
 * three error states the slice promises (limit reached, read-only, process gone)
 * are testable without a browser or a PTY.
 */
import type { Translate } from "./copy.ts";
import type { TerminalViewState } from "./binding.ts";

/** How loud the status line is. */
export type StatusTone = "info" | "warn" | "error";

/** What the dock should render for one panel. */
export interface TerminalStatus {
  /** Sentence to show, or undefined when the panel speaks for itself. */
  readonly label?: string;
  readonly tone: StatusTone;
  /** Input must be disabled and the hint shown. */
  readonly readOnly: boolean;
  /** The process will not come back on its own. */
  readonly ended: boolean;
  /** A host refresh can rebuild this panel; the dock offers a retry button. */
  readonly retryable: boolean;
}

/**
 * Describe one view state.
 * @param state - the host view snapshot.
 * @param t - this package's translate seat.
 * @returns the status line and the input policy.
 */
export function describeTerminal(state: TerminalViewState, t: Translate): TerminalStatus {
  const ended = state.phase === "closed" || state.info?.state === "exited" || state.info?.state === "failed";
  const running = state.info?.state === "running";
  const readOnly = state.phase === "connected" && running && state.writable === false;
  // The host's own sentence is the only thing that says *why* a panel is dead
  // (unavailable terminal, spawn failure, limit). Dropping it left the reader
  // with "process gone" and no next step, so it rides along in parentheses.
  const reason = typeof state.error === "string" && state.error !== "" ? `（${state.error}）` : "";

  if (state.issue === "terminalLimit") return { label: t("dock.limitReached"), tone: "error", readOnly, ended, retryable: false };
  if (state.issue === "missingTerminal") {
    return { label: `${t("dock.missing")}${reason}`, tone: "error", readOnly, ended, retryable: true };
  }
  if (state.issue === "inputFull") return { label: t("dock.failed"), tone: "error", readOnly, ended, retryable: false };
  if (state.phase === "failed" && state.error !== undefined) {
    return { label: state.error, tone: "error", readOnly, ended, retryable: true };
  }
  if (state.phase === "closed") return { label: t("dock.closed"), tone: "info", readOnly: false, ended, retryable: false };
  if (state.info?.state === "exited") {
    const code = state.info.exitCode === undefined ? "" : ` (${String(state.info.exitCode)})`;
    return { label: `${t("dock.exited")}${code}`, tone: "info", readOnly: false, ended, retryable: false };
  }
  if (state.info?.state === "failed") {
    const spawnReason = typeof state.info.error === "string" && state.info.error !== "" ? `（${state.info.error}）` : reason;
    return { label: `${t("dock.missing")}${spawnReason}`, tone: "error", readOnly: false, ended, retryable: true };
  }
  if (readOnly) return { label: t("dock.readOnly"), tone: "warn", readOnly, ended, retryable: false };
  if (state.phase === "idle" || state.phase === "loading") {
    return { label: t("dock.loading"), tone: "info", readOnly, ended, retryable: false };
  }
  if (state.phase === "creating") return { label: t("dock.creating"), tone: "info", readOnly, ended, retryable: false };
  if (state.phase === "connecting") return { label: t("dock.connecting"), tone: "info", readOnly, ended, retryable: false };
  if (state.phase === "disconnected") return { label: t("dock.disconnected"), tone: "warn", readOnly, ended, retryable: false };
  return { tone: "info", readOnly, ended, retryable: false };
}
