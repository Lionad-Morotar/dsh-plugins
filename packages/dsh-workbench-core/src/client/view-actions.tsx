/**
 * The "Back to chat" row in the Session header's View More menu.
 *
 * `conversation.session.header.views.actions` is a root-scoped list, so its
 * entries never receive the Session id or the `openView` prop share. The row
 * therefore reads the id from the core session-selection adapter and binds the
 * owner's `onOpen` into the shared view seam while it is mounted. That binding
 * is what finally makes the root-scoped terminal dock's Esc work.
 */
import { useEffect, useSyncExternalStore, type ReactNode } from "react";

import type { SessionSelection } from "./session.ts";
import type { WorkbenchService } from "./service.ts";
import type { Translate } from "./section.tsx";

/** Owner props the host passes to every View More menu row. */
export interface ViewActionsOwnerProps {
  /** Select a View in this Session without changing its pin state. */
  readonly onOpen: (id: string) => void;
  /** Close the More menu. */
  readonly onDismiss: () => void;
}

/** Minimal shape of the primitive kit's menu row. */
export interface MenuItemButtonComponent {
  (props: { readonly onSelect?: () => void; readonly children?: ReactNode }): ReactNode;
}

/** The loader `require`, handed over by the build's boot call. */
export type LoaderRequire = (spec: string) => unknown;

/**
 * Resolve the host's menu row primitive.
 * @param require - the loader require, or null before boot.
 * @returns the component, or null when the platform seeds no primitive kit.
 */
export function resolveMenuItemButton(require: LoaderRequire | null): MenuItemButtonComponent | null {
  if (require === null) return null;
  const primitives = require("@deepseek-ai/dsh-client-ui-primitives") as { MenuItemButton?: unknown } | undefined;
  return typeof primitives?.MenuItemButton === "function"
    ? (primitives.MenuItemButton as MenuItemButtonComponent)
    : null;
}

/** What one row mount closes over. */
export interface ViewActionsWiring {
  readonly service: WorkbenchService;
  readonly t: Translate;
  readonly session: SessionSelection;
  readonly menuItem: () => MenuItemButtonComponent | null;
}

/**
 * Build the row component for one client mount.
 * @param wiring - the service, copy, session store and primitive resolver.
 * @returns the component registered into the View More menu slot.
 */
export function createReturnToChatRow({ service, t, session, menuItem }: ViewActionsWiring): (props: ViewActionsOwnerProps) => ReactNode {
  function ReturnToChatRow({ onOpen, onDismiss }: ViewActionsOwnerProps) {
    const sessionId = useSyncExternalStore(session.subscribe, session.getSnapshot);

    useEffect(() => {
      if (sessionId === undefined) return;
      return service.views.bind(sessionId, onOpen);
    }, [service, sessionId, onOpen]);

    const select = (): void => {
      onDismiss();
      if (sessionId !== undefined) service.views.showChat(sessionId);
    };

    const MenuItemButton = menuItem();
    if (MenuItemButton !== null) {
      return <MenuItemButton onSelect={select}>{t("view.backToChat")}</MenuItemButton>;
    }
    return (
      <button type="button" role="menuitem" data-workbench-view-action="back-to-chat" onClick={select}>
        {t("view.backToChat")}
      </button>
    );
  }

  return ReturnToChatRow;
}
