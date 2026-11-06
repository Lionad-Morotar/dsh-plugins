/**
 * The keyed `contextMenu.icon` renderer for host icon routes.
 *
 * The host passes back the icon metadata captured with the action, so the same
 * component serves the parent (default application) and every child. A missing
 * `src` renders nothing rather than a placeholder glyph: the row label already
 * carries the meaning, and the host's own icons are optional everywhere.
 */
import type { MenuIconLike } from "./menu.ts";

/** Props assembled by the keyed slot: the action's captured icon. */
export interface ApplicationIconProps {
  readonly icon: MenuIconLike;
}

/**
 * One application icon.
 * @param props - icon metadata captured with the resolved action.
 * @returns a 14px image, or null when the action carried no source.
 */
export function ApplicationIcon({ icon }: ApplicationIconProps) {
  return icon.src ? <img src={icon.src} width={14} height={14} alt="" /> : null;
}
