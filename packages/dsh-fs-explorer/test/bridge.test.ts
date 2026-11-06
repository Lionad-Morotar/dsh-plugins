/**
 * The address bridge's pure decisions and its registration wiring.
 *
 * The body itself is not rendered here — it has no DOM and no React runtime in
 * this environment. Everything it decides is delegated to `decideBridge` and
 * everything it does is delegated to `forwardFocus`, which is why those two are
 * the whole surface this file drives.
 */
import { describe, expect, it, vi } from "vitest";

import {
  BRIDGE_KIND,
  BRIDGE_PATTERN,
  BRIDGE_TYPE_ID,
  canBridgeFile,
  decideBridge,
  focusForFileAddress,
  forwardFocus,
  registerAddressBridge,
  type BridgeWorkbenchFace,
  type SidebarRightFace,
  type SidebarRightTabType,
} from "../src/client/bridge.ts";

/** One session-scoped file address, the shape the host builds for a file link. */
function address(sessionId: string, path: string): string {
  const encoded = path
    .split("/")
    .map(segment => encodeURIComponent(segment).replace(/%3A/gi, ":"))
    .join("/");
  return `dsh-resource://file/session/${encodeURIComponent(sessionId)}/${encoded}`;
}

describe("canBridgeFile", () => {
  it("claims every suffix the shared format catalogue renders", () => {
    for (const name of ["model.glb", "scene.gltf", "mesh.obj", "part.stl", "print.3mf", "scan.tiff", "drawing.dxf"]) {
      expect(canBridgeFile(name)).toBe(true);
    }
  });

  it("claims the text suffixes this view previews", () => {
    for (const name of ["a.md", "a.tsx", "a.json", "a.sh", "a.yml", "a.css", "a.html", "a.patch", "a.log"]) {
      expect(canBridgeFile(name)).toBe(true);
    }
    // A leading dot is the name, not an extension.
    expect(canBridgeFile(".gitignore")).toBe(true);
    expect(canBridgeFile(".env")).toBe(true);
    expect(canBridgeFile("/Users/x/project/.gitignore")).toBe(true);
  });

  it("claims the suffix-less names an editor opens as text", () => {
    for (const name of ["Makefile", "Dockerfile", "LICENSE", "README", "CHANGELOG", "makefile"]) {
      expect(canBridgeFile(name)).toBe(true);
    }
    expect(canBridgeFile("docs/README")).toBe(true);
  });

  it("claims images and PDF, which the workbench now owns", () => {
    // The workbench is the file's main surface: a picture or a PDF opened from a
    // chat link should land in the same tree and renderer as one opened from the
    // tree, not bounce the reader into a sidebar tab. Both families are in the
    // shared catalogue, so the bridge claims them by following it.
    for (const name of ["a.pdf", "a.png", "a.jpg", "a.jpeg", "a.gif", "a.webp", "a.bmp", "a.ico", "logo.svg"]) {
      expect(canBridgeFile(name), name).toBe(true);
    }
  });

  it("still leaves Office documents and tables to the host", () => {
    // These are the suffixes whose built-in renderers are richer than anything
    // drawn here, so the exclusion has to survive the catalogue growing.
    for (const name of ["a.docx", "a.pptx", "a.xlsx", "a.xls", "a.fods", "a.doc", "a.ppt", "report.csv", "table.tsv"]) {
      expect(canBridgeFile(name), name).toBe(false);
    }
  });

  it("claims svg as a picture rather than reading it as text", () => {
    // svg is in both catalogues: the text allow-list and the image family. The
    // family wins, because the workbench draws it, and a reader who clicked a
    // logo wants the picture rather than its markup.
    expect(canBridgeFile("logo.svg")).toBe(true);
    expect(canBridgeFile("assets/icons/logo.SVG")).toBe(true);
  });

  it("does not treat a leading-dot name as a suffix", () => {
    // `.png` is a file called "png", not a PNG. The format catalogue reads it
    // that way, so it has no family and no renderer can draw it; claiming it
    // would forward it to the workbench and land on the text path, which answers
    // "this is not a text file". A dotfile whose name is a text suffix is a
    // different case and stays claimed, which the next test covers.
    for (const name of [".png", ".jpg", ".pdf", ".glb", ".dxf", "dir/.png"]) {
      expect(canBridgeFile(name), name).toBe(false);
    }
  });

  it("still claims a dotfile whose name is a text suffix", () => {
    // `.gitignore` and `.env` are dotfiles the editor vocabulary lists by the
    // word after the dot, and they are text, so they stay with this view.
    for (const name of [".gitignore", ".env", ".npmrc", ".editorconfig", "project/.gitignore"]) {
      expect(canBridgeFile(name), name).toBe(true);
    }
  });

  it("refuses suffixes nothing here can render", () => {
    for (const name of ["a.qqq", "movie.mp4", "bundle.zip", "db.sqlite", "font.woff2", "src", "a."]) {
      expect(canBridgeFile(name)).toBe(false);
    }
    expect(canBridgeFile("")).toBe(false);
    expect(canBridgeFile("/Users/x/project")).toBe(false);
  });

  it("decides on the basename, not on a dotted directory", () => {
    expect(canBridgeFile("notes.txt.d/a.ts")).toBe(true);
    expect(canBridgeFile("v1.2/report.csv")).toBe(false);
  });
});

describe("focusForFileAddress", () => {
  it("keeps a workspace-relative path relative", () => {
    expect(focusForFileAddress(address("s1", "src/client/a.ts"))).toBe("path:src/client/a.ts:1");
  });

  it("marks a path that starts at the filesystem root as absolute", () => {
    expect(focusForFileAddress(address("s1", "/Users/x/project/a.ts"))).toBe("abs:/Users/x/project/a.ts:1");
  });

  it("prefers the caller's line over the address's own", () => {
    const withQuery = `${address("s1", "src/a.ts")}?line=9`;
    expect(focusForFileAddress(withQuery, 4)).toBe("path:src/a.ts:4");
    expect(focusForFileAddress(withQuery)).toBe("path:src/a.ts:9");
    expect(focusForFileAddress(address("s1", "src/a.ts"), 0)).toBe("path:src/a.ts:1");
  });

  it("decodes escaped segments and keeps a Windows path absolute", () => {
    expect(focusForFileAddress(address("s1", "docs/a b/中文.md"))).toBe("path:docs/a b/中文.md:1");
    expect(focusForFileAddress(address("s1", "C:/work/a.ts"), 3)).toBe("abs:C:/work/a.ts:3");
  });

  it("refuses anything that is not a session file address", () => {
    expect(focusForFileAddress("")).toBeUndefined();
    expect(focusForFileAddress("dsh-resource://file/absolute/Users/x/a.ts")).toBeUndefined();
    expect(focusForFileAddress("dsh-resource://file/session/s1")).toBeUndefined();
    expect(focusForFileAddress("path:src/a.ts")).toBeUndefined();
  });
});

describe("decideBridge", () => {
  it("opens a readable file of the session on screen", () => {
    expect(decideBridge(address("s1", "src/a.ts"), "s1", 12)).toEqual({ action: "open", focus: "path:src/a.ts:12" });
  });

  it("keeps the tab for another session's file", () => {
    expect(decideBridge(address("s2", "src/a.ts"), "s1")).toEqual({ action: "keep", reason: "other-session" });
  });

  it("keeps the tab when there is no session to read through", () => {
    expect(decideBridge(address("s1", "src/a.ts"), undefined)).toEqual({ action: "keep", reason: "no-session" });
  });

  it("keeps the tab when the address is missing or unreadable", () => {
    expect(decideBridge(undefined, "s1")).toEqual({ action: "keep", reason: "no-address" });
    expect(decideBridge("", "s1")).toEqual({ action: "keep", reason: "no-address" });
    expect(decideBridge("not-an-address", "s1")).toEqual({ action: "keep", reason: "not-a-file-address" });
    expect(decideBridge("dsh-resource://file/absolute/Users/x/a.ts", "s1")).toEqual({
      action: "keep",
      reason: "not-a-file-address",
    });
  });

  it("keeps the tab for a format the host renders better", () => {
    // Office documents are the reason this refusal exists: the built-in preview
    // renders them, and forwarding one would open a tab that cannot draw it.
    expect(decideBridge(address("s1", "docs/a.docx"), "s1")).toEqual({ action: "keep", reason: "refused" });
  });
});

describe("forwardFocus", () => {
  function harness(overrides: Partial<BridgeWorkbenchFace> = {}) {
    const requests: string[] = [];
    const taken: string[] = [];
    const closed: string[] = [];
    const workbench: BridgeWorkbenchFace = {
      currentSessionId: () => "s1",
      openViewOrSwitch: () => ({ opened: true, focused: true }),
      viewFocus: {
        request: (view, focus) => requests.push(`${view}|${focus}`),
        take: view => {
          taken.push(view);
          return undefined;
        },
      },
      ...overrides,
    };
    const navigation: SidebarRightFace = { close: tabId => closed.push(tabId) };
    return { workbench, navigation, requests, taken, closed };
  }

  it("queues the focus before switching and drops the copy once delivered", () => {
    const h = harness();
    expect(forwardFocus(h.workbench, h.navigation, "tab-1", "path:src/a.ts:1")).toBe(true);
    expect(h.requests).toEqual(["fs-explorer|path:src/a.ts:1"]);
    expect(h.taken).toEqual(["fs-explorer"]);
    expect(h.closed).toEqual(["tab-1"]);
  });

  it("leaves the queued focus for the view when the switch could not deliver it", () => {
    const h = harness({ openViewOrSwitch: () => ({ opened: true, focused: false }) });
    expect(forwardFocus(h.workbench, h.navigation, "tab-1", "path:src/a.ts:1")).toBe(true);
    // The queue is the only channel left, so it must not be dropped.
    expect(h.taken).toEqual([]);
    expect(h.closed).toEqual(["tab-1"]);
  });

  it("keeps the tab when no seam switches the view", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const h = harness({ openViewOrSwitch: () => ({ opened: false, focused: false }) });
    expect(forwardFocus(h.workbench, h.navigation, "tab-1", "path:src/a.ts:1")).toBe(false);
    expect(h.closed).toEqual([]);
    // Nothing will consume the queued copy, so it must be dropped: a stale focus
    // would otherwise replay the next time the view mounts.
    expect(h.taken).toEqual(["fs-explorer"]);
    expect(String(warn.mock.calls[0]?.[0])).toContain("did not switch");
    warn.mockRestore();
  });

  it("falls back to openView on a core without the newer seam", () => {
    const openView = vi.fn(() => true);
    const h = harness({ openViewOrSwitch: undefined as never, openView });
    expect(forwardFocus(h.workbench, h.navigation, "tab-1", "abs:/a.ts:2")).toBe(true);
    expect(openView).toHaveBeenCalledWith("fs-explorer", "abs:/a.ts:2");
    expect(h.closed).toEqual(["tab-1"]);
  });

  it("survives a tab the reader already closed", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const h = harness();
    const navigation: SidebarRightFace = {
      close: () => {
        throw new Error("no such tab");
      },
    };
    expect(forwardFocus(h.workbench, navigation, "tab-1", "path:src/a.ts:1")).toBe(false);
    expect(String(warn.mock.calls[0]?.[0])).toContain("could not be closed");
    warn.mockRestore();
  });

  it("survives a seam that throws and leaves no stale focus behind", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const h = harness({
      openViewOrSwitch: () => {
        throw new Error("no session on screen");
      },
    });
    expect(forwardFocus(h.workbench, h.navigation, "tab-1", "path:src/a.ts:1")).toBe(false);
    expect(h.closed).toEqual([]);
    expect(h.taken).toEqual(["fs-explorer"]);
    expect(String(warn.mock.calls[0]?.[0])).toContain("threw while switching");
    warn.mockRestore();
  });
});

describe("registerAddressBridge", () => {
  /** A context whose slot runtime and sidebar services are both live. */
  function harness() {
    const types: SidebarRightTabType[] = [];
    const bodies: Array<{ name: string; key: string }> = [];
    const disposals: string[] = [];
    const ctx = {
      slots: {
        inject(_slot: string, factory: () => () => void) {
          return factory();
        },
        register(options: Record<string, unknown>) {
          bodies.push({ name: String(options.name), key: String(options.key) });
          return () => {
            disposals.push("body");
          };
        },
      },
      sidebarRightTabs: {
        register(definition: SidebarRightTabType) {
          types.push(definition);
          return () => {
            disposals.push("type");
          };
        },
      },
      sidebarRight: { close: () => {} },
    };
    const workbench: BridgeWorkbenchFace = {
      currentSessionId: () => "s1",
      openViewOrSwitch: () => ({ opened: true, focused: true }),
    };
    return { ctx, workbench, types, bodies, disposals };
  }

  it("registers the forwarding type and its body under one id", () => {
    const h = harness();
    const dispose = registerAddressBridge(h.ctx, h.workbench);

    expect(h.types).toHaveLength(1);
    const type = h.types[0];
    expect(type?.id).toBe(BRIDGE_TYPE_ID);
    expect(type?.kind).toBe(BRIDGE_KIND);
    expect(type?.patterns).toEqual([BRIDGE_PATTERN]);
    expect(type?.priority).toBe("extension");
    expect(h.bodies).toEqual([{ name: "sidebar.right.pane.tab", key: BRIDGE_TYPE_ID }]);

    dispose();
    expect(h.disposals).toEqual(["body", "type"]);
  });

  it("applies the allow-list to the address the host passes", () => {
    const h = harness();
    registerAddressBridge(h.ctx, h.workbench);
    const canOpen = h.types[0]?.canOpen;
    expect(canOpen?.(address("s1", "src/a.ts"))).toBe(true);
    expect(canOpen?.(address("s1", "/Users/x/a.ts"))).toBe(true);
    expect(canOpen?.(address("s1", "docs/a.docx"))).toBe(false);
    expect(canOpen?.("dsh-resource://file/absolute/Users/x/a.ts")).toBe(false);
    expect(canOpen?.("not-an-address")).toBe(false);
  });

  it("captions the tab with the basename of the address", () => {
    const h = harness();
    registerAddressBridge(h.ctx, h.workbench);
    expect(h.types[0]?.title(address("s1", "src/client/a.ts"))).toBe("a.ts");
  });

  it("stays silent and inert without the right sidebar", () => {
    const slots = { inject: vi.fn(), register: vi.fn() };
    const dispose = registerAddressBridge({ slots }, harness().workbench);
    expect(slots.register).not.toHaveBeenCalled();
    expect(() => dispose()).not.toThrow();
  });

  it("waits for the services through ctx.inject when they mount later", () => {
    const h = harness();
    let run: ((scope: { get(name: string): unknown }) => (() => void) | void) | undefined;
    const ctx = {
      slots: h.ctx.slots,
      inject: (_services: string[], callback: typeof run) => {
        run = callback;
        return () => {};
      },
    };

    registerAddressBridge(ctx as never, h.workbench);
    expect(h.types).toHaveLength(0);

    // The sidebar mounts afterwards; the callback is what registers the bridge.
    run?.({ get: name => (name === "sidebarRightTabs" ? h.ctx.sidebarRightTabs : h.ctx.sidebarRight) });
    expect(h.types).toHaveLength(1);
    expect(h.bodies).toHaveLength(1);
  });

  it("warns once when another extension type already claims the same glob", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const h = harness();
    const rival = { id: "better-sidebar:editor", kind: "editor", priority: "extension", title: () => "editor" };
    const ctx = {
      ...h.ctx,
      sidebarRightTabs: {
        ...h.ctx.sidebarRightTabs,
        candidates: () => [rival, { id: BRIDGE_TYPE_ID, kind: BRIDGE_KIND, priority: "extension", title: () => "" }],
      },
    };

    registerAddressBridge(ctx, h.workbench);

    expect(warn).toHaveBeenCalledTimes(1);
    expect(String(warn.mock.calls[0]?.[0])).toContain("better-sidebar:editor");
    // The registration still happens: a rival is a diagnostic, not a veto.
    expect(h.types).toHaveLength(1);
    warn.mockRestore();
  });

  it("survives a registry that refuses the id", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const h = harness();
    const ctx = {
      ...h.ctx,
      sidebarRightTabs: {
        register: () => {
          throw new Error('duplicate tab type id "dsh-fs-explorer:bridge"');
        },
      },
    };
    expect(() => registerAddressBridge(ctx, h.workbench)).not.toThrow();
    expect(h.bodies).toHaveLength(0);
    warn.mockRestore();
  });

  it("withdraws the tab type when the body slot refuses it", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const h = harness();
    const ctx = {
      ...h.ctx,
      slots: {
        inject: () => {
          throw new Error("the sidebar is not ready for pane bodies");
        },
        register: h.ctx.slots.register,
      },
    };

    const dispose = registerAddressBridge(ctx, h.workbench);

    // The type was registered before the slot threw, so leaving it behind would
    // claim every file address with a body that cannot mount.
    expect(h.types).toHaveLength(1);
    expect(h.disposals).toEqual(["type"]);
    expect(h.bodies).toHaveLength(0);
    expect(() => dispose()).not.toThrow();
    expect(String(warn.mock.calls[0]?.[0])).toContain("refused the address bridge body");
    warn.mockRestore();
  });
});
