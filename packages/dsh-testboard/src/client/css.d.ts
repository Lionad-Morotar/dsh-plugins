/**
 * The stylesheet is imported as text, not as a module with side effects.
 *
 * `scripts/css-plugin.mjs` resolves `.css` imports to a module whose default
 * export is the minified stylesheet string, so the type has to say so; without
 * this declaration the import is a module-not-found error for the checker.
 */
declare module "*.css" {
  const css: string;
  export default css;
}
