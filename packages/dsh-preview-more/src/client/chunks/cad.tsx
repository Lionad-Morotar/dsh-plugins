/**
 * The cad body and viewer: a DXF drawing, dimensions, and a toolbar.
 *
 * This is a lazy chunk like the other two, and for the same reason: dxf-viewer
 * brings its own three scene, which no reader should download unless they open a
 * drawing.
 *
 * The renderer itself is `../cad.ts`; this module owns only the mount lifecycle
 * and the markup, so the part that touches the DOM and the part that talks WebGL
 * can be tested apart.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { DxfViewer } from "dxf-viewer";

import { parseSessionFileAddress } from "../address.ts";
import { formatMessage } from "../locale.ts";
import { mountDrawing, type DxfHandle } from "../cad.ts";
import { canAttempt, failureMessage, prepareAttempt } from "../mount.ts";
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

/** One drawing's mount state. */
type CadState =
  | { readonly kind: "loading" }
  | { readonly kind: "ready"; readonly layers: number }
  | { readonly kind: "failed"; readonly message: string };

/**
 * The canvas owner: mount a drawing from bytes, dispose it on unmount.
 * @param props - bytes, path, translator, optional settle callback.
 * @returns the drawing surface and its status line.
 */
function CadSurface(props: {
  readonly bytes: Uint8Array;
  readonly t: (key: string, values?: Record<string, string | number>) => string;
  readonly onSettled?: (ok: boolean) => void;
}): React.ReactElement {
  const { bytes, t, onSettled } = props;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const handleRef = useRef<DxfHandle | null>(null);
  const [state, setState] = useState<CadState>({ kind: "loading" });
  const [attempt, setAttempt] = useState(0);
  const settledRef = useRef(onSettled);
  settledRef.current = onSettled;

  useEffect(() => {
    const container = containerRef.current;
    if (!canAttempt(container)) return;
    let disposed = false;
    prepareAttempt({ container, clear: () => container.replaceChildren() });
    setState({ kind: "loading" });

    void (async () => {
      try {
        const drawing = await mountDrawing(container, bytes, DxfViewer);
        if (disposed) {
          drawing.dispose();
          return;
        }
        handleRef.current = drawing;
        setState({ kind: "ready", layers: drawing.layers });
        settledRef.current?.(true);
      } catch (error) {
        if (disposed) return;
        setState({ kind: "failed", message: failureMessage(error) });
        settledRef.current?.(false);
      }
    })();

    return () => {
      disposed = true;
      handleRef.current?.dispose();
      handleRef.current = null;
    };
  }, [bytes, attempt]);

  // The canvas host stays mounted even on failure: the retry effect resolves it
  // through the ref, so unmounting it here would leave the button with nothing
  // to mount into and make a failed drawing permanently unrecoverable.
  if (state.kind === "failed") {
    return (
      <div className="preview-more-scene" data-testid="preview-more-cad">
        <div ref={containerRef} className="preview-more-canvas" hidden />
        <div className="preview-more-status" role="alert" data-testid="preview-more-cad-failed">
          <p>{t("state.failed")}</p>
          <p className="preview-more-detail">{state.message}</p>
          <button type="button" className="preview-more-action" onClick={() => setAttempt((value) => value + 1)}>
            {t("state.retry")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="preview-more-scene" data-testid="preview-more-cad">
      <div ref={containerRef} className="preview-more-canvas" />
      {state.kind === "loading" ? <p className="preview-more-status">{t("state.loading")}</p> : null}
      {state.kind === "ready" ? (
        <div className="preview-more-toolbar">
          <span className="preview-more-facts">{formatMessage(t("cad.layers"), { count: state.layers })}</span>
          <button type="button" className="preview-more-action" onClick={() => handleRef.current?.fit()}>
            {t("cad.fit")}
          </button>
        </div>
      ) : null}
    </div>
  );
}

/**
 * The native document body.
 * @param props - host body props plus the entry's reader.
 * @returns the drawing, or a status line while it settles.
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
  return <CadSurface bytes={bytes} t={t} onSettled={settle} />;
}

/**
 * The dsh-better-sidebar viewer.
 * @param props - that plugin's viewer props, carrying bytes as `customData`.
 * @returns the drawing.
 */
export function Viewer(props: ViewerProps): React.ReactElement {
  const { t, customData } = props;
  const bytes = customData?.bytes;
  if (bytes === undefined) {
    return <p className="preview-more-status">{t("state.loading")}</p>;
  }
  return <CadSurface bytes={bytes} t={t} />;
}
