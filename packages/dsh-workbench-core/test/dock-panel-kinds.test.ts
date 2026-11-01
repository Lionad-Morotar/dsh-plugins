/**
 * The dock panel kind registry: the seam that lets a feature package host a
 * panel inside the terminal dock's chrome without the dock knowing it.
 *
 * The contract mirrors registerDock: kind-string identity, first registration
 * wins a duplicate, the disposer removes exactly its own entry, and the
 * enumeration is a snapshot in registration order.
 */
import { describe, expect, it } from "vitest";

import { createWorkbenchService } from "../src/client/service.ts";

const emptyContext = { get: () => undefined };

function kindDescriptor(kind: string, title = kind.toUpperCase()) {
  return { kind, title, mount: () => () => {} };
}

describe("dock panel kinds", () => {
  it("registers, enumerates in order and disposes", () => {
    const service = createWorkbenchService(emptyContext);
    const off = service.registerDockPanelKind(kindDescriptor("arch", "Arch"));
    service.registerDockPanelKind(kindDescriptor("graph", "Graph"));

    expect(service.dockPanelKinds().map(entry => entry.kind)).toEqual(["arch", "graph"]);
    expect(service.dockPanelKinds()[0]?.title).toBe("Arch");

    off();
    expect(service.dockPanelKinds().map(entry => entry.kind)).toEqual(["graph"]);
  });

  it("keeps the first registration when the same kind registers twice", () => {
    const service = createWorkbenchService(emptyContext);
    const first = kindDescriptor("arch", "First");
    const second = kindDescriptor("arch", "Second");
    const offFirst = service.registerDockPanelKind(first);
    const offDuplicate = service.registerDockPanelKind(second);

    expect(service.dockPanelKinds()).toHaveLength(1);
    expect(service.dockPanelKinds()[0]?.title).toBe("First");

    // A duplicate registration is inert: disposing it must not remove the
    // entry the dock is still rendering against.
    offDuplicate();
    expect(service.dockPanelKinds()).toHaveLength(1);

    offFirst();
    expect(service.dockPanelKinds()).toHaveLength(0);
  });

  it("hands the disposer a registry that removes only its own descriptor", () => {
    const service = createWorkbenchService(emptyContext);
    const offA = service.registerDockPanelKind(kindDescriptor("a"));
    const offB = service.registerDockPanelKind(kindDescriptor("b"));
    offA();
    offA();
    expect(service.dockPanelKinds().map(entry => entry.kind)).toEqual(["b"]);
    offB();
    expect(service.dockPanelKinds()).toHaveLength(0);
  });

  it("returns snapshot arrays the caller cannot mutate into the registry", () => {
    const service = createWorkbenchService(emptyContext);
    service.registerDockPanelKind(kindDescriptor("arch"));
    const snapshot = service.dockPanelKinds();
    (snapshot as unknown as { push(item: unknown): void }).push(kindDescriptor("late"));
    expect(service.dockPanelKinds()).toHaveLength(1);
  });
});
