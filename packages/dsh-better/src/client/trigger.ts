/**
 * Replacing the composer's model trigger with an opener for the picker.
 *
 * The composer seat (`conversation.input.model`) renders its own two-level menu:
 * a root pane of Model/Effort cells, each drilling into a list, with its own
 * focus management and keyboard contract. That menu searches model names only,
 * so on a machine with forty-odd providers it cannot answer "show me everything
 * under this provider" either.
 *
 * Rather than teach a second, separately-maintained menu about providers, this
 * replaces the seat's open action: the trigger keeps its current appearance
 * (it is the shell's `conversation.input.model.label` child that draws the name,
 * and the name is not this package's to restyle), and opening it opens the same
 * picker `/model` opens. One list, one search, one place where effort is chosen.
 */
/** The controller method set this opener uses. */
export interface PopupOpenerLike {
  open(command: string, spec: unknown, context: unknown, segment: unknown): void;
}

/**
 * The `ui.commands` contribution shape, narrowed to what opening needs.
 *
 * Read structurally rather than imported: the contribution table lives inside
 * the commands plugin's own bundle, and only these three members matter to an
 * opener.
 */
export interface ContributionLike {
  readonly name: string;
  readonly available?: ((session: { sessionId: string }) => boolean) | undefined;
  readonly ui?: unknown;
}

/**
 * Find the `/model` contribution's popup spec.
 *
 * The runtime keeps its contribution table on the service instance. There is no
 * public getter for one contribution (the only public reads are the slash menu's
 * candidate list, which is shaped for the menu), so the table is read directly.
 * A missing table, entry or popup spec yields nothing, and the caller falls back
 * to the shell's own seat rather than opening an empty picker.
 * @param commandUi - the commands service.
 * @returns the popup spec, or undefined when `/model` is not contributed.
 */
export function modelPopupSpec(commandUi: unknown): unknown {
  const runtime = commandUi as { live?: { contributions?: Map<string, ContributionLike> } } | undefined;
  const contribution = runtime?.live?.contributions?.get("model");
  const ui = contribution?.ui;
  if (ui === undefined || ui === null) return undefined;
  // Only a popup contribution can be opened; an action has no list to show.
  const kind = (ui as { kind?: unknown }).kind;
  return kind === "popupSelect" ? ui : undefined;
}

/**
 * The context a popup open expects.
 *
 * The shell passes the command's invoking session projection. Opening from the
 * seat has the same subject, so the same shape is built here.
 * @param sessionId - session whose picker is opening.
 * @returns the context the spec's callbacks receive.
 */
export function openContext(sessionId: string): { sessionId: string } {
  return { sessionId };
}

/**
 * The token segment an open requires.
 *
 * Opening from the seat is not a typed or menu-picked token, so there is no span
 * and no token to consume; settlement therefore consumes nothing. `via: "enter"`
 * with an empty token describes exactly that: a bare open with no draft text
 * behind it.
 * @returns the segment.
 */
export function openSegment(): { via: "enter"; token: string } {
  return { via: "enter", token: "" };
}
