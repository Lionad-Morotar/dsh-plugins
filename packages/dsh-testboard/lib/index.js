// src/index.ts
import { access as access2, readFile as readFile5, realpath as realpath2, stat } from "node:fs/promises";
import { readFileSync as readFileSync2, realpathSync } from "node:fs";
import { join as join5, sep } from "node:path";

// src/host/run-engine.ts
import { readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

// src/host/vitest.ts
import { posix } from "node:path";
var SNAPSHOT_VERSION = 2;
function buildVitestArgv(options) {
  const argv = [
    posix.join(options.workspace, "node_modules", ".bin", "vitest"),
    "run"
  ];
  if (options.scope.kind === "file") argv.push(options.scope.path);
  argv.push("--reporter=verbose", "--reporter=json", "--outputFile", options.outputFile);
  return argv;
}
function packageNameOf(path) {
  const match = /^packages\/([^/]+)\//u.exec(path);
  return match?.[1] ?? ".";
}
function lineOfCase(text, title) {
  if (title === "") return 0;
  const needles = [`it("${title}"`, `test("${title}"`, `it('${title}'`, `test('${title}'`];
  let offset = -1;
  for (const needle of needles) {
    const found = text.indexOf(needle);
    if (found !== -1 && (offset === -1 || found < offset)) offset = found;
  }
  if (offset === -1) return 0;
  let line = 1;
  for (let index = 0; index < offset; index += 1) {
    if (text[index] === "\n") line += 1;
  }
  return line;
}
function toStatus(raw) {
  if (raw === "passed") return "passed";
  if (raw === "failed") return "failed";
  return "skipped";
}
function toRelativePath(raw, workspace) {
  const normalized = raw.split("\\").join("/");
  const root = workspace.split("\\").join("/").replace(/\/+$/u, "");
  if (normalized === root) return "";
  if (normalized.startsWith(`${root}/`)) return normalized.slice(root.length + 1);
  return normalized;
}
function parseVitestJson(raw, options) {
  const payload = typeof raw === "string" ? JSON.parse(raw) : raw;
  const results = payload?.testResults;
  const files = Array.isArray(results) ? results : [];
  const byPackage = /* @__PURE__ */ new Map();
  for (const file of files) {
    if (typeof file !== "object" || file === null) continue;
    if (typeof file.name !== "string" || file.name === "") continue;
    const path = toRelativePath(file.name, options.workspace);
    if (path === "") continue;
    const text = options.fileTextOf?.(path);
    const assertions = Array.isArray(file.assertionResults) ? file.assertionResults : [];
    const cases = [];
    for (const assertion of assertions) {
      if (typeof assertion !== "object" || assertion === null) continue;
      const title = typeof assertion.title === "string" ? assertion.title : void 0;
      if (title === void 0 || title === "") continue;
      const durationMs = typeof assertion.duration === "number" && Number.isFinite(assertion.duration) ? assertion.duration : 0;
      const message = Array.isArray(assertion.failureMessages) ? assertion.failureMessages.filter((entry) => typeof entry === "string").join("\n") : "";
      cases.push({
        path,
        name: title,
        line: text === void 0 ? 0 : lineOfCase(text, title),
        status: toStatus(assertion.status),
        durationMs,
        ...message === "" ? {} : { message }
      });
    }
    const packageName = packageNameOf(path);
    const bucket = byPackage.get(packageName);
    if (bucket === void 0) byPackage.set(packageName, [{ path, cases }]);
    else bucket.push({ path, cases });
  }
  const packages = [...byPackage.entries()].sort(([left], [right]) => left < right ? -1 : left > right ? 1 : 0).map(([name2, packageFiles]) => ({
    name: name2,
    files: packageFiles.sort((left, right) => left.path < right.path ? -1 : left.path > right.path ? 1 : 0)
  }));
  return {
    version: SNAPSHOT_VERSION,
    statusSource: "vitest",
    packages,
    workspace: options.workspace,
    ...options.generatedAt === void 0 ? {} : { generatedAt: options.generatedAt },
    ...options.wallClockMs === void 0 ? {} : { wallClockMs: options.wallClockMs }
  };
}
function runFailed(snapshot, exitCode) {
  if (exitCode !== null && exitCode !== 0) return true;
  if (snapshot === void 0) return true;
  return snapshot.packages.some((pkg) => pkg.files.some((file) => file.cases.some((entry) => entry.status === "failed")));
}
function stripAnsi(line) {
  return line.replace(/\u001B\[[0-9;]*[A-Za-z]/gu, "");
}
function parseDuration(raw) {
  if (raw === void 0) return 0;
  const match = /^([0-9]+(?:\.[0-9]+)?)(ms|s)$/u.exec(raw);
  if (match === null) return 0;
  const value = Number.parseFloat(match[1] ?? "0");
  return match[2] === "s" ? value * 1e3 : value;
}
function splitLocation(location) {
  const segments = location.split(" > ");
  if (segments.length < 2) return void 0;
  const path = segments[0]?.trim() ?? "";
  const name2 = segments[segments.length - 1]?.trim() ?? "";
  if (path === "" || name2 === "") return void 0;
  return { path, name: name2 };
}
function parseVerboseLine(line) {
  const cleaned = stripAnsi(line);
  const match = /^\s*([✓×↓])\s+(.+)$/u.exec(cleaned);
  if (match !== null) {
    const marker = match[1];
    const rest = match[2] ?? "";
    const withDuration = /^(.*?)\s+([0-9]+(?:\.[0-9]+)?(?:ms|s))$/u.exec(rest);
    const location = withDuration === null ? rest : withDuration[1] ?? "";
    const durationMs = withDuration === null ? 0 : parseDuration(withDuration[2]);
    const split = splitLocation(location);
    if (split === void 0) return void 0;
    const status = marker === "\u2713" ? "passed" : marker === "\xD7" ? "failed" : "skipped";
    return { kind: "case", path: split.path, name: split.name, status, durationMs };
  }
  const failure = /^\s*FAIL\s+(.+)$/u.exec(cleaned);
  if (failure !== null) {
    const split = splitLocation(failure[1] ?? "");
    if (split === void 0) return void 0;
    return { kind: "failure", path: split.path, name: split.name };
  }
  return void 0;
}
function parseVerboseOutput(text) {
  const events = [];
  for (const line of text.split("\n")) {
    const event = parseVerboseLine(line);
    if (event !== void 0) events.push(event);
  }
  return events;
}

// src/host/run-engine.ts
var MAX_STREAM_BYTES = 4 * 1024 * 1024;
var GRACE_MS = 500;
var EMPTY_BUFFER = Buffer.alloc(0);
function incompleteTailBytes(buffer) {
  const limit = Math.min(4, buffer.length);
  for (let back = 1; back <= limit; back += 1) {
    const byte = buffer[buffer.length - back];
    if (byte === void 0) return 0;
    if ((byte & 192) === 128) continue;
    const needed = byte >= 240 ? 4 : byte >= 224 ? 3 : byte >= 192 ? 2 : 1;
    return needed > back ? back : 0;
  }
  return buffer.length;
}
var STREAM_POLL_MS = 200;
var SERIES_BUCKET_MS = 1e3;
function createRunEngine(options) {
  const now = options.now ?? Date.now;
  const entries = /* @__PURE__ */ new Map();
  function entryOf(workspace) {
    const existing = entries.get(workspace);
    if (existing !== void 0) return existing;
    const created = { runCount: 0 };
    entries.set(workspace, created);
    return created;
  }
  function readStream(reader) {
    if (reader === void 0) return "";
    return reader.readFrom(0).text;
  }
  function readNew(reader, cursor, carry) {
    if (reader === void 0) return { text: "", next: cursor, carry };
    const read = reader.readFrom(cursor);
    if (read.text === "") return { text: "", next: cursor, carry };
    const fresh = Buffer.from(read.text, "utf8");
    const chunk = carry.length === 0 ? fresh : Buffer.concat([carry, fresh]);
    const incomplete = incompleteTailBytes(chunk);
    const complete = incomplete === 0 ? chunk : chunk.subarray(0, chunk.length - incomplete);
    return {
      text: complete.toString("utf8"),
      // The cursor moves by what the reader consumed, not by what we managed to
      // decode: the bytes held back have already been read.
      next: cursor + fresh.length,
      carry: incomplete === 0 ? EMPTY_BUFFER : Buffer.from(chunk.subarray(chunk.length - incomplete))
    };
  }
  function countsOf2(cases) {
    let passed = 0;
    let failed = 0;
    let skipped = 0;
    for (const entry of cases) {
      if (entry.status === "failed") failed += 1;
      else if (entry.status === "skipped") skipped += 1;
      else passed += 1;
    }
    return { passed, failed, skipped, total: cases.length };
  }
  function seriesOf2(cases, elapsedMs) {
    if (cases.length === 0) return [];
    const spanMs = Math.max(elapsedMs, cases[cases.length - 1]?.atMs ?? 0);
    const buckets = Math.floor(spanMs / SERIES_BUCKET_MS) + 1;
    const points = [];
    let cursor = 0;
    let passed = 0;
    let failed = 0;
    for (let index = 0; index < buckets; index += 1) {
      const until = (index + 1) * SERIES_BUCKET_MS;
      while (cursor < cases.length && (cases[cursor]?.atMs ?? 0) < until) {
        const entry = cases[cursor];
        if (entry !== void 0) {
          if (entry.status === "failed") failed += 1;
          else if (entry.status === "passed") passed += 1;
        }
        cursor += 1;
      }
      points.push({ tMs: index * SERIES_BUCKET_MS, finished: cursor, passed, failed });
    }
    return points;
  }
  function progressOf(base, live, elapsedMs) {
    return {
      runId: base.runId,
      scope: base.scope,
      status: "running",
      phase: "running",
      runNumber: base.runNumber,
      startedAt: base.startedAt,
      elapsedMs,
      completedFiles: live.completedFiles,
      totalFiles: base.totalFiles,
      counts: countsOf2(live.cases),
      series: seriesOf2(live.cases, elapsedMs),
      failures: [...live.failures],
      cases: [...live.cases]
    };
  }
  function mergeScoped(previous, incoming, scopePath) {
    if (previous === void 0) return incoming;
    const replacement = incoming.packages.flatMap((pkg) => pkg.files).find((file) => file.path === scopePath);
    if (replacement === void 0) return previous;
    const byPackage = /* @__PURE__ */ new Map();
    for (const pkg of previous.packages) {
      for (const file of pkg.files) {
        if (file.path === scopePath) continue;
        const bucket2 = byPackage.get(pkg.name);
        if (bucket2 === void 0) byPackage.set(pkg.name, [file]);
        else bucket2.push(file);
      }
    }
    const packageName = incoming.packages.find((pkg) => pkg.files.some((file) => file.path === scopePath))?.name ?? ".";
    const bucket = byPackage.get(packageName);
    if (bucket === void 0) byPackage.set(packageName, [replacement]);
    else bucket.push(replacement);
    const packages = [...byPackage.entries()].sort(([left], [right]) => left < right ? -1 : left > right ? 1 : 0).map(([name2, files]) => ({
      name: name2,
      files: [...files].sort((left, right) => left.path < right.path ? -1 : left.path > right.path ? 1 : 0)
    }));
    return { ...incoming, packages };
  }
  function patchLog(log, incoming, scopePath) {
    const replacement = incoming.packages.flatMap((pkg) => pkg.files).find((file) => file.path === scopePath);
    if (replacement === void 0) return log;
    const verdictQueues = /* @__PURE__ */ new Map();
    for (const verdict of replacement.cases) {
      const queue = verdictQueues.get(verdict.name);
      const entry = { status: verdict.status, durationMs: verdict.durationMs };
      if (queue === void 0) verdictQueues.set(verdict.name, [entry]);
      else queue.push(entry);
    }
    const used = /* @__PURE__ */ new Map();
    const cases = [];
    for (const event of log.cases) {
      if (event.path !== scopePath) {
        cases.push(event);
        continue;
      }
      const verdict = verdictQueues.get(event.name)?.shift();
      if (verdict === void 0) continue;
      used.set(event.name, (used.get(event.name) ?? 0) + 1);
      cases.push({ ...event, status: verdict.status, durationMs: verdict.durationMs });
    }
    for (const verdict of replacement.cases) {
      const matched = used.get(verdict.name) ?? 0;
      if (matched > 0) {
        used.set(verdict.name, matched - 1);
        continue;
      }
      cases.push({
        path: scopePath,
        name: verdict.name,
        status: verdict.status,
        durationMs: verdict.durationMs,
        atMs: log.elapsedMs
      });
    }
    const counts = countsOf2(cases);
    const failures = cases.filter((event) => event.status === "failed").map((event) => ({ tMs: event.atMs, path: event.path, name: event.name }));
    return {
      ...log,
      status: failures.length === 0 ? "passed" : "failed",
      counts,
      failures,
      cases,
      series: seriesOf2(cases, log.elapsedMs)
    };
  }
  async function execute(workspace, scope, runId, entry) {
    const controller = new AbortController();
    entry.controller = controller;
    const startedAtMs = now();
    const outputFile = join(tmpdir(), `dsh-testboard-${runId}.json`);
    const startedAt = new Date(startedAtMs).toISOString();
    entry.runCount += 1;
    const base = {
      runId,
      scope,
      runNumber: entry.runCount,
      startedAt,
      totalFiles: scope.kind === "file" ? 1 : null
    };
    const live = { cases: [], failures: [], completedFiles: 0 };
    let pending = "";
    const finishedFiles = /* @__PURE__ */ new Set();
    entry.run = progressOf(base, live, 0);
    const absorb = (chunk) => {
      const combined = pending + chunk;
      const lastBreak = combined.lastIndexOf("\n");
      if (lastBreak === -1) {
        pending = combined;
        return;
      }
      pending = combined.slice(lastBreak + 1);
      const complete = combined.slice(0, lastBreak);
      for (const event of parseVerboseOutput(complete)) {
        const atMs = Math.max(0, now() - startedAtMs);
        if (event.kind === "case") {
          live.cases.push({
            path: event.path,
            name: event.name,
            status: event.status,
            durationMs: event.durationMs,
            atMs
          });
          finishedFiles.add(event.path);
        } else {
          live.failures.push({ tMs: atMs, path: event.path, name: event.name });
        }
      }
      live.completedFiles = finishedFiles.size;
    };
    const flush = () => {
      if (pending === "") return;
      const tail = pending;
      pending = "";
      absorb(`${tail}
`);
    };
    const settle = (phase, status, message) => {
      const elapsedMs = Math.max(0, now() - startedAtMs);
      entry.run = {
        ...progressOf(base, live, elapsedMs),
        status,
        phase,
        elapsedMs,
        series: seriesOf2(live.cases, elapsedMs),
        ...phase === "running" ? {} : { finishedAt: new Date(now()).toISOString() },
        ...message === void 0 ? {} : { message }
      };
      entry.controller = void 0;
    };
    let planned = {
      argv: buildVitestArgv({ workspace, scope, outputFile }),
      cwd: workspace
    };
    try {
      if (options.plan !== void 0) planned = await options.plan({ workspace, scope, outputFile });
      const handle = options.subprocess.spawn({
        argv: planned.argv,
        cwd: planned.cwd,
        stdio: {
          // A test run must never wait on input: a prompt with no stdin is a
          // hang, and a hang is indistinguishable from a slow suite.
          stdin: "ignore",
          stdout: { collect: { maxBytes: MAX_STREAM_BYTES } },
          stderr: { collect: { maxBytes: MAX_STREAM_BYTES } }
        },
        graceMs: GRACE_MS,
        signal: controller.signal
      });
      let cursor = 0;
      let carry = EMPTY_BUFFER;
      const stdoutReader = handle.collected.stdout;
      const drain = () => {
        const read = readNew(stdoutReader, cursor, carry);
        cursor = read.next;
        carry = read.carry;
        if (read.text === "") return;
        absorb(read.text);
        entry.run = progressOf(base, live, Math.max(0, now() - startedAtMs));
      };
      const poll = setInterval(drain, STREAM_POLL_MS);
      let exitCode = null;
      try {
        ({ exitCode } = await handle.done);
      } catch (error) {
        clearInterval(poll);
        if (controller.signal.aborted) {
          settle("cancelled", "cancelled");
          return;
        }
        throw error;
      }
      clearInterval(poll);
      drain();
      flush();
      entry.run = progressOf(base, live, Math.max(0, now() - startedAtMs));
      if (controller.signal.aborted) {
        settle("cancelled", "cancelled");
        return;
      }
      let raw;
      try {
        raw = await readFile(outputFile, "utf8");
      } catch {
        const stderr = readStream(handle.collected.stderr).trim();
        settle("error", "error", stderr === "" ? "vitest produced no report" : stderr.split("\n").slice(-8).join("\n"));
        return;
      }
      const parsed = parseVitestJson(raw, {
        workspace,
        ...options.fileTextOf === void 0 ? {} : { fileTextOf: (path) => options.fileTextOf?.(workspace, path) },
        generatedAt: new Date(now()).toISOString(),
        wallClockMs: Math.max(0, now() - startedAtMs)
      });
      entry.snapshot = scope.kind === "file" ? mergeScoped(entry.snapshot, parsed, scope.path) : parsed;
      settle("finished", runFailed(parsed, exitCode) ? "failed" : "passed");
      if (scope.kind === "all" || entry.log === void 0) entry.log = entry.run;
      else entry.log = patchLog(entry.log, parsed, scope.path);
      if (entry.snapshot !== void 0 && entry.run !== void 0) {
        options.onSettled?.(workspace, {
          snapshot: entry.snapshot,
          run: entry.run,
          ...entry.log === void 0 ? {} : { log: entry.log }
        });
      }
    } catch (error) {
      settle("error", "error", error instanceof Error ? error.message : String(error));
    } finally {
      await rm(outputFile, { force: true });
      await planned.cleanup?.();
    }
  }
  return {
    getState(workspace) {
      const entry = entries.get(workspace);
      if (entry === void 0) return {};
      return {
        ...entry.snapshot === void 0 ? {} : { snapshot: entry.snapshot },
        ...entry.run === void 0 ? {} : { run: entry.run },
        ...entry.log === void 0 ? {} : { log: entry.log }
      };
    },
    start(workspace, scope) {
      const entry = entryOf(workspace);
      if (entry.run?.phase === "running") return { ok: false, error: "busy" };
      const runId = `run-${now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
      const done = execute(workspace, scope, runId, entry);
      return { ok: true, runId, done };
    },
    cancel(workspace) {
      const entry = entries.get(workspace);
      const controller = entry?.controller;
      if (controller === void 0) return false;
      controller.abort();
      return true;
    }
  };
}

// src/host/results-store.ts
import { readdir, readFile as readFile2, rename, writeFile, mkdir } from "node:fs/promises";
import { dirname, join as join2 } from "node:path";
var RESULT_ROOT = join2("logs", "testboard");
var RESULT_FILE = "result.json";
var SUMMARY_FILE = "summary.json";
var RUN_ID = /^\d{6}\/\d{6}(?:-\d+)?$/;
function isRunId(value) {
  return RUN_ID.test(value);
}
var RESULT_VERSION = 1;
function two(value) {
  return String(value).padStart(2, "0");
}
function resultDirectory(now) {
  const day = `${String(now.getFullYear()).slice(-2)}${two(now.getMonth() + 1)}${two(now.getDate())}`;
  const time = `${two(now.getHours())}${two(now.getMinutes())}${two(now.getSeconds())}`;
  return join2(RESULT_ROOT, day, time);
}
function readRecord(value) {
  if (value === null || typeof value !== "object") return void 0;
  const fields = value;
  if (fields.version !== RESULT_VERSION) return void 0;
  if (fields.snapshot === null || typeof fields.snapshot !== "object") return void 0;
  if (fields.run === null || typeof fields.run !== "object") return void 0;
  const run = fields.run;
  if (typeof run.phase !== "string" || typeof run.startedAt !== "string") return void 0;
  const savedAt = typeof fields.savedAt === "string" ? fields.savedAt : run.finishedAt ?? run.startedAt;
  return {
    savedAt,
    run,
    snapshot: fields.snapshot,
    // Older records predate the canonical log; the reader then falls back to
    // `run`, which is all they had.
    ...fields.log === null || typeof fields.log !== "object" ? {} : { log: fields.log }
  };
}
function descending(left, right) {
  return left < right ? 1 : left > right ? -1 : 0;
}
function summarize(id, savedAt, record) {
  let files = 0;
  let cases = 0;
  for (const pkg of record.snapshot.packages) {
    files += pkg.files.length;
    for (const file of pkg.files) cases += file.cases.length;
  }
  return {
    id,
    savedAt,
    status: record.run.status,
    phase: record.run.phase,
    scope: record.run.scope,
    runNumber: record.run.runNumber,
    startedAt: record.run.startedAt,
    elapsedMs: record.run.elapsedMs,
    counts: record.run.counts,
    files,
    cases
  };
}
function readSummary(value) {
  if (value === null || typeof value !== "object") return void 0;
  const fields = value;
  if (fields.version !== RESULT_VERSION) return void 0;
  if (typeof fields.id !== "string" || typeof fields.startedAt !== "string") return void 0;
  if (fields.counts === null || typeof fields.counts !== "object") return void 0;
  return fields;
}
function createResultsStore() {
  const memory = /* @__PURE__ */ new Map();
  async function newestPath(workspace) {
    const root = join2(workspace, RESULT_ROOT);
    let days;
    try {
      days = (await readdir(root, { withFileTypes: true })).filter((entry) => entry.isDirectory()).map((entry) => entry.name);
    } catch {
      return void 0;
    }
    days.sort(descending);
    for (const day of days.slice(0, 30)) {
      let times;
      try {
        times = (await readdir(join2(root, day), { withFileTypes: true })).filter((entry) => entry.isDirectory()).map((entry) => entry.name);
      } catch {
        continue;
      }
      times.sort(descending);
      for (const time of times.slice(0, 50)) {
        let raw;
        try {
          raw = await readFile2(join2(root, day, time, RESULT_FILE), "utf8");
        } catch {
          continue;
        }
        let parsed;
        try {
          parsed = JSON.parse(raw);
        } catch {
          continue;
        }
        const record = readRecord(parsed);
        if (record !== void 0) return record;
      }
    }
    return void 0;
  }
  return {
    async save(workspace, result, now = /* @__PURE__ */ new Date()) {
      const directory = resultDirectory(now);
      const body = JSON.stringify({
        version: RESULT_VERSION,
        savedAt: now.toISOString(),
        run: result.run,
        snapshot: result.snapshot,
        ...result.log === void 0 ? {} : { log: result.log }
      });
      for (let attempt = 1; attempt <= 20; attempt += 1) {
        const suffix = attempt === 1 ? "" : `-${String(attempt)}`;
        const runDirectory = join2(workspace, `${directory}${suffix}`);
        const id = `${directory.slice(RESULT_ROOT.length + 1)}${suffix}`;
        try {
          await mkdir(dirname(runDirectory), { recursive: true });
          await mkdir(runDirectory);
        } catch (error) {
          const code = error.code;
          if (code === "EEXIST") continue;
          return void 0;
        }
        const absolute = join2(runDirectory, RESULT_FILE);
        try {
          const temporary = `${absolute}.tmp-${String(process.pid)}-${String(Date.now())}`;
          await writeFile(temporary, body, "utf8");
          await rename(temporary, absolute);
        } catch {
          continue;
        }
        const cached = {
          savedAt: now.toISOString(),
          run: result.run,
          snapshot: result.snapshot,
          ...result.log === void 0 ? {} : { log: result.log }
        };
        memory.set(workspace, cached);
        void writeFile(
          join2(runDirectory, SUMMARY_FILE),
          JSON.stringify({ version: RESULT_VERSION, ...summarize(id, cached.savedAt, cached) }),
          "utf8"
        ).catch(() => void 0);
        return absolute;
      }
      return void 0;
    },
    async latest(workspace) {
      if (memory.has(workspace)) return memory.get(workspace);
      const record = await newestPath(workspace);
      memory.set(workspace, record);
      return record;
    },
    async list(workspace) {
      const root = join2(workspace, RESULT_ROOT);
      let days;
      try {
        days = (await readdir(root, { withFileTypes: true })).filter((entry) => entry.isDirectory()).map((entry) => entry.name);
      } catch {
        return [];
      }
      days.sort(descending);
      const runs = [];
      for (const day of days.slice(0, 30)) {
        let times;
        try {
          times = (await readdir(join2(root, day), { withFileTypes: true })).filter((entry) => entry.isDirectory()).map((entry) => entry.name);
        } catch {
          continue;
        }
        times.sort(descending);
        for (const time of times.slice(0, 200)) {
          const id = `${day}/${time}`;
          if (!isRunId(id)) continue;
          try {
            const summary = readSummary(JSON.parse(await readFile2(join2(root, day, time, SUMMARY_FILE), "utf8")));
            if (summary !== void 0) {
              runs.push(summary);
              continue;
            }
          } catch {
          }
          try {
            const record = readRecord(JSON.parse(await readFile2(join2(root, day, time, RESULT_FILE), "utf8")));
            if (record === void 0) continue;
            const summary = summarize(id, record.savedAt, record);
            runs.push(summary);
            void writeFile(
              join2(root, day, time, SUMMARY_FILE),
              JSON.stringify({ version: RESULT_VERSION, ...summary }),
              "utf8"
            ).catch(() => void 0);
          } catch {
            continue;
          }
        }
      }
      runs.sort((left, right) => left.savedAt < right.savedAt ? 1 : left.savedAt > right.savedAt ? -1 : 0);
      return runs;
    },
    async load(workspace, id) {
      if (!isRunId(id)) return void 0;
      try {
        return readRecord(JSON.parse(await readFile2(join2(workspace, RESULT_ROOT, ...id.split("/"), RESULT_FILE), "utf8")));
      } catch {
        return void 0;
      }
    }
  };
}

// src/host/report-import.ts
import { readFileSync } from "node:fs";
import { readdir as readdir2, readFile as readFile3, rename as rename2 } from "node:fs/promises";
import { join as join3 } from "node:path";
var REPORT_SUFFIX = ".vitest.json";
var REPORT_ROOT = RESULT_ROOT;
function timingsOf(raw) {
  const results = raw?.testResults;
  if (!Array.isArray(results)) return [];
  return results.flatMap((entry) => {
    if (entry === null || typeof entry !== "object") return [];
    const record = entry;
    if (typeof record.name !== "string") return [];
    return [
      {
        name: record.name,
        ...typeof record.startTime === "number" ? { startTime: record.startTime } : {},
        ...typeof record.endTime === "number" ? { endTime: record.endTime } : {}
      }
    ];
  });
}
function countsOf(cases) {
  let passed = 0;
  let failed = 0;
  let skipped = 0;
  for (const entry of cases) {
    if (entry.status === "failed") failed += 1;
    else if (entry.status === "skipped") skipped += 1;
    else passed += 1;
  }
  return { passed, failed, skipped, total: passed + failed + skipped };
}
function seriesOf(cases, elapsedMs) {
  const sorted = [...cases].sort((left, right) => left.atMs - right.atMs);
  const last = sorted[sorted.length - 1]?.atMs ?? 0;
  const seconds = Math.max(1, Math.ceil(Math.max(elapsedMs, last) / 1e3));
  const series = [];
  let index = 0;
  let passed = 0;
  let failed = 0;
  let finished = 0;
  for (let second = 0; second <= seconds; second += 1) {
    const limit = second * 1e3;
    while (index < sorted.length && (sorted[index]?.atMs ?? Infinity) <= limit) {
      const entry = sorted[index];
      if (entry === void 0) break;
      finished += 1;
      if (entry.status === "failed") failed += 1;
      else if (entry.status !== "skipped") passed += 1;
      index += 1;
    }
    series.push({ tMs: limit, finished, passed, failed });
  }
  return series;
}
function caseClock(snapshot, rawFiles, runStart) {
  const bySuffix = new Map(rawFiles.map((file) => [file.name.split(/[\\/]/u).join("/"), file]));
  const events = [];
  for (const pkg of snapshot.packages) {
    for (const file of pkg.files) {
      let rawFile;
      for (const [name2, candidate] of bySuffix) {
        if (name2.endsWith(`/${file.path}`) || name2 === file.path) {
          rawFile = candidate;
          break;
        }
      }
      const fileStart = rawFile?.startTime === void 0 || runStart === void 0 ? 0 : Math.max(0, rawFile.startTime - runStart);
      let offset = 0;
      for (const entry of file.cases) {
        events.push({
          path: file.path,
          name: entry.name,
          status: entry.status === "failed" ? "failed" : entry.status === "skipped" ? "skipped" : "passed",
          durationMs: entry.durationMs,
          atMs: fileStart + offset
        });
        offset += entry.durationMs;
      }
    }
  }
  return events;
}
function mergeSnapshot(snapshot, previous) {
  if (previous === void 0) return snapshot;
  const incoming = new Set(snapshot.packages.flatMap((pkg) => pkg.files.map((file) => file.path)));
  const covered = previous.snapshot.packages.flatMap((pkg) => pkg.files).filter((file) => incoming.has(file.path)).length;
  const all = previous.snapshot.packages.reduce((sum, pkg) => sum + pkg.files.length, 0);
  if (covered >= all) return snapshot;
  const order = [];
  const files = /* @__PURE__ */ new Map();
  for (const pkg of previous.snapshot.packages) {
    order.push(pkg.name);
    files.set(pkg.name, [...pkg.files]);
  }
  for (const pkg of snapshot.packages) {
    let bucket = files.get(pkg.name);
    if (bucket === void 0) {
      bucket = [];
      files.set(pkg.name, bucket);
      order.push(pkg.name);
    }
    for (const file of pkg.files) {
      const index = bucket.findIndex((candidate) => candidate.path === file.path);
      if (index === -1) bucket.push(file);
      else bucket[index] = file;
    }
  }
  return { ...previous.snapshot, packages: order.map((name2) => ({ name: name2, files: files.get(name2) ?? [] })) };
}
function recordFromReport(workspace, raw, previous, now = /* @__PURE__ */ new Date()) {
  const snapshot = parseVitestJson(raw, {
    workspace,
    fileTextOf: (path) => {
      try {
        return readFileSync(join3(workspace, path), "utf8");
      } catch {
        return void 0;
      }
    },
    generatedAt: now.toISOString(),
    wallClockMs: 0
  });
  if (snapshot.packages.length === 0) return void 0;
  const rawFiles = timingsOf(raw);
  const starts = rawFiles.flatMap((file) => typeof file.startTime === "number" ? [file.startTime] : []);
  const ends = rawFiles.flatMap((file) => typeof file.endTime === "number" ? [file.endTime] : []);
  const runStart = starts.length === 0 ? void 0 : Math.min(...starts);
  const runEnd = ends.length === 0 ? void 0 : Math.max(...ends);
  const events = caseClock(snapshot, rawFiles, runStart);
  const summed = events.reduce((sum, entry) => sum + entry.durationMs, 0);
  const elapsedMs = runStart !== void 0 && runEnd !== void 0 ? Math.max(1, runEnd - runStart) : Math.max(1, summed);
  const counts = countsOf(events);
  const failures = events.filter((entry) => entry.status === "failed").map((entry) => ({ tMs: entry.atMs, path: entry.path, name: entry.name }));
  const run = {
    runId: `import-${String(now.getTime())}`,
    scope: { kind: "all" },
    status: failures.length === 0 ? "passed" : "failed",
    phase: "finished",
    runNumber: (previous?.run.runNumber ?? 0) + 1,
    startedAt: (runStart === void 0 ? now : new Date(runStart)).toISOString(),
    finishedAt: now.toISOString(),
    elapsedMs,
    completedFiles: snapshot.packages.reduce((sum, pkg) => sum + pkg.files.length, 0),
    totalFiles: null,
    counts,
    series: seriesOf(events, elapsedMs),
    failures,
    cases: events
  };
  return { run, snapshot: mergeSnapshot(snapshot, previous) };
}
async function importReports(workspace, results, now = /* @__PURE__ */ new Date()) {
  const root = join3(workspace, REPORT_ROOT);
  let names;
  try {
    names = (await readdir2(root, { withFileTypes: true })).filter((entry) => entry.isFile() && entry.name.endsWith(REPORT_SUFFIX)).map((entry) => entry.name);
  } catch {
    return 0;
  }
  let imported = 0;
  let previous = await results.latest(workspace);
  for (const name2 of names) {
    const source = join3(root, name2);
    const claimed = `${source}.importing`;
    try {
      await rename2(source, claimed);
    } catch {
      continue;
    }
    try {
      const raw = JSON.parse(await readFile3(claimed, "utf8"));
      const record = recordFromReport(workspace, raw, previous, now);
      if (record === void 0) {
        await rename2(claimed, `${source}.bad`);
        continue;
      }
      const saved = await results.save(workspace, record, now);
      if (saved === void 0) {
        await rename2(claimed, source);
        continue;
      }
      await rename2(claimed, `${source}.imported`);
      imported += 1;
      previous = { savedAt: now.toISOString(), ...record };
    } catch {
      await rename2(claimed, `${source}.bad`).catch(() => void 0);
    }
  }
  return imported;
}

// src/host/run-plan.ts
import { access, mkdtemp, readFile as readFile4, readdir as readdir3, rm as rm2, writeFile as writeFile2 } from "node:fs/promises";
import { tmpdir as tmpdir2 } from "node:os";
import { join as join4 } from "node:path";
var CONFIG_NAMES = ["vitest.config.ts", "vitest.config.mts", "vitest.config.js", "vitest.config.mjs", "vitest.config.cts", "vitest.config.cjs"];
async function hasConfig(directory) {
  for (const name2 of CONFIG_NAMES) {
    try {
      await access(join4(directory, name2));
      return true;
    } catch {
      continue;
    }
  }
  return false;
}
async function discoverProjects(workspace) {
  const packages = join4(workspace, "packages");
  let names;
  try {
    names = (await readdir3(packages, { withFileTypes: true })).filter((entry) => entry.isDirectory() && !entry.name.startsWith(".") && entry.name !== "node_modules").map((entry) => entry.name);
  } catch {
    return [];
  }
  names.sort();
  const projects = [];
  for (const name2 of names) {
    const directory = join4(packages, name2);
    try {
      await access(join4(directory, "package.json"));
    } catch {
      continue;
    }
    if (await hasConfig(directory)) {
      projects.push(directory);
      continue;
    }
    try {
      const manifest = JSON.parse(await readFile4(join4(directory, "package.json"), "utf8"));
      const script = manifest.scripts?.test;
      if (typeof script === "string" && script.includes("vitest")) projects.push(directory);
    } catch {
      continue;
    }
  }
  return projects;
}
function packageOf(workspace, scope) {
  if (scope.kind !== "file") return void 0;
  const match = /^packages\/([^/]+)\//u.exec(scope.path);
  return match?.[1] === void 0 ? void 0 : join4(workspace, "packages", match[1]);
}
async function writeProjectsConfig(workspace, projects) {
  const directory = await mkdtemp(join4(tmpdir2(), "dsh-testboard-plan-"));
  const file = join4(directory, "vitest.config.mjs");
  const body = [
    "export default {",
    `  root: ${JSON.stringify(workspace)},`,
    "  test: {",
    "    projects: [",
    ...projects.map((project) => `      ${JSON.stringify(project)},`),
    "    ],",
    "  },",
    "};",
    ""
  ].join("\n");
  await writeFile2(file, body, "utf8");
  return { file, directory };
}
async function planVitestRun(input) {
  const { workspace, scope, outputFile } = input;
  const binary = join4(workspace, "node_modules", ".bin", "vitest");
  const rootConfig = await hasConfig(workspace);
  if (scope.kind === "file" && !rootConfig) {
    const directory = packageOf(workspace, scope);
    if (directory !== void 0 && await hasConfig(directory)) {
      return {
        argv: [binary, "run", scope.path, "--reporter=verbose", "--reporter=json", "--outputFile", outputFile],
        cwd: directory
      };
    }
  }
  if (scope.kind === "all" && !rootConfig) {
    const projects = await discoverProjects(workspace);
    if (projects.length > 0) {
      const generated = await writeProjectsConfig(workspace, projects);
      return {
        argv: [
          binary,
          "run",
          "--config",
          generated.file,
          "--reporter=verbose",
          "--reporter=json",
          "--outputFile",
          outputFile
        ],
        cwd: workspace,
        cleanup: async () => {
          await rm2(generated.directory, { recursive: true, force: true });
        }
      };
    }
  }
  return { argv: buildVitestArgv({ workspace, scope, outputFile }), cwd: workspace };
}

// src/host/state-reader.ts
import { basename } from "node:path";
function cachedState(workspace, cached, selectedRun) {
  return {
    workspace,
    workspaceName: basename(workspace),
    snapshot: cached.snapshot,
    run: cached.run,
    ...cached.log === void 0 ? {} : { log: cached.log },
    cached: true,
    ...selectedRun === void 0 ? {} : { selectedRun }
  };
}
function createStateReader(deps) {
  return async (workspace) => {
    if (!await deps.isDirectory(workspace)) return { workspace, error: "unknown-workspace" };
    const state = deps.engine.getState(workspace);
    const empty = state.snapshot === void 0 && state.run === void 0;
    if (empty) {
      const cached = await deps.results.latest(workspace);
      if (cached === void 0) return { workspace, workspaceName: basename(workspace) };
      return cachedState(workspace, cached);
    }
    return {
      workspace,
      workspaceName: basename(workspace),
      ...state,
      // The last run's error is also the board's: a reader who reloads after a
      // crashed run must still see why the numbers are stale.
      ...state.run?.status === "error" ? { error: "run-failed" } : {}
    };
  };
}
function createSelectedStateReader(deps) {
  return async (workspace, runId) => {
    if (!await deps.isDirectory(workspace)) return { workspace, error: "unknown-workspace" };
    const cached = await deps.results.load(workspace, runId);
    if (cached === void 0) return { workspace, workspaceName: basename(workspace), error: "run-missing", selectedRun: runId };
    return cachedState(workspace, cached, runId);
  };
}

// src/host/routes.ts
import { posix as posix2 } from "node:path";

// src/shared.ts
var PACKAGE_NAME = "dsh-testboard";
var ROUTE_PREFIX = "/testboard/api";
var MAX_SOURCE_BYTES = 2 * 1024 * 1024;

// src/host/routes.ts
var MAX_BODY_BYTES = 64 * 1024;
function safeRelativePath(raw) {
  if (raw === "") return void 0;
  const normalized = posix2.normalize(raw.split("\\").join("/"));
  if (normalized === "" || normalized === ".") return void 0;
  if (normalized.startsWith("/") || normalized.startsWith("../") || normalized === "..") return void 0;
  return normalized;
}
function coerceScope(raw) {
  if (typeof raw !== "object" || raw === null) return void 0;
  const candidate = raw;
  if (candidate.kind === "all") return { kind: "all" };
  if (candidate.kind !== "file") return void 0;
  if (typeof candidate.path !== "string") return void 0;
  const path = safeRelativePath(candidate.path);
  return path === void 0 ? void 0 : { kind: "file", path };
}
function sessionIdOf(url) {
  const raw = url.searchParams.get("sessionId");
  return raw === null || raw === "" ? void 0 : raw;
}
function fail(status, error) {
  return { status, body: { error } };
}
async function handleRequest(deps, request) {
  const url = new URL(request.url, "http://testboard.local");
  const suffix = url.pathname.slice(ROUTE_PREFIX.length).replace(/^\/+/u, "").replace(/\/+$/u, "");
  const method = request.method.toUpperCase();
  try {
    if (suffix === "state" || suffix === "run") {
      if (method === "GET") {
        const sessionId = sessionIdOf(url);
        if (sessionId === void 0) return fail(400, "sessionId query parameter is required");
        const workspace = await deps.resolveWorkspaceRoot(sessionId);
        if (workspace === void 0) return { status: 200, body: { error: "no-session" } };
        const runId = url.searchParams.get("run");
        return { status: 200, body: await deps.readState(workspace, runId === null || runId === "" ? void 0 : runId) };
      }
      if (method === "POST" && suffix === "run") {
        const body = request.body ?? {};
        if (typeof body.sessionId !== "string" || body.sessionId === "") {
          return fail(400, "sessionId is required in the body");
        }
        const workspace = await deps.resolveWorkspaceRoot(body.sessionId);
        if (workspace === void 0) {
          return { status: 200, body: { ok: false, error: "no-session" } };
        }
        const scope = coerceScope(body.scope);
        if (scope === void 0) return fail(400, "bad-scope");
        return { status: 200, body: await deps.startRun(workspace, scope) };
      }
      return fail(405, `method ${method} is not allowed on ${suffix}`);
    }
    if (suffix === "history") {
      if (method !== "GET") return fail(405, `method ${method} is not allowed on history`);
      const sessionId = sessionIdOf(url);
      if (sessionId === void 0) return fail(400, "sessionId query parameter is required");
      const workspace = await deps.resolveWorkspaceRoot(sessionId);
      if (workspace === void 0) return { status: 200, body: { runs: [] } };
      return { status: 200, body: await deps.readHistory(workspace) };
    }
    if (suffix === "cancel") {
      if (method !== "POST") return fail(405, `method ${method} is not allowed on cancel`);
      const body = request.body ?? {};
      if (typeof body.sessionId !== "string" || body.sessionId === "") {
        return fail(400, "sessionId is required in the body");
      }
      const workspace = await deps.resolveWorkspaceRoot(body.sessionId);
      if (workspace === void 0) return { status: 200, body: { ok: false } };
      return { status: 200, body: { ok: deps.cancelRun(workspace) } };
    }
    if (suffix === "source") {
      if (method !== "GET") return fail(405, `method ${method} is not allowed on source`);
      const sessionId = sessionIdOf(url);
      if (sessionId === void 0) return fail(400, "sessionId query parameter is required");
      const rawPath = url.searchParams.get("path");
      if (rawPath === null || rawPath === "") return fail(400, "path query parameter is required");
      const path = safeRelativePath(rawPath);
      if (path === void 0) return fail(400, "path escapes the workspace");
      const workspace = await deps.resolveWorkspaceRoot(sessionId);
      if (workspace === void 0) return fail(404, "unknown session");
      const text = await deps.readSource(workspace, path);
      if (text === void 0) return fail(404, `no such file ${path}`);
      if (Buffer.byteLength(text, "utf8") > MAX_SOURCE_BYTES) return fail(413, "file is too large to preview");
      return { status: 200, body: { text } };
    }
    return fail(404, `no testboard route for ${method} ${url.pathname}`);
  } catch (error) {
    return fail(500, error instanceof Error ? error.message : String(error));
  }
}
function registerTestboardRoutes(webServer, deps) {
  return webServer.register({
    kind: "prefix",
    path: ROUTE_PREFIX,
    handler: async (req, res) => {
      let body;
      try {
        body = await readJsonBody(req);
      } catch (error) {
        sendJson(res, 400, { error: error instanceof Error ? error.message : String(error) });
        return;
      }
      const response = await handleRequest(deps, { method: req.method ?? "GET", url: req.url ?? "/", body });
      sendJson(res, response.status, response.body);
    }
  });
}
function sendJson(res, status, body) {
  const text = JSON.stringify(body);
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "content-length": Buffer.byteLength(text),
    "cache-control": "no-store"
  });
  res.end(text);
}
async function readJsonBody(req) {
  if (req.method !== "POST") return void 0;
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    size += buffer.byteLength;
    if (size > MAX_BODY_BYTES) throw new Error("request body too large");
    chunks.push(buffer);
  }
  if (chunks.length === 0) return {};
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

// src/host/workspace.ts
import { realpath } from "node:fs/promises";
async function canonicalPath(dir) {
  try {
    return await realpath(dir);
  } catch {
    return dir;
  }
}
async function resolveSessionRoot(sessionId, sessions, persistence) {
  const live = sessions?.get(sessionId)?.header?.cwd;
  if (typeof live === "string" && live !== "") return canonicalPath(live);
  try {
    const persisted = (await persistence?.stat(sessionId))?.header?.cwd;
    if (typeof persisted === "string" && persisted !== "") return canonicalPath(persisted);
  } catch {
  }
  return void 0;
}

// src/index.ts
var name = PACKAGE_NAME;
var inject = ["subprocess", "sessions", "sessionPersistence"];
var WEB_SERVER_POLL_MS = 250;
var WEB_SERVER_WAIT_MS = 15e3;
function readService(ctx, name2) {
  const value = ctx.get?.(name2);
  return value === null ? void 0 : value;
}
function whenWebServer(host, register) {
  const found = () => readService(host, "webServer");
  const present = found();
  if (present !== void 0) {
    register(present);
    return;
  }
  const startedAt = Date.now();
  const timer = setInterval(() => {
    const webServer = found();
    if (webServer === void 0) {
      if (Date.now() - startedAt > WEB_SERVER_WAIT_MS) clearInterval(timer);
      return;
    }
    clearInterval(timer);
    register(webServer);
  }, WEB_SERVER_POLL_MS);
}
async function hasVitest(workspace) {
  try {
    await access2(join5(workspace, "node_modules", ".bin", "vitest"));
    return true;
  } catch {
    return false;
  }
}
async function isDirectory(path) {
  try {
    return (await stat(path)).isDirectory();
  } catch {
    return false;
  }
}
function withinWorkspace(root, target) {
  return target === root || target.startsWith(root.endsWith(sep) ? root : root + sep);
}
function readWorkspaceFileSync(workspace, path) {
  try {
    const root = realpathSync(workspace);
    const target = realpathSync(join5(root, path));
    if (!withinWorkspace(root, target)) return void 0;
    return readFileSync2(target, "utf8");
  } catch {
    return void 0;
  }
}
async function readWorkspaceFile(workspace, path) {
  try {
    const root = await realpath2(workspace);
    const target = await realpath2(join5(root, path));
    if (!withinWorkspace(root, target)) return void 0;
    const info = await stat(target);
    if (!info.isFile()) return void 0;
    return await readFile5(target, "utf8");
  } catch {
    return void 0;
  }
}
function apply(ctx) {
  const host = ctx;
  whenWebServer(host, (webServer) => {
    const sessions = readService(host, "sessions");
    const sessionPersistence = readService(host, "sessionPersistence");
    const subprocess = readService(host, "subprocess");
    const results = createResultsStore();
    const engine = createRunEngine({
      subprocess: subprocess ?? {
        // A host without a subprocess service cannot run anything. The engine is
        // still built so state reads work; `startRun` refuses before reaching it.
        spawn: () => ({ done: Promise.reject(new Error("no subprocess service")), collected: {} })
      },
      fileTextOf: (workspace, path) => readWorkspaceFileSync(workspace, path),
      plan: planVitestRun,
      onSettled: (workspace, result) => {
        void results.save(workspace, result);
      }
    });
    async function resolveWorkspaceRoot(sessionId) {
      return resolveSessionRoot(sessionId, sessions, sessionPersistence);
    }
    const readState = createStateReader({ engine, results, isDirectory });
    const readSelectedState = createSelectedStateReader({ results, isDirectory });
    async function ingestReports(workspace) {
      try {
        await importReports(workspace, results);
      } catch {
      }
    }
    async function startRun(workspace, scope) {
      if (subprocess === void 0) return { ok: false, error: "no-subprocess" };
      if (!await hasVitest(workspace)) return { ok: false, error: "no-vitest" };
      const started = engine.start(workspace, scope);
      return started.ok ? { ok: true, runId: started.runId } : started;
    }
    const deps = {
      resolveWorkspaceRoot,
      readState: async (workspace, runId) => {
        await ingestReports(workspace);
        return runId === void 0 ? readState(workspace) : readSelectedState(workspace, runId);
      },
      readHistory: async (workspace) => {
        await ingestReports(workspace);
        return { runs: await results.list(workspace) };
      },
      startRun,
      cancelRun: (workspace) => engine.cancel(workspace),
      readSource: (workspace, path) => readWorkspaceFile(workspace, path)
    };
    const unregister = registerTestboardRoutes(webServer, deps);
    host.effect?.(() => () => {
      unregister();
    });
  });
}
var index_default = { name, inject, apply };
export {
  PACKAGE_NAME,
  apply,
  index_default as default,
  inject,
  name,
  readWorkspaceFile,
  readWorkspaceFileSync
};
