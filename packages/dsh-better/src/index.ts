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
import { readFrontmatterArgumentHint } from "./skill-profile.ts";

/** Loader row name; must match the id in `cordis.patch.yml`. */
export const name = "dsh-better";

/** Services the host half reads; none directly — the registry is probed. */
export const inject: string[] = [];

/** One registered projection unit, narrowed to what this half calls. */
interface ProjectionRegistryLike {
  register(definition: typeof sessionCompactionProjection): () => void;
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
 * Register the `sessionCompaction` unit.
 *
 * The registration rides this plugin's own fiber (through `effect`), so unloading
 * the plugin takes the key back out of every snapshot instead of leaving a value
 * no one maintains.
 * @param scope - scope carrying the registry.
 */
function registerProjection(scope: ProjectionScopeLike): void {
  scope.effect(
    () => scope.sessionProjections.register(sessionCompactionProjection),
    "dsh-better: sessionCompaction projection",
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
  ): Promise<{ readonly name: string; readonly path?: string; readonly metadata?: unknown } | undefined>;
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
): Promise<{ name: string; path?: string; argumentHint?: string; metadata?: unknown } | undefined> {
  const skills = readService(ctx, "skills") as SkillsFace | undefined;
  if (skills === undefined) return undefined;
  const definition = await skills.get(name, cwd === undefined ? undefined : { cwd });
  if (definition === undefined) return undefined;

  let argumentHint: string | undefined;
  if (typeof definition.path === "string" && definition.path !== "") {
    try {
      argumentHint = readFrontmatterArgumentHint(await readFile(definition.path, "utf8"));
    } catch {
      argumentHint = undefined;
    }
  }

  const profile: { name: string; path?: string; argumentHint?: string; metadata?: unknown } = { name: definition.name };
  if (definition.path !== undefined) profile.path = definition.path;
  if (argumentHint !== undefined) profile.argumentHint = argumentHint;
  if (definition.metadata !== undefined) profile.metadata = definition.metadata;
  return profile;
}

/**
 * Mount the skill-profile route when the host has a web server.
 *
 * A one-shot probe, deliberately: the route is an enhancement, and a host that
 * grows its web server after this fiber activates simply leaves the route
 * unmounted. The client then degrades to showing the skill's name and path
 * without parameters, which is the same thing it shows for a skill whose
 * frontmatter has no hint. Nothing else this package does is affected.
 * @param ctx - host context.
 */
function registerSkillProfile(ctx: HostContextLike): void {
  const mount = (webServer: WebServerFace): void => {
    ctx.effect(
      () =>
        registerSkillProfileRoutes(webServer, {
          loadSkill: (name, cwd) => loadSkillProfile(ctx, name, cwd),
          resolveCwd: sessionId => resolveSessionCwd(ctx, sessionId),
        }),
      "dsh-better: skill profile route",
    );
  };

  const present = readService(ctx, "webServer") as WebServerFace | undefined;
  if (present !== undefined && present !== null) {
    mount(present);
    return;
  }
  // Older hosts expose the service only through `inject`; the callback fires
  // when the server appears, and never fires when it does not.
  ctx.inject?.<{ readonly webServer: WebServerFace }>(["webServer"], scope => {
    if (scope.webServer !== undefined && scope.webServer !== null) mount(scope.webServer);
  });
}
