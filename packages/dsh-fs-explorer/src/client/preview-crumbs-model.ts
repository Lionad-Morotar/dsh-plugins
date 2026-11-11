import { isAbsolutePath, joinPath } from "./model.ts";

/** 面包屑里的一段。 */
export interface PreviewCrumb {
  /** 显示文字：路径段原文。 */
  readonly name: string;
  /** 这一段代表的路径；相对路径是工作区相对写法，绝对路径保留绝对写法。 */
  readonly path: string;
  /** 只有最后一段是 file，其余都是 directory。 */
  readonly kind: "file" | "directory";
  /** 持有这一段的目录（相对路径下 "" 表示工作区根）；绝对路径下按原写法给父级。 */
  readonly parent: string;
}

/** 一条路径拆成面包屑的纯函数结果。 */
export interface PreviewCrumbsModel {
  readonly absolute: boolean;
  readonly segments: readonly PreviewCrumb[];
}

/**
 * The part of an absolute path that no crumb represents: the POSIX root, a
 * drive letter, or a UNC `//server/share` pair. It is returned verbatim so the
 * first crumb's `parent` reads the way the caller wrote the path.
 */
function absoluteRoot(path: string): string {
  if (path.startsWith("//")) {
    const parts = path.slice(2).split("/");
    const server = parts[0] ?? "";
    const share = parts[1] ?? "";
    return share === "" ? `//${server}` : `//${server}/${share}`;
  }
  const drive = /^[A-Za-z]:/u.exec(path);
  return drive === null ? "/" : drive[0];
}

/**
 * Split one preview path into breadcrumb segments.
 *
 * The preview toolbar walks up from the open file, and a workspace-relative
 * path is the only shape it can list siblings for: the host has no listing
 * endpoint keyed by an absolute path. So `absolute` is the gate for that
 * affordance, not decoration, and an input with no segment at all reports
 * `absolute: false` because there is nothing to walk up from either way.
 * @param path - a workspace-relative or absolute path, in either separator style.
 * @returns the flag plus one crumb per segment, outermost first.
 */
export function previewCrumbs(path: string): PreviewCrumbsModel {
  const slashed = path.replace(/\\/gu, "/").replace(/^(?:\.\/)+/u, "");
  // Only interior runs collapse: a leading `//` is the UNC server marker, and
  // flattening it would turn a network path into a POSIX one.
  const collapsed = slashed.replace(/(?<!^)\/{2,}/gu, "/").replace(/\/+$/u, "");
  if (collapsed === "") return { absolute: false, segments: [] };

  const absolute = isAbsolutePath(collapsed);
  const root = absolute ? absoluteRoot(collapsed) : "";
  const rest = absolute ? collapsed.slice(root.length) : collapsed;
  // A `.` segment names the directory it sits in, so it never earns a crumb of
  // its own; `previewCrumbs(".")` therefore lands on the empty result above.
  const names = rest.split("/").filter((name) => name !== "" && name !== ".");
  if (names.length === 0) return { absolute: false, segments: [] };

  const segments: PreviewCrumb[] = [];
  let parent = root;
  for (const [index, name] of names.entries()) {
    // `joinPath` trims trailing slashes, so it cannot rebuild the POSIX root
    // ("/" would become ""); every other parent goes through it.
    const own = parent === "/" ? `/${name}` : joinPath(parent, name);
    segments.push({
      name,
      path: own,
      kind: index === names.length - 1 ? "file" : "directory",
      parent,
    });
    parent = own;
  }
  return { absolute, segments };
}
