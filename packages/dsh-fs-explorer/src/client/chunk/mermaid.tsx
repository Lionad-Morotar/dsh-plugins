/**
 * The diagram renderer, fetched only when a document actually fences one.
 *
 * Mermaid is the largest thing this package can ship: a single-file CJS bundle
 * of it is about 5.4 MB raw, which is why it is a chunk of its own rather than
 * part of the preview chunk. A reader who opens a README with no diagram in it
 * pays nothing for this file.
 *
 * The chunk is a rendering API, not a surface: it exports no React and touches
 * no DOM at import time. The preview chunk owns the React wrapper, the theme
 * sampling and the fallback, because those are decisions about a page, while
 * this module only knows how to turn a definition into SVG.
 *
 * Three properties matter to the caller and are enforced here rather than
 * trusted to it:
 *
 * - **Serial.** Mermaid keeps one global config and one parser, and two renders
 *   in flight at once share them. Every call is queued behind the previous one.
 * - **Unique ids.** `mermaid.render` writes its temporary container into
 *   `document.body` under the id it is given, so two diagrams with the same id
 *   would overwrite each other's markup. Ids come from a module counter.
 * - **Clean.** The temporary container is removed whether the render succeeded
 *   or failed. Mermaid removes it itself on most paths, but not all of them, and
 *   a leaked `<div id="d...">` in the body is a page-wide side effect a preview
 *   pane has no business causing.
 */
import mermaid from "mermaid";

import { PACKAGE_NAME } from "../../shared.ts";

/** Marker the build asserts and the loader checks before handing the module on. */
export const renderer = "mermaid" as const;

/**
 * The page colours one diagram is drawn in.
 *
 * Sampled by the caller from the computed style of the element the diagram will
 * sit in. This module never reads the page: it has no idea which theme is
 * active, which is what keeps it testable outside a browser and keeps the
 * theme-switch decision in the surface that can observe a switch.
 */
export interface MermaidColors {
  /** Page background behind the diagram. */
  readonly background: string;
  /** Body text colour; node labels and titles. */
  readonly text: string;
  /** Edge, border and axis colour. */
  readonly line: string;
  /** Highlight colour for the "primary" element of a diagram. */
  readonly accent: string;
  /** De-emphasised colour for secondary and tertiary shapes. */
  readonly muted: string;
}

/** What one render needs. */
export interface MermaidRenderOptions {
  readonly colors: MermaidColors;
}

/** What one render produces: the SVG markup, ready to be inserted. */
export interface MermaidRenderResult {
  readonly svg: string;
}

/** Everything this chunk exports. */
export interface MermaidChunkModule {
  readonly renderer: "mermaid";
  renderDiagram(code: string, options: MermaidRenderOptions): Promise<MermaidRenderResult>;
}

/**
 * The theme variables, one per role the diagram types actually paint with.
 *
 * `theme: "base"` is the only mermaid theme that takes its colours from
 * variables rather than from a fixed palette, so this table is what makes a
 * diagram look like part of the page instead of like a mermaid diagram. The
 * roles are grouped by diagram family: flowchart and state share the node set,
 * sequence has its own actor and signal set, gantt has task and section, and
 * the note/error pair is used by every type that can carry a message.
 * @param colors - the page's sampled colours.
 * @returns the `themeVariables` object handed to `initialize`.
 */
function themeVariablesOf(colors: MermaidColors): Record<string, string> {
  return {
    background: colors.background,
    fontFamily: "inherit",
    // Flowchart, state, class, ER: one node box, one border, one label.
    primaryColor: colors.background,
    primaryTextColor: colors.text,
    primaryBorderColor: colors.line,
    secondaryColor: colors.muted,
    secondaryTextColor: colors.text,
    secondaryBorderColor: colors.line,
    tertiaryColor: colors.background,
    tertiaryTextColor: colors.text,
    tertiaryBorderColor: colors.line,
    mainBkg: colors.background,
    nodeBkg: colors.background,
    nodeBorder: colors.line,
    nodeTextColor: colors.text,
    clusterBkg: colors.background,
    clusterBorder: colors.line,
    titleColor: colors.text,
    textColor: colors.text,
    // Edges and the labels that sit on them.
    lineColor: colors.line,
    defaultLinkColor: colors.line,
    arrowheadColor: colors.line,
    edgeLabelBackground: colors.background,
    // Notes and errors, which every type can carry.
    noteBkgColor: colors.background,
    noteTextColor: colors.text,
    noteBorderColor: colors.line,
    errorBkgColor: colors.background,
    errorTextColor: colors.text,
    // Sequence diagrams.
    actorBkg: colors.background,
    actorBorder: colors.line,
    actorTextColor: colors.text,
    actorLineColor: colors.line,
    signalColor: colors.line,
    signalTextColor: colors.text,
    labelBoxBkgColor: colors.background,
    labelBoxBorderColor: colors.line,
    labelTextColor: colors.text,
    loopTextColor: colors.text,
    activationBkgColor: colors.muted,
    activationBorderColor: colors.line,
    sequenceNumberColor: colors.background,
    // Gantt and timeline.
    sectionBkgColor: colors.muted,
    altSectionBkgColor: colors.background,
    sectionBkgColor2: colors.muted,
    taskBkgColor: colors.accent,
    taskTextColor: colors.background,
    taskTextOutsideColor: colors.text,
    taskTextLightColor: colors.background,
    taskBorderColor: colors.line,
    activeTaskBkgColor: colors.accent,
    activeTaskBorderColor: colors.line,
    doneTaskBkgColor: colors.muted,
    doneTaskBorderColor: colors.line,
    critBkgColor: colors.accent,
    critBorderColor: colors.line,
    todayLineColor: colors.accent,
    gridColor: colors.line,
    // Pie, journey and quadrant.
    pie1: colors.accent,
    pie2: colors.muted,
    pie3: colors.line,
    pie4: colors.text,
    pieTitleTextSize: "16px",
    pieSectionTextColor: colors.background,
    pieLegendTextColor: colors.text,
    personBkg: colors.background,
    personBorder: colors.line,
    rectBkgColor: colors.background,
  };
}

/** The palette the current configuration was built from, or null before the first render. */
let configuredWith: string | null = null;

/** Source of the per-render id; module state, so two diagrams never collide. */
let counter = 0;

/** The tail of the serial queue. Always resolved: a failure is not inherited. */
let queue: Promise<unknown> = Promise.resolve();

/**
 * A stable identity for one palette.
 *
 * Compared instead of the object so a caller that rebuilds the same colour
 * object on every render does not re-initialise mermaid each time. Re-initialising
 * is not free: it rebuilds the site config every diagram in the document reads.
 * @param colors - the page's sampled colours.
 * @returns a string that differs exactly when a colour differs.
 */
function paletteSignature(colors: MermaidColors): string {
  return [colors.background, colors.text, colors.line, colors.accent, colors.muted].join("\u0000");
}

/**
 * Configure mermaid for one palette, once.
 *
 * `initialize` writes global site config, so it is skipped while the palette is
 * unchanged and re-run when it is not: that is what makes a theme switch repaint
 * on the next render instead of keeping the colours of the first one.
 *
 * The three security settings are the contract, not tuning. `startOnLoad: false`
 * keeps mermaid from scanning the document on its own; `securityLevel: "strict"`
 * runs the output through DOMPurify and refuses `javascript:` links;
 * `suppressErrorRendering: true` makes a bad definition throw instead of
 * painting mermaid's own error diagram into the page.
 * @param colors - the page's sampled colours.
 */
function configure(colors: MermaidColors): void {
  const signature = paletteSignature(colors);
  if (configuredWith === signature) return;
  mermaid.initialize({
    startOnLoad: false,
    securityLevel: "strict",
    suppressErrorRendering: true,
    theme: "base",
    themeVariables: themeVariablesOf(colors),
    fontFamily: "inherit",
  });
  configuredWith = signature;
}

/**
 * Remove the temporary container mermaid leaves in `document.body`.
 *
 * `mermaid.render` without a container element appends `<div id="d<id>">` to the
 * body and strips it on the success path; the failure paths and the sandbox
 * level do not all do the same, and an orphan there outlives the pane that
 * caused it. All three ids are attempted because which one exists depends on the
 * security level, and a missing one is not an error.
 * @param id - the id this render was given.
 */
function discardTemporaryContainer(id: string): void {
  if (typeof document === "undefined") return;
  for (const elementId of [id, `d${id}`, `i${id}`]) {
    document.getElementById(elementId)?.remove();
  }
}

/**
 * Render one definition, on the queue's turn.
 * @param code - the fenced definition, verbatim.
 * @param options - the palette to draw it in.
 * @returns the SVG markup.
 * @throws when mermaid cannot parse or draw the definition.
 */
async function renderOnce(code: string, options: MermaidRenderOptions): Promise<MermaidRenderResult> {
  configure(options.colors);
  counter += 1;
  const id = `dsh-mermaid-${String(counter)}`;
  try {
    const result = await mermaid.render(id, code);
    return { svg: result.svg };
  } catch (error) {
    // The original message is the only useful part: it carries the line and the
    // token mermaid stopped on, which is what the fallback shows the reader.
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`${PACKAGE_NAME}: mermaid could not render the diagram: ${message}`);
  } finally {
    discardTemporaryContainer(id);
  }
}

/**
 * Render one diagram definition to SVG.
 *
 * Calls are queued, not parallel: mermaid's config and parser are global, and
 * the returned promise settles when this call's turn comes, not when it is made.
 * A failed render does not poison the queue — the next call runs normally.
 * @param code - the fenced definition, verbatim.
 * @param options - the palette to draw it in.
 * @returns the SVG markup.
 * @throws when mermaid cannot parse or draw the definition.
 */
export function renderDiagram(code: string, options: MermaidRenderOptions): Promise<MermaidRenderResult> {
  const run = queue.then(() => renderOnce(code, options));
  // The queue keeps a settled tail whatever happened here, so one bad diagram
  // cannot stop the rest of the document from rendering.
  queue = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

const chunkModule: MermaidChunkModule = { renderer, renderDiagram };

export default chunkModule;
