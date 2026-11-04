/**
 * Remote links, decided without the DOM or the network.
 *
 * The whole feature is one string built from four facts, and every way it can be
 * wrong is silent: a link that 404s, a link that points at another repository, a
 * branch name that got percent-encoded into a ref GitHub cannot resolve. These
 * tests pin each of those, because a reader who copies a broken URL has no way to
 * tell which part was wrong.
 */
import { describe, expect, it } from "vitest";

import { buildRemoteLinks, normalizeRemoteUrl, providerOf } from "../src/client/remote-url.ts";
import type { FsGitHead } from "../src/client/status.ts";

/** A HEAD on a branch. */
function head(branch: string | null, hash = "abc123"): FsGitHead {
  return { hash, branch, detached: branch === null };
}

/** One remote as the snapshot reports it. */
function remote(name: string, url: string): { readonly name: string; readonly url: string } {
  return { name, url };
}

/** The input every case starts from: one GitHub remote, one file inside the root. */
function input(overrides: Partial<Parameters<typeof buildRemoteLinks>[0]> = {}) {
  return {
    remotes: [remote("origin", "https://github.com/acme/app.git")],
    root: "/repo",
    absolutePath: "/repo/src/a.ts",
    kind: "file" as const,
    head: head("main"),
    ...overrides,
  };
}

describe("normalizeRemoteUrl", () => {
  it("turns an scp-style remote into an https base", () => {
    expect(normalizeRemoteUrl("git@github.com:acme/app.git")).toBe("https://github.com/acme/app");
  });

  it("turns an ssh:// remote into an https base", () => {
    expect(normalizeRemoteUrl("ssh://git@github.com/acme/app.git")).toBe("https://github.com/acme/app");
    expect(normalizeRemoteUrl("ssh://git@github.com:22/acme/app.git")).toBe("https://github.com/acme/app");
  });

  it("drops the user from an https remote", () => {
    expect(normalizeRemoteUrl("https://user@github.com/acme/app.git")).toBe("https://github.com/acme/app");
    expect(normalizeRemoteUrl("https://token@github.com/acme/app")).toBe("https://github.com/acme/app");
  });

  it("keeps http and https as they are", () => {
    expect(normalizeRemoteUrl("http://git.example.com/acme/app.git")).toBe("http://git.example.com/acme/app");
    expect(normalizeRemoteUrl("https://git.example.com/acme/app")).toBe("https://git.example.com/acme/app");
  });

  it("strips a trailing .git and a trailing slash", () => {
    expect(normalizeRemoteUrl("https://github.com/acme/app.git/")).toBe("https://github.com/acme/app");
    expect(normalizeRemoteUrl("https://github.com/acme/app/")).toBe("https://github.com/acme/app");
  });

  it("keeps a nested group path", () => {
    expect(normalizeRemoteUrl("git@gitlab.com:acme/team/app.git")).toBe("https://gitlab.com/acme/team/app");
  });

  it("refuses what it cannot parse", () => {
    expect(normalizeRemoteUrl("")).toBeUndefined();
    expect(normalizeRemoteUrl("   ")).toBeUndefined();
    expect(normalizeRemoteUrl("not a url")).toBeUndefined();
    expect(normalizeRemoteUrl("/local/path/repo.git")).toBeUndefined();
  });
});

describe("providerOf", () => {
  it("names the five known providers", () => {
    expect(providerOf("github.com")).toBe("github");
    expect(providerOf("gitlab.com")).toBe("gitlab");
    expect(providerOf("gitee.com")).toBe("gitee");
    expect(providerOf("bitbucket.org")).toBe("bitbucket");
    expect(providerOf("codeberg.org")).toBe("codeberg");
  });

  it("recognises a self-hosted GitLab by its host name", () => {
    expect(providerOf("gitlab.acme.internal")).toBe("gitlab");
  });

  it("falls back to a generic provider", () => {
    expect(providerOf("git.example.com")).toBe("generic");
  });
});

describe("buildRemoteLinks", () => {
  it("builds a GitHub file link on the current branch", () => {
    expect(buildRemoteLinks(input())).toEqual([
      { id: "copy.remote.origin", label: "origin · GitHub", url: "https://github.com/acme/app/blob/main/src/a.ts" },
    ]);
  });

  it("uses tree for a directory", () => {
    expect(buildRemoteLinks(input({ kind: "directory", absolutePath: "/repo/src" }))[0]?.url).toBe(
      "https://github.com/acme/app/tree/main/src",
    );
  });

  it("uses GitLab's dash-prefixed path", () => {
    const links = buildRemoteLinks(
      input({ remotes: [remote("origin", "git@gitlab.com:acme/app.git")] }),
    );
    expect(links[0]?.url).toBe("https://gitlab.com/acme/app/-/blob/main/src/a.ts");
    expect(buildRemoteLinks(input({ remotes: [remote("origin", "git@gitlab.com:acme/app.git")], kind: "directory", absolutePath: "/repo/src" }))[0]?.url).toBe(
      "https://gitlab.com/acme/app/-/tree/main/src",
    );
  });

  it("uses Gitee's plain blob path", () => {
    const links = buildRemoteLinks(input({ remotes: [remote("origin", "git@gitee.com:acme/app.git")] }));
    expect(links[0]?.url).toBe("https://gitee.com/acme/app/blob/main/src/a.ts");
    expect(links[0]?.label).toBe("origin · Gitee");
  });

  it("uses Bitbucket's src path for both kinds", () => {
    const file = buildRemoteLinks(input({ remotes: [remote("origin", "git@bitbucket.org:acme/app.git")] }));
    expect(file[0]?.url).toBe("https://bitbucket.org/acme/app/src/main/src/a.ts");
    const directory = buildRemoteLinks(
      input({ remotes: [remote("origin", "git@bitbucket.org:acme/app.git")], kind: "directory", absolutePath: "/repo/src" }),
    );
    expect(directory[0]?.url).toBe("https://bitbucket.org/acme/app/src/main/src");
  });

  it("uses Codeberg's src/branch path", () => {
    const links = buildRemoteLinks(input({ remotes: [remote("origin", "git@codeberg.org:acme/app.git")] }));
    expect(links[0]?.url).toBe("https://codeberg.org/acme/app/src/branch/main/src/a.ts");
    expect(links[0]?.label).toBe("origin · Codeberg");
  });

  it("falls back to a generic blob path for an unknown host", () => {
    const links = buildRemoteLinks(input({ remotes: [remote("origin", "https://git.example.com/acme/app.git")] }));
    expect(links[0]?.url).toBe("https://git.example.com/acme/app/blob/main/src/a.ts");
    expect(links[0]?.label).toBe("origin · Git");
  });

  it("uses the commit hash when HEAD is detached", () => {
    const links = buildRemoteLinks(input({ head: head(null, "deadbeef") }));
    expect(links[0]?.url).toBe("https://github.com/acme/app/blob/deadbeef/src/a.ts");
  });

  it("falls back to HEAD when the snapshot has no branch and no hash", () => {
    const links = buildRemoteLinks(input({ head: undefined }));
    expect(links[0]?.url).toBe("https://github.com/acme/app/blob/HEAD/src/a.ts");
  });

  it("keeps slashes in a branch name instead of encoding them", () => {
    // GitHub resolves `feature/x` as a ref only when the slash survives; an
    // encoded `%2F` is a 404 that looks like a valid URL.
    const links = buildRemoteLinks(input({ head: head("feature/nested/thing") }));
    expect(links[0]?.url).toBe("https://github.com/acme/app/blob/feature/nested/thing/src/a.ts");
  });

  it("encodes spaces and non-ASCII in the path but keeps the separators", () => {
    const links = buildRemoteLinks(input({ absolutePath: "/repo/docs/我的 笔记/a b.md" }));
    expect(links[0]?.url).toBe(
      "https://github.com/acme/app/blob/main/docs/%E6%88%91%E7%9A%84%20%E7%AC%94%E8%AE%B0/a%20b.md",
    );
  });

  it("answers nothing when the path is outside the repository root", () => {
    expect(buildRemoteLinks(input({ absolutePath: "/elsewhere/a.ts" }))).toEqual([]);
  });

  it("answers nothing when the root or the absolute path is unknown", () => {
    expect(buildRemoteLinks(input({ root: undefined }))).toEqual([]);
    expect(buildRemoteLinks(input({ absolutePath: undefined }))).toEqual([]);
  });

  it("answers nothing when the repository has no remotes", () => {
    expect(buildRemoteLinks(input({ remotes: undefined }))).toEqual([]);
    expect(buildRemoteLinks(input({ remotes: [] }))).toEqual([]);
  });

  it("skips a remote whose URL cannot be parsed", () => {
    const links = buildRemoteLinks(
      input({ remotes: [remote("broken", "not a url"), remote("origin", "https://github.com/acme/app.git")] }),
    );
    expect(links.map(link => link.id)).toEqual(["copy.remote.origin"]);
  });

  it("lists one link per remote, keeping the first of a duplicated name", () => {
    const links = buildRemoteLinks(
      input({
        remotes: [
          remote("origin", "https://github.com/acme/app.git"),
          remote("upstream", "https://github.com/acme/upstream.git"),
          remote("origin", "https://github.com/other/app.git"),
        ],
      }),
    );
    expect(links.map(link => link.id)).toEqual(["copy.remote.origin", "copy.remote.upstream"]);
    expect(links[0]?.url).toContain("acme/app");
  });

  it("links a file at the repository root", () => {
    const links = buildRemoteLinks(input({ absolutePath: "/repo/README.md" }));
    expect(links[0]?.url).toBe("https://github.com/acme/app/blob/main/README.md");
  });

  it("treats the root itself as a directory path with no trailing slash", () => {
    const links = buildRemoteLinks(input({ kind: "directory", absolutePath: "/repo" }));
    expect(links[0]?.url).toBe("https://github.com/acme/app/tree/main");
  });

  it("does not mistake a sibling directory for a descendant of the root", () => {
    // `/repo-other` starts with `/repo`, so a prefix test without a separator
    // would claim it is inside.
    expect(buildRemoteLinks(input({ absolutePath: "/repo-other/a.ts" }))).toEqual([]);
  });
});

describe("branch names that mean something to a URL parser", () => {
  /** One link for a repository on GitHub with the given branch. */
  function linkFor(branch: string): string {
    const links = buildRemoteLinks({
      remotes: [{ name: "origin", url: "https://github.com/acme/app.git" }],
      root: "/repo",
      absolutePath: "/repo/docs/a.md",
      kind: "file",
      head: { hash: "abc123", branch, detached: false },
    });
    return links[0]?.url ?? "";
  }

  it("encodes a hash so it cannot start a fragment", () => {
    // `wip#1` unencoded would make everything after `#` a fragment, and the file
    // path would stop being part of the request.
    expect(linkFor("wip#1")).toBe("https://github.com/acme/app/blob/wip%231/docs/a.md");
  });

  it("encodes a question mark so it cannot start a query", () => {
    expect(linkFor("a?b")).toBe("https://github.com/acme/app/blob/a%3Fb/docs/a.md");
  });

  it("encodes a percent so it cannot be read as an escape", () => {
    expect(linkFor("100%")).toBe("https://github.com/acme/app/blob/100%25/docs/a.md");
  });

  it("keeps the slash between ref segments", () => {
    // GitHub and GitLab read `/` as the ref separator; encoding it is a 404.
    expect(linkFor("feature/x")).toBe("https://github.com/acme/app/blob/feature/x/docs/a.md");
  });
});
