/**
 * The chat-prose commit link, tested at its two pure seams.
 *
 * A span is a commit reference only when it is a standalone inline code of
 * 7-40 hex digits, and a query answer is a jump only when exactly one returned
 * commit hash starts with that text. The click wiring is observed through the
 * document it decorates, the same way the stylesheet tests its own tag.
 */
import { JSDOM } from "jsdom";
import { describe, expect, it, vi } from "vitest";

import {
  decorateCommitRef,
  gitViewPresent,
  installCommitLinks,
  uniqueCommitHit,
  type CommitLinkHost,
} from "../src/client/commit-ref.ts";
import { STYLE_ATTR, STYLE_TAG, insertPanelStyles } from "../src/client/styles.ts";
import type { GitCommitSummary, SlotEntry } from "../src/client/dsh.ts";

const FULL = "9393130e5f1ad2c61b8e04ff9cf01a53d1c7b6e2";

function commit(hash: string): GitCommitSummary {
  return { hash, author: "Lionad", time: 4_000, subject: "x" };
}

describe("decorateCommitRef", () => {
  it("treats a standalone 7 to 40 digit inline code as a commit reference", () => {
    expect(decorateCommitRef({ tag: "CODE", text: FULL.slice(0, 7), insidePre: false, streaming: false })).toBe(
      true,
    );
    expect(decorateCommitRef({ tag: "CODE", text: FULL, insidePre: false, streaming: false })).toBe(true);
    expect(decorateCommitRef({ tag: "CODE", text: "AbC1234", insidePre: false, streaming: false })).toBe(true);
  });

  it("refuses six digits, mixed text, a fenced block and bare prose", () => {
    expect(decorateCommitRef({ tag: "CODE", text: FULL.slice(0, 6), insidePre: false, streaming: false })).toBe(
      false,
    );
    expect(decorateCommitRef({ tag: "CODE", text: "9393130.", insidePre: false, streaming: false })).toBe(false);
    expect(decorateCommitRef({ tag: "CODE", text: ` ${FULL.slice(0, 7)}`, insidePre: false, streaming: false })).toBe(
      false,
    );
    expect(decorateCommitRef({ tag: "CODE", text: FULL, insidePre: true, streaming: false })).toBe(false);
    expect(decorateCommitRef({ tag: "SPAN", text: FULL, insidePre: false, streaming: false })).toBe(false);
  });

  it("leaves a message that is still streaming undecorated", () => {
    expect(decorateCommitRef({ tag: "CODE", text: FULL.slice(0, 7), insidePre: false, streaming: true })).toBe(
      false,
    );
  });
});

describe("uniqueCommitHit", () => {
  it("is not a jump when the answer is empty or names several prefixes", () => {
    expect(uniqueCommitHit(FULL.slice(0, 7), [])).toBeUndefined();
    expect(
      uniqueCommitHit(FULL.slice(0, 7), [commit(FULL), commit(`${FULL.slice(0, 7)}fffffffffffffffffffffffff`)]),
    ).toBeUndefined();
  });

  it("names the full hash when exactly one commit starts with the text", () => {
    expect(uniqueCommitHit("9393130", [commit("zzz"), commit(FULL)])).toBe(FULL);
    expect(uniqueCommitHit(FULL.toUpperCase(), [commit(FULL)])).toBe(FULL);
  });

  it("does not treat a hash that merely contains the text as a hit", () => {
    expect(uniqueCommitHit(FULL.slice(0, 7), [commit(`ffff${FULL.slice(0, 7)}`)] )).toBeUndefined();
  });
});

describe("gitViewPresent", () => {
  it("reads the conversation view roster and nothing else", () => {
    const row = (id: string): SlotEntry => ({ options: { id, name: "conversation.view" } });
    expect(gitViewPresent([row("fs-explorer"), row("git-explorer")])).toBe(true);
    expect(gitViewPresent([row("fs-explorer")])).toBe(false);
    expect(gitViewPresent(undefined)).toBe(false);
  });
});

/** A clickable code span inside one message, fenced or streaming on request. */
function prose(doc: Document, options: { readonly fenced?: boolean; readonly streaming?: boolean } = {}): HTMLElement {
  const message = doc.createElement("div");
  if (options.streaming === true) message.setAttribute("data-streaming", "");
  const holder = options.fenced === true ? doc.createElement("pre") : message;
  if (options.fenced === true) message.append(holder);
  const code = doc.createElement("code");
  code.textContent = FULL.slice(0, 7);
  holder.append(code);
  doc.body.append(message);
  return code;
}

function host(overrides: Partial<CommitLinkHost> = {}): CommitLinkHost {
  return {
    sessionId: () => "sess-1",
    query: vi.fn(async () => ({ ok: true as const, commits: [commit(FULL)] })),
    open: vi.fn(),
    gitViewPresent: () => true,
    ...overrides,
  };
}

describe("installCommitLinks", () => {
  it("dots a unique hit, opens that full hash, and never opens the command panel", async () => {
    const { window } = new JSDOM("<!doctype html><html><head></head><body></body></html>");
    const doc = window.document;
    const code = prose(doc);
    const face = host();
    const stop = installCommitLinks(doc, face);

    code.dispatchEvent(new window.MouseEvent("mouseover", { bubbles: true }));
    await vi.waitFor(() => expect(code.getAttribute("data-dcp-commit")).toBe(""));

    code.dispatchEvent(new window.MouseEvent("click", { bubbles: true, cancelable: true }));
    await vi.waitFor(() => expect(face.open).toHaveBeenCalledWith(FULL));
    expect(face.query).toHaveBeenCalledWith("sess-1", FULL.slice(0, 7));
    stop();
  });

  it("adds no clickable style inside a fence, on a short code or while streaming", () => {
    const { window } = new JSDOM("<!doctype html><html><body></body></html>");
    const doc = window.document;
    const fenced = prose(doc, { fenced: true });
    const streaming = prose(doc, { streaming: true });
    const short = doc.createElement("code");
    short.textContent = FULL.slice(0, 6);
    doc.body.append(short);
    installCommitLinks(doc, host());

    for (const code of [fenced, streaming, short]) {
      code.dispatchEvent(new window.MouseEvent("mouseover", { bubbles: true }));
      expect(code.hasAttribute("data-dcp-commit")).toBe(false);
    }
  });

  it("adds no clickable style when the git view is absent", () => {
    const { window } = new JSDOM("<!doctype html><html><body></body></html>");
    const doc = window.document;
    const code = prose(doc);
    installCommitLinks(doc, host({ gitViewPresent: () => false }));

    code.dispatchEvent(new window.MouseEvent("mouseover", { bubbles: true }));
    expect(code.hasAttribute("data-dcp-commit")).toBe(false);
  });

  it("adds no clickable style and opens nothing when the query is empty, ambiguous or refused", async () => {
    const answers: Array<CommitLinkHost["query"]> = [
      async () => ({ ok: true, commits: [] }),
      async () => ({
        ok: true,
        commits: [commit(FULL), commit(`${FULL.slice(0, 7)}fffffffffffffffffffffffff`)],
      }),
      async () => ({ ok: false }),
      async () => {
        throw new Error("transport");
      },
    ];
    for (const query of answers) {
      const { window } = new JSDOM("<!doctype html><html><body></body></html>");
      const doc = window.document;
      const code = prose(doc);
      const face = host({ query });
      installCommitLinks(doc, face);

      code.dispatchEvent(new window.MouseEvent("mouseover", { bubbles: true }));
      expect(code.hasAttribute("data-dcp-commit")).toBe(false);
      code.dispatchEvent(new window.MouseEvent("click", { bubbles: true, cancelable: true }));
      await Promise.resolve();
      expect(face.open).not.toHaveBeenCalled();
    }
  });

  it("styles the mark as a dotted underline in the primary colour, with no background", () => {
    const { window } = new JSDOM("<!doctype html><html><head></head><body></body></html>");
    insertPanelStyles(window.document);
    const css = window.document.querySelector(`style[${STYLE_ATTR}="${STYLE_TAG}"]`)?.textContent ?? "";
    expect(css).toContain("[data-dcp-commit]");
    expect(css).toContain("text-decoration-style: dotted");
    expect(css).toContain("cursor: pointer");
    expect(css).toContain("--dsw-alias-state-business-primary");
    expect(css).not.toMatch(/\[data-dcp-commit\][^{]*\{[^}]*background/);
  });
});
