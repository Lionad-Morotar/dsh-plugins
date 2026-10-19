/**
 * The bundle's factory-facing half.
 *
 * The build wraps this module's exports in the loader's `{id, factory}` shape
 * and calls `boot(require)` first. Splitting boot from `apply` is what keeps the
 * loader's `require` out of module scope: the bundle's top level has already run
 * by the time the factory hands its `require` over, so anything resolved there
 * would be resolved too early.
 *
 * `apply` itself takes only the Cordis context, which is what the Harness calls
 * an installed plugin's `apply` with. React and chunk loading come from the
 * loader instead, because the context does not carry them.
 */
import { apply, inject } from "./app.ts";
import { installLoader, type LoaderRequire } from "./loader.ts";

export { apply, inject };

/** Hand the factory's `require` to everything that resolves through it. */
export function boot(require: LoaderRequire): void {
  installLoader(require);
}
