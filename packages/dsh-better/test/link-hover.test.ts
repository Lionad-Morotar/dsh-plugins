// @vitest-environment jsdom
/**
 * The link hover panel: which links get one, what it says, and how it goes away.
 *
 * Every case here is a product decision that fails silently when it is wrong. A
 * panel over a sidebar link is noise; a panel that shows the link's visible text
 * instead of its address is pointless, because the address is the whole reason
 * the panel exists; a panel that survives a scroll floats over content it no
 * longer belongs to. None of those throw, so each one is pinned here.
 *
 * Placement is asserted through the pure function rather than through a rendered
 * panel: jsdom has no layout engine, so a measured rect would be a wall of
 * zeroes and the four edges would be indistinguishable.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  COPY_FEEDBACK_MS,
  LINK_HOVER_ADDRESS_CLASS,
  LINK_HOVER_COPY_CLASS,
  LINK_HOVER_PANEL_CLASS,
  copyLinkAddress,
  installLinkHover,
  isHoverableHref,
  placeLinkPanel,
} from "../src/client/link-hover.ts";
import { LINK_HOVER_SHEET, LINK_HOVER_STYLE_ID } from "../src/client/link-hover-styles.ts";

/** A link long enough that the panel has to wrap it rather than truncate it. */
const HREF = "https://example.test/reports/2026/q3/full-breakdown?period=quarter&currency=USD";

/** The `better` strings, resolved the way the real dictionary resolves them. */
function translate(key: string): string {
  const zh: Readonly<Record<string, string>> = {
    "link.copy": "复制",
    "link.copied": "已复制",
    "link.copyFailed": "复制失败",
    "link.copyAria": "复制链接地址",
  };
  return zh[key] ?? key;
}

/** The panel, once the first hover has created it. */
function panel(): HTMLElement | null {
  return document.querySelector<HTMLElement>(`.${LINK_HOVER_PANEL_CLASS}`);
}

/** Whether the panel exists and is showing. */
function visible(): boolean {
  const found = panel();
  return found !== null && found.hidden === false;
}

/** The address the panel is currently showing. */
function addressText(): string | null {
  return document.querySelector(`.${LINK_HOVER_ADDRESS_CLASS}`)?.textContent ?? null;
}

/** The copy button of the panel that is on screen. */
function copyButton(): HTMLButtonElement {
  const found = document.querySelector<HTMLButtonElement>(`.${LINK_HOVER_COPY_CLASS}`);
  if (found === null) throw new Error("the panel has no copy button");
  return found;
}

/** An anchor inside the model's markdown root, as the host renders one. */
function flowLink(href = HREF, text = "文档"): { flow: HTMLElement; anchor: HTMLAnchorElement } {
  const flow = document.createElement("div");
  flow.setAttribute("data-slot", "conversation.chat.flow");
  const anchor = document.createElement("a");
  anchor.setAttribute("href", href);
  anchor.textContent = text;
  flow.append(anchor);
  document.body.append(flow);
  return { flow, anchor };
}

/** An anchor inside a user bubble, which the host does not render today. */
function bubbleLink(href = HREF): { bubble: HTMLElement; anchor: HTMLAnchorElement } {
  const bubble = document.createElement("div");
  bubble.setAttribute("data-message-bubble", "");
  const anchor = document.createElement("a");
  anchor.setAttribute("href", href);
  anchor.textContent = "链接";
  bubble.append(anchor);
  document.body.append(bubble);
  return { bubble, anchor };
}

/** An anchor somewhere that is not the conversation. */
function strayLink(href = HREF): HTMLAnchorElement {
  const host = document.createElement("div");
  const anchor = document.createElement("a");
  anchor.setAttribute("href", href);
  anchor.textContent = "侧栏";
  host.append(anchor);
  document.body.append(host);
  return anchor;
}

/** Point the pointer at an element the way a real hover arrives. */
function hover(element: Element): void {
  element.dispatchEvent(new MouseEvent("mouseover", { bubbles: true }));
}

/** Move the pointer off an element, onto the given target. */
function leave(element: Element, to: EventTarget): void {
  element.dispatchEvent(new MouseEvent("mouseout", { bubbles: true, relatedTarget: to as EventTarget }));
}

/** Make the page report itself as a device without hover. */
function pretendTouchDevice(): void {
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    writable: true,
    value: (query: string) => ({
      matches: query.includes("hover: none"),
      media: query,
      onchange: null,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      addListener: () => undefined,
      removeListener: () => undefined,
      dispatchEvent: () => false,
    }),
  });
}

/** Give the page a clipboard that accepts writes. */
function allowClipboard(writeText: (text: string) => Promise<void>): void {
  Object.defineProperty(window.navigator, "clipboard", { configurable: true, value: { writeText } });
}

/** Give the page a legacy copy command that answers with the given result. */
function allowSelectionCopy(result: boolean): ReturnType<typeof vi.fn> {
  const command = vi.fn(() => result);
  (document as unknown as { execCommand: (name: string) => boolean }).execCommand = command;
  return command;
}

let dispose: () => void = () => undefined;

/** Install the panel over the current document. */
function install(): void {
  dispose = installLinkHover(document, { translate });
}

beforeEach(() => {
  document.body.innerHTML = "";
  install();
});

afterEach(() => {
  dispose();
  vi.useRealTimers();
  delete (window.navigator as unknown as { clipboard?: unknown }).clipboard;
  delete (document as unknown as { execCommand?: unknown }).execCommand;
  delete (window as unknown as { matchMedia?: unknown }).matchMedia;
  document.body.innerHTML = "";
});

describe("which links get a panel", () => {
  it("shows the address of a link in the model's prose", () => {
    const { anchor } = flowLink();
    hover(anchor);
    expect(visible()).toBe(true);
    expect(addressText()).toBe(HREF);
  });

  it("shows the address of a link inside a user bubble", () => {
    const { anchor } = bubbleLink();
    hover(anchor);
    expect(visible()).toBe(true);
  });

  it("ignores a link outside the conversation", () => {
    hover(strayLink());
    expect(visible()).toBe(false);
  });

  it("shows the href, not the words the link is written with", () => {
    const { anchor } = flowLink(HREF, "季度报告");
    hover(anchor);
    expect(addressText()).toBe(HREF);
    expect(addressText()).not.toBe("季度报告");
  });

  it("shows the address while the message is still being written", () => {
    const streaming = document.createElement("div");
    streaming.setAttribute("data-streaming", "");
    document.body.append(streaming);
    const flow = document.createElement("div");
    flow.setAttribute("data-slot", "conversation.chat.flow");
    const anchor = document.createElement("a");
    anchor.setAttribute("href", HREF);
    anchor.textContent = "文档";
    flow.append(anchor);
    streaming.append(flow);
    hover(anchor);
    expect(visible()).toBe(true);
  });

  it("follows the pointer to a second link", () => {
    const first = flowLink("https://example.test/one").anchor;
    const second = flowLink("https://example.test/two").anchor;
    hover(first);
    expect(addressText()).toBe("https://example.test/one");
    hover(second);
    expect(addressText()).toBe("https://example.test/two");
  });
});

describe("which addresses are worth showing", () => {
  it.each([
    ["", "an empty address"],
    ["   ", "an address of nothing but spaces"],
    ["#section-2", "an in-page anchor"],
    ["javascript:void(0)", "a script url"],
    ["JavaScript:alert(1)", "a script url in mixed case"],
    ["data:text/html,<b>x</b>", "a data url"],
    ["DATA:text/html,x", "a data url in mixed case"],
    // The url parser deletes tab, newline and carriage return before it reads
    // the scheme, so each of these is still a script or data address however it
    // is spelled. A panel over one would offer to copy an address the browser
    // would never treat as text.
    ["java\nscript:alert(1)", "a script url split by a newline"],
    ["java\tscript:alert(1)", "a script url split by a tab"],
    ["java\rscript:alert(1)", "a script url split by a carriage return"],
    ["da\nta:text/plain,x", "a data url split by a newline"],
  ])("refuses %j (%s)", href => {
    expect(isHoverableHref(href)).toBe(false);
  });

  it.each([
    ["https://example.test/a", "an https address"],
    ["http://example.test/a", "an http address"],
    ["mailto:someone@example.test", "a mail address"],
    ["/docs/readme.md", "a relative path"],
    // The same deletion rule cuts both ways: a newline in the middle of an
    // https address leaves the scheme intact, so the panel still belongs there.
    ["https://example.test/a\nb", "an https address with a newline in the path"],
  ])("accepts %j (%s)", href => {
    expect(isHoverableHref(href)).toBe(true);
  });

  it("shows nothing for an anchor whose address is refused", () => {
    const { anchor } = flowLink("#section-2");
    hover(anchor);
    expect(visible()).toBe(false);
  });

  it("shows nothing for an anchor with no href at all", () => {
    const flow = document.createElement("div");
    flow.setAttribute("data-slot", "conversation.chat.flow");
    const anchor = document.createElement("a");
    anchor.textContent = "没有地址";
    flow.append(anchor);
    document.body.append(flow);
    hover(anchor);
    expect(visible()).toBe(false);
  });

  it("trims the surrounding whitespace before showing the address", () => {
    const { anchor } = flowLink(`  ${HREF}  `);
    hover(anchor);
    expect(addressText()).toBe(HREF);
  });

  it("shows an address with a newline in it exactly as written", () => {
    // The deletion only decides whether the panel appears. What it shows is the
    // address the reader would copy, so the newline stays in the text.
    const href = "https://example.test/a\nb";
    const { anchor } = flowLink(href);
    hover(anchor);
    expect(visible()).toBe(true);
    expect(addressText()).toBe(href);
  });
});

describe("where the panel lands", () => {
  const viewport = { width: 1000, height: 800 };
  const size = { width: 480, height: 60 };

  it("keeps the panel off the left edge", () => {
    const point = placeLinkPanel({ left: 0, top: 100, right: 40, bottom: 120 }, size, viewport);
    expect(point.left).toBe(8);
  });

  it("keeps the panel off the right edge", () => {
    const point = placeLinkPanel({ left: 980, top: 100, right: 1000, bottom: 120 }, size, viewport);
    expect(point.left).toBe(1000 - 8 - 480);
  });

  it("puts the panel below a link near the top", () => {
    const point = placeLinkPanel({ left: 100, top: 10, right: 200, bottom: 30 }, size, viewport);
    expect(point.top).toBe(30 + 8);
  });

  it("flips the panel above a link near the bottom", () => {
    const point = placeLinkPanel({ left: 100, top: 740, right: 200, bottom: 760 }, size, viewport);
    expect(point.top).toBe(740 - 8 - 60);
  });

  it("keeps a panel taller than the room above it inside the viewport", () => {
    const point = placeLinkPanel({ left: 100, top: 700, right: 200, bottom: 720 }, { width: 480, height: 300 }, viewport);
    expect(point.top).toBeGreaterThanOrEqual(8);
    expect(point.top + 300).toBeLessThanOrEqual(800 - 8);
  });

  it("shrinks a panel wider than a narrow viewport to the viewport", () => {
    const point = placeLinkPanel({ left: 0, top: 100, right: 40, bottom: 120 }, size, { width: 300, height: 800 });
    expect(point.left).toBe(8);
  });
});

describe("copying the address", () => {
  it("writes through the clipboard when the browser allows it", async () => {
    const writeText = vi.fn(async () => undefined);
    allowClipboard(writeText);
    await expect(copyLinkAddress(HREF, document)).resolves.toBe(true);
    expect(writeText).toHaveBeenCalledWith(HREF);
  });

  it("falls back to the selection command when the clipboard refuses", async () => {
    allowClipboard(async () => {
      throw new Error("denied");
    });
    const command = allowSelectionCopy(true);
    await expect(copyLinkAddress(HREF, document)).resolves.toBe(true);
    expect(command).toHaveBeenCalledWith("copy");
  });

  it("reports failure when neither path works", async () => {
    allowClipboard(async () => {
      throw new Error("denied");
    });
    await expect(copyLinkAddress(HREF, document)).resolves.toBe(false);
  });

  it("copies on click without letting the click reach the page", async () => {
    const writeText = vi.fn(async () => undefined);
    allowClipboard(writeText);
    const { anchor } = flowLink();
    hover(anchor);
    const bubbled = vi.fn();
    document.addEventListener("click", bubbled);
    const click = new MouseEvent("click", { bubbles: true, cancelable: true });
    copyButton().dispatchEvent(click);
    await vi.waitFor(() => {
      expect(writeText).toHaveBeenCalledWith(HREF);
    });
    expect(click.defaultPrevented).toBe(true);
    expect(bubbled).not.toHaveBeenCalled();
    document.removeEventListener("click", bubbled);
  });

  it("says the address was copied, then goes back to offering it", async () => {
    vi.useFakeTimers();
    allowClipboard(async () => undefined);
    const { anchor } = flowLink();
    hover(anchor);
    copyButton().dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
    await vi.advanceTimersByTimeAsync(0);
    expect(copyButton().textContent).toBe("已复制");
    await vi.advanceTimersByTimeAsync(COPY_FEEDBACK_MS);
    expect(copyButton().textContent).toBe("复制");
  });

  it("says the copy failed when both paths are refused", async () => {
    allowClipboard(async () => {
      throw new Error("denied");
    });
    const { anchor } = flowLink();
    hover(anchor);
    copyButton().dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
    await vi.waitFor(() => {
      expect(copyButton().textContent).toBe("复制失败");
    });
  });
});

describe("how the panel goes away", () => {
  it("closes on Escape", () => {
    const { anchor } = flowLink();
    hover(anchor);
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    expect(visible()).toBe(false);
  });

  it("stays open while the pointer crosses from the link into the panel", () => {
    const { anchor } = flowLink();
    hover(anchor);
    leave(anchor, copyButton());
    expect(visible()).toBe(true);
  });

  it("closes once the pointer leaves the panel", () => {
    const { anchor } = flowLink();
    hover(anchor);
    leave(anchor, copyButton());
    const found = panel();
    if (found === null) throw new Error("the panel went away too early");
    leave(found, document.body);
    expect(visible()).toBe(false);
  });

  it("closes when the conversation scrolls under it", () => {
    const { flow, anchor } = flowLink();
    hover(anchor);
    flow.dispatchEvent(new Event("scroll"));
    expect(visible()).toBe(false);
  });

  it("ignores the panel's own scrolling", () => {
    const { anchor } = flowLink();
    hover(anchor);
    const found = panel();
    if (found === null) throw new Error("no panel to scroll");
    found.dispatchEvent(new Event("scroll"));
    expect(visible()).toBe(true);
  });

  it("opens for a link that takes keyboard focus", () => {
    const { anchor } = flowLink();
    anchor.dispatchEvent(new FocusEvent("focusin", { bubbles: true }));
    expect(visible()).toBe(true);
  });

  it("closes when focus leaves the link and the panel", () => {
    const { anchor } = flowLink();
    anchor.dispatchEvent(new FocusEvent("focusin", { bubbles: true }));
    anchor.dispatchEvent(new FocusEvent("focusout", { bubbles: true, relatedTarget: document.body }));
    expect(visible()).toBe(false);
  });

  it("stays open while focus moves from the link into the panel", () => {
    const { anchor } = flowLink();
    anchor.dispatchEvent(new FocusEvent("focusin", { bubbles: true }));
    anchor.dispatchEvent(new FocusEvent("focusout", { bubbles: true, relatedTarget: copyButton() }));
    expect(visible()).toBe(true);
  });
});

describe("the panel as a surface", () => {
  it("never appears on a device without hover", () => {
    dispose();
    pretendTouchDevice();
    install();
    const { anchor } = flowLink();
    hover(anchor);
    expect(panel()).toBeNull();
  });

  it("announces itself as a tooltip with a named copy button", () => {
    const { anchor } = flowLink();
    hover(anchor);
    expect(panel()?.getAttribute("role")).toBe("tooltip");
    expect(copyButton().type).toBe("button");
    expect(copyButton().getAttribute("aria-label")).toBe("复制链接地址");
  });

  it("bounds the address instead of truncating it", () => {
    // A 300-character tracking url is the case this panel exists for, so the
    // sheet must wrap it and cap the width against the viewport.
    expect(LINK_HOVER_SHEET).toContain("max-width: min(480px, calc(100vw - 24px))");
    expect(LINK_HOVER_SHEET).toContain("overflow-wrap: anywhere");
    expect(LINK_HOVER_SHEET).not.toContain("text-overflow: ellipsis");
    expect(LINK_HOVER_SHEET).not.toContain("-webkit-line-clamp");
  });

  it("keeps the copy button at its own size beside the address", () => {
    const sheet = LINK_HOVER_SHEET.replace(/\/\*[\s\S]*?\*\//g, "");
    const index = sheet.indexOf(`.${LINK_HOVER_COPY_CLASS} {`);
    expect(index).toBeGreaterThan(-1);
    expect(sheet.slice(index, sheet.indexOf("}", index))).toContain("flex: none");
  });

  it("paints itself with the host's own theme tokens", () => {
    const sheet = LINK_HOVER_SHEET.replace(/\/\*[\s\S]*?\*\//g, "");
    const index = sheet.indexOf(`.${LINK_HOVER_PANEL_CLASS} {`);
    expect(index).toBeGreaterThan(-1);
    const block = sheet.slice(index, sheet.indexOf("}", index));
    expect(block).toContain("position: fixed");
    expect(block).toContain("background: var(--dsw-alias-bg-layer-2");
    expect(block).toContain("var(--dsw-alias-border-l2");
    expect(block).toContain("var(--dsw-elevation-prominent");
    expect(block).toContain("var(--dsw-alias-label-primary");
  });

  it("only references theme tokens the host actually defines", () => {
    const defined = new Set([
      "--dsw-alias-bg-layer-2",
      "--dsw-alias-border-l1",
      "--dsw-alias-border-l2",
      "--dsw-alias-interactive-bg-hover",
      "--dsw-alias-label-primary",
      "--dsw-alias-label-secondary",
      "--dsw-alias-state-business-primary",
      "--dsw-elevation-prominent",
      "--dsw-font-mono",
      "--dsw-radius-md",
      "--dsw-radius-sm",
    ]);
    const referenced = [...LINK_HOVER_SHEET.matchAll(/var\((--dsw-[a-z0-9-]+)/g)].map(match => match[1] ?? "");
    expect(referenced.filter(token => !defined.has(token))).toEqual([]);
  });

  it("drops its motion when the reader asked for less of it", () => {
    expect(LINK_HOVER_SHEET).toContain("prefers-reduced-motion: reduce");
  });

  it("inserts its sheet once, however often the plugin is re-applied", () => {
    expect(document.querySelectorAll(`#${LINK_HOVER_STYLE_ID}`)).toHaveLength(1);
    const second = installLinkHover(document, { translate });
    expect(document.querySelectorAll(`#${LINK_HOVER_STYLE_ID}`)).toHaveLength(1);
    second();
  });
});
