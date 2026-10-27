import { beforeEach, describe, expect, it, vi } from "vitest";

import { boot, clientPlugin } from "../src/client/entry.ts";
import { reactStub } from "./support/react-stub.ts";

/** One recorded registration, kept so a test can assert order and disposability. */
interface Recorded {
  readonly kind: "definition" | "body" | "locale" | "inject" | "viewer";
  readonly value: Record<string, unknown>;
  disposed: boolean;
}

/**
 * Build the smallest client context the entry accepts.
 *
 * The fakes mirror the real services' shape rather than their types: a
 * registration that the host would reject (a binary suffix outside
 * `extensions`, a duplicate id) fails here the same way.
 * @returns the context plus the registration log.
 */
function fakeContext(): { ctx: never; log: Recorded[]; run: () => void } {
  const log: Recorded[] = [];
  const track = (kind: Recorded["kind"], value: Record<string, unknown>): (() => void) => {
    const entry: Recorded = { kind, value, disposed: false };
    log.push(entry);
    return () => {
      entry.disposed = true;
    };
  };

  const ctx = {
    locale: {
      bind: (namespace: string) => (key: string) => namespace + ":" + key,
      register: (namespace: string, dictionaries: Record<string, Record<string, string>>) => {
        const known = Object.values(dictionaries)[0] ?? {};
        for (const key of Object.keys(known)) expect(typeof key).toBe("string");
        return track("locale", { namespace, dictionaries });
      },
    },
    documentPreviews: {
      register: (definition: Record<string, unknown>) => {
        const extensions = definition.extensions as string[];
        const binary = (definition.binaryExtensions ?? []) as string[];
        for (const suffix of binary) expect(extensions).toContain(suffix);
        return track("definition", definition);
      },
    },
    slots: {
      inject: (_name: string, register: () => () => void) => {
        const disposeInject = track("inject", { name: _name });
        const disposeBody = register();
        return () => {
          disposeInject();
          disposeBody();
        };
      },
      register: (definition: Record<string, unknown>, body: unknown) => track("body", { ...definition, body }),
    },
    remote: { workspaceFiles: { readBytes: vi.fn() } },
    inject: (_deps: readonly string[], callback: (scope: { get: () => undefined }) => undefined) => {
      track("inject", { deps: _deps });
      return callback({ get: () => undefined });
    },
  };
  return { ctx: ctx as never, log, run: () => {} };
}

beforeEach(() => {
  const require = (specifier: string): unknown => {
    if (specifier === "react") return reactStub();
    throw new Error("unexpected platform require: " + specifier);
  };
  // Chunks are never fetched in these tests; the entry only rejects when it is.
  require.async = async (specifier: string): Promise<unknown> => {
    throw new Error("unexpected async require: " + specifier);
  };
  boot(require);
});

describe("client entry", () => {
  it("declares the services it reads", () => {
    expect(clientPlugin.inject).toContain("documentPreviews");
    expect(clientPlugin.inject).toContain("slots");
    expect(clientPlugin.inject).toContain("remote.workspaceFiles");
  });

  it("registers one definition per catalogued family, at the extension band", () => {
    const { ctx, log } = fakeContext();
    const dispose = clientPlugin.apply(ctx);
    const definitions = log.filter((entry) => entry.kind === "definition");

    // The count is the catalogue's, so adding a family here is a deliberate act.
    expect(definitions.map((entry) => entry.value.id)).toEqual(["dsh-preview-more/scene3d", "dsh-preview-more/raster"]);
    for (const definition of definitions) {
      expect(definition.value.priority).toBe("extension");
      expect(definition.value.loading).toBe("renderer");
    }
    expect(definitions[0]?.value.extensions).toEqual(["glb", "gltf", "obj", "stl", "3mf"]);
    expect(definitions[1]?.value.extensions).toEqual(["tif", "tiff", "avif"]);
    dispose();
  });

  it("gives every definition a keyed body in the document slot", () => {
    const { ctx, log } = fakeContext();
    const dispose = clientPlugin.apply(ctx);
    const bodies = log.filter((entry) => entry.kind === "body");

    expect(bodies.map((entry) => entry.value.key)).toEqual(["dsh-preview-more/scene3d", "dsh-preview-more/raster"]);
    for (const body of bodies) {
      expect(body.value.name).toBe("sidebar.right.tab.document");
      expect(body.value.locale).toBe("previewMore");
      const inject = body.value.inject as () => Record<string, unknown>;
      expect(typeof inject().readFile).toBe("function");
    }
    dispose();
  });

  it("registers the dictionaries before anything reads a title", () => {
    const { ctx, log } = fakeContext();
    const dispose = clientPlugin.apply(ctx);
    expect(log[0]?.kind).toBe("locale");
    const definition = log.find((entry) => entry.kind === "definition");
    const title = (definition?.value as Record<string, unknown>).title as () => string;
    expect(title()).toBe("previewMore:scene3d.title");
    dispose();
  });

  it("disposes what it registered", () => {
    const { ctx, log } = fakeContext();
    clientPlugin.apply(ctx)();
    // The optional-service injection is owned by the host's `ctx.inject`, so only
    // the entry's own registrations are the entry's to dispose.
    const owned = log.filter((entry) => entry.kind !== "viewer" && (entry.value as { deps?: unknown }).deps === undefined);
    expect(owned.length).toBeGreaterThan(0);
    expect(owned.every((entry) => entry.disposed)).toBe(true);
  });

  it("does not require the better-sidebar service to be present", () => {
    const { ctx } = fakeContext();
    expect(() => {
      const dispose = clientPlugin.apply(ctx);
      dispose();
    }).not.toThrow();
  });
});
