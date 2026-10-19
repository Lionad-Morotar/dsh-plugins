/**
 * What the Harness Client hands a plugin, narrowed to the parts this skin uses.
 *
 * A plugin's `apply` receives one argument: the Cordis context. Everything else
 * is reached through it, and React arrives through the module loader rather than
 * through the context. That split is not a detail: a dynamic Client half gets
 * an object with React and a styles inserter on it, while an installed package
 * such as this skin gets a plain context, and mixing the two is a boot failure
 * rather than a quiet no-op.
 *
 * The full types live in the harness packages, which a skin must not depend on:
 * it has to load in any profile that installs it, including one where the SDK
 * was never installed. Declaring the shape here keeps the contract explicit and
 * keeps the package free of a build-time dependency it cannot satisfy.
 *
 * Everything is structural, so a host that grows a field does not break this and
 * a host that renames one fails loudly at the call site rather than silently
 * rendering nothing.
 */

/** The effect body `slots.inject` takes: it runs on activation and returns cleanup. */
export type SlotInjectionEffect = () => void | (() => void);

/** A `settings.section` registration: the host renders one page per entry. */
export interface SlotRegistration {
  name: "settings.section";
  id: string;
  order?: number;
  label?: string | (() => string);
}

export interface SlotsService {
  /**
   * Run a registration once the slot exists, and again after it is re-created.
   *
   * Registering eagerly would bind to a slot instance that the host may later
   * replace; this is the reason the manager and every shipped skin go through
   * `inject` rather than calling `register` directly.
   */
  inject(key: string, callback: () => SlotInjectionEffect): () => void;
  register(registration: SlotRegistration, component: unknown): () => void;
}

/** `overrideTokens` takes one value per colour scheme and layers over the base theme. */
export type ThemeTokenOverrides = Record<string, { light: string; dark: string }>;

export interface ThemeSnapshot {
  /** "light" or "dark": the scheme the host is actually painting. */
  active: string;
  /** "light", "dark" or "system": what the reader chose. */
  preference: string;
}

export interface ThemeService {
  /** Layer a token override over the active theme; the disposer restores it. */
  overrideTokens(source: string, tokens: ThemeTokenOverrides): () => void;
  getTheme(): ThemeSnapshot;
}

export interface LocaleSnapshot {
  /** The BCP 47 tag of the active language, e.g. "zh-CN" or "en". */
  active: string;
}

export interface LocaleService {
  register(namespace: string, dictionaries: { zh: Record<string, string>; en: Record<string, string> }): () => void;
  getSnapshot(): LocaleSnapshot;
}

/**
 * The Cordis context an installed plugin's `apply` receives.
 *
 * Only the members this skin reaches for are declared. `get` is how an optional
 * service is taken: the slot and theme services are declared in `inject` because
 * the skin has nothing to show without them, while the locale service is looked
 * up because the page has its own Chinese copy and must survive its absence.
 */
export interface ClientContext {
  /** Run `execute` now and its returned disposer when the plugin unloads. */
  effect(execute: () => void | (() => void), label?: string): void;
  /** Look a service up; undefined when nothing provides it. */
  get<T>(name: string): T | undefined;
  /** Subscribe to a context event; returns the unsubscribe. */
  on(name: string, listener: (...args: unknown[]) => void): () => void;
}

/** The `require` a plugin factory receives, with the chunk loader attached. */
export interface ModuleRequire {
  (specifier: string): unknown;
  async(specifier: string): Promise<unknown>;
}
