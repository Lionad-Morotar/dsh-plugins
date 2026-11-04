/**
 * The skill enhancer's pure decisions.
 *
 * The component itself is DOM work and is not exercised here (the suite runs in
 * node, with no document). What is testable, and what actually goes wrong when it
 * is wrong, are the three decisions in front of the DOM:
 *
 *   - where the caret lands after a parameter is inserted, because a missing
 *     leading space glues `--create` onto the skill token and the host then reads
 *     a different skill name;
 *   - whether a text span is a bare skill token, because the panel must not open
 *     for `/flow-workflow run` (the token already has arguments) or for prose;
 *   - how the hint is broken into lines, because a hint is a multi-line
 *     `argument-hint` and a single run-on line is unreadable.
 */
import { describe, expect, it } from "vitest";

import {
  appendParam,
  hintLinesFor,
  panelVisibleFor,
  paramInsertionText,
  renderGhost,
  renderPanel,
} from "../src/client/skill-enhancer.tsx";
import type { SkillProfileWire } from "../src/skill-profile.ts";

describe("paramInsertionText", () => {
  it("separates the flag from a token that ends without whitespace", () => {
    expect(paramInsertionText("/flow-workflow", "--create")).toBe(" --create ");
  });

  it("does not add a second space after existing whitespace", () => {
    expect(paramInsertionText("/flow-workflow ", "--create")).toBe("--create ");
    expect(paramInsertionText("/flow-workflow  ", "--dynamic")).toBe("--dynamic ");
  });

  it("inserts a bare flag into an empty draft", () => {
    expect(paramInsertionText("", "--x")).toBe("--x ");
  });

  it("inserts a placeholder flag verbatim, spaces and all", () => {
    expect(paramInsertionText("/flow-web ", "<URL or browser task>")).toBe("<URL or browser task> ");
  });
});

describe("appendParam", () => {
  it("appends after a token that already ends with a space", () => {
    expect(appendParam("/flow-workflow ", "--create")).toBe("/flow-workflow --create ");
  });

  it("adds the separating space when the token has none", () => {
    expect(appendParam("/flow-workflow", "--create")).toBe("/flow-workflow --create ");
  });

  it("keeps the user's existing spacing", () => {
    expect(appendParam("/flow-workflow  ", "--dynamic")).toBe("/flow-workflow  --dynamic ");
  });

  it("appends into an empty draft", () => {
    expect(appendParam("", "--x")).toBe("--x ");
  });

  it("appends a flag that contains spaces", () => {
    expect(appendParam("/flow-web ", "<URL or browser task>")).toBe("/flow-web <URL or browser task> ");
  });
});

describe("panelVisibleFor", () => {
  it("resolves a bare skill token", () => {
    expect(panelVisibleFor("/flow-workflow")).toBe("flow-workflow");
  });

  it("resolves a token whose name is not in any catalogue", () => {
    // Membership is the caller's decision; this function only reads the shape.
    expect(panelVisibleFor("/placeholder")).toBe("placeholder");
  });

  it("tolerates whitespace typed after the token", () => {
    // The text ref span holds the whole text node, so a space typed after the
    // token would otherwise close the panel the moment the user starts typing.
    expect(panelVisibleFor("/flow-workflow ")).toBe("flow-workflow");
  });

  it("rejects a token that already carries arguments", () => {
    expect(panelVisibleFor("/flow-workflow run")).toBeUndefined();
  });

  it("rejects prose and empty input", () => {
    expect(panelVisibleFor("hello")).toBeUndefined();
    expect(panelVisibleFor("")).toBeUndefined();
    expect(panelVisibleFor(undefined)).toBeUndefined();
  });

  it("rejects a bare slash and names the host would never resolve", () => {
    expect(panelVisibleFor("/")).toBeUndefined();
    expect(panelVisibleFor("/Flow-Workflow")).toBeUndefined();
    expect(panelVisibleFor("/flow_workflow")).toBeUndefined();
  });
});

describe("hintLinesFor", () => {
  it("returns nothing without a hint", () => {
    expect(hintLinesFor(undefined)).toEqual([]);
    expect(hintLinesFor("")).toEqual([]);
    expect(hintLinesFor("   ")).toEqual([]);
  });

  it("keeps a single-line hint on one line", () => {
    expect(hintLinesFor("--a --b")).toEqual(["--a --b"]);
  });

  it("splits a multi-line hint", () => {
    expect(hintLinesFor("[--a]\n[--b]")).toEqual(["[--a]", "[--b]"]);
  });

  it("drops blank lines", () => {
    expect(hintLinesFor("[--a]\n\n[--b]\n")).toEqual(["[--a]", "[--b]"]);
  });
});

/**
 * The panel's DOM, driven through a stub document.
 *
 * The suite has no jsdom, and the panel is built imperatively rather than as JSX,
 * so a hand-rolled node stub is enough to assert the two things that matter and
 * are easy to get wrong: the order of the blocks, and what a parameter click
 * actually inserts. The click is the core interaction of this slice, so it is
 * exercised end to end through the same `captureInsertion`/`insertText` pair the
 * host provides.
 */
interface StubNode {
  tagName: string;
  className: string;
  textContent: string;
  title: string;
  type: string;
  style: Record<string, string>;
  children: StubNode[];
  handlers: Record<string, ((event: { preventDefault(): void }) => void)[]>;
  append(child: StubNode): void;
  addEventListener(name: string, handler: (event: { preventDefault(): void }) => void): void;
  removeEventListener(): void;
  remove(): void;
}

function stubDocument(): { doc: Document; created: StubNode[] } {
  const created: StubNode[] = [];
  const make = (tagName: string): StubNode => {
    const node: StubNode = {
      tagName,
      className: "",
      textContent: "",
      title: "",
      type: "",
      style: {},
      children: [],
      handlers: {},
      append(child) {
        node.children.push(child);
      },
      addEventListener(name, handler) {
        (node.handlers[name] ??= []).push(handler);
      },
      removeEventListener() {},
      remove() {},
    };
    created.push(node);
    return node;
  };
  const doc = {
    createElement: (tag: string) => make(tag),
    getElementById: () => null,
    querySelector: () => null,
    querySelectorAll: () => [],
    head: { append() {} },
    body: { append() {} },
    addEventListener() {},
    removeEventListener() {},
    defaultView: { addEventListener() {}, removeEventListener() {}, innerWidth: 1200 },
  } as unknown as Document;
  return { doc, created };
}

/**
 * View a built node as the stub the assertions read.
 *
 * The builders return `HTMLElement`, which is the honest production type; the
 * stub document hands back a plain object, so the two only meet through a cast
 * that has to go through `unknown`.
 */
function asStub(node: HTMLElement): StubNode {
  return node as unknown as StubNode;
}

/** Every class name in a node tree, depth first. */
function classesOf(node: StubNode): string[] {
  return [node.className, ...node.children.flatMap(child => classesOf(child))].filter(name => name !== "");
}

/** The first node with a class, depth first. */
function findByClass(node: StubNode, className: string): StubNode | undefined {
  if (node.className === className) return node;
  for (const child of node.children) {
    const found = findByClass(child, className);
    if (found !== undefined) return found;
  }
  return undefined;
}

/** The deps the panel reads, with translation reduced to the key. */
function panelDeps(): Parameters<typeof renderPanel>[1] {
  return {
    scopeFor: () => ({}),
    inputStoreFor: () => undefined,
    actionsFor: () => undefined,
    skillNamesFor: async () => new Set<string>(),
    loadProfile: async () => undefined,
    loadUsage: () => ({ session: 0 }),
    translate: (key: string) => key,
    document: undefined,
  };
}

const PROFILE: SkillProfileWire = {
  name: "flow-workflow",
  path: "/skills/flow-workflow/SKILL.md",
  argumentHint: "[--create] [--scope <package|project|global>]",
  metadata: { owner: "lionad" },
  params: [
    { flag: "--create", detail: "" },
    { flag: "--scope", detail: "<package|project|global>" },
  ],
};

describe("renderPanel", () => {
  it("renders the blocks in order: title, metadata, path, counts, params", () => {
    const { doc } = stubDocument();
    const panel = asStub(renderPanel(doc, panelDeps(), {
      name: "flow-workflow",
      profile: PROFILE,
      usage: { session: 3 },
      box: { left: 10, right: 120, top: 20, bottom: 40 },
      sessionId: "s1",
      getActions: () => ({ captureInsertion: () => ({ start: 15, end: 15, draftRev: 1 }), insertText: () => true }),
      getDraft: () => "/flow-workflow ",
      onEnter: () => {},
      onLeave: () => {},
    }));

    const classes = classesOf(panel);
    const order = [
      "dsh-better-skill-panel-title",
      "dsh-better-skill-panel-section",
      "dsh-better-skill-panel-path",
      "dsh-better-skill-panel-counts",
      "dsh-better-skill-panel-param",
    ].map(name => classes.indexOf(name));
    expect(order.every(index => index >= 0)).toBe(true);
    expect([...order].sort((a, b) => a - b)).toEqual(order);
  });

  it("omits the path block when the skill has no path", () => {
    const { doc } = stubDocument();
    const panel = asStub(renderPanel(doc, panelDeps(), {
      name: "virtual",
      profile: { name: "virtual", metadata: {}, params: [] },
      usage: undefined,
      box: undefined,
      sessionId: "s1",
      getActions: () => undefined,
      getDraft: () => "",
      onEnter: () => {},
      onLeave: () => {},
    }));

    expect(classesOf(panel)).not.toContain("dsh-better-skill-panel-path");
  });

  it("renders no parameter buttons when there is no insertion surface", () => {
    const { doc } = stubDocument();
    const panel = asStub(renderPanel(doc, panelDeps(), {
      name: "flow-workflow",
      profile: PROFILE,
      usage: { session: 3 },
      box: undefined,
      sessionId: "s1",
      getActions: () => undefined,
      getDraft: () => "/flow-workflow ",
      onEnter: () => {},
      onLeave: () => {},
    }));

    expect(classesOf(panel)).not.toContain("dsh-better-skill-panel-param");
  });

  it("inserts the flag with a leading space at the captured caret", () => {
    const { doc } = stubDocument();
    const inserted: { text: string; span: { start: number; end: number; draftRev: number } }[] = [];
    const panel = asStub(renderPanel(doc, panelDeps(), {
      name: "flow-workflow",
      profile: PROFILE,
      usage: { session: 3 },
      box: undefined,
      sessionId: "s1",
      getActions: () => ({
        captureInsertion: () => ({ start: 15, end: 15, draftRev: 7 }),
        insertText: (text, span) => {
          inserted.push({ text, span });
          return true;
        },
      }),
      getDraft: () => "/flow-workflow",
      onEnter: () => {},
      onLeave: () => {},
    }));

    const button = findByClass(panel, "dsh-better-skill-panel-param");
    expect(button).toBeDefined();
    button?.handlers.click?.[0]?.({ preventDefault() {} });

    expect(inserted).toEqual([{ text: " --create ", span: { start: 15, end: 15, draftRev: 7 } }]);
  });

  it("cancels pointerdown so the composer keeps focus", () => {
    const { doc } = stubDocument();
    const panel = asStub(renderPanel(doc, panelDeps(), {
      name: "flow-workflow",
      profile: PROFILE,
      usage: undefined,
      box: undefined,
      sessionId: "s1",
      getActions: () => ({ captureInsertion: () => ({ start: 0, end: 0, draftRev: 1 }), insertText: () => true }),
      getDraft: () => "",
      onEnter: () => {},
      onLeave: () => {},
    }));

    const button = findByClass(panel, "dsh-better-skill-panel-param");
    let prevented = false;
    button?.handlers.pointerdown?.[0]?.({ preventDefault: () => { prevented = true; } });
    expect(prevented).toBe(true);
  });

  it("shows the detail beside the flag only when there is one", () => {
    const { doc } = stubDocument();
    const panel = asStub(renderPanel(doc, panelDeps(), {
      name: "flow-workflow",
      profile: PROFILE,
      usage: undefined,
      box: undefined,
      sessionId: "s1",
      getActions: () => ({ captureInsertion: () => ({ start: 0, end: 0, draftRev: 1 }), insertText: () => true }),
      getDraft: () => "",
      onEnter: () => {},
      onLeave: () => {},
    }));

    const details = classesOf(panel).filter(name => name === "dsh-better-skill-panel-param-detail");
    // Two params, one of which has no detail.
    expect(details).toHaveLength(1);
  });
});

describe("renderGhost", () => {
  it("sits after the token when there is room", () => {
    const { doc } = stubDocument();
    const ghost = asStub(renderGhost(doc, { left: 10, right: 120, top: 20, bottom: 40 }, ["[--create]"]));

    expect(ghost.className).toBe("dsh-better-skill-hint");
    expect(ghost.style.left).toBe("126px");
    expect(ghost.style.top).toBe("20px");
  });

  it("wraps under the token when the right edge is close", () => {
    const { doc } = stubDocument();
    const ghost = asStub(renderGhost(doc, { left: 900, right: 1180, top: 20, bottom: 40 }, ["[--create]"]));

    expect(ghost.style.left).toBe("900px");
    expect(ghost.style.top).toBe("42px");
  });

  it("keeps authored line breaks", () => {
    const { doc } = stubDocument();
    const ghost = asStub(renderGhost(doc, { left: 0, right: 10, top: 0, bottom: 10 }, ["[--a]", "[--b]"]));

    expect(ghost.textContent).toBe("[--a]\n[--b]");
  });
});
