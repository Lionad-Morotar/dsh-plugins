/**
 * `/mcp-timeout` as the host registry sees it.
 *
 * Sets write the shadow namespace through the settings service and let the
 * reconciler own every mcp-row mutation; `default` is the one exception, an
 * explicit removal that strips the row's override and the shadow key in one
 * action, because a removal is a decision the sync must never make on its own
 * (decision D5).
 *
 * The command resolves its target against the live inventory, so its errors can
 * teach: an unknown name answers with the rows that do exist and what they
 * currently run at, which is the whole inventory display v1 ships with.
 */
import { readMcpInventory, type ConfigEditorLike, type McpEntryLike, type McpInventoryRow } from "./inventory.ts";
import { MIN_TIMEOUT_MS, toShadowEntries, toTimeoutMap } from "./shadow.ts";

export { MIN_TIMEOUT_MS };

/** Command name without the leading slash. */
export const MCP_TIMEOUT_COMMAND_NAME = "mcp-timeout";

/** One-line help shown in the palette. */
export const MCP_TIMEOUT_COMMAND_DESCRIPTION = "Set or reset one MCP server's tool-call timeout (writes more-config, syncs the mcp row)";

/** The settings service surface this command writes through; the volatile
 *  shadow makes these writes legal for the settings forms pipeline. */
export interface SettingsServiceLike {
  /** Fresh descriptors; the command reads its own namespace's current value. */
  describe(options?: unknown): Promise<readonly { ns: string; value?: unknown }[]> | readonly { ns: string; value?: unknown }[];
  /** Merge a patch into one namespace. */
  update(ns: string, patch: Record<string, unknown>, expectedRevision?: number): Promise<unknown>;
}

/** The configEditor surface the reset path needs on top of the inventory read. */
export interface EditingConfigEditorLike extends ConfigEditorLike {
  /** Validate, persist, and reconcile a plugin's next config. */
  edit(
    entry: McpEntryLike,
    change: (current: Record<string, unknown>, inherited: Record<string, unknown>) => Record<string, unknown>,
  ): Promise<unknown>;
}

/** Everything the command needs, injected so tests drive every branch. */
export interface McpTimeoutDeps {
  /** This package's settings namespace (its Loader row id). */
  readonly ns: string;
  readonly settings: SettingsServiceLike;
  readonly configEditor: EditingConfigEditorLike;
}

/** The slice of a command invocation this command reads. */
export interface McpTimeoutInvocationLike {
  readonly agent: unknown;
  readonly rawInput: string;
}

/** The slice of a command result the adapters render. */
export interface McpTimeoutResultLike {
  readonly kind: "success" | "error";
  readonly text: string;
}

/** The slice of a command definition the registry accepts. */
export interface McpTimeoutDefinitionLike {
  readonly name: string;
  readonly description: string;
  readonly input?: { readonly hint: string };
  readonly handler: (invocation: McpTimeoutInvocationLike) => McpTimeoutResultLike | Promise<McpTimeoutResultLike>;
}

/** The parsed argument pair. */
interface ParsedInput {
  readonly target: string;
  readonly kind: { readonly type: "reset" } | { readonly type: "set"; readonly ms: number };
}

/** Parse `<target> <ms|default>`; anything else is a usage error. */
export function parseMcpTimeoutInput(raw: string): ParsedInput | null {
  const parts = raw.trim().split(/\s+/).filter(part => part.length > 0);
  if (parts.length !== 2) return null;
  const target = parts[0];
  const value = parts[1];
  if (target === undefined || value === undefined) return null;
  if (value === "default") return { target, kind: { type: "reset" } };
  if (!/^\d+$/.test(value)) return null;
  const ms = Number(value);
  if (!Number.isSafeInteger(ms) || ms < MIN_TIMEOUT_MS) return { target, kind: { type: "set", ms: -1 } };
  return { target, kind: { type: "set", ms } };
}

/** Read the current shadow map out of the descriptors. */
async function currentShadow(deps: McpTimeoutDeps): Promise<Record<string, number>> {
  const descriptors = await deps.settings.describe();
  const own = Array.isArray(descriptors) ? descriptors.find(descriptor => descriptor.ns === deps.ns) : undefined;
  return toTimeoutMap((own?.value as { mcpTimeouts?: unknown } | undefined)?.mcpTimeouts);
}

/** Find the one row a target names, by entry id or unique serverName. */
function resolveTarget(target: string, rows: readonly McpInventoryRow[]): { row?: McpInventoryRow; ambiguous?: readonly McpInventoryRow[] } {
  const byId = rows.find(row => row.id === target);
  if (byId !== undefined) return { row: byId };
  const byName = rows.filter(row => row.serverName === target);
  if (byName.length === 1) return { row: byName[0] };
  if (byName.length > 1) return { ambiguous: byName };
  return {};
}

/** One candidate line for the teaching errors. */
function candidateLine(row: McpInventoryRow): string {
  return `- ${row.id} (server: ${row.serverName}, timeout: ${row.effectiveTimeoutMs}ms)`;
}

/**
 * Build the command. Errors stay actionable: unknown names list the live rows,
 * value refusals name the floor, and both include the argument shape.
 */
export function createMcpTimeoutCommand(deps: McpTimeoutDeps): McpTimeoutDefinitionLike {
  const usage = `用法：/${MCP_TIMEOUT_COMMAND_NAME} <server|entryId> <ms|default>（ms ≥ ${MIN_TIMEOUT_MS}，default 恢复继承值）`;
  return {
    name: MCP_TIMEOUT_COMMAND_NAME,
    description: MCP_TIMEOUT_COMMAND_DESCRIPTION,
    input: { hint: "<server|entryId> <ms|default>" },
    async handler(invocation) {
      const parsed = parseMcpTimeoutInput(invocation.rawInput);
      if (parsed === null) return { kind: "error", text: usage };

      const rows = readMcpInventory(deps.configEditor);
      const { row, ambiguous } = resolveTarget(parsed.target, rows);
      if (row === undefined) {
        if (ambiguous !== undefined) {
          const list = ambiguous.map(candidateLine).join("\n");
          return { kind: "error", text: `「${parsed.target}」匹配多行，请用 entryId 指定：\n${list}` };
        }
        const list = rows.length > 0 ? rows.map(candidateLine).join("\n") : "（当前 profile 没有 mcp-client 行）";
        return { kind: "error", text: `找不到「${parsed.target}」。现有 MCP 行：\n${list}` };
      }

      if (parsed.kind.type === "reset") {
        await deps.configEditor.edit(row.entry, current => {
          const next = { ...current };
          delete next.toolCallTimeoutMs;
          return next;
        });
        const shadow = await currentShadow(deps);
        delete shadow[row.id];
        await deps.settings.update(deps.ns, { mcpTimeouts: toShadowEntries(shadow) });
        return { kind: "success", text: `${row.id} 的超时覆盖已移除，回到继承值；该 MCP 服务器连接将重启生效。` };
      }

      if (parsed.kind.ms < MIN_TIMEOUT_MS) {
        return { kind: "error", text: `超时值必须是不小于 ${MIN_TIMEOUT_MS} 的毫秒数。\n${usage}` };
      }

      const shadow = await currentShadow(deps);
      if (shadow[row.id] === parsed.kind.ms) {
        return { kind: "success", text: `${row.id} 已是 ${parsed.kind.ms}ms，无需改动。` };
      }
      shadow[row.id] = parsed.kind.ms;
      await deps.settings.update(deps.ns, { mcpTimeouts: toShadowEntries(shadow) });
      return { kind: "success", text: `${row.id} 超时已设为 ${parsed.kind.ms}ms，正在同步到 MCP 行；该服务器连接将重启生效。` };
    },
  };
}
