/**
 * The two strings this contribution adds to the shared menu.
 *
 * The host ships eight selectable languages and falls back to English for a
 * namespace that lacks the active one, so only zh and en are registered: a
 * reader in ja/es/fr/de/ru/pt sees the English row instead of a missing one.
 * That is the language hole the previous DOM anchor had, and it is the reason
 * the anchor's label whitelist is gone.
 */
export const LOCALE_NAMESPACE = "workspace-open-local";

/** Flat key set, so the two dictionaries cannot drift apart. */
export type WorkspaceOpenLocalDict = {
  /** Parent row: offers applications rather than opening with one. */
  readonly "menu.open": string;
  /** Shown when a launch rejects. */
  readonly "menu.failed": string;
};

export const ZH: WorkspaceOpenLocalDict = {
  "menu.open": "在本地打开",
  "menu.failed": "打开失败",
};

export const EN: WorkspaceOpenLocalDict = {
  "menu.open": "Open in app",
  "menu.failed": "Could not open",
};
