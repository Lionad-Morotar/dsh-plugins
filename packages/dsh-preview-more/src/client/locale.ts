/**
 * Dictionaries for this plugin's two surfaces: the preview toolbar title the
 * document registry asks for, and the viewport's own states (loading, failure,
 * retry, facts). Keeping both in one namespace means the manifest's locale
 * files and the runtime dictionary cannot drift.
 */

/** Dictionary rows, keyed by message id, per language. */
export type PreviewDictionaries = Record<string, Record<string, string>>;

/** Dictionary namespace, shared by the registry title and the bodies. */
export const LOCALE_NAMESPACE = "previewMore";

/**
 * Build the dictionaries for one language pair.
 * @returns the message tables the host registers at mount.
 */
export function dictionaries(): Record<"zh" | "en", Record<string, string>> {
  return {
    zh: {
      "scene3d.title": "3D 模型",
      "raster.title": "图片",
      "cad.title": "CAD 图纸",
      "state.loading": "正在读取…",
      "state.decoding": "正在解码…",
      "state.failed": "无法预览该文件",
      "state.retry": "重试",
      "state.tooLarge": "文件过大，无法在浏览器内解码",
      "state.unsupported": "该格式暂不支持",
      "state.empty": "文件里没有可显示的几何体",
      "raster.noPages": "这个文件里没有页面",
      "raster.pageMissing": "这一页在文件里找不到",
      "raster.emptyPage": "这一页没有像素",
      "scene3d.reset": "重置视角",
      "scene3d.wireframe": "线框",
      "scene3d.facts": "网格数 {meshes} · 三角面 {triangles}",
      "raster.page": "第 {current} / {total} 页",
      "raster.previous": "上一页",
      "raster.next": "下一页",
      "cad.fit": "适应窗口",
      "cad.layers": "图层 {count}",
    },
    en: {
      "scene3d.title": "3D model",
      "raster.title": "Image",
      "cad.title": "CAD drawing",
      "state.loading": "Reading…",
      "state.decoding": "Decoding…",
      "state.failed": "This file cannot be previewed",
      "state.retry": "Retry",
      "state.tooLarge": "The file is too large to decode in the browser",
      "state.unsupported": "This format is not supported yet",
      "state.empty": "The file contains no displayable geometry",
      "raster.noPages": "This file has no pages",
      "raster.pageMissing": "That page is not in this file",
      "raster.emptyPage": "That page has no pixels",
      "scene3d.reset": "Reset view",
      "scene3d.wireframe": "Wireframe",
      "scene3d.facts": "{meshes} meshes · {triangles} triangles",
      "raster.page": "Page {current} of {total}",
      "raster.previous": "Previous page",
      "raster.next": "Next page",
      "cad.fit": "Fit view",
      "cad.layers": "{count} layers",
    },
  };
}

/**
 * Substitute `{name}` placeholders in one message.
 * @param template - message text carrying placeholders.
 * @param values - replacement values by name.
 * @returns the filled message.
 */
export function formatMessage(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/gu, (match, name: string) => (name in values ? String(values[name]) : match));
}
