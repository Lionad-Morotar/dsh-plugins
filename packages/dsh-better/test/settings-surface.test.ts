/**
 * The settings dialog's opaque surface, pinned at the two decisions that matter.
 *
 * The sheet has one job: repaint the dialog's panel with the same colour the
 * skin published, minus the alpha. What is worth guarding is that the repaint
 * keeps the token as its colour source (so themes and scenes survive) and that
 * the seam is the host's stable data attribute rather than a hashed class that
 * changes per build. Everything else — idempotency, teardown — follows the same
 * contract every other sheet in this package holds.
 */
import { describe, expect, it } from "vitest";

import {
  SETTINGS_PANEL_SELECTOR,
  SETTINGS_SURFACE_CSS,
  installSettingsSurfaceStyles,
} from "../src/client/settings-surface.ts";

/** A document that records the sheets appended to its head. */
function fakeDocument(existing: readonly string[] = []): Document & {
  sheets: { id: string; textContent: string }[];
} {
  const sheets: { id: string; textContent: string }[] = [];
  return {
    sheets,
    head: {
      append(element: { id: string; textContent: string }) {
        sheets.push(element);
      },
    },
    getElementById: (id: string) =>
      (existing.includes(id) ? { id } : sheets.find(sheet => sheet.id === id) ?? null) as Element | null,
    createElement: () => ({ id: "", textContent: "", remove() {} }),
  } as unknown as Document & { sheets: { id: string; textContent: string }[] };
}

describe("settings surface", () => {
  it("addresses the host's own dialog marker, not a hashed class", () => {
    // The panel's CSS-module class changes per build; the data attribute is the
    // stable spelling the host's shortcut router already keys off.
    expect(SETTINGS_PANEL_SELECTOR).toBe('[data-shortcut-modal="settings"]');
    expect(SETTINGS_SURFACE_CSS).toContain(SETTINGS_PANEL_SELECTOR);
  });

  it("keeps the token as the hue and only removes the alpha", () => {
    // The first declaration is the no-op fallback for engines without relative
    // colour syntax; the second is the whole feature. Dropping either half would
    // either change nothing or paint a colour the skin no longer controls.
    expect(SETTINGS_SURFACE_CSS).toMatch(/background:\s*var\(--dsw-alias-bg-layer-2\);/u);
    expect(SETTINGS_SURFACE_CSS).toMatch(
      /background:\s*rgb\(from var\(--dsw-alias-bg-layer-2\) r g b \/ 1\);/u,
    );
  });

  it("installs one sheet under a stable id, once per document", () => {
    const doc = fakeDocument();
    const remove = installSettingsSurfaceStyles(doc);
    installSettingsSurfaceStyles(doc);
    expect(doc.sheets).toHaveLength(1);
    remove();
    expect(doc.sheets[0]?.id).toBe("dsh-better-settings-surface");
  });

  it("does not reinstall over a sheet a previous mount left behind", () => {
    // A profile reload re-applies the plugin while the document survives; the
    // id, not module state, is what keeps the copy count at one.
    const doc = fakeDocument(["dsh-better-settings-surface"]);
    installSettingsSurfaceStyles(doc);
    expect(doc.sheets).toHaveLength(0);
  });

  it("does nothing without a document", () => {
    expect(() => installSettingsSurfaceStyles(undefined)).not.toThrow();
  });
});
