/**
 * The seam between the board and its lazily loaded code view.
 *
 * The types live here rather than in the chunk so the startup half can name the
 * editor's shape without importing CodeMirror: TypeScript erases the import at
 * build time, which is exactly what keeps the editor out of `lib/client.js`.
 */
import type { ComponentType } from "react";

/** Props the code view takes. */
export interface CodeViewProps {
  /** The file's full source text. */
  readonly text: string;
  /** Repo-relative test path; decides which grammar the view installs. */
  readonly path: string;
  /** 1-based line to mark and reveal, when a case is selected. */
  readonly activeLine?: number;
  readonly theme: "dark" | "light";
}

/** Everything the editor chunk exports. */
export interface EditorChunkModule {
  /** Diagnostic marker; asserted by the build and read by the loader. */
  readonly renderer: "codemirror";
  readonly CodeView: ComponentType<CodeViewProps>;
}
