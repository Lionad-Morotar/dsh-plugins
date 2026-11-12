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
import {
  buildVitestArgv,
  lineOfCase,
  packageNameOf,
  parseVerboseLine,
  parseVerboseOutput,
  parseVitestJson,
} from "../src/host/vitest.ts";

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
  it("runs the workspace's own vitest with both reporters and an output file", () => {
    expect(buildVitestArgv({ workspace: WORKSPACE, scope: { kind: "all" }, outputFile: "/tmp/out.json" })).toEqual([
      "/ws/node_modules/.bin/vitest",
      "run",
      "--reporter=verbose",
      "--reporter=json",
      "--outputFile",
      "/tmp/out.json",
    ]);
  });

  it("asks for the verbose reporter first so its lines stream while the suite runs", () => {
    const argv = buildVitestArgv({ workspace: WORKSPACE, scope: { kind: "all" }, outputFile: "/tmp/out.json" });

    // The order is the contract: the json reporter only writes its file at the
    // end, and the board's live rows come from the verbose stream.
    expect(argv.indexOf("--reporter=verbose")).toBeLessThan(argv.indexOf("--reporter=json"));
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
      "--reporter=verbose",
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

/**
 * The verbose reporter's output, as this repository's vitest actually prints it.
 *
 * Captured from a real run (`vitest run --reporter=verbose --reporter=json`) on
 * a two-file probe suite with one passing file, one failing file, a skipped case
 * and a nested describe. Trimmed to the lines the parser reads: the run header,
 * the per-case lines, and the failure summary. The ANSI colour the reporter emits
 * on a TTY is already stripped here, which is also what the engine does before
 * parsing.
 *
 * Kept as a literal rather than a fixture file because the parser's whole job is
 * to survive this exact text, and a fixture nobody reads is a fixture nobody
 * updates when the reporter changes.
 */
const VERBOSE = [
  "",
  " RUN  v3.2.7 /ws",
  "",
  " \u2713 test/beta.test.ts > beta suite > nested group > passes inside a nested describe 1ms",
  " \u2713 test/beta.test.ts > beta suite > also passes 0ms",
  " \u2713 test/alpha.test.ts > alpha suite > adds two numbers 1ms",
  " \u00d7 test/alpha.test.ts > alpha suite > subtracts two numbers 3ms",
  "   \u2192 expected 1 to be 2 // Object.is equality",
  " \u2193 test/alpha.test.ts > alpha suite > is skipped on purpose",
  "",
  "\u2500\u2500\u2500\u2500 Failed Tests 1 \u2500\u2500\u2500\u2500",
  "",
  " FAIL  test/alpha.test.ts > alpha suite > subtracts two numbers",
  "AssertionError: expected 1 to be 2 // Object.is equality",
  "",
  " \u276f test/alpha.test.ts:9:19",
  "",
  " Test Files  1 failed | 1 passed (2)",
  "      Tests  1 failed | 3 passed | 1 skipped (5)",
  "   Duration  305ms",
  "",
].join("\n");

describe("parseVerboseLine", () => {
  it("reads a passing case with its path, title and duration", () => {
    const event = parseVerboseLine(" \u2713 test/alpha.test.ts > alpha suite > adds two numbers 1ms");

    expect(event).toEqual({
      kind: "case",
      path: "test/alpha.test.ts",
      name: "adds two numbers",
      status: "passed",
      durationMs: 1,
    });
  });

  it("reads a failing case", () => {
    const event = parseVerboseLine(" \u00d7 test/alpha.test.ts > alpha suite > subtracts two numbers 3ms");

    expect(event).toMatchObject({ kind: "case", status: "failed", durationMs: 3 });
  });

  it("reads the skipped marker as skipped", () => {
    const event = parseVerboseLine(" \u2193 test/alpha.test.ts > alpha suite > is skipped on purpose");

    expect(event).toMatchObject({ kind: "case", status: "skipped", durationMs: 0 });
  });

  it("keeps a nested describe's chain out of the case name", () => {
    const event = parseVerboseLine(
      " \u2713 test/beta.test.ts > beta suite > nested group > passes inside a nested describe 1ms",
    );

    // The name is the case's own title: the describes are the path to it, and a
    // reader comparing the board with the file looks for the title alone.
    expect(event).toMatchObject({ name: "passes inside a nested describe", path: "test/beta.test.ts" });
  });

  it("reads a fractional duration", () => {
    expect(parseVerboseLine(" \u2713 test/a.test.ts > s > t 12.34ms")).toMatchObject({ durationMs: 12.34 });
  });

  it("reads a duration in seconds", () => {
    expect(parseVerboseLine(" \u2713 test/a.test.ts > s > t 1.5s")).toMatchObject({ durationMs: 1500 });
  });

  it("reports the project a line was printed under, separately from the path", () => {
    // A run over several projects names each one and prints the path relative to
    // it; the caller is what re-roots the path, so the parser only carries both.
    const event = parseVerboseLine(" \u2713 |packages/alpha| test/one.test.ts > suite > adds 1ms");

    expect(event).toEqual({
      kind: "case",
      project: "packages/alpha",
      path: "test/one.test.ts",
      name: "adds",
      status: "passed",
      durationMs: 1,
    });
  });

  it("carries the project label on the failure summary line too", () => {
    expect(parseVerboseLine(" FAIL  |packages/alpha| test/one.test.ts > suite > subtracts")).toEqual({
      kind: "failure",
      project: "packages/alpha",
      path: "test/one.test.ts",
      name: "subtracts",
    });
  });

  it("adds no project to a line printed without one", () => {
    const event = parseVerboseLine(" \u2713 test/alpha.test.ts > suite > adds 1ms");

    expect(event).not.toHaveProperty("project");
  });

  it("reports the failure summary line as a failure marker", () => {
    const event = parseVerboseLine(" FAIL  test/alpha.test.ts > alpha suite > subtracts two numbers");

    expect(event).toEqual({ kind: "failure", path: "test/alpha.test.ts", name: "subtracts two numbers" });
  });

  it("ignores the assertion detail under a case", () => {
    expect(parseVerboseLine("   \u2192 expected 1 to be 2 // Object.is equality")).toBeUndefined();
  });

  it("ignores the run header, the separators and the tallies", () => {
    expect(parseVerboseLine(" RUN  v3.2.7 /ws")).toBeUndefined();
    expect(parseVerboseLine("\u2500\u2500\u2500\u2500 Failed Tests 1 \u2500\u2500\u2500\u2500")).toBeUndefined();
    expect(parseVerboseLine("      Tests  1 failed | 3 passed | 1 skipped (5)")).toBeUndefined();
    expect(parseVerboseLine("")).toBeUndefined();
  });

  it("ignores a source excerpt line that happens to contain a marker", () => {
    // The excerpt under a failure is indented and numbered; a naive marker scan
    // would read its `\u276f` caret line as a case.
    expect(parseVerboseLine(" \u276f test/alpha.test.ts:9:19")).toBeUndefined();
  });

  it("strips ANSI colour before reading", () => {
    const coloured = "\u001B[32m \u2713 test/a.test.ts > s > t 2ms\u001B[39m";

    expect(parseVerboseLine(coloured)).toMatchObject({ kind: "case", status: "passed", durationMs: 2 });
  });
});

describe("parseVerboseOutput", () => {
  it("reads every case in the order the reporter printed them", () => {
    const events = parseVerboseOutput(VERBOSE).filter(event => event.kind === "case");

    expect(events.map(event => event.name)).toEqual([
      "passes inside a nested describe",
      "also passes",
      "adds two numbers",
      "subtracts two numbers",
      "is skipped on purpose",
    ]);
  });

  it("carries the three states through", () => {
    const statuses = parseVerboseOutput(VERBOSE)
      .filter(event => event.kind === "case")
      .map(event => event.status);

    expect(statuses).toEqual(["passed", "passed", "passed", "failed", "skipped"]);
  });

  it("reports each failing case once from the summary, not twice", () => {
    const failures = parseVerboseOutput(VERBOSE).filter(event => event.kind === "failure");

    expect(failures).toHaveLength(1);
    expect(failures[0]).toMatchObject({ path: "test/alpha.test.ts", name: "subtracts two numbers" });
  });

  it("ignores the tallies so a partial stream cannot overstate the run", () => {
    const events = parseVerboseOutput("      Tests  1 failed | 3 passed | 1 skipped (5)");

    expect(events).toEqual([]);
  });

  it("is empty for an empty stream", () => {
    expect(parseVerboseOutput("")).toEqual([]);
  });
});
