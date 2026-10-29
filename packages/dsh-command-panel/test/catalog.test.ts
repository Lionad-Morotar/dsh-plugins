import { describe, expect, it } from "vitest";

import { CATALOG, availableCatalog, type ActionContext } from "../src/client/catalog.ts";
import { copyFor } from "../src/client/copy.ts";

/** Availability is a pure solve, so every state is one literal away. */
const idle: ActionContext = {
  hasSession: true,
  sessionRunning: false,
  hasCwd: true,
  sessionSurface: true,
};

const noSession: ActionContext = {
  hasSession: false,
  sessionRunning: false,
  hasCwd: false,
  sessionSurface: false,
};

const options = { seatSurfaces: true, hostCommands: new Set(["rename"]) };

function ids(context: ActionContext, overrides: Partial<typeof options> = {}): readonly string[] {
  return availableCatalog(context, { ...options, ...overrides }).map(entry => entry.id);
}

describe("availableCatalog", () => {
  it("keeps only the session-free rows when nothing is on screen", () => {
    expect(ids(noSession)).toEqual([
      "panel.navigate",
      "panel.commands",
      "panel.switch",
      "session.newInWorkspace",
      "navigate.plugins",
      "navigate.settings",
      "navigate.shortcuts",
      "view.sidebar",
      "view.theme",
    ]);
  });

  it("adds the session lifecycle rows once a session is on screen", () => {
    const listed = ids(idle);
    expect(listed).toContain("session.newUngrouped");
    expect(listed).toContain("session.rename");
    expect(listed).toContain("session.archive");
    expect(listed).toContain("session.fork");
    expect(listed).toContain("session.pin");
    expect(listed).not.toContain("session.cancel");
  });

  it("offers interrupt only while the session is producing output", () => {
    expect(ids({ ...idle, sessionRunning: true })).toContain("session.cancel");
  });

  it("hides ungrouped creation when the session has no directory", () => {
    expect(ids({ ...idle, hasCwd: false })).not.toContain("session.newUngrouped");
  });

  it("hides the right-column rows when no session surface is mounted", () => {
    const listed = ids({ ...idle, sessionSurface: false });
    expect(listed).not.toContain("view.files");
    expect(listed).not.toContain("view.terminal");
    expect(listed).not.toContain("view.browser");
  });

  it("drops the seat-backed rows when the switch is off", () => {
    const listed = ids(idle, { seatSurfaces: false });
    expect(listed).not.toContain("navigate.settings");
    expect(listed).not.toContain("navigate.shortcuts");
    // The rest of the catalogue is unaffected.
    expect(listed).toContain("navigate.plugins");
  });

  it("lists rename only when the host actually offers the command", () => {
    expect(ids(idle, { hostCommands: new Set() })).not.toContain("session.rename");
    expect(ids(idle, { hostCommands: undefined })).not.toContain("session.rename");
  });

  it("keeps the editorial order: panel, session, navigation, view", () => {
    const listed = ids({ ...idle, sessionRunning: true });
    const categoryOf = new Map(CATALOG.map(entry => [entry.id, entry.category]));
    const order = [...new Set(listed.map(id => categoryOf.get(id)))];
    expect(order).toEqual(["panel", "session", "navigate", "view"]);
  });
});

describe("catalogue copy", () => {
  const copy = copyFor("zh");

  it("has a label for every entry in both languages", () => {
    for (const active of ["zh", "en"]) {
      const table = copyFor(active);
      for (const entry of CATALOG) {
        expect(table.actionLabels[entry.id], `${active}:${entry.id}`).toBeTypeOf("string");
      }
    }
  });

  it("has no orphan labels the table does not use", () => {
    const ids = new Set(CATALOG.map(entry => entry.id));
    expect(Object.keys(copy.actionLabels).filter(id => !ids.has(id))).toEqual([]);
  });

  it("names every category", () => {
    expect(Object.values(copy.categoryNames)).toEqual(["面板", "会话", "导航", "视图"]);
  });
});
