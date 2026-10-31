/**
 * Measure the evidence page instead of eyeballing it.
 *
 * Reads the computed style of every workspace title, its icon slot, and every
 * member session title, in both columns of both themes. This is what turns the
 * screenshot from "looks right" into a checkable claim:
 *   - the workspace titles and their icons must differ between columns;
 *   - the member session titles must follow their workspace;
 *   - the two themes must carry different dim opacities.
 */
const { chromium } = await import(
  "/Users/lionad/.npm/_npx/0b6d5b421474bd84/node_modules/playwright/index.mjs"
);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 1400 } });
await page.goto("file:///Users/lionad/Github/Lionad-Morotar/dsh-plugins/temp/activity-evidence.html");
await page.waitForTimeout(300);

/** Read one column pair: workspace rows (title + icon) and member session rows. */
const readColumns = async (scope) => {
  return scope.evaluate(() => {
    const read = (el) => {
      if (!el) return undefined;
      const s = getComputedStyle(el);
      return { color: s.color, weight: s.fontWeight, opacity: s.opacity, text: el.textContent };
    };
    const panels = [...document.querySelectorAll(".panel")];
    return panels.map((panel) => ({
      caption: panel.querySelector(".panelCaption").textContent,
      workspaces: [...panel.querySelectorAll('[data-row-key^="workspace:"]')].map((row) => ({
        title: read(row.querySelector(".JoiKIa_projectText .JoiKIa_title")),
        folder: read(row.querySelector(".JoiKIa_folder")),
        chevron: read(row.querySelector(".JoiKIa_chevron")),
      })),
      sessions: [...panel.querySelectorAll('[data-row-key^="session:"]')].map((row) => ({
        key: row.getAttribute("data-row-key"),
        archived: row.classList.contains("JoiKIa_archived"),
        title: read(row.querySelector(".JoiKIa_title")),
      })),
    }));
  });
};

const light = await readColumns(page);
const frame = page.frames().find((f) => f !== page.mainFrame());
const dark = frame ? await readColumns(frame) : [];

await browser.close();

const show = (label, a, b) => {
  const same = a && b && a.color === b.color && a.weight === b.weight && a.opacity === b.opacity;
  const fmt = (s) => (s ? `${s.color}/${s.weight}/${s.opacity}` : "—");
  return `${same ? "SAME" : "DIFF"}  ${label.padEnd(20)} base=${fmt(a)}  plugin=${fmt(b)}`;
};

function reportTheme(name, cols) {
  const [base, plugin] = cols;
  console.log(`\n########## ${name} ##########`);
  console.log(`(${base.caption} vs ${plugin.caption})\n`);
  console.log("--- 工作区标题 ---");
  base.workspaces.forEach((w, i) => console.log(show(w.title.text, w.title, plugin.workspaces[i].title)));
  console.log("\n--- 工作区图标（folder 槽位）---");
  base.workspaces.forEach((w, i) => console.log(show(w.title.text, w.folder, plugin.workspaces[i].folder)));
  console.log("\n--- 成员会话标题（应跟随所属工作区）---");
  base.sessions.forEach((s, i) => console.log(show(`${s.key}${s.archived ? " [归档]" : ""}`, s.title, plugin.sessions[i].title)));
  const textChanged = base.workspaces.some((w, i) => w.title.text !== plugin.workspaces[i].title.text);
  console.log(`\n标题文字是否被改：${textChanged ? "被改了（缺陷）" : "未改（正确）"}`);
}

if (light.length === 2) reportTheme("浅色主题", light);
if (dark.length === 2) reportTheme("深色主题", dark);

/** The dim ladder must differ between themes, which is the whole point of the split. */
if (light.length === 2 && dark.length === 2) {
  console.log("\n########## 两套主题的暗淡强度对比 ##########");
  const pairs = light[1].workspaces.map((w, i) => ({
    title: w.title.text,
    light: w.title.opacity,
    dark: dark[1].workspaces[i].title.opacity,
  }));
  for (const p of pairs) {
    if (p.light === "1" && p.dark === "1") continue;
    console.log(`  ${p.title.padEnd(18)} 浅色 opacity=${p.light}   深色 opacity=${p.dark}   ${p.light < p.dark ? "浅色更淡（符合预期）" : "浅色未更淡（缺陷）"}`);
  }
}
