/**
 * The registration contract: what this plugin claims, and how a repeat apply
 * replaces the previous claim instead of colliding with it.
 */
import { describe, expect, it } from "vitest";

import type { FsExplorerService, RendererContribution } from "../src/client/contracts.ts";
import { apply, inject, MARKDOWN_RENDERER } from "../src/client/entry.ts";

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

    expect(h.contributions).toHaveLength(1);
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

  it("disposes the previous registration before a repeat apply", () => {
    const h = harness();
    const first = apply({ fsExplorer: h.service });
    apply({ fsExplorer: h.service });

    expect(h.calls).toEqual(["register:markdown", "dispose:markdown", "register:markdown"]);
    first();
  });

  it("unregisters the renderer when the returned disposer runs", () => {
    const h = harness();
    const dispose = apply({ fsExplorer: h.service });
    dispose();

    expect(h.calls).toEqual(["register:markdown", "dispose:markdown"]);
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

  it("keeps one contribution object regardless of how many applies happen", () => {
    const h = harness();
    apply({ fsExplorer: h.service });
    apply({ fsExplorer: h.service });
    expect(h.contributions[1]).toBe(MARKDOWN_RENDERER);
  });
});
