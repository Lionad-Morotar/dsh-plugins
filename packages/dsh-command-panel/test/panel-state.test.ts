import { describe, expect, it } from "vitest";

import {
  back,
  clampHighlight,
  drill,
  drillArchived,
  highlightAt,
  modelFor,
  moveHighlight,
  readPrefix,
  readQuitAccept,
  reconciled,
  withQuery,
} from "../src/client/panel-state.ts";

describe("modelFor", () => {
  it("starts at the top level with no query", () => {
    expect(modelFor("switch")).toEqual({
      mode: "switch",
      level: "root",
      scope: null,
      query: "",
      highlight: 0,
      archivedOnly: false,
      confirmQuit: false,
    });
  });
});

describe("drillArchived", () => {
  it("falls back to the global archive view when no scope is passed", () => {
    const model = { ...modelFor("switch"), query: "leftover", highlight: 3 };
    expect(drillArchived(model)).toEqual({
      mode: "switch",
      level: "sessions",
      scope: { kind: "all" },
      query: "",
      highlight: 0,
      archivedOnly: true,
      confirmQuit: false,
    });
  });

  it("keeps the workspace scope drilled from that workspace's session list", () => {
    const scope = { kind: "workspace", workspaceId: "ws-one" } as const;
    const model = drill(modelFor("switch"), scope);
    const archived = drillArchived(model, scope);
    expect(archived).toEqual({
      mode: "switch",
      level: "sessions",
      scope,
      query: "",
      highlight: 0,
      archivedOnly: true,
      confirmQuit: false,
    });
    // esc 从工作区归档先回该工作区的普通列表，scope 不丢
    expect(back(archived)).toEqual({
      kind: "model",
      model: { ...archived, archivedOnly: false, query: "", highlight: 0, confirmQuit: false },
    });
  });
});

describe("back", () => {
  it("returns from the archive view to the ordinary session list first", () => {
    const archived = drillArchived(modelFor("switch"));
    expect(back(archived)).toEqual({
      kind: "model",
      model: {
        mode: "switch",
        level: "sessions",
        scope: { kind: "all" },
        query: "",
        highlight: 0,
        archivedOnly: false,
        confirmQuit: false,
      },
    });
  });
});

describe("withQuery", () => {
  it("resets the highlight to the strongest row", () => {
    const model = { ...modelFor("navigate"), highlight: 7, query: "old" };
    expect(withQuery(model, "new")).toMatchObject({ query: "new", highlight: 0 });
  });
});

describe("clampHighlight", () => {
  it("keeps the index inside an empty and a non-empty list", () => {
    expect(clampHighlight(3, 0)).toBe(0);
    expect(clampHighlight(-2, 5)).toBe(0);
    expect(clampHighlight(9, 5)).toBe(4);
    expect(clampHighlight(2, 5)).toBe(2);
  });
});

describe("moveHighlight", () => {
  const model = modelFor("command");

  it("wraps at both ends", () => {
    expect(moveHighlight({ ...model, highlight: 0 }, -1, 3).highlight).toBe(2);
    expect(moveHighlight({ ...model, highlight: 2 }, 1, 3).highlight).toBe(0);
  });

  it("stays at zero with no rows", () => {
    expect(moveHighlight(model, 1, 0).highlight).toBe(0);
  });
});

describe("reconciled", () => {
  it("pulls the highlight back when rows disappear", () => {
    expect(reconciled({ ...modelFor("navigate"), highlight: 9 }, 3).highlight).toBe(2);
  });

  it("returns the same object when nothing changes", () => {
    const model = { ...modelFor("navigate"), highlight: 1 };
    expect(reconciled(model, 3)).toBe(model);
  });
});

describe("drill and back", () => {
  it("clears the query and highlight when entering a workspace", () => {
    const model = withQuery(modelFor("switch"), "dsh");
    const next = drill(model, { kind: "workspace", workspaceId: "ws-one" });
    expect(next).toMatchObject({
      level: "sessions",
      scope: { kind: "workspace", workspaceId: "ws-one" },
      query: "",
      highlight: 0,
    });
  });

  it("goes back one level without closing", () => {
    const drilled = drill(modelFor("switch"), { kind: "all" });
    const result = back(drilled);
    expect(result.kind).toBe("model");
    if (result.kind !== "model") return;
    expect(result.model).toMatchObject({ level: "root", scope: null, query: "" });
  });

  it("closes from the top level", () => {
    expect(back(modelFor("switch")).kind).toBe("close");
    expect(back(modelFor("navigate")).kind).toBe("close");
    expect(back(modelFor("command")).kind).toBe("close");
  });
});

describe("highlightAt", () => {
  it("clamps an absolute index", () => {
    expect(highlightAt(modelFor("command"), 99, 4).highlight).toBe(3);
  });
});

describe("readPrefix", () => {
  it("reads a leading mark as a request for command mode", () => {
    expect(readPrefix(">", "navigate")).toEqual({ query: "", enterCommand: true });
    expect(readPrefix(">goal", "navigate")).toEqual({ query: "goal", enterCommand: true });
  });

  it("keeps the mark out of the filter inside command mode", () => {
    expect(readPrefix(">goal", "command")).toEqual({ query: "goal", enterCommand: false });
  });

  it("passes ordinary text through untouched", () => {
    expect(readPrefix("panel.ts", "navigate")).toEqual({ query: "panel.ts", enterCommand: false });
    expect(readPrefix("", "command")).toEqual({ query: "", enterCommand: false });
    // A mark that is not first is a literal character.
    expect(readPrefix("a>b", "navigate")).toEqual({ query: "a>b", enterCommand: false });
  });

  it("does not leave the command mode by itself", () => {
    expect(readPrefix("", "command")).toEqual({ query: "", enterCommand: false });
  });
});

describe("quit confirmation", () => {
  it("arms on the first accept and only fires on the second", () => {
    const first = readQuitAccept(modelFor("command"));
    expect(first.kind).toBe("arm");
    if (first.kind !== "arm") return;
    expect(first.model.confirmQuit).toBe(true);
    expect(readQuitAccept(first.model)).toEqual({ kind: "fire" });
  });

  it("keeps the mark while the highlight moves", () => {
    const armed = { ...modelFor("command"), confirmQuit: true };
    expect(moveHighlight(armed, 1, 3).confirmQuit).toBe(true);
    expect(highlightAt(armed, 0, 3).confirmQuit).toBe(true);
    expect(reconciled(armed, 3).confirmQuit).toBe(true);
  });

  it("disarms when the query changes, on back, and on a fresh open", () => {
    const armed = { ...modelFor("command"), confirmQuit: true };
    expect(withQuery(armed, "q").confirmQuit).toBe(false);
    const drilled = drill({ ...modelFor("switch"), confirmQuit: true }, { kind: "all" });
    const result = back(drilled);
    expect(result.kind).toBe("model");
    if (result.kind !== "model") return;
    expect(result.model.confirmQuit).toBe(false);
    expect(modelFor("command").confirmQuit).toBe(false);
  });
});
