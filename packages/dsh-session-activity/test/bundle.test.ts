/**
 * The bundle as the loader actually receives it.
 *
 * `lib/client.js` is a committed build product, and every failure mode here is
 * silent at build time: a wrapper whose id stops matching the package name, a
 * factory that returns the wrong object, a client half that never mounts its
 * stylesheet. So this case evaluates the real file against a fake loader and a
 * fake page, then mounts it.
 */
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const bundle = readFileSync(join(here, "..", "lib", "client.js"), "utf8");

/** One `__ModuleLoader__.load` call, captured from the fake window. */
interface LoadCall {
  readonly id: string;
  readonly factory: (require: (specifier: string) => unknown) => unknown;
}

/** The plugin object the factory is required to return. */
interface Plugin {
  readonly name: string;
  readonly inject: readonly string[];
  apply(ctx: unknown, config?: unknown): () => void;
}

/** One `<style>` element as the bundle creates it. */
class FakeStyleElement {
  readonly attributes = new Map<string, string>();
  textContent = "";
  parent: { children: FakeStyleElement[] } | undefined;

  setAttribute(name: string, value: string): void {
    this.attributes.set(name, value);
  }

  remove(): void {
    if (this.parent === undefined) return;
    const index = this.parent.children.indexOf(this);
    if (index >= 0) this.parent.children.splice(index, 1);
  }
}

/** A page exposing only what the client half touches. */
function fakePage(): { document: unknown; children: FakeStyleElement[] } {
  const head: { children: FakeStyleElement[]; appendChild(element: FakeStyleElement): void } = {
    children: [],
    appendChild(element) {
      element.parent = head;
      head.children.push(element);
    },
  };
  const document = {
    head,
    createElement: () => new FakeStyleElement(),
  };
  return { document, children: head.children };
}

/**
 * Evaluate the bundle the way the page does.
 * @param document - the page the client half will mount into.
 * @returns the recorded load call.
 */
function evaluate(document: unknown): LoadCall {
  let call: LoadCall | undefined;
  const window = {
    __ModuleLoader__: {
      load: (value: LoadCall) => {
        call = value;
      },
    },
  };
  new Function("window", "document", bundle)(window, document);
  if (call === undefined) throw new Error("bundle never called __ModuleLoader__.load");
  return call;
}

/** A host double: one running session inside one workspace, no archive set. */
function host(): unknown {
  return {
    sessions: {
      list: {
        getSnapshot: () => ({
          ids: ["s1"],
          byId: { s1: { running: true, updatedAt: 0, projectionValues: {} } },
          projectionsBySession: {},
        }),
        subscribe: () => () => {},
      },
    },
    workspaces: {
      list: {
        getSnapshot: () => ({
          items: [{ workspaceId: "w1", path: "/tmp/w1", title: "w1", sessionIds: ["s1"], createdAt: "2026-01-01T00:00:00.000Z" }],
          archivedSessionIds: [],
        }),
        subscribe: () => () => {},
      },
    },
  };
}

/** Let the mount's queued recompute run. */
async function flush(): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 0));
}

describe("client bundle", () => {
  it("registers under the package name and hands back the plugin object", () => {
    const call = evaluate(fakePage().document);
    expect(call.id).toBe("dsh-session-activity");
    const plugin = call.factory(() => ({})) as Plugin;
    expect(plugin.name).toBe("dsh-session-activity");
    expect(plugin.inject).toEqual(["sessions", "workspaces"]);
    expect(plugin.inject).toContain("sessions");
    expect(typeof plugin.apply).toBe("function");
  });

  it("mounts a stylesheet that tints a workspace title and no session row", async () => {
    const page = fakePage();
    const plugin = evaluate(page.document).factory(() => ({})) as Plugin;
    const dispose = plugin.apply(host());
    await flush();
    expect(page.children).toHaveLength(1);
    expect(page.children[0]?.attributes.get("data-plugin-css")).toBe("dsh-session-activity/rows.css");
    expect(page.children[0]?.textContent).toContain('[data-row-key="workspace:w1"] .JoiKIa_title{color:var(--dsw-alias-state-business-primary);font-weight:600}');
    expect(page.children[0]?.textContent).not.toContain('data-row-key="session:');
    dispose();
    expect(page.children).toHaveLength(0);
  });

  it("mounts nothing when the config disables it", async () => {
    const page = fakePage();
    const plugin = evaluate(page.document).factory(() => ({})) as Plugin;
    const dispose = plugin.apply(host(), { enabled: false });
    await flush();
    expect(page.children).toHaveLength(0);
    expect(typeof dispose).toBe("function");
    dispose();
  });

  it("does not bundle a second React or any node builtin", () => {
    expect(bundle).not.toContain("react.production.min.js");
    expect(bundle).not.toContain("node:");
    expect(bundle.length).toBeLessThan(64 * 1024);
  });
});
