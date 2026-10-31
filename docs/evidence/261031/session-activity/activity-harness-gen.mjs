/**
 * Evidence harness generator (workspace level).
 *
 * Runs the plugin's own compiled pure functions over representative workspaces and
 * prints the stylesheet it would actually inject. Each workspace owns several member
 * sessions; the aggregate picks the newest member, and archived members still count,
 * which is the whole point of the feature.
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
    `export { resolveConfig, tierOf, opacityFor, ageOf, aggregateWorkspace } from ${JSON.stringify(join(pkg, "src/client/reading.ts"))};`,
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

/** One workspace scenario: its members and what the sidebar should read like. */
const workspaces = [
  {
    workspaceId: "w-active",
    title: "dsh-plugins",
    note: "一个会话正在跑，另一个 10 分钟前动过",
    members: [session("a1", 10 * MIN), session("a2", 3 * HOUR, true)],
  },
  {
    workspaceId: "w-today",
    title: "flow-skills",
    note: "今天动过，但没在跑",
    members: [session("b1", 7 * HOUR)],
  },
  {
    workspaceId: "w-2d",
    title: "lionad.dev",
    note: "两天多没动静",
    members: [session("c1", Math.round(2.2 * DAY))],
  },
  {
    workspaceId: "w-4d",
    title: "deep-whale",
    note: "四天没动静",
    members: [session("d1", 4 * DAY), session("d2", 9 * DAY)],
  },
  {
    workspaceId: "w-5d",
    title: "old-lab",
    note: "五天没动静，衰减触底",
    members: [session("e1", 5 * DAY)],
  },
  {
    workspaceId: "w-archived-only",
    title: "archived-work",
    note: "成员全部归档，但最近 20 分钟前还有活动",
    members: [session("f1", 20 * MIN)],
    archived: true,
  },
  {
    workspaceId: "w-mixed",
    title: "mixed-ws",
    note: "一个非归档成员 30 分钟前动过，一个成员已归档",
    members: [session("g1", 30 * MIN), session("g2", 40 * MIN)],
    archivedMembers: ["g2"],
  },
  {
    workspaceId: "w-empty",
    title: "empty-ws",
    note: "没有会话成员，不产出规则",
    members: [],
  },
];

const byId = {};
const ids = [];
for (const w of workspaces) for (const s of w.members) {
  byId[s.id] = s;
  ids.push(s.id);
}
const list = { ids, byId, projectionsBySession: {} };
// The host publishes the archive set beside the workspace items, not on the summaries.
const archivedIds = [
  ...workspaces.filter((w) => w.archived).flatMap((w) => w.members.map((s) => s.id)),
  ...workspaces.flatMap((w) => w.archivedMembers ?? []),
];

const rows = [];
const table = [];
for (const w of workspaces) {
  const sessionIds = w.members.map((s) => s.id);
  const reading = mod.aggregateWorkspace(list, sessionIds, archivedIds);
  const tier = mod.tierOf({ reading, updatedAt: undefined, now, config });
  const age = mod.ageOf({ reading, updatedAt: undefined, now });
  const opacityLight = tier === "dim" && age !== undefined ? mod.opacityFor(age, config, "light") : 1;
  const opacityDark = tier === "dim" && age !== undefined ? mod.opacityFor(age, config, "dark") : 1;
  const hasUnarchivedMembers = reading !== undefined && reading.memberCount > reading.archivedCount;
  if (tier !== "none") rows.push({ workspaceId: w.workspaceId, tier, opacityLight, opacityDark, hasUnarchivedMembers });
  table.push({ workspaceId: w.workspaceId, title: w.title, note: w.note, tier, opacityLight, opacityDark, members: sessionIds.length });
}

const css = mod.buildStylesheet(rows, config);
const root = "/Users/lionad/Github/Lionad-Morotar/dsh-plugins/temp";
await writeFile(join(root, "activity-harness.css"), css, "utf8");
await writeFile(join(root, "activity-harness-rows.json"), JSON.stringify(table, null, 2), "utf8");
process.stdout.write(`\n--- generated css (${css.length} bytes) ---\n${css}\n`);
process.stdout.write(`\n--- decided rows ---\n${JSON.stringify(table, null, 1)}\n`);
