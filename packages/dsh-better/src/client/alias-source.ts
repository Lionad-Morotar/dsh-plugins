/**
 * The `/` trigger source that lists configured aliases inside the shipped slash
 * menu. It is a normal participant in the host's input-trigger pipeline, so the
 * menu it appears in is the native one: same ordering, same fuzzy filtering,
 * same keyboard contract (↑/↓, Enter, Tab, Escape), same pointer behaviour, and
 * the same `技能/指令` section styling as the skill picker in the screenshot.
 *
 * The source intentionally implements only `candidates` and `onPick`. Space and
 * Enter adjudication stay with the shipped command/skill sources: an alias is a
 * view over rows, not a host command, and should be chosen from the panel rather
 * than silently executed by a keystroke.
 */
import type { AliasConfig, AliasRow } from "./alias-store.ts";
import { aliasExpansion, matchAliasRows } from "./alias-store.ts";

/** The source name; also the group key in the menu ledger. */
export const ALIAS_SOURCE_NAME = "alias";

/** The trigger this source participates in. */
export const ALIAS_SOURCE_TRIGGER = "/";

/**
 * Menu order; below the shipped command source's default 0 so a filtered query
 * puts alias rows above command rows, but still a normal group in the full menu.
 */
export const ALIAS_SOURCE_ORDER = -1;

/** Candidate shape accepted by the host menu (display data only). */
export interface AliasCandidate {
  readonly name: string;
  readonly label?: string;
  readonly description?: string;
  readonly section?: string;
  readonly value?: string;
}

/** Session projection the host passes to every source callback. */
export interface AliasSession {
  readonly sessionId: string;
}

/** Request shape; only the fields this source reads. */
export interface AliasCandidateRequest {
  readonly query: string;
  readonly position: "leading" | "inline";
}

/** Pick shape; only the fields this source reads. */
export interface AliasPick {
  readonly candidate: AliasCandidate;
}

/** The output a pick returns to the input machine. */
export type AliasPickOutcome = { readonly text: string } | undefined;

/** Translator seat owned by this package. */
export type AliasTranslate = (key: string, params?: Record<string, string | number>) => string;

/** What the source reads on every request. */
export interface AliasSourceDeps {
  /** Current document; read lazily so settings edits apply without re-registering. */
  readonly config: () => AliasConfig;
  readonly translate: AliasTranslate;
  /**
   * Whether the bare-word watcher is currently opening this source
   * programmatically. With the prefix switch off the source stays out of the
   * normal slash menu, but must still serve the synthetic menu the watcher
   * opens for `wf`.
   */
  readonly bareMenuOpen?: () => boolean;
}

/** The structural source object the host registry accepts. */
export interface AliasSource {
  readonly trigger: "/";
  readonly name: string;
  readonly order: number;
  candidates(session: AliasSession, request: AliasCandidateRequest): Promise<readonly AliasCandidate[]>;
  onPick(pick: AliasPick): AliasPickOutcome;
}

/**
 * Map one row to a menu row.
 *
 * `label` is the keyword the user types and `name` is the canonical target. The
 * shipped menu renders `label` first and the differing `name` as its trailing
 * alias, which reads as `wf  flow-workflow`; params stay in the right-aligned
 * description column exactly like a skill description.
 * @param row - configured alias.
 * @param translate - package translator.
 * @returns the display row.
 */
export function aliasCandidateOf(row: AliasRow, translate: AliasTranslate): AliasCandidate {
  const target = row.target.trim().replace(/^\/+/, "");
  const keyword = row.keyword.trim();
  const params = row.params.trim();
  return {
    name: target,
    label: keyword,
    ...(params === ""
      ? {}
      : { description: translate("alias.menu.params", { value: params }) }),
    section: translate("alias.menu.section"),
    value: row.id,
  };
}

/**
 * Build the trigger source.
 * @param deps - lazy config and translator.
 * @returns the source to register with `ctx.inputTriggers`.
 */
export function createAliasSource(deps: AliasSourceDeps): AliasSource {
  return {
    trigger: ALIAS_SOURCE_TRIGGER,
    name: ALIAS_SOURCE_NAME,
    order: ALIAS_SOURCE_ORDER,
    async candidates(_session, request) {
      // Slash commands are a leading-draft gesture; aliases follow the same
      // rule so a mid-sentence `/wf` remains ordinary text. The empty query
      // lists every alias: typing `/` is how the panel is discovered, exactly
      // like the shipped skill group.
      if (request.position !== "leading") return [];
      const config = deps.config();
      // Prefix mode off means the alias is a bare word; it must not also claim
      // a slash spelling in the shipped command/skill menu. The one exception is
      // the synthetic menu the watcher opens for that bare keyword.
      if (!config.prefix && deps.bareMenuOpen?.() !== true) return [];
      return matchAliasRows(config, request.query, true).map((row) =>
        aliasCandidateOf(row, deps.translate),
      );
    },
    onPick({ candidate }) {
      const row = deps.config().rows.find((item) => item.id === candidate.value);
      if (row === undefined) return undefined;
      const text = aliasExpansion(row);
      return text === "" ? undefined : { text };
    },
  };
}
