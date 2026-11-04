/**
 * One menu row's control state, kept out of the component so the row stays
 * controlled and the launch rules stay testable without a DOM.
 *
 * The catalog is read once per open. A launch that is already in flight is
 * dropped rather than queued: the host answers one open at a time and a
 * second click would only race it. The remembered application is written
 * only after a launch succeeds, so a failed one does not overwrite a choice
 * the host button still honours.
 */
import {
  rememberApplication,
  resolveDefaultApplication,
  type OpenInAppHost,
  type StorageLike,
} from "./host-api.ts";

/** What the row is doing. "loading" is the catalog read; "launching" is one open. */
export type RowPhase = "loading" | "idle" | "launching" | "error";

/** The slice of the row the controller owns. The rest (path, labels) is fixed per open. */
export interface RowView { readonly phase: RowPhase; readonly applications: readonly string[]; readonly defaultApplication: string | null; readonly menuOpen: boolean; readonly error: string | null; }

/** Short copy for a failed catalog or launch. The row has one line for it. */
export const ROW_ERROR_COPY = { catalog: "读不到可用应用", launch: "打开失败" } as const;

export interface RowControllerOptions { readonly host: OpenInAppHost; readonly storage: StorageLike | null; readonly path: string; readonly remembered: string | null; readonly onChange: (view: RowView) => void; }

export interface RowController { readonly view: RowView; load(): void; open(): void; toggleMenu(open: boolean): void; pick(applicationId: string): void; dismissMenu(): void; dispose(): void; }

/** One row. `load` starts the catalog read; everything else is ignored until it settles. */
export function createRowController(options: RowControllerOptions): RowController {
  let view: RowView = { phase: "loading", applications: [], defaultApplication: null, menuOpen: false, error: null };
  let disposed = false;
  let loadSeq = 0;

  const publish = (next: RowView): void => { view = next; options.onChange(view); };

  /** Launch one application, ignoring the click when a launch is already running. */
  const launch = (applicationId: string | null): void => {
    if (disposed || view.phase === "launching" || applicationId === null) return;
    const target = applicationId;
    publish({ ...view, phase: "launching", menuOpen: false, error: null });
    options.host.openDirectory(target, options.path).then(
      () => { if (disposed) return; rememberApplication(options.storage, target); publish({ ...view, phase: "idle", defaultApplication: target, menuOpen: false, error: null }); },
      () => { if (disposed) return; publish({ ...view, phase: "error", menuOpen: false, error: ROW_ERROR_COPY.launch }); },
    );
  };

  return {
    get view() { return view; },
    load() {
      const seq = ++loadSeq;
      publish({ phase: "loading", applications: [], defaultApplication: null, menuOpen: false, error: null });
      options.host.listApplications().then(
        (applications) => { if (disposed || seq !== loadSeq) return; publish({ phase: "idle", applications, defaultApplication: resolveDefaultApplication(applications, options.remembered), menuOpen: false, error: null }); },
        () => { if (disposed || seq !== loadSeq) return; publish({ phase: "error", applications: [], defaultApplication: null, menuOpen: false, error: ROW_ERROR_COPY.catalog }); },
      );
    },
    open() { if (view.phase === "loading" || view.phase === "launching") return; launch(view.defaultApplication); },
    toggleMenu(open) { if (view.phase === "loading" || view.phase === "launching") return; publish({ ...view, menuOpen: open }); },
    pick(applicationId) { launch(applicationId); },
    dismissMenu() { if (view.menuOpen) publish({ ...view, menuOpen: false }); },
    dispose() { disposed = true; loadSeq += 1; },
  };
}
