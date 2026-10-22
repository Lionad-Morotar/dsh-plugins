/**
 * Host half of dsh-tui-copy.
 *
 * The Loader mounts a plugin by package name; this half owns the one
 * registration the package makes. `inject` names `commands` because a plugin
 * row activates as soon as its own layer mounts, and the command registry is
 * mounted by a different row: without the declaration `apply` can run before
 * the service exists, register nothing, and leave the plugin installed but
 * inert.
 */
import { registerCopyCommand } from "./command.ts";
import type { HostContextLike } from "./command.ts";

export const name = "dsh-tui-copy";
export const inject = ["commands"];

/** The Cordis surface this plugin uses; spelled structurally so the package
 *  keeps no runtime dependency on the harness' internal type packages. */
export interface PluginContext extends HostContextLike {
  readonly logger?: { info?: (message: string) => void; warn?: (message: string) => void };
}

/** Run a clipboard helper with the text on stdin and resolve to its exit code. */
async function runHelper(command: string, args: readonly string[], text: string): Promise<number> {
  const { spawn } = await import("node:child_process");
  return await new Promise<number>(resolve => {
    let settled = false;
    const finish = (code: number) => {
      if (settled) return;
      settled = true;
      resolve(code);
    };
    try {
      const child = spawn(command, [...args], { stdio: ["pipe", "ignore", "ignore"] });
      child.on("error", () => finish(1));
      child.on("close", code => finish(typeof code === "number" ? code : 1));
      // A helper that never drains stdin would hold the caller: the payload is
      // small, but a failed write is still a failed copy.
      child.stdin?.on("error", () => finish(1));
      child.stdin?.end(text, "utf8");
    } catch {
      finish(1);
    }
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
  const commandContext: HostContextLike = {
    get: serviceName => ctx.get(serviceName),
    write: writeRaw,
    exec: runHelper,
    logger: ctx.logger,
  } as HostContextLike;

  try {
    registerCopyCommand(commandContext, environment);
    ctx.logger?.info?.("/copy is ready: /copy [<number=1>] [--all]");
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    ctx.logger?.warn?.("dsh-tui-copy: /copy is unavailable on this composition: " + detail);
  }
}
