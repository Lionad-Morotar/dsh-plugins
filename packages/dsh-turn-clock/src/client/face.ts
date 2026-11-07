/**
 * The clock face: turning a host label into the same sentence with a different
 * duration.
 *
 * The shipped Turn labels are rendered by ui-chat, not by a slot this package
 * could occupy, so the correction is a text rewrite of the two attributes the
 * host puts on them — `data-chat-running` while the Turn runs and
 * `data-turn-process` once it closed. That makes this module's contract narrow
 * on purpose:
 *
 *   - the host owns the sentence; we only replace the duration inside it, so
 *     every language the host ships keeps working and no copy is duplicated;
 *   - we never add or remove nodes, because React owns the element tree. A
 *     settled label is rewritten through its text nodes (the new sentence goes
 *     into the first and the rest are blanked); the live label is painted by
 *     TextShimmer from a `data-shimmer-text` attribute and has no text nodes at
 *     all, so it is rewritten through that attribute instead. Either way the
 *     host's next render overwrites the value and the observer corrects it again;
 *   - an unrecognized label is left alone. A host that rephrases its sentence
 *     degrades to the shipped reading instead of printing something wrong.
 *
 * The unit words are read back from the host's own rendering of the wall
 * duration, which is why this never needs a dictionary: `9 小时 30 分 35 秒`
 * tells us the host says 小时/分/秒, and `9h 30m 35s` tells us it says h/m/s.
 */
import { liveNetMs } from "../net.ts";
import type { TurnClockView } from "../types.ts";

/** The sentence split into the host's prefix, its duration units, and its tail. */
export interface LabelParts {
  /** Everything before the duration, verbatim. */
  readonly prefix: string;
  /** Unit words in hour, minute, second order — only the units the sentence showed. */
  readonly units: readonly string[];
  /** Everything after the duration, verbatim (the `···` tail of a running label). */
  readonly suffix: string;
}

/**
 * The marker the running label puts after the duration.
 *
 * `chat.deepDivingFor` is `"深度求索中，用时 {duration} ···"` in every shipped
 * locale, so this suffix is what separates the duration from the rest of the
 * sentence without knowing the sentence itself.
 */
const RUNNING_TAIL = "···";

/** One `digits + unit` pair inside a rendered duration. */
const DURATION_PAIR = /(\d+)([^\d]*)/gu;

/**
 * Split one host label into prefix, duration units, and suffix.
 *
 * The duration always starts at the first digit — every shipped `{duration}`
 * template puts it after copy that carries no numbers — and ends at the running
 * tail or at the end of the label.
 * @param text - the label's rendered text content.
 * @returns the parts, or null when the label does not look like a duration sentence.
 */
export function splitLabel(text: string): LabelParts | null {
  const tail = text.indexOf(RUNNING_TAIL);
  const end = tail === -1 ? text.length : tail;
  const head = text.slice(0, end);
  const firstDigit = head.search(/\d/u);
  if (firstDigit === -1) return null;
  const duration = head.slice(firstDigit).trimEnd();
  if (duration === "") return null;
  const units: string[] = [];
  for (const match of duration.matchAll(DURATION_PAIR)) {
    const unit = match[2];
    if (unit === undefined || unit.trim() === "") return null;
    units.push(unit);
  }
  if (units.length === 0 || units.length > 3) return null;
  const prefix = head.slice(0, firstDigit);
  const consumed = firstDigit + duration.length;
  return { prefix, units, suffix: text.slice(consumed) };
}

/**
 * Render one net duration with the unit words the host itself used.
 *
 * The rule mirrors the shipped `formatRunDuration`: hours only when there are
 * hours, minutes whenever the span reaches a minute, and seconds always. Because
 * the corrected figure is never larger than the wall span the host just
 * rendered, the host's unit list always covers the units this needs.
 * @param millis - net duration in milliseconds.
 * @param parts - the host label's units, in the order they were shown.
 * @returns the duration text, ready to splice back into `prefix`/`suffix`.
 */
export function formatNet(millis: number, parts: LabelParts): string {
  const total = Math.max(0, Math.floor(millis / 1_000));
  const hours = Math.floor(total / 3_600);
  const minutes = Math.floor(total / 60) % 60;
  const seconds = total % 60;
  const units = parts.units;
  const offset = 3 - units.length;
  const hourUnit = offset <= 0 ? units[0] : undefined;
  const minuteUnit = offset <= 1 ? units[1 - offset] : undefined;
  const secondUnit = units[units.length - 1];
  let printed = "";
  if (hours > 0) printed += `${String(hours)}${hourUnit ?? ""}`;
  if (total >= 60) printed += `${String(minutes)}${minuteUnit ?? ""}`;
  return printed + `${String(seconds)}${secondUnit ?? ""}`;
}

/**
 * Rewrite one label so it carries the corrected figure.
 * @param label - the element whose text content is the label sentence.
 * @param millis - net duration in milliseconds.
 * @returns true when the element was written, false when it was already right or unreadable.
 */
export function rewriteLabel(label: Element, millis: number): boolean {
  const text = label.textContent ?? "";
  const parts = splitLabel(text);
  if (parts === null) return false;
  const next = `${parts.prefix}${formatNet(millis, parts)}${parts.suffix}`;
  if (next === text) return false;
  writeText(label, next);
  return true;
}

/**
 * Put one sentence into an element without moving React's nodes.
 *
 * React owns this subtree; adding or removing nodes would desynchronize it. So
 * the sentence goes into the first text node and every other text node is
 * blanked — a shape React rewrites on its next render, which is exactly the
 * event the observer above listens for.
 * @param root - the element React rendered.
 * @param text - the sentence to show.
 */
function writeText(root: Element, text: string): void {
  const texts = textNodes(root);
  const first = texts[0];
  if (first === undefined) {
    root.textContent = text;
    return;
  }
  if (first.nodeValue !== text) first.nodeValue = text;
  for (let index = 1; index < texts.length; index += 1) {
    const node = texts[index];
    if (node !== undefined && node.nodeValue !== "") node.nodeValue = "";
  }
}

/**
 * Collect text nodes under one element in document order.
 * @param root - the element to walk.
 * @param doc - the owning document, injected so tests can use a detached tree.
 * @returns the non-empty branches as text nodes.
 */
function textNodes(root: Element, doc: Document = root.ownerDocument): Text[] {
  const walker = doc.createTreeWalker(root, 4 /* NodeFilter.SHOW_TEXT */);
  const found: Text[] = [];
  for (let node = walker.nextNode(); node !== null; node = walker.nextNode()) {
    if (node.nodeType === 3) found.push(node as Text);
  }
  return found;
}

/** The live running label: the host's own status row. */
const RUNNING_SELECTOR = "[data-chat-running]";

/** A settled Turn's process row; its `data-turn-process` value is the Turn number. */
const TURN_PROCESS_SELECTOR = "[data-turn-process]";

/**
 * The attribute TextShimmer paints its copy from.
 *
 * While the shimmer runs the component holds no text nodes at all: both the
 * visible span and its decoration twin carry the sentence in this attribute and
 * the stylesheet renders it with `content: attr(data-shimmer-text)`. A text-node
 * rewrite therefore cannot reach the live label, which is why the attribute is
 * the primary target here.
 */
const SHIMMER_TEXT_ATTR = "data-shimmer-text";

/** The minimum the patcher needs from a view; the host view satisfies it. */
export type ClockReading = Pick<TurnClockView, "currentTurn" | "turnStart" | "waitMs" | "waitSince" | "turnNet">;

/**
 * Rewrite one running row's live sentence, in every copy of it.
 *
 * Two targets, because TextShimmer ships two shapes of the same component: an
 * animated one that paints from the attribute (a visible copy plus a decoration
 * copy for the sweep), and an idle one that renders real children. Both copies
 * of the animated shape are rewritten so the sweep and the text cannot disagree,
 * and the text-node pass keeps the idle shape working (and survives a host that
 * drops the shimmer).
 * @param row - one `[data-chat-running]` element.
 * @param millis - net duration to show.
 * @returns how many copies were rewritten.
 */
function patchRunningRow(row: Element, millis: number): number {
  let written = 0;
  for (const element of row.querySelectorAll(`[${SHIMMER_TEXT_ATTR}]`)) {
    const value = element.getAttribute(SHIMMER_TEXT_ATTR) ?? "";
    const parts = splitLabel(value);
    if (parts === null) continue;
    const next = `${parts.prefix}${formatNet(millis, parts)}${parts.suffix}`;
    if (next === value) continue;
    element.setAttribute(SHIMMER_TEXT_ATTR, next);
    written += 1;
  }
  for (const node of textNodes(row)) {
    const value = node.nodeValue ?? "";
    if (!value.includes(RUNNING_TAIL)) continue;
    const parts = splitLabel(value);
    if (parts === null) continue;
    const next = `${parts.prefix}${formatNet(millis, parts)}${parts.suffix}`;
    if (next === value) continue;
    node.nodeValue = next;
    written += 1;
  }
  return written;
}

/**
 * Apply the correction to everything currently on screen.
 *
 * Split from the observer so tests can drive one pass over a detached document,
 * and so the interval and the mutation callback share exactly one code path.
 * @param doc - the document holding the chat flow.
 * @param read - the current session reading, or undefined before the projection arrives.
 * @param now - client wall time in epoch milliseconds.
 * @returns how many labels were rewritten.
 */
export function patchDocument(doc: Document, read: () => ClockReading | undefined, now: number): number {
  const view = read();
  if (view === undefined) return 0;
  let written = 0;
  const running = liveNetMs({ ...view, totalWaitMs: 0 }, now);
  if (running !== null && view.currentTurn !== null) {
    for (const row of doc.querySelectorAll(RUNNING_SELECTOR)) written += patchRunningRow(row, running);
  }
  for (const row of doc.querySelectorAll(TURN_PROCESS_SELECTOR)) {
    const turn = row.getAttribute("data-turn-process");
    if (turn === null) continue;
    const net = view.turnNet[turn];
    if (net === undefined) continue;
    if (rewriteLabel(row, net)) written += 1;
  }
  return written;
}

/** How long one debounce window holds mutations before one pass runs. */
const SETTLE_MS = 40;

/** The interval that keeps the running label moving even when the host is quiet. */
const TICK_MS = 1_000;

/** A running patcher. */
export interface ClockPatcher {
  /** Tear down the observer and the interval. */
  stop(): void;
}

/**
 * Watch one document and keep both Turn labels on the working clock.
 *
 * Two triggers, because the two labels move for different reasons: the interval
 * keeps the live figure ticking while a question is open, and the mutation
 * observer catches everything React repaints — the host rewrites the live label
 * once a second on its own, and the settled row is repainted when a Turn closes
 * or a long conversation is scrolled.
 * @param doc - the document holding the chat flow.
 * @param read - the current session reading, or undefined before the projection arrives.
 * @returns the patcher handle.
 */
export function startClockPatcher(doc: Document, read: () => ClockReading | undefined): ClockPatcher {
  let timer: ReturnType<typeof setTimeout> | null = null;
  const pass = (): void => {
    timer = null;
    patchDocument(doc, read, Date.now());
  };
  const schedule = (): void => {
    if (timer !== null) return;
    timer = setTimeout(pass, SETTLE_MS);
  };
  const observer = new MutationObserver(schedule);
  const target = doc.body ?? doc.documentElement;
  // `data-shimmer-text` is an attribute, not text: the host rewrites it once a
  // second on the live label, and without the attribute filter those writes
  // would only be corrected on the next tick.
  observer.observe(target, {
    subtree: true,
    childList: true,
    characterData: true,
    attributes: true,
    attributeFilter: [SHIMMER_TEXT_ATTR],
  });
  const interval = setInterval(() => {
    patchDocument(doc, read, Date.now());
  }, TICK_MS);
  pass();
  return {
    stop(): void {
      observer.disconnect();
      clearInterval(interval);
      if (timer !== null) clearTimeout(timer);
      timer = null;
    },
  };
}
