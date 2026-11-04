/**
 * The registration contract: what this plugin claims, and how a repeat apply
 * replaces the previous claim instead of colliding with it.
 */
import { describe, expect, it } from "vitest";

import type { FsExplorerService, RendererContribution } from "../src/client/contracts.ts";
import { TEXT_NAMES } from "../src/client/claims.ts";
import { apply, inject, MARKDOWN_RENDERER, TEXT_RENDERER } from "../src/client/entry.ts";

interface Harness {
  readonly service: FsExplorerService;
  readonly contributions: RendererContribution[];
  readonly calls: string[];
}

/** A stand-in for the explorer's registry, recording the registration order. */
function harness(): Harness {
  const contributions: RendererContribution[] = [];
  const calls: string[] = [];
  return {
    contributions,
    calls,
    service: {
      registerRenderer(contribution) {
        calls.push(`register:${contribution.id}`);
        contributions.push(contribution);
        return () => {
          calls.push(`dispose:${contribution.id}`);
        };
      },
    },
  };
}

describe("markdown contribution", () => {
  it("claims both Markdown suffixes above the built-in reader", () => {
    const h = harness();
    const dispose = apply({ fsExplorer: h.service });

    expect(h.contributions).toHaveLength(2);
    const contribution = h.contributions[0]!;
    expect(contribution.id).toBe("markdown");
    expect(contribution.label).toBe("Markdown");
    expect(contribution.match.extensions).toEqual([".md", ".markdown"]);
    expect(contribution.priority).toBe(10);

    dispose();
  });

  it("loads a module whose renderer marker names the engine", async () => {
    const h = harness();
    const dispose = apply({ fsExplorer: h.service });

    const module = await h.contributions[0]!.load();
    expect(module.renderer).toBe("markdown");
    expect(typeof module.Body).toBe("function");

    dispose();
  });

  it("disposes the previous registrations before a repeat apply", () => {
    const h = harness();
    const first = apply({ fsExplorer: h.service });
    apply({ fsExplorer: h.service });

    expect(h.calls).toEqual([
      "register:markdown",
      "register:text-editor",
      "dispose:markdown",
      "dispose:text-editor",
      "register:markdown",
      "register:text-editor",
    ]);
    first();
  });

  it("unregisters both renderers when the returned disposer runs", () => {
    const h = harness();
    const dispose = apply({ fsExplorer: h.service });
    dispose();

    expect(h.calls).toEqual([
      "register:markdown",
      "register:text-editor",
      "dispose:markdown",
      "dispose:text-editor",
    ]);
  });

  it("warns and does nothing when the explorer service is absent", () => {
    const warnings: string[] = [];
    const dispose = apply({ logger: { warn: message => warnings.push(message) } });

    expect(warnings).toHaveLength(1);
    expect(warnings[0]).toContain("fsExplorer");
    expect(() => dispose()).not.toThrow();
  });

  it("waits for the explorer and the remote carrier", () => {
    expect(inject).toContain("fsExplorer");
    expect(inject).toContain("remote");
  });

  it("keeps one contribution object per claim regardless of how many applies happen", () => {
    const h = harness();
    apply({ fsExplorer: h.service });
    apply({ fsExplorer: h.service });
    expect(h.contributions[2]).toBe(MARKDOWN_RENDERER);
    expect(h.contributions[3]).toBe(TEXT_RENDERER);
  });
});

describe("text-editor contribution", () => {
  it("outranks the read-only source view but not the Markdown claim", () => {
    // The window matters: below Markdown's 10 so a .md stays Markdown's, above
    // the explorer's catch-all at -1000 so a .ts stops being read-only.
    expect(TEXT_RENDERER.priority).toBe(5);
    expect(TEXT_RENDERER.priority!).toBeLessThan(MARKDOWN_RENDERER.priority!);
    expect(TEXT_RENDERER.priority!).toBeGreaterThan(-1000);
  });

  it("claims text suffixes and never the Markdown ones", () => {
    const claimed = new Set(TEXT_RENDERER.match.extensions ?? []);
    expect(claimed.has(".ts")).toBe(true);
    expect(claimed.has(".json")).toBe(true);
    expect(claimed.has(".yml")).toBe(true);
    expect(claimed.has(".md")).toBe(false);
    expect(claimed.has(".markdown")).toBe(false);
  });

  it("carries the suffix-less names on the names dimension", () => {
    // These files have no dot, so a suffix claim can never reach them. The list
    // has to reach the registry as names or the editor silently never wins them,
    // which is exactly how Makefile stayed read-only while looking claimed.
    expect(TEXT_RENDERER.match.names).toEqual([...TEXT_NAMES]);
    expect(TEXT_RENDERER.match.names).toContain("makefile");
    // And they must not be smuggled in as suffixes, which would match nothing.
    const extensions = new Set(TEXT_RENDERER.match.extensions ?? []);
    for (const name of TEXT_NAMES) {
      expect(extensions.has(`.${name}`), name).toBe(false);
    }
  });

  it("claims no binary family suffix", () => {
    // A binary file belongs to its own renderer; an editor over a png would
    // decode it as text and offer to save the mojibake.
    const claimed = new Set(TEXT_RENDERER.match.extensions ?? []);
    for (const suffix of [".png", ".jpg", ".svg", ".pdf", ".glb", ".dxf", ".tif"]) {
      expect(claimed.has(suffix), suffix).toBe(false);
    }
  });

  it("loads a body whose marker names the text editor", async () => {
    const module = await TEXT_RENDERER.load();
    expect(module.renderer).toBe("text-editor");
    expect(typeof module.Body).toBe("function");
  });
});
