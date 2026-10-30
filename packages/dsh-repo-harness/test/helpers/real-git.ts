/**
 * Test-only adapters: a Node child-process implementation of the Harness
 * subprocess shape, and a throwaway Git repository for integration cases.
 */
import { execFileSync, spawn } from "node:child_process";
import { mkdtempSync, realpathSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import type { CollectedRead, SpawnedProcess, SubprocessLike } from "../../src/types.ts";

function readerFor(chunks: Buffer[]): { readFrom(fromByte: number): CollectedRead } {
  return {
    readFrom(fromByte) {
      const buffer = Buffer.concat(chunks);
      return { text: buffer.subarray(fromByte).toString("utf8"), lossy: false };
    },
  };
}

/** A minimal real child-process implementation of the host subprocess seam. */
export function createNodeSubprocess(): SubprocessLike {
  return {
    spawn(spec): SpawnedProcess {
      const child = spawn(spec.argv[0] ?? "git", spec.argv.slice(1), {
        cwd: spec.cwd,
        env: { ...process.env, ...spec.env },
        stdio: ["ignore", "pipe", "pipe"],
      });
      const stdout: Buffer[] = [];
      const stderr: Buffer[] = [];
      child.stdout.on("data", (chunk: Buffer) => stdout.push(chunk));
      child.stderr.on("data", (chunk: Buffer) => stderr.push(chunk));
      const abort = (): void => {
        child.kill("SIGTERM");
      };
      spec.signal?.addEventListener("abort", abort, { once: true });
      const done = new Promise<{ exitCode: number | null; signal?: string | null }>((resolve, reject) => {
        child.on("error", reject);
        child.on("close", (code, signal) => {
          spec.signal?.removeEventListener("abort", abort);
          resolve({ exitCode: code, signal });
        });
      });
      return {
        done,
        collected: { stdout: readerFor(stdout), stderr: readerFor(stderr) },
      };
    },
  };
}

export interface TempRepo {
  readonly root: string;
  git(...args: string[]): string;
  commitFile(name: string, content: string, message: string): string;
}

/** Create a throwaway repository with one commit and a deterministic identity. */
export function createTempRepo(prefix = "dsh-repo-harness-"): TempRepo {
  const root = realpathSync(mkdtempSync(join(tmpdir(), prefix)));
  const git = (...args: string[]): string =>
    execFileSync("git", args, {
      cwd: root,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
      env: { ...process.env, LC_ALL: "C", GIT_CONFIG_NOSYSTEM: "1" },
    }).trim();
  git("init", "-b", "main");
  git("config", "user.email", "repo-harness@example.test");
  git("config", "user.name", "repo harness test");
  const commitFile = (name: string, content: string, message: string): string => {
    writeFileSync(join(root, name), content);
    git("add", name);
    git("commit", "-m", message);
    return git("rev-parse", "HEAD");
  };
  commitFile("base.txt", "base\n", "base");
  return { root, git, commitFile };
}
