/**
 * First-output-token detection over a persisted compact stream.
 *
 * The host defines this rule once (`isTokenDelta` in
 * `@deepseek-ai/dsh-llm/lib/types/assistant-stream.js`): a text or reasoning
 * delta counts only when non-empty, and a tool-call fragment counts when it
 * carries arguments or a name. This package re-states the rule locally instead
 * of importing the host module, so that the fold — which has to give the same
 * TTFT number as the transcript's per-message timing — owns the whole rule it
 * depends on and can be tested without a host process.
 */
import type { AssistantStream, StreamChunk } from "./event.ts";

/**
 * Whether one chunk carries the model's first output token.
 * @param chunk - one raw stream chunk.
 * @returns true for a non-empty text/reasoning fragment and for a name-bearing or non-empty tool-call fragment.
 */
export function isTokenDelta(chunk: StreamChunk): boolean {
  switch (chunk.type) {
    case "text-delta":
    case "reasoning-delta":
      return chunk.text !== "";
    case "tool-call-delta":
      return chunk.argumentsDelta !== "" || chunk.name !== undefined;
    default:
      return false;
  }
}

/**
 * Time of the first packed-run member that carries a token.
 * @param run - one packed delta run.
 * @returns the member's reconstructed time, or undefined when no member qualifies.
 */
function runFirstTokenTime(run: AssistantStream[number]): number | undefined {
  if (run.type === "chunk") return isTokenDelta(run.chunk) ? run.time : undefined;
  if (run.type === "tool-call-chunks" && run.name !== undefined) return run.time0;
  const fragments = run.type === "text-chunks" ? run.texts : run.args;
  let time = run.time0;
  for (let index = 0; index < fragments.length; index += 1) {
    if (index > 0) time += run.dt[index - 1] ?? 0;
    if (fragments[index] !== "") return time;
  }
  return undefined;
}

/**
 * Time of the first output token in one settled stream.
 * @param stream - compact records from one durable Assistant settlement.
 * @returns the first token's time, or undefined when the stream carries no token.
 */
export function firstTokenTime(stream: AssistantStream): number | undefined {
  for (const record of stream) {
    const time = runFirstTokenTime(record);
    if (time !== undefined) return time;
  }
  return undefined;
}

/**
 * Provider-reported completion tokens, guarded the way the transcript guards
 * node usage: absent, non-finite, and negative readings are all "unreported".
 * @param usage - the settlement's optional usage record.
 * @returns the output-token count, or null when unreported.
 */
export function usageOutputTokens(usage: { readonly outputTokens?: number } | undefined): number | null {
  const value = usage?.outputTokens;
  return typeof value === "number" && Number.isFinite(value) && value >= 0 ? value : null;
}
