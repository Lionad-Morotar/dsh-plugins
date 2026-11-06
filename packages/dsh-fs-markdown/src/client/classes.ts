/**
 * The planner vocabulary as the class names the stylesheet defines.
 *
 * Two renderers consume the planner: CodeMirror maps a range to a mark, and the
 * table widget paints a cell as DOM. They must agree on the class, so the
 * mapping lives in one module rather than in each renderer.
 */
import type { DecorationStyle } from "./decorations.ts";

export const CLASS_NAMES: Readonly<Record<DecorationStyle, string>> = {
  heading1: "fmd-h1",
  heading2: "fmd-h2",
  heading3: "fmd-h3",
  heading4: "fmd-h4",
  heading5: "fmd-h5",
  heading6: "fmd-h6",
  strong: "fmd-strong",
  em: "fmd-em",
  code: "fmd-code",
  link: "fmd-link",
  quote: "fmd-quote",
  "list-marker": "fmd-list-marker",
  "code-block": "fmd-code-block",
};
