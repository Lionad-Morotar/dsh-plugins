/**
 * Workspace-branch scope resolution for the terminal dock.
 *
 * A terminal belongs to a working tree on a branch, not to a conversation:
 * switching between two conversations in the same checkout must land in the
 * same shells, and checking out another branch must not. This module turns one
 * session id into that identity, using the host's session store for the
 * directory and Git for the branch.
 *
 * The anchor is the session whose terminal processes the scope runs under. The
 * host's terminal service is session-owned (its browser views are keyed by
 * `(sessionId, key, contentId)` and process allocation resolves that session's
 * agent), so a shared scope still needs exactly one owner session. The anchor
 * lives in host memory: it is stable for the host lifetime, and a host restart
 * ends every terminal process anyway, so nothing needs to outlive the process.
 */
import { realpath } from "node:fs/promises";

import type { GitRunner } from "./git.ts";
import type { ScopePayload } from "../shared.ts";

/** Structural slice of the live sessions store. */
export interface SessionsFace {
  get(id: string): { readonly header?: { readonly cwd?: string } } | undefined;
}

/** Structural slice of the persisted session store, for sessions that are not live. */
export interface SessionPersistenceFace {
  stat(id: string): Promise<{ readonly header?: { readonly cwd?: string } } | undefined>;
}

/** One resolved scope plus the session that owns its host terminals. */
export interface ResolvedScope {
  readonly scope: ScopePayload;
  readonly anchor: string;
}

/** Why a session could not be resolved to a scope. */
export type ScopeFailureCode = "no-session" | "no-cwd";

/** The resolver the route layer calls. */
export interface ScopeResolver {
  resolve(sessionId: string): Promise<ResolvedScope | undefined>;
  /** Whether a session still exists, for validating a remembered anchor. */
  knows(sessionId: string): Promise<boolean>;
}

/** What the resolver needs from the host. */
export interface ScopeResolverInput {
  readonly git: GitRunner;
  readonly sessions: SessionsFace | undefined;
  readonly persistence: SessionPersistenceFace | undefined;
  /**
   * Read or claim the anchor for one scope key.
   *
   * A remembered anchor is reused only while it still exists; the resolver
   * decides that and hands the chosen one back through `remember`.
   */
  readonly anchors: AnchorLedger;
}

/** Host-memory map from scope key to the session that owns its terminals. */
export interface AnchorLedger {
  get(key: string): string | undefined;
  set(key: string, sessionId: string): void;
}

/** How many scopes the ledger remembers before dropping the oldest. */
const ANCHOR_LIMIT = 256;

/**
 * Create the anchor ledger.
 *
 * Insertion-ordered so the oldest scope is the one evicted; a Map's keys keep
 * insertion order and `set` on an existing key does not move it, which is what
 * keeps a busy scope's anchor from ageing out while idle ones stay.
 * @returns the ledger.
 */
export function createAnchorLedger(): AnchorLedger {
  const entries = new Map<string, string>();
  return {
    get: key => entries.get(key),
    set(key, sessionId) {
      if (entries.has(key)) {
        entries.set(key, sessionId);
        return;
      }
      entries.set(key, sessionId);
      while (entries.size > ANCHOR_LIMIT) {
        const oldest = entries.keys().next().value;
        if (oldest === undefined) return;
        entries.delete(oldest);
      }
    },
  };
}

/** Canonicalize a directory so two spellings of one tree share a scope. */
async function canonical(dir: string): Promise<string> {
  try {
    return await realpath(dir);
  } catch {
    return dir;
  }
}

/** Trim a command's stdout to the one line the caller reads. */
function firstLine(text: string): string {
  const line = text.trim().split("\n")[0] ?? "";
  return line.trim();
}

/**
 * Read the checked-out branch of one working tree.
 *
 * `symbolic-ref` is asked first because it also answers on a repository whose
 * branch has no commit yet, where `rev-parse HEAD` fails. A detached HEAD has no
 * symbolic ref, so the short commit hash becomes the scope's branch name: two
 * detached checkouts of different commits must not share terminals.
 * @param git - the runner.
 * @param cwd - working tree to read.
 * @returns the branch label and whether HEAD is detached; null outside a repo.
 */
export async function readBranch(git: GitRunner, cwd: string): Promise<{ branch: string | null; detached: boolean }> {
  const symbolic = await git.run(["symbolic-ref", "--quiet", "--short", "HEAD"], cwd);
  if (symbolic.exitCode === 0 && !symbolic.timedOut) {
    const branch = firstLine(symbolic.stdout);
    if (branch !== "") return { branch, detached: false };
  }
  const head = await git.run(["rev-parse", "--short=7", "HEAD"], cwd);
  if (head.exitCode === 0 && !head.timedOut) {
    const sha = firstLine(head.stdout);
    if (sha !== "") return { branch: `detached@${sha}`, detached: true };
  }
  return { branch: null, detached: false };
}

/**
 * Build the scope key.
 *
 * The branch is part of the identity, so a checkout produces a different key and
 * therefore a different terminal set. A workspace without Git still gets one
 * scope of its own.
 * @param workspace - canonical working directory.
 * @param branch - branch label, or null outside a repo.
 * @returns the opaque key the client and the anchor ledger both use.
 */
export function scopeKey(workspace: string, branch: string | null): string {
  return `${workspace}::${branch ?? "(no-branch)"}`;
}

/**
 * Resolve the session's directory and branch.
 *
 * The live session header wins over the persisted one: a session that is on
 * screen is necessarily live, and only a history entry needs the store read
 * from disk.
 * @param sessionId - the session on screen.
 * @param input - the Git runner and session stores.
 * @returns the scope and its anchor, or undefined when the session has no directory.
 */
export async function resolveScope(sessionId: string, input: ScopeResolverInput): Promise<ResolvedScope | undefined> {
  const directory = await sessionDirectory(sessionId, input);
  if (directory === undefined) return undefined;
  const workspace = await canonical(directory);
  const { branch, detached } = await readBranch(input.git, workspace);
  const scope: ScopePayload = { key: scopeKey(workspace, branch), workspace, branch, detached };
  const remembered = input.anchors.get(scope.key);
  const anchor = remembered !== undefined && (await sessionExists(remembered, input))
    ? remembered
    : sessionId;
  input.anchors.set(scope.key, anchor);
  return { scope, anchor };
}

/** Read one session's working directory from the live store, then persistence. */
async function sessionDirectory(sessionId: string, input: ScopeResolverInput): Promise<string | undefined> {
  const live = input.sessions?.get(sessionId)?.header?.cwd;
  if (typeof live === "string" && live !== "") return live;
  try {
    const persisted = (await input.persistence?.stat(sessionId))?.header?.cwd;
    if (typeof persisted === "string" && persisted !== "") return persisted;
  } catch {
    // A session being written or rotated is the same outcome as an absent one.
  }
  return undefined;
}

/** Whether one session still exists in either store. */
export async function sessionExists(sessionId: string, input: Pick<ScopeResolverInput, "sessions" | "persistence">): Promise<boolean> {
  if (sessionId === "") return false;
  if (input.sessions?.get(sessionId) !== undefined) return true;
  try {
    return (await input.persistence?.stat(sessionId)) !== undefined;
  } catch {
    return false;
  }
}

/**
 * Build the resolver for one host mount.
 * @param input - the runners, stores and anchor ledger.
 * @returns the resolver the route layer consumes.
 */
export function createScopeResolver(input: ScopeResolverInput): ScopeResolver {
  return {
    resolve: sessionId => resolveScope(sessionId, input),
    knows: sessionId => sessionExists(sessionId, input),
  };
}
