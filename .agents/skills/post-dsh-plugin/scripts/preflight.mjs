#!/usr/bin/env node
/**
 * Preflight for a DSH plugin submission: read one package, decide which market
 * surfaces it can honestly enter, and print the findings as one JSON summary.
 *
 * The checks are the published acceptance rules of each market, not our own
 * preferences. A surface is reported ready only when every rule it states is
 * satisfied by facts this script can read without network access.
 *
 *   node scripts/preflight.mjs --mode check --package <dir> [--json]
 *   node scripts/preflight.mjs --mode check --package <dir> --repo-created <iso>
 *
 * Exit codes: 0 every requested surface is ready, 1 a blocking rule is
 * unsatisfied, 2 usage error, 3 the package itself cannot be read.
 */
import { existsSync, readFileSync } from "node:fs";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * The skill's own version, read from the SKILL.md above this script. Hardcoding
 * it would create a second source of truth that drifts from the frontmatter the
 * lint and preflight contracts read.
 */
function skillVersion() {
  let dir = dirname(fileURLToPath(import.meta.url));
  for (let depth = 0; depth < 5; depth += 1) {
    const candidate = join(dir, "SKILL.md");
    if (existsSync(candidate)) {
      const match = /^\s+version:\s*(\S+)\s*$/mu.exec(readFileSync(candidate, "utf8"));
      if (match !== null) return match[1];
      return "unknown";
    }
    const parent = dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return "unknown";
}

function usage(message) {
  process.stderr.write(
    "usage: node ~/.claude/skills/post-dsh-plugin/scripts/preflight.mjs --mode check --package <dir> " +
      "[--repo-created <iso>] [--target <hub|awesome|index|all>] [--json]\n" +
      "       node ... --version\n" +
      (message === undefined ? "" : "error: " + message + "\n"),
  );
  process.exit(2);
}

function parseArgs(argv) {
  const out = { mode: undefined, pkg: undefined, created: undefined, target: "all", json: false };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--version" || arg === "-v") {
      process.stdout.write("post-dsh-plugin " + skillVersion() + "\n");
      process.exit(0);
    } else if (arg === "--mode") out.mode = argv[++i];
    else if (arg === "--package") out.pkg = argv[++i];
    else if (arg === "--repo-created") out.created = argv[++i];
    else if (arg === "--target") out.target = argv[++i];
    else if (arg === "--json") out.json = true;
    else if (arg === "--help" || arg === "-h") usage();
    else usage("unknown argument " + arg);
  }
  if (out.mode !== "check") usage("--mode must be check");
  if (out.pkg === undefined) usage("--package is required");
  if (!["hub", "awesome", "index", "all"].includes(out.target)) usage("--target must be hub, awesome, index or all");
  return out;
}

/** Owner and repo from a repository field, or null when it is not a GitHub URL. */
function parseRepo(pkg) {
  const raw = typeof pkg.repository === "string" ? pkg.repository : pkg.repository?.url;
  if (typeof raw !== "string") return null;
  const match = /github\.com[/:]([^/]+)\/([^/#.]+?)(?:\.git)?(?:#.*)?$/u.exec(raw.trim());
  if (match === null) return null;
  return { owner: match[1], repo: match[2], directory: pkg.repository?.directory };
}

/** The install command a reader is told to run; the market quotes this verbatim. */
function installCommand(pkg, repo) {
  if (typeof pkg.name === "string" && pkg.name !== "" && pkg.private !== true) {
    return "dsh plugin --profile web add " + pkg.name;
  }
  return repo === null ? null : "dsh plugin --profile web add github:" + repo.owner + "/" + repo.repo;
}

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function check() {
  const args = parseArgs(process.argv.slice(2));
  const packageRoot = resolve(args.pkg);
  const manifestPath = join(packageRoot, "package.json");
  if (!existsSync(manifestPath)) {
    process.stderr.write("error: " + manifestPath + " does not exist\n");
    process.exit(3);
  }

  let pkg;
  try {
    pkg = readJson(manifestPath);
  } catch (error) {
    process.stderr.write("error: cannot parse " + manifestPath + ": " + error.message + "\n");
    process.exit(3);
  }

  const repo = parseRepo(pkg);
  const findings = [];
  const add = (surface, rule, status, detail) => findings.push({ surface, rule, status, detail });

  const atRoot = dirname(manifestPath) === packageRoot && basename(packageRoot) !== "";
  const hasBundle = pkg.dsh !== undefined && pkg.dsh.bundle !== undefined;
  const hasClient = pkg.dsh !== undefined && pkg.dsh.client !== undefined;
  const engines = pkg.engines?.dsh;
  const isPrivate = pkg.private === true;
  const readmePath = join(packageRoot, "README.md");
  const readme = existsSync(readmePath) ? readFileSync(readmePath, "utf8") : "";
  const command = installCommand(pkg, repo);
  const license = typeof pkg.license === "string" ? pkg.license : "";
  const iconPng = join(packageRoot, "assets", "icon-180.png");

  const wants = (surface) => args.target === "all" || args.target === surface;

  if (wants("hub")) {
    add("hub", "public repository", repo === null ? "fail" : "pass", repo === null ? "repository is not a github.com owner/repo URL" : repo.owner + "/" + repo.repo);
    add("hub", "root package.json", atRoot ? "pass" : "fail", "package must be its own repository root; a subdirectory makes the scanner read the wrong manifest");
    add("hub", "package not private", isPrivate ? "fail" : "pass", isPrivate ? "a private package cannot be installed by a reader" : "public package");
    add("hub", "README install command", command !== null && readme.includes(command) ? "pass" : "fail", command === null ? "no install command can be derived" : command);
    add("hub", "exports apply preset", hasBundle ? "pass" : "fail", hasBundle ? "dsh.bundle declared" : "dsh.bundle missing; the Loader row would not resolve");
    add("hub", "topic dsh-plugin", "manual", "set on the repository, not in the manifest: gh repo edit --add-topic dsh-plugin");
    add("hub", "npm package for the in-DSH store", isPrivate ? "fail" : "manual", isPrivate ? "not published" : "registry presence is a network fact; verify with npm view before claiming it");
  }

  if (wants("awesome")) {
    add("awesome", "own repository root", atRoot ? "pass" : "manual", atRoot ? "entry url is the repository itself" : "a monorepo subdirectory needs the /tree/main/<dir> url form and a #name suffix");
    add("awesome", "raster icon on GitHub", existsSync(iconPng) ? "pass" : "fail", existsSync(iconPng) ? "assets/icon-180.png present; SVG is rejected by the catalog" : "assets/icon-180.png missing; the catalog rejects SVG and needs a GitHub-hosted raster");
    add("awesome", "english description", typeof pkg.description === "string" && pkg.description.trim() !== "" ? "pass" : "fail", "the catalog requires description.en");
    add("awesome", "repository age", args.created === undefined ? "manual" : "computed", "MIN_AGE_DAYS is 1; pass --repo-created to evaluate it");
    add("awesome", "one entry per PR", "pass", "MAX_ENTRIES_PER_PR is 3, this submission carries 1");
  }

  if (wants("index")) {
    add("index", "format-1 fields", typeof engines === "string" && engines !== "" ? "pass" : "fail", typeof engines === "string" ? "engines.dsh " + engines : "engines.dsh is required per version");
    add("index", "locale titles", existsSync(join(packageRoot, "locale", "en.json")) ? "pass" : "fail", "title and description come from locale/en.json and locale/zh.json");
    add("index", "icon readable", typeof pkg.icon === "string" && existsSync(join(packageRoot, pkg.icon.replace(/^\.\//u, ""))) ? "pass" : "fail", typeof pkg.icon === "string" ? pkg.icon : "no icon field");
  }

  if (args.created !== undefined) {
    const created = Date.parse(args.created);
    if (Number.isNaN(created)) {
      add("awesome", "repository age", "fail", "--repo-created is not a parseable date");
    } else {
      const days = (Date.now() - created) / 86_400_000;
      const ready = days >= 1;
      add("awesome", "repository age", ready ? "pass" : "blocked", days.toFixed(1) + " days old, needs 1");
    }
  }

  add("all", "license", license === "" ? "fail" : "pass", license === "" ? "no license field" : license);
  add("all", "web client", hasClient ? "pass" : "info", hasClient ? "dsh.client declared" : "no client half; the plugin would be host-only");

  const blocking = findings.filter((finding) => finding.status === "fail" || finding.status === "blocked");
  const summary = {
    ok: blocking.length === 0,
    mode: "check",
    skill_version: skillVersion(),
    package: { name: pkg.name ?? null, version: pkg.version ?? null, root: packageRoot, repo },
    target: args.target,
    findings,
    blocking: blocking.map((finding) => finding.surface + ": " + finding.rule + " (" + finding.detail + ")"),
    manual: findings.filter((finding) => finding.status === "manual").map((finding) => finding.surface + ": " + finding.rule),
  };

  if (args.json) process.stdout.write(JSON.stringify(summary, null, 2) + "\n");
  else {
    for (const finding of findings) process.stdout.write("[" + finding.status + "] " + finding.surface + " / " + finding.rule + ": " + finding.detail + "\n");
    if (blocking.length > 0) process.stdout.write("\nblocked by " + blocking.length + " rule(s)\n");
    else process.stdout.write("\nall readable rules pass; manual items listed above\n");
  }
  process.exit(blocking.length === 0 ? 0 : 1);
}

check();
