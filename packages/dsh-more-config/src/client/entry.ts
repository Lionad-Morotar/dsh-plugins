/**
 * Browser-half entry.
 *
 * Registers one section in the settings nav: the MCP timeout panel over this
 * package's own `more-config` namespace. Everything the platform owns — React
 * never imported here, the primitive kit and the configForms scope — is
 * resolved through the factory's `require` and injected as plain values, so the
 * bundle ships no second React and breaks no hooks.
 *
 * Partial availability is a hard no: a section without its form frame or its
 * value field cannot render honestly, so the entry registers nothing and the
 * settings page simply never shows an MCP section — better absent than broken.
 */
import { createTimeoutsStore, type ScopeLike } from "./store.ts";
import { createSection, type SectionKit, type Translate } from "./section.tsx";
import { EN, ZH } from "./copy.ts";
import { LOCALE_NAMESPACE, SECTION_ID, SECTION_ORDER, SECTION_SLOT, SETTINGS_NAMESPACE } from "./registration.ts";

type ModuleRequire = (specifier: string) => unknown;

/** The factory's require, captured at boot because apply never sees it. */
let loaderRequire: ModuleRequire | null = null;

/** The services the registration reads; declared so Cordis resolves them first. */
export const inject = ["slots", "locale", "configForms"];

/** The slice of the client context this entry uses. */
export interface ClientContextLike {
  readonly slots: {
    inject(slot: string, factory: () => () => void): void;
    register(options: Record<string, unknown>, component: unknown): () => void;
  };
  readonly locale: {
    register(namespace: string, dictionaries: Record<string, Record<string, string>>): () => void;
    bind(namespace: string): Translate;
  };
  readonly configForms?: { get(namespace: string): ScopeLike | undefined };
}

/** A function component, or a forwardRef exotic component object. */
function isKitComponent(value: unknown): boolean {
  if (typeof value === "function") return true;
  return typeof value === "object" && value !== null && typeof (value as { $$typeof?: unknown }).$$typeof === "symbol";
}

/*
 * The seed table ships Button and Input as forwardRef exotic components:
 * runtime objects marked with $$typeof, callable as JSX element types but not
 * typeof "function". The check above admits both; the casts below are the
 * static seam where the object form meets the JSX-facing ComponentType.
 */

/**
 * Resolve the platform kit through the loader.
 *
 * @returns the kit, or undefined when any member is missing.
 */
export function resolveKit(require: ModuleRequire | null): SectionKit | undefined {
  if (require === null) return undefined;
  const primitives = require("@deepseek-ai/dsh-client-ui-primitives") as Record<string, unknown> | undefined;
  const SettingsForm = primitives?.SettingsForm;
  const Button = primitives?.Button;
  const Input = primitives?.Input;
  if (!isKitComponent(SettingsForm)) return undefined;
  if (!isKitComponent(Button)) return undefined;
  if (!isKitComponent(Input)) return undefined;
  return {
    SettingsForm: SettingsForm as SectionKit["SettingsForm"],
    Button: Button as unknown as SectionKit["Button"],
    Input: Input as unknown as SectionKit["Input"],
  };
}

/**
 * Mount the MCP settings section.
 * @param ctx - client root context.
 * @returns the disposer releasing the dictionary and the store subscription.
 */
/** Disposer of the dictionary currently sitting in the host's locale table.
* Module-level on purpose: a repeat apply on one host process (the desktop
* sync pass followed by the mount pass) meets the same table, and the table
* refuses a second registration outright. Dropping ours first turns that
* would-be throw into a plain replacement — the disposer deletes by dictionary
* identity, so the module-singleton dictionaries are always removable by the
* very disposer that registered them. */
let registeredDictionaries: (() => void) | undefined;

export function apply(ctx: ClientContextLike): () => void {
  const kit = resolveKit(loaderRequire);
  if (kit === undefined) return () => {};
  const t = ctx.locale.bind(LOCALE_NAMESPACE);
  registeredDictionaries?.();
  const offLocale = ctx.locale.register(LOCALE_NAMESPACE, { zh: ZH, en: EN });
  registeredDictionaries = offLocale;
  // A namespace the host does not serve (plugin absent, profile without the
  // row) surfaces as a scope whose status is not "ready"; get() throwing is
  // treated the same way, leaving the store's unavailable banner to render.
  let scope: ScopeLike | undefined;
  try {
    scope = ctx.configForms?.get(SETTINGS_NAMESPACE);
  } catch {
    scope = undefined;
  }
  const store = createTimeoutsStore(scope);
  const section = createSection({ store, t, kit });
  ctx.slots.inject(SECTION_SLOT, () =>
    ctx.slots.register(
      {
        name: SECTION_SLOT,
        id: SECTION_ID,
        order: SECTION_ORDER,
        label: () => t("nav.title"),
        locale: LOCALE_NAMESPACE,
      },
      section,
    ),
  );
  return () => {
    store.dispose();
    offLocale();
    if (registeredDictionaries === offLocale) registeredDictionaries = undefined;
  };
}

/** Hand the factory's require to the plugin. */
export function boot(require: ModuleRequire): void {
  loaderRequire = require;
}

/** The plugin object the loader mounts. */
export const clientPlugin = { name: "dsh-more-config", inject, apply };

export default clientPlugin;
