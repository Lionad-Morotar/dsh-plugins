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
 *
 * Viewports are keyed by view id for the same reason offsets are: the pan/zoom
 * a reader dialled in belongs to one diagram, and switching tabs must not carry
 * it onto another. `viewId` only names the tab that is selected.
 */
export interface ArchWorkspaceState {
  readonly viewId: string;
  readonly viewports: Readonly<Record<string, ArchViewport>>;
  /** Layout-source hash; diagnostics and cache key only, never a validity guard. */
  readonly viewHash: string;
  readonly offsets: Readonly<Record<string, Readonly<Record<string, ArchNodeOffset>>>>;
  readonly updatedAt: string;
}

/** One parsed viewport from a persisted state, or null when the value cannot be read. */
export function readArchViewport(raw: unknown): ArchViewport | null {
  if (typeof raw !== "object" || raw === null) return null;
  const candidate = raw as Record<string, unknown>;
  const { scale, tx, ty } = candidate;
  if (typeof scale !== "number" || typeof tx !== "number" || typeof ty !== "number") return null;
  if (!Number.isFinite(scale) || !Number.isFinite(tx) || !Number.isFinite(ty)) return null;
  return { scale, tx, ty };
}

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const isFiniteNumber = (value: unknown): value is number => typeof value === "number" && Number.isFinite(value);

/** One node correction from a persisted state, or null when any field is unusable. */
function readArchNodeOffset(raw: unknown): ArchNodeOffset | null {
  if (!isPlainObject(raw)) return null;
  const { dx, dy, baseX, baseY } = raw;
  if (!isFiniteNumber(dx) || !isFiniteNumber(dy) || !isFiniteNumber(baseX) || !isFiniteNumber(baseY)) return null;
  return { dx, dy, baseX, baseY };
}

/**
 * Normalize one persisted workspace state, accepting both the per-view shape
 * and the single-viewport shape written before viewports were cached per view.
 *
 * The legacy shape stored the viewport of whichever tab was selected under
 * `viewport`; it migrates to `viewports[viewId]`. Unreadable per-view entries
 * are dropped instead of rejecting the whole record: a broken viewport costs
 * one diagram its saved framing, while rejecting the record would also lose
 * every node offset in `offsets`.
 *
 * @param raw - whatever JSON came back from the host store or localStorage.
 * @returns the normalized state, or null when the record has no usable base.
 */
export function readArchWorkspaceState(raw: unknown): ArchWorkspaceState | null {
  if (!isPlainObject(raw)) return null;
  const viewId = typeof raw.viewId === "string" ? raw.viewId : null;
  if (viewId === null || !isPlainObject(raw.offsets)) return null;

  const viewports: Record<string, ArchViewport> = {};
  if (isPlainObject(raw.viewports)) {
    for (const [id, candidate] of Object.entries(raw.viewports)) {
      const viewport = readArchViewport(candidate);
      if (viewport !== null) viewports[id] = viewport;
    }
  } else {
    const legacy = readArchViewport(raw.viewport);
    if (legacy !== null && viewId !== "") viewports[viewId] = legacy;
  }

  // Corrections are filtered one by one: a single malformed offset must not
  // take the rest of the view's corrections, or the record itself, down with
  // it (the renderer reads offsets without a second shape check).
  const offsets: Record<string, Record<string, ArchNodeOffset>> = {};
  for (const [id, records] of Object.entries(raw.offsets)) {
    if (!isPlainObject(records)) continue;
    const kept: Record<string, ArchNodeOffset> = {};
    for (const [nodeId, candidate] of Object.entries(records)) {
      const offset = readArchNodeOffset(candidate);
      if (offset !== null) kept[nodeId] = offset;
    }
    offsets[id] = kept;
  }

  return {
    viewId,
    viewports,
    viewHash: typeof raw.viewHash === "string" ? raw.viewHash : "",
    offsets,
    updatedAt: typeof raw.updatedAt === "string" ? raw.updatedAt : new Date().toISOString(),
  };
}

/**
 * Which slices of one panel's state the reader changed since the last
 * successful write-back.
 *
 * A panel serializes the whole state it knows, but concurrent panels (another
 * session on the same workspace, or the dock panel beside the tab) each hold a
 * snapshot taken at their own mount. Writing that whole state back made the
 * last writer win and silently rolled the other panel's framing back, so only
 * the touched slices are published and the host merges them into what is
 * already stored.
 */
export interface ArchStateChanges {
  /** View ids whose viewport this panel moved. */
  readonly viewports: readonly string[];
  /** View ids whose node corrections this panel moved. */
  readonly offsetViews: readonly string[];
  /** Whether the reader picked another view; a mount-time default is not a pick. */
  readonly selection: boolean;
}

export const EMPTY_ARCH_STATE_CHANGES: ArchStateChanges = {
  viewports: [],
  offsetViews: [],
  selection: false,
};

/**
 * Merge the slices one panel touched into the state already stored.
 *
 * Only touched viewports and touched offset groups are replaced; every other
 * entry survives from `stored`. The selection follows the reader: when another
 * panel switched views it wins, when this one did not its stored selection
 * stays (so re-mounting a panel does not move the reader to another tab).
 *
 * @param stored - the normalized state currently persisted.
 * @param incoming - the writer's full view of the state (only touched slices count).
 * @param changes - the slices the writer actually changed.
 */
export function mergeArchWorkspaceState(
  stored: ArchWorkspaceState,
  incoming: ArchWorkspaceState,
  changes: ArchStateChanges,
): ArchWorkspaceState {
  const viewports = { ...stored.viewports };
  for (const id of changes.viewports) {
    const viewport = incoming.viewports[id];
    if (viewport !== undefined) viewports[id] = viewport;
  }
  const offsets = { ...stored.offsets };
  for (const id of changes.offsetViews) {
    const records = incoming.offsets[id];
    if (records !== undefined) offsets[id] = { ...records };
  }
  return {
    viewId: changes.selection ? incoming.viewId : stored.viewId,
    viewports,
    viewHash: incoming.viewHash,
    offsets,
    updatedAt: incoming.updatedAt,
  };
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
