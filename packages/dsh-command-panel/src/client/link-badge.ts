/**
 * The link badge a symlinked file carries in its preview header.
 *
 * The host's file service refuses to read a final symlink, so the panel opens
 * what the link points at; the tab then shows a path the reader never typed.
 * This entry is the one place that says why, and where the file really lives.
 * It reads the previewed file's host path from the slot's owner props and
 * renders nothing at all for an ordinary file.
 */

import type { Copy } from "./copy.ts";
import type { PathExplorerRemote } from "./dsh.ts";
import { linkOfTarget } from "./link-marks.ts";
import type { ReactSlice } from "./react.ts";

/** The header slot the document preview opens to other plugins. */
export const LINK_BADGE_SLOT = "sidebar.right.tab.document.actions";

/** This entry's cell key; a fresh id is added beside the shipped entries. */
export const LINK_BADGE_ID = "dsh-command-panel:link";

/** What the document header passes in: the previewed file's host path. */
interface DocumentActionProps {
  readonly absolutePath?: string;
}

/** Where one open file really lives, and how it was reached. */
interface LinkMark {
  /** Absolute path of the file itself. */
  readonly real: string;
  /** The link it was opened through, when the panel opened it that way. */
  readonly via?: string;
}

export interface LinkBadgeDeps {
  readonly React: ReactSlice;
  readonly copy: () => Copy;
  /** The panel's own host half; absent means only remembered links are shown. */
  readonly explorer: () => PathExplorerRemote | undefined;
}

/**
 * A 12px chain glyph.
 *
 * Drawn here rather than taken from the host's artwork module: a slot entry is
 * mounted outside the panel's own stylesheet, and a missing optional export
 * would leave a hole in the header rather than a slightly different glyph.
 */
const GLYPH_PROPS = {
  width: 12,
  height: 12,
  viewBox: "0 0 16 16",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.4,
  strokeLinecap: "round",
  "aria-hidden": "true",
} as const;

const GLYPH_PATHS = ["M6.4 9.6l3.2-3.2", "M7.5 4.4l1.1-1.1a3 3 0 014.1 4.1l-1.1 1.1", "M8.5 11.6l-1.1 1.1a3 3 0 01-4.1-4.1l1.1-1.1"];

/**
 * Build the badge component for one slot registration.
 * @param deps - React, the copy table and the host-half probe.
 * @returns the component the header renders beside the previewed path.
 */
export function createLinkBadge(deps: LinkBadgeDeps): (props: DocumentActionProps) => unknown {
  const { React } = deps;

  return function LinkBadge(props: DocumentActionProps): unknown {
    const path = typeof props?.absolutePath === "string" ? props.absolutePath : undefined;
    const known = path === undefined ? undefined : linkOfTarget(path);
    const [probed, setProbed] = React.useState<LinkMark | undefined>(undefined);

    React.useEffect(() => {
      setProbed(undefined);
      if (path === undefined || known !== undefined) return undefined;
      const explorer = deps.explorer();
      if (explorer?.inspect === undefined) return undefined;
      let live = true;
      void explorer
        .inspect({ path })
        .then(answer => {
          // A path opened straight at the link itself: the tab cannot render it,
          // but naming the target is still the useful thing to say.
          if (live && answer.ok && answer.value.kind === "symlink") {
            setProbed({ real: answer.value.target ?? path });
          }
        })
        .catch(() => undefined);
      return () => {
        live = false;
      };
    }, [path, known]);

    const mark: LinkMark | undefined = known === undefined ? probed : { real: path as string, via: known };
    if (mark === undefined) return null;

    return React.createElement(
      "span",
      {
        "data-dcp-link-badge": "",
        title: deps.copy().linkTitle(mark.real, mark.via),
        style: {
          display: "inline-flex",
          alignItems: "center",
          flex: "0 0 auto",
          marginInlineStart: 4,
          color: "var(--dsw-alias-label-tertiary, #8a8a95)",
        },
      },
      React.createElement("svg", GLYPH_PROPS, GLYPH_PATHS.map((d, index) => React.createElement("path", { key: index, d }))),
    );
  };
}
