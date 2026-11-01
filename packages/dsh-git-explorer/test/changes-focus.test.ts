// @vitest-environment jsdom
/**
 * Entering the Git view parks keyboard focus on the first changed file. The
 * panes are the only place this can be decided, so the decision itself is
 * lifted out of the effect and exercised against a real document here.
 */
import { describe, expect, it } from "vitest";

import { focusFirstChangeRow } from "../src/client/changes-pane.tsx";

interface Row {
  readonly path: string;
  readonly directory?: boolean;
}

/** Build the group headers and file rows the pane renders, in the same order. */
function renderPane(groups: readonly (readonly Row[])[]): HTMLElement {
  const pane = document.createElement("section");
  pane.className = "gx-pane";
  pane.dataset.testid = "git-changes";
  for (const group of groups) {
    const host = document.createElement("div");
    const head = document.createElement("div");
    head.className = "gx-group-head";
    host.append(head);
    pane.append(host);
    for (const row of group) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "gx-file";
      button.dataset.directory = row.directory === true ? "true" : "false";
      button.dataset.testid = "git-change-file";
      button.textContent = row.path;
      host.append(button);
    }
  }
  document.body.append(pane);
  return pane;
}

describe("focusFirstChangeRow", () => {
  it("lands on the first file row across groups, skipping directory rows", () => {
    const pane = renderPane([
      [{ path: "src/old", directory: true }],
      [{ path: "src/new", directory: true }, { path: "src/a.ts" }, { path: "src/b.ts" }],
    ]);
    focusFirstChangeRow(pane);
    expect(document.activeElement?.textContent).toBe("src/a.ts");
    pane.remove();
  });

  it("leaves focus alone once the reader is already inside the pane", () => {
    const pane = renderPane([[{ path: "src/a.ts" }, { path: "src/b.ts" }]]);
    const chosen = pane.querySelectorAll("button")[1];
    if (!(chosen instanceof HTMLElement)) throw new Error("second row missing");
    chosen.focus();
    focusFirstChangeRow(pane);
    expect(document.activeElement).toBe(chosen);
    pane.remove();
  });

  it("does nothing rather than parking focus on a pane with no file row", () => {
    // Start from a document with no focus of its own, so "unchanged" is a
    // property of the call and not of whatever the previous case left behind.
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
    const empty = renderPane([]);
    const directoriesOnly = renderPane([[{ path: "src/a.ts", directory: true }]]);
    focusFirstChangeRow(empty);
    focusFirstChangeRow(directoriesOnly);
    expect(document.activeElement).toBe(document.body);
    empty.remove();
    directoriesOnly.remove();
  });

  it("tolerates a pane that has not rendered yet", () => {
    expect(() => {
      focusFirstChangeRow(null);
    }).not.toThrow();
  });
});
