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
 * Lazy client chunk carrying the board's data snapshot.
 *
 * Declared here so the loader, the build script and the chunk's own registration
 * share one spelling: the loader fetches this file name, the build emits it, and
 * a mismatch is a tab that never loads its data.
 */
export const SNAPSHOT_CHUNK = "client.snapshot.js";

/**
 * Lazy client chunk carrying every test file's source text.
 *
 * Separate from the snapshot chunk on purpose: the row list renders from the
 * snapshot alone, so the code pane's megabytes are only paid for by a reader who
 * opens a file, and a failed fetch of one chunk leaves the other usable.
 */
export const SOURCES_CHUNK = "client.sources.js";

/**
 * Lazy client chunk carrying CodeMirror and the highlighted code view.
 *
 * The editor is hundreds of kilobytes of this package's browser half and only
 * matters once a reader selects a file, so it is fetched on first selection and
 * never folded into the startup bundle.
 */
export const EDITOR_CHUNK = "client.editor.js";

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
 * The board's view of one run.
 *
 * `completedFiles` is best-effort: the json reporter only speaks at the end, so
 * the count comes from the default reporter's stdout and may lag or stay at
 * zero. It is progress decoration, never the result.
 */
export interface RunProgress {
  readonly runId: string;
  readonly scope: RunScope;
  readonly status: RunStatus;
  readonly startedAt: string;
  readonly finishedAt?: string;
  readonly completedFiles: number;
  /** Null when the scope is "all": nobody knows the file count up front. */
  readonly totalFiles: number | null;
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
