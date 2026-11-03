/**
 * The skill profile: what a skill's `argument-hint` means, flattened.
 *
 * A skill's frontmatter carries a hand-written `argument-hint` string, and the
 * composer wants to offer each parameter as something the user can insert. The
 * hints in the wild are prose rather than a grammar, so this module reads them
 * the way a person would and gives up gracefully when it cannot:
 *
 *   - `|` means two different things depending on spacing. `normal|max` is one
 *     value shape; `--off | --think` is two alternatives. Whitespace is the only
 *     signal that separates them, so a standalone `|` token splits and a glued
 *     one stays inside the value.
 *   - A bracket group holding flags is structure to recurse into, because
 *     `[--create [--scope <a|b>]]` is two parameters and not one. A bracket group
 *     holding only values is the enclosing flag's detail, because
 *     `[--init [all|hooks|push]]` is one parameter with an enumerated value. The
 *     difference is whether the group contains a flag, not where it sits.
 *   - Nothing here may throw. The host serves this over HTTP, and a hint the
 *     parser cannot structure must still render as one opaque entry rather than
 *     blank the panel or fail the request.
 *
 * @module dsh-better/skill-profile
 */

/** One insertable parameter: the text to put in the composer, and its value shape. */
export interface SkillParam {
  /** Text inserted into the input, e.g. `--scope`. Never wrapped in brackets. */
  readonly flag: string;
  /** The value shape that follows, e.g. `<package|project|global>`; empty for a bare switch. */
  readonly detail: string;
}

/** What the browser reads for one skill. */
export interface SkillProfileWire {
  readonly name: string;
  /** Absolute path of the skill's SKILL.md, when the provider exposes one. */
  readonly path?: string;
  /** The raw hint, so the client can fall back to showing it verbatim. */
  readonly argumentHint?: string;
  /** Frontmatter `metadata:` block, flattened to one line per key. */
  readonly metadata: Readonly<Record<string, string>>;
  readonly params: readonly SkillParam[];
}

/** A token of the hint: a word, or one bracket boundary. */
type Token = { readonly kind: "word"; readonly text: string } | { readonly kind: "open" } | { readonly kind: "close" };

/** A parsed hint node: a word, or a bracket group of nodes. */
type Node = { readonly kind: "word"; readonly text: string } | { readonly kind: "group"; readonly items: readonly Node[] };

/** One parameter before de-duplication. */
interface Emitted {
  readonly flag: string;
  readonly detail: string;
}

/** Strip one layer of matching surrounding quotes, as YAML would. */
function stripQuotes(text: string): string {
  const trimmed = text.trim();
  if (trimmed.length < 2) return trimmed;
  const first = trimmed.charAt(0);
  const last = trimmed.charAt(trimmed.length - 1);
  if ((first === '"' || first === "'") && first === last) return trimmed.slice(1, -1).trim();
  return trimmed;
}

/**
 * Split a hint into words and bracket boundaries.
 *
 * Parentheses are scanned as one opaque word: a value shape like
 * `(mobile, tablet, print...)` contains spaces, and splitting it would leave the
 * detail as a fragment.
 */
function tokenize(text: string): Token[] {
  const tokens: Token[] = [];
  let index = 0;
  while (index < text.length) {
    const char = text.charAt(index);
    if (char === " " || char === "\t" || char === "\n" || char === "\r") {
      index += 1;
      continue;
    }
    if (char === "[") {
      tokens.push({ kind: "open" });
      index += 1;
      continue;
    }
    if (char === "]") {
      tokens.push({ kind: "close" });
      index += 1;
      continue;
    }
    if (char === "(") {
      let depth = 0;
      let cursor = index;
      while (cursor < text.length) {
        const inner = text.charAt(cursor);
        if (inner === "(") depth += 1;
        else if (inner === ")") {
          depth -= 1;
          if (depth === 0) {
            cursor += 1;
            break;
          }
        }
        cursor += 1;
      }
      tokens.push({ kind: "word", text: text.slice(index, cursor) });
      index = cursor;
      continue;
    }
    let cursor = index;
    while (cursor < text.length) {
      const inner = text.charAt(cursor);
      if (inner === " " || inner === "\t" || inner === "\n" || inner === "\r" || inner === "[" || inner === "]") break;
      cursor += 1;
    }
    // A lone `[` or `]` is consumed above, so the cursor always advanced here.
    tokens.push({ kind: "word", text: text.slice(index, cursor) });
    index = cursor;
  }
  return tokens;
}

/** Nest the token stream into groups; an unbalanced `]` at the root is dropped. */
function buildTree(tokens: readonly Token[]): Node[] {
  const root: Node[] = [];
  const stack: Node[][] = [root];
  for (const token of tokens) {
    const current = stack[stack.length - 1];
    if (current === undefined) break;
    if (token.kind === "word") {
      current.push({ kind: "word", text: token.text });
      continue;
    }
    if (token.kind === "open") {
      const group: Node = { kind: "group", items: [] };
      current.push(group);
      if (group.kind === "group") stack.push(group.items as Node[]);
      continue;
    }
    if (stack.length > 1) stack.pop();
  }
  return root;
}

/** Whether a word is a switch rather than a value. */
function isFlagWord(text: string): boolean {
  return text.startsWith("-") && text.length > 1;
}

/** Whether a word is a `<placeholder>`. */
function isPlaceholder(text: string): boolean {
  return text.startsWith("<") && text.endsWith(">") && text.length > 2;
}

/** Whether a group holds any switch, which makes it structure rather than a value. */
function hasFlag(items: readonly Node[]): boolean {
  return items.some(item => (item.kind === "word" ? isFlagWord(item.text) : hasFlag(item.items)));
}

/** Render a value group back to the text a user would insert. */
function groupText(items: readonly Node[]): string {
  return items.map(item => (item.kind === "word" ? item.text : `[${groupText(item.items)}]`)).join(" ");
}

/**
 * Split one level on standalone `|` alternatives.
 *
 * `·` is a separator too. It is not in any spec, but it is in a real skill on
 * this machine (`[shape · audit|critique · animate|…]`), and reading it as a
 * value turned every following command name into that command's detail.
 */
function splitAlternatives(items: readonly Node[]): Node[][] {
  const segments: Node[][] = [];
  let current: Node[] = [];
  for (const item of items) {
    if (item.kind === "word" && (item.text === "|" || item.text === "·")) {
      if (current.length > 0) segments.push(current);
      current = [];
      continue;
    }
    current.push(item);
  }
  if (current.length > 0) segments.push(current);
  return segments;
}

/**
 * Emit one parameter, splitting a glued alternative list at parameter position.
 *
 * A glued `|` means two things by position: consumed as a detail it is one value
 * shape (`--effort normal|max`), and standing at parameter position it is a list
 * of command names (`audit|critique`). Only the second is split, because
 * `audit|critique` is not text anyone can insert into the composer. Placeholders
 * are never split: `<package|project|global>` is one value shape.
 */
function pushParam(out: Emitted[], text: string, detail: string): void {
  if (isPlaceholder(text) || !text.includes("|")) {
    out.push({ flag: text, detail });
    return;
  }
  for (const part of text.split("|")) {
    const piece = part.trim();
    if (piece !== "") out.push({ flag: piece, detail });
  }
}

/**
 * Walk one level, emitting parameters in source order.
 *
 * A group in parameter position is a parameter list of its own, which is what
 * makes `[target]` yield `target` while `[all|hooks|push]` stays a value: the
 * latter is only ever reached as the detail of the flag before it.
 */
function walk(items: readonly Node[], out: Emitted[]): void {
  for (const segment of splitAlternatives(items)) {
    let index = 0;
    while (index < segment.length) {
      const node = segment[index];
      if (node === undefined) break;
      if (node.kind === "group") {
        walk(node.items, out);
        index += 1;
        continue;
      }
      const next = segment[index + 1];
      const text = node.text;
      const takesValueGroup = next !== undefined && next.kind === "group" && !hasFlag(next.items);
      const takesValueWord = next !== undefined && next.kind === "word" && !isFlagWord(next.text);

      if (isFlagWord(text)) {
        if (next !== undefined && next.kind === "group" && hasFlag(next.items)) {
          // Structure: the flag itself carries no value, its children do.
          pushParam(out, text, "");
          walk(next.items, out);
          index += 2;
          continue;
        }
        if (takesValueGroup && next !== undefined && next.kind === "group") {
          pushParam(out, text, groupText(next.items));
          index += 2;
          continue;
        }
        if (takesValueWord && next !== undefined && next.kind === "word") {
          pushParam(out, text, next.text);
          index += 2;
          continue;
        }
        pushParam(out, text, "");
        index += 1;
        continue;
      }

      // A placeholder is always its own parameter: `<command> <file>` is two
      // insertable positions, so the first must not swallow the second.
      if (isPlaceholder(text)) {
        out.push({ flag: text, detail: "" });
        index += 1;
        continue;
      }

      if (takesValueGroup && next !== undefined && next.kind === "group") {
        pushParam(out, text, groupText(next.items));
        index += 2;
        continue;
      }
      if (takesValueWord && next !== undefined && next.kind === "word") {
        pushParam(out, text, next.text);
        index += 2;
        continue;
      }
      pushParam(out, text, "");
      index += 1;
    }
  }
}

/**
 * Parse one `argument-hint` into a flat parameter list.
 *
 * @param text - the frontmatter value, quoted or bare, or anything else.
 * @returns the parameters in source order, first occurrence of each flag only.
 *   Empty for non-string and blank input; one opaque entry when the text cannot
 *   be structured at all, so the panel is never blank.
 */
export function parseArgumentHint(text: unknown): SkillParam[] {
  if (typeof text !== "string") return [];
  const source = stripQuotes(text);
  if (source === "") return [];

  const emitted: Emitted[] = [];
  try {
    walk(buildTree(tokenize(source)), emitted);
  } catch {
    // Unreachable by construction, but this runs inside an HTTP handler: a
    // parser bug must degrade to the opaque entry, never to a 500.
    emitted.length = 0;
  }

  if (emitted.length === 0) return [{ flag: source, detail: "" }];

  const seen = new Set<string>();
  const params: SkillParam[] = [];
  for (const entry of emitted) {
    if (seen.has(entry.flag)) continue;
    seen.add(entry.flag);
    params.push({ flag: entry.flag, detail: entry.detail });
  }
  return params;
}

/**
 * Flatten a frontmatter `metadata:` block for the wire.
 *
 * @param value - the parsed block, or anything else.
 * @returns one string per key. Structured values are folded onto a single line
 *   because the panel renders them as a row of text; `null` and `undefined` are
 *   dropped rather than rendered as "null".
 */
export function normalizeMetadata(value: unknown): Record<string, string> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return {};
  const out: Record<string, string> = {};
  for (const [key, entry] of Object.entries(value as Record<string, unknown>)) {
    if (entry === undefined || entry === null) continue;
    if (typeof entry === "string") out[key] = entry;
    else if (typeof entry === "number" || typeof entry === "boolean" || typeof entry === "bigint") {
      out[key] = String(entry);
    } else if (typeof entry === "object") out[key] = JSON.stringify(entry);
    else out[key] = String(entry);
  }
  return out;
}

/**
 * Read the top-level `argument-hint` out of a SKILL.md.
 *
 * The host's own frontmatter parser keeps `name`, `description`, `whenToUse` and
 * the `metadata:` block and drops every other key, so `argument-hint` is not
 * reachable through any skill API and the file has to be read again here. Only
 * the first frontmatter block counts: a `argument-hint:` line in the body is
 * documentation, not configuration.
 *
 * @param source - the whole SKILL.md.
 * @returns the hint with its quotes stripped, or undefined when absent.
 */
export function readFrontmatterArgumentHint(source: string): string | undefined {
  if (typeof source !== "string") return undefined;
  const text = source.replace(/^\uFEFF/u, "");
  const block = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/u.exec(text);
  if (block === null) return undefined;
  const frontmatter = block[1] ?? "";
  for (const line of frontmatter.split(/\r?\n/u)) {
    const field = /^argument-hint:[ \t]*(.*)$/u.exec(line);
    if (field === null) continue;
    const raw = stripQuotes(field[1] ?? "");
    return raw === "" ? undefined : raw;
  }
  return undefined;
}

/**
 * Compose the wire shape for one skill.
 *
 * @param input - the skill's identity plus whatever the host could resolve.
 * @returns the profile; `metadata` defaults to empty and `params` to the parse
 *   of the hint, so a skill with no hint still yields a usable object.
 */
export function skillProfileOf(input: {
  name: string;
  path?: string;
  argumentHint?: string;
  metadata?: unknown;
}): SkillProfileWire {
  const profile: {
    name: string;
    path?: string;
    argumentHint?: string;
    metadata: Record<string, string>;
    params: SkillParam[];
  } = {
    name: input.name,
    metadata: normalizeMetadata(input.metadata),
    params: parseArgumentHint(input.argumentHint),
  };
  if (input.path !== undefined) profile.path = input.path;
  if (input.argumentHint !== undefined) profile.argumentHint = input.argumentHint;
  return profile;
}
