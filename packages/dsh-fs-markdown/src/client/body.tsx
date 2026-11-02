/**
 * The Markdown body: one whole document, two modes.
 *
 * Reading mode is the GFM renderer from the lazy chunk; source mode is the
 * literal text in a scrolling `<pre>`. Both modes read the same document, so
 * it is cached per session and path and a mode switch never re-opens the
 * file.
 * The cache is a ref rather than state because reading it must not schedule a
 * render: the effect uses it to decide whether the open call is needed at all.
 */
import { useEffect, useRef, useState, type ReactElement } from "react";

import { loadMarkdownChunk, type MarkdownChunkModule } from "./chunk-loader.ts";
import type { RendererBodyProps } from "./contracts.ts";
import { translatorFor, type Translate } from "./copy.ts";
import { describeFailure, normalizeOpenDocument, type DocumentsResolver } from "./documents.ts";

/** What the body needs from the applied row. */
export interface BodyDeps {
  readonly documents: DocumentsResolver;
  readonly t: Translate;
}

/** Translator and resolver the current apply installed. */
let deps: BodyDeps = { documents: () => undefined, t: translatorFor(undefined) };

/**
 * Install what the applied row provides.
 *
 * Module state on purpose: a repeat apply replaces the services without
 * remounting the panels the host already opened, and the body reads the
 * current pair on its next render or effect.
 * @param next - resolver and translator for this apply.
 */
export function configureBody(next: BodyDeps): void {
  deps = next;
}

interface CachedDocument {
  /** The session is part of the key: the same relative path can name a
   * different file in another workspace. */
  readonly sessionId: string;
  readonly path: string;
  readonly text: string;
}

type BodyState =
  | { readonly status: "loading" }
  | { readonly status: "ready"; readonly text: string }
  | { readonly status: "unavailable" }
  | { readonly status: "failed"; readonly code: string; readonly message: string };

/**
 * Human copy for one failure.
 *
 * The channel's closed vocabulary gets its own sentence; anything else keeps
 * the backend's message, which is the only thing that says why it failed.
 */
function failureText(code: string, message: string, t: Translate): string {
  switch (code) {
    case "too-large":
      return t("md.error.too-large");
    case "not-text":
      return t("md.error.not-text");
    case "no-workspace":
      return t("md.error.no-workspace");
    case "no-session":
      return t("md.error.no-session");
    case "invalid-response":
      return t("md.error.unknown");
    default:
      return message === "" ? t("md.error.unknown") : message;
  }
}

/**
 * Fetch the GFM chunk once a document is ready to be read.
 *
 * A failed chunk load degrades to source mode rather than blocking the file:
 * the reader still gets their content, just without the formatting.
 */
function useMarkdownChunk(active: boolean): { readonly chunk: MarkdownChunkModule | null; readonly failed: boolean } {
  const [chunk, setChunk] = useState<MarkdownChunkModule | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!active || chunk !== null) return;
    let live = true;
    loadMarkdownChunk().then(
      module => {
        if (live) setChunk(module);
      },
      () => {
        if (live) setFailed(true);
      },
    );
    return () => {
      live = false;
    };
  }, [active, chunk]);

  return { chunk, failed };
}

function LoadingBody({ t }: { readonly t: Translate }): ReactElement {
  return (
    <div className="fmd-state" data-testid="fs-md-loading" role="status">
      <span className="fmd-spinner" aria-hidden="true" />
      {t("md.loading")}
    </div>
  );
}

function UnavailableBody({ t, onRetry }: { readonly t: Translate; readonly onRetry: () => void }): ReactElement {
  return (
    <div className="fmd-state" data-testid="fs-md-unavailable">
      <strong>{t("md.unavailable.title")}</strong>
      <p>{t("md.unavailable.description")}</p>
      <button type="button" className="fmd-retry" data-testid="fs-md-retry" onClick={onRetry}>
        {t("md.retry")}
      </button>
    </div>
  );
}

function FailedBody({
  code,
  message,
  t,
  onRetry,
}: {
  readonly code: string;
  readonly message: string;
  readonly t: Translate;
  readonly onRetry: () => void;
}): ReactElement {
  return (
    <div className="fmd-state" data-testid="fs-md-error" data-code={code}>
      <strong>{t("md.error.unknown")}</strong>
      <p>{failureText(code, message, t)}</p>
      <button type="button" className="fmd-retry" data-testid="fs-md-retry" onClick={onRetry}>
        {t("md.retry")}
      </button>
    </div>
  );
}

/**
 * The body the registry mounts for `.md` / `.markdown`.
 * @param props - path, session, visibility and the pane's current mode.
 * @returns loading, failure, source text or the GFM reading surface.
 */
export function MarkdownBody({ path, sessionId, visible, mode }: RendererBodyProps): ReactElement {
  const t = deps.t;
  const cache = useRef<CachedDocument | null>(null);
  const [state, setState] = useState<BodyState>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    // A hidden panel must not start reads; it gets its chance when it becomes
    // visible, because visible is part of this effect's dependencies.
    if (visible === false) return;

    const cached = cache.current;
    if (cached !== null && cached.path === path && cached.sessionId === sessionId) {
      setState({ status: "ready", text: cached.text });
      return;
    }

    const documents = deps.documents();
    if (documents === undefined) {
      setState({ status: "unavailable" });
      return;
    }
    if (sessionId === undefined) {
      setState({ status: "failed", code: "no-session", message: "" });
      return;
    }

    const controller = new AbortController();
    let live = true;
    setState({ status: "loading" });

    try {
      const request = documents.open({ sessionId, path }, controller.signal);
      Promise.resolve(request).then(
        response => {
          if (!live) return;
          const result = normalizeOpenDocument(response);
          if (!result.ok) {
            setState({ status: "failed", code: result.code, message: result.message });
            return;
          }
          cache.current = { sessionId, path, text: result.text };
          setState({ status: "ready", text: result.text });
        },
        (error: unknown) => {
          if (!live) return;
          setState({ status: "failed", code: "io-error", message: describeFailure(error) });
        },
      );
    } catch (error) {
      setState({ status: "failed", code: "io-error", message: describeFailure(error) });
    }

    return () => {
      live = false;
      controller.abort();
    };
    // `mode` is deliberately absent: both modes read the same document, so a
    // switch between them must not touch the channel.
  }, [path, visible, sessionId, attempt]);

  const retry = (): void => setAttempt(value => value + 1);
  const chunk = useMarkdownChunk(mode === "reading" && state.status === "ready");

  if (state.status === "loading") return <LoadingBody t={t} />;
  if (state.status === "unavailable") return <UnavailableBody t={t} onRetry={retry} />;
  if (state.status === "failed") {
    return <FailedBody code={state.code} message={state.message} t={t} onRetry={retry} />;
  }
  if (mode === "source") {
    return (
      <pre className="fmd-source" data-testid="fs-md-source">
        {state.text}
      </pre>
    );
  }
  if (chunk.chunk !== null) {
    return (
      <div className="fmd-read" data-testid="fs-md-reading">
        <chunk.chunk.MarkdownView text={state.text} imageLabel={t("md.image")} />
      </div>
    );
  }
  if (chunk.failed) {
    return (
      <pre className="fmd-source" data-testid="fs-md-source">
        {state.text}
      </pre>
    );
  }
  return <LoadingBody t={t} />;
}
