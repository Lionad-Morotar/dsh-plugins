/**
 * The two mount shapes a preview surface can be handed, and the reader they use.
 *
 * The host ships neither shape as a dependency: a preview body is written
 * against whatever props the hosting plugin hands over, and the two hosts in
 * play (the built-in document tab and dsh-better-sidebar) hand over different
 * ones. Narrowing each shape here, once, is what keeps that difference out of
 * the three surfaces: reading a field a host stopped sending fails at this
 * boundary instead of three frames into a render.
 *
 * Everything here is a type: nothing in this module reaches the DOM, the
 * workspace or the host. That is also why it lives beside the surfaces rather
 * than in a consumer — a consumer that re-exported these would have to duplicate
 * them, and the surfaces would then compile against whichever copy came first.
 */

/**
 * Read one file's complete bytes.
 *
 * Both hosts read through the same workspace service, so the surfaces take the
 * reader as a value: a surface never learns whether the bytes arrived through a
 * plugin context or a sidebar viewer descriptor.
 */
export type ReadFile = (sessionId: string, path: string, signal: AbortSignal) => Promise<Uint8Array>;

/**
 * What a native document body receives from the host.
 *
 * `content.kind` selects the loading protocol: in `renderer` mode the body owns
 * the read and must settle exactly once with `loaded`/`failed`; any other kind
 * is a host that renders the file itself and never mounts this body.
 */
export interface NativeBodyProps {
  readonly content: {
    readonly kind: string;
    readonly revision?: number;
    readonly loaded?: (version: string) => void;
    readonly failed?: () => void;
  };
  /** `dsh-resource://file/session/<id>/<path>` address of the file. */
  readonly resourceAddress: string;
  /**
   * Whether the panel holding this body is the one on screen.
   *
   * A host that keeps several previews mounted at once hides the inactive ones
   * instead of unmounting them, so a surface cannot infer this from its own
   * element: `clientWidth` is zero either way. Absent means visible, which is
   * what a single-panel host that never learned about this flag gets.
   */
  readonly visible?: boolean;
  /** Translator already bound to the registering plugin's namespace. */
  readonly t: (key: string, values?: Record<string, string | number>) => string;
  /** Byte reader injected by the registering plugin. */
  readonly readFile: ReadFile;
  /** Host hook resolving an address to its absolute path and version. */
  readonly useResource: (address: string) => { readonly value?: { readonly absolutePath?: string; readonly version?: string } };
  /** Host hook carrying the tab's abort signal. */
  readonly useTabInfo: () => { readonly tab: { readonly id: string; readonly signal: AbortSignal } };
}

/**
 * What a dsh-better-sidebar file viewer receives.
 *
 * That plugin reads the bytes itself (`fetchStrategy: 'custom'`) and hands them
 * back as `customData`; `readFile` is optional because only the glTF surface
 * needs it, to reach the sibling files a `.gltf` document names.
 */
export interface SidebarViewerProps {
  /** Absolute path of the file being previewed. */
  readonly path: string;
  /** Viewer title the host renders. */
  readonly title: string;
  /** Session scope the file address belongs to. */
  readonly scope: { readonly sessionId: string };
  /** Value the descriptor's `load` returned. */
  readonly customData?: { readonly bytes?: Uint8Array; readonly path?: string };
  /**
   * Whether the panel holding this viewer is the one on screen.
   *
   * Same contract as {@link NativeBodyProps.visible}: a host with several
   * mounted viewers hides the inactive ones, and a renderer that keeps drawing
   * them pays for scenes nobody sees. Absent means visible.
   */
  readonly visible?: boolean;
  /** Translator already bound to the registering plugin's namespace. */
  readonly t: (key: string, values?: Record<string, string | number>) => string;
  /** Byte reader, for surfaces that follow references into sibling files. */
  readonly readFile?: ReadFile;
}
