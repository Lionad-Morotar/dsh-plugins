/**
 * Test-only stand-in for the build's `virtual:pdf-worker` module.
 *
 * The real module is produced by `build/pdf-worker-plugin.mjs` during a package
 * build, so it does not exist on disk for a test run to resolve. This file is
 * what the alias in `vitest.config.ts` points at, and it deliberately exports an
 * empty string: a test that mounts the surface must not pay for a 1.2 MB worker
 * it will never spawn, and jsdom has no `Worker` for it to spawn anyway.
 *
 * The inlined payload's presence in the shipped chunk is asserted by the build
 * itself, which is the only place it can be checked honestly.
 */
export const workerSource = "";
