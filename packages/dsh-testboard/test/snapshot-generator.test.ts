/**
 * The snapshot generator's contract.
 *
 * `scripts/snapshot.mjs` produces the two committed artifacts the preview's
 * fixture and the tests read, and `--check` fails the build when they drift. The
 * properties that matter are the ones a diff would otherwise hide: the same
 * corpus must always serialize to the same bytes (no clock, no absolute paths,
 * no random statuses), the synthetic statuses must stay inside the band that
 * makes the red state visible without turning the board into a wall of
 * failures, and the title extractor must survive the call shapes the repo
 * actually uses.
 *
 * These cases lived in `snapshot.test.ts` and `sources.test.ts` until those
 * files were removed along with the two data chunks. The chunk cases went with
 * them; the generator cases are what this file keeps.
 */
import { describe, expect, it } from "vitest";

import snapshotData from "../src/client/data/snapshot.json" with { type: "json" };
import sourcesData from "../src/client/data/sources.json" with { type: "json" };
import type { TestSnapshot } from "../src/client/model.ts";
import type { SourceBundle } from "../src/client/source.ts";

/**
 * The generator is a plain ESM script with no declaration file, so it is loaded
 * through a typed seam rather than a static import. The shape below is exactly
 * what these tests assert, which keeps the cast honest: it is the one place the
 * script's contract is written down for the type checker.
 */
interface SnapshotModule {
  readonly extractCaseTitles: (source: string) => string[];
  readonly extractCases: (source: string) => { readonly name: string; readonly offset: number }[];
  readonly lineOfOffset: (source: string, offset: number) => number;
  readonly buildSnapshot: () => TestSnapshot;
  readonly buildArtifacts: () => { readonly snapshot: TestSnapshot; readonly sources: SourceBundle };
  readonly serialize: (snapshot: TestSnapshot) => string;
  readonly serializeSources: (sources: SourceBundle) => string;
}

const { extractCaseTitles, extractCases, lineOfOffset, buildSnapshot, buildArtifacts, serialize, serializeSources } =
  (await import(
    // A variable specifier stops TypeScript resolving the untyped script.
    "../scripts/snapshot.mjs" as string
  )) as SnapshotModule;

/** The committed artifacts, for the assertions that are about the real corpus. */
const SNAPSHOT = snapshotData as unknown as TestSnapshot;
const SOURCES = sourcesData as unknown as SourceBundle;

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

describe("lineOfOffset", () => {
  it("counts the newlines before the offset, 1-based", () => {
    const source = "one\ntwo\nthree";
    expect(lineOfOffset(source, 0)).toBe(1);
    expect(lineOfOffset(source, 3)).toBe(1);
    expect(lineOfOffset(source, 4)).toBe(2);
    expect(lineOfOffset(source, 8)).toBe(3);
  });

  it("reports line 1 for an offset in an empty file", () => {
    expect(lineOfOffset("", 0)).toBe(1);
  });
});

describe("extractCases", () => {
  it("reports the offset of the title, not of the call", () => {
    const source = `\n\nit("the case", () => {});\n`;
    const [first] = extractCases(source);
    expect(first?.name).toBe("the case");
    // The offset points at the opening quote, which is what the line number is
    // derived from.
    expect(source[first?.offset ?? 0]).toBe('"');
    expect(lineOfOffset(source, first?.offset ?? 0)).toBe(3);
  });
});

describe("buildArtifacts", () => {
  const artifacts = buildArtifacts();

  it("derives both artifacts from one walk, so their file sets agree", () => {
    const snapshotPaths = artifacts.snapshot.packages.flatMap(pkg => pkg.files.map(file => file.path)).sort();
    expect(Object.keys(artifacts.sources.files).sort()).toEqual(snapshotPaths);
  });

  it("keeps the bundle's keys in the walk's order, which is sorted", () => {
    const keys = Object.keys(artifacts.sources.files);
    expect(keys).toEqual([...keys].sort());
  });

  it("serializes the bundle deterministically", () => {
    expect(serializeSources(buildArtifacts().sources)).toBe(serializeSources(artifacts.sources));
  });

  it("carries no clock and no absolute path in its own keys", () => {
    // The values are other packages' test source, which may legitimately quote
    // any string at all (an arch fixture holds a `/Users/...` path). What must
    // stay clean is the generator's own contribution: the keys and the header.
    const keys = Object.keys(artifacts.sources.files);
    expect(keys.every(key => key.startsWith("packages/") && !key.startsWith("/"))).toBe(true);
    const header = serializeSources(artifacts.sources).slice(0, 200);
    expect(header).not.toMatch(/\/Users\//u);
    expect(header).not.toMatch(/\b20\d\d-\d\d-\d\dT/u);
    expect(header).not.toMatch(/generatedAt/u);
  });
});
