/**
 * Evidence harness generator (blue intensity ladder).
 *
 * Runs the plugin's own compiled pure functions over representative workspaces and
 * sessions and prints the stylesheet it would actually inject.
 *
 * The scenario set deliberately contains the case the user reported from the real
 * sidebar: an active workspace whose members include sessions that are days old.
 * Under the old member-following rule those old sessions were painted as active;
 * under this design each session is decided by its own clock, so they stay normal.
 */
import { build } from "esbuild";
import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

const pkg = "/Users/lionad/Github/Lionad-Morotar/dsh-plugins/packages/dsh-session-activity";
const dir = await mkdtemp(join(tmpdir(), "activity-harness-"));
const entry = join(dir, "entry.ts");
await writeFile(
  entry,
  [
    `export { resolveConfig, tierOf, ageOf, aggregateWorkspace, selectActivity } from ${JSON.stringify(join(pkg, "src/client/reading.ts"))};`,
    `export { buildStylesheet } from ${JSON.stringify(join(pkg, "src/client/rules.ts"))};`,
  ].join("\n"),
  "utf8",
);

const bundled = await build({
  entryPoints: [entry],
  bundle: true,
  format: "esm",
  platform: "node",
  write: false,
  logLevel: "silent",
});
const mod = await import(`data:text/javascript;base64,${Buffer.from(bundled.outputFiles[0].text).toString("base64")}`);

const config = mod.resolveConfig();
const now = Date.now();
const MIN = 60_000;
const HOUR = 60 * MIN;
const DAY = 86_400_000;

/** A session summary the way the host publishes it, carrying the activity view. */
function session(id, ageMs, running = false) {
  const at = now - ageMs;
  return {
    id,
    running,
    updatedAt: at,
    projectionValues: { sessionActivity: { lastActivityAt: at, promptCount: 2, turnCount: 3, toolCallCount: 9 } },
  };
}

/** One workspace scenario plus its members, each member carrying its own age. */
const workspaces = [
  {
    workspaceId: "w-blog",
    title: "blog",
    note: "13 分钟前活跃，但成员里还有 2 天前与 4 天前的会话（用户报的那个 bug 场景）",
    members: [
      ["a1", 13 * MIN, false, "Deep Research: Monorepo Flow"],
      ["a2", 2 * DAY, false, "记录开机系统状态基线"],
      ["a3", 4 * DAY, false, "前端工程讲稿 PPT 生成"],
    ],
  },
  {
    workspaceId: "w-strong",
    title: "dsh-plugins",
    note: "35 分钟前活跃，落在 1 小时内",
    members: [["b1", 35 * MIN, false, "侧栏活跃度阶梯怎么做"]],
  },
  {
    workspaceId: "w-mid",
    title: "flow-skills",
    note: "1.5 小时前活跃，落在 2 小时内",
    members: [["c1", 1.5 * HOUR, false, "技能文档简化"]],
  },
  {
    workspaceId: "w-faint",
    title: "lionad.dev",
    note: "4 小时前活跃，落在 5 小时内",
    members: [["d1", 4 * HOUR, false, "首页改版草稿"]],
  },
  {
    workspaceId: "w-normal",
    title: "deep-whale",
    note: "8 小时前活跃，超过 5 小时，交还宿主原色",
    members: [["e1", 8 * HOUR, false, "深鲸皮肤配色"]],
  },
  {
    workspaceId: "w-running",
    title: "running-ws",
    note: "有会话正在跑，直接进最强档",
    members: [["f1", 3 * HOUR, true, "正在跑的会话"]],
  },
  {
    workspaceId: "w-archived",
    title: "archived-ws",
    note: "唯一成员已归档，工作区仍按它的活动聚合，但会话自身不着色",
    members: [["g1", 20 * MIN, false, "归档的会话"]],
    archived: true,
  },
];

const byId = {};
const ids = [];
for (const w of workspaces) for (const [id, age, running] of w.members) {
  byId[id] = session(id, age, running);
  ids.push(id);
}
const list = { ids, byId, projectionsBySession: {} };
const archivedIds = workspaces.filter((w) => w.archived).flatMap((w) => w.members.map(([id]) => id));

const ruleSet = { workspaces: [], sessions: [] };
const table = [];
for (const w of workspaces) {
  const sessionIds = w.members.map(([id]) => id);
  const reading = mod.aggregateWorkspace(list, sessionIds);
  const workspaceTier = mod.tierOf({ reading, running: reading?.running === true, updatedAt: undefined, now, config });
  if (workspaceTier !== "none") ruleSet.workspaces.push({ workspaceId: w.workspaceId, tier: workspaceTier });

  const members = [];
  for (const [id, , , title] of w.members) {
    const summary = byId[id];
    const memberReading = mod.selectActivity(list, id);
    const tier = mod.tierOf({ reading: memberReading, running: summary.running === true, updatedAt: summary.updatedAt, now, config });
    const archived = archivedIds.includes(id);
    const painted = tier !== "none" && !archived;
    if (painted) ruleSet.sessions.push({ sessionId: id, tier });
    members.push({ id, title, tier, archived, painted });
  }
  table.push({ workspaceId: w.workspaceId, title: w.title, note: w.note, workspaceTier, members });
}

const css = mod.buildStylesheet(ruleSet, config);
const root = "/Users/lionad/Github/Lionad-Morotar/dsh-plugins/temp";
await writeFile(join(root, "activity-harness.css"), css, "utf8");
await writeFile(join(root, "activity-harness-rows.json"), JSON.stringify(table, null, 2), "utf8");
process.stdout.write(`\n--- generated css (${css.length} bytes) ---\n${css}\n`);
