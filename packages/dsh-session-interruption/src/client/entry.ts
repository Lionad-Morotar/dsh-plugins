/**
 * Browser-half entry.
 *
 * Three seats, one shared face: the row's red marker, the hover card's
 * explanation, and the menu's dismissal entry. Each seat receives the row's
 * session identity from the host and this plugin's face through its inject
 * share; the locale seat supplies `t`. Nothing below imports React's runtime —
 * components are bundled against the platform's own copy, and the loader's
 * `require` resolves it inside the factory.
 *
 * cordis calls `apply(ctx, config)` — the context first, this plugin's config
 * second. The context stays a context here; services come through `inject`.
 */
import { buildInterruptionFace, type ManagedInterruptionFace, type SessionsLike } from "./face.ts";
import { RowBadge } from "./row-badge.tsx";
import { HoverSection } from "./hover-section.tsx";
import { DismissItem } from "./dismiss-item.tsx";
import { EN, ZH } from "./copy.ts";
import {
  ENTRY_ID_BADGE,
  ENTRY_ID_DISMISS,
  ENTRY_ID_HOVER,
  ENTRY_ORDER_BADGE,
  ENTRY_ORDER_DISMISS,
  ENTRY_ORDER_HOVER,
  LOCALE_NAMESPACE,
  SLOT_HOVER,
  SLOT_LEADING,
  SLOT_MENU,
} from "./registration.ts";

export {
  ENTRY_ID_BADGE,
  ENTRY_ID_DISMISS,
  ENTRY_ID_HOVER,
  LOCALE_NAMESPACE,
  SLOT_HOVER,
  SLOT_LEADING,
  SLOT_MENU,
} from "./registration.ts";

/** The services the registration reads; declared so Cordis resolves them first. */
export const inject = ["slots", "locale", "sessions"];

/** The slice of the client context this entry uses. */
export interface ClientContextLike {
  readonly slots: {
    inject(slot: string, factory: () => () => void): void;
    register(options: Record<string, unknown>, component: unknown): () => void;
  };
  readonly locale: { register(namespace: string, dictionaries: Record<string, Record<string, string>>): () => void };
  readonly sessions: SessionsLike;
}

/**
 * Mount the three row seats.
 * @param ctx - client root context.
 * @returns the disposer releasing the dictionary and the face.
 */
export function apply(ctx: ClientContextLike): () => void {
  const face: ManagedInterruptionFace = buildInterruptionFace(ctx.sessions);
  const offLocale = ctx.locale.register(LOCALE_NAMESPACE, { zh: ZH, en: EN });
  const register = (slot: string, id: string, order: number, component: unknown): void => {
    ctx.slots.inject(slot, () =>
      ctx.slots.register({ name: slot, id, order, locale: LOCALE_NAMESPACE, inject: () => ({ face }) }, component),
    );
  };
  register(SLOT_LEADING, ENTRY_ID_BADGE, ENTRY_ORDER_BADGE, RowBadge);
  register(SLOT_HOVER, ENTRY_ID_HOVER, ENTRY_ORDER_HOVER, HoverSection);
  register(SLOT_MENU, ENTRY_ID_DISMISS, ENTRY_ORDER_DISMISS, DismissItem);
  return () => {
    offLocale();
    face.dispose();
  };
}

/** The plugin object the loader mounts. */
export const clientPlugin = { name: "dsh-session-interruption", inject, apply };

export default clientPlugin;
