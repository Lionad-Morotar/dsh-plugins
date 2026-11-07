/**
 * File and directory references: the payload a chip carries, the trigger source
 * that gives it an identity at send time, and the two-channel writer that puts
 * it in the composer.
 *
 * Unlike a commit reference, this one deliberately spells itself as `@<path>`.
 * The host already owns an `@` file-reference prompt and a bubble rule for that
 * spelling, so reusing it means the model reads a path the way it reads any
 * other file mention and the sent message renders as a file chip without this
 * package registering a rule of its own. The chip's `appearance` is what
 * distinguishes a file from a folder in the composer.
 *
 * The host splits writing in two. The span must come from the composer's
 * `captureInsertion()` (detect coordinates plus a draft revision); the chip
 * itself is written through the session input facade's `insertReference`, which
 * refuses a stale revision with a silent `false` rather than throwing. So the
 * retry and the plain-text fallback are this module's job, not the host's.
 */

/** The source name the chip is filed under; the host looks the codec up by it. */
export const FS_REFERENCE_SOURCE = "lionad.fs";

/** The trigger the source declares. Identity only: it never lists candidates. */
export const FS_REFERENCE_TRIGGER = "@";

/** What a reference points at. The kind decides the chip's glyph. */
export type FsReferenceKind = "file" | "directory";

/**
 * The facts one file reference carries, as the chip's `ref` stores them.
 *
 * The `ref` string is the only field that survives to send time, so it holds
 * everything the codec needs to rebuild the text.
 */
interface FsRefRecord {
  readonly path: string;
  readonly label: string;
  readonly kind: FsReferenceKind;
}

/** Everything one file reference needs, in the three spellings the host uses. */
export interface FsReferencePayload {
  readonly kind: "fs.file" | "fs.directory";
  /** Workspace-relative path, without a trailing slash. */
  readonly path: string;
  /** Chip text: the entry's own name. */
  readonly label: string;
  /** Draft text: `@<path>`, with a trailing slash on a directory. */
  readonly clipboardText: string;
  /** What the model reads. Same as the draft text, on purpose. */
  readonly modelText: string;
  /**
   * The chip's `ref`: the same facts as JSON. The host keeps this string and
   * nothing else, so the codec has to be able to rebuild the text from it.
   */
  readonly ref: string;
}

/** The span the composer hands out; only `captureInsertion` may produce one. */
export interface FsReferenceSpan {
  readonly start: number;
  readonly end: number;
  readonly draftRev: number;
}

/** The one structured-reference write the facade exposes. */
export interface FsReferenceInsert {
  readonly source: string;
  readonly ref: string;
  readonly label: string;
  readonly clipboardText: string;
  readonly appearance?: "session" | "file" | "folder";
}

/**
 * The composer capabilities the writer needs, injected as a plain object so the
 * state machine is testable without a host.
 */
export interface FsInsertionDeps {
  readonly captureSpan: () => FsReferenceSpan | undefined;
  readonly insertReference: (insert: FsReferenceInsert, span: FsReferenceSpan) => boolean;
  readonly insertText: (text: string, span: FsReferenceSpan) => boolean;
  /**
   * Whether a chip would survive to send time. Read per write: a source can be
   * disposed after the menu that enabled this row was built.
   */
  readonly canInsertReference: boolean;
}

/** Which channel took the reference, or that neither did. */
export type FsInsertionResult = "reference" | "text" | "failed";

/**
 * Reduce a path to the workspace vocabulary the tree uses.
 *
 * The tree, the copy rows and the host's file references all speak `/`-joined
 * workspace-relative paths, so a Windows separator or a leading `./` has to be
 * normalised here rather than leaking into a draft the model then reads.
 * @param path - any spelling of a workspace path.
 * @returns the path without a leading or trailing slash, or `""` for the root.
 */
export function normalizeReferencePath(path: string): string {
  let value = path.replace(/\\/gu, "/").trim();
  while (value.startsWith("./")) value = value.slice(2);
  return value.replace(/^\/+/u, "").replace(/\/+$/u, "");
}

/**
 * The last segment of a path, which is what a chip shows.
 * @param path - a workspace-relative path.
 * @returns the final segment, or the path itself when it has none.
 */
export function referenceLabel(path: string): string {
  const clean = normalizeReferencePath(path);
  if (clean === "") return "";
  const cut = clean.lastIndexOf("/");
  return cut < 0 ? clean : clean.slice(cut + 1);
}

/**
 * Spell one reference record as the draft and model text.
 *
 * A directory keeps its trailing slash: that is how the host's own file
 * reference tells a folder from a file, and dropping it would make the two
 * indistinguishable to the model.
 * @param record - the reference facts.
 * @returns `@<path>`, with a trailing slash on a directory.
 */
function referenceTextOf(record: FsRefRecord): string {
  const suffix = record.kind === "directory" ? "/" : "";
  return `@${record.path}${suffix}`;
}

/**
 * Build the three spellings of one file reference.
 * @param path - the workspace-relative path.
 * @param name - the entry's display name; falls back to the path's last segment.
 * @param kind - whether the entry is a file or a directory.
 * @returns the payload; the draft and model text are the same string.
 */
export function fsReferencePayload(path: string, name: string, kind: FsReferenceKind): FsReferencePayload {
  const clean = normalizeReferencePath(path);
  const label = name.trim() === "" ? referenceLabel(clean) : name.trim();
  const record: FsRefRecord = { path: clean, label, kind };
  const text = referenceTextOf(record);
  return {
    kind: kind === "directory" ? "fs.directory" : "fs.file",
    path: clean,
    label,
    clipboardText: text,
    modelText: text,
    ref: JSON.stringify(record),
  };
}

/**
 * Decode a chip's `ref` back into the facts it carries.
 *
 * A malformed ref must not block the send: the host treats a throwing codec as
 * a failed submission and keeps the draft, which would strand a chip the reader
 * can no longer explain.
 * @param ref - the chip's `ref` string.
 * @returns the record, or undefined when the ref is not ours.
 */
function decodeRef(ref: string): FsRefRecord | undefined {
  let parsed: unknown;
  try {
    parsed = JSON.parse(ref);
  } catch {
    return undefined;
  }
  if (parsed === null || typeof parsed !== "object") return undefined;
  const fields = parsed as Partial<Record<keyof FsRefRecord, unknown>>;
  if (typeof fields.path !== "string" || fields.path === "") return undefined;
  return {
    path: fields.path,
    label: typeof fields.label === "string" ? fields.label : referenceLabel(fields.path),
    kind: fields.kind === "directory" ? "directory" : "file",
  };
}

/** The clipboard projection of one chip; the codec's synchronous half. */
export function fsRefClipboardText(ref: string): string {
  const record = decodeRef(ref);
  return record === undefined ? `@${ref}` : referenceTextOf(record);
}

/** The model text of one chip; the codec's asynchronous half. */
export function fsRefModelText(ref: string): string {
  const record = decodeRef(ref);
  return record === undefined ? `@${ref}` : referenceTextOf(record);
}

/**
 * Write one file reference into the composer.
 *
 * Order matters: the structured chip is what keeps the reference atomic and
 * clickable, so a plain-text write only happens once the chip path has failed
 * twice. The second attempt re-captures the span because the first attempt's
 * revision may have been superseded by an edit that landed in between.
 * @param deps - the composer capabilities.
 * @param payload - the reference to write.
 * @returns which channel accepted it.
 */
export function insertFsReference(deps: FsInsertionDeps, payload: FsReferencePayload): FsInsertionResult {
  const insert: FsReferenceInsert = {
    source: FS_REFERENCE_SOURCE,
    ref: payload.ref,
    label: payload.label,
    clipboardText: payload.clipboardText,
    appearance: payload.kind === "fs.directory" ? "folder" : "file",
  };
  // No registered source means no codec at send time, so the chip path is
  // skipped entirely rather than attempted and refused later.
  if (deps.canInsertReference) {
    const first = deps.captureSpan();
    if (first !== undefined) {
      if (deps.insertReference(insert, first)) return "reference";
      const second = deps.captureSpan();
      if (second !== undefined && deps.insertReference(insert, second)) return "reference";
    }
  }
  // No span at all means the composer has no caret to write at; the text path
  // asks once more because the editor may have settled in between.
  const span = deps.captureSpan();
  if (span === undefined) return "failed";
  return deps.insertText(payload.clipboardText, span) ? "text" : "failed";
}

/**
 * What the menu knows about the composer when it decides the reference row.
 *
 * `undefined` means the view could not read the composer at all, which is a
 * different answer from "read it and it cannot take a reference": the first is a
 * host without the input plane, the second is a session that cannot be written
 * to right now.
 */
export interface ReferenceTargetFacts {
  /** A session is on screen, so a draft exists to write into. */
  readonly session: boolean;
  /** The facade exposes `insertReference`; without it the write degrades to text. */
  readonly insertReference: boolean;
  /**
   * This package's trigger source is registered, so a chip would find a codec
   * at send time. A chip without one is refused by the host and strands the
   * draft, which is worse than the plain text this row could write instead.
   */
  readonly source: boolean;
}

/** Why the reference row cannot run, as a copy key. */
export type ReferenceBlockReason = "noSession" | "noReference" | "noReferenceSource";

/**
 * Decide whether the reference row may run.
 *
 * Both facts block. A missing session means there is no draft to write into at
 * all; a facade without `insertReference` means the only thing left would be a
 * plain-text write, and offering a row that quietly produces something other
 * than the chip it names is worse than saying why it cannot run. The runtime
 * fallback in {@link insertFsReference} still exists for the case this cannot
 * predict: a facade that has the method and refuses the span.
 * @param facts - the composer facts the view read, or undefined when it could not.
 * @returns undefined when the row may run, else the reason key.
 */
export function referenceBlockReason(facts: ReferenceTargetFacts | undefined): ReferenceBlockReason | undefined {
  if (facts === undefined || !facts.session) return "noSession";
  if (!facts.insertReference) return "noReference";
  if (!facts.source) return "noReferenceSource";
  return undefined;
}

/** The slice of `ctx.inputTriggers` this package registers into. */
export interface InputTriggersFace {
  registerSource(source: FsReferenceSource): () => void;
}

/** The source shape, narrowed to what this package fills in. */
export interface FsReferenceSource {
  readonly trigger: string;
  readonly name: string;
  readonly showGroupTitle: boolean;
  candidates(): Promise<readonly never[]>;
  onPick(): undefined;
  readonly codec: {
    clipboardText(ref: string): string;
    serialize(ref: string, signal?: AbortSignal): Promise<string>;
  };
}

/**
 * Build the source that gives file chips an identity at send time.
 *
 * It contributes no `@` menu rows: the host already owns the `@` menu for real
 * file references, and a second group that can never match a query would only
 * take a row in it. The host requires the source to exist and to have a codec,
 * because send-time serialization looks the codec up by name and rejects the
 * submission when it is missing.
 * @returns the source to register.
 */
export function createFsReferenceSource(): FsReferenceSource {
  return {
    trigger: FS_REFERENCE_TRIGGER,
    name: FS_REFERENCE_SOURCE,
    showGroupTitle: false,
    async candidates() {
      return [];
    },
    onPick() {
      return undefined;
    },
    codec: {
      clipboardText: fsRefClipboardText,
      async serialize(ref: string) {
        return fsRefModelText(ref);
      },
    },
  };
}

/** The slice of the client context the source registration probes. */
export interface ReferenceContextLike {
  get?(name: string): unknown;
  inject?<T>(names: string[], apply: (scope: T) => void): unknown;
}

/** The scope `inject` hands the callback, narrowed to the effect it needs. */
interface InputTriggersScopeLike {
  readonly inputTriggers: InputTriggersFace;
  effect(apply: () => () => void, label: string): unknown;
}

function isInputTriggers(value: unknown): value is InputTriggersFace {
  if (value === null || typeof value !== "object") return false;
  return typeof (value as { registerSource?: unknown }).registerSource === "function";
}

/**
 * Register the file source wherever the host offers the trigger service.
 *
 * `inject` is the primary probe because it also covers a service that loads
 * after this plugin: the callback runs whenever the dependency arrives, and it
 * runs immediately when the dependency is already there. `get` is the second
 * probe for a host that exposes the service but not the scoped injection; it is
 * only tried when `inject` is absent or refused, because registering through
 * both would be a duplicate `trigger`/`name` pair, which the host rejects by
 * throwing.
 *
 * Neither probe is required. Without a source the chip still lands in the
 * draft; only send-time serialization would be missing, which is why the writer
 * falls back to plain text.
 * @param ctx - the client context.
 * @returns a disposer for whatever was registered.
 */
/**
 * What a registration left behind.
 *
 * `available` is a getter rather than a boolean because the `inject` path
 * registers asynchronously: a host whose trigger service arrives after this
 * plugin would otherwise be frozen at "no source" for the life of the page.
 */
export interface ReferenceSourceHandle {
  /** Whether a chip written now would find a codec at send time. */
  readonly available: boolean;
  /** Drop the registration; idempotent. */
  dispose(): void;
}

export function registerFsReferenceSource(ctx: ReferenceContextLike): ReferenceSourceHandle {
  const source = createFsReferenceSource();
  let dispose: (() => void) | undefined;
  const release = (): void => {
    dispose?.();
    dispose = undefined;
  };
  // The handle reports the live registration rather than a snapshot of it:
  // the inject path may not have run yet when this object is built.
  const handle: ReferenceSourceHandle = {
    get available() {
      return dispose !== undefined;
    },
    dispose: release,
  };
  if (typeof ctx.inject === "function") {
    try {
      ctx.inject<InputTriggersScopeLike>(["inputTriggers"], scope => {
        scope.effect(() => {
          dispose = scope.inputTriggers.registerSource(source);
          return release;
        }, "dsh-fs-explorer: reference source");
      });
      return handle;
    } catch {
      // A refused injection is the same as a host without the service; the
      // `get` probe below is still worth one attempt.
    }
  }
  try {
    const direct = ctx.get?.("inputTriggers");
    if (isInputTriggers(direct)) {
      dispose = direct.registerSource(source);
      return handle;
    }
  } catch {
    // Unknown service name; the source stays unregistered.
  }
  return handle;
}
