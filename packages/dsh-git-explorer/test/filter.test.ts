import { describe, expect, it } from "vitest";

import { filterChangeGroups } from "../src/client/filter.ts";
import { groupChanges } from "../src/client/model.ts";

const STATUS = [
  "1 .M N... 100644 100644 100644 hh ii src/client/view.tsx",
  "1 .M N... 100644 100644 100644 hh ii src/client/model.ts",
  "1 .M N... 100644 100644 100644 hh ii src/host/query.ts",
  "? README.md",
].join("\0") + "\0";

describe("filterChangeGroups", () => {
  const groups = groupChanges(STATUS);

  it("keeps the full list for an empty or whitespace-only query", () => {
    expect(filterChangeGroups(groups, "")).toEqual(groups);
    expect(filterChangeGroups(groups, "   ")).toEqual(groups);
  });

  it("matches a path substring case-insensitively", () => {
    const filtered = filterChangeGroups(groups, "host/QUERY");
    expect(filtered.flatMap(group => group.files.map(file => file.path))).toEqual(["src/host/query.ts"]);
  });

  it("matches a directory name because the directory is part of the path", () => {
    const filtered = filterChangeGroups(groups, "client");
    expect(filtered.flatMap(group => group.files.map(file => file.path))).toEqual(["src/client/model.ts", "src/client/view.tsx"]);
  });

  it("keeps the directory a surviving file belongs to", () => {
    // Grouping is the pane's statement about where a file lives; a filter that
    // collapsed the kept rows into one bucket would answer a different question.
    const filtered = filterChangeGroups(groups, "query");
    expect(filtered.map(group => group.dir)).toEqual(["src/host"]);
    expect(filtered[0]?.files.map(file => file.path)).toEqual(["src/host/query.ts"]);
  });

  it("drops a group whose every file was filtered out", () => {
    const filtered = filterChangeGroups(groups, "README");
    expect(filtered.map(group => group.dir)).toEqual([""]);
  });

  it("reports nothing for a query that matches no path", () => {
    expect(filterChangeGroups(groups, "no-such-path")).toEqual([]);
  });
});
