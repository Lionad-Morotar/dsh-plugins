/**
 * The scene3d viewport: three.js, one WebGL context per mounted tab.
 *
 * The engine is bundled into this chunk, never into the entry: the entry is
 * parsed on every page boot, while a 3D model may never be opened at all. The
 * chunk is loaded through the host loader's `require.async`, so it must expose
 * itself in the shape the loader expects — a module whose exports the entry
 * calls — and it must not require a sibling chunk synchronously, because a
 * chunk has no synchronous access to its siblings.
 *
 * Draco is the reason this file is not three lines of GLTFLoader. Model files in
 * the wild are often Draco-compressed, and three's DRACOLoader resolves its
 * decoder through `new URL(..., import.meta.url)` — a path that cannot exist in
 * a plugin served from a versioned asset route. So the decoder is embedded as
 * text plus bytes and handed to the loader through the one seam DRACOLoader
 * leaves open: its `_loadLibrary(url, responseType)`.
 */
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { ThreeMFLoader } from "three/addons/loaders/3MFLoader.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import { STLLoader } from "three/addons/loaders/STLLoader.js";
import {
  AmbientLight,
  Box3,
  Color,
  DirectionalLight,
  GridHelper,
  Group,
  LoadingManager,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  Scene,
  Sphere,
  Vector3,
  WebGLRenderer,
} from "three";

/**
 * Draco decoder sources, inlined at build time (see scripts/build.mjs).
 *
 * Only the wasm pair ships. The pure-JS decoder is another 512 KiB of text for
 * hosts that predate WebAssembly, and every target this plugin runs in (the
 * Electron desktop app and current browsers) has it; a host without it gets the
 * named unsupported error instead of a silent heavy fallback download.
 */
export interface DecoderSources {
  /** The wasm decoder's JavaScript side. */
  readonly wasmWrapper: string;
  /** The compiled wasm decoder. */
  readonly wasmBinary: Uint8Array;
}

/** What one render reports back to the React body. */
export interface SceneFacts {
  readonly meshes: number;
  readonly triangles: number;
}

/** A live viewport: the caller keeps this and calls `dispose` on unmount. */
export interface SceneHandle {
  /** Re-frame the camera on the current content. */
  resetView(): void;
  /** Toggle wireframe on every mesh in the content root. */
  setWireframe(on: boolean): void;
  /** Release GPU resources, listeners and the WebGL context. */
  dispose(): void;
}

/**
 * Build a DRACOLoader whose decoder never touches the network.
 *
 * DRACOLoader asks for its files by URL and will happily fetch them from a
 * CDN-relative path, which in a plugin means a 404 and a broken Draco model.
 * Overriding `_loadLibrary` answers those reads from memory instead; the match
 * is by URL suffix because that is what the loader passes through.
 * @param sources - embedded decoder payloads.
 * @returns a loader that needs no `setDecoderPath`.
 */
export function createDracoLoader(sources: DecoderSources): DRACOLoader {
  const loader = new DRACOLoader();
  const loadLibrary = (
    url: string,
    responseType: "text" | "arraybuffer",
  ): Promise<unknown> => {
    if (responseType === "arraybuffer")
      return Promise.resolve(sources.wasmBinary.buffer);
    if (url.endsWith("draco_wasm_wrapper.js"))
      return Promise.resolve(sources.wasmWrapper);
    return Promise.reject(
      new Error("dsh-preview-more: unexpected Draco library " + url),
    );
  };
  // three keeps this seam private, so overwriting it is a bet on a name that a
  // future three could rename. Asserting the shape here makes that bet explicit:
  // the failure becomes a named error at construction instead of a request to a
  // fabricated host that nobody can diagnose from the console.
  const seam = loader as unknown as { _loadLibrary?: unknown };
  if (typeof seam._loadLibrary !== "function") {
    throw new Error(
      "dsh-preview-more: this three version has no DRACOLoader._loadLibrary, so the embedded decoder cannot be installed",
    );
  }
  seam._loadLibrary = loadLibrary;
  return loader;
}

/** Everything a partially built viewport owns, in teardown order. */
export interface ViewportParts {
  readonly renderer: {
    dispose: () => void;
    forceContextLoss: () => void;
    domElement: { remove: () => void };
  };
  readonly draco: { dispose: () => void };
}

/**
 * Release a viewport that never finished building.
 *
 * A WebGL context is a scarce resource: browsers cap how many exist and drop the
 * oldest when the cap is reached, so a mount that throws after creating its
 * renderer would eventually blank out a different surface on the page. This runs
 * on the failure path only; a viewport that reached its handle is torn down by
 * that handle instead.
 * @param parts - the renderer and decoder that were already constructed.
 */
export function releasePartialViewport(parts: ViewportParts): void {
  parts.draco.dispose();
  parts.renderer.dispose();
  parts.renderer.forceContextLoss();
  parts.renderer.domElement.remove();
}

/** A loader reduced to the one call this module makes. */
export interface MeshLoader {
  load(buffer: ArrayBuffer): Promise<unknown>;
}

/**
 * List the external files one glTF document references.
 *
 * Data URIs are excluded: they carry their own bytes and must be left for the
 * loader to decode.
 * @param json - parsed glTF document, or null when the bytes were binary.
 * @returns relative URIs of sibling files, in document order.
 */
export function externalUris(json: unknown): string[] {
  if (json === null || typeof json !== "object") return [];
  const document = json as {
    buffers?: { uri?: unknown }[];
    images?: { uri?: unknown }[];
  };
  const collect = (entries: { uri?: unknown }[] | undefined): string[] =>
    (entries ?? []).flatMap((entry) => {
      const uri = entry.uri;
      return typeof uri === "string" &&
        uri.length > 0 &&
        !uri.startsWith("data:")
        ? [uri]
        : [];
    });
  return [...collect(document.buffers), ...collect(document.images)];
}

/**
 * Turn a URI reference into a path the workspace reader accepts.
 *
 * A glTF URI is percent-encoded, so `My Texture.png` arrives as
 * `My%20Texture.png`; the reader takes real paths, not URIs. An absolute or
 * remote URI is passed through untouched, because the reader will fail on it and
 * that failure names the document's actual problem instead of hiding it behind a
 * rewritten path.
 * @param reference - URI reference as the document wrote it.
 * @returns the path to hand to the reader.
 */
export function decodeUriPath(reference: string): string {
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/u.test(reference)) return reference;
  try {
    return decodeURIComponent(reference);
  } catch {
    // A lone % or a truncated escape is not valid encoding. Passing it through
    // lets the reader report a missing file, which is the truth, rather than
    // this function throwing an unrelated URIError.
    return reference;
  }
}

/**
 * Decode a `.gltf` document so its sibling references can be read.
 * @param buffer - file bytes.
 * @param binary - true for `.glb`, whose JSON chunk is not the whole file.
 * @returns the parsed document, or null when it cannot be read.
 */
export function gltfDocument(buffer: ArrayBuffer, binary: boolean): unknown {
  if (binary) return null;
  try {
    return JSON.parse(new TextDecoder().decode(buffer));
  } catch {
    return null;
  }
}

/** The mesh containers this viewport can read. */
export type MeshKind = "gltf" | "obj" | "stl" | "3mf";

/**
 * Classify one filename into the container it holds.
 *
 * The suffix is the only signal available before the bytes are parsed, and the
 * catalogue promises exactly these five suffixes, so this is the whole
 * behaviour of format selection in one testable function.
 * @param path - decoded file path.
 * @returns the container kind, or null for a suffix no loader reads.
 */
export function meshKindOf(path: string): MeshKind | null {
  const name = path.slice(path.lastIndexOf("/") + 1);
  const dot = name.lastIndexOf(".");
  if (dot <= 0) return null;
  const suffix = name.slice(dot + 1).toLowerCase();
  if (suffix === "glb" || suffix === "gltf") return "gltf";
  if (suffix === "obj") return "obj";
  if (suffix === "stl") return "stl";
  if (suffix === "3mf") return "3mf";
  return null;
}

/**
 * Choose the loader for one filename.
 *
 * Exported for tests: parsing is the part that can be wrong per format, while
 * the viewport around it is the same code for all of them.
 * @param path - decoded file path.
 * @param draco - Draco loader shared with the glTF loader.
 * @returns a loader exposing `load` for the file kind.
 */
export function loaderFor(
  path: string,
  draco: DRACOLoader,
  siblings?: ReadonlyMap<string, Uint8Array>,
): MeshLoader {
  const suffix = path.slice(path.lastIndexOf(".") + 1).toLowerCase();
  if (suffix === "glb" || suffix === "gltf") {
    // Its own manager, not three's module-level default. A URL modifier set on
    // the shared one would also rewrite every other loader's relative URLs for
    // the life of the page, including another plugin's and the host's own.
    const loader = new GLTFLoader(new LoadingManager());
    loader.setDRACOLoader(draco);

    // A .gltf names its buffers and textures by relative URI, and the loader's
    // own resolution is a fetch against the document base, which in a plugin is
    // the app root and therefore a 404. Answering those reads from bytes the
    // caller already fetched keeps the whole load off the network.
    //
    // A blob URL is how three's file layer wants a resource, so each sibling
    // becomes one; they are revoked once parsing settles, because a blob URL
    // pins its bytes until then.
    const created: string[] = [];
    if (siblings !== undefined && siblings.size > 0) {
      loader.manager.setURLModifier((url: string) => {
        const key = url.replace(/^\.\//u, "");
        const bytes =
          siblings.get(key) ??
          siblings.get(key.slice(key.lastIndexOf("/") + 1));
        if (bytes === undefined) return url;
        const objectUrl = URL.createObjectURL(
          new Blob([bytes as unknown as BlobPart]),
        );
        created.push(objectUrl);
        return objectUrl;
      });
    }
    const revoke = (): void => {
      for (const objectUrl of created.splice(0)) URL.revokeObjectURL(objectUrl);
      // Drop the modifier with the URLs it handed out: keeping it would leave
      // this document's bytes reachable to any later load on this manager.
      loader.manager.setURLModifier(undefined);
    };

    return {
      load: (buffer) =>
        new Promise((resolve, reject) => {
          // Parsing finishes after every buffer and texture has been consumed,
          // so the URLs can be released here rather than at viewport teardown.
          loader.parse(
            buffer,
            "",
            (gltf: unknown) => {
              revoke();
              resolve(gltf);
            },
            (error: unknown) => {
              revoke();
              reject(error);
            },
          );
        }),
    };
  }
  if (suffix === "obj") {
    const loader = new OBJLoader();
    return {
      load: async (buffer) => loader.parse(new TextDecoder().decode(buffer)),
    };
  }
  if (suffix === "stl") {
    const loader = new STLLoader();
    return { load: async (buffer) => loader.parse(buffer) };
  }
  if (suffix === "3mf") {
    // 3MF is a zip of XML parts, so the loader needs the XML DOM. It is
    // synchronous in every host this runs in, which is why it is not gated.
    const loader = new ThreeMFLoader();
    return { load: async (buffer) => loader.parse(buffer) };
  }
  return {
    load: async () => {
      throw new Error("dsh-preview-more: no mesh loader for " + path);
    },
  };
}

/**
 * Collapse a loader result into a scene root.
 *
 * glTF resolves to `{scene}`, OBJ and 3MF to a Group, STL to a bare
 * BufferGeometry. One shape leaves this function so the framing code never
 * branches. Exported for tests: this collapse is where a new format's return
 * shape would otherwise break silently.
 * @param parsed - whatever the loader resolved.
 * @returns the root node to add to the viewport.
 */
export function rootOf(parsed: unknown): Group {
  if (parsed !== null && typeof parsed === "object") {
    const withScene = parsed as { scene?: unknown };
    if (withScene.scene instanceof Group) return withScene.scene;
    if (parsed instanceof Group) return parsed;
    if (parsed instanceof Mesh) {
      const holder = new Group();
      holder.add(parsed);
      return holder;
    }
    // A BufferGeometry (STL) is not an Object3D: wrap it in a mesh first.
    const geometry = parsed as { getAttribute?: unknown };
    if (typeof geometry.getAttribute === "function") {
      const holder = new Group();
      holder.add(
        new Mesh(
          parsed as never,
          new MeshStandardMaterial({
            color: 0xcfcfd6,
            metalness: 0.1,
            roughness: 0.6,
          }),
        ),
      );
      return holder;
    }
  }
  throw new Error("dsh-preview-more: the loader returned no scene");
}

/**
 * Count meshes and triangles under one root.
 * @param root - scene root.
 * @returns the facts shown in the toolbar.
 */
export function measure(root: Group): SceneFacts {
  let meshes = 0;
  let triangles = 0;
  root.traverse((object) => {
    if (!(object instanceof Mesh)) return;
    meshes += 1;
    const geometry = object.geometry;
    const position = geometry.getAttribute("position");
    const indexed = geometry.getIndex();
    if (indexed !== null) triangles += indexed.count / 3;
    else if (position !== undefined) triangles += position.count / 3;
  });
  return { meshes, triangles: Math.round(triangles) };
}

/** Suffix of a glTF that keeps its buffers and textures outside the file. */
const SEPARATE_GLTF = "gltf";

/**
 * Fetch every file a .gltf names by relative URI.
 *
 * A .glb carries its buffers inline and answers with an empty map. A .gltf that
 * names siblings needs them read before parsing, because the parser resolves
 * those URIs itself through a fetch that cannot reach the workspace.
 * @param path - decoded file path, used for the suffix and the directory.
 * @param buffer - file bytes.
 * @param readSibling - reads one sibling, or undefined when the host offers none.
 * @returns the sibling bytes keyed by the URI as the document names it.
 */
async function readSiblings(
  path: string,
  buffer: ArrayBuffer,
  readSibling: ((relative: string) => Promise<Uint8Array>) | undefined,
): Promise<Map<string, Uint8Array>> {
  const resolved = new Map<string, Uint8Array>();
  if (readSibling === undefined) return resolved;
  const suffix = path.slice(path.lastIndexOf(".") + 1).toLowerCase();
  if (suffix !== SEPARATE_GLTF) return resolved;
  const document = gltfDocument(buffer, false);
  const uris = externalUris(document);
  await Promise.all(
    uris.map(async (uri) => {
      resolved.set(uri, await readSibling(uri));
    }),
  );
  return resolved;
}

/**
 * Mount a WebGL viewport inside one element and draw a model into it.
 * @param container - the element the canvas fills.
 * @param bytes - complete file bytes.
 * @param path - decoded file path, used only to pick the loader.
 * @param sources - embedded Draco decoder payloads.
 * @param readSibling - reads a file referenced by a .gltf, relative to the model.
 * @returns the live handle plus the measured facts.
 */
export async function mountScene(
  container: HTMLElement,
  bytes: Uint8Array,
  path: string,
  sources: DecoderSources,
  readSibling?: (relative: string) => Promise<Uint8Array>,
): Promise<{ handle: SceneHandle; facts: SceneFacts }> {
  const width = Math.max(container.clientWidth, 1);
  const height = Math.max(container.clientHeight, 1);

  const scene = new Scene();
  scene.background = new Color(0x101014);

  const camera = new PerspectiveCamera(45, width / height, 0.1, 1000);
  // Created before the renderer: this one throws when the three version has no
  // decoder seam, and a throw here must not leave a renderer behind.
  const draco = createDracoLoader(sources);

  const renderer = new WebGLRenderer({ antialias: true, alpha: false });
  try {
    renderer.setPixelRatio(Math.min(globalThis.devicePixelRatio ?? 1, 2));
    renderer.setSize(width, height, false);
    container.append(renderer.domElement);

    scene.add(new AmbientLight(0xffffff, 1.4));
    const key = new DirectionalLight(0xffffff, 1.6);
    key.position.set(3, 6, 4);
    scene.add(key);
    const ruler = new GridHelper(10, 10, 0x2a2a33, 0x1d1d24);
    scene.add(ruler);

    const view = bytes.byteOffset;
    const buffer = bytes.buffer.slice(
      view,
      view + bytes.byteLength,
    ) as ArrayBuffer;
    const siblings = await readSiblings(path, buffer, readSibling);
    const parsed = await loaderFor(path, draco, siblings).load(buffer);
    const content = new Group();
    content.add(rootOf(parsed));
    scene.add(content);

    const facts = measure(content);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;

    /** Frame the content so the whole model is visible at any aspect ratio. */
    const resetView = (): void => {
      const box = new Box3().setFromObject(content);
      if (box.isEmpty()) return;
      const sphere = box.getBoundingSphere(new Sphere());
      const radius = Math.max(sphere.radius, 0.001);
      const distance = radius / Math.sin((camera.fov * Math.PI) / 360);
      camera.position
        .copy(sphere.center)
        .add(new Vector3(distance, distance * 0.55, distance));
      camera.near = Math.max(distance / 100, 0.0001);
      camera.far = distance * 100;
      camera.updateProjectionMatrix();
      controls.target.copy(sphere.center);
      controls.update();
      ruler.position.y = box.min.y;
    };
    resetView();

    let frame = 0;
    const renderFrame = (): void => {
      frame = requestAnimationFrame(renderFrame);
      controls.update();
      renderer.render(scene, camera);
    };
    renderFrame();

    const observer = new ResizeObserver(() => {
      const nextWidth = Math.max(container.clientWidth, 1);
      const nextHeight = Math.max(container.clientHeight, 1);
      camera.aspect = nextWidth / nextHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(nextWidth, nextHeight, false);
    });
    observer.observe(container);

    const handle: SceneHandle = {
      resetView,
      setWireframe(on: boolean): void {
        content.traverse((object) => {
          if (!(object instanceof Mesh)) return;
          const material = object.material;
          if (material instanceof MeshStandardMaterial) material.wireframe = on;
        });
      },
      dispose(): void {
        cancelAnimationFrame(frame);
        observer.disconnect();
        controls.dispose();
        draco.dispose();
        content.traverse((object) => {
          if (!(object instanceof Mesh)) return;
          object.geometry.dispose();
          const material = object.material;
          if (Array.isArray(material))
            for (const one of material) one.dispose();
          else material.dispose();
        });
        renderer.dispose();
        renderer.forceContextLoss();
        renderer.domElement.remove();
      },
    };

    return { handle, facts };
  } catch (error) {
    // Nothing else owns the renderer yet, so releasing it is this frame's job.
    releasePartialViewport({ renderer, draco });
    throw error;
  }
}
