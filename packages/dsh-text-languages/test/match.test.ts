import { describe, expect, it } from "vitest";

import {
  baseName,
  LANGUAGE_CHUNKS,
  languageFor,
  matchLanguage,
  PLAINTEXT_ID,
  SUFFIX_INDEX,
} from "../src/index.ts";
import { SNAPSHOT } from "../src/snapshot.ts";

describe("tier order", () => {
  it("matches an exact filename before any suffix or pattern", () => {
    expect(matchLanguage("Dockerfile")?.id).toBe("dockerfile");
    expect(matchLanguage("repo/Makefile")?.id).toBe("makefile");
    expect(matchLanguage("SKILL.md")?.id).toBe("skill");
    expect(matchLanguage("COMMIT_EDITMSG")?.id).toBe("git-commit");
  });

  it("matches a filename pattern before a suffix", () => {
    // .yml alone would be yaml; the compose pattern is the narrower claim.
    expect(matchLanguage("compose.yml")?.id).toBe("dockercompose");
    expect(matchLanguage("docker-compose.override.yaml")?.id).toBe("dockercompose");
  });

  it("matches a suffix before a first line", () => {
    const matched = matchLanguage("run.sh", "#!/usr/bin/env python3");
    expect(matched?.id).toBe("shellscript");
  });

  it("falls through to the first line only when no path tier matched", () => {
    expect(matchLanguage("script")).toBeNull();
    expect(matchLanguage("script", "#!/usr/bin/env python3")?.id).toBe("python");
    expect(matchLanguage("script", "#!/bin/bash")?.id).toBe("shellscript");
  });

  it("never lets a first line override a path match", () => {
    // A .py file whose first line claims bash is still python: the name wins.
    expect(matchLanguage("tool.py", "#!/bin/bash")?.id).toBe("python");
  });

  it("reads only the first line of a multi-line sample", () => {
    expect(matchLanguage("script", "#!/usr/bin/env python3\n#!/bin/bash")?.id).toBe("python");
  });

  it("tolerates a first line the runtime cannot compile as a pattern", () => {
    expect(matchLanguage("script", "#!/usr/bin/env python3")).not.toBeNull();
    expect(matchLanguage("script", "no shebang here at all")).toBeNull();
  });
});

describe("filename pattern semantics", () => {
  it("matches a basename pattern against the basename, not the whole path", () => {
    expect(matchLanguage("deep/nested/compose.yml")?.id).toBe("dockercompose");
  });

  it("matches a path pattern against the whole path", () => {
    expect(matchLanguage(".github/hooks/pre-commit.json")?.id).toBe("jsonc");
    expect(matchLanguage("repo/.github/hooks/pre-commit.json")?.id).toBe("jsonc");
  });

  it("lets a double star cross segments", () => {
    expect(matchLanguage("a/b/.cursor/rules/x.mdc")?.id).toBe("markdown");
  });

  it("keeps a single star inside one segment", () => {
    expect(matchLanguage("Jenkinsfile.release")?.id).toBe("groovy");
    expect(matchLanguage("nested/Jenkinsfile.release")?.id).toBe("groovy");
  });

  it("matches the tsconfig family through a pattern rather than a filename", () => {
    expect(matchLanguage("tsconfig.build.json")?.id).toBe("jsonc");
    expect(matchLanguage("tsconfig.json")?.id).toBe("jsonc");
  });
});

describe("suffix tier", () => {
  it("prefers the longest suffix when two languages nest", () => {
    // .eslintrc.json (jsonc) nests .json (json); the compound suffix must win.
    expect(matchLanguage("a.eslintrc.json")?.id).toBe("jsonc");
    expect(matchLanguage("a.json")?.id).toBe("json");
  });

  it("prefers a compound suffix over its own tail", () => {
    expect(matchLanguage("a.prompt.md")?.id).toBe("prompt");
    expect(matchLanguage("a.instructions.md")?.id).toBe("instructions");
    expect(matchLanguage("a.agent.md")?.id).toBe("chatagent");
    expect(matchLanguage("a.md")?.id).toBe("markdown");
  });

  it("matches a compound xml suffix as one suffix, not as its tail", () => {
    expect(matchLanguage("a.csproj.user")?.id).toBe("xml");
    expect(matchLanguage("a.csproj")?.id).toBe("xml");
  });

  it("matches case-insensitively", () => {
    expect(matchLanguage("A.PY")?.id).toBe("python");
    expect(matchLanguage("A.PL")?.id).toBe("perl");
    expect(matchLanguage("A.R")?.id).toBe("r");
  });

  it("anchors the suffix to the end of the name", () => {
    expect(matchLanguage("a.py.bak")).toBeNull();
    expect(matchLanguage("a.py")).not.toBeNull();
  });

  it("does not let a suffix match inside a longer name", () => {
    expect(matchLanguage("python")).toBeNull();
  });

  it("normalises windows separators", () => {
    expect(baseName("C:\\repo\\src\\a.py")).toBe("a.py");
    expect(matchLanguage("C:\\repo\\src\\a.py")?.id).toBe("python");
  });
});

describe("override layer", () => {
  it("sends .h to c rather than cpp", () => {
    expect(matchLanguage("a.h")?.id).toBe("c");
  });

  it("keeps the rest of the cpp row intact after the move", () => {
    expect(matchLanguage("a.cpp")?.id).toBe("cpp");
    expect(matchLanguage("a.hpp")?.id).toBe("cpp");
    expect(matchLanguage("a.h.in")?.id).toBe("cpp");
  });

  it("sends .cfg to the explicit plaintext row", () => {
    const matched = matchLanguage("a.cfg");
    expect(matched?.id).toBe(PLAINTEXT_ID);
    expect(matched).not.toBeNull();
  });

  it("adds .mdx to the markdown row", () => {
    // The read-only surface already treats .mdx as markdown, so the catalogue
    // has to agree or markdown reading mode silently degrades to plaintext.
    expect(matchLanguage("a.mdx")?.id).toBe("markdown");
    expect(languageFor("a.mdx")).toBe("markdown");
  });

  it("leaves the markdown row's upstream suffixes untouched", () => {
    expect(matchLanguage("a.md")?.id).toBe("markdown");
    expect(matchLanguage("a.markdown")?.id).toBe("markdown");
    expect(matchLanguage("a.mkd")?.id).toBe("markdown");
  });

  it("does not take .mdx away from another language", () => {
    // .mdx is an addition, not a reassignment: nothing upstream claimed it.
    expect(SNAPSHOT.some((row) => row.extensions.includes(".mdx"))).toBe(false);
    expect(SUFFIX_INDEX.bySuffix.get(".mdx")).toBe("markdown");
  });

  it("keeps the markdown row's own glob pattern working", () => {
    expect(matchLanguage("a/b/.cursor/rules/x.mdc")?.id).toBe("markdown");
  });

  it("keeps the rest of the properties row intact after the move", () => {
    expect(matchLanguage("a.properties")?.id).toBe("properties");
    expect(matchLanguage("a.conf")?.id).toBe("properties");
    expect(matchLanguage("a.editorconfig")?.id).toBe("properties");
  });

  it("routes dockercompose patterns to the yaml grammar", () => {
    const compose = matchLanguage("compose.yaml");
    expect(compose?.id).toBe("dockercompose");
    expect(matchLanguage("plain.yaml")?.id).toBe("yaml");
  });
});

describe("meta extensions", () => {
  it("never lets the wildcard log entry claim a file", () => {
    // The worksheet carries `*.log.?` verbatim; it must not reach the index.
    expect(matchLanguage("a.log.1")).toBeNull();
    expect(matchLanguage("a.log.2026")).toBeNull();
  });

  it("still matches the real .log suffix", () => {
    expect(matchLanguage("a.log")?.id).toBe("log");
  });

  it("promotes bare filenames written in the extensions column", () => {
    // Upstream lists `language-configuration.json` in jsonc's extensions column;
    // VS Code treats it as an exact filename, so it must not be dropped.
    expect(matchLanguage("language-configuration.json")?.id).toBe("jsonc");
    expect(matchLanguage("icon-theme.json")?.id).toBe("jsonc");
    expect(matchLanguage("copilot-instructions.md")?.id).toBe("instructions");
  });

  it("does not let a bare filename act as a suffix", () => {
    expect(matchLanguage("xlanguage-configuration.json")?.id).toBe("json");
  });
});

describe("three outcomes", () => {
  it("returns a descriptor for a known file", () => {
    expect(matchLanguage("a.ts")?.id).toBe("typescript");
  });

  it("returns the explicit plaintext row for a decided-monochrome file", () => {
    expect(matchLanguage("a.txt")?.id).toBe(PLAINTEXT_ID);
    expect(matchLanguage("LICENSE")?.id).toBe(PLAINTEXT_ID);
  });

  it("returns null for a file nothing knows", () => {
    expect(matchLanguage("a.toml")).toBeNull();
    expect(matchLanguage("a.kt")).toBeNull();
  });
});
