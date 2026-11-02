/**
 * Commit references written as inline code in the chat prose.
 *
 * The host's markdown renderer has no slot a plugin can occupy between the
 * http-link pass and the file-mention pass, so a commit hash never becomes a
 * link on its own. The recognition is pure; the document listener only applies
 * it, one element at a time, and only once the current session's repository has
 * confirmed the text names exactly one commit.
 */

import type { GitCommitSummary, SlotEntry } from "./dsh.ts";

/** The view id `dsh-git-explorer` registers into `conversation.view`. */
export const GIT_VIEW_SLOT = "conversation.view";
export const GIT_VIEW_ID = "git-explorer";

/** Marks a code span the reader may click; the stylesheet owns the look. */
export const COMMIT_LINK_ATTR = "data-dcp-commit";

/**
 * Where a 7-digit prefix stops being worth a round trip.
 *
 * Shorter than that collides too often to decorate, and the command panel's own
 * four-digit threshold is a typed query with a disambiguation list behind it,
 * which prose has no room for.
 */
const MIN_DIGITS = 7;
const MAX_DIGITS = 40;

/** What the decorator needs to know about one element, with the DOM peeled off. */
export interface CommitRefProbe {
  /** The element's own tag, upper case. */
  readonly tag: string;
  /** Its text, exactly as rendered. */
  readonly text: string;
  /** Whether a `pre` sits between the element and the document. */
  readonly insidePre: boolean;
  /** Whether the message that owns it is still being written. */
  readonly streaming: boolean;
}

/** Whether one element is a commit reference the prose may offer to open. */
export function decorateCommitRef(probe: CommitRefProbe): boolean {
  if (probe.streaming || probe.insidePre) return false;
  if (probe.tag !== "CODE") return false;
  return new RegExp(`^[0-9a-f]{${MIN_DIGITS},${MAX_DIGITS}}$`, "i").test(probe.text);
}

/**
 * The one commit a prefix names, or undefined when it names none or several.
 *
 * `git log` treats the text as a revision, so a prefix of a tag or a branch can
 * come back as a hit that does not start with it. Counting the rows would open
 * the wrong commit; the hash itself is the only thing that may decide.
 *
 * @param text - the inline code, either case.
 * @param commits - the commits the query returned.
 * @returns the full hash, lower case as the history spells it.
 */
export function uniqueCommitHit(text: string, commits: readonly GitCommitSummary[]): string | undefined {
  const prefix = text.toLowerCase();
  const hits = commits.filter(commit => commit.hash.toLowerCase().startsWith(prefix));
  return hits.length === 1 ? hits[0]?.hash : undefined;
}

/**
 * Whether the Git workbench has registered its conversation view.
 *
 * An unregistered view has nothing to land on, and a dotted underline over a
 * hash that cannot open would be a promise the click cannot keep.
 */
export function gitViewPresent(entries: readonly SlotEntry[] | undefined): boolean {
  return entries?.some(entry => entry.options?.id === GIT_VIEW_ID) ?? false;
}

/** What one prose click needs from the runtime, answered per gesture. */
export interface CommitLinkHost {
  /** The session on screen, or null when none is mounted. */
  sessionId(): string | null;
  /**
   * Ask that session's repository which commits the text names.
   *
   * `ok: false` is a business refusal (ambiguous, unknown, malformed); a thrown
   * error is a transport failure. Both are silence.
   */
  query(
    sessionId: string,
    ref: string,
  ): Promise<{ readonly ok: true; readonly commits: readonly GitCommitSummary[] } | { readonly ok: false }>;
  /** Open the Git workbench on one full hash. The command panel stays closed. */
  open(hash: string): void;
  /** Whether the Git view is registered right now. */
  gitViewPresent(): boolean;
}

/**
 * The code span a gesture landed on, or undefined when it may not be one.
 *
 * The node type is read off the target's own document. A listener installed
 * from outside it (the test runner, the bundled plugin) does not share that
 * document's `Element`, so `instanceof` against the outer one never matches,
 * and `event.view` is null for an event dispatched by hand.
 */
function codeOf(event: Event): Element | undefined {
  const target = event.target;
  const owner = target as { readonly ownerDocument?: Document } | null;
  const Element = owner?.ownerDocument?.defaultView?.Element;
  if (Element === undefined || !(target instanceof Element)) return undefined;
  if (target.closest("[data-streaming]") !== null) return undefined;
  if (target.closest("pre") !== null) return undefined;
  return target.closest("code") ?? undefined;
}

/**
 * Watch the document for inline commit hashes and open the one that is unique.
 *
 * Both listeners capture, so the decision lands before any handler lower in
 * the tree restyles the span or claims the click for text selection.
 *
 * @param doc - the document the chat renders into.
 * @param host - the runtime's answers, read fresh on every gesture.
 * @returns a disposer that drops both listeners.
 */
export function installCommitLinks(doc: Document, host: CommitLinkHost): () => void {
  const view = doc.defaultView;
  if (view === null) return () => undefined;

  /** Refs whose repository answer is already known, keyed by session and text. */
  const known = new Map<string, string | undefined>();
  let ticket = 0;

  const ask = (sessionId: string, text: string): Promise<string | undefined> => {
    const key = `${sessionId}\u0000${text.toLowerCase()}`;
    const cached = known.get(key);
    if (cached !== undefined || known.has(key)) return Promise.resolve(cached);
    return host
      .query(sessionId, text)
      .then(result => {
        const hash = result.ok ? uniqueCommitHit(text, result.commits) : undefined;
        known.set(key, hash);
        return hash;
      })
      .catch(() => undefined);
  };

  const onOver = (event: Event): void => {
    const code = codeOf(event);
    if (code === undefined || code.hasAttribute(COMMIT_LINK_ATTR)) return;
    const text = code.textContent ?? "";
    if (!decorateCommitRef({ tag: "CODE", text, insidePre: false, streaming: false })) return;
    if (!host.gitViewPresent()) return;
    const sessionId = host.sessionId();
    if (sessionId === null) return;
    const mine = ++ticket;
    void ask(sessionId, text).then(hash => {
      // A span rewritten mid-flight, or a newer hover, keeps its own answer.
      if (mine !== ticket || code.textContent !== text) return;
      if (hash !== undefined) code.setAttribute(COMMIT_LINK_ATTR, "");
    });
  };

  const onClick = (event: Event): void => {
    const code = codeOf(event);
    if (code === undefined || !code.hasAttribute(COMMIT_LINK_ATTR)) return;
    const text = code.textContent ?? "";
    const sessionId = host.sessionId();
    if (sessionId === null) return;
    event.preventDefault();
    void ask(sessionId, text).then(hash => {
      if (hash !== undefined) host.open(hash);
    });
  };

  view.addEventListener("mouseover", onOver, true);
  view.addEventListener("click", onClick, true);
  return () => {
    ticket += 1;
    view.removeEventListener("mouseover", onOver, true);
    view.removeEventListener("click", onClick, true);
  };
}
