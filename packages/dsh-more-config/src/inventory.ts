/**
 * The mcp-client rows of the active profile, flattened into one view.
 *
 * Everything that reads MCP servers goes through here — the `/mcp-timeout`
 * command validating its target, the reconciler planning its sync, later the
 * settings panel — so "which rows count and where each value comes from" is
 * answered exactly once.
 *
 * Layer rules mirror the configEditor's own: `override` is what this profile's
 * patch declares, `inherited` is what the composed layers underneath resolve
 * to, and the mcp client's own schema default (60s) applies when neither layer
 * mentions the field.
 */

/** npm name of the only package this inventory admits. */
export const MCP_CLIENT_PACKAGE = "@deepseek-ai/dsh-mcp-client";

/** The mcp client's `DEFAULT_TOOL_CALL_TIMEOUT_MS`, mirrored for display and planning. */
export const DEFAULT_TOOL_CALL_TIMEOUT_MS = 60_000;

/** A Loader entry handle, opaque outside `configEditor.edit`. */
export interface McpEntryLike {
  readonly options: {
    readonly id: string;
    readonly name?: string;
  };
}

/** The configEditor surface this package reads; structural so no runtime
 *  dependency on the harness' internal type packages is needed. */
export interface ConfigEditorLike {
  /** Addressable profile rows (children of the include plugin). */
  entries(): readonly McpEntryLike[];
  /** Inherited and explicit profile values for the active entries. */
  configuration(): readonly McpInventoryLayer[];
}

/** One configuration() row: the entry plus its two value layers. */
export interface McpInventoryLayer {
  readonly entry: McpEntryLike;
  readonly inherited: Record<string, unknown>;
  readonly override: Record<string, unknown>;
}

/** One mcp-client row, flattened. */
export interface McpInventoryRow {
  /** Profile entry id (`mcp-kimi-tools`), the shadow map's key. */
  readonly id: string;
  /** MCP server namespace from the config layers. */
  readonly serverName: string;
  /** Timeout in force right now: override, else inherited, else the client default. */
  readonly effectiveTimeoutMs: number;
  /** Timeout declared by this profile's own patch, when it overrides. */
  readonly overrideTimeoutMs: number | undefined;
  /** The Loader entry handle, for `configEditor.edit`. */
  readonly entry: McpEntryLike;
}

/** Read a number that survived YAML, rejecting everything else. */
function numberOf(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

/** Read the first present string of one field across the layers. */
function stringOf(field: string, layers: readonly Record<string, unknown>[]): string | undefined {
  for (const layer of layers) {
    const value = layer[field];
    if (typeof value === "string" && value.length > 0) return value;
  }
  return undefined;
}

/**
 * Project the profile's mcp-client rows.
 *
 * Non-mcp rows are dropped by entry name. Each row carries the `entry` handle
 * from its configuration() layer straight through, because `configEditor.edit`
 * validates that handle against its own entries() list.
 */
export function readMcpInventory(configEditor: ConfigEditorLike): McpInventoryRow[] {
  const rows: McpInventoryRow[] = [];
  for (const layer of configEditor.configuration()) {
    if (layer.entry.options.name !== MCP_CLIENT_PACKAGE) continue;
    const overrideTimeoutMs = numberOf(layer.override.toolCallTimeoutMs);
    rows.push({
      id: layer.entry.options.id,
      serverName: stringOf("serverName", [layer.override, layer.inherited]) ?? layer.entry.options.id,
      effectiveTimeoutMs: overrideTimeoutMs
        ?? numberOf(layer.inherited.toolCallTimeoutMs)
        ?? DEFAULT_TOOL_CALL_TIMEOUT_MS,
      overrideTimeoutMs,
      entry: layer.entry,
    });
  }
  return rows;
}
