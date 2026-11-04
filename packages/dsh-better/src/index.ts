/**
 * Host half.
 *
 * Two contributions. The `sessionCompaction` projection unit counts how often
 * this session's context was compressed; that figure cannot be derived from
 * anything the shell publishes — occupancy says how full the context is, never
 * how often it was rebuilt — so it is folded host-side over the session log and
 * shipped to the browser as a wire view. The `/better/api/skill-profile` route
 * answers one skill's parameter profile, because the hint it needs is dropped by
 * the host's own frontmatter parser and has to be re-read from SKILL.md.
 * Everything else this package does stays in `dsh.client`.
 *
 * Both seams are reached through soft probes rather than a plugin-level
 * `inject`: on a host without the projection seam or the web server the whole
 * browser half (the picker search, the focus chord, the attachment clipboard)
 * must still mount, and a hard dependency would leave the fiber pending instead.
 */
import { readFile } from "node:fs/promises";

import { sessionCompactionProjection } from "./compaction.ts";
import { registerSkillProfileRoutes, type WebServerFace } from "./host/skill-profile-routes.ts";
import { readFrontmatterArgumentHint, readFrontmatterFields } from "./skill-profile.ts";
import type { SkillFrontmatter } from "./skill-profile.ts";
import { sessionSkillUsageProjection } from "./skill-usage.ts";

/** Loader row name; must match the id in `cordis.patch.yml`. */
export const name = "dsh-better";

/** Services the host half reads; none directly — the registry is probed. */
export const inject: string[] = [];

/** One registered projection unit, narrowed to what this half calls. */
interface ProjectionRegistryLike {
  register(definition: typeof sessionCompactionProjection | typeof sessionSkillUsageProjection): () => void;
}

/** The scope the `sessionProjections` soft probe hands back. */
interface ProjectionScopeLike {
  readonly sessionProjections: ProjectionRegistryLike;
  effect(callback: () => () => void, label?: string): void;
}

/** The host context this half needs. */
interface HostContextLike {
  effect(callback: () => () => void, label?: string): void;
  inject?<T>(dependencies: readonly string[], callback: (scope: T) => void): () => void;
  get?(name: string): unknown;
}

/**
 * Register this package's projection units.
 *
 * Both units ride the same registry and the same soft probe, and each
 * registration is wrapped in its own `effect` on this plugin's fiber, so
 * unloading the plugin takes both keys back out of every snapshot instead of
 * leaving values no one maintains.
 * @param scope - scope carrying the registry.
 */
function registerProjection(scope: ProjectionScopeLike): void {
  scope.effect(
    () => scope.sessionProjections.register(sessionCompactionProjection),
    "dsh-better: sessionCompaction projection",
  );
  scope.effect(
    () => scope.sessionProjections.register(sessionSkillUsageProjection),
    "dsh-better: skillUsage projection",
  );
}

/**
 * Register the projection when the host has the seam.
 * @param ctx - host context.
 */
export function apply(ctx: HostContextLike): void {
  if (typeof ctx.inject === "function") {
    ctx.inject<ProjectionScopeLike>(["sessionProjections"], registerProjection);
  } else {
    // Hosts whose cordis predates `ctx.inject`: register directly when the service
    // is already mounted, and give up quietly when it is not.
    const registry = ctx.get?.("sessionProjections");
    if (registry !== undefined && registry !== null) {
      registerProjection({
        sessionProjections: registry as ProjectionRegistryLike,
        effect: (callback, label) => ctx.effect(callback, label),
      });
    }
  }
  registerSkillProfile(ctx);
}

/** Structural slice of the `skills` service this half calls. */
interface SkillsFace {
  get(
    name: string,
    options?: { readonly cwd?: string },
  ): Promise<{
    readonly name: string;
    readonly description?: string;
    readonly path?: string;
    readonly metadata?: unknown;
  } | undefined>;
  /** Summaries carry `path` and `description` without loading bodies. */
  list(options?: { readonly cwd?: string }): Promise<readonly SkillSummaryLike[]>;
}

/** The subset of a skill summary this package reads. */
interface SkillSummaryLike {
  readonly name: string;
  readonly description?: string;
  readonly path?: string;
}

/** Structural slice of the `sessions` store (live session objects). */
interface SessionsFace {
  get(id: string): { readonly header?: { readonly cwd?: string } } | undefined;
}

/** Structural slice of `sessionPersistence`, read for sessions no longer live. */
interface SessionPersistenceFace {
  stat(id: string): Promise<{ readonly header?: { readonly cwd?: string } } | undefined>;
}

/** Read one service from the host context, tolerating a host without `get`. */
function readService(ctx: HostContextLike, name: string): unknown {
  return ctx.get?.(name);
}

/**
 * How often to re-read `webServer` while it is still absent, and how long to keep
 * trying.
 *
 * The desktop web app provides the server well inside the first second, so 250ms
 * is frequent enough to feel immediate without busy-looping a fiber. The 15s cap
 * is the stop condition for a host that never grows one at all (headless): the
 * same numbers `dsh-arch` arrived at for the same seam.
 */
export const WEB_SERVER_POLL_MS = 250;
export const WEB_SERVER_WAIT_MS = 15000;

/** What a `webServer` read may answer; the poll treats null as absent. */
export type WebServerProbeRead = WebServerFace | null | undefined;

/**
 * Call `mount` once `read` answers a web server, waiting a bounded time for it.
 *
 * The first read is synchronous, so a host that already has the service mounts in
 * the same turn with no timer at all. A host that never provides one stops after
 * {@link WEB_SERVER_WAIT_MS} and is left exactly as it was.
 *
 * A throwing read is treated as "not yet": the scope may not be composed, and
 * giving up on the first exception would lose the route for the whole session.
 * @param read - reads the service from the calling scope.
 * @param mount - installs the route; called at most once.
 * @returns a disposer that stops the wait, safe to call after a successful mount.
 */
export function whenWebServer(
  read: () => WebServerProbeRead,
  mount: (webServer: WebServerFace) => void,
): () => void {
  const attempt = (): WebServerFace | undefined => {
    try {
      const value = read();
      return value === null ? undefined : value;
    } catch {
      return undefined;
    }
  };

  const present = attempt();
  if (present !== undefined) {
    mount(present);
    return () => undefined;
  }

  const startedAt = Date.now();
  const timer = setInterval(() => {
    const webServer = attempt();
    if (webServer === undefined) {
      if (Date.now() - startedAt >= WEB_SERVER_WAIT_MS) clearInterval(timer);
      return;
    }
    clearInterval(timer);
    mount(webServer);
  }, WEB_SERVER_POLL_MS);

  return () => clearInterval(timer);
}

/**
 * Resolve a session's workspace directory.
 *
 * The live store is consulted first and persistence second, because a session
 * that is still open is the common case and its header is already in memory. A
 * closed session still renders, so persistence is worth the extra read; when
 * neither knows a cwd the caller falls back to the host's default.
 * @param ctx - host context.
 * @param sessionId - session to resolve.
 * @returns the cwd, or undefined when unknown.
 */
async function resolveSessionCwd(ctx: HostContextLike, sessionId: string): Promise<string | undefined> {
  const sessions = readService(ctx, "sessions") as SessionsFace | undefined;
  const live = sessions?.get(sessionId)?.header?.cwd;
  if (typeof live === "string" && live !== "") return live;
  const persistence = readService(ctx, "sessionPersistence") as SessionPersistenceFace | undefined;
  try {
    const persisted = (await persistence?.stat(sessionId))?.header?.cwd;
    if (typeof persisted === "string" && persisted !== "") return persisted;
  } catch {
    // Persistence may be mid-restart; an absent cwd is not an error here.
  }
  return undefined;
}

/**
 * Load one skill's profile inputs.
 *
 * `argument-hint` is a top-level frontmatter key, and the host's skill parser
 * keeps only `name`, `description`, `whenToUse` and the `metadata:` block, so no
 * skill API can return it. The file is therefore read a second time here. A read
 * that fails (skill removed between discovery and request, unreadable path) is
 * not an error: the profile simply carries no hint and the panel degrades to
 * showing the skill's name.
 * @param ctx - host context.
 * @param name - skill name.
 * @param cwd - session workspace, or undefined for the host default.
 * @returns the profile inputs, or undefined when the skill is unknown.
 */
async function loadSkillProfile(
  ctx: HostContextLike,
  name: string,
  cwd: string | undefined,
): Promise<{ name: string; description?: string; path?: string; argumentHint?: string; metadata?: unknown } | undefined> {
  const skills = readService(ctx, "skills") as SkillsFace | undefined;
  if (skills === undefined) return undefined;

  // `list` rather than `get`: the summaries already carry `path` and
  // `description`, and — unlike a scoped `get` — a scope-less `list` reads the
  // global layer, which is where installed skills live. `get` needs the calling
  // agent's scope (`presets.serviceFor(agent, 'skills')`), and a plugin's root
  // context is not an agent, so the scoped registry is not reachable from here.
  const options = cwd === undefined ? undefined : { cwd };
  const summaries = await skills.list(options);
  const summary = summaries.find(entry => entry.name === name);
  if (summary === undefined) return undefined;

  const path = typeof summary.path === "string" && summary.path !== "" ? summary.path : undefined;
  let frontmatter: SkillFrontmatter = {};
  if (path !== undefined) {
    try {
      frontmatter = readFrontmatterFields(await readFile(path, "utf8"));
    } catch {
      frontmatter = {};
    }
  }

  const profile: { name: string; description?: string; path?: string; argumentHint?: string; metadata?: unknown } = { name: summary.name };
  if (typeof summary.description === "string" && summary.description !== "") {
    profile.description = summary.description;
  }
  if (path !== undefined) profile.path = path;
  if (frontmatter.argumentHint !== undefined) profile.argumentHint = frontmatter.argumentHint;
  if (frontmatter.metadata !== undefined) profile.metadata = frontmatter.metadata;
  return profile;
}

/**
 * Build a profile by reading one SKILL.md at a path the client supplied.
 *
 * The host's registry is not usable for the user's own skills: a plugin's root
 * context has no agent scope, and a scope-less `list` sees only the bundled
 * skills. The client does hold the full catalogue (through `remote.skills`,
 * which the host serves with the right scope), and its summaries carry `path`,
 * so the file is read directly here instead of being looked up again.
 *
 * The name is re-checked against the frontmatter rather than trusted: the path
 * arrives from the browser, and a mismatched pair would label one skill's
 * parameters with another skill's name.
 * @param name - the skill the client asked for.
 * @param path - absolute SKILL.md path from the client's catalogue.
 * @returns the profile, or undefined when the file is unreadable or is another skill.
 */
async function readSkillProfileAt(
  name: string,
  path: string,
): Promise<{ name: string; description?: string; path?: string; argumentHint?: string; metadata?: unknown } | undefined> {
  if (typeof path !== "string" || path === "") return undefined;
  let source: string;
  try {
    source = await readFile(path, "utf8");
  } catch {
    return undefined;
  }
  const frontmatter = readFrontmatterFields(source);
  // The path arrives from the browser; a mismatched pair would label one skill's
  // parameters with another skill's name, so the file has to confirm it.
  if (frontmatter.name !== undefined && frontmatter.name !== name) return undefined;
  const profile: { name: string; description?: string; path?: string; argumentHint?: string; metadata?: unknown } = {
    name,
    path,
  };
  if (frontmatter.argumentHint !== undefined) profile.argumentHint = frontmatter.argumentHint;
  if (frontmatter.metadata !== undefined) profile.metadata = frontmatter.metadata;
  return profile;
}

/**
 * Mount the skill-profile route once the host has a web server.
 *
 * A one-shot `ctx.get("webServer")` during `apply` misses the desktop
 * composition: this row activates before `@deepseek-ai/dsh-web-app` provides the
 * server, so the probe reads undefined and the route would never be registered.
 * That is not a cosmetic loss — the route is the panel's entire data plane, so
 * without it the panel can only show a skill's name and path.
 *
 * `ctx.inject` does not close the gap either. It re-checks the scope that
 * provided the service, and a loader row's scope does not inherit the root's
 * isolation table, so its own `ctx.get` never observes a service the root
 * provides (verified against cordis 4). `dsh-arch` reached the same conclusion
 * and polls its own scope; this follows it.
 *
 * The wait is bounded on purpose. A host that never grows a web server (headless)
 * must stop looking and stay alive, which is the same degraded outcome as a
 * one-shot miss: the projections and every client feature keep working.
 * @param ctx - host context.
 */
function registerSkillProfile(ctx: HostContextLike): void {
  const mount = (webServer: WebServerFace): void => {
    ctx.effect(
      () =>
        registerSkillProfileRoutes(webServer, {
          loadSkill: (name, cwd) => loadSkillProfile(ctx, name, cwd),
          readSkillAt: (name, path) => readSkillProfileAt(name, path),
          resolveCwd: sessionId => resolveSessionCwd(ctx, sessionId),
        }),
      "dsh-better: skill profile route",
    );
  };

  // The poll rides this plugin's fiber, so unloading the plugin stops it even
  // while it is still waiting for a server that will never arrive.
  ctx.effect(
    () => whenWebServer(() => readService(ctx, "webServer") as WebServerProbeRead, mount),
    "dsh-better: webServer wait",
  );
}
