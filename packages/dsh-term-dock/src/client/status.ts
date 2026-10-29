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

  if (state.issue === "terminalLimit") return { label: t("dock.limitReached"), tone: "error", readOnly, ended };
  if (state.issue === "missingTerminal") return { label: t("dock.missing"), tone: "error", readOnly, ended };
  if (state.issue === "inputFull") return { label: t("dock.failed"), tone: "error", readOnly, ended };
  if (state.phase === "failed" && state.error !== undefined) {
    return { label: state.error, tone: "error", readOnly, ended };
  }
  if (state.phase === "closed") return { label: t("dock.closed"), tone: "info", readOnly: false, ended };
  if (state.info?.state === "exited") {
    const code = state.info.exitCode === undefined ? "" : ` (${String(state.info.exitCode)})`;
    return { label: `${t("dock.exited")}${code}`, tone: "info", readOnly: false, ended };
  }
  if (state.info?.state === "failed") return { label: t("dock.missing"), tone: "error", readOnly: false, ended };
  if (readOnly) return { label: t("dock.readOnly"), tone: "warn", readOnly, ended };
  if (state.phase === "idle" || state.phase === "loading") {
    return { label: t("dock.loading"), tone: "info", readOnly, ended };
  }
  if (state.phase === "creating") return { label: t("dock.creating"), tone: "info", readOnly, ended };
  if (state.phase === "connecting") return { label: t("dock.connecting"), tone: "info", readOnly, ended };
  if (state.phase === "disconnected") return { label: t("dock.disconnected"), tone: "warn", readOnly, ended };
  return { tone: "info", readOnly, ended };
}
