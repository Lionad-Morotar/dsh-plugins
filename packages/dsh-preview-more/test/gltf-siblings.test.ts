import { describe, expect, it } from "vitest";

import { decodeUriPath, externalUris, gltfDocument } from "../src/client/scene3d.ts";

/**
 * Build the bytes of a glTF document.
 * @param document - the JSON to encode.
 * @returns UTF-8 bytes, as the workspace reader would deliver them.
 */
function utf8(document: unknown): ArrayBuffer {
  return new TextEncoder().encode(JSON.stringify(document)).buffer as ArrayBuffer;
}

describe("glTF sibling references", () => {
  it("lists the buffers and images a document names by URI", () => {
    const document = {
      buffers: [{ uri: "Box.bin", byteLength: 120 }],
      images: [{ uri: "textures/base.png" }, { uri: "cover.jpg" }],
    };
    expect(externalUris(document)).toEqual(["Box.bin", "textures/base.png", "cover.jpg"]);
  });

  it("leaves a data URI to the parser that can decode it", () => {
    // A data URI carries its own bytes; asking the workspace reader for it
    // would send a lookup for a path that cannot exist.
    const document = {
      buffers: [{ uri: "data:application/octet-stream;base64,AAAA" }],
      images: [{ uri: "data:image/png;base64,BBBB" }],
    };
    expect(externalUris(document)).toEqual([]);
  });

  it("reports nothing for a document with every resource inline", () => {
    expect(externalUris({ buffers: [{ byteLength: 4 }], images: [] })).toEqual([]);
  });

  it("survives a document that is not an object", () => {
    // The caller passes whatever the bytes decoded to, including nothing.
    expect(externalUris(null)).toEqual([]);
    expect(externalUris("not json")).toEqual([]);
    expect(externalUris({})).toEqual([]);
  });

  it("reads a .gltf document and refuses a .glb one", () => {
    const document = { buffers: [{ uri: "Box.bin" }] };
    expect(gltfDocument(utf8(document), false)).toEqual(document);
    // A .glb is a binary container whose JSON is a chunk, not the whole file,
    // so reading it here would parse the header as JSON and fail.
    expect(gltfDocument(utf8(document), true)).toBeNull();
  });

  it("reports a malformed document as unreadable instead of throwing", () => {
    const garbage = new TextEncoder().encode("{ not json").buffer as ArrayBuffer;
    expect(gltfDocument(garbage, false)).toBeNull();
  });
});

describe("decodeUriPath", () => {
  it("decodes the percent escapes a URI reference carries", () => {
    // A glTF names its files as URIs, so a sibling with a space arrives encoded
    // and the workspace reader would not find the literal escaped name.
    expect(decodeUriPath("textures/My%20Texture.png")).toBe("textures/My Texture.png");
    expect(decodeUriPath("%E6%A8%A1%E5%9E%8B.bin")).toBe("模型.bin");
  });

  it("leaves a plain relative path alone", () => {
    expect(decodeUriPath("Box.bin")).toBe("Box.bin");
    expect(decodeUriPath("textures/base.png")).toBe("textures/base.png");
  });

  it("passes an absolute or remote URI through so the reader can report it", () => {
    // Rewriting these would hide the document's real problem behind a path that
    // looks local and then mysteriously fails.
    expect(decodeUriPath("https://example.com/model.bin")).toBe("https://example.com/model.bin");
    expect(decodeUriPath("file:///tmp/Box.bin")).toBe("file:///tmp/Box.bin");
    expect(decodeUriPath("data:application/octet-stream;base64,AA")).toBe("data:application/octet-stream;base64,AA");
  });

  it("does not throw on malformed encoding", () => {
    // A stray % is a broken document, and a URIError here would blame the
    // decoder instead of the file.
    expect(decodeUriPath("broken%")).toBe("broken%");
    expect(decodeUriPath("half%2")).toBe("half%2");
  });
});
