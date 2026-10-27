/**
 * A React stand-in for the entry and adapter tests.
 *
 * Both modules build components but never render them, so the stub only answers
 * the shape they touch. It is typed as the real ReactFace, so a change to that
 * contract breaks here instead of in a host. The single cast covers
 * createElement, whose element type cannot be built without React.
 */
import type { ReactElement } from "react";

import type { ReactFace } from "../../src/client/entry.ts";

/** The element shape these tests never inspect. */
const noElement = null as unknown as ReactElement;

/** React surface with no renderer behind it. */
export function reactStub(): ReactFace {
  return {
    createElement: () => noElement,
    lazy: () => () => noElement,
    Suspense: () => noElement,
    useState: (initial) => [initial, () => {}],
    useEffect: () => {},
    useMemo: (factory) => factory(),
  };
}
