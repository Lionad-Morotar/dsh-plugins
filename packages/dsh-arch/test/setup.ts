/**
 * jsdom environment shim.
 *
 * Node 26 ships `localStorage`/`sessionStorage` as globals. Without
 * `--localstorage-file` the localStorage one is `undefined`, and vitest's
 * `populateGlobal` keeps an existing global over the jsdom window's own
 * property (`if (k in global) return keysArray.includes(k)`), so the test
 * global ends up with Node's `undefined` instead of jsdom's working Storage.
 * `sessionStorage` escapes this only because Node leaves it off the global.
 *
 * The effect is that every `localStorage.clear()` in a jsdom suite throws
 * `Cannot read properties of undefined`, which is an environment artifact and
 * not a product defect. Re-point the global at jsdom's own Storage instance so
 * the suites exercise the real thing.
 */
const scope = globalThis as unknown as Record<string, unknown>;

if (scope.localStorage === undefined && scope._localStorage !== undefined) {
  Object.defineProperty(globalThis, "localStorage", {
    get: () => scope._localStorage,
    configurable: true,
  });
}
