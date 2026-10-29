import { describe, expect, it } from "vitest";

import { renderMarkdown } from "../src/client/markdown.ts";
import {
  classifyPreviewFailure,
  createPreviewLoader,
  describePage,
  IDLE_PREVIEW,
  isMarkdownFile,
  languageFor,
  normalizePreviewPage,
} from "../src/client/preview.ts";

interface ReadCall {
  readonly path: string;
  readonly offset: number;
  readonly limit: number;
}

function reader(pages: readonly unknown[], calls: ReadCall[] = []) {
  let index = 0;
  return {
    calls,
    read: async (path: string, range: { offset?: number; limit?: number }) => {
      calls.push({ path, offset: range.offset ?? 0, limit: range.limit ?? 0 });
      const page = pages[Math.min(index, pages.length - 1)];
      index += 1;
      return page;
    },
  };
}

describe("languageFor", () => {
  it("maps the common suffixes to language ids", () => {
    expect(languageFor("a.ts")).toBe("javascript");
    expect(languageFor("a.tsx")).toBe("javascript");
    expect(languageFor("a.jsx")).toBe("javascript");
    expect(languageFor("a.json")).toBe("json");
    expect(languageFor("a.md")).toBe("markdown");
    expect(languageFor("README.MD")).toBe("markdown");
    expect(languageFor("a.css")).toBe("css");
    expect(languageFor("a.html")).toBe("html");
    expect(languageFor("a.yml")).toBe("yaml");
    expect(languageFor("a.yaml")).toBe("yaml");
    expect(languageFor("src/deep/a.ts")).toBe("javascript");
    expect(languageFor("LICENSE")).toBe("plaintext");
  });

  it("treats only markdown ids as the reading mode", () => {
    expect(isMarkdownFile("docs/a.md")).toBe(true);
    expect(isMarkdownFile("a.ts")).toBe(false);
  });
});

describe("createPreviewLoader", () => {
  it("reads one page, advances the offset and stops at eof", async () => {
    const files = reader([
      { text: "l1\nl2", lines: 2, totalLines: 4, eof: false },
      { text: "l3\nl4", lines: 2, totalLines: 4, eof: true },
    ]);
    const loader = createPreviewLoader({ files, maxLines: 200 });
    await loader.open("a.ts");
    expect(files.calls).toEqual([{ path: "a.ts", offset: 0, limit: 200 }]);
    expect(loader.getSnapshot()).toMatchObject({ status: "ready", offset: 1, lines: 2, eof: false });
    expect(describePage(loader.getSnapshot())).toEqual({ range: "1–2", total: "4" });

    await loader.next();
    expect(files.calls[1]).toEqual({ path: "a.ts", offset: 3, limit: 200 });
    expect(loader.getSnapshot()).toMatchObject({ status: "ready", offset: 3, lines: 2, eof: true });

    await loader.next();
    expect(files.calls).toHaveLength(2);
  });

  it("returns to the previous page start without guessing the page size", async () => {
    const files = reader([
      { text: "a\nb", lines: 2, eof: false },
      { text: "c\nd", lines: 2, eof: false },
    ]);
    const loader = createPreviewLoader({ files, maxLines: 2 });
    await loader.open("a.txt");
    await loader.next();
    expect(files.calls[1]?.offset).toBe(3);
    await loader.prev();
    // Page one omits `offset` so the host's 1-based default applies.
    expect(files.calls[2]?.offset).toBe(0);
    expect(loader.getSnapshot().offset).toBe(1);
  });

  it("classifies a deleted file and retries the same page", async () => {
    let attempt = 0;
    const loader = createPreviewLoader({
      files: {
        read: async () => {
          attempt += 1;
          if (attempt === 1) throw Object.assign(new Error("ENOENT: no such file"), { code: "ENOENT" });
          return { text: "ok", lines: 1, eof: true };
        },
      },
      maxLines: 10,
    });
    await loader.open("gone.ts");
    expect(loader.getSnapshot().status).toBe("failed");
    expect(loader.getSnapshot().failure?.kind).toBe("deleted");
    await loader.retry();
    expect(loader.getSnapshot().status).toBe("ready");
  });

  it("abandons a page that settles after a newer selection", async () => {
    let release: (() => void) | undefined;
    const loader = createPreviewLoader({
      files: {
        read: (path) => {
          if (path === "slow.ts") {
            return new Promise(resolve => {
              release = () => resolve({ text: "slow", lines: 1, eof: true });
            });
          }
          return { text: "fast", lines: 1, eof: true };
        },
      },
      maxLines: 10,
    });
    const slow = loader.open("slow.ts");
    await loader.open("fast.ts");
    release?.();
    await slow;
    expect(loader.getSnapshot()).toMatchObject({ status: "ready", path: "fast.ts", text: "fast" });
    expect(loader.getSnapshot()).not.toEqual(IDLE_PREVIEW);
  });
});

describe("normalizePreviewPage", () => {
  it("folds the Remote envelope and keeps the host's offset", () => {
    const page = normalizePreviewPage(
      { ok: true, value: { text: "a\nb\nc", lines: 3, offset: 201, eof: true, absolutePath: "/x", version: "v" } },
      201,
    );
    expect(page).toEqual({ text: "a\nb\nc", lines: 3, offset: 201, eof: true });
  });

  it("derives the line count when the host omits it", () => {
    expect(normalizePreviewPage({ text: "a\nb", eof: false }, 1)).toMatchObject({ lines: 2, offset: 1 });
    expect(normalizePreviewPage({ text: "", lines: 0, eof: true }, 5)).toMatchObject({ lines: 0, eof: true });
  });

  it("throws the host's error code and detail", () => {
    expect(() =>
      normalizePreviewPage({ ok: false, error: { code: "workspace-file/not-regular-file", message: "symlink" } }, 1),
    ).toThrowError(/symlink/u);
    try {
      normalizePreviewPage(
        { ok: false, error: { code: "workspace-file/not-regular-file", message: "not a regular file", details: { kind: "symlink" } } },
        1,
      );
    } catch (error) {
      expect(classifyPreviewFailure(error)).toMatchObject({ kind: "symlink" });
    }
  });
});

describe("classifyPreviewFailure", () => {
  it("separates deleted, denied and symlink failures", () => {
    expect(classifyPreviewFailure(Object.assign(new Error("ENOENT"), { code: "ENOENT" })).kind).toBe("deleted");
    expect(classifyPreviewFailure(Object.assign(new Error("EACCES: permission denied"), { code: "EACCES" })).kind).toBe("denied");
    expect(classifyPreviewFailure({ code: "workspace-file/not-regular-file", detail: "symlink" }).kind).toBe("symlink");
    expect(classifyPreviewFailure(new Error("workspace-file/not-text")).kind).toBe("binary");
    expect(classifyPreviewFailure(new Error("something odd")).kind).toBe("unknown");
  });
});

describe("renderMarkdown", () => {
  it("returns an element tree with no raw HTML or event attributes", () => {
    const tree = renderMarkdown(
      ["# 标题", "", "- 一项", "- 另一项", "", "```ts", "const x = 1", "```", "", '<img src=x onerror="alert(1)">', "", "<script>alert(2)</script>"].join(
        "\n",
      ),
    );
    const types = new Set<string>();
    const texts: string[] = [];
    const walk = (node: unknown): void => {
      if (node === null || node === undefined || typeof node !== "object") {
        if (typeof node === "string") texts.push(node);
        return;
      }
      if (Array.isArray(node)) {
        for (const child of node) walk(child);
        return;
      }
      const element = node as { type?: unknown; props?: Record<string, unknown> };
      if (typeof element.type === "string") types.add(element.type);
      const props = element.props ?? {};
      expect(props).not.toHaveProperty("dangerouslySetInnerHTML");
      expect(Object.keys(props).some(key => /^on[A-Z]/u.test(key))).toBe(false);
      walk(props.children);
    };
    walk(tree);
    for (const want of ["h1", "ul", "code", "p"]) expect(types.has(want)).toBe(true);
    expect(texts.join("")).toContain('<img src=x onerror="alert(1)">');
    expect(texts.join("")).toContain("<script>alert(2)</script>");
  });

  it("keeps links to safe schemes only", () => {
    const tree = renderMarkdown("[ok](https://example.com) [bad](javascript:alert(1))");
    const anchors: Record<string, unknown>[] = [];
    const walk = (node: unknown): void => {
      if (node === null || typeof node !== "object") return;
      if (Array.isArray(node)) {
        for (const child of node) walk(child);
        return;
      }
      const element = node as { type?: unknown; props?: Record<string, unknown> };
      if (element.type === "a") anchors.push(element.props ?? {});
      walk(element.props?.children);
    };
    walk(tree);
    expect(anchors).toHaveLength(1);
    expect(anchors[0]?.href).toBe("https://example.com");
  });
});
