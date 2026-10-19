/**
 * The Host half of the skin.
 *
 * It is empty on purpose. Every pixel this skin draws is drawn in the browser:
 * a canvas playing an ascii.rest scene, plus a light or dark colour treatment
 * computed from that scene's own palette. Nothing is stored on disk and nothing
 * is fetched, so there is no artwork to serve and no route to register.
 *
 * A skin still needs a Host half, because the Loader mounts a package on both
 * sides and `main` has to resolve to something.
 */
export function apply(): void {}
