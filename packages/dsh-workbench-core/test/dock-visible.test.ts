import { describe, expect, it } from "vitest";

import { createWorkbenchService } from "../src/client/service.ts";

describe("dock visibility switch", () => {
  it("is on by default, because a fresh install should show the surface it installed", () => {
    const service = createWorkbenchService({ get: () => undefined });
    expect(service.dockVisible()).toBe(true);
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
