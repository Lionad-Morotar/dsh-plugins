/**
 * Workspace references written in the chat prose.
 *
 * Three shapes can name a target the workbench knows how to open: an anchor the
 * host's markdown renderer produced, an inline code span, and a bare path left
 * as text. The host has no slot a plugin can occupy between its own link pass
 * and its file-mention pass, so none of them arrives as a jump on its own.
 *
 * The recognition here is pure and DOM-free: a caller peels one element down to
 * a probe and gets back a target and the shape it came from. The resolution
 * layer below turns that target into a path that actually exists, and is equally
 * DOM-free: it asks the caller for one existence check per candidate and never
 * touches the host itself. Applying either to a live document is a later layer
 * on this same file.
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

/**
 * The answer to one existence check: the path is a file, a directory, or absent.
 *
 * Named apart from {@link ReferenceProbe}, which is the element the recogniser
 * reads. Both are "a probe" in English and only one of them can hold the name.
 */
export type ReferenceProbeAnswer = "file" | "directory" | "missing";

/**
 * The most candidates one target may expand to.
 *
 * A chain is walked in order on every cache miss, so its length is the cost of
 * one resolution; a pathological target must not turn that into a scan.
 */
const MAX_CANDIDATES = 8;

/** How many targets one resolver remembers before evicting the coldest. */
const DEFAULT_CACHE_LIMIT = 256;

/** The scheme the host uses for a resource it already addressed for us. */
const RESOURCE_PREFIX = "dsh-resource://";

/** A resource address that already names a workspace path. */
const SESSION_PREFIX = "dsh-resource://file/session/";

/** A resource address that names a path outside the workspace. */
const ABSOLUTE_PREFIX = "dsh-resource://file/absolute/";

/** The suffixes a Nuxt Content route leaves off, in the order worth trying. */
const MARKDOWN_SUFFIXES = [".md", ".markdown"] as const;

/** Whether a path already names a markdown file, so appending a suffix would invent one. */
function hasMarkdownSuffix(path: string): boolean {
  const lower = path.toLowerCase();
  return MARKDOWN_SUFFIXES.some(suffix => lower.endsWith(suffix));
}

/**
 * Read the path out of a `dsh-resource://` address.
 *
 * The host hands these out already resolved, so the address is authoritative and
 * needs no guessing: the session form carries a workspace path behind its
 * session id, the absolute form carries a filesystem path. Any other form names
 * something this layer cannot place, and is left to the caller as it stands.
 * @param target - a normalised target starting with the resource scheme.
 * @returns the path, absolute ones keeping their leading `/`, or undefined when
 * the form is unknown.
 */
function unwrapResource(target: string): string | undefined {
  if (target.startsWith(SESSION_PREFIX)) {
    const rest = target.slice(SESSION_PREFIX.length);
    // The session id is one segment; everything after it is the path.
    const separator = rest.indexOf("/");
    if (separator < 0) return undefined;
    const path = rest.slice(separator + 1);
    return path === "" ? undefined : path;
  }
  if (target.startsWith(ABSOLUTE_PREFIX)) {
    const rest = target.slice(ABSOLUTE_PREFIX.length).replace(/^\/+/, "");
    return rest === "" ? undefined : `/${rest}`;
  }
  return undefined;
}

/**
 * The paths worth asking about for one recognised target, best first.
 *
 * A route and a repository path are different spellings of the same file, and a
 * path without a suffix may be a directory or a file whose suffix was left off,
 * so one target fans out into a short ordered chain and the first hit wins. The
 * order is what makes that safe: an exact path is tried before any variant of
 * it, so a real directory is never mistaken for a markdown file beside it.
 *
 * Every candidate is a workspace path except an absolute one, which keeps its
 * leading `/`. That slash is the contract with the caller: a candidate starting
 * with `/` has to be opened as `abs:` rather than resolved against the
 * workspace, because no workspace path can begin with one.
 * @param target - a target as the recogniser produced it.
 * @returns the ordered, de-duplicated chain, empty when the target names nothing.
 */
export function referenceCandidates(target: string): readonly string[] {
  const normalized = normalizeReferenceTarget(target);
  if (normalized === undefined) return [];

  const seeds: string[] = [];
  const isResource = normalized.startsWith(RESOURCE_PREFIX);
  const unwrapped = unwrapResource(normalized);
  if (unwrapped !== undefined) {
    seeds.push(unwrapped);
  } else if (isResource) {
    // A resource address this layer cannot place is not a path, so no suffix
    // may be guessed onto it; the caller gets the address back as it stands.
    return [normalized];
  } else {
    const bare = normalized.replace(/^\/+/, "");
    if (bare === "") return [];
    seeds.push(bare);
    // A leading slash means a site route, whose file lives under the content
    // root. An absolute path never reaches here: it only arrives unwrapped.
    if (normalized.startsWith("/")) seeds.push(`content/${bare}`);
  }

  const chain: string[] = [];
  const push = (candidate: string): void => {
    if (chain.length >= MAX_CANDIDATES || chain.includes(candidate)) return;
    chain.push(candidate);
  };
  for (const seed of seeds) push(seed);
  // Suffixes come after every exact seed, so a directory that exists is found
  // before the file that might sit beside it.
  for (const seed of seeds) {
    if (hasMarkdownSuffix(seed)) continue;
    for (const suffix of MARKDOWN_SUFFIXES) push(`${seed}${suffix}`);
  }
  return chain;
}

/** What the resolver needs from the host: one existence check, and nothing else. */
export interface ReferenceResolverDeps {
  /**
   * Ask whether one path exists.
   *
   * The caller wires this to the host's `workspaceFiles.stat`, so this layer
   * stays unaware of sessions, transports and the filesystem.
   * @param path - a workspace path, or an absolute one with its leading `/`.
   * @returns whether the path is a file, a directory, or absent.
   */
  probe(path: string): Promise<ReferenceProbeAnswer>;
}

/** A target that was found, and what it turned out to be. */
export interface ResolvedReference {
  readonly kind: "file" | "directory";
  /** A workspace path, or an absolute path keeping its leading `/`. */
  readonly path: string;
}

/** Turns recognised targets into existing paths, without asking twice. */
export interface ReferenceResolver {
  /**
   * Resolve one target.
   * @param target - a target as the recogniser produced it.
   * @returns the first candidate that exists, or null when none does.
   */
  resolve(target: string): Promise<ResolvedReference | null>;
  /** Drop every remembered answer, for a session switch or a test. */
  clear(): void;
  /** How many targets are remembered, for a test to observe. */
  size(): number;
}

/**
 * Build a resolver over one existence check.
 *
 * Prose is dense with references and a reader's pointer crosses them one after
 * another, so the same handful of targets is asked about constantly. Three
 * layers keep that from becoming a request per hover: a hit is answered from
 * memory, a miss is remembered too (a path that does not exist stays absent for
 * the life of the session), and concurrent questions about one target share a
 * single walk of the chain. The cache is bounded and evicts the coldest target,
 * because a long conversation can mention more paths than are worth keeping.
 * @param deps - the existence check to walk the chain with.
 * @param limit - how many targets to remember; defaults to 256.
 * @returns the resolver.
 */
export function createReferenceResolver(deps: ReferenceResolverDeps, limit = DEFAULT_CACHE_LIMIT): ReferenceResolver {
  const capacity = Math.max(1, limit);
  // Insertion order is the recency order: a hit is re-inserted so the coldest
  // key is always the first one.
  const cache = new Map<string, ResolvedReference | null>();
  const inFlight = new Map<string, Promise<ResolvedReference | null>>();

  const remember = (key: string, value: ResolvedReference | null): void => {
    cache.delete(key);
    cache.set(key, value);
    while (cache.size > capacity) {
      const coldest = cache.keys().next();
      if (coldest.done === true) break;
      cache.delete(coldest.value);
    }
  };

  const walk = async (key: string): Promise<ResolvedReference | null> => {
    for (const candidate of referenceCandidates(key)) {
      let answer: ReferenceProbeAnswer;
      try {
        answer = await deps.probe(candidate);
      } catch {
        // A refused check is a candidate that cannot be shown, not a failed
        // resolution: the rest of the chain still has a chance.
        continue;
      }
      if (answer === "file" || answer === "directory") return { kind: answer, path: candidate };
    }
    return null;
  };

  return {
    async resolve(target) {
      const key = normalizeReferenceTarget(target);
      // Nothing to look up, and nothing worth remembering either: caching the
      // empty string would let one bad target crowd out a real one.
      if (key === undefined) return null;

      const cached = cache.get(key);
      if (cached !== undefined) {
        remember(key, cached);
        return cached;
      }

      const pending = inFlight.get(key);
      if (pending !== undefined) return pending;

      const started = walk(key).then(result => {
        inFlight.delete(key);
        remember(key, result);
        return result;
      });
      inFlight.set(key, started);
      return started;
    },
    clear() {
      cache.clear();
      inFlight.clear();
    },
    size() {
      return cache.size;
    },
  };
}

/**
 * Marks an element the reader may click; the value is the kind it resolved to.
 *
 * The stylesheet and the click handler both read it, and so does a test: the
 * attribute is the only record that a hover already paid for its answer.
 */
export const REF_LINK_ATTR = "data-dcp-ref";

/**
 * The tags a bare path may be written in.
 *
 * These are the elements the host's markdown renderer wraps a paragraph, a list
 * item, a table cell or an inline run in. Anything else (a `div` holding a whole
 * message, an `h2`) is a container whose text is not one reference.
 */
const TEXT_TAGS: ReadonlySet<string> = new Set(["P", "LI", "TD", "SPAN"]);

/** What one click needs from the runtime, answered fresh on every gesture. */
export interface ReferenceLinkHost {
  /** The session on screen, or null when none is mounted. */
  sessionId(): string | null;
  /**
   * Resolve one target. Null means no such path.
   *
   * The implementation owns the caching policy; this layer asks again on every
   * gesture and lets the resolver decide what that costs.
   */
  resolve(target: string): Promise<ResolvedReference | null>;
  /** Open a file in the workbench panel. The path is workspace-relative or absolute. */
  openFile(path: string, options: { readonly absolute: boolean }): void;
  /** Select a directory in the tree without opening a panel. */
  revealDirectory(path: string, options: { readonly absolute: boolean }): void;
  /** Whether the workbench view is registered right now. */
  fsViewPresent(): boolean;
}

/**
 * The candidate element a gesture landed on, or undefined when it may not be one.
 *
 * The node type is read off the target's own document. A listener installed from
 * outside it (the test runner, the bundled plugin) does not share that document's
 * `Element`, so `instanceof` against the outer one never matches, and
 * `event.view` is null for an event dispatched by hand. This is the same rule
 * `commit-ref.ts` applies; that helper is private to its module and this slice
 * may not edit it, so the four lines are repeated rather than shared.
 */
function candidateOf(event: Event): Element | undefined {
  const target = event.target;
  const owner = target as { readonly ownerDocument?: Document } | null;
  const Element = owner?.ownerDocument?.defaultView?.Element;
  if (Element === undefined || !(target instanceof Element)) return undefined;
  if (target.closest("[data-streaming]") !== null) return undefined;
  if (target.closest("pre") !== null) return undefined;
  return target.closest("a, code, p, li, td, span") ?? undefined;
}

/**
 * Read one element as a reference probe, or refuse it before asking the resolver.
 *
 * The bare-text shape is held to a stricter bar here than the pure recogniser
 * can enforce, because the DOM is now visible: the element must be one of the
 * inline tags, must hold nothing but text, and that text must be the whole
 * element. A sentence that mentions a path is therefore left alone. Recognising
 * a path inside running prose needs text-node precision and its own positioning,
 * which is a different piece of work; dotting the sentence instead would promise
 * a click the reader did not aim at.
 * @param element - the candidate the gesture landed on.
 * @returns the probe to classify, or undefined when the element is not eligible.
 */
function probeOf(element: Element): ReferenceProbe | undefined {
  const tag = element.tagName.toUpperCase();
  const streaming = element.closest("[data-streaming]") !== null;
  const insidePre = element.closest("pre") !== null;

  if (tag === "A") {
    const href = element.getAttribute("href") ?? undefined;
    return { tag, text: element.textContent ?? "", ...(href === undefined ? {} : { href }), insidePre, streaming };
  }
  if (tag === "CODE") {
    return { tag, text: element.textContent ?? "", insidePre, streaming };
  }
  if (!TEXT_TAGS.has(tag)) return undefined;
  // A code span or an anchor inside the container owns its own text, so the
  // container is mixed content and its whole text is not one reference.
  if (element.closest("code") !== null || element.closest("a") !== null) return undefined;
  if (element.children.length > 0) return undefined;
  const text = element.textContent ?? "";
  if (/\s/u.test(text)) return undefined;
  return { tag, text, insidePre, streaming };
}

/** The attribute value for one resolved kind. */
function markOf(kind: ResolvedReference["kind"]): string {
  return kind === "directory" ? "dir" : "file";
}

/**
 * Watch the document for workspace references and make the ones that exist clickable.
 *
 * Both listeners capture, so the decision lands before any handler lower in the
 * tree restyles the element or claims the click for text selection. Nothing is
 * decorated until the resolver has confirmed the path exists: an underline over
 * a path the workbench cannot open is a promise the click cannot keep.
 * @param doc - the document the chat renders into.
 * @param host - the runtime's answers, read fresh on every gesture.
 * @returns a disposer that drops both listeners and retires every answer in flight.
 */
export function installReferenceLinks(doc: Document, host: ReferenceLinkHost): () => void {
  const view = doc.defaultView;
  if (view === null) return () => undefined;

  // A hover whose answer arrives after the pointer moved on, or after the
  // element was rewritten, must not decorate: the ticket is what makes the
  // newest gesture the only one allowed to write.
  let ticket = 0;

  const onOver = (event: Event): void => {
    const element = candidateOf(event);
    if (element === undefined || element.hasAttribute(REF_LINK_ATTR)) return;
    // A view that is not registered has nothing to land on, so the decoration
    // is skipped before the resolver is even asked.
    if (!host.fsViewPresent()) return;
    const probe = probeOf(element);
    if (probe === undefined) return;
    const match = classifyReference(probe);
    if (match === undefined) return;
    if (host.sessionId() === null) return;

    const text = element.textContent ?? "";
    const mine = ++ticket;
    void host.resolve(match.target).then(
      resolved => {
        if (mine !== ticket || resolved === null) return;
        if ((element.textContent ?? "") !== text) return;
        element.setAttribute(REF_LINK_ATTR, markOf(resolved.kind));
      },
      // A transport failure is silence: the row simply stays plain, and the
      // next hover asks again through the resolver's own cache.
      () => undefined,
    );
  };

  const onClick = (event: Event): void => {
    const element = candidateOf(event);
    if (element === undefined) return;
    const mark = element.getAttribute(REF_LINK_ATTR);
    if (mark === null) return;
    const probe = probeOf(element);
    if (probe === undefined) return;
    const match = classifyReference(probe);
    if (match === undefined) return;
    if (host.sessionId() === null) return;
    event.preventDefault();
    void host.resolve(match.target).then(
      resolved => {
        // The mark says what the row was when it was dotted; the resolver says
        // what it is now. A path deleted in between opens nothing, silently.
        if (resolved === null) return;
        const absolute = resolved.path.startsWith("/");
        if (resolved.kind === "directory") host.revealDirectory(resolved.path, { absolute });
        else host.openFile(resolved.path, { absolute });
      },
      () => undefined,
    );
  };

  view.addEventListener("mouseover", onOver, true);
  view.addEventListener("click", onClick, true);
  return () => {
    ticket += 1;
    view.removeEventListener("mouseover", onOver, true);
    view.removeEventListener("click", onClick, true);
  };
}
