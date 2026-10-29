/**
 * Register the workbench's global commands with the host shortcut service.
 *
 * Only `scope: "global"` rows are registered. Panel chords stay with the file
 * panel's DOM listener: `Ctrl+W` cannot be promised on web, and registering it
 * as an editable host binding would let the user "change" a chord the listener
 * does not read.
 *
 * Registration is best-effort per command: one conflicting default must not
 * take down the settings section, which is the surface that explains the
 * conflict in the first place.
 */
import { GLOBAL_COMMANDS, type KeyBinding, type WorkbenchCommandSpec } from "./keymap.ts";
import type { WorkbenchService } from "./service.ts";

/** One host command registration; structurally the client shortcut service. */
export interface ShortcutCommandRegistration {
  readonly id: string;
  readonly label: () => string;
  readonly aliases: readonly string[];
  readonly defaults: Readonly<Record<string, KeyBinding>>;
  readonly regions: readonly string[];
  readonly modals: readonly string[];
  resolve(context: unknown): ShortcutResolutionLike;
}

/** The three outcomes the host accepts from a command resolver. */
export type ShortcutResolutionLike =
  | { readonly status: "handled"; run(): void }
  | { readonly status: "blocked"; readonly reason: string }
  | { readonly status: "pass" };

/** The registry slice this module needs. */
export interface ShortcutRegistryLike {
  register(command: ShortcutCommandRegistration): () => void;
}

/** The conversation view each global command opens. */
const VIEW_BY_GROUP: Partial<Record<WorkbenchCommandSpec["group"], string>> = {
  files: "fs-explorer",
  git: "git-explorer",
};

/**
 * Per-call overrides for the command body.
 *
 * The web shell cannot rely on `service.openView`: the host only binds its
 * `openView` capability while the View More menu is mounted. The local key
 * router therefore hands the command a two-path opener that falls back to the
 * host's own tabs, while desktop registration keeps the service default.
 */
export interface WorkbenchCommandRuntime {
  /** Replace the view-opening step; returns whether the view was opened. */
  readonly openView?: (viewId: string) => boolean;
}

/** Desktop profiles all carry the declared binding; web intentionally has none. */
function desktopDefaults(binding: KeyBinding): Record<string, KeyBinding> {
  return {
    "desktop:macos": binding,
    "desktop:windows": binding,
    "desktop:linux": binding,
  };
}

/** Build the resolver for one command, closing over the service. */
function resolverFor(
  spec: WorkbenchCommandSpec,
  service: WorkbenchService,
  runtime: WorkbenchCommandRuntime = {},
): () => ShortcutResolutionLike {
  if (spec.id === "workbench.term.toggle") {
    return () => ({
      status: "handled",
      run: () => service.dockVisibility.toggle(),
    });
  }
  const viewId = VIEW_BY_GROUP[spec.group];
  const openView = runtime.openView ?? ((id: string) => service.openView(id));
  return () => {
    if (service.currentSessionId() === undefined) {
      return { status: "blocked", reason: "请先选择会话" };
    }
    if (viewId === undefined) return { status: "pass" };
    return {
      status: "handled",
      run: () => {
        openView(viewId);
      },
    };
  };
}

/**
 * Run one global command through the same resolver the host registry uses.
 *
 * The web local router calls this instead of re-implementing the command
 * bodies: a chord and a host menu selection must never diverge.
 * @param id - global command id.
 * @param service - the workbench service the command drives.
 * @param runtime - optional view-opening override for the web shell.
 * @returns true when the command ran; false when unknown or currently blocked.
 */
export function runWorkbenchCommand(
  id: string,
  service: WorkbenchService,
  runtime: WorkbenchCommandRuntime = {},
): boolean {
  const spec = GLOBAL_COMMANDS.find(command => command.id === id);
  if (spec === undefined) return false;
  const resolution = resolverFor(spec, service, runtime)();
  if (resolution.status !== "handled") return false;
  resolution.run();
  return true;
}

/**
 * Register every global workbench command.
 * @param shortcuts - host shortcut service, or undefined outside a capable host.
 * @param service - the workbench service the commands drive.
 * @param label - localized label seat.
 * @param onError - called for each registration the host rejects.
 * @returns one disposer releasing every accepted registration.
 */
export function registerWorkbenchCommands(
  shortcuts: ShortcutRegistryLike | undefined,
  service: WorkbenchService,
  label: (key: string) => string,
  onError?: (message: string) => void,
): () => void {
  if (shortcuts === undefined || typeof shortcuts.register !== "function") return () => {};
  const disposers: Array<() => void> = [];
  for (const spec of GLOBAL_COMMANDS) {
    try {
      disposers.push(
        shortcuts.register({
          id: spec.id,
          label: () => label(spec.labelKey),
          aliases: [],
          defaults: desktopDefaults(spec.desktop),
          regions: ["page"],
          modals: [],
          resolve: resolverFor(spec, service),
        }),
      );
    } catch (error) {
      onError?.(`${spec.id}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  return () => {
    for (const dispose of disposers.splice(0)) dispose();
  };
}
