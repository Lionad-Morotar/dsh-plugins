/**
 * Document sessions: one editable draft per (session, path), owned by the
 * explorer's client service so every renderer plugin sees the same text.
 *
 * The store is deliberately DOM-free and transport-free: the client entry
 * injects `open` and `save`. What it owns is the part that must not be
 * re-invented per renderer: identity, reference counting, the saved baseline,
 * and the two rules that make a shared draft safe — an answer from an earlier
 * request may never overwrite a newer draft, and a write is authorized by the
 * version the text was read at rather than by time.
 */
/** A failure the session can paint, after transport envelopes are gone. */
export interface DocumentError {
  readonly code: string;
  readonly message: string;
}

/** Success from the injected opener. */
export interface OpenSuccess {
  readonly ok: true;
  readonly text: string;
  readonly version?: string | null;
  readonly bytes?: number;
}

/** Failure from the injected opener. */
export interface OpenFailure {
  readonly ok: false;
  readonly code: string;
  readonly message: string;
}

/** Whatever the injected opener answers. */
export type OpenResult = OpenSuccess | OpenFailure;

/** Load one whole document; the client entry binds this to the Remote face. */
export type OpenDocument = (
  sessionId: string,
  path: string,
  signal?: AbortSignal,
) => Promise<OpenResult>;

/** One write, as the transport receives it. */
export interface SaveRequest {
  readonly sessionId: string;
  readonly path: string;
  readonly text: string;
  /** The version the submitted text was read at; null when the host reported none. */
  readonly expectedVersion: string | null;
}

/** Success from the injected saver. */
export interface SaveSuccess {
  readonly ok: true;
  readonly version?: string | null;
  readonly bytes?: number;
}

/** Failure from the injected saver. */
export interface SaveFailure {
  readonly ok: false;
  readonly code: string;
  readonly message: string;
}

/** Whatever the injected saver answers. */
export type SaveResult = SaveSuccess | SaveFailure;

/** Replace one whole document behind a version guard. */
export type SaveDocument = (request: SaveRequest, signal?: AbortSignal) => Promise<SaveResult>;

/** What one `save()` call answered, in the shape a close confirmation needs. */
export type SaveOutcome =
  | { readonly ok: true; readonly version: string | null }
  | { readonly ok: false; readonly code: string };

/** The immutable state a panel renders. */
export interface DocumentSnapshot {
  readonly status: "idle" | "loading" | "ready" | "failed";
  readonly text: string;
  readonly savedText: string;
  readonly version: string | null;
  readonly dirty: boolean;
  /** A write is in flight; the editor keeps accepting input meanwhile. */
  readonly saving: boolean;
  /** The last write lost the version guard; only a reload may clear it. */
  readonly conflict: boolean;
  readonly error: DocumentError | null;
}

/** One shared draft. */
export interface DocumentSession {
  getSnapshot(): DocumentSnapshot;
  /** Observe changes; the listener is not called on subscription. */
  subscribe(listener: () => void): () => void;
  /** Change the draft in memory only. */
  setDraft(text: string): void;
  /** Write the draft through the transport and advance the baseline with its answer. */
  save(): Promise<SaveOutcome>;
  /** Re-read the document, replacing the draft on success. */
  reload(): Promise<void>;
  /** The live draft, for a copy action that must not depend on the transport. */
  copyDraft(): string;
  /** Release this acquisition; the session is dropped when the count reaches zero. */
  dispose(): void;
}

/** The store the explorer's `fsExplorer` service exposes. */
export interface DocumentStore {
  acquire(sessionId: string, path: string): DocumentSession;
  /** An existing draft's snapshot, without creating or retaining anything. */
  peek(sessionId: string, path: string): DocumentSnapshot | undefined;
  /** An existing draft, for an action; the caller must not dispose what it did not acquire. */
  find(sessionId: string, path: string): DocumentSession | undefined;
  /** Observe every draft; the listener is not called on subscription. */
  subscribe(listener: () => void): () => void;
  /** Monotonic count of publications, so a subscriber can cache its own read. */
  revision(): number;
}

/** What one mounted `fsExplorerDocuments` face must expose. */
export interface DocumentsFace {
  open(request: { readonly sessionId: string; readonly path: string }, signal?: AbortSignal): Promise<unknown> | unknown;
  /** Absent on hosts that predate the write channel. */
  save?(request: SaveRequest, signal?: AbortSignal): Promise<unknown> | unknown;
}

/** The client context slice the resolver probes. */
export interface DocumentsContextLike {
  readonly fsExplorerDocuments?: unknown;
  readonly remote?: unknown;
  get?(name: string): unknown;
}

/** Snapshot before the first reload. */
const IDLE: DocumentSnapshot = Object.freeze({
  status: "idle",
  text: "",
  savedText: "",
  version: null,
  dirty: false,
  saving: false,
  conflict: false,
  error: null,
});

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object";
}

function failure(code: string, message: string): OpenFailure {
  return { ok: false, code, message };
}

function failureFrom(error: unknown): OpenFailure {
  const record = isRecord(error) ? error : {};
  const code = typeof record.code === "string" && record.code !== "" ? record.code : "io-error";
  const message = typeof record.message === "string" ? record.message : "";
  return failure(code, message);
}

function invalidResponse(): OpenFailure {
  return failure("invalid-response", "the document service answered an invalid response");
}

function safeRead(source: () => unknown): unknown {
  try {
    return source();
  } catch {
    // An unmounted Cordis service and a whitelist rejection are both "absent".
    return undefined;
  }
}

/**
 * Fold the transport envelope and the endpoint union down to one result.
 *
 * The generated Remote wraps an endpoint result in `{ok, value}`; a test double
 * or a flatter host hands the endpoint result over directly. Shape is checked at
 * every layer so both transports read the same and nothing throws.
 * @param response - whatever `open` resolved to.
 * @returns one document or one failure.
 */
export function normalizeOpenResult(response: unknown): OpenResult {
  const outer = isRecord(response) ? response : undefined;
  if (outer === undefined) return invalidResponse();
  if (outer.ok === false) return failureFrom(outer.error);

  const inner = outer.ok === true && "value" in outer ? outer.value : response;
  const result = isRecord(inner) ? inner : undefined;
  if (result === undefined) return invalidResponse();
  if (result.ok === false) return failureFrom(result.error);

  const document = isRecord(result.document)
    ? result.document
    : typeof result.text === "string"
      ? result
      : undefined;
  if (document === undefined || typeof document.text !== "string") return invalidResponse();
  return {
    ok: true,
    text: document.text,
    ...(typeof document.version === "string" ? { version: document.version } : {}),
    ...(typeof document.bytes === "number" ? { bytes: document.bytes } : {}),
  };
}

/**
 * Fold one save answer down to the version the next write must carry.
 * @param response - whatever `save` resolved to.
 * @returns the new version, or the failure the pane paints.
 */
export function normalizeSaveResult(response: unknown): SaveResult {
  const outer = isRecord(response) ? response : undefined;
  if (outer === undefined) return invalidResponseShape();
  if (outer.ok === false) return failureFrom(outer.error);

  const inner = outer.ok === true && "value" in outer ? outer.value : response;
  const result = isRecord(inner) ? inner : undefined;
  if (result === undefined) return invalidResponseShape();
  if (result.ok === false) return failureFrom(result.error);

  const document = isRecord(result.document) ? result.document : result;
  return {
    ok: true,
    ...(typeof document.version === "string" ? { version: document.version } : {}),
    ...(typeof document.bytes === "number" ? { bytes: document.bytes } : {}),
  };
}

function invalidResponseShape(): SaveFailure {
  return { ok: false, code: "invalid-response", message: "the document service answered an invalid save response" };
}

/** Whether a value is the generated document namespace rather than a stub. */
export function isDocumentsFace(value: unknown): value is DocumentsFace {
  return isRecord(value) && typeof value.open === "function";
}

/**
 * Resolve `remote.fsExplorerDocuments` on every call so a late mount works.
 * @param ctx - the client context this row was applied to.
 * @returns a resolver that answers undefined while the namespace is absent.
 */
export function createDocumentsResolver(ctx: DocumentsContextLike): () => DocumentsFace | undefined {
  return () => {
    const direct = safeRead(() => ctx.fsExplorerDocuments);
    if (isDocumentsFace(direct)) return direct;

    const remote = safeRead(() => (isRecord(ctx.remote) ? ctx.remote.fsExplorerDocuments : undefined));
    if (isDocumentsFace(remote)) return remote;

    const viaGet = safeRead(() =>
      typeof ctx.get === "function" ? ctx.get("remote.fsExplorerDocuments") : undefined,
    );
    if (isDocumentsFace(viaGet)) return viaGet;

    return undefined;
  };
}

/**
 * Bind the store's opener to the host document channel.
 * @param ctx - client context carrying the Remote carrier.
 * @returns an opener that never throws.
 */
export function createDocumentOpener(ctx: DocumentsContextLike): OpenDocument {
  const resolve = createDocumentsResolver(ctx);
  return async (sessionId, path, signal) => {
    const face = resolve();
    if (face === undefined) {
      return failure("unavailable", "the document service is unavailable");
    }
    try {
      return normalizeOpenResult(await face.open({ sessionId, path }, signal));
    } catch (error) {
      return failure("io-error", error instanceof Error ? error.message : String(error));
    }
  };
}

/**
 * Bind the store's writer to the host document channel.
 *
 * A host that exposes the read channel but not the write one answers
 * `unavailable` rather than pretending the file was saved: a draft the reader
 * believes is safe is worse than a visible refusal.
 * @param ctx - client context carrying the Remote carrier.
 * @returns a saver that never throws.
 */
export function createDocumentSaver(ctx: DocumentsContextLike): SaveDocument {
  const resolve = createDocumentsResolver(ctx);
  return async (request, signal) => {
    const face = resolve();
    const save = face?.save;
    if (face === undefined || typeof save !== "function") {
      return { ok: false, code: "unavailable", message: "the document service cannot save" };
    }
    try {
      return normalizeSaveResult(await save.call(face, request, signal));
    } catch (error) {
      return { ok: false, code: "io-error", message: error instanceof Error ? error.message : String(error) };
    }
  };
}

/** One live session in the map. */
interface Entry {
  readonly session: Session;
}

/**
 * Create one store.
 *
 * Module state at the caller keeps sessions alive across panel remounts; this
 * factory itself is pure so a test can build an isolated store per case.
 * @param options.open - whole-document reader injected by the client entry.
 * @param options.save - whole-document writer; absent stores answer `unavailable`.
 * @returns the store.
 */
export function createDocumentStore(options: {
  readonly open: OpenDocument;
  readonly save?: SaveDocument;
}): DocumentStore {
  const entries = new Map<string, Entry>();
  const listeners = new Set<() => void>();
  let revision = 0;

  const keyOf = (sessionId: string, path: string): string => `${sessionId}\u0000${path}`;

  // One publication counter for the whole store: a tab strip polls a single
  // number instead of subscribing to every draft it may or may not show.
  const announced = (): void => {
    revision += 1;
    for (const listener of [...listeners]) listener();
  };

  const find = (sessionId: string, path: string): DocumentSession | undefined =>
    entries.get(keyOf(sessionId, path))?.session;

  return {
    acquire(sessionId, path) {
      const key = keyOf(sessionId, path);
      let entry = entries.get(key);
      if (entry === undefined) {
        const session = new Session(sessionId, path, options.open, options.save, () => {
          entries.delete(key);
          announced();
        }, announced);
        entry = { session };
        entries.set(key, entry);
        announced();
      }
      entry.session.retain();
      return entry.session;
    },

    peek(sessionId, path) {
      return find(sessionId, path)?.getSnapshot();
    },

    find,

    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },

    revision: () => revision,
  };
}

/** The one mutable draft behind {@link DocumentSession}. */
class Session implements DocumentSession {
  private snapshot: DocumentSnapshot = IDLE;
  private readonly listeners = new Set<() => void>();
  private references = 0;
  private closed = false;
  private generation = 0;

  constructor(
    private readonly sessionId: string,
    private readonly path: string,
    private readonly open: OpenDocument,
    private readonly saveTransport: SaveDocument | undefined,
    private readonly onRelease: () => void,
    private readonly onChange: () => void,
  ) {}

  /** Count one more panel holding this draft. */
  retain(): void {
    if (!this.closed) this.references += 1;
  }

  getSnapshot(): DocumentSnapshot {
    return this.snapshot;
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  setDraft(text: string): void {
    if (this.closed || text === this.snapshot.text) return;
    this.publish({ ...this.snapshot, text, dirty: text !== this.snapshot.savedText });
  }

  copyDraft(): string {
    return this.snapshot.text;
  }

  async save(): Promise<SaveOutcome> {
    if (this.closed) return { ok: false, code: "closed" };
    const snapshot = this.snapshot;
    if (snapshot.status !== "ready") return { ok: false, code: "not-ready" };
    if (!snapshot.dirty) return { ok: true, version: snapshot.version };
    if (snapshot.saving) return { ok: false, code: "busy" };
    const save = this.saveTransport;
    if (save === undefined) {
      this.publish({ ...snapshot, error: { code: "unavailable", message: "" } });
      return { ok: false, code: "unavailable" };
    }

    // The request describes `sent`, so the answer may only describe `sent` too.
    const sent = snapshot.text;
    const expectedVersion = snapshot.version;
    this.publish({ ...snapshot, saving: true, error: null });
    try {
      const result = await save({ sessionId: this.sessionId, path: this.path, text: sent, expectedVersion });
      if (this.closed) return { ok: false, code: "closed" };
      if (!result.ok) {
        this.publish({
          ...this.snapshot,
          saving: false,
          conflict: result.code === "stale-version" ? true : this.snapshot.conflict,
          error: { code: result.code, message: result.message },
        });
        return { ok: false, code: result.code };
      }
      // A host that reports no new version keeps the previous guard: dropping it
      // to null would silently disable the next write's conflict detection.
      const version = result.version ?? expectedVersion;
      this.publish({
        ...this.snapshot,
        saving: false,
        savedText: sent,
        version,
        dirty: this.snapshot.text !== sent,
        conflict: false,
        error: null,
      });
      return { ok: true, version };
    } catch (error) {
      if (this.closed) return { ok: false, code: "closed" };
      const message = error instanceof Error ? error.message : String(error);
      this.publish({ ...this.snapshot, saving: false, error: { code: "io-error", message } });
      return { ok: false, code: "io-error" };
    }
  }

  async reload(): Promise<void> {
    if (this.closed) return;
    const generation = ++this.generation;
    // A re-read of a document already on screen must not blank the editor: the
    // reader may have a draft in it and only the disk may be missing.
    const keptDraft = this.snapshot.status === "ready";
    this.publish({ ...this.snapshot, status: keptDraft ? "ready" : "loading", error: null });
    try {
      const result = await this.open(this.sessionId, this.path);
      if (this.closed || generation !== this.generation) return;
      if (!result.ok) {
        this.publish({
          ...this.snapshot,
          status: keptDraft ? "ready" : "failed",
          error: { code: result.code, message: result.message },
        });
        return;
      }
      this.publish({
        ...this.snapshot,
        status: "ready",
        text: result.text,
        savedText: result.text,
        version: result.version ?? null,
        dirty: false,
        saving: false,
        conflict: false,
        error: null,
      });
    } catch (error) {
      if (this.closed || generation !== this.generation) return;
      this.publish({
        ...this.snapshot,
        status: keptDraft ? "ready" : "failed",
        error: { code: "io-error", message: error instanceof Error ? error.message : String(error) },
      });
    }
  }

  dispose(): void {
    if (this.closed) return;
    this.references -= 1;
    if (this.references > 0) return;
    this.closed = true;
    this.listeners.clear();
    this.onRelease();
  }

  private publish(next: DocumentSnapshot): void {
    this.snapshot = Object.freeze(next);
    for (const listener of [...this.listeners]) listener();
    this.onChange();
  }
}
