/**
 * The renderer registry's selection rules.
 *
 * Selection is the only place where a plugin can win or lose a file, so it is
 * the one place worth pinning down in Node: suffix and family matching, the
 * priority/id order, duplicate ids, and the promise that a losing renderer is
 * never fetched.
 */
import { describe, expect, it, vi } from "vitest";

import { extensionsOf, families } from "dsh-preview-viewers/formats.ts";

import { apply } from "../src/client/entry.ts";
import { isMarkdownFile } from "../src/client/preview.ts";
import { createBuiltinRenderers } from "../src/client/preview-pane.tsx";
import {
  createRendererRegistry,
  loadRenderer,
  type FsExplorerService,
  type RendererContribution,
  type RendererModule,
} from "../src/client/renderer-registry.ts";

/** A module that draws nothing; the tests only read identity and call counts. */
function moduleOf(): RendererModule {
  return { Body: () => null };
}

/** One contribution with the defaults these tests do not care about. */
function contributionOf(id: string, overrides: Partial<RendererContribution> = {}): RendererContribution {
  return {
    id,
    label: overrides.label ?? id,
    match: overrides.match ?? { extensions: [".md"] },
    ...(overrides.priority === undefined ? {} : { priority: overrides.priority }),
    load: overrides.load ?? (async () => moduleOf()),
  };
}

/** Register a contribution; the built-in table is installed the same way. */
function install(registry: ReturnType<typeof createRendererRegistry>, contribution: RendererContribution): void {
  registry.register(contribution);
}

describe("renderer matching", () => {
  it("compares suffixes lowercased and with the dot", () => {
    const registry = createRendererRegistry();
    registry.register(contributionOf("md"));

    expect(registry.resolve({ path: "README.MD" })?.id).toBe("md");
    expect(registry.resolve({ path: "docs/notes.md" })?.id).toBe("md");
    expect(registry.resolve({ path: "notes.mdx" })).toBeUndefined();
    expect(registry.resolve({ path: "notes.md.bak" })).toBeUndefined();
    expect(registry.resolve({ path: "Makefile" })).toBeUndefined();
    // A leading dot names a dotfile, not a suffix: the format catalogue reads
    // names the same way, so both must agree.
    expect(registry.resolve({ path: ".md" })).toBeUndefined();
  });

  it("accepts a suffix declared without its leading dot", () => {
    const registry = createRendererRegistry();
    registry.register(contributionOf("bare", { match: { extensions: ["MD"] } }));

    expect(registry.resolve({ path: "a.md" })?.id).toBe("bare");
  });

  it("matches families through familyOf", () => {
    const registry = createRendererRegistry();
    registry.register(contributionOf("scene", { match: { families: ["scene3d"] } }));

    expect(registry.resolve({ path: "models/robot.glb" })?.id).toBe("scene");
    expect(registry.resolve({ path: "models/scan.tif" })).toBeUndefined();
  });

  it("matches a suffix-less name through the names dimension", () => {
    // A name with no dot has no suffix to match, so a suffix-only claim can
    // never reach it. That is what left Makefile read-only while the editor
    // believed it had claimed it.
    const registry = createRendererRegistry();
    registry.register(contributionOf("editor", { match: { names: ["Makefile", "dockerfile"] }, priority: 5 }));

    expect(registry.resolve({ path: "Makefile" })?.id).toBe("editor");
    expect(registry.resolve({ path: "build/Makefile" })?.id).toBe("editor");
    expect(registry.resolve({ path: "Dockerfile" })?.id).toBe("editor");
    // Compared on the basename, lowercased, like every other dimension.
    expect(registry.resolve({ path: "deploy/DOCKERFILE" })?.id).toBe("editor");
    expect(registry.resolve({ path: "README" })).toBeUndefined();
  });

  it("does not let a names claim reach a file that has a suffix", () => {
    // `Makefile` is a name; `Makefile.bak` is a different file with a suffix, and
    // a name claim must not swallow it.
    const registry = createRendererRegistry();
    registry.register(contributionOf("editor", { match: { names: ["makefile"] }, priority: 5 }));

    expect(registry.resolve({ path: "Makefile" })?.id).toBe("editor");
    expect(registry.resolve({ path: "Makefile.bak" })).toBeUndefined();
  });

  it("does not let a names claim reach a dotfile", () => {
    // A leading dot names a dotfile rather than a suffix, but it is still not
    // the bare name the claim lists.
    const registry = createRendererRegistry();
    registry.register(contributionOf("editor", { match: { names: ["gitignore"] }, priority: 5 }));

    expect(registry.resolve({ path: ".gitignore" })).toBeUndefined();
  });

  it("treats a dimension-less match as the catch-all", () => {
    const registry = createRendererRegistry();
    registry.register(contributionOf("source", { match: {}, priority: -1000 }));
    registry.register(contributionOf("markdown", { match: { extensions: [".md"] }, priority: 0 }));

    expect(registry.resolve({ path: "src/main.ts" })?.id).toBe("source");
    expect(registry.resolve({ path: "Makefile" })?.id).toBe("source");
    expect(registry.resolve({ path: "README.md" })?.id).toBe("markdown");
  });
});

describe("renderer ordering", () => {
  it("prefers the larger priority, then the smaller id", () => {
    const registry = createRendererRegistry();
    registry.register(contributionOf("z-low", { priority: 1 }));
    registry.register(contributionOf("b-tie", { priority: 5 }));
    registry.register(contributionOf("a-tie", { priority: 5 }));

    expect(registry.resolve({ path: "x.md" })?.id).toBe("a-tie");
  });

  it("answers undefined when nothing claims the file", () => {
    const registry = createRendererRegistry();
    registry.register(contributionOf("md"));

    expect(registry.resolve({ path: "src/main.ts" })).toBeUndefined();
    expect(createRendererRegistry().resolve({ path: "src/main.ts" })).toBeUndefined();
  });
});

describe("renderer registration", () => {
  it("keeps the first registration of a duplicate id and reports it", () => {
    const warn = vi.fn();
    const registry = createRendererRegistry({ warn });
    const first = contributionOf("builtin.markdown", { label: "first" });
    const off = registry.register(first);
    const duplicate = registry.register(contributionOf("builtin.markdown", { label: "second" }));

    expect(registry.snapshot()).toHaveLength(1);
    expect(registry.snapshot()[0]?.label).toBe("first");
    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn.mock.calls[0]?.[0]).toContain("builtin.markdown");

    duplicate();
    expect(registry.resolve({ path: "a.md" })).toBe(first);
    off();
    expect(registry.resolve({ path: "a.md" })).toBeUndefined();
  });

  it("notifies subscribers on register and dispose, once per change", () => {
    const registry = createRendererRegistry();
    const listener = vi.fn();
    const off = registry.subscribe(listener);
    const dispose = registry.register(contributionOf("a"));

    dispose();
    dispose();
    off();
    registry.register(contributionOf("b"));

    expect(listener).toHaveBeenCalledTimes(2);
  });

  it("snapshots registrations in order as a frozen copy", () => {
    const registry = createRendererRegistry();
    registry.register(contributionOf("first"));
    registry.register(contributionOf("second", { match: { extensions: [".txt"] } }));

    const snapshot = registry.snapshot();
    expect(snapshot.map(contribution => contribution.id)).toEqual(["first", "second"]);
    expect(Object.isFrozen(snapshot)).toBe(true);
    expect(() => (snapshot as RendererContribution[]).push(contributionOf("third"))).toThrow();
    expect(registry.snapshot().map(contribution => contribution.id)).toEqual(["first", "second"]);
  });
});

describe("renderer loading", () => {
  it("loads only the winner", async () => {
    const registry = createRendererRegistry();
    const loser = vi.fn(async () => moduleOf());
    const winner = vi.fn(async () => moduleOf());
    registry.register(contributionOf("loser", { priority: 1, load: loser }));
    registry.register(contributionOf("winner", { priority: 2, load: winner }));

    const selection = loadRenderer(registry, { path: "docs/readme.md" });

    expect(selection?.contribution.id).toBe("winner");
    await selection?.module;
    expect(winner).toHaveBeenCalledTimes(1);
    expect(loser).not.toHaveBeenCalled();
  });

  it("leaves the contribution in place when load fails, so it can be retried", async () => {
    const registry = createRendererRegistry();
    const load = vi
      .fn<() => Promise<RendererModule>>()
      .mockRejectedValueOnce(new Error("chunk 404"))
      .mockResolvedValueOnce(moduleOf());
    registry.register(contributionOf("flaky", { load }));

    const first = loadRenderer(registry, { path: "a.md" });
    await expect(first?.module).rejects.toThrow("chunk 404");

    const second = loadRenderer(registry, { path: "a.md" });
    await expect(second?.module).resolves.toHaveProperty("Body");
    expect(load).toHaveBeenCalledTimes(2);
  });

  it("turns a synchronous throw from load into a rejection", async () => {
    const registry = createRendererRegistry();
    registry.register(
      contributionOf("broken", {
        load: () => {
          throw new Error("no loader");
        },
      }),
    );

    const selection = loadRenderer(registry, { path: "a.md" });
    await expect(selection?.module).rejects.toThrow("no loader");
  });

  it("answers undefined without touching any load when nothing matches", () => {
    const load = vi.fn(async () => moduleOf());
    const registry = createRendererRegistry();
    registry.register(contributionOf("md", { load }));

    expect(loadRenderer(registry, { path: "a.ts" })).toBeUndefined();
    expect(load).not.toHaveBeenCalled();
  });
});

describe("built-in renderers", () => {
  it("cover every Markdown suffix, every family and the source catch-all", () => {
    const registry = createRendererRegistry();
    for (const contribution of createBuiltinRenderers()) install(registry, contribution);

    for (const suffix of ["md", "mdx", "markdown", "mdown"]) {
      expect(isMarkdownFile(`README.${suffix}`)).toBe(true);
      expect(registry.resolve({ path: `README.${suffix.toUpperCase()}` })?.id).toBe("builtin.markdown");
    }
    for (const family of families()) {
      const suffix = extensionsOf(family)[0];
      expect(suffix, family).toBeDefined();
      expect(registry.resolve({ path: `asset.${String(suffix)}` })?.id).toBe(`builtin.family.${family}`);
    }
    expect(registry.resolve({ path: "src/main.ts" })?.id).toBe("builtin.source");
    expect(registry.resolve({ path: "Makefile" })?.id).toBe("builtin.source");
  });

  it("defer to a plugin that outranks them", () => {
    const registry = createRendererRegistry();
    for (const contribution of createBuiltinRenderers()) install(registry, contribution);
    registry.register(contributionOf("plugin.markdown", { priority: 100 }));

    expect(registry.resolve({ path: "README.md" })?.id).toBe("plugin.markdown");
  });

  it("fetch their engines through the loader require instead of the entry", async () => {
    const registry = createRendererRegistry();
    for (const contribution of createBuiltinRenderers()) install(registry, contribution);

    // The loader require is only handed over by the build wrapper; without it
    // the built-ins must refuse rather than carry an editor in the entry.
    await expect(registry.resolve({ path: "README.md" })?.load()).rejects.toThrow("loader require");
    await expect(registry.resolve({ path: "asset.glb" })?.load()).rejects.toThrow("loader require");
  });

  it("lets an editor claim a suffix-less name the catch-all used to hold", () => {
    // The end-to-end shape of the bug this dimension fixes: an editor that lists
    // `Makefile` as a name must actually win it from the catch-all. Asserting the
    // helper alone is what let the claim look correct while the file stayed
    // read-only, so this goes through the real registry.
    const registry = createRendererRegistry();
    for (const contribution of createBuiltinRenderers()) install(registry, contribution);
    registry.register(
      contributionOf("text-editor", {
        match: { extensions: [".ts"], names: ["makefile", "dockerfile"] },
        priority: 5,
      }),
    );

    expect(registry.resolve({ path: "Makefile" })?.id).toBe("text-editor");
    expect(registry.resolve({ path: "build/Dockerfile" })?.id).toBe("text-editor");
    // A name the editor did not list still falls through to the catch-all.
    expect(registry.resolve({ path: "LICENSE" })?.id).toBe("builtin.source");
  });

  it("keeps the source catch-all as the answer when no editor plugin is installed", async () => {
    // This is the uninstall story: without dsh-fs-markdown a .ts still opens,
    // just read-only. A catch-all that lost to nothing would leave the pane blank.
    const registry = createRendererRegistry();
    for (const contribution of createBuiltinRenderers()) install(registry, contribution);

    const winner = registry.resolve({ path: "src/main.ts" });
    expect(winner?.id).toBe("builtin.source");
    expect(winner?.priority).toBe(-1000);
  });

  it("lets an editor plugin outrank the source catch-all without touching it", () => {
    // The seam this depends on: a plugin claims the text suffixes at a priority
    // between the catch-all and the Markdown renderer, and the built-in table is
    // not modified to make room for it.
    const registry = createRendererRegistry();
    for (const contribution of createBuiltinRenderers()) install(registry, contribution);
    registry.register(contributionOf("text-editor", { match: { extensions: [".ts", ".json"] }, priority: 5 }));

    expect(registry.resolve({ path: "src/main.ts" })?.id).toBe("text-editor");
    expect(registry.resolve({ path: "a.json" })?.id).toBe("text-editor");
    // A suffix the plugin did not claim still falls through to the catch-all.
    expect(registry.resolve({ path: "a.py" })?.id).toBe("builtin.source");
    // And the built-in Markdown renderer keeps its own suffixes.
    expect(registry.resolve({ path: "README.md" })?.id).toBe("builtin.markdown");
  });

  it("never lets a text claim take a binary family file", () => {
    // Family matching is a separate dimension: a png resolves to its family
    // renderer whatever a text plugin lists, because the plugin lists suffixes.
    const registry = createRendererRegistry();
    for (const contribution of createBuiltinRenderers()) install(registry, contribution);
    registry.register(contributionOf("text-editor", { match: { extensions: [".ts"] }, priority: 5 }));

    expect(registry.resolve({ path: "a.png" })?.id).toBe("builtin.family.image");
    expect(registry.resolve({ path: "a.pdf" })?.id).toBe("builtin.family.pdf");
  });
});

describe("client service", () => {
  it("provides fsExplorer and routes registerRenderer into the pane's registry", () => {
    const provided = new Map<string, unknown>();
    const ctx = {
      slots: {
        inject: (_name: string, factory: () => () => void) => {
          factory();
          return () => {};
        },
        register: () => () => {},
      },
      locale: {
        register: () => () => {},
        bind: () => (key: string) => key,
      },
      workbench: {
        version: 1,
        currentSessionId: () => undefined,
        openViewOrSwitch: () => ({ opened: false, focused: false }),
      },
      workspaceFiles: { list: async () => ({ ok: true, value: { entries: [], truncated: false } }) },
      provide: (name: string, value: unknown) => {
        provided.set(name, value);
        return () => provided.delete(name);
      },
    };

    const dispose = apply(ctx as never);
    const service = provided.get("fsExplorer") as FsExplorerService | undefined;

    expect(service).toBeDefined();
    expect(service?.renderers.resolve({ path: "README.md" })?.id).toBe("builtin.markdown");

    const off = service?.registerRenderer(
      contributionOf("test.renderer", { match: { extensions: [".ts"] }, priority: 10 }),
    );
    expect(service?.renderers.resolve({ path: "src/main.ts" })?.id).toBe("test.renderer");
    off?.();
    expect(service?.renderers.resolve({ path: "src/main.ts" })?.id).toBe("builtin.source");

    dispose();
    expect(provided.has("fsExplorer")).toBe(false);
  });
});
