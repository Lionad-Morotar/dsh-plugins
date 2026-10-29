/**
 * The preview's pure half: paging, language mapping and failure triage.
 *
 * A workspace file can be arbitrarily large, so the preview never asks for the
 * whole file. It asks for one page of at most {@link PREVIEW_MAX_LINES} lines,
 * keeps the 1-based offset of the page it holds, and moves that offset forward
 * on `next()`. The same module owns the only mapping from a file name to a
 * language id, so the chunk's highlighter and the toolbar agree without either
 * importing the other.
 */
import type { ReactElement } from "react";

/** Default page size; the host accepts at most its configured `maxLines`. */
export const PREVIEW_MAX_LINES = 200;

/** Language ids the preview can highlight. */
export type LanguageId = "javascript" | "json" | "markdown" | "css" | "html" | "yaml" | "plaintext";

const LANGUAGE_BY_EXTENSION: Readonly<Record<string, LanguageId>> = {
  ts: "javascript",
  tsx: "javascript",
  mts: "javascript",
  cts: "javascript",
  js: "javascript",
  jsx: "javascript",
  mjs: "javascript",
  cjs: "javascript",
  json: "json",
  jsonc: "json",
  json5: "json",
  md: "markdown",
  mdx: "markdown",
  markdown: "markdown",
  mdown: "markdown",
  css: "css",
  scss: "css",
  sass: "css",
  less: "css",
  pcss: "css",
  postcss: "css",
  html: "html",
  htm: "html",
  xhtml: "html",
  vue: "html",
  svelte: "html",
  yml: "yaml",
  yaml: "yaml",
};

/**
 * Map a file name to the preview's language id.
 *
 * The id is not a MIME type and not a CodeMirror extension: the chunk owns that
 * translation. Keeping this table pure is what lets the acceptance probe assert
 * the mapping without loading the 600 KB editor.
 * @param name - a basename or a workspace path.
 * @returns the language id, or `plaintext` when nothing claims the suffix.
 */
export function languageFor(name: string): LanguageId {
  const lower = name.toLowerCase();
  const base = lower.slice(lower.lastIndexOf("/") + 1);
  const dot = base.lastIndexOf(".");
  if (dot <= 0) return "plaintext";
  return LANGUAGE_BY_EXTENSION[base.slice(dot + 1)] ?? "plaintext";
}

/** Whether a file should open in the Markdown reading mode. */
export function isMarkdownFile(name: string): boolean {
  return languageFor(name) === "markdown";
}

/** One page request as the host's `workspaceFiles.read` takes it. */
export interface PreviewRange {
  /** First line, 1-based. Omitted on the first page so the host default applies. */
  readonly offset?: number;
  /** Largest line count of the page. */
  readonly limit?: number;
}

/** The page shape `read` may answer with, after the transport envelope is gone. */
export interface PreviewPageLike {
  readonly text?: unknown;
  readonly lines?: unknown;
  readonly totalLines?: unknown;
  readonly offset?: unknown;
  readonly eof?: unknown;
}

/** One reader the loader pages through. */
export interface PreviewFiles {
  read(path: string, range: PreviewRange, signal?: AbortSignal): Promise<unknown> | unknown;
}

/** A page after the wire shape has been folded away. */
export interface PreviewPage {
  readonly text: string;
  /** Lines held by this page; `0` past the last line. */
  readonly lines: number;
  /** First line of the page, 1-based. */
  readonly offset: number;
  readonly totalLines?: number;
  readonly eof: boolean;
}

/** A thrown page read, with the host's error code kept for triage. */
export class PreviewReadError extends Error {
  readonly code: string;
  readonly detail: string;

  constructor(code: string, message: string, detail = "") {
    super(message);
    this.name = "PreviewReadError";
    this.code = code;
    this.detail = detail;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object";
}

function lineCount(text: string): number {
  if (text === "") return 0;
  return text.split("\n").length;
}

/**
 * Fold one `read` answer into a page.
 *
 * Two shapes are accepted: the generated Remote envelope (`{ok, value}`) and the
 * page itself. A page past the end is a valid answer with `lines: 0`, which is
 * how the toolbar knows to stop instead of asking again.
 * @param response - whatever the reader resolved to.
 * @param offset - the offset the page was requested at.
 * @returns the normalized page.
 * @throws {PreviewReadError} when the response is a transport or business error.
 */
export function normalizePreviewPage(response: unknown, offset: number): PreviewPage {
  if (!isRecord(response)) {
    throw new PreviewReadError("preview/unknown", "文件服务返回了无效响应");
  }
  if (response.ok === false) {
    const error = isRecord(response.error) ? response.error : {};
    const code = typeof error.code === "string" ? error.code : "preview/unknown";
    const message = typeof error.message === "string" ? error.message : "读取文件失败";
    const details = isRecord(error.details) ? error.details : {};
    const kind = typeof details.kind === "string" ? details.kind : "";
    throw new PreviewReadError(code, message, kind);
  }
  const page = response.ok === true ? response.value : response;
  if (!isRecord(page) || typeof page.text !== "string") {
    throw new PreviewReadError("preview/unknown", "文件页面缺少 text");
  }
  const lines = typeof page.lines === "number" && Number.isFinite(page.lines) ? Math.max(0, Math.trunc(page.lines)) : lineCount(page.text);
  const totalLines =
    typeof page.totalLines === "number" && Number.isFinite(page.totalLines) && page.totalLines > 0
      ? Math.trunc(page.totalLines)
      : undefined;
  const start =
    typeof page.offset === "number" && Number.isFinite(page.offset) && page.offset > 0 ? Math.trunc(page.offset) : offset;
  const eof =
    page.eof === true || (totalLines !== undefined && lines > 0 && start + lines - 1 >= totalLines);
  return totalLines === undefined
    ? { text: page.text, lines, offset: start, eof }
    : { text: page.text, lines, offset: start, totalLines, eof };
}

/** Why a preview could not read a file. */
export type PreviewFailureKind = "deleted" | "denied" | "symlink" | "binary" | "too-large" | "unavailable" | "unknown";

/** One classified failure, ready for a title and an action. */
export interface PreviewFailure {
  readonly kind: PreviewFailureKind;
  readonly code: string;
  readonly message: string;
}

/**
 * Map a thrown read to the four states the preview has copy for.
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

/** What the pane paints for one loader state. */
export type PreviewStatus = "idle" | "loading" | "ready" | "failed";

/** One immutable loader snapshot. */
export interface PreviewSnapshot {
  readonly status: PreviewStatus;
  readonly path?: string;
  readonly text: string;
  /** First line of the held page, 1-based. */
  readonly offset: number;
  /** Lines held by the page. */
  readonly lines: number;
  readonly totalLines?: number;
  readonly eof: boolean;
  readonly failure?: PreviewFailure;
}

/** The snapshot before any file was opened. */
export const IDLE_PREVIEW: PreviewSnapshot = Object.freeze({
  status: "idle",
  text: "",
  offset: 1,
  lines: 0,
  eof: false,
});

/** The paging surface the pane and the acceptance probe drive. */
export interface PreviewLoader {
  readonly maxLines: number;
  getSnapshot(): PreviewSnapshot;
  subscribe(listener: () => void): () => void;
  open(path: string): Promise<void>;
  next(): Promise<void>;
  prev(): Promise<void>;
  retry(): Promise<void>;
  close(): void;
}

/** Construction options for {@link createPreviewLoader}. */
export interface PreviewLoaderOptions {
  readonly files: PreviewFiles;
  readonly maxLines?: number;
}

/**
 * Build a page-at-a-time preview loader.
 *
 * The loader holds exactly one page. `open()` drops every previous page and
 * reads offset 1; `next()` asks for the line after the held page; `prev()`
 * returns to the previous page start from a small stack, so a back gesture
 * never has to guess a page size it never saw. Every request is abandoned by a
 * fresh token and an abort signal, because a fast selection change must not let
 * an earlier file's page land in the pane.
 * @param options - the reader and the page size.
 * @returns the loader.
 */
export function createPreviewLoader({ files, maxLines = PREVIEW_MAX_LINES }: PreviewLoaderOptions): PreviewLoader {
  const pageSize = Math.max(1, Math.trunc(maxLines));
  let snapshot: PreviewSnapshot = IDLE_PREVIEW;
  let generation = 0;
  let controller: AbortController | null = null;
  let stack: number[] = [1];
  const listeners = new Set<() => void>();

  const emit = (next: PreviewSnapshot): void => {
    snapshot = next;
    for (const listener of listeners) listener();
  };

  const read = async (path: string, offset: number): Promise<void> => {
    generation += 1;
    const mine = generation;
    controller?.abort();
    const active = new AbortController();
    controller = active;
    emit({
      status: "loading",
      path,
      text: snapshot.path === path ? snapshot.text : "",
      offset,
      lines: snapshot.path === path ? snapshot.lines : 0,
      ...(snapshot.path === path && snapshot.totalLines !== undefined ? { totalLines: snapshot.totalLines } : {}),
      eof: snapshot.path === path ? snapshot.eof : false,
    });
    try {
      const response = await files.read(path, offset > 1 ? { offset, limit: pageSize } : { limit: pageSize }, active.signal);
      if (mine !== generation) return;
      const page = normalizePreviewPage(response, offset);
      if (page.lines === 0 && offset > 1) {
        emit({ ...snapshot, status: "ready", eof: true, text: "", lines: 0 });
        return;
      }
      emit(
        page.totalLines === undefined
          ? { status: "ready", path, text: page.text, offset: page.offset, lines: page.lines, eof: page.eof }
          : {
              status: "ready",
              path,
              text: page.text,
              offset: page.offset,
              lines: page.lines,
              totalLines: page.totalLines,
              eof: page.eof,
            },
      );
    } catch (error) {
      if (mine !== generation) return;
      if (active.signal.aborted) return;
      emit({ status: "failed", path, text: "", offset, lines: 0, eof: false, failure: classifyPreviewFailure(error) });
    }
  };

  return {
    maxLines: pageSize,
    getSnapshot: () => snapshot,
    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    async open(path) {
      stack = [1];
      await read(path, 1);
    },
    async next() {
      if (snapshot.status !== "ready" || snapshot.path === undefined || snapshot.eof) return;
      const offset = snapshot.offset + Math.max(snapshot.lines, 1);
      if (snapshot.totalLines !== undefined && offset > snapshot.totalLines) return;
      stack.push(offset);
      await read(snapshot.path, offset);
    },
    async prev() {
      if (snapshot.path === undefined || stack.length <= 1) return;
      stack = stack.slice(0, -1);
      const offset = stack[stack.length - 1] ?? 1;
      await read(snapshot.path, offset);
    },
    async retry() {
      if (snapshot.path === undefined) return;
      await read(snapshot.path, snapshot.offset);
    },
    close() {
      generation += 1;
      controller?.abort();
      controller = null;
      stack = [1];
      emit(IDLE_PREVIEW);
    },
  };
}

/**
 * Format the page counter the toolbar paints.
 * @param snapshot - the held page.
 * @returns the current range and, when the host reports it, the file's total.
 */
export function describePage(snapshot: PreviewSnapshot): { readonly range: string; readonly total?: string } {
  if (snapshot.status !== "ready" || snapshot.lines === 0) return { range: "—" };
  const end = snapshot.offset + snapshot.lines - 1;
  const range = `${String(snapshot.offset)}–${String(end)}`;
  return snapshot.totalLines === undefined
    ? { range }
    : { range, total: String(snapshot.totalLines) };
}

/** One element the fallback renderer can produce. */
export type MarkdownElement = ReactElement;
