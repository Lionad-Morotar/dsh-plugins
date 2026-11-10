/**
 * The host-half assembly: what the Loader mounts, and how it finds the web
 * server and the session's workspace.
 *
 * The fake context below restates the host's two awkward rules rather than
 * smoothing them over. `webServer` arrives after this row activates, so a
 * one-shot read misses it and the routes would never register; and reading a
 * service that was not declared in `inject` throws from the property access
 * instead of yielding undefined. Both are why the code polls and why `inject`
 * names exactly the three services it reads.
 *
 * The workspace cases run against real directories, because the join key is
 * `realpath`: a symlinked session cwd and its canonical spelling have to resolve
 * to one workspace, and a stub would only restate the implementation.
 */
import { describe, expect, it, afterEach } from "vitest";
import { mkdir, mkdtemp, realpath, rm, symlink } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import plugin, { apply, inject, name } from "../src/index.ts";
import { ROUTE_PREFIX } from "../src/shared.ts";
import type { ReviewScope } from "../src/shared.ts";

/** One recorded route registration. */
interface Registration {
  readonly kind: string;
  readonly path: string;
  readonly handler: unknown;
}

/** One recorded data-layer call. */
interface LoadCall {
  readonly kind: "snapshot" | "diff";
  readonly workspace: string;
  readonly scope: ReviewScope;
  readonly path?: string;
}

interface ContextOptions {
  readonly webServer?: unknown;
  /** How many `get("webServer")` calls return undefined before the server appears. */
  readonly webServerAfter?: number;
  readonly sessions?: unknown;
  readonly sessionPersistence?: unknown;
  readonly subprocess?: unknown;
  readonly withEffect?: boolean;
}

/**
 * A fake Cordis context.
 *
 * `get` is a plain lookup so a test can hand it any service shape; the real host
 * throws for an undeclared service, which is why `inject` is asserted separately.
 */
function createContext(options: ContextOptions = {}) {
  const registrations: Registration[] = [];
  const effects: (() => void)[] = [];
  const loadCalls: LoadCall[] = [];
  const gets: string[] = [];
  let webServerReads = 0;
  let unregistered = false;

  const webServer =
    options.webServer === undefined
      ? undefined
      : {
          register(route: Registration) {
            registrations.push(route);
            return () => {
              unregistered = true;
            };
          },
        };

  const services: Record<string, unknown> = {
    webServer,
    sessions: options.sessions,
    sessionPersistence: options.sessionPersistence,
    subprocess: options.subprocess,
  };

  const ctx = {
    get(serviceName: string): unknown {
      gets.push(serviceName);
      if (serviceName === "webServer") {
        webServerReads += 1;
        if (options.webServerAfter !== undefined && webServerReads <= options.webServerAfter) return undefined;
      }
      return services[serviceName];
    },
    effect(setup: () => (() => void) | void): void {
      const disposer = setup();
      if (typeof disposer === "function") effects.push(disposer);
    },
  };

  if (options.withEffect === false) delete (ctx as { effect?: unknown }).effect;

  return {
    ctx,
    registrations,
    effects,
    loadCalls,
    gets,
    isUnregistered: () => unregistered,
  };
}

/**
 * A subprocess service that answers like git does outside a repository.
 *
 * Not a throwing stub: a spawn that throws is a host bug and the route turns it
 * into a 500, which would mask what these cases are actually asserting. Answering
 * with git's own exit 128 keeps the data layer on its normal path, so a test that
 * expects `not-a-repo` is testing the workspace that was resolved rather than the
 * stub's failure mode.
 */
const inertSubprocess = {
  spawn() {
    return {
      done: Promise.resolve({ exitCode: 128, signal: null }),
      collected: {
        stdout: { readFrom: () => ({ text: "", lossy: false }) },
        stderr: { readFrom: () => ({ text: "fatal: not a git repository", lossy: false }) },
      },
    };
  },
};

const realDirs: string[] = [];

afterEach(async () => {
  for (const dir of realDirs.splice(0)) await rm(dir, { recursive: true, force: true });
});

/** A real directory under the temporary root. */
async function tempDir(prefix: string): Promise<string> {
  const dir = await realpath(await mkdtemp(join(tmpdir(), `${prefix}-`)));
  realDirs.push(dir);
  return dir;
}

describe("the plugin object", () => {
  it("exports the shape the Loader mounts", () => {
    expect(name).toBe("dsh-review-map");
    expect(plugin.name).toBe("dsh-review-map");
    expect(typeof plugin.apply).toBe("function");
    expect(plugin.inject).toBe(inject);
  });

  it("declares exactly the services it reads", () => {
    // `webServer` is deliberately absent: it arrives after this row activates,
    // and declaring it would keep the whole plugin pending on a host that never
    // provides one, which takes the tab down with it.
    expect(inject).toEqual(["subprocess", "sessions", "sessionPersistence"]);
    expect(inject).not.toContain("webServer");
  });
});

describe("web server discovery", () => {
  it("registers the prefix once when the server is already there", () => {
    const { ctx, registrations } = createContext({
      webServer: {},
      sessions: {},
      sessionPersistence: {},
      subprocess: inertSubprocess,
    });

    apply(ctx as never);

    expect(registrations).toHaveLength(1);
    expect(registrations[0]?.kind).toBe("prefix");
    expect(registrations[0]?.path).toBe(ROUTE_PREFIX);
    expect(typeof registrations[0]?.handler).toBe("function");
  });

  it("waits for a server that arrives after apply returns", async () => {
    const { ctx, registrations } = createContext({
      webServer: {},
      webServerAfter: 2,
      sessions: {},
      sessionPersistence: {},
      subprocess: inertSubprocess,
    });

    apply(ctx as never);
    expect(registrations).toHaveLength(0);

    // The poll interval is 250ms; three ticks is enough for the third read to
    // see the server without making the suite wait a second.
    await new Promise(resolve => setTimeout(resolve, 900));

    expect(registrations).toHaveLength(1);
    expect(registrations[0]?.path).toBe(ROUTE_PREFIX);
  });

  it("registers nothing and does not throw when no server ever appears", async () => {
    const { ctx, registrations } = createContext({
      sessions: {},
      sessionPersistence: {},
      subprocess: inertSubprocess,
    });

    expect(() => apply(ctx as never)).not.toThrow();
    await new Promise(resolve => setTimeout(resolve, 400));

    expect(registrations).toHaveLength(0);
  });

  it("unregisters the prefix when the host disposes the plugin", () => {
    const { ctx, effects, isUnregistered } = createContext({
      webServer: {},
      sessions: {},
      sessionPersistence: {},
      subprocess: inertSubprocess,
    });

    apply(ctx as never);
    expect(effects).toHaveLength(1);

    effects[0]?.();

    expect(isUnregistered()).toBe(true);
  });

  it("survives a host with no effect service", () => {
    const { ctx, registrations } = createContext({
      webServer: {},
      sessions: {},
      sessionPersistence: {},
      subprocess: inertSubprocess,
      withEffect: false,
    });

    expect(() => apply(ctx as never)).not.toThrow();
    expect(registrations).toHaveLength(1);
  });
});

describe("workspace resolution", () => {
  it("prefers the live session header", async () => {
    const live = await tempDir("review-map-live");
    const persisted = await tempDir("review-map-persisted");
    const { ctx, registrations } = createContext({
      webServer: {},
      sessions: { get: (id: string) => (id === "s1" ? { header: { cwd: live } } : undefined) },
      sessionPersistence: { stat: async () => ({ header: { cwd: persisted } }) },
      subprocess: inertSubprocess,
    });
    apply(ctx as never);
    const handler = registrations[0]?.handler as (req: unknown, res: unknown) => Promise<void>;
    const body = await callHandler(handler, `${ROUTE_PREFIX}/state?sessionId=s1`);

    // The snapshot fails because the directory is not a repository, which is
    // exactly the evidence that the live cwd reached the data layer.
    expect(body).toMatchObject({ ok: false, error: { code: "not-a-repo" } });
    expect(body).not.toMatchObject({ error: { code: "no-session" } });
  });

  it("falls back to the persisted header for a session that is not live", async () => {
    const persisted = await tempDir("review-map-persisted-only");
    const { ctx, registrations } = createContext({
      webServer: {},
      sessions: { get: () => undefined },
      sessionPersistence: { stat: async () => ({ header: { cwd: persisted } }) },
      subprocess: inertSubprocess,
    });
    apply(ctx as never);
    const handler = registrations[0]?.handler as (req: unknown, res: unknown) => Promise<void>;

    const body = await callHandler(handler, `${ROUTE_PREFIX}/state?sessionId=s1`);

    expect(body).toMatchObject({ ok: false, error: { code: "not-a-repo" } });
  });

  it("answers no-session when neither side knows a cwd", async () => {
    const { ctx, registrations } = createContext({
      webServer: {},
      sessions: { get: () => undefined },
      sessionPersistence: { stat: async () => undefined },
      subprocess: inertSubprocess,
    });
    apply(ctx as never);
    const handler = registrations[0]?.handler as (req: unknown, res: unknown) => Promise<void>;

    const body = await callHandler(handler, `${ROUTE_PREFIX}/state?sessionId=s1`);

    // Never falls back to the process cwd: showing another project's changes is
    // worse than saying the workspace is unknown.
    expect(body).toMatchObject({ ok: false, error: { code: "no-session" } });
  });

  it("resolves a symlinked session cwd to its canonical path", async () => {
    const real = await tempDir("review-map-real");
    const linkParent = await tempDir("review-map-link");
    const link = join(linkParent, "linked");
    await symlink(real, link);
    const { ctx, registrations } = createContext({
      webServer: {},
      sessions: { get: () => ({ header: { cwd: link } }) },
      sessionPersistence: {},
      subprocess: inertSubprocess,
    });
    apply(ctx as never);
    const handler = registrations[0]?.handler as (req: unknown, res: unknown) => Promise<void>;

    const body = await callHandler(handler, `${ROUTE_PREFIX}/state?sessionId=s1`);

    // The snapshot's `repo` is the basename of the canonical path, so a
    // symlinked cwd that was not normalized would report the link's name.
    expect(body).toMatchObject({ ok: false, error: { code: "not-a-repo" } });
  });

  it("keeps a cwd that does not exist instead of dropping it", async () => {
    const missing = join(await tempDir("review-map-missing"), "gone");
    const { ctx, registrations } = createContext({
      webServer: {},
      sessions: { get: () => ({ header: { cwd: missing } }) },
      sessionPersistence: {},
      subprocess: inertSubprocess,
    });
    apply(ctx as never);
    const handler = registrations[0]?.handler as (req: unknown, res: unknown) => Promise<void>;

    const body = await callHandler(handler, `${ROUTE_PREFIX}/state?sessionId=s1`);

    // A deleted workspace is a not-a-repo answer, not a no-session one: the
    // session did name a directory, it just is not there any more.
    expect(body).toMatchObject({ ok: false, error: { code: "not-a-repo" } });
  });

  it("does not resolve a workspace for a request that fails validation", async () => {
    let resolved = 0;
    const { ctx, registrations } = createContext({
      webServer: {},
      sessions: {
        get: () => {
          resolved += 1;
          return undefined;
        },
      },
      sessionPersistence: {},
      subprocess: inertSubprocess,
    });
    apply(ctx as never);
    const handler = registrations[0]?.handler as (req: unknown, res: unknown) => Promise<void>;

    const body = await callHandler(handler, `${ROUTE_PREFIX}/diff?sessionId=s1&path=../../etc/passwd`);

    expect(body).toMatchObject({ ok: false, error: { code: "bad-request" } });
    expect(resolved).toBe(0);
  });
});

/**
 * Drive one registered handler with a minimal request/response pair.
 * @param handler - the prefix handler the assembly registered.
 * @param url - the request url, prefix included.
 * @returns the parsed JSON body.
 */
async function callHandler(handler: (req: unknown, res: unknown) => Promise<void>, url: string): Promise<unknown> {
  let text = "";
  const res = {
    writeHead() {},
    end(value: string) {
      text = value;
    },
  };
  await handler({ method: "GET", url }, res);
  return JSON.parse(text) as unknown;
}

describe("data-layer wiring", () => {
  it("runs the real data layer against the session's workspace", async () => {
    // A real repository, so this asserts the whole chain: session cwd → runner →
    // git → wire answer. The data layer itself is covered by its own tests; what
    // is under test here is that the assembly connects it at all.
    const root = await tempDir("review-map-wired");
    const { execFileSync } = await import("node:child_process");
    const git = (args: string[]): void => {
      execFileSync("git", args, { cwd: root, stdio: ["ignore", "pipe", "pipe"] });
    };
    git(["init", "-q", "-b", "main"]);
    git(["config", "user.name", "Review Map"]);
    git(["config", "user.email", "review-map@example.com"]);
    await mkdir(join(root, "src"), { recursive: true });
    await import("node:fs/promises").then(fs => fs.writeFile(join(root, "src/a.txt"), "one\ntwo\n", "utf8"));
    git(["add", "-A"]);
    git(["commit", "-qm", "initial"]);
    await import("node:fs/promises").then(fs => fs.writeFile(join(root, "src/a.txt"), "one\nTWO\n", "utf8"));

    const { realSubprocess } = await import("./fixtures/repo.ts");
    const { subprocess } = realSubprocess();
    const { ctx, registrations } = createContext({
      webServer: {},
      sessions: { get: () => ({ header: { cwd: root } }) },
      sessionPersistence: {},
      subprocess,
    });
    apply(ctx as never);
    const handler = registrations[0]?.handler as (req: unknown, res: unknown) => Promise<void>;

    const state = await callHandler(handler, `${ROUTE_PREFIX}/state?sessionId=s1`);
    expect(state).toMatchObject({ ok: true, snapshot: { repo: root.split("/").pop(), scope: "worktree" } });

    const diff = await callHandler(handler, `${ROUTE_PREFIX}/diff?sessionId=s1&path=src/a.txt`);
    expect(diff).toMatchObject({ ok: true, diff: { kind: "text", path: "src/a.txt" } });
    const added = (diff as { diff: { hunks: { lines: { kind: string; text: string }[] }[] } }).diff.hunks
      .flatMap(hunk => hunk.lines)
      .filter(line => line.kind === "add");
    expect(added.map(line => line.text)).toEqual(["TWO"]);
  });

  it("passes the parsed branch scope down to the data layer", async () => {
    const root = await tempDir("review-map-scope");
    const { execFileSync } = await import("node:child_process");
    const git = (args: string[]): void => {
      execFileSync("git", args, { cwd: root, stdio: ["ignore", "pipe", "pipe"] });
    };
    git(["init", "-q", "-b", "main"]);
    git(["config", "user.name", "Review Map"]);
    git(["config", "user.email", "review-map@example.com"]);
    await import("node:fs/promises").then(fs => fs.writeFile(join(root, "a.txt"), "one\n", "utf8"));
    git(["add", "-A"]);
    git(["commit", "-qm", "initial"]);
    git(["checkout", "-q", "-b", "feature"]);
    await import("node:fs/promises").then(fs => fs.writeFile(join(root, "b.txt"), "two\n", "utf8"));
    git(["add", "-A"]);
    git(["commit", "-qm", "feature"]);

    const { realSubprocess } = await import("./fixtures/repo.ts");
    const { subprocess } = realSubprocess();
    const { ctx, registrations } = createContext({
      webServer: {},
      sessions: { get: () => ({ header: { cwd: root } }) },
      sessionPersistence: {},
      subprocess,
    });
    apply(ctx as never);
    const handler = registrations[0]?.handler as (req: unknown, res: unknown) => Promise<void>;

    const state = (await callHandler(handler, `${ROUTE_PREFIX}/state?sessionId=s1&scope=branch`)) as {
      ok: boolean;
      snapshot?: { scope: string; baseRef: string | null; files: { path: string }[] };
    };

    expect(state.ok).toBe(true);
    expect(state.snapshot?.scope).toBe("branch");
    expect(state.snapshot?.baseRef).toMatch(/^[0-9a-f]{40}$/u);
    expect(state.snapshot?.files.map(file => file.path)).toEqual(["b.txt"]);
  });
});
