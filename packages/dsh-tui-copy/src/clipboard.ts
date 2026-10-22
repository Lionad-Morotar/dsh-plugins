/**
 * Putting text on the system clipboard from inside a terminal.
 *
 * No single mechanism works everywhere, so a copy fires every one this
 * environment offers:
 *
 * - `native` -- a local shell-out (`pbcopy`, `wl-copy`, `xclip`, `xsel`,
 *   `clip.exe`). Verifiable (exit code) and always works locally; never run
 *   over SSH, where it would write the *remote* machine's clipboard.
 * - `tmux-buffer` -- `tmux load-buffer` inside tmux. Survives detach/reattach
 *   and is reachable with prefix+], but it is tmux's own buffer, not the
 *   system clipboard, so it cannot be the only path.
 * - `osc52` -- the terminal escape. Needs no subprocess and crosses SSH, but
 *   the outer terminal may silently ignore it (iTerm2 disables it by default,
 *   VS Code prompts on first use, plain tmux drops the passthrough unless
 *   `allow-passthrough on`), so it can never be verified from here.
 *
 * Firing them together is what makes the result trustworthy: inside tmux on a
 * local macOS session the buffer alone leaves the system clipboard untouched
 * (passthrough off by default), and the escape alone leaves nothing when the
 * terminal ignores it. Either one alone ends with the user pasting stale text.
 */

/** Which mechanism a copy attempt used. */
export type ClipboardPath = "native" | "tmux-buffer" | "osc52";

/** Result of one copy attempt. */
export interface ClipboardOutcome {
  /** Mechanisms attempted, in canonical order (never race order). */
  readonly attempted: readonly ClipboardPath[];
  /** Mechanisms that reported success. The escape cannot be verified, so it
   *  never appears here; that is exactly what `degraded` is for. */
  readonly landed: readonly ClipboardPath[];
  /** UTF-8 byte length of the copied text, so the caller can warn on size. */
  readonly bytes: number;
  /** A verifiable path was available and failed: the copy now rests on an
   *  escape nothing here can confirm. */
  readonly degraded: boolean;
}

/** The environment facts path selection depends on. */
export interface ClipboardEnvironment {
  readonly platform: string;
  readonly env: Record<string, string | undefined>;
}

/** Exit code for "the program is not installed", which is not the same thing
 *  as "the program ran and failed": a machine with no clipboard tool at all has
 *  no verifiable path to lose, so it must not be reported as degraded. */
export const MISSING_TOOL = -2;

/** Injected effects, so every branch is testable without a terminal. */
export interface ClipboardDeps extends ClipboardEnvironment {
  /** Run a helper with `text` on stdin; resolves to its exit code, or to
   *  {@link MISSING_TOOL} when the program does not exist. */
  readonly exec: (command: string, args: readonly string[], text: string) => Promise<number>;
  /** Write a raw escape sequence to the terminal. */
  readonly write: (sequence: string) => void;
}

const ESC = "\u001b";
const BEL = "\u0007";
const ST = "\u001b\\";

/** The OSC 52 clipboard write: `ESC ] 52 ; c ; <base64> BEL`, `c` = clipboard. */
export function osc52Sequence(text: string): string {
  return ESC + "]52;c;" + Buffer.from(text, "utf8").toString("base64") + BEL;
}

/**
 * OSC 52 wrapped in tmux's DCS passthrough so tmux forwards it verbatim.
 *
 * Every ESC inside the body is doubled, including the inner OSC's own: tmux
 * reads an undoubled ESC as the end of the passthrough.
 */
export function tmuxSequence(text: string): string {
  const payload = ESC + "]52;c;" + Buffer.from(text, "utf8").toString("base64") + BEL;
  return ESC + "Ptmux;" + payload.replaceAll(ESC, ESC + ESC) + ST;
}

/**
 * The native clipboard helpers to try, in order.
 *
 * Linux has no single tool (Wayland, X11 and headless sessions differ), so the
 * plausible ones are tried in turn and the first that exits 0 wins.
 */
export function nativeHelpers(platform: string): readonly (readonly [string, readonly string[]])[] {
  if (platform === "darwin") return [["pbcopy", []]];
  if (platform === "win32") return [["clip", []]];
  if (platform === "linux") {
    return [
      ["wl-copy", []],
      ["xclip", ["-selection", "clipboard"]],
      ["xsel", ["--clipboard", "--input"]],
    ];
  }
  return [];
}

/**
 * Copy `text`, firing every mechanism this environment offers.
 *
 * The native helper is started first and awaited last: a user who switches to
 * their editor right after `/copy` would otherwise race a 50-100ms subprocess
 * and paste the previous clipboard.
 */
export async function copyToClipboard(text: string, deps: ClipboardDeps): Promise<ClipboardOutcome> {
  const bytes = Buffer.byteLength(text, "utf8");
  const inTmux = (deps.env["TMUX"] ?? "") !== "";
  // Over SSH a native helper writes the remote clipboard: never try it there.
  const helpers = deps.env["SSH_CONNECTION"] === undefined ? nativeHelpers(deps.platform) : [];

  let nativeLanded = false;
  let nativeRan = false;
  const nativeAttempt = (async () => {
    for (const [command, args] of helpers) {
      const code = await runSafely(() => deps.exec(command, args, text));
      // A tool that is simply not installed never ran, so its absence cannot
      // count as the verifiable path failing.
      if (code !== MISSING_TOOL) nativeRan = true;
      if (code === 0) {
        nativeLanded = true;
        return;
      }
    }
  })();

  let bufferLanded = false;
  if (inTmux) {
    // iTerm2 + tmux + SSH: tmux's own OSC 52 emission crashes the session, so
    // the -w propagation flag is dropped there; the buffer itself still loads.
    const args = deps.env["LC_TERMINAL"] === "iTerm2" ? ["load-buffer", "-"] : ["load-buffer", "-w", "-"];
    bufferLanded = (await runSafely(() => deps.exec("tmux", args, text))) === 0;
  }

  // Inside tmux only the passthrough reaches the outer terminal; elsewhere the
  // raw escape goes straight out.
  deps.write(bufferLanded ? tmuxSequence(text) : osc52Sequence(text));
  await nativeAttempt;

  const attempted: ClipboardPath[] = [];
  if (nativeRan) attempted.push("native");
  if (inTmux) attempted.push("tmux-buffer");
  attempted.push("osc52");

  const landed: ClipboardPath[] = [];
  if (nativeLanded) landed.push("native");
  if (bufferLanded) landed.push("tmux-buffer");

  // Degraded means a verifiable path was available and failed, so the copy now
  // rests on an escape nobody can confirm. Over SSH the escape is not a
  // fallback, it is the intended path: warning there every single time would
  // train the user to ignore the warning that matters.
  const hadVerifiablePath = attempted.some(path => path !== "osc52");
  return { attempted, landed, bytes, degraded: hadVerifiablePath && landed.length === 0 };
}

/** A helper that cannot be spawned counts as a failed helper, not as a crash. */
async function runSafely(run: () => Promise<number>): Promise<number> {
  try {
    return await run();
  } catch {
    return 1;
  }
}
