/// <reference path="../pdf-worker.d.ts" />
/**
 * The pdf body and viewer: bytes in, one page on a canvas, paging controls.
 *
 * pdf.js is the only engine in this package that needs a worker, and the worker
 * cannot be fetched: a plugin's chunks are served from a versioned asset route
 * with no sibling files, so `GlobalWorkerOptions.workerSrc` has nothing to
 * resolve against. The worker source is therefore inlined into this chunk at
 * build time and turned into a `blob:` URL here, then handed to pdf.js as an
 * explicit `workerPort`. That is also why the artifact may not contain a
 * relative `pdf.worker.mjs` reference at all: the build folds pdf.js's Node
 * branch away so the literal never reaches the bundle.
 *
 * Two mount shapes come out of here because the host has two:
 *
 *   - `Body` is the native document body. In renderer mode it owns the read and
 *     must settle exactly once with `loaded`/`failed`.
 *   - `Viewer` is the dsh-better-sidebar viewer, which reads the bytes itself and
 *     hands them over as `customData`.
 *
 * Both funnel into `PdfSurface`, which owns the document lifecycle: one loading
 * task per (bytes, attempt), destroyed on unmount. A leaked task keeps a worker
 * alive for the life of the page, and opening a few PDFs is enough to notice.
 */
import { getDocument, PDFWorker, type PDFDocumentProxy } from "pdfjs-dist";
import { workerSource } from "virtual:pdf-worker";
import { useEffect, useMemo, useRef, useState } from "react";

import { parseSessionFileAddress } from "../address.ts";
import type { NativeBodyProps, SidebarViewerProps } from "../contracts.ts";
import { formatMessage } from "../locale.ts";
import type { ReportMark } from "../mount.ts";
import { UNREPORTED, failureMessage, shouldSettle } from "../mount.ts";
import { canvasSize, clampPage, fitWidthScale, loadFailureKey, pageBounds, workerUrl } from "../pdf.ts";

/** How one document's load is going. */
type LoadState =
  | { readonly kind: "loading" }
  | { readonly kind: "ready"; readonly doc: PDFDocumentProxy }
  | { readonly kind: "failed"; readonly message: string };

/**
 * How the current page's paint is going.
 *
 * Kept apart from {@link LoadState} on purpose: a page that will not rasterize
 * (an unsupported blend mode, a canvas the browser refused) is not a document
 * that will not open. Folding the two together would throw away a parsed document
 * and its page count over one bad paint, which is the failure a reader is least
 * able to work around.
 */
type PaintState =
  | { readonly kind: "painting" }
  | { readonly kind: "painted" }
  | { readonly kind: "failed"; readonly message: string };

/**
 * Build the worker pdf.js should use, once per surface mount.
 *
 * `workerPort` is the only injection point that does not go through a URL: pdf.js
 * takes the port and never consults `workerSrc`, so there is no path for it to
 * guess. The blob URL is revoked as soon as the worker has been constructed,
 * because the constructor has already fetched the source by then.
 * @returns the worker, or null where the platform has no Worker.
 */
function createPdfWorker(): Worker | null {
  if (typeof Worker === "undefined" || typeof URL === "undefined" || typeof URL.createObjectURL !== "function") {
    // No worker available: pdf.js falls back to running the parser on the main
    // thread, which is slower but correct. Returning null keeps that path.
    return null;
  }
  const url = workerUrl(workerSource, blob => URL.createObjectURL(blob));
  try {
    const worker = new Worker(url, { type: "module" });
    return worker;
  } finally {
    // The worker holds its own copy of the source once constructed.
    URL.revokeObjectURL(url);
  }
}

/**
 * Whether a thrown value is pdf.js saying the render was cancelled.
 *
 * A page turn cancels the render that was drawing the old page, and pdf.js
 * answers that with a rejection. It is the expected outcome of the turn, not a
 * page that cannot be drawn, so the surface has to tell the two apart or every
 * fast page turn would paint an error over a page that is about to render.
 *
 * The name is checked rather than the class: the exception is exported, but a
 * bundler is free to give it a different identity than the one this module
 * imported, and the name is what pdf.js itself writes.
 * @param error - whatever the render rejected with.
 * @returns true when the render was cancelled on purpose.
 */
function isCancellation(error: unknown): boolean {
  const name = typeof error === "object" && error !== null ? (error as { name?: unknown }).name : undefined;
  return name === "RenderingCancelledException";
}

/**
 * The pdf surface: one document, one visible page, paging controls.
 * @param props - bytes, translator, settle callback.
 * @returns the page canvas, or a status line while it loads.
 */
function PdfSurface(props: {
  readonly bytes: Uint8Array;
  readonly t: (key: string, values?: Record<string, string | number>) => string;
  readonly onSettled?: (ok: boolean, attempt: number) => void;
  readonly visible?: boolean;
}): React.ReactElement {
  const { bytes, t, onSettled, visible } = props;
  const [state, setState] = useState<LoadState>({ kind: "loading" });
  const [paint, setPaint] = useState<PaintState>({ kind: "painting" });
  const [page, setPage] = useState(1);
  const [attempt, setAttempt] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const hostRef = useRef<HTMLDivElement | null>(null);
  const settledRef = useRef(onSettled);
  settledRef.current = onSettled;

  useEffect(() => {
    let disposed = false;
    let task: ReturnType<typeof getDocument> | null = null;
    let worker: Worker | null = null;
    setState({ kind: "loading" });
    setPage(1);

    void (async () => {
      try {
        worker = createPdfWorker();
        task = getDocument({
          // pdf.js transfers the buffer to the worker, which would detach the
          // caller's view. Handing it a copy keeps the bytes usable for a retry.
          data: new Uint8Array(bytes),
          // An explicit port is the only injection point that never consults
          // `workerSrc`, so pdf.js has no URL to guess at. `create` is the
          // documented factory; the constructor's published types narrow `port`
          // to null, which is a JSDoc default artifact rather than the runtime.
          ...(worker === null ? {} : { worker: PDFWorker.create({ port: worker }) }),
          // Nothing may be fetched: fonts and colour profiles travel with the
          // document or are not used at all.
          disableFontFace: false,
          useSystemFonts: false,
        });
        const doc = await task.promise;
        if (disposed) {
          void doc.destroy();
          return;
        }
        setState({ kind: "ready", doc });
        settledRef.current?.(true, attempt);
      } catch (error) {
        if (disposed) return;
        setState({ kind: "failed", message: t(loadFailureKey(error)) });
        settledRef.current?.(false, attempt);
      }
    })();

    return () => {
      disposed = true;
      // Destroying the task tears down the worker pdf.js owns; the port we
      // created is ours, so it is terminated here too.
      void task?.destroy();
      worker?.terminate();
    };
  }, [bytes, attempt, t]);

  // Draw the current page whenever it, the document or the container changes.
  useEffect(() => {
    if (state.kind !== "ready") return;
    const canvas = canvasRef.current;
    const host = hostRef.current;
    if (canvas === null || host === null) return;

    let cancelled = false;
    // The task the current attempt is drawing with. A page turn has to cancel it
    // before the next attempt touches the same canvas: pdf.js refuses a second
    // render on a canvas that already has one, so without this a fast page turn
    // surfaces as a paint failure rather than a repaint. It is assigned late
    // because `getPage` is awaited, so the cleanup has to cope with a turn that
    // happened before there was anything to cancel.
    let renderTask: { cancel(): void; promise: Promise<void> } | null = null;
    setPaint({ kind: "painting" });
    void (async () => {
      try {
        const doc = state.doc;
        const index = clampPage(page, doc.numPages);
        const proxy = await doc.getPage(index + 1);
        if (cancelled) return;
        const base = proxy.getViewport({ scale: 1 });
        const scale = fitWidthScale(host.clientWidth, { width: base.width, height: base.height });
        const viewport = proxy.getViewport({ scale });
        const size = canvasSize({ width: viewport.width, height: viewport.height }, globalThis.devicePixelRatio ?? 1);
        canvas.width = size.width;
        canvas.height = size.height;
        // The bitmap is device-pixel sized; CSS shrinks it back to CSS pixels.
        canvas.style.width = `${String(viewport.width)}px`;
        canvas.style.height = `${String(viewport.height)}px`;
        const context = canvas.getContext("2d");
        if (context === null) {
          setPaint({ kind: "failed", message: t("pdf.error.render") });
          return;
        }
        const task = proxy.render({ canvas, canvasContext: context, viewport });
        renderTask = task;
        // A cancel that landed between the await above and this assignment has
        // already run its cleanup, so it has to be honoured here instead.
        if (cancelled) {
          task.cancel();
          return;
        }
        await task.promise;
        if (cancelled) return;
        setPaint({ kind: "painted" });
      } catch (error) {
        // A cancelled render rejects with RenderingCancelledException. That is
        // the expected answer to a page turn, not a page that cannot be drawn,
        // so it must not reach the reader as a failure.
        if (cancelled || isCancellation(error)) return;
        setPaint({ kind: "failed", message: t(loadFailureKey(error)) });
      }
    })();

    return () => {
      cancelled = true;
      // Swallowed on purpose: pdf.js rejects the promise of a cancelled task,
      // and that rejection is already handled where the attempt awaits it.
      try {
        renderTask?.cancel();
      } catch {
        // Nothing to do: the task is being torn down either way.
      }
      renderTask = null;
    };
  }, [state, page, t, visible]);

  if (state.kind === "failed") {
    return (
      <div className="preview-more-status" role="alert" data-testid="preview-more-pdf-failed">
        <p>{t("state.failed")}</p>
        <p className="preview-more-detail">{state.message}</p>
        <button
          type="button"
          className="preview-more-action"
          onClick={() => {
            setState({ kind: "loading" });
            setAttempt(value => value + 1);
          }}
        >
          {t("state.retry")}
        </button>
      </div>
    );
  }

  if (state.kind === "loading") {
    return <p className="preview-more-status">{t("state.loading")}</p>;
  }

  const total = state.doc.numPages;
  const bounds = pageBounds(page, total);
  return (
    <div className="preview-more-pdf" data-testid="preview-more-pdf" ref={hostRef}>
      <canvas ref={canvasRef} className="preview-more-pdf-page" />
      {paint.kind === "failed" ? (
        <p className="preview-more-status" role="alert" data-testid="preview-more-pdf-paint-failed">
          {paint.message}
        </p>
      ) : null}
      {total > 1 ? (
        <div className="preview-more-toolbar">
          <button
            type="button"
            className="preview-more-action"
            disabled={!bounds.hasPrev}
            aria-label={t("pdf.previous")}
            onClick={() => setPage(value => clampPage(value - 1, total) + 1)}
          >
            &lsaquo;
          </button>
          <span className="preview-more-facts">
            {formatMessage(t("pdf.page"), { current: clampPage(page, total) + 1, total })}
          </span>
          <button
            type="button"
            className="preview-more-action"
            disabled={!bounds.hasNext}
            aria-label={t("pdf.next")}
            onClick={() => setPage(value => clampPage(value + 1, total) + 1)}
          >
            &rsaquo;
          </button>
        </div>
      ) : null}
    </div>
  );
}

/**
 * The native document body.
 * @param props - host body props plus the entry's reader.
 * @returns the page, or a status line while it settles.
 */
export function Body(props: NativeBodyProps): React.ReactElement {
  const { content, resourceAddress, t, readFile, useResource, useTabInfo } = props;
  const { tab } = useTabInfo();
  const resource = useResource(resourceAddress);
  const absolutePath = resource.value?.absolutePath;
  const fileVersion = resource.value?.version ?? "0";
  const revision = content.kind === "renderer" && content.revision !== undefined ? content.revision : 0;

  const [bytes, setBytes] = useState<Uint8Array | null>(null);
  const [failure, setFailure] = useState<string | null>(null);
  const settled = useRef<ReportMark>(UNREPORTED);
  const target = useMemo(() => parseSessionFileAddress(resourceAddress), [resourceAddress]);

  useEffect(() => {
    if (target === null || absolutePath === undefined) return;
    const controller = new AbortController();
    const signal = AbortSignal.any([controller.signal, tab.signal]);
    let disposed = false;
    setBytes(null);
    setFailure(null);

    void (async () => {
      try {
        const data = await readFile(target.sessionId, absolutePath, signal);
        if (disposed || signal.aborted) return;
        setBytes(data);
      } catch (error) {
        if (disposed || signal.aborted) return;
        setFailure(failureMessage(error));
        settle(false, 0);
      }
    })();

    return () => {
      disposed = true;
      controller.abort();
    };
  }, [absolutePath, target, revision, tab.signal, readFile]);

  /**
   * Report this attempt to the owner once.
   *
   * Keyed by revision *and* attempt: a retry of a failed render is a new attempt
   * under the same revision, and that is the report the host needs in order to
   * record the version it displays.
   */
  function settle(ok: boolean, attempt: number): void {
    if (!shouldSettle(settled.current, revision, attempt)) return;
    settled.current = { revision, attempt };
    if (content.kind !== "renderer") return;
    if (ok) content.loaded?.(fileVersion);
    else content.failed?.();
  }

  if (failure !== null) {
    return (
      <div className="preview-more-status" role="alert" data-testid="preview-more-read-failed">
        <p>{t("state.failed")}</p>
        <p className="preview-more-detail">{failure}</p>
      </div>
    );
  }
  if (bytes === null || absolutePath === undefined) {
    return <p className="preview-more-status">{t("state.loading")}</p>;
  }
  return <PdfSurface bytes={bytes} t={t} onSettled={settle} visible={props.visible} />;
}

/**
 * The dsh-better-sidebar viewer.
 * @param props - that plugin's viewer props, carrying bytes as `customData`.
 * @returns the page.
 */
export function Viewer(props: SidebarViewerProps): React.ReactElement {
  const { t, customData, visible } = props;
  const bytes = customData?.bytes;
  if (bytes === undefined) {
    return <p className="preview-more-status">{t("state.loading")}</p>;
  }
  return <PdfSurface bytes={bytes} t={t} visible={visible} />;
}
