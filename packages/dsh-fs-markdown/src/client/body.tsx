/**
 * The editable body, shared by every text file this plugin claims.
 *
 * The body owns the lifecycle around a draft — acquire it, reload it when the
 * panel first becomes visible, release it on unmount — and hands the text to the
 * lazy editor chunk. The session, not this component, is the source of truth for
 * the text: the body subscribes to it and never keeps a second copy that could
 * drift after a reload or a save.
 *
 * One body serves both renderers because the difference between them is a
 * presentation flag, not a different lifecycle. Markdown turns the decoration
 * layer on and calls its two modes reading and source; every other text file
 * turns it off and has one mode, because there is nothing to render.
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
 * Whether one snapshot can be edited at all.
 *
 * Two states look ready but cannot be saved: an explorer half that predates the
 * write channel reports no `saving` field, and a file the channel refused as
 * `too-large` has text but no write path. An editor over either would accept
 * keystrokes and drop them, so both degrade to a read-only view that says why.
 * @param snapshot - the acquired session's current state.
 * @returns true when the editor may take input.
 */
export function isEditable(snapshot: DocumentSnapshotFace): boolean {
  if (snapshot.status !== "ready") return false;
  // `saving` is absent only on an explorer half that predates the write channel.
  return snapshot.saving !== undefined;
}

/**
 * The read-only view a file keeps when it cannot be edited.
 *
 * It is the same text the editor would have shown, plus one line naming the
 * reason: a reader who cannot type deserves to know that it is the deployment
 * and not the file. The `too-large` refusal never reaches here — it is a read
 * failure with its own message and retry, which is the answer Markdown already
 * gives and the one a reader can act on.
 */
function ReadOnlyBody({ text, testId }: { readonly text: string; readonly testId: string }): ReactElement {
  return (
    <div className="fmd-readonly" data-testid="fs-md-readonly">
      <p className="fmd-readonly-note" data-testid="fs-md-readonly-note">
        当前部署没有保存通道，只能只读阅读
      </p>
      <pre className="fmd-source" data-testid={testId}>
        {text}
      </pre>
    </div>
  );
}

/** How one renderer presents the shared body. */
export interface EditableBodyOptions {
  /** Whether the cursor-block decoration layer is on. Markdown only. */
  readonly decorate: boolean;
  /**
   * `data-testid` of the mounted surface.
   *
   * A function of the mode because Markdown's two modes are two different
   * surfaces to a reader and to the acceptance probes; a renderer with one mode
   * answers the same id either way.
   */
  readonly testId: (mode: RendererBodyProps["mode"]) => string;
  /** `data-testid` of the read-only fallback shown when the chunk fails to load. */
  readonly fallbackTestId: string;
}

/**
 * Build the body one renderer mounts.
 *
 * The two renderers differ only in how they present the document, so the
 * lifecycle is built once here rather than duplicated per claim.
 * @param options - presentation flags for this renderer.
 * @returns the component the registry mounts.
 */
export function createEditableBody(options: EditableBodyOptions) {
  const { decorate, testId, fallbackTestId } = options;

  function EditableBody(props: RendererBodyProps): ReactElement {
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

    if (chunk.chunk !== null && isEditable(snapshot)) {
      // The class decides the typography, and only a decorated surface has a
      // reading presentation. A code file is always the mono editor, whatever
      // mode the pane happens to be in: the pane defaults to `reading` and only
      // offers the toggle for Markdown.
      const surfaceClass = decorate ? (mode === "source" ? "fmd-source-editor" : "fmd-read") : "fmd-source-editor";
      return (
        <div className={surfaceClass} data-testid={testId(mode)} data-renderer="codemirror">
          <chunk.chunk.EditorBody
            {...props}
            text={snapshot.text}
            decorate={decorate}
            onChange={text => acquired.session.setDraft(text)}
            onSave={() => void acquired.session.save()}
          />
        </div>
      );
    }
    // No write path: show the text and say why, rather than mounting an editor
    // that would accept keystrokes and drop them.
    if (!isEditable(snapshot)) {
      return <ReadOnlyBody text={snapshot.text} testId={fallbackTestId} />;
    }
    if (chunk.failed) {
      return (
        <pre className="fmd-source" data-testid={fallbackTestId}>
          {snapshot.text}
        </pre>
      );
    }
    return <LoadingBody t={t} />;
  }

  return EditableBody;
}

/**
 * The body the registry mounts for `.md` / `.markdown`.
 *
 * Reading and source are the same editor; the flag only decides whether the
 * cursor-block decoration layer is on.
 */
export const MarkdownBody = createEditableBody({
  decorate: true,
  testId: mode => (mode === "source" ? "fs-md-source" : "fs-md-reading"),
  fallbackTestId: "fs-md-source",
});

/**
 * The body the registry mounts for every other text file.
 *
 * No decoration layer: the planner behind it understands Markdown only, and
 * running it over TypeScript would hide characters it mistook for markers. The
 * pane offers no reading mode for these, so both answers name the same surface.
 */
export const TextEditorBody = createEditableBody({
  decorate: false,
  testId: () => "fs-text-editor",
  fallbackTestId: "fs-text-source",
});
