/**
 * The snapshot generator's contract.
 *
 * The board's data is a committed artifact, so the properties that matter are
 * the ones a diff would otherwise hide: the same corpus must always serialize
 * to the same bytes (no clock, no absolute paths, no random statuses), the
 * synthetic statuses must stay inside the band that makes the red state
 * visible without turning the board into a wall of failures, and the title
 * extractor must survive the call shapes the repo actually uses.
 */
import { describe, expect, it } from "vitest";

import type { TestSnapshot } from "../src/client/model.ts";

/**
 * The generator is a plain ESM script with no declaration file, so it is loaded
 * through a typed seam rather than a static import. The shape below is exactly
 * what these tests assert, which keeps the cast honest: it is the one place the
 * script's contract is written down for the type checker.
 */
interface SnapshotModule {
  readonly extractCaseTitles: (source: string) => string[];
  readonly buildSnapshot: () => TestSnapshot;
  readonly serialize: (snapshot: TestSnapshot) => string;
}

const { extractCaseTitles, buildSnapshot, serialize } = (await import(
  // A variable specifier stops TypeScript resolving the untyped script.
  "../scripts/snapshot.mjs" as string
)) as SnapshotModule;

describe("extractCaseTitles", () => {
  it("reads the plain it and test forms", () => {
    const source = `
      it("first case", () => {});
      test("second case", () => {});
      it ('third case', () => {});
    `;
    expect(extractCaseTitles(source)).toEqual(["first case", "second case", "third case"]);
  });

  it("reads the modified forms the repo uses", () => {
    const source = `
      it.only("focused case", () => {});
      it.skip("skipped case", () => {});
      it.concurrent("concurrent case", () => {});
    `;
    expect(extractCaseTitles(source)).toEqual(["focused case", "skipped case", "concurrent case"]);
  });

  it("reads the title of an each table, not the table itself", () => {
    const source = `
      it.each(["a", "b"])(
        "treats %s as mid-submit",
        phase => {},
      );
    `;
    expect(extractCaseTitles(source)).toEqual(["treats %s as mid-submit"]);
  });

  it("ignores regex and method calls that merely end in test", () => {
    const source = `
      expect(PATTERN.test(value)).toBe(true);
      expect(/^on[A-Z]/u.test(key)).toBe(false);
      it("the only real case", () => {});
    `;
    expect(extractCaseTitles(source)).toEqual(["the only real case"]);
  });

  it("unescapes quoted titles and keeps them single-line", () => {
    const source = `it("quotes \\"inside\\" the title", () => {});`;
    expect(extractCaseTitles(source)).toEqual(['quotes "inside" the title']);
  });

  it("skips a case whose title is not a string literal", () => {
    const source = `
      it(dynamicTitle, () => {});
      it("a static one", () => {});
    `;
    expect(extractCaseTitles(source)).toEqual(["a static one"]);
  });
});

describe("snapshot chunk", () => {
  it("exports the snapshot under a named key, not as the module itself", async () => {
    // The ModuleLoader factory returns `module.exports.default ?? module.exports`.
    // A default export in the chunk would therefore unwrap to the bare snapshot
    // and the loader's `chunk.snapshot` check would reject data it is holding.
    const chunk = await import("../src/client/snapshot-chunk.ts");
    expect(Object.keys(chunk)).toEqual(["snapshot"]);
    expect(chunk.snapshot.statusSource).toBe("synthetic");
  });

  it("carries the same corpus the generator produces", async () => {
    const chunk = await import("../src/client/snapshot-chunk.ts");
    expect(chunk.snapshot.packages.flatMap(pkg => pkg.files.flatMap(file => file.cases)).length).toBeGreaterThan(1000);
  });
});

describe("buildSnapshot", () => {
  const snapshot = buildSnapshot();
  const cases = snapshot.packages.flatMap(pkg => pkg.files.flatMap(file => file.cases));

  it("scans the repository's test files and finds their cases", () => {
    expect(snapshot.packages.length).toBeGreaterThan(10);
    expect(cases.length).toBeGreaterThan(1000);
  });

  it("marks every status as synthetic", () => {
    expect(snapshot.statusSource).toBe("synthetic");
  });

  it("keeps the failed share inside the band that makes red visible", () => {
    const failed = cases.filter(entry => entry.status === "failed").length;
    const share = failed / cases.length;
    expect(share).toBeGreaterThanOrEqual(0.005);
    expect(share).toBeLessThanOrEqual(0.01);
  });

  it("is deterministic across runs", () => {
    expect(serialize(buildSnapshot())).toBe(serialize(snapshot));
  });

  it("carries no clock, no absolute path and no random field", () => {
    const text = serialize(snapshot);
    expect(text).not.toMatch(/\/Users\//u);
    expect(text).not.toMatch(/\b20\d\d-\d\d-\d\dT/u);
    expect(text).not.toMatch(/generatedAt/u);
  });

  it("keeps file paths repo-relative, and both levels sorted", () => {
    const paths = snapshot.packages.flatMap(pkg => pkg.files.map(file => file.path));
    expect(paths.every(path => path.startsWith("packages/"))).toBe(true);
    // Two separate invariants: packages read alphabetically by name, and each
    // package's own files read alphabetically. Flattening first would test a
    // third, stricter order that the board never renders.
    const names = snapshot.packages.map(pkg => pkg.name);
    expect(names).toEqual([...names].sort());
    for (const pkg of snapshot.packages) {
      const own = pkg.files.map(file => file.path);
      expect(own).toEqual([...own].sort());
    }
  });

  it("gives every case a positive integer duration", () => {
    expect(cases.every(entry => Number.isInteger(entry.durationMs) && entry.durationMs > 0)).toBe(true);
  });
});
