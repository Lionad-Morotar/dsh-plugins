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
import { mountDrawing, type DxfHandle } from "../cad.ts";
import type { NativeBodyProps, SidebarViewerProps } from "../contracts.ts";
import { formatMessage } from "../locale.ts";
import type { ReportMark } from "../mount.ts";
import { UNREPORTED, canAttempt, failureMessage, prepareAttempt, shouldSettle } from "../mount.ts";

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
  readonly onSettled?: (ok: boolean, attempt: number) => void;
  readonly visible?: boolean;
}): React.ReactElement {
  const { bytes, t, onSettled, visible = true } = props;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const handleRef = useRef<DxfHandle | null>(null);
  const [state, setState] = useState<CadState>({ kind: "loading" });
  const [attempt, setAttempt] = useState(0);
  const settledRef = useRef(onSettled);
  settledRef.current = onSettled;
  // Read by the mount effect without joining its dependencies: a tab switch
  // flips visibility, and remounting the viewer for that would destroy and
  // recreate its WebGL context. The effect below forwards the change instead.
  const visibleRef = useRef(visible);
  visibleRef.current = visible;

  useEffect(() => {
    const container = containerRef.current;
    if (!canAttempt(container)) return;
    let disposed = false;
    prepareAttempt({ container, clear: () => container.replaceChildren() });
    setState({ kind: "loading" });

    void (async () => {
      try {
        const drawing = await mountDrawing(container, bytes, DxfViewer, { visible: visibleRef.current });
        if (disposed) {
          drawing.dispose();
          return;
        }
        handleRef.current = drawing;
        // The panel may have been hidden or shown while the file was parsing.
        drawing.setVisible(visibleRef.current);
        setState({ kind: "ready", layers: drawing.layers });
        settledRef.current?.(true, attempt);
      } catch (error) {
        if (disposed) return;
        setState({ kind: "failed", message: failureMessage(error) });
        settledRef.current?.(false, attempt);
      }
    })();

    return () => {
      disposed = true;
      handleRef.current?.dispose();
      handleRef.current = null;
    };
  }, [bytes, attempt]);

  // The hidden panel stays mounted, so this is a flag on the live handle rather
  // than an unmount: the engine has no per-frame loop to pause, but it repaints
  // when the panel comes back.
  useEffect(() => {
    handleRef.current?.setVisible(visible);
  }, [visible, state.kind]);

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
export function Body(props: NativeBodyProps): React.ReactElement {
  const { content, resourceAddress, t, readFile, useResource, useTabInfo, visible = true } = props;
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
        setFailure(error instanceof Error ? error.message : String(error));
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
   * Keyed by revision *and* attempt: a retry of a failed render is a new
   * attempt under the same revision, and that is the report the host needs in
   * order to record the version it displays.
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
  return <CadSurface bytes={bytes} t={t} onSettled={settle} visible={visible} />;
}

/**
 * The dsh-better-sidebar viewer.
 * @param props - that plugin's viewer props, carrying bytes as `customData`.
 * @returns the drawing.
 */
export function Viewer(props: SidebarViewerProps): React.ReactElement {
  const { t, customData, visible = true } = props;
  const bytes = customData?.bytes;
  if (bytes === undefined) {
    return <p className="preview-more-status">{t("state.loading")}</p>;
  }
  return <CadSurface bytes={bytes} t={t} visible={visible} />;
}
