/**
 * Build the evidence page (blue intensity ladder).
 *
 * Left column is the host's own rendering (real shell + row CSS, real class names,
 * real DOM shape, no plugin rules). Right column is the same markup with the
 * plugin's actually generated stylesheet appended. Row keys differ between columns
 * so the generated rules can only reach the right one.
 *
 * Light panels sit inline; the dark pair sits inside an iframe whose own document
 * carries `data-ds-dark-theme`, because `color-mix()` and the tokens resolve per
 * theme and the plugin ships one sheet for both.
 */
import { readFileSync, writeFileSync } from "node:fs";

const out = "/Users/lionad/Github/Lionad-Morotar/dsh-plugins/temp";
const rowsCss = readFileSync(`${out}/host-rows.css`, "utf8");
const shellCss = readFileSync(`${out}/host-shell.css`, "utf8");
const pluginCss = readFileSync(`${out}/activity-harness.css`, "utf8");
const table = JSON.parse(readFileSync(`${out}/activity-harness-rows.json`, "utf8"));

const TOKENS_LIGHT = `
  --dsw-alias-bg-base:#fff; --dsw-alias-bg-layer-1:#fff;
  --dsw-alias-label-primary:#0f1115; --dsw-alias-label-secondary:#61666b;
  --dsw-alias-label-tertiary:#81858c; --dsw-alias-label-caption:#adb2b8;
  --dsw-alias-brand-primary:#0f1115; --dsw-alias-state-business-primary:#4176e6;
  --dsw-alias-interactive-bg-hover:#2631480f; --dsw-alias-border-l3:#0000001f;
  --dsw-alias-border-l4:#00000024; --dsw-alias-button-elevated-fill:#ffffffb3;
  --dsw-specific-sidebar-fill:#f9fafb;
  --dsw-radius-xs:4px; --dsw-radius-sm:6px; --dsw-radius-md:8px; --dsw-radius-lg:10px;
  --dsh-sidebar-inline-padding:12px; --dsh-workspace-indent:0px;
`;

const TOKENS_DARK = `
  --dsw-alias-bg-base:#151517; --dsw-alias-bg-layer-1:#151517;
  --dsw-alias-label-primary:#f9fafb; --dsw-alias-label-secondary:#cfd3d6;
  --dsw-alias-label-tertiary:#adb2b8; --dsw-alias-label-caption:#81858c;
  --dsw-alias-brand-primary:#f9fafb; --dsw-alias-state-business-primary:#7aaaff;
  --dsw-alias-interactive-bg-hover:#ffffff14; --dsw-alias-border-l3:#ffffff29;
  --dsw-alias-border-l4:#ffffff33; --dsw-alias-button-elevated-fill:#ffffff1a;
  --dsw-specific-sidebar-fill:#151517;
  --dsw-radius-xs:4px; --dsw-radius-sm:6px; --dsw-radius-md:8px; --dsw-radius-lg:10px;
  --dsh-sidebar-inline-padding:12px; --dsh-workspace-indent:0px;
`;

/** Ages rendered in the trailing time label, mirroring the generator's scenario. */
const AGES = {
  a1: "13分钟前", a2: "2天前", a3: "4天前",
  b1: "35分钟前", c1: "1.5小时前", d1: "4小时前",
  e1: "8小时前", f1: "3小时前", g1: "20分钟前",
};

const sessionRow = (member, prefix) => `
              <div data-row-key="session:${prefix}${member.id}" class="JoiKIa_sessionRow${member.archived ? " JoiKIa_archived" : ""}" role="treeitem" aria-selected="false">
                <span class="JoiKIa_slot"></span>
                <span class="JoiKIa_title">${member.title}</span>
                <span class="JoiKIa_time" aria-hidden="true">${AGES[member.id] ?? ""}</span>
              </div>`;

const workspaceBlock = (row, prefix, current) => `
            <div class="Kjh-qa_groupSection">
              <div class="JoiKIa_projectRow" data-row-key="workspace:${prefix}${row.workspaceId}" role="treeitem" aria-expanded="true">
                <span class="JoiKIa_slot JoiKIa_folder${current ? " JoiKIa_folderActive" : ""}">▣</span>
                <span class="JoiKIa_slot JoiKIa_chevron">▾</span>
                <span class="JoiKIa_projectText"><span class="JoiKIa_title">${row.title}</span></span>
              </div>
              <div class="Kjh-qa_flatList">${row.members.map((m) => sessionRow(m, prefix)).join("")}</div>
            </div>`;

const panel = (withPlugin, prefix, current) => `
    <div class="panel">
      <div class="panelCaption">${withPlugin ? "装了 dsh-session-activity" : "宿主默认（未装插件）"}</div>
      <div class="kB3qhq_root">
        <div class="kB3qhq_newSession"><span class="kB3qhq_newSessionContent">新会话</span></div>
        <div class="kB3qhq_panelList">
          <button class="kB3qhq_panelRow"><span class="kB3qhq_panelGlyph">▣</span><span class="kB3qhq_panelTitle">插件</span></button>
          <button class="kB3qhq_panelRow"><span class="kB3qhq_panelGlyph">◷</span><span class="kB3qhq_panelTitle">自动化任务</span></button>
        </div>
        <div class="kB3qhq_regionArea">
          <div class="Kjh-qa_root">
            <div class="Kjh-qa_sectionHeader"><span class="Kjh-qa_sectionLabel">工作区</span></div>
            <div class="Kjh-qa_listArea"><div class="Kjh-qa_list">
              ${table.map((row, i) => workspaceBlock(row, prefix, current && i === 0)).join("")}
            </div></div>
          </div>
        </div>
      </div>
    </div>`;

const shared = (tokens, pageBg) => `
  :root { ${tokens} }
  html, body { margin: 0; background: ${pageBg}; font-family: -apple-system, "PingFang SC", system-ui, sans-serif; }
  .stage { display: flex; gap: 24px; padding: 20px; align-items: flex-start; }
  .panel { width: 300px; flex: none; }
  .panelCaption { font-size: 13px; color: #4b5158; margin: 0 0 8px 2px; font-weight: 600; }
  ${shellCss}
  ${rowsCss}
  ${pluginCss}`;

const tierName = (t) => ({ strong: "更蓝", mid: "微蓝+bold", faint: "微蓝", none: "正常" })[t] ?? t;

const legend = `
    <div class="legend">
      <h2>证据说明</h2>
      <p>每对栏位是同一份 DOM 与同一份宿主 CSS（从 app.asar 构建产物原样抽出），右栏多注入的规则由插件自己的编译产物生成。</p>
      <p>会话按<strong>自己的年龄</strong>着色：<code>blog</code> 工作区虽然 13 分钟前活跃，它下面 2 天前、4 天前的会话不染色，这是上一版真机报的 bug。</p>
      <table>
        <tr><th>工作区</th><th>聚合档位</th><th>成员</th></tr>
        ${table.map((r) => `<tr><td>${r.title}</td><td>${tierName(r.workspaceTier)}</td><td>${r.members.map((m) => `${m.title.slice(0, 8)}…=${tierName(m.tier)}${m.archived ? "(归档)" : ""}`).join("<br>")}</td></tr>`).join("")}
      </table>
      <p>四档：≤1 小时更蓝加粗、≤2 小时微蓝加粗、≤5 小时微蓝、更久交还宿主原色。加粗只给工作区标题，会话标题永不加粗。</p>
    </div>`;

const darkDoc = `<!doctype html><html lang="zh"><head><meta charset="utf-8">
<style>${shared(TOKENS_DARK, "#1b1d20")}</style></head>
<body data-ds-dark-theme>
  <div class="stage">${panel(false, "basedark-", false)}${panel(true, "", false)}</div>
</body></html>`;

const html = `<!doctype html>
<html lang="zh"><head><meta charset="utf-8">
<style>${shared(TOKENS_LIGHT, "#eef0f3")}
  .legend { width: 330px; font-size: 12.5px; line-height: 1.65; color: #2c3238; }
  .legend h2 { font-size: 15px; margin: 0 0 8px; }
  .legend table { border-collapse: collapse; width: 100%; font-size: 11.5px; }
  .legend th, .legend td { text-align: left; padding: 3px 6px 3px 0; border-bottom: 1px solid #d8dce1; vertical-align: top; }
  .legend code { font-family: ui-monospace, Menlo, monospace; font-size: 11px; background: #e3e7ec; padding: 1px 3px; border-radius: 3px; }
  iframe { width: 700px; height: 880px; border: 0; display: block; }
  .rowCaption { font-size: 12px; color: #6b7078; padding: 4px 20px; font-weight: 600; }
</style>
</head>
<body>
  <div class="rowCaption">浅色主题</div>
  <div class="stage">${panel(false, "base-", true)}${panel(true, "", true)}${legend}</div>
  <div class="rowCaption">深色主题（iframe 内文档带 data-ds-dark-theme）</div>
  <iframe srcdoc="${darkDoc.replace(/"/g, "&quot;")}"></iframe>
</body></html>`;

writeFileSync(`${out}/activity-evidence.html`, html, "utf8");
process.stdout.write(`wrote ${out}/activity-evidence.html (${html.length} bytes)\n`);
