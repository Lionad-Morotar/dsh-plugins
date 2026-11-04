/**
 * Dictionaries for this plugin's two surfaces: the preview toolbar title the
 * document registry asks for, and the viewport's own states (loading, failure,
 * retry, facts). Keeping both in one namespace means the manifest's locale
 * files and the runtime dictionary cannot drift.
 *
 * The copy lives with the plugin rather than with the shared surfaces: the
 * surfaces only format messages, and whoever registers a preview is the party
 * that knows which namespace and which wording its readers get. A second
 * consumer of `dsh-preview-viewers` therefore ships its own dictionary for the
 * same keys instead of inheriting this plugin's voice.
 */

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
      "image.title": "图片",
      "pdf.title": "PDF 文档",
      "pdf.page": "第 {current} / {total} 页",
      "pdf.previous": "上一页",
      "pdf.next": "下一页",
      "pdf.error.password": "这个 PDF 需要密码才能打开",
      "pdf.error.invalid": "这个 PDF 已损坏或不是有效的 PDF",
      "pdf.error.missing": "找不到这个 PDF 的内容",
      "pdf.error.unknown": "无法打开这个 PDF",
      "pdf.error.render": "这一页无法绘制",
      "state.loading": "正在读取…",
      "state.decoding": "正在解码…",
      "state.failed": "无法预览该文件",
      "state.retry": "重试",
      "state.unsupported": "该格式暂不支持",
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
      "image.title": "Image",
      "pdf.title": "PDF document",
      "pdf.page": "Page {current} of {total}",
      "pdf.previous": "Previous page",
      "pdf.next": "Next page",
      "pdf.error.password": "This PDF is password protected",
      "pdf.error.invalid": "This file is damaged or is not a valid PDF",
      "pdf.error.missing": "The content of this PDF could not be found",
      "pdf.error.unknown": "This PDF could not be opened",
      "pdf.error.render": "This page could not be drawn",
      "state.loading": "Reading…",
      "state.decoding": "Decoding…",
      "state.failed": "This file cannot be previewed",
      "state.retry": "Retry",
      "state.unsupported": "This format is not supported yet",
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
