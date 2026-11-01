/**
 * Bounded likec4.config.json discovery.
 *
 * These tests pin the product decision that keeps the host half off worktree
 * copies: the canonical `.planning/c4` path answers alone when present, and the
 * walk never crosses the skip table even one level below a workspace root.
 */
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { discoverC4ProjectDirs } from "../src/host/discover.ts";
import { CONFIG_BASENAME, DISCOVER_SKIP_DIRS } from "../src/shared.ts";

let root: string;

async function touchConfig(...segments: string[]): Promise<string> {
  const dir = join(root, ...segments);
  await mkdir(dir, { recursive: true });
  const file = join(dir, CONFIG_BASENAME);
  await writeFile(file, "{}\n", "utf8");
  return dir;
}

beforeAll(async () => {
  root = await mkdtemp(join(tmpdir(), "dsh-arch-discover-"));
});

afterAll(async () => {
  await rm(root, { recursive: true, force: true });
});

describe("canonical probe", () => {
  it("answers alone when .planning/c4/likec4.config.json exists", async () => {
    const other = await touchConfig("other");
    const canonical = await touchConfig(".planning", "c4");
    const found = await discoverC4ProjectDirs(root);
    expect(found).toEqual([canonical]);
    expect(found).not.toContain(other);
  });

  it("is skipped (no walk hit) when only a deeper copy exists beyond max depth", async () => {
    const nested = await mkdtemp(join(tmpdir(), "dsh-arch-deep-"));
    try {
      // Depth 5 directory: root(0)/a(1)/b(2)/c(3)/d(4)/e(5) — beyond the bound.
      await touchConfigAt(nested, ["a", "b", "c", "d", "e"]);
      expect(await discoverC4ProjectDirs(nested)).toEqual([]);
    } finally {
      await rm(nested, { recursive: true, force: true });
    }
  });
});

describe("bounded walk", () => {
  it("finds a config at exactly the depth bound", async () => {
    const nested = await mkdtemp(join(tmpdir(), "dsh-arch-bound-"));
    try {
      const at = await touchConfigAt(nested, ["a", "b", "c", "d"]);
      expect(await discoverC4ProjectDirs(nested)).toEqual([at]);
    } finally {
      await rm(nested, { recursive: true, force: true });
    }
  });

  it("never descends into the skip table", async () => {
    const nested = await mkdtemp(join(tmpdir(), "dsh-arch-skip-"));
    try {
      for (const skipped of DISCOVER_SKIP_DIRS) {
        await mkdir(join(nested, skipped, "inner"), { recursive: true });
        await writeFile(join(nested, skipped, "inner", CONFIG_BASENAME), "{}\n", "utf8");
        await writeFile(join(nested, skipped, CONFIG_BASENAME), "{}\n", "utf8");
      }
      expect(await discoverC4ProjectDirs(nested)).toEqual([]);
    } finally {
      await rm(nested, { recursive: true, force: true });
    }
  });

  it("caps the hit list at the maximum", async () => {
    const nested = await mkdtemp(join(tmpdir(), "dsh-arch-cap-"));
    try {
      for (let i = 0; i < DISCOVER_HITS_OVERFLOW; i += 1) {
        await mkdir(join(nested, `w${i}`), { recursive: true });
        await writeFile(join(nested, `w${i}`, CONFIG_BASENAME), "{}\n", "utf8");
      }
      const found = await discoverC4ProjectDirs(nested);
      expect(found).toHaveLength(DISCOVER_MAX_HITS);
      for (const dir of found) expect(dir.startsWith(nested)).toBe(true);
    } finally {
      await rm(nested, { recursive: true, force: true });
    }
  });

  it("returns empty for a workspace with no C4 model (legal empty state)", async () => {
    const nested = await mkdtemp(join(tmpdir(), "dsh-arch-empty-"));
    try {
      await mkdir(join(nested, "docs"), { recursive: true });
      expect(await discoverC4ProjectDirs(nested)).toEqual([]);
    } finally {
      await rm(nested, { recursive: true, force: true });
    }
  });
});

/** How many configs to create so the cap must truncate: one beyond the bound. */
const DISCOVER_MAX_HITS = 8;
const DISCOVER_HITS_OVERFLOW = DISCOVER_MAX_HITS + 3;

/** touchConfig against an external root (the shared `root` already has one). */
async function touchConfigAt(base: string, segments: readonly string[]): Promise<string> {
  const dir = join(base, ...segments);
  await mkdir(dir, { recursive: true });
  await writeFile(join(dir, CONFIG_BASENAME), "{}\n", "utf8");
  return dir;
}
