/**
 * The clipboard contract for a draft that carries attachments.
 *
 * Copying a selection out of the composer has two audiences, and they want
 * different things. Another application (a terminal, an editor, a chat) can only
 * use text, so the paths of the attached files are the only useful thing it can
 * receive: base64 of the bytes is noise to a human and to a shell. This same
 * composer, pasting back, wants the *structure* — which paths were attachments,
 * what their media types were, and where the text ended — so it can rebuild the
 * draft without guessing.
 *
 * One clipboard, two flavours:
 *
 *   - `text/plain` is the text followed by the paths, one per line, so a paste
 *     anywhere else yields something a person can act on;
 *   - {@link COMPOSER_CLIPBOARD_MIME} is the exact payload this composer reads
 *     back. It is authoritative when present, which is what keeps the plain text
 *     from having to be parsed unambiguously — the ambiguity is real (a draft may
 *     legitimately end with a path), and resolving it by heuristic would make
 *     same-application copy lossy.
 *
 * Nothing here touches the DOM or React, so the format can be tested on its own.
 */

/** The custom clipboard type this composer writes and reads back. */
export const COMPOSER_CLIPBOARD_MIME = "application/x-dsh-composer+json";

/** Version of the structured payload; a reader rejects anything else. */
const PAYLOAD_VERSION = 1;

/** One attachment as the clipboard carries it. */
export interface ClipboardAttachment {
  /** Absolute path of the file on this machine. */
  readonly path: string;
  /** Display name, which is the file's own name for an attachment. */
  readonly name: string;
  /** Media type reported by the browser, empty when it had none. */
  readonly type: string;
  /** Which attachment kind the composer should rebuild. */
  readonly kind: "image" | "file";
}

/** The structured payload written to {@link COMPOSER_CLIPBOARD_MIME}. */
export interface ComposerClipboardPayload {
  readonly text: string;
  readonly attachments: readonly ClipboardAttachment[];
}

/** A path list read out of plain text, with the text that preceded it. */
export interface ParsedPathList {
  readonly text: string;
  readonly paths: readonly string[];
}

/** Media types the composer treats as image attachments, by extension. */
const IMAGE_TYPES: Readonly<Record<string, string>> = Object.freeze({
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
  gif: "image/gif",
  bmp: "image/bmp",
  svg: "image/svg+xml",
  avif: "image/avif",
  heic: "image/heic",
  heif: "image/heif",
  tif: "image/tiff",
  tiff: "image/tiff",
});

/**
 * Serialize the structured flavour.
 * @param payload - text and attachments as copied.
 * @returns the JSON body written to the clipboard.
 */
export function encodePayload(payload: ComposerClipboardPayload): string {
  return JSON.stringify({
    v: PAYLOAD_VERSION,
    text: payload.text,
    attachments: payload.attachments.map(entry => ({
      path: entry.path,
      name: entry.name,
      type: entry.type,
      kind: entry.kind,
    })),
  });
}

/**
 * Read the structured flavour, rejecting anything this version does not own.
 *
 * Every field is re-validated rather than trusted: the clipboard is shared with
 * every other application on the machine, so a body with this MIME is not
 * evidence that this composer wrote it.
 * @param raw - clipboard body, or the empty string when the type is absent.
 * @returns the payload, or undefined when the body is not one of ours.
 */
export function decodePayload(raw: string | null | undefined): ComposerClipboardPayload | undefined {
  if (typeof raw !== "string" || raw === "") return undefined;
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return undefined;
  }
  if (parsed === null || typeof parsed !== "object") return undefined;
  const record = parsed as Record<string, unknown>;
  if (record.v !== PAYLOAD_VERSION) return undefined;
  const text = typeof record.text === "string" ? record.text : "";
  const entries = Array.isArray(record.attachments) ? record.attachments : [];
  const attachments: ClipboardAttachment[] = [];
  for (const entry of entries) {
    if (entry === null || typeof entry !== "object") continue;
    const candidate = entry as Record<string, unknown>;
    const path = candidate.path;
    if (typeof path !== "string" || path === "") continue;
    attachments.push({
      path,
      name: typeof candidate.name === "string" && candidate.name !== "" ? candidate.name : baseName(path),
      type: typeof candidate.type === "string" ? candidate.type : "",
      kind: candidate.kind === "image" ? "image" : "file",
    });
  }
  return { text, attachments };
}

/**
 * Compose the plain-text flavour: the text, then one path per line.
 *
 * A blank line separates the two blocks, and it is omitted when the text is
 * empty so a pure-attachment copy is a bare path list — the shape
 * {@link parsePathList} reads back.
 * @param text - the selected text, as the editor serialized it.
 * @param paths - absolute paths of the copied attachments, in draft order.
 * @returns the clipboard text.
 */
export function composePlainText(text: string, paths: readonly string[]): string {
  if (paths.length === 0) return text;
  const block = paths.join("\n");
  if (text === "") return block;
  // A text that already ends in a newline would otherwise leave two blank lines.
  return `${text.replace(/\n+$/u, "")}\n\n${block}`;
}

/**
 * Read a plain-text clipboard body as a path list.
 *
 * This is the cross-application entry: a path copied out of this composer, or a
 * path list typed into an editor, pasted back here. The rule is deliberately
 * narrow — every non-empty line must look like one absolute path and nothing
 * else — because the alternative is silently swallowing ordinary text that
 * happens to mention a file. The caller still verifies each path exists before
 * consuming the paste; this only decides whether the paste is a candidate.
 * @param raw - plain-text clipboard body.
 * @returns the text before the path block and the candidate paths, or undefined.
 */
export function parsePathList(raw: string): ParsedPathList | undefined {
  if (raw === "") return undefined;
  const lines = raw.split("\n");
  const paths: string[] = [];
  let cut = lines.length;
  for (let index = lines.length - 1; index >= 0; index -= 1) {
    const line = lines[index] ?? "";
    if (line.trim() === "") {
      // Trailing blank lines are part of the block; a blank line further up ends it.
      if (paths.length > 0) {
        cut = index;
        continue;
      }
      continue;
    }
    const path = pathOfLine(line);
    if (path === undefined) break;
    paths.unshift(path);
    cut = index;
  }
  if (paths.length === 0) return undefined;
  const text = lines.slice(0, cut).join("\n").replace(/\n+$/u, "");
  return { text, paths };
}

/**
 * Strip the wrapping a path may arrive with and require it to be absolute.
 * @param line - one clipboard line.
 * @returns the absolute path, or undefined when the line is not one.
 */
function pathOfLine(line: string): string | undefined {
  let candidate = line.trim();
  // `@path` and `@"path"` are this composer's own mention spellings, so a copied
  // reference pastes back as the file it names rather than as text.
  if (candidate.startsWith("@")) candidate = candidate.slice(1);
  if (candidate.startsWith("\"") && candidate.endsWith("\"") && candidate.length > 1) {
    candidate = candidate.slice(1, -1);
  }
  if (candidate === "") return undefined;
  if (!isAbsolutePath(candidate)) return undefined;
  // A control character cannot survive as a filename, so the line is not a path.
  if (/[\u0000-\u001f\u007f]/u.test(candidate)) return undefined;
  return candidate;
}

/**
 * Whether a string is an absolute path on either platform style.
 * @param value - candidate path.
 * @returns whether it is rooted.
 */
export function isAbsolutePath(value: string): boolean {
  return value.startsWith("/") || /^[A-Za-z]:[/\\]/u.test(value) || value.startsWith("\\\\");
}

/**
 * The media type implied by a path's extension.
 * @param path - absolute path.
 * @returns the image media type, or undefined for a non-image path.
 */
export function imageTypeOfPath(path: string): string | undefined {
  const match = /\.([A-Za-z0-9]+)$/u.exec(path);
  if (match === null) return undefined;
  return IMAGE_TYPES[match[1]?.toLowerCase() ?? ""];
}

/**
 * The last path segment.
 * @param path - absolute or relative path.
 * @returns the file name.
 */
export function baseName(path: string): string {
  const parts = path.split(/[\\/]/u).filter(part => part !== "");
  return parts.at(-1) ?? path;
}

/**
 * Drop attachments the draft already has, and repeats inside one paste.
 *
 * Deduplication is by absolute path: that is the only identity a copied
 * attachment and a draft attachment are guaranteed to share, since the browser
 * `File` of the pasted copy is a new object. An attachment with no local path
 * (a clipboard image) has no identity to compare, so it never suppresses an
 * incoming one.
 * @param incoming - attachments the paste wants to add.
 * @param existingPaths - absolute paths already attached to the draft.
 * @returns the entries to add and the paths that were duplicates.
 */
export function dedupeAttachments(
  incoming: readonly ClipboardAttachment[],
  existingPaths: Iterable<string>,
): { readonly accepted: readonly ClipboardAttachment[]; readonly duplicates: readonly string[] } {
  const seen = new Set(existingPaths);
  const accepted: ClipboardAttachment[] = [];
  const duplicates: string[] = [];
  for (const entry of incoming) {
    if (seen.has(entry.path)) {
      duplicates.push(entry.path);
      continue;
    }
    seen.add(entry.path);
    accepted.push(entry);
  }
  return { accepted, duplicates };
}
