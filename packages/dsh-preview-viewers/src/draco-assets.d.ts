/**
 * Build-time virtual module carrying the Draco decoder.
 *
 * The decoder cannot be fetched at runtime: three's DRACOLoader resolves it
 * through `new URL(..., import.meta.url)`, and a plugin's chunks are served from
 * a versioned route with no file layout to resolve against. The consuming
 * package's build provides this module's contents (see build/draco-plugin.mjs)
 * from the same three payloads it bundles, so the shipped chunk carries the exact
 * decoder version it was built with.
 *
 * The declaration enters a program through the reference directive in the chunk
 * that imports the module, not through an `include` pattern here: a consumer
 * compiling that chunk under its own tsconfig never lists this directory.
 */
declare module "virtual:draco-assets" {
  /** The wasm decoder's JavaScript side (`draco_wasm_wrapper.js`). */
  export const wasmWrapper: string;
  /** The compiled wasm decoder (`draco_decoder.wasm`). */
  export const wasmBinary: Uint8Array;
}
