/**
 * The focus command's contract with the host, pinned where it can fail silently.
 *
 * Nothing here needs a browser or a running Harness: what these cases protect is
 * the shape the host *validates* and the decisions the resolver *refuses*. The
 * expensive failure they prevent is a registration the host throws away — the
 * command then never reaches 设置 → 快捷键, and a chord that silently does
 * nothing is indistinguishable from a broken build.
 */
import { describe, expect, it, vi } from "vitest";

import { DICTIONARIES } from "../src/client/dictionaries.ts";
import {
  COMPOSER_SELECTOR,
  FOCUS_ALIASES,
  FOCUS_COMMAND_ID,
  FOCUS_DEFAULTS,
  FOCUS_LABEL_KEY,
  FOCUS_REGIONS,
  composerMounted,
  createFocusResolver,
  focusCommandSpec,
  focusComposerFor,
  readCurrentSessionId,
  registerFocusCommand,
  type FocusBinding,
  type FocusCommandDeps,
  type FocusCommandRegistration,
  type FocusProfile,
  type ShortcutRegistryLike,
} from "../src/client/focus.ts";

/**
 * The host's `commandPattern` for command ids, copied from the shortcut
 * service's configuration module. A rejected id is a thrown registration, so
 * this is a hard contract rather than a naming preference.
 */
const HOST_COMMAND_PATTERN = /^[a-z][a-zA-Z0-9-]*(?:\.[a-zA-Z][a-zA-Z0-9-]*)+$/u;

/** Every profile the host resolves a default for. */
const PROFILES: readonly FocusProfile[] = [
  "desktop:macos",
  "desktop:windows",
  "desktop:linux",
  "web:macos",
  "web:windows",
  "web:linux",
];

/**
 * The host's admissible web shape, for the branches this command uses.
 *
 * Windows and macOS Web admit any three-or-four-modifier chord, the three fixed
 * combinations, `primary+(alt|shift)` pairs, and a short single-modifier list.
 * `Space` is only reachable through the two-modifier branch, which is the one
 * asserted here; a single-modifier `Space` is rejected as `reserved` before the
 * browser check even runs.
 */
function webAdmissible(binding: FocusBinding): boolean {
  const modifiers = binding.modifiers;
  if (modifiers.length >= 3) return true;
  if (modifiers.length !== 2) return false;
  if (!modifiers.includes("primary")) return false;
  return modifiers.includes("alt") || modifiers.includes("shift");
}

/** A deps bundle whose every answer the case overrides. */
function deps(overrides: Partial<FocusCommandDeps> = {}): FocusCommandDeps {
  return {
    currentSessionId: () => "session-1",
    composerMounted: () => true,
    focusComposer: () => true,
    ...overrides,
  };
}

describe("focus command identity", () => {
  it("satisfies the host's command pattern", () => {
    expect(HOST_COMMAND_PATTERN.test(FOCUS_COMMAND_ID)).toBe(true);
  });

  it("carries search aliases so the dialog can find it by English words", () => {
    expect(FOCUS_ALIASES.length).toBeGreaterThan(0);
    expect(FOCUS_ALIASES.every(alias => alias.trim() === alias && alias !== "")).toBe(true);
  });

  it("fires from the page, from editors and from a terminal", () => {
    expect([...FOCUS_REGIONS]).toEqual(["page", "editable", "terminal"]);
  });
});

describe("focus defaults", () => {
  it("declares only real host profiles", () => {
    for (const profile of Object.keys(FOCUS_DEFAULTS)) {
      expect(PROFILES).toContain(profile as FocusProfile);
    }
  });

  it("gives desktop macOS the bare ⌘Space the feature is for", () => {
    expect(FOCUS_DEFAULTS["desktop:macos"]).toEqual({ code: "Space", modifiers: ["primary"] });
  });

  it("keeps every web default inside the host's admissible web shapes", () => {
    for (const profile of PROFILES.filter(entry => entry.startsWith("web:"))) {
      const binding = FOCUS_DEFAULTS[profile];
      if (binding === undefined) continue;
      expect(webAdmissible(binding)).toBe(true);
    }
  });

  it("leaves Linux unbound, because the host reserves Space there", () => {
    // Verified against the host's own `bindingIssue`: both `desktop:linux` and
    // `web:linux` answer `reserved` for any Space chord, and `register` throws
    // on a reserved default. Shipping one would take the command out entirely.
    expect(FOCUS_DEFAULTS["desktop:linux"]).toBeUndefined();
    expect(FOCUS_DEFAULTS["web:linux"]).toBeUndefined();
  });

  it("binds the same physical key everywhere it is bound", () => {
    for (const binding of Object.values(FOCUS_DEFAULTS)) {
      expect(binding?.code).toBe("Space");
    }
  });
});

describe("composerMounted", () => {
  it("is false without a document", () => {
    expect(composerMounted(undefined)).toBe(false);
  });

  it("is false when the composer is not in the tree", () => {
    expect(composerMounted({ querySelector: () => null })).toBe(false);
  });

  it("is true when the editable host answers the selector", () => {
    const seen: string[] = [];
    const mounted = composerMounted({
      querySelector: selector => {
        seen.push(selector);
        return {};
      },
    });
    expect(mounted).toBe(true);
    expect(seen).toEqual([COMPOSER_SELECTOR]);
  });

  it("probes the host marker and the structural textbox pair together", () => {
    expect(COMPOSER_SELECTOR).toContain("[data-composer-input]");
    expect(COMPOSER_SELECTOR).toContain("[role='textbox'][aria-multiline='true']");
  });
});

describe("createFocusResolver", () => {
  it("passes while a dialog owns the keyboard", () => {
    const focusComposer = vi.fn(() => true);
    const resolve = createFocusResolver(deps({ focusComposer }));
    expect(resolve({ modal: "settings" })).toEqual({ status: "pass" });
    expect(focusComposer).not.toHaveBeenCalled();
  });

  it("passes when the composer is off screen", () => {
    const resolve = createFocusResolver(deps({ composerMounted: () => false }));
    expect(resolve({ modal: null })).toEqual({ status: "pass" });
  });

  it("passes when no conversation is active", () => {
    const resolve = createFocusResolver(deps({ currentSessionId: () => undefined }));
    expect(resolve({ modal: null })).toEqual({ status: "pass" });
  });

  it("handles the chord and focuses the session the user is looking at", () => {
    const focusComposer = vi.fn(() => true);
    const resolve = createFocusResolver(deps({ currentSessionId: () => "session-7", focusComposer }));
    const resolution = resolve({ modal: null });
    expect(resolution.status).toBe("handled");
    if (resolution.status !== "handled") throw new Error("unreachable");
    resolution.run();
    expect(focusComposer).toHaveBeenCalledTimes(1);
    expect(focusComposer).toHaveBeenCalledWith("session-7");
  });

  it("reads the host facts at dispatch time, not at build time", () => {
    let session: string | undefined;
    const focusComposer = vi.fn(() => true);
    const resolve = createFocusResolver(deps({ currentSessionId: () => session, focusComposer }));
    expect(resolve({ modal: null }).status).toBe("pass");
    session = "session-late";
    const resolution = resolve({ modal: null });
    expect(resolution.status).toBe("handled");
    if (resolution.status !== "handled") throw new Error("unreachable");
    resolution.run();
    expect(focusComposer).toHaveBeenCalledWith("session-late");
  });
});

describe("focusCommandSpec", () => {
  it("states the modal intent twice: empty list and resolver guard", () => {
    const spec = focusCommandSpec(deps(), () => "聚焦输入框");
    expect(spec.modals).toEqual([]);
    expect(spec.resolve({ modal: "approval" })).toEqual({ status: "pass" });
  });

  it("resolves the label on every read", () => {
    let language = "zh";
    const spec = focusCommandSpec(deps(), () => (language === "zh" ? "聚焦输入框" : "Focus message input"));
    expect(spec.label()).toBe("聚焦输入框");
    language = "en";
    expect(spec.label()).toBe("Focus message input");
  });
});

describe("registerFocusCommand", () => {
  it("does nothing without a registry", () => {
    expect(() => registerFocusCommand(undefined, deps(), () => "label")()).not.toThrow();
  });

  it("registers one command and forwards the disposer", () => {
    const dispose = vi.fn();
    const registered: FocusCommandRegistration[] = [];
    const shortcuts: ShortcutRegistryLike = {
      register: command => {
        registered.push(command);
        return dispose;
      },
    };
    const disposer = registerFocusCommand(shortcuts, deps(), () => "label");
    expect(registered).toHaveLength(1);
    const command = registered[0];
    expect(command?.id).toBe(FOCUS_COMMAND_ID);
    expect(command?.defaults).toBe(FOCUS_DEFAULTS);
    expect(command?.label()).toBe("label");
    disposer();
    expect(dispose).toHaveBeenCalledTimes(1);
  });

  it("reports a rejected registration instead of throwing into the mount", () => {
    const onError = vi.fn();
    const shortcuts: ShortcutRegistryLike = {
      register: () => {
        throw new Error("Reserved shortcut default: better.focusComposer");
      },
    };
    const disposer = registerFocusCommand(shortcuts, deps(), () => "label", onError);
    expect(onError).toHaveBeenCalledWith("Reserved shortcut default: better.focusComposer");
    expect(() => disposer()).not.toThrow();
  });
});

describe("readCurrentSessionId", () => {
  it("prefers the mounted uiSession selection", () => {
    const ctx = {
      get: (name: string) =>
        name === "uiSession" ? { adapter: { current: { getSnapshot: () => ({ key: "ui-session" }) } } } : undefined,
    };
    expect(readCurrentSessionId(ctx)).toBe("ui-session");
  });

  it("treats a present selection with no key as no conversation", () => {
    const ctx = {
      get: (name: string) => {
        if (name === "uiSession") return { adapter: { current: { getSnapshot: () => ({ key: "" }) } } };
        if (name === "sessions") return { list: { getSnapshot: () => ({ current: "retained" }) } };
        return undefined;
      },
    };
    expect(readCurrentSessionId(ctx)).toBeUndefined();
  });

  it("falls back to the sessions list on an older host", () => {
    const ctx = {
      get: (name: string) => (name === "sessions" ? { list: { getSnapshot: () => ({ current: "listed" }) } } : undefined),
    };
    expect(readCurrentSessionId(ctx)).toBe("listed");
  });

  it("answers undefined for a plain object with no host services", () => {
    expect(readCurrentSessionId({})).toBeUndefined();
    expect(readCurrentSessionId(undefined)).toBeUndefined();
  });
});

describe("focusComposerFor", () => {
  it("delivers the focus through the conversation input face", () => {
    const focus = vi.fn();
    const actx = {
      get: (name: string) => (name === "conversation" ? { input: { for: () => ({ focus }) } } : undefined),
    };
    const ctx = { sessions: { scope: (id: string) => (id === "session-1" ? actx : undefined) } };
    expect(focusComposerFor(ctx, "session-1")).toBe(true);
    expect(focus).toHaveBeenCalledTimes(1);
  });

  it("answers false when the session scope is gone", () => {
    const ctx = { sessions: { scope: () => undefined } };
    expect(focusComposerFor(ctx, "session-1")).toBe(false);
  });

  it("answers false when the conversation service is absent", () => {
    const ctx = { sessions: { scope: () => ({ get: () => undefined }) } };
    expect(focusComposerFor(ctx, "session-1")).toBe(false);
  });

  it("answers false instead of throwing when the host refuses the scope", () => {
    const ctx = {
      sessions: {
        scope: () => ({
          get: () => ({
            input: {
              for: () => {
                throw new Error("conversation.input.for requires a retained Session scope");
              },
            },
          }),
        }),
      },
    };
    expect(focusComposerFor(ctx, "session-1")).toBe(false);
  });

  it("answers false when the host has no session service at all", () => {
    expect(focusComposerFor({}, "session-1")).toBe(false);
  });
});

describe("command label", () => {
  it("exists in every dictionary, so the catalog never prints the raw key", () => {
    for (const [locale, dictionary] of Object.entries(DICTIONARIES)) {
      const text = dictionary[FOCUS_LABEL_KEY];
      expect(text, `${locale} is missing ${FOCUS_LABEL_KEY}`).toBeTypeOf("string");
      expect(text?.trim()).not.toBe("");
    }
  });

  it("is translated rather than copied between locales", () => {
    expect(DICTIONARIES.zh?.[FOCUS_LABEL_KEY]).not.toBe(DICTIONARIES.en?.[FOCUS_LABEL_KEY]);
  });
});
