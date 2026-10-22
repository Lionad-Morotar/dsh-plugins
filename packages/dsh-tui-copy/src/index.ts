/**
 * Host half of dsh-tui-copy.
 *
 * The Loader mounts a plugin by package name; this half owns the one
 * registration the package makes. `inject` names `commands` because the plugin
 * row activates as soon as its own layer mounts while the command registry is
 * mounted by a different row: without the declaration `apply` can run before
 * the service exists, register nothing, and leave the plugin installed but
 * inert (observed on the first real launch).
 *
 * Registration is deferred one macrotask for the same reason on the other side:
 * `tuiPluginHost` is mounted by yet another row and is still absent when `apply`
 * runs (measured absent at apply, present ~250ms later). Registering
 * synchronously therefore always missed the mediated path.
 */
import { MISSING_TOOL } from "./clipboard.ts";
import { registerCopyCommand } from "./command.ts";
import type { ClipboardEffects, HostContextLike } from "./command.ts";

export const name = "dsh-tui-copy";
export const inject = ["commands"];

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

export function apply(ctx: PluginContext): void {
  const environment = { platform: process.platform, env: { ...process.env } };
  const effects: ClipboardEffects = { write: writeRaw, exec: runHelper };

  // One macrotask later the host row is mounted; registering from the same
  // tick as `apply` always missed it.
  setTimeout(() => {
    try {
      // The live activation context goes to registration untouched: the
      // mediated path validates the Cordis activation marker on it, which a
      // synthesized object would not carry.
      registerCopyCommand(ctx, environment, effects);
      ctx.logger?.info?.("/copy is ready: /copy [<number=1>] --all");
    } catch (error) {
      const detail = error instanceof Error ? error.message : String(error);
      ctx.logger?.warn?.("dsh-tui-copy: /copy is unavailable on this composition: " + detail);
    }
  }, 0);
}
