/**
 * The one lazy route this package owns.
 *
 * xterm plus FitAddon are roughly half a megabyte of minified code. The dock is a
 * root surface registered on every page boot, so the heavy half lives in a
 * package-local chunk that is fetched the first time a terminal panel mounts.
 *
 * The loader's `require.async` is the only way to reach a sibling file: it
 * resolves a relative specifier against this package's own bundle URL and puts
 * the result under `<package>/<file>` in the module table. That `require` is
 * handed to the factory after the module body has run (`boot`), which is why it is
 * captured here instead of imported.
 *
 * The route record is exported so the chunk name is data rather than a string
 * literals scattered across the entry: `scripts/build.mjs` asserts the built
 * entry still names the file it emitted.
 */
import type { ComponentType } from "react";

import type { TerminalScreenProps } from "./terminal-screen-contract.ts";
import { PACKAGE_NAME, TERMINAL_CHUNK } from "../shared.ts";

/** The `require` the ModuleLoader factory receives. */
export interface LoaderRequire {
  (specifier: string): unknown;
  /** Fetch a package-local chunk; the specifier must be `./<file>`. */
  async(specifier: string): Promise<unknown>;
}

/** Everything the chunk exports. */
export interface TerminalChunkModule {
  readonly TerminalScreen: ComponentType<TerminalScreenProps>;
}

/** One package-local chunk, named once. */
export interface TerminalChunkRoute {
  readonly chunk: string;
  readonly id: string;
}

const ROUTE: TerminalChunkRoute = Object.freeze({
  chunk: TERMINAL_CHUNK.chunk,
  id: `${PACKAGE_NAME}/${TERMINAL_CHUNK.chunk}`,
});

let loaderRequire: LoaderRequire | null = null;
let pending: Promise<TerminalChunkModule> | null = null;

/**
 * Take the loader require from the factory.
 *
 * Called by the build wrapper right after the module body, which is the only
 * point where the loader's `require` is reachable.
 * @param require - the factory's require, with `async` attached.
 */
export function boot(require: LoaderRequire): void {
  loaderRequire = require;
}

/**
 * The chunk this package fetches, for diagnostics and for the build assertion.
 * @returns the route record.
 */
export function terminalChunkRoute(): TerminalChunkRoute {
  return ROUTE;
}

/**
 * Resolve the terminal renderer chunk.
 *
 * The resolved promise is cached; a rejected one is not, because a chunk that
 * failed once (a load racing the boot hand-over, a transient 404) must be
 * retryable rather than failing every later panel for the life of the page.
 * @returns the chunk module.
 */
export function loadTerminalChunk(): Promise<TerminalChunkModule> {
  if (pending !== null) return pending;
  const active = loaderRequire;
  if (active === null) {
    return Promise.reject(new Error(`${PACKAGE_NAME}: the loader require was not handed over`));
  }
  const request = active.async(`./${ROUTE.chunk}`).then(module => {
    const chunk = module as Partial<TerminalChunkModule> | null;
    if (chunk === null || typeof chunk.TerminalScreen !== "function") {
      throw new Error(`${PACKAGE_NAME}: chunk ${ROUTE.id} is missing TerminalScreen`);
    }
    return chunk as TerminalChunkModule;
  });
  pending = request;
  request.catch(() => {
    if (pending === request) pending = null;
  });
  return request;
}
