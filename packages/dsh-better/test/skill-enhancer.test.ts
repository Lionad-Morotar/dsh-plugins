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
  anchorParamPanel,
  appendParam,
  catalogSelection,
  clampPanelLeft,
  hintLinesFor,
  occurrencesOf,
  panelMaxWidth,
  panelPlacement,
  panelWidthFor,
  panelVisibleFor,
  paramInsertionText,
  renderCatalogPanel,
  renderGhost,
  renderPanel,
  renderParamPanel,
} from "../src/client/skill-enhancer.tsx";
import type { CatalogDraftMatch } from "../src/client/catalog-panel.ts";
import type { ParamDraftMatch } from "../src/client/skill-param.ts";
import type { SkillParam, SkillProfileWire } from "../src/skill-profile.ts";
import type { WorkflowEntry } from "../src/workflow-catalog.ts";

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
  /**
   * The measured height, which a real node only reports once it is in the
   * document. Tests assign it directly to stand in for that measurement.
   */
  offsetHeight: number;
  children: StubNode[];
  handlers: Record<string, ((event: { preventDefault(): void }) => void)[]>;
  append(child: StubNode): void;
  addEventListener(name: string, handler: (event: { preventDefault(): void }) => void): void;
  removeEventListener(): void;
  remove(): void;
}

function stubDocument(view: { readonly innerWidth?: number; readonly innerHeight?: number } = {}): {
  doc: Document;
  created: StubNode[];
} {
  const created: StubNode[] = [];
  const make = (tagName: string): StubNode => {
    const node: StubNode = {
      tagName,
      className: "",
      textContent: "",
      title: "",
      type: "",
      style: {},
      offsetHeight: 0,
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
    // A text node carries no handlers, so the stub only has to hold its text and
    // the class the assertions read; the highlight cases count children by it.
    createTextNode: (text: string) => {
      const node = make("#text");
      node.textContent = text;
      return node;
    },
    getElementById: () => null,
    querySelector: () => null,
    querySelectorAll: () => [],
    head: { append() {} },
    body: { append() {} },
    addEventListener() {},
    removeEventListener() {},
    defaultView: {
      addEventListener() {},
      removeEventListener() {},
      innerWidth: view.innerWidth ?? 1200,
      innerHeight: view.innerHeight ?? 800,
    },
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
  // `className` is a space-separated list, not one name: a node carrying both a
  // base class and a state class has to answer to both.
  return [...namesOf(node), ...node.children.flatMap(child => classesOf(child))];
}

/** The class names on one node. */
function namesOf(node: StubNode): string[] {
  return node.className.split(/\s+/u).filter(name => name !== "");
}

/**
 * The text of a node and everything under it.
 *
 * The stub keeps `textContent` as a plain field, so a node assembled from several
 * text children reads as empty. The real property aggregates, and the highlight
 * cases are exactly the ones that assemble one.
 */
function textOf(node: StubNode): string {
  return node.textContent + node.children.map(child => textOf(child)).join("");
}

/** The first node with a class, depth first. */
function findByClass(node: StubNode, className: string): StubNode | undefined {
  if (namesOf(node).includes(className)) return node;
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

describe("occurrencesOf", () => {
  it("returns nothing when the state publishes no occurrences", () => {
    expect(occurrencesOf({ draft: "/flow ", draftRev: 1, phase: "plain" })).toEqual([]);
  });

  it("returns nothing for a value that is not an array", () => {
    // The host's shape is not this module's to enforce, so anything unexpected
    // degrades to "no chips" rather than throwing inside a keystroke handler.
    // The casts are the point: these are shapes the published type rules out and
    // a real composer can still hand over.
    const notAnArray = (value: unknown) => ({ draft: "", draftRev: 1, phase: "plain", occurrences: value } as never);
    expect(occurrencesOf(notAnArray(null))).toEqual([]);
    expect(occurrencesOf(notAnArray(7))).toEqual([]);
  });

  it("keeps well-formed entries and drops the rest", () => {
    const state = {
      draft: "",
      draftRev: 1,
      phase: "plain",
      occurrences: [{ offset: 6, length: 5 }, { offset: "8", length: 2 }, null, { offset: 1 }],
    };
    expect(occurrencesOf(state)).toEqual([{ offset: 6, length: 5 }]);
  });

  it("keeps a zero-length entry, which shifts nothing", () => {
    const state = { draft: "", draftRev: 1, phase: "plain", occurrences: [{ offset: 0, length: 0 }] };
    expect(occurrencesOf(state)).toEqual([{ offset: 0, length: 0 }]);
  });
});

/**
 * The parameter candidate panel.
 *
 * This is the surface that replaces typing a flag from memory: the user types
 * `--` and the list narrows as they type. Two things about it are load-bearing
 * and both are asserted here — the rows mirror the filtered parameters, and a
 * click replaces the typed token through the host's revision-checked insertion
 * rather than appending to the end of the draft.
 *
 * The offset case is the one that fails silently in a real composer: an
 * attachment chip is many characters in the draft and one in the editor, so a
 * span computed in draft coordinates replaces the wrong text. The stub document
 * cannot reproduce that, but the arithmetic can, which is why the chip cases are
 * driven through the real `paramCompletionSpan`.
 */
describe("renderParamPanel", () => {
  /** The parameters the panel lists, in the order the profile gave them. */
  const PARAMS: readonly SkillParam[] = [
    { flag: "--create", detail: "" },
    { flag: "--scope", detail: "<package|project|global>" },
  ];

  /** A draft with the parameter token at its end. */
  const DRAFT = "/flow-workflow --c";

  /** The match `matchParamDraft` produces for {@link DRAFT}. */
  const MATCH: ParamDraftMatch = { name: "flow-workflow", query: "--c", start: 15 };

  /** One recorded insertion, as the stub action surface saw it. */
  interface Recorded {
    readonly text: string;
    readonly span: { readonly start: number; readonly end: number; readonly draftRev: number };
  }

  /** Build the panel over a stub document, recording insertions. */
  function build(options: {
    readonly params?: readonly SkillParam[];
    readonly draft?: string;
    readonly match?: ParamDraftMatch;
    readonly occurrences?: readonly { readonly offset: number; readonly length: number }[];
    readonly actions?: boolean;
  } = {}): { panel: StubNode; inserted: Recorded[]; prevented: unknown[] } {
    const { doc } = stubDocument();
    const inserted: Recorded[] = [];
    const prevented: unknown[] = [];
    const actions = options.actions === false
      ? undefined
      : {
        captureInsertion: () => ({ start: 15, end: 17, draftRev: 7 }),
        insertText: (text: string, span: Recorded["span"]) => {
          inserted.push({ text, span });
          return true;
        },
      };
    const panel = asStub(renderParamPanel(doc, {
      name: options.match?.name ?? "flow-workflow",
      match: options.match ?? MATCH,
      params: options.params ?? PARAMS,
      getActions: () => actions,
      getDraft: () => options.draft ?? DRAFT,
      getOccurrences: () => options.occurrences ?? [],
    }));
    // Count a row that cancels pointerdown: that is the row that keeps the
    // composer focused, and it is the only thing the handler is for.
    for (const row of panel.children) {
      const handler = row.handlers.pointerdown?.[0];
      if (handler === undefined) continue;
      row.handlers.pointerdown = [(event) => {
        prevented.push(event);
        handler(event);
      }];
    }
    return { panel, inserted, prevented };
  }

  it("titles itself with the skill token", () => {
    const { panel } = build();
    expect(findByClass(panel, "dsh-better-skill-params-title")?.textContent).toBe("/flow-workflow");
  });

  it("carries the panel class the stylesheet scopes", () => {
    const { panel } = build();
    expect(panel.className).toBe("dsh-better-skill-params");
  });

  it("renders one row per parameter, in order", () => {
    const { panel } = build();
    const rows = classesOf(panel).filter(name => name === "dsh-better-skill-panel-param");
    expect(rows).toHaveLength(PARAMS.length);
    const first = findByClass(panel, "dsh-better-skill-panel-param");
    expect(first?.children[0]?.textContent).toBe("--create");
  });

  it("shows a detail only for the parameters that have one", () => {
    const { panel } = build();
    const details = classesOf(panel).filter(name => name === "dsh-better-skill-panel-param-detail");
    expect(details).toHaveLength(1);
  });

  it("replaces the typed token instead of appending to the draft", () => {
    // The span comes from the captured revision and the token's own offsets, so
    // the half-typed `--c` is replaced rather than left behind.
    const { panel, inserted } = build();
    findByClass(panel, "dsh-better-skill-panel-param")?.handlers.click?.[0]?.({ preventDefault() {} });
    // The span ends at the draft's end: the whole half-typed token is replaced.
    expect(inserted).toEqual([{ text: "--create ", span: { start: 15, end: 18, draftRev: 7 } }]);
  });

  it("shifts the span for an attachment chip earlier in the draft", () => {
    // `/flow @a.md --s`: the chip is 5 characters in the draft and 1 in the
    // editor, so the token starts at 12 in the draft and 8 in the editor.
    const { panel, inserted } = build({
      draft: "/flow @a.md --s",
      match: { name: "flow", query: "--s", start: 12 },
      params: [{ flag: "--search", detail: "" }],
      occurrences: [{ offset: 6, length: 5 }],
    });
    findByClass(panel, "dsh-better-skill-panel-param")?.handlers.click?.[0]?.({ preventDefault() {} });
    expect(inserted).toEqual([{ text: "--search ", span: { start: 8, end: 11, draftRev: 7 } }]);
  });

  it("inserts nothing when the token offset falls inside a chip", () => {
    // A span that cannot be mapped honestly is dropped: inserting at a guessed
    // offset would corrupt the draft, which is worse than a click that does
    // nothing and leaves the token for the user to finish.
    const { panel, inserted } = build({
      draft: "/flow @a.md --s",
      match: { name: "flow", query: "--s", start: 8 },
      params: [{ flag: "--search", detail: "" }],
      occurrences: [{ offset: 6, length: 5 }],
    });
    findByClass(panel, "dsh-better-skill-panel-param")?.handlers.click?.[0]?.({ preventDefault() {} });
    expect(inserted).toEqual([]);
  });

  it("cancels pointerdown so the composer keeps focus", () => {
    const { panel, prevented } = build();
    let cancelled = false;
    findByClass(panel, "dsh-better-skill-panel-param")?.handlers.pointerdown?.[0]?.({
      preventDefault: () => {
        cancelled = true;
      },
    });
    expect(cancelled).toBe(true);
    expect(prevented).toHaveLength(1);
  });

  it("renders no rows when there is no insertion surface", () => {
    // A row that cannot insert teaches a gesture that does nothing.
    const { panel } = build({ actions: false });
    expect(classesOf(panel)).not.toContain("dsh-better-skill-panel-param");
  });

  it("keeps the title when there is nothing to insert", () => {
    const { panel } = build({ actions: false });
    expect(findByClass(panel, "dsh-better-skill-params-title")?.textContent).toBe("/flow-workflow");
  });

  it("renders at a fixed width that ignores the box", () => {
    const { panel } = build();
    expect(panel.style.width).toBe("320px");
  });

  it("leaves vertical placement to the caller that can measure it", () => {
    // A node that is not in the document yet reports offsetHeight 0, and
    // `panelPlacement` reads 0 as "not measured yet" and picks `above`. Placing
    // the panel here would therefore always open upward, even with the caret at
    // the top of the window, so the build step writes no position at all.
    const { panel } = build();
    expect(panel.style.left).toBeUndefined();
    expect(panel.style.top).toBeUndefined();
    expect(panel.style.bottom).toBeUndefined();
  });
});

/**
 * The parameter panel's placement, run after the node is in the document.
 *
 * This is the half of the placement that has to happen late: the flip above or
 * below depends on the panel's real height, and a detached node has none. The
 * stub stands in for the browser by assigning `offsetHeight` directly, which is
 * exactly the value the real node would report once appended.
 */
describe("anchorParamPanel", () => {
  /** A token sitting 600px down an 800px-tall window. */
  const LOW = { left: 120, right: 120, top: 600, bottom: 618 };

  /** A token near the top of the same window. */
  const HIGH = { left: 120, right: 120, top: 40, bottom: 58 };

  /** Build a bare node with a measured height, as the browser would report it. */
  function measured(height: number): StubNode {
    const { doc } = stubDocument();
    const node = asStub(doc.createElement("div"));
    node.offsetHeight = height;
    return node;
  }

  it("opens above the token when the panel fits in the room above it", () => {
    const { doc } = stubDocument();
    const node = measured(300);
    anchorParamPanel(doc, node as unknown as HTMLElement, LOW);

    expect(node.style.left).toBe("120px");
    // 800px window, token top at 600, 4px margin.
    expect(node.style.bottom).toBe("204px");
    expect(node.style.top).toBe("");
  });

  it("flips below the token when the room above is too small", () => {
    // 36px of room above a 300px panel: opening upward would push most of the
    // list past the top of the window, which is the bug this split fixes.
    const { doc } = stubDocument();
    const node = measured(300);
    anchorParamPanel(doc, node as unknown as HTMLElement, HIGH);

    expect(node.style.top).toBe("62px");
    expect(node.style.bottom).toBe("");
  });

  it("writes no position at all when the anchor box is unknown", () => {
    const { doc } = stubDocument();
    const node = measured(300);
    anchorParamPanel(doc, node as unknown as HTMLElement, undefined);

    expect(node.style.left).toBeUndefined();
    expect(node.style.top).toBeUndefined();
    expect(node.style.bottom).toBeUndefined();
  });

  it("clamps the left edge on a narrow viewport", () => {
    const { doc } = stubDocument({ innerWidth: 300 });
    const node = measured(300);
    anchorParamPanel(doc, node as unknown as HTMLElement, LOW);

    // A 300px window cannot fit a 240px panel beside a 12px margin on both
    // sides, so the left margin wins and the panel starts at 12.
    expect(node.style.left).toBe("12px");
  });

  it("re-states the width so the clamp and the box agree", () => {
    const { doc } = stubDocument({ innerWidth: 300 });
    const node = measured(300);
    anchorParamPanel(doc, node as unknown as HTMLElement, LOW);

    expect(node.style.width).toBe("276px");
  });
});

/**
 * The catalogue panel's rendering and its insertion path.
 *
 * Two things here fail silently in a real composer and are worth the cases:
 *
 *   - the row's replacement span, because it is computed from the captured
 *     revision and the draft's chips, and a span in the wrong coordinate system
 *     replaces text the user did not point at;
 *   - the highlight, because it is built with DOM nodes rather than `innerHTML`,
 *     and a regression there is either a mark over the wrong characters or a
 *     slug rendered as literal markup.
 */
describe("renderCatalogPanel", () => {
  /** The catalogue the panel lists, in merged order. */
  const ENTRIES: readonly WorkflowEntry[] = [
    { slug: "dev", summary: "把单个任务描述按拆解交付" },
    { slug: "devmap", summary: "自动推进蓝图" },
  ];

  /** The match `matchCatalogDraft` produces for `/flow-workflow run de`. */
  const MATCH: CatalogDraftMatch = { name: "flow-workflow", slot: "run", query: "de", start: 19 };

  /** One recorded insertion, as the stub action surface saw it. */
  interface Recorded {
    readonly text: string;
    readonly span: { readonly start: number; readonly end: number; readonly draftRev: number };
  }

  /** Build the panel over a stub document, recording insertions. */
  function build(options: {
    readonly entries?: readonly WorkflowEntry[];
    readonly draft?: string;
    readonly match?: CatalogDraftMatch;
    readonly occurrences?: readonly { readonly offset: number; readonly length: number }[];
    readonly actions?: boolean;
    readonly selected?: number;
  } = {}): { panel: StubNode; inserted: Recorded[]; prevented: unknown[] } {
    const { doc } = stubDocument();
    const inserted: Recorded[] = [];
    const prevented: unknown[] = [];
    const actions = options.actions === false
      ? undefined
      : {
        captureInsertion: () => ({ start: 19, end: 21, draftRev: 9 }),
        insertText: (text: string, span: Recorded["span"]) => {
          inserted.push({ text, span });
          return true;
        },
      };
    const panel = asStub(renderCatalogPanel(doc, {
      name: options.match?.name ?? "flow-workflow",
      slot: options.match?.slot ?? "run",
      match: options.match ?? MATCH,
      entries: options.entries ?? ENTRIES,
      selected: options.selected ?? 0,
      getActions: () => actions,
      getDraft: () => options.draft ?? "/flow-workflow run de",
      getOccurrences: () => options.occurrences ?? [],
    }));
    // Count a row that cancels pointerdown: that is the row that keeps the
    // composer focused, and it is the only thing the handler is for.
    for (const row of panel.children) {
      const handler = row.handlers.pointerdown?.[0];
      if (handler === undefined) continue;
      row.handlers.pointerdown = [(event) => {
        prevented.push(event);
        handler(event);
      }];
    }
    return { panel, inserted, prevented };
  }

  it("carries the panel class the stylesheet scopes", () => {
    const { panel } = build();
    expect(panel.className).toBe("dsh-better-skill-catalog");
  });

  it("titles itself with the skill and the slot word", () => {
    const { panel } = build();
    expect(findByClass(panel, "dsh-better-skill-catalog-title")?.textContent).toBe("/flow-workflow run");
  });

  it("renders one row per entry, in order", () => {
    const { panel } = build();
    const rows = classesOf(panel).filter(name => name === "dsh-better-skill-catalog-row");
    expect(rows).toHaveLength(ENTRIES.length);
    const first = findByClass(panel, "dsh-better-skill-catalog-row");
    expect(first === undefined ? undefined : textOf(first.children[0]!)).toBe("dev");
  });

  it("shows the summary beside the slug", () => {
    const { panel } = build();
    const summaries = classesOf(panel).filter(name => name === "dsh-better-skill-catalog-summary");
    expect(summaries).toHaveLength(ENTRIES.length);
  });

  it("marks the selected row and only that row", () => {
    const { panel } = build({ selected: 1 });
    const selected = classesOf(panel).filter(name => name === "dsh-better-skill-catalog-selected");
    expect(selected).toHaveLength(1);
  });

  it("marks the matched characters of the slug", () => {
    const { panel } = build();
    const marks = classesOf(panel).filter(name => name === "dsh-better-skill-catalog-mark");
    // `de` is in both slugs, once each.
    expect(marks).toHaveLength(2);
    const firstMark = findByClass(panel, "dsh-better-skill-catalog-mark");
    expect(firstMark?.textContent).toBe("de");
  });

  it("builds the highlight from text nodes rather than markup", () => {
    // A slug is user-adjacent data; rendering it through innerHTML would let a
    // catalogue entry inject structure into the composer's own overlay.
    const { panel } = build({ entries: [{ slug: "a<b>c", summary: "x" }], match: { ...MATCH, query: "b" } });

    const row = findByClass(panel, "dsh-better-skill-catalog-row");
    const slug = row?.children[0];
    expect(slug === undefined ? undefined : textOf(slug)).toBe("a<b>c");
    expect(slug?.children.map(child => textOf(child))).toEqual(["a<", "b", ">c"]);
  });

  it("replaces the typed value instead of appending to the draft", () => {
    const { panel, inserted } = build();
    findByClass(panel, "dsh-better-skill-catalog-row")?.handlers.click?.[0]?.({ preventDefault() {} });

    expect(inserted).toEqual([{ text: "dev ", span: { start: 19, end: 21, draftRev: 9 } }]);
  });

  it("inserts the row that was clicked, not the selected one", () => {
    const { panel, inserted } = build({ selected: 0 });
    const rows = panel.children.filter(child => namesOf(child).includes("dsh-better-skill-catalog-row"));
    rows[1]?.handlers.click?.[0]?.({ preventDefault() {} });

    expect(inserted[0]?.text).toBe("devmap ");
  });

  it("keeps the composer focused by cancelling pointerdown on a row", () => {
    const { panel, prevented } = build();
    findByClass(panel, "dsh-better-skill-catalog-row")?.handlers.pointerdown?.[0]?.({ preventDefault() {} });

    expect(prevented).toHaveLength(1);
  });

  it("translates the span through the attachment chips", () => {
    // The chip is six characters in the draft and one in the editor, so the
    // replacement lands five characters earlier than the draft offset says.
    const { panel, inserted } = build({
      draft: "@a.md /flow-workflow run de",
      match: { name: "flow-workflow", slot: "run", query: "de", start: 25 },
      occurrences: [{ offset: 0, length: 5 }],
    });
    findByClass(panel, "dsh-better-skill-catalog-row")?.handlers.click?.[0]?.({ preventDefault() {} });

    // The chip collapses five characters, so the draft offset 25 becomes 21 in
    // the editor's coordinates. A span left in draft coordinates would replace
    // text five characters to the right of the value the user pointed at.
    expect(inserted[0]?.span).toEqual({ start: 21, end: 23, draftRev: 9 }); 
  });

  it("renders no rows when there is no insertion path", () => {
    // A row that cannot insert teaches a gesture that does nothing.
    const { panel } = build({ actions: false });
    expect(classesOf(panel).filter(name => name === "dsh-better-skill-catalog-row")).toHaveLength(0);
  });

  it("still renders its title without an insertion path", () => {
    const { panel } = build({ actions: false });
    expect(findByClass(panel, "dsh-better-skill-catalog-title")?.textContent).toBe("/flow-workflow run");
  });
});

describe("catalogSelection", () => {
  it("starts on the first row", () => {
    expect(catalogSelection(undefined, 5, "down")).toBe(0);
  });

  it("moves down and stops at the last row", () => {
    expect(catalogSelection(0, 3, "down")).toBe(1);
    expect(catalogSelection(2, 3, "down")).toBe(2);
  });

  it("moves up and stops at the first row", () => {
    expect(catalogSelection(2, 3, "up")).toBe(1);
    expect(catalogSelection(0, 3, "up")).toBe(0);
  });

  it("clamps a selection that outlived a shorter list", () => {
    // The user typed, the list shrank, and the index now points past the end: the
    // highlight comes back to the last row rather than sticking off the list.
    expect(catalogSelection(9, 3, "down")).toBe(2);
    expect(catalogSelection(9, 3, "up")).toBe(1);
  });

  it("reports nothing to select for an empty list", () => {
    expect(catalogSelection(0, 0, "down")).toBeUndefined();
    expect(catalogSelection(undefined, 0, "up")).toBeUndefined();
  });
});
