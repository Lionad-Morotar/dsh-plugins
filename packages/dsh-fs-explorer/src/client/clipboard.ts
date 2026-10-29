/**
 * Clipboard access that survives a non-secure host.
 *
 * The async Clipboard API is the only path that does not touch the DOM, but a
 * deployment on plain HTTP (or a denied permission) has no `navigator.clipboard`.
 * The textarea fallback is the pre-async idiom and is still the only option
 * there, so both are tried in order.
 * @param text - the string to copy.
 * @returns whether a write was issued successfully.
 */
export async function writeClipboard(text: string): Promise<boolean> {
  const asyncClipboard = typeof navigator === "undefined" ? undefined : navigator.clipboard;
  if (asyncClipboard !== undefined && typeof asyncClipboard.writeText === "function") {
    try {
      await asyncClipboard.writeText(text);
      return true;
    } catch {
      // Permission denied falls through to the selection-based path.
    }
  }
  if (typeof document === "undefined") return false;
  const area = document.createElement("textarea");
  area.value = text;
  area.setAttribute("readonly", "");
  area.style.position = "fixed";
  area.style.opacity = "0";
  document.body.appendChild(area);
  area.select();
  try {
    return document.execCommand("copy");
  } catch {
    return false;
  } finally {
    area.remove();
  }
}
