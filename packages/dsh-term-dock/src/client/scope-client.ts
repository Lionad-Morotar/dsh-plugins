/**
 * The client's read of the host's workspace-branch scope.
 *
 * The dock cannot see Git, so it asks the host's `/term-dock/api/scope` for the
 * scope of the session on screen. Every failure — a host without the route, a
 * malformed answer, an abort — is the same outcome: undefined, and the caller
 * falls back to a per-session scope. A terminal must not disappear because a
 * label could not be computed.
 */
import { ROUTE_PREFIX, type ScopePayload, type ScopeResponse } from "../shared.ts";

/** One scope and the session that owns its host terminals. */
export interface ScopeResolution {
  readonly scope: ScopePayload;
  /** The session the scope's terminal views are created under. */
  readonly anchor: string;
}

/** Asks the host for the scope of one session. */
export interface ScopeSource {
  /**
   * Resolve one session's scope.
   * @param sessionId - the session on screen.
   * @param signal - cancels the request when the reader moves on.
   * @returns the scope, or undefined when the host cannot answer.
   */
  resolve(sessionId: string, signal?: AbortSignal): Promise<ScopeResolution | undefined>;
}

/** Whether a value looks like a scope payload; the wire is not trusted. */
export function isScopePayload(value: unknown): value is ScopePayload {
  if (value === null || typeof value !== "object") return false;
  const record = value as Record<string, unknown>;
  if (typeof record.key !== "string" || record.key === "") return false;
  if (typeof record.workspace !== "string") return false;
  if (record.branch !== null && typeof record.branch !== "string") return false;
  return typeof record.detached === "boolean";
}

/**
 * Validate one response body.
 * @param body - parsed JSON, of unknown shape.
 * @returns the resolution, or undefined for a failure or malformed body.
 */
export function readScopeResponse(body: unknown): ScopeResolution | undefined {
  if (body === null || typeof body !== "object") return undefined;
  const record = body as Partial<ScopeResponse> & Record<string, unknown>;
  if (record.ok !== true) return undefined;
  if (!isScopePayload(record.scope)) return undefined;
  if (typeof record.anchor !== "string" || record.anchor === "") return undefined;
  return { scope: record.scope, anchor: record.anchor };
}

/**
 * Build the HTTP source.
 *
 * Every request is a same-origin relative path: the GUI port changes on every
 * host boot, so an absolute URL composed here would be stale immediately.
 * @param fetchImpl - the fetch to use; injectable for tests.
 * @returns the source.
 */
export function createHttpScopeSource(fetchImpl: typeof fetch = fetch): ScopeSource {
  return {
    async resolve(sessionId, signal) {
      if (sessionId === "") return undefined;
      const query = new URLSearchParams({ sessionId }).toString();
      try {
        const response = await fetchImpl(`${ROUTE_PREFIX}/scope?${query}`, {
          signal,
          headers: { accept: "application/json" },
        });
        if (!response.ok) return undefined;
        return readScopeResponse(await response.json());
      } catch {
        return undefined;
      }
    },
  };
}

/**
 * The pre-scope behaviour, kept as the fallback: one terminal set per session.
 * @param sessionId - the session on screen.
 * @returns a scope keyed by that session and anchored to it.
 */
export function sessionScope(sessionId: string): ScopeResolution {
  return {
    scope: { key: `session:${sessionId}`, workspace: "", branch: null, detached: false },
    anchor: sessionId,
  };
}

/**
 * The short label the dock header shows for a scope.
 *
 * The branch is the part that explains why a terminal set appeared or vanished
 * when the reader switched conversations; the workspace is already implied by
 * the conversation the dock hangs under.
 * @param scope - the resolved scope.
 * @returns the branch label, or undefined when the workspace is not a repository.
 */
export function scopeLabel(scope: ScopePayload): string | undefined {
  if (scope.branch === null || scope.branch === "") return undefined;
  return scope.branch;
}
