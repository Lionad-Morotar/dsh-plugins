/**
 * The "focus the message input" command.
 *
 * Why a declared host command instead of a private keydown listener: the host
 * already owns keybinding state. `ctx.shortcuts` keeps one catalog that the
 * settings dialog renders and edits, validates every default against each
 * device profile, reports conflicts with the host's own commands, and persists
 * user overrides per device. A listener here would be a second, invisible
 * keymap: unbindable, unsearchable in 设置 → 快捷键, and blind to every other
 * plugin's chords.
 *
 * So the chord is declared, not captured, and this module only answers what the
 * chord should do when the service dispatches it.
 *
 * The one seam that is *not* a service: focusing the editor. The conversation
 * package exposes `conversation.input.for(sessionScope).focus()`, which rides
 * Lexical's own focus so the caret returns to where the draft left it (a bare
 * DOM focus would land at the start). Reaching it needs a retained session
 * scope, which is why every decision below is a "can I do this right now" probe
 * rather than a mount-time assumption.
 */
/** The client-context slice focusing needs; deliberately narrower than the entry's. */
export interface FocusContextLike {
  readonly sessions?: { scope?(sessionId: string): unknown };
}

/** The host profile keys a command declares defaults for; an omitted profile stays unbound. */
export type FocusProfile =
  | "desktop:macos"
  | "desktop:windows"
  | "desktop:linux"
  | "web:macos"
  | "web:windows"
  | "web:linux";

/** Logical modifier; `primary` expands to Command on macOS and Control elsewhere. */
export type FocusModifier = "primary" | "control" | "alt" | "shift" | "meta";

/** One physical key combination, in the host's declaration shape. */
export interface FocusBinding {
  /** `KeyboardEvent.code`, e.g. `Space`. */
  readonly code: string;
  readonly modifiers: readonly FocusModifier[];
}

/**
 * Stable command id.
 *
 * Namespaced by product so the settings catalog sorts it after the host's own
 * commands and a user override survives this plugin being uninstalled and
 * reinstalled. The shape satisfies the host's `commandPattern`
 * (`segment.segment`, lower-case start, dots required).
 */
export const FOCUS_COMMAND_ID = "better.focusComposer";

/** Search terms the settings dialog matches besides the localized label. */
export const FOCUS_ALIASES: readonly string[] = Object.freeze([
  "focus input",
  "focus composer",
  "message input",
]);

/**
 * Message key of the command label.
 *
 * Read by the shortcut catalog on every refresh, outside any React tree, so the
 * dictionary that answers it is a separate module and the key is shared rather
 * than spelled twice.
 */
export const FOCUS_LABEL_KEY = "command.focusComposer";

/**
 * Input owners the chord fires from.
 *
 * `terminal` is deliberate: the point of the chord is to get back to typing
 * after working somewhere else, and a terminal that swallowed it would be the
 * one place it is most wanted. Desktop macOS/Windows ignores this list (the
 * native bridge outranks local regions), so it only steers the web shell.
 */
export const FOCUS_REGIONS: readonly string[] = Object.freeze(["page", "editable", "terminal"]);

/**
 * The shipped defaults, one per profile the host can carry.
 *
 * `desktop:macos` gets ⌘Space because the desktop shell intercepts accepted
 * combinations before any local handler, so the chord cannot be stolen from the
 * editor. The remaining profiles are chosen by what the host admits, not by
 * taste: it reserves `Space` for web and for Linux outright (`reserved`), so a
 * ⌘Space default there would throw at registration time and take the whole
 * catalog down. Web therefore takes the admissible two-modifier form, and Linux
 * stays unbound — a user on Linux can bind any chord the settings recorder
 * accepts, which is better than shipping one the host refuses to carry.
 */
export const FOCUS_DEFAULTS: Readonly<Partial<Record<FocusProfile, FocusBinding>>> = Object.freeze({
  "desktop:macos": { code: "Space", modifiers: ["primary"] },
  "desktop:windows": { code: "Space", modifiers: ["primary", "shift"] },
  "web:macos": { code: "Space", modifiers: ["primary", "shift"] },
  "web:windows": { code: "Space", modifiers: ["primary", "shift"] },
});

/**
 * The composer's editable host.
 *
 * Two attributes for the same div, deliberately: `data-composer-input` is the
 * marker the conversation shell puts on its contenteditable, and the structural
 * pair is what makes that div a textbox at all. Reading both means a host that
 * renames one attribute does not silently turn this command into a no-op.
 */
export const COMPOSER_SELECTOR = "[data-composer-input], [role='textbox'][aria-multiline='true']";

/** The one DOM call this module needs; a real `Document` satisfies it. */
export interface ComposerDocumentLike {
  querySelector(selector: string): unknown;
}

/**
 * Whether the composer is on screen.
 *
 * The conversation surface is one view among several, so the composer is
 * genuinely unmounted while the user works in another view. This is the probe
 * that keeps the chord from being swallowed by a no-op in that state.
 * @param doc - the product document, or undefined outside a browser.
 * @returns true when the editable host is mounted.
 */
export function composerMounted(doc: ComposerDocumentLike | undefined): boolean {
  if (doc === undefined || typeof doc.querySelector !== "function") return false;
  return doc.querySelector(COMPOSER_SELECTOR) != null;
}

/** An observable store read without subscribing; the host publishes both shapes. */
interface ObservableLike<T> {
  getSnapshot?(): T | undefined;
}

/** `uiSession.adapter.current` — the authoritative "which conversation is in front". */
interface UiSessionFace {
  adapter?: { current?: ObservableLike<{ readonly key?: string | undefined }> };
}

/** `sessions.list` — the pre-0.2.0 host shape, kept as a fallback. */
interface SessionsFace {
  list?: ObservableLike<{ readonly current?: string | undefined }>;
}

/** A host service read on every call, never captured as a hard dependency. */
function readHostService(ctx: unknown, name: string): unknown {
  if (ctx === null || typeof ctx !== "object") return undefined;
  const getter = (ctx as { get?: unknown }).get;
  // Cordis's `get` is the non-throwing resolver and works without declaring the
  // service in `inject`; a property read on a real context throws for exactly
  // that reason. Only contexts without `get` (the plain objects unit tests use)
  // are read directly.
  if (typeof getter === "function") {
    const value = (getter as (this: unknown, key: string) => unknown).call(ctx, name);
    return value === null ? undefined : value;
  }
  return (ctx as Record<string, unknown>)[name];
}

const nonEmpty = (value: unknown): string | undefined =>
  typeof value === "string" && value !== "" ? value : undefined;

/**
 * Read the session the user is currently looking at.
 *
 * Same precedence the host itself uses: the mounted `uiSession` selection is
 * authoritative (a present store with no key means "no conversation", not "pick
 * another retained session"), and `sessions.list.current` is the older shape.
 * Nothing here falls back to a background session: focusing an input the user
 * cannot see would be worse than doing nothing.
 * @param ctx - the client context.
 * @returns the session id, or undefined when no conversation is active.
 */
export function readCurrentSessionId(ctx: unknown): string | undefined {
  const uiSession = readHostService(ctx, "uiSession") as UiSessionFace | undefined;
  const selection = uiSession?.adapter?.current?.getSnapshot?.();
  if (selection !== undefined) return nonEmpty(selection.key);
  const sessions = readHostService(ctx, "sessions") as SessionsFace | undefined;
  return nonEmpty(sessions?.list?.getSnapshot?.()?.current);
}

/** The session-scope face the composer focus needs. */
export interface ConversationInputFace {
  input?: { for?(scope: unknown): { focus?(): void } | undefined };
}

/**
 * Focus the composer of one session.
 *
 * Every step is allowed to be absent: the host may have torn the session scope
 * down between the key press and this call, the conversation service may not be
 * mounted at all, and `input.for` throws for a scope it no longer retains. None
 * of those is worth an exception on a keystroke path, so each failure reports
 * "did not land" and the caller stays quiet.
 * @param ctx - the client context.
 * @param sessionId - session whose composer should take the keyboard.
 * @returns whether a focus was delivered.
 */
export function focusComposerFor(ctx: FocusContextLike, sessionId: string): boolean {
  try {
    const actx = ctx.sessions?.scope?.(sessionId);
    if (actx === undefined) return false;
    const conversation = readHostService(actx, "conversation") as ConversationInputFace | undefined;
    const input = conversation?.input?.for?.(actx);
    if (input === undefined || typeof input.focus !== "function") return false;
    input.focus();
    return true;
  } catch {
    return false;
  }
}

/** What the host passes the resolver when it dispatches a chord. */
export interface FocusResolveContext {
  /** Id of the open modal layer, or null when none is open. */
  readonly modal?: string | null;
}

/** The three answers the host accepts from a command resolver. */
export type FocusResolution = { readonly status: "handled"; run(): void } | { readonly status: "pass" };

/** The host facts the decision reads; injected so the decision is testable without a host. */
export interface FocusCommandDeps {
  /** The session the user is looking at, or undefined. */
  currentSessionId(): string | undefined;
  /** Whether the composer's editable host is mounted. */
  composerMounted(): boolean;
  /** Focus one session's composer; false when the seam could not deliver. */
  focusComposer(sessionId: string): boolean;
}

/**
 * Build the resolver the shortcut service calls.
 *
 * Three refusals, each answering `pass` rather than `blocked`: an unhandled
 * chord keeps whatever meaning the surface in front gives it, while a consumed
 * one would vanish. `pass` is also what keeps ⌘Space usable inside a dialog —
 * the service skips its own modal check on macOS/Windows desktop (the native
 * bridge outranks modal controls), so that guard has to live here or the chord
 * would pull focus out of a settings search field.
 * @param deps - host facts, read fresh on every dispatch.
 * @returns the resolver.
 */
export function createFocusResolver(deps: FocusCommandDeps) {
  return (context: FocusResolveContext = {}): FocusResolution => {
    if (context.modal != null) return { status: "pass" };
    if (!deps.composerMounted()) return { status: "pass" };
    const sessionId = deps.currentSessionId();
    if (sessionId === undefined) return { status: "pass" };
    return {
      status: "handled",
      run: () => {
        deps.focusComposer(sessionId);
      },
    };
  };
}

/** One command registration; structurally the client shortcut service. */
export interface FocusCommandRegistration {
  readonly id: string;
  readonly label: () => string;
  readonly aliases: readonly string[];
  readonly defaults: Readonly<Partial<Record<FocusProfile, FocusBinding>>>;
  readonly regions: readonly string[];
  readonly modals: readonly string[];
  resolve(context: FocusResolveContext): FocusResolution;
}

/** The registry slice this module needs. */
export interface ShortcutRegistryLike {
  register(command: FocusCommandRegistration): () => void;
}

/**
 * Build the command definition the host registers.
 *
 * `modals: []` states the same intent as the resolver's first refusal, for the
 * web shell, which honors it without running the resolver.
 * @param deps - host facts for the resolver.
 * @param label - localized command label.
 * @returns the registration payload.
 */
export function focusCommandSpec(
  deps: FocusCommandDeps,
  label: () => string,
): FocusCommandRegistration {
  return {
    id: FOCUS_COMMAND_ID,
    label,
    aliases: FOCUS_ALIASES,
    defaults: FOCUS_DEFAULTS,
    regions: FOCUS_REGIONS,
    modals: [],
    resolve: createFocusResolver(deps),
  };
}

/**
 * Register the command, best-effort.
 *
 * A rejected registration must not take the picker down with it: this package's
 * other half shadows the `/model` list slot, and one host that reserves `Space`
 * differently would otherwise leave the user with no picker and no explanation.
 * @param shortcuts - host shortcut service, or undefined outside a capable host.
 * @param deps - host facts for the resolver.
 * @param label - localized command label.
 * @param onError - called with the rejection reason, when the host gives one.
 * @returns a disposer releasing the registration.
 */
export function registerFocusCommand(
  shortcuts: ShortcutRegistryLike | undefined,
  deps: FocusCommandDeps,
  label: () => string,
  onError?: (message: string) => void,
): () => void {
  if (shortcuts === undefined || typeof shortcuts.register !== "function") return () => {};
  try {
    return shortcuts.register(focusCommandSpec(deps, label));
  } catch (error) {
    onError?.(error instanceof Error ? error.message : String(error));
    return () => {};
  }
}
