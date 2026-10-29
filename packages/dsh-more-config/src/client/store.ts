/**
 * The panel's staging store over the shadow's configuration form.
 *
 * Everything the section renders, it renders from this store's snapshot; every
 * edit the user makes, it makes through the store's actions. The store holds no
 * DOM and no React, so the whole decision procedure (what a row shows, when the
 * form is dirty, what save writes, what a refusal leaves behind) is testable
 * against a fake scope.
 *
 * Writes are always one whole-array `set` op on the `mcpTimeouts` path, the
 * volatile field the settings pipeline accepts, carrying the revision the
 * snapshot was read at. Row semantics follow the shipped form model: empty text
 * clears, garbage text blocks save, a reset returns to the base layer and drops
 * rows the base never had.
 */
import { MIN_TIMEOUT_MS, toServerList, toShadowEntries, toTimeoutMap, type ServerEntry, type ShadowTimeouts } from "../shadow.ts";
import { TIMEOUTS_FIELD } from "./registration.ts";

/** The scope snapshot the settings service serves for one namespace. */
export interface ScopeSnapshot {
  readonly status: string;
  readonly writable: boolean;
  readonly value?: { readonly mcpTimeouts?: unknown; readonly mcpServers?: unknown };
  readonly base?: { readonly mcpTimeouts?: unknown };
  readonly user?: Record<string, unknown>;
  readonly revision?: number;
}

/** One settings path op, the wire shape `mutate` accepts. */
export interface MutateOp {
  readonly op: "set" | "unset";
  readonly path: readonly string[];
  readonly value?: unknown;
}

/** The configForms scope face this store reads and writes. */
export interface ScopeLike {
  getSnapshot(): ScopeSnapshot;
  subscribe(listener: () => void): () => void;
  mutate(ops: readonly MutateOp[], expectedRevision?: number): Promise<boolean> | boolean;
}

/** One row the panel renders. */
export interface TimeoutRowView {
  readonly id: string;
  /** The server's own name when the row is a live server; empty for a ghost. */
  readonly serverName: string;
  /** The timeout a shadow entry would want to know about: absent for an unset row. */
  readonly serverTimeoutMs: number | undefined;
  /** True when the shadow has a key for a server the host no longer lists. */
  readonly ghost: boolean;
  readonly text: string;
  readonly invalid: boolean;
  readonly overridden: boolean;
  readonly inBase: boolean;
}

/** The snapshot the section component subscribes to. */
export interface TimeoutsSnapshot {
  readonly status: string;
  readonly writable: boolean;
  readonly dirty: boolean;
  readonly invalid: boolean;
  readonly saving: boolean;
  readonly failed: boolean;
  readonly rows: readonly TimeoutRowView[];
}

/** One staged edit: the raw text plus whether the user asked for a reset. */
interface StagedRow {
  readonly text: string;
  readonly clear: boolean;
}

/** Parse staged text into a row action; undefined means garbage that blocks save. */
function parseTimeout(text: string): { kind: "set"; ms: number } | { kind: "clear" } | undefined {
  const trimmed = text.trim();
  if (trimmed === "") return { kind: "clear" };
  if (!/^\d+$/.test(trimmed)) return undefined;
  const ms = Number(trimmed);
  if (!Number.isSafeInteger(ms) || ms < MIN_TIMEOUT_MS) return undefined;
  return { kind: "set", ms };
}

/** Structural map equality, because save is skipped only on true no-ops. */
function sameMaps(left: ShadowTimeouts, right: ShadowTimeouts): boolean {
  const leftKeys = Object.keys(left);
  if (leftKeys.length !== Object.keys(right).length) return false;
  return leftKeys.every(key => left[key] === right[key]);
}

/** What save would write, and whether anything blocks it. */
function planWrite(live: ShadowTimeouts, staged: ReadonlyMap<string, StagedRow>): { ops: readonly MutateOp[]; invalid: boolean } {
  const next: ShadowTimeouts = { ...live };
  let invalid = false;
  for (const [id, row] of staged) {
    const parsed = row.clear ? ({ kind: "clear" } as const) : parseTimeout(row.text);
    if (parsed === undefined) {
      invalid = true;
      continue;
    }
    if (parsed.kind === "set") next[id] = parsed.ms;
    else delete next[id];
  }
  const ops = sameMaps(next, live) ? [] : [{ op: "set", path: [TIMEOUTS_FIELD], value: toShadowEntries(next) } as const];
  return { ops, invalid };
}

/**
 * Build the store. A missing scope (service absent, namespace not served)
 * reports unavailable and refuses every write, so the section can render the
 * honest banner instead of half a form.
 */
export function createTimeoutsStore(scope: ScopeLike | undefined) {
  const staged = new Map<string, StagedRow>();
  const listeners = new Set<() => void>();
  let saving = false;
  let failed = false;
  let offScope: (() => void) | undefined;

  // The snapshot is derived, but a store consumed by useSyncExternalStore must
  // return one stable reference until state actually moves: React's post-commit
  // consistency check re-calls getSnapshot and Object.is-compares it, and a
  // fresh literal every call turns that check into an infinite re-render. The
  // version counter is the invalidation key: every path that can change what
  // the snapshot would say bumps it, so the derivation below runs only between
  // states, never between two calls in the same state.
  let version = 0;
  let cache: { readonly version: number; readonly snapshot: TimeoutsSnapshot } | undefined;

  const derive = (): TimeoutsSnapshot => {
    const snap = scope?.getSnapshot();
    const live = toTimeoutMap(snap?.value?.mcpTimeouts);
    const base = toTimeoutMap(snap?.base?.mcpTimeouts);
    const user = toTimeoutMap((snap?.user as { mcpTimeouts?: unknown } | undefined)?.mcpTimeouts);
    // The host projects the live server list into the same namespace; the panel
    // renders it as the row skeleton and marks shadow keys without a server as
    // ghosts instead of pretending they still point at something.
    const servers = toServerList(snap?.value?.mcpServers);
    const serverOf = new Map<string, ServerEntry>(servers.map(server => [server.id, server]));
    const rowIds = [...servers.map(server => server.id)];
    for (const id of Object.keys(live)) if (!rowIds.includes(id)) rowIds.push(id);
    for (const id of staged.keys()) if (!rowIds.includes(id)) rowIds.push(id);
    const rows: TimeoutRowView[] = rowIds.map(id => {
      const row = staged.get(id);
      const server = serverOf.get(id);
      const text = row === undefined ? String(live[id] ?? "") : row.text;
      const invalid = row !== undefined && !row.clear && parseTimeout(row.text) === undefined;
      return {
        id,
        serverName: server?.serverName ?? "",
        serverTimeoutMs: server?.timeoutMs,
        ghost: server === undefined,
        text,
        invalid,
        overridden: Object.hasOwn(user, id),
        inBase: Object.hasOwn(base, id),
      };
    });
    const { ops, invalid } = planWrite(live, staged);
    return {
      status: snap?.status ?? "unavailable",
      writable: snap?.writable ?? false,
      dirty: ops.length > 0,
      invalid,
      saving,
      failed,
      rows,
    };
  };

  const snapshot = (): TimeoutsSnapshot => {
    if (cache === undefined || cache.version !== version) {
      cache = { version, snapshot: derive() };
    }
    return cache.snapshot;
  };

  const publish = () => {
    version += 1;
    for (const listener of listeners) listener();
  };

  // A scope change moves state too, even when nothing local staged: the mirror
  // pushes new values (another surface saved) and the panel must follow.
  if (scope !== undefined) offScope = scope.subscribe(publish);

  return {
    getSnapshot: snapshot,
    subscribe(listener: () => void): () => void {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    /** Stage one row's text edit. */
    editRow(id: string, text: string): void {
      staged.set(id, { text, clear: false });
      failed = false;
      publish();
    },
    /** Return one row to the base layer, clearing rows the base never had. */
    resetRow(id: string): void {
      const base = toTimeoutMap(scope?.getSnapshot().base?.mcpTimeouts);
      staged.set(id, Object.hasOwn(base, id) ? { text: String(base[id]), clear: false } : { text: "", clear: true });
      failed = false;
      publish();
    },
    /** Stage a new empty row; empty or duplicate ids are ignored. */
    addRow(id: string): void {
      const trimmed = id.trim();
      if (trimmed === "" || staged.has(trimmed)) return;
      const live = toTimeoutMap(scope?.getSnapshot().value?.mcpTimeouts);
      if (Object.hasOwn(live, trimmed)) return;
      staged.set(trimmed, { text: "", clear: true });
      failed = false;
      publish();
    },
    /** One whole-array write of the planned entries, revision-guarded. */
    async save(): Promise<void> {
      if (scope === undefined) return;
      const snap = scope.getSnapshot();
      const live = toTimeoutMap(snap.value?.mcpTimeouts);
      const { ops, invalid } = planWrite(live, staged);
      if (ops.length === 0 || invalid || saving) return;
      if (!snap.writable || snap.status !== "ready") return;
      // The await below is a real round trip: the user can keep editing while
      // it is in flight. Prune by reference on success, so exactly the rows
      // this save planned are cleared and any edit staged during the flight
      // survives instead of being silently dropped.
      const planned = new Map(staged);
      saving = true;
      publish();
      let accepted = false;
      try {
        accepted = await scope.mutate(ops, snap.revision);
      } catch {
        accepted = false;
      }
      if (accepted) {
        for (const [id, row] of planned) {
          if (staged.get(id) === row) staged.delete(id);
        }
      }
      failed = !accepted;
      saving = false;
      publish();
    },
    /** Drop all staging and the failure flag. */
    discard(): void {
      staged.clear();
      failed = false;
      publish();
    },
    /** Release the scope subscription. */
    dispose(): void {
      offScope?.();
      offScope = undefined;
      listeners.clear();
    },
  };
}

export type TimeoutsStore = ReturnType<typeof createTimeoutsStore>;
