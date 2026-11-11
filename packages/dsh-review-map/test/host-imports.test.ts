/**
 * Import extraction and the three-state edge set, over real repositories.
 *
 * The fixture repositories are the point: an edge is a claim about two files
 * that exist, so a test that stubs the file set proves only that the resolver
 * agrees with the stub. Each case here writes actual source, commits it, edits
 * it, and then asks what the two sides' edge sets are.
 *
 * The cases that matter most are the ones about *not* drawing an edge: an
 * external package, a dynamic import, a reference to a file that is not there.
 * A missing edge is invisible, so it is the failure a reader would never catch
 * by looking at the map.
 */
import { rm } from "node:fs/promises";
import { describe, expect, it, afterEach } from "vitest";

import { collectIndex, DEFAULT_INDEX_LIMITS, type IndexLimits } from "../src/host/structure.ts";
import { createResolver, extractImports, parseTsconfig, diffEdges } from "../src/host/imports.ts";
import { createRepoWithCommit, realRunner, type RepoHandle } from "./fixtures/repo.ts";

let repo: RepoHandle | undefined;

afterEach(async () => {
  await repo?.dispose();
  repo = undefined;
});

/** The index for a worktree review, failing the test when it did not build. */
async function worktreeIndex(handle: RepoHandle, limits?: Partial<IndexLimits>) {
  const { runner } = realRunner(handle.root);
  const result = await collectIndex({ runner, cwd: handle.root }, { kind: "worktree" }, {
    ...DEFAULT_INDEX_LIMITS,
    ...limits,
  });
  expect(result.ok).toBe(true);
  if (!result.ok) throw new Error(`index failed: ${result.error.code}`);
  return result.index;
}

/** One edge as a comparable string. */
function edge(entry: { from: string; to: string; state: string }): string {
  return `${entry.from} -> ${entry.to} (${entry.state})`;
}

describe("extracting imports from one file", () => {
  it("reads static imports, re-exports and CommonJS requires", () => {
    const extracted = extractImports(`
      import a from "./a";
      import { b } from "../lib/b";
      import type { T } from "./types";
      export * from "./re";
      const c = require("./c");
      import "./side-effect";
    `);

    expect(extracted.specifiers).toEqual(["./a", "../lib/b", "./types", "./re", "./c", "./side-effect"]);
    expect(extracted.dynamic).toBe(0);
  });

  it("counts a non-literal dynamic import instead of dropping it", () => {
    // `preProcessFile` skips these silently, which is why they are counted
    // separately: an import nobody can resolve is still an import.
    const extracted = extractImports("import(name);\nimport(`./x-${y}`);\nconst m = require(target);");

    expect(extracted.specifiers).toEqual([]);
    expect(extracted.dynamic).toBe(3);
  });

  it("does not count a call inside a comment or a string", () => {
    const extracted = extractImports("// import(name)\nconst s = 'import(name)';\nconst t = `require(x)`;");

    expect(extracted.dynamic).toBe(0);
  });

  it("does not treat a member call as a module import", () => {
    expect(extractImports("obj.require(name);").dynamic).toBe(0);
  });

  it("reads a literal template specifier as a real import", () => {
    const extracted = extractImports("import(`./plain`);");

    expect(extracted.specifiers).toEqual(["./plain"]);
  });
});

describe("resolving a specifier to a file", () => {
  const files = new Set(["src/a.ts", "src/b.tsx", "src/c.js", "src/d/index.ts", "lib/e.ts"]);

  it("resolves a relative import, adding the extension", () => {
    const resolve = createResolver(files, null);

    expect(resolve("src/a.ts", "./b")).toBe("src/b.tsx");
    expect(resolve("src/a.ts", "./c")).toBe("src/c.js");
    expect(resolve("src/a.ts", "./d")).toBe("src/d/index.ts");
    expect(resolve("src/a.ts", "../lib/e")).toBe("lib/e.ts");
  });

  it("resolves the emitted extension back to the source file", () => {
    const resolve = createResolver(files, null);

    // TypeScript source names its target with the runtime extension.
    expect(resolve("src/a.ts", "./b.js")).toBe("src/b.tsx");
  });

  it("refuses an external package rather than probing for a local file", () => {
    const resolve = createResolver(new Set(["react.ts"]), null);

    expect(resolve("src/a.ts", "react")).toBeNull();
  });

  it("resolves a tsconfig path alias", () => {
    const parsed = parseTsconfig(
      JSON.stringify({ compilerOptions: { baseUrl: ".", paths: { "@/*": ["src/*"], "~lib": ["lib/e.ts"] } } }),
      "tsconfig.json",
    );
    const resolve = createResolver(files, parsed.paths);

    expect(resolve("src/a.ts", "@/b")).toBe("src/b.tsx");
    expect(resolve("src/a.ts", "~lib")).toBe("lib/e.ts");
    expect(resolve("src/a.ts", "@/d")).toBe("src/d/index.ts");
  });

  it("reads a tsconfig with comments and trailing commas", () => {
    // Real tsconfigs are JSONC; a strict parse would silently disable aliases
    // in exactly the repositories that use them.
    const parsed = parseTsconfig(
      `{
        // the alias
        "compilerOptions": { "paths": { "@/*": ["src/*"], }, },
      }`,
      "tsconfig.json",
    );

    expect(parsed.paths?.aliases).toEqual([{ pattern: "@/*", targets: ["src/*"] }]);
  });

  it("does not resolve an alias when the workspace declares none", () => {
    const resolve = createResolver(files, null);

    expect(resolve("src/a.ts", "@/b")).toBeNull();
  });
});

describe("the three-state edge set", () => {
  it("marks an edge added, removed or kept", () => {
    const oldEdges = new Map([
      ["a.ts", new Set(["b.ts", "c.ts"])],
      ["x.ts", new Set(["a.ts"])],
    ]);
    const newEdges = new Map([
      ["a.ts", new Set(["b.ts", "d.ts"])],
      ["x.ts", new Set(["a.ts"])],
    ]);

    const diff = diffEdges(newEdges, oldEdges, new Set(["a.ts"]));

    expect(diff.edges.map(edge)).toEqual([
      "a.ts -> b.ts (kept)",
      "a.ts -> c.ts (removed)",
      "a.ts -> d.ts (added)",
      "x.ts -> a.ts (kept)",
    ]);
    // The counts are scoped to the changed files: `x.ts` did not change, so its
    // kept edge is not a headline number.
    expect(diff.newImports).toBe(1);
    expect(diff.droppedImports).toBe(1);
  });

  it("counts an added file's imports as new", () => {
    const diff = diffEdges(new Map([["new.ts", new Set(["a.ts"])]]), new Map(), new Set(["new.ts"]));

    expect(diff.newImports).toBe(1);
    expect(diff.droppedImports).toBe(0);
  });
});

describe("the index over a real repository", () => {
  it("draws an edge between two files that import each other's targets", async () => {
    repo = await createRepoWithCommit({
      "src/a.ts": "import b from './b';\nexport default b;\n",
      "src/b.ts": "export default 1;\n",
    });

    const index = await worktreeIndex(repo);

    expect(index.edges.map(edge)).toEqual(["src/a.ts -> src/b.ts (kept)"]);
    expect(index.unresolved.count).toBe(0);
  });

  it("resolves a tsconfig path alias", async () => {
    repo = await createRepoWithCommit({
      "tsconfig.json": JSON.stringify({ compilerOptions: { baseUrl: ".", paths: { "@/*": ["src/*"] } } }),
      "src/a.ts": "import b from '@/b';\nexport default b;\n",
      "src/b.ts": "export default 1;\n",
    });

    const index = await worktreeIndex(repo);

    expect(index.edges.map(edge)).toContain("src/a.ts -> src/b.ts (kept)");
    expect(index.unresolved.count).toBe(0);
  });

  it("follows a tsconfig that extends a base config", async () => {
    repo = await createRepoWithCommit({
      "tsconfig.base.json": JSON.stringify({ compilerOptions: { baseUrl: ".", paths: { "@/*": ["src/*"] } } }),
      "tsconfig.json": JSON.stringify({ extends: "./tsconfig.base.json" }),
      "src/a.ts": "import b from '@/b';\nexport default b;\n",
      "src/b.ts": "export default 1;\n",
    });

    const index = await worktreeIndex(repo);

    expect(index.edges.map(edge)).toContain("src/a.ts -> src/b.ts (kept)");
  });

  it("marks a new import as added and counts it", async () => {
    repo = await createRepoWithCommit({
      "src/a.ts": "export default 1;\n",
      "src/b.ts": "export default 2;\n",
    });
    await repo.write("src/a.ts", "import b from './b';\nexport default b;\n");

    const index = await worktreeIndex(repo);

    expect(index.edges.map(edge)).toEqual(["src/a.ts -> src/b.ts (added)"]);
    expect(index.imports.newImports).toBe(1);
    expect(index.imports.droppedImports).toBe(0);
  });

  it("marks a dropped import as removed and counts it", async () => {
    repo = await createRepoWithCommit({
      "src/a.ts": "import b from './b';\nexport default b;\n",
      "src/b.ts": "export default 2;\n",
    });
    await repo.write("src/a.ts", "export default 1;\n");

    const index = await worktreeIndex(repo);

    expect(index.edges.map(edge)).toEqual(["src/a.ts -> src/b.ts (removed)"]);
    expect(index.imports.droppedImports).toBe(1);
    expect(index.imports.newImports).toBe(0);
  });

  it("keeps an edge that survived the edit", async () => {
    repo = await createRepoWithCommit({
      "src/a.ts": "import b from './b';\nexport default b;\n",
      "src/b.ts": "export default 2;\n",
    });
    await repo.write("src/a.ts", "import b from './b';\nexport const x = 1;\nexport default b;\n");

    const index = await worktreeIndex(repo);

    expect(index.edges.map(edge)).toEqual(["src/a.ts -> src/b.ts (kept)"]);
    expect(index.imports.newImports).toBe(0);
    expect(index.imports.droppedImports).toBe(0);
  });

  it("shows the reverse direction: an unchanged file importing a changed one", async () => {
    repo = await createRepoWithCommit({
      "src/consumer.ts": "import target from './target';\nexport default target;\n",
      "src/target.ts": "export default 1;\n",
    });
    await repo.write("src/target.ts", "export default 2;\n");

    const index = await worktreeIndex(repo);

    // The edge is kept, and its `from` is the file nobody changed: that is the
    // "imported by" direction, and resolving against only the change set would
    // lose it.
    expect(index.edges.map(edge)).toEqual(["src/consumer.ts -> src/target.ts (kept)"]);
  });

  it("counts an external package as unresolved and draws no edge to it", async () => {
    repo = await createRepoWithCommit({
      "src/a.ts": "import react from 'react';\nimport b from './b';\nexport default b;\n",
      "src/b.ts": "export default 1;\n",
    });

    const index = await worktreeIndex(repo);

    expect(index.edges.map(edge)).toEqual(["src/a.ts -> src/b.ts (kept)"]);
    expect(index.unresolved.count).toBe(1);
    expect(index.unresolved.files).toEqual(["src/a.ts"]);
  });

  it("counts a dynamic import as unresolved", async () => {
    repo = await createRepoWithCommit({ "src/a.ts": "export const load = name => import(name);\n" });

    const index = await worktreeIndex(repo);

    expect(index.edges).toEqual([]);
    expect(index.unresolved.count).toBe(1);
    expect(index.unresolved.files).toEqual(["src/a.ts"]);
  });

  it("counts a reference to a file that is not there as unresolved", async () => {
    repo = await createRepoWithCommit({ "src/a.ts": "import gone from './gone';\nexport default gone;\n" });

    const index = await worktreeIndex(repo);

    expect(index.edges).toEqual([]);
    expect(index.unresolved.count).toBe(1);
  });

  it("counts a deleted file's outgoing imports as removed", async () => {
    repo = await createRepoWithCommit({
      "src/gone.ts": "import b from './b';\nexport default b;\n",
      "src/b.ts": "export default 1;\n",
    });
    await rm(`${repo.root}/src/gone.ts`);

    const index = await worktreeIndex(repo);

    expect(index.edges.map(edge)).toEqual(["src/gone.ts -> src/b.ts (removed)"]);
    expect(index.imports.droppedImports).toBe(1);
  });

  it("counts the inbound edges of a deleted file as removed", async () => {
    repo = await createRepoWithCommit({
      "src/consumer.ts": "import gone from './gone';\nexport default gone;\n",
      "src/gone.ts": "export default 1;\n",
    });
    await rm(`${repo.root}/src/gone.ts`);

    const index = await worktreeIndex(repo);

    // The file that pointed at it still exists and still points at it, but the
    // target is gone, so the edge is not resolvable any more.
    expect(index.edges.map(edge)).toEqual(["src/consumer.ts -> src/gone.ts (removed)"]);
    expect(index.imports.droppedImports).toBe(1);
  });

  it("does not draw edges for a non-script file", async () => {
    repo = await createRepoWithCommit({
      "docs/readme.md": "import x from './a'\n",
      "src/a.ts": "export default 1;\n",
    });

    const index = await worktreeIndex(repo);

    expect(index.edges).toEqual([]);
    // The file is still in the structure: it takes part in the map, just not in
    // the dependency graph.
    expect(index.files.map(file => file.path)).toContain("docs/readme.md");
  });

  it("survives a cycle without recursing", async () => {
    repo = await createRepoWithCommit({
      "src/a.ts": "import b from './b';\nexport default b;\n",
      "src/b.ts": "import c from './c';\nexport default c;\n",
      "src/c.ts": "import a from './a';\nexport default a;\n",
    });

    const startedAt = Date.now();
    const index = await worktreeIndex(repo);
    const elapsed = Date.now() - startedAt;

    expect(index.edges.map(edge)).toEqual([
      "src/a.ts -> src/b.ts (kept)",
      "src/b.ts -> src/c.ts (kept)",
      "src/c.ts -> src/a.ts (kept)",
    ]);
    // Extraction is linear per file, so a cycle costs the same as a chain. The
    // bound is generous on purpose: it is there to catch a recursive walk, not
    // to measure the machine.
    expect(elapsed).toBeLessThan(3_000);
  });

  it("reports the parsed count and completeness", async () => {
    repo = await createRepoWithCommit({
      "src/a.ts": "export default 1;\n",
      "src/b.ts": "export default 2;\n",
      "docs/x.md": "text\n",
    });

    const index = await worktreeIndex(repo);

    expect(index.indexed.files).toBe(3);
    expect(index.indexed.parsed).toBe(2);
    expect(index.indexed.complete).toBe(true);
    expect(index.indexed.note).toBeNull();
  });

  it("reports an incomplete index with the reason when the budget runs out", async () => {
    repo = await createRepoWithCommit({
      "src/a.ts": "import b from './b';\n",
      "src/b.ts": "export default 1;\n",
    });

    const index = await worktreeIndex(repo, { timeBudgetMs: 0 });

    expect(index.indexed.complete).toBe(false);
    expect(index.indexed.note).toBe("time budget 0ms");
    expect(index.indexed.parsed).toBe(0);
    // No edges were found because nothing was parsed, and the incomplete flag is
    // what keeps a client from rendering that as "no dependencies".
    expect(index.edges).toEqual([]);
  });

  it("carries a snapshot id that changes with the scope", async () => {
    repo = await createRepoWithCommit({ "src/a.ts": "export default 1;\n" });
    repo.git(["checkout", "-q", "-b", "feature"]);
    await repo.write("src/b.ts", "export default 2;\n");
    repo.git(["add", "-A"]);
    repo.git(["commit", "-qm", "feature"]);
    const { runner } = realRunner(repo.root);

    const worktree = await collectIndex({ runner, cwd: repo.root }, { kind: "worktree" });
    const branch = await collectIndex({ runner, cwd: repo.root }, { kind: "branch", baseRef: "main" });

    expect(worktree.ok && branch.ok).toBe(true);
    if (!worktree.ok || !branch.ok) return;
    expect(worktree.index.snapshotId).not.toBe(branch.index.snapshotId);
    // Stable for the same request, so a client can compare it against the
    // snapshot it is showing and discard a stale answer.
    const again = await collectIndex({ runner, cwd: repo.root }, { kind: "worktree" });
    expect(again.ok && again.index.snapshotId).toBe(worktree.index.snapshotId);
  });
});
