/**
 * The source bundle's contract, and the line numbers that tie it to the
 * snapshot.
 *
 * The right pane renders a file's text and highlights the line the snapshot
 * recorded for a case, so the two artifacts are only useful together: a line
 * number that misses its title highlights the wrong row, and a bundle that
 * covers a different set of files than the snapshot leaves some rows with no
 * code at all. Both properties are asserted here rather than discovered by
 * clicking through the board.
 */
import { describe, expect, it } from "vitest";

import snapshotData from "../src/client/data/snapshot.json" with { type: "json" };
import sourcesData from "../src/client/data/sources.json" with { type: "json" };
import type { TestSnapshot } from "../src/client/model.ts";
import { splitSourceLines, type SourceBundle } from "../src/client/source.ts";

/**
 * The generator is a plain ESM script with no declaration file, so it is loaded
 * through a typed seam rather than a static import.
 */
interface SnapshotModule {
  readonly buildArtifacts: () => { readonly snapshot: TestSnapshot; readonly sources: SourceBundle };
  readonly serializeSources: (sources: SourceBundle) => string;
  readonly extractCases: (source: string) => { readonly name: string; readonly offset: number }[];
  readonly lineOfOffset: (source: string, offset: number) => number;
}

const { buildArtifacts, serializeSources, extractCases, lineOfOffset } = (await import(
  // A variable specifier stops TypeScript resolving the untyped script.
  "../scripts/snapshot.mjs" as string
)) as SnapshotModule;

const SNAPSHOT = snapshotData as unknown as TestSnapshot;
const SOURCES = sourcesData as unknown as SourceBundle;

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

describe("committed sources bundle", () => {
  it("covers exactly the files the snapshot lists", () => {
    const snapshotPaths = SNAPSHOT.packages.flatMap(pkg => pkg.files.map(file => file.path)).sort();
    const sourcePaths = Object.keys(SOURCES.files).sort();
    // Set equality, both ways: a snapshot row with no source is a permanently
    // blank code pane, and a source nobody lists is dead weight in the chunk.
    expect(sourcePaths).toEqual(snapshotPaths);
  });

  it("is versioned independently of the snapshot", () => {
    expect(SOURCES.version).toBe(1);
    expect(SNAPSHOT.version).toBe(2);
  });

  it("puts every case's recorded line on the line its title is written", () => {
    let checked = 0;
    for (const pkg of SNAPSHOT.packages) {
      for (const file of pkg.files) {
        const text = SOURCES.files[file.path];
        expect(text, `no source for ${file.path}`).toBeDefined();
        const lines = splitSourceLines(text ?? "");
        for (const entry of file.cases) {
          const rendered = lines[entry.line - 1];
          expect(rendered, `${file.path}:${String(entry.line)} is past the end of the file`).toBeDefined();
          // The title's first word has to appear on that line. Comparing the
          // whole title would fail on the escapes the extractor decodes, and
          // comparing nothing would let an off-by-one through.
          const probe = entry.name.split(" ")[0]?.slice(0, 12) ?? "";
          expect(rendered, `${file.path}:${String(entry.line)} does not hold ${entry.name}`).toContain(probe);
          checked += 1;
        }
      }
    }
    expect(checked).toBeGreaterThan(1000);
  });

  it("gives every case a line inside its own file", () => {
    for (const pkg of SNAPSHOT.packages) {
      for (const file of pkg.files) {
        const lineCount = splitSourceLines(SOURCES.files[file.path] ?? "").length;
        for (const entry of file.cases) {
          expect(entry.line).toBeGreaterThanOrEqual(1);
          expect(entry.line).toBeLessThanOrEqual(Math.max(1, lineCount));
        }
      }
    }
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
