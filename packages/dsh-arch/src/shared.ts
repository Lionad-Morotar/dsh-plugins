/**
 * Values both halves of the package agree on.
 *
 * The wire shapes live here (not in `host/`) because the client half will
 * consume the same JSON in S2/S3; keeping them beside the constants prevents
 * the two halves from drifting apart before the client exists.
 */

/** Loader row name; must match `package.json#name` and the patch row id. */
export const PACKAGE_NAME = "dsh-arch";

/** Host slot the architecture view registers into, beside files and Git. */
export const VIEW_SLOT = "conversation.view";

/** Cell id inside that list slot. */
export const VIEW_ID = "arch";

/** Tab order in the conversation view row; chat stays at 0, files 100, Git 110. */
export const VIEW_ORDER = 120;

/**
 * HTTP route prefix handed to `webServer.register({ kind: "prefix", ... })`.
 *
 * Same-origin relative only: the GUI port changes on every host boot
 * (observed 3080 / 5454 / 5461 / 53275 across sessions), so an absolute URL is
 * uncacheable by construction and never appears in this package.
 */
export const ROUTE_PREFIX = "/arch/api";

/**
 * Lazy client chunk name for the SVG renderer; the S2/S3 slices emit the file.
 * Declared here so the host half, the build script and the future client entry
 * share one spelling from day one.
 */
export const DIAGRAM_CHUNK = "client.diagram.js";

/**
 * The canonical C4 directory a flow-dx `c4-mapper` run produces. Probed first
 * so a normal workspace never pays for the bounded walk; the walk only runs
 * when this probe misses (config-less workspaces are legal, see the research
 * note: `fromWorkspace` lays out fine without a config).
 */
export const CANONICAL_C4_DIR_SEGMENTS = [".planning", "c4"] as const;

/** Config file name shared by the canonical probe and the bounded walk. */
export const CONFIG_BASENAME = "likec4.config.json";

/** Bounded-walk parameters; see `host/discover.ts` for the traversal order. */
export const DISCOVER_MAX_DEPTH = 4;
export const DISCOVER_MAX_HITS = 8;
export const DISCOVER_SKIP_DIRS: readonly string[] = [
  "node_modules",
  "dist",
  ".git",
  "refs",
  "zRefs",
  "temp",
];

/** One parse diagnostic from the LikeC4 workspace, trimmed for the wire. */
export interface WireDiagnostic {
  readonly message: string;
  readonly sourcePath: string;
}

/** Body of `GET /arch/api/views`: every layouted view of one workspace. */
export interface WireViewsResponse {
  readonly workspace: string;
  readonly projectId: string;
  readonly views: readonly unknown[];
  readonly hasErrors: boolean;
  readonly errors: readonly WireDiagnostic[];
}

/**
 * Body of `GET /arch/api/model`: the element catalogue for the details pane.
 *
 * `elements`/`relations` stay in the dump's Record shape (`LikeC4Model.$data`)
 * because the pane looks elements up by id, never iterates in bulk.
 */
export interface WireModelResponse {
  readonly workspace: string;
  readonly projectId: string;
  readonly elements: Readonly<Record<string, unknown>>;
  readonly relations: Readonly<Record<string, unknown>>;
  readonly specification: unknown;
  /**
   * Where each element is declared in the model sources.
   *
   * Optional because a host that cannot read the AST omits it: absent means
   * "not reported", which the client must not render as "no element has a
   * definition".
   */
  readonly elementSources?: Readonly<Record<string, { readonly file: string; readonly line: number }>>;
  /**
   * The code file each element maps to, when the title→path convention
   * resolves one. Absent keys are elements with no resolvable code.
   */
  readonly elementCode?: Readonly<Record<string, { readonly file: string }>>;
}

/**
 * Manual layout correction for one node, relative to the coordinates the node
 * had when the offset was recorded.
 *
 * `baseX`/`baseY` are the invalidation baseline: a node whose current layout
 * drifted too far from them belongs to a different layout generation, and the
 * reader must drop the offset instead of stacking it on an unrelated position.
 */
export interface ArchNodeOffset {
  readonly dx: number;
  readonly dy: number;
  readonly baseX: number;
  readonly baseY: number;
}

export interface ArchViewport {
  readonly scale: number;
  readonly tx: number;
  readonly ty: number;
}

/**
 * Per-workspace UI state persisted under the workspace realpath.
 *
 * Deliberately not a full `LayoutedView` snapshot: a snapshot freezes the view
 * content with no model-hash guard (a stale `.likec4.snap` hides new elements
 * while reporting the old hash — verified in the research), whereas offsets are
 * the user's correction intent, decoupled from any one model revision.
 */
export interface ArchWorkspaceState {
  readonly viewId: string;
  readonly viewport: ArchViewport;
  /** Layout-source hash; diagnostics and cache key only, never a validity guard. */
  readonly viewHash: string;
  readonly offsets: Readonly<Record<string, Readonly<Record<string, ArchNodeOffset>>>>;
  readonly updatedAt: string;
}

/**
 * State read: `state` is null when nothing is saved and `degraded` is true when
 * host persistence is unavailable — two different "nothing to restore" the
 * client half must not conflate (degraded means: keep saving to localStorage).
 */
export interface WireStateGetResponse {
  readonly state: ArchWorkspaceState | null;
  readonly degraded: boolean;
}

export interface WireStatePutResponse {
  readonly ok: boolean;
  readonly degraded: boolean;
}
