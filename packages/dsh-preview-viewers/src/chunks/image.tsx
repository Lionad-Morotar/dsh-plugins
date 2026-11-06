/**
 * The image body and viewer: bytes in, `<img>` out.
 *
 * Every suffix here is one the browser decodes itself, so there is no engine and
 * no canvas: the whole surface is a blob URL handed to an image element. That is
 * the same path `raster.tsx` takes for avif, and it is reused rather than
 * re-derived because it is the one that has already been proven in this host.
 *
 * Two mount shapes come out of here because the host has two:
 *
 *   - `Body` is the native document body. In renderer mode it owns the read and
 *     must settle exactly once with `loaded`/`failed`.
 *   - `Viewer` is the dsh-better-sidebar viewer, which reads the bytes itself and
 *     hands them over as `customData`.
 *
 * Both funnel into `ImageSurface`, which owns the blob URL lifecycle: one URL per
 * (bytes, attempt), revoked when it is replaced or the surface unmounts. A leaked
 * object URL pins the whole file in memory for the life of the page, and a
 * preview that is opened and closed a few times is enough to notice.
 */
import { useEffect, useMemo, useRef, useState } from "react";

import { parseSessionFileAddress } from "../address.ts";
import type { NativeBodyProps, SidebarViewerProps } from "../contracts.ts";
import { mimeFor } from "../image.ts";
import type { ReportMark } from "../mount.ts";
import { UNREPORTED, failureMessage, shouldSettle } from "../mount.ts";

/** How one image's decode is going. */
type ImageState =
  | { readonly kind: "loading" }
  | { readonly kind: "failed"; readonly message: string };

/**
 * The image surface: one blob URL, one image element, one settle report.
 * @param props - bytes, the path that picks the MIME type, translator, settle callback.
 * @returns the image, or a status line while it settles.
 */
function ImageSurface(props: {
  readonly bytes: Uint8Array;
  readonly path: string;
  readonly t: (key: string, values?: Record<string, string | number>) => string;
  readonly onSettled?: (ok: boolean, attempt: number) => void;
}): React.ReactElement {
  const { bytes, path, t, onSettled } = props;
  const [state, setState] = useState<ImageState>({ kind: "loading" });
  const [attempt, setAttempt] = useState(0);
  const settledRef = useRef(onSettled);
  settledRef.current = onSettled;

  // A suffix this family does not own is a real failure, not a blank box: the
  // pane routed here on the catalogue's word, so the two disagreeing is worth
  // saying out loud rather than rendering nothing.
  const mime = useMemo(() => mimeFor(path), [path]);

  // `attempt` is a dependency on purpose: a retry must hand the browser a fresh
  // object URL, otherwise the image element keeps the URL that already failed
  // and the retry button would be inert.
  const blobUrl = useMemo(() => {
    if (mime === null) return null;
    return URL.createObjectURL(new Blob([bytes as unknown as BlobPart], { type: mime }));
  }, [mime, bytes, attempt]);

  useEffect(() => {
    return () => {
      if (blobUrl !== null) URL.revokeObjectURL(blobUrl);
    };
  }, [blobUrl]);

  // A missing type settles here rather than in the image's error handler: there
  // is no element to fail, so nothing else would ever report this attempt.
  useEffect(() => {
    if (mime !== null) return;
    setState({ kind: "failed", message: t("state.unsupported") });
    settledRef.current?.(false, attempt);
  }, [mime, attempt, t]);

  if (state.kind === "failed") {
    return (
      <div className="preview-more-status" role="alert" data-testid="preview-more-image-failed">
        <p>{t("state.failed")}</p>
        <p className="preview-more-detail">{state.message}</p>
        <button
          type="button"
          className="preview-more-action"
          onClick={() => {
            setState({ kind: "loading" });
            setAttempt((value) => value + 1);
          }}
        >
          {t("state.retry")}
        </button>
      </div>
    );
  }

  if (blobUrl === null) {
    return <p className="preview-more-status">{t("state.loading")}</p>;
  }

  return (
    <div className="preview-more-image-surface" data-testid="preview-more-image">
      <img
        key={attempt}
        className="preview-more-image"
        src={blobUrl}
        alt={t("image.title")}
        onLoad={() => {
          // No state change on success: the element is already showing the
          // image, and a `ready` state nothing renders differently from would
          // only be a second source of truth for the same fact.
          settledRef.current?.(true, attempt);
        }}
        onError={() => {
          setState({ kind: "failed", message: t("state.unsupported") });
          settledRef.current?.(false, attempt);
        }}
      />
    </div>
  );
}

/**
 * The native document body.
 * @param props - host body props plus the entry's reader.
 * @returns the image, or a status line while it settles.
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
  // The bytes are already in hand by the time this renders, so a hidden panel
  // costs one image element and no read: the read above is keyed on the file,
  // not on visibility, and gating it on `visible` would refetch the file every
  // time the reader switched tabs back. There is no frame loop to pause either,
  // which is the other reason the raster surface checks that flag.
  return <ImageSurface bytes={bytes} path={absolutePath} t={t} onSettled={settle} />;
}

/**
 * The dsh-better-sidebar viewer.
 * @param props - that plugin's viewer props, carrying bytes as `customData`.
 * @returns the image.
 */
export function Viewer(props: SidebarViewerProps): React.ReactElement {
  const { t, customData, path } = props;
  const bytes = customData?.bytes;
  const filePath = customData?.path ?? path;
  if (bytes === undefined) {
    return <p className="preview-more-status">{t("state.loading")}</p>;
  }
  return <ImageSurface bytes={bytes} path={filePath} t={t} />;
}
