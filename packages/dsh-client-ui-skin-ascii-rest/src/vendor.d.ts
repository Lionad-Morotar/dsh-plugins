/**
 * Assets the build folds into the bundle as text.
 *
 * lil-gui's stylesheet is imported this way rather than through its own
 * `injectStyles` option, so the module loader owns the `<style>` element and
 * removes it with the rest of the plugin's CSS on teardown.
 */
declare module "*.css" {
  const text: string;
  export default text;
}
