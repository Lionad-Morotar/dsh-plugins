/**
 * The conversation view the test board tab renders.
 *
 * This slice ships the shell only: the tab has to exist and paint something
 * real so the slot wiring is verifiable end to end, while the inventory and
 * result data arrive in a later slice. The component therefore stays a pure
 * function of its strings, with no effects and no host reads.
 */
import type { ReactElement } from "react";

/** Strings the view renders, bound through the locale seat by the entry. */
export interface TestboardViewStrings {
  readonly title: string;
  readonly hint: string;
}

/** Owner props the host passes to a `conversation.view` entry. */
export interface ConversationViewProps {
  readonly sessionId?: string;
}

/**
 * Build the view component around one set of strings.
 *
 * A factory rather than a module-level component: the strings are resolved per
 * apply, and a module-level component would freeze the boot language into the
 * tab body while the tab label kept following the locale.
 * @param strings - locale-bound copy for this apply.
 * @returns the component the slot mounts.
 */
export function createTestboardView(strings: TestboardViewStrings): (props: ConversationViewProps) => ReactElement {
  return function TestboardView(): ReactElement {
    return (
      <div data-testboard-view="">
        <h2 data-testboard-title="">{strings.title}</h2>
        <p data-testboard-hint="">{strings.hint}</p>
      </div>
    );
  };
}
