/**
 * The GFM surface itself: tables and task lists prove the remark plugin is
 * wired, `skipHtml` proves raw HTML stays text, and a relative image proves
 * the placeholder policy.
 */
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { MarkdownView } from "../src/client/chunk/markdown.tsx";

function render(text: string): string {
  return renderToStaticMarkup(createElement(MarkdownView, { text }));
}

describe("MarkdownView", () => {
  it("renders GFM tables", () => {
    const html = render("| 列 | 值 |\n| --- | --- |\n| a | 1 |\n");

    expect(html).toContain("<table>");
    expect(html).toContain("<th>列</th>");
    expect(html).toContain("<td>a</td>");
  });

  it("renders GFM task lists", () => {
    const html = render("- [x] 完成\n- [ ] 未完成\n");

    expect(html).toContain('type="checkbox"');
    expect(html).toContain("checked");
  });

  it("skips raw HTML instead of parsing it", () => {
    const html = render('<script>alert("x")</script>\n\n正文\n');

    expect(html).not.toContain("<script>");
    expect(html).toContain("正文");
  });

  it("turns a workspace-relative image into a named placeholder", () => {
    const html = render("![架构图](./assets/arch.png)\n");

    expect(html).toContain("fmd-img");
    expect(html).toContain("架构图");
    expect(html).not.toContain("<img");
  });

  it("keeps an absolute web image as an image", () => {
    const html = render("![logo](https://example.com/logo.png)\n");

    expect(html).toContain("<img");
    expect(html).toContain("https://example.com/logo.png");
  });
});
