/**
 * The skill enhancer: the argument ghost after a skill token, and the hover panel
 * that shows what a skill is and what may follow it.
 *
 * Two surfaces, one module, because they share the same resolution work: which
 * skill is the draft addressing, what does its profile say, and where on screen
 * does the token sit. Both also share a constraint that shapes every decision
 * here: the composer is a contenteditable, and anything that steals focus from it
 * breaks the very interaction it is offering. So the panel is a `position: fixed`
 * body-level node (never clipped by the editor's overflow), every control in it
 * cancels `pointerdown` (the composer keeps focus, exactly as the host's own menu
 * does), and insertion goes through the host's `captureInsertion`/`insertText`
 * pair rather than rewriting the draft.
 *
 * Why not `setDraft`: it replaces the whole draft, which rebuilds the chip
 * structure after the caret and drops the user's undo step. `insertText` is a
 * discrete, independently undoable insertion validated against a draft revision,
 * so a stale click is refused instead of corrupting the draft.
 *
 * The caret is simplified to the end of the draft. The host's `InputState` does
 * not publish a caret, and `shouldShowHint` only needs to know whether anything
 * other than whitespace follows the token. The cost: a user who moves the caret
 * back into the token without changing the text keeps seeing the ghost until the
 * next keystroke. That is a cosmetic staleness, not a wrong insertion, because
 * insertion always re-captures the real selection.
 *
 * @module dsh-better/skill-enhancer
 */
import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";

import { matchLeadingSkillToken, shouldShowHint } from "./skill-hint.ts";
import { composerBusy } from "./composer-phase.ts";
import type { SkillProfileWire } from "../skill-profile.ts";

/** One session's published composer state, narrowed to what this module reads. */
export interface SkillInputStateLike {
  readonly draft: string;
  readonly draftRev: number;
  readonly phase: string;
  readonly occurrences?: readonly unknown[];
}

/** One session's published composer state; a snapshot store. */
export interface SkillInputStoreLike {
  getSnapshot(): SkillInputStateLike;
  subscribe(listener: () => void): () => void;
}

/** A selection span captured from the editor, as the host reports it. */
export interface InsertionSpanLike {
  readonly start: number;
  readonly end: number;
  readonly draftRev: number;
}

/** The insertion surface the composer exposes for one session. */
export interface InputActionsLike {
  captureInsertion?(): InsertionSpanLike;
  insertText?(text: string, span: InsertionSpanLike): boolean;
}

/** Props the overlay slot hands this entry. */
export interface SkillEnhancerProps {
  /** Id of the session whose composer is mounted, supplied by the registration inject. */
  readonly sessionId?: string;
  /**
   * The composer's draft selector, supplied by the session-scope slot.
   *
   * Preferred over this module's own subscription: it is the host's own hook, so
   * the ghost repaints on exactly the updates the composer itself renders on.
   */
  readonly useInput?: <T>(selector: (state: SkillInputStateLike) => T) => T;
  /** The composer's action surface, supplied by the session-scope slot. */
  readonly inputActions?: InputActionsLike;
}

/** Everything the enhancer needs from the plugin. */
export interface SkillEnhancerDeps {
  /** sessionId → the session scope, or undefined while it is gone. */
  readonly scopeFor: (sessionId: string) => unknown;
  /** sessionId → the published input store, used when the slot supplies no `useInput`. */
  readonly inputStoreFor: (sessionId: string) => SkillInputStoreLike | undefined;
  /** sessionId → the insertion surface, used when the slot supplies no `inputActions`. */
  readonly actionsFor: (sessionId: string) => InputActionsLike | undefined;
  /** sessionId → the names the host's skill catalogue knows (cached by the caller). */
  readonly skillNamesFor: (sessionId: string) => Promise<ReadonlySet<string>>;
  /** Fetch one skill's profile; undefined when the route is unavailable or the skill is unknown. */
  readonly loadProfile: (sessionId: string, name: string) => Promise<SkillProfileWire | undefined>;
  /** Invocation counts for one skill. `workspace` is absent when it cannot be aggregated. */
  readonly loadUsage: (sessionId: string, name: string) => { session: number; workspace?: number };
  readonly translate: (key: string, params?: Record<string, string | number>) => string;
  readonly document?: Document | undefined;
}

/** The skill name a text span addresses, or undefined when it is not a bare token. */
const BARE_SKILL_TOKEN = /^\/([a-z0-9]+(?:-[a-z0-9]+)*)[ \t]*$/u;

/** How long the pointer must rest on a token before the panel opens. */
const HOVER_OPEN_MS = 400;

/** How long the panel survives the pointer leaving, so it can be entered. */
const HOVER_CLOSE_MS = 200;

/** Where the ghost is placed relative to the token. */
const HINT_GAP_PX = 6;

/** Below this much room to the right, the ghost wraps under the token instead. */
const HINT_MIN_ROOM_PX = 240;

/** Stable empty state used before a session store resolves. */
const EMPTY_INPUT_STATE: SkillInputStateLike = { draft: "", draftRev: -1, phase: "plain" };

/**
 * The text one parameter click inserts.
 *
 * The separating space is the whole point: `insertText` lands at the caret, and
 * without a leading space a click on `--create` after `/flow-workflow` produces
 * `/flow-workflow--create`, which the host reads as a different skill name. The
 * trailing space is what lets a second click land as another argument instead of
 * gluing onto this one.
 * @param draft - the draft the insertion lands in.
 * @param flag - the parameter's insertable text.
 * @returns the exact string to insert.
 */
export function paramInsertionText(draft: string, flag: string): string {
  const needsSpace = draft !== "" && !/\s$/u.test(draft);
  return `${needsSpace ? " " : ""}${flag} `;
}

/**
 * The draft after one parameter is appended at the end.
 *
 * The component inserts through the host's action surface, not through this
 * function. It exists because "where does the caret land" is the one part of the
 * interaction that can be checked without a composer, and it is the part that
 * silently corrupts a draft when it is wrong.
 * @param draft - the draft before the click.
 * @param flag - the parameter's insertable text.
 * @returns the draft after the insertion.
 */
export function appendParam(draft: string, flag: string): string {
  return `${draft}${paramInsertionText(draft, flag)}`;
}

/**
 * The skill name a hovered text span addresses.
 *
 * The span holds the whole text node, so a token followed by a space or by
 * arguments is the normal case and both must be told apart: whitespace alone still
 * addresses the skill, anything else means the user has moved on and the panel
 * would be stale. Name format is checked but catalogue membership is not, because
 * that is the caller's async lookup and this decision is synchronous.
 * @param tokenText - the span's text content.
 * @returns the skill name, or undefined when the span is not a bare token.
 */
export function panelVisibleFor(tokenText: string | undefined): string | undefined {
  if (tokenText === undefined) return undefined;
  const found = BARE_SKILL_TOKEN.exec(tokenText);
  return found?.[1];
}

/**
 * The ghost's lines for one hint.
 *
 * A hint is authored as one long line by most skills, so it is not re-wrapped
 * here: the CSS keeps it on one line and lets the composer's own width decide.
 * Only authored line breaks split it, because those are the author's grouping.
 * @param argumentHint - the skill's raw hint.
 * @returns one entry per non-blank line; empty when there is no hint.
 */
export function hintLinesFor(argumentHint: string | undefined): readonly string[] {
  if (argumentHint === undefined) return [];
  return argumentHint
    .split("\n")
    .map(line => line.trim())
    .filter(line => line !== "");
}

/** The token element's box, in viewport coordinates. */
export interface TokenBox {
  readonly left: number;
  readonly right: number;
  readonly top: number;
  readonly bottom: number;
}

/** Where the panel should sit for one token box: above it by default. */
export interface PanelPlacement {
  /** Already clamped: the panel's left edge never leaves the viewport. */
  readonly left: number;
  /** Distance from the viewport top to the panel's top edge. */
  readonly top: number;
  /** How the panel is anchored vertically; `above` pins its bottom edge to the token. */
  readonly anchor: "above" | "below";
}

/** Narrowest and widest a panel may be, matching the stylesheet's bounds. */
export const PANEL_MIN_WIDTH = 240;
export const PANEL_MAX_WIDTH = 640;

/** Widest the panel may grow on a given viewport, leaving a margin on both sides. */
export function panelMaxWidth(viewportWidth: number): number {
  if (!Number.isFinite(viewportWidth) || viewportWidth <= 0) return PANEL_MAX_WIDTH;
  return Math.max(PANEL_MIN_WIDTH, Math.min(PANEL_MAX_WIDTH, viewportWidth - 24));
}

/**
 * Choose a width from the description's length.
 *
 * The panel is a tooltip first: a skill with a one-line description should not
 * open a 640px slab. Width therefore tracks how much text there is, in three
 * steps rather than a continuous ramp — a smoothly varying width would make two
 * neighbouring skills open differently sized panels for no readable benefit.
 *
 * The thresholds come from the installed catalog (180 skills): the median
 * description is 175 characters, 81 exceed 200, and the longest is 895. 200
 * characters land on ~4 lines at the wide step, which is the budget the
 * stylesheet's line clamp enforces; past that the extra width stops paying for
 * itself because the panel then covers the transcript it is anchored over.
 * @param descriptionLength - length of the description in characters; 0 when absent.
 * @param viewportWidth - viewport width, used to keep the panel inside the window.
 * @returns the width in pixels.
 */
export function panelWidthFor(descriptionLength: number, viewportWidth: number): number {
  const cap = panelMaxWidth(viewportWidth);
  const length = Number.isFinite(descriptionLength) && descriptionLength > 0 ? descriptionLength : 0;
  const wanted = length === 0
    ? PANEL_MIN_WIDTH
    : length <= 80
      ? 320
      : length < 200
        ? 480
        : PANEL_MAX_WIDTH;
  return Math.min(Math.max(wanted, PANEL_MIN_WIDTH), cap);
}

/**
 * Keep the panel inside the viewport horizontally.
 *
 * Without this the panel's left edge follows the token, so a `/skill` near the
 * right edge would push most of a 640px panel off-screen. Clamping the left edge
 * (rather than the right) keeps the panel's own content start aligned with the
 * token for as long as it fits.
 * @param wanted - the preferred left edge, from the token's box.
 * @param width - the panel's resolved width.
 * @param viewportWidth - viewport width; 0 disables the clamp.
 * @param margin - minimum distance from either viewport edge.
 * @returns the clamped left edge.
 */
export function clampPanelLeft(
  wanted: number,
  width: number,
  viewportWidth: number,
  margin: number,
): number {
  if (!Number.isFinite(viewportWidth) || viewportWidth <= 0) return wanted;
  const maxLeft = viewportWidth - width - margin;
  // A panel wider than the window cannot satisfy both edges; the left margin wins
  // so the title stays readable.
  return Math.max(margin, Math.min(wanted, Math.max(margin, maxLeft)));
}

/**
 * Measure the first `length` characters of a node's text, not the whole node.
 *
 * The composer's `[data-composer-text-ref]` node wraps the entire first line, so
 * its own rect is the line's — anchoring a hint to `rect.right` would place it
 * after everything the user has typed, at the far edge of the editor. A `Range`
 * over the leading characters gives the token's real right edge, which is where
 * the hint belongs.
 * @param doc - owning document.
 * @param node - the text-ref element.
 * @param length - how many characters from the start to measure.
 * @returns the measured box, or undefined when the range cannot be built.
 */
function prefixBox(doc: Document, node: Element, length: number): TokenBox | undefined {
  if (length <= 0 || typeof doc.createRange !== "function") return undefined;
  const range = doc.createRange();
  let remaining = length;
  let started = false;
  const walk = (parent: Node): boolean => {
    for (const child of Array.from(parent.childNodes)) {
      if (child.nodeType === 3) {
        const text = child.textContent ?? "";
        const take = Math.min(remaining, text.length);
        if (take <= 0) continue;
        if (!started) {
          range.setStart(child, 0);
          started = true;
        }
        range.setEnd(child, take);
        remaining -= take;
        if (remaining <= 0) return true;
        continue;
      }
      if (walk(child)) return true;
    }
    return false;
  };
  if (!walk(node) || remaining > 0) return undefined;
  const rect = range.getBoundingClientRect();
  // A zero-width range (a detached node, a stub document) tells us nothing.
  if (rect.width === 0 && rect.height === 0) return undefined;
  return { left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom };
}

/** Read the box of the leading `/name` token in the composer's first line. */
function tokenBox(doc: Document, name: string): TokenBox | undefined {
  const nodes = doc.querySelectorAll("[data-composer-text-ref]");
  for (const node of nodes) {
    if (panelVisibleFor(node.textContent ?? "") !== name) continue;
    const precise = prefixBox(doc, node, name.length + 1);
    if (precise !== undefined) return precise;
    const rect = node.getBoundingClientRect();
    return { left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom };
  }
  return undefined;
}

/** The viewport width, tolerating a document without a window. */
function viewportWidth(doc: Document): number {
  return doc.defaultView?.innerWidth ?? 0;
}

/**
 * Decide where the panel goes: above the token, or below it when there is not
 * enough room above.
 *
 * Above is the default because the composer sits at the bottom of the window —
 * a panel opening downward would cover the transcript the user is reading and,
 * on a short window, run off the screen. The flip is driven by the measured
 * room, not by a guessed constant, so it holds on any window size.
 * @param box - the token's viewport box.
 * @param viewportHeight - current window height; 0 when unknown.
 * @param panelHeight - the panel's own height, or 0 before it has been measured.
 * @param margin - minimum gap between the panel and the token.
 * @returns the placement; `top` is only meaningful for the `below` anchor.
 */
export function panelPlacement(
  box: TokenBox,
  viewportHeight: number,
  panelHeight: number,
  margin: number,
): PanelPlacement {
  const roomAbove = box.top - margin;
  // The first paint happens before the panel has a height; the caller re-runs the
  // measurement once it does, so treating "unknown" as "fits" keeps that first
  // paint from flickering to the wrong side.
  // A non-finite height is "not measured yet" (a detached node, a stub document),
  // and must be treated like the first paint rather than as an oversized panel.
  const measured = Number.isFinite(panelHeight) && panelHeight > 0 ? panelHeight : 0;
  const fitsAbove = measured === 0 || measured <= roomAbove;
  return fitsAbove
    ? { left: box.left, top: 0, anchor: "above" }
    : { left: box.left, top: box.bottom + margin, anchor: "below" };
}

/** The viewport height, tolerating a document without a window. */
function viewportHeight(doc: Document): number {
  return doc.defaultView?.innerHeight ?? 0;
}

/**
 * Build the enhancer component.
 * @param deps - catalogue, profile, usage and insertion resolvers.
 * @returns the slot component; it renders a body-level ghost and panel.
 */
export function createSkillEnhancer(deps: SkillEnhancerDeps): (props: SkillEnhancerProps) => ReactNode {
  return function SkillEnhancer(props: SkillEnhancerProps): ReactNode {
    const doc = deps.document ?? globalThis.document;
    const sessionId = props.sessionId;
    const store = sessionId === undefined ? undefined : deps.inputStoreFor(sessionId);

    // The slot's own selector hook when it is there, this module's subscription
    // otherwise: a host that changes the slot props must degrade, not blank.
    const fromSlot = props.useInput;
    const draftFromSlot = fromSlot === undefined ? undefined : fromSlot(state => state.draft);
    const phaseFromSlot = fromSlot === undefined ? undefined : fromSlot(state => state.phase);
    const stateFromStore = useSyncExternalStore(
      listener => (store === undefined ? () => undefined : store.subscribe(listener)),
      () => (store === undefined ? EMPTY_INPUT_STATE : store.getSnapshot()),
      () => (store === undefined ? EMPTY_INPUT_STATE : store.getSnapshot()),
    );
    const draft = draftFromSlot ?? stateFromStore.draft;
    const phase = phaseFromSlot ?? stateFromStore.phase;

    const [names, setNames] = useState<ReadonlySet<string>>(() => new Set<string>());
    const [profile, setProfile] = useState<SkillProfileWire | undefined>(undefined);
    const [hovered, setHovered] = useState<string | undefined>(undefined);
    const [box, setBox] = useState<TokenBox | undefined>(undefined);
    const [usage, setUsage] = useState<{ session: number; workspace?: number } | undefined>(undefined);

    // The catalogue is fetched once per session and kept: it changes only when the
    // workspace does, and a refetch per keystroke would hammer the host.
    useEffect(() => {
      if (sessionId === undefined) return;
      let live = true;
      void deps.skillNamesFor(sessionId).then(
        found => {
          if (live) setNames(found);
        },
        () => {
          if (live) setNames(new Set<string>());
        },
      );
      return () => {
        live = false;
      };
    }, [sessionId]);

    const match = matchLeadingSkillToken(draft, name => names.has(name));
    // The caret is assumed to be at the end; see the module note on staleness.
    // While a submission is in flight the host keeps the draft (it clears only
    // after acceptance) and freezes the editor, so a hint here would invite a
    // parameter click that cannot land.
    const hintName = shouldShowHint(match, draft, draft.length) && !composerBusy(phase)
      ? match?.name
      : undefined;

    // The ghost's text follows whichever skill the draft addresses, whether it was
    // reached by typing or by hovering.
    const profileName = hintName ?? hovered;
    useEffect(() => {
      if (sessionId === undefined || profileName === undefined) {
        setProfile(undefined);
        return;
      }
      let live = true;
      void deps.loadProfile(sessionId, profileName).then(
        found => {
          if (live) setProfile(found);
        },
        () => {
          if (live) setProfile(undefined);
        },
      );
      return () => {
        live = false;
      };
    }, [sessionId, profileName]);

    // Anchor the ghost to the token's box. Re-measured when the draft changes
    // (the token may have moved) and on resize (the composer may have reflowed).
    useEffect(() => {
      if (doc === undefined || hintName === undefined) {
        setBox(undefined);
        return;
      }
      const measure = (): void => setBox(tokenBox(doc, hintName));
      measure();
      const view = doc.defaultView;
      view?.addEventListener("resize", measure);
      return () => view?.removeEventListener("resize", measure);
    }, [doc, hintName, draft]);

    // The hover timer. One entry/exit pair per token, cancelled on the way out so a
    // pointer sweeping across a line of text never opens anything.
    const openTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const clearOpen = (): void => {
      if (openTimer.current !== null) clearTimeout(openTimer.current);
      openTimer.current = null;
    };
    const clearClose = (): void => {
      if (closeTimer.current !== null) clearTimeout(closeTimer.current);
      closeTimer.current = null;
    };

    useEffect(() => {
      if (doc === undefined || sessionId === undefined) return;
      const onOver = (event: Event): void => {
        const target = event.target;
        if (!(target instanceof doc.defaultView!.Element)) return;
        const node = target.closest("[data-composer-text-ref]");
        if (node === null) return;
        const name = panelVisibleFor(node.textContent ?? "");
        if (name === undefined) return;
        clearClose();
        clearOpen();
        openTimer.current = setTimeout(() => {
          openTimer.current = null;
          setHovered(name);
          setBox(tokenBox(doc, name));
          setUsage(deps.loadUsage(sessionId, name));
        }, HOVER_OPEN_MS);
      };
      const onOut = (event: Event): void => {
        const target = event.target;
        if (!(target instanceof doc.defaultView!.Element)) return;
        if (target.closest("[data-composer-text-ref]") === null) return;
        clearOpen();
        clearClose();
        closeTimer.current = setTimeout(() => {
          closeTimer.current = null;
          setHovered(undefined);
        }, HOVER_CLOSE_MS);
      };
      doc.addEventListener("pointerover", onOver, true);
      doc.addEventListener("pointerout", onOut, true);
      return () => {
        clearOpen();
        clearClose();
        doc.removeEventListener("pointerover", onOver, true);
        doc.removeEventListener("pointerout", onOut, true);
      };
    }, [doc, sessionId]);

    // Escape closes the panel. The panel never takes focus, so this listens on the
    // document rather than on a panel node.
    useEffect(() => {
      if (doc === undefined || hovered === undefined) return;
      const onKey = (event: KeyboardEvent): void => {
        if (event.key === "Escape") setHovered(undefined);
      };
      doc.addEventListener("keydown", onKey);
      return () => doc.removeEventListener("keydown", onKey);
    }, [doc, hovered]);

    // The latest draft and action surface, read by the panel's click handler. The
    // panel node outlives a keystroke on purpose: rebuilding it on every draft
    // change would drop the pointer-enter grace period while the user is trying to
    // reach the very button they are hovering.
    const draftRef = useRef(draft);
    draftRef.current = draft;
    const actionsRef = useRef<InputActionsLike | undefined>(undefined);
    actionsRef.current = props.inputActions ?? (sessionId === undefined ? undefined : deps.actionsFor(sessionId));

    // The ghost. Mounted into `body` rather than rendered in the slot cell: the
    // composer clips its own children, and an absolutely positioned ghost inside
    // it would be cut off at the editor's edge.
    useEffect(() => {
      if (doc === undefined || hintName === undefined || box === undefined) return undefined;
      const lines = hintLinesFor(profile?.argumentHint);
      if (lines.length === 0) return undefined;
      const node = renderGhost(doc, box, lines);
      doc.body.append(node);
      return () => node.remove();
    }, [doc, hintName, box, profile]);

    // The panel, also body-level and fixed so it clears host popovers.
    useEffect(() => {
      if (doc === undefined || hovered === undefined) return undefined;
      const node = renderPanel(doc, deps, {
        name: hovered,
        profile,
        usage,
        box,
        sessionId,
        getActions: () => actionsRef.current,
        getDraft: () => draftRef.current,
        onEnter: clearClose,
        onLeave: () => {
          clearOpen();
          clearClose();
          closeTimer.current = setTimeout(() => {
            closeTimer.current = null;
            setHovered(undefined);
          }, HOVER_CLOSE_MS);
        },
      });
      doc.body.append(node);
      return () => node.remove();
    }, [doc, hovered, profile, usage, box, sessionId]);

    return null;
  };
}

/**
 * Build the ghost node.
 *
 * Created imperatively rather than as JSX so it can be appended to `body` beside
 * the panel: the composer's own box clips its children, and a ghost positioned
 * inside it would be cut off at the editor's edge.
 */
export function renderGhost(doc: Document, box: TokenBox, lines: readonly string[]): HTMLElement {
  const node = doc.createElement("div");
  node.className = "dsh-better-skill-hint";
  node.textContent = lines.join("\n");
  const wraps = box.right + HINT_GAP_PX > viewportWidth(doc) - HINT_MIN_ROOM_PX;
  node.style.left = `${wraps ? box.left : box.right + HINT_GAP_PX}px`;
  node.style.top = `${wraps ? box.bottom + 2 : box.top}px`;
  return node;
}

/** What the panel renders for one hovered skill. */
export interface PanelInput {
  readonly name: string;
  readonly profile: SkillProfileWire | undefined;
  readonly usage: { session: number; workspace?: number } | undefined;
  readonly box: TokenBox | undefined;
  readonly sessionId: string | undefined;
  /** Read at click time, so the panel never holds a stale action surface. */
  readonly getActions: () => InputActionsLike | undefined;
  /** Read at click time, for the same reason. */
  readonly getDraft: () => string;
  readonly onEnter: () => void;
  readonly onLeave: () => void;
}

/**
 * Build the panel node.
 *
 * Every control cancels `pointerdown`: the composer keeps focus, so a click on a
 * parameter inserts at the caret the user left behind instead of at a caret the
 * panel just created by stealing focus.
 */
export function renderPanel(doc: Document, deps: SkillEnhancerDeps, input: PanelInput): HTMLElement {
  const panel = doc.createElement("div");
  panel.className = "dsh-better-skill-panel";
  panel.addEventListener("pointerenter", input.onEnter);
  panel.addEventListener("pointerleave", input.onLeave);

  const title = doc.createElement("div");
  title.className = "dsh-better-skill-panel-title";
  title.textContent = `/${input.name}`;
  panel.append(title);

  // Directly under the name: it is the human answer to "what is this skill", and
  // the metadata block below is reference material.
  const description = input.profile?.description;
  if (description !== undefined && description !== "") {
    const descNode = doc.createElement("div");
    descNode.className = "dsh-better-skill-panel-desc";
    descNode.textContent = description;
    // The clamp keeps the panel readable but hides the tail; the full string stays
    // reachable without widening the panel.
    descNode.title = description;
    panel.append(descNode);
  }

  const metadata = input.profile?.metadata ?? {};
  const metadataKeys = Object.keys(metadata);
  if (metadataKeys.length > 0) {
    const section = doc.createElement("div");
    section.className = "dsh-better-skill-panel-section";
    section.append(labelNode(doc, deps.translate("skill.metadata")));
    for (const key of metadataKeys) {
      const row = doc.createElement("div");
      row.textContent = `${key}: ${metadata[key] ?? ""}`;
      section.append(row);
    }
    panel.append(section);
  }

  const path = input.profile?.path;
  if (path !== undefined && path !== "") {
    panel.append(labelNode(doc, deps.translate("skill.path")));
    const pathNode = doc.createElement("div");
    pathNode.className = "dsh-better-skill-panel-path";
    pathNode.textContent = path;
    panel.append(pathNode);
  }

  if (input.usage !== undefined) {
    const counts = doc.createElement("div");
    counts.className = "dsh-better-skill-panel-counts";
    counts.textContent = `${deps.translate("skill.usage.session")} ${input.usage.session}`;
    if (input.usage.workspace !== undefined) {
      counts.textContent += ` · ${deps.translate("skill.usage.workspace")} ${input.usage.workspace}`;
    }
    panel.append(counts);
  }

  const params = input.profile?.params ?? [];
  // No action surface means no insertion path, and a button that cannot insert is
  // worse than no button: it teaches the user a gesture that does nothing.
  if (params.length > 0 && input.getActions()?.insertText !== undefined) {
    panel.append(labelNode(doc, deps.translate("skill.params")));
    for (const param of params) {
      panel.append(paramButton(doc, deps, input, param.flag, param.detail));
    }
  }

  {
    const margin = 4;
    // Width first: the horizontal clamp and the wrap measurement both depend on it.
    const viewportW = viewportWidth(doc);
    const width = panelWidthFor(description?.length ?? 0, viewportW);
    panel.style.width = `${width}px`;
    if (input.box !== undefined) {
      // Measured from the element itself so the flip above/below uses the real
      // height of this skill's content rather than a worst-case constant.
      const place = panelPlacement(input.box, viewportHeight(doc), panel.offsetHeight, margin);
      panel.style.left = `${clampPanelLeft(place.left, width, viewportW, 12)}px`;
      if (place.anchor === "above") {
        // Anchor the bottom edge to the token's top: `bottom` is resolved against
        // the viewport for a fixed element, so the panel grows upward as the list
        // of parameters gets longer.
        panel.style.bottom = `${viewportHeight(doc) - input.box.top + margin}px`;
        panel.style.top = "";
      } else {
        panel.style.top = `${place.top}px`;
        panel.style.bottom = "";
      }
    }
  }
  return panel;
}

/** One label row. */
function labelNode(doc: Document, text: string): HTMLElement {
  const node = doc.createElement("div");
  node.className = "dsh-better-skill-panel-label";
  node.textContent = text;
  return node;
}

/** One insertable parameter row. */
function paramButton(
  doc: Document,
  deps: SkillEnhancerDeps,
  input: PanelInput,
  flag: string,
  detail: string,
): HTMLElement {
  const button = doc.createElement("button");
  button.type = "button";
  button.className = "dsh-better-skill-panel-param";
  button.title = deps.translate("skill.hint.insert");
  // The composer must keep focus; see the module note.
  button.addEventListener("pointerdown", event => event.preventDefault());

  const flagNode = doc.createElement("span");
  flagNode.className = "dsh-better-skill-panel-param-flag";
  flagNode.textContent = flag;
  button.append(flagNode);

  if (detail !== "") {
    const detailNode = doc.createElement("span");
    detailNode.className = "dsh-better-skill-panel-param-detail";
    detailNode.textContent = detail;
    button.append(detailNode);
  }

  button.addEventListener("click", () => {
    const actions = input.getActions();
    if (actions?.insertText === undefined || actions.captureInsertion === undefined) return;
    const span = actions.captureInsertion();
    // A refused insertion (stale revision) leaves the draft untouched; the next
    // click captures a fresh span, so there is nothing to recover here.
    actions.insertText(paramInsertionText(input.getDraft(), flag), span);
  });
  return button;
}
