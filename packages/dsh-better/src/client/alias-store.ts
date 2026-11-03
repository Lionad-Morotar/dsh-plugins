/**
 * Skill/slash aliases: the durable document and the pure matching rules.
 *
 * An alias is a short word the composer can turn into a slash invocation, e.g.
 * `wf` → `/flow-workflow run`. Two decisions live here because everything else
 * (the settings page, the slash source and the bare-word watcher) must agree on
 * them:
 *
 *   - what a stored row may contain. The page edits rows keystroke by keystroke,
 *     so an empty keyword or target is a legal *draft*; it is simply not usable
 *     for matching until both fields exist. Reading therefore keeps strings as
 *     written instead of dropping "incomplete" rows, while matching filters.
 *   - how a typed token maps to a row. Keywords are case-insensitive. A slash
 *     prefix mode requires `/wf`, the bare mode requires `wf`; both trigger only
 *     at the leading edge of the draft, exactly like slash commands.
 *
 * Storage failures are swallowed on purpose: an alias list that cannot be saved
 * still works for the current page load, and losing only the memory is the
 * failure a preference can survive.
 */

/** The key the alias document lives under. Namespaced by product beside the tab list. */
export const ALIAS_STORAGE_KEY = "dsh-better.skill-aliases";

/** Document version; a future migration reads this instead of guessing by shape. */
export const ALIAS_DOCUMENT_VERSION = 1;

/** One keyword → slash invocation mapping. */
export interface AliasRow {
  /** Stable row identity, so an input keeps focus while the list is edited. */
  readonly id: string;
  /** The word the user types, without a leading slash. May be empty while editing. */
  readonly keyword: string;
  /** Slash command or skill name, without the leading slash. May be empty while editing. */
  readonly target: string;
  /** Text appended after the target, verbatim. Empty means no arguments. */
  readonly params: string;
}

/** The persisted preference. */
export interface AliasConfig {
  /** Whether a typed alias requires the leading `/`. */
  readonly prefix: boolean;
  readonly rows: readonly AliasRow[];
}

/** The two calls the document makes on device storage. */
export interface AliasStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

/** The document a fresh install reads. Frozen so a caller cannot mutate the shared value. */
export const EMPTY_ALIAS_CONFIG: AliasConfig = Object.freeze({
  prefix: true,
  rows: Object.freeze([]) as readonly AliasRow[],
});

/** A mutable facade over the document; one instance is shared by every surface. */
export interface AliasStore {
  getSnapshot(): AliasConfig;
  subscribe(listener: () => void): () => void;
  setPrefix(prefix: boolean): void;
  /** Append an empty row and return its id. */
  addRow(): string;
  updateRow(id: string, patch: Partial<Omit<AliasRow, "id">>): void;
  removeRow(id: string): void;
}

/** Storage writes are best effort; see the module note. */
export function writeAliasConfig(storage: AliasStorage | undefined, config: AliasConfig): void {
  if (storage === undefined) return;
  try {
    storage.setItem(
      ALIAS_STORAGE_KEY,
      JSON.stringify({ v: ALIAS_DOCUMENT_VERSION, prefix: config.prefix, rows: config.rows }),
    );
  } catch {
    // See the module note.
  }
}

/** A string, or the given fallback for any other input. */
function text(value: unknown, fallback: string): string {
  return typeof value === "string" ? value : fallback;
}

/**
 * Read one persisted row.
 *
 * Keeps the raw strings: the settings page owns trimming and validation because
 * it is also the surface that lets a half-typed row exist. Only wrong types are
 * discarded.
 * @param value - unknown JSON value.
 * @param index - position, used to mint an id when the stored one is missing.
 * @returns a row, or undefined when the value cannot be a row at all.
 */
function readRow(value: unknown, index: number): AliasRow | undefined {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return undefined;
  const record = value as Record<string, unknown>;
  if (
    typeof record.keyword !== "string" &&
    typeof record.target !== "string" &&
    typeof record.params !== "string"
  ) {
    return undefined;
  }
  return {
    id: text(record.id, `alias-${index}`) || `alias-${index}`,
    keyword: text(record.keyword, ""),
    target: text(record.target, ""),
    params: text(record.params, ""),
  };
}

/**
 * Normalize a stored/unknown document.
 *
 * A missing document, invalid JSON, or a wrongly shaped root is "no aliases":
 * one corrupt write must not take down the settings page or the composer.
 * @param value - parsed JSON value, or undefined for a missing document.
 * @returns the normalized document.
 */
export function normalizeAliasConfig(value: unknown): AliasConfig {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return EMPTY_ALIAS_CONFIG;
  const record = value as Record<string, unknown>;
  const prefix = typeof record.prefix === "boolean" ? record.prefix : EMPTY_ALIAS_CONFIG.prefix;
  const rawRows = Array.isArray(record.rows) ? record.rows : [];
  const rows: AliasRow[] = [];
  const seenIds = new Set<string>();
  for (const [index, raw] of rawRows.slice(0, 200).entries()) {
    const row = readRow(raw, index);
    if (row === undefined) continue;
    // A duplicate id would make two inputs share a React key. Remint the later
    // one deterministically from its position so the document remains stable.
    let id = row.id;
    let suffix = 0;
    while (seenIds.has(id)) {
      suffix += 1;
      id = `alias-${index}-${suffix}`;
    }
    seenIds.add(id);
    rows.push({ ...row, id });
  }
  return { prefix, rows };
}

/**
 * Read the document from storage.
 * @param storage - device storage, or undefined outside a browser.
 * @returns the normalized document.
 */
export function readAliasConfig(storage: AliasStorage | undefined): AliasConfig {
  if (storage === undefined) return EMPTY_ALIAS_CONFIG;
  let raw: string | null;
  try {
    raw = storage.getItem(ALIAS_STORAGE_KEY);
  } catch {
    return EMPTY_ALIAS_CONFIG;
  }
  if (raw === null || raw === "") return EMPTY_ALIAS_CONFIG;
  try {
    return normalizeAliasConfig(JSON.parse(raw));
  } catch {
    return EMPTY_ALIAS_CONFIG;
  }
}

/** Id generator that works in browsers and in the node test environment. */
function nextId(): string {
  const cryptoApi = (globalThis as { crypto?: { randomUUID?: () => string } }).crypto;
  if (cryptoApi?.randomUUID !== undefined) return cryptoApi.randomUUID();
  return `alias-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Create the shared store.
 *
 * Every write publishes a fresh immutable snapshot and then persists it. The
 * publish happens before persistence because the UI must never wait on disk.
 * @param storage - device storage, or undefined for memory only.
 * @param mintId - id generator, injectable for deterministic tests.
 * @returns the store.
 */
export function createAliasStore(
  storage: AliasStorage | undefined,
  mintId: () => string = nextId,
): AliasStore {
  let snapshot = readAliasConfig(storage);
  const listeners = new Set<() => void>();

  const publish = (next: AliasConfig): void => {
    snapshot = next;
    for (const listener of [...listeners]) {
      try {
        listener();
      } catch (error) {
        console.error("[dsh-better] alias store listener failed:", error);
      }
    }
    writeAliasConfig(storage, next);
  };

  return {
    getSnapshot: () => snapshot,
    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    setPrefix(prefix) {
      if (snapshot.prefix === prefix) return;
      publish({ ...snapshot, prefix });
    },
    addRow() {
      const id = mintId();
      publish({ ...snapshot, rows: [...snapshot.rows, { id, keyword: "", target: "", params: "" }] });
      return id;
    },
    updateRow(id, patch) {
      let changed = false;
      const rows = snapshot.rows.map((row) => {
        if (row.id !== id) return row;
        const next = { ...row, ...patch, id: row.id };
        changed =
          next.keyword !== row.keyword || next.target !== row.target || next.params !== row.params;
        return next;
      });
      if (!changed) return;
      publish({ ...snapshot, rows });
    },
    removeRow(id) {
      const rows = snapshot.rows.filter((row) => row.id !== id);
      if (rows.length === snapshot.rows.length) return;
      publish({ ...snapshot, rows });
    },
  };
}

/** Whether a row can produce an invocation. Empty draft rows are kept but skipped. */
export function isUsableAliasRow(row: AliasRow): boolean {
  return row.keyword.trim() !== "" && row.target.trim() !== "";
}

/** The keyword used for comparison. */
export function normalizedKeyword(row: AliasRow): string {
  return row.keyword.trim().replace(/^\/+/, "").toLowerCase();
}

/** Rows whose keyword equals the given word, case-insensitively. */
export function rowsForKeyword(config: AliasConfig, keyword: string): readonly AliasRow[] {
  const wanted = keyword.trim().replace(/^\/+/, "").toLowerCase();
  if (wanted === "") return [];
  return config.rows.filter(
    (row) => isUsableAliasRow(row) && normalizedKeyword(row) === wanted,
  );
}

/**
 * The rows a live query reaches, exact matches first, then prefix and substring
 * matches. Empty queries list nothing: the alias group joins the slash menu only
 * once the user has typed something, so a bare `/` keeps the shipped menu count.
 * @param config - current document.
 * @param rawQuery - text typed after the trigger.
 * @param allowEmpty - list every usable row for an empty query.
 * @returns matching rows in stable source order within each rank.
 */
export function matchAliasRows(
  config: AliasConfig,
  rawQuery: string,
  allowEmpty = false,
): readonly AliasRow[] {
  const query = rawQuery.trim().replace(/^\/+/, "").toLowerCase();
  const usable = config.rows.filter(isUsableAliasRow);
  if (query === "") return allowEmpty ? usable : [];
  const exact: AliasRow[] = [];
  const prefix: AliasRow[] = [];
  const contains: AliasRow[] = [];
  for (const row of usable) {
    const keyword = normalizedKeyword(row);
    if (keyword === query) exact.push(row);
    else if (keyword.startsWith(query)) prefix.push(row);
    else if (keyword.includes(query)) contains.push(row);
  }
  return [...exact, ...prefix, ...contains];
}

/**
 * Render the text a pick inserts: the canonical slash invocation plus one
 * trailing space. A target written with a leading slash is accepted; params are
 * appended verbatim after trimming their edges.
 * @param row - the chosen alias row.
 * @returns the text to insert, or the empty string when the row is incomplete.
 */
export function aliasExpansion(row: AliasRow): string {
  const target = row.target.trim().replace(/^\/+/, "");
  if (target === "") return "";
  const params = row.params.trim();
  return params === "" ? `/${target} ` : `/${target} ${params} `;
}

/** One live draft match: the typed token, its span, and the rows it names. */
export interface AliasDraftMatch {
  /** Text used as the menu query, without the trigger. */
  readonly query: string;
  /** Replacement span; includes any delimiter whitespace typed after the keyword. */
  readonly start: number;
  readonly end: number;
  /** Rows whose keyword equals the token. Never empty when a match is returned. */
  readonly rows: readonly AliasRow[];
}

/**
 * Match a leading slash token such as `/wf` or `/wf `.
 *
 * Used by the watcher only after the native menu has closed (the shipped menu
 * itself owns the no-space typing experience). The span includes trailing
 * whitespace so a pick replaces the delimiter instead of leaving a double space.
 * @param config - current document.
 * @param draft - current draft text.
 * @returns the match, or undefined when the draft is not a prefixed alias token.
 */
export function matchPrefixedAliasDraft(config: AliasConfig, draft: string): AliasDraftMatch | undefined {
  const match = /^\/([^\s/]+)([ \t]*)$/u.exec(draft);
  if (match === null) return undefined;
  const token = match[1] ?? "";
  const rows = rowsForKeyword(config, token);
  if (rows.length === 0) return undefined;
  return { query: token, start: 0, end: draft.length, rows };
}

/**
 * Match a bare leading word such as `wf` or `wf `.
 *
 * Only exact keywords participate: opening on every prefix would flash the panel
 * while the user types an ordinary sentence that happens to start with a letter
 * shared with an alias.
 * @param config - current document.
 * @param draft - current draft text.
 * @returns the match, or undefined when the draft is not a bare alias token.
 */
export function matchBareAliasDraft(config: AliasConfig, draft: string): AliasDraftMatch | undefined {
  const match = /^([^\s/]+)([ \t]*)$/u.exec(draft);
  if (match === null) return undefined;
  const token = match[1] ?? "";
  const rows = rowsForKeyword(config, token);
  if (rows.length === 0) return undefined;
  return { query: token, start: 0, end: draft.length, rows };
}

/**
 * Explain, for the settings page, why a row is not active yet.
 * @param row - one row.
 * @returns a message key suffix, or undefined when the row is usable.
 */
export function aliasRowIssue(row: AliasRow): "keyword" | "target" | undefined {
  if (row.keyword.trim() === "") return "keyword";
  if (row.target.trim() === "") return "target";
  if (/\s/.test(row.keyword.trim())) return "keyword";
  return undefined;
}
