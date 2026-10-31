/**
 * The clipboard contract, pinned at the decisions it exists for.
 *
 *   - a copy from this composer pastes back into it exactly: the text, the
 *     attachments, and their order, without either side guessing;
 *   - the plain-text flavour is usable on its own, because the commonest target
 *     of a copy is not this composer but a shell, an editor or another chat;
 *   - the plain-text reader stays narrow. A paste that mentions a path inside a
 *     sentence is text; only a block that is nothing but absolute paths is a
 *     candidate for rebuilding attachments. Getting this wrong in the loose
 *     direction would swallow ordinary prose;
 *   - a clipboard body is not trusted because it carries this MIME: every field is
 *     re-validated, since any application on the machine can write that type.
 */
import { describe, expect, it } from "vitest";

import {
  COMPOSER_CLIPBOARD_MIME,
  baseName,
  composePlainText,
  decodePayload,
  dedupeAttachments,
  encodePayload,
  imageTypeOfPath,
  isAbsolutePath,
  parsePathList,
  type ClipboardAttachment,
} from "../src/client/composer-clipboard.ts";

/** One copied image, in the shape the copy handler builds. */
const IMAGE: ClipboardAttachment = {
  path: "/Users/lionad/Desktop/shot.png",
  name: "shot.png",
  type: "image/png",
  kind: "image",
};

/** One copied document, alongside the image so order is observable. */
const FILE: ClipboardAttachment = {
  path: "/Users/lionad/Desktop/notes with space.pdf",
  name: "notes with space.pdf",
  type: "application/pdf",
  kind: "file",
};

describe("structured clipboard flavour", () => {
  it("round-trips text, attachments and their order", () => {
    const body = encodePayload({ text: "看下这两份材料", attachments: [IMAGE, FILE] });
    expect(decodePayload(body)).toEqual({ text: "看下这两份材料", attachments: [IMAGE, FILE] });
  });

  it("is written under a custom type, never as the text flavour", () => {
    expect(COMPOSER_CLIPBOARD_MIME).toBe("application/x-dsh-composer+json");
    expect(COMPOSER_CLIPBOARD_MIME).not.toContain("text/plain");
  });

  it("rejects a body this version does not own", () => {
    expect(decodePayload("")).toBeUndefined();
    expect(decodePayload(null)).toBeUndefined();
    expect(decodePayload("not json")).toBeUndefined();
    expect(decodePayload("[]")).toBeUndefined();
    expect(decodePayload(JSON.stringify({ v: 2, text: "", attachments: [] }))).toBeUndefined();
    expect(decodePayload(JSON.stringify({ text: "", attachments: [] }))).toBeUndefined();
  });

  it("keeps only entries that name a path, and fills a missing name from it", () => {
    const body = JSON.stringify({
      v: 1,
      text: "",
      attachments: [
        { path: "/a/b.png", type: "image/png", kind: "image" },
        { path: "", name: "dropped", type: "", kind: "file" },
        { name: "no path at all", kind: "file" },
        "garbage",
      ],
    });
    expect(decodePayload(body)).toEqual({
      text: "",
      attachments: [{ path: "/a/b.png", name: "b.png", type: "image/png", kind: "image" }],
    });
  });
});

describe("plain-text flavour", () => {
  it("appends one path per line after the text", () => {
    expect(composePlainText("看下这两份材料", [IMAGE.path, FILE.path])).toBe(
      `看下这两份材料\n\n${IMAGE.path}\n${FILE.path}`,
    );
  });

  it("is a bare path list when the draft has no text", () => {
    expect(composePlainText("", [IMAGE.path])).toBe(IMAGE.path);
  });

  it("leaves the text alone when there is nothing to append", () => {
    expect(composePlainText("只有文字", [])).toBe("只有文字");
  });

  it("does not grow a second blank line when the text already ends in one", () => {
    expect(composePlainText("第一段\n", [IMAGE.path])).toBe(`第一段\n\n${IMAGE.path}`);
  });
});

describe("reading a path list back", () => {
  it("reads a bare list as a pure attachment paste", () => {
    expect(parsePathList(`${IMAGE.path}\n${FILE.path}`)).toEqual({
      text: "",
      paths: [IMAGE.path, FILE.path],
    });
  });

  it("reads the text before the block and keeps the block's order", () => {
    expect(parsePathList(`看下这两份材料\n\n${IMAGE.path}\n${FILE.path}\n`)).toEqual({
      text: "看下这两份材料",
      paths: [IMAGE.path, FILE.path],
    });
  });

  it("accepts this composer's own mention spellings", () => {
    expect(parsePathList(`@${IMAGE.path}\n@"${FILE.path}"`)).toEqual({
      text: "",
      paths: [IMAGE.path, FILE.path],
    });
  });

  it("leaves prose that merely mentions a path alone", () => {
    expect(parsePathList(`把 ${IMAGE.path} 里的图改一下`)).toBeUndefined();
    expect(parsePathList(`看下这个文件\n它很重要`)).toBeUndefined();
  });

  it("does not treat a relative path as one", () => {
    expect(parsePathList("src/client/entry.ts")).toBeUndefined();
  });

  it("reads nothing out of an empty clipboard", () => {
    expect(parsePathList("")).toBeUndefined();
  });

  it("stops the block at the first line that is not a path", () => {
    expect(parsePathList(`第一段\n${IMAGE.path}\n第二段`)).toBeUndefined();
  });

  it("recognises both platform path styles", () => {
    expect(isAbsolutePath("/Users/lionad/a.png")).toBe(true);
    expect(isAbsolutePath("C:\\Users\\lionad\\a.png")).toBe(true);
    expect(isAbsolutePath("\\\\server\\share\\a.png")).toBe(true);
    expect(isAbsolutePath("./a.png")).toBe(false);
    expect(isAbsolutePath("a.png")).toBe(false);
  });
});

describe("rebuilding attachments from a paste", () => {
  it("drops what the draft already has", () => {
    const result = dedupeAttachments([IMAGE, FILE], [IMAGE.path]);
    expect(result.accepted).toEqual([FILE]);
    expect(result.duplicates).toEqual([IMAGE.path]);
  });

  it("drops a repeat inside one paste", () => {
    const result = dedupeAttachments([IMAGE, IMAGE], []);
    expect(result.accepted).toEqual([IMAGE]);
    expect(result.duplicates).toEqual([IMAGE.path]);
  });

  it("never suppresses an incoming attachment for one without a path", () => {
    // A clipboard screenshot has no path, so it cannot claim any path is a duplicate.
    const result = dedupeAttachments([IMAGE], [""]);
    expect(result.accepted).toEqual([IMAGE]);
  });

  it("derives the media type a pasted path needs to rebuild as an image", () => {
    expect(imageTypeOfPath("/a/shot.PNG")).toBe("image/png");
    expect(imageTypeOfPath("/a/shot.jpeg")).toBe("image/jpeg");
    expect(imageTypeOfPath("/a/notes.pdf")).toBeUndefined();
    expect(imageTypeOfPath("/a/no-extension")).toBeUndefined();
  });

  it("names a rebuilt attachment from its path", () => {
    expect(baseName("/Users/lionad/Desktop/notes with space.pdf")).toBe("notes with space.pdf");
    expect(baseName("C:\\Users\\lionad\\a.png")).toBe("a.png");
  });
});
