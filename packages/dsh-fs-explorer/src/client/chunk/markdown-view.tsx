/**
 * The GFM reading mode, and the one fence it renders as a picture.
 *
 * This module is separate from `preview.tsx` for a testing reason, not an
 * architectural one: the Markdown reader is the part of the preview chunk that
 * has behaviour worth asserting, and importing it from `preview.tsx` would drag
 * CodeMirror into every test that mounts it. `preview.tsx` re-exports it, so the
 * chunk's public shape is unchanged.
 *
 * A diagram is the only node here that is not static. Everything else in a
 * document is decided by the text; a diagram has to be fetched, rendered, and
 * re-rendered when the page's colours change, which is three states and two
 * observers. The rule that shapes all of it: **the source is always on screen
 * until a picture replaces it.** A fence never renders as blank space, because a
 * reader who sees nothing cannot tell a slow fetch from a broken diagram from a
 * file that never had one.
 */
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import type { Translate } from "../copy.ts";
import type { MermaidChunkModule } from "./boot.ts";
import { loadMermaidChunk } from "./boot.ts";
import type { MermaidColors } from "./mermaid.tsx";

/** What the reader sees when no translator was handed in. */
const FALLBACK_ERROR = "图表渲染失败，已显示源码";
const FALLBACK_SOURCE = "查看源码";

/** The fence info string that marks a diagram, matched case-insensitively. */
const MERMAID_LANGUAGE = /(?:^|\s)language-mermaid(?:\s|$)/iu;

/**
 * Whether a `code` node's class names mark it as a diagram fence.
 * @param className - the class attribute react-markdown derived from the fence.
 * @returns true when the fence said `mermaid`.
 */
function isMermaidFence(className: unknown): boolean {
  return typeof className === "string" && MERMAID_LANGUAGE.test(className);
}

/**
 * Read one custom property, falling back through a list of alternatives.
 *
 * `getComputedStyle` returns the empty string for a property that is not set, so
 * a fallback chain is the only way to survive a host that renamed a token. The
 * last entry is a literal, so this always returns something paintable.
 * @param style - the computed style to read.
 * @param names - custom property names, most specific first.
 * @param fallback - the literal to use when none of them is set.
 * @returns a CSS colour.
 */
function readColor(style: CSSStyleDeclaration, names: readonly string[], fallback: string): string {
  for (const name of names) {
    const value = style.getPropertyValue(name).trim();
    if (value !== "") return value;
  }
  return fallback;
}

/**
 * Whether a colour would paint nothing.
 *
 * `transparent` and `rgba(..., 0)` are what a token chain ends at when no layer
 * sets a background, and mermaid would then draw dark text on whatever happens to
 * be behind the figure. Treating them as absent is what makes the body fallback
 * reachable.
 * @param value - a CSS colour.
 * @returns true when it has no visible fill.
 */
function isTransparent(value: string): boolean {
  const normalised = value.replace(/\s+/gu, "").toLowerCase();
  return normalised === "" || normalised === "transparent" || /^rgba\([^)]*,0(?:\.0+)?\)$/u.test(normalised);
}

/**
 * Sample the page's colours for one diagram.
 *
 * The palette is read from the element the diagram will sit in, so a themed
 * panel and an unthemed one each get their own answer. Mermaid takes colours as
 * theme variables rather than inheriting them, which is why this has to resolve
 * them to concrete values here instead of passing `var(...)` through: the SVG is
 * serialized into a string, and a variable reference in it would resolve against
 * whatever document it later lands in.
 * @param element - the element the diagram is about to be drawn in.
 * @returns the five colours the renderer maps onto its theme.
 */
export function samplePalette(element: Element | null): MermaidColors {
  const target = element ?? (typeof document === "undefined" ? null : document.body);
  const style = target === null ? null : getComputedStyle(target);
  const bodyStyle = typeof document === "undefined" ? null : getComputedStyle(document.body);
  const background = style === null ? "" : readColor(style, ["--fx-panel", "--fx-panel-2", "--fx-border"], "");
  const bodyBackground = bodyStyle === null ? "" : bodyStyle.backgroundColor;
  return {
    // A panel token that resolves to nothing means the panel is see-through, and
    // the page behind it is what the reader actually sees. Falling all the way
    // back to white keeps the text legible on a host that sets no background at
    // all, which is the only case where guessing is better than nothing.
    background: isTransparent(background)
      ? isTransparent(bodyBackground)
        ? "#ffffff"
        : bodyBackground
      : background,
    text: style === null ? "#1f2328" : readColor(style, ["--fx-text"], style.color || "#1f2328"),
    line: style === null ? "#8c959f" : readColor(style, ["--fx-border", "--fx-border-soft"], "#8c959f"),
    accent: style === null ? "#0969da" : readColor(style, ["--fx-accent"], "#0969da"),
    muted: style === null ? "#6e7781" : readColor(style, ["--fx-text-2", "--fx-caption"], "#6e7781"),
  };
}

/**
 * Watch the page for a theme change.
 *
 * Two signals, because a host can switch themes either way: an attribute on the
 * root element (which is what this repo's shell does) or the operating system's
 * preference. Both are debounced by one animation frame so a host that rewrites
 * several attributes in a row produces one repaint rather than three.
 * @param onChange - called once per settled change.
 * @returns the teardown.
 */
function observeTheme(onChange: () => void): () => void {
  if (typeof window === "undefined" || typeof document === "undefined") return () => undefined;
  let frame = 0;
  const schedule = (): void => {
    if (frame !== 0) return;
    frame = window.requestAnimationFrame(() => {
      frame = 0;
      onChange();
    });
  };
  const observer = new MutationObserver(schedule);
  // `data-*` cannot be watched by name, so the whole attribute list is: a theme
  // toggle that writes `data-theme`, `class` and a style variable in one turn is
  // three records and one repaint.
  observer.observe(document.documentElement, { attributes: true });
  const query = typeof window.matchMedia === "function" ? window.matchMedia("(prefers-color-scheme: dark)") : null;
  query?.addEventListener("change", schedule);
  return () => {
    observer.disconnect();
    query?.removeEventListener("change", schedule);
    if (frame !== 0) window.cancelAnimationFrame(frame);
  };
}

/** What one diagram is doing right now. */
type DiagramState =
  | { readonly kind: "pending" }
  | { readonly kind: "ready"; readonly svg: string }
  | { readonly kind: "failed"; readonly message: string };

/** What one diagram needs. */
interface MermaidDiagramProps {
  readonly code: string;
  readonly t?: Translate;
  /** The document's shared loader: one call serves every fence in it. */
  readonly loadChunk: () => Promise<MermaidChunkModule>;
}

/**
 * One fenced diagram: source first, picture when it arrives.
 *
 * The chunk comes in through `loadChunk`, which the reader shares across the
 * whole document, so two fences cost one call and this component holds no cache
 * of its own. A failure is not remembered anywhere: the next fence still tries,
 * because a chunk that lost a race with the boot hand-over is exactly the case
 * where the first diagram fails and the second one works.
 * @param props - the fence's source, the translator, and the shared loader.
 * @returns the figure, or the source while there is no figure.
 */
function MermaidDiagram({ code, t, loadChunk }: MermaidDiagramProps): ReactNode {
  const host = useRef<HTMLDivElement | null>(null);
  const [state, setState] = useState<DiagramState>({ kind: "pending" });
  /**
   * The definition the current state was produced from.
   *
   * Held in state rather than in a ref because the comparison has to happen
   * during render. An effect runs after the browser already has the old picture
   * on screen, so resetting there would still commit one frame of the old
   * diagram beside the new source, which is the frame this guards against.
   */
  const [stateCode, setStateCode] = useState(code);
  if (stateCode !== code) {
    // A fence whose text changed is a different diagram, so the picture on
    // screen is not a stale copy of the new one, it is simply wrong. Going back
    // to pending here shows the new source immediately; the effect below then
    // draws it. A theme change is the other case and deliberately not handled
    // here: the code is unchanged, so the old picture is still a correct
    // drawing of the same diagram and stays up until the new one is ready.
    setStateCode(code);
    setState({ kind: "pending" });
  }
  // Bumped by the theme observer; the render effect depends on it, so a theme
  // change re-samples the palette and draws again.
  const [themeVersion, setThemeVersion] = useState(0);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => observeTheme(() => setThemeVersion(version => version + 1)), []);

  const load = loadChunk;

  useEffect(() => {
    // Reading the palette at render time rather than at mount is what makes a
    // theme switch work: the observer bumps the version, this runs again, and the
    // colours come from the page as it is now.
    const colors = samplePalette(host.current);
    let live = true;
    load()
      .then(chunk => chunk.renderDiagram(code, { colors }))
      .then(result => {
        if (!live || !mounted.current) return;
        setState({ kind: "ready", svg: result.svg });
      })
      .catch((error: unknown) => {
        if (!live || !mounted.current) return;
        setState({ kind: "failed", message: error instanceof Error ? error.message : String(error) });
      });
    return () => {
      // A fence that was edited, or a panel that was closed, must not have its
      // result written into a component that is gone.
      live = false;
    };
  }, [code, load, themeVersion]);

  const source = <pre className="fx-md-diagram-source">{code}</pre>;

  if (state.kind === "failed") {
    return (
      <>
        {source}
        <p className="fx-md-diagram-error" data-testid="fs-preview-mermaid-error">
          {`${t?.("preview.mermaid.error") ?? FALLBACK_ERROR}：${state.message}`}
        </p>
      </>
    );
  }

  if (state.kind === "ready") {
    return (
      <figure className="fx-md-diagram" data-testid="fs-preview-mermaid" ref={host}>
        {/* The only HTML this package ever injects, and it is mermaid's own
            serialized SVG: `securityLevel: "strict"` has already run it through
            DOMPurify, and the definition it came from is data, never markup. */}
        <div className="fx-md-diagram-svg" dangerouslySetInnerHTML={{ __html: state.svg }} />
        <details className="fx-md-diagram-source-toggle">
          <summary>{t?.("preview.mermaid.source") ?? FALLBACK_SOURCE}</summary>
          {source}
        </details>
      </figure>
    );
  }

  // Pending, including the first frame: the reader sees the definition they wrote
  // rather than an empty box, and it stays selectable while the chunk arrives.
  return <div ref={host}>{source}</div>;
}

/** What the reading mode needs. */
export interface MarkdownViewProps {
  readonly text: string;
  /** Translator for the diagram's two labels; absent falls back to Chinese. */
  readonly t?: Translate;
  /**
   * The diagram loader, injectable so a test can answer without a chunk.
   *
   * Absent in the product: the default is the real loader, which is memoised, so
   * a document with ten diagrams still costs one fetch.
   */
  readonly loadMermaid?: () => Promise<MermaidChunkModule>;
}

/**
 * The GFM reading mode.
 *
 * `skipHtml` drops raw HTML nodes instead of passing them through: no
 * `rehype-raw` is installed, so nothing in a document can become live markup.
 * @param props - the page text, the translator and the loader seam.
 * @returns the rendered document.
 */
export function MarkdownView({ text, t, loadMermaid }: MarkdownViewProps) {
  // One loader for the whole document, not one per fence.
  //
  // The real loader memoises its fetch, so this only matters for the injected
  // seam — but the contract is the same either way, and a document with ten
  // diagrams should ask once. A failure is dropped from the shared slot so the
  // next fence retries: the first diagram losing a race with the boot hand-over
  // is exactly the case where the second one works.
  const shared = useRef<Promise<MermaidChunkModule> | null>(null);
  const loadChunk = useCallback(
    () =>
      (shared.current ??= (loadMermaid ?? loadMermaidChunk)().catch((error: unknown) => {
        shared.current = null;
        throw error;
      })),
    [loadMermaid],
  );

  // Built once per translator identity rather than per render: react-markdown
  // re-parses the document when its component map changes identity, and a fresh
  // object literal on every render would re-parse a large README on every
  // keystroke elsewhere in the panel.
  const components = useMemo(
    () => ({
      // A workspace-relative image has no URL the page can fetch; showing a
      // named placeholder beats a broken-image glyph that says nothing.
      img: ({ src, alt }: { readonly src?: string | number; readonly alt?: string }) => {
        const source = typeof src === "string" ? src : "";
        if (!/^(https?:|data:|blob:)/iu.test(source)) {
          return (
            <span className="fx-md-img" title={source}>
              {alt === undefined || alt === "" ? "image" : alt}
            </span>
          );
        }
        return <img src={source} alt={alt ?? ""} loading="lazy" />;
      },
      code: ({ className, children }: { readonly className?: string; readonly children?: ReactNode }) => {
        if (!isMermaidFence(className)) return <code className={className}>{children}</code>;
        return <MermaidDiagram code={String(children ?? "").replace(/\n$/u, "")} t={t} loadChunk={loadChunk} />;
      },
      // react-markdown wraps every fence in a `<pre>`, which would put a
      // `<figure>` inside a paragraph of preformatted text. Unwrapping only the
      // diagram fence keeps every other block exactly as it was, and the check is
      // on the child's class names rather than on a marker this file invented.
      pre: ({ node: _node, ...rest }: { readonly node?: unknown; readonly children?: ReactNode }) => {
        const child = Array.isArray(rest.children) ? rest.children[0] : rest.children;
        const childClass =
          typeof child === "object" && child !== null && "props" in child
            ? ((child as { readonly props?: { readonly className?: unknown } }).props?.className ?? "")
            : "";
        if (isMermaidFence(childClass)) return <>{child}</>;
        return <pre>{rest.children}</pre>;
      },
    }),
    [t, loadChunk],
  );

  return (
    <div className="fx-md" data-renderer="react-markdown">
      <ReactMarkdown remarkPlugins={[remarkGfm]} skipHtml components={components}>
        {text}
      </ReactMarkdown>
    </div>
  );
}

/** Kept for the caller that wants the palette without mounting a diagram. */
export type { MermaidColors };
