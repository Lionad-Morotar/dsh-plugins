import { describe, expect, it } from "vitest";

import {
  composeInsertion,
  displayPath,
  isAbsolutePath,
  separatorOf,
  toAbsolutePath,
} from "../src/client/paths.ts";

/**
 * The navigation mode's only irreversible step is writing into the composer, and
 * the two ways to get it wrong are a glued path and a Windows path built with
 * the wrong separator. Both are decided here.
 */

describe("toAbsolutePath", () => {
  const cwd = "/Users/lionad/Github/Lionad-Morotar/dsh-plugins";

  it("joins a relative candidate onto the session cwd", () => {
    expect(toAbsolutePath(cwd, "src/client/panel.ts")).toBe(`${cwd}/src/client/panel.ts`);
  });

  it("keeps a directory candidate's trailing separator", () => {
    expect(toAbsolutePath(cwd, "src/client/")).toBe(`${cwd}/src/client/`);
  });

  it("strips a leading ./ before joining", () => {
    expect(toAbsolutePath(cwd, "./README.md")).toBe(`${cwd}/README.md`);
  });

  it("leaves an absolute candidate untouched", () => {
    expect(toAbsolutePath(cwd, "/etc/hosts")).toBe("/etc/hosts");
  });

  it("does not duplicate the separator when cwd ends with one", () => {
    expect(toAbsolutePath("/tmp/", "a.txt")).toBe("/tmp/a.txt");
  });

  it("joins against a filesystem root without doubling slashes", () => {
    expect(toAbsolutePath("/", "a.txt")).toBe("/a.txt");
  });

  it("uses backslashes for a Windows cwd", () => {
    const windows = "C:\\Users\\lionad\\project";
    expect(toAbsolutePath(windows, "src/a.ts")).toBe(`${windows}\\src\\a.ts`);
  });

  it("treats a drive-rooted candidate as absolute", () => {
    expect(toAbsolutePath("C:\\project", "D:\\other\\a.ts")).toBe("D:\\other\\a.ts");
  });

  it("returns the candidate as-is when there is no cwd", () => {
    expect(toAbsolutePath("", "src/a.ts")).toBe("src/a.ts");
  });
});

describe("isAbsolutePath", () => {
  it("recognises posix, drive-letter and UNC paths", () => {
    expect(isAbsolutePath("/a")).toBe(true);
    expect(isAbsolutePath("C:/a")).toBe(true);
    expect(isAbsolutePath("C:\\a")).toBe(true);
    expect(isAbsolutePath("\\\\server\\share")).toBe(true);
    expect(isAbsolutePath("a/b")).toBe(false);
  });
});

describe("separatorOf", () => {
  it("infers from the spelling and defaults to a slash", () => {
    expect(separatorOf("C:\\a\\b")).toBe("\\");
    expect(separatorOf("/a/b")).toBe("/");
  });
});

describe("composeInsertion", () => {
  it("adds nothing in an empty draft", () => {
    expect(composeInsertion("", 0, "/a/b.ts")).toBe("/a/b.ts");
  });

  it("separates from a preceding word", () => {
    expect(composeInsertion("看看这个", 4, "/a/b.ts")).toBe(" /a/b.ts");
  });

  it("does not pad after existing whitespace", () => {
    expect(composeInsertion("look at ", 8, "/a/b.ts")).toBe("/a/b.ts");
  });

  it("pads both sides when inserted inside a word", () => {
    expect(composeInsertion("abcd", 2, "/a/b.ts")).toBe(" /a/b.ts ");
  });

  it("does not pad against a closing bracket", () => {
    expect(composeInsertion("()", 1, "/a/b.ts")).toBe("/a/b.ts");
  });

  it("does not pad after an opening bracket", () => {
    expect(composeInsertion("(", 1, "/a/b.ts")).toBe("/a/b.ts");
  });

  it("skips the trailing pad for a directory path", () => {
    expect(composeInsertion("abcd", 2, "/a/b/")).toBe(" /a/b/");
  });

  it("clamps an out-of-range caret instead of throwing", () => {
    // Clamped to the end: separated from the preceding word.
    expect(composeInsertion("abc", 99, "/x")).toBe(" /x");
    // Clamped to the start: separated from the following word.
    expect(composeInsertion("abc", -3, "/x")).toBe("/x ");
  });
});

describe("displayPath", () => {
  it("keeps a directory's trailing slash and strips ./", () => {
    expect(displayPath({ path: "./src", kind: "directory" })).toBe("src/");
    expect(displayPath({ path: "src/", kind: "directory" })).toBe("src/");
    expect(displayPath({ path: "./src/a.ts", kind: "file" })).toBe("src/a.ts");
  });
});
