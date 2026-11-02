/**
 * The document session: one draft per (session, path), shared by every panel
 * that opens the same file and released only when the last one lets go.
 *
 * The concurrency rule the save path establishes is the point of this file: an
 * answer describes the text that was sent, so it may advance the baseline and
 * must never replace what the reader typed while the save was in flight. The
 * version the save carries is the one the text was read at, which is what makes
 * an external edit a reported conflict instead of a silent overwrite.
 */
import { describe, expect, it } from "vitest";

import {
  createDocumentStore,
  createDocumentOpener,
  createDocumentSaver,
  createDocumentsResolver,
  normalizeOpenResult,
  normalizeSaveResult,
  type OpenDocument,
  type OpenResult,
  type SaveDocument,
  type SaveRequest,
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

function storeWith(open: OpenDocument, save?: SaveDocument) {
  return createDocumentStore({ open, ...(save === undefined ? {} : { save }) });
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
      saving: false,
      conflict: false,
      discarded: null,
      error: null,
    });

    await session.reload();

    expect(session.getSnapshot()).toEqual({
      status: "ready",
      text: "# hello",
      savedText: "# hello",
      version: "v1",
      dirty: false,
      saving: false,
      conflict: false,
      discarded: null,
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

  it("sends the draft with the version it was read at, then advances both", async () => {
    const requests: SaveRequest[] = [];
    const store = storeWith(
      async () => success("one", "v1"),
      async request => {
        requests.push(request);
        return { ok: true, version: "v2" };
      },
    );
    const session = store.acquire("s1", "docs/a.md");
    await session.reload();
    session.setDraft("one edited");

    const outcome = await session.save();

    expect(requests).toEqual([
      { sessionId: "s1", path: "docs/a.md", text: "one edited", expectedVersion: "v1" },
    ]);
    expect(outcome).toEqual({ ok: true, version: "v2" });
    expect(session.getSnapshot()).toMatchObject({
      text: "one edited",
      savedText: "one edited",
      version: "v2",
      dirty: false,
      saving: false,
      conflict: false,
      discarded: null,
      error: null,
    });
    session.dispose();
  });

  it("marks the button busy while the write is in flight", async () => {
    const pending = deferred<{ ok: true; version: string }>();
    const store = storeWith(async () => success("one"), () => pending.promise);
    const session = store.acquire("s1", "docs/a.md");
    await session.reload();
    session.setDraft("edited");

    const saving = session.save();
    expect(session.getSnapshot().saving).toBe(true);

    pending.resolve({ ok: true, version: "v2" });
    await saving;
    expect(session.getSnapshot().saving).toBe(false);
    session.dispose();
  });

  it("never lets an old save answer clear text typed while it was in flight", async () => {
    const pending = deferred<{ ok: true; version: string }>();
    const store = storeWith(async () => success("one"), () => pending.promise);
    const session = store.acquire("s1", "docs/a.md");
    await session.reload();
    session.setDraft("sent text");

    const saving = session.save();
    session.setDraft("typed after save started");
    pending.resolve({ ok: true, version: "v2" });
    await saving;

    expect(session.getSnapshot()).toMatchObject({
      text: "typed after save started",
      savedText: "sent text",
      version: "v2",
      dirty: true,
    });
    session.dispose();
  });

  it("turns a stale version into a conflict without moving the draft or the baseline", async () => {
    const store = storeWith(
      async () => success("one", "v1"),
      async () => ({ ok: false, code: "stale-version", message: "the file changed on disk" }),
    );
    const session = store.acquire("s1", "docs/a.md");
    await session.reload();
    session.setDraft("my draft");

    const outcome = await session.save();

    expect(outcome).toEqual({ ok: false, code: "stale-version" });
    expect(session.getSnapshot()).toMatchObject({
      status: "ready",
      text: "my draft",
      savedText: "one",
      version: "v1",
      dirty: true,
      saving: false,
      conflict: true,
      error: { code: "stale-version" },
    });
    session.dispose();
  });

  it("replaces the draft and clears the conflict only when the reader confirms the discard", async () => {
    let reads = 0;
    const store = storeWith(
      async () => {
        reads += 1;
        return reads === 1 ? success("one", "v1") : success("theirs", "v2");
      },
      async () => ({ ok: false, code: "stale-version", message: "changed" }),
    );
    const session = store.acquire("s1", "docs/a.md");
    await session.reload();
    session.setDraft("my draft");
    await session.save();
    expect(session.getSnapshot().conflict).toBe(true);

    // The bar's first click only arms the confirmation; nothing moves yet.
    await session.reload();
    expect(session.getSnapshot()).toMatchObject({ text: "my draft", dirty: true, conflict: true });

    await session.reload({ force: true });

    expect(session.getSnapshot()).toMatchObject({
      status: "ready",
      text: "theirs",
      savedText: "theirs",
      version: "v2",
      dirty: false,
      conflict: false,
      discarded: "my draft",
      error: null,
    });
    session.dispose();
  });

  it("refuses to reload over an unsaved draft unless the discard is forced", async () => {
    let disk = "one";
    const store = storeWith(async () => success(disk));
    const session = store.acquire("s1", "docs/a.md");
    await session.reload();
    session.setDraft("my draft");
    disk = "two";

    await session.reload();

    expect(session.getSnapshot()).toMatchObject({ text: "my draft", savedText: "one", dirty: true });
    session.dispose();
  });

  it("force reload replaces the draft and keeps the old text for recovery", async () => {
    let disk = "one";
    const store = storeWith(async () => success(disk));
    const session = store.acquire("s1", "docs/a.md");
    await session.reload();
    session.setDraft("my draft");
    disk = "two";

    await session.reload({ force: true });

    expect(session.getSnapshot()).toMatchObject({
      text: "two",
      savedText: "two",
      dirty: false,
      conflict: false,
      discarded: "my draft",
    });

    // The conflict bar's restore action writes the kept text back as a draft.
    const discarded = session.getSnapshot().discarded;
    if (discarded === null) throw new Error("the discarded draft was not kept");
    session.setDraft(discarded);
    expect(session.getSnapshot()).toMatchObject({ text: "my draft", dirty: true });
    session.dispose();
  });

  it("answers unavailable when the store has no save transport", async () => {
    const store = storeWith(async () => success("one"));
    const session = store.acquire("s1", "docs/a.md");
    await session.reload();
    session.setDraft("draft");

    const outcome = await session.save();

    expect(outcome).toEqual({ ok: false, code: "unavailable" });
    expect(session.getSnapshot()).toMatchObject({
      text: "draft",
      savedText: "one",
      dirty: true,
      error: { code: "unavailable" },
    });
    session.dispose();
  });

  it("keeps the draft when the transport refuses for another reason", async () => {
    const store = storeWith(
      async () => success("one"),
      async () => ({ ok: false, code: "io-error", message: "disk full" }),
    );
    const session = store.acquire("s1", "docs/a.md");
    await session.reload();
    session.setDraft("draft");

    await session.save();

    expect(session.getSnapshot()).toMatchObject({
      text: "draft",
      savedText: "one",
      dirty: true,
      conflict: false,
      error: { code: "io-error", message: "disk full" },
    });
    session.dispose();
  });

  it("hands the live draft to a copy action without any transport", async () => {
    const store = storeWith(async () => success("one"));
    const session = store.acquire("s1", "docs/a.md");
    await session.reload();
    session.setDraft("copy me");

    expect(session.copyDraft()).toBe("copy me");
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

  it("keeps a readable draft on screen when a re-read fails", async () => {
    let reads = 0;
    const store = storeWith(async () => {
      reads += 1;
      return reads === 1 ? success("one") : { ok: false, code: "io-error", message: "gone" };
    });
    const session = store.acquire("s1", "docs/a.md");
    await session.reload();

    await session.reload();

    expect(session.getSnapshot()).toMatchObject({
      status: "ready",
      text: "one",
      savedText: "one",
      dirty: false,
      error: { code: "io-error", message: "gone" },
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

  it("keeps a dirty draft alive after its last reference goes away", async () => {
    // Switching views unmounts every panel at once. The draft is the only copy
    // of what the reader typed, so releasing the last reference must not drop it.
    const store = storeWith(async () => success("one"));
    const first = store.acquire("s1", "docs/a.md");
    await first.reload();
    first.setDraft("unsaved");

    first.dispose();

    const second = store.acquire("s1", "docs/a.md");
    expect(second).toBe(first);
    expect(second.getSnapshot()).toMatchObject({ text: "unsaved", savedText: "one", dirty: true });
  });

  it("forgets a draft unconditionally, even when it is dirty", async () => {
    const store = storeWith(async () => success("one"));
    const first = store.acquire("s1", "docs/a.md");
    await first.reload();
    first.setDraft("unsaved");

    store.forget("s1", "docs/a.md");

    expect(store.peek("s1", "docs/a.md")).toBeUndefined();
    const second = store.acquire("s1", "docs/a.md");
    expect(second).not.toBe(first);
    expect(second.getSnapshot()).toMatchObject({ status: "idle", text: "", dirty: false });
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

describe("read-only draft queries", () => {
  it("answers a snapshot only for a draft somebody already acquired", async () => {
    const store = storeWith(async () => success("one"));
    expect(store.peek("s1", "docs/a.md")).toBeUndefined();
    expect(store.find("s1", "docs/a.md")).toBeUndefined();

    const session = store.acquire("s1", "docs/a.md");
    // Rendering a tab must not open a session: the acquire above is the only one.
    expect(store.peek("s1", "docs/a.md")).toBe(session.getSnapshot());
    expect(store.find("s1", "docs/a.md")).toBe(session);

    session.dispose();
    expect(store.peek("s1", "docs/a.md")).toBeUndefined();
  });

  it("bumps its revision and notifies store subscribers on every draft change", async () => {
    const store = storeWith(async () => success("one"));
    const session = store.acquire("s1", "docs/a.md");
    let calls = 0;
    const off = store.subscribe(() => {
      calls += 1;
    });
    const before = store.revision();

    await session.reload();
    session.setDraft("draft");

    expect(store.revision()).toBeGreaterThan(before + 1);
    expect(calls).toBeGreaterThan(1);

    off();
    const settled = calls;
    session.setDraft("after unsubscribe");
    expect(calls).toBe(settled);
    session.dispose();
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

  it("normalizes the save envelope down to a version", () => {
    expect(
      normalizeSaveResult({
        ok: true,
        value: { ok: true, document: { absolutePath: "/w/a.md", version: "v3", bytes: 12 } },
      }),
    ).toEqual({ ok: true, version: "v3", bytes: 12 });
    expect(normalizeSaveResult({ ok: true, document: { version: "v4" } })).toEqual({ ok: true, version: "v4" });
    expect(
      normalizeSaveResult({ ok: true, value: { ok: false, error: { code: "stale-version", message: "changed" } } }),
    ).toEqual({ ok: false, code: "stale-version", message: "changed" });
    expect(normalizeSaveResult(null)).toMatchObject({ ok: false, code: "invalid-response" });
  });

  it("posts the save through the face and folds its answer", async () => {
    const requests: SaveRequest[] = [];
    const saver = createDocumentSaver({
      remote: {
        fsExplorerDocuments: {
          ...face,
          save: async (request: SaveRequest) => {
            requests.push(request);
            return { ok: true, value: { ok: true, document: { version: "v9" } } };
          },
        },
      },
    });

    await expect(
      saver({ sessionId: "s1", path: "docs/a.md", text: "draft", expectedVersion: "v2" }),
    ).resolves.toEqual({ ok: true, version: "v9" });
    expect(requests).toEqual([{ sessionId: "s1", path: "docs/a.md", text: "draft", expectedVersion: "v2" }]);
  });

  it("answers unavailable when the face has no save member", async () => {
    const saver = createDocumentSaver({ remote: { fsExplorerDocuments: face } });
    await expect(
      saver({ sessionId: "s1", path: "docs/a.md", text: "draft", expectedVersion: null }),
    ).resolves.toMatchObject({ ok: false, code: "unavailable" });
  });
});
