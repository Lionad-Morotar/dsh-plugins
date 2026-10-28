/**
 * The staging store spec: the panel's whole decision procedure, DOM-free.
 *
 * The contract under test: rows derive from the scope's live value with staged
 * text on top; editing stages text and only a real change plans a write; clear
 * text removes a row from the planned entries; reset returns to the base layer
 * (dropping rows the base never had); an added row contributes nothing until it
 * parses; garbage text blocks save without touching the scope; save sends one
 * whole-array set op carrying the revision it read; a refused save keeps the
 * staged state and raises the failed flag; and every mutation notifies
 * subscribers.
 */
import { describe, expect, it, vi } from "vitest";
import { createTimeoutsStore, type ScopeLike } from "../src/client/store.ts";

interface FakeOptions {
  value?: Array<{ id: string; timeoutMs: number }>;
  base?: Array<{ id: string; timeoutMs: number }>;
  user?: unknown;
  writable?: boolean;
  revision?: number;
  status?: string;
  accept?: boolean;
}

function fakeScope(options: FakeOptions = {}): ScopeLike & { mutateCalls: Array<{ ops: unknown; revision?: number }> } {
  const mutateCalls: Array<{ ops: unknown; revision?: number }> = [];
  const state = { value: options.value ?? [] as Array<{ id: string; timeoutMs: number }>, revision: options.revision ?? 3 };
  const snapshot = () => ({
    status: options.status ?? "ready",
    writable: options.writable ?? true,
    value: { mcpTimeouts: state.value },
    base: { mcpTimeouts: options.base ?? [] },
    user: options.user as Record<string, unknown> | undefined,
    revision: state.revision,
  });
  const listeners = new Set<() => void>();
  return {
    getSnapshot: () => snapshot(),
    subscribe: (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    mutate: async (ops, revision) => {
      mutateCalls.push({ ops, revision });
      const accepted = options.accept ?? true;
      if (accepted) {
        const first = (ops as unknown as Array<{ op: string; value?: unknown }>)[0];
        if (first?.op === "set" && Array.isArray(first.value)) state.value = first.value as Array<{ id: string; timeoutMs: number }>;
        state.revision += 1;
        for (const listener of listeners) listener();
      }
      return accepted;
    },
    mutateCalls,
  };
}

describe("createTimeoutsStore", () => {
  it("derives rows from the live value with no staging", () => {
    const store = createTimeoutsStore(fakeScope({ value: [{ id: "mcp-kimi-tools", timeoutMs: 660000 }] }));
    const snapshot = store.getSnapshot();
    expect(snapshot.status).toBe("ready");
    expect(snapshot.rows).toEqual([{ id: "mcp-kimi-tools", text: "660000", invalid: false, overridden: false, inBase: false }]);
    expect(snapshot.dirty).toBe(false);
    expect(snapshot.writable).toBe(true);
  });

  it("marks rows present in the user layer as overridden and base rows as inBase", () => {
    const store = createTimeoutsStore(fakeScope({
      value: [{ id: "a", timeoutMs: 1 }, { id: "b", timeoutMs: 2 }],
      base: [{ id: "b", timeoutMs: 2 }],
      user: { mcpTimeouts: [{ id: "a", timeoutMs: 1 }] },
    }));
    const byId = new Map(store.getSnapshot().rows.map(row => [row.id, row]));
    expect(byId.get("a")?.overridden).toBe(true);
    expect(byId.get("a")?.inBase).toBe(false);
    expect(byId.get("b")?.overridden).toBe(false);
    expect(byId.get("b")?.inBase).toBe(true);
  });

  it("stages edits, flags garbage as invalid, and blocks save", async () => {
    const scope = fakeScope({ value: [{ id: "a", timeoutMs: 60000 }] });
    const store = createTimeoutsStore(scope);
    store.editRow("a", "660000");
    expect(store.getSnapshot().dirty).toBe(true);
    store.editRow("a", "abc");
    const snapshot = store.getSnapshot();
    expect(snapshot.rows[0]?.invalid).toBe(true);
    expect(snapshot.invalid).toBe(true);
    await store.save();
    expect(scope.mutateCalls).toHaveLength(0);
  });

  it("an edit back to the live value plans nothing and save is a no-op", async () => {
    const scope = fakeScope({ value: [{ id: "a", timeoutMs: 660000 }] });
    const store = createTimeoutsStore(scope);
    store.editRow("a", "660000");
    expect(store.getSnapshot().dirty).toBe(false);
    await store.save();
    expect(scope.mutateCalls).toHaveLength(0);
  });

  it("clear text removes the row from the planned entries", async () => {
    const scope = fakeScope({ value: [{ id: "a", timeoutMs: 60000 }, { id: "b", timeoutMs: 70000 }] });
    const store = createTimeoutsStore(scope);
    store.editRow("a", "");
    await store.save();
    expect(scope.mutateCalls).toEqual([{ ops: [{ op: "set", path: ["mcpTimeouts"], value: [{ id: "b", timeoutMs: 70000 }] }], revision: 3 }]);
  });

  it("reset returns a row to its base value, and drops rows the base never had", async () => {
    const scope = fakeScope({ value: [{ id: "a", timeoutMs: 60000 }, { id: "b", timeoutMs: 70000 }], base: [{ id: "a", timeoutMs: 120000 }] });
    const store = createTimeoutsStore(scope);
    store.resetRow("a");
    store.resetRow("b");
    await store.save();
    expect(scope.mutateCalls[0]?.ops).toEqual([{ op: "set", path: ["mcpTimeouts"], value: [{ id: "a", timeoutMs: 120000 }] }]);
  });

  it("reset without a base clears the row's text and plans its removal", () => {
    const scope = fakeScope({ value: [{ id: "a", timeoutMs: 60000 }] });
    const store = createTimeoutsStore(scope);
    store.resetRow("a");
    const snapshot = store.getSnapshot();
    expect(snapshot.dirty).toBe(true);
    expectRowCleared(snapshot.rows, "a");
  });

  it("an added row contributes nothing until its text parses, then joins the set", async () => {
    const scope = fakeScope({ value: [] });
    const store = createTimeoutsStore(scope);
    store.addRow("mcp-kimi-tools");
    expect(store.getSnapshot().dirty).toBe(false);
    store.editRow("mcp-kimi-tools", "660000");
    expect(store.getSnapshot().dirty).toBe(true);
    await store.save();
    expect(scope.mutateCalls[0]?.ops).toEqual([{ op: "set", path: ["mcpTimeouts"], value: [{ id: "mcp-kimi-tools", timeoutMs: 660000 }] }]);
  });

  it("addRow ignores empty or duplicate ids", () => {
    const scope = fakeScope({ value: [{ id: "a", timeoutMs: 1 }] });
    const store = createTimeoutsStore(scope);
    store.addRow("");
    store.addRow("a");
    const snapshot = store.getSnapshot();
    expect(snapshot.rows.map(row => row.id)).toEqual(["a"]);
    expect(snapshot.dirty).toBe(false);
  });

  it("a refused save keeps the staged state and raises failed", async () => {
    const scope = fakeScope({ value: [{ id: "a", timeoutMs: 60000 }], accept: false });
    const store = createTimeoutsStore(scope);
    store.editRow("a", "660000");
    await store.save();
    const snapshot = store.getSnapshot();
    expect(snapshot.failed).toBe(true);
    expect(snapshot.dirty).toBe(true);
    expect(snapshot.rows[0]?.text).toBe("660000");
  });

  it("an accepted save clears staging and reflects failed=false", async () => {
    const scope = fakeScope({ value: [{ id: "a", timeoutMs: 60000 }] });
    const store = createTimeoutsStore(scope);
    store.editRow("a", "660000");
    await store.save();
    const snapshot = store.getSnapshot();
    expect(snapshot.failed).toBe(false);
    expect(snapshot.dirty).toBe(false);
    expect(snapshot.rows[0]?.text).toBe("660000");
  });

  it("save refuses on read-only or unavailable scopes", async () => {
    const readOnly = fakeScope({ value: [{ id: "a", timeoutMs: 1 }], writable: false });
    const a = createTimeoutsStore(readOnly);
    a.editRow("a", "5000");
    await a.save();
    expect(readOnly.mutateCalls).toHaveLength(0);

    const unavailable = fakeScope({ value: [{ id: "a", timeoutMs: 1 }], status: "unavailable" });
    const b = createTimeoutsStore(unavailable);
    b.editRow("a", "5000");
    await b.save();
    expect(unavailable.mutateCalls).toHaveLength(0);
  });

  it("discard drops staging and clears failed", async () => {
    const scope = fakeScope({ value: [{ id: "a", timeoutMs: 60000 }], accept: false });
    const store = createTimeoutsStore(scope);
    store.editRow("a", "660000");
    await store.save();
    store.discard();
    const snapshot = store.getSnapshot();
    expect(snapshot.failed).toBe(false);
    expect(snapshot.dirty).toBe(false);
    expect(snapshot.rows[0]?.text).toBe("60000");
  });

  it("notifies subscribers on stage, save, and discard", async () => {
    const scope = fakeScope({ value: [{ id: "a", timeoutMs: 1 }] });
    const store = createTimeoutsStore(scope);
    const listener = vi.fn();
    store.subscribe(listener);
    store.editRow("a", "5000");
    expect(listener).toHaveBeenCalledTimes(1);
    const beforeSave = listener.mock.calls.length;
    await store.save();
    expect(listener.mock.calls.length).toBeGreaterThan(beforeSave);
    const beforeDiscard = listener.mock.calls.length;
    store.discard();
    expect(listener.mock.calls.length).toBeGreaterThan(beforeDiscard);
  });

  it("a missing scope reports unavailable without throwing", () => {
    const store = createTimeoutsStore(undefined);
    const snapshot = store.getSnapshot();
    expect(snapshot.status).toBe("unavailable");
    expect(snapshot.writable).toBe(false);
    expect(snapshot.rows).toEqual([]);
  });
});

function expectRowCleared(rows: ReadonlyArray<{ id: string; text: string }>, id: string) {
  const row = rows.find(candidate => candidate.id === id);
  expect(row?.text).toBe("");
}
