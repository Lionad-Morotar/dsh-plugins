/**
 * The document session: one draft per (session, path), shared by every panel
 * that opens the same file and released only when the last one lets go.
 *
 * The save path is deliberately local in this slice, but the concurrency rule
 * it establishes is not: an answer describes the text that was sent, so it may
 * advance the baseline and must never replace what the reader typed while the
 * save was in flight.
 */
import { describe, expect, it } from "vitest";

import {
  createDocumentStore,
  createDocumentOpener,
  createDocumentsResolver,
  normalizeOpenResult,
  type OpenDocument,
  type OpenResult,
} from "../src/client/document-session.ts";

function success(text: string, version = "v1"): OpenResult {
  return { ok: true, text, version };
}

function deferred<T>(): { promise: Promise<T>; resolve(value: T): void } {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>(next => {
    resolve = next;
  });
  return { promise, resolve };
}

function storeWith(open: OpenDocument) {
  return createDocumentStore({ open });
}

describe("document store", () => {
  it("starts idle and becomes ready after reload", async () => {
    const store = storeWith(async () => success("# hello"));
    const session = store.acquire("s1", "docs/a.md");

    expect(session.getSnapshot()).toEqual({
      status: "idle",
      text: "",
      savedText: "",
      version: null,
      dirty: false,
      error: null,
    });

    await session.reload();

    expect(session.getSnapshot()).toEqual({
      status: "ready",
      text: "# hello",
      savedText: "# hello",
      version: "v1",
      dirty: false,
      error: null,
    });
    session.dispose();
  });

  it("keeps a draft in memory without touching the channel", async () => {
    let opens = 0;
    const store = storeWith(async () => {
      opens += 1;
      return success("one");
    });
    const session = store.acquire("s1", "docs/a.md");
    await session.reload();

    session.setDraft("one plus");

    expect(opens).toBe(1);
    expect(session.getSnapshot()).toMatchObject({
      status: "ready",
      text: "one plus",
      savedText: "one",
      dirty: true,
    });
    session.dispose();
  });

  it("advances the local baseline when save resolves", async () => {
    const store = storeWith(async () => success("one"));
    const session = store.acquire("s1", "docs/a.md");
    await session.reload();
    session.setDraft("one edited");

    await session.save();

    expect(session.getSnapshot()).toMatchObject({
      text: "one edited",
      savedText: "one edited",
      dirty: false,
    });
    session.dispose();
  });

  it("never lets an old save answer clear text typed while it was in flight", async () => {
    const store = storeWith(async () => success("one"));
    const session = store.acquire("s1", "docs/a.md");
    await session.reload();
    session.setDraft("sent text");

    const saving = session.save();
    session.setDraft("typed after save started");
    await saving;

    expect(session.getSnapshot()).toMatchObject({
      text: "typed after save started",
      savedText: "sent text",
      dirty: true,
    });
    session.dispose();
  });

  it("reports a failed open and retries", async () => {
    let calls = 0;
    const store = storeWith(async () => {
      calls += 1;
      return calls === 1
        ? { ok: false, code: "too-large", message: "3 MB" }
        : success("small enough");
    });
    const session = store.acquire("s1", "docs/a.md");

    await session.reload();
    expect(session.getSnapshot()).toMatchObject({
      status: "failed",
      error: { code: "too-large", message: "3 MB" },
    });

    await session.reload();
    expect(session.getSnapshot()).toMatchObject({ status: "ready", text: "small enough" });
    session.dispose();
  });

  it("turns a thrown open into an io-error", async () => {
    const store = storeWith(async () => {
      throw new Error("backend down");
    });
    const session = store.acquire("s1", "docs/a.md");

    await session.reload();

    expect(session.getSnapshot()).toMatchObject({
      status: "failed",
      error: { code: "io-error", message: "backend down" },
    });
    session.dispose();
  });

  it("reuses one instance per session and path, and releases it at zero references", async () => {
    const store = storeWith(async () => success("one"));
    const first = store.acquire("s1", "docs/a.md");
    const second = store.acquire("s1", "docs/a.md");
    const otherSession = store.acquire("s2", "docs/a.md");
    const otherPath = store.acquire("s1", "docs/b.md");

    expect(second).toBe(first);
    expect(otherSession).not.toBe(first);
    expect(otherPath).not.toBe(first);

    first.dispose();
    // One reference remains, so the same draft survives.
    expect(store.acquire("s1", "docs/a.md")).toBe(first);

    second.dispose();
    first.dispose();
    // The last two references are gone; the next acquire is a fresh session.
    expect(store.acquire("s1", "docs/a.md")).not.toBe(first);
  });

  it("notifies subscribers until they unsubscribe", async () => {
    const store = storeWith(async () => success("one"));
    const session = store.acquire("s1", "docs/a.md");
    let calls = 0;
    const off = session.subscribe(() => {
      calls += 1;
    });

    await session.reload();
    expect(calls).toBeGreaterThan(0);

    off();
    const before = calls;
    session.setDraft("x");
    expect(calls).toBe(before);
    session.dispose();
  });

  it("ignores a response that lands after the last reference went away", async () => {
    const pending = deferred<OpenResult>();
    const store = storeWith(() => pending.promise);
    const session = store.acquire("s1", "docs/a.md");
    const loading = session.reload();

    session.dispose();
    pending.resolve(success("late"));

    await expect(loading).resolves.toBeUndefined();
    // A disposed object keeps its last snapshot rather than mutating a session
    // nobody owns.
    expect(session.getSnapshot().status).toBe("loading");
  });
});

describe("document channel", () => {
  const face = { open: async () => ({ ok: true, value: { ok: true, document: { text: "hello", version: "v2" } } }) };

  it("finds the namespace on the remote carrier", () => {
    expect(createDocumentsResolver({ remote: { fsExplorerDocuments: face } })()).toBe(face);
  });

  it("falls back to the Cordis resolver", () => {
    const resolve = createDocumentsResolver({
      remote: {},
      get: name => (name === "remote.fsExplorerDocuments" ? face : undefined),
    });
    expect(resolve()).toBe(face);
  });

  it("normalizes both transport and endpoint envelopes", () => {
    expect(
      normalizeOpenResult({ ok: true, value: { ok: true, document: { text: "hello", version: "v2" } } }),
    ).toEqual({ ok: true, text: "hello", version: "v2" });
    expect(normalizeOpenResult({ ok: true, document: { text: "flat" } })).toEqual({ ok: true, text: "flat" });
    expect(
      normalizeOpenResult({ ok: true, value: { ok: false, error: { code: "too-large", message: "3 MB" } } }),
    ).toEqual({ ok: false, code: "too-large", message: "3 MB" });
    expect(normalizeOpenResult(null)).toMatchObject({ ok: false, code: "invalid-response" });
  });

  it("answers a stable failure when the host half is absent", async () => {
    const open = createDocumentOpener({ remote: {} });
    await expect(open("s1", "docs/a.md")).resolves.toMatchObject({ ok: false, code: "unavailable" });
  });
});
