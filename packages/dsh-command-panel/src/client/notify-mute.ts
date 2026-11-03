import type { Copy } from "./copy.ts";
import type { CommandUiService } from "./dsh.ts";
import type { PanelRow } from "./rows.ts";

interface NotifyApi {
  readonly config: { readonly mutedSessions?: unknown };
  setConfig(patch: { mutedSessions: string[] }): { readonly mutedSessions?: unknown };
  debug(): { readonly configStored?: boolean };
}

function api(): NotifyApi | undefined {
  const value = (globalThis as { __dshNotifyMe?: unknown }).__dshNotifyMe;
  if (value === null || typeof value !== "object") return undefined;
  const candidate = value as NotifyApi;
  if (typeof candidate.setConfig !== "function" || typeof candidate.debug !== "function") return undefined;
  return candidate;
}

function mutedIds(source: NotifyApi): string[] | undefined {
  try {
    if (source.debug().configStored === false) return undefined;
    const ids = source.config.mutedSessions;
    return Array.isArray(ids) && ids.every(id => typeof id === "string") ? ids : undefined;
  } catch {
    return undefined;
  }
}

export function notifyMuteRow(service: CommandUiService | undefined, sessionId: string | null, copy: Copy): PanelRow[] {
  if (sessionId === null) return [];
  const contributions = service?.live?.contributions;
  if (contributions?.has("mute-session") || contributions?.has("unmute-session")) return [];
  const source = api();
  const ids = source === undefined ? undefined : mutedIds(source);
  if (ids === undefined) return [];
  const muted = ids.includes(sessionId);
  const name = muted ? "unmute-session" : "mute-session";
  const english = copy.title === "Command Panel";
  return [{
    key: `notify-mute:${name}`,
    label: english ? (muted ? "Unmute this session" : "Mute this session") : (muted ? "取消静音当前会话" : "静音当前会话"),
    alias: name,
    group: copy.groupCommands,
    action: { kind: "execute-command", name, needsInput: false },
  }];
}

export function runNotifyMute(name: string, sessionId: string | null): void {
  const source = api();
  const ids = source === undefined ? undefined : mutedIds(source);
  if (source === undefined || ids === undefined || sessionId === null) throw new Error("Session mute unavailable");
  const muted = ids.includes(sessionId);
  if ((name === "mute-session" && muted) || (name === "unmute-session" && !muted)) throw new Error("Session mute state changed");
  const next = ids.filter(id => id !== sessionId);
  if (!muted) next.push(sessionId);
  const result = source.setConfig({ mutedSessions: next });
  if (!Array.isArray(result.mutedSessions) || result.mutedSessions.includes(sessionId) === muted) {
    throw new Error("Session mute update failed");
  }
}
