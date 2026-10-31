/**
 * Measure the evidence page instead of eyeballing it.
 *
 * Reads the computed colour and weight of every workspace title, its icon slot, and
 * every session title in both columns of both themes. This turns the screenshot into
 * checkable claims:
 *   - session titles must never carry a heavier weight than the host's;
 *   - a session's colour must follow its own age, not its workspace's tier;
 *   - the four tiers must resolve to four distinct colours.
 */
const { chromium } = await import(
  "/Users/lionad/.npm/_npx/0b6d5b421474bd84/node_modules/playwright/index.mjs"
);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 1500 } });
await page.goto("file:///Users/lionad/Github/Lionad-Morotar/dsh-plugins/temp/activity-evidence.html");
await page.waitForTimeout(300);

const readColumns = (scope) =>
  scope.evaluate(() => {
    const read = (el) => {
      if (!el) return undefined;
      const s = getComputedStyle(el);
      return { color: s.color, weight: s.fontWeight, text: el.textContent };
    };
    return [...document.querySelectorAll(".panel")].map((panel) => ({
      caption: panel.querySelector(".panelCaption").textContent,
      workspaces: [...panel.querySelectorAll('[data-row-key^="workspace:"]')].map((row) => ({
        title: read(row.querySelector(".JoiKIa_projectText .JoiKIa_title")),
        icon: read(row.querySelector(".JoiKIa_folder")),
      })),
      sessions: [...panel.querySelectorAll('[data-row-key^="session:"]')].map((row) => ({
        key: row.getAttribute("data-row-key"),
        archived: row.classList.contains("JoiKIa_archived"),
        title: read(row.querySelector(".JoiKIa_title")),
      })),
    }));
  });

const light = await readColumns(page);
const frame = page.frames().find((f) => f !== page.mainFrame());
const dark = frame ? await readColumns(frame) : [];
await browser.close();

const fmt = (s) => (s ? `${s.color} / ${s.weight}` : "—");

function report(name, cols) {
  const [base, plugin] = cols;
  console.log(`\n########## ${name} ##########`);
  console.log("--- 工作区标题（应：strong/mid 加粗，faint 不加粗，normal 不变）---");
  base.workspaces.forEach((w, i) => {
    const b = w.title, p = plugin.workspaces[i].title;
    const same = b.color === p.color && b.weight === p.weight;
    console.log(`${same ? "SAME" : "DIFF"}  ${b.text.padEnd(14)} base=${fmt(b)}  plugin=${fmt(p)}`);
  });
  console.log("--- 工作区图标 ---");
  base.workspaces.forEach((w, i) => {
    const b = w.icon, p = plugin.workspaces[i].icon;
    const same = b.color === p.color;
    console.log(`${same ? "SAME" : "DIFF"}  ${w.title.text.padEnd(14)} base=${b?.color}  plugin=${p?.color}`);
  });
  console.log("--- 会话标题（应：按自己年龄；永不加粗）---");
  base.sessions.forEach((s, i) => {
    const b = s.title, p = plugin.sessions[i].title;
    const same = b.color === p.color && b.weight === p.weight;
    const bold = Number(p.weight) > Number(b.weight);
    console.log(`${same ? "SAME" : "DIFF"}  ${s.key.padEnd(12)}${s.archived ? "[归档]" : "      "} base=${fmt(b)}  plugin=${fmt(p)}${bold ? "  ⚠ 变粗了" : ""}`);
  });
  const bolds = plugin.sessions.filter((s, i) => Number(s.title.weight) > Number(base.sessions[i].title.weight));
  console.log(`\n会话标题变粗的条数：${bolds.length}（应为 0）`);
  const textChanged = base.workspaces.some((w, i) => w.title.text !== plugin.workspaces[i].title.text);
  console.log(`标题文字是否被改：${textChanged ? "被改了（缺陷）" : "未改（正确）"}`);
}

if (light.length === 2) report("浅色主题", light);
if (dark.length === 2) report("深色主题", dark);

/** The four tiers must be visually distinct: count unique colours among painted titles. */
if (light.length === 2) {
  const painted = light[1].sessions.filter((s) => s.title.color !== light[0].sessions.find((b) => b.key === s.key)?.title.color);
  const unique = [...new Set(painted.map((s) => s.title.color))];
  console.log("\n########## 档位颜色是否真的分得开 ##########");
  for (const c of unique) {
    const members = painted.filter((s) => s.title.color === c).map((s) => s.key);
    console.log(`  ${c}  ← ${members.join(", ")}`);
  }
  console.log(`  会话侧出现的不同颜色数：${unique.length}`);
}
