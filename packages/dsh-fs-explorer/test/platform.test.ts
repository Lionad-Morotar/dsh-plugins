/**
 * The runtime primitive kit behind the context menu.
 *
 * The property under test is the degradation, not the happy path: a host that
 * seeds no primitive kit, or a loader that rejects the module name, must leave
 * every member absent so the menu falls back to this package's own card. A
 * resolver that threw here would take the whole panel down on a host that only
 * forgot to seed one module.
 */
import { describe, expect, it, vi } from "vitest";

import { boot, resolveMenuKit, setMenuKitForTest } from "../src/client/platform.ts";

describe("resolveMenuKit", () => {
  it("answers an empty kit before the loader hands its require over", () => {
    setMenuKitForTest(null);
    // A fresh module has no captured require; the boot below is what installs one.
    expect(resolveMenuKit()).toEqual({});
  });

  it("reads every member the context menu can use", () => {
    setMenuKitForTest(null);
    const Menu = (): null => null;
    const MenuSurface = (): null => null;
    const MenuItemButton = (): null => null;
    const IconChevronDownOutlineRegular = (): null => null;
    const useAnchoredPosition = (): null => null;
    boot(
      (specifier: string): unknown => {
        if (specifier !== "@deepseek-ai/dsh-client-ui-primitives") throw new Error(`unexpected ${specifier}`);
        return { Menu, MenuSurface, MenuItemButton, IconChevronDownOutlineRegular, useAnchoredPosition };
      },
    );
    const kit = resolveMenuKit();
    expect(kit.Menu).toBe(Menu);
    expect(kit.MenuSurface).toBe(MenuSurface);
    expect(kit.MenuItemButton).toBe(MenuItemButton);
    expect(kit.IconChevronDownOutlineRegular).toBe(IconChevronDownOutlineRegular);
    expect(kit.useAnchoredPosition).toBe(useAnchoredPosition);
  });

  it("drops a member whose value is not renderable", () => {
    setMenuKitForTest(null);
    boot(() => ({ Menu: "not a component", useAnchoredPosition: 42 }));
    expect(resolveMenuKit()).toEqual({});
  });

  it("answers an empty kit when the loader rejects the module name", () => {
    setMenuKitForTest(null);
    boot(() => {
      throw new Error("no such module");
    });
    expect(resolveMenuKit()).toEqual({});
  });

  it("answers an empty kit when the module is not an object", () => {
    setMenuKitForTest(null);
    boot(() => null);
    expect(resolveMenuKit()).toEqual({});
  });

  it("serves an injected kit without consulting the loader", () => {
    const Menu = (): null => null;
    const load = vi.fn(() => ({ Menu: (): null => null }));
    boot(load);
    setMenuKitForTest({ Menu });
    expect(resolveMenuKit().Menu).toBe(Menu);
    expect(load).not.toHaveBeenCalled();
    setMenuKitForTest(null);
  });

  it("treats an injected empty kit as a real answer", () => {
    // The distinction matters: an empty kit is how a test exercises the
    // fallback, so clearing the injection needs a different value.
    setMenuKitForTest({});
    expect(resolveMenuKit()).toEqual({});
    setMenuKitForTest(null);
  });
});
