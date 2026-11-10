/**
 * The stylesheet minifier's contract.
 *
 * This is a hand-written squeezer, not a general CSS minifier, and the one thing
 * it must never do is change a value's meaning. It has already done so once: the
 * punctuation class included `+`, which stripped the whitespace around the
 * operator inside `calc()` and turned a valid length into an invalid one that
 * silently dropped the whole declaration. That is the regression these tests
 * exist to hold.
 */
import { describe, expect, it } from "vitest";

/**
 * The minifier is a plain ESM script with no declaration file, so it is loaded
 * through a typed seam rather than a static import. The shape below is exactly
 * what these tests assert, which keeps the cast honest.
 */
interface CssPluginModule {
  readonly minifyCss: (css: string) => string;
}

const { minifyCss } = (await import(
  // A variable specifier stops TypeScript resolving the untyped script.
  "../scripts/css-plugin.mjs" as string
)) as CssPluginModule;

describe("minifyCss", () => {
  it("keeps the whitespace around a calc plus", () => {
    const out = minifyCss("a { padding: calc(var(--x, 140px) + 12px); }");

    // CSS requires whitespace on both sides of `+` inside calc; without it the
    // value is invalid and the declaration is dropped.
    expect(out).toContain("calc(var(--x,140px) + 12px)");
    expect(out).not.toContain("140px)+12px");
  });

  it("still squeezes the punctuation that never needs whitespace", () => {
    const out = minifyCss("a , b { color : red ; }");

    expect(out).toBe("a,b{color:red}");
  });

  it("drops the comment and the trailing semicolon", () => {
    const out = minifyCss("/* note */ a { color: red; }");

    expect(out).toBe("a{color:red}");
  });

  it("leaves a selector combinator's meaning intact", () => {
    const out = minifyCss("a > b ~ c { color: red; }");

    expect(out).toBe("a>b~c{color:red}");
  });

  it("keeps a subtraction inside calc working", () => {
    // The other operator that needs its spacing, and the one the stylesheet used
    // as a workaround while the plus was broken.
    const out = minifyCss("a { margin: calc(100% - 12px); }");

    expect(out).toContain("calc(100% - 12px)");
  });

  it("is idempotent", () => {
    const once = minifyCss("a { padding: calc(var(--x, 140px) + 12px); }");

    expect(minifyCss(once)).toBe(once);
  });
});
