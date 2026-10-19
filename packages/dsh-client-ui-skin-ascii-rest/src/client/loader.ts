/**
 * The loader's `require`, carried from the factory to the modules that need it.
 *
 * The Harness materialises a plugin by calling the factory it registered and
 * giving it a `require`; the module table resolves platform seeds (React, the
 * UI packages) and `.async` fetches a sibling chunk. A Cordis plugin's `apply`
 * only ever receives a context, so the factory's `require` is handed over here
 * once, before `apply` runs.
 *
 * Two consequences shape the code below:
 *
 *   - Nothing at module scope may call `getLoader()`. The bundle's top level
 *     runs before `boot`, so a top-level call would find it unset.
 *   - `apply` must not be the only thing that can boot. Boot is separate, so the
 *     same bundle works in a test harness that installs a stub loader.
 */

/** The `require` a plugin factory receives: the module table plus chunk loading. */
export interface LoaderRequire {
  (specifier: string): unknown;
  async(specifier: string): Promise<unknown>;
}

let installed: LoaderRequire | undefined;

/** Remember the factory's `require`. Called once, by {@link boot}. */
export function installLoader(require: LoaderRequire): void {
  installed = require;
}

/** The factory's `require`. Throws outside a materialisation; see the caveat above. */
export function getLoader(): LoaderRequire {
  if (installed === undefined) {
    throw new Error("ascii-rest: the module loader is not installed");
  }
  return installed;
}

/** Whether a loader is available, for code that must degrade instead of throw. */
export function hasLoader(): boolean {
  return installed !== undefined;
}
