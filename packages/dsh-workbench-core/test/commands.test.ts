import { describe, expect, it, vi } from "vitest";

import { registerWorkbenchCommands, type ShortcutCommandRegistration } from "../src/client/commands.ts";
import { createWorkbenchService } from "../src/client/service.ts";

function harness() {
  const registered: ShortcutCommandRegistration[] = [];
  const shortcuts = {
    register(command: ShortcutCommandRegistration) {
      registered.push(command);
      return () => {};
    },
  };
  const service = createWorkbenchService({ get: () => undefined });
  return { registered, shortcuts, service };
}

describe("workbench command registration", () => {
  it("registers the three global commands with desktop-only defaults", () => {
    const { registered, shortcuts, service } = harness();
    registerWorkbenchCommands(shortcuts, service, key => key);
    expect(registered.map(command => command.id)).toEqual([
      "workbench.files.toggle",
      "workbench.git.toggle",
      "workbench.term.toggle",
    ]);
    for (const command of registered) {
      expect(Object.keys(command.defaults)).toEqual(["desktop:macos", "desktop:windows", "desktop:linux"]);
    }
  });

  it("opens the matching conversation view for files and Git", () => {
    const ctx = {
      get: (name: string) =>
        name === "uiSession" ? { adapter: { current: { getSnapshot: () => ({ key: "s1" }) } } } : undefined,
    };
    const service = createWorkbenchService(ctx);
    const opened: string[] = [];
    service.views.bind("s1", id => opened.push(id));
    const { registered, shortcuts } = harness();
    registerWorkbenchCommands(shortcuts, service, key => key);
    const files = registered.find(command => command.id === "workbench.files.toggle");
    const resolution = files?.resolve({ region: "page", modal: null, target: null });
    expect(resolution?.status).toBe("handled");
    if (resolution?.status === "handled") resolution.run();
    expect(opened).toEqual(["fs-explorer"]);
  });

  it("blocks view commands without a current session", () => {
    const { registered, shortcuts, service } = harness();
    registerWorkbenchCommands(shortcuts, service, key => key);
    const git = registered.find(command => command.id === "workbench.git.toggle");
    expect(git?.resolve({ region: "page", modal: null, target: null })).toEqual({
      status: "blocked",
      reason: "请先选择会话",
    });
  });

  it("toggles the terminal dock without a session", () => {
    const { registered, shortcuts, service } = harness();
    registerWorkbenchCommands(shortcuts, service, key => key);
    const terminal = registered.find(command => command.id === "workbench.term.toggle");
    const resolution = terminal?.resolve({ region: "page", modal: null, target: null });
    expect(resolution?.status).toBe("handled");
    if (resolution?.status === "handled") resolution.run();
    expect(service.dockVisible()).toBe(false);
  });

  it("keeps registering after one host rejection", () => {
    const service = createWorkbenchService({ get: () => undefined });
    const onError = vi.fn();
    let first = true;
    const shortcuts = {
      register() {
        if (first) {
          first = false;
          throw new Error("conflict");
        }
        return () => {};
      },
    };
    registerWorkbenchCommands(shortcuts, service, key => key, onError);
    expect(onError).toHaveBeenCalledTimes(1);
    expect(onError.mock.calls[0]?.[0]).toContain("workbench.files.toggle");
  });
});
