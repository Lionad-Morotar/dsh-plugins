/**
 * The PR view: a full-height surface that will lay an x...y range out.
 *
 * This slice renders the frame only: the title, and the sentence that stands in
 * for a comparison with nothing in it. There is no data half yet, so the view
 * makes no request at all and holds no state. That is deliberate rather than
 * unfinished: a tab that fetched something the host cannot answer would show an
 * error on every boot, and the empty state is the honest reading of "no range
 * selected".
 *
 * The root carries `data-conversation-composer-overlay`, the attribute the host
 * keys on to give the conversation view a definite height and to float the
 * composer over it. Without it the panel collapses to its content height and the
 * padding the stylesheet reserves for the composer pushes the empty state out of
 * view.
 */
import type { ReactElement } from "react";

/** Owner props the host passes to a `conversation.view` entry. */
export interface ConversationViewProps {
  readonly sessionId?: string;
}

/** Strings the view renders, bound through the locale seat by the entry. */
export interface PrExplorerViewStrings {
  readonly title: string;
  readonly empty: string;
  readonly emptyHint: string;
}

/** What the entry hands the view factory. */
export interface PrExplorerViewOptions {
  readonly strings: PrExplorerViewStrings;
}

/**
 * Build the conversation view component.
 *
 * @param options - the strings the entry resolved for the active locale.
 * @returns a component the slot registry can mount.
 */
export function createPrExplorerView({ strings }: PrExplorerViewOptions): (props: ConversationViewProps) => ReactElement {
  return function PrExplorerView(_props: ConversationViewProps): ReactElement {
    return (
      <div data-testid="pr-explorer" data-conversation-composer-overlay="">
        <div data-rm="header">
          <h2 data-rm="title">{strings.title}</h2>
        </div>
        <div data-rm="body">
          <div data-rm="empty">
            <p data-rm="empty-title">{strings.empty}</p>
            <p data-rm="empty-hint">{strings.emptyHint}</p>
          </div>
        </div>
      </div>
    );
  };
}
