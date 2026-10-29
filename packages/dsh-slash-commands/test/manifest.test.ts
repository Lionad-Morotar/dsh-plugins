import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import manifest from "../dsh-plugin.json" with { type: "json" };
import { ARCHIVE_COMMAND_NAME, UNARCHIVE_COMMAND_NAME } from "../src/archive.ts";
import { COPY_COMMAND_NAME } from "../src/command.ts";
import { RENAME_COMMAND_NAME } from "../src/rename.ts";

const packageRoot = join(dirname(fileURLToPath(import.meta.url)), "..");

describe("the admission manifest", () => {
  it("declares the commands the plugin actually registers", () => {
    const ids = manifest.contributes.commands.map((command: { id: string }) => command.id);
    // The host resolves a command by the last dotted segment of its declared
    // contribution id, so a mismatch here is a command that never dispatches.
    expect(ids.map((id: string) => id.split(".").at(-1))).toEqual([
      COPY_COMMAND_NAME,
      RENAME_COMMAND_NAME,
      ARCHIVE_COMMAND_NAME,
      UNARCHIVE_COMMAND_NAME,
    ]);
  });

  it("scopes commands.invoke to exactly those contributions", () => {
    const scopes = manifest.permissions
      .filter((permission: { name: string }) => permission.name === "commands.invoke")
      .map((permission: { scope: string }) => permission.scope);
    expect(scopes).toEqual(manifest.contributes.commands.map((command: { id: string }) => command.id));
  });

  it("requires the contract its command registration needs", () => {
    expect(manifest.requires.contracts).toContainEqual({ apiVersion: "commands.dsh/v1alpha1", kind: "Command" });
  });

  it("points the host facet at the shipped entry the package actually exports", () => {
    const packageJson = JSON.parse(readFileSync(join(packageRoot, "package.json"), "utf8"));
    expect(manifest.facets.host.apiVersion).toBe("v1alpha1");
    expect(manifest.facets.host.entry.replace(/^\.\//u, "")).toBe(packageJson.main);
  });

  it("stays on the pinned community manifest version", () => {
    expect(manifest.manifestVersion).toBe("0.15");
    expect(manifest.subscriptions).toEqual([]);
  });
});