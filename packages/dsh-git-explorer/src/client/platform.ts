/**
 * The host modules the header action borrows at runtime.
 *
 * A third-party client bundle is mounted by the loader, which seeds `react`,
 * `react-dom` and the primitive kit for it; this package declares none of them
 * as a dependency and must not import them statically. `boot` captures the
 * loader's `require`, and every read is defensive: a host build without a
 * primitive loses only that convenience, never the header action.
 *
 * Icons and the anchor/dismiss hooks are resolved per call instead of cached.
 * The loader `require` is a module-table lookup, and caching an early miss
 * would pin the fallback for the life of the page.
 */
import { createElement, type CSSProperties, type ReactNode, type RefObject } from "react";

/** What an icon component needs from its callers. */
export type IconLike = (props: { readonly className?: string }) => ReactNode;

/** The primitive kit's `useAnchoredPosition`, narrowed to what we pass. */
export type AnchoredPositionHook = (options: {
  readonly open: boolean;
  readonly anchorRef: RefObject<HTMLElement | null>;
  readonly panelRef: RefObject<HTMLElement | null>;
  readonly side?: "top" | "bottom";
  readonly align?: "start" | "end";
  readonly gap: number;
  readonly margin: number;
}) => CSSProperties | null;

/** The primitive kit's `useDismissOnOutsidePointer`. */
export type DismissHook = (
  root: RefObject<HTMLElement | null>,
  open: boolean,
  setOpen: (open: boolean) => void,
  portal?: RefObject<HTMLElement | null>,
) => void;

/** `react-dom`'s portal entry. */
export type PortalHook = (children: ReactNode, container: Element) => ReactNode;

/** Platform modules the popover can use; a missing field means "degrade". */
export interface BranchKit {
  readonly IconBranch?: IconLike;
  readonly IconChevron?: IconLike;
  readonly useAnchoredPosition?: AnchoredPositionHook;
  readonly useDismissOnOutsidePointer?: DismissHook;
  readonly createPortal?: PortalHook;
}

const EMPTY_KIT: BranchKit = Object.freeze({});

type LoaderRequire = (specifier: string) => unknown;

let loaderRequire: LoaderRequire | null = null;
let testKit: BranchKit | null | undefined;

/**
 * Capture the loader `require` handed to the bundle factory.
 * @param requireFn - the loader's module resolver.
 */
export function boot(requireFn: LoaderRequire): void {
  loaderRequire = requireFn;
}

/**
 * Replace the resolved kit, or clear the replacement with `null`.
 *
 * An empty object is a valid kit: it exercises the no-primitive fallbacks,
 * which is why clearing the injection needs a distinct value.
 * @param kit - the kit to serve, or null to resolve from the loader again.
 */
export function setBranchKitForTest(kit: BranchKit | null): void {
  testKit = kit;
}

/**
 * Read the platform modules this component can use.
 * @returns the available fields; absent fields mean the caller degrades.
 */
export function resolveBranchKit(): BranchKit {
  if (testKit !== null && testKit !== undefined) return testKit;
  if (loaderRequire === null) return EMPTY_KIT;

  const primitives = readModule(loaderRequire, "@deepseek-ai/dsh-client-ui-primitives");
  const reactDom = readModule(loaderRequire, "react-dom");
  const iconBranch = primitives?.IconBranchOutlineRegular;
  const iconChevron = primitives?.IconChevronDownOutlineRegular;
  const anchored = primitives?.useAnchoredPosition;
  const dismiss = primitives?.useDismissOnOutsidePointer;
  const portal = reactDom?.createPortal;

  return {
    ...(typeof iconBranch === "function" ? { IconBranch: iconBranch as IconLike } : {}),
    ...(typeof iconChevron === "function" ? { IconChevron: iconChevron as IconLike } : {}),
    ...(typeof anchored === "function" ? { useAnchoredPosition: anchored as AnchoredPositionHook } : {}),
    ...(typeof dismiss === "function" ? { useDismissOnOutsidePointer: dismiss as DismissHook } : {}),
    ...(typeof portal === "function" ? { createPortal: portal as PortalHook } : {}),
  };
}

/** Read one optional module; a loader that rejects a name yields nothing. */
function readModule(requireFn: LoaderRequire, specifier: string): Record<string, unknown> | undefined {
  try {
    const loaded = requireFn(specifier);
    if (loaded === null || (typeof loaded !== "object" && typeof loaded !== "function")) return undefined;
    return loaded as Record<string, unknown>;
  } catch {
    return undefined;
  }
}

const SVG_BASE = {
  width: 14,
  height: 14,
  viewBox: "0 0 16 16",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  focusable: false,
};

/**
 * Branch glyph used when the primitive kit is absent.
 *
 * Same 14px optical size as the host icons, drawn in `currentColor` so it
 * inherits whichever header state the trigger is in.
 */
export const FallbackBranchIcon: IconLike = props =>
  createElement(
    "svg",
    { ...SVG_BASE, className: props.className },
    createElement("circle", { key: "root", cx: 4.5, cy: 3.6, r: 1.6 }),
    createElement("circle", { key: "tip", cx: 11.5, cy: 6.2, r: 1.6 }),
    createElement("circle", { key: "base", cx: 4.5, cy: 12.4, r: 1.6 }),
    createElement("path", { key: "trunk", d: "M4.5 5.2v5.6" }),
    createElement("path", { key: "fork", d: "M11.5 7.8c0 2.4-2.6 2.4-5.4 3" }),
  );

/** Chevron glyph used when the primitive kit is absent. */
export const FallbackChevronIcon: IconLike = props =>
  createElement(
    "svg",
    { ...SVG_BASE, width: 12, height: 12, viewBox: "0 0 12 12", className: props.className },
    createElement("path", { key: "chevron", d: "M3 4.75 6 7.75l3-3" }),
  );
