/**
 * The terminal renderer chunk: xterm, FitAddon and their stylesheet.
 *
 * This module must stay reachable only through `require.async` — the startup
 * bundle is parsed on every page boot, and shipping half a megabyte of emulator
 * to a reader who never opens a terminal is the whole cost the split avoids.
 *
 * The sheet is injected here rather than shipped as a sibling `.css` file: a
 * plugin is served from a versioned asset route with no stylesheet contract, and
 * a global `<style>` tag removed by the last unmount is the only ownership the
 * chunk can actually enforce.
 */
import { FitAddon } from "@xterm/addon-fit";
import { Terminal, type ITheme } from "@xterm/xterm";
import xtermStyles from "@xterm/xterm/css/xterm.css";
import { useLayoutEffect, useRef } from "react";

import type { TerminalScreenProps } from "../terminal-screen-contract.ts";

/** Built-in stack placed after the user's configured fonts. */
const TERMINAL_FONT_STACK = "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";

/** Style-tag identity; also the key the loader reports in the DOM. */
const STYLE_ID = "dsh-term-dock/xterm.css";

/**
 * The dock's own screen rules.
 *
 * xterm sizes itself from its parent box, so the holder must own the height and
 * keep padding inside it; `overflow: hidden` stops a half-measured fit from
 * spilling a scrollbar into the dock chrome.
 */
const SCREEN_CSS = [
  "[data-workbench-terminal-screen]{box-sizing:border-box;height:100%;min-height:0;padding:6px 8px;overflow:hidden;background:transparent}",
  "[data-workbench-terminal-screen] .xterm{height:100%}",
  "[data-workbench-terminal-screen] .xterm-viewport{background:transparent!important}",
].join("\n");

/** How many mounted screens share the injected sheet. */
let holders = 0;

/**
 * Install xterm's stylesheet once per page and keep it while any screen is mounted.
 * @returns a release callback; the last release removes the tag.
 */
function installTerminalStyles(): () => void {
  if (typeof document === "undefined") return () => {};
  const selector = `style[data-plugin-css="${STYLE_ID}"]`;
  let tag = document.querySelector<HTMLStyleElement>(selector);
  if (tag === null) {
    tag = document.createElement("style");
    tag.dataset.plugin = "dsh-term-dock";
    tag.dataset.pluginCss = STYLE_ID;
    tag.textContent = `${xtermStyles}\n${SCREEN_CSS}`;
    document.head.appendChild(tag);
  }
  holders += 1;
  let released = false;
  return () => {
    if (released) return;
    released = true;
    holders -= 1;
    if (holders <= 0) {
      holders = 0;
      tag?.remove();
    }
  };
}

/**
 * Read the theme colours the dock inherits.
 *
 * The host exposes its palette as custom properties, which is the only stable
 * handle a plugin has on light/dark without importing the theme service. The
 * fallbacks match the harness dark surface so a missing token still yields a
 * readable screen.
 * @param node - the screen holder, which inherits the dock's tokens.
 * @returns an xterm theme.
 */
function readTheme(node: HTMLElement): ITheme {
  const style = getComputedStyle(node);
  const background = style.getPropertyValue("--dsw-alias-bg-base").trim() || "#101014";
  const foreground = style.getPropertyValue("--dsw-alias-label-primary").trim() || style.color || "#e6e6ea";
  return { background, foreground, cursor: foreground };
}

/**
 * Render one terminal panel's screen.
 *
 * The emulator is created once per binding: `binding.attachEmulator` replays the
 * host's pending frame into it and acknowledges every painted revision, which is
 * what keeps the host's backpressure window open.
 * @param props - binding, accessible label and input policy.
 * @returns the holder element xterm draws into.
 */
export function TerminalScreen({ binding, label, readOnly, fontSize = 12 }: TerminalScreenProps) {
  const holder = useRef<HTMLDivElement | null>(null);
  const emulator = useRef<Terminal | null>(null);
  const measureRef = useRef<() => void>(() => {});
  const grid = useRef({ cols: 0, rows: 0 });

  useLayoutEffect(() => {
    const node = holder.current;
    if (node === null) return undefined;
    const releaseStyles = installTerminalStyles();
    const terminal = new Terminal({
      fontSize,
      fontFamily: TERMINAL_FONT_STACK,
      cursorBlink: true,
      minimumContrastRatio: 4.5,
      scrollback: binding.state.getSnapshot().environment?.scrollback ?? 1000,
      theme: readTheme(node),
    });
    const addon = new FitAddon();
    terminal.loadAddon(addon);
    terminal.open(node);
    terminal.textarea?.setAttribute("aria-label", label);
    emulator.current = terminal;

    const input = terminal.onData(data => binding.input(data));
    const render = binding.attachEmulator({
      write: (data, done) => terminal.write(data, done),
      reset: (cols, rows) => {
        terminal.reset();
        terminal.resize(cols, rows);
        grid.current = { cols, rows };
      },
    });

    const measure = (): void => {
      const proposed = addon.proposeDimensions();
      if (proposed === undefined) return;
      if (grid.current.cols === proposed.cols && grid.current.rows === proposed.rows) return;
      const applied = binding.fit(proposed.cols, proposed.rows);
      if (applied === undefined) return;
      grid.current = { cols: applied.cols, rows: applied.rows };
      terminal.resize(applied.cols, applied.rows);
    };
    measureRef.current = measure;

    const observer = typeof ResizeObserver === "function" ? new ResizeObserver(() => measure()) : undefined;
    observer?.observe(node);
    // A view only becomes resizable once the shell is writable, so the state
    // stream is the second half of the measurement trigger.
    const unsubscribe = binding.state.subscribe(() => {
      if (binding.state.getSnapshot().writable === true) measure();
    });
    measure();

    // The dock has no theme service of its own: the host flips light/dark by
    // rewriting tokens on the root element, so the palette has to be re-read
    // whenever that happens or a terminal keeps yesterday's colours.
    const repaint = (): void => {
      terminal.options.theme = readTheme(node);
    };
    const themeWatcher =
      typeof MutationObserver === "function" ? new MutationObserver(repaint) : undefined;
    themeWatcher?.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "style", "data-theme", "data-color-scheme"],
    });

    return () => {
      observer?.disconnect();
      themeWatcher?.disconnect();
      unsubscribe();
      render();
      input.dispose();
      terminal.dispose();
      emulator.current = null;
      measureRef.current = () => {};
      grid.current = { cols: 0, rows: 0 };
      releaseStyles();
    };
  }, [binding]);

  useLayoutEffect(() => {
    emulator.current?.textarea?.setAttribute("aria-label", label);
  }, [label]);

  useLayoutEffect(() => {
    const terminal = emulator.current;
    if (terminal === null) return;
    if (terminal.options.fontSize === fontSize) return;
    terminal.options.fontSize = fontSize;
    measureRef.current();
  }, [fontSize]);

  useLayoutEffect(() => {
    const terminal = emulator.current;
    if (terminal === null) return;
    terminal.options.disableStdin = readOnly;
  }, [readOnly]);

  return <div ref={holder} data-workbench-terminal-screen={label} />;
}
