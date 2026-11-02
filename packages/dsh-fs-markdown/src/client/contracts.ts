/**
 * The slice of the file explorer's renderer registry this plugin is written
 * against.
 *
 * It is copied structurally instead of imported: the explorer publishes no
 * TypeScript declarations for its client half, and importing its `lib/` would
 * tie this package to a build artifact rather than a contract. The shapes come
 * from `src/client/renderer-registry.ts` in `dsh-fs-explorer`.
 */
import type { ComponentType } from "react";

import type { Translate } from "./copy.ts";

/** The two body modes the pane switches between. */
export type RendererMode = "reading" | "source";

/** What the pane hands one renderer's body. */
export interface RendererBodyProps {
  readonly path: string;
  readonly sessionId?: string;
  /**
   * Whether this panel is the active one.
   *
   * The workbench keeps every open panel mounted and hides the inactive ones,
   * so a body cannot tell from its own box that nobody is looking at it.
   * Absent means visible.
   */
  readonly visible?: boolean;
  readonly mode: RendererMode;
  /** The explorer's translator; this plugin ships its own dictionary. */
  readonly t: Translate;
}

/** What one contribution's `load()` resolves to. */
export interface RendererModule {
  readonly Body: ComponentType<RendererBodyProps>;
  /** Diagnostic marker for the pane's `data-renderer` attribute. */
  readonly renderer?: string;
}

/** The metadata a renderer declares so selection stays synchronous. */
export interface RendererContribution {
  /** Stable identity; a second registration of the same id is refused. */
  readonly id: string;
  readonly label: string;
  readonly match: { readonly extensions?: readonly string[] };
  /** Larger wins; ties break on id. */
  readonly priority?: number;
  load(): Promise<RendererModule>;
}

/** The service the explorer provides to renderer plugins. */
export interface FsExplorerService {
  registerRenderer(contribution: RendererContribution): () => void;
}
