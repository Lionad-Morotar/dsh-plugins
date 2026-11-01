/**
 * The dock body's kind routing, decided before any React runs.
 *
 * Keeping the decision pure is what makes a panel of an unknown kind
 * survivable: the view renders whatever plan comes back and never has to
 * guard the registry itself, and the Node tests can drive every branch of
 * the routing without a DOM.
 */
import { TERMINAL_PANEL_KIND, type DockPanelKind } from "./dock-state.ts";

/** A panel kind registered on the workbench core, as this dock reads it. */
export interface PanelKindDescriptor {
  readonly kind: string;
  readonly title: string;
  readonly mount: (host: HTMLElement, context: { readonly sessionId: string }) => (() => void) | void;
}

/** What one panel body renders, decided by {@link planPanelBody}. */
export type PanelBodyPlan =
  | { readonly plan: "terminal" }
  | { readonly plan: "kind"; readonly kind: string; readonly title: string; readonly mount: PanelKindDescriptor["mount"] }
  | { readonly plan: "unknown"; readonly kind: string };

/**
 * Decide how one panel body renders.
 *
 * The built-in terminal kind always wins, even against a registration of the
 * same name: the dock owns that kind, and a rogue descriptor must not be able
 * to shadow the only renderer the dock cannot run without.
 *
 * @param kind - the panel's kind.
 * @param kinds - the workbench registry snapshot, in registration order.
 * @returns the plan the view renders.
 */
export function planPanelBody(kind: DockPanelKind, kinds: readonly PanelKindDescriptor[]): PanelBodyPlan {
  if (kind === TERMINAL_PANEL_KIND) return { plan: "terminal" };
  const found = kinds.find(entry => entry.kind === kind);
  if (found === undefined) return { plan: "unknown", kind };
  return { plan: "kind", kind: found.kind, title: found.title, mount: found.mount };
}

/**
 * What the `+` picker offers besides the built-in: the registered kinds in
 * registration order, terminal filtered out because the plain `+` click
 * already opens one.
 *
 * @param kinds - the workbench registry snapshot.
 * @returns picker entries for the secondary interaction.
 */
export function kindPickerChoices(kinds: readonly PanelKindDescriptor[]): readonly { kind: string; title: string }[] {
  return kinds.filter(entry => entry.kind !== TERMINAL_PANEL_KIND).map(entry => ({ kind: entry.kind, title: entry.title }));
}
