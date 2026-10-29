/**
 * The preview pane.
 *
 * VS Code's editor area, reduced to what this workbench actually promises: one
 * path, one page of at most {@link PREVIEW_MAX_LINES} lines, a page range, the
 * two page gestures and a copy-path action. The heavy renderers live in the
 * preview chunk; until it arrives (or if it never does) Markdown renders through
 * the dependency-free tree in `markdown.ts` and source files fall back to a
 * plain `<pre>`, so selecting a file always paints something.
 */
import { useEffect, useMemo, useRef, useState, type ReactElement } from "react";

import { writeClipboard } from "./clipboard.ts";
import type { Translate } from "./copy.ts";
import { renderMarkdown } from "./markdown.ts";
import {
  createPreviewLoader,
  describePage,
  IDLE_PREVIEW,
  isMarkdownFile,
  languageFor,
  PREVIEW_MAX_LINES,
  type PreviewFailure,
  type PreviewLoader,
  type PreviewSnapshot,
} from "./preview.ts";
import { loadPreviewChunk, type CodePreviewHandle, type PreviewChunkModule } from "./preview-chunk.ts";
import { createPreviewReader, type WorkspaceFilesFace } from "./wire.ts";

/** Props the view hands the preview pane. */
export interface PreviewPaneProps {
  readonly sessionId?: string;
  readonly files?: WorkspaceFilesFace;
  readonly path?: string;
  readonly t: Translate;
}

type PreviewMode = "reading" | "source";

function failureTitle(failure: PreviewFailure, t: Translate): string {
  switch (failure.kind) {
    case "deleted":
      return t("preview.deleted.title");
    case "denied":
      return t("preview.denied.title");
    case "symlink":
      return t("preview.symlink.title");
    case "binary":
      return t("preview.binary.title");
    case "too-large":
      return t("preview.tooLarge.title");
    case "unavailable":
      return t("preview.unavailable.title");
    default:
      return t("preview.unknown.title");
  }
}

function failureDescription(failure: PreviewFailure, t: Translate): string {
  switch (failure.kind) {
    case "deleted":
      return t("preview.deleted.description");
    case "denied":
      return t("preview.denied.description");
    case "symlink":
      return t("preview.symlink.description");
    case "binary":
      return t("preview.binary.description");
    case "too-large":
      return t("preview.tooLarge.description");
    case "unavailable":
      return t("preview.unavailable.description");
    default:
      return t("preview.unknown.description");
  }
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
 * Render one selected file.
 * @param props - session, file face, selected path and translator.
 * @returns the preview column.
 */
export function PreviewPane({ sessionId, files, path, t }: PreviewPaneProps) {
  const reader = useMemo(() => createPreviewReader(files, sessionId), [files, sessionId]);
  const [loader, setLoader] = useState<PreviewLoader | null>(null);
  const [snapshot, setSnapshot] = useState<PreviewSnapshot>(IDLE_PREVIEW);
  const [chunk, setChunk] = useState<PreviewChunkModule | null>(null);
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
    if (loader === null || path === undefined) return;
    void loader.open(path);
  }, [loader, path]);

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

  // The chunk is fetched only when a file is actually selected: a reader who
  // never opens the preview pays nothing beyond the entry image.
  useEffect(() => {
    if (path === undefined) return;
    let alive = true;
    loadPreviewChunk()
      .then(module => {
        if (alive) setChunk(module);
      })
      .catch(() => {
        if (alive) setChunk(null);
      });
    return () => {
      alive = false;
    };
  }, [path]);

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
  const markdown = isMarkdownFile(path);
  const busy = snapshot.status === "loading";
  const ready = snapshot.status === "ready";
  const reading = markdown && mode === "reading";

  const copyPath = (): void => {
    void writeClipboard(path).then(ok => {
      if (!ok) return;
      setCopied(true);
      if (copyTimer.current !== undefined) clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopied(false), 1400);
    });
  };

  let body: ReactElement;
  if (reader === undefined) {
    body = (
      <div className="fx-empty" data-testid="fs-preview-unavailable">
        <strong>{t("preview.unavailable.title")}</strong>
        <span>{t("preview.unavailable.description")}</span>
      </div>
    );
  } else if (snapshot.status === "failed") {
    const failure = snapshot.failure ?? { kind: "unknown", code: "", message: "" };
    body = (
      <div className="fx-empty" data-state="failed" data-testid="fs-preview-failed" data-kind={failure.kind}>
        <strong>{failureTitle(failure, t)}</strong>
        <span>{failureDescription(failure, t)}</span>
        {failure.message === "" ? null : <code className="fx-preview-hint">{failure.message}</code>}
        <button type="button" className="fx-btn" onClick={() => void loader?.retry()} data-testid="fs-preview-retry">
          {t("preview.retry")}
        </button>
      </div>
    );
  } else if (!ready) {
    body = (
      <div className="fx-loading" data-testid="fs-preview-loading">
        <span className="fx-spinner" aria-hidden="true" />
        {t("preview.loading")}
      </div>
    );
  } else if (reading) {
    body =
      chunk === null ? (
        <div className="fx-preview-read" data-testid="fs-preview-markdown" data-renderer="fallback">
          {renderMarkdown(snapshot.text)}
        </div>
      ) : (
        <div className="fx-preview-read" data-testid="fs-preview-markdown" data-renderer="gfm">
          <chunk.MarkdownView text={snapshot.text} />
        </div>
      );
  } else {
    body = <CodeSurface chunk={chunk} text={snapshot.text} path={path} offset={snapshot.offset} />;
  }

  return (
    <section
      className="fx-preview"
      data-testid="fs-preview"
      data-state={snapshot.status}
      data-mode={reading ? "reading" : "code"}
      data-renderer={reading ? (chunk === null ? "fallback" : "gfm") : (chunk?.renderer ?? "plain")}
    >
      <header className="fx-preview-bar">
        <span className="fx-preview-path" title={path} data-testid="fs-preview-path">
          {path}
        </span>
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
          <button
            type="button"
            className="fx-pbtn"
            disabled={!ready || busy || snapshot.offset <= 1}
            onClick={() => void loader?.prev()}
            data-testid="fs-preview-prev"
          >
            {t("preview.prev")}
          </button>
          <button
            type="button"
            className="fx-pbtn"
            disabled={!ready || busy || snapshot.eof}
            onClick={() => void loader?.next()}
            data-testid="fs-preview-next"
          >
            {t("preview.next")}
          </button>
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
