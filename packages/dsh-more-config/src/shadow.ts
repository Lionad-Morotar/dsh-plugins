/**
 * The shadow namespace: this package's own volatile settings schema.
 *
 * `mcpTimeouts` is the single write funnel (decision D5). The volatile
 * annotation is what admits the field into the settings forms pipeline —
 * `SettingsForms` both lists and writes only volatile paths — while every
 * mutation of the mcp rows themselves stays with the reconciler.
 *
 * Shape note: schemastery requires volatile fields to sit at a fixed object
 * path (a volatile dict's `.*` keys are refused at schema build time), so the
 * map ships as an array of records and converts at this boundary. The
 * floor is declared here too, because the mcp client's own schema has none.
 */
import z from "@deepseek-ai/schemastery";
import type { ShadowTimeouts } from "./plan.ts";

export type { ShadowTimeouts };

/** This package's Loader row id, and its settings namespace. */
export const NS = "more-config";

/** The smallest timeout accepted; the client schema declares no floor, so this package owns one. */
export const MIN_TIMEOUT_MS = 1000;

/** One shadow record: which profile entry, which wanted timeout. */
export interface ShadowEntry {
  readonly id: string;
  readonly timeoutMs: number;
}

/** The plain (non-volatile) field schema, exported so its value semantics are testable. */
export const mcpTimeoutsField = z
  .array(z.object({ id: z.string(), timeoutMs: z.number().min(MIN_TIMEOUT_MS) }))
  .default([]);

/** One live MCP server row, projected by the host half for the panel. */
export interface ServerEntry {
  readonly id: string;
  readonly serverName: string;
  readonly timeoutMs: number;
}

/** The projected server list field: same fixed-path volatile constraint, same record-array shape. */
export const mcpServersField = z
  .array(z.object({ id: z.string(), serverName: z.string(), timeoutMs: z.number() }))
  .default([]);

/**
 * Read the projected server list out of a raw config value. Hostile input
 * degrades entry-by-entry, exactly like the shadow map: the panel must render
 * from whatever is there, never fail the section.
 */
export function toServerList(value: unknown): ServerEntry[] {
  if (!Array.isArray(value)) return [];
  const list: ServerEntry[] = [];
  const seen = new Set<string>();
  for (const entry of value) {
    if (typeof entry !== "object" || entry === null) continue;
    const { id, serverName, timeoutMs } = entry as { id?: unknown; serverName?: unknown; timeoutMs?: unknown };
    if (typeof id !== "string" || id.length === 0) continue;
    if (typeof serverName !== "string") continue;
    if (typeof timeoutMs !== "number" || !Number.isFinite(timeoutMs)) continue;
    if (seen.has(id)) continue;
    seen.add(id);
    list.push({ id, serverName, timeoutMs });
  }
  return list;
}

/** The live-editable shadow plus the host-projected server list. */
export const Config = z.object({
  mcpTimeouts: mcpTimeoutsField.volatile(),
  mcpServers: mcpServersField.volatile(),
});

/**
 * Read a shadow map out of a raw config value (a describe() value or a parsed
 * layer). Anything that is not a plain array of well-formed entries reads as
 * empty — a hostile or half-written document must degrade to "no overrides",
 * never to a boot failure.
 */
export function toTimeoutMap(value: unknown): ShadowTimeouts {
  if (!Array.isArray(value)) return {};
  const map: ShadowTimeouts = {};
  for (const entry of value) {
    if (typeof entry !== "object" || entry === null) continue;
    const { id, timeoutMs } = entry as { id?: unknown; timeoutMs?: unknown };
    if (typeof id !== "string" || id.length === 0) continue;
    if (typeof timeoutMs !== "number" || !Number.isFinite(timeoutMs)) continue;
    map[id] = timeoutMs;
  }
  return map;
}

/** Serialize a shadow map back to the stored array form; last key wins. */
export function toShadowEntries(map: ShadowTimeouts): ShadowEntry[] {
  return Object.entries(map).map(([id, timeoutMs]) => ({ id, timeoutMs }));
}

