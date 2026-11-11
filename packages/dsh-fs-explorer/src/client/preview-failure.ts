/**
 * Failure triage for both preview paths.
 *
 * This module exists as its own file for one reason: it is the only part of the
 * preview's pure half that the binary family chunks need, and those chunks must
 * not reach the language catalogue. `preview.ts` re-exports the catalogue's
 * matching functions, so importing anything from it drags all 74 language rows
 * into the bundle — which is the right cost for the entry, where the pane has to
 * answer "which language is this" the moment a file opens, and the wrong cost for
 * a chunk that only wants to name an error.
 *
 * So the dependency arrow points one way: this file imports nothing from the
 * catalogue, and the family chunks import this file. Anything added here must
 * keep that property, or the five family chunks quietly grow again.
 */

/** Why a preview could not read a file. */
export type PreviewFailureKind =
  | "deleted"
  | "denied"
  | "symlink"
  | "binary"
  | "commit-binary"
  | "submodule"
  | "too-large"
  | "unavailable"
  | "unknown";

/** One classified failure, ready for a title and an action. */
export interface PreviewFailure {
  readonly kind: PreviewFailureKind;
  readonly code: string;
  readonly message: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object";
}

/**
 * Map a thrown read to the states the preview has copy for.
 *
 * The host names its refusals with `workspace-file/*` codes, the filesystem
 * layer with POSIX codes; both are matched here so the pane never has to
 * interpret an error itself.
 * @param error - the thrown value.
 * @returns the classified failure.
 */
export function classifyPreviewFailure(error: unknown): PreviewFailure {
  const record = isRecord(error) ? error : {};
  const code = typeof record.code === "string" ? record.code : "";
  const detail = typeof record.detail === "string" ? record.detail : "";
  const message = typeof record.message === "string" && record.message !== "" ? record.message : "读取文件失败";
  const haystack = `${code} ${detail} ${message}`.toLowerCase();
  if (haystack.includes("symlink")) return { kind: "symlink", code, message };
  // Git object kinds have their own copy: a submodule is not a text failure,
  // and a binary blob in a commit may not have a family renderer to fall back on.
  if (haystack.includes("git/submodule") || haystack.includes("子模块")) return { kind: "submodule", code, message };
  if (haystack.includes("git/binary") || haystack.includes("提交版本中的文件是二进制")) {
    return { kind: "commit-binary", code, message };
  }
  if (
    haystack.includes("eacces") ||
    haystack.includes("eperm") ||
    haystack.includes("permission") ||
    haystack.includes("denied") ||
    haystack.includes("forbidden") ||
    haystack.includes("权限")
  ) {
    return { kind: "denied", code, message };
  }
  if (
    haystack.includes("not-found") ||
    haystack.includes("not_found") ||
    haystack.includes("enoent") ||
    haystack.includes("no such file") ||
    haystack.includes("deleted") ||
    haystack.includes("不存在")
  ) {
    return { kind: "deleted", code, message };
  }
  if (haystack.includes("not-regular-file") || haystack.includes("not a regular file")) {
    return { kind: "binary", code, message };
  }
  if (haystack.includes("not-text") || haystack.includes("utf-8") || haystack.includes("binary")) {
    return { kind: "binary", code, message };
  }
  if (haystack.includes("too-large") || haystack.includes("too large") || haystack.includes("maxbytes")) {
    return { kind: "too-large", code, message };
  }
  if (haystack.includes("unavailable")) return { kind: "unavailable", code, message };
  return { kind: "unknown", code, message };
}
