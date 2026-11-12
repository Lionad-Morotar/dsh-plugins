/**
 * Client half of dsh-blank-new-chat.
 *
 * A new conversation is the Host's "hero" page: the header hides its chrome,
 * the composer centers itself in an empty body, and the session's real view
 * tabs never render. This plugin keeps that same blank conversation but makes
 * it look like an ordinary one — title row, view tabs, empty transcript, and
 * the composer docked at the bottom.
 *
 * The lever is the Host's own activity contract: `conversationPhase` treats any
 * activated view target whose `isActive` is true as visible activity, so the
 * shell leaves `blank` and renders its normal chrome. This package registers a
 * stateless target (`blank-new-chat`) for exactly that purpose and activates it
 * only from the blank-home frame, leaving sessions that were never blank
 * untouched. Nothing in the Host is patched.
 *
 * @module dsh-blank-new-chat
 */
import { useLayoutEffect, useRef } from "react";
import type { ReactNode } from "react";

/** Conversation target this bundle contributes; activation is monotonic. */
export const TARGET = "blank-new-chat";

/** Slot that wraps the conversation scroll body in every phase. */
export const SLOT = "conversation.hero.frame";

/** Entry id inside that slot. */
export const ENTRY_ID = "blank-new-chat";

/** The Host marks the conversation content root with the current session id. */
const CONTENT_SELECTOR = "[data-conversation-content]";
const SESSION_ATTRIBUTE = "data-conversation-session";

/**
 * Immutable snapshot for the synthetic target. It carries no conversation data;
 * the target exists only so `isActive` can report activity to the shell.
 */
const EMPTY_SNAPSHOT = Object.freeze({});

/** The builder shape the target registry requires; `replace`/`apply` ignore input. */
const EMPTY_BUILDER = {
  empty: EMPTY_SNAPSHOT,
  replace: () => EMPTY_SNAPSHOT,
  apply: () => EMPTY_SNAPSHOT,
};

/** The part of the Conversation view definition this plugin uses. */
export interface BlankViewDefinition {
  readonly target: string;
  create(): unknown;
  isActive(snapshot: unknown): boolean;
}

/** The part of a Conversation binding this plugin uses. */
export interface BlankConversationBinding {
  activate(target: string): void;
}

/** The part of the Conversation service this plugin uses. */
export interface BlankUiConversation {
  readonly views: {
    entries(): readonly BlankViewDefinition[];
    register(definition: BlankViewDefinition): unknown;
  };
  binding(sessionId: string): BlankConversationBinding;
}

/** The slot face, narrowed to the two calls this plugin makes. */
export interface BlankSlots {
  inject(slot: string, factory: () => () => void): void;
  register(options: { name: string; id?: string }, component: unknown): () => void;
}

/** The client context this plugin needs. */
export interface BlankClientContext {
  readonly slots: BlankSlots;
  readonly uiConversation: BlankUiConversation;
}

/** Owner props the Host passes to `conversation.hero.frame` layers. */
export interface BlankNewChatFrameProps {
  /** Whether the body shows the blank home of a standalone conversation. */
  readonly hero?: boolean;
  /** The conversation content the frame wraps. */
  readonly children?: ReactNode;
  /** Activates the synthetic target for one session; supplied by `apply`. */
  readonly activate?: (sessionId: string) => void;
}

/**
 * Wrap the conversation body and flip a blank session into the active shell.
 *
 * The effect is a layout effect so the first paint already uses the active
 * chrome instead of flashing the hero. It runs only while `hero` is true; an
 * ordinary conversation never reaches the activation branch.
 * @param props - frame owner props plus the activation seam.
 * @returns the wrapped conversation body.
 */
export function BlankNewChatFrame({ hero, children, activate }: BlankNewChatFrameProps) {
  const anchor = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    if (hero !== true || activate === undefined) return;
    const content = anchor.current?.closest(CONTENT_SELECTOR);
    const sessionId = content?.getAttribute(SESSION_ATTRIBUTE);
    if (sessionId === null || sessionId === undefined || sessionId === "") return;
    activate(sessionId);
  }, [hero, activate]);
  // `display: contents` keeps the wrapper out of the flex layout: the Host's
  // scroll body must stay the frame's only box.
  return (
    <div ref={anchor} style={{ display: "contents" }}>
      {children}
    </div>
  );
}

/** The plugin object the client ModuleLoader mounts. */
export const clientPlugin = {
  name: "dsh-blank-new-chat",
  inject: ["slots", "uiConversation"],
  /**
   * Register the synthetic target and the frame layer that activates it.
   * @param ctx - client context carrying the slot and Conversation services.
   */
  apply(ctx: BlankClientContext): void {
    const { slots, uiConversation } = ctx;
    // A client-plugin hot reload reuses the Host registry: the previous target
    // is indistinguishable from this one, so re-registering would only throw.
    const registered = uiConversation.views
      .entries()
      .some((definition) => definition.target === TARGET);
    if (!registered) {
      uiConversation.views.register({
        target: TARGET,
        create: () => EMPTY_BUILDER,
        isActive: () => true,
      });
    }
    const activate = (sessionId: string): void => {
      try {
        uiConversation.binding(sessionId).activate(TARGET);
      } catch {
        // The binding can be between owners while the shell switches sessions.
        // A failed activation must leave the page renderable; the next hero
        // mount retries.
      }
    };
    const Frame = (props: Omit<BlankNewChatFrameProps, "activate">) => (
      <BlankNewChatFrame {...props} activate={activate} />
    );
    slots.inject(SLOT, () => slots.register({ name: SLOT, id: ENTRY_ID }, Frame));
  },
};

export default clientPlugin;
