/**
 * Session → workspace resolution.
 *
 * The board follows the session's working directory, so this is the one place
 * where "which workspace am I looking at" is decided. A wrong answer here is a
 * board showing another project's tests, which is worse than showing nothing,
 * so the missing case is pinned as `undefined` rather than a process-cwd
 * fallback.
 */
import { mkdtemp, mkdir, rm, symlink } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { afterEach, describe, expect, it } from "vitest";

import { canonicalPath, resolveSessionRoot } from "../src/host/workspace.ts";

const created: string[] = [];

async function makeTempDir(): Promise<string> {
  const dir = await mkdtemp(join(tmpdir(), "dsh-testboard-ws-"));
  created.push(dir);
  return dir;
}

afterEach(async () => {
  await Promise.all(created.splice(0).map(dir => rm(dir, { recursive: true, force: true })));
});

describe("canonicalPath", () => {
  it("resolves a symlink to the directory it points at", async () => {
    const root = await makeTempDir();
    const real = join(root, "real");
    const link = join(root, "link");
    await mkdir(real);
    await symlink(real, link);

    expect(await canonicalPath(link)).toBe(await canonicalPath(real));
  });

  it("returns the input unchanged when the directory does not exist", async () => {
    const root = await makeTempDir();
    const missing = join(root, "nope");

    expect(await canonicalPath(missing)).toBe(missing);
  });
});

describe("resolveSessionRoot", () => {
  it("prefers the live session header cwd", async () => {
    const root = await makeTempDir();
    const sessions = { get: () => ({ header: { cwd: root } }) };
    const persistence = { stat: async () => ({ header: { cwd: join(root, "other") } }) };

    expect(await resolveSessionRoot("s1", sessions, persistence)).toBe(await canonicalPath(root));
  });

  it("falls back to the persisted header when no live session exists", async () => {
    const root = await makeTempDir();
    const sessions = { get: () => undefined };
    const persistence = { stat: async () => ({ header: { cwd: root } }) };

    expect(await resolveSessionRoot("s1", sessions, persistence)).toBe(await canonicalPath(root));
  });

  it("returns undefined when neither side knows a cwd", async () => {
    const sessions = { get: () => undefined };
    const persistence = { stat: async () => undefined };

    expect(await resolveSessionRoot("s1", sessions, persistence)).toBeUndefined();
  });

  it("treats an empty cwd as unknown rather than resolving the empty string", async () => {
    const sessions = { get: () => ({ header: { cwd: "" } }) };
    const persistence = { stat: async () => ({ header: { cwd: "" } }) };

    expect(await resolveSessionRoot("s1", sessions, persistence)).toBeUndefined();
  });

  it("survives a persistence read that throws mid-restart", async () => {
    const sessions = { get: () => undefined };
    const persistence = {
      stat: async () => {
        throw new Error("store is closing");
      },
    };

    expect(await resolveSessionRoot("s1", sessions, persistence)).toBeUndefined();
  });

  it("canonicalizes the resolved cwd so both halves key on the same path", async () => {
    const root = await makeTempDir();
    const real = join(root, "real");
    const link = join(root, "link");
    await mkdir(real);
    await symlink(real, link);
    const sessions = { get: () => ({ header: { cwd: link } }) };

    expect(await resolveSessionRoot("s1", sessions)).toBe(await canonicalPath(real));
  });

  it("works with no services at all", async () => {
    expect(await resolveSessionRoot("s1")).toBeUndefined();
  });
});
