/**
 * What the board's context menu offers, decided without React or the DOM.
 *
 * The menu is a pure function of three facts: which row was right-clicked, what
 * the composer can take, and whether a run is in flight. Keeping it here means
 * the rows can be asserted against the product decisions instead of against a
 * rendered DOM, and the view only has to dispatch on the ids.
 */
import {
  referenceBlockReason,
  type ReferenceBlockReason,
  type ReferenceTargetFacts,
  type TestboardReferenceTarget,
} from "./reference.ts";

/**
 * Action ids the view dispatches on.
 *
 * Literal and stable: the view switches on them, so a rename here without the
 * view turns every click into a no-op.
 */
export const TESTBOARD_MENU_ACTION = {
  /** Insert this row's file or case into the composer as a structured reference. */
  reference: "reference.input",
  /** Start a run scoped to this row's file. */
  runFile: "run.file",
  /** Copy the workspace-relative path (and case name) to the clipboard. */
  copyPath: "copy.path",
} as const;

/** Where a context menu opens, in viewport coordinates. */
export interface ContextMenuAnchor {
  readonly x: number;
  readonly y: number;
}

/** One row of the menu, before the rendering layer sees it. */
export interface ContextMenuEntry {
  readonly id: string;
  /** Already translated; the menu paints what it is given. */
  readonly label: string;
  readonly disabled?: boolean;
  /** Why the row cannot run, shown to the reader; only meaningful when disabled. */
  readonly reason?: string;
}

/** The copy the menu rows need, bound by the view. */
export interface ContextMenuStrings {
  readonly reference: string;
  readonly runFile: string;
  readonly copyPath: string;
  readonly referenceNoSession: string;
  readonly referenceNoComposer: string;
  readonly referenceNoSource: string;
  readonly runInFlight: string;
}

/** Everything the menu is built from. */
export interface ContextMenuInput {
  readonly target: TestboardReferenceTarget;
  /** Whether a run is going, which disables the file-run row. */
  readonly running: boolean;
  /**
   * What the composer can take, or undefined when the view could not read it.
   *
   * Read when the menu opens rather than when the row is clicked: the row has
   * to paint its reason up front, and a menu that turns out to be a no-op is the
   * failure mode this field exists to avoid.
   */
  readonly composer: ReferenceTargetFacts | undefined;
  readonly strings: ContextMenuStrings;
}

/**
 * The reason a blocked reference row shows.
 * @param reason - the key the composer probe answered with.
 * @param strings - the copy table.
 * @returns the sentence the row carries.
 */
function reasonText(reason: ReferenceBlockReason, strings: ContextMenuStrings): string {
  switch (reason) {
    case "noSession":
      return strings.referenceNoSession;
    case "noReference":
      return strings.referenceNoComposer;
    case "noReferenceSource":
      return strings.referenceNoSource;
  }
}

/**
 * Build the menu for one right-click.
 *
 * The reference row comes first because it is the row a reader opens the menu
 * for, and it carries its refusal reason rather than disappearing: an action
 * that is missing looks like a broken feature, while a greyed row says why.
 * @param input - the row, the composer facts and the copy.
 * @returns the rows, in paint order.
 */
export function buildTestboardMenu(input: ContextMenuInput): readonly ContextMenuEntry[] {
  const { target, running, composer, strings } = input;
  const blocked = referenceBlockReason(composer);
  const reference: ContextMenuEntry =
    blocked === undefined
      ? { id: TESTBOARD_MENU_ACTION.reference, label: strings.reference }
      : {
          id: TESTBOARD_MENU_ACTION.reference,
          label: strings.reference,
          disabled: true,
          reason: reasonText(blocked, strings),
        };
  return [
    reference,
    running
      ? {
          id: TESTBOARD_MENU_ACTION.runFile,
          label: strings.runFile,
          disabled: true,
          reason: strings.runInFlight,
        }
      : { id: TESTBOARD_MENU_ACTION.runFile, label: strings.runFile },
    {
      id: TESTBOARD_MENU_ACTION.copyPath,
      label: strings.copyPath,
    },
  ];
}

/**
 * The text the copy row writes: the path, plus the case name when there is one.
 * @param target - the row the menu was opened on.
 * @returns the clipboard text.
 */
export function menuCopyText(target: TestboardReferenceTarget): string {
  return target.kind === "case" ? `${target.path} · ${target.name}` : target.path;
}
