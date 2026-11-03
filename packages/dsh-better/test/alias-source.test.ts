/**
 * The `/` alias source.
 *
 * The source is deliberately thin: all filtering lives in `alias-store.ts` and
 * the menu is the shipped one. These cases protect the two things it does own —
 * the display row shape (`wf  flow-workflow  参数：run`) and the pick text — plus
 * the leading-edge rule that keeps a mid-sentence `/wf` out of the menu.
 */
import { describe, expect, it } from "vitest";

import { createAliasSource, ALIAS_SOURCE_NAME, ALIAS_SOURCE_ORDER, ALIAS_SOURCE_TRIGGER } from "../src/client/alias-source.ts";
import type { AliasConfig } from "../src/client/alias-store.ts";

/** A translator with the two keys the source reads. */
function translate(key: string, params?: Record<string, string | number>): string {
  if (key === "alias.menu.section") return "技能别名";
  if (key === "alias.menu.params") return `参数：${params?.value ?? ""}`;
  return key;
}

/** A config with two aliases. */
const CONFIG: AliasConfig = {
  prefix: true,
  rows: [
    { id: "a", keyword: "wf", target: "flow-workflow", params: "run" },
    { id: "b", keyword: "gw", target: "git-work", params: "" },
  ],
};

/** The source over a fixed config. */
function source(config: AliasConfig = CONFIG, bareOpen = false) {
  return createAliasSource({ config: () => config, translate, bareMenuOpen: () => bareOpen });
}

/** One candidate request. */
function request(query: string, position: "leading" | "inline" = "leading") {
  return { query, position };
}

/** The session projection placeholder. */
const SESSION = { sessionId: "s1" };

describe("createAliasSource", () => {
  it("declares the slash trigger and participates before commands", () => {
    const built = source();
    expect(built.trigger).toBe(ALIAS_SOURCE_TRIGGER);
    expect(built.name).toBe(ALIAS_SOURCE_NAME);
    expect(built.order).toBe(ALIAS_SOURCE_ORDER);
  });

  it("lists exact matches first with keyword, target and params in the native row shape", async () => {
    const candidates = await source().candidates(SESSION, request("wf"));
    expect(candidates).toEqual([
      {
        name: "flow-workflow",
        label: "wf",
        description: "参数：run",
        section: "技能别名",
        value: "a",
      },
    ]);
  });

  it("lists every alias for an empty query so typing slash discovers them", async () => {
    const candidates = await source().candidates(SESSION, request(""));
    expect(candidates.map(item => item.label)).toEqual(["wf", "gw"]);
  });

  it("does not contribute inline", async () => {
    await expect(source().candidates(SESSION, request("wf", "inline"))).resolves.toEqual([]);
  });

  it("stays out of the slash menu when the prefix switch is off", async () => {
    const candidates = await source({ ...CONFIG, prefix: false }).candidates(SESSION, request("wf"));
    expect(candidates).toEqual([]);
  });

  it("still serves the synthetic menu the bare watcher opens", async () => {
    const candidates = await source({ ...CONFIG, prefix: false }, true).candidates(SESSION, request("wf"));
    expect(candidates.map(item => item.label)).toEqual(["wf"]);
  });

  it("picks into the canonical invocation", () => {
    const built = source();
    expect(built.onPick({ candidate: { name: "flow-workflow", value: "a" } })).toEqual({
      text: "/flow-workflow run ",
    });
  });

  it("ignores a candidate whose row disappeared while the menu was open", () => {
    const built = source({ prefix: true, rows: [] });
    expect(built.onPick({ candidate: { name: "flow-workflow", value: "a" } })).toBeUndefined();
  });

  it("filters case-insensitively", async () => {
    const candidates = await source().candidates(SESSION, request("WF"));
    expect(candidates).toHaveLength(1);
    expect(candidates[0]?.label).toBe("wf");
  });
});
