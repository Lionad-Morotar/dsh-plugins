/**
 * The prop contract between the dock (main bundle) and the terminal renderer
 * (lazy chunk).
 *
 * It lives in its own module so both halves describe the same shape without the
 * main bundle importing anything from the chunk — an import of the chunk's module
 * graph would pull xterm into the startup bundle, which is the one thing the
 * split exists to prevent.
 */
import type { TerminalBinding } from "./binding.ts";

/** What the chunk's screen needs from the dock. */
export interface TerminalScreenProps {
  /** The panel's binding: input, fit and the render frames all go through it. */
  readonly binding: TerminalBinding;
  /** Accessible name for the emulator's hidden textarea. */
  readonly label: string;
  /** Input is disabled while the view is not writable. */
  readonly readOnly: boolean;
  /** Cell font size in pixels. */
  readonly fontSize?: number;
}
