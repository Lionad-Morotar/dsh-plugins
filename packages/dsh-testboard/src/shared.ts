/**
 * Values both halves of the package agree on.
 *
 * The view identity lives here rather than in the client entry because the
 * build script and the tests assert the same three literals, and a second
 * spelling of any of them is a tab that silently never appears.
 */
import type { TestSnapshot } from "./client/model.ts";

/** Loader row name; must match `package.json#name` and the patch row id. */
export const PACKAGE_NAME = "dsh-testboard";

/** Host slot the test board view registers into, beside files and Git. */
export const VIEW_SLOT = "conversation.view";

/** Cell id inside that list slot. */
export const VIEW_ID = "testboard";

/** Tab order in the conversation view row; files 100, Git 110, arch 120. */
export const VIEW_ORDER = 130;

/** Locale namespace owned by the client half. */
export const LOCALE_NAMESPACE = "testboard";

/**
 * Lazy client chunk carrying CodeMirror and the highlighted code view.
 *
 * The only chunk this package still ships. The board reads its data from the
 * host's routes now, so the snapshot and source bundles are no longer fetched
 * into the browser at all; the editor stays lazy because it is hundreds of
 * kilobytes and only matters once a reader selects a file.
 *
 * Declared here so the loader and the build script share one spelling: the
 * loader fetches this file name, the build emits it, and a mismatch is a tab
 * whose code pane never loads.
 */
export const EDITOR_CHUNK = "client.editor.js";

/**
 * The `require` the ModuleLoader factory hands to a client bundle.
 *
 * Lives here rather than beside a loader because the editor loader is the only
 * consumer left, and a type shared by the entry and the loader does not belong
 * in either of them.
 */
export interface LoaderRequire {
  (specifier: string): unknown;
  /** Fetch a package-local chunk; the specifier must be `./<file>`. */
  async(specifier: string): Promise<unknown>;
}

/**
 * Prefix the host half registers and the client half fetches under.
 *
 * Relative on purpose: the GUI port changes on every host boot, so a composed
 * absolute URL would be stale by the time a tab reads it.
 */
export const ROUTE_PREFIX = "/testboard/api";

/**
 * What one run covers.
 *
 * File granularity only: a single case is a different feature (it needs a name
 * filter the reporter does not offer) and the board's own row is a file.
 */
export type RunScope = { readonly kind: "all" } | { readonly kind: "file"; readonly path: string };

/** Where one run is in its life. */
export type RunStatus = "running" | "passed" | "failed" | "cancelled" | "error";

/**
 * The coarse phase the board narrates.
 *
 * Separate from `status` on purpose: `status` answers "did the suite pass", and
 * `phase` answers "is the process still going". A finished run with failures is
 * `phase: "finished"` and `status: "failed"`, which is what lets the panel say
 * "N failing tests" instead of implying the run itself broke.
 */
export type RunPhase = "running" | "finished" | "cancelled" | "error";

/** One case that finished, in completion order. */
export interface RunCaseEvent {
  /** Workspace-relative test file path. */
  readonly path: string;
  /** The case's own title, without its describe chain. */
  readonly name: string;
  readonly status: "passed" | "failed" | "skipped";
  readonly durationMs: number;
  /** Milliseconds since the run started, which is what places it on the chart. */
  readonly atMs: number;
}

/** One second of the run: what had finished by then. */
export interface RunSeriesPoint {
  /** Milliseconds since the run started, on a one-second grid. */
  readonly tMs: number;
  /** Cumulative cases finished by this second. */
  readonly finished: number;
  readonly passed: number;
  readonly failed: number;
}

/** One failing case, with the moment it failed. */
export interface RunFailure {
  readonly tMs: number;
  readonly path: string;
  readonly name: string;
}

/** The run's tallies, as far as they are known. */
export interface RunCounts {
  readonly passed: number;
  readonly failed: number;
  readonly skipped: number;
  readonly total: number;
}

/**
 * The board's view of one run.
 *
 * `completedFiles` is best-effort: the json reporter only speaks at the end, so
 * the count comes from the verbose reporter's per-case lines and may lag. It is
 * progress decoration, never the result.
 *
 * `cases` is the incremental half: every case that finished, appended in
 * completion order, so a polling client can light rows up while the suite is
 * still running. The json report replaces the snapshot at the end and is
 * authoritative; these events are what the board shows until then.
 */
export interface RunProgress {
  readonly runId: string;
  readonly scope: RunScope;
  readonly status: RunStatus;
  readonly phase: RunPhase;
  /** 1-based, per workspace: the board labels a rerun with it. */
  readonly runNumber: number;
  readonly startedAt: string;
  readonly finishedAt?: string;
  /** Wall clock since the run started, or the final duration once it settled. */
  readonly elapsedMs: number;
  readonly completedFiles: number;
  /** Null when the scope is "all": nobody knows the file count up front. */
  readonly totalFiles: number | null;
  readonly counts: RunCounts;
  /** One point per second that has elapsed, cumulative. */
  readonly series: readonly RunSeriesPoint[];
  readonly failures: readonly RunFailure[];
  readonly cases: readonly RunCaseEvent[];
  readonly message?: string;
}

/**
 * Every reason the board can be empty or refuse an action.
 *
 * These are wire values, not prose: the client maps each to its own copy, so a
 * new string here without a matching translation is a blank panel.
 */
export type TestboardError =
  | "no-session"
  | "unknown-workspace"
  | "no-vitest"
  | "no-subprocess"
  | "busy"
  | "bad-scope"
  | "run-failed";

/**
 * The preview demo's own stage.
 *
 * Deliberately outside `RunProgress`: `fixing` is a stage the host cannot
 * produce (D18 — it has no agent repair events), so it must not be a run phase
 * the real half could ever claim. Only the fixture runtime fills this in, and
 * only the preview renders it.
 */
export interface DemoStage {
  readonly phase: "running" | "fixing" | "rerunning" | "finished";
  /** The file the fixing card names. */
  readonly path?: string;
  /** The model the fixing card names. */
  readonly model?: string;
  /** How long the fix has been going, for the card's own reading. */
  readonly seconds?: number;
}

/**
 * One workspace's board state.
 *
 * `error` and `snapshot` coexist on purpose: a workspace whose last run failed
 * still shows the previous result, with the error explaining why it is stale.
 */
export interface TestboardState {
  readonly workspace?: string;
  readonly workspaceName?: string;
  readonly snapshot?: TestSnapshot;
  readonly run?: RunProgress;
  readonly error?: TestboardError;
  /** Present only on the preview's fixture runtime; never sent by the host. */
  readonly demo?: DemoStage;
}

/** `POST /run` answer: an accepted run, or the reason it was refused. */
export type WireRunStartResponse =
  | { readonly ok: true; readonly runId: string }
  | { readonly ok: false; readonly error: TestboardError };

/** `POST /cancel` answer; false means nothing was running. */
export interface WireCancelResponse {
  readonly ok: boolean;
}

/** `GET /source` answer: one file's text, workspace-relative path. */
export interface WireSourceResponse {
  readonly text: string;
}

/**
 * Cap for one source read.
 *
 * A test file is kilobytes; the ceiling exists so a stray binary or a generated
 * fixture cannot pull a hundred megabytes through a JSON response.
 */
export const MAX_SOURCE_BYTES = 2 * 1024 * 1024;
