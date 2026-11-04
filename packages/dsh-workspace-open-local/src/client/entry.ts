/**
 * Browser-half entry.
 *
 * The workspace-row menu is a hardcoded list, so nothing here registers a menu
 * item. Instead a null-rendering occupant of the frame overlay mirrors the
 * workspaces snapshot, and a DOM anchor appends a container to the floating
 * menu once it can name the directory. The row rendered into that container is
 * the split button from the client half.
 *
 * `useWorkspaces` arrives as a prop, not a service. The host publishes the
 * workspaces list through `slots.provideRoot({ hooks: { workspaces } })`, and the
 * renderer turns every root hook into a `use<Name>` prop on every slot component.
 * An entry's own `inject` face only carries what that entry registered, so the
 * probe reads the hook off its props and treats a missing one as "not ready".
 *
 * cordis calls `apply(ctx, config)`. The context stays a context here; the only
 * service this half needs is `slots`.
 */
import { createElement } from "react";
import { createRoot, type Root } from "react-dom/client";

import { createRowController, type RowView } from "./controller.ts";
import { createOpenInAppHost, readRememberedApplication, type OpenInAppHost, type StorageLike } from "./host-api.ts";
import { attachWorkspaceMenuAnchor, type WorkspaceMenuOpen } from "./menu-anchor.ts";
import { OpenLocalRow, type OpenLocalApplication } from "./OpenLocalRow.tsx";
import { insertOpenLocalRowStyles } from "./styles.ts";
import { createProbeComponent, createWorkspacePathStore } from "./workspaces-probe.ts";

/** The services this half reads; declared so Cordis resolves them before mounting. */
export const inject = ["slots"];

/**
 * The slot whose occupant receives the root hooks, including `useWorkspaces`.
 *
 * `shell.overlay` is the frame-level overlay: list slot, `scope: root`, no
 * owner props, and its standard props carry `useWorkspaces`. It stays mounted
 * for the life of the frame, so a workspace whose sessions are all archived,
 * or a workspace that has no session yet, still publishes its directory. The
 * session-row action slot does not: it mounts once per session row, and with
 * no row mounted the store never becomes ready. The layer is click-through and
 * the probe renders null, so occupying it changes no layout.
 */
export const PROBE_SLOT = "shell.overlay";

/** High on purpose: the probe renders nothing, so order only loses to a later null occupant. */
const PROBE_ORDER = 900;

/** The slice of `slots` this entry uses. */
export interface SlotsLike {
  inject(slot: string, factory: () => () => void): void;
  register(options: { name: string; id: string; order: number; inject: () => object }, component: unknown): () => void;
}

/** The slice of the client context this entry uses. */
export interface ClientContextLike {
  readonly slots: SlotsLike;
  effect(callback: () => () => void, label?: string): void;
}

/** One mounted row: its React root plus the controller whose view it renders. */
interface MountedRow {
  readonly reactRoot: Root;
  readonly release: () => void;
}

/** Page `localStorage`, or null where the platform refuses to expose it. */
function pageStorage(): StorageLike | null {
  try {
    return globalThis.localStorage;
  } catch {
    return null;
  }
}

/**
 * Render one row into the anchor's container and keep it current.
 *
 * The controller owns the phase machine; this only translates its view into the
 * row's props and tears both down together, so a closed menu leaves neither a
 * root nor a pending catalog read.
 * @param open - the menu the anchor recognised, with the directory already resolved.
 * @param host - the open-in-app face.
 * @param storage - the shared choice slot; null skips remembering.
 * @returns the disposer for this one menu.
 */
export function mountRow(open: WorkspaceMenuOpen, host: OpenInAppHost, storage: StorageLike | null): () => void {
  const reactRoot = createRoot(open.container);
  const render = (view: RowView): void => {
    const applications: OpenLocalApplication[] = view.applications.map((id) => ({ id, label: id, iconUrl: host.iconUrl(id) }));
    reactRoot.render(createElement(OpenLocalRow, {
      path: open.path,
      applications,
      defaultApplication: view.defaultApplication,
      menuOpen: view.menuOpen,
      phase: view.phase === "launching" ? "launching" : "idle",
      error: view.error,
      onOpen: () => controller.open(),
      onToggleMenu: (next) => controller.toggleMenu(next),
      onPickApplication: (id) => controller.pick(id),
      onDismissMenu: () => controller.dismissMenu(),
    }));
  };
  const controller = createRowController({ host, storage, path: open.path, remembered: readRememberedApplication(storage), onChange: render });
  controller.load();
  const mounted: MountedRow = { reactRoot, release: () => controller.dispose() };
  return () => {
    mounted.release();
    reactRoot.unmount();
  };
}

/**
 * Mount the probe, the stylesheet, and the menu anchor.
 * @param ctx - client root context.
 */
export function apply(ctx: ClientContextLike): void {
  const store = createWorkspacePathStore();
  const host = createOpenInAppHost();
  ctx.effect(() => insertOpenLocalRowStyles(document), "dsh-workspace-open-local: stylesheet");
  ctx.effect(() => {
    ctx.slots.inject(PROBE_SLOT, () =>
      ctx.slots.register(
        { name: PROBE_SLOT, id: "workspace-open-local-probe", order: PROBE_ORDER, inject: () => ({}) },
        createProbeComponent(store),
      ),
    );
    return () => {};
  }, "dsh-workspace-open-local: workspace path probe");
  ctx.effect(
    () => attachWorkspaceMenuAnchor({ store, onOpen: (open) => mountRow(open, host, pageStorage()) }),
    "dsh-workspace-open-local: menu anchor",
  );
}

/** The plugin object the loader mounts. */
export const clientPlugin = { name: "dsh-workspace-open-local", inject, apply };

export default clientPlugin;
