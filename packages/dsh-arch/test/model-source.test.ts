/**
 * The two host-side maps the reference needs: where an element is declared in
 * the `.c4` sources, and which code file it maps to.
 *
 * The source collector runs against a real booted workspace (a temp directory
 * with a three-level model) because the AST shape is the thing under test: a
 * stub would only prove the stub. The code resolver is filesystem-only and
 * needs no LikeC4 at all.
 */
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { afterAll, beforeAll, describe, expect, it } from "vitest";

import {
  collectElementSources,
  loadLanguageServices,
  resolveElementCode,
  type LikeC4Instance,
} from "../src/host/render.ts";

const CONFIG_JSON = JSON.stringify({ name: "probe", title: "probe" });

/**
 * Three levels, one anonymous `->` relation, and a second document so the walk
 * has to cross files rather than trusting one parse tree.
 */
const MODEL_C4 = `specification {
  element actor
  element system
  element container
  element component
}

model {
  actor user "User"

  system shop "Shop" {
    container api "API" {
      component orders "Orders"
      component billing "Billing"
    }
    container web "Web" {
      component pages "Pages"
    }
  }

  user -> shop.api.orders "places"
}
`;

const EXTRA_C4 = `model {
  extend shop {
    container jobs "Jobs" {
      component worker "Worker"
    }
  }
}
`;

const VIEWS_C4 = `views {
  view index {
    title "index"
    include *
  }
}
`;

/**
 * The 1-based line of a declaration, read from the source string itself.
 *
 * Hand-counting offsets in a template literal is how a test starts asserting
 * the wrong thing; the file on disk is the authority the collector reads.
 */
function lineOf(needle: string): number {
  const index = MODEL_C4.split("\n").findIndex(line => line.includes(needle));
  if (index < 0) throw new Error(`model.c4 has no line containing ${needle}`);
  return index + 1;
}

let workspace: string;
let instance: LikeC4Instance;
let knownIds: ReadonlySet<string>;

beforeAll(async () => {
  workspace = await mkdtemp(join(tmpdir(), "dsh-arch-sources-"));
  await writeFile(join(workspace, "likec4.config.json"), CONFIG_JSON, "utf8");
  await writeFile(join(workspace, "model.c4"), MODEL_C4, "utf8");
  await writeFile(join(workspace, "extra.c4"), EXTRA_C4, "utf8");
  await writeFile(join(workspace, "views.c4"), VIEWS_C4, "utf8");
  const { fromWorkspace } = await loadLanguageServices();
  instance = await fromWorkspace(workspace, { graphviz: "wasm", watch: false, printErrors: false });
  const model = await instance.layoutedModel(instance.projects()[0] as string);
  knownIds = new Set(Object.keys(model.$data.elements ?? {}));
}, 60_000);

afterAll(async () => {
  await instance?.dispose();
  await rm(workspace, { recursive: true, force: true });
});

describe("collectElementSources", () => {
  it("records the definition line of a three-level element", () => {
    const sources = collectElementSources(instance, workspace, knownIds);
    expect(sources["shop.api.orders"]).toEqual({ file: "model.c4", line: lineOf('component orders') });
    expect(sources["shop.api.billing"]).toEqual({ file: "model.c4", line: lineOf('component billing') });
    expect(sources["shop.web.pages"]).toEqual({ file: "model.c4", line: lineOf('component pages') });
  });

  it("records top-level elements and elements from a second document", () => {
    const sources = collectElementSources(instance, workspace, knownIds);
    expect(sources["user"]).toEqual({ file: "model.c4", line: lineOf('actor user') });
    expect(sources["shop"]).toEqual({ file: "model.c4", line: lineOf('system shop') });
    // The extend block lives in extra.c4, so the file has to follow the AST.
    expect(sources["shop.jobs.worker"]?.file).toBe("extra.c4");
    expect(sources["shop.jobs"]?.file).toBe("extra.c4");
  });

  it("reports every element the model knows and nothing it does not", () => {
    const sources = collectElementSources(instance, workspace, knownIds);
    expect(Object.keys(sources).sort()).toEqual([...knownIds].sort());
  });

  it("filters the anonymous AST nodes out", () => {
    // The AST carries more nodes than the model resolves (relations, spec
    // entries); the intersection is what keeps the map to selectable ids.
    const sources = collectElementSources(instance, workspace, knownIds);
    for (const id of Object.keys(sources)) expect(knownIds.has(id)).toBe(true);
    expect(Object.keys(sources).length).toBeLessThanOrEqual(knownIds.size);
  });

  it("ignores the bundled icon library", () => {
    const sources = collectElementSources(instance, workspace, knownIds);
    for (const source of Object.values(sources)) {
      expect(source.file.startsWith("likec4builtin:")).toBe(false);
      expect(source.file).not.toContain("icons.c4");
    }
  });

  it("returns nothing when the instance exposes no documents", () => {
    expect(collectElementSources({} as LikeC4Instance, workspace, knownIds)).toEqual({});
  });
});

describe("resolveElementCode", () => {
  let tree: string;

  beforeAll(async () => {
    tree = await mkdtemp(join(tmpdir(), "dsh-arch-code-"));
    await mkdir(join(tree, "packages", "demo", "src", "client"), { recursive: true });
    await writeFile(
      join(tree, "packages", "demo", "package.json"),
      JSON.stringify({ name: "@demo/widget" }),
      "utf8",
    );
    await writeFile(join(tree, "packages", "demo", "src", "client", "foo.ts"), "export {};\n", "utf8");
    await mkdir(join(tree, "packages", "demo", "src", "client", "bar"), { recursive: true });
    await writeFile(
      join(tree, "packages", "demo", "src", "client", "bar", "index.ts"),
      "export {};\n",
      "utf8",
    );
    // A package whose manifest is unreadable must not abort the walk.
    await mkdir(join(tree, "packages", "broken"), { recursive: true });
    await writeFile(join(tree, "packages", "broken", "package.json"), "{not json", "utf8");
  });

  afterAll(async () => {
    await rm(tree, { recursive: true, force: true });
  });

  it("resolves a title through an ancestor that names the package", () => {
    const code = resolveElementCode(tree, {
      "demo.widget": { title: "@demo/widget" },
      "demo.widget.foo": { title: "client/foo" },
    });
    expect(code["demo.widget.foo"]).toEqual({ file: "packages/demo/src/client/foo.ts" });
  });

  it("resolves a directory title to its index file", () => {
    const code = resolveElementCode(tree, {
      "demo.widget": { title: "@demo/widget" },
      "demo.widget.bar": { title: "client/bar" },
    });
    expect(code["demo.widget.bar"]).toEqual({ file: "packages/demo/src/client/bar/index.ts" });
  });

  it("matches the package by directory name too", () => {
    const code = resolveElementCode(tree, {
      "demo.pkg": { title: "demo" },
      "demo.pkg.foo": { title: "client/foo" },
    });
    expect(code["demo.pkg.foo"]).toEqual({ file: "packages/demo/src/client/foo.ts" });
  });

  it("skips a title that names more than one file", () => {
    const code = resolveElementCode(tree, {
      "demo.widget": { title: "@demo/widget" },
      "demo.widget.both": { title: "client/foo + client/bar" },
    });
    expect(code["demo.widget.both"]).toBeUndefined();
  });

  it("skips an element with no package ancestor", () => {
    const code = resolveElementCode(tree, { orphan: { title: "client/foo" } });
    expect(code.orphan).toBeUndefined();
  });

  it("skips a title whose file does not exist", () => {
    const code = resolveElementCode(tree, {
      "demo.widget": { title: "@demo/widget" },
      "demo.widget.missing": { title: "client/nope" },
    });
    expect(code["demo.widget.missing"]).toBeUndefined();
  });

  it("returns nothing for a workspace without packages", () => {
    expect(resolveElementCode(join(tree, "nowhere"), { a: { title: "x" } })).toEqual({});
  });
});
