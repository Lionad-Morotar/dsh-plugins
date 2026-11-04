/**
 * Which files the panel opened through a symlink.
 *
 * A tab shows the address it was opened with, and the panel opens the target
 * because the host refuses to read through a link. That leaves nothing in the
 * tab saying a link was involved, so the pairs the panel creates are kept here
 * and read back by the header badge.
 *
 * In memory on purpose: a reload restores the tab as the plain file it now
 * points at, which is the truth about what the reader can see. The bound keeps
 * a long session from remembering every file it ever opened.
 */

/** How many pairs to keep before the oldest one is dropped. */
const CAPACITY = 64;

const marks = new Map<string, string>();

/** Compare paths the way the filesystem does on the platforms we run on. */
function keyOf(path: string): string {
  return path.replace(/\\/g, "/").replace(/\/+$/, "");
}

/** Remember that `target` was opened through `link`. */
export function markLinked(target: string, link: string): void {
  const key = keyOf(target);
  marks.delete(key);
  marks.set(key, link);
  while (marks.size > CAPACITY) {
    const oldest = marks.keys().next();
    if (oldest.done === true) return;
    marks.delete(oldest.value);
  }
}

/** The link one opened path came through, if this panel opened it. */
export function linkOfTarget(target: string): string | undefined {
  return marks.get(keyOf(target));
}

/** Drop every pair; the tests use it, the panel never needs to. */
export function forgetLinked(): void {
  marks.clear();
}
