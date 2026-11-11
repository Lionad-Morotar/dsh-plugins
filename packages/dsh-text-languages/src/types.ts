/**
 * Shared vocabulary for the language catalogue.
 *
 * `disposition` records how honestly a language can be coloured today, not how
 * important it is: `exact` has a real grammar package, `approx` borrows a
 * neighbouring grammar, `backlog` is deliberately left monochrome because a
 * forced approximation would paint the wrong colours, and `excluded` marks a
 * language that has no file entry of its own (it only exists inside a host
 * grammar). Keeping the four apart is what lets a later pass promote rows
 * without re-reading the research.
 */
export type LanguageDisposition = "exact" | "approx" | "backlog" | "excluded";

/** A language row as the matcher sees it, after the repo's overrides are applied. */
export interface LanguageDescriptor {
  readonly id: string;
  readonly extensions: readonly string[];
  readonly filenames: readonly string[];
  readonly filenamePatterns: readonly string[];
  readonly aliases: readonly string[];
  readonly firstLine: string | null;
  readonly disposition: LanguageDisposition;
  /** True when this language ships as its own lazily loaded syntax chunk. */
  readonly chunk: boolean;
  /** True for rows this repo keeps without upstream backing (vue, svelte). */
  readonly nonBuiltin: boolean;
  /** What colours an approximated language, named without its package scope. */
  readonly grammar?: string;
  /** Why the row is not `exact`, for the dispositions that need a reason. */
  readonly reason?: string;
}
