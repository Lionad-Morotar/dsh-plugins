/**
 * Browser-half entry.
 *
 * The build wraps this module's compiled text inside a ModuleLoader factory, so
 * this file only adapts the host's handover points onto `createRuntime` and
 * returns the plugin object.
 *
 * Three handovers happen here because the factory's arguments are gone by the
 * time `apply` runs: the factory's `require` (the only way to reach React,
 * React DOM and the host's UI primitives — all platform modules, never
 * dependencies of this package), the device platform, and this plugin's config,
 * which Cordis passes as `apply`'s second argument.
 */

import type { ClientContext } from "./dsh.ts";
import type { PanelDomSlice, PanelPrimitives, ReactSlice } from "./react.ts";
import { createRuntime, type PanelConfig, type PanelPlatform } from "./runtime.ts";

type ModuleRequire = (specifier: string) => unknown;

/** The factory's require, captured at boot because apply never sees it. */
let loaderRequire: ModuleRequire | null = null;

/** Module ids the host seeds; anything else must not be required at runtime. */
export const PLATFORM_REACT = "react";
export const PLATFORM_REACT_DOM = "react-dom";
export const PLATFORM_PRIMITIVES = "@deepseek-ai/dsh-client-ui-primitives";

/**
 * Map `navigator.platform` onto the host's device vocabulary.
 *
 * @param value - the platform string (for example `MacIntel`).
 * @returns the linearised platform used by shortcut defaults and claims.
 */
export function detectPlatform(value: string): PanelPlatform {
  const platform = value.toLowerCase();
  if (platform.includes("mac")) return "macos";
  if (platform.includes("win")) return "windows";
  return "linux";
}

function requireModule(specifier: string): Record<string, unknown> | null {
  if (loaderRequire === null) return null;
  const loaded = loaderRequire(specifier);
  return loaded === undefined || loaded === null ? null : (loaded as Record<string, unknown>);
}

function resolveReact(): ReactSlice | null {
  const React = requireModule(PLATFORM_REACT);
  if (React === null) return null;
  for (const name of [
    "createElement",
    "useState",
    "useEffect",
    "useMemo",
    "useRef",
    "useSyncExternalStore",
  ] as const) {
    if (typeof React[name] !== "function") return null;
  }
  return React as unknown as ReactSlice;
}

function resolveDom(): PanelDomSlice | null {
  const reactDom = requireModule(PLATFORM_REACT_DOM);
  return reactDom !== null && typeof reactDom.createPortal === "function"
    ? (reactDom as unknown as PanelDomSlice)
    : null;
}

function resolvePrimitives(): PanelPrimitives | null {
  const primitives = requireModule(PLATFORM_PRIMITIVES);
  if (primitives === null) return null;
  if (typeof primitives.useModalLayer !== "function") return null;
  if (typeof primitives.observeComposition !== "function") return null;
  return primitives as unknown as PanelPrimitives;
}

/** Services the plugin reads; Cordis resolves them before `apply` runs. */
export const inject = [
  "slots",
  "shortcuts",
  "sessions",
  "workspaces",
  "uiWorkspace",
  "conversation",
  "remote",
  "remote.fileReferences",
  "remote.commands",
  "locale",
] as const;

/**
 * The object the loader factory returns; the shape mirrors the host half.
 *
 * `inject` is declared, not empty: Cordis hands out a guarded property for
 * services a plugin did not ask for, so `ctx.remote` throws on first member
 * access instead of answering undefined. Declaring the list is therefore what
 * makes the Remote namespaces legal to read at all, not an ordering hint.
 */
export const clientPlugin = {
  name: "dsh-command-panel",
  inject: inject as unknown as string[],

  apply(ctx: unknown, config?: PanelConfig): () => void {
    const React = resolveReact();
    const dom = resolveDom();
    const primitives = resolvePrimitives();
    if (React === null || dom === null || primitives === null) {
      // A host without the platform modules cannot render this panel at all;
      // saying so once beats a half-mounted palette that throws on first open.
      console.warn("[dsh-command-panel] missing platform modules; panel disabled");
      return () => undefined;
    }

    const runtime = createRuntime({
      ctx: ctx as ClientContext,
      React,
      dom,
      primitives,
      platform: detectPlatform(globalThis.navigator?.platform ?? ""),
      config,
    });
    return () => runtime.dispose();
  },
};

/**
 * Hand the factory's `require` to the plugin.
 *
 * The build calls `module.exports.boot(require)` inside the factory, so this must
 * be a top-level export rather than a method on the plugin object: the loader
 * keeps `{name, inject, apply}` and drops the rest.
 */
export function boot(require: ModuleRequire): void {
  loaderRequire = require;
}

export default clientPlugin;
