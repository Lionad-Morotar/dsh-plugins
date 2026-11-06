/**
 * Which text files the editable renderer claims.
 *
 * The claim is an allow-list, never a catch-all. The explorer's `builtin.source`
 * is the catch-all at priority -1000, and it has to stay the answer for every
 * file this plugin cannot edit: a binary family (an image, a PDF) is matched
 * earlier by its own renderer, but a suffix-less name or an unknown extension
 * would land here and get an editor that cannot save it.
 *
 * The list is deliberately the explorer's own language vocabulary plus the
 * plain-text names an editor opens. Anything outside it keeps the read-only
 * source view, which is a correct answer rather than a degraded one.
 */

/** Suffixes this renderer edits, without the leading dot. */
export const TEXT_SUFFIXES: readonly string[] = [
  // Documents
  "txt", "text", "log", "rst", "adoc",
  // Data
  "json", "jsonc", "json5", "jsonl", "ndjson", "yml", "yaml", "toml", "xml",
  // Code
  "ts", "tsx", "mts", "cts", "js", "jsx", "mjs", "cjs", "vue", "svelte", "astro",
  "py", "pyi", "rb", "go", "rs", "java", "kt", "kts", "scala", "clj", "cljs",
  "c", "cc", "cpp", "cxx", "h", "hh", "hpp", "cs", "fs", "fsx", "php", "swift",
  "m", "mm", "lua", "r", "pl", "sql", "graphql", "gql", "proto",
  // Shell
  "sh", "bash", "zsh", "fish", "ps1", "bat", "cmd",
  // Style and markup
  "css", "scss", "sass", "less", "styl", "html", "htm",
  // Configuration
  "ini", "cfg", "conf", "env", "properties",
  // Generated text
  "lock", "diff", "patch",
];

/**
 * Suffix-less names an editor opens as text.
 *
 * These have no dot to match on, so they need their own list; without it the
 * catch-all would keep them read-only for no reason a reader could see.
 */
export const TEXT_NAMES: readonly string[] = ["makefile", "dockerfile", "license", "readme", "changelog"];

/**
 * Suffixes this renderer must never claim, whatever else says.
 *
 * `md` and `markdown` belong to the Markdown renderer, which is the same plugin
 * at a higher priority; listing them here keeps the two claims from depending on
 * priority arithmetic alone. `csv` and `tsv` are excluded because the built-in
 * preview renders them as tables, which is better than an editor over commas.
 */
export const EXCLUDED_SUFFIXES: readonly string[] = ["md", "markdown", "mdx", "mdown", "csv", "tsv"];

/**
 * The suffix of one basename, without the dot.
 *
 * A leading dot names a dotfile rather than a suffix, so `.gitignore` answers
 * `gitignore` and `.png` (a file literally named that) answers nothing. The
 * explorer's registry reads names the same way, and the two must agree or a file
 * would be claimed by one and not the other.
 * @param path - workspace path or bare filename.
 * @returns the lowercased suffix, or an empty string when there is none.
 */
export function suffixOf(path: string): string {
  const base = path.slice(path.lastIndexOf("/") + 1).toLowerCase();
  const dot = base.lastIndexOf(".");
  return dot <= 0 ? "" : base.slice(dot + 1);
}

/**
 * Whether this renderer may take one file.
 *
 * The exclusions run first: a Markdown file matches the suffix list's spirit but
 * belongs to the other renderer, and a csv belongs to the table preview.
 * @param path - workspace path or bare filename.
 * @returns true when the editable renderer should claim the file.
 */
export function claimsTextFile(path: string): boolean {
  const base = path.slice(path.lastIndexOf("/") + 1).toLowerCase();
  if (base === "") return false;
  const suffix = suffixOf(path);
  if (suffix === "") return TEXT_NAMES.includes(base);
  if (EXCLUDED_SUFFIXES.includes(suffix)) return false;
  return TEXT_SUFFIXES.includes(suffix);
}
