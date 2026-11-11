/**
 * The bridge between this package's preview contract and the shared surfaces.
 *
 * `dsh-preview-viewers` exports one React view per family, but its props are the
 * better-sidebar viewer's: that host reads the bytes itself and hands them over
 * as `customData`. This pane is not that host — it owns the file service, the
 * session and the failure copy, and it wants to say only "draw this path". So
 * the bytes are read here, once, and the shared view is handed exactly what it
 * expects. That keeps the shared export surface unchanged for its existing
 * consumer while this package gets a contract it can state in one line.
 *
 * Everything in this file is chunk-side: it is bundled into each family chunk,
 * never into the entry.
 */
import { useEffect, useMemo, useState, type ComponentType, type ReactElement } from "react";

import type { SidebarViewerProps } from "dsh-preview-viewers/contracts.ts";
import type { PreviewFamily } from "dsh-preview-viewers/formats.ts";
import { insertStyles } from "dsh-preview-viewers/styles.ts";

import { surfaceTranslator } from "../copy.ts";
import { classifyPreviewFailure, type PreviewFailure } from "../preview-failure.ts";
import { PreviewFailureView, PreviewLoadingView } from "../preview-failure.tsx";
import type { FamilyViewProps } from "../preview-chunk.ts";

/** One family's shared React view, as the shared package exports it. */
export type FamilyViewer = ComponentType<SidebarViewerProps>;

/**
 * Build the family view the pane mounts.
 *
 * The bytes are read once per (path, session) and re-read only on retry: a
 * renderer decodes its whole input, so a re-read on every render would both
 * refetch the file and rebuild the WebGL context the surface owns.
 * @param family - renderer family, used for the diagnostic marker and markup.
 * @param Viewer - the shared surface for that family.
 * @returns the component this package's chunk exports.
 */
export function createFamilyView(family: PreviewFamily, Viewer: FamilyViewer): ComponentType<FamilyViewProps> {
  function FamilyView({ path, sessionId, readFile, t, visible = true }: FamilyViewProps): ReactElement {
    const [bytes, setBytes] = useState<Uint8Array | null>(null);
    const [failure, setFailure] = useState<PreviewFailure | null>(null);
    const [attempt, setAttempt] = useState(0);
    // The shared surface asks for its own vocabulary; the rebinding is stable so
    // it never looks like a changed prop to the surface below.
    const surfaceT = useMemo(() => surfaceTranslator(t), [t]);

    // The shared surfaces are sized by a stylesheet the host does not provide.
    // Claiming it here rather than in the entry keeps its bytes off every page
    // boot; the claim is released when the last mounted pane goes away.
    useEffect(() => {
      const doc = globalThis.document;
      if (doc === undefined) return undefined;
      const release = insertStyles(doc);
      return () => release();
    }, []);

    useEffect(() => {
      const controller = new AbortController();
      let disposed = false;
      setBytes(null);
      setFailure(null);

      void (async () => {
        try {
          const data = await readFile(sessionId, path, controller.signal);
          if (disposed || controller.signal.aborted) return;
          setBytes(data);
        } catch (error) {
          if (disposed || controller.signal.aborted) return;
          setFailure(classifyPreviewFailure(error));
        }
      })();

      return () => {
        disposed = true;
        controller.abort();
      };
    }, [readFile, sessionId, path, attempt]);

    if (failure !== null) {
      return (
        <div className="fx-family" data-testid="fs-preview-family" data-family={family} data-state="failed">
          <PreviewFailureView failure={failure} t={t} onRetry={() => setAttempt(value => value + 1)} />
        </div>
      );
    }
    if (bytes === null) {
      return (
        <div className="fx-family" data-testid="fs-preview-family" data-family={family} data-state="loading">
          <PreviewLoadingView t={t} />
        </div>
      );
    }
    return (
      <div className="fx-family" data-testid="fs-preview-family" data-family={family} data-state="ready">
        <Viewer
          path={path}
          title={path}
          scope={{ sessionId }}
          customData={{ bytes }}
          t={surfaceT}
          readFile={readFile}
          visible={visible}
        />
      </div>
    );
  }
  return FamilyView;
}
