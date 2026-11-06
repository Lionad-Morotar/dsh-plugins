/**
 * The alias menu watcher.
 *
 * The host's trigger pipeline only fires on `/` and `@`, and the shipped menu
 * closes once the token stops covering the whole draft. This overlay entry
 * watches the composer's published input state and re-opens the *same* menu
 * through `InputTriggerController.toggleSource` in two gaps:
 *
 *   - prefix mode on: `/wf ` keeps the menu after the native one closes on the
 *     trailing space, with the replacement span extended over that space;
 *   - prefix mode off: `wf` has no trigger character, so the menu is opened
 *     programmatically for the exact keyword.
 *
 * That keeps the alias selector one menu implementation: this file owns no
 * markup, no keyboard handling and no pick settlement.
 *
 * It only opens the menu for an exact configured keyword at the leading edge of
 * the draft. Prefixes are deliberately excluded: opening on every letter would
 * flash a menu while the user is writing ordinary prose. Once open, every draft
 * revision that still names the same keyword reopens the menu with a fresh span
 * (the pick uses span CAS, so a stale revision would be rejected); a draft that
 * stops naming it dismisses the menu.
 */
import { useEffect, useRef, useSyncExternalStore, type ComponentType } from "react";

import { ALIAS_SOURCE_NAME } from "./alias-source.ts";
import type { ComposerPhase } from "./composer-phase.ts";
import {
  matchBareAliasDraft,
  matchPrefixedAliasDraft,
  type AliasConfig,
  type AliasDraftMatch,
  type AliasStore,
} from "./alias-store.ts";

/**
 * The input state this watcher reads; the host publishes more fields.
 *
 * `sending` is part of the union even though the watcher only tests against
 * `plain`: the host freezes the editor while a message waits for acceptance, and
 * an unknown value here would read as a type that no longer describes the host.
 */
export interface AliasInputState {
  readonly draft: string;
  readonly draftRev: number;
  readonly phase: ComposerPhase;
}

/** One session's published input state; a snapshot store. */
export interface AliasInputStore {
  getSnapshot(): AliasInputState;
  subscribe(listener: () => void): () => void;
}

/** Props the overlay slot hands this entry. */
export interface AliasWatcherProps {
  /** Id of the session whose composer is mounted, supplied by the registration inject. */
  readonly sessionId?: string;
}

/** Menu snapshot fields the watcher reads. */
export interface AliasMenuSnapshot {
  readonly open: boolean;
}

/** The controller surface this watcher needs. */
export interface AliasTriggerController {
  readonly menu: { getSnapshot(): AliasMenuSnapshot };
  toggleSource(
    source: string,
    hit: {
      readonly trigger: "/";
      readonly query: string;
      readonly quoted: boolean;
      readonly position: "leading";
      readonly span: { readonly start: number; readonly end: number; readonly draftRev: number };
    },
  ): void;
  dismiss(): void;
  /** Feed one draft/caret change through trigger detection (public track path). */
  track?(
    draft: string,
    caret: number,
    guard: { readonly tier: "plain" },
    draftRev: number,
  ): void;
  /** Let the shipped command source claim the current hit (no-op for skills). */
  onSpace?(): boolean;
}

/** What one watcher needs from the plugin. */
export interface AliasWatcherDeps {
  readonly store: AliasStore;
  /** Shared flag that lets the source serve the watcher's synthetic bare menu. */
  readonly bareMenuOpen: { open: boolean };
  /** Resolve the session's published input store, or undefined while the scope is gone. */
  inputStoreFor(sessionId: string): AliasInputStore | undefined;
  /** Resolve the session's trigger controller, or undefined while the scope is gone. */
  controllerFor(sessionId: string): AliasTriggerController | undefined;
}

/** Stable empty state used before a session store resolves. */
const EMPTY_INPUT_STATE: AliasInputState = { draft: "", draftRev: -1, phase: "plain" };

/** What the watcher remembers about the menu it opened itself. */
interface OpenedMenu {
  readonly draftRev: number;
  readonly spanEnd: number;
}

/**
 * Build the watcher component.
 * @param deps - store and controller resolver.
 * @returns the slot component; it renders nothing.
 */
export function createAliasWatcher(deps: AliasWatcherDeps): ComponentType<AliasWatcherProps> {
  return function AliasWatcher(props: AliasWatcherProps) {
    const config = useSyncExternalStore(deps.store.subscribe, deps.store.getSnapshot, deps.store.getSnapshot);
    const input = props.sessionId === undefined ? undefined : deps.inputStoreFor(props.sessionId);
    const controller = props.sessionId === undefined ? undefined : deps.controllerFor(props.sessionId);
    const current = useSyncExternalStore(
      (listener) => (input === undefined ? () => undefined : input.subscribe(listener)),
      () => (input === undefined ? EMPTY_INPUT_STATE : input.getSnapshot()),
      () => (input === undefined ? EMPTY_INPUT_STATE : input.getSnapshot()),
    );
    const opened = useRef<OpenedMenu | null>(null);

    useEffect(() => {
      const sessionId = props.sessionId;
      if (sessionId === undefined || current.phase !== "plain" || controller === undefined) return;
      const open = controller.menu.getSnapshot().open;
      if (open && opened.current === null) return; // Native menu, not ours.
      const match = draftMatch(config, current.draft);
      if (open) {
        const previous = opened.current;
        if (
          previous !== null &&
          (previous.draftRev !== current.draftRev || previous.spanEnd !== (match?.end ?? -1))
        ) {
          // The pick span is CAS-checked against the current revision. Re-open
          // after the current editor commit so the controller keeps a live span.
          const timer = setTimeout(() => {
            const latestInput = input?.getSnapshot() ?? current;
            const latestController = deps.controllerFor(sessionId);
            if (latestController === undefined || latestInput.phase !== "plain") return;
            opened.current = null;
            latestController.dismiss();
            const latestMatch = draftMatch(deps.store.getSnapshot(), latestInput.draft);
            if (latestMatch === undefined) return;
            deps.bareMenuOpen.open = true;
            toggle(latestController, latestMatch, latestInput.draftRev);
            deps.bareMenuOpen.open = false;
            opened.current = { draftRev: latestInput.draftRev, spanEnd: latestMatch.end };
          }, 80);
          return () => clearTimeout(timer);
        }
        return;
      }
      opened.current = null;
      if (match === undefined) return;
      // The editor publishes the draft before its own `track` call. Opening on
      // the next task lets that call consume the launcher guard, so the panel
      // does not blink closed inside the same keystroke.
      const timer = setTimeout(() => {
        const latestInput = input?.getSnapshot() ?? current;
        const latestController = deps.controllerFor(sessionId);
        if (latestController === undefined || latestInput.phase !== "plain") return;
        if (latestController.menu.getSnapshot().open) return;
        const latestMatch = draftMatch(deps.store.getSnapshot(), latestInput.draft);
        if (latestMatch === undefined) return;
        deps.bareMenuOpen.open = true;
        toggle(latestController, latestMatch, latestInput.draftRev);
        deps.bareMenuOpen.open = false;
        opened.current = { draftRev: latestInput.draftRev, spanEnd: latestMatch.end };
      }, 80);
      return () => clearTimeout(timer);
    }, [config, current.draft, current.draftRev, current.phase, controller, input, props.sessionId]);

    return null;
  };
}

/** Pick the mode-specific matcher for the current preference. */
function draftMatch(config: AliasConfig, draft: string): AliasDraftMatch | undefined {
  return config.prefix ? matchPrefixedAliasDraft(config, draft) : matchBareAliasDraft(config, draft);
}

/** Open the alias group against one synthetic leading span. */
function toggle(controller: AliasTriggerController, match: AliasDraftMatch, draftRev: number): void {
  controller.toggleSource(ALIAS_SOURCE_NAME, {
    trigger: "/",
    query: match.query,
    quoted: false,
    position: "leading",
    span: { start: match.start, end: match.end, draftRev },
  });
}
