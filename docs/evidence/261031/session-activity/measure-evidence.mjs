/**
 * Measure the evidence page instead of eyeballing it.
 *
 * Reads the computed style of every workspace title and every session title in both
 * columns. This is what turns the screenshot from "looks right" into a checkable
 * claim: the workspace titles must differ between columns, and the session titles
 * must be byte-identical in every measured property.
 */
const { chromium } = await import(
  "/Users/lionad/.npm/_npx/0b6d5b421474bd84/node_modules/playwright/index.mjs"
);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 1180 } });
await page.goto("file:///Users/lionad/Github/Lionad-Morotar/dsh-plugins/temp/activity-evidence.html");

const measured = await page.evaluate(() => {
  const read = (el) => {
    const s = getComputedStyle(el);
    return { color: s.color, weight: s.fontWeight, opacity: s.opacity, text: el.textContent };
  };
  const panels = [...document.querySelectorAll(".panel")].slice(0, 2);
  return panels.map((panel) => ({
    caption: panel.querySelector(".panelCaption").textContent,
    workspaces: [...panel.querySelectorAll('[data-row-key^="workspace:"]')].map((row) => ({
      key: row.getAttribute("data-row-key"),
      title: read(row.querySelector(".JoiKIa_projectText .JoiKIa_title")),
    })),
    sessions: [...panel.querySelectorAll('[data-row-key^="session:"]')].map((row) => ({
      key: row.getAttribute("data-row-key"),
      title: read(row.querySelector(".JoiKIa_title")),
    })),
  }));
});

await browser.close();

const [base, plugin] = measured;
const line = (label, a, b, same) =>
  `${same ? "SAME" : "DIFF"}  ${label.padEnd(22)} base=${JSON.stringify(a)}  plugin=${JSON.stringify(b)}`;

console.log(`\n=== ${base.caption} vs ${plugin.caption} ===\n`);
console.log("--- 工作区标题（应当 DIFF）---");
for (let i = 0; i < base.workspaces.length; i++) {
  const a = base.workspaces[i].title;
  const b = plugin.workspaces[i].title;
  const same = a.color === b.color && a.weight === b.weight && a.opacity === b.opacity;
  console.log(line(b.text, `${a.color}/${a.weight}/${a.opacity}`, `${b.color}/${b.weight}/${b.opacity}`, same));
}

console.log("\n--- 会话标题（应当全部 SAME）---");
let sessionDiff = 0;
for (let i = 0; i < base.sessions.length; i++) {
  const a = base.sessions[i].title;
  const b = plugin.sessions[i].title;
  const same = a.color === b.color && a.weight === b.weight && a.opacity === b.opacity;
  if (!same) sessionDiff += 1;
  console.log(line(base.sessions[i].key, `${a.color}/${a.weight}/${a.opacity}`, `${b.color}/${b.weight}/${b.opacity}`, same));
}

const textChanged = base.workspaces.some((w, i) => w.title.text !== plugin.workspaces[i].title.text);
console.log(`\n标题文字是否被改：${textChanged ? "被改了（缺陷）" : "未改（正确）"}`);
console.log(`会话标题差异条数：${sessionDiff}（应为 0）`);
