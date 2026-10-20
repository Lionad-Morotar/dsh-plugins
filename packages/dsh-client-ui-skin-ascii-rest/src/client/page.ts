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

import type { Anchor, FitMode, RegionKey, SceneEntry, SceneModule, Settings } from "ascii-rest-scenes";
import { ANCHORS, FIT_MODES, REGION_KEYS, sceneGround, scenePalette } from "ascii-rest-scenes";

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
  /** The accessible name of the tuning panel's close control. */
  closePanel: string;
  placement: string;
  placementNote: string;
  fit: string;
  fitCover: string;
  fitContain: string;
  anchor: string;
  anchorTopLeft: string;
  anchorTop: string;
  anchorTopRight: string;
  anchorLeft: string;
  anchorCenter: string;
  anchorRight: string;
  anchorBottomLeft: string;
  anchorBottom: string;
  anchorBottomRight: string;
  zoom: string;
  regions: string;
  regionsNote: string;
  regionSidebar: string;
  regionMain: string;
  regionRightbar: string;
  regionBottom: string;
  scrim: string;
  scrimNote: string;
  scrimStrength: string;
  scrimAngle: string;
  pauseOnBlur: string;
  pauseOnBlurNote: string;
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
  onPlacement(change: Partial<Settings["options"]>): void;
  onRegions(change: Partial<Settings["regions"]>): void;
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

  // One labelled row per control. The page stays a form only where a form is
  // genuinely better than the panel: four region sliders and a fit/anchor pair
  // are the settings a reader changes and then leaves alone, so they belong here
  // rather than behind a floating panel.
  const row = (label: string, control: ReactNode, hint?: string): ReactNode =>
    React.createElement(
      "label",
      { className: "ascii-rest-field" },
      React.createElement(
        "span",
        { className: "ascii-rest-field__text" },
        React.createElement("span", { className: "ascii-rest-field__label" }, label),
        hint === undefined ? null : React.createElement("span", { className: "ascii-rest-field__hint" }, hint),
      ),
      control,
    );

  const pick = (values: readonly string[], labels: Record<string, string>, current: string, onPick: (value: string) => void): ReactNode =>
    React.createElement(
      "div",
      { className: "ascii-rest-chips", role: "group" },
      ...values.map((value) =>
        React.createElement(
          "button",
          {
            key: value,
            type: "button",
            className: "ascii-rest-chip",
            "aria-pressed": value === current,
            onClick: () => onPick(value),
          },
          labels[value] ?? value,
        ),
      ),
    );

  const anchorLabels: Record<string, string> = {
    "top-left": copy.anchorTopLeft,
    top: copy.anchorTop,
    "top-right": copy.anchorTopRight,
    left: copy.anchorLeft,
    center: copy.anchorCenter,
    right: copy.anchorRight,
    "bottom-left": copy.anchorBottomLeft,
    bottom: copy.anchorBottom,
    "bottom-right": copy.anchorBottomRight,
  };
  const fitLabels: Record<string, string> = { cover: copy.fitCover, contain: copy.fitContain };
  const regionLabels: Record<string, string> = {
    sidebar: copy.regionSidebar,
    main: copy.regionMain,
    rightbar: copy.regionRightbar,
    bottom: copy.regionBottom,
  };

  const placement = React.createElement(
    "section",
    { className: "ascii-rest-section" },
    React.createElement("h4", { className: "ascii-rest-section__title" }, copy.placement),
    React.createElement("p", { className: "ascii-rest-section__note" }, copy.placementNote),
    row(
      copy.fit,
      pick(FIT_MODES, fitLabels, settings.options.fit, (value) => props.onPlacement({ fit: value as FitMode })),
    ),
    row(
      copy.anchor,
      pick(ANCHORS, anchorLabels, settings.options.anchor, (value) => props.onPlacement({ anchor: value as Anchor })),
    ),
    row(
      copy.zoom,
      React.createElement("input", {
        type: "range",
        className: "ascii-rest-range",
        min: 0.5,
        max: 3,
        step: 0.01,
        value: settings.options.zoom,
        onChange: (event: { target: { value: string } }) => props.onPlacement({ zoom: Number(event.target.value) }),
      }),
      `${settings.options.zoom.toFixed(2)}×`,
    ),
  );

  const regions = React.createElement(
    "section",
    { className: "ascii-rest-section" },
    React.createElement("h4", { className: "ascii-rest-section__title" }, copy.regions),
    React.createElement("p", { className: "ascii-rest-section__note" }, copy.regionsNote),
    ...REGION_KEYS.map((key) =>
      row(
        regionLabels[key] ?? key,
        React.createElement("input", {
          type: "range",
          className: "ascii-rest-range",
          min: 0,
          max: 1,
          step: 0.01,
          value: settings.regions[key],
          onChange: (event: { target: { value: string } }) =>
            props.onRegions({ [key]: Number(event.target.value) } as Partial<Settings["regions"]>),
        }),
        `${Math.round(settings.regions[key] * 100)}%`,
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
    placement,
    regions,
    grid,
    credit,
  );
}
