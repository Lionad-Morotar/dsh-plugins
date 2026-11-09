/**
 * The vitest seam: argv construction and JSON → snapshot mapping.
 *
 * Both functions are pure so the mapping can be pinned without spawning
 * anything. The reporter's shape is treated as untrusted input: it has changed
 * between vitest majors and a missing field must degrade one case, not the
 * whole board.
 */
import { describe, expect, it } from "vitest";

import type { TestSnapshot } from "../src/client/model.ts";
import { buildVitestArgv, lineOfCase, packageNameOf, parseVitestJson } from "../src/host/vitest.ts";

const WORKSPACE = "/ws";

/** One reporter payload in the shape vitest's json reporter emits. */
const RAW = {
  numTotalTestSuites: 2,
  numTotalTests: 5,
  testResults: [
    {
      name: "/ws/packages/alpha/test/one.test.ts",
      status: "failed",
      message: "",
      assertionResults: [
        { ancestorTitles: ["suite"], title: "adds", status: "passed", duration: 5, failureMessages: [] },
        { ancestorTitles: ["suite"], title: "subtracts", status: "failed", duration: 7, failureMessages: ["expected 1 to be 2"] },
        { ancestorTitles: [], title: "later", status: "pending", duration: 0, failureMessages: [] },
        { ancestorTitles: [], title: "someday", status: "todo", failureMessages: [] },
      ],
    },
    {
      name: "/ws/test/root.test.ts",
      status: "passed",
      assertionResults: [{ title: "root case", status: "passed", duration: 2, failureMessages: [] }],
    },
  ],
};

/** Two files' source text, enough to place four titles on known lines. */
const FILES: Record<string, string> = {
  "packages/alpha/test/one.test.ts": [
    'import { describe, it } from "vitest";',
    'describe("suite", () => {',
    '  it("adds", () => {});',
    '  it("subtracts", () => {});',
    "});",
  ].join("\n"),
  "test/root.test.ts": ['it("root case", () => {});'].join("\n"),
};

function fileTextOf(path: string): string | undefined {
  return FILES[path];
}

function parse(raw: unknown = RAW): TestSnapshot {
  return parseVitestJson(raw, { workspace: WORKSPACE, fileTextOf });
}

describe("buildVitestArgv", () => {
  it("runs the workspace's own vitest with the json reporter and an output file", () => {
    expect(buildVitestArgv({ workspace: WORKSPACE, scope: { kind: "all" }, outputFile: "/tmp/out.json" })).toEqual([
      "/ws/node_modules/.bin/vitest",
      "run",
      "--reporter=json",
      "--outputFile",
      "/tmp/out.json",
    ]);
  });

  it("narrows to one file when the scope names one", () => {
    const argv = buildVitestArgv({
      workspace: WORKSPACE,
      scope: { kind: "file", path: "packages/alpha/test/one.test.ts" },
      outputFile: "/tmp/out.json",
    });

    expect(argv).toEqual([
      "/ws/node_modules/.bin/vitest",
      "run",
      "packages/alpha/test/one.test.ts",
      "--reporter=json",
      "--outputFile",
      "/tmp/out.json",
    ]);
  });
});

describe("packageNameOf", () => {
  it("groups a path under packages/<name>/ by that name", () => {
    expect(packageNameOf("packages/dsh-arch/test/view.test.ts")).toBe("dsh-arch");
  });

  it("puts everything else in the root group", () => {
    expect(packageNameOf("test/root.test.ts")).toBe(".");
    expect(packageNameOf("packages/loose.test.ts")).toBe(".");
  });
});

describe("lineOfCase", () => {
  it("finds the line a title's call starts on", () => {
    const text = FILES["packages/alpha/test/one.test.ts"]!;
    expect(lineOfCase(text, "adds")).toBe(3);
    expect(lineOfCase(text, "subtracts")).toBe(4);
  });

  it("finds a test( call as well as it(", () => {
    expect(lineOfCase('test("only one", () => {});', "only one")).toBe(1);
  });

  it("returns 0 when the title is not in the file", () => {
    expect(lineOfCase('it("other", () => {});', "adds")).toBe(0);
  });

  it("treats regex metacharacters in a title as literal text", () => {
    const text = 'it("adds (a + b) [fast]", () => {});';
    expect(lineOfCase(text, "adds (a + b) [fast]")).toBe(1);
  });
});

describe("parseVitestJson", () => {
  it("labels the snapshot as a real run", () => {
    expect(parse().statusSource).toBe("vitest");
  });

  it("maps passed, failed and the pending family onto the board's three states", () => {
    const statuses = parse().packages.flatMap(pkg => pkg.files.flatMap(file => file.cases.map(entry => entry.status)));

    // Package order is "." then "alpha", so the root file's single pass leads.
    expect(statuses).toEqual(["passed", "passed", "failed", "skipped", "skipped"]);
  });

  it("keeps each case's own duration and the failure message", () => {
    const alpha = parse().packages.find(pkg => pkg.name === "alpha");
    const cases = alpha?.files[0]?.cases ?? [];

    expect(cases.map(entry => entry.durationMs)).toEqual([5, 7, 0, 0]);
    expect(cases[1]?.message).toBe("expected 1 to be 2");
  });

  it("places each case on its line in the file", () => {
    const alpha = parse().packages.find(pkg => pkg.name === "alpha");

    expect(alpha?.files[0]?.cases.map(entry => entry.line)).toEqual([3, 4, 0, 0]);
  });

  it("groups packages by path and sorts them, with the root group as \".\"", () => {
    expect(parse().packages.map(pkg => pkg.name)).toEqual([".", "alpha"]);
  });

  it("rewrites absolute reporter paths as workspace-relative ones", () => {
    const paths = parse().packages.flatMap(pkg => pkg.files.map(file => file.path));

    expect(paths).toEqual(["test/root.test.ts", "packages/alpha/test/one.test.ts"]);
  });

  it("carries the workspace, the stamp and the measured wall clock when given", () => {
    const snapshot = parseVitestJson(RAW, {
      workspace: WORKSPACE,
      fileTextOf,
      generatedAt: "2026-11-10T00:00:00.000Z",
      wallClockMs: 1234,
    });

    expect(snapshot.workspace).toBe(WORKSPACE);
    expect(snapshot.generatedAt).toBe("2026-11-10T00:00:00.000Z");
    expect(snapshot.wallClockMs).toBe(1234);
  });

  it("tolerates a payload with no testResults at all", () => {
    expect(parse({}).packages).toEqual([]);
    expect(parse({ testResults: null }).packages).toEqual([]);
  });

  it("tolerates a file entry with no assertion results", () => {
    const snapshot = parse({ testResults: [{ name: "/ws/test/empty.test.ts" }] });

    expect(snapshot.packages).toEqual([{ name: ".", files: [{ path: "test/empty.test.ts", cases: [] }] }]);
  });

  it("tolerates a case with no duration and no status", () => {
    const snapshot = parse({ testResults: [{ name: "/ws/test/a.test.ts", assertionResults: [{ title: "bare" }] }] });

    expect(snapshot.packages[0]?.files[0]?.cases[0]).toMatchObject({ name: "bare", status: "skipped", durationMs: 0 });
  });

  it("skips a case that has no title instead of inventing one", () => {
    const snapshot = parse({ testResults: [{ name: "/ws/test/a.test.ts", assertionResults: [{ status: "passed" }] }] });

    expect(snapshot.packages[0]?.files[0]?.cases).toEqual([]);
  });

  it("accepts a raw JSON string as well as a parsed object", () => {
    expect(parse(JSON.stringify(RAW)).packages).toHaveLength(2);
  });

  it("throws on a payload that is not JSON at all", () => {
    expect(() => parse("not json")).toThrow();
  });

  it("records line 0 when the file text is unavailable", () => {
    const snapshot = parseVitestJson(RAW, { workspace: WORKSPACE });

    expect(snapshot.packages.flatMap(pkg => pkg.files.flatMap(file => file.cases.map(entry => entry.line)))).toEqual([
      0, 0, 0, 0, 0,
    ]);
  });
});
