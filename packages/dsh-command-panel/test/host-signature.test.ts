/**
 * The host bundle's wire contract, read straight from the committed artifact.
 *
 * The gateway describes a Remote method by parsing the running function's
 * parameter names: minified identifiers break every call, and only a literal
 * trailing `signal` is treated as cancellation. Both failures are invisible to
 * unit tests of the service itself — they only exist in the built `lib/`, so
 * that is what this spec reads.
 */
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const libRoot = join(dirname(fileURLToPath(import.meta.url)), "..", "lib");

describe("host bundle wire signatures", () => {
  it("keeps the resolve descriptor's parameter names readable and signal-named", async () => {
    const bundle = await readFile(join(libRoot, "index.js"), "utf8");
    expect(bundle).toMatch(/async resolve\(request, signal\)/);
    expect(bundle).not.toMatch(/async resolve\(\s*[a-zA-Z$_]\s*,/);
  });

  it("ships the quit capability probe beside the request endpoint", async () => {
    const bundle = await readFile(join(libRoot, "index.js"), "utf8");
    expect(bundle).toMatch(/async available\(\)/);
    expect(bundle).toMatch(/async request\(\)/);
  });
});
