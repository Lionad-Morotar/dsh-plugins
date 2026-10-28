/**
 * The dialog's copy, one dictionary per language.
 *
 * Kept as data rather than inline strings so the labels and the formatter's
 * templates cannot drift apart, and so a test can assert a label without
 * reaching into the component.
 */
import type { Translate } from "./format.ts";

/** One language's dictionary: typed keys for the compiler, open for the locale service. */
export interface Dictionary {
  readonly [key: string]: string;
  readonly "stats.counts": string;
  readonly "stats.title": string;
  readonly "stats.llmTime": string;
  readonly "stats.retryTime": string;
  readonly "stats.toolTime": string;
  readonly "stats.ttft": string;
  readonly "stats.speed": string;
  readonly "duration.seconds": string;
  readonly "duration.minutes": string;
  readonly "speed.tps": string;
}

/** Simplified Chinese copy; mirrors the shipped chat dictionary word for word. */
export const ZH: Dictionary = {
  "stats.counts": "{turns} 轮 {steps} 步",
  "stats.title": "会话统计",
  "stats.llmTime": "模型用时",
  "stats.retryTime": "重试用时",
  "stats.toolTime": "工具调用用时",
  "stats.ttft": "首 token 平均（TTFT）",
  "stats.speed": "输出速度（TPS）",
  "duration.seconds": "{seconds}秒",
  "duration.minutes": "{minutes}分{seconds}秒",
  "speed.tps": "{tps} tok/s",
};

/** English copy with the same key set. */
export const EN: Dictionary = {
  "stats.counts": "{turns} turns · {steps} steps",
  "stats.title": "Session statistics",
  "stats.llmTime": "Model time",
  "stats.retryTime": "Retry wait",
  "stats.toolTime": "Tool time",
  "stats.ttft": "Average TTFT",
  "stats.speed": "Output speed (TPS)",
  "duration.seconds": "{seconds}s",
  "duration.minutes": "{minutes}m{seconds}s",
  "speed.tps": "{tps} tok/s",
};

/** The translate seat narrowed to this namespace's own key set. */
export type StatsTranslate = Translate;