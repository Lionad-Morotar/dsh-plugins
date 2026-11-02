import { describe, expect, it } from "vitest";

import { collectShow } from "../src/host/show.ts";
import type { GitRunner, GitRunResult } from "../src/host/git.ts";

function ok(stdout: string): GitRunResult {
  return { argv: ["git"], exitCode: 0, stdout, stderr: "", timedOut: false, cancelled: false, stdoutLossy: false };
}

function missing(): GitRunResult {
  return {
    argv: ["git"],
    exitCode: 128,
    stdout: "",
    stderr: "fatal: Not a valid object name",
    timedOut: false,
    cancelled: false,
    stdoutLossy: false,
  };
}

/**
 * A runner keyed by `<command> <spec>`, the way collectShow addresses objects.
 *
 * `cat-file -t|-s|-p` and `rev-parse` are the four commands the endpoint may
 * run; each spec maps to per-command answers so a test can make a path missing
 * in the commit but present in `hash^1` without imitating git's diagnostics.
 */
function runnerFor(cases: Record<string, GitRunResult>): GitRunner {
  return {
    async run(args) {
      // Option tokens do not change which object a command addresses; the
      // fixture is keyed by the command and its final spec only.
      const called = args.filter(argument => argument !== "--end-of-options" && argument !== "--verify");
      const command = called.slice(0, -1).join(" ");
      const spec = called.at(-1) ?? "";
      const answer = cases[`${command} ${spec}`];
      if (answer === undefined) throw new Error(`unexpected command ${command} ${spec}`);
      return { ...answer, argv: ["git", ...args] };
    },
  };
}

const BLOB = `${"e".repeat(39)}1`;

describe("collectShow", () => {
  it("pages a text blob from the commit, one-based and eof-marked", async () => {
    const runner = runnerFor({
      [`cat-file -t abc123:src/a.ts`]: ok("blob\n"),
      [`cat-file -s abc123:src/a.ts`]: ok("24\n"),
      [`cat-file -p abc123:src/a.ts`]: ok("one\ntwo\nthree\n"),
      [`rev-parse abc123:src/a.ts`]: ok(`${BLOB}\n`),
    });
    const first = await collectShow({ runner, cwd: "/repo", maxBytes: 1024 }, { hash: "abc123", path: "src/a.ts", limit: 2 });
    expect(first).toEqual({
      ok: true,
      page: {
        path: "src/a.ts",
        revision: BLOB,
        source: "commit",
        offset: 1,
        lines: 2,
        text: "one\ntwo",
        eof: false,
        bytes: 24,
        binary: false,
        kind: "text",
      },
    });

    const second = await collectShow(
      { runner, cwd: "/repo", maxBytes: 1024 },
      { hash: "abc123", path: "src/a.ts", offset: 3, limit: 2 },
    );
    expect(second.ok).toBe(true);
    if (second.ok) {
      expect(second.page.text).toBe("three");
      expect(second.page.offset).toBe(3);
      expect(second.page.eof).toBe(true);
    }
  });

  it("reports an empty file as eof with no lines", async () => {
    const runner = runnerFor({
      "cat-file -t aaaa:e.txt": ok("blob\n"),
      "cat-file -s aaaa:e.txt": ok("0\n"),
      "cat-file -p aaaa:e.txt": ok(""),
      "rev-parse aaaa:e.txt": ok(`${BLOB}\n`),
    });
    const result = await collectShow({ runner, cwd: "/repo", maxBytes: 1024 }, { hash: "aaaa", path: "e.txt" });
    expect(result).toEqual({
      ok: true,
      page: {
        path: "e.txt",
        revision: BLOB,
        source: "commit",
        offset: 1,
        lines: 0,
        text: "",
        eof: true,
        bytes: 0,
        binary: false,
        kind: "text",
      },
    });
  });

  it("keeps CRLF endings inside the lines it returns", async () => {
    const runner = runnerFor({
      "cat-file -t aaaa:c.txt": ok("blob\n"),
      "cat-file -s aaaa:c.txt": ok("8\n"),
      "cat-file -p aaaa:c.txt": ok("a\r\nb\r\n"),
      "rev-parse aaaa:c.txt": ok(`${BLOB}\n`),
    });
    const result = await collectShow({ runner, cwd: "/repo", maxBytes: 1024 }, { hash: "aaaa", path: "c.txt", limit: 1 });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.page.text).toBe("a\r");
      expect(result.page.lines).toBe(1);
      expect(result.page.eof).toBe(false);
    }
  });

  it("answers a non-UTF-8 blob inside the byte budget as binary, not too-large", async () => {
    const lossy: GitRunResult = {
      argv: ["git"],
      exitCode: 0,
      stdout: "",
      stderr: "",
      timedOut: false,
      cancelled: false,
      stdoutLossy: true,
    };
    const runner = runnerFor({
      "cat-file -t aaaa:latin1.txt": ok("blob\n"),
      "cat-file -s aaaa:latin1.txt": ok("12\n"),
      "cat-file -p aaaa:latin1.txt": lossy,
      "rev-parse aaaa:latin1.txt": ok(`${BLOB}\n`),
    });
    const result = await collectShow({ runner, cwd: "/repo", maxBytes: 1024 }, { hash: "aaaa", path: "latin1.txt" });
    expect(result).toEqual({
      ok: true,
      page: {
        path: "latin1.txt",
        revision: BLOB,
        source: "commit",
        offset: 1,
        lines: 0,
        text: "",
        eof: true,
        bytes: 12,
        binary: true,
        kind: "binary",
      },
    });
  });

  it("answers binary without a body", async () => {
    const runner = runnerFor({
      "cat-file -t aaaa:bin.png": ok("blob\n"),
      "cat-file -s aaaa:bin.png": ok("10\n"),
      "cat-file -p aaaa:bin.png": ok("x\0y"),
      "rev-parse aaaa:bin.png": ok(`${BLOB}\n`),
    });
    const result = await collectShow({ runner, cwd: "/repo", maxBytes: 1024 }, { hash: "aaaa", path: "bin.png" });
    expect(result).toEqual({
      ok: true,
      page: {
        path: "bin.png",
        revision: BLOB,
        source: "commit",
        offset: 1,
        lines: 0,
        text: "",
        eof: true,
        bytes: 10,
        binary: true,
        kind: "binary",
      },
    });
  });

  it("falls back to the first parent for a file the commit deleted", async () => {
    const runner = runnerFor({
      "cat-file -t dead:gone.txt": missing(),
      "cat-file -t dead^1:gone.txt": ok("blob\n"),
      "cat-file -s dead^1:gone.txt": ok("6\n"),
      "cat-file -p dead^1:gone.txt": ok("kept\n"),
      "rev-parse dead^1:gone.txt": ok(`${BLOB}\n`),
    });
    const result = await collectShow({ runner, cwd: "/repo", maxBytes: 1024 }, { hash: "dead", path: "gone.txt" });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.page.source).toBe("first-parent");
      expect(result.page.text).toBe("kept");
    }
  });

  it("answers a submodule path with its object id", async () => {
    const LINK = "f".repeat(40);
    const runner = runnerFor({
      "cat-file -t beef:vendor/lib": ok("commit\n"),
      "rev-parse beef:vendor/lib": ok(`${LINK}\n`),
    });
    const result = await collectShow({ runner, cwd: "/repo", maxBytes: 1024 }, { hash: "beef", path: "vendor/lib" });
    expect(result).toEqual({
      ok: true,
      page: {
        path: "vendor/lib",
        revision: LINK,
        source: "commit",
        offset: 1,
        lines: 0,
        text: "",
        eof: true,
        bytes: 0,
        binary: false,
        kind: "submodule",
      },
    });
  });

  it("refuses a blob above the byte budget", async () => {
    const runner = runnerFor({
      "cat-file -t aaaa:big.lock": ok("blob\n"),
      "cat-file -s aaaa:big.lock": ok("2049\n"),
      "rev-parse aaaa:big.lock": ok(`${BLOB}\n`),
    });
    const result = await collectShow({ runner, cwd: "/repo", maxBytes: 2048 }, { hash: "aaaa", path: "big.lock" });
    expect(result).toEqual({ ok: false, error: { code: "too-large", message: expect.any(String) } });
  });

  it("answers not-found when neither the commit nor its first parent has the path", async () => {
    const runner = runnerFor({
      "cat-file -t aaaa:nope.txt": missing(),
      "cat-file -t aaaa^1:nope.txt": missing(),
    });
    const result = await collectShow({ runner, cwd: "/repo", maxBytes: 1024 }, { hash: "aaaa", path: "nope.txt" });
    expect(result).toEqual({ ok: false, error: { code: "not-found", message: expect.any(String) } });
  });

  it("rejects a revision expression before spawning git", async () => {
    let called = false;
    const runner: GitRunner = {
      async run() {
        called = true;
        throw new Error("must not run");
      },
    };
    const result = await collectShow({ runner, cwd: "/repo", maxBytes: 1024 }, { hash: "HEAD--all", path: "a.ts" });
    expect(result).toEqual({ ok: false, error: { code: "invalid-request", message: expect.any(String) } });
    expect(called).toBe(false);
  });

  it("rejects paths that are not repository-relative spellings", async () => {
    const runner: GitRunner = {
      async run() {
        throw new Error("must not run");
      },
    };
    const options = { runner, cwd: "/repo", maxBytes: 1024 };
    for (const path of ["", "   ", "/etc/passwd", "C:\\work\\a.ts", "a/../b.ts", "./a.ts", "a//b.ts", "with\0nul"]) {
      const result = await collectShow(options, { hash: "abcd1234", path });
      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.error.code).toBe("invalid-request");
    }
  });

  it("answers an empty page past the last line instead of failing", async () => {
    const runner = runnerFor({
      "cat-file -t aaaa:a.ts": ok("blob\n"),
      "cat-file -s aaaa:a.ts": ok("8\n"),
      "cat-file -p aaaa:a.ts": ok("one\ntwo\n"),
      "rev-parse aaaa:a.ts": ok(`${BLOB}\n`),
    });
    const result = await collectShow({ runner, cwd: "/repo", maxBytes: 1024 }, { hash: "aaaa", path: "a.ts", offset: 9 });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.page.lines).toBe(0);
      expect(result.page.text).toBe("");
      expect(result.page.eof).toBe(true);
    }
  });

  it("normalizes backslash paths and clamps hostile paging input", async () => {
    const seen: string[] = [];
    const runner: GitRunner = {
      async run(args) {
        const sub = args[0] ?? "";
        if (sub === "cat-file" && args[1] === "-t") {
          seen.push(args.at(-1) ?? "");
          return ok("blob\n");
        }
        if (sub === "cat-file" && args[1] === "-s") return ok("4\n");
        if (sub === "cat-file" && args[1] === "-p") return ok("body\n");
        if (sub === "rev-parse") return ok(`${BLOB}\n`);
        throw new Error(`unexpected ${sub}`);
      },
    };
    const result = await collectShow(
      { runner, cwd: "/repo", maxBytes: 1024 },
      { hash: "aaaa", path: "src\\client\\a.ts", offset: -5, limit: 99999 },
    );
    expect(seen).toContain("aaaa:src/client/a.ts");
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.page.offset).toBe(1);
      expect(result.page.lines).toBe(1);
      expect(result.page.eof).toBe(true);
    }
  });
});
