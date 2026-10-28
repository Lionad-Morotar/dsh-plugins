/**
 * The shadow schema spec: this package's own settings namespace.
 *
 * The contract under test is the one the whole architecture stands on: the
 * `mcpTimeouts` field carries a volatile annotation at a fixed path (that is
 * what lets the settings forms pipeline write it, and what schemastery demands
 * — volatile dict keys are refused at build time, hence the array shape); the
 * plain field round-trips records, defaults to empty, and enforces the floor;
 * the map converters tolerate hostile input by degrading to "no overrides".
 */
import { describe, expect, it } from "vitest";
import { Config, MIN_TIMEOUT_MS, NS, mcpTimeoutsField, toShadowEntries, toTimeoutMap } from "../src/shadow.ts";

describe("shadow schema", () => {
  it("keeps the namespace aligned with the Loader row id", () => {
    expect(NS).toBe("more-config");
  });

  it("annotates the timeouts field volatile at its fixed path, as the settings pipeline requires", () => {
    const json = Config.toJSON() as unknown as { uid: number; refs: Record<string, { type?: string; meta?: { volatile?: boolean }; dict?: Record<string, number> }> };
    const root = json.refs[String(json.uid)];
    const fieldRef = root?.dict?.mcpTimeouts;
    expect(fieldRef).toBeDefined();
    const field = json.refs[String(fieldRef ?? -1)];
    expect(field?.type).toBe("array");
    expect(field?.meta?.volatile).toBe(true);
  });

  it("round-trips records, defaults to empty, and enforces the floor", () => {
    expect(mcpTimeoutsField([{ id: "mcp-kimi-tools", timeoutMs: 660000 }])).toEqual([{ id: "mcp-kimi-tools", timeoutMs: 660000 }]);
    expect(mcpTimeoutsField(undefined)).toEqual([]);
    expect(() => mcpTimeoutsField([{ id: "bad", timeoutMs: MIN_TIMEOUT_MS - 1 }])).toThrow(/>=\s*1000/);
  });
});

describe("shadow converters", () => {
  it("reads a well-formed array into a map", () => {
    expect(toTimeoutMap([{ id: "a", timeoutMs: 5000 }, { id: "b", timeoutMs: 6000 }])).toEqual({ a: 5000, b: 6000 });
  });

  it("degrades hostile or missing input to an empty map, entry by entry", () => {
    expect(toTimeoutMap(undefined)).toEqual({});
    expect(toTimeoutMap({})).toEqual({});
    expect(toTimeoutMap("junk")).toEqual({});
    expect(toTimeoutMap([{ id: "", timeoutMs: 5000 }, { id: "x" }, { id: "y", timeoutMs: "big" }, null])).toEqual({});
    expect(toTimeoutMap([{ id: "ok", timeoutMs: 5000 }, { id: "bad", timeoutMs: NaN }])).toEqual({ ok: 5000 });
  });

  it("serializes a map back to entries and round-trips", () => {
    const entries = toShadowEntries({ "mcp-kimi-tools": 660000 });
    expect(entries).toEqual([{ id: "mcp-kimi-tools", timeoutMs: 660000 }]);
    expect(toTimeoutMap(entries)).toEqual({ "mcp-kimi-tools": 660000 });
  });
});
