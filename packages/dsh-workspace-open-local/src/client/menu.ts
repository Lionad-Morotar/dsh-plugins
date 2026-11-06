/**
 * The workspace menu contribution, as data.
 *
 * The host's shared context menu renders whatever `resolve` returns, and the
 * workspace target already carries the directory (`path` is the row's cwd), so
 * this half never looks at the DOM, never guesses which workspace opened the
 * menu, and covers the button, right click, and Shift+F10 entry points with one
 * registration.
 *
 * The parent row deliberately has no `run`: the shared Menu treats a row with
 * `children` as a submenu opener and never calls the action on click. The split
 * button the old row offered (primary click + chevron) therefore becomes
 * "expand, then pick", which is the only shape a data row can express.
 *
 * Shapes here are structural because the client bundle may not import host
 * packages: the host owns the real types, this file only has to satisfy them.
 */
import {
  orderApplications,
  readRememberedApplication,
  rememberApplication,
  type OpenInAppHost,
  type StorageLike,
} from "./host-api.ts";

/** The slot keyed icon component both rows share. */
export const APPLICATION_ICON_KEY = "open-local.application";

/** Contribution identity and position among workspace actions (rename 100, reveal 200, delete 300). */
export const CONTRIBUTION_ID = "open-local.workspace";
export const CONTRIBUTION_ORDER = 250;

/** The only target family this contribution answers. */
export const TARGET = "workspace";

/** The workspace slice the host hands `resolve`; `path` is the row's cwd. */
export interface WorkspaceTargetLike {
  readonly workspaceId: string;
  readonly path: string;
  readonly displayTitle: string;
}

/** Icon metadata captured with the action; `src` is a host icon route. */
export interface MenuIconLike {
  readonly key: string;
  readonly src?: string;
}

/**
 * One menu action, structurally compatible with the host's `MenuAction`.
 *
 * `run` is optional so the parent can omit it; `failureLabel` is what the host
 * shows when `run` rejects, which is the visible failure path.
 */
export interface MenuActionLike {
  readonly id: string;
  readonly label: string;
  readonly icon?: MenuIconLike;
  readonly failureLabel?: string;
  readonly run?: () => void | Promise<void>;
  readonly children?: readonly MenuActionLike[];
}

/** Localized copy, bound once per open so a locale switch is picked up. */
export interface OpenLocalCopy {
  readonly open: string;
  readonly failed: string;
}

/** Everything the resolver needs from the page. */
export interface WorkspaceMenuDeps {
  readonly host: OpenInAppHost;
  /** Shared choice slot; null means this page refuses storage. */
  readonly storage: StorageLike | null;
  readonly copy: OpenLocalCopy;
}

/**
 * Resolve the workspace menu rows for one opening.
 *
 * A failed catalog read and an empty catalog are the same non-answer: return
 * no rows, so the menu shows nothing from this plugin instead of a dead entry.
 * The remembered application leads the child list and is what the parent icon
 * depicts. A child launch remembers its application only after the host
 * accepted it, so a failed open never overwrites the shared choice.
 * @param target - captured workspace, including its directory.
 * @param signal - aborted when the menu closes or re-prepares.
 * @param deps - host face, storage slot, and localized copy.
 * @returns one parent row with one child per installed application, or none.
 */
export async function resolveWorkspaceActions(
  target: WorkspaceTargetLike,
  signal: AbortSignal,
  deps: WorkspaceMenuDeps,
): Promise<readonly MenuActionLike[]> {
  let applications: readonly string[];
  try {
    applications = await deps.host.listApplications(signal);
  } catch {
    // The host answers "no capability" (SSH, non-desktop) the same way as a
    // broken route; both mean "this plugin has nothing to offer here".
    return [];
  }
  if (signal.aborted) return [];
  const ordered = orderApplications(applications, readRememberedApplication(deps.storage));
  const defaultApplication = ordered[0];
  if (defaultApplication === undefined) return [];

  return [{
    id: "open-local.open",
    label: deps.copy.open,
    // The parent is a pure submenu opener, so the icon previews the row the
    // user would reach first rather than implying a click target of its own.
    icon: { key: APPLICATION_ICON_KEY, src: deps.host.iconUrl(defaultApplication) },
    children: ordered.map((applicationId) => ({
      id: `app:${applicationId}`,
      // The host catalog is ids only; the id is the display name, as before.
      label: applicationId,
      icon: { key: APPLICATION_ICON_KEY, src: deps.host.iconUrl(applicationId) },
      failureLabel: deps.copy.failed,
      run: async () => {
        await deps.host.openDirectory(applicationId, target.path);
        rememberApplication(deps.storage, applicationId);
      },
    })),
  }];
}
