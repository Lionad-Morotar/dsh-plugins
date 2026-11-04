/**
 * Reference recognition in the chat prose, tested as a table.
 *
 * Three shapes can name a workspace target: an anchor the markdown renderer
 * made, an inline code span, and a bare path left as text. An anchor is trusted
 * once it is not an external scheme; the other two must look like a path, and a
 * bare one must also be a single unbroken fragment. The refusals carry more
 * weight than the acceptances, because a wrong underline is a promise the click
 * cannot keep.
 */
import { describe, expect, it } from "vitest";

import {
  classifyReference,
  createReferenceResolver,
  normalizeReferenceTarget,
  referenceCandidates,
  type ReferenceProbe,
  type ReferenceProbeAnswer,
} from "../src/client/reference-link.ts";

/** A probe for an element in a settled message, outside any fence. */
function probe(fields: {
  readonly tag: string;
  readonly text: string;
  readonly href?: string;
  readonly insidePre?: boolean;
  readonly streaming?: boolean;
}): ReferenceProbe {
  return { insidePre: false, streaming: false, ...fields };
}

/** An anchor the markdown renderer produced, with the href the host wrote. */
function link(href: string): ReferenceProbe {
  return probe({ tag: "A", text: "", href });
}

/** An inline code span, whose text is the whole candidate. */
function code(text: string): ReferenceProbe {
  return probe({ tag: "CODE", text });
}

/** A path left as plain text inside a paragraph. */
function bare(text: string): ReferenceProbe {
  return probe({ tag: "P", text });
}

describe("normalizeReferenceTarget", () => {
  it("drops the leading dot-slash, the trailing slash and the surrounding space", () => {
    expect(normalizeReferenceTarget("  ./content/a.md  ")).toBe("content/a.md");
    expect(normalizeReferenceTarget("././content/a.md")).toBe("content/a.md");
    expect(normalizeReferenceTarget("packages/dsh-fs-explorer/")).toBe("packages/dsh-fs-explorer");
  });

  it("reads a Windows separator as a slash, so one target has one spelling", () => {
    expect(normalizeReferenceTarget("content\\6.maps\\a.md")).toBe("content/6.maps/a.md");
    expect(normalizeReferenceTarget(".\\content\\a.md")).toBe("content/a.md");
  });

  it("has no target for text that normalises away", () => {
    expect(normalizeReferenceTarget("")).toBeUndefined();
    expect(normalizeReferenceTarget("   ")).toBeUndefined();
    expect(normalizeReferenceTarget("/")).toBeUndefined();
    expect(normalizeReferenceTarget("//")).toBeUndefined();
    expect(normalizeReferenceTarget("./")).toBeUndefined();
  });
});

describe("classifyReference", () => {
  it("takes a site path, a resource address and a relative path from an anchor", () => {
    expect(classifyReference(link("/maps/_business/analysis/ai-subscription-resale"))).toEqual({
      target: "/maps/_business/analysis/ai-subscription-resale",
      kind: "link",
    });
    expect(classifyReference(link("content/a.md"))).toEqual({ target: "content/a.md", kind: "link" });
  });

  it("keeps the resource scheme intact, because the address starts after it", () => {
    expect(classifyReference(link("dsh-resource://file/session/x/content/a.md"))).toEqual({
      target: "dsh-resource://file/session/x/content/a.md",
      kind: "link",
    });
  });

  it("takes a file path and a directory path from inline code", () => {
    expect(classifyReference(code("content/6.maps/_business/analysis/ai-subscription-resale.md"))).toEqual({
      target: "content/6.maps/_business/analysis/ai-subscription-resale.md",
      kind: "code",
    });
    expect(classifyReference(code("packages/dsh-fs-explorer/"))).toEqual({
      target: "packages/dsh-fs-explorer",
      kind: "code",
    });
  });

  it("takes a bare path, including one written with Chinese directory names", () => {
    expect(classifyReference(bare("content/6.maps/_business/analysis"))).toEqual({
      target: "content/6.maps/_business/analysis",
      kind: "text",
    });
    expect(classifyReference(bare("docs/设计/说明"))).toEqual({ target: "docs/设计/说明", kind: "text" });
  });

  it("refuses every anchor that leaves the workspace", () => {
    for (const href of [
      "https://example.com/a/b",
      "http://x/y",
      "HTTPS://example.com/a/b",
      "mailto:a@b.c",
      "tel:+123",
      "data:text/plain,a/b",
      "javascript:void(0)",
      "#section",
      "//cdn/x",
    ]) {
      expect(classifyReference(link(href))).toBeUndefined();
    }
  });

  it("refuses an anchor with no href, or one that normalises away", () => {
    expect(classifyReference(probe({ tag: "A", text: "x" }))).toBeUndefined();
    expect(classifyReference(link(""))).toBeUndefined();
    expect(classifyReference(link("   "))).toBeUndefined();
    expect(classifyReference(link("/"))).toBeUndefined();
    expect(classifyReference(link("./"))).toBeUndefined();
  });

  it("refuses inline code that is a command or a word rather than a path", () => {
    expect(classifyReference(code("pnpm install"))).toBeUndefined();
    expect(classifyReference(code("foo"))).toBeUndefined();
    expect(classifyReference(code("a b/c"))).toBeUndefined();
    expect(classifyReference(code(""))).toBeUndefined();
  });

  it("refuses a sentence, which has no slash or has space in it", () => {
    expect(classifyReference(bare("这是一句普通的中文句子"))).toBeUndefined();
    expect(classifyReference(bare("hello world"))).toBeUndefined();
    expect(classifyReference(bare("see content/a.md for detail"))).toBeUndefined();
  });

  it("refuses a path whose first segment is empty, a dot, or a scheme", () => {
    expect(classifyReference(bare("//host/x"))).toBeUndefined();
    expect(classifyReference(code("//host/x"))).toBeUndefined();
    expect(classifyReference(code("./a.md"))).toBeUndefined();
    expect(classifyReference(code("../a.md"))).toBeUndefined();
    expect(classifyReference(code("http:/a/b"))).toBeUndefined();
  });

  it("refuses a segment holding a character a file name cannot carry", () => {
    expect(classifyReference(code("content/a.md?x=1"))).toBeUndefined();
    expect(classifyReference(code("content/a b/c"))).toBeUndefined();
    expect(classifyReference(code("content//a.md"))).toBeUndefined();
  });

  it("refuses anything inside a fence or in a message still being written", () => {
    expect(classifyReference(probe({ tag: "CODE", text: "content/a.md", insidePre: true }))).toBeUndefined();
    expect(classifyReference(probe({ tag: "A", text: "", href: "/a/b", insidePre: true }))).toBeUndefined();
    expect(classifyReference(probe({ tag: "P", text: "content/a.md", insidePre: true }))).toBeUndefined();
    expect(classifyReference(probe({ tag: "CODE", text: "content/a.md", streaming: true }))).toBeUndefined();
    expect(classifyReference(probe({ tag: "A", text: "", href: "/a/b", streaming: true }))).toBeUndefined();
    expect(classifyReference(probe({ tag: "P", text: "content/a.md", streaming: true }))).toBeUndefined();
  });
});

/**
 * A probe that answers from a table and records every question it was asked.
 *
 * The call log is the evidence for the caching claims: "the same target was
 * resolved five times" and "the same target was resolved five times without
 * asking the filesystem five times" are different facts, and only the log can
 * tell them apart.
 */
function probeTable(answers: Readonly<Record<string, ReferenceProbeAnswer>>): {
  readonly probe: (path: string) => Promise<ReferenceProbeAnswer>;
  readonly calls: string[];
} {
  const calls: string[] = [];
  return {
    calls,
    probe: path => {
      calls.push(path);
      return Promise.resolve(answers[path] ?? "missing");
    },
  };
}

describe("referenceCandidates", () => {
  it("keeps a path that already names a file, without inventing a doubled suffix", () => {
    expect(referenceCandidates("content/6.maps/a.md")).toEqual(["content/6.maps/a.md"]);
    expect(referenceCandidates("content/6.maps/a.markdown")).toEqual(["content/6.maps/a.markdown"]);
  });

  it("tries both markdown suffixes for a path that carries none", () => {
    const chain = referenceCandidates("content/6.maps/a");
    expect(chain[0]).toBe("content/6.maps/a");
    expect(chain).toContain("content/6.maps/a.md");
    expect(chain).toContain("content/6.maps/a.markdown");
  });

  it("reads a site route as both a workspace path and a content root path", () => {
    const chain = referenceCandidates("/maps/_business/analysis/ai-subscription-resale");
    expect(chain).toContain("maps/_business/analysis/ai-subscription-resale");
    expect(chain).toContain("maps/_business/analysis/ai-subscription-resale.md");
    expect(chain).toContain("content/maps/_business/analysis/ai-subscription-resale");
    expect(chain).toContain("content/maps/_business/analysis/ai-subscription-resale.md");
  });

  it("unwraps a resource address to the path it already names", () => {
    expect(referenceCandidates("dsh-resource://file/session/s1/content/a.md")[0]).toBe("content/a.md");
    // An absolute target keeps its leading slash, which is what tells the
    // caller to open it as `abs:` rather than as a workspace path.
    expect(referenceCandidates("dsh-resource://file/absolute/Users/x/a.md")[0]).toBe("/Users/x/a.md");
  });

  it("leaves a resource address it cannot unwrap alone", () => {
    expect(referenceCandidates("dsh-resource://blob/xyz")).toEqual(["dsh-resource://blob/xyz"]);
  });

  it("caps the chain and never repeats a candidate", () => {
    const chain = referenceCandidates("/a/b/c/d/e/f/g/h/i/j");
    expect(chain.length).toBeLessThanOrEqual(8);
    expect(new Set(chain).size).toBe(chain.length);
  });

  it("has no candidates for text that names nothing", () => {
    expect(referenceCandidates("")).toEqual([]);
    expect(referenceCandidates("   ")).toEqual([]);
    expect(referenceCandidates("/")).toEqual([]);
  });
});

describe("createReferenceResolver", () => {
  it("stops at the first candidate that exists", async () => {
    const table = probeTable({ "content/a.md": "file" });
    const resolver = createReferenceResolver({ probe: table.probe });
    expect(await resolver.resolve("content/a.md")).toEqual({ kind: "file", path: "content/a.md" });
    expect(table.calls).toEqual(["content/a.md"]);
  });

  it("reports a directory as a directory", async () => {
    const table = probeTable({ "content/a.md": "directory" });
    const resolver = createReferenceResolver({ probe: table.probe });
    expect(await resolver.resolve("content/a")).toEqual({ kind: "directory", path: "content/a.md" });
    expect(table.calls).toEqual(["content/a", "content/a.md"]);
  });

  it("has nothing for a target whose every candidate is missing", async () => {
    const resolver = createReferenceResolver({ probe: probeTable({}).probe });
    expect(await resolver.resolve("content/nowhere")).toBeNull();
  });

  it("probes once per candidate however many times it is asked", async () => {
    const target = "/maps/_business/analysis/ai-subscription-resale";
    const table = probeTable({});
    const resolver = createReferenceResolver({ probe: table.probe });
    for (let attempt = 0; attempt < 5; attempt += 1) expect(await resolver.resolve(target)).toBeNull();
    expect(table.calls.length).toBe(referenceCandidates(target).length);
  });

  it("remembers a miss, so a second question costs nothing", async () => {
    const table = probeTable({});
    const resolver = createReferenceResolver({ probe: table.probe });
    await resolver.resolve("content/nowhere");
    const afterFirst = table.calls.length;
    await resolver.resolve("content/nowhere");
    expect(table.calls.length).toBe(afterFirst);
    expect(resolver.size()).toBe(1);
  });

  it("shares one probe run between concurrent callers", async () => {
    const target = "/maps/_business/analysis/ai-subscription-resale";
    const table = probeTable({});
    const resolver = createReferenceResolver({ probe: table.probe });
    const answers = await Promise.all([resolver.resolve(target), resolver.resolve(target), resolver.resolve(target)]);
    expect(answers).toEqual([null, null, null]);
    expect(table.calls.length).toBe(referenceCandidates(target).length);
  });

  it("evicts the least recently used target at the limit", async () => {
    const table = probeTable({ "a.md": "file", "b.md": "file", "c.md": "file" });
    const resolver = createReferenceResolver({ probe: table.probe }, 2);
    await resolver.resolve("a.md");
    await resolver.resolve("b.md");
    await resolver.resolve("c.md");
    expect(resolver.size()).toBe(2);
    const before = table.calls.length;
    // `a.md` fell out, so asking again has to go back to the filesystem.
    expect(await resolver.resolve("a.md")).toEqual({ kind: "file", path: "a.md" });
    expect(table.calls.length).toBe(before + 1);
  });

  it("keeps a hit alive across later misses", async () => {
    const table = probeTable({ "a.md": "file" });
    const resolver = createReferenceResolver({ probe: table.probe }, 2);
    await resolver.resolve("a.md");
    await resolver.resolve("b.md");
    const before = table.calls.length;
    await resolver.resolve("a.md");
    expect(table.calls.length).toBe(before);
  });

  it("skips a candidate whose probe throws and keeps looking", async () => {
    const calls: string[] = [];
    const resolver = createReferenceResolver({
      probe: async path => {
        calls.push(path);
        if (path === "content/a") throw new Error("the host refused the stat");
        return path === "content/a.md" ? "file" : "missing";
      },
    });
    expect(await resolver.resolve("content/a")).toEqual({ kind: "file", path: "content/a.md" });
    expect(calls).toEqual(["content/a", "content/a.md"]);
  });

  it("has nothing when every probe throws", async () => {
    const resolver = createReferenceResolver({
      probe: async () => {
        throw new Error("the host is gone");
      },
    });
    expect(await resolver.resolve("content/a")).toBeNull();
  });

  it("probes an absolute candidate with its leading slash intact", async () => {
    const table = probeTable({ "/Users/x/a.md": "file" });
    const resolver = createReferenceResolver({ probe: table.probe });
    expect(await resolver.resolve("dsh-resource://file/absolute/Users/x/a.md")).toEqual({
      kind: "file",
      path: "/Users/x/a.md",
    });
    expect(table.calls).toEqual(["/Users/x/a.md"]);
  });

  it("answers an empty target without remembering it", async () => {
    const table = probeTable({});
    const resolver = createReferenceResolver({ probe: table.probe });
    expect(await resolver.resolve("")).toBeNull();
    expect(await resolver.resolve("   ")).toBeNull();
    expect(table.calls).toEqual([]);
    expect(resolver.size()).toBe(0);
  });

  it("forgets everything on clear", async () => {
    const table = probeTable({ "a.md": "file" });
    const resolver = createReferenceResolver({ probe: table.probe });
    await resolver.resolve("a.md");
    expect(resolver.size()).toBe(1);
    resolver.clear();
    expect(resolver.size()).toBe(0);
    const before = table.calls.length;
    await resolver.resolve("a.md");
    expect(table.calls.length).toBe(before + 1);
  });
});
