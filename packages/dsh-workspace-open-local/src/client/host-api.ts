/**
 * The host's open-in-app routes, addressed the way a page does.
 *
 * The host registers absolute pathnames (`/open-in-app/...`). A document-relative
 * request keeps working when the app is mounted under a prefix, so the strings
 * here are those pathnames with the leading slash removed. See the host note
 * `2026-09-14-web-document-relative-app-routes`.
 */
export const OPEN_IN_APP_APPS_ROUTE = "open-in-app/apps";
export const OPEN_IN_APP_OPEN_ROUTE = "open-in-app/open";

const OPEN_IN_APP_ICON_PREFIX_ROUTE = "open-in-app/icon";

/** One application's icon route. The id is one path segment, so it is encoded. */
export function openInAppIconRoute(applicationId: string): string {
  return `${OPEN_IN_APP_ICON_PREFIX_ROUTE}/${encodeURIComponent(applicationId)}`;
}

/**
 * Shared with the host split button.
 *
 * Its snapshot store persists the chosen id by `JSON.stringify` of the whole
 * state (a string), under this exact key. The wrapper is the store's, not a
 * documented schema, so a reader that only accepts one shape will forget a
 * choice the host still honours.
 */
export const OPEN_IN_APP_CHOICE_KEY = "dsh.open-in-app.choice";

/** Storage the caller injects. Tests pass memory; the page passes `localStorage`. */
export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

/** A catalog or launch the host refused, distinct from a transport throw. */
export class OpenInAppError extends Error {
  readonly kind: "unavailable" | "launch" | "catalog";

  constructor(kind: "unavailable" | "launch" | "catalog", message: string) {
    super(message);
    this.name = "OpenInAppError";
    this.kind = kind;
  }
}

/** The slice of `fetch` this face uses. Injected so tests never touch the network. */
export type FetchLike = (
  input: string,
  init?: { method?: string; headers?: Record<string, string>; body?: string; signal?: AbortSignal },
) => Promise<{ ok: boolean; status: number; json(): Promise<unknown> }>;

/** Catalog, launch, and icon addressing against one host origin. */
export interface OpenInAppHost {
  /** Resolved application ids. SSH sessions and a host without the capability answer none. */
  listApplications(signal?: AbortSignal): Promise<string[]>;
  /** Open one directory in one application. Rejects with {@link OpenInAppError}. */
  openDirectory(applicationId: string, directoryPath: string): Promise<void>;
  iconUrl(applicationId: string): string;
}

/** Join a base and a document-relative route without producing a double slash. */
function routeUrl(baseUrl: string, route: string): string {
  if (baseUrl === "") return route;
  return `${baseUrl.replace(/\/$/, "")}/${route}`;
}

/**
 * One host face.
 *
 * `baseUrl` defaults to "" so requests stay relative to the page: the host
 * answers them on the same origin the document was loaded from.
 */
export function createOpenInAppHost(options?: { fetchImpl?: FetchLike; baseUrl?: string }): OpenInAppHost {
  const fetchImpl = options?.fetchImpl ?? (globalThis.fetch as unknown as FetchLike);
  const baseUrl = options?.baseUrl ?? "";

  return {
    async listApplications(signal) {
      let response: { ok: boolean; status: number; json(): Promise<unknown> };
      try {
        response = await fetchImpl(routeUrl(baseUrl, OPEN_IN_APP_APPS_ROUTE), {
          headers: { accept: "application/json" },
          ...(signal === undefined ? {} : { signal }),
        });
      } catch (error) {
        throw new OpenInAppError("catalog", error instanceof Error ? error.message : "catalog unreachable");
      }
      if (!response.ok) throw new OpenInAppError("catalog", `catalog failed: HTTP ${String(response.status)}`);
      let payload: unknown;
      try {
        payload = await response.json();
      } catch (error) {
        throw new OpenInAppError("catalog", error instanceof Error ? error.message : "catalog unreadable");
      }
      if (typeof payload !== "object" || payload === null || !("apps" in payload) || !Array.isArray(payload.apps)) {
        throw new OpenInAppError("catalog", "catalog is not an apps list");
      }
      const seen = new Set<string>();
      for (const id of payload.apps) {
        if (typeof id === "string" && id !== "") seen.add(id);
      }
      return [...seen];
    },

    async openDirectory(applicationId, directoryPath) {
      const body = JSON.stringify({ app: applicationId, path: directoryPath });
      let response: { ok: boolean; status: number };
      try {
        response = await fetchImpl(routeUrl(baseUrl, OPEN_IN_APP_OPEN_ROUTE), {
          method: "POST",
          headers: { "content-type": "application/json" },
          body,
        });
      } catch (error) {
        throw new OpenInAppError("launch", error instanceof Error ? error.message : "launch unreachable");
      }
      if (!response.ok) throw new OpenInAppError("launch", `open failed: HTTP ${String(response.status)}`);
    },

    iconUrl(applicationId) {
      return routeUrl(baseUrl, openInAppIconRoute(applicationId));
    },
  };
}

/**
 * The application a menu should open with before the user picks.
 *
 * A remembered id that the host no longer resolves (uninstalled, SSH) is not a
 * choice, so the list's first id takes over. An empty list has no default.
 */
export function resolveDefaultApplication(applications: readonly string[], remembered: string | null): string | null {
  if (applications.length === 0) return null;
  if (remembered !== null && applications.includes(remembered)) return remembered;
  return applications[0] ?? null;
}

/**
 * A bare id is one token: letters, digits, dot, underscore, hyphen.
 *
 * The host catalog ids are exactly that shape. A looser "anything that is not
 * JSON" would treat a corrupt slot (`not json {`) as a remembered application
 * and then offer it as the default.
 */
const BARE_APPLICATION_ID = /^[A-Za-z0-9][A-Za-z0-9._-]*$/;

/** Fields a wrapper might keep the id in, first match wins. */
const WRAPPER_KEYS = ["value", "choice", "app"] as const;

/** Pull an application id out of one recognised stored document. */
function applicationIdFromStored(raw: string): string | null {
  const trimmed = raw.trim();
  if (trimmed === "") return null;
  // A leading digit is JSON too (`7`), and a number is not an application id.
  // Try the parse first so that case falls through to "unrecognised" instead
  // of being kept as a bare token.
  if (trimmed.startsWith("{") || trimmed.startsWith("[") || trimmed.startsWith('"') || /^-?\d/.test(trimmed)) {
    let parsed: unknown;
    try {
      parsed = JSON.parse(trimmed);
    } catch {
      return null;
    }
    return applicationIdFromParsed(parsed);
  }
  return BARE_APPLICATION_ID.test(trimmed) ? trimmed : null;
}

/** A parsed document: a bare string, or the one field a wrapper might use. */
function applicationIdFromParsed(parsed: unknown): string | null {
  if (typeof parsed === "string") return parsed === "" ? null : parsed;
  if (typeof parsed !== "object" || parsed === null) return null;
  const record = parsed as Record<string, unknown>;
  for (const key of WRAPPER_KEYS) {
    if (key in record) {
      const field = record[key];
      return typeof field === "string" && field !== "" ? field : null;
    }
  }
  return null;
}

/**
 * The id the host last stored, or null when the slot is missing or unreadable.
 *
 * The store writes `JSON.stringify` of a string, but the wrapper was never
 * pinned down, and a hand edit or an older build may have left a bare string
 * or a `{value|choice|app}` object. Anything else, including a throwing
 * storage, is "no memory" rather than a crash in a menu.
 */
export function readRememberedApplication(storage: StorageLike | null | undefined): string | null {
  if (storage == null) return null;
  let raw: string | null;
  try {
    raw = storage.getItem(OPEN_IN_APP_CHOICE_KEY);
  } catch {
    return null;
  }
  if (raw === null) return null;
  return applicationIdFromStored(raw);
}

/** Put `applicationId` back into whichever wrapper `previousRaw` used. */
function rewriteStored(previousRaw: string | null | undefined, applicationId: string): string {
  if (previousRaw == null || previousRaw.trim() === "") return JSON.stringify(applicationId);
  const trimmed = previousRaw.trim();
  if (trimmed.startsWith("{")) {
    try {
      const parsed: unknown = JSON.parse(trimmed);
      if (typeof parsed === "object" && parsed !== null) {
        const record = parsed as Record<string, unknown>;
        for (const key of WRAPPER_KEYS) {
          if (key in record && typeof record[key] === "string") {
            return JSON.stringify({ ...record, [key]: applicationId });
          }
        }
      }
    } catch {
      // Fall through: an unreadable wrapper is replaced, not preserved.
    }
  }
  // A bare id, a quoted string, or anything unreadable all land on the host
  // store's own shape. The host rehydrates with JSON.parse, so handing a bare
  // id back would make the shared choice unreadable to it.
  return JSON.stringify(applicationId);
}

/**
 * Remember one application id, keeping the wrapper the slot already had.
 *
 * A fresh slot gets the host store's own shape, a JSON string, so the host
 * button rehydrates it. A write that throws (quota, private mode) is ignored:
 * the host store treats a storage failure as disabled persistence, not an error.
 */
export function rememberApplication(
  storage: StorageLike | null | undefined,
  applicationId: string,
  previousRaw?: string | null,
): void {
  if (storage == null) return;
  let prior = previousRaw;
  if (prior === undefined) {
    try {
      prior = storage.getItem(OPEN_IN_APP_CHOICE_KEY);
    } catch {
      prior = null;
    }
  }
  try {
    storage.setItem(OPEN_IN_APP_CHOICE_KEY, rewriteStored(prior, applicationId));
  } catch {
    // Persistence is optional; the launch already happened or is about to.
  }
}
