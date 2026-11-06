/**
 * Attachment selection in the composer, and the clipboard round-trip it enables.
 *
 * The shell renders the draft's attachments in their own rail above the editor,
 * as a sibling of the Lexical surface rather than inside it. That is why
 * select-all can only ever cover the text: `Ctrl+A` is handled by the editor and
 * the editor does not own the rail. The same split makes a plain copy lossy for
 * the other direction — the rail's thumbnails and file cards have no clipboard
 * representation at all, so copying a draft that carries a screenshot yields the
 * text alone.
 *
 * This surface closes both gaps without reimplementing the rail:
 *
 *   - it registers into the same `single` slot cell as the shell's rail and
 *     renders that rail as its own child, so thumbnails, file cards, upload
 *     progress, the drop overlay and the lightbox stay exactly what shipped;
 *   - it owns the *selection* around the rail, because a selection is the one
 *     thing the shipped rail has no concept of. `Ctrl+A` inside the editor marks
 *     every attachment; the mark is drawn as a ring over the rail item, using the
 *     item wrappers the rail already renders rather than any restyling of them;
 *   - it owns the two clipboard events on the composer card. Copy adds the
 *     attachments' absolute paths to what the editor already wrote; paste reads
 *     that payload back and rebuilds the attachments through the same intake the
 *     file picker uses, so limits, uploads and deduplication behave identically.
 *
 * Every mark is cleared by the same rule — anything that changes the selection or
 * the focus drops it — so a ring can never outlive the text selection it belongs
 * to and imply that a Delete would take the attachment with it.
 */
import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

import {
  COMPOSER_CLIPBOARD_MIME,
  baseName,
  composePlainText,
  decodePayload,
  dedupeAttachments,
  encodePayload,
  imageTypeOfPath,
  parsePathList,
  type ClipboardAttachment,
  type ComposerClipboardPayload,
} from "./composer-clipboard.ts";
import { composerBusy } from "./composer-phase.ts";

/** One draft attachment, narrowed to the fields this surface reads. */
export interface DraftAttachmentLike {
  /** Draft-local identity; the rail keys its items on it. */
  readonly id: string;
  /** Which card the rail draws. */
  readonly kind: "image" | "file";
  /** The browser file whose bytes will be sent. */
  readonly file: File;
}

/** The caret span the composer's insert API takes. */
export interface InsertionSpanLike {
  readonly start: number;
  readonly end: number;
  readonly draftRev: number;
}

/**
 * The composer's public insert face.
 *
 * Optional in full: a host that stops providing `inputActions` keeps the copy
 * half of this feature and loses only the text half of a paste.
 */
export interface InputActionsLike {
  captureInsertion?(): InsertionSpanLike;
  insertText?(text: string, span: InsertionSpanLike): boolean;
}

/** One reply from the workspace file reader this surface consumes. */
export type ReaderReply<Value> = { readonly ok: true; readonly value: Value } | { readonly ok: false; readonly error: unknown };

/** The workspace file reader, narrowed to the two calls a paste makes. */
export interface WorkspaceReaderLike {
  stat?(sessionId: string, path: string, signal?: AbortSignal): Promise<ReaderReply<{ readonly bytes?: number }>>;
  readBytes?(
    sessionId: string,
    path: string,
    options: Record<string, never>,
    signal?: AbortSignal,
  ): Promise<ReaderReply<{ readonly data: Uint8Array<ArrayBuffer> }>>;
}

/** Props the shell's attachment rail receives; this shadow reads the same share. */
export interface ComposerAttachmentsProps {
  /** Draft attachments, in selection order. */
  readonly attachments?: readonly DraftAttachmentLike[] | undefined;
  /** Whether the composer will accept a drop right now. */
  readonly canAcceptDrop?: boolean | undefined;
  /** The shell's own intake: validation, draft creation and uploads. */
  readonly onAddFiles?: ((files: readonly File[], directories?: ReadonlySet<File>) => unknown) | undefined;
  /** Remove one draft attachment. */
  readonly onRemoveAttachment?: ((id: string) => void) | undefined;
  /** Per-attachment upload progress, owned by the shell. */
  readonly uploads?: unknown;
  /** Retry a failed file upload. */
  readonly onRetryFile?: ((id: string) => void) | undefined;
  /** Image limits, shown by the drop overlay. */
  readonly dropLimits?: unknown;
  /**
   * Resolve an application-internal drag into its original file.
   *
   * Injected by this package's registration because the shipped rail's own
   * registration (which supplies it from `fileDrag`) is shadowed. Without it a
   * drop of a transcript image throws inside the shipped drop handler.
   */
  readonly readFileDrag?: ((transfer: DataTransfer) => File | undefined) | undefined;
  /** Session the rail belongs to, injected by this package's registration. */
  readonly sessionId?: string | undefined;
  /**
   * The composer's submit phase, read when a paste arrives.
   *
   * A function rather than a value: the input controller mounts with the
   * composer, which can be later than this slot entry's registration.
   */
  readonly phase?: (() => string | undefined) | undefined;
  /** The composer's insert face, a standard Session prop. */
  readonly inputActions?: InputActionsLike | undefined;
  /** This package's namespace translator, from the slot's locale seat. */
  readonly t?: ((key: string, params?: Record<string, unknown>) => string) | undefined;
}

/** What one mount needs but cannot import. */
export interface ComposerAttachmentsDeps {
  /** The shell's own rail component, read from the shadowed slot entry. */
  readonly native: () => ((props: ComposerAttachmentsProps) => ReactNode) | undefined;
  /**
   * Resolve one file's absolute path.
   *
   * Reads the Desktop bridge at call time, not at mount: the bridge is installed
   * by the Electron preload, and in the web shell it never appears at all.
   * @param file - the browser file of a draft attachment.
   * @returns the absolute path, or the empty string when this file has none.
   */
  readonly pathOf: (file: File) => string;
  /** The workspace file reader, or undefined when this host has none. */
  readonly reader: () => WorkspaceReaderLike | undefined;
  /** Translator for this package's namespace, resolved lazily. */
  readonly translate: () => ((key: string, params?: Record<string, unknown>) => string) | undefined;
}

/** Attribute marking one rail item wrapper, so a test and the notice can find it. */
const ITEM_ATTRIBUTE = "data-dsh-better-attach-item";

/** Attribute turning the ring on for one attachment's visible element. */
const SELECTED_ATTRIBUTE = "data-dsh-better-attach-selected";

/** How long a notice stays on screen. */
const NOTICE_MS = 4500;

/** Keys whose modifier combination must not clear the mark before it is used. */
const SELECTION_KEYS = new Set(["a", "c", "x", "insert"]);

/**
 * Keys that are themselves modifiers.
 *
 * Their keydown is the first half of a chord, not a separate gesture: clearing on
 * them would drop the mark before the `Cmd`/`Ctrl` in `Cmd+A` or `Cmd+C` ever
 * reaches the handler that uses it.
 */
const MODIFIER_KEYS = new Set(["meta", "control", "shift", "alt", "altgraph", "capslock", "os"]);

/** The mention grammar's quoted form, used when a path cannot be a bare mention. */
const MENTION_NEEDS_QUOTE = /\s/u;

/** A translator, with the namespace fallback already resolved. */
type Translate = (key: string, params?: Record<string, unknown>) => string;

/**
 * Build the rail component for one plugin instance.
 * @param deps - resolved dependencies.
 * @returns a component for the `conversation.input.attachments` slot.
 */
export function createComposerAttachments(
  deps: ComposerAttachmentsDeps,
): (props: ComposerAttachmentsProps) => ReactNode {
  function ComposerAttachments(props: ComposerAttachmentsProps): ReactNode {
    // Resolved per render rather than once: this entry can register before the
    // shell's own rail lands on the ledger, and freezing that answer would leave
    // the draft's attachments invisible for the rest of the session.
    const Native = deps.native();
    if (Native === undefined) return null;
    return <Rail native={Native} props={props} deps={deps} />;
  }
  return ComposerAttachments;
}

/** Props of the selection-owning rail body. */
interface RailProps {
  readonly native: (props: ComposerAttachmentsProps) => ReactNode;
  readonly props: ComposerAttachmentsProps;
  readonly deps: ComposerAttachmentsDeps;
}

/**
 * The shell's rail, wrapped in the selection and clipboard behaviour.
 *
 * Split from {@link createComposerAttachments} so the delegating branch above
 * holds no hooks: hook order cannot depend on a prop.
 *
 * Mounted whether or not the draft has attachments, because the paste half of
 * this feature is needed precisely when it does not — pasting a copied draft into
 * an empty composer is the common case, and a wrapper that only exists while a
 * rail does would have no listener to receive it. While empty the wrapper leaves
 * the layout alone by not generating a box at all.
 */
function Rail({ native: Native, props, deps }: RailProps): ReactNode {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const [selected, setSelected] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const hasAttachments = (props.attachments ?? []).length > 0;

  // Event listeners are installed once per mount, so everything they need is read
  // through refs that each render refreshes. Without this a listener would close
  // over the props of the render that installed it, and paste into a stale
  // Session or dedupe against a stale attachment list.
  const latest = useRef(props);
  latest.current = props;
  const marked = useRef(selected);
  marked.current = selected;

  const translate = (key: string, params?: Record<string, unknown>): string =>
    props.t?.(key, params) ?? deps.translate()?.(key, params) ?? "";
  const translateRef = useRef(translate);
  translateRef.current = translate;

  // The ring: mark the rail's own elements instead of restyling them, so the mark
  // follows the shell's markup and disappears with it.
  //
  // The mark goes on the *visible* element inside the rail item, not on the item
  // wrapper. A file card paints its own opaque background over the wrapper's box,
  // so an inset ring on the wrapper is drawn underneath it and never appears;
  // the thumbnail and the card are the elements that own the pixels. Both carry
  // their own border radius, so the ring follows the shape it belongs to.
  useEffect(() => {
    const host = hostRef.current;
    if (host === null) return;
    const track = host.querySelector('[role="group"]');
    if (track === null) return;
    for (const item of Array.from(track.children)) {
      if (!(item instanceof HTMLElement)) continue;
      item.toggleAttribute(ITEM_ATTRIBUTE, true);
      const ring = ringTargetOf(item);
      if (ring === null) continue;
      ring.toggleAttribute(SELECTED_ATTRIBUTE, selected);
    }
  }, [selected, props.attachments]);

  useEffect(() => {
    if (notice === null) return;
    const timer = globalThis.setTimeout(() => {
      setNotice(null);
    }, NOTICE_MS);
    return () => {
      globalThis.clearTimeout(timer);
    };
  }, [notice]);

  useEffect(() => {
    const host = hostRef.current;
    if (host === null) return;
    const card = host.closest("[data-composer-card]");
    if (!(card instanceof HTMLElement)) return;
    const ownerDocument = card.ownerDocument;

    /** The editable this card owns, whatever its current state. */
    const editableOf = (target: EventTarget | null): HTMLElement | null => {
      const element =
        target instanceof Element ? target : target instanceof Node ? target.parentElement : null;
      return element?.closest("[contenteditable]") ?? null;
    };

    const clear = (): void => {
      if (marked.current) setSelected(false);
    };

    /**
     * Whether the editor holds a real text selection right now.
     *
     * An empty draft selects nothing, and with nothing selected the browser never
     * fires a `copy` event — so a copy of a draft that is *only* attachments would
     * otherwise write no clipboard at all.
     */
    const hasTextSelection = (): boolean => {
      const selection = card.ownerDocument.getSelection();
      return selection !== null && !selection.isCollapsed && selection.toString() !== "";
    };

    /**
     * Whether an event happened inside this composer.
     *
     * The keydown listener sits on the document, so every chord in the app passes
     * through it; only the ones aimed at this draft may act on its attachments.
     */
    const insideCard = (target: EventTarget | null): boolean =>
      target instanceof Node && card.contains(target);

    const onKeyDown = (event: KeyboardEvent): void => {
      const key = event.key.toLowerCase();
      // A modifier's own keydown is part of the chord that follows, not a gesture
      // that ends the selection: on macOS `Cmd` arrives as its own `Meta` keydown
      // before `Cmd+C`, and clearing there would empty the mark the copy needs.
      if (MODIFIER_KEYS.has(key)) return;
      const chord = event.metaKey || event.ctrlKey;
      if (chord && !event.altKey && key === "a") {
        // The editor selects the text right after this, in its own handler; the
        // rail is marked here so one gesture covers both halves of the draft.
        if (insideCard(event.target) && editableOf(event.target)?.getAttribute("contenteditable") === "true") {
          setSelected(true);
        }
        return;
      }
      if (chord && !event.altKey && key === "c" && marked.current && insideCard(event.target) && !hasTextSelection()) {
        // Attachments-only draft. A copy event does fire here, and the handler
        // below fills its `clipboardData` — but Chromium commits only the selected
        // content, so with an empty selection every write is discarded and the
        // clipboard ends up empty. The async clipboard API writes the system
        // clipboard directly and is the only path that survives that case; the
        // cost is the structured flavour, which a bare path list does not need:
        // the paste side reads a pure path list on its own.
        event.preventDefault();
        copyPathsOnly(latest.current, deps, setNotice, translateRef.current);
        return;
      }
      // Copy and cut are the gestures the mark exists for. Cut takes the text
      // only — attachments are not removable by a keystroke — so the mark is
      // dropped by the next key or click rather than here.
      if (chord && !event.altKey && SELECTION_KEYS.has(key)) return;
      clear();
    };

    // A pointer gesture anywhere ends the mark: the click moves the caret, so the
    // text selection the ring belongs to is gone. Listening on the document
    // rather than the card covers the case where the click lands outside it —
    // the transcript, the sidebar — where the mark would otherwise outlive the
    // selection it was drawn for.
    const onPointerDown = (): void => {
      clear();
    };

    const onCopy = (event: ClipboardEvent): void => {
      const current = latest.current;
      const attachments = current.attachments ?? [];
      const data = event.clipboardData;
      if (!marked.current || attachments.length === 0 || data === null) return;
      const entries: ClipboardAttachment[] = [];
      const pathless: string[] = [];
      for (const attachment of attachments) {
        const path = deps.pathOf(attachment.file);
        if (path === "") {
          pathless.push(attachment.file.name);
          continue;
        }
        entries.push({ path, name: attachment.file.name, type: attachment.file.type, kind: attachment.kind });
      }
      if (entries.length > 0) {
        // The editor wrote the text flavour on its way up to this listener, so
        // this reads what shipped and appends rather than reimplementing the
        // editor's own serialization. Not preventing the default keeps the
        // shell's `text/html` flavour intact for rich targets.
        const text = data.getData("text/plain");
        data.setData(COMPOSER_CLIPBOARD_MIME, encodePayload({ text, attachments: entries }));
        data.setData("text/plain", composePlainText(text, entries.map(entry => entry.path)));
      }
      if (pathless.length > 0) {
        setNotice(translateRef.current("attach.copySkipped", { count: String(pathless.length) }));
      }
    };

    const onPaste = (event: ClipboardEvent): void => {
      const data = event.clipboardData;
      if (data === null) return;
      // Only the draft editor is this surface's business: the rail's own controls
      // and the composer's buttons keep their native paste behaviour.
      if (editableOf(event.target) === null) return;
      // A real file paste (Finder, another application) already has the shell's
      // own intake path, and it is better than anything this listener could do.
      if (Array.from(data.types).includes("Files")) return;
      const readProps = (): ComposerAttachmentsProps => latest.current;
      const payload = decodePayload(data.getData(COMPOSER_CLIPBOARD_MIME));
      const parsed = payload === undefined ? parsePathList(data.getData("text/plain")) : undefined;
      // Not this surface's paste: leave it to whatever the editor does with it.
      if (payload === undefined && parsed === undefined) return;
      // From here the paste is a draft this surface owns. While a submission is
      // in flight the host freezes the editor, so `insertText` answers false and
      // the payload would disappear without a trace; claim the event and say why
      // instead. The draft is deliberately not written by another route.
      const busyNotice = pasteBusyNotice(latest.current.phase?.(), translateRef.current);
      if (busyNotice !== undefined) {
        event.preventDefault();
        event.stopPropagation();
        setNotice(busyNotice);
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      clear();
      if (payload !== undefined) {
        consume(payload, readProps, deps, setNotice, translateRef.current);
        return;
      }
      if (parsed === undefined) return;
      consume(
        {
          text: parsed.text,
          attachments: parsed.paths.map(path => {
            const type = imageTypeOfPath(path) ?? "";
            return { path, name: baseName(path), type, kind: type === "" ? "file" : "image" } as const;
          }),
        },
        readProps,
        deps,
        setNotice,
        translateRef.current,
      );
    };

    // Keydown is captured on the document, ahead of the composer's own keymap: the
    // editor handles chords like Cmd+C on the way down, and a listener further in
    // the tree would never be asked whether the attachments should go too.
    ownerDocument.addEventListener("keydown", onKeyDown, true);
    // Capture, so the shell's own paste handler never sees a payload this surface
    // is about to consume: it would insert the path block as literal text.
    card.addEventListener("paste", onPaste, true);
    // Tab-ing out of the composer also ends the text selection, so the mark goes
    // with it. A focus move that stays inside the card (to a remove button, say)
    // is not an end.
    const onFocusOut = (event: FocusEvent): void => {
      const next = event.relatedTarget;
      if (next instanceof Node && card.contains(next)) return;
      clear();
    };
    card.addEventListener("focusout", onFocusOut);
    // Copy is listened for on the document, not on the card: a copy event fired by
    // `execCommand` — which is how an attachments-only draft gets one at all —
    // targets the document rather than the focused element, so a card-scoped
    // listener never sees it. The mark is the scope: without it this handler does
    // nothing, and anything that could copy elsewhere clears the mark first.
    ownerDocument.addEventListener("copy", onCopy);
    ownerDocument.addEventListener("pointerdown", onPointerDown, true);
    return () => {
      ownerDocument.removeEventListener("keydown", onKeyDown, true);
      ownerDocument.removeEventListener("copy", onCopy);
      card.removeEventListener("paste", onPaste, true);
      card.removeEventListener("focusout", onFocusOut);
      ownerDocument.removeEventListener("pointerdown", onPointerDown, true);
    };
    // `deps` is created once per plugin apply and never replaced; the props it
    // would otherwise capture are read through `latest` above.
  }, [deps]);

  return (
    // `dshBetter_railHost` gives the notice a positioning context and the rail a
    // wrapper; `dshBetter_railHostEmpty` removes the box entirely, because the
    // composer card is a flex column with a 12px gap and a box here would push
    // the editor down for a surface with no content.
    <div ref={hostRef} className={hasAttachments ? "dshBetter_railHost" : "dshBetter_railHostEmpty"}>
      <Native {...props} />
      {notice !== null && (
        <div className="dshBetter_attachNotice" role="status">
          {notice}
        </div>
      )}
    </div>
  );
}

/**
 * The notice a draft paste shows while the composer cannot take it.
 *
 * The host freezes the editor for every phase but `plain`, so a paste then is
 * refused by `insertText`. Leaving it at that would look exactly like an empty
 * clipboard, so the refusal is surfaced instead.
 * @param phase - the composer's published phase, when the host offers one.
 * @param translate - namespace translator.
 * @returns the text to show, or undefined when the paste may proceed.
 */
export function pasteBusyNotice(
  phase: string | undefined,
  translate: (key: string) => string,
): string | undefined {
  return composerBusy(phase) ? translate("attach.pasteBusy") : undefined;
}

/**
 * Copy an attachments-only draft: a bare path list on the clipboard.
 *
 * Used when the draft has no text, because a `copy` event's `clipboardData` is
 * discarded without a selection. The list is the same shape {@link parsePathList}
 * reads back, so pasting it here rebuilds the attachments and pasting it anywhere
 * else gives a person usable paths.
 * @param props - composer props in effect.
 * @param deps - resolved dependencies.
 * @param notify - show a one-line notice.
 * @param translate - namespace translator.
 */
function copyPathsOnly(
  props: ComposerAttachmentsProps,
  deps: ComposerAttachmentsDeps,
  notify: (text: string) => void,
  translate: Translate,
): void {
  const attachments = props.attachments ?? [];
  const paths: string[] = [];
  let pathless = 0;
  for (const attachment of attachments) {
    const path = deps.pathOf(attachment.file);
    if (path === "") pathless += 1;
    else paths.push(path);
  }
  if (paths.length > 0) {
    // The gesture that got here is the user activation this call needs; a failure
    // is the browser refusing the write, which the notice reports rather than
    // leaving the clipboard silently unchanged.
    void globalThis.navigator?.clipboard?.writeText(composePlainText("", paths)).catch(() => {
      notify(translate("attach.copyFailed"));
    });
  }
  if (pathless > 0) notify(translate("attach.copySkipped", { count: String(pathless) }));
}

/**
 * Rebuild one pasted payload: the text where the caret was, then the attachments
 * through the shell's own intake.
 *
 * The text goes in synchronously and before any await, because the caret span it
 * replaces is only valid until the next editor revision and the reads below are
 * asynchronous.
 * @param payload - what the clipboard carried.
 * @param readProps - the composer props in effect right now.
 * @param deps - resolved dependencies.
 * @param notify - show a one-line notice.
 * @param translate - namespace translator.
 */
function consume(
  payload: ComposerClipboardPayload,
  readProps: () => ComposerAttachmentsProps,
  deps: ComposerAttachmentsDeps,
  notify: (text: string) => void,
  translate: Translate,
): void {
  const first = readProps();
  insertText(first, payload.text);
  if (payload.attachments.length === 0) return;

  const reader = deps.reader();
  const sessionId = first.sessionId;
  if (reader === undefined || sessionId === undefined) {
    // No reader (the web shell without the workspace-file bundle) or no Session
    // yet: keep the paths as text instead of dropping the paste on the floor.
    insertText(first, payload.attachments.map(entry => entry.path).join("\n"));
    return;
  }

  const existing = (first.attachments ?? [])
    .map(attachment => deps.pathOf(attachment.file))
    .filter(path => path !== "");
  const { accepted } = dedupeAttachments(payload.attachments, existing);
  if (accepted.length === 0) return;

  void (async () => {
    const files: File[] = [];
    const mentions: string[] = [];
    let missing = 0;
    for (const entry of accepted) {
      const outcome = await materialize(reader, sessionId, entry);
      if (outcome.kind === "file") files.push(outcome.file);
      else if (outcome.kind === "mention") mentions.push(outcome.mention);
      else missing += 1;
    }
    // Re-read after the awaits: the composer may have re-rendered, or switched
    // Session, while the bytes were being read.
    const current = readProps();
    if (mentions.length > 0) insertText(current, mentions.join(" "));
    if (files.length > 0) current.onAddFiles?.(files);
    if (missing > 0) notify(translate("attach.pasteMissing", { count: String(missing) }));
    if (mentions.length > 0) notify(translate("attach.pasteReferenced", { count: String(mentions.length) }));
  })();
}

/**
 * Insert plain text at the composer's caret.
 * @param props - composer props carrying the insert face.
 * @param text - text to insert; empty is a no-op.
 */
function insertText(props: ComposerAttachmentsProps, text: string): void {
  if (text === "") return;
  const actions = props.inputActions;
  const span = actions?.captureInsertion?.();
  if (actions?.insertText === undefined || span === undefined) return;
  actions.insertText(text, span);
}

/** What one pasted attachment turned into. */
type Materialized =
  | { readonly kind: "file"; readonly file: File }
  | { readonly kind: "mention"; readonly mention: string }
  | { readonly kind: "missing" };

/**
 * Turn one pasted path back into an attachment.
 *
 * The bytes come from the workspace reader, which is the same authorized path the
 * sidebar's file previews use, so a pasted path can reach any file the Session can
 * read rather than only files inside the workspace. A path that exists but cannot
 * be read whole — the reader caps a complete read — degrades to the composer's own
 * mention spelling, which is what the shell does with a non-image file dragged in
 * from the Desktop application.
 * @param reader - workspace file reader.
 * @param sessionId - Session whose filesystem resolves the path.
 * @param entry - one pasted attachment.
 * @returns the rebuilt attachment, the fallback mention, or nothing.
 */
async function materialize(
  reader: WorkspaceReaderLike,
  sessionId: string,
  entry: ClipboardAttachment,
): Promise<Materialized> {
  const read = await reader.readBytes?.(sessionId, entry.path, {});
  if (read !== undefined && read.ok) {
    return { kind: "file", file: new File([read.value.data], entry.name, { type: entry.type }) };
  }
  // Distinguish "the file is gone" from "it exists but is too large to carry":
  // only the second one is worth leaving a reference for.
  const stat = await reader.stat?.(sessionId, entry.path);
  if (stat !== undefined && stat.ok) return { kind: "mention", mention: mentionOf(entry.path) };
  return { kind: "missing" };
}

/**
 * The element inside one rail item that actually paints the attachment.
 *
 * Two shapes exist: an image item is a 64px square whose visible surface is the
 * thumbnail button holding the preview, and a file item is the card itself. The
 * thumbnail is recognised by the `<img>` it wraps rather than by any class name,
 * which is a per-build hash.
 * @param item - one child of the rail's item track.
 * @returns the element to draw the ring on, or null when the item has no surface.
 */
function ringTargetOf(item: HTMLElement): HTMLElement | null {
  const thumbnail = item.querySelector("img")?.parentElement;
  if (thumbnail !== null && thumbnail !== undefined) return thumbnail;
  const first = item.firstElementChild;
  return first instanceof HTMLElement ? first : null;
}

/**
 * Format one path in the composer's mention grammar.
 * @param path - absolute path.
 * @returns the mention, quoted when the path contains whitespace.
 */
function mentionOf(path: string): string {
  return MENTION_NEEDS_QUOTE.test(path) ? `@"${path}"` : `@${path}`;
}
