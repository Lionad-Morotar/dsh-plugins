/**
 * The settings page: pick a scene, see it, tune it.
 *
 * The page is the only place this plugin spends React. It draws one contact
 * sheet of every scene the catalog knows, a live preview of the current one, and
 * the two switches a background actually needs (whether it moves, and how
 * strongly the panels cover it). Everything finer lives in the tuning panel.
 *
 * The preview is a real mounted canvas rather than an image: the catalog ships
 * no renders, a live thumbnail of a scene is a few thousand cells, and
 * previewing through the same renderer the background uses is the only way the
 * thumbnail can be trusted to match it.
 */
import type { ReactNode } from "react";

import type { SceneEntry, SceneModule, Settings } from "ascii-rest-scenes";
import { sceneGround, scenePalette } from "ascii-rest-scenes";

import { mount } from "../mount.ts";

/** The copy the page renders, one dictionary per language. */
export interface PageCopy {
  title: string;
  note: string;
  previewFailed: string;
  play: string;
  pause: string;
  reset: string;
  openPanel: string;
  credit: string;
  scenes: string;
  /** The settings navigation label, which is the page's title in a narrower frame. */
  navLabel: string;
}

/** The slice of React this page uses; the rest comes from the host. */
export interface PageReact {
  createElement(type: unknown, props?: unknown, ...children: ReactNode[]): ReactNode;
  useRef<T>(initial: T): { current: T };
  useState<T>(initial: T): [T, (next: T) => void];
  useEffect(effect: () => void | (() => void), deps?: readonly unknown[]): void;
}

export interface PageProps {
  catalog: readonly SceneEntry[];
  settings: Settings;
  /** Load one scene's module, so the preview plays exactly what the background will. */
  loadPreview(sceneId: string): Promise<SceneModule>;
  onScene(sceneId: string): void;
  onAppearance(change: Partial<Settings["appearance"]>): void;
  onOpenPanel(): void;
  onReset(): void;
  copy: PageCopy;
  React: PageReact;
}

/** The palette strip a card shows: the one thumbnail that costs nothing to draw. */
function Swatch({ palette, React }: { palette: readonly string[]; React: PageReact }): ReactNode {
  // Six steps spread across the palette, so the strip shows its range rather than
  // its first six near-identical darks.
  const steps =
    palette.length <= 6
      ? palette
      : Array.from({ length: 6 }, (_, index) => palette[Math.round((index * (palette.length - 1)) / 5)] ?? "#000000");
  return React.createElement(
    "div",
    { className: "ascii-rest-swatch", "aria-hidden": "true" },
    ...steps.map((colour, index) => React.createElement("span", { key: index, style: { backgroundColor: colour } })),
  );
}

/** The attribute the shell flips to say the dark theme is live. */
const DARK_ATTRIBUTE = "data-ds-dark-theme";

/**
 * The live preview: a mounted scene, re-mounted whenever the scene, the scheme
 * or the palette options change.
 *
 * It paints with the same palette the background does, including the light-mode
 * flip, so the thumbnail is not a picture of a different skin. The scheme is read
 * from the DOM and watched, because the theme can change while this page is open.
 */
function Preview(props: {
  scene: SceneEntry;
  options: Settings["options"];
  loadPreview: PageProps["loadPreview"];
  copy: PageCopy;
  React: PageReact;
}): ReactNode {
  const { React, scene, copy, loadPreview, options } = props;
  const host = React.useRef<HTMLDivElement | null>(null);
  const [failed, setFailed] = React.useState(false);
  const [dark, setDark] = React.useState<boolean>(document.body.hasAttribute(DARK_ATTRIBUTE));

  React.useEffect(() => {
    const observer = new MutationObserver(() => setDark(document.body.hasAttribute(DARK_ATTRIBUTE)));
    observer.observe(document.body, { attributes: true, attributeFilter: [DARK_ATTRIBUTE] });
    return () => observer.disconnect();
  }, []);

  React.useEffect(() => {
    const element = host.current;
    if (element === null) return;
    let cancelled = false;
    let stop: (() => void) | null = null;
    element.replaceChildren();
    setFailed(false);

    const canvas = document.createElement("canvas");
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    element.append(canvas);

    void loadPreview(scene.id)
      .then((module) => {
        if (cancelled) return;
        const scheme: "light" | "dark" = dark ? "dark" : "light";
        // A still frame is enough here: the preview's job is to show what the
        // picture looks like, not to compete with the background for frames.
        stop = mount(
          canvas,
          {
            meta: {
              ...module.meta,
              palette: scenePalette(scene.palette, scheme, options),
              // The ground is a colour, not a variable: the renderer fills the
              // canvas with it before drawing, so a scene mounted with the dark
              // ground on a light page paints a black tile.
              ground: sceneGround(scene.ground, scheme, options),
            },
            default: module.default,
          },
          { fps: 0, motion: true },
        );
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });

    return () => {
      cancelled = true;
      stop?.();
      element.replaceChildren();
    };
    // `options` is a flat record of primitives, so its fields are the identity
    // that matters; comparing the object would remount on every unrelated change.
  }, [scene.id, dark, options.softness, options.saturation, loadPreview]);

  return React.createElement(
    "div",
    { className: "ascii-rest-preview" },
    React.createElement("div", { ref: host, style: { position: "absolute", inset: "0" } }),
    React.createElement(
      "div",
      { className: "ascii-rest-preview__meta" },
      React.createElement("strong", null, scene.name),
      React.createElement("span", null, `${String(scene.cols)}×${String(scene.rows)}`),
    ),
    failed ? React.createElement("p", { className: "ascii-rest-preview__error" }, copy.previewFailed) : null,
  );
}

export function AsciiRestSettingsPage(props: PageProps): ReactNode {
  const { React, catalog, settings, copy } = props;
  const current = catalog.find((scene) => scene.id === settings.scene) ?? catalog[0];

  const actions = React.createElement(
    "div",
    { className: "ascii-rest-actions" },
    React.createElement(
      "button",
      { type: "button", className: "ascii-rest-button ascii-rest-button--primary", onClick: props.onOpenPanel },
      copy.openPanel,
    ),
    React.createElement(
      "button",
      {
        type: "button",
        className: "ascii-rest-button",
        onClick: () => props.onAppearance({ still: !settings.appearance.still }),
      },
      settings.appearance.still ? copy.play : copy.pause,
    ),
    React.createElement("button", { type: "button", className: "ascii-rest-button", onClick: props.onReset }, copy.reset),
  );

  const header = React.createElement(
    "header",
    { className: "ascii-rest-page__head" },
    React.createElement("h3", { className: "ascii-rest-page__title" }, copy.title),
    React.createElement("p", { className: "ascii-rest-page__note" }, copy.note),
  );

  const grid = React.createElement(
    "div",
    { className: "ascii-rest-grid", role: "group", "aria-label": copy.scenes },
    ...catalog.map((scene) =>
      React.createElement(
        "button",
        {
          key: scene.id,
          type: "button",
          className: "ascii-rest-card",
          "aria-pressed": scene.id === settings.scene,
          onClick: () => props.onScene(scene.id),
        },
        React.createElement(Swatch, { palette: scenePalette(scene.palette, "dark"), React }),
        React.createElement("span", { className: "ascii-rest-card__name" }, scene.name),
        React.createElement("span", { className: "ascii-rest-card__note" }, scene.note),
      ),
    ),
  );

  const credit = React.createElement(
    "p",
    { className: "ascii-rest-credit" },
    `${copy.credit} `,
    React.createElement("a", { href: "https://ascii.rest/", target: "_blank", rel: "noreferrer noopener" }, "ascii.rest"),
  );

  return React.createElement(
    "div",
    { className: "ascii-rest-page" },
    header,
    current === undefined
      ? null
      : React.createElement(Preview, { scene: current, options: settings.options, loadPreview: props.loadPreview, copy, React }),
    actions,
    grid,
    credit,
  );
}
