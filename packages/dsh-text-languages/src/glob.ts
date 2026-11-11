/**
 * Glob matching for the filename-pattern tier.
 *
 * The catalogue needs three wildcard forms and nothing else, so this is a small
 * hand-rolled compiler rather than a dependency: `*` stays inside one path
 * segment, `**` crosses segments, `?` is one non-separator character and
 * `[...]` is a character class. Anchoring the whole string is deliberate; a
 * pattern that searched instead of matched would let `*.json` claim
 * `tsconfig.json.bak`.
 */

/** `**\/` matches zero or more leading path segments, which is why it is not
 *  compiled to a bare `.*`: that would swallow the separator the next literal
 *  needs. */
const GLOBSTAR_SEGMENTS = "(?:[^/]+/)*";

function escapeLiteral(ch: string): string {
  return /[.*+?^${}()|[\]\\]/.test(ch) ? "\\" + ch : ch;
}

/** Compiles one character class starting at `start` (the `[`). Returns the
 *  regex source and the index just past the closing bracket. */
function compileClass(pattern: string, start: number): { source: string; next: number } {
  let i = start + 1;
  let source = "[";
  if (pattern[i] === "!" || pattern[i] === "^") {
    source += "^";
    i++;
  }
  // A `]` immediately after the opening bracket is a literal member, not the end.
  if (pattern[i] === "]") {
    source += "\\]";
    i++;
  }
  for (; i < pattern.length; i++) {
    const ch = pattern[i] as string;
    if (ch === "]") return { source: source + "]", next: i + 1 };
    source += ch === "\\" ? "\\\\" : ch;
  }
  // Unterminated class: treat the bracket as a literal so a malformed pattern
  // degrades to "matches nothing useful" instead of throwing at import time.
  return { source: "\\[", next: start + 1 };
}

export function compileGlob(pattern: string): (path: string) => boolean {
  let source = "^";
  let i = 0;
  while (i < pattern.length) {
    const ch = pattern[i] as string;
    if (ch === "*") {
      if (pattern[i + 1] === "*") {
        if (pattern[i + 2] === "/") {
          source += GLOBSTAR_SEGMENTS;
          i += 3;
        } else {
          source += ".*";
          i += 2;
        }
        continue;
      }
      source += "[^/]*";
      i++;
      continue;
    }
    if (ch === "?") {
      source += "[^/]";
      i++;
      continue;
    }
    if (ch === "[") {
      const compiled = compileClass(pattern, i);
      source += compiled.source;
      i = compiled.next;
      continue;
    }
    source += escapeLiteral(ch);
    i++;
  }
  source += "$";
  const regex = new RegExp(source);
  return (path: string) => regex.test(path);
}
