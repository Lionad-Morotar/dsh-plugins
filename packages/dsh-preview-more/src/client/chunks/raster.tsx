/**
 * The raster body and viewer: TIFF pages, or any image the host decodes itself.
 *
 * Two suffixes reach this chunk for different reasons, and they take different
 * paths inside it:
 *
 *   - tif/tiff cannot be decoded by the browser at all, so utif decodes them
 *     here and the page is painted into a canvas.
 *   - avif is a format browsers decode natively but the built-in preview's image
 *     list omits, so it is handed to an img element through a blob URL.
 *
 * Everything is lazy: utif is imported when a TIFF is actually opened, so an
 * avif costs no decoder and neither costs anything until the tab mounts.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import * as utif from "utif";

import { parseSessionFileAddress } from "../address.ts";
import { formatMessage } from "../locale.ts";
import { decodeMode, decodeTiff } from "../raster.ts";
import type { ReadFile } from "../runtime.ts";

/** What the native body receives from the host, narrowed to the fields used. */
export interface BodyProps {
  readonly content: {
    readonly kind: string;
    readonly revision?: number;
    readonly loaded?: (version: string) => void;
    readonly failed?: () => void;
  };
  readonly resourceAddress: string;
  readonly t: (key: string, values?: Record<string, string | number>) => string;
  readonly readFile: ReadFile;
  readonly useResource: (address: string) => { readonly value?: { readonly absolutePath?: string; readonly version?: string } };
  readonly useTabInfo: () => { readonly tab: { readonly id: string; readonly signal: AbortSignal } };
}

/** What the better-sidebar viewer receives, narrowed to the fields used. */
export interface ViewerProps {
  readonly path: string;
  readonly title: string;
  readonly scope: { readonly sessionId: string };
  readonly customData?: { readonly bytes?: Uint8Array; readonly path?: string };
  readonly t: (key: string, values?: Record<string, string | number>) => string;
}

/** One page as the surface draws it. */
interface RasterPage {
  readonly width: number;
  readonly height: number;
  readonly rgba: Uint8Array;
}

/** One image's decoded state. */
type RasterState =
  | { readonly kind: "loading" }
  | { readonly kind: "pages"; readonly pages: RasterPage[] }
  | { readonly kind: "failed"; readonly message: string };

/**
 * The raster surface: decode bytes, draw one page, page through the rest.
 * @param props - bytes, the path that picks the decoder, translator, settle callback.
 * @returns the image, its page controls, and a status line while it settles.
 */
function RasterSurface(props: {
  readonly bytes: Uint8Array;
  readonly path: string;
  readonly t: (key: string, values?: Record<string, string | number>) => string;
  readonly onSettled?: (ok: boolean) => void;
}): React.ReactElement {
  const { bytes, path, t, onSettled } = props;
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [state, setState] = useState<RasterState>({ kind: "loading" });
  const [page, setPage] = useState(0);
  const [attempt, setAttempt] = useState(0);
  const settledRef = useRef(onSettled);
  settledRef.current = onSettled;

  const native = useMemo(() => decodeMode(path) === "native", [path]);
  const blobUrl = useMemo(() => {
    if (!native) return null;
    return URL.createObjectURL(new Blob([bytes as unknown as BlobPart], { type: "image/avif" }));
  }, [native, bytes]);

  useEffect(() => {
    return () => {
      if (blobUrl !== null) URL.revokeObjectURL(blobUrl);
    };
  }, [blobUrl]);

  useEffect(() => {
    if (native) return;
    let disposed = false;
    setState({ kind: "loading" });
    setPage(0);

    // Both imports are static: a chunk is fetched as a single file, so an import
    // resolved at runtime would be a separate file the host has no route for.
    // Decoding is still off the render path because it happens in an effect.
    try {
      const pages = decodeTiff(bytes, utif);
      if (disposed) return;
      setState(pages.length === 0 ? { kind: "failed", message: "no pages" } : { kind: "pages", pages });
      settledRef.current?.(pages.length > 0);
    } catch (error) {
      if (disposed) return;
      setState({ kind: "failed", message: error instanceof Error ? error.message : String(error) });
      settledRef.current?.(false);
    }

    return () => {
      disposed = true;
    };
  }, [bytes, path, native, attempt]);

  useEffect(() => {
    if (state.kind !== "pages") return;
    const canvas = canvasRef.current;
    const current = state.pages[page];
    if (canvas === null || current === undefined) return;
    canvas.width = current.width;
    canvas.height = current.height;
    const context = canvas.getContext("2d");
    if (context === null) return;
    context.putImageData(new ImageData(new Uint8ClampedArray(current.rgba), current.width, current.height), 0, 0);
  }, [state, page]);

  if (state.kind === "failed") {
    return (
      <div className="preview-more-status" role="alert" data-testid="preview-more-raster-failed">
        <p>{t("state.failed")}</p>
        <p className="preview-more-detail">{state.message}</p>
        <button type="button" className="preview-more-action" onClick={() => setAttempt((value) => value + 1)}>
          {t("state.retry")}
        </button>
      </div>
    );
  }

  if (native && blobUrl !== null) {
    return (
      <div className="preview-more-raster" data-testid="preview-more-raster">
        <img
          className="preview-more-image"
          src={blobUrl}
          alt={t("raster.title")}
          onLoad={() => settledRef.current?.(true)}
          onError={() => {
            setState({ kind: "failed", message: t("state.unsupported") });
            settledRef.current?.(false);
          }}
        />
      </div>
    );
  }

  return (
    <div className="preview-more-raster" data-testid="preview-more-raster">
      <canvas ref={canvasRef} className="preview-more-canvas-image" />
      {state.kind === "loading" ? <p className="preview-more-status">{t("state.decoding")}</p> : null}
      {state.kind === "pages" && state.pages.length > 1 ? (
        <div className="preview-more-toolbar">
          <button
            type="button"
            className="preview-more-action"
            disabled={page === 0}
            aria-label={t("raster.previous")}
            onClick={() => setPage((value) => Math.max(0, value - 1))}
          >
            &lsaquo;
          </button>
          <span className="preview-more-facts">{formatMessage(t("raster.page"), { current: page + 1, total: state.pages.length })}</span>
          <button
            type="button"
            className="preview-more-action"
            disabled={page >= state.pages.length - 1}
            aria-label={t("raster.next")}
            onClick={() => setPage((value) => Math.min(state.pages.length - 1, value + 1))}
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
 * @returns the image, or a status line while it settles.
 */
export function Body(props: BodyProps): React.ReactElement {
  const { content, resourceAddress, t, readFile, useResource, useTabInfo } = props;
  const { tab } = useTabInfo();
  const resource = useResource(resourceAddress);
  const absolutePath = resource.value?.absolutePath;
  const fileVersion = resource.value?.version ?? "0";
  const revision = content.kind === "renderer" && content.revision !== undefined ? content.revision : 0;

  const [bytes, setBytes] = useState<Uint8Array | null>(null);
  const [failure, setFailure] = useState<string | null>(null);
  const settled = useRef<number>(-1);
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
        setFailure(error instanceof Error ? error.message : String(error));
        settle(false);
      }
    })();

    return () => {
      disposed = true;
      controller.abort();
    };
  }, [absolutePath, target, revision, tab.signal, readFile]);

  /** Settle one revision exactly once: the owner refuses a second report. */
  function settle(ok: boolean): void {
    if (settled.current === revision) return;
    settled.current = revision;
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
  return <RasterSurface bytes={bytes} path={absolutePath} t={t} onSettled={settle} />;
}

/**
 * The dsh-better-sidebar viewer.
 * @param props - that plugin's viewer props, carrying bytes as `customData`.
 * @returns the image.
 */
export function Viewer(props: ViewerProps): React.ReactElement {
  const { t, customData, path } = props;
  const bytes = customData?.bytes;
  const filePath = customData?.path ?? path;
  if (bytes === undefined) {
    return <p className="preview-more-status">{t("state.loading")}</p>;
  }
  return <RasterSurface bytes={bytes} path={filePath} t={t} />;
}
