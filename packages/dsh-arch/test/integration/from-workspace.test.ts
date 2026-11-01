/**
 * End-to-end host rendering: fromWorkspace over a real temp workspace.
 *
 * This is the automated form of the research handover step 1 — "prove
 * `@likec4/language-services` installs and lays out in your environment" —
 * plus the multi-project trap: `diagrams()` without a project id throws when a
 * directory holds several configs, so the renderer must always resolve
 * `projects()` first and pass an explicit id.
 */
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { renderWorkspace } from "../../src/host/render.ts";

const MODEL_C4 = `
specification {
  element actor
  element system
}

model {
  actor user "User"
  system sys "System"
  user -> sys "uses"
}

views {
  view index {
    title "index"
    include *
  }
}
`;

const CONFIG_JSON = JSON.stringify({ name: "probe", title: "probe" });

let workspace: string;

beforeAll(async () => {
  workspace = await mkdtemp(join(tmpdir(), "dsh-arch-integration-"));
  await writeFile(join(workspace, "likec4.config.json"), CONFIG_JSON, "utf8");
  await writeFile(join(workspace, "model.c4"), MODEL_C4, "utf8");
});

afterAll(async () => {
  await rm(workspace, { recursive: true, force: true });
});

describe("renderWorkspace", () => {
  it("lays out one view from a minimal on-disk workspace", { timeout: 60_000 }, async () => {
    const rendered = await renderWorkspace(workspace);
    expect(rendered.projectId).toBe("probe");
    expect(rendered.views).toHaveLength(1);
    const view = rendered.views[0] as { id: string; nodes: unknown[]; edges: unknown[] };
    expect(view.id).toBe("index");
    expect(view.nodes).toHaveLength(2);
    expect(view.edges).toHaveLength(1);
    expect(rendered.hasErrors).toBe(false);
  });
});
