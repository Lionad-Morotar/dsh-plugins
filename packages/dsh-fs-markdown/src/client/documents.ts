/**
 * The whole-document channel, folded down to one result shape.
 *
 * `fsExplorerDocuments` belongs to another plugin, so the namespace may be
 * absent (no explorer host half installed) and every request may come back as
 * a transport envelope wrapping the endpoint's own union. Both layers are
 * checked by shape and no failure throws: the body has to paint a state, not
 * unmount.
 */

/** One whole-document read after both envelopes were folded away. */
export type DocumentLoad =
  | {
      readonly ok: true;
      readonly text: string;
      readonly bytes?: number;
      readonly version?: string;
    }
  | {
      readonly ok: false;
      readonly code: string;
      readonly message: string;
    };

/** What one mounted `fsExplorerDocuments` face must expose. */
export interface DocumentsFace {
  open(request: { readonly sessionId: string; readonly path: string }, signal?: AbortSignal): Promise<unknown> | unknown;
}

/** The client context slice the resolver probes. */
export interface DocumentsContextLike {
  readonly remote?: unknown;
  get?(name: string): unknown;
}

/** Read the optional namespace on every call so a late mount starts working. */
export type DocumentsResolver = () => DocumentsFace | undefined;

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object";
}

function safeRead(source: () => unknown): unknown {
  try {
    return source();
  } catch {
    // An unmounted Cordis service and a whitelist rejection are both "absent".
    return undefined;
  }
}

/** Whether a value is the generated document namespace rather than a stub. */
export function isDocumentsFace(value: unknown): value is DocumentsFace {
  if (!isRecord(value)) return false;
  return typeof value.open === "function";
}

/**
 * Resolve `remote.fsExplorerDocuments`.
 *
 * The documented path is tried first; Cordis's `get` is the fallback for hosts
 * that enforce the inject whitelist on nested services. An absent namespace
 * answers undefined and becomes the body's "channel unavailable" state.
 * @param ctx - the client context this row was applied to.
 * @returns a resolver that answers undefined while the namespace is absent.
 */
export function createDocumentsResolver(ctx: DocumentsContextLike): DocumentsResolver {
  return () => {
    const remote = safeRead(() => (isRecord(ctx.remote) ? ctx.remote.fsExplorerDocuments : undefined));
    if (isDocumentsFace(remote)) return remote;

    const viaGet = safeRead(() =>
      typeof ctx.get === "function" ? ctx.get("remote.fsExplorerDocuments") : undefined,
    );
    if (isDocumentsFace(viaGet)) return viaGet;

    return undefined;
  };
}

function invalidResponse(): DocumentLoad {
  return { ok: false, code: "invalid-response", message: "the document service answered an invalid response" };
}

/** Fold one endpoint failure payload into the result shape. */
function failureFrom(error: unknown): DocumentLoad {
  const record = isRecord(error) ? error : {};
  const code = typeof record.code === "string" && record.code !== "" ? record.code : "io-error";
  const message = typeof record.message === "string" ? record.message : "";
  return { ok: false, code, message };
}

/**
 * Fold whatever `open` answered down to one document or one failure.
 *
 * A generated Remote call wraps the endpoint result in `{ok, value}`; a test
 * double or a flatter host hands the endpoint result over directly. The
 * endpoint itself answers `{ok, document}` / `{ok, error}`. Every layer is
 * decided by shape, so both transports read the same.
 * @param response - whatever `open` resolved to.
 * @returns the whole text, or a failure code and message.
 */
export function normalizeOpenDocument(response: unknown): DocumentLoad {
  const outer = isRecord(response) ? response : undefined;
  if (outer === undefined) return invalidResponse();
  if (outer.ok === false) return failureFrom(outer.error);

  const inner = outer.ok === true && "value" in outer ? outer.value : response;
  const result = isRecord(inner) ? inner : undefined;
  if (result === undefined) return invalidResponse();
  if (result.ok === false) return failureFrom(result.error);

  // `document` is the endpoint's own field; the `text` fallback covers a host
  // that flattens the endpoint result all the way down to the snapshot.
  const document = isRecord(result.document) ? result.document : typeof result.text === "string" ? result : undefined;
  if (document === undefined || typeof document.text !== "string") return invalidResponse();

  return {
    ok: true,
    text: document.text,
    ...(typeof document.bytes === "number" ? { bytes: document.bytes } : {}),
    ...(typeof document.version === "string" ? { version: document.version } : {}),
  };
}

/** A one-line description of a thrown failure. */
export function describeFailure(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "the document request failed";
}
