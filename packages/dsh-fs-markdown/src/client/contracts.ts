/**
 * The slices of the file explorer this plugin is written against.
 *
 * They are copied structurally instead of imported: the explorer publishes no
 * TypeScript declarations for its client half, and importing its `lib/` would
 * tie this package to a build artifact rather than a contract. The shapes come
 * from `src/client/renderer-registry.ts` and `src/client/document-session.ts`
 * in `dsh-fs-explorer`.
 */
import type { ComponentType } from "react";

import type { Translate } from "./copy.ts";

/** The two body modes the pane switches between. */
export type RendererMode = "reading" | "source";

/** The text page the pane already holds; this renderer reads the whole file. */
export interface RendererPage {
  readonly text: string;
  readonly offset: number;
}

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
  /** Present on the text path; the editor reads the whole document instead. */
  readonly page?: RendererPage;
}

/** What the editor chunk adds to the renderer contract: the live text. */
export interface EditorBodyProps extends RendererBodyProps {
  readonly text: string;
  /** Push one user edit back to the document session. */
  onChange(text: string): void;
  /** Write the draft; bound to the session so ⌘S needs no pane round-trip. */
  readonly onSave?: () => void;
  /**
   * Whether the cursor-block decoration layer is on.
   *
   * The planner behind it understands Markdown only, so every other text file
   * passes false: running it over TypeScript would hide characters it mistook
   * for Markdown markers. Absent means on, which is what Markdown wants.
   */
  readonly decorate?: boolean;
}

/** One rendered failure, after transport envelopes are folded away. */
export interface DocumentErrorFace {
  readonly code: string;
  readonly message: string;
}

/** What one save answered, in the shape the shell needs to keep a panel open. */
export type SaveOutcomeFace =
  | { readonly ok: true; readonly version: string | null }
  | { readonly ok: false; readonly code: string };

/** The immutable state a mounted body paints. */
export interface DocumentSnapshotFace {
  readonly status: "idle" | "loading" | "ready" | "failed";
  readonly text: string;
  readonly savedText: string;
  readonly version: string | null;
  readonly dirty: boolean;
  /** Absent on an explorer half that predates the write channel. */
  readonly saving?: boolean;
  readonly conflict?: boolean;
  /** Text a forced reload replaced; the pane offers it back as a draft. */
  readonly discarded?: string | null;
  readonly error: DocumentErrorFace | null;
}

/** One shared draft, as the explorer's service exposes it. */
export interface DocumentSessionFace {
  getSnapshot(): DocumentSnapshotFace;
  subscribe(listener: () => void): () => void;
  setDraft(text: string): void;
  save(): Promise<SaveOutcomeFace>;
  reload(options?: { readonly force?: boolean }): Promise<void>;
  dispose(): void;
}

/** The draft store the explorer's client service carries. */
export interface DocumentStoreFace {
  acquire(sessionId: string, path: string): DocumentSessionFace;
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
  readonly match: {
    readonly extensions?: readonly string[];
    /** Whole basenames, for the files that have no suffix to match on. */
    readonly names?: readonly string[];
  };
  /** Larger wins; ties break on id. */
  readonly priority?: number;
  load(): Promise<RendererModule>;
}

/** The service the explorer provides to renderer plugins. */
export interface FsExplorerService {
  registerRenderer(contribution: RendererContribution): () => void;
  /**
   * Draft store shared by every renderer.
   *
   * Optional because an older explorer half predates it; a body that cannot
   * find it paints the "channel unavailable" state instead of crashing.
   */
  readonly documents?: DocumentStoreFace;
}
