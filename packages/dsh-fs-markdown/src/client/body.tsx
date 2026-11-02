/**
 * The Markdown body: one document session, two presentation modes.
 *
 * The body owns the lifecycle around a draft — acquire it, reload it when the
 * panel first becomes visible, release it on unmount — and hands the text to
 * the lazy editor chunk. Reading and source modes are the same editor; the
 * difference is only whether the decoration compartment is switched on.
 *
 * The session, not this component, is the source of truth for the text. The
 * body subscribes to it and never keeps a second copy that could drift after a
 * reload or a save.
 */
import { useEffect, useRef, useState, type ReactElement } from "react";

import { loadEditorChunk, type EditorChunkModule } from "./chunk-loader.ts";
import type {
  DocumentSessionFace,
  DocumentSnapshotFace,
  DocumentStoreFace,
  RendererBodyProps,
} from "./contracts.ts";
import { translatorFor, type Translate } from "./copy.ts";

/** What the body needs from the applied row. */
export interface BodyDeps {
  /** Resolved on every acquire so a late service mount starts working. */
  readonly documents: () => DocumentStoreFace | undefined;
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
 * Fetch the editor chunk once a document is ready to be shown.
 *
 * A failed chunk load degrades to a read-only source view rather than blocking
 * the file: the reader still gets their content, just without the editor.
 */
function useEditorChunk(active: boolean): { readonly chunk: EditorChunkModule | null; readonly failed: boolean } {
  const [chunk, setChunk] = useState<EditorChunkModule | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!active || chunk !== null) return;
    let live = true;
    loadEditorChunk().then(
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

type AcquireState =
  | { readonly status: "pending" }
  | { readonly status: "missing" }
  | { readonly status: "failed"; readonly code: string; readonly message: string }
  | { readonly status: "session"; readonly session: DocumentSessionFace };

/**
 * The body the registry mounts for `.md` / `.markdown`.
 * @param props - path, session, visibility and the pane's current mode.
 * @returns loading, failure, or the editable document.
 */
export function MarkdownBody(props: RendererBodyProps): ReactElement {
  const { path, sessionId, visible, mode } = props;
  const t = deps.t;
  const [acquired, setAcquired] = useState<AcquireState>({ status: "pending" });
  const [snapshot, setSnapshot] = useState<DocumentSnapshotFace | null>(null);
  const [attempt, setAttempt] = useState(0);
  const sessionRef = useRef<DocumentSessionFace | null>(null);

  useEffect(() => {
    setAcquired({ status: "pending" });
    setSnapshot(null);
    sessionRef.current = null;

    if (sessionId === undefined) {
      setAcquired({ status: "failed", code: "no-session", message: "" });
      return;
    }
    const store = deps.documents();
    if (store === undefined) {
      setAcquired({ status: "missing" });
      return;
    }

    const session = store.acquire(sessionId, path);
    sessionRef.current = session;
    setAcquired({ status: "session", session });
    setSnapshot(session.getSnapshot());
    const off = session.subscribe(() => setSnapshot(session.getSnapshot()));

    return () => {
      off();
      session.dispose();
      if (sessionRef.current === session) sessionRef.current = null;
    };
  }, [path, sessionId, attempt]);

  // Reading starts only once the panel is actually visible. Acquiring early is
  // cheap; a hidden panel that read every path it was mounted with would not be.
  useEffect(() => {
    if (visible === false) return;
    if (acquired.status !== "session") return;
    if (snapshot === null || snapshot.status !== "idle") return;
    void acquired.session.reload();
  }, [acquired, snapshot, visible]);

  const retry = (): void => {
    const session = sessionRef.current;
    if (session !== null) {
      void session.reload();
      return;
    }
    setAttempt(value => value + 1);
  };

  const chunk = useEditorChunk(acquired.status === "session" && snapshot?.status === "ready");

  if (acquired.status === "failed") {
    return <FailedBody code={acquired.code} message={acquired.message} t={t} onRetry={retry} />;
  }
  if (acquired.status === "missing") return <UnavailableBody t={t} onRetry={retry} />;
  if (acquired.status !== "session") return <LoadingBody t={t} />;
  if (snapshot === null || snapshot.status === "idle" || snapshot.status === "loading") {
    return <LoadingBody t={t} />;
  }
  if (snapshot.status === "failed") {
    const error = snapshot.error ?? { code: "io-error", message: "" };
    return <FailedBody code={error.code} message={error.message} t={t} onRetry={retry} />;
  }

  if (chunk.chunk !== null) {
    return (
      <div
        className={mode === "source" ? "fmd-source-editor" : "fmd-read"}
        data-testid={mode === "source" ? "fs-md-source" : "fs-md-reading"}
        data-renderer="codemirror"
      >
        <chunk.chunk.EditorBody
          {...props}
          text={snapshot.text}
          onChange={text => acquired.session.setDraft(text)}
          onSave={() => void acquired.session.save()}
        />
      </div>
    );
  }
  if (chunk.failed) {
    return (
      <pre className="fmd-source" data-testid="fs-md-source">
        {snapshot.text}
      </pre>
    );
  }
  return <LoadingBody t={t} />;
}
