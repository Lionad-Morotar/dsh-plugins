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
  clampPanelLeft,
  hintLinesFor,
  panelMaxWidth,
  panelPlacement,
  panelWidthFor,
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
    defaultView: { addEventListener() {}, removeEventListener() {}, innerWidth: 1200, innerHeight: 800 },
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
  description: "文档驱动的动态工作流：编排剧本写成工作流文档，主代理按文档编排子代理执行。",
  path: "/skills/flow-workflow/SKILL.md",
  argumentHint: "[--create] [--scope <package|project|global>]",
  metadata: { owner: "lionad" },
  params: [
    { flag: "--create", detail: "" },
    { flag: "--scope", detail: "<package|project|global>" },
  ],
};

describe("panelPlacement", () => {
  /** A token sitting 600px down a 800px-tall window. */
  const box = { left: 120, right: 260, top: 600, bottom: 618 };

  it("opens above the token when there is room", () => {
    // 596px of room above, a 300px panel fits.
    expect(panelPlacement(box, 800, 300, 4)).toEqual({ left: 120, top: 0, anchor: "above" });
  });

  it("flips below when the panel is taller than the room above", () => {
    // 596px of room above the margin; a 700px panel cannot fit going up, and the
    // flip anchors to the token's bottom so the top edge lands at 618 + 4.
    expect(panelPlacement(box, 800, 700, 4)).toEqual({ left: 120, top: 622, anchor: "below" });
  });

  it("keeps the token's left edge in both directions", () => {
    expect(panelPlacement({ ...box, left: 7 }, 800, 300, 4).left).toBe(7);
    expect(panelPlacement({ ...box, left: 7 }, 800, 900, 4).left).toBe(7);
  });

  it("prefers above before the panel has been measured", () => {
    // The first paint has no height yet; choosing by a guessed size would flicker.
    expect(panelPlacement(box, 800, 0, 4).anchor).toBe("above");
  });

  it("flips below for a token near the top of a short window", () => {
    const nearTop = { left: 10, right: 80, top: 8, bottom: 26 };
    expect(panelPlacement(nearTop, 400, 200, 4)).toEqual({ left: 10, top: 30, anchor: "below" });
  });

  it("treats a non-finite panel height as not yet measured", () => {
    // A detached or stubbed node reports no offsetHeight; reading that as
    // "taller than the room" would open the panel downward on the first paint.
    expect(panelPlacement(box, 800, Number.NaN, 4).anchor).toBe("above");
    expect(panelPlacement(box, 800, Number.POSITIVE_INFINITY, 4).anchor).toBe("above");
  });

  it("treats an unknown viewport height as room-above", () => {
    // The height is not consulted for the above branch; the room comes from the box.
    expect(panelPlacement(box, 0, 300, 4).anchor).toBe("above");
  });
});

describe("panelWidthFor", () => {
  /** A wide desktop window: nothing is clamped by the viewport. */
  const WIDE = 1600;

  it("stays narrow for a skill with no description", () => {
    expect(panelWidthFor(0, WIDE)).toBe(240);
  });

  it("stays narrow for a one-line description", () => {
    expect(panelWidthFor(40, WIDE)).toBe(320);
  });

  it("widens for the catalog's typical description", () => {
    // The installed catalog's median description is 175 characters.
    expect(panelWidthFor(175, WIDE)).toBe(480);
  });

  it("takes the full width for the ~200-character budget", () => {
    expect(panelWidthFor(200, WIDE)).toBe(640);
    expect(panelWidthFor(201, WIDE)).toBe(640);
  });

  it("does not grow past the ceiling for very long descriptions", () => {
    // The longest installed description is 895 characters; the panel clamps and
    // the stylesheet ellipsizes rather than opening a full-width slab.
    expect(panelWidthFor(895, WIDE)).toBe(640);
  });

  it("never exceeds a narrow viewport", () => {
    expect(panelWidthFor(895, 400)).toBe(376);
  });

  it("never shrinks below the minimum on a tiny viewport", () => {
    expect(panelWidthFor(895, 100)).toBe(240);
  });

  it("falls back to the ceiling when the viewport width is unknown", () => {
    expect(panelWidthFor(895, 0)).toBe(640);
  });

  it("treats a non-finite length as no description", () => {
    expect(panelWidthFor(Number.NaN, WIDE)).toBe(240);
  });
});

describe("panelMaxWidth", () => {
  it("caps at the stylesheet ceiling on a wide window", () => {
    expect(panelMaxWidth(1600)).toBe(640);
  });

  it("leaves a margin on both sides of a narrow window", () => {
    expect(panelMaxWidth(500)).toBe(476);
  });

  it("never returns less than the minimum", () => {
    expect(panelMaxWidth(100)).toBe(240);
  });

  it("ignores an unknown viewport", () => {
    expect(panelMaxWidth(0)).toBe(640);
  });
});

describe("clampPanelLeft", () => {
  it("keeps a panel that already fits", () => {
    expect(clampPanelLeft(120, 480, 1600, 12)).toBe(120);
  });

  it("pulls a panel back from the right edge", () => {
    // 100 + 640 would end at 740 in a 700px window; the left edge moves to 48.
    expect(clampPanelLeft(100, 640, 700, 12)).toBe(48);
  });

  it("keeps the left margin when the panel is wider than the window", () => {
    expect(clampPanelLeft(300, 640, 400, 12)).toBe(12);
  });

  it("never returns a negative left edge", () => {
    expect(clampPanelLeft(-40, 480, 1600, 12)).toBe(12);
  });

  it("does nothing when the viewport is unknown", () => {
    expect(clampPanelLeft(-40, 480, 0, 12)).toBe(-40);
  });
});

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

  it("renders the description under the name, before the metadata block", () => {
    const { doc } = stubDocument();
    const panel = asStub(renderPanel(doc, panelDeps(), {
      name: "flow-workflow",
      profile: PROFILE,
      usage: { session: 1 },
      box: undefined,
      sessionId: "s1",
      getActions: () => undefined,
      getDraft: () => "/flow-workflow ",
      onEnter: () => {},
      onLeave: () => {},
    }));

    const classes = classesOf(panel);
    const titleAt = classes.indexOf("dsh-better-skill-panel-title");
    const descAt = classes.indexOf("dsh-better-skill-panel-desc");
    const metaAt = classes.indexOf("dsh-better-skill-panel-section");
    expect(descAt).toBeGreaterThan(titleAt);
    expect(descAt).toBeLessThan(metaAt);
  });

  it("carries the full description on the title attribute for the clamp", () => {
    const { doc } = stubDocument();
    const panel = asStub(renderPanel(doc, panelDeps(), {
      name: "flow-workflow",
      profile: PROFILE,
      usage: undefined,
      box: undefined,
      sessionId: "s1",
      getActions: () => undefined,
      getDraft: () => "/flow-workflow ",
      onEnter: () => {},
      onLeave: () => {},
    }));

    const desc = panel.children.find(child => child.className === "dsh-better-skill-panel-desc");
    expect(desc?.title).toBe(PROFILE.description);
  });

  it("omits the description row when the skill has none", () => {
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

    expect(classesOf(panel)).not.toContain("dsh-better-skill-panel-desc");
  });

  it("anchors the panel above the token when the composer sits low", () => {
    // The stub window is 800px tall and the token sits 600px down, so 596px of
    // room remains above it: the panel pins its bottom edge rather than its top.
    const { doc } = stubDocument();
    const panel = asStub(renderPanel(doc, panelDeps(), {
      name: "flow-workflow",
      profile: PROFILE,
      usage: { session: 3 },
      box: { left: 120, right: 260, top: 600, bottom: 618 },
      sessionId: "s1",
      getActions: () => undefined,
      getDraft: () => "/flow-workflow ",
      onEnter: () => {},
      onLeave: () => {},
    }));

    expect(panel.style.left).toBe("120px");
    // The bottom offset is computed from the token's top edge and the margin.
    expect(panel.style.bottom).toBe("204px");
    expect(panel.style.top).toBe("");
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
