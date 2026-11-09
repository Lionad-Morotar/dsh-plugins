/**
 * The board mounted outside the host, for looking at it.
 *
 * The tab normally lives inside a DSH profile, which means installing the
 * plugin and restarting the host to see a colour change. This entry renders the
 * same view against the same committed snapshot in a plain page, so the board
 * can be opened, screenshotted and compared without any of that.
 *
 * It is a preview, not a second implementation: the view, the stylesheet and the
 * snapshot are the shipped ones. The only things this file supplies are the
 * three seams the host would otherwise provide — the locale-bound strings, the
 * snapshot loader, and the theme attribute on `body`.
 */
import { createRoot } from "react-dom/client";

import snapshotData from "./data/snapshot.json" with { type: "json" };
import { ensureStyles } from "./styles.ts";
import { createTestboardView, type TestboardViewStrings } from "./view.tsx";
import type { TestSnapshot } from "./model.ts";

/** The attribute the host writes on `body` to select the dark palette. */
const DARK_ATTRIBUTE = "data-ds-dark-theme";

/** The host's own default type scale, so the preview matches what users see. */
const HOST_DEFAULTS = "--dsh-content-font-size: 14px; --dsh-code-font-size: 11px;";

/** Strings the preview binds; the same keys the entry resolves through `t`. */
const STRINGS: TestboardViewStrings = {
  title: "测试",
  subtitle: "dsh-plugins · pnpm test",
  ago: "2m ago",
  passed: "passed",
  failed: "failed",
  took: "耗时",
  filterAll: "全部",
  filterFailed: "失败",
  searchPlaceholder: "搜索文件名",
  sortFailFirst: "失败优先",
  sortSlowFirst: "耗时优先",
  peak: "peak",
  perSecond: "/s",
  empty: "没有匹配的测试文件。",
  cases: "用例",
  detailHint: "点击行展开用例",
};

/**
 * Read the requested theme from the query string.
 *
 * Dark is the default because it is the board's primary look; `?theme=light` is
 * the exception a reader asks for.
 * @param search - the page's query string.
 * @returns the theme to apply.
 */
function requestedTheme(search: string): "dark" | "light" {
  const value = new URLSearchParams(search).get("theme");
  return value === "light" ? "light" : "dark";
}

/**
 * Apply a theme the way the host does, by writing the body attribute.
 *
 * The view observes that attribute, so this is not a preview-only path: it is
 * the same signal the host sends.
 * @param theme - the theme to apply.
 */
function applyTheme(theme: "dark" | "light"): void {
  if (theme === "dark") document.body.setAttribute(DARK_ATTRIBUTE, "");
  else document.body.removeAttribute(DARK_ATTRIBUTE);
}

/**
 * Wire the theme switch in the page's own bottom bar.
 *
 * The control lives outside the board rather than floating over it: a fixed
 * button covered a file row in the corner, and this page's whole job is to show
 * the board unobstructed.
 */
function wireThemeToggle(): void {
  const button = document.getElementById("theme-toggle");
  if (button === null) return;
  button.addEventListener("click", () => {
    applyTheme(document.body.hasAttribute(DARK_ATTRIBUTE) ? "light" : "dark");
  });
}

/**
 * Mount the board into the page.
 * @param host - the element the board renders into.
 * @param snapshot - the committed snapshot to render.
 */
function mount(host: HTMLElement, snapshot: TestSnapshot): void {
  ensureStyles();
  const View = createTestboardView({ strings: STRINGS, loadSnapshot: async () => snapshot });
  createRoot(host).render(<View />);
}

const host = document.getElementById("root");
if (host === null) throw new Error("preview: #root is missing");

applyTheme(requestedTheme(window.location.search));
mount(host, snapshotData as unknown as TestSnapshot);
wireThemeToggle();

// The page carries its own type scale; the host normally publishes these on the
// document root, and without them the board would fall back to its own defaults
// and stop matching the real tab's proportions.
document.documentElement.style.cssText = HOST_DEFAULTS;
