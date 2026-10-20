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
import { ANCHORS, FIT_MODES, REGION_KEYS, fitCover, sceneGround, scenePalette } from "ascii-rest-scenes";

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
 * Whether the dark theme is live, kept current while the page is open.
 *
 * Both the preview and the anchor pad paint with a scheme-dependent palette, so
 * reading the attribute once would leave one of them showing the other theme's
 * colours after a switch. The shell flips a single attribute, so watching that
 * one is the whole subscription.
 */
function useDarkScheme(React: PageReact): boolean {
  const [dark, setDark] = React.useState<boolean>(document.body.hasAttribute(DARK_ATTRIBUTE));
  React.useEffect(() => {
    const observer = new MutationObserver(() => setDark(document.body.hasAttribute(DARK_ATTRIBUTE)));
    observer.observe(document.body, { attributes: true, attributeFilter: [DARK_ATTRIBUTE] });
    return () => observer.disconnect();
  }, []);
  return dark;
}

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
  const dark = useDarkScheme(React);

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
  const dark = useDarkScheme(React);
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
  //
  // The row is a div rather than a label. A label may wrap at most one labelable
  // control, and these rows carry a group of buttons: inside a label the browser
  // routes a click on the row text to the group's first button, so clicking
  // "对齐位置" quietly jumped the picture to the top-left corner. Each control
  // names itself instead.
  const field = (label: string, control: ReactNode, hint?: string): ReactNode =>
    React.createElement(
      "div",
      { className: "ascii-rest-field" },
      React.createElement(
        "div",
        { className: "ascii-rest-field__text" },
        React.createElement("span", { className: "ascii-rest-field__label" }, label),
        hint === undefined ? null : React.createElement("span", { className: "ascii-rest-field__hint" }, hint),
      ),
      control,
    );

  const pick = <V extends string>(
    fieldLabel: string,
    values: readonly V[],
    labels: Record<string, string>,
    current: string,
    onPick: (value: V) => void,
  ): ReactNode =>
    React.createElement(
      "div",
      { className: "ascii-rest-chips", role: "group", "aria-label": fieldLabel },
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

  const range = (
    fieldLabel: string,
    value: number,
    bounds: { min: number; max: number; step: number },
    onInput: (next: number) => void,
  ): ReactNode =>
    React.createElement("input", {
      type: "range",
      className: "ascii-rest-range",
      "aria-label": fieldLabel,
      min: bounds.min,
      max: bounds.max,
      step: bounds.step,
      value,
      onChange: (event: { target: { value: string } }) => onInput(Number(event.target.value)),
    });

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

  // The anchor is a place in a two-dimensional frame, so it is drawn as one, and
  // drawn truthfully: the pad is a window, and the scene sits inside it at the
  // size and offset `fitCover` actually solves, so a reader sees the crop instead
  // of inferring it from nine words. Nine chips spelling out 左上 / 上中 / 右上
  // wrapped into a ragged 6+3 block that had to be read word by word; the words
  // survive as accessible names and hover titles.
  //
  // The pad is measured in the same units the background is, so `cover` makes the
  // picture overflow the frame (clipped by its own overflow) and `contain` leaves
  // a margin, which is exactly what those two modes do to the real picture.
  const PAD = { width: 172, height: 96 };
  const padBox =
    current === undefined
      ? null
      : fitCover(
          { cols: current.cols, rows: current.rows, cell: current.cell },
          PAD.width,
          PAD.height,
          { fit: settings.options.fit, anchor: settings.options.anchor, zoom: settings.options.zoom },
        );
  const anchorPad = React.createElement(
    "div",
    { className: "ascii-rest-anchor", style: { width: `${String(PAD.width)}px`, height: `${String(PAD.height)}px` } },
    padBox === null || current === undefined
      ? null
      : React.createElement("div", {
          className: "ascii-rest-anchor__picture",
          style: {
            left: `${String(padBox.left)}px`,
            top: `${String(padBox.top)}px`,
            width: `${String(padBox.width)}px`,
            height: `${String(padBox.height)}px`,
            // The picture's own colours, so the pad reads as this scene rather
            // than as an empty diagram. The scheme is passed through for the same
            // reason the preview does it: a dark palette against a dark theme
            // draws a frame with nothing in it.
            backgroundImage: `linear-gradient(105deg, ${scenePalette(current.palette, dark ? "dark" : "light", settings.options)
              .slice(0, 12)
              .map((colour, index, all) => `${colour} ${String((index / all.length) * 100)}%`)
              .join(", ")})`,
          },
        }),
    React.createElement(
      "div",
      { className: "ascii-rest-anchor__cells", role: "group", "aria-label": copy.anchor },
      ...ANCHORS.map((value) =>
        React.createElement(
          "button",
          {
            key: value,
            type: "button",
            className: "ascii-rest-anchor__cell",
            "aria-pressed": value === settings.options.anchor,
            "aria-label": anchorLabels[value] ?? value,
            title: anchorLabels[value] ?? value,
            onClick: () => props.onPlacement({ anchor: value as Anchor }),
          },
          React.createElement("span", { className: "ascii-rest-anchor__dot" }),
        ),
      ),
    ),
  );

  const placement = React.createElement(
    "section",
    { className: "ascii-rest-section" },
    React.createElement("h4", { className: "ascii-rest-section__title" }, copy.placement),
    React.createElement("p", { className: "ascii-rest-section__note" }, copy.placementNote),
    React.createElement(
      "div",
      { className: "ascii-rest-placement" },
      React.createElement(
        "div",
        { className: "ascii-rest-placement__controls" },
        field(
          copy.fit,
          pick(copy.fit, FIT_MODES, fitLabels, settings.options.fit, (value) =>
            props.onPlacement({ fit: value as FitMode }),
          ),
        ),
        field(
          copy.zoom,
          range(copy.zoom, settings.options.zoom, { min: 0.5, max: 3, step: 0.01 }, (zoom) =>
            props.onPlacement({ zoom }),
          ),
          `${settings.options.zoom.toFixed(2)}×`,
        ),
      ),
      React.createElement(
        "div",
        { className: "ascii-rest-placement__stage" },
        anchorPad,
        React.createElement("p", { className: "ascii-rest-placement__caption" }, anchorLabels[settings.options.anchor] ?? ""),
      ),
    ),
  );

  const regions = React.createElement(
    "section",
    { className: "ascii-rest-section" },
    React.createElement("h4", { className: "ascii-rest-section__title" }, copy.regions),
    React.createElement("p", { className: "ascii-rest-section__note" }, copy.regionsNote),
    ...REGION_KEYS.map((key) =>
      field(
        regionLabels[key] ?? key,
        range(
          regionLabels[key] ?? key,
          settings.regions[key],
          { min: 0, max: 1, step: 0.01 },
          (reveal) => props.onRegions({ [key]: reveal } as Partial<Settings["regions"]>),
        ),
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
