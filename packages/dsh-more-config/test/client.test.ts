/**
 * Client-half delivery contracts, renderer-free like the sibling packages.
 *
 * The section's markup is a React tree, but everything it decides from data —
 * which constants the registration carries, that both dictionaries cover the
 * same keys, that the presets are sane and ordered by the races they fix — is
 * pure, and so is the loader-mount shape of the built client half.
 */
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { LOCALE_NAMESPACE, PRESETS, SECTION_ID, SECTION_ORDER, SECTION_SLOT, SETTINGS_NAMESPACE } from "../src/client/registration.ts";
import { EN, ZH } from "../src/client/copy.ts";
import { MIN_TIMEOUT_MS } from "../src/shadow.ts";
import { clientPlugin, inject, resolveKit } from "../src/client/entry.ts";

const here = dirname(fileURLToPath(import.meta.url));
const packageRoot = join(here, "..");

describe("registration", () => {
  it("registers into the settings nav under the mcp id and its own namespace", () => {
    expect(SECTION_SLOT).toBe("settings.section");
    expect(SECTION_ID).toBe("mcp");
    expect(SECTION_ORDER).toBeGreaterThanOrEqual(0);
    expect(SETTINGS_NAMESPACE).toBe("more-config");
    expect(LOCALE_NAMESPACE).toBe("more-config");
  });

  it("ships presets that satisfy the floor and encode the observed races", () => {
    expect(PRESETS.length).toBeGreaterThanOrEqual(2);
    for (const preset of PRESETS) {
      expect(preset.entryId.length).toBeGreaterThan(0);
      expect(preset.timeoutMs).toBeGreaterThanOrEqual(MIN_TIMEOUT_MS);
    }
    const video = PRESETS.find(preset => preset.key === "kimi-video");
    const image = PRESETS.find(preset => preset.key === "kimi-image");
    expect(video?.timeoutMs).toBe(660_000);
    expect(image?.timeoutMs).toBe(360_000);
    expect(video && image && video.timeoutMs > image.timeoutMs).toBe(true);
  });

  it("covers the same keys in both dictionaries, presets included", () => {
    const zhKeys = Object.keys(ZH).sort();
    const enKeys = Object.keys(EN).sort();
    expect(enKeys).toEqual(zhKeys);
    for (const preset of PRESETS) {
      expect(zhKeys).toContain(preset.labelKey);
    }
  });
});

describe("client entry", () => {
  it("declares the services the panel reads", () => {
    expect(inject).toEqual(["slots", "locale", "configForms"]);
    expect(clientPlugin.name).toBe("dsh-more-config");
    expect(clientPlugin.inject).toBe(inject);
    expect(typeof clientPlugin.apply).toBe("function");
  });

  it("refuses a partial platform kit instead of mounting a broken section", () => {
    expect(resolveKit(null)).toBeUndefined();
    const broken = (specifier: string) => (specifier === "@deepseek-ai/dsh-client-ui-primitives" ? { SettingsForm: () => null } : undefined);
    expect(resolveKit(broken)).toBeUndefined();
  });

  it("accepts the platform's forwardRef primitives, which are objects not functions", () => {
    // The live seed ships Button and Input as forwardRef exotic components:
    // runtime objects with a $$typeof symbol marker. A typeof-function check
    // silently refused them and the section never mounted — the regression
    // this test locks.
    const forwardRef = () => ({ $$typeof: Symbol("react.forward_ref"), render: () => null });
    const seed = {
      SettingsForm: () => null,
      SettingsValueField: () => null,
      Button: forwardRef(),
      Input: forwardRef(),
    };
    const require = (specifier: string) => (specifier === "@deepseek-ai/dsh-client-ui-primitives" ? seed : undefined);
    const kit = resolveKit(require);
    expect(kit).toBeDefined();
    expect(kit?.Button).toBe(seed.Button);
    expect(kit?.Input).toBe(seed.Input);
  });

  it("delivers the browser half in a ModuleLoader factory keyed by package name", () => {
    const bundle = readFileSync(join(packageRoot, "lib", "client.js"), "utf8");
    expect(bundle).toContain('window.__ModuleLoader__.load({');
    expect(bundle).toContain('"dsh-more-config"');
    expect(bundle).toContain("module.exports.boot(require)");
  });
});
