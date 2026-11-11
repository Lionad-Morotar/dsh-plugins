import { describe, expect, it } from "vitest";

import { ALL_LANGUAGES, buildSuffixIndex, CATALOG, isBareNameExtension, isSuffixExtension, isWildcardExtension, PLAINTEXT_ID } from "../src/catalog.ts";
import { LANGUAGE_CHUNK_LANGUAGES, LANGUAGE_CHUNKS, languageFor, matchLanguage } from "../src/index.ts";
import { SNAPSHOT } from "../src/snapshot.ts";

/**
 * The 74 builtin ids, written out here rather than derived, because a closed set
 * that is computed from the data it is meant to police proves nothing. This list
 * is the 09 worksheet's `id` column in order.
 */
const BUILTIN_IDS = [
  "bat", "clojure", "coffeescript", "jsonc", "json", "ignore", "markdown", "c", "cpp", "cuda-cpp",
  "csharp", "css", "dart", "diff", "dockerfile", "dotenv", "fsharp", "git-commit", "git-rebase",
  "go", "groovy", "handlebars", "hlsl", "html", "ini", "properties", "java", "javascriptreact",
  "javascript", "jsx-tags", "jsonl", "snippets", "julia", "juliamarkdown", "tex", "latex", "bibtex",
  "cpp_embedded_latex", "markdown_latex_combined", "less", "log", "lua", "makefile", "markdown-math",
  "objective-c", "objective-cpp", "perl", "raku", "php", "powershell", "prompt", "instructions",
  "chatagent", "skill", "jade", "python", "r", "razor", "restructuredtext", "ruby", "rust", "scss",
  "search-result", "shaderlab", "shellscript", "sql", "swift", "typescript", "typescriptreact", "vb",
  "xml", "xsl", "dockercompose", "yaml",
] as const;

describe("builtin closed set", () => {
  it("holds exactly the 74 worksheet ids, in worksheet order", () => {
    expect(SNAPSHOT.map((row) => row.id)).toEqual([...BUILTIN_IDS]);
  });

  it("has no duplicate ids", () => {
    expect(new Set(BUILTIN_IDS).size).toBe(74);
  });

  it("keeps vue and svelte out of the builtin snapshot", () => {
    const ids = SNAPSHOT.map((row) => row.id);
    expect(ids).not.toContain("vue");
    expect(ids).not.toContain("svelte");
  });

  it("marks every repo-owned row as non-builtin", () => {
    // The explicit plaintext row is repo-owned too: it carries suffixes and
    // filenames upstream never contributed, so a consumer splitting on this flag
    // must not count it as a builtin.
    const extras = ALL_LANGUAGES.filter((row) => row.nonBuiltin);
    expect(extras.map((row) => row.id).sort()).toEqual(["plaintext", "svelte", "vue"]);
    for (const row of extras) expect(row.reason).toBeTruthy();
  });

  it("leaves exactly the 74 builtin rows when the flag is applied", () => {
    const builtin = ALL_LANGUAGES.filter((row) => !row.nonBuiltin);
    expect(builtin).toHaveLength(74);
    expect(builtin.map((row) => row.id).sort()).toEqual([...BUILTIN_IDS].sort());
  });

  it("keeps the plaintext row out of the builtin snapshot", () => {
    expect(SNAPSHOT.map((row) => row.id)).not.toContain("plaintext");
  });

  it("maps vue and svelte through the html grammar", () => {
    expect(matchLanguage("a.vue")?.id).toBe("vue");
    expect(matchLanguage("a.svelte")?.id).toBe("svelte");
  });
});

describe("snapshot parity with the worksheet", () => {
  it("carries the five contributed fields for every row", () => {
    for (const row of SNAPSHOT) {
      expect(Array.isArray(row.extensions)).toBe(true);
      expect(Array.isArray(row.filenames)).toBe(true);
      expect(Array.isArray(row.filenamePatterns)).toBe(true);
      expect(Array.isArray(row.aliases)).toBe(true);
      expect(row.firstLine === null || typeof row.firstLine === "string").toBe(true);
    }
  });

  it("keeps .h on the cpp row and .cfg on the properties row upstream", () => {
    expect(SNAPSHOT.find((row) => row.id === "cpp")?.extensions).toContain(".h");
    expect(SNAPSHOT.find((row) => row.id === "properties")?.extensions).toContain(".cfg");
  });

  it("copies the wildcard log entry verbatim", () => {
    expect(SNAPSHOT.find((row) => row.id === "log")?.extensions).toEqual([".log", "*.log.?"]);
  });

  it("copies the compound xml suffixes verbatim", () => {
    const xml = SNAPSHOT.find((row) => row.id === "xml");
    expect(xml?.extensions).toContain(".csproj.user");
    expect(xml?.extensions).toContain(".vcxproj.filters");
  });

  it("keeps dockercompose as a pure glob row", () => {
    const compose = SNAPSHOT.find((row) => row.id === "dockercompose");
    expect(compose?.extensions).toEqual([]);
    expect(compose?.filenames).toEqual([]);
    expect(compose?.filenamePatterns).toEqual([
      "compose.yml",
      "compose.yaml",
      "compose.*.yml",
      "compose.*.yaml",
      "*docker*compose*.yml",
      "*docker*compose*.yaml",
    ]);
  });

  it("keeps the alternation pipes in first-line patterns as real pipes", () => {
    const shell = SNAPSHOT.find((row) => row.id === "shellscript")?.firstLine ?? "";
    expect(shell).toContain("bash|fish|zsh");
    expect(shell).not.toContain("\\|");
  });

  it("keeps the filename lists that carry dozens of entries", () => {
    expect(SNAPSHOT.find((row) => row.id === "ruby")?.filenames).toContain("gemfile");
    expect(SNAPSHOT.find((row) => row.id === "shellscript")?.filenames).toContain("PKGBUILD");
  });
});

describe("dispositions", () => {
  const count = (disposition: string) =>
    SNAPSHOT.filter((row) => row.disposition === disposition).length;

  it("uses only the four allowed values", () => {
    for (const row of SNAPSHOT) {
      expect(["exact", "approx", "backlog", "excluded"]).toContain(row.disposition);
    }
  });

  it("matches the coverage record's bucket counts", () => {
    expect(count("exact")).toBe(22);
    expect(count("approx")).toBe(40);
    expect(count("backlog")).toBe(8);
    expect(count("excluded")).toBe(4);
  });

  it("keeps the eight backlog rows named by the coverage record", () => {
    const backlog = SNAPSHOT.filter((row) => row.disposition === "backlog").map((row) => row.id);
    expect(backlog.sort()).toEqual(
      ["bat", "bibtex", "git-commit", "git-rebase", "log", "makefile", "restructuredtext", "search-result"],
    );
  });

  it("keeps the four excluded rows, which have no file entry of their own", () => {
    const excluded = SNAPSHOT.filter((row) => row.disposition === "excluded");
    expect(excluded.map((row) => row.id).sort()).toEqual(
      ["cpp_embedded_latex", "jsx-tags", "markdown-math", "markdown_latex_combined"],
    );
    for (const row of excluded) {
      expect(row.extensions).toEqual([]);
      expect(row.filenames).toEqual([]);
      expect(row.filenamePatterns).toEqual([]);
    }
  });

  it("gives every non-exact row a reason in the merged catalogue", () => {
    for (const row of CATALOG) {
      if (row.disposition === "exact") continue;
      expect(row.reason, `${row.id} has no reason`).toBeTruthy();
    }
  });

  it("names a grammar for every approximated row", () => {
    for (const row of CATALOG) {
      if (row.disposition !== "approx") continue;
      expect(row.grammar, `${row.id} has no grammar`).toBeTruthy();
    }
  });

  it("gives backlog and excluded rows no grammar, because they have none", () => {
    for (const row of CATALOG) {
      if (row.disposition === "approx" || row.disposition === "exact") continue;
      expect(row.grammar, `${row.id} should not claim a grammar`).toBeUndefined();
    }
  });

  it("keeps the grammar names free of package scopes", () => {
    // The package is pure data: naming a grammar package here would let a bundle
    // pull one in by importing the catalogue.
    for (const row of ALL_LANGUAGES) {
      if (row.grammar === undefined) continue;
      expect(row.grammar).not.toContain("@");
    }
  });
});

describe("suffix index", () => {
  it("gives every suffix exactly one owner", () => {
    const index = buildSuffixIndex();
    for (const [suffix, id] of index.bySuffix) {
      expect(typeof id, suffix).toBe("string");
    }
    expect(index.bySuffix.size).toBeGreaterThan(300);
  });

  it("throws when two languages claim the same suffix", () => {
    const rows = [
      { ...CATALOG[0]!, id: "one", extensions: [".dup"] },
      { ...CATALOG[0]!, id: "two", extensions: [".dup"] },
    ];
    expect(() => buildSuffixIndex(rows)).toThrow(/claimed by both/);
  });

  it("treats a suffix listed twice by one language as one owner", () => {
    // perl lists both .pl and .PL; lower-casing makes them the same suffix.
    expect(matchLanguage("a.pl")?.id).toBe("perl");
    expect(matchLanguage("a.PL")?.id).toBe("perl");
  });

  it("sorts the extensions column into suffixes, wildcards and bare names", () => {
    const index = buildSuffixIndex();
    expect(index.wildcards.map((entry) => entry.entry)).toEqual(["*.log.?"]);
    expect(index.bareNames.map((entry) => entry.entry).sort()).toEqual([
      "color-theme.json",
      "copilot-instructions.md",
      "icon-theme.json",
      "language-configuration.json",
    ]);
    for (const entry of index.wildcards) expect(isWildcardExtension(entry.entry)).toBe(true);
    for (const entry of index.bareNames) expect(isBareNameExtension(entry.entry)).toBe(true);
    for (const suffix of index.bySuffix.keys()) expect(isSuffixExtension(suffix)).toBe(true);
  });

  it("never lets a wildcard entry claim a file", () => {
    for (const entry of buildSuffixIndex().wildcards) {
      expect(matchLanguage(`a${entry.entry}`)).toBeNull();
    }
  });
});

/**
 * The block each language is coloured by.
 *
 * A chunk name is not the same thing as a language id any more: ten languages
 * have a block of their own, nine reuse one of those blocks, and the rest share
 * four batch blocks. The table below is the DevGoal's assignment table, written
 * out here so a row that drifts from it fails rather than silently losing its
 * colours.
 */
const IN_SERVICE = [
  "css", "html", "javascript", "javascriptreact", "json", "markdown", "python", "typescript", "typescriptreact", "yaml",
] as const;

const ALIASES: Readonly<Record<string, string>> = {
  vue: "html",
  svelte: "html",
  razor: "html",
  juliamarkdown: "markdown",
  prompt: "markdown",
  instructions: "markdown",
  chatagent: "markdown",
  skill: "markdown",
  dockercompose: "yaml",
};

const BATCH: Readonly<Record<string, readonly string[]>> = {
  "batch-systems": ["c", "cpp", "objective-c", "objective-cpp", "cuda-cpp", "hlsl", "shaderlab", "csharp", "dart", "fsharp", "vb"],
  "batch-script": [
    "go", "rust", "swift", "java", "groovy", "clojure", "ruby", "perl", "raku", "lua", "r", "julia",
    "powershell", "shellscript", "coffeescript",
  ],
  "batch-webstyle": ["php", "handlebars", "less", "scss", "properties", "ini", "ignore", "dotenv", "jade"],
  "batch-datadoc": ["sql", "xml", "xsl", "jsonc", "jsonl", "snippets", "diff", "dockerfile", "tex", "latex"],
};

/** Every language that should be coloured, and by which block. */
const EXPECTED_CHUNK: Readonly<Record<string, string>> = Object.fromEntries([
  ...IN_SERVICE.map(id => [id, id] as const),
  ...Object.entries(ALIASES),
  ...Object.entries(BATCH).flatMap(([chunk, ids]) => ids.map(id => [id, chunk] as const)),
]);

describe("chunk assignment", () => {
  it("covers 64 languages, the DevGoal's coloured set", () => {
    expect(Object.keys(EXPECTED_CHUNK)).toHaveLength(64);
  });

  it("matches the table row for row", () => {
    const actual = Object.fromEntries(
      ALL_LANGUAGES.filter(row => row.chunk !== undefined).map(row => [row.id, row.chunk as string]),
    );
    expect(actual).toEqual(EXPECTED_CHUNK);
  });

  it("leaves the twelve uncoloured rows without a chunk", () => {
    // Eight backlog rows stay honestly monochrome, and four excluded rows have no
    // file entry of their own. The explicit plaintext row is not a language at
    // all, so it has no block either.
    const uncoloured = ["bat", "git-commit", "git-rebase", "log", "bibtex", "makefile", "restructuredtext", "search-result",
      "jsx-tags", "cpp_embedded_latex", "markdown_latex_combined", "markdown-math"];
    for (const id of uncoloured) {
      const row = ALL_LANGUAGES.find(entry => entry.id === id);
      expect(row, id).toBeDefined();
      expect(row?.chunk, id).toBeUndefined();
    }
  });

  it("keeps vue and svelte on the html block", () => {
    // The first slice left them monochrome, which was a visible regression from
    // the html colouring both surfaces had before the catalogue existed.
    expect(ALL_LANGUAGES.find(row => row.id === "vue")?.chunk).toBe("html");
    expect(ALL_LANGUAGES.find(row => row.id === "svelte")?.chunk).toBe("html");
  });
});

describe("language chunks", () => {
  it("names one artifact per block, fourteen in all", () => {
    const files = new Set(Object.values(LANGUAGE_CHUNKS));
    expect(files.size).toBe(14);
  });

  it("derives each file name from its block name", () => {
    for (const [id, file] of Object.entries(LANGUAGE_CHUNKS)) {
      const block = ALL_LANGUAGES.find(row => row.id === id)?.chunk;
      expect(block, id).toBeDefined();
      expect(file).toBe(`client.lang-${block as string}.js`);
    }
  });

  it("lists every coloured language, and only those", () => {
    expect(Object.keys(LANGUAGE_CHUNKS).sort()).toEqual(Object.keys(EXPECTED_CHUNK).sort());
  });

  it("is frozen", () => {
    expect(Object.isFrozen(LANGUAGE_CHUNKS)).toBe(true);
  });
});

describe("language chunk languages", () => {
  it("groups the fourteen blocks", () => {
    expect(Object.keys(LANGUAGE_CHUNK_LANGUAGES).sort()).toEqual(
      [...IN_SERVICE, ...Object.keys(BATCH)].sort(),
    );
  });

  it("lists each block's languages in the assignment table's order", () => {
    // The table groups by grammar source, which is the order the batch entries
    // read in; the snapshot's order is whatever VS Code happened to list.
    for (const [chunk, ids] of Object.entries(LANGUAGE_CHUNK_LANGUAGES)) {
      const expected = Object.keys(EXPECTED_CHUNK).filter(id => EXPECTED_CHUNK[id] === chunk);
      expect(ids, chunk).toEqual(expected);
    }
  });

  it("agrees with the batch table, order included", () => {
    // Order matters: the batch entry dispatches by id, and the build asserts the
    // same sequence, so a reordering here is a real change to the contract.
    for (const [chunk, ids] of Object.entries(BATCH)) {
      expect(LANGUAGE_CHUNK_LANGUAGES[chunk], chunk).toEqual(ids);
    }
  });

  it("gives the reused blocks their aliases too", () => {
    expect(LANGUAGE_CHUNK_LANGUAGES.html).toContain("vue");
    expect(LANGUAGE_CHUNK_LANGUAGES.html).toContain("svelte");
    expect(LANGUAGE_CHUNK_LANGUAGES.html).toContain("razor");
    expect(LANGUAGE_CHUNK_LANGUAGES.markdown).toContain("skill");
    expect(LANGUAGE_CHUNK_LANGUAGES.yaml).toContain("dockercompose");
  });

  it("is frozen, and so is every list in it", () => {
    expect(Object.isFrozen(LANGUAGE_CHUNK_LANGUAGES)).toBe(true);
    for (const ids of Object.values(LANGUAGE_CHUNK_LANGUAGES)) expect(Object.isFrozen(ids)).toBe(true);
  });
});

describe("languageFor", () => {
  it("is the id of matchLanguage when something matches", () => {
    for (const path of ["a.ts", "a.py", "a.md", "a.h", "a.cfg", "Dockerfile", "compose.yml"]) {
      expect(languageFor(path)).toBe(matchLanguage(path)?.id ?? PLAINTEXT_ID);
    }
  });

  it("falls back to the plaintext id for an unknown file", () => {
    expect(matchLanguage("a.toml")).toBeNull();
    expect(languageFor("a.toml")).toBe(PLAINTEXT_ID);
  });

  it("returns the same id the explicit plaintext row carries", () => {
    expect(languageFor("a.txt")).toBe(PLAINTEXT_ID);
    expect(languageFor("a.toml")).toBe(languageFor("a.txt"));
  });
});
