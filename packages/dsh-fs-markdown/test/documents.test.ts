/**
 * The document channel's two envelopes and the soft probe.
 *
 * The namespace belongs to another plugin, so both its absence and a failure
 * payload have to be ordinary values here: nothing in the body may throw
 * because a host half is missing.
 */
import { describe, expect, it } from "vitest";

import {
  createDocumentsResolver,
  isDocumentsFace,
  normalizeOpenDocument,
  type DocumentsFace,
} from "../src/client/documents.ts";

const snapshot = { absolutePath: "/work/docs/a.md", version: "v1", text: "# hello", bytes: 7 };

describe("normalizeOpenDocument", () => {
  it("unwraps the transport envelope and the endpoint union", () => {
    const result = normalizeOpenDocument({ ok: true, value: { ok: true, document: snapshot } });

    expect(result).toEqual({ ok: true, text: "# hello", bytes: 7, version: "v1" });
  });

  it("accepts an endpoint result handed over without the transport envelope", () => {
    const result = normalizeOpenDocument({ ok: true, document: snapshot });

    expect(result.ok).toBe(true);
    if (result.ok) expect(result.text).toBe("# hello");
  });

  it("reads a failure nested inside the transport envelope", () => {
    const result = normalizeOpenDocument({
      ok: true,
      value: { ok: false, error: { code: "too-large", message: "3000000 bytes exceeds the limit" } },
    });

    expect(result).toEqual({ ok: false, code: "too-large", message: "3000000 bytes exceeds the limit" });
  });

  it("reads a transport-level failure", () => {
    const result = normalizeOpenDocument({ ok: false, error: { code: "io-error", message: "backend down" } });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.code).toBe("io-error");
      expect(result.message).toBe("backend down");
    }
  });

  it("refuses a response with no text", () => {
    const result = normalizeOpenDocument({ ok: true, value: { ok: true, document: { bytes: 1 } } });

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.code).toBe("invalid-response");
  });

  it("refuses a non-object response", () => {
    expect(normalizeOpenDocument(null)).toMatchObject({ ok: false, code: "invalid-response" });
  });
});

describe("createDocumentsResolver", () => {
  const face: DocumentsFace = { open: () => undefined };

  it("finds the namespace on the remote carrier", () => {
    const resolve = createDocumentsResolver({ remote: { fsExplorerDocuments: face } });
    expect(resolve()).toBe(face);
  });

  it("falls back to the Cordis resolver", () => {
    const resolve = createDocumentsResolver({
      remote: {},
      get: name => (name === "remote.fsExplorerDocuments" ? face : undefined),
    });
    expect(resolve()).toBe(face);
  });

  it("answers undefined when the host half is absent", () => {
    expect(createDocumentsResolver({ remote: {} })()).toBeUndefined();
    expect(createDocumentsResolver({})()).toBeUndefined();
  });

  it("treats a throwing service read as absent", () => {
    const ctx = {
      get remote(): unknown {
        throw new Error("cannot get property without inject");
      },
    };
    expect(createDocumentsResolver(ctx)()).toBeUndefined();
  });

  it("only accepts a face with an open method", () => {
    expect(isDocumentsFace(face)).toBe(true);
    expect(isDocumentsFace({})).toBe(false);
    expect(isDocumentsFace(null)).toBe(false);
  });
});
