/**
 * The seam between a document body and what it happened to receive.
 *
 * A preview body cannot be written against the host's TypeScript types: the
 * package is an external plugin, and its contract ships inside the Harness
 * install rather than as a dependency here. So the body narrows the props it
 * actually uses, once, in this module — reading a field the host stopped
 * sending fails here with a named error instead of a `undefined is not a
 * function` three frames down the render.
 */

/** A resolved Session file address, as the byte reader wants it. */
export interface FileTarget {
  readonly sessionId: string;
  readonly path: string;
}

/** What `ctx.remote.workspaceFiles.readBytes` resolves to on success. */
export interface ReadBytesValue {
  readonly data: Uint8Array;
  readonly bytes?: number;
  readonly eof?: boolean;
}

/** The byte reader, narrowed to the one call this plugin makes. */
export interface ByteReader {
  readBytes(
    sessionId: string,
    path: string,
    options: { baseFile?: string; range?: { offset?: number; length?: number } },
    signal?: AbortSignal,
  ): Promise<{ ok: true; value: ReadBytesValue } | { ok: false; error: unknown }>;
}

/** The subset of a client plugin context this plugin consumes. */
export interface PreviewContext {
  readonly locale: {
    bind(namespace: string): (key: string) => string;
    register(namespace: string, dictionaries: Record<string, Record<string, string>>): () => void;
  };
  readonly documentPreviews: {
    register(definition: {
      id: string;
      extensions: readonly string[];
      binaryExtensions?: readonly string[];
      priority?: "builtin" | "extension";
      title: () => string;
      loading: "text-pages" | "bytes-complete" | "renderer";
      wrap?: boolean;
    }): () => void;
  };
  readonly slots: {
    /** Runs the callback once the slot exists, again if it is re-created, and disposes on unload. */
    inject(name: string, register: () => () => void): () => void;
    register(definition: Record<string, unknown>, body: unknown): () => void;
  };
  readonly remote: { readonly workspaceFiles: ByteReader };
  readonly effect?: (effect: () => unknown, label?: string) => void;
  /**
   * Cordis's scoped injection: runs the callback in a scope that has the named
   * services, and re-runs it if one appears later. This is the only correct way
   * to reach an optional service such as `betterSidebar`, which exists only
   * when that plugin is installed.
   */
  readonly inject?: (deps: readonly string[], callback: (scope: InjectionScope) => void | (() => void)) => unknown;
}

/** The scope `inject` hands its callback. */
export interface InjectionScope {
  /** Read one service, or undefined when the scope did not resolve it. */
  get<T>(name: string): T | undefined;
}

/**
 * Register one reversible effect through whichever lifecycle the host offers.
 *
 * Cordis contexts expose `effect`; a host that does not (a bare test double)
 * still needs the registration to happen, so the fallback simply runs it and
 * keeps the disposer.
 * @param ctx - client plugin context.
 * @param run - effect body returning its disposer.
 * @returns the disposer, when the caller wants to call it directly.
 */
export function effect(ctx: PreviewContext, run: () => () => void): (() => void) | undefined {
  if (typeof ctx.effect === "function") {
    ctx.effect(run);
    return undefined;
  }
  return run();
}

/**
 * Read a file's complete bytes through the host's workspace service.
 *
 * The service caps a complete read (32 MiB by default) and refuses rather than
 * truncates, so an oversized model surfaces as a named error instead of a
 * silently half-parsed mesh.
 * @param reader - workspace file reader.
 * @param file - resolved session file target.
 * @param signal - cancellation for a tab that closed mid-read.
 * @returns the file bytes.
 */
export async function readFileBytes(reader: ByteReader, file: FileTarget, signal?: AbortSignal): Promise<Uint8Array> {
  const result = await reader.readBytes(file.sessionId, file.path, {}, signal);
  if (!result.ok) throw new Error(`read failed: ${describeError(result.error)}`, { cause: result.error });
  return result.value.data;
}

/**
 * One-line description of a thrown or wire-shaped failure.
 * @param error - anything a catch produced.
 * @returns a message safe to render.
 */
export function describeError(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  if (error !== null && typeof error === "object") {
    const code = (error as { code?: unknown }).code;
    if (typeof code === "string") return code;
  }
  return "unknown error";
}
