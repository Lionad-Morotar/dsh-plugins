/**
 * Host-half tests for the filesystem exploration service.
 *
 * Driven the way the seams doc prescribes: the class method directly, against
 * real directories in tmp, with no mocks inside. Every case pins a product
 * decision the panel's absolute-path branch stands on.
 */

import { chmod, mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { homedir, tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { Context } from "@deepseek-ai/cordis";
import { remoteMethods } from "@deepseek-ai/dsh-typert-protocol";

import { PathExplorerService, PATH_SERVICE } from "../src/index.ts";

let root: string;
const explorer = new PathExplorerService(new Context());

beforeEach(async () => {
  root = await mkdtemp(join(tmpdir(), "dcp-paths-"));
});

afterEach(async () => {
  await chmod(root, 0o755).catch(() => undefined);
  await rm(root, { recursive: true, force: true }).catch(() => undefined);
});

describe("PathExplorerService activation", () => {
  it("publishes one resolve endpoint and waits on no host service", () => {
    expect(PathExplorerService.inject).toEqual([]);
    const markers = remoteMethods(new PathExplorerService(new Context()));
    expect(markers.map(marker => marker.exportName ?? marker.method)).toEqual(["resolve"]);
    expect(PATH_SERVICE).toBe("pathExplorer");
  });
});

describe("resolve", () => {
  it("lists a directory's direct children unfiltered, directories first", async () => {
    await mkdir(join(root, "notes"));
    await writeFile(join(root, "b.txt"), "");
    await writeFile(join(root, "a.md"), "");

    const result = await explorer.resolve({ query: `${root}/` });

    expect(result).toMatchObject({ ok: true, home: homedir() });
    if (!result.ok) throw new Error("unreachable");
    expect(result.entries.map(entry => [entry.path, entry.kind, entry.exists])).toEqual([
      [`${root}/notes`, "directory", true],
      [`${root}/a.md`, "file", true],
      [`${root}/b.txt`, "file", true],
    ]);
  });

  it("prefix-filters children on the last segment, case-insensitively", async () => {
    await mkdir(join(root, "notes"));
    await writeFile(join(root, "note.md"), "");
    await writeFile(join(root, "README.md"), "");
    await writeFile(join(root, "other.ts"), "");

    const result = await explorer.resolve({ query: `${root}/NOT` });

    if (!result.ok) throw new Error("unreachable");
    expect(result.entries.map(entry => entry.path)).toEqual([`${root}/notes`, `${root}/note.md`]);
  });

  it("keeps the typed path's own row when it already exists", async () => {
    await mkdir(join(root, "notes"));
    await writeFile(join(root, "note.md"), "");

    const result = await explorer.resolve({ query: `${root}/note.md` });

    if (!result.ok) throw new Error("unreachable");
    expect(result.entries).toEqual([{ path: `${root}/note.md`, kind: "file", exists: true }]);
  });

  it("expands a tilde to the home directory, bare or with a path", async () => {
    const home = homedir();
    const bare = await explorer.resolve({ query: "~" });
    const withSlash = await explorer.resolve({ query: "~/" });

    for (const result of [bare, withSlash]) {
      if (!result.ok) throw new Error("unreachable");
      expect(result.home).toBe(home);
      expect(result.entries.every(entry => entry.path.startsWith(`${home}/`))).toBe(true);
    }
  });

  it("answers an empty list for a path that does not exist", async () => {
    const result = await explorer.resolve({ query: `${root}/missing/deep` });
    expect(result).toMatchObject({ ok: true });
    if (!result.ok) throw new Error("unreachable");
    expect(result.entries).toEqual([]);
  });

  it("rejects queries that cannot name a filesystem location", async () => {
    await expect(explorer.resolve({ query: "bareword" })).resolves.toMatchObject({
      ok: false,
      error: { code: "invalid-request" },
    });
    await expect(explorer.resolve({ query: "relative/path" })).resolves.toMatchObject({
      ok: false,
      error: { code: "invalid-request" },
    });
  });

  it("truncates the filtered answer to the default limit", async () => {
    for (let index = 0; index < 25; index += 1) {
      await writeFile(join(root, `f${String(index).padStart(2, "0")}.txt`), "");
    }

    const result = await explorer.resolve({ query: `${root}/f` });

    if (!result.ok) throw new Error("unreachable");
    expect(result.entries).toHaveLength(20);
  });

  it("degrades an unreadable directory to no children instead of failing", async () => {
    const guarded = join(root, "guarded");
    await mkdir(guarded);
    await chmod(guarded, 0o000);

    const result = await explorer.resolve({ query: `${guarded}/` });

    expect(result).toMatchObject({ ok: true });
    if (!result.ok) throw new Error("unreachable");
    expect(result.entries).toEqual([]);
  });
});
