/**
 * The host's UI primitives, resolved through the loader.
 *
 * The popup lives in a slot, so it has to look and behave like the shell around
 * it: the same menu surface, the same sticky group headings, the same
 * space-above-the-composer clamp. Those are primitives the web shell seeds into
 * the loader's static module table, and reaching for them is what keeps this
 * surface visually native instead of a lookalike.
 *
 * Every member is optional. A host that drops or renames one degrades to a
 * plainer rendering, never to a broken popup: this picker switches models, and a
 * crash here would take the composer's overlay with it.
 */
import type { ComponentType, Ref } from "react";

/** The slice of a keyboard event the card reads. */
export interface KeyboardEventLike {
  readonly key: string;
  readonly shiftKey: boolean;
  preventDefault(): void;
}

/** Props the menu surface forwards to its element. */
export interface MenuSurfaceProps {
  readonly ref?: Ref<HTMLElement | null>;
  readonly className?: string;
  readonly style?: Record<string, string | number>;
  readonly "aria-label"?: string;
  readonly onKeyDown?: (event: KeyboardEventLike) => void;
  readonly children?: unknown;
}

/** The host's label ranker over `{name, option}` entries. */
export type RankByName = (
  rows: readonly { name: string; option: unknown }[],
  query: string,
) => { name: string; option: unknown }[];

/** The primitives this surface uses; each is absent when the host does not offer it. */
export interface Primitives {
  /** Translucent menu surface carrying the host's elevation and material. */
  readonly MenuSurface?: ComponentType<MenuSurfaceProps> | undefined;
  /** One sticky menu group with its heading. */
  readonly MenuGroup?: ComponentType<{ label: string; children?: unknown }> | undefined;
  /** Clamp a card's height to the space above its anchor. */
  readonly useAnchoredMaxHeight?: ((anchor: Ref<HTMLElement | null>, max: number, state: unknown) => number) | undefined;
  /** Keep group headings pinned while their section scrolls past. */
  readonly observeStickyMenuGroups?: ((viewport: HTMLElement) => () => void) | undefined;
  /** The check mark a selected row shows. */
  readonly IconCheckOutlineRegular?: ComponentType<Record<string, never>> | undefined;
  /** The composer trigger's leading glyph, matching the shell seat. */
  readonly IconDataOutlineRegular?: ComponentType<{ className?: string; size?: number }> | undefined;
  /** The composer trigger's trailing chevron. */
  readonly IconChevronDownOutlineRegular?: ComponentType<{ className?: string }> | undefined;
  /** The host's label ranker: fuzzy subsequence scoring with boundary bonuses. */
  readonly rankByName?: RankByName | undefined;
}

/** Static module the shell seeds these primitives under. */
const PRIMITIVES_MODULE = "@deepseek-ai/dsh-client-ui-primitives";

/**
 * Read the primitives off the loader.
 *
 * Absent is a supported state, so the result is always an object and callers
 * test individual members rather than the whole.
 * @param load - the loader `require`, or null outside a loader factory.
 * @returns the primitives this host exposes.
 */
export function resolvePrimitives(load: ((specifier: string) => unknown) | null): Primitives {
  if (load === null) return {};
  let module: unknown;
  try {
    module = load(PRIMITIVES_MODULE);
  } catch {
    return {};
  }
  if (module === null || typeof module !== "object") return {};
  const record = module as Record<string, unknown>;
  // A React component is not necessarily a function: `memo` and `forwardRef`
  // both produce objects that render perfectly well, so the test is "can React
  // consume this as an element type", not "is it callable".
  const renderable = (value: unknown): boolean =>
    typeof value === "function" || (typeof value === "object" && value !== null);
  const component = <Props,>(name: string): ComponentType<Props> | undefined => {
    const value = record[name];
    return renderable(value) ? (value as ComponentType<Props>) : undefined;
  };
  const fn = <Fn,>(name: string): Fn | undefined => {
    const value = record[name];
    return typeof value === "function" ? (value as Fn) : undefined;
  };

  const primitives: { -readonly [Key in keyof Primitives]: Primitives[Key] } = {};
  const menuSurface = component<MenuSurfaceProps>("MenuSurface");
  if (menuSurface !== undefined) primitives.MenuSurface = menuSurface;
  const menuGroup = component<{ label: string; children?: unknown }>("MenuGroup");
  if (menuGroup !== undefined) primitives.MenuGroup = menuGroup;
  const check = component<Record<string, never>>("IconCheckOutlineRegular");
  if (check !== undefined) primitives.IconCheckOutlineRegular = check;
  const dataIcon = component<{ className?: string; size?: number }>("IconDataOutlineRegular");
  if (dataIcon !== undefined) primitives.IconDataOutlineRegular = dataIcon;
  const chevron = component<{ className?: string }>("IconChevronDownOutlineRegular");
  if (chevron !== undefined) primitives.IconChevronDownOutlineRegular = chevron;
  const anchored = fn<NonNullable<Primitives["useAnchoredMaxHeight"]>>("useAnchoredMaxHeight");
  if (anchored !== undefined) primitives.useAnchoredMaxHeight = anchored;
  const sticky = fn<NonNullable<Primitives["observeStickyMenuGroups"]>>("observeStickyMenuGroups");
  if (sticky !== undefined) primitives.observeStickyMenuGroups = sticky;
  const rank = fn<RankByName>("rankByName");
  if (rank !== undefined) primitives.rankByName = rank;
  return primitives;
}
