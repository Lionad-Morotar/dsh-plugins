/**
 * Commit references: the payload a chip carries, the trigger source that gives
 * it an identity at send time, and the two-channel writer that puts it in the
 * composer.
 *
 * The host splits writing in two. The span must come from the composer's
 * `captureInsertion()` (detect coordinates plus a draft revision); the chip
 * itself is written through the session input facade's `insertReference`, which
 * refuses a stale revision with a silent `false` rather than throwing. So the
 * retry and the plain-text fallback are this module's job, not the host's.
 */
import type { GitCommitDetail } from "../host/types.ts";
import { VIEW_ID } from "../shared.ts";

/** The source name the chip is filed under; the host looks the codec up by it. */
export const GIT_REFERENCE_SOURCE = "lionad.git";

/** The trigger the source declares. Identity only: it never lists candidates. */
export const GIT_REFERENCE_TRIGGER = "@";

/** A subject longer than this is cut in the chip label, which is one line. */
const LABEL_SUBJECT_LIMIT = 60;

/**
 * The facts one commit reference carries, as the chip's `ref` stores them.
 *
 * The `ref` string is the only field that survives to send time, so it holds
 * everything the model text needs and the codec rebuilds the text from it.
 */
interface CommitRefRecord {
  readonly hash: string;
  readonly subject: string;
  readonly refs: readonly string[];
  readonly author: string;
  /** `YYYY-MM-DD`, resolved where the commit time is known. */
  readonly date: string;
  readonly short: string;
}

/** Everything one commit reference needs, in the three spellings the host uses. */
export interface CommitReferencePayload {
  readonly kind: "git.commit";
  /** Full hash: the identity the model must be able to act on. */
  readonly id: string;
  /** Chip text: short hash and subject on one line. */
  readonly label: string;
  /** Draft text when the chip is copied out or the chip path is unavailable. */
  readonly clipboardText: string;
  /** What the model reads in place of the chip. */
  readonly modelText: string;
  /**
   * The chip's `ref`: the same facts as JSON. The host keeps this string and
   * nothing else, so the codec has to be able to rebuild `modelText` from it.
   */
  readonly ref: string;
}

/** The span the composer hands out; only `captureInsertion` may produce one. */
export interface ReferenceSpan {
  readonly start: number;
  readonly end: number;
  readonly draftRev: number;
}

/** The one structured-reference write the facade exposes. */
export interface ReferenceInsert {
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
export interface ReferenceInsertionDeps {
  readonly captureSpan: () => ReferenceSpan | undefined;
  readonly insertReference: (insert: ReferenceInsert, span: ReferenceSpan) => boolean;
  readonly insertText: (text: string, span: ReferenceSpan) => boolean;
  /**
   * Whether a chip would survive to send time.
   *
   * The host serializes a chip by looking its source's codec up by name and
   * rejects the submission when it is missing, keeping the draft. A chip whose
   * source never registered is therefore worse than plain text: it strands the
   * draft. Read per write, because a source can be disposed after the entry
   * probed it.
   */
  readonly canInsertReference: boolean;
}

/** Which channel took the reference, or that neither did. */
export type ReferenceInsertionResult = "reference" | "text" | "failed";

/**
 * Collapse a commit subject to one line of bounded length.
 * @param subject - the commit's subject line.
 * @returns the subject, cut at a word boundary where one is close enough.
 */
function oneLineSubject(subject: string): string {
  const flat = subject.replace(/\s+/gu, " ").trim();
  if (flat.length <= LABEL_SUBJECT_LIMIT) return flat;
  const cut = flat.slice(0, LABEL_SUBJECT_LIMIT);
  const space = cut.lastIndexOf(" ");
  // A space in the last quarter is a word boundary worth respecting; earlier
  // than that the cut would lose too much of the subject to be worth it.
  const body = space > LABEL_SUBJECT_LIMIT * 0.75 ? cut.slice(0, space) : cut;
  return `${body.trimEnd()}…`;
}

/**
 * Format a commit time as `YYYY-MM-DD` in the reader's zone.
 *
 * The panel already renders commit times in local time, so the reference does
 * too: a date that disagreed with the row above it would read as a bug.
 * @param time - commit time in Unix seconds.
 * @returns the local calendar date, or an empty string for a non-finite time.
 */
export function commitReferenceDate(time: number): string {
  if (!Number.isFinite(time)) return "";
  const at = new Date(time * 1000);
  if (Number.isNaN(at.getTime())) return "";
  const pad = (value: number): string => String(value).padStart(2, "0");
  return `${String(at.getFullYear())}-${pad(at.getMonth() + 1)}-${pad(at.getDate())}`;
}

/**
 * Spell one reference record as the text the model reads.
 *
 * Both the payload and the codec go through here so the text a reader sees at
 * insert time and the text the model receives cannot drift apart.
 * @param record - the reference facts.
 * @returns a single line of ` · `-separated facts, never with an empty segment.
 */
function modelTextOf(record: CommitRefRecord): string {
  // The bracket and the subject are one phrase; the remaining facts are a
  // ` · ` list after it, so the text reads as `[git commit <hash>] <subject>`.
  const head =
    record.subject === "" ? `[git commit ${record.hash}]` : `[git commit ${record.hash}] ${record.subject}`;
  const parts = [head];
  const refs = record.refs.filter(name => name.trim() !== "").join(", ");
  if (refs !== "") parts.push(refs);
  if (record.author !== "") parts.push(record.author);
  if (record.date !== "") parts.push(record.date);
  return parts.join(" · ");
}

/**
 * Collect the record for one commit.
 * @param detail - the loaded commit.
 * @param shortHash - the abbreviation the panel displays.
 * @param refs - ref names pointing at this commit.
 * @returns the record the payload and the chip's `ref` are both built from.
 */
function commitRefRecord(
  detail: GitCommitDetail,
  shortHash: string,
  refs: readonly string[],
): CommitRefRecord {
  return {
    hash: detail.hash,
    subject: oneLineSubject(detail.subject),
    refs: refs.filter(name => name.trim() !== ""),
    author: detail.author,
    date: commitReferenceDate(detail.time),
    short: shortHash,
  };
}

/**
 * Build the three spellings of one commit reference.
 *
 * `shortHash` is passed in rather than derived: the panel's existing
 * `formatCommitDetail` already owns the abbreviation width, and two places
 * deciding it is how a chip and its row start disagreeing.
 * @param detail - the loaded commit.
 * @param shortHash - the abbreviation the panel displays.
 * @param refs - ref names pointing at this commit, if the caller has them.
 * @returns the payload; no field is ever empty or multi-line.
 */
export function commitReferencePayload(
  detail: GitCommitDetail,
  shortHash: string,
  refs: readonly string[] = [],
): CommitReferencePayload {
  const record = commitRefRecord(detail, shortHash, refs);
  return {
    kind: "git.commit",
    id: detail.hash,
    label: record.subject === "" ? shortHash : `${shortHash} ${record.subject}`,
    clipboardText: `[git commit ${shortHash}]`,
    modelText: modelTextOf(record),
    ref: JSON.stringify(record),
  };
}

/**
 * Encode the reference as the `ref` string a chip carries.
 * @param detail - the loaded commit.
 * @param shortHash - the abbreviation the panel displays.
 * @param refs - ref names pointing at this commit.
 * @returns a JSON string, never empty.
 */
export function encodeCommitRef(
  detail: GitCommitDetail,
  shortHash: string,
  refs: readonly string[] = [],
): string {
  return JSON.stringify(commitRefRecord(detail, shortHash, refs));
}

/**
 * Decode a chip's `ref` back into model text.
 *
 * A malformed ref must not block the send: the host treats a throwing codec as
 * a failed submission and keeps the draft, which would strand a chip the reader
 * can no longer explain. Falling back to the raw ref keeps the send possible.
 * @param ref - the chip's `ref` string.
 * @returns the model text for this occurrence.
 */
export function commitRefModelText(ref: string): string {
  let parsed: unknown;
  try {
    parsed = JSON.parse(ref);
  } catch {
    return `[git commit ${ref}]`;
  }
  if (parsed === null || typeof parsed !== "object") return `[git commit ${ref}]`;
  const fields = parsed as Partial<Record<keyof CommitRefRecord, unknown>>;
  if (typeof fields.hash !== "string" || fields.hash === "") return `[git commit ${ref}]`;
  return modelTextOf({
    hash: fields.hash,
    subject: typeof fields.subject === "string" ? fields.subject : "",
    refs: Array.isArray(fields.refs)
      ? fields.refs.filter((name): name is string => typeof name === "string")
      : [],
    author: typeof fields.author === "string" ? fields.author : "",
    date: typeof fields.date === "string" ? fields.date : "",
    short: typeof fields.short === "string" ? fields.short : "",
  });
}

/** The clipboard projection of one chip; the codec's synchronous half. */
export function commitRefClipboardText(ref: string): string {
  try {
    const parsed = JSON.parse(ref) as Partial<Record<keyof CommitRefRecord, unknown>>;
    if (typeof parsed.short === "string" && parsed.short !== "") return `[git commit ${parsed.short}]`;
  } catch {
    // A ref that is not our JSON is spelled as-is below.
  }
  return `[git commit ${ref}]`;
}

/**
 * Write one commit reference into the composer.
 *
 * Order matters: the structured chip is what keeps the reference atomic and
 * clickable, so a plain-text write only happens once the chip path has failed
 * twice. The second attempt re-captures the span because the first attempt's
 * revision may have been superseded by an edit that landed in between.
 * @param deps - the composer capabilities.
 * @param payload - the reference to write.
 * @returns which channel accepted it.
 */
export function insertCommitReference(
  deps: ReferenceInsertionDeps,
  payload: CommitReferencePayload,
): ReferenceInsertionResult {
  const insert: ReferenceInsert = {
    source: GIT_REFERENCE_SOURCE,
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

/** What the detail header knows about the composer when it decides the button. */
export interface ReferenceAvailabilityInput {
  readonly sessionId: string | undefined;
  /** The composer face is present and can at least take plain text. */
  readonly hasComposer: boolean;
  /** The input phase, or undefined on a host that does not publish one. */
  readonly phase: string | undefined;
  /** Whether this package's trigger source registered, so a chip can be sent. */
  readonly sourceAvailable: boolean;
}

/** Whether the reference button may be pressed, and why not when it may not. */
export type ReferenceAvailability =
  | { readonly enabled: true }
  | { readonly enabled: false; readonly reasonKey: string };

/**
 * Decide whether the reference button is usable.
 *
 * A missing `insertReference` is deliberately not a disable: the writer degrades
 * to plain text, and a reference that lands as text is still a reference the
 * model can read. Only the cases where nothing could be written disable the
 * button.
 *
 * The phase gate is `plain` alone. `claimed` would also be accepted by the host,
 * but a claimed draft is one where a command chip owns the line, and dropping a
 * commit reference into it is not what the reader asked for.
 * @param input - what the header knows about the composer.
 * @returns enabled, or the copy key naming the reason.
 */
export function referenceAvailability(input: ReferenceAvailabilityInput): ReferenceAvailability {
  if (input.sessionId === undefined) return { enabled: false, reasonKey: "reference.disabled.noSession" };
  if (!input.hasComposer) return { enabled: false, reasonKey: "reference.disabled.noComposer" };
  // Without the source a chip would be inserted and then refused at send time,
  // which is the one outcome worse than plain text: the draft is stranded.
  if (!input.sourceAvailable) return { enabled: false, reasonKey: "reference.disabled.noSource" };
  // An unpublished phase is not evidence of a busy composer: a host that does
  // not expose one is trusted to refuse the write itself.
  if (input.phase !== undefined && input.phase !== "plain") {
    return { enabled: false, reasonKey: "reference.disabled.busy" };
  }
  return { enabled: true };
}

/**
 * The seam a chip click drives to bring the Git view forward.
 *
 * Every member is optional because the host hands these capabilities out
 * piecemeal: the session-addressed `views` seam exists only while a
 * conversation-header row holds the host's `openView`, the focus queue arrived
 * in a later core, and a host may expose any subset. A missing member degrades
 * to the next path rather than failing the click.
 */
export interface GitReferenceSeam {
  /** Open a view for one session and deliver the focus with it. */
  readonly openView?: (sessionId: string, viewId: string, focus: string) => boolean;
  /** Leave a focus for a view that is mounted lazily. */
  readonly requestFocus?: (viewId: string, focus: string) => void;
  /** Withdraw a queued focus; used when the switch it was queued for failed. */
  readonly takeFocus?: (viewId: string) => void;
  /** Switch the view through the host's own tab row, which carries no focus. */
  readonly openViewOrSwitch?: (
    viewId: string,
    focus?: string,
  ) => { readonly opened: boolean; readonly focused: boolean };
  /** The session on screen, which is what a mismatch is measured against. */
  readonly currentSessionId?: () => string | undefined;
}

/**
 * Read the workbench service as the seam this package needs.
 *
 * The service is probed, not assumed: the members below live on different
 * contract versions, and a host that offers only the older `openView` still
 * switches the view, just without a session argument to address it with.
 * @param workbench - the workbench service, or whatever the context held.
 * @returns the seam; empty when the service is absent.
 */
export function gitReferenceSeam(workbench: unknown): GitReferenceSeam {
  if (workbench === null || typeof workbench !== "object") return {};
  const face = workbench as {
    readonly views?: { open?(sessionId: string, id: string, focus?: string): boolean | void };
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
    // The core's `views.open` answers `boolean`, but the view-side face widens
    // it to `boolean | void`; only a literal true means the focus was delivered.
    openView:
      typeof scopedOpen === "function"
        ? (sessionId, viewId, focus) => scopedOpen.call(views, sessionId, viewId, focus) === true
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
      typeof queueTake === "function"
        ? viewId => {
            queueTake.call(queue, viewId);
          }
        : undefined,
    openViewOrSwitch:
      typeof switchView === "function" ? (viewId, focus) => switchView.call(face, viewId, focus) : undefined,
    currentSessionId:
      typeof currentSessionId === "function" ? () => currentSessionId.call(face) : undefined,
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
 * The commit hash a chip's `ref` names, normalized for the view's focus parser.
 *
 * `parseCommitFocus` accepts 4-64 hex, so a ref whose hash is not that shape is
 * refused here rather than handed over and silently ignored by the view, which
 * would switch the tab and leave the cursor where it was.
 * @param ref - the chip's `ref` string.
 * @returns the lowercase hash, or undefined when the ref is not ours.
 */
function commitRefHash(ref: string): string | undefined {
  let parsed: unknown;
  try {
    parsed = JSON.parse(ref);
  } catch {
    return undefined;
  }
  if (parsed === null || typeof parsed !== "object") return undefined;
  const hash = (parsed as { readonly hash?: unknown }).hash;
  if (typeof hash !== "string") return undefined;
  const normalized = hash.trim().toLowerCase();
  return /^[0-9a-f]{4,64}$/u.test(normalized) ? normalized : undefined;
}

/**
 * Bring the Git view forward and select one commit.
 *
 * The focus carries the full hash from the chip, not the abbreviation it
 * displays: the view accepts a 4-64 hex prefix, but the short hash is a display
 * width the panel decides, not an identity.
 *
 * The three paths are tried in order of how much they can deliver. The
 * session-addressed seam carries the focus itself. Failing that, the focus is
 * queued first and the view switched second, because the view is mounted
 * lazily: queued after the switch it would arrive after the mount that could
 * have consumed it. A queue left behind by a switch that did not land is
 * withdrawn, since the latest focus is a "where the reader wants to be"
 * statement and replaying it on the next unrelated mount would move the cursor
 * under them.
 * @param seam - the view-switching capabilities the host offered.
 * @param sessionId - the session the click came from.
 * @param ref - the chip's `ref` string.
 * @returns whether the click was consumed; false leaves the editor's own gesture.
 */
export function openGitReference(seam: GitReferenceSeam, sessionId: string | undefined, ref: string): boolean {
  const hash = commitRefHash(ref);
  if (hash === undefined) return false;
  if (sessionId === undefined || sessionId === "") return false;
  const current = seam.currentSessionId?.();
  // A chip from another session names a commit in a repository this view is not
  // showing; selecting it would point the history at something it never loaded.
  if (current !== undefined && current !== sessionId) return false;
  const focus = `commit:${hash}`;
  if (seam.openView?.(sessionId, VIEW_ID, focus) === true) return true;
  if (seam.requestFocus !== undefined) {
    seam.requestFocus(VIEW_ID, focus);
    const switched = seam.openViewOrSwitch?.(VIEW_ID);
    if (switched?.opened === true) return true;
    seam.takeFocus?.(VIEW_ID);
    return false;
  }
  // No queue to hand the focus to, so the switch has to carry it or the reader
  // would land in the view with the history wherever they left it.
  return seam.openViewOrSwitch?.(VIEW_ID, focus)?.focused === true;
}

/** The slice of `ctx.inputTriggers` this package registers into. */
export interface InputTriggersFace {
  registerSource(source: GitReferenceSource): () => void;
}

/** The source shape, narrowed to what this package fills in. */
export interface GitReferenceSource {
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
   * gesture when the answer is false, so a host without the workbench simply
   * leaves the chip inert instead of swallowing the click.
   */
  openReference(session: unknown, activation: unknown): boolean;
}

/**
 * Build the source that gives commit chips an identity at send time.
 *
 * It contributes no `@` menu rows: the panel's button is the only way in, and a
 * group that can never match a query would still take a row in the menu. The
 * host only requires the source to exist and to have a codec, because send-time
 * serialization looks the codec up by name and rejects the submission when it
 * is missing.
 * @param readSeam - resolves the view-switching seam per click, because the
 *   workbench service may mount after this source is registered.
 * @returns the source to register.
 */
export function createGitReferenceSource(readSeam: () => GitReferenceSeam = () => ({})): GitReferenceSource {
  return {
    trigger: GIT_REFERENCE_TRIGGER,
    name: GIT_REFERENCE_SOURCE,
    showGroupTitle: false,
    async candidates() {
      return [];
    },
    onPick() {
      return undefined;
    },
    codec: {
      clipboardText: commitRefClipboardText,
      async serialize(ref: string) {
        return commitRefModelText(ref);
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
        return openGitReference(seam, target, ref);
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
 * Register the commit source wherever the host offers the trigger service.
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
 * @param readSeam - resolves the view-switching seam per chip click.
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

export function registerGitReferenceSource(
  ctx: ReferenceContextLike,
  readSeam?: () => GitReferenceSeam,
): ReferenceSourceHandle {
  const source = createGitReferenceSource(readSeam);
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
        }, "dsh-git-explorer: commit reference source");
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
