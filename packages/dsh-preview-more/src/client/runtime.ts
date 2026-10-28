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

/** Read one file's complete bytes: the shape every preview body calls. */
export type ReadFile = (sessionId: string, path: string, signal: AbortSignal) => Promise<Uint8Array>;

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
  readonly effect: (effect: () => () => void, label?: string) => void;
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
