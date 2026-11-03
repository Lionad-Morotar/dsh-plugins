import type { CommandUiService } from "./dsh.ts";
import type { Copy } from "./copy.ts";
import type { PanelRow } from "./rows.ts";

const PREFIX = "client-command:";

function actionFor(service: CommandUiService | undefined, name: string, sessionId: string | null) {
  if (sessionId === null) return undefined;
  const entry = service?.live?.contributions?.get(name);
  if (entry?.ui?.kind !== "action" || typeof entry.ui.run !== "function") return undefined;
  try {
    if (entry.available !== undefined && !entry.available({ sessionId })) return undefined;
    return entry;
  } catch {
    return undefined;
  }
}

export function clientCommandRows(service: CommandUiService | undefined, sessionId: string | null, copy: Copy): PanelRow[] {
  const rows: PanelRow[] = [];
  if (sessionId === null || !(service?.live?.contributions instanceof Map)) return rows;
  for (const [name] of service.live.contributions) {
    const entry = actionFor(service, name, sessionId);
    if (entry === undefined) continue;
    try {
      const label = typeof entry.label === "function" ? entry.label() : entry.label;
      const description = typeof entry.description === "function" ? entry.description() : entry.description;
      rows.push({
        key: `${PREFIX}${name}`,
        label: label || `/${name}`,
        alias: name,
        detail: description,
        group: copy.groupCommands,
        action: { kind: "execute-command", name, needsInput: false },
      });
    } catch {
      // One broken contribution must not hide the rest of the catalogue.
    }
  }
  return rows;
}

export function isClientCommandRow(row: PanelRow): boolean {
  return row.key.startsWith(PREFIX);
}

export async function runClientCommand(service: CommandUiService | undefined, name: string, sessionId: string | null): Promise<void> {
  const entry = actionFor(service, name, sessionId);
  if (entry === undefined || sessionId === null) throw new Error("Command unavailable");
  await entry.ui?.run?.({ sessionId });
}
