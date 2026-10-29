/**
 * Host half of dsh-slash-commands.
 *
 * One package, one host half, two commands with different homes:
 *
 * - `/rename` registers on the harness-wide `commands` registry. Every UI
 *   adapter reads that catalog over the same remote surface, so this single
 *   registration is what makes the command visible on web, desktop and TUI at
 *   once. It needs no terminal.
 * - `/archive` and `/unarchive` register on the same registry for the same
 *   reason: the write belongs to the host's `workspaceRegistry` (the durable
 *   archive set), so every surface can execute them and the host's push
 *   stream converges the web/desktop UI on its own — the sidebar hides the
 *   row and the open main view is cleared by the host's own reconcile, with
 *   no client-half code of ours anywhere in that chain.
 * - `/copy` needs the TUI's terminal: its OSC 52 escape and clipboard helpers
 *   only mean anything there. It registers through `tuiPluginHost` when the
 *   composition admits third-party activations, falling back to the plain
 *   registry otherwise.
 *
 * `inject` names `commands` because the plugin row activates as soon as its own
 * layer mounts while the command registry is mounted by a different row:
 * without the declaration `apply` can run before the service exists, register
 * nothing, and leave the plugin installed but inert (observed on the first real
 * launch).
 *
 * Registration is deferred one macrotask for the same reason on the other side:
 * `tuiPluginHost` is mounted by yet another row and is still absent when `apply`
 * runs (measured absent at apply, present ~250ms later). Registering
 * synchronously therefore always missed the mediated path.
 */
import { MISSING_TOOL } from "./clipboard.ts";
import { registerArchiveCommands } from "./archive-command.ts";
import { registerCopyCommand } from "./command.ts";
import type { ClipboardEffects, HostContextLike } from "./command.ts";
import { registerRenameCommand } from "./rename-command.ts";

export const name = "dsh-slash-commands";

/**
 * Cordis refuses a service read from a plugin that did not declare it, so the
 * services this package reads are declared here. `sessionTitle` is what
 * `/rename` writes through; without the declaration the read throws a
 * gateway-level contract error and the command reports itself unavailable.
 *
 * `workspaceRegistry` is deliberately NOT declared: a declaration makes the
 * whole plugin row wait for the service, and a minimal composition (headless
 * boots without the workspace domain) would then lose /rename and /copy too —
 * observed pending on the real headless boot. The archive pair instead
 * resolves the registry softly per invocation and reports a missing service
 * as a per-command error, so each command's availability stays independent,
 * the same way /copy's is gated by the terminal rather than the row.
 */
export const inject = ["commands", "sessionTitle"];

/** The Cordis surface this plugin uses; spelled structurally so the package
 *  keeps no runtime dependency on the harness' internal type packages. */
export interface PluginContext extends HostContextLike {
  readonly logger?: { info?: (message: string) => void; warn?: (message: string) => void };
}

/** Longest a clipboard helper may take before it counts as failed. The host's
 *  own clipboard path uses the same 2s bound. */
const HELPER_TIMEOUT_MS = 2000;

/**
 * Run a clipboard helper with the text on stdin and resolve to its exit code
 * (callers only distinguish 0 from non-zero).
 *
 * Bounded on purpose: a helper that never exits (a wedged X server, a clipboard
 * tool waiting on an empty message loop) would otherwise leave `/copy` awaiting
 * forever with no feedback at all.
 */
export async function runHelper(command: string, args: readonly string[], text: string): Promise<number> {
  const { spawn } = await import("node:child_process");
  return await new Promise<number>(resolve => {
    let settled = false;
    let timer: NodeJS.Timeout | undefined;
    const child = (() => {
      try {
        return spawn(command, [...args], { stdio: ["pipe", "ignore", "ignore"] });
      } catch {
        return undefined;
      }
    })();
    const finish = (code: number) => {
      if (settled) return;
      settled = true;
      if (timer !== undefined) clearTimeout(timer);
      // A timed-out child must not outlive the copy it was serving.
      if (code !== 0) {
        try {
          child?.kill();
        } catch {
          // Already gone.
        }
      }
      resolve(code);
    };
    if (child === undefined) {
      finish(MISSING_TOOL);
      return;
    }
    timer = setTimeout(() => finish(1), HELPER_TIMEOUT_MS);
    // ENOENT from spawning is "not installed", not "ran and failed".
    child.on("error", error => finish((error as NodeJS.ErrnoException).code === "ENOENT" ? MISSING_TOOL : 1));
    child.on("close", code => finish(typeof code === "number" ? code : 1));
    child.stdin?.on("error", () => finish(1));
    child.stdin?.end(text, "utf8");
  });
}

/**
 * Write a raw escape sequence to the terminal.
 *
 * IPC renders to the same fd, so the sequence goes out as one write and never
 * through the logger: a logged escape would be escaped, and anything that
 * splits the sequence lands as visible garbage in the frame.
 */
function writeRaw(sequence: string): void {
  process.stdout.write(sequence);
}

/**
 * Whether this process is the terminal front end.
 *
 * The split matters because the two commands are not interchangeable across
 * surfaces: `/copy` writes the clipboard of the machine running this process
 * (native helper, tmux buffer, OSC 52 escape), which on a web or desktop host is
 * a server the user is not sitting at. Offering it there would be a command that
 * silently copies into the wrong clipboard, so it is registered only where a
 * terminal is the actual UI.
 *
 * The check is the terminal capability, not the profile name: any composition
 * that mounts TUI's plugin host is a terminal, whatever the profile is called.
 */
function isTerminalSurface(ctx: PluginContext): boolean {
  return ctx.get("tuiPluginHost", false) !== undefined || ctx.get("tuiToast", false) !== undefined;
}

export function apply(ctx: PluginContext): void {
  const environment = { platform: process.platform, env: { ...process.env } };
  const effects: ClipboardEffects = { write: writeRaw, exec: runHelper };

  // `/rename` changes a session title through the harness-wide registry, so it
  // is surface-independent and goes in immediately: the macrotask delay below
  // exists for `tuiPluginHost`, which this command never touches. The archive
  // pair shares that independence — the host registry write converges every
  // surface — so it registers in the same immediate pass.
  try {
    registerRenameCommand(ctx);
    ctx.logger?.info?.("/rename is ready: /rename <new title>");
  } catch (error) {
    // A composition can mount its command surfaces differently; logged rather
    // than thrown so the terminal half still gets its chance.
    const detail = error instanceof Error ? error.message : String(error);
    ctx.logger?.info?.("dsh-slash-commands: /rename is unavailable on this composition: " + detail);
  }
  try {
    registerArchiveCommands(ctx);
    ctx.logger?.info?.("/archive and /unarchive are ready: /archive [--stop], /unarchive");
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    ctx.logger?.info?.("dsh-slash-commands: /archive and /unarchive are unavailable on this composition: " + detail);
  }

  // One macrotask later the host row is mounted; registering from the same
  // tick as `apply` always missed it.
  setTimeout(() => {
    if (!isTerminalSurface(ctx)) {
      // Deliberately silent registration-free exit: on web and desktop the only
      // clipboard worth writing is the browser's own, which those surfaces
      // already provide. Registering anyway would put a dead command in the
      // palette.
      return;
    }
    try {
      // The live activation context goes to registration untouched: the
      // mediated path validates the Cordis activation marker on it, which a
      // synthesized object would not carry.
      registerCopyCommand(ctx, environment, effects);
      ctx.logger?.info?.("/copy is ready: /copy [<number=1>] --all");
    } catch (error) {
      const detail = error instanceof Error ? error.message : String(error);
      ctx.logger?.warn?.("dsh-slash-commands: /copy is unavailable on this composition: " + detail);
    }
  }, 0);
}