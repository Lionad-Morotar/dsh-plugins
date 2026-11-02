/**
 * The GFM reading surface.
 *
 * This module is the lazy half of the package and the only place that imports
 * `react-markdown`: the entry names the chunk, the loader fetches it the first
 * time a document is actually read, and a reader who never opens a Markdown
 * file pays for none of it.
 *
 * Raw HTML is never parsed (`skipHtml`), so a `<script>` or an `onerror`
 * payload in the source stays literal text. A workspace-relative image has no
 * URL the page can fetch, so it becomes a named placeholder instead of a
 * broken-image glyph.
 */
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/** Class prefix for the placeholder that replaces an unfetchable image. */
const IMAGE_CLASS = "fmd-img";

function ImagePlaceholder({
  source,
  alt,
  label,
}: {
  readonly source: string;
  readonly alt: string;
  readonly label: string;
}) {
  return (
    <span className={IMAGE_CLASS} title={source}>
      {alt === "" ? label : alt}
    </span>
  );
}

/**
 * Render one whole Markdown document.
 * @param props.text - the document as the host decoded it.
 * @param props.imageLabel - fallback name for an image without alt text.
 * @returns the GFM element tree.
 */
export function MarkdownView({
  text,
  imageLabel = "image",
}: {
  readonly text: string;
  readonly imageLabel?: string;
}) {
  return (
    <div className="fmd" data-renderer="react-markdown">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        skipHtml
        components={{
          img: ({ src, alt }) => {
            const source = typeof src === "string" ? src : "";
            if (!/^(https?:|data:|blob:)/iu.test(source)) {
              return <ImagePlaceholder source={source} alt={alt ?? ""} label={imageLabel} />;
            }
            return <img src={source} alt={alt ?? ""} loading="lazy" />;
          },
        }}
      >
        {text}
      </ReactMarkdown>
    </div>
  );
}

const chunkModule = { renderer: "markdown" as const, MarkdownView };

export default chunkModule;
