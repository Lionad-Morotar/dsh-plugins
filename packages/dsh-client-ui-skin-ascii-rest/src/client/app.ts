/**
 * The skin's behaviour, with no knowledge of the module loader.
 *
 * Everything a skin must undo lives here rather than spread across the modules
 * below: this file sets the body attribute the manager looks for, installs the
 * token layer, mounts the picture, and returns a teardown that leaves the page
 * exactly as it found it. Nothing below knows it is a skin.
 *
 * The signature is the Harness's own. An installed plugin is a Cordis plugin, so
 * it exports `apply(ctx)` and declares what it needs in `inject`; it does not get
 * a runtime object with React on it. React arrives through the module loader's
 * `require`, which is why nothing here touches it at module scope.
 *
 * `boot` in `entry.ts` is separate from this file so the bundle can be exercised
 * without a loader (tests), and so the loader's `require` is never captured at
 * module scope, which would run before the factory hands it over.
 */
import {
  builtInCatalog,
  type SceneCatalog,
  type SceneEntry,
  type SceneModule,
  type Settings,
} from "ascii-rest-scenes";

import type { ClientContext, LocaleService, SlotsService, ThemeService } from "./dsh.ts";
import type { GuiHandle, GuiOptions } from "./gui.ts";
import { getLoader } from "./loader.ts";
import { AsciiRestSettingsPage, type PageCopy, type PageReact } from "./page.ts";
import { loadScene } from "./scenes.ts";
import { createSettingsStore, type SettingsStore } from "./store.ts";
import { SKIN_CSS } from "./styles.ts";
import { presentScene, type Surface } from "./surface.ts";
import { buildTokens } from "./tokens.ts";

// The page's copy lives in the locale documents, not in this file, so a
// translator edits one place. `resolveJsonModule` turns the imports into
// ordinary objects and esbuild inlines them.
import enCopy from "../../locale/en.json";
import zhCopy from "../../locale/zh.json";

export { BODY_ATTRIBUTE, LOCALE_NAMESPACE, PACKAGE_ID, SETTINGS_ID } from "./constants.ts";
import { BODY_ATTRIBUTE, LOCALE_NAMESPACE, PACKAGE_ID, SETTINGS_ID } from "./constants.ts";

/**
 * The services this plugin needs before it can mount.
 *
 * `theme` carries the token override the picture shows through, and `slots` is
 * where the settings page goes, so both are hard requirements. `locale` is
 * looked up rather than injected: the page has Chinese copy of its own and must
 * survive a host that has no locale service.
 */
export const inject = ["slots", "theme"];

/** The attribute the tuning panel's host element carries, which the CSS targets. */
const GUI_ATTRIBUTE = "data-ascii-rest-gui";

/** The chunk the tuning panel lives in: lil-gui is half this plugin's weight. */
const GUI_CHUNK = "./client.gui.js";

/** The stylesheet's tag id, which is what makes it survive a skin switch. */
const STYLE_TAG = `${PACKAGE_ID}/skin.css`;

/**
 * The two dictionaries the settings page and the slot label read.
 *
 * They are the JSON files under `locale/`, imported at build time so there is
 * one source of truth for the copy: a string edited there lands in the bundle on
 * the next build, with no parallel table to keep in sync.
 */
const COPY: { zh: PageCopy; en: PageCopy } = { zh: zhCopy, en: enCopy };

/**
 * Insert the skin's stylesheet, tagged the way the loader expects.
 *
 * The loader claims every untagged `<style>` present around a factory call and
 * deletes the ones carrying its id on teardown. A tagged element with
 * `data-plugin-css` is both recognised as owned and skipped by that sweep, so it
 * is the only shape that survives a skin switch cleanly.
 */
function insertStyles(doc: Document, css: string): () => void {
  const existing = doc.querySelector(`style[data-plugin-css=${JSON.stringify(STYLE_TAG)}]`);
  if (existing !== null) return () => {};
  const tag = doc.createElement("style");
  tag.dataset.plugin = PACKAGE_ID;
  tag.dataset.pluginCss = STYLE_TAG;
  tag.textContent = css;
  doc.head.append(tag);
  return () => tag.remove();
}

/**
 * Release the styles the loader claimed on behalf of this package.
 *
 * On activation the loader walks every `<style>` without a `data-plugin` and
 * stamps it with this plugin's id, because it cannot tell a plugin's CSS-in-JS
 * from anyone else's. Left alone, those stamps become deletion marks when the
 * skin unloads, which would take another plugin's styles with it. Removing the
 * stamp on the way in leaves the page exactly as it was.
 */
function releaseClaimedStyles(doc: Document): void {
  const claimed = doc.querySelectorAll(`style[data-plugin=${JSON.stringify(PACKAGE_ID)}]:not([data-plugin-css])`);
  for (const style of claimed) style.removeAttribute("data-plugin");
}

/**
 * Install the skin.
 *
 * `ctx` is what the host hands an installed plugin. Everything below is scoped
 * to effects on it, so unload runs the teardown in reverse and nothing outlives
 * the plugin.
 */
export function apply(ctx: ClientContext): void {
  const body = document.body;
  const doc = body.ownerDocument;
  const catalog: SceneCatalog = builtInCatalog();
  // React is a platform seed, not a context member: an installed plugin reaches
  // the module table through the factory's `require`, which `boot` installed.
  const React = getLoader()("react") as PageReact;
  const store: SettingsStore = createSettingsStore(catalog.scenes);
  let settings: Settings = store.get();

  let surface: Surface | null = null;
  let gui: GuiHandle | null = null;
  let guiHost: HTMLElement | null = null;
  let releaseTokens: (() => void) | null = null;
  // Guards against a slower scene load overwriting a faster, newer one.
  let presentation = 0;

  const theme = ctx.get<ThemeService>("theme");
  const locale = ctx.get<LocaleService>("locale");
  const slots = ctx.get<SlotsService>("slots");

  const warn = (message: string, error?: unknown): void => {
    // eslint-disable-next-line no-console -- a skin has no logger, and a silent
    // failure in a background is indistinguishable from a working one.
    console.warn(message, error);
  };

  /** The copy for the language the host is currently showing. */
  const copy = (): PageCopy => {
    const active = locale?.getSnapshot().active ?? "zh";
    return active.startsWith("en") ? COPY.en : COPY.zh;
  };

  // --- colour -----------------------------------------------------------------

  /** Repaint the token layer for the current scene. The theme service picks the scheme. */
  const paintTokens = (scene: SceneEntry | undefined): void => {
    releaseTokens?.();
    releaseTokens = null;
    if (theme === undefined || scene === undefined) return;
    releaseTokens = theme.overrideTokens(
      PACKAGE_ID,
      buildTokens({ scene, surfaceOpacity: settings.appearance.surface, paper: settings.options }),
    );
  };

  // --- the picture ------------------------------------------------------------

  /**
   * Mount the scene named by `next`, replacing whatever is mounted.
   *
   * The tokens are repainted before the module is awaited, so a slow chunk fetch
   * does not leave the previous scene's colours on the page while the new one
   * loads.
   */
  const mountScene = async (next: Settings): Promise<void> => {
    const ticket = ++presentation;
    const scene = catalog.scenes.find((entry) => entry.id === next.scene);

    surface?.dispose();
    surface = null;
    paintTokens(scene);
    if (scene === undefined) return;

    let module: SceneModule;
    try {
      module = await loadScene(scene.id);
    } catch (error) {
      warn(`ascii-rest: scene "${scene.id}" did not load`, error);
      return;
    }
    // A newer scene was chosen while this one was loading, so drop the stale one.
    if (ticket !== presentation) return;

    surface = presentScene({
      scene,
      module,
      pieceOptions: next.piece[scene.id] ?? {},
      opacity: next.appearance.opacity,
      blur: next.appearance.blur,
      veil: next.appearance.veil,
      still: next.appearance.still,
      fps: next.appearance.fps,
      paper: next.options,
      geometry: { zoom: next.options.zoom, offsetX: next.options.offsetX, offsetY: next.options.offsetY },
      onError: (error) => {
        warn("ascii-rest: the scene stopped drawing", error);
      },
    });

    // The panel's per-scene controls belong to the scene that is now playing.
    gui?.rebuild(scene, module, next.piece[scene.id] ?? {});
  };

  // --- the tuning panel -------------------------------------------------------

  const closeGui = (): void => {
    gui?.destroy();
    gui = null;
    guiHost?.remove();
    guiHost = null;
  };

  /**
   * Open the panel in the corner.
   *
   * A sibling of the settings page rather than a modal: the reader tunes the
   * picture while looking at it, which is the only way tuning works.
   */
  const openGui = async (): Promise<void> => {
    if (gui !== null) return;
    const scene = catalog.scenes.find((entry) => entry.id === settings.scene);
    if (scene === undefined) return;

    let module: SceneModule;
    try {
      module = await loadScene(scene.id);
    } catch (error) {
      warn("ascii-rest: cannot open the panel without a scene", error);
      return;
    }

    // lil-gui is only reachable from here, so it arrives as a chunk rather than
    // in the entry bundle. Its own module is CJS-shaped on arrival, hence the
    // `createGui` unwrap below.
    let factory: { createGui(host: HTMLElement, options: GuiOptions): GuiHandle };
    try {
      factory = (await getLoader().async(GUI_CHUNK)) as typeof factory;
    } catch (error) {
      warn("ascii-rest: the tuning panel did not load", error);
      return;
    }

    guiHost = doc.createElement("div");
    guiHost.setAttribute(GUI_ATTRIBUTE, "");
    body.append(guiHost);

    gui = factory.createGui(guiHost, {
      catalog: catalog.scenes,
      scene,
      settings,
      module,
      callbacks: {
        onPiece: (change) => {
          store.update((current) => ({
            ...current,
            piece: {
              ...current.piece,
              [current.scene]: { ...(current.piece[current.scene] ?? {}), ...change },
            },
          }));
        },
        onAppearance: (change) => {
          store.update((current) => ({ ...current, appearance: { ...current.appearance, ...change } }));
        },
        onScene: (sceneId) => {
          store.update((current) => ({ ...current, scene: sceneId }));
        },
        // A save is a durable write of the document as it stands. The store
        // already persists every change, so this exists for the reader's sense
        // that tuning is committable, and to re-assert the document against a
        // concurrent reset.
        onSave: () => store.set(settings),
        onClose: () => closeGui(),
      },
      closeLabel: copy().closePanel,
    });
  };

  // --- the settings page ------------------------------------------------------

  /**
   * The page component.
   *
   * It subscribes to the store directly rather than taking settings through
   * `inject`, so a change made in the tuning panel re-renders the page with no
   * channel between the two.
   */
  const SettingsPage = (): unknown => {
    const [snapshot, setSnapshot] = React.useState(settings);
    React.useEffect(() => store.subscribe(setSnapshot), []);
    return AsciiRestSettingsPage({
      catalog: catalog.scenes,
      settings: snapshot,
      React,
      copy: copy(),
      loadPreview: (sceneId) => loadScene(sceneId),
      onScene: (sceneId) => store.update((current) => ({ ...current, scene: sceneId })),
      onAppearance: (change) => store.update((current) => ({ ...current, appearance: { ...current.appearance, ...change } })),
      onOpenPanel: () => {
        void openGui();
      },
      onReset: () => store.reset(),
    });
  };

  // --- the page ---------------------------------------------------------------

  const disposeStyles = insertStyles(doc, SKIN_CSS);
  body.setAttribute(BODY_ATTRIBUTE, "");
  // `mountScene` paints the tokens synchronously before it awaits the chunk, so
  // the first frame already has the right surface colours.
  void mountScene(settings);

  ctx.effect(() => () => {
    // Bumping the ticket makes any in-flight scene load a no-op on arrival.
    presentation += 1;
    closeGui();
    surface?.dispose();
    surface = null;
    releaseTokens?.();
    releaseTokens = null;
    disposeStyles();
    body.removeAttribute(BODY_ATTRIBUTE);
  }, "ascii-rest: release the skin");

  ctx.effect(() => {
    releaseClaimedStyles(doc);
    return () => {
      releaseClaimedStyles(doc);
    };
  }, "ascii-rest: release styles claimed by the loader");

  ctx.effect(
    () =>
      store.subscribe((next) => {
        const previous = settings;
        settings = next;
        const scene = catalog.scenes.find((entry) => entry.id === next.scene);

        if (next.scene !== previous.scene) {
          void mountScene(next);
          return;
        }
        paintTokens(scene);
        surface?.restyle({
          opacity: next.appearance.opacity,
          blur: next.appearance.blur,
          veil: next.appearance.veil,
          still: next.appearance.still,
          fps: next.appearance.fps,
        });
        surface?.relayout({ zoom: next.options.zoom, offsetX: next.options.offsetX, offsetY: next.options.offsetY });
      }),
    "ascii-rest: follow the settings",
  );

  ctx.effect(() => {
    // The host writes `data-ds-dark-theme` on the body; the renderer needs a
    // fresh mount with the other scheme's palette, not a mutation.
    const observer = new MutationObserver(() => {
      surface?.rescheme();
    });
    observer.observe(doc.body, { attributes: true, attributeFilter: ["data-ds-dark-theme"] });
    const onResize = (): void => surface?.relayout();
    window.addEventListener("resize", onResize);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", onResize);
    };
  }, "ascii-rest: follow the scheme and the window");

  if (locale !== undefined) {
    ctx.effect(
      () =>
        locale.register(LOCALE_NAMESPACE, {
          zh: COPY.zh as unknown as Record<string, string>,
          en: COPY.en as unknown as Record<string, string>,
        }),
      "ascii-rest: locale dictionaries",
    );
  }

  if (slots !== undefined) {
    // `slots.inject` owns the registration's lifecycle: it runs the callback once
    // the slot exists and again if the host re-creates it, and disposes on
    // unload. Wrapping it in `ctx.effect` as well would register twice.
    slots.inject("settings.section", () =>
      slots.register({ name: "settings.section", id: SETTINGS_ID, order: 116, label: () => copy().navLabel }, SettingsPage),
    );
  }
}
