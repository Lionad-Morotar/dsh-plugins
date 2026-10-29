/**
 * Pure parsers over git stdout. No I/O and no host types: the acceptance probe
 * imports these functions through `lib/index.js` and drives them with captured
 * command output, so they must stay free of Cordis and of the working directory.
 */
import type {
  GitBranchState,
  GitChange,
  GitChangeStatus,
  GitCommit,
  GitRef,
  GitRefEntry,
} from "./types.ts";

const LOG_FIELDS = 5;
const MAX_REF_NAME = 512;

/**
 * Split a log line into at most `fieldCount` fields, keeping every separator
 * after the last one inside the final field. Commit subjects routinely contain
 * `|`; splitting without a bound would shift the subject into the parent list.
 */
function splitBounded(line: string, fieldCount: number): string[] | null {
  const fields: string[] = [];
  let start = 0;
  for (let index = 0; index < fieldCount - 1; index += 1) {
    const separator = line.indexOf("|", start);
    if (separator < 0) return null;
    fields.push(line.slice(start, separator));
    start = separator + 1;
  }
  fields.push(line.slice(start));
  return fields;
}

/**
 * Parse `git log --pretty=format:%H|%P|%an|%at|%s` output.
 *
 * One line per commit; `%P` is space separated and empty for a root commit.
 * Empty lines are skipped because the format ends without a trailing newline
 * only on the last record and merge output may otherwise carry blank separators.
 */
export function parseLog(text: string): GitCommit[] {
  const commits: GitCommit[] = [];
  for (const raw of text.split("\n")) {
    const line = raw.endsWith("\r") ? raw.slice(0, -1) : raw;
    if (line === "") continue;
    const fields = splitBounded(line, LOG_FIELDS);
    if (fields === null) continue;
    const hash = fields[0] ?? "";
    if (hash === "") continue;
    const parentsRaw = (fields[1] ?? "").trim();
    const seconds = Number.parseInt(fields[3] ?? "", 10);
    commits.push({
      hash,
      parents: parentsRaw === "" ? [] : parentsRaw.split(/\s+/u),
      author: fields[2] ?? "",
      time: Number.isFinite(seconds) ? seconds : 0,
      subject: fields[4] ?? "",
    });
  }
  return commits;
}

function refKind(name: string): GitRef["kind"] {
  return name.startsWith("origin/") || name.includes("/") ? "remote" : "branch";
}

/**
 * Parse the `%D` decoration field of `git log --decorate=full`.
 *
 * Full decorations carry `refs/heads/…` and `refs/remotes/…`, which is what
 * disambiguates a local branch named `feat/x` from a remote-tracking ref. The
 * short forms are accepted as a fallback because `%D` is also used without
 * `--decorate=full` in some call sites.
 */
export function parseRefs(decoration: string): GitRef[] {
  const refs: GitRef[] = [];
  for (const raw of decoration.split(",")) {
    let token = raw.trim();
    if (token === "" || token.length > MAX_REF_NAME) continue;
    let head = false;
    if (token.startsWith("HEAD -> ")) {
      head = true;
      token = token.slice("HEAD -> ".length).trim();
    } else if (token === "HEAD") {
      continue;
    }
    if (token.startsWith("tag: ")) {
      const name = token.slice("tag: ".length).trim().replace(/^refs\/tags\//u, "");
      refs.push({ kind: "tag", name, head: false });
    } else if (token.startsWith("refs/tags/")) {
      refs.push({ kind: "tag", name: token.slice("refs/tags/".length), head: false });
    } else if (token.startsWith("refs/remotes/")) {
      refs.push({ kind: "remote", name: token.slice("refs/remotes/".length), head });
    } else if (token.startsWith("refs/heads/")) {
      refs.push({ kind: "branch", name: token.slice("refs/heads/".length), head });
    } else if (head) {
      refs.push({ kind: "branch", name: token, head });
    } else {
      refs.push({ kind: refKind(token), name: token, head });
    }
  }
  return refs;
}

/**
 * Parse `git for-each-ref --format=%(refname)%00%(objectname)%00%(HEAD)` lines.
 *
 * A ref name cannot contain NUL or newline, so a record is one line and the
 * three fields are unambiguous even when the branch name holds spaces (git
 * itself forbids those, but the parser should not be the thing that decides).
 */
export function parseRefListing(text: string): GitRefEntry[] {
  const entries: GitRefEntry[] = [];
  for (const line of text.split("\n")) {
    if (line === "") continue;
    const parts = line.split("\0");
    const refname = parts[0] ?? "";
    const hash = parts[1] ?? "";
    if (refname === "" || hash === "") continue;
    const head = (parts[2] ?? "") === "*";
    if (refname.startsWith("refs/heads/")) {
      entries.push({ kind: "branch", name: refname.slice("refs/heads/".length), hash, head });
    } else if (refname.startsWith("refs/remotes/")) {
      const name = refname.slice("refs/remotes/".length);
      // `origin/HEAD` is a symbolic pointer, not a branch the panel should list.
      if (name.endsWith("/HEAD")) continue;
      entries.push({ kind: "remote", name, hash, head });
    } else if (refname.startsWith("refs/tags/")) {
      entries.push({ kind: "tag", name: refname.slice("refs/tags/".length), hash, head });
    }
  }
  return entries;
}

function statusFromCode(code: string): GitChangeStatus | null {
  switch (code) {
    case "A":
      return "added";
    case "M":
      return "modified";
    case "D":
      return "deleted";
    case "R":
      return "renamed";
    case "C":
      return "copied";
    case "T":
      return "typechange";
    case "U":
      return "conflicted";
    default:
      return null;
  }
}

/** Read `count` space-separated fields and return the unparsed remainder. */
function takeFields(text: string, count: number): { fields: string[]; rest: string } | null {
  const fields: string[] = [];
  let cursor = 0;
  for (let index = 0; index < count; index += 1) {
    const separator = text.indexOf(" ", cursor);
    if (separator < 0) return null;
    fields.push(text.slice(cursor, separator));
    cursor = separator + 1;
  }
  return { fields, rest: text.slice(cursor) };
}

function changePath(path: string): { path: string; isDirectory: boolean } | null {
  if (path === "") return null;
  if (path.endsWith("/")) return { path: path.replace(/\/+$/u, ""), isDirectory: true };
  return { path, isDirectory: false };
}

/**
 * Parse `git status --porcelain=v2 -z --branch`.
 *
 * Records are NUL separated. Renames and copies carry the new path in the
 * record and the original path in the following NUL field, which is why the
 * loop owns the cursor instead of using a plain `map`.
 */
export function parseStatusZ(text: string): GitChange[] {
  const records = text.split("\0");
  const changes: GitChange[] = [];
  for (let index = 0; index < records.length; index += 1) {
    const record = records[index];
    if (record === undefined || record === "") continue;
    if (record.startsWith("# ")) continue;
    const kind = record[0];
    if (kind === "?") {
      if (record[1] !== " ") continue;
      const parsed = changePath(record.slice(2));
      if (parsed === null) continue;
      changes.push({ ...parsed, status: "untracked", staged: false, index: "?", worktree: "?" });
      continue;
    }
    if (kind === "!") continue;
    if (kind === "1" || kind === "2") {
      const fields = takeFields(record.slice(2), kind === "1" ? 7 : 8);
      if (fields === null) continue;
      const xy = fields.fields[0] ?? "";
      const parsed = changePath(fields.rest);
      if (parsed === null || xy.length < 2) continue;
      const x = xy[0] ?? ".";
      const y = xy[1] ?? ".";
      let origPath: string | undefined;
      if (kind === "2") {
        const next = records[index + 1];
        if (next === undefined || next === "") continue;
        origPath = next;
        index += 1;
      }
      const stagedStatus = statusFromCode(x);
      const worktreeStatus = statusFromCode(y);
      if (stagedStatus !== null) {
        changes.push({
          ...parsed,
          status: stagedStatus,
          staged: true,
          index: x,
          worktree: y,
          ...(origPath === undefined ? {} : { origPath }),
        });
      }
      if (worktreeStatus !== null) {
        changes.push({
          ...parsed,
          status: worktreeStatus,
          staged: false,
          index: x,
          worktree: y,
          ...(origPath === undefined ? {} : { origPath }),
        });
      }
      continue;
    }
    if (kind === "u") {
      const fields = takeFields(record.slice(2), 9);
      if (fields === null) continue;
      const xy = fields.fields[0] ?? "";
      const parsed = changePath(fields.rest);
      if (parsed === null) continue;
      changes.push({
        ...parsed,
        status: "conflicted",
        staged: false,
        index: xy[0] ?? ".",
        worktree: xy[1] ?? ".",
      });
    }
  }
  return changes;
}

/**
 * Read the `# branch.*` header records emitted by
 * `git status --porcelain=v2 --branch -z`. The function tolerates the headers
 * being absent (a bare `--porcelain=v2` call), in which case every field is
 * null and the caller falls back to `rev-parse`.
 */
export function parseStatusBranch(text: string): GitBranchState {
  let hash: string | null = null;
  let branch: string | null = null;
  let detached = false;
  let upstream: string | undefined;
  let ahead: number | undefined;
  let behind: number | undefined;
  for (const record of text.split("\0")) {
    if (!record.startsWith("# ")) continue;
    if (record.startsWith("# branch.oid ")) {
      const value = record.slice("# branch.oid ".length);
      hash = value === "(initial)" ? null : value;
    } else if (record.startsWith("# branch.head ")) {
      const value = record.slice("# branch.head ".length);
      if (value === "(detached)") {
        detached = true;
        branch = null;
      } else {
        branch = value;
      }
    } else if (record.startsWith("# branch.upstream ")) {
      upstream = record.slice("# branch.upstream ".length);
    } else if (record.startsWith("# branch.ab ")) {
      const match = /^\+(\d+) -(\d+)$/u.exec(record.slice("# branch.ab ".length));
      if (match !== null) {
        ahead = Number(match[1]);
        behind = Number(match[2]);
      }
    }
  }
  return {
    hash,
    branch,
    detached,
    ...(upstream === undefined ? {} : { upstream }),
    ...(ahead === undefined ? {} : { ahead }),
    ...(behind === undefined ? {} : { behind }),
  };
}
