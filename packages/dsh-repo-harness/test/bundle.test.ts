import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { pathToFileURL } from "node:url";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const here = dirname(fileURLToPath(import.meta.url));
const bundle = join(here, "..", "lib", "index.js");

describe("shipped bundle", () => {
  it("is the plugin object the Loader receives", async () => {
    expect(existsSync(bundle)).toBe(true);
    const module = (await import(pathToFileURL(bundle).href)) as {
      name?: unknown;
      inject?: unknown;
      apply?: unknown;
      Config?: (value: unknown) => unknown;
    };
    expect(module.name).toBe("repo-harness");
    expect(module.inject).toEqual(["agents", "subprocess"]);
    expect(typeof module.apply).toBe("function");
    expect(typeof module.Config).toBe("function");
    const parsed = module.Config?.({}) as { mergeSteer: { pollMs: number } };
    expect(parsed.mergeSteer.pollMs).toBe(15_000);
  });
});
