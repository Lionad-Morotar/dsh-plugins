/**
 * Structural types shared by the repository harness and its merge-steer feature.
 *
 * The package deliberately spells the Harness services structurally instead of
 * importing internal type packages: the host is the only thing that constructs
 * these objects, and a structural seam keeps the package loadable in a plain
 * Node test without a Harness boot.
 */

/** How a ref update reached its new commit. */
export type MergeMode = "merge" | "fast-forward" | "unknown";

/** One branch ref update that the classifier accepted as a merge. */
export interface MergeEvent {
  readonly repoRoot: string;
  readonly commonDir: string;
  readonly repoLabel: string;
  readonly targetRef: string;
  readonly targetBranch: string;
  readonly sourceLabels: readonly string[];
  readonly mergeSha: string;
  readonly mode: MergeMode;
  readonly message: string;
}

/** One repository, keyed by its Git common directory. */
export interface RepoRef {
  readonly root: string;
  readonly commonDir: string;
  readonly label: string;
}

/** The durable header fields merge-steer reads from a Session. */
export interface AgentSessionLike {
  readonly header?: {
    readonly cwd?: string;
    readonly origin?: "subagent";
  };
}

/** The slice of an Agent that merge-steer uses. */
export interface AgentLike {
  readonly id: string;
  readonly status: "idle" | "running";
  readonly session: AgentSessionLike;
  steer(input: {
    readonly content: readonly { readonly type: "text"; readonly text: string }[];
    readonly source: { readonly kind: "merge-steer"; readonly [key: string]: unknown };
  }): void;
}

/** The slice of the Agent registry merge-steer uses. */
export interface AgentsLike {
  list(): readonly AgentLike[];
}

/** The slice of the working-directory service merge-steer uses. */
export interface WorkingDirectoryLike {
  get(session: AgentSessionLike): string;
}

/** One collected stream read; mirrors the Harness subprocess shape. */
export interface CollectedRead {
  readonly text: string;
  readonly lossy: boolean;
  readonly spillPath?: string;
}

/** One collected reader. */
export interface CollectedReader {
  readFrom(fromByte: number): CollectedRead;
}

/** One spawned process handle. */
export interface SpawnedProcess {
  readonly done: Promise<{ readonly exitCode: number | null; readonly signal?: string | null }>;
  readonly collected: {
    readonly stdout?: CollectedReader;
    readonly stderr?: CollectedReader;
  };
}

/** The slice of the subprocess service the Git runner consumes. */
export interface SubprocessLike {
  spawn(spec: {
    readonly argv: readonly string[];
    readonly cwd: string;
    readonly stdio: {
      readonly stdin: "ignore" | { readonly data: string };
      readonly stdout: { readonly collect: { readonly maxBytes: number; readonly spill?: { readonly maxBytes: number } } };
      readonly stderr: { readonly collect: { readonly maxBytes: number; readonly spill?: { readonly maxBytes: number } } };
    };
    readonly graceMs: number;
    readonly signal?: AbortSignal;
    readonly env?: Readonly<Record<string, string | undefined>>;
  }): SpawnedProcess;
}

/** Minimal logger surface; every method is optional. */
export interface LoggerLike {
  info?(message: string): void;
  warn?(message: string): void;
  error?(message: string): void;
}
