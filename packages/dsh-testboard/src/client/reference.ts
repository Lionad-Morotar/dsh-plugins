/**
 * Test-board references: the payload a chip carries, the trigger source that
 * gives it an identity at send time, and the two-channel writer that puts it in
 * the composer.
 *
 * Two targets exist because the board has two rows to right-click. A file
 * reference spells itself `@<path>`, so the host's own file prompt and bubble
 * rule already know what to do with it. A case reference has no such host
 * vocabulary: a test name lives inside a file, so the case chip uses the
 * generic session appearance and the model text spells the pair out.
 *
 * The host splits writing in two. The span must come from the composer's
 * `captureInsertion()` (detect coordinates plus a draft revision); the chip
 * itself is written through the session input facade's `insertReference`, which
 * refuses a stale revision with a silent `false` rather than throwing. So the
 * retry and the plain-text fallback are this module's job, not the host's.
 */
import { VIEW_ID } from "../shared.ts";
import { fileNameOf } from "./format.ts";

/** The source name the chip is filed under; the host looks the codec up by it. */
export const TESTBOARD_REFERENCE_SOURCE = "lionad.testboard";

/** The trigger the source declares. Identity only: it never lists candidates. */
export const TESTBOARD_REFERENCE_TRIGGER = "@";

/**
 * What one reference points at.
 *
 * The case keeps both the path and the index: the index is what the board can
 * select without searching a name that two files may spell the same way, while
 * the name is what the reader and the model read.
 */
export type TestboardReferenceTarget =
  | { readonly kind: "file"; readonly path: string }
  | { readonly kind: "case"; readonly path: string; readonly index: number; readonly name: string };

/** The facts one reference carries, as the chip's `ref` stores them. */
interface TestboardRefRecord {
  readonly version: 1;
  readonly kind: "file" | "case";
  readonly path: string;
  readonly name: string;
  readonly index: number;
}

/** Everything one reference needs, in the three spellings the host uses. */
export interface TestboardReferencePayload {
  readonly kind: "testboard.file" | "testboard.case";
  /** Workspace-relative path of the file the target lives in. */
  readonly path: string;
  /** The case's own name; empty for a file target. */
  readonly name: string;
  /** Chip text. */
  readonly label: string;
  /** Draft text when the chip path is unavailable. */
  readonly clipboardText: string;
  /** What the model reads in place of the chip. */
  readonly modelText: string;
  /** The chip's `ref`: the same facts as JSON. */
  readonly ref: string;
}

/** The span the composer hands out; only `captureInsertion` may produce one. */
export interface TestboardReferenceSpan {
  readonly start: number;
  readonly end: number;
  readonly draftRev: number;
}

/** The one structured-reference write the facade exposes. */
export interface TestboardReferenceInsert {
  readonly source: string;
  readonly ref: string;
  readonly label: string;
  readonly clipboardText: string;
  readonly appearance?: "session" | "file" | "folder";
}

/** The composer capabilities the writer needs, injected so the writer is testable. */
export interface TestboardInsertionDeps {
  readonly captureSpan: () => TestboardReferenceSpan | undefined;
  readonly insertReference: (insert: TestboardReferenceInsert, span: TestboardReferenceSpan) => boolean;
  readonly insertText: (text: string, span: TestboardReferenceSpan) => boolean;
  /**
   * Whether a chip would survive to send time. Read per write: a source can be
   * disposed after the menu that offered this row was painted.
   */
  readonly canInsertReference: boolean;
}

/** Which channel took the reference, or that neither did. */
export type TestboardInsertionResult = "reference" | "text" | "failed";

/**
 * Reduce a path to the workspace vocabulary the board renders.
 *
 * The rows, the host's file references and the source route all speak
 * `/`-joined workspace-relative paths, so a Windows separator or a leading `./`
 * has to be normalised here rather than leaking into a draft the model reads.
 * @param path - any spelling of a workspace path.
 * @returns the path without a leading or trailing slash.
 */
export function normalizeReferencePath(path: string): string {
  let value = path.replace(/\\/gu, "/").trim();
  while (value.startsWith("./")) value = value.slice(2);
  return value.replace(/^\/+/u, "").replace(/\/+$/u, "");
}

/**
 * Spell one record as the text the model reads.
 *
 * A file stays a plain `@<path>` so the host's file bubble rule applies to the
 * sent message. A case has to name both ends: the file alone would lose which
 * test was meant.
 * @param record - the reference facts.
 * @returns one line, never empty.
 */
function modelTextOf(record: TestboardRefRecord): string {
  if (record.kind === "file") return `@${record.path}`;
  return `[testboard case] ${record.path} · ${record.name}`;
}

/**
 * Build the three spellings of one reference.
 * @param target - the file or case a row names.
 * @returns the payload; no field is ever multi-line.
 */
export function testboardReferencePayload(target: TestboardReferenceTarget): TestboardReferencePayload {
  const path = normalizeReferencePath(target.path);
  const name = target.kind === "case" ? target.name.replace(/\s+/gu, " ").trim() : "";
  const record: TestboardRefRecord = {
    version: 1,
    kind: target.kind,
    path,
    name,
    index: target.kind === "case" ? target.index : 0,
  };
  const modelText = modelTextOf(record);
  const label =
    target.kind === "case" ? `${fileNameOf(path)} · ${name}` : fileNameOf(path) === "" ? path : fileNameOf(path);
  return {
    kind: target.kind === "case" ? "testboard.case" : "testboard.file",
    path,
    name,
    label,
    clipboardText: modelText,
    modelText,
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
function decodeRef(ref: string): TestboardRefRecord | undefined {
  let parsed: unknown;
  try {
    parsed = JSON.parse(ref);
  } catch {
    return undefined;
  }
  if (parsed === null || typeof parsed !== "object") return undefined;
  const fields = parsed as Partial<Record<keyof TestboardRefRecord, unknown>>;
  if (typeof fields.path !== "string" || fields.path === "") return undefined;
  return {
    version: 1,
    kind: fields.kind === "case" ? "case" : "file",
    path: normalizeReferencePath(fields.path),
    name: typeof fields.name === "string" ? fields.name : "",
    index: typeof fields.index === "number" && fields.index >= 0 ? Math.floor(fields.index) : 0,
  };
}

/** The clipboard projection of one chip; the codec's synchronous half. */
export function testboardRefClipboardText(ref: string): string {
  const record = decodeRef(ref);
  return record === undefined ? `@${ref}` : modelTextOf(record);
}

/** The model text of one chip; the codec's asynchronous half. */
export function testboardRefModelText(ref: string): string {
  const record = decodeRef(ref);
  return record === undefined ? `@${ref}` : modelTextOf(record);
}

/**
 * Write one reference into the composer.
 *
 * Order matters: the structured chip is what keeps the reference atomic and
 * clickable, so a plain-text write only happens once the chip path has failed
 * twice. The second attempt re-captures the span because the first attempt's
 * revision may have been superseded by an edit that landed in between.
 * @param deps - the composer capabilities.
 * @param payload - the reference to write.
 * @returns which channel accepted it.
 */
export function insertTestboardReference(
  deps: TestboardInsertionDeps,
  payload: TestboardReferencePayload,
): TestboardInsertionResult {
  const insert: TestboardReferenceInsert = {
    source: TESTBOARD_REFERENCE_SOURCE,
    ref: payload.ref,
    label: payload.label,
    clipboardText: payload.clipboardText,
    appearance: payload.kind === "testboard.file" ? "file" : "session",
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
 * different answer from "read it and it cannot take a reference".
 */
export interface ReferenceTargetFacts {
  /** A session is on screen, so a draft exists to write into. */
  readonly session: boolean;
  /** The facade exposes `insertReference`; without it the write degrades to text. */
  readonly insertReference: boolean;
  /** This package's trigger source is registered, so a chip would find a codec. */
  readonly source: boolean;
}

/** Why the reference row cannot run, as a copy key. */
export type ReferenceBlockReason = "noSession" | "noReference" | "noReferenceSource";

/**
 * Decide whether the reference row may run.
 * @param facts - the composer facts the view read, or undefined when it could not.
 * @returns undefined when the row may run, else the reason key.
 */
export function referenceBlockReason(facts: ReferenceTargetFacts | undefined): ReferenceBlockReason | undefined {
  if (facts === undefined || !facts.session) return "noSession";
  if (!facts.insertReference) return "noReference";
  if (!facts.source) return "noReferenceSource";
  return undefined;
}

/**
 * The focus string that selects one row when the tab opens.
 *
 * The workbench hands the view back the string it was given, so it has to carry
 * enough to find the row before the board has loaded anything. The file form
 * stays a path; the case form puts the index first because a path may contain
 * a colon while the index cannot.
 * @param target - the row to select.
 * @returns the focus string.
 */
export function testboardFocusOf(target: TestboardReferenceTarget): string {
  const path = normalizeReferencePath(target.path);
  return target.kind === "case" ? `case:${String(target.index)}:${path}` : `file:${path}`;
}

/**
 * Read back a focus string written by {@link testboardFocusOf}.
 * @param focus - the workbench's focus string.
 * @returns the row, or undefined when the string is not ours.
 */
export function parseTestboardFocus(focus: string): TestboardReferenceTarget | undefined {
  if (focus.startsWith("file:")) {
    const path = normalizeReferencePath(focus.slice("file:".length));
    return path === "" ? undefined : { kind: "file", path };
  }
  if (!focus.startsWith("case:")) return undefined;
  const rest = focus.slice("case:".length);
  const cut = rest.indexOf(":");
  if (cut <= 0) return undefined;
  const index = Number(rest.slice(0, cut));
  const path = normalizeReferencePath(rest.slice(cut + 1));
  if (!Number.isInteger(index) || index < 0 || path === "") return undefined;
  return { kind: "case", path, index, name: "" };
}

/** What the view needs from the entry to make the reference row work. */
export interface ReferenceWiring {
  /** The session input facade's structured-reference write, or undefined. */
  readonly insertReference?: (insert: TestboardReferenceInsert, span: TestboardReferenceSpan) => boolean;
  /** Return the keyboard to the composer after a write. */
  readonly focus?: () => void;
  /** Surface a failure where the reader will see it. */
  readonly notify?: (level: "info" | "error", text: string) => void;
}

/** Resolve the reference writer for one session, or undefined when it cannot. */
export type ReferenceWiringResolver = (sessionId: string) => ReferenceWiring | undefined;

/**
 * The seam a chip click drives to bring the test board forward.
 *
 * Every member is optional because the host hands these capabilities out
 * piecemeal. A missing member degrades to the next path rather than failing the
 * click.
 */
export interface TestboardReferenceSeam {
  /** Open a view for one session and deliver the focus with it. */
  readonly openView?: (sessionId: string, viewId: string, focus: string) => boolean;
  /** Leave a focus for a view that is mounted lazily. */
  readonly requestFocus?: (viewId: string, focus: string) => void;
  /** Withdraw a queued focus; used when the switch it was queued for failed. */
  readonly takeFocus?: (viewId: string) => string | undefined;
  /** Switch the view through a seam that carries no session. */
  readonly openViewOrSwitch?: (
    viewId: string,
    focus?: string,
  ) => { readonly opened: boolean; readonly focused: boolean };
  /** The session on screen, which is what a mismatch is measured against. */
  readonly currentSessionId?: () => string | undefined;
}

/**
 * Read the workbench service as the seam this package needs.
 * @param workbench - the workbench service, or whatever the context held.
 * @returns the seam; empty when the service is absent.
 */
export function testboardReferenceSeam(workbench: unknown): TestboardReferenceSeam {
  if (workbench === null || typeof workbench !== "object") return {};
  const face = workbench as {
    readonly views?: { open?(sessionId: string, id: string, focus?: string): boolean };
    openView?(id: string, focus?: string): boolean;
    readonly viewFocus?: {
      request?(view: string, focus: string): void;
      take?(view: string): string | undefined;
    };
    openViewOrSwitch?(id: string, focus?: string): { readonly opened: boolean; readonly focused: boolean };
    currentSessionId?(): string | undefined;
  };
  const views = face.views;
  const scopedOpen = views?.open;
  const legacyOpen = face.openView;
  const queue = face.viewFocus;
  const queueRequest = queue?.request;
  const queueTake = queue?.take;
  const switchView = face.openViewOrSwitch;
  const currentSessionId = face.currentSessionId;
  return {
    openView:
      typeof scopedOpen === "function"
        ? (sessionId, viewId, focus) => scopedOpen.call(views, sessionId, viewId, focus)
        : typeof legacyOpen === "function"
          ? (_sessionId, viewId, focus) => legacyOpen.call(face, viewId, focus)
          : undefined,
    requestFocus:
      typeof queueRequest === "function"
        ? (viewId, focus) => {
            queueRequest.call(queue, viewId, focus);
          }
        : undefined,
    takeFocus:
      typeof queueTake === "function" ? viewId => queueTake.call(queue, viewId) : undefined,
    openViewOrSwitch:
      typeof switchView === "function" ? (viewId, focus) => switchView.call(face, viewId, focus) : undefined,
    currentSessionId: typeof currentSessionId === "function" ? () => currentSessionId.call(face) : undefined,
  };
}

/**
 * The id of the session a click came from.
 *
 * The host's session object is not part of this package's contract, so both
 * spellings it has used are read and anything else is left to the caller's
 * fallback rather than guessed at.
 * @param session - the value the host passed as the session.
 * @returns the id, or undefined when the value carries none.
 */
function sessionIdOf(session: unknown): string | undefined {
  if (session === null || typeof session !== "object") return undefined;
  const fields = session as { readonly id?: unknown; readonly sessionId?: unknown };
  if (typeof fields.id === "string" && fields.id !== "") return fields.id;
  if (typeof fields.sessionId === "string" && fields.sessionId !== "") return fields.sessionId;
  return undefined;
}

/**
 * Bring the test board forward and select one row in it.
 *
 * The focus is delivered with the switch when the host's session-addressed
 * `openView` exists. Older seams queue the focus first and switch second, since
 * the view mounts lazily: queued after the switch it would arrive after the
 * mount that could have consumed it. A queue left behind by a switch that did
 * not land is withdrawn.
 * @param seam - the host capabilities the click was given.
 * @param sessionId - the session the click came from.
 * @param ref - the chip's `ref` string.
 * @returns whether the click was consumed; false leaves the editor's own gesture.
 */
export function openTestboardReference(
  seam: TestboardReferenceSeam,
  sessionId: string | undefined,
  ref: string,
): boolean {
  const record = decodeRef(ref);
  if (record === undefined) return false;
  if (sessionId === undefined || sessionId === "") return false;
  const current = seam.currentSessionId?.();
  // A chip from another session names a file in a workspace this tab is not
  // showing; selecting it would move a board the reader is not looking at.
  if (current !== undefined && current !== sessionId) return false;
  const target: TestboardReferenceTarget =
    record.kind === "file"
      ? { kind: "file", path: record.path }
      : { kind: "case", path: record.path, index: record.index, name: record.name };
  const focus = testboardFocusOf(target);
  if (seam.openView?.(sessionId, VIEW_ID, focus) === true) return true;
  if (seam.requestFocus !== undefined) {
    seam.requestFocus(VIEW_ID, focus);
    const switched = seam.openViewOrSwitch?.(VIEW_ID);
    if (switched?.opened === true) return true;
    seam.takeFocus?.(VIEW_ID);
    return false;
  }
  return seam.openViewOrSwitch?.(VIEW_ID, focus)?.focused === true;
}

/** The slice of `ctx.inputTriggers` this package registers into. */
export interface InputTriggersFace {
  registerSource(source: TestboardReferenceSource): () => void;
}

/** The source shape, narrowed to what this package fills in. */
export interface TestboardReferenceSource {
  readonly trigger: string;
  readonly name: string;
  readonly showGroupTitle: boolean;
  candidates(): Promise<readonly never[]>;
  onPick(): undefined;
  readonly codec: {
    clipboardText(ref: string): string;
    serialize(ref: string, signal?: AbortSignal): Promise<string>;
  };
  /**
   * Take a click on one of this source's chips.
   *
   * The host calls this from the editor's click handler and keeps its own
   * gesture when the answer is false.
   */
  openReference(session: unknown, activation: unknown): boolean;
}

/**
 * Build the source that gives test-board chips an identity at send time.
 *
 * It contributes no `@` menu rows: the context menu is the only way in, and a
 * group that can never match a query would still take a row in the menu.
 * @param readSeam - resolves the host capabilities per click.
 * @returns the source to register.
 */
export function createTestboardReferenceSource(
  readSeam: () => TestboardReferenceSeam = () => ({}),
): TestboardReferenceSource {
  return {
    trigger: TESTBOARD_REFERENCE_TRIGGER,
    name: TESTBOARD_REFERENCE_SOURCE,
    showGroupTitle: false,
    async candidates() {
      return [];
    },
    onPick() {
      return undefined;
    },
    codec: {
      clipboardText: testboardRefClipboardText,
      async serialize(ref: string) {
        return testboardRefModelText(ref);
      },
    },
    openReference(session, activation) {
      const ref =
        activation !== null && typeof activation === "object"
          ? (activation as { readonly ref?: unknown }).ref
          : undefined;
      if (typeof ref !== "string") return false;
      // The click runs inside the editor's own handler: a seam that throws must
      // leave the chip inert rather than take the composer down with it.
      try {
        const seam = readSeam();
        const target = sessionIdOf(session) ?? seam.currentSessionId?.();
        return openTestboardReference(seam, target, ref);
      } catch {
        return false;
      }
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

/**
 * What a registration left behind.
 *
 * `available` is a getter because the `inject` path registers asynchronously.
 */
export interface TestboardReferenceSourceHandle {
  /** Whether a chip written now would find a codec at send time. */
  readonly available: boolean;
  /** Drop the registration; idempotent. */
  dispose(): void;
}

function isInputTriggers(value: unknown): value is InputTriggersFace {
  if (value === null || typeof value !== "object") return false;
  return typeof (value as { registerSource?: unknown }).registerSource === "function";
}

/**
 * Register the reference source wherever the host offers the trigger service.
 *
 * `inject` is the primary probe because it also covers a service that loads
 * after this plugin; `get` is the second probe for a host that exposes the
 * service but not the scoped injection.
 * @param ctx - the client context.
 * @param readSeam - resolves the host capabilities per chip click.
 * @returns a disposer for whatever was registered.
 */
export function registerTestboardReferenceSource(
  ctx: ReferenceContextLike,
  readSeam?: () => TestboardReferenceSeam,
): TestboardReferenceSourceHandle {
  const source = createTestboardReferenceSource(readSeam);
  let dispose: (() => void) | undefined;
  const release = (): void => {
    dispose?.();
    dispose = undefined;
  };
  const handle: TestboardReferenceSourceHandle = {
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
        }, "dsh-testboard: reference source");
      });
      return handle;
    } catch {
      // A refused injection is the same as a host without the service.
    }
  }
  try {
    const direct = ctx.get?.("inputTriggers");
    if (isInputTriggers(direct)) {
      dispose = direct.registerSource(source);
    }
  } catch {
    // Unknown service name; the source stays unregistered.
  }
  return handle;
}
