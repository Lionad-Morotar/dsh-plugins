/**
 * The `set_reasoning_effort` tool: a model-facing way to read and change this
 * session's reasoning effort.
 *
 * The whole reason this module exists in this shape is the cost of the write.
 * Changing the effort invalidates the provider's prompt cache, so the next
 * request re-bills the entire context instead of reusing cached prefixes. That
 * makes the tool a poor fit for improvisation and a good fit for the rare case
 * where the user asks for it, so the description spends most of its words
 * talking the model out of calling it, and the read path is deliberately free
 * of side effects: a model that wants to know the current level should never
 * have to pay for asking.
 *
 * Nothing here imports a host package. The tool is described by a local
 * interface and the output schema stays inside the JSON Schema subset the host
 * enforces, so the host half keeps building without a new dependency.
 */

/** The model-facing tool name. */
export const SET_EFFORT_TOOL_NAME = "set_reasoning_effort";

/** One selectable level as the model catalog advertises it. */
export interface EffortLevel {
  readonly id: string;
  readonly name: string;
  readonly description?: string;
}

/** The provider/model pair a session is bound to. */
export interface EffortModelRef {
  readonly provider: string;
  readonly model: string;
}

/** A model reference plus the level the session has pinned, if any. */
export interface EffortSelection extends EffortModelRef {
  readonly reasoningEffort?: string;
}

/** Structural slice of the host's model info: only the reasoning block is read. */
export interface EffortModelInfoLike {
  readonly reasoning?: {
    readonly efforts?: readonly EffortLevel[];
    readonly defaultEffort?: string;
  };
}

/** Structural slice of the host's llm service. */
export interface EffortLlmFace {
  resolveModelInfo(provider: string, model: string): Promise<EffortModelInfoLike>;
}

/** Structural slice of the agent's model face. */
export interface EffortAgentModelFace {
  current(): EffortSelection | undefined;
  select(selection: EffortSelection): void;
}

/** Structural slice of the agent the tool runs against. */
export interface EffortAgentLike {
  readonly model?: EffortAgentModelFace;
}

/** Everything one read of the session's effort state yields. */
export interface EffortSnapshot {
  readonly provider: string;
  readonly model: string;
  readonly levels: readonly EffortLevel[];
  readonly defaultEffort: string | undefined;
  /** The level in effect: an explicit choice first, the model default otherwise. */
  readonly currentEffort: string | undefined;
  /** Whether the session records an explicit level (false means the adapter default). */
  readonly explicit: boolean;
}

/** What a switch request resolves to once the snapshot is known. */
export type EffortPlan = { readonly kind: "noop" } | { readonly kind: "change"; readonly reasoningEffort: string };

/** The canonical tool value, kept in step with the output schema below. */
export interface SetEffortToolValue {
  readonly changed: boolean;
  readonly provider: string;
  readonly model: string;
  readonly previous: string | null;
  readonly effort: string | null;
  readonly defaultEffort: string | null;
  readonly levels: readonly EffortLevel[];
}

/** A JSON value, spelled locally so no host type is needed. */
export type JsonValue = null | boolean | number | string | JsonValue[] | { [key: string]: JsonValue };

/** A JSON object node of the schema. */
type JsonObject = { [key: string]: JsonValue };

/** What the tool needs from the host-half assembly. */
export interface SetEffortToolDeps {
  readonly llm: EffortLlmFace;
}

/** The exec context the host hands a tool call. */
export interface SetEffortExec {
  readonly agent?: EffortAgentLike;
}

/** One rendered content part. */
export interface SetEffortContentPart {
  readonly type: "text";
  readonly text: string;
}

/** The tool definition, described locally to avoid importing the host's types. */
export interface SetEffortToolDefinition {
  readonly name: string;
  readonly description: string;
  readonly parameters: JsonObject;
  readonly output: {
    readonly schema: JsonObject;
    readonly render: (args: unknown, value: JsonValue) => readonly SetEffortContentPart[];
  };
  readonly execute: (args: unknown, exec: SetEffortExec) => Promise<JsonValue>;
}

/**
 * The description the model reads before deciding whether to call this.
 *
 * It leads with the cost rather than the capability on purpose: a model that
 * knows only what the tool does will use it to "help", and each of those uses
 * pays for a cold cache.
 */
const DESCRIPTION = [
  "Switch this session's reasoning effort, or read the current level and the levels this model supports.",
  "",
  "Switching is expensive: it invalidates the provider's prompt cache, so the next request re-bills the entire context instead of reusing cached prefixes. Use it only when the user explicitly asks you to change how hard you think, or when a long piece of work clearly needs a materially different level than the one in effect and a cold cache is acceptable. Do not call it on your own initiative, do not tune the level back and forth, and never use it as a retry, fallback, or repair strategy.",
  "",
  "Call it with no arguments for a free read of the effort in effect, the model's default, and the available level ids (for example off, low, high, max). Call it with an effort id to switch; an unknown id fails and lists the available ones. The switch applies from the next model step; earlier answers still belong to the old level.",
].join("\n");

/** A nullable string node, the only way the enforced subset can express `null`. */
const NULLABLE_STRING: JsonObject = { oneOf: [{ type: "string" }, { type: "null" }] };

/** The output schema, restricted to the node keywords the host accepts. */
const OUTPUT_SCHEMA: JsonObject = {
  type: "object",
  properties: {
    changed: { type: "boolean", description: "Whether the level was actually switched." },
    provider: { type: "string" },
    model: { type: "string" },
    previous: { ...NULLABLE_STRING, description: "The level in effect before the call, null when the model has none." },
    effort: { ...NULLABLE_STRING, description: "The level in effect after the call, null when the model has none." },
    defaultEffort: { ...NULLABLE_STRING, description: "The model's own default level, null when it advertises none." },
    levels: {
      type: "array",
      description: "The ladder this model advertises, empty when it has no reasoning levels.",
      items: {
        type: "object",
        properties: {
          id: { type: "string" },
          name: { type: "string" },
          description: { type: "string" },
        },
        required: ["id", "name"],
        additionalProperties: false,
      },
    },
  },
  required: ["changed", "provider", "model", "previous", "effort", "defaultEffort", "levels"],
  additionalProperties: false,
};

/**
 * Read the session's effort state against the model's advertised ladder.
 *
 * The ladder decides whether a level can be reported at all. A session can still
 * record a level for a model that no longer advertises one (retired model,
 * degraded provider, drifted config), but nothing downstream consumes it, so
 * echoing it would put `levels: []` and `effort: "high"` in the same value and
 * contradict the tool's own conclusion that there is nothing to switch. With a
 * ladder present the behaviour is unchanged: an explicit choice wins, and a
 * session that records none inherits the model default.
 * @param llm - the host llm service, used only for model info.
 * @param selection - the session's current provider/model/effort selection.
 * @returns the snapshot; the model-info failure propagates untouched.
 */
export async function readEffortSnapshot(llm: EffortLlmFace, selection: EffortSelection): Promise<EffortSnapshot> {
  const info = await llm.resolveModelInfo(selection.provider, selection.model);
  const reasoning = info.reasoning;
  const levels = reasoning?.efforts ?? [];
  const explicit = selection.reasoningEffort !== undefined;
  return {
    provider: selection.provider,
    model: selection.model,
    levels,
    defaultEffort: reasoning?.defaultEffort,
    // An inherited default is the level in effect just as much as a pinned one:
    // asking for it back must not cost a cache flush.
    currentEffort: levels.length === 0 ? undefined : explicit ? selection.reasoningEffort : reasoning?.defaultEffort,
    explicit,
  };
}

/**
 * Decide whether a request is worth a write.
 *
 * Pure on purpose: the decision is the part worth testing, and it must not be
 * able to touch the session while it is being made.
 *
 * @param snapshot - the state read before the request.
 * @param requested - the level id the caller asked for.
 * @returns `noop` when the level already matches, `change` otherwise.
 */
export function planEffortChange(snapshot: EffortSnapshot, requested: string): EffortPlan {
  return requested === snapshot.currentEffort
    ? { kind: "noop" }
    : { kind: "change", reasoningEffort: requested };
}

/** The canonical value for one snapshot, with `previous`/`effort` filled in. */
function valueOf(snapshot: EffortSnapshot, changed: boolean, previous: string | undefined): SetEffortToolValue {
  return {
    changed,
    provider: snapshot.provider,
    model: snapshot.model,
    previous: previous ?? null,
    effort: snapshot.currentEffort ?? null,
    defaultEffort: snapshot.defaultEffort ?? null,
    levels: snapshot.levels,
  };
}

/** Render the ladder as a comma-joined id list, or a dash when there is none. */
function ladderText(levels: readonly EffortLevel[]): string {
  return levels.length === 0 ? "(none)" : levels.map((level) => level.id).join(", ");
}

/** The read-only answer: what is in effect, what the default is, what exists. */
function renderRead(value: SetEffortToolValue): string {
  if (value.levels.length === 0) {
    return `${value.provider}/${value.model} does not expose reasoning effort levels, so there is nothing to switch. Nothing changed.`;
  }
  const inEffect = value.effort ?? "(none)";
  const fallback = value.defaultEffort === null ? "no default" : `model default: ${value.defaultEffort}`;
  return [
    `Reasoning effort in effect: ${inEffect} (${fallback}).`,
    `Available: ${ladderText(value.levels)}.`,
    "Nothing changed.",
  ].join(" ");
}

/** The answer for a request that asked for the level already in effect. */
function renderNoop(value: SetEffortToolValue): string {
  return [
    `Reasoning effort is already ${value.effort}.`,
    "Nothing changed and the prompt cache is untouched.",
    `Available: ${ladderText(value.levels)}.`,
  ].join(" ");
}

/** The answer for a switch: what moved, when it lands, what it cost. */
function renderChange(value: SetEffortToolValue): string {
  return [
    `Reasoning effort switched from ${value.previous ?? "(none)"} to ${value.effort}.`,
    "It applies from the next model step; earlier answers still belong to the old level.",
    "The provider's prompt cache is now invalidated, so the next request re-bills the entire context.",
    `Available: ${ladderText(value.levels)}.`,
  ].join(" ");
}

/** Read the `effort` argument, distinguishing "omitted" from "given wrongly". */
function effortArg(args: unknown): { readonly kind: "absent" } | { readonly kind: "given"; readonly id: string } {
  if (args === null || typeof args !== "object") return { kind: "absent" };
  const raw = (args as { effort?: unknown }).effort;
  if (raw === undefined || raw === null) return { kind: "absent" };
  if (typeof raw !== "string" || raw.trim() === "") {
    throw new Error("`effort` must be a level id string; omit it entirely to read the current level instead.");
  }
  return { kind: "given", id: raw.trim() };
}

/**
 * Build the tool definition.
 *
 * @param deps - the host llm service.
 * @returns a definition the host can register as-is.
 */
export function createSetEffortTool(deps: SetEffortToolDeps): SetEffortToolDefinition {
  const parameters: JsonObject = {
    type: "object",
    properties: {
      effort: {
        type: "string",
        description:
          "The level id to switch to, one of the ids this model advertises. Omit it to read the current level without changing anything.",
      },
    },
    additionalProperties: false,
  };

  return {
    name: SET_EFFORT_TOOL_NAME,
    description: DESCRIPTION,
    parameters,
    output: {
      schema: OUTPUT_SCHEMA,
      render: (args, value) => {
        const typed = value as unknown as SetEffortToolValue;
        // A noop and a read carry the same value, so the request is what tells
        // them apart: only the caller that asked for a level hears why nothing
        // moved. Read straight off the argument rather than through `effortArg`,
        // which throws on a malformed one: a renderer that can fail would turn a
        // successful call into an error while the level had already changed.
        const asked = typeof (args as { effort?: unknown } | null | undefined)?.effort === "string";
        const text = typed.changed ? renderChange(typed) : asked ? renderNoop(typed) : renderRead(typed);
        return [{ type: "text", text }];
      },
    },
    execute: async (args, exec) => {
      const model = exec.agent?.model;
      const selection = model?.current();
      if (model === undefined || selection === undefined) {
        throw new Error(
          "This session has no model selection, so its reasoning effort cannot be adjusted. Report this to the user instead of retrying.",
        );
      }

      const snapshot = await readEffortSnapshot(deps.llm, selection);
      const requested = effortArg(args);

      if (requested.kind === "absent") {
        return valueOf(snapshot, false, snapshot.currentEffort) as unknown as JsonValue;
      }

      if (snapshot.levels.length === 0) {
        throw new Error(
          `${snapshot.provider}/${snapshot.model} does not support reasoning effort levels, so there is nothing to switch.`,
        );
      }

      if (!snapshot.levels.some((level) => level.id === requested.id)) {
        throw new Error(
          `Unknown reasoning effort "${requested.id}". Available: ${ladderText(snapshot.levels)}.`,
        );
      }

      const plan = planEffortChange(snapshot, requested.id);
      if (plan.kind === "noop") {
        return valueOf(snapshot, false, snapshot.currentEffort) as unknown as JsonValue;
      }

      model.select({ provider: snapshot.provider, model: snapshot.model, reasoningEffort: plan.reasoningEffort });
      // The snapshot still describes the pre-switch state, which is exactly what
      // the value needs for `previous`; `effort` becomes the requested level.
      const after: EffortSnapshot = { ...snapshot, currentEffort: plan.reasoningEffort, explicit: true };
      return valueOf(after, true, snapshot.currentEffort) as unknown as JsonValue;
    },
  };
}
