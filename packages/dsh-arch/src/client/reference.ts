/**
 * Architecture-element references: the payload a chip carries, the trigger
 * source that gives it an identity at send time, and the two-channel writer
 * that puts it in the composer.
 *
 * An element reference is the one of the three that can point at two places at
 * once: the `.c4` line that declares it and the code file that implements it.
 * Both are carried in the model text, because a reader asking the model about
 * an element wants to be able to open either end.
 *
 * The host splits writing in two. The span must come from the composer's
 * `captureInsertion()` (detect coordinates plus a draft revision); the chip
 * itself is written through the session input facade's `insertReference`, which
 * refuses a stale revision with a silent `false` rather than throwing. So the
 * retry and the plain-text fallback are this module's job, not the host's.
 */
import { clearArchFocus, requestArchFocus } from "./focus-store.ts";

/** The source name the chip is filed under; the host looks the codec up by it. */
export const ARCH_REFERENCE_SOURCE = "lionad.arch";

/** The trigger the source declares. Identity only: it never lists candidates. */
export const ARCH_REFERENCE_TRIGGER = "@";

/**
 * The facts one element reference carries, as the chip's `ref` stores them.
 *
 * The `ref` string is the only field that survives to send time, so it holds
 * everything the codec needs to rebuild the text.
 */
interface ArchRefRecord {
  readonly id: string;
  readonly title: string;
  readonly kind: string;
  readonly technology: string;
  /** Definition site in the model sources, when the host reported one. */
  readonly c4File: string;
  readonly c4Line: number;
  /** Implementation file, when the title→path convention resolved one. */
  readonly codeFile: string;
}

/** Everything one element reference needs, in the three spellings the host uses. */
export interface ArchReferencePayload {
  readonly kind: "arch.element";
  /** Element id as the model spells it, e.g. `dshPlugins.jump.jumpApp`. */
  readonly id: string;
  readonly title: string;
  readonly kindName: string;
  readonly technology: string;
  readonly c4: { readonly file: string; readonly line: number } | undefined;
  readonly code: { readonly file: string } | undefined;
  /** Chip text: the element's own title, or its id when it has no title. */
  readonly label: string;
  /** Draft text when the chip is copied out or the chip path is unavailable. */
  readonly clipboardText: string;
  /** What the model reads in place of the chip. */
  readonly modelText: string;
  /** The chip's `ref`: the same facts as JSON. */
  readonly ref: string;
}

/** The span the composer hands out; only `captureInsertion` may produce one. */
export interface ArchReferenceSpan {
  readonly start: number;
  readonly end: number;
  readonly draftRev: number;
}

/** The one structured-reference write the facade exposes. */
export interface ArchReferenceInsert {
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
export interface ArchInsertionDeps {
  readonly captureSpan: () => ArchReferenceSpan | undefined;
  readonly insertReference: (insert: ArchReferenceInsert, span: ArchReferenceSpan) => boolean;
  readonly insertText: (text: string, span: ArchReferenceSpan) => boolean;
  /**
   * Whether a chip would survive to send time. Read per write: a source can be
   * disposed after the button that offered this write was painted.
   */
  readonly canInsertReference: boolean;
}

/** Which channel took the reference, or that neither did. */
export type ArchInsertionResult = "reference" | "text" | "failed";

/** What the model route reports about one element, as the client reads it. */
export interface ArchElementFacts {
  readonly title?: unknown;
  readonly kind?: unknown;
  readonly technology?: unknown;
}

/** The slice of `GET /arch/api/model` this module reads. */
export interface ArchModelFacts {
  readonly elements?: Readonly<Record<string, ArchElementFacts>>;
  readonly elementSources?: Readonly<Record<string, { readonly file: string; readonly line: number }>>;
  readonly elementCode?: Readonly<Record<string, { readonly file: string }>>;
}

/**
 * Collapse a title to one line of bounded length.
 * @param value - the raw title.
 * @returns the title with runs of whitespace flattened.
 */
function oneLine(value: string): string {
  return value.replace(/\s+/gu, " ").trim();
}

/**
 * Spell one reference record as the text the model reads.
 *
 * Both the payload and the codec go through here so the text a reader sees at
 * insert time and the text the model receives cannot drift apart. The segments
 * are dropped rather than left empty: a `def :0` would read as a real location.
 * @param record - the reference facts.
 * @returns one line of ` · `-separated facts.
 */
function modelTextOf(record: ArchRefRecord): string {
  const head = record.title === "" ? `[arch element ${record.id}]` : `[arch element ${record.id}] ${record.title}`;
  const parts = [head];
  const kind = [record.kind, record.technology].filter(part => part !== "").join(" · ");
  if (kind !== "") parts.push(kind);
  if (record.c4File !== "") parts.push(`def ${record.c4File}:${String(record.c4Line)}`);
  if (record.codeFile !== "") parts.push(`code ${record.codeFile}`);
  return parts.join(" · ");
}

/**
 * Build the three spellings of one element reference.
 *
 * The definition site and the code path are both optional and independent: a
 * model element with no AST entry still references fine, and a title that names
 * no file simply loses the `code` segment.
 * @param id - the element id.
 * @param facts - the element's own fields, as the model route reports them.
 * @param source - the definition site, when the host reported one.
 * @param code - the implementation file, when one was resolved.
 * @returns the payload; no field is ever multi-line.
 */
export function archReferencePayload(
  id: string,
  facts: ArchElementFacts | undefined,
  source?: { readonly file: string; readonly line: number },
  code?: { readonly file: string },
): ArchReferencePayload {
  const title = typeof facts?.title === "string" ? oneLine(facts.title) : "";
  const kindName = typeof facts?.kind === "string" ? oneLine(facts.kind) : "";
  const technology = typeof facts?.technology === "string" ? oneLine(facts.technology) : "";
  const record: ArchRefRecord = {
    id,
    title,
    kind: kindName,
    technology,
    c4File: source?.file ?? "",
    c4Line: source?.line ?? 0,
    codeFile: code?.file ?? "",
  };
  const modelText = modelTextOf(record);
  return {
    kind: "arch.element",
    id,
    title,
    kindName,
    technology,
    c4: source === undefined ? undefined : { file: source.file, line: source.line },
    code: code === undefined ? undefined : { file: code.file },
    label: title === "" ? id : title,
    clipboardText: `[arch element ${id}]`,
    modelText,
    ref: JSON.stringify(record),
  };
}

/**
 * Build a payload straight from one model response.
 *
 * The route is the only place that knows both maps, so the client asks it once
 * and hands the answer here rather than re-deriving anything.
 * @param model - the model response.
 * @param id - the element to reference.
 * @returns the payload, or undefined when the model has no such element.
 */
export function archReferenceFromModel(model: ArchModelFacts, id: string): ArchReferencePayload | undefined {
  const facts = model.elements?.[id];
  if (facts === undefined) return undefined;
  return archReferencePayload(id, facts, model.elementSources?.[id], model.elementCode?.[id]);
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
function decodeRef(ref: string): ArchRefRecord | undefined {
  let parsed: unknown;
  try {
    parsed = JSON.parse(ref);
  } catch {
    return undefined;
  }
  if (parsed === null || typeof parsed !== "object") return undefined;
  const fields = parsed as Partial<Record<keyof ArchRefRecord, unknown>>;
  if (typeof fields.id !== "string" || fields.id === "") return undefined;
  return {
    id: fields.id,
    title: typeof fields.title === "string" ? fields.title : "",
    kind: typeof fields.kind === "string" ? fields.kind : "",
    technology: typeof fields.technology === "string" ? fields.technology : "",
    c4File: typeof fields.c4File === "string" ? fields.c4File : "",
    c4Line: typeof fields.c4Line === "number" ? fields.c4Line : 0,
    codeFile: typeof fields.codeFile === "string" ? fields.codeFile : "",
  };
}

/** The clipboard projection of one chip; the codec's synchronous half. */
export function archRefClipboardText(ref: string): string {
  const record = decodeRef(ref);
  return record === undefined ? `[arch element ${ref}]` : `[arch element ${record.id}]`;
}

/** The model text of one chip; the codec's asynchronous half. */
export function archRefModelText(ref: string): string {
  const record = decodeRef(ref);
  return record === undefined ? `[arch element ${ref}]` : modelTextOf(record);
}

/**
 * Write one element reference into the composer.
 *
 * Order matters: the structured chip is what keeps the reference atomic and
 * clickable, so a plain-text write only happens once the chip path has failed
 * twice. The second attempt re-captures the span because the first attempt's
 * revision may have been superseded by an edit that landed in between.
 * @param deps - the composer capabilities.
 * @param payload - the reference to write.
 * @returns which channel accepted it.
 */
export function insertArchReference(
  deps: ArchInsertionDeps,
  payload: ArchReferencePayload,
): ArchInsertionResult {
  const insert: ArchReferenceInsert = {
    source: ARCH_REFERENCE_SOURCE,
    ref: payload.ref,
    label: payload.label,
    clipboardText: payload.clipboardText,
    appearance: "session",
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
 * The host-side capabilities a chip click needs.
 *
 * The arch tab is a plain `conversation.view` entry, so it gets none of the
 * workbench's view-switching seam: the host's own tab row is the only way to
 * bring it forward, and the only way to ask whether it is already there is to
 * look at that row. Both are injected so the decision stays testable in jsdom
 * and on a host that publishes no tab row at all.
 */
export interface ArchReferenceSeam {
  /** The session on screen, which is what a mismatch is measured against. */
  readonly currentSessionId?: () => string | undefined;
  /** Whether the arch tab is the selected one right now. */
  readonly activeTab?: () => boolean;
  /** Press the arch tab; false when the host's row has no such tab. */
  readonly clickTab?: () => boolean;
}

/**
 * The id a chip's `ref` names.
 * @param ref - the chip's `ref` string.
 * @returns the element id, or undefined when the ref is not ours.
 */
function archRefElementId(ref: string): string | undefined {
  let parsed: unknown;
  try {
    parsed = JSON.parse(ref);
  } catch {
    return undefined;
  }
  if (parsed === null || typeof parsed !== "object") return undefined;
  const id = (parsed as { readonly id?: unknown }).id;
  if (typeof id !== "string") return undefined;
  const trimmed = id.trim();
  return trimmed === "" ? undefined : trimmed;
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
 * Bring the arch tab forward and select one element in it.
 *
 * The request is filed before the tab is pressed, never after: the view mounts
 * lazily on selection, so a request that arrived later would miss the mount
 * that could have consumed it. When the tab is already up there is nothing to
 * press and the request is the whole gesture.
 *
 * A failed press clears the request. The tab row is the only route in, so a
 * click that cannot reach it is a click that will never be honoured; leaving
 * the id behind would move the diagram on the next unrelated mount.
 * @param seam - the host capabilities the click was given.
 * @param sessionId - the session the click came from.
 * @param ref - the chip's `ref` string.
 * @returns whether the click was consumed; false leaves the editor's own gesture.
 */
export function openArchReference(
  seam: ArchReferenceSeam,
  sessionId: string | undefined,
  ref: string,
): boolean {
  const elementId = archRefElementId(ref);
  if (elementId === undefined) return false;
  if (sessionId === undefined || sessionId === "") return false;
  const current = seam.currentSessionId?.();
  // A chip from another session names an element in a model this tab is not
  // showing; selecting it would move a diagram the reader is not looking at.
  if (current !== undefined && current !== sessionId) return false;
  requestArchFocus(elementId);
  if (seam.activeTab?.() === true) return true;
  if (seam.clickTab?.() === true) return true;
  clearArchFocus();
  return false;
}

/**
 * Read the host's tab row as the seam this package needs.
 *
 * Matching is exact on the label, never substring: the row also holds the
 * files, Git and chat tabs, and a "contains" rule would press whichever of them
 * happened to share a word with the arch title.
 * @param doc - the document to search; undefined outside a browser.
 * @param titles - every spelling the arch tab may carry (one per locale).
 * @returns the seam; empty when there is no document to search.
 */
export function archReferenceSeam(
  doc: Document | undefined,
  titles: readonly string[],
): ArchReferenceSeam {
  if (doc === undefined) return {};
  const tabs = (): readonly Element[] => {
    const row = doc.querySelector("[data-conversation-tabs]");
    if (row === null) return [];
    return [...row.querySelectorAll('[role="tab"]')];
  };
  const archTab = (): Element | undefined => {
    const wanted = new Set(titles.map(title => title.trim()).filter(title => title !== ""));
    return tabs().find(tab => wanted.has((tab.textContent ?? "").trim()));
  };
  return {
    activeTab: () => archTab()?.getAttribute("aria-selected") === "true",
    clickTab: () => {
      const tab = archTab();
      if (tab === undefined) return false;
      (tab as Element & { click?(): void }).click?.();
      return true;
    },
  };
}

/** The slice of `ctx.inputTriggers` this package registers into. */
export interface InputTriggersFace {
  registerSource(source: ArchReferenceSource): () => void;
}

/** The source shape, narrowed to what this package fills in. */
export interface ArchReferenceSource {
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
   * gesture when the answer is false, so a host whose tab row has no arch entry
   * leaves the chip inert instead of swallowing the click.
   */
  openReference(session: unknown, activation: unknown): boolean;
}

/**
 * Build the source that gives element chips an identity at send time.
 *
 * It contributes no `@` menu rows: the node action bar is the only way in, and
 * a group that can never match a query would still take a row in the menu. The
 * host requires the source to exist and to have a codec, because send-time
 * serialization looks the codec up by name and rejects the submission when it
 * is missing.
 * @param readSeam - resolves the host capabilities per click, because the tab
 *   row and the session on screen both change under a long-lived source.
 * @returns the source to register.
 */
export function createArchReferenceSource(readSeam: () => ArchReferenceSeam = () => ({})): ArchReferenceSource {
  return {
    trigger: ARCH_REFERENCE_TRIGGER,
    name: ARCH_REFERENCE_SOURCE,
    showGroupTitle: false,
    async candidates() {
      return [];
    },
    onPick() {
      return undefined;
    },
    codec: {
      clipboardText: archRefClipboardText,
      async serialize(ref: string) {
        return archRefModelText(ref);
      },
    },
    openReference(session, activation) {
      const ref = activation !== null && typeof activation === "object"
        ? (activation as { readonly ref?: unknown }).ref
        : undefined;
      if (typeof ref !== "string") return false;
      // The click runs inside the editor's own handler: a seam that throws must
      // leave the chip inert rather than take the composer down with it.
      try {
        const seam = readSeam();
        // A host whose session object carries no id still clicked a chip in the
        // session on screen, so that is the session to address.
        const target = sessionIdOf(session) ?? seam.currentSessionId?.();
        return openArchReference(seam, target, ref);
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

function isInputTriggers(value: unknown): value is InputTriggersFace {
  if (value === null || typeof value !== "object") return false;
  return typeof (value as { registerSource?: unknown }).registerSource === "function";
}

/**
 * Register the element source wherever the host offers the trigger service.
 *
 * `inject` is the primary probe because it also covers a service that loads
 * after this plugin: the callback runs whenever the dependency arrives, and it
 * runs immediately when the dependency is already there. `get` is the second
 * probe for a host that exposes the service but not the scoped injection; it is
 * only tried when `inject` is absent or refused, because registering through
 * both would be a duplicate `trigger`/`name` pair, which the host rejects by
 * throwing.
 * @param ctx - the client context.
 * @param readSeam - resolves the host capabilities per chip click.
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

export function registerArchReferenceSource(
  ctx: ReferenceContextLike,
  readSeam?: () => ArchReferenceSeam,
): ReferenceSourceHandle {
  const source = createArchReferenceSource(readSeam);
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
        }, "dsh-arch: reference source");
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
