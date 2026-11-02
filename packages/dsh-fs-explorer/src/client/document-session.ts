/**
 * Document sessions: one editable draft per (session, path), owned by the
 * explorer's client service so every renderer plugin sees the same text.
 *
 * The store is deliberately DOM-free and transport-free. The client entry
 * injects `open`, which keeps the session testable without a host and leaves
 * the save transport to the next slice. What it owns today is the part that
 * must not be re-invented per renderer: identity, reference counting, the
 * saved baseline, and the rule that an answer from an earlier request may
 * never overwrite a newer draft.
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

/** The immutable state a panel renders. */
export interface DocumentSnapshot {
  readonly status: "idle" | "loading" | "ready" | "failed";
  readonly text: string;
  readonly savedText: string;
  readonly version: string | null;
  readonly dirty: boolean;
  readonly error: DocumentError | null;
}

/** One shared draft. */
export interface DocumentSession {
  getSnapshot(): DocumentSnapshot;
  /** Observe changes; the listener is not called on subscription. */
  subscribe(listener: () => void): () => void;
  /** Change the draft in memory only. */
  setDraft(text: string): void;
  /** Advance the saved baseline; the remote save lands in a later slice. */
  save(): Promise<void>;
  /** Re-read the document, replacing the draft on success. */
  reload(): Promise<void>;
  /** Release this acquisition; the session is dropped when the count reaches zero. */
  dispose(): void;
}

/** The store the explorer's `fsExplorer` service exposes. */
export interface DocumentStore {
  acquire(sessionId: string, path: string): DocumentSession;
}

/** What one mounted `fsExplorerDocuments` face must expose. */
export interface DocumentsFace {
  open(request: { readonly sessionId: string; readonly path: string }, signal?: AbortSignal): Promise<unknown> | unknown;
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
  error: null,
});

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object";
}

function failure(code: string, message: string): OpenFailure {
  return { ok: false, code, message };
}

function invalidResponse(): OpenFailure {
  return failure("invalid-response", "the document service answered an invalid response");
}

function failureFrom(error: unknown): OpenFailure {
  const record = isRecord(error) ? error : {};
  const code = typeof record.code === "string" && record.code !== "" ? record.code : "io-error";
  const message = typeof record.message === "string" ? record.message : "";
  return failure(code, message);
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
 * @returns the store.
 */
export function createDocumentStore(options: { readonly open: OpenDocument }): DocumentStore {
  const entries = new Map<string, Entry>();

  const keyOf = (sessionId: string, path: string): string => `${sessionId}\u0000${path}`;

  return {
    acquire(sessionId, path) {
      const key = keyOf(sessionId, path);
      let entry = entries.get(key);
      if (entry === undefined) {
        const session = new Session(sessionId, path, options.open, () => {
          entries.delete(key);
        });
        entry = { session };
        entries.set(key, entry);
      }
      entry.session.retain();
      return entry.session;
    },
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
    private readonly onRelease: () => void,
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

  async save(): Promise<void> {
    if (this.closed) return;
    const sent = this.snapshot.text;
    // The remote write is the next slice's job. Awaiting one turn still models
    // the ordering rule that matters: the answer describes `sent`, so only the
    // baseline moves and the draft is taken from the latest state, not `sent`.
    await Promise.resolve();
    if (this.closed) return;
    this.publish({ ...this.snapshot, savedText: sent, dirty: this.snapshot.text !== sent });
  }

  async reload(): Promise<void> {
    if (this.closed) return;
    const generation = ++this.generation;
    this.publish({ ...this.snapshot, status: "loading", error: null });
    try {
      const result = await this.open(this.sessionId, this.path);
      if (this.closed || generation !== this.generation) return;
      if (!result.ok) {
        this.publish({
          ...this.snapshot,
          status: "failed",
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
        error: null,
      });
    } catch (error) {
      if (this.closed || generation !== this.generation) return;
      this.publish({
        ...this.snapshot,
        status: "failed",
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
  }
}
