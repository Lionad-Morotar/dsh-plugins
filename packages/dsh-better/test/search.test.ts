/**
 * Provider search, pinned at the properties that make it shippable:
 *
 *   - with no provider named, the row order equals the host's own, because this
 *     code runs on every keystroke of a picker people use constantly;
 *   - a row is reachable by the provider it belongs to, by id or by the label the
 *     row actually renders;
 *   - naming one provider never drags in its siblings.
 */
import { describe, expect, it, vi } from "vitest";

import { flattenForDisplay, groupOptions } from "../src/client/groups.ts";
import { matchesProvider, providerNames, rankByProvider, type SearchableOption } from "../src/client/search.ts";

/** Build a row with the provider spelling the model-selection plugin uses. */
function row(id: string, label: string, group?: { name: string; label: string }, detail?: string): SearchableOption {
  return { id, label, group, detail };
}

/**
 * The rows a real profile produces. Both providers really are present in this
 * machine's profiles, and their labels share the prefix "DeepSeek", which is
 * exactly the shape that exposes a too-loose provider predicate.
 */
const ROWS: SearchableOption[] = [
  row("deepseek-account/deepseek-flash", "DeepSeek-V4.1-Flash", { name: "deepseek-account", label: "DeepSeek Account" }),
  row("deepseek-account/deepseek-v4-pro", "DeepSeek-V4-Pro", { name: "deepseek-account", label: "DeepSeek Account" }),
  row("deepseek-official/deepseek-flash", "DeepSeek-V4.1-Flash", { name: "deepseek-official", label: "DeepSeek" }),
  row("deepseek-official/deepseek-v4-pro", "DeepSeek-V4-Pro", { name: "deepseek-official", label: "DeepSeek" }),
];

/**
 * Stand-in for the host ranker: substring-filter the labels, then reverse.
 * If a subject ranked labels itself this stub would never run and the
 * assertions below would fail, which is what makes them meaningful.
 */
const stubRanker = vi.fn((entries: readonly { name: string; option: unknown }[], query: string) =>
  entries.filter((entry) => entry.name.toLowerCase().includes(query)).reverse(),
);

describe("providerNames", () => {
  it("has nothing to match on when a row carries no provider", () => {
    expect(providerNames(undefined)).toEqual([]);
  });

  it("offers the id and the display label, because a user cannot tell which one reached the DOM", () => {
    expect(providerNames({ name: "deepseek-account", label: "DeepSeek Account" })).toEqual([
      "deepseek-account",
      "deepseek account",
    ]);
  });

  it("collapses a label that merely repeats the id", () => {
    expect(providerNames({ name: "dsh-dk", label: "dsh-dk" })).toEqual(["dsh-dk"]);
  });

  it("ignores a blank label rather than letting it match every query", () => {
    expect(providerNames({ name: "dsh-dk", label: "   " })).toEqual(["dsh-dk"]);
  });
});

describe("matchesProvider", () => {
  it("matches a provider id that appears nowhere in the model name", () => {
    expect(matchesProvider(ROWS[0]!, "deepseek-account")).toBe(true);
  });

  it("matches a provider display label the row renders instead of its id", () => {
    expect(matchesProvider(ROWS[0]!, "account")).toBe(true);
  });

  it("matches an abbreviated provider token, which is how people type", () => {
    expect(matchesProvider(ROWS[2]!, "official")).toBe(true);
  });

  it("does not match a provider the row does not belong to", () => {
    expect(matchesProvider(ROWS[0]!, "official")).toBe(false);
  });

  it("does not drag in a sibling provider merely because the query contains its label", () => {
    // The bug this pins: `query.includes(name)` would make "deepseek-account"
    // match the sibling provider labelled "DeepSeek" too, silently merging two
    // providers into one result list.
    const matched = ROWS.filter((option) => matchesProvider(option, "deepseek-account"));
    expect(matched.map((option) => option.group?.name)).toEqual(["deepseek-account", "deepseek-account"]);
  });

  it("never matches a row with no provider", () => {
    expect(matchesProvider(row("failure/dsh-dk", "dsh-dk"), "dsh-dk")).toBe(false);
  });
});

describe("groupOptions", () => {
  it("keeps first-appearance order", () => {
    expect(groupOptions(ROWS).map((group) => group.group?.name)).toEqual(["deepseek-account", "deepseek-official"]);
  });

  it("collapses provider-less rows into one trailing group instead of one group each", () => {
    const withFailures = [...ROWS, row("failure/a", "a"), row("failure/b", "b")];
    const groups = groupOptions(withFailures);
    expect(groups).toHaveLength(3);
    expect(groups[2]!.group).toBeUndefined();
    expect(groups[2]!.rows).toHaveLength(2);
  });
});

describe("flattenForDisplay", () => {
  it("leaves an already-grouped list alone", () => {
    expect(flattenForDisplay(ROWS)).toEqual(ROWS);
  });

  it("pulls a provider's rows together when they arrive interleaved", () => {
    const interleaved = [ROWS[0]!, ROWS[2]!, ROWS[1]!];
    expect(flattenForDisplay(interleaved).map((option) => option.group?.name)).toEqual([
      "deepseek-account",
      "deepseek-account",
      "deepseek-official",
    ]);
  });

  it("leaves a provider-less list in the order it arrived", () => {
    const bare = [row("b", "b"), row("a", "a")];
    expect(flattenForDisplay(bare).map((option) => option.label)).toEqual(["b", "a"]);
  });
});

describe("rankByProvider without a provider in play", () => {
  it("returns the host display order for a blank query", () => {
    expect(rankByProvider(ROWS, "", "fuzzy-label")).toEqual(ROWS);
  });

  it("defers label ranking to the host, so fuzzy semantics are not reimplemented", () => {
    const ranked = rankByProvider(ROWS, "DeepSeek", "fuzzy-label", stubRanker);
    // Reversed inside each group by the stub; only observable if this module
    // really calls out rather than ranking labels itself.
    expect(ranked.map((option) => option.label)).toEqual([
      "DeepSeek-V4-Pro",
      "DeepSeek-V4.1-Flash",
      "DeepSeek-V4-Pro",
      "DeepSeek-V4.1-Flash",
    ]);
    // Once per provider group, not once for the list: the host ranks inside a
    // group and concatenates, so a flat single call would be a different search.
    expect(stubRanker).toHaveBeenCalledTimes(2);
  });

  it("falls back to label substrings when no host ranker is supplied", () => {
    expect(rankByProvider(ROWS, "V4-Pro", "fuzzy-label").map((option) => option.label)).toEqual([
      "DeepSeek-V4-Pro",
      "DeepSeek-V4-Pro",
    ]);
  });

  it("matches detail text in substring mode, mirroring the host", () => {
    const withDetail = [row("a/one", "one", { name: "p", label: "P" }, "Max"), row("b/two", "two", { name: "p", label: "P" })];
    expect(rankByProvider(withDetail, "Max", "substring").map((option) => option.label)).toEqual(["one"]);
  });

  it("does not match detail text in fuzzy mode, mirroring the host", () => {
    const withDetail = [row("a/one", "one", { name: "p", label: "P" }, "Max"), row("b/two", "two", { name: "p", label: "P" })];
    expect(rankByProvider(withDetail, "Max", "fuzzy-label", stubRanker)).toEqual([]);
  });

  it("returns nothing when neither a model nor a provider matches", () => {
    expect(rankByProvider(ROWS, "qwen", "fuzzy-label")).toEqual([]);
  });
});

describe("rankByProvider with a provider named", () => {
  it("returns every model under that provider, and only those", () => {
    expect(rankByProvider(ROWS, "deepseek-account", "fuzzy-label").map((option) => option.group?.name)).toEqual([
      "deepseek-account",
      "deepseek-account",
    ]);
  });

  it("reaches a provider by its display label", () => {
    expect(rankByProvider(ROWS, "Account", "fuzzy-label").map((option) => option.group?.name)).toEqual([
      "deepseek-account",
      "deepseek-account",
    ]);
  });

  it("keeps a provider's models contiguous instead of interleaving providers", () => {
    expect(rankByProvider(ROWS, "Official", "fuzzy-label").map((option) => option.group?.name)).toEqual([
      "deepseek-official",
      "deepseek-official",
    ]);
  });

  it("returns both providers when the query names the shared part", () => {
    expect(rankByProvider(ROWS, "deepseek", "fuzzy-label").map((option) => option.group?.name)).toEqual([
      "deepseek-account",
      "deepseek-account",
      "deepseek-official",
      "deepseek-official",
    ]);
  });

  it("does not duplicate a row reachable by both text and provider", () => {
    const ranked = rankByProvider(ROWS, "deepseek", "fuzzy-label");
    expect(new Set(ranked).size).toBe(ranked.length);
  });

  it("leaves the input array untouched", () => {
    const snapshot = [...ROWS];
    rankByProvider(ROWS, "deepseek", "fuzzy-label");
    expect(ROWS).toEqual(snapshot);
  });
});
