/**
 * Import extraction and resolution: turning source text into file-to-file edges.
 *
 * Everything here is pure. The reading (worktree files, `git cat-file` blobs,
 * `tsconfig.json`) lives in `structure.ts`; this module only sees text it is
 * handed, which is what makes the interesting rules testable without a
 * repository.
 *
 * `ts.preProcessFile` is the extractor rather than a full program: it is the
 * same scanner the compiler uses for its own module pre-processing, it needs no
 * type checker, and it is fast enough to run over every file in a tree. A real
 * `Program` would resolve imports for us but costs a whole type-check per file,
 * which is the wrong trade for a map that only needs the edge set.
 *
 * Three kinds of reference exist and only two of them become edges:
 *
 * - A literal specifier (`import x from "./a"`, `require("./a")`, and a literal
 *   `import("./a")`) is a candidate edge.
 * - A non-literal one (`import(name)`, `` import(`./x-${y}`) ``) cannot be
 *   resolved statically. `preProcessFile` drops these silently, so they are
 *   counted separately by a token scan and reported as unresolved. Dropping them
 *   without a count is the failure mode the requirement names explicitly.
 * - An external package (`react`) is not a file in this workspace. It is
 *   unresolved, never an edge to a same-named local file.
 *
 * Resolution is deliberately shallow: relative specifiers, plus the workspace's
 * own `compilerOptions.paths` aliases, plus the extension and `/index` probes a
 * bundler would try. Anything else is unresolved. Guessing harder (walking
 * `node_modules`, inferring a baseUrl mapping nobody configured) would invent
 * edges, and an invented edge is worse than a counted unknown.
 */
import { posix } from "node:path";

import ts from "typescript";

import type { ImportEdge, ImportState } from "../shared.ts";

/**
 * Extensions a bare or relative specifier may omit and still name a file.
 *
 * Ordered as a bundler resolves them, so `./x` picks `x.ts` over `x.js` when
 * both exist. `.d.ts` is not listed: it ends in `.ts` and is already covered.
 */
export const SCRIPT_EXTENSIONS: readonly string[] = [".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs"];

/**
 * Whether a path is source this module can extract imports from.
 *
 * Non-script files still take part in the structure index and the directory
 * totals; they just contribute no edges, which is what R9.3 asks for.
 * @param path - a repository-relative path.
 * @returns true for a TypeScript or JavaScript file.
 */
export function isScriptPath(path: string): boolean {
  return SCRIPT_EXTENSIONS.some(extension => path.endsWith(extension));
}

/** What one file's text yielded. */
export interface ExtractedImports {
  /** Literal specifiers, in source order, duplicates included. */
  readonly specifiers: readonly string[];
  /** Non-literal `import()` / `require()` calls: unresolvable by construction. */
  readonly dynamic: number;
}

/**
 * Walk the scanner out of a template literal it has already entered.
 *
 * A template with a substitution is scanned as `TemplateHead`, then ordinary
 * tokens for the expression, then a tail. Without this the scanner treats the
 * whole remainder of the file as template text, and every call after the first
 * interpolated template goes unseen.
 *
 * The tail token is `LastTemplateToken` in current TypeScript, where
 * `TemplateTail` is the same kind under an older name, so matching only the old
 * name is an infinite loop rather than a missed edge.
 * @param scanner - the scanner, positioned just after a `TemplateHead`.
 */
function skipTemplate(scanner: ts.Scanner): void {
  for (;;) {
    // The substitution expression is ordinary tokens; its closing brace is what
    // hands control back to the template.
    let token = scanner.scan();
    while (token !== ts.SyntaxKind.CloseBraceToken && token !== ts.SyntaxKind.EndOfFileToken) {
      token = scanner.scan();
    }
    if (token === ts.SyntaxKind.EndOfFileToken) return;
    const resumed = scanner.reScanTemplateToken(false);
    if (resumed === ts.SyntaxKind.LastTemplateToken || resumed === ts.SyntaxKind.EndOfFileToken) return;
  }
}

/**
 * Count `import(...)` and `require(...)` calls whose argument is not a literal.
 *
 * `preProcessFile` handles the literal forms itself and silently skips the rest,
 * so this scan exists only to make the skipped ones countable. It walks tokens
 * rather than text, which is what keeps a call inside a comment or a string from
 * being counted.
 *
 * `obj.require(x)` is not a module call, so a `require` preceded by `.` is
 * ignored. `import` needs no such guard: it is a reserved word and cannot be a
 * property name.
 * @param text - the file's source.
 * @returns how many calls could not be resolved statically.
 */
function countDynamicCalls(text: string): number {
  const scanner = ts.createScanner(ts.ScriptTarget.Latest, true, ts.LanguageVariant.Standard, text);
  let count = 0;
  let twoBack: ts.SyntaxKind = ts.SyntaxKind.Unknown;
  let previous: ts.SyntaxKind = ts.SyntaxKind.Unknown;
  let token = scanner.scan();
  while (token !== ts.SyntaxKind.EndOfFileToken) {
    if (token === ts.SyntaxKind.OpenParenToken) {
      const importCall = previous === ts.SyntaxKind.ImportKeyword;
      const requireCall = previous === ts.SyntaxKind.RequireKeyword && twoBack !== ts.SyntaxKind.DotToken;
      if (importCall || requireCall) {
        // The argument token is consumed here so the loop does not see a string
        // literal out of context; a literal is a resolved import, anything else
        // is a dynamic one.
        const argument = scanner.scan();
        if (argument === ts.SyntaxKind.TemplateHead) {
          // A template with a substitution is never a static specifier, and the
          // scanner has to be walked out of it before the loop can continue.
          count += 1;
          skipTemplate(scanner);
        } else if (argument !== ts.SyntaxKind.StringLiteral && argument !== ts.SyntaxKind.NoSubstitutionTemplateLiteral) {
          count += 1;
        }
        twoBack = token;
        previous = argument;
        token = scanner.scan();
        continue;
      }
    }
    twoBack = previous;
    previous = token;
    token = scanner.scan();
  }
  return count;
}

/**
 * Read one file's import references.
 *
 * The two flags are both load-bearing: the first reads `import`/`export from`
 * specifiers, the second also reads CommonJS `require` calls, which is how most
 * of a mixed tree is wired.
 * @param text - the file's source.
 * @returns the literal specifiers and the dynamic-call count.
 */
export function extractImports(text: string): ExtractedImports {
  const pre = ts.preProcessFile(text, true, true);
  return {
    specifiers: pre.importedFiles.map(reference => reference.fileName),
    dynamic: countDynamicCalls(text),
  };
}

/** One `compilerOptions.paths` rule, with its `*` still in place. */
export interface PathAlias {
  readonly pattern: string;
  readonly targets: readonly string[];
}

/** The alias configuration a workspace declares, if it declares one. */
export interface CompilerPaths {
  /** Directory the targets are relative to; repository-relative, `""` for root. */
  readonly baseUrl: string;
  readonly aliases: readonly PathAlias[];
}

/** What a `tsconfig.json` says that this module cares about. */
export interface TsconfigShape {
  readonly paths: CompilerPaths | null;
  /** The raw `extends` value, when it is a relative path this package can follow. */
  readonly extendsPath: string | null;
}

/** The slice of a parsed tsconfig this module reads. */
interface RawTsconfig {
  readonly compilerOptions?: {
    readonly baseUrl?: unknown;
    readonly paths?: unknown;
  };
  readonly extends?: unknown;
}

/**
 * Parse a tsconfig's alias configuration.
 *
 * Read through the compiler's own JSONC parser rather than `JSON.parse`:
 * real tsconfigs carry comments and trailing commas, and a strict parse would
 * silently disable aliases in exactly the repositories that use them most.
 *
 * `baseUrl` is returned as written. Resolving it against the tsconfig's own
 * directory is the caller's job, because only the caller knows where the
 * repository root is.
 * @param configText - the file's text.
 * @param fileName - its path, for the parser's error messages.
 * @returns the alias rules and the raw `extends`, when either is present.
 */
export function parseTsconfig(configText: string, fileName: string): TsconfigShape {
  const parsed = ts.parseConfigFileTextToJson(fileName, configText);
  const config = parsed.config as RawTsconfig | undefined;
  const options = config?.compilerOptions;
  const rawPaths = options?.paths;
  const aliases: PathAlias[] = [];
  if (rawPaths !== null && typeof rawPaths === "object") {
    for (const [pattern, value] of Object.entries(rawPaths as Record<string, unknown>)) {
      if (!Array.isArray(value)) continue;
      const targets = value.filter((entry): entry is string => typeof entry === "string");
      if (targets.length > 0) aliases.push({ pattern, targets });
    }
  }
  const baseUrl = typeof options?.baseUrl === "string" ? options.baseUrl : "";
  const rawExtends = config?.extends;
  return {
    paths: aliases.length === 0 ? null : { baseUrl, aliases },
    extendsPath: typeof rawExtends === "string" ? rawExtends : null,
  };
}

/**
 * Try the paths a bundler would try for one base path.
 * @param base - the candidate path, already joined and normalized.
 * @param files - every path that exists on this side.
 * @returns the resolved path, or null.
 */
function probe(base: string, files: ReadonlySet<string>): string | null {
  if (base === "" || base.startsWith("..")) return null;
  if (files.has(base)) return base;
  for (const extension of SCRIPT_EXTENSIONS) {
    const candidate = `${base}${extension}`;
    if (files.has(candidate)) return candidate;
  }
  // TypeScript source often names its target with the emitted extension
  // (`./x.js` for `x.ts`), because that is what the runtime will import.
  for (const [from, to] of [
    [".js", ".ts"],
    [".js", ".tsx"],
    [".jsx", ".tsx"],
    [".mjs", ".mts"],
    [".cjs", ".cts"],
  ] as const) {
    if (base.endsWith(from)) {
      const swapped = `${base.slice(0, -from.length)}${to}`;
      if (files.has(swapped)) return swapped;
    }
  }
  for (const extension of SCRIPT_EXTENSIONS) {
    const candidate = `${base}/index${extension}`;
    if (files.has(candidate)) return candidate;
  }
  return null;
}

/**
 * Expand one alias pattern against a specifier.
 *
 * A pattern's `*` captures the rest of the specifier and is substituted into
 * each target's own `*`; a pattern with no `*` must match exactly.
 * @param alias - the rule.
 * @param specifier - what the source wrote.
 * @returns the captured wildcard, or null when the rule does not apply.
 */
function matchAlias(alias: PathAlias, specifier: string): string | null {
  const star = alias.pattern.indexOf("*");
  if (star < 0) return alias.pattern === specifier ? "" : null;
  const head = alias.pattern.slice(0, star);
  const tail = alias.pattern.slice(star + 1);
  if (specifier.length < head.length + tail.length) return null;
  if (!specifier.startsWith(head) || !specifier.endsWith(tail)) return null;
  return specifier.slice(head.length, specifier.length - tail.length);
}

/** Turns one file's specifier into a path on the same side, or null. */
export type ImportResolver = (from: string, specifier: string) => string | null;

/**
 * Build a resolver over one side's file set.
 *
 * The file set is the whole side, not just the changed files: an edge from an
 * unchanged file into a changed one is exactly the "imported by" direction the
 * map exists to show, and resolving against only the change set would lose it.
 * @param files - every path present on this side.
 * @param paths - the workspace's alias configuration, when it has one.
 * @returns a resolver that never invents a target.
 */
export function createResolver(files: ReadonlySet<string>, paths: CompilerPaths | null): ImportResolver {
  return (from, specifier) => {
    if (specifier === "" || specifier.includes("\0")) return null;
    if (specifier.startsWith(".")) {
      const joined = posix.normalize(posix.join(posix.dirname(from), specifier));
      return probe(joined, files);
    }
    if (paths === null) return null;
    for (const alias of paths.aliases) {
      const captured = matchAlias(alias, specifier);
      if (captured === null) continue;
      for (const target of alias.targets) {
        const substituted = target.includes("*") ? target.replace("*", captured) : target;
        const joined = posix.normalize(posix.join(paths.baseUrl, substituted));
        const resolved = probe(joined, files);
        if (resolved !== null) return resolved;
      }
    }
    // A bare specifier that matched no alias is an external package. It is not
    // probed as a relative path on purpose: `react` must never become `react.ts`.
    return null;
  };
}

/** One side's edge set, keyed by the importing file. */
export type EdgeSet = ReadonlyMap<string, ReadonlySet<string>>;

/** The three-state edge list plus the two counts the cards show. */
export interface EdgeDiff {
  readonly edges: readonly ImportEdge[];
  readonly newImports: number;
  readonly droppedImports: number;
}

/**
 * Compare two sides' edge sets into added / removed / kept.
 *
 * The two counts are scoped to the change set, and an edge counts when *either*
 * end of it is a changed path. Both directions matter: an import the change
 * introduced is a new dependency, and an unchanged file that pointed at a file
 * the change deleted has lost one. Counting only the importing side would miss
 * the second, which is the case the requirement names explicitly.
 *
 * The full edge list still carries every state, so the map can draw the whole
 * graph; only the headline numbers are narrowed.
 * @param newEdges - the new side's edges.
 * @param oldEdges - the old side's edges.
 * @param changedPaths - every path the change set touches, both sides.
 * @returns the sorted edge list and the two counts.
 */
export function diffEdges(
  newEdges: EdgeSet,
  oldEdges: EdgeSet,
  changedPaths: ReadonlySet<string>,
): EdgeDiff {
  const edges: ImportEdge[] = [];
  let newImports = 0;
  let droppedImports = 0;
  const touched = (from: string, to: string): boolean => changedPaths.has(from) || changedPaths.has(to);

  for (const [from, targets] of newEdges) {
    const before = oldEdges.get(from);
    for (const to of targets) {
      if (before?.has(to) === true) {
        edges.push({ from, to, state: "kept" });
        continue;
      }
      edges.push({ from, to, state: "added" });
      if (touched(from, to)) newImports += 1;
    }
  }
  for (const [from, targets] of oldEdges) {
    const after = newEdges.get(from);
    for (const to of targets) {
      if (after?.has(to) === true) continue;
      edges.push({ from, to, state: "removed" });
      if (touched(from, to)) droppedImports += 1;
    }
  }

  edges.sort((left, right) => {
    if (left.from !== right.from) return left.from < right.from ? -1 : 1;
    if (left.to !== right.to) return left.to < right.to ? -1 : 1;
    return 0;
  });
  return { edges, newImports, droppedImports };
}
