/**
 * Build the evidence page (workspace level, full tint scope).
 *
 * Light panels sit inline. Dark panels sit inside an iframe whose own document
 * carries `data-ds-dark-theme` on the body, because the plugin emits its dark
 * overrides as `body[data-ds-dark-theme] ...` rules and a wrapper div cannot match
 * them. Keeping the plugin's CSS verbatim in both documents is the point: the dark
 * column must show what the plugin actually ships, not a rewritten copy.
 *
 * Left column of each pair keys its workspaces with a prefix the plugin never saw,
 * so the generated rules cannot reach it. Session ids stay identical on purpose.
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

/** Member sessions per workspace, as the sidebar nests them. */
const MEMBERS = {
  "w-active": [
    ["a1", "侧栏活跃度分层怎么实现", "10分钟前"],
    ["a2", "投影折叠的时间语义", "刚刚"],
  ],
  "w-today": [["b1", "技能文档简化", "7小时前"]],
  "w-2d": [["c1", "首页改版草稿", "2天前"]],
  "w-4d": [["d1", "深鲸皮肤配色", "4天前"], ["d2", "老实验记录", "9天前"]],
  "w-5d": [["e1", "旧实验", "5天前"]],
  "w-archived-only": [["f1", "归档的会话", "20分钟前"]],
  "w-mixed": [["g1", "非归档的活跃会话", "30分钟前"], ["g2", "已归档的会话", "40分钟前"]],
  "w-empty": [],
};

/** Which members the host marks archived, mirroring the archive set used by the generator. */
const ARCHIVED = new Set(["f1", "g2"]);

/** Session rows; archived ones carry the host's own archived class. */
const sessionRow = (id, title, time, archived) => `
              <div data-row-key="session:${id}" class="JoiKIa_sessionRow${archived ? " JoiKIa_archived" : ""}" role="treeitem" aria-selected="false">
                <span class="JoiKIa_slot"></span>
                <span class="JoiKIa_title">${title}</span>
                <span class="JoiKIa_time" aria-hidden="true">${time}</span>
              </div>`;

/** One workspace block: the group section holds the project row and its sessions. */
const workspaceBlock = (row, prefix, current) => `
            <div class="Kjh-qa_groupSection">
              <div class="JoiKIa_projectRow" data-row-key="workspace:${prefix}${row.workspaceId}" role="treeitem" aria-expanded="true">
                <span class="JoiKIa_slot JoiKIa_folder${current ? " JoiKIa_folderActive" : ""}">▣</span>
                <span class="JoiKIa_slot JoiKIa_chevron">▾</span>
                <span class="JoiKIa_projectText"><span class="JoiKIa_title">${row.title}</span></span>
              </div>
              <div class="Kjh-qa_flatList">
                ${(MEMBERS[row.workspaceId] ?? []).map(([id, title, time]) => sessionRow(id, title, time, ARCHIVED.has(id))).join("")}
              </div>
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

/** Shared stylesheet: real host CSS + real plugin output, nothing hand-written. */
const STYLE = `
  :root { ${TOKENS_LIGHT} }
  html, body { margin: 0; background: #eef0f3; font-family: -apple-system, "PingFang SC", system-ui, sans-serif; }
  .stage { display: flex; gap: 26px; padding: 22px; align-items: flex-start; }
  .panel { width: 290px; flex: none; }
  .panelCaption { font-size: 13px; color: #4b5158; margin: 0 0 8px 2px; font-weight: 600; }
  ${shellCss}
  ${rowsCss}
  ${pluginCss}
`;

const STYLE_DARK = `
  :root { ${TOKENS_DARK} }
  html, body { margin: 0; background: #1b1d20; font-family: -apple-system, "PingFang SC", system-ui, sans-serif; }
  .stage { display: flex; gap: 26px; padding: 22px; align-items: flex-start; }
  .panel { width: 290px; flex: none; }
  .panelCaption { font-size: 13px; color: #a9aeb5; margin: 0 0 8px 2px; font-weight: 600; }
  ${shellCss}
  ${rowsCss}
  ${pluginCss}
`;

const tierLabel = (r) =>
  r.tier === "hot"
    ? "状态色 + 600"
    : r.tier === "dim"
      ? `opacity ${r.opacityLight} 浅 / ${r.opacityDark} 深`
      : "不产出";

const legend = `
    <div class="legend">
      <h2>证据说明</h2>
      <p>每对栏位是同一份 DOM、同一份宿主 CSS（从 app.asar 构建产物原样抽出）。右栏多注入的规则由插件自己的编译产物生成，深色栏在 iframe 里用 <code>body[data-ds-dark-theme]</code> 承载，插件 CSS 原样未改。</p>
      <table>
        <tr><th>工作区</th><th>档位</th><th>插件产出</th></tr>
        ${table.map((r) => `<tr><td>${r.title}</td><td>${r.tier}</td><td>${tierLabel(r)}</td></tr>`).join("")}
      </table>
      <ul>
        <li>会话标题跟随工作区：活跃工作区下的会话标题同色同字重，陈旧工作区下的一起变淡。</li>
        <li>图标槽位与标题同色，hover 时文件夹图标换成箭头也不掉色。</li>
        <li>浅色与深色两套衰减值不同：同一批工作区在深色栏里更实。</li>
        <li><code>archived-work</code> 的成员全部归档但 20 分钟前有活动，仍判 hot。</li>
      </ul>
    </div>`;

const darkDoc = `<!doctype html><html lang="zh"><head><meta charset="utf-8">
<style>${STYLE_DARK}</style></head>
<body data-ds-dark-theme>
  <div class="stage">
    ${panel(false, "basedark-", false)}
    ${panel(true, "", false)}
  </div>
</body></html>`;

const html = `<!doctype html>
<html lang="zh"><head><meta charset="utf-8">
<style>${STYLE}
  .legend { width: 340px; font-size: 12.5px; line-height: 1.7; color: #2c3238; }
  .legend h2 { font-size: 15px; margin: 0 0 8px; }
  .legend table { border-collapse: collapse; width: 100%; font-size: 12px; }
  .legend th, .legend td { text-align: left; padding: 3px 6px 3px 0; border-bottom: 1px solid #d8dce1; }
  .legend code { font-family: ui-monospace, Menlo, monospace; font-size: 11.5px; background: #e3e7ec; padding: 1px 3px; border-radius: 3px; }
  .legend ul { padding-left: 16px; margin: 8px 0; }
  iframe { width: 700px; height: 900px; border: 0; display: block; }
  .rowCaption { font-size: 12px; color: #6b7078; padding: 0 22px 4px; font-weight: 600; }
</style>
</head>
<body>
  <div class="rowCaption">浅色主题</div>
  <div class="stage">
    ${panel(false, "base-", true)}
    ${panel(true, "", true)}
    ${legend}
  </div>
  <div class="rowCaption">深色主题（iframe 内的文档带 data-ds-dark-theme）</div>
  <iframe srcdoc="${darkDoc.replace(/"/g, "&quot;")}"></iframe>
</body></html>`;

writeFileSync(`${out}/activity-evidence.html`, html, "utf8");
process.stdout.write(`wrote ${out}/activity-evidence.html (${html.length} bytes)\n`);
