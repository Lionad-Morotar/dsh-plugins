/**
 * Reference recognition in the chat prose, tested as a table.
 *
 * Four shapes can name a workspace target: an anchor the markdown renderer
 * made, the button it renders for a local link or a reference chip, an inline
 * code span, and a bare path left as text. The two rendered shapes are trusted
 * once their destination stays inside the workspace; the other two must look
 * like a path, and a bare one must also be a single unbroken fragment. The
 * refusals carry more weight than the acceptances, because a wrong underline is
 * a promise the click cannot keep.
 */
import { JSDOM } from "jsdom";
import { describe, expect, it, vi } from "vitest";

import {
  classifyReference,
  createReferenceResolver,
  installReferenceLinks,
  normalizeReferenceTarget,
  referenceCandidates,
  REF_LINK_ATTR,
  type ReferenceLinkHost,
  type ReferenceProbe,
  type ReferenceProbeAnswer,
  type ResolvedReference,
} from "../src/client/reference-link.ts";

/** A probe for an element in a settled message, outside any fence. */
function probe(fields: {
  readonly tag: string;
  readonly text: string;
  readonly href?: string;
  readonly title?: string;
  readonly mention?: boolean;
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

/** The button the host renders for a local markdown link; its path is in `title`. */
function fileLink(path: string): ReferenceProbe {
  return probe({ tag: "BUTTON", text: "the link", title: path });
}

/** One of the host's reference chips, whose title is the composer's mention. */
function mention(raw: string): ReferenceProbe {
  return probe({ tag: "BUTTON", text: "the chip", title: raw, mention: true });
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

  it("takes an absolute path or a site route from inline code", () => {
    expect(classifyReference(code("/Users/x/project/agents/"))).toEqual({
      target: "/Users/x/project/agents",
      kind: "code",
    });
    expect(classifyReference(code("/maps/_business/analysis"))).toEqual({
      target: "/maps/_business/analysis",
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

  it("takes the destination of a host file link button, which is not in its text", () => {
    expect(classifyReference(fileLink("content/6.maps/analysis"))).toEqual({
      target: "content/6.maps/analysis",
      kind: "link",
    });
    expect(classifyReference(fileLink("/users/lionad/.data/agents/"))).toEqual({
      target: "/users/lionad/.data/agents",
      kind: "link",
    });
    // A directory whose link carries its trailing slash is still a path even
    // when it is one segment long.
    expect(classifyReference(fileLink("scripts/"))).toEqual({ target: "scripts", kind: "link" });
  });

  it("reads a reference chip's mention back into the path it names", () => {
    expect(classifyReference(mention("@content/6.maps/analysis"))).toEqual({
      target: "content/6.maps/analysis",
      kind: "link",
    });
    expect(classifyReference(mention('@"/Users/x/a b"'))).toEqual({ target: "/Users/x/a b", kind: "link" });
  });

  it("refuses a button that is a tooltip rather than a reference", () => {
    expect(classifyReference(probe({ tag: "BUTTON", text: "复制", title: "复制当前会话" }))).toBeUndefined();
    expect(classifyReference(probe({ tag: "BUTTON", text: "copy", title: "Copy" }))).toBeUndefined();
    expect(classifyReference(probe({ tag: "BUTTON", text: "x" }))).toBeUndefined();
    expect(classifyReference(probe({ tag: "BUTTON", text: "x", title: "   " }))).toBeUndefined();
    // A chip whose title is not the mention spelling has nothing to read.
    expect(classifyReference(probe({ tag: "BUTTON", text: "x", title: "content/a", mention: true }))).toBeUndefined();
    expect(classifyReference(mention('@"unterminated'))).toBeUndefined();
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

  it("asks about an absolute path as written, after the workspace and route spellings", () => {
    const chain = referenceCandidates("/Users/x/project/agents");
    expect(chain).toContain("Users/x/project/agents");
    expect(chain).toContain("content/Users/x/project/agents");
    expect(chain).toContain("/Users/x/project/agents");
    expect(chain).toContain("/Users/x/project/agents.md");
    // The absolute spelling is the only one that can name a home-directory
    // path; it is still asked last so a site route keeps its old answer.
    expect(chain.indexOf("/Users/x/project/agents")).toBeGreaterThan(chain.indexOf("content/Users/x/project/agents"));
  });

  it("keeps a Windows drive path as one absolute candidate", () => {
    expect(referenceCandidates("C:/work/agents")).toContain("C:/work/agents");
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

  it("reports an absolute directory without borrowing the workspace spelling", async () => {
    const table = probeTable({ "/Users/x/project/agents": "directory" });
    const resolver = createReferenceResolver({ probe: table.probe });
    expect(await resolver.resolve("/Users/x/project/agents")).toEqual({
      kind: "directory",
      path: "/Users/x/project/agents",
    });
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

/** A document with nothing in it, built per test so no window leaks between them. */
function page(): { readonly window: JSDOM["window"]; readonly doc: Document } {
  const { window } = new JSDOM("<!doctype html><html><head></head><body></body></html>");
  return { window, doc: window.document };
}

/** The answers a fake host resolves against: one target, one outcome. */
function answers(table: Readonly<Record<string, ResolvedReference | null>>): ReferenceLinkHost["resolve"] {
  return vi.fn(async (target: string) => table[target] ?? null);
}

function host(overrides: Partial<ReferenceLinkHost> = {}): ReferenceLinkHost {
  return {
    sessionId: () => "sess-1",
    resolve: answers({}),
    openFile: vi.fn(),
    enterDirectory: vi.fn(),
    fsViewPresent: () => true,
    ...overrides,
  };
}

/** Hover one element and let the resolution settle. */
async function hover(window: JSDOM["window"], element: Element): Promise<void> {
  element.dispatchEvent(new window.MouseEvent("mouseover", { bubbles: true }));
  await Promise.resolve();
  await Promise.resolve();
}

/** Click one element, reporting whether the listener claimed the gesture. */
function click(window: JSDOM["window"], element: Element): boolean {
  const event = new window.MouseEvent("click", { bubbles: true, cancelable: true });
  element.dispatchEvent(event);
  return event.defaultPrevented;
}

describe("installReferenceLinks", () => {
  it("dots an anchor the resolver places and opens it as a file", async () => {
    const { window, doc } = page();
    const anchor = doc.createElement("a");
    anchor.setAttribute("href", "/maps/x/y");
    anchor.textContent = "the map";
    doc.body.append(anchor);
    const face = host({ resolve: answers({ "/maps/x/y": { kind: "file", path: "content/maps/x/y.md" } }) });
    const stop = installReferenceLinks(doc, face);

    await hover(window, anchor);
    expect(anchor.getAttribute(REF_LINK_ATTR)).toBe("file");

    expect(click(window, anchor)).toBe(true);
    await vi.waitFor(() => expect(face.openFile).toHaveBeenCalledWith("content/maps/x/y.md", { absolute: false }));
    stop();
  });

  it("dots an inline code span", async () => {
    const { window, doc } = page();
    const code = doc.createElement("code");
    code.textContent = "content/a.md";
    doc.body.append(code);
    const face = host({ resolve: answers({ "content/a.md": { kind: "file", path: "content/a.md" } }) });
    const stop = installReferenceLinks(doc, face);

    await hover(window, code);
    expect(code.getAttribute(REF_LINK_ATTR)).toBe("file");
    stop();
  });

  it("dots a paragraph that is nothing but a path, and enters it as a directory", async () => {
    const { window, doc } = page();
    const paragraph = doc.createElement("p");
    paragraph.textContent = "content/6.maps/a";
    doc.body.append(paragraph);
    const face = host({ resolve: answers({ "content/6.maps/a": { kind: "directory", path: "content/6.maps/a" } }) });
    const stop = installReferenceLinks(doc, face);

    await hover(window, paragraph);
    expect(paragraph.getAttribute(REF_LINK_ATTR)).toBe("dir");

    expect(click(window, paragraph)).toBe(true);
    await vi.waitFor(() => expect(face.enterDirectory).toHaveBeenCalledWith("content/6.maps/a"));
    expect(face.openFile).not.toHaveBeenCalled();
    stop();
  });

  it("takes over a host file link that names a directory, before its own click runs", async () => {
    const { window, doc } = page();
    const button = doc.createElement("button");
    button.setAttribute("type", "button");
    button.setAttribute("title", "/users/lionad/.data/agents/");
    button.textContent = "/users/lionad/.data/agents/";
    doc.body.append(button);
    // The host's own handler: a bubble listener on the document stands in for
    // the React root listener the real host installs.
    const hostClick = vi.fn();
    doc.addEventListener("click", hostClick);
    const face = host({
      resolve: answers({ "/users/lionad/.data/agents": { kind: "directory", path: "/users/lionad/.data/agents" } }),
    });
    const stop = installReferenceLinks(doc, face);

    await hover(window, button);
    expect(button.getAttribute(REF_LINK_ATTR)).toBe("dir");

    expect(click(window, button)).toBe(true);
    await vi.waitFor(() => expect(face.enterDirectory).toHaveBeenCalledWith("/users/lionad/.data/agents"));
    expect(hostClick).not.toHaveBeenCalled();
    expect(face.openFile).not.toHaveBeenCalled();
    stop();
  });

  it("leaves a host file link to a file for the right Sidebar", async () => {
    const { window, doc } = page();
    const button = doc.createElement("button");
    button.setAttribute("type", "button");
    button.setAttribute("title", "content/a.md");
    button.textContent = "a.md";
    doc.body.append(button);
    const hostClick = vi.fn();
    doc.addEventListener("click", hostClick);
    const face = host({ resolve: answers({ "content/a.md": { kind: "file", path: "content/a.md" } }) });
    const stop = installReferenceLinks(doc, face);

    await hover(window, button);
    expect(button.hasAttribute(REF_LINK_ATTR)).toBe(false);
    expect(click(window, button)).toBe(false);
    expect(hostClick).toHaveBeenCalled();
    stop();
  });

  it("leaves a sentence that merely contains a path alone", async () => {
    const { window, doc } = page();
    const sentence = doc.createElement("p");
    sentence.textContent = "这是一句话 content/a.md";
    // Mixed content: the path is one child among others, so the paragraph as a
    // whole is prose and dotting it would underline the sentence.
    const mixed = doc.createElement("p");
    mixed.append("see ");
    const inner = doc.createElement("span");
    inner.textContent = "content/a.md";
    mixed.append(inner);
    doc.body.append(sentence, mixed);
    const face = host({ resolve: answers({ "content/a.md": { kind: "file", path: "content/a.md" } }) });
    const stop = installReferenceLinks(doc, face);

    await hover(window, sentence);
    expect(sentence.hasAttribute(REF_LINK_ATTR)).toBe(false);
    await hover(window, mixed);
    expect(mixed.hasAttribute(REF_LINK_ATTR)).toBe(false);
    stop();
  });

  it("leaves a path inside a fence alone", async () => {
    const { window, doc } = page();
    const pre = doc.createElement("pre");
    const code = doc.createElement("code");
    code.textContent = "content/a.md";
    pre.append(code);
    doc.body.append(pre);
    const face = host({ resolve: answers({ "content/a.md": { kind: "file", path: "content/a.md" } }) });
    const stop = installReferenceLinks(doc, face);

    await hover(window, code);
    expect(code.hasAttribute(REF_LINK_ATTR)).toBe(false);
    expect(face.resolve).not.toHaveBeenCalled();
    stop();
  });

  it("leaves a message that is still streaming alone", async () => {
    const { window, doc } = page();
    const message = doc.createElement("div");
    message.setAttribute("data-streaming", "");
    const code = doc.createElement("code");
    code.textContent = "content/a.md";
    message.append(code);
    doc.body.append(message);
    const face = host({ resolve: answers({ "content/a.md": { kind: "file", path: "content/a.md" } }) });
    const stop = installReferenceLinks(doc, face);

    await hover(window, code);
    expect(code.hasAttribute(REF_LINK_ATTR)).toBe(false);
    expect(face.resolve).not.toHaveBeenCalled();
    stop();
  });

  it("promises nothing when the resolver finds no such path", async () => {
    const { window, doc } = page();
    const code = doc.createElement("code");
    code.textContent = "content/gone.md";
    doc.body.append(code);
    const face = host({ resolve: answers({}) });
    const stop = installReferenceLinks(doc, face);

    await hover(window, code);
    expect(code.hasAttribute(REF_LINK_ATTR)).toBe(false);
    expect(face.resolve).toHaveBeenCalledWith("content/gone.md");
    stop();
  });

  it("promises nothing when the workbench is not registered", async () => {
    const { window, doc } = page();
    const code = doc.createElement("code");
    code.textContent = "content/a.md";
    doc.body.append(code);
    const face = host({
      resolve: answers({ "content/a.md": { kind: "file", path: "content/a.md" } }),
      fsViewPresent: () => false,
    });
    const stop = installReferenceLinks(doc, face);

    await hover(window, code);
    expect(code.hasAttribute(REF_LINK_ATTR)).toBe(false);
    expect(face.resolve).not.toHaveBeenCalled();
    stop();
  });

  it("opens nothing when a click lands on an element it never dotted", async () => {
    const { window, doc } = page();
    const code = doc.createElement("code");
    code.textContent = "content/a.md";
    doc.body.append(code);
    const face = host({ resolve: answers({ "content/a.md": { kind: "file", path: "content/a.md" } }) });
    const stop = installReferenceLinks(doc, face);

    expect(click(window, code)).toBe(false);
    await Promise.resolve();
    expect(face.openFile).not.toHaveBeenCalled();
    expect(face.enterDirectory).not.toHaveBeenCalled();
    stop();
  });

  it("asks the resolver once for a row the pointer crosses twice", async () => {
    const { window, doc } = page();
    const code = doc.createElement("code");
    code.textContent = "content/a.md";
    doc.body.append(code);
    const face = host({ resolve: answers({ "content/a.md": { kind: "file", path: "content/a.md" } }) });
    const stop = installReferenceLinks(doc, face);

    await hover(window, code);
    await hover(window, code);
    expect(code.getAttribute(REF_LINK_ATTR)).toBe("file");
    expect(face.resolve).toHaveBeenCalledTimes(1);
    stop();
  });

  it("stays silent when a dotted row no longer resolves", async () => {
    const { window, doc } = page();
    const code = doc.createElement("code");
    code.textContent = "content/a.md";
    doc.body.append(code);
    let found: ResolvedReference | null = { kind: "file", path: "content/a.md" };
    const face = host({ resolve: vi.fn(async () => found) });
    const stop = installReferenceLinks(doc, face);

    await hover(window, code);
    expect(code.getAttribute(REF_LINK_ATTR)).toBe("file");

    // The file was deleted between the hover and the click.
    found = null;
    expect(click(window, code)).toBe(true);
    await Promise.resolve();
    await Promise.resolve();
    expect(face.openFile).not.toHaveBeenCalled();
    expect(face.enterDirectory).not.toHaveBeenCalled();
    stop();
  });

  it("drops both listeners and every answer in flight on dispose", async () => {
    const { window, doc } = page();
    const code = doc.createElement("code");
    code.textContent = "content/a.md";
    doc.body.append(code);
    const face = host({ resolve: answers({ "content/a.md": { kind: "file", path: "content/a.md" } }) });
    const stop = installReferenceLinks(doc, face);

    stop();
    await hover(window, code);
    expect(code.hasAttribute(REF_LINK_ATTR)).toBe(false);
    expect(face.resolve).not.toHaveBeenCalled();
  });

  it("has nothing to install in a document with no window", () => {
    const face = host();
    const stop = installReferenceLinks({ defaultView: null } as unknown as Document, face);
    expect(typeof stop).toBe("function");
    expect(() => stop()).not.toThrow();
    expect(face.resolve).not.toHaveBeenCalled();
  });
});
