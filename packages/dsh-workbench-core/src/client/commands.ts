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

/** Desktop profiles all carry the declared binding; web intentionally has none. */
function desktopDefaults(binding: KeyBinding): Record<string, KeyBinding> {
  return {
    "desktop:macos": binding,
    "desktop:windows": binding,
    "desktop:linux": binding,
  };
}

/** Build the resolver for one command, closing over the service. */
function resolverFor(spec: WorkbenchCommandSpec, service: WorkbenchService): () => ShortcutResolutionLike {
  if (spec.id === "workbench.term.toggle") {
    return () => ({
      status: "handled",
      run: () => service.setDockVisible(!service.dockVisible()),
    });
  }
  const viewId = VIEW_BY_GROUP[spec.group];
  return () => {
    if (service.currentSessionId() === undefined) {
      return { status: "blocked", reason: "请先选择会话" };
    }
    if (viewId === undefined) return { status: "pass" };
    return {
      status: "handled",
      run: () => {
        service.openView(viewId);
      },
    };
  };
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
