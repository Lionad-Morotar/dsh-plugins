/**
 * The host-half assembly: what the Loader mounts, how it finds the web server and
 * the session's workspace, and how the three data-layer reads are composed.
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
import { afterEach, describe, expect, it } from "vitest";
import { mkdir, mkdtemp, realpath, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import plugin, { apply, inject, name, resolveSessionRoot } from "../src/index.ts";
import { ROUTE_PREFIX } from "../src/shared.ts";

/** One recorded route registration. */
interface Registration {
  readonly kind: string;
  readonly path: string;
  readonly handler: unknown;
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

  return { ctx, registrations, effects, isUnregistered: () => unregistered };
}

/**
 * A subprocess service that answers like git does outside a repository.
 *
 * Not a throwing stub: a spawn that throws is a host bug and the route turns it
 * into a 500, which would mask what these cases are actually asserting. Answering
 * with git's own exit 128 keeps the data layer on its normal path, so a test that
 * expects `not-a-repo` is testing the workspace that was resolved.
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

describe("the plugin object", () => {
  it("exports the shape the Loader mounts", () => {
    expect(name).toBe("dsh-pr-explorer");
    expect(plugin.name).toBe("dsh-pr-explorer");
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
  it("resolves the live session header", async () => {
    const live = await tempDir("pr-live");
    const resolved = await resolveSessionRoot(
      "s1",
      { get: (id: string) => (id === "s1" ? { header: { cwd: live } } : undefined) },
      { stat: async () => undefined },
    );

    expect(resolved).toBe(live);
  });

  it("falls back to the persisted header for a session that is not live", async () => {
    const persisted = await tempDir("pr-persisted");
    const resolved = await resolveSessionRoot(
      "s1",
      { get: () => undefined },
      { stat: async () => ({ header: { cwd: persisted } }) },
    );

    expect(resolved).toBe(persisted);
  });

  it("prefers the live header over the persisted one", async () => {
    const live = await tempDir("pr-both-live");
    const persisted = await tempDir("pr-both-persisted");
    const resolved = await resolveSessionRoot(
      "s1",
      { get: () => ({ header: { cwd: live } }) },
      { stat: async () => ({ header: { cwd: persisted } }) },
    );

    expect(resolved).toBe(live);
  });

  it("answers undefined when neither side knows a cwd", async () => {
    const resolved = await resolveSessionRoot("s1", { get: () => undefined }, { stat: async () => undefined });

    // Never falls back to the process cwd: showing another project's range is
    // worse than saying the workspace is unknown.
    expect(resolved).toBeUndefined();
  });

  it("resolves a symlinked session cwd to its canonical path", async () => {
    const real = await tempDir("pr-real");
    const linkParent = await tempDir("pr-link");
    const link = join(linkParent, "linked");
    await symlink(real, link);

    const resolved = await resolveSessionRoot("s1", { get: () => ({ header: { cwd: link } }) }, undefined);

    // Two spellings of one directory would be two ranges of one tree.
    expect(resolved).toBe(real);
  });

  it("keeps a cwd that does not exist instead of dropping it", async () => {
    const missing = join(await tempDir("pr-missing"), "gone");

    const resolved = await resolveSessionRoot("s1", { get: () => ({ header: { cwd: missing } }) }, undefined);

    // A deleted workspace is still a path the data layer can report on, rather
    // than disappearing into "no session".
    expect(resolved).toBe(missing);
  });

  it("survives a persistence store that throws", async () => {
    const resolved = await resolveSessionRoot(
      "s1",
      { get: () => undefined },
      {
        stat: async () => {
          throw new Error("persistence is restarting");
        },
      },
    );

    // An unreadable header is the same outcome as an absent one.
    expect(resolved).toBeUndefined();
  });
});

describe("data-layer wiring", () => {
  it("runs the real data layer against the session's workspace", async () => {
    // A real repository, so this asserts the whole chain: session cwd → runner →
    // git → wire answer. The data layer itself is covered by its own tests; what
    // is under test here is that the assembly connects it at all.
    const root = await tempDir("pr-wired");
    const { execFileSync } = await import("node:child_process");
    const git = (args: string[]): void => {
      execFileSync("git", args, { cwd: root, stdio: ["ignore", "pipe", "pipe"] });
    };
    git(["init", "-q", "-b", "main"]);
    git(["config", "user.name", "PR Explorer"]);
    git(["config", "user.email", "pr-explorer@example.com"]);
    await mkdir(join(root, "src"), { recursive: true });
    await writeFile(join(root, "src/a.txt"), "one\ntwo\n", "utf8");
    git(["add", "-A"]);
    git(["commit", "-qm", "initial"]);
    git(["checkout", "-q", "-b", "feature"]);
    await writeFile(join(root, "src/a.txt"), "one\nTWO\n", "utf8");
    git(["add", "-A"]);
    git(["commit", "-qm", "feature work"]);

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

    const refs = await callHandler(handler, `${ROUTE_PREFIX}/refs?sessionId=s1`);
    expect(refs).toMatchObject({ ok: true, listing: { repo: root.split("/").pop(), defaultBase: "main" } });

    const compare = (await callHandler(
      handler,
      `${ROUTE_PREFIX}/compare?sessionId=s1&base=main&head=feature`,
    )) as {
      ok: boolean;
      compare?: { reading: { ahead: number; behind: number }; commits: { commits: unknown[] }; files: { files: { path: string }[] } };
    };
    expect(compare.ok).toBe(true);
    expect(compare.compare?.reading.ahead).toBe(1);
    expect(compare.compare?.reading.behind).toBe(0);
    expect(compare.compare?.commits.commits).toHaveLength(1);
    expect(compare.compare?.files.files.map(file => file.path)).toEqual(["src/a.txt"]);

    const diff = (await callHandler(
      handler,
      `${ROUTE_PREFIX}/diff?sessionId=s1&base=main&head=feature&path=src/a.txt`,
    )) as { ok: boolean; diff?: { kind: string; hunks: { lines: { kind: string; text: string }[] }[] } };
    expect(diff.ok).toBe(true);
    expect(diff.diff?.kind).toBe("text");
    const added = (diff.diff?.hunks ?? []).flatMap(hunk => hunk.lines).filter(line => line.kind === "add");
    expect(added.map(line => line.text)).toEqual(["TWO"]);
  });

  it("answers not-a-repo for a workspace that is not a repository", async () => {
    const plain = await tempDir("pr-plain");
    const { ctx, registrations } = createContext({
      webServer: {},
      sessions: { get: () => ({ header: { cwd: plain } }) },
      sessionPersistence: {},
      subprocess: inertSubprocess,
    });
    apply(ctx as never);
    const handler = registrations[0]?.handler as (req: unknown, res: unknown) => Promise<void>;

    const body = await callHandler(handler, `${ROUTE_PREFIX}/refs?sessionId=s1`);

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

    const body = await callHandler(handler, `${ROUTE_PREFIX}/refs?sessionId=s1`);

    expect(body).toMatchObject({ ok: false, error: { code: "no-session" } });
  });
});

describe("the comparison composition", () => {
  it("pins the range once and reads both lists against that same pin", async () => {
    // The reading, the commits and the files have to describe one range. If the
    // assembly let each read resolve its own refs, a commit could appear beside
    // a file list that does not mention the file it touched.
    const root = await tempDir("pr-onepin");
    const { execFileSync } = await import("node:child_process");
    // Returns stdout: this case compares the wire answer against git's own, so
    // the helper has to be able to answer a question, not only run a command.
    const git = (args: string[]): string =>
      execFileSync("git", args, { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }); 
    git(["init", "-q", "-b", "main"]);
    git(["config", "user.name", "PR Explorer"]);
    git(["config", "user.email", "pr-explorer@example.com"]);
    await writeFile(join(root, "a.txt"), "base\n", "utf8");
    git(["add", "-A"]);
    git(["commit", "-qm", "initial"]);
    git(["checkout", "-q", "-b", "feature"]);
    await writeFile(join(root, "b.txt"), "one\n", "utf8");
    git(["add", "-A"]);
    git(["commit", "-qm", "feature one"]);

    const { realSubprocess } = await import("./fixtures/repo.ts");
    const { subprocess, calls } = realSubprocess();
    const { ctx, registrations } = createContext({
      webServer: {},
      sessions: { get: () => ({ header: { cwd: root } }) },
      sessionPersistence: {},
      subprocess,
    });
    apply(ctx as never);
    const handler = registrations[0]?.handler as (req: unknown, res: unknown) => Promise<void>;

    const body = (await callHandler(
      handler,
      `${ROUTE_PREFIX}/compare?sessionId=s1&base=main&head=feature`,
    )) as {
      ok: boolean;
      compare?: { reading: { base: { hash: string }; head: { hash: string }; mergeBase: { hash: string } } };
    };
    expect(body.ok).toBe(true);

    // The invariant is not a call count: it is that the reading the client sees
    // and the two lists it sees were all read against one commit. The reading's
    // merge base has to be git's own answer for the two refs the caller named,
    // and every diff command has to name that same commit as its old side.
    const mergeBase = body.compare?.reading.mergeBase.hash ?? "";
    expect(mergeBase).toBe(git(["merge-base", "main", "feature"]).trim());

    const diffs = calls.filter(call => call.argv[1] === "diff");
    expect(diffs.length).toBeGreaterThan(0);
    for (const call of diffs) expect(call.argv).toContain(mergeBase);

    // And the commit read has to be the same range: the head, minus the base.
    const logs = calls.filter(call => call.argv[1] === "log");
    expect(logs).toHaveLength(1);
    expect(logs[0]?.argv).toContain(`^${body.compare?.reading.base.hash ?? ""}`);
    expect(logs[0]?.argv).toContain(body.compare?.reading.head.hash ?? "");
  });
});
