import { describe, expect, it } from "vitest";

import {
  back,
  clampHighlight,
  drill,
  highlightAt,
  modelFor,
  moveHighlight,
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
