/**
 * The scene3d body and viewer: read the file, decode it, draw it.
 *
 * This module is a lazy chunk. It owns three.js, so the entry never imports it
 * statically; the entry reaches it through `require.async`.
 *
 * Two mount shapes come out of here because the host has two:
 *
 *   - `Body` is the native document body. The host hands it renderer-mode
 *     `content`, which it must settle exactly once with `loaded` or `failed`.
 *   - `Viewer` is the dsh-better-sidebar viewer. That plugin reads the bytes
 *     itself (`fetchStrategy: 'custom'`) and hands them over as `customData`.
 *
 * Both funnel into `SceneSurface`, which owns the canvas lifecycle: one WebGL
 * context per mount, disposed on unmount, no leak across tab churn.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { wasmBinary, wasmWrapper } from "virtual:draco-assets";

import { parseSessionFileAddress } from "../address.ts";
import { formatMessage } from "../locale.ts";
import type { ReadFile } from "../runtime.ts";
import { canAttempt, failureMessage, prepareAttempt } from "../mount.ts";
import { decodeUriPath, mountScene, type SceneFacts, type SceneHandle } from "../scene3d.ts";

export type { ReadFile } from "../runtime.ts";

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
  readonly readFile?: ReadFile;
}

/** One viewport's mount state. */
type ViewState =
  | { readonly kind: "loading" }
  | { readonly kind: "ready"; readonly facts: SceneFacts }
  | { readonly kind: "failed"; readonly message: string };

/**
 * The canvas owner: mount a scene from bytes, dispose it on unmount.
 * @param props - bytes, the path that picks the loader, translator, optional settle callback.
 * @returns the canvas and its status line.
 */
function SceneSurface(props: {
  readonly bytes: Uint8Array;
  readonly path: string;
  readonly t: (key: string, values?: Record<string, string | number>) => string;
  readonly onSettled?: (ok: boolean) => void;
  readonly readSibling?: (relative: string) => Promise<Uint8Array>;
}): React.ReactElement {
  const { bytes, path, t, onSettled, readSibling } = props;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const handleRef = useRef<SceneHandle | null>(null);
  const [state, setState] = useState<ViewState>({ kind: "loading" });
  const [attempt, setAttempt] = useState(0);
  const [wireframe, setWireframe] = useState(false);
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
        const { handle, facts } = await mountScene(container, bytes, path, { wasmWrapper, wasmBinary }, readSibling);
        if (disposed) {
          handle.dispose();
          return;
        }
        handleRef.current = handle;
        setState({ kind: "ready", facts });
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
  }, [bytes, path, attempt, readSibling]);

  useEffect(() => {
    handleRef.current?.setWireframe(wireframe);
  }, [wireframe, state.kind]);

  // The canvas host stays mounted even on failure: the retry effect resolves it
  // through the ref, so unmounting it here would leave the button with nothing
  // to mount into and make a failed preview permanently unrecoverable.
  if (state.kind === "failed") {
    return (
      <div className="preview-more-scene" data-testid="preview-more-scene">
        <div ref={containerRef} className="preview-more-canvas" hidden />
        <div className="preview-more-status" role="alert" data-testid="preview-more-scene-failed">
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
    <div className="preview-more-scene" data-testid="preview-more-scene">
      <div ref={containerRef} className="preview-more-canvas" />
      {state.kind === "loading" ? <p className="preview-more-status">{t("state.loading")}</p> : null}
      {state.kind === "ready" ? (
        <div className="preview-more-toolbar">
          <span className="preview-more-facts">
            {formatMessage(t("scene3d.facts"), { meshes: state.facts.meshes, triangles: state.facts.triangles })}
          </span>
          <button type="button" className="preview-more-action" aria-pressed={wireframe} onClick={() => setWireframe((on) => !on)}>
            {t("scene3d.wireframe")}
          </button>
          <button type="button" className="preview-more-action" onClick={() => handleRef.current?.resetView()}>
            {t("scene3d.reset")}
          </button>
        </div>
      ) : null}
    </div>
  );
}

/**
 * The native document body.
 * @param props - host body props plus the entry's reader.
 * @returns the viewport, or a status line while it settles.
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
  // Memoized on the values it closes over: a new identity per render would sit in
  // the mount effect's dependency list and tear down the WebGL context (and
  // re-read every sibling) on every unrelated re-render of this body.
  const readSibling = useMemo(
    () => siblingReader(readFile, target?.sessionId, absolutePath, tab.signal),
    [readFile, target?.sessionId, absolutePath, tab.signal],
  );
  return <SceneSurface bytes={bytes} path={absolutePath} t={t} onSettled={settle} readSibling={readSibling} />;
}

/**
 * Build a reader for files sitting next to the model.
 *
 * A .gltf names its buffers and textures by URI relative to itself, and those
 * files are only reachable through the host's workspace reader, never through a
 * fetch. The reader resolves each URI against the model's own directory so the
 * document's own relative semantics are preserved.
 * @param readFile - the host byte reader.
 * @param sessionId - session the file belongs to.
 * @param modelPath - absolute path of the model.
 * @param signal - aborts the read when the tab closes.
 * @returns a reader over sibling URIs, or undefined when there is no session.
 */
function siblingReader(
  readFile: ReadFile,
  sessionId: string | undefined,
  modelPath: string,
  signal: AbortSignal,
): ((relative: string) => Promise<Uint8Array>) | undefined {
  if (sessionId === undefined) return undefined;
  const directory = modelPath.slice(0, modelPath.lastIndexOf("/"));
  return (relative) => readFile(sessionId, decodeUriPath(directory + "/" + relative), signal);
}

/**
 * The dsh-better-sidebar viewer.
 * @param props - that plugin's viewer props, carrying bytes as `customData`.
 * @returns the viewport.
 */
export function Viewer(props: ViewerProps): React.ReactElement {
  const { t, customData, path, readFile, scope } = props;
  const bytes = customData?.bytes;
  const filePath = customData?.path ?? path;
  // One controller for the life of the viewer, aborted on unmount. Creating it
  // per render would throw the abort away and hand the effect a new identity
  // every time, remounting the viewport for no reason.
  const abortRef = useRef<AbortController | null>(null);
  abortRef.current ??= new AbortController();
  const signal = abortRef.current.signal;
  useEffect(() => () => abortRef.current?.abort(), []);
  const sessionId = scope?.sessionId;
  const readSibling = useMemo(
    () => (readFile === undefined || sessionId === undefined ? undefined : siblingReader(readFile, sessionId, filePath, signal)),
    [readFile, sessionId, filePath, signal],
  );
  if (bytes === undefined) {
    return <p className="preview-more-status">{t("state.loading")}</p>;
  }
  return <SceneSurface bytes={bytes} path={filePath} t={t} readSibling={readSibling} />;
}
