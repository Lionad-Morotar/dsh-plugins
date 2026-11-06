import { describe, expect, it } from "vitest";

import { createWorkbenchService } from "../src/client/service.ts";

describe("dock visibility switch", () => {
  it("starts hidden, so a reader who never opens the terminal pays neither a shell nor the emulator chunk", () => {
    const service = createWorkbenchService({ get: () => undefined });
    expect(service.dockVisible()).toBe(false);
  });

  it("flips without touching anything else the service owns", () => {
    const service = createWorkbenchService({ get: () => undefined });
    service.setDockVisible(false);
    expect(service.dockVisible()).toBe(false);
    expect(service.docks()).toEqual([]);
    service.setDockVisible(true);
    expect(service.dockVisible()).toBe(true);
  });
});
