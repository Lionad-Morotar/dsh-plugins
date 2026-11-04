/**
 * Workspace references written in the chat prose.
 *
 * Three shapes can name a target the workbench knows how to open: an anchor the
 * host's markdown renderer produced, an inline code span, and a bare path left
 * as text. The host has no slot a plugin can occupy between its own link pass
 * and its file-mention pass, so none of them arrives as a jump on its own.
 *
 * The recognition here is pure and DOM-free: a caller peels one element down to
 * a probe and gets back a target and the shape it came from. Applying that to a
 * live document, and turning a target into an address, are later layers on this
 * same file; nothing here reads the filesystem or the session.
 */

/** The three shapes a reference can arrive in, kept apart because they differ in trust. */
export type ReferenceKind = "link" | "code" | "text";

/** One recognised reference: where it points, and which shape named it. */
export interface ReferenceMatch {
  /** The normalised target, comparable across the three shapes. */
  readonly target: string;
  readonly kind: ReferenceKind;
}

/** What the recogniser needs to know about one element, with the DOM peeled off. */
export interface ReferenceProbe {
  /** The element's own tag, upper case. */
  readonly tag: string;
  /** Its `textContent`, with a null already read as the empty string. */
  readonly text: string;
  /** Only for an anchor: the href exactly as the host wrote it, which may be relative. */
  readonly href?: string;
  /** Whether a `pre` sits between the element and the document. */
  readonly insidePre: boolean;
  /** Whether the message that owns it is still being written. */
  readonly streaming: boolean;
}

/**
 * Schemes that name something outside the workspace, so a click could not land
 * in the workbench. Compared lower case: the host does not normalise the case of
 * a scheme it did not write itself.
 */
const FOREIGN_SCHEMES = ["http:", "https:", "mailto:", "tel:", "data:", "javascript:"] as const;

/** The one scheme that does name a workspace resource, and is kept verbatim. */
const RESOURCE_SCHEME = "dsh-resource://";

/**
 * What one path segment may hold: letters, digits, and the punctuation a real
 * file name uses, plus CJK. Anything else (a query string, a space, a colon) is
 * a sign the text is prose or a URL rather than a path.
 */
const SEGMENT = /^[A-Za-z0-9\-_.@+\u4E00-\u9FFF]+$/u;

/**
 * Reduce a candidate to the form two references can be compared in.
 *
 * A trailing slash and a leading `./` are the same directory, and a Windows
 * separator is the same path, so all three are folded away. What is left must
 * still name something: a bare `/` normalises to nothing and is not a target.
 *
 * @param raw - the candidate exactly as rendered.
 * @returns the comparable target, or undefined when nothing is left.
 */
export function normalizeReferenceTarget(raw: string): string | undefined {
  let target = raw.trim().replace(/\\/g, "/");
  while (target.startsWith("./")) target = target.slice(2);
  // Every trailing slash, because `a//` and `a/` name the same directory.
  target = target.replace(/\/+$/, "");
  return target === "" ? undefined : target;
}

/**
 * Whether a normalised string reads as a path rather than as prose or a URL.
 *
 * Every segment must be non-empty and made of path characters, and the first
 * must not be a dot segment or a scheme remnant. The empty-segment rule is what
 * refuses `//host/path`, whose first two segments are both empty.
 */
function looksLikePath(target: string): boolean {
  const segments = target.split("/");
  if (segments.length < 2) return false;
  const [head] = segments;
  if (head === undefined || head === "." || head === "..") return false;
  if (FOREIGN_SCHEMES.some(scheme => head.toLowerCase().startsWith(scheme))) return false;
  return segments.every(segment => segment !== "" && SEGMENT.test(segment));
}

/** Whether an anchor leaves the workspace, by scheme, by anchor, or by protocol-relative host. */
function isForeignHref(href: string): boolean {
  if (href.startsWith("#") || href.startsWith("//")) return true;
  const lower = href.toLowerCase();
  return FOREIGN_SCHEMES.some(scheme => lower.startsWith(scheme));
}

/**
 * Read one element as a workspace reference, or refuse it.
 *
 * Refusing is the default, because a wrong underline is a promise the click
 * cannot keep: a message still being written has half a path in it, and a fenced
 * block is a sample of a path rather than a path. Beyond that the three shapes
 * are held to different bars. An anchor was made by the renderer from a link the
 * author wrote, so any href that stays inside the workspace is taken as it is. A
 * code span and a bare fragment have no such provenance and must look like a
 * path; a bare one must additionally be a single unbroken fragment, since a
 * sentence can contain a path without being one.
 *
 * The bare-fragment bar is only as tight as a probe allows: a probe carries the
 * whole text and no neighbours, so "no whitespace and looks like a path" is all
 * that can be decided here. Whether the fragment is a whole word, rather than
 * the middle of a longer one, needs the surrounding text and is decided by the
 * DOM layer that owns the element.
 *
 * @param probe - the element, reduced to plain data.
 * @returns the target and its shape, or undefined when it may not be a reference.
 */
export function classifyReference(probe: ReferenceProbe): ReferenceMatch | undefined {
  if (probe.streaming || probe.insidePre) return undefined;

  if (probe.tag === "A") {
    const href = probe.href?.trim() ?? "";
    if (href === "") return undefined;
    if (href.startsWith(RESOURCE_SCHEME)) return { target: href, kind: "link" };
    if (isForeignHref(href)) return undefined;
    const target = normalizeReferenceTarget(href);
    return target === undefined ? undefined : { target, kind: "link" };
  }

  const target = normalizeReferenceTarget(probe.text);
  if (target === undefined || !looksLikePath(target)) return undefined;

  if (probe.tag === "CODE") return { target, kind: "code" };

  // A bare path shares the paragraph with the sentence around it, so a space
  // means the text is that sentence and not the path.
  if (/\s/u.test(target)) return undefined;
  return { target, kind: "text" };
}
