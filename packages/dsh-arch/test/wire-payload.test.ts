/**
 * Wire payload shaping over the real project dump.
 *
 * The fixture is `likec4 export json` output for this repository's 15 views;
 * pinning counts against it guards the "no view lost, no node lost" contract
 * the client renderer will rely on in S2/S3.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { toModelPayload, toViewsPayload } from "../src/host/render.ts";

interface DumpView {
  id: string;
  title: string | null;
  nodes: Array<{ id: string }>;
  edges: Array<{ id: string }>;
}

const dump = JSON.parse(
  readFileSync(join(import.meta.dirname, "fixtures", "fixture-dump.json"), "utf8"),
) as {
  projectId: string;
  elements: Record<string, unknown>;
  relations: Record<string, unknown>;
  specification: unknown;
  views: Record<string, DumpView>;
};

const dumpViews = Object.values(dump.views);

describe("toViewsPayload", () => {
  const payload = toViewsPayload({
    workspace: "/w/dsh-plugins",
    projectId: dump.projectId,
    views: dumpViews,
    hasErrors: false,
    errors: [],
  });

  it("returns every view from the dump", () => {
    expect(payload.views).toHaveLength(dumpViews.length);
    expect(payload.views.map(view => (view as DumpView).id).sort()).toEqual(
      dumpViews.map(view => view.id).sort(),
    );
  });

  it("keeps each view's nodes and edges untouched", () => {
    const byId = new Map(payload.views.map(view => [(view as DumpView).id, view as DumpView]));
    for (const source of dumpViews) {
      const wire = byId.get(source.id);
      expect(wire).toBeDefined();
      expect(wire?.nodes).toHaveLength(source.nodes.length);
      expect(wire?.edges).toHaveLength(source.edges.length);
    }
  });

  it("carries the workspace identity and diagnostics envelope", () => {
    expect(payload.workspace).toBe("/w/dsh-plugins");
    expect(payload.projectId).toBe(dump.projectId);
    expect(payload.hasErrors).toBe(false);
    expect(payload.errors).toEqual([]);
  });

  it("maps parse diagnostics onto the wire shape", () => {
    const withErrors = toViewsPayload({
      workspace: "/w",
      projectId: "p",
      views: [],
      hasErrors: true,
      errors: [{ message: "boom", sourcePath: "/w/model.c4" }],
    });
    expect(withErrors.hasErrors).toBe(true);
    expect(withErrors.errors).toEqual([{ message: "boom", sourcePath: "/w/model.c4" }]);
  });
});

describe("toModelPayload", () => {
  const payload = toModelPayload({
    workspace: "/w/dsh-plugins",
    projectId: dump.projectId,
    model: dump,
  });

  it("exposes the element catalogue by id", () => {
    expect(Object.keys(payload.elements)).toHaveLength(Object.keys(dump.elements).length);
    expect(payload.elements.user).toEqual(dump.elements.user);
  });

  it("exposes relations and the specification verbatim", () => {
    expect(Object.keys(payload.relations)).toHaveLength(Object.keys(dump.relations).length);
    expect(payload.specification).toEqual(dump.specification);
  });

  it("omits both location maps when the caller did not read them", () => {
    // Absent is a different answer from empty: a host that cannot walk the AST
    // must not look like a model whose elements have no definition.
    expect(payload.elementSources).toBeUndefined();
    expect(payload.elementCode).toBeUndefined();
  });

  it("passes both location maps through when they were read", () => {
    const withMaps = toModelPayload({
      workspace: "/w/dsh-plugins",
      projectId: dump.projectId,
      model: dump,
      elementSources: { user: { file: ".planning/c4/dsh-plugins.c4", line: 12 } },
      elementCode: { user: { file: "packages/dsh-jump/src/client/app.ts" } },
    });
    expect(withMaps.elementSources).toEqual({ user: { file: ".planning/c4/dsh-plugins.c4", line: 12 } });
    expect(withMaps.elementCode).toEqual({ user: { file: "packages/dsh-jump/src/client/app.ts" } });
    // The pre-existing fields are untouched by the addition.
    expect(Object.keys(withMaps.elements)).toHaveLength(Object.keys(dump.elements).length);
    expect(withMaps.specification).toEqual(dump.specification);
  });
});
