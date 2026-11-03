/**
 * The host modules the context menu borrows at runtime.
 *
 * A third-party client bundle is mounted by the loader, which seeds `react`,
 * `react-dom` and the primitive kit for it; this package declares none of them
 * as a dependency and must not import them statically. `boot` captures the
 * loader's `require`, and every read is defensive: a host build without the
 * primitive kit loses only the host's menu material and keyboard walk, never the
 * menu itself, which falls back to this package's own button list.
 *
 * Members are resolved per call instead of cached. The loader `require` is a
 * module-table lookup, and caching an early miss would pin the fallback for the
 * life of the page.
 */
import type { ComponentType, CSSProperties, ReactNode, RefObject } from "react";

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

/** One row the host `Menu` renders from data. */
export interface HostMenuEntry {
  readonly id: string;
  readonly label: ReactNode;
  readonly disabled?: boolean;
  readonly submenu?: readonly HostMenuEntry[];
}

/** The props this package passes the host `Menu`; everything else is optional. */
export interface HostMenuProps {
  readonly open: boolean;
  readonly anchor: ReactNode;
  readonly items?: readonly HostMenuEntry[];
  readonly children?: ReactNode;
  readonly onSelect?: (id: string) => void;
  readonly onClose: () => void;
  readonly contextual?: boolean;
  readonly portal?: boolean;
  readonly getAnchorRect?: () => DOMRect | null;
  readonly autoFocus?: boolean;
  readonly returnFocus?: () => HTMLElement | null;
  readonly listClassName?: string;
  readonly className?: string;
}

/** The props this package passes the host `MenuSurface`. */
export interface HostMenuSurfaceProps {
  readonly className?: string;
  readonly role?: string;
  readonly children?: ReactNode;
}

/** The props this package passes one host `MenuItemButton`. */
export interface HostMenuItemButtonProps {
  readonly children: ReactNode;
  readonly onSelect: () => void;
  readonly disabled?: boolean;
  readonly disabledReason?: string;
  readonly separatorBefore?: boolean;
}

/** The host modules the context menu can use; a missing field means "degrade". */
export interface MenuKit {
  readonly Menu?: ComponentType<HostMenuProps>;
  readonly MenuSurface?: ComponentType<HostMenuSurfaceProps>;
  readonly MenuItemButton?: ComponentType<HostMenuItemButtonProps>;
  readonly IconChevronDownOutlineRegular?: IconLike;
  readonly useAnchoredPosition?: AnchoredPositionHook;
}

/** The empty kit: every caller degrades to this package's own markup. */
const EMPTY_KIT: MenuKit = Object.freeze({});

/** Static module the shell seeds these primitives under. */
const PRIMITIVES_MODULE = "@deepseek-ai/dsh-client-ui-primitives";

type LoaderRequire = (specifier: string) => unknown;

let loaderRequire: LoaderRequire | null = null;
let testKit: MenuKit | null | undefined;

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
 * An empty object is a valid kit: it exercises the no-primitive fallbacks, which
 * is why clearing the injection needs a distinct value.
 * @param kit - the kit to serve, or null to resolve from the loader again.
 */
export function setMenuKitForTest(kit: MenuKit | null): void {
  testKit = kit;
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

/**
 * Read the platform modules the context menu can use.
 * @returns the available fields; absent fields mean the caller degrades.
 */
export function resolveMenuKit(): MenuKit {
  if (testKit !== null && testKit !== undefined) return testKit;
  if (loaderRequire === null) return EMPTY_KIT;
  const primitives = readModule(loaderRequire, PRIMITIVES_MODULE);
  if (primitives === undefined) return EMPTY_KIT;

  // A React component is not necessarily a function: `memo` and `forwardRef`
  // both produce objects that render perfectly well, so the test is "can React
  // consume this as an element type", not "is it callable".
  const component = <Props,>(name: string): ComponentType<Props> | undefined => {
    const value = primitives[name];
    if (typeof value === "function") return value as ComponentType<Props>;
    if (typeof value === "object" && value !== null) return value as ComponentType<Props>;
    return undefined;
  };
  const fn = <Fn,>(name: string): Fn | undefined => {
    const value = primitives[name];
    return typeof value === "function" ? (value as Fn) : undefined;
  };

  const kit: { -readonly [Key in keyof MenuKit]: MenuKit[Key] } = {};
  const menu = component<HostMenuProps>("Menu");
  if (menu !== undefined) kit.Menu = menu;
  const surface = component<HostMenuSurfaceProps>("MenuSurface");
  if (surface !== undefined) kit.MenuSurface = surface;
  const item = component<HostMenuItemButtonProps>("MenuItemButton");
  if (item !== undefined) kit.MenuItemButton = item;
  const chevron = component<{ className?: string }>("IconChevronDownOutlineRegular");
  if (chevron !== undefined) kit.IconChevronDownOutlineRegular = chevron as IconLike;
  const anchored = fn<AnchoredPositionHook>("useAnchoredPosition");
  if (anchored !== undefined) kit.useAnchoredPosition = anchored;
  return kit;
}
