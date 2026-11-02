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
import { useEffect, useMemo, useRef, useState, type ReactElement } from "react";

import { FAMILY_CHUNKS } from "../shared.ts";
import { writeClipboard } from "./clipboard.ts";
import type { Translate } from "./copy.ts";
import { renderMarkdown } from "./markdown.ts";
import {
  classifyPreviewFailure,
  createPreviewLoader,
  describePage,
  familyOf,
  IDLE_PREVIEW,
  isMarkdownFile,
  languageFor,
  PREVIEW_MAX_LINES,
  type PreviewFailure,
  type PreviewFamily,
  type PreviewLoader,
  type PreviewSnapshot,
} from "./preview.ts";
import {
  loadFamilyChunk,
  loadPreviewChunk,
  type CodePreviewHandle,
  type FamilyChunkModule,
  type PreviewChunkModule,
} from "./preview-chunk.ts";
import { PreviewFailureView, PreviewLoadingView } from "./preview-failure.tsx";
import {
  createRendererRegistry,
  loadRenderer,
  type RendererBodyProps,
  type RendererContribution,
  type RendererModule,
  type RendererRegistry,
} from "./renderer-registry.ts";
import { createByteReader, createPreviewReader, type WorkspaceFilesFace } from "./wire.ts";

/** Props the view hands the preview pane. */
export interface PreviewPaneProps {
  readonly sessionId?: string;
  readonly files?: WorkspaceFilesFace;
  readonly path?: string;
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
}

type PreviewMode = "reading" | "source";

/** What the pane knows about the renderer chosen for its path. */
type RendererState =
  | { readonly status: "idle" }
  | { readonly status: "loading"; readonly contribution: RendererContribution }
  | { readonly status: "ready"; readonly contribution: RendererContribution; readonly module: RendererModule }
  | { readonly status: "failed"; readonly contribution: RendererContribution; readonly failure: PreviewFailure };

const IDLE_RENDERER: RendererState = { status: "idle" };

/** Suffixes the built-in Markdown reader owns; mirrors `languageFor`'s table. */
const MARKDOWN_EXTENSIONS = [".md", ".mdx", ".markdown", ".mdown"] as const;

/**
 * Priority of the built-in source viewer.
 *
 * It is the catch-all, so it has to lose to every contribution that names what
 * it claims: the family viewers and the Markdown reader ship with priority 0,
 * and a plugin that wants to take a format over declares a positive priority.
 */
const SOURCE_RENDERER_PRIORITY = -1000;

/** The block every path paints when the file face cannot read it. */
function UnavailableBody({ t }: { readonly t: Translate }) {
  return (
    <div className="fx-empty" data-testid="fs-preview-unavailable">
      <strong>{t("preview.unavailable.title")}</strong>
      <span>{t("preview.unavailable.description")}</span>
    </div>
  );
}

/**
 * Mount one read-only editor and keep it across page changes.
 *
 * The editor is created once per (chunk, path, language); a page change is a
 * document replacement plus a gutter renumber, not a destroy/rebuild. If the
 * editor throws (an embedding without a measurable viewport, a DOM the host
 * replaced under us), the same page stays readable as plain text.
 */
function CodeSurface({
  chunk,
  text,
  path,
  offset,
}: {
  readonly chunk: PreviewChunkModule | null;
  readonly text: string;
  readonly path: string;
  readonly offset: number;
}) {
  const host = useRef<HTMLDivElement>(null);
  const handle = useRef<CodePreviewHandle | null>(null);
  const [failed, setFailed] = useState(false);
  const language = languageFor(path);

  useEffect(() => {
    setFailed(false);
  }, [chunk, path]);

  useEffect(() => {
    const element = host.current;
    if (chunk === null || element === null) return;
    try {
      const created = chunk.mountCodePreview(element, { text, language, path, offset });
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
  }, [chunk, path, language]);

  useEffect(() => {
    handle.current?.update(text, offset);
  }, [text, offset, chunk]);

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
  function MarkdownBody({ page, path, mode }: RendererBodyProps) {
    if (mode === "reading") {
      return (
        <div className="fx-preview-read" data-testid="fs-preview-markdown" data-renderer="gfm">
          <chunk.MarkdownView text={page?.text ?? ""} />
        </div>
      );
    }
    return <CodeSurface chunk={chunk} text={page?.text ?? ""} path={path} offset={page?.offset ?? 1} />;
  }
  return { Body: MarkdownBody, renderer: chunk.renderer };
}

/** The built-in source body: read-only CodeMirror over the held page. */
function createSourceRenderer(chunk: PreviewChunkModule): RendererModule {
  function SourceBody({ page, path }: RendererBodyProps) {
    return <CodeSurface chunk={chunk} text={page?.text ?? ""} path={path} offset={page?.offset ?? 1} />;
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
}: RendererBodyProps & { readonly chunk: FamilyChunkModule }) {
  const readFile = useMemo(() => createByteReader(files), [files]);
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
export function PreviewPane({ sessionId, files, path, t, visible = true, renderers }: PreviewPaneProps) {
  const reader = useMemo(() => createPreviewReader(files, sessionId), [files, sessionId]);
  const byteReader = useMemo(() => createByteReader(files), [files]);
  const registry = renderers ?? fallbackRegistry();
  // Resolved once per mount: the pane is created per open file, so the family
  // cannot change under a mounted loader.
  const family = path === undefined ? null : familyOf(path);
  const binary = family !== null;
  // The path decides which read the pane needs, and the pair travels together
  // because a renderer cannot read without a session to resolve against.
  const byteSource =
    sessionId !== undefined && byteReader !== undefined ? { sessionId, readFile: byteReader } : null;

  const [loader, setLoader] = useState<PreviewLoader | null>(null);
  const [snapshot, setSnapshot] = useState<PreviewSnapshot>(IDLE_PREVIEW);
  const [rendererState, setRendererState] = useState<RendererState>(IDLE_RENDERER);
  const [rendererRevision, setRendererRevision] = useState(0);
  const [rendererAttempt, setRendererAttempt] = useState(0);
  const [mode, setMode] = useState<PreviewMode>("reading");
  const [copied, setCopied] = useState(false);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

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
    setMode("reading");
    setCopied(false);
  }, [path]);

  useEffect(
    () => () => {
      if (copyTimer.current !== undefined) clearTimeout(copyTimer.current);
    },
    [],
  );

  useEffect(() => {
    // A late registration must be able to take over a pane that is already
    // open, so the pane re-resolves on every registry change instead of
    // freezing the answer it happened to see at mount.
    return registry.subscribe(() => setRendererRevision(value => value + 1));
  }, [registry]);

  // The renderer is fetched only for the winner of the synchronous match; a
  // losing contribution is never downloaded, whatever its priority.
  useEffect(() => {
    if (path === undefined) {
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
  }, [registry, path, rendererRevision, rendererAttempt]);

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

  const page = describePage(snapshot);
  const markdown = !binary && isMarkdownFile(path);
  const busy = binary
    ? byteSource !== null && rendererState.status !== "ready" && rendererState.status !== "failed"
    : snapshot.status === "loading";
  // The page gestures exist only on the text path, so this answers for it alone.
  const textReady = snapshot.status === "ready";
  const reading = markdown && mode === "reading";
  const state = binary
    ? byteSource === null
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
      ? reading
        ? "gfm"
        : (rendererState.module.renderer ?? rendererState.contribution.id)
      : binary
        ? "pending"
        : reading
          ? "fallback"
          : "plain";

  const bodyProps: RendererBodyProps = {
    path,
    sessionId,
    files,
    t,
    visible,
    mode,
    ...(binary ? {} : { page: { text: snapshot.text, offset: snapshot.offset } }),
  };

  const copyPath = (): void => {
    void writeClipboard(path).then(ok => {
      if (!ok) return;
      setCopied(true);
      if (copyTimer.current !== undefined) clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopied(false), 1400);
    });
  };

  let body: ReactElement;
  if (binary) {
    const Body = rendererState.status === "ready" ? rendererState.module.Body : undefined;
    body =
      byteSource === null ? (
        <UnavailableBody t={t} />
      ) : rendererState.status === "failed" ? (
        <PreviewFailureView failure={rendererState.failure} t={t} onRetry={() => setRendererAttempt(value => value + 1)} />
      ) : Body === undefined ? (
        <PreviewLoadingView t={t} />
      ) : (
        <Body {...bodyProps} />
      );
  } else if (reader === undefined) {
    body = <UnavailableBody t={t} />;
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
        <span className="fx-preview-path" title={path} data-testid="fs-preview-path">
          {path}
        </span>
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
          <button type="button" className="fx-pbtn" onClick={copyPath} data-testid="fs-preview-copy">
            {copied ? t("preview.copied") : t("preview.copyPath")}
          </button>
          {busy ? <span className="fx-spinner" aria-hidden="true" /> : null}
        </div>
      </header>
      <div className="fx-preview-body" data-scroll={reading ? "y" : "none"}>
        {body}
      </div>
    </section>
  );
}
