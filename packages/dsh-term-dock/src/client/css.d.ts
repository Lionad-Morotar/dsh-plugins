/**
 * Stylesheets are bundled as text.
 *
 * `scripts/build.mjs` maps `.css` to esbuild's `text` loader, so the import below
 * evaluates to the file's contents as a string and the chunk can inject it into a
 * single `<style>` tag it owns.
 */
declare module "*.css" {
  const text: string;
  export default text;
}
