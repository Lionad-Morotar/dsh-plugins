/**
 * The preview pane.
 *
 * VS Code's editor area, reduced to what this workbench actually promises: one
 * path, one page of at most {@link PREVIEW_MAX_LINES} lines, a page range, the
 * two page gestures and a copy-path action. The heavy renderers live in lazy
 * chunks; until one arrives (or if it never does) Markdown renders through the
 * dependency-free tree in `markdown.ts` and source files fall back to a plain
 * `<pre>`, so selecting a file always paints something.
 *
 * Which component draws the body is the registry's answer, not this file's: the
 * Markdown reader, the source editor and the three binary families are ordinary
 * contributions registered next to whatever a plugin adds. The pane keeps the
 * toolbar, the paging loader and the state machine, and asks the registry for a
 * body once per path. A file the shared format catalogue claims is handed whole
 * to its family's renderer, in a chunk that carries that family's engine and
 * nothing else; the text pager never sees a binary file, and a family renderer
 * never sees a page.
 */
import { useEffect, useMemo, useRef, useState, useSyncExternalStore, type ReactElement } from "react";

import { BY_ID } from "dsh-text-languages/catalog.ts";

import { FAMILY_CHUNKS } from "../shared.ts";
import { writeClipboard } from "./clipboard.ts";
import type { Translate } from "./copy.ts";
import type { DocumentStore } from "./document-session.ts";
import { renderMarkdown } from "./markdown.ts";
import {
  classifyPreviewFailure,
  createPreviewLoader,
  describePage,
  familyOf,
  IDLE_PREVIEW,
  isMarkdownFile,
  matchLanguage,
  PREVIEW_MAX_LINES,
  type PreviewFailure,
  type PreviewFamily,
  type PreviewLoader,
  type PreviewSnapshot,
  type SymlinkLocator,
} from "./preview.ts";
import {
  hasLanguageChunk,
  loadFamilyChunk,
  loadLanguageChunk,
  loadPreviewChunk,
  type CodePreviewHandle,
  type FamilyChunkModule,
  type PreviewChunkModule,
} from "./preview-chunk.ts";
import {
  createDomSurface,
  createOffsetSurface,
  type FindSourceSink,
  type FindSurface,
} from "./find-surface.ts";
import { PreviewFailureView, PreviewLoadingView } from "./preview-failure.tsx";
import { PreviewFindBar } from "./preview-find.tsx";
import { PREVIEW_CRUMBS_COPY, PreviewCrumbs } from "./preview-crumbs.tsx";
import { isAbsolutePath } from "./model.ts";
import {
  createRendererRegistry,
  loadRenderer,
  type RendererBodyProps,
  type RendererContribution,
  type RendererModule,
  type RendererRegistry,
} from "./renderer-registry.ts";
import {
  createByteReader,
  createGitPreviewReader,
  createPreviewReader,
  followSymlinkReader,
  type GitShowFace,
  type WorkspaceFilesFace,
} from "./wire.ts";

/** Props the view hands the preview pane. */
export interface PreviewPaneProps {
  readonly sessionId?: string;
  readonly files?: WorkspaceFilesFace;
  readonly path?: string;
  /** Commit object id when this panel shows a commit version. */
  readonly revision?: string;
  /** The Git `show` face; only read when {@link revision} is set. */
  readonly git?: GitShowFace;
  readonly t: Translate;
  /**
   * Whether this panel is the active one.
   *
   * The view keeps a pane mounted per open panel and hides the inactive ones, so
   * the pane is the first place that knows a renderer is drawing for nobody.
   * Absent means visible.
   */
  readonly visible?: boolean;
  /**
   * The registry the client service exposes.
   *
   * Absent means the pane is mounted outside the service (a test, a probe); it
   * then uses a pane-local registry with the shipped renderers only.
   */
  readonly renderers?: RendererRegistry;
  /**
   * The shared draft store.
   *
   * The toolbar reads it to paint the save affordance; it never acquires a
   * session here, because a file whose renderer keeps no draft must not gain one
   * just because a toolbar wanted to offer a button.
   */
  readonly documents?: DocumentStore;
  /** Follows a symbolic link the workspace service refused; absent keeps the refusal. */
  readonly locate?: SymlinkLocator;
  /**
   * Opens a file beside the one on screen.
   *
   * The sibling flyout is the caller's gesture, not this pane's: only the view
   * owns the panel stack, so the pane asks rather than acting. Absent means the
   * breadcrumb stays a label.
   */
  readonly onOpenPeer?: (path: string, kind: "file" | "directory") => void;
}

/** Copy this pane owns; the entry merges it into the package namespace. */
export const PREVIEW_COPY = {
  zh: {
    ...PREVIEW_CRUMBS_COPY.zh,
    "preview.crumbs.unavailable": "提交版本与工作区外的路径没有同级面板",
    "preview.save": "保存",
    "preview.saving": "保存中…",
    "preview.saveFailed": "保存失败：{message}",
    "preview.saveUnavailable": "当前部署没有提供保存通道",
    "preview.saveNotReady": "文档还没有读取完成",
    "preview.saveBusy": "正在保存，请稍候",
    "preview.conflict.title": "磁盘文件已变化",
    "preview.conflict.hint": "你的草稿还在内存里，没有被覆盖。",
    "preview.conflict.reload": "重新载入",
    "preview.conflict.discard": "确认丢弃草稿",
    "preview.conflict.discardedTitle": "已载入磁盘版本",
    "preview.conflict.discardedHint": "被丢弃的草稿还留在内存里，可以恢复。",
    "preview.conflict.restore": "恢复草稿",
    "preview.conflict.copy": "复制草稿",
    "preview.conflict.copied": "已复制",
  },
  en: {
    ...PREVIEW_CRUMBS_COPY.en,
    "preview.crumbs.unavailable": "Commit versions and paths outside the workspace expose no sibling panels",
    "preview.save": "Save",
    "preview.saving": "Saving…",
    "preview.saveFailed": "Save failed: {message}",
    "preview.saveUnavailable": "This deployment exposes no save channel",
    "preview.saveNotReady": "The document has not been read yet",
    "preview.saveBusy": "A save is already running",
    "preview.conflict.title": "The file changed on disk",
    "preview.conflict.hint": "Your draft is still in memory; it was not overwritten.",
    "preview.conflict.reload": "Reload",
    "preview.conflict.discard": "Discard draft",
    "preview.conflict.discardedTitle": "The on-disk version is loaded",
    "preview.conflict.discardedHint": "The discarded draft is still in memory; you can restore it.",
    "preview.conflict.restore": "Restore draft",
    "preview.conflict.copy": "Copy draft",
    "preview.conflict.copied": "Copied",
  },
} as const;

const NO_SUBSCRIBE = (): (() => void) => () => undefined;
const NO_DRAFT = (): undefined => undefined;
/** A pane mounted without a stack still renders the crumb row; it just cannot act. */
const noopOpenPeer = (): void => undefined;

/**
 * The human half of a refused save, without the sentence it is embedded in.
 *
 * The pane wraps it in "save failed" and the close bar wraps it in "the panel
 * stays open"; only this function knows which codes have their own wording.
 * @param code - the transport or session failure code.
 * @param message - the backend message, when it sent one.
 * @param t - the explorer's translator.
 * @returns one short reason.
 */
export function saveFailureReason(code: string, message: string, t: Translate): string {
  switch (code) {
    case "unavailable":
      return t("preview.saveUnavailable");
    case "not-ready":
    case "closed":
      return t("preview.saveNotReady");
    case "busy":
      return t("preview.saveBusy");
    default:
      return message === "" ? code : message;
  }
}

type PreviewMode = "reading" | "source";

/** What the pane knows about the renderer chosen for its path. */
type RendererState =
  | { readonly status: "idle" }
  | { readonly status: "loading"; readonly contribution: RendererContribution }
  | { readonly status: "ready"; readonly contribution: RendererContribution; readonly module: RendererModule }
  | { readonly status: "failed"; readonly contribution: RendererContribution; readonly failure: PreviewFailure };

const IDLE_RENDERER: RendererState = { status: "idle" };

/**
 * Suffixes the built-in Markdown reader claims.
 *
 * Derived from the catalogue rather than listed: this was the third copy of the
 * same list, and a copy is what let the reader and the highlighter disagree
 * about whether `.mdx` is markdown.
 */
const MARKDOWN_EXTENSIONS: readonly string[] = (BY_ID.get("markdown")?.extensions ?? []).filter(
  extension => extension.startsWith(".") && !/[*?[\]]/u.test(extension),
);

/**
 * Priority of the built-in source viewer.
 *
 * It is the catch-all, so it has to lose to every contribution that names what
 * it claims: the family viewers and the Markdown reader ship with priority 0,
 * and a plugin that wants to take a format over declares a positive priority.
 */
const SOURCE_RENDERER_PRIORITY = -1000;

/** The block every path paints when the reader for that path cannot read it. */
function UnavailableBody({ t, revision }: { readonly t: Translate; readonly revision?: string }) {
  return (
    <div className="fx-empty" data-testid="fs-preview-unavailable">
      <strong>{t("preview.unavailable.title")}</strong>
      <span>{t(revision === undefined ? "preview.unavailable.description" : "preview.commitUnavailable.description")}</span>
    </div>
  );
}

/**
 * Mount one read-only editor and keep it across page changes.
 *
 * The editor is created once per (chunk, path); a page change is a document
 * replacement plus a gutter renumber, not a destroy/rebuild. If the editor
 * throws (an embedding without a measurable viewport, a DOM the host replaced
 * under us), the same page stays readable as plain text.
 *
 * The grammar is fetched here rather than inside the chunk, and it is fetched
 * alongside the editor rather than after it: the reader gets a usable page as
 * soon as the editor mounts, and the colours arrive when the grammar does. A
 * language with no chunk (most of the catalogue) never reaches the loader at
 * all, so opening a `.rs` file costs exactly zero extra requests.
 */
function CodeSurface({
  chunk,
  text,
  path,
  offset,
  find,
}: {
  readonly chunk: PreviewChunkModule | null;
  readonly text: string;
  readonly path: string;
  readonly offset: number;
  readonly find?: FindSourceSink;
}) {
  const host = useRef<HTMLDivElement>(null);
  const handle = useRef<CodePreviewHandle | null>(null);
  const pageText = useRef(text);
  pageText.current = text;
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [chunk, path]);

  useEffect(() => {
    const element = host.current;
    if (chunk === null || element === null) return;
    try {
      const created = chunk.mountCodePreview(element, { text, path, offset });
      handle.current = created;
      return () => {
        created.destroy();
        handle.current = null;
      };
    } catch {
      setFailed(true);
      return;
    }
    // Page text and offset are applied by the update effect below; rebuilding
    // the editor on every page would drop its scroll and selection state.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chunk, path]);

  // The grammar arrives after the editor does. The token makes a late arrival
  // harmless: a reader who switched files mid-fetch would otherwise get the
  // previous file's grammar applied to this one's document.
  useEffect(() => {
    if (chunk === null) return;
    let live = true;
    const descriptor = matchLanguage(path);
    // Unknown files and decided-monochrome files have no grammar to wait for, so
    // they never reach the loader: the contract is zero requests, not a request
    // that fails.
    if (descriptor === null || !hasLanguageChunk(descriptor.id)) return;
    loadLanguageChunk(descriptor.id).then(
      module => {
        if (!live) return;
        // Re-derive rather than trust the descriptor captured above: the path
        // can change between the fetch starting and the grammar landing.
        const current = matchLanguage(path);
        if (current === null || current.id !== descriptor.id) return;
        handle.current?.setLanguage(module.language());
      },
      // A grammar that never arrives leaves the page monochrome, which is a
      // usable page. Reporting it would put an error over text that is fine.
      () => undefined,
    );
    return () => {
      live = false;
    };
  }, [chunk, path]);

  useEffect(() => {
    handle.current?.update(text, offset);
  }, [text, offset, chunk]);

  // The editor answers in page-text offsets because its document is that text:
  // this shipped viewer is always mounted over one page, unlike the editable
  // bodies another plugin contributes. The scope says so, so the counter names
  // the page instead of promising the whole file.
  useEffect(() => {
    if (find === undefined || chunk === null || failed) return;
    find.register({
      scope: "page",
      text: () => pageText.current,
      select: (from, to) => handle.current?.revealRange(from, to),
      clear: () => handle.current?.clearSelection(),
    });
    return () => find.register(null);
  }, [find, chunk, failed]);

  if (chunk === null || failed) {
    return (
      <pre className="fx-pre" data-testid="fs-preview-plain">
        {text}
      </pre>
    );
  }
  return <div className="fx-code-host" ref={host} data-testid="fs-preview-code" data-renderer={chunk.renderer} />;
}

/**
 * The body a text file keeps when its renderer is still loading or failed.
 *
 * Both built-in text renderers resolve to the same chunk, so this is what they
 * degrade to while it is in flight and after it fails: the reader always gets
 * a page, never a spinner over text the pane already holds.
 */
function FallbackTextBody({ page, path, mode }: RendererBodyProps) {
  const text = page?.text ?? "";
  if (mode === "reading" && isMarkdownFile(path)) {
    return (
      <div className="fx-preview-read" data-testid="fs-preview-markdown" data-renderer="fallback">
        {renderMarkdown(text)}
      </div>
    );
  }
  return (
    <pre className="fx-pre" data-testid="fs-preview-plain">
      {text}
    </pre>
  );
}

/** The built-in Markdown body: reading mode upgrades to GFM once the chunk is in. */
function createMarkdownRenderer(chunk: PreviewChunkModule): RendererModule {
  function MarkdownBody({ page, path, mode, find }: RendererBodyProps) {
    if (mode === "reading") {
      return (
        <div className="fx-preview-read" data-testid="fs-preview-markdown" data-renderer="gfm">
          <chunk.MarkdownView text={page?.text ?? ""} />
        </div>
      );
    }
    return <CodeSurface chunk={chunk} text={page?.text ?? ""} path={path} offset={page?.offset ?? 1} find={find} />;
  }
  return { Body: MarkdownBody, renderer: chunk.renderer };
}

/** The built-in source body: read-only CodeMirror over the held page. */
function createSourceRenderer(chunk: PreviewChunkModule): RendererModule {
  function SourceBody({ page, path, find }: RendererBodyProps) {
    return <CodeSurface chunk={chunk} text={page?.text ?? ""} path={path} offset={page?.offset ?? 1} find={find} />;
  }
  return { Body: SourceBody, renderer: chunk.renderer };
}

/**
 * One binary family's body.
 *
 * The pane already paints its "unavailable" block when the host cannot read
 * bytes; the body repeats that guard because a plugin may mount it directly,
 * and a family viewer does nothing useful without bytes.
 */
function FamilyBody({
  chunk,
  path,
  sessionId,
  files,
  t,
  visible,
  locate,
}: RendererBodyProps & { readonly chunk: FamilyChunkModule }) {
  const readFile = useMemo(() => {
    const reader = createByteReader(files);
    if (reader === undefined || sessionId === undefined || locate === undefined) return reader;
    // The family surface names its own buffers by relative path, so only the
    // file the pane opened is rewritten; a link inside a document stays a link.
    return async (scope: string, target: string, signal: AbortSignal) => {
      if (scope !== sessionId || target !== path) return reader(scope, target, signal);
      const located = await locate(target, signal);
      return reader(scope, located?.absolutePath ?? target, signal);
    };
  }, [files, sessionId, path, locate]);
  if (sessionId === undefined || readFile === undefined) return <UnavailableBody t={t} />;
  return <chunk.FamilyView path={path} sessionId={sessionId} readFile={readFile} t={t} visible={visible} />;
}

/** The built-in body for one binary family. */
function createFamilyRenderer(chunk: FamilyChunkModule): RendererModule {
  return { Body: props => <FamilyBody chunk={chunk} {...props} />, renderer: chunk.renderer };
}

/**
 * The renderers this package ships.
 *
 * They are registered into the same registry a plugin registers into, so "no
 * plugin installed" is the registry's own answer rather than a second branch in
 * the pane. Each `load()` goes through `preview-chunk.ts`, which is what keeps
 * CodeMirror, react-markdown and the three engines out of the entry bundle.
 * @returns the contributions, in registration order.
 */
export function createBuiltinRenderers(): readonly RendererContribution[] {
  return [
    {
      id: "builtin.markdown",
      label: "Markdown",
      match: { extensions: [...MARKDOWN_EXTENSIONS] },
      priority: 0,
      load: () => loadPreviewChunk().then(createMarkdownRenderer),
    },
    {
      id: "builtin.source",
      label: "源码",
      match: {},
      priority: SOURCE_RENDERER_PRIORITY,
      load: () => loadPreviewChunk().then(createSourceRenderer),
    },
    ...(Object.keys(FAMILY_CHUNKS) as PreviewFamily[]).map(family => ({
      id: `builtin.family.${family}`,
      label: family,
      match: { families: [family] },
      priority: 0,
      load: () => loadFamilyChunk(family).then(createFamilyRenderer),
    })),
  ];
}

/** The pane-local registry, for a mount no client service reached. */
let paneRegistry: RendererRegistry | undefined;

/**
 * The registry a bare mount uses.
 *
 * Built once per module: a pane mounted per open file would otherwise register
 * a copy of the built-in table per tab.
 */
function fallbackRegistry(): RendererRegistry {
  if (paneRegistry !== undefined) return paneRegistry;
  const registry = createRendererRegistry();
  for (const contribution of createBuiltinRenderers()) registry.register(contribution);
  paneRegistry = registry;
  return registry;
}

/**
 * Render one selected file.
 * @param props - session, file face, selected path, translator and registry.
 * @returns the preview column.
 */
export function PreviewPane({ sessionId, files, path, revision, git, t, visible = true, renderers, documents, locate, onOpenPeer }: PreviewPaneProps) {
  const reader = useMemo(() => {
    const base =
      revision === undefined
        ? createPreviewReader(files, sessionId)
        : git === undefined || sessionId === undefined
          ? undefined
          : createGitPreviewReader(git, sessionId, revision);
    // A commit version is read from the object store, which has no link to follow.
    return base === undefined || revision !== undefined || locate === undefined ? base : followSymlinkReader(base, locate);
  }, [files, sessionId, revision, git, locate]);
  const byteReader = useMemo(() => (revision === undefined ? createByteReader(files) : undefined), [files, revision]);
  const registry = renderers ?? fallbackRegistry();
  // Resolved once per mount: the pane is created per open file, so the family
  // cannot change under a mounted loader.
  const family = path === undefined ? null : familyOf(path);
  const binary = family !== null;
  // A commit version's bytes belong to the Git object store. Reading them
  // through the workspace file service would show the working tree under the
  // same name, so a revision panel has no byte source on purpose.
  const byteSource =
    revision === undefined && sessionId !== undefined && byteReader !== undefined
      ? { sessionId, readFile: byteReader }
      : null;

  const [loader, setLoader] = useState<PreviewLoader | null>(null);
  const [snapshot, setSnapshot] = useState<PreviewSnapshot>(IDLE_PREVIEW);
  const [rendererState, setRendererState] = useState<RendererState>(IDLE_RENDERER);
  const [rendererRevision, setRendererRevision] = useState(0);
  const [rendererAttempt, setRendererAttempt] = useState(0);
  // Bumped whenever a body changes what it can answer for, so a query typed
  // before the answer existed is counted again instead of staying stale.
  const [findRevision, setFindRevision] = useState(0);
  const [mode, setMode] = useState<PreviewMode>("reading");
  const [copied, setCopied] = useState(false);
  const [draftCopied, setDraftCopied] = useState(false);
  // A binary file has no page, so the follow that names its target lives here.
  const [binaryLink, setBinaryLink] = useState<string | undefined>(undefined);
  // The reload button becomes a confirmation before it drops a dirty draft.
  const [discardArmed, setDiscardArmed] = useState(false);
  // The find bar is a transient surface: opening it is the only state it keeps.
  const [finding, setFinding] = useState(false);
  const bodyHost = useRef<HTMLDivElement>(null);
  // Whichever body published a find source; null means the DOM reading of
  // `.fx-preview-body` is the answer, which is what the shipped fallback
  // renderers need and what every editor body deliberately overrides.
  const editorSurface = useRef<FindSurface | null>(null);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const draftCopyTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // The toolbar is a reader of the shared draft, never its owner: `peek` answers
  // only for a session a renderer already acquired, so a plain text or binary
  // file never grows a save button it cannot honour.
  const draft = useSyncExternalStore(
    documents?.subscribe ?? NO_SUBSCRIBE,
    () => (documents === undefined || sessionId === undefined || path === undefined
      ? NO_DRAFT()
      : documents.peek(sessionId, path)),
    NO_DRAFT,
  );
  const draftSession =
    documents === undefined || sessionId === undefined || path === undefined
      ? undefined
      : documents.find(sessionId, path);

  useEffect(() => {
    if (reader === undefined) {
      setLoader(null);
      return;
    }
    const created = createPreviewLoader({ files: reader, maxLines: PREVIEW_MAX_LINES });
    setLoader(created);
    return () => created.close();
  }, [reader]);

  useEffect(() => {
    if (loader === null) {
      setSnapshot(IDLE_PREVIEW);
      return;
    }
    setSnapshot(loader.getSnapshot());
    return loader.subscribe(() => setSnapshot(loader.getSnapshot()));
  }, [loader]);

  useEffect(() => {
    // A family file is read as bytes by its own renderer; asking the pager for
    // pages of it would spend a read to reach the host's binary refusal.
    if (loader === null || path === undefined || family !== null) return;
    void loader.open(path);
  }, [loader, path, family]);

  useEffect(() => {
    if (!binary || path === undefined || locate === undefined) {
      setBinaryLink(undefined);
      return;
    }
    const controller = new AbortController();
    let alive = true;
    void (async () => {
      const located = await locate(path, controller.signal);
      if (alive && !controller.signal.aborted) setBinaryLink(located?.absolutePath);
    })();
    return () => {
      alive = false;
      controller.abort();
    };
  }, [binary, path, locate]);

  useEffect(() => {
    setMode("reading");
    setCopied(false);
    setDiscardArmed(false);
  }, [path]);

  useEffect(
    () => () => {
      if (copyTimer.current !== undefined) clearTimeout(copyTimer.current);
      if (draftCopyTimer.current !== undefined) clearTimeout(draftCopyTimer.current);
    },
    [],
  );

  // The bar goes away on its own; a stale "copied" label would otherwise greet
  // the next conflict as if the reader had already copied that draft.
  useEffect(() => {
    if (draft?.conflict === true) return;
    setDraftCopied(false);
    setDiscardArmed(false);
    if (draftCopyTimer.current !== undefined) clearTimeout(draftCopyTimer.current);
  }, [draft?.conflict]);

  useEffect(() => {
    // A late registration must be able to take over a pane that is already
    // open, so the pane re-resolves on every registry change instead of
    // freezing the answer it happened to see at mount.
    return registry.subscribe(() => setRendererRevision(value => value + 1));
  }, [registry]);

  // The renderer is fetched only for the winner of the synchronous match; a
  // losing contribution is never downloaded, whatever its priority.
  useEffect(() => {
    // A commit version has no byte reader. Loading its family renderer would
    // ask the working tree for the file and paint the wrong revision.
    if (path === undefined || revision !== undefined) {
      setRendererState(IDLE_RENDERER);
      return;
    }
    const selection = loadRenderer(registry, { path });
    if (selection === undefined) {
      setRendererState(IDLE_RENDERER);
      return;
    }
    const { contribution } = selection;
    let alive = true;
    setRendererState(current =>
      current.status === "ready" && current.contribution.id === contribution.id
        ? current
        : { status: "loading", contribution },
    );
    selection.module.then(
      module => {
        if (alive) setRendererState({ status: "ready", contribution, module });
      },
      (error: unknown) => {
        if (alive) setRendererState({ status: "failed", contribution, failure: classifyPreviewFailure(error) });
      },
    );
    return () => {
      alive = false;
    };
  }, [registry, path, revision, rendererRevision, rendererAttempt]);

  if (path === undefined) {
    return (
      <section className="fx-preview" data-testid="fs-preview" data-state="empty">
        <div className="fx-empty fx-preview-empty" data-testid="fs-preview-empty">
          <strong>{t("preview.empty.title")}</strong>
          <span>{t("preview.empty.description")}</span>
        </div>
      </section>
    );
  }

  const commitBinary = binary && revision !== undefined;
  const page = describePage(snapshot);
  const shownPath = snapshot.linkPath ?? path;
  const linkTarget = binary ? binaryLink : snapshot.linkTarget;
  // A commit version lives in the object store and an absolute path has no
  // workspace listing behind it, so neither can offer siblings; the crumb row
  // stays a label there and the container carries the reason instead.
  const crumbInteractive =
    revision === undefined &&
    sessionId !== undefined &&
    files !== undefined &&
    onOpenPeer !== undefined &&
    !isAbsolutePath(shownPath);
  const markdown = !binary && isMarkdownFile(path);
  const busy = binary
    ? !commitBinary && byteSource !== null && rendererState.status !== "ready" && rendererState.status !== "failed"
    : snapshot.status === "loading";
  // The page gestures exist only on the text path, so this answers for it alone.
  const textReady = snapshot.status === "ready";
  const reading = markdown && mode === "reading";
  const state = binary
    ? commitBinary || byteSource === null
      ? "unavailable"
      : rendererState.status === "failed"
        ? "failed"
        : rendererState.status === "ready"
          ? "ready"
          : "loading"
    : snapshot.status;

  // The marker names the engine actually drawing, so a plugin's renderer is
  // reported by its own chunk rather than by the pane's fallback vocabulary.
  const engine =
    rendererState.status === "ready"
      ? (rendererState.module.renderer ?? rendererState.contribution.id)
      : binary
        ? "pending"
        : reading
          ? "fallback"
          : "plain";

  // A body that can answer for its own offsets publishes a source; the pane
  // turns it into the surface the bar drives. Everything else is found by
  // reading the rendered DOM. The bar asks this on every gesture, so a renderer
  // swap mid-find just works.
  const domSurface = useMemo(() => createDomSurface(() => bodyHost.current), []);
  const surface = useMemo<() => FindSurface>(
    () => () => editorSurface.current ?? domSurface,
    [domSurface],
  );
  const findSourceSink = useMemo<FindSourceSink>(
    () => ({
      register: source => {
        editorSurface.current = source === null ? null : createOffsetSurface(source);
        setFindRevision(value => value + 1);
      },
      // A body under an open query changed its text (an edit, a reload): the
      // counter is a snapshot and has to be taken again. No selection is made
      // here, so the reader's caret stays where they are working.
      invalidate: () => setFindRevision(value => value + 1),
    }),
    [],
  );
  // Anything that replaces the words under the bar re-runs the count: a page
  // change, a mode switch, a renderer arriving, a body publishing its text, a
  // file swap.
  const findStamp = [
    shownPath,
    String(mode),
    snapshot.offset,
    snapshot.text.length,
    engine,
    String(findRevision),
  ].join("|");
  // Binary families draw pixels, not text; a find bar there would have nothing
  // to search and no way to say so honestly.
  const findable = !binary && textReady;

  const bodyProps: RendererBodyProps = {
    path: linkTarget ?? path,
    sessionId,
    files,
    t,
    visible,
    mode,
    ...(binary ? {} : { page: { text: snapshot.text, offset: snapshot.offset } }),
    ...(locate === undefined ? {} : { locate }),
    ...(findable ? { find: findSourceSink } : {}),
  };

  const copyPath = (): void => {
    // A followed link copies the file it names: that is the path a terminal can open.
    void writeClipboard(linkTarget ?? shownPath).then(ok => {
      if (!ok) return;
      setCopied(true);
      if (copyTimer.current !== undefined) clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopied(false), 1400);
    });
  };

  // The conflict answer that never depends on the disk: whatever the reader
  // typed is handed over verbatim, because the alternative is losing it.
  const copyDraft = (): void => {
    const text = draftSession?.copyDraft();
    if (text === undefined) return;
    void writeClipboard(text).then(ok => {
      if (!ok) return;
      setDraftCopied(true);
      if (draftCopyTimer.current !== undefined) clearTimeout(draftCopyTimer.current);
      draftCopyTimer.current = setTimeout(() => setDraftCopied(false), 1400);
    });
  };

  const saveError = draft?.error;
  const showSaveError = saveError !== null && saveError !== undefined && draft?.conflict !== true;
  const conflict = draft?.conflict === true;
  const discarded = draft?.discarded ?? null;
  // After a confirmed reload the bar stays for the one action that still has
  // something to offer: putting the discarded text back as a draft. Once the
  // draft already holds that text (restored and saved) the offer is empty.
  const offerRestore =
    !conflict && discarded !== null && draft?.dirty !== true && discarded !== draft?.text;

  let body: ReactElement;
  if (binary) {
    const Body = rendererState.status === "ready" ? rendererState.module.Body : undefined;
    body =
      commitBinary ? (
        <div className="fx-empty" data-testid="fs-preview-commit-binary">
          <strong>{t("preview.commitBinary.title")}</strong>
          <span>{t("preview.commitBinary.description")}</span>
        </div>
      ) : byteSource === null ? (
        <UnavailableBody t={t} revision={revision} />
      ) : rendererState.status === "failed" ? (
        <PreviewFailureView failure={rendererState.failure} t={t} onRetry={() => setRendererAttempt(value => value + 1)} />
      ) : Body === undefined ? (
        <PreviewLoadingView t={t} />
      ) : (
        <Body {...bodyProps} />
      );
  } else if (reader === undefined) {
    body = <UnavailableBody t={t} revision={revision} />;
  } else if (snapshot.status === "failed") {
    body = (
      <PreviewFailureView
        failure={snapshot.failure ?? { kind: "unknown", code: "", message: "" }}
        t={t}
        onRetry={() => void loader?.retry()}
      />
    );
  } else if (!textReady) {
    body = <PreviewLoadingView t={t} />;
  } else {
    // A registered body that has not arrived yet (or never will) leaves the
    // page readable through the shipped fallback rather than blanking it.
    const Body = rendererState.status === "ready" ? rendererState.module.Body : FallbackTextBody;
    body = <Body {...bodyProps} />;
  }

  return (
    <section
      className="fx-preview"
      data-testid="fs-preview"
      data-state={state}
      data-mode={binary ? "binary" : reading ? "reading" : "code"}
      data-renderer={engine}
    >
      <header className="fx-preview-bar">
        <div
          className="fx-preview-path"
          title={linkTarget === undefined ? shownPath : `${shownPath} \u2192 ${linkTarget}`}
          data-testid="fs-preview-path"
          {...(linkTarget === undefined ? {} : { "data-link": "followed" })}
        >
          <PreviewCrumbs
            path={shownPath}
            sessionId={sessionId}
            files={files}
            t={t}
            interactive={crumbInteractive}
            unavailableReason={t("preview.crumbs.unavailable")}
            onOpenPeer={onOpenPeer ?? noopOpenPeer}
          />
          {linkTarget === undefined ? null : (
            <span className="fx-preview-link" data-testid="fs-preview-link-target">
              {" \u2192 "}
              {linkTarget}
            </span>
          )}
        </div>
        {binary ? null : (
          <span className="fx-preview-range" data-testid="fs-preview-range" title={t("preview.range")}>
            {page.range}
            {page.range === "—" ? null : <> {t("preview.lines")}</>}
            {page.total === undefined ? null : (
              <span className="fx-preview-total">
                {" / "}
                {page.total} {t("preview.lines")}
              </span>
            )}
          </span>
        )}
        <div className="fx-preview-actions">
          {draft === undefined ? null : (
            <button
              type="button"
              className="fx-pbtn"
              data-testid="fs-preview-save"
              disabled={!draft.dirty || draft.saving || draft.status !== "ready"}
              onClick={() => void draftSession?.save()}
            >
              {draft.saving ? t("preview.saving") : t("preview.save")}
            </button>
          )}
          {markdown ? (
            <button
              type="button"
              className="fx-pbtn"
              onClick={() => setMode(current => (current === "reading" ? "source" : "reading"))}
              data-testid="fs-preview-mode"
            >
              {mode === "reading" ? t("preview.source") : t("preview.reading")}
            </button>
          ) : null}
          {binary ? null : (
            <>
              <button
                type="button"
                className="fx-pbtn"
                disabled={!textReady || busy || snapshot.offset <= 1}
                onClick={() => void loader?.prev()}
                data-testid="fs-preview-prev"
              >
                {t("preview.prev")}
              </button>
              <button
                type="button"
                className="fx-pbtn"
                disabled={!textReady || busy || snapshot.eof}
                onClick={() => void loader?.next()}
                data-testid="fs-preview-next"
              >
                {t("preview.next")}
              </button>
            </>
          )}
          {findable ? (
            <button
              type="button"
              className="fx-pbtn"
              data-testid="fs-preview-find"
              data-open={finding ? "true" : "false"}
              title={t("preview.find")}
              aria-label={t("preview.find")}
              aria-pressed={finding}
              onClick={() => setFinding(open => !open)}
            >
              {t("preview.find")}
            </button>
          ) : null}
          <button type="button" className="fx-pbtn" onClick={copyPath} data-testid="fs-preview-copy">
            {copied ? t("preview.copied") : t("preview.copyPath")}
          </button>
          {busy ? <span className="fx-spinner" aria-hidden="true" /> : null}
        </div>
      </header>
      {finding && findable ? (
        <PreviewFindBar t={t} surface={surface} stamp={findStamp} onClose={() => setFinding(false)} />
      ) : null}
      {snapshot.source === "first-parent" ? (
        <div className="fx-preview-notice" data-testid="fs-preview-deleted">
          {t("preview.deletedCommit")}
        </div>
      ) : null}
      {conflict || offerRestore ? (
        <div
          className="fx-conflict"
          role="alert"
          data-testid="fs-preview-conflict"
          data-state={conflict ? "conflict" : "discarded"}
        >
          <strong>{conflict ? t("preview.conflict.title") : t("preview.conflict.discardedTitle")}</strong>
          <span className="fx-conflict-hint">
            {conflict ? t("preview.conflict.hint") : t("preview.conflict.discardedHint")}
          </span>
          <span className="fx-spacer" />
          {conflict ? (
            <button
              type="button"
              className="fx-pbtn"
              data-testid="fs-conflict-reload"
              data-confirm={discardArmed ? "discard" : undefined}
              onClick={() => {
                // A clean draft has nothing to lose, so one click is enough.
                if (!discardArmed && draft?.dirty === true) {
                  setDiscardArmed(true);
                  return;
                }
                setDiscardArmed(false);
                void draftSession?.reload({ force: true });
              }}
            >
              {discardArmed ? t("preview.conflict.discard") : t("preview.conflict.reload")}
            </button>
          ) : null}
          {offerRestore ? (
            <button
              type="button"
              className="fx-pbtn"
              data-testid="fs-conflict-restore"
              onClick={() => {
                if (discarded !== null) draftSession?.setDraft(discarded);
              }}
            >
              {t("preview.conflict.restore")}
            </button>
          ) : null}
          {conflict ? (
            <button type="button" className="fx-pbtn" data-testid="fs-conflict-copy" onClick={copyDraft}>
              {draftCopied ? t("preview.conflict.copied") : t("preview.conflict.copy")}
            </button>
          ) : null}
        </div>
      ) : null}
      {showSaveError ? (
        <div className="fx-save-error" role="alert" data-testid="fs-preview-save-error">
          {t("preview.saveFailed").replace(
            "{message}",
            saveFailureReason(saveError?.code ?? "io-error", saveError?.message ?? "", t),
          )}
        </div>
      ) : null}
      <div className="fx-preview-body" data-scroll={reading ? "y" : "none"} ref={bodyHost}>
        {body}
      </div>
    </section>
  );
}
