/**
 * Ship the board's stylesheet minified without making the source unreadable.
 *
 * The CSS lives in `src/client/styles.css` with its comments and line breaks
 * intact, because that is the copy a person edits. esbuild cannot minify a
 * template literal, and the startup bundle is the one artifact every page pays
 * for, so the stylesheet is imported as text and squeezed here instead.
 *
 * Both `build.mjs` and `preview.mjs` bundle a tree that imports it, so the
 * plugin lives in one place rather than being spelled twice.
 */

/**
 * Strip comments and collapse whitespace in a stylesheet.
 *
 * Deliberately not a general CSS minifier: it removes comments, collapses runs
 * of whitespace and drops the space around the punctuation that never needs it.
 * It does not touch values, selectors or at-rules, so a rule that survives
 * minification is the same rule the source declares.
 * @param css - the stylesheet text.
 * @returns the minified text.
 */
export function minifyCss(css) {
  return css
    .replace(/\/\*[\s\S]*?\*\//gu, "")
    .replace(/\s+/gu, " ")
    .replace(/\s*([{};:,>~+])\s*/gu, "$1")
    .replace(/;\}/gu, "}")
    // A declaration that is the last in its block needs no terminator, and the
    // space after a comma in a selector list is never significant.
    .replace(/\s*\{\s*/gu, "{")
    .replace(/\s*\}/gu, "}")
    .trim();
}

/**
 * An esbuild plugin that inlines `.css` imports as minified text.
 *
 * The import resolves to a module whose default export is the stylesheet
 * string, which is what `styles.ts` binds to. `resolveDir` is taken from the
 * importer so a relative specifier keeps working from any depth.
 * @returns the esbuild plugin object.
 */
export function cssTextPlugin() {
  return {
    name: "css-text",
    setup(build) {
      build.onResolve({ filter: /\.css$/ }, args => ({
        path: args.path.startsWith(".") ? new URL(args.path, `file://${args.resolveDir}/`).pathname : args.path,
        namespace: "css-text",
      }));
      build.onLoad({ filter: /.*/, namespace: "css-text" }, async args => {
        const { readFile } = await import("node:fs/promises");
        const text = await readFile(args.path, "utf8");
        return {
          contents: `export default ${JSON.stringify(minifyCss(text))};`,
          loader: "js",
        };
      });
    },
  };
}
