/**
 * Remote links: one browser URL per configured remote, for the file that was
 * right-clicked.
 *
 * Pure and DOM-free, because every way this can be wrong is silent. A link that
 * 404s, a link that points at a different repository, a branch name that got
 * percent-encoded into a ref the host cannot resolve: none of them throw, and the
 * reader who pastes one has no way to tell which part was wrong. So the two
 * decisions live here, apart from the menu that paints them.
 *
 * The host reports remote URLs verbatim (`git@host:owner/repo.git` and
 * `https://host/owner/repo` are different strings). Turning either into a
 * browsable base is this module's job, and so is knowing which provider's URL
 * shape to build.
 */
import type { FsGitHead } from "./status.ts";
import type { FsGitRemote } from "./wire.ts";

/** One copyable link: a remote, the provider it belongs to, and the URL. */
export interface RemoteLink {
  readonly id: string;
  readonly label: string;
  readonly url: string;
}

/** The providers whose URL shapes this module knows. */
export type RemoteProvider = "github" | "gitlab" | "gitee" | "bitbucket" | "codeberg" | "generic";

/** The name each provider is shown under, in the menu row. */
const PROVIDER_LABEL: Readonly<Record<RemoteProvider, string>> = {
  github: "GitHub",
  gitlab: "GitLab",
  gitee: "Gitee",
  bitbucket: "Bitbucket",
  codeberg: "Codeberg",
  generic: "Git",
};

/**
 * Which provider one host belongs to.
 *
 * `gitlab` is matched as a substring because self-hosted instances are named
 * `gitlab.acme.internal` far more often than anything else; the other four are
 * matched exactly, because a host merely containing `github` is not GitHub.
 * @param host - the URL's host, without a port.
 * @returns the provider, or `generic` for a host this module does not know.
 */
export function providerOf(host: string): RemoteProvider {
  const name = host.toLowerCase();
  if (name === "github.com") return "github";
  if (name === "gitee.com") return "gitee";
  if (name === "bitbucket.org") return "bitbucket";
  if (name === "codeberg.org") return "codeberg";
  if (name.includes("gitlab")) return "gitlab";
  return "generic";
}

/**
 * The path segment that separates a repository from a path, per provider.
 *
 * These are not cosmetic: GitLab nests everything under `/-/` so that a branch
 * named `blob` cannot be mistaken for the route, Bitbucket calls it `src`, and
 * Codeberg needs `src/branch` to disambiguate the ref. A wrong segment is a 404
 * on a URL that still looks right.
 */
const ROUTE: Readonly<Record<RemoteProvider, { readonly file: string; readonly directory: string }>> = {
  github: { file: "blob", directory: "tree" },
  gitlab: { file: "-/blob", directory: "-/tree" },
  gitee: { file: "blob", directory: "tree" },
  bitbucket: { file: "src", directory: "src" },
  codeberg: { file: "src/branch", directory: "src/branch" },
  generic: { file: "blob", directory: "tree" },
};

/** One parsed remote: its browsable base, the host, and the provider. */
interface RemoteBase {
  readonly base: string;
  readonly host: string;
}

/**
 * Turn one remote URL into an https base.
 *
 * Every form git accepts is folded to `https://host/owner/repo`:
 * `git@host:owner/repo.git`, `ssh://git@host[:port]/owner/repo.git`,
 * `https://user@host/owner/repo.git`, and the plain `http(s)` forms. Credentials
 * are dropped because a link with a token in it is a link that leaks a token.
 *
 * A local path (`/srv/git/repo.git`) and anything without a host are refused:
 * there is no browser URL to build for them, and guessing one would produce a
 * link that silently points nowhere.
 * @param raw - the URL exactly as `git remote -v` printed it.
 * @returns the base and its host, or undefined when this is not a remote URL.
 */
export function parseRemoteUrl(raw: string): RemoteBase | undefined {
  const url = raw.trim();
  if (url === "") return undefined;

  // `git@host:owner/repo` and `user@host:owner/repo`: the colon is a path
  // separator, not a port, which is why this is matched before the URL parser.
  const scp = /^(?:[^@/\s]+)@([^:/\s]+):(.+)$/u.exec(url);
  if (scp !== null && !url.includes("://")) {
    const host = scp[1] ?? "";
    const path = trimRepositoryPath(scp[2] ?? "");
    return path === "" ? undefined : { base: `https://${host}/${path}`, host };
  }

  // `ssh://`, `git://`, `http://`, `https://`: the URL parser handles the port,
  // the credentials and the scheme, and the scheme is then replaced.
  const scheme = /^([a-z][a-z0-9+.-]*):\/\//iu.exec(url);
  if (scheme === null) return undefined;
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return undefined;
  }
  const protocol = parsed.protocol.toLowerCase();
  if (protocol !== "http:" && protocol !== "https:" && protocol !== "ssh:" && protocol !== "git:") {
    return undefined;
  }
  if (parsed.hostname === "") return undefined;
  const path = trimRepositoryPath(parsed.pathname);
  if (path === "") return undefined;
  // Credentials are dropped on purpose: a copied link must not carry a token.
  const schemeOut = protocol === "http:" ? "http" : "https";
  return { base: `${schemeOut}://${parsed.hostname}/${path}`, host: parsed.hostname };
}

/**
 * The `owner/repo` part of a remote path, without a leading or trailing slash
 * and without the `.git` suffix git appends to a clone URL.
 * @param path - the path as parsed out of the remote URL.
 * @returns the trimmed repository path, or `""` when nothing is left.
 */
function trimRepositoryPath(path: string): string {
  return path
    .replace(/^\/+/u, "")
    .replace(/\/+$/u, "")
    .replace(/\.git$/u, "")
    .replace(/\/+$/u, "");
}

/**
 * The browsable base of one remote URL, or undefined when there is none.
 *
 * The string form of {@link parseRemoteUrl}, for a caller that only needs the
 * base and not the host the provider is chosen from.
 * @param raw - the URL exactly as `git remote -v` printed it.
 * @returns `https://host/owner/repo`, or undefined when it cannot be parsed.
 */
export function normalizeRemoteUrl(raw: string): string | undefined {
  return parseRemoteUrl(raw)?.base;
}

/**
 * One path segment, encoded for a URL but keeping the separators.
 *
 * `encodeURIComponent` would turn a `/` inside a name into `%2F`, which the
 * provider reads as part of the file name rather than as a directory boundary.
 * Splitting first and encoding each segment keeps both facts true.
 * @param path - a repository-relative path.
 * @returns the path with each segment encoded.
 */
function encodePath(path: string): string {
  return path
    .split("/")
    .filter(segment => segment !== "")
    .map(segment => encodeURIComponent(segment))
    .join("/");
}

/**
 * The ref a link should point at.
 *
 * A branch is the useful answer while the reader is on one; a detached HEAD has
 * no branch, so its commit is the only thing that names what is on screen. With
 * neither, `HEAD` is what the provider resolves server-side.
 *
 * The branch is deliberately not encoded: GitHub and GitLab both need a literal
 * `/` to see `feature/x` as one ref, and `%2F` is a 404 that still looks valid.
 * @param head - the snapshot's HEAD summary.
 * @returns the ref segment.
 */
function refOf(head: FsGitHead | undefined): string {
  const branch = head?.branch;
  if (typeof branch === "string" && branch !== "") return encodeRef(branch);
  const hash = head?.hash;
  if (typeof hash === "string" && hash !== "") return hash;
  return "HEAD";
}

/**
 * Encode one ref for a URL path, keeping its separators.
 *
 * Git allows `#`, `?` and `%` in a branch name, and each of them means something
 * to a URL parser: `wip#1` would turn the rest of the link into a fragment and
 * `a?b` into a query, so the file path would stop being part of the request. The
 * `/` between segments is the one character that has to stay literal, because
 * GitHub and GitLab read it as the ref separator.
 * @param ref - the branch name as git reports it.
 * @returns the ref with each segment encoded.
 */
function encodeRef(ref: string): string {
  return ref
    .split("/")
    .map(segment => encodeURIComponent(segment))
    .join("/");
}

/**
 * The path of one absolute file relative to the repository root.
 *
 * The workspace is often a subdirectory of the repository, so the prefix has to
 * come off; and the comparison must respect the separator, or `/repo-other`
 * would read as being inside `/repo`.
 * @param root - absolute repository root.
 * @param absolutePath - absolute path of the row.
 * @returns the repository-relative path, or undefined when the path is outside.
 */
function relativeTo(root: string, absolutePath: string): string | undefined {
  const base = root.replace(/\/+$/u, "");
  if (base === "") return undefined;
  if (absolutePath === base) return "";
  if (!absolutePath.startsWith(`${base}/`)) return undefined;
  return absolutePath.slice(base.length + 1);
}

/** Everything one link is built from. */
export interface RemoteLinkInput {
  readonly remotes: readonly FsGitRemote[] | undefined;
  /** Absolute repository root from the snapshot. */
  readonly root: string | undefined;
  /** Absolute path of the row, once `info` answered. */
  readonly absolutePath: string | undefined;
  readonly kind: "file" | "directory";
  readonly head: FsGitHead | undefined;
}

/**
 * Build one link per remote for the row that was right-clicked.
 *
 * An empty answer is a real answer: no remote, an unparseable URL, a path outside
 * the repository, or a host that never reported a root all mean there is no link
 * to offer, and the menu says so rather than painting a row that would fail.
 * @param input - the remotes, the repository root, the row's absolute path and HEAD.
 * @returns the links, in the order the remotes arrived.
 */
export function buildRemoteLinks(input: RemoteLinkInput): readonly RemoteLink[] {
  const { remotes, root, absolutePath, kind, head } = input;
  if (remotes === undefined || remotes.length === 0) return [];
  if (root === undefined || absolutePath === undefined) return [];

  const relative = relativeTo(root, absolutePath);
  if (relative === undefined) return [];

  const ref = refOf(head);
  const encoded = encodePath(relative);
  const links: RemoteLink[] = [];
  const seen = new Set<string>();

  for (const remote of remotes) {
    // A duplicated name is one remote as far as the menu is concerned, and the
    // first one wins: two rows with one id would both fire the same action.
    if (seen.has(remote.name)) continue;
    const parsed = parseRemoteUrl(remote.url);
    if (parsed === undefined) continue;
    seen.add(remote.name);
    const provider = providerOf(parsed.host);
    const route = ROUTE[provider][kind];
    const tail = encoded === "" ? "" : `/${encoded}`;
    links.push({
      id: `copy.remote.${remote.name}`,
      label: `${remote.name} · ${PROVIDER_LABEL[provider]}`,
      url: `${parsed.base}/${route}/${ref}${tail}`,
    });
  }
  return links;
}
