/**
 * The compaction reading: when it speaks, what it says, and where it lands.
 *
 * Three things are worth pinning. Silence at zero, because the meter beside it is
 * silent until there is something to report and a permanent "压缩 0 次" would be
 * noise on every fresh session. The failed-attempt sentence, because a count that
 * hides failed compressions reads as a complete history when it is not. And the
 * `order` rule, because placement on the meter's right is entirely CSS: the dock
 * renders this slot's outlet before the meter, so without that declaration the
 * reading appears on the wrong side of it.
 */
import { describe, expect, it } from "vitest";

import { compactionReading, type Translate } from "../src/client/compaction-stat.tsx";
import { COMPACTION_ID, COMPACTION_ORDER, COMPACTION_SLOT } from "../src/client/compaction-registration.ts";
import { COMPACTION_CSS, COMPACTION_STAT_CLASS, installCompactionStyles } from "../src/client/compaction-styles.ts";

/** A translator over a fixed dictionary, formatted the way the host formats. */
function translator(dictionary: Record<string, string>): Translate {
  return (key, params) =>
    (dictionary[key] ?? key).replace(/\{(\w+)\}/gu, (_, name: string) => String(params?.[name] ?? `{${name}}`));
}

/** The two dictionaries this package ships, narrowed to the compaction keys. */
const ZH = translator({
  "compaction.reading": "压缩 {count} 次",
  "compaction.readingOne": "压缩 1 次",
  "compaction.tooltip": "本会话上下文已压缩 {count} 次",
  "compaction.tooltipWithFailures": "本会话上下文已压缩 {count} 次，另有 {failures} 次压缩失败",
});

const EN = translator({
  "compaction.reading": "{count} compactions",
  "compaction.readingOne": "1 compaction",
  "compaction.tooltip": "This session's context was compressed {count} time(s)",
  "compaction.tooltipWithFailures": "This session's context was compressed {count} time(s), with {failures} failed attempt(s)",
});

/** One projection value. */
function view(compactions: number, failures = 0): { compactions: number; failures: number } {
  return { compactions, failures };
}

describe("compactionReading", () => {
  it("stays silent before the projection exists", () => {
    expect(compactionReading(undefined, ZH)).toBeNull();
  });

  it("stays silent while nothing has been compressed", () => {
    expect(compactionReading(view(0), ZH)).toBeNull();
  });

  it("stays silent when every attempt failed", () => {
    // A failed attempt is a detail of the compression story, not a reading of its
    // own: with nothing landed there is no compression to count, and the row
    // would otherwise report a number that reads like landed work.
    expect(compactionReading(view(0, 3), ZH)).toBeNull();
  });

  it("reads the count in Chinese", () => {
    expect(compactionReading(view(3), ZH)).toEqual({
      text: "压缩 3 次",
      tooltip: "本会话上下文已压缩 3 次",
    });
  });

  it("reads the count in English, singular and plural", () => {
    expect(compactionReading(view(1), EN)?.text).toBe("1 compaction");
    expect(compactionReading(view(2), EN)?.text).toBe("2 compactions");
  });

  it("uses the singular form for exactly one compression in Chinese too", () => {
    // The zh dictionary carries both spellings so a locale can differ; this one
    // does not, and the assertion is that the singular key is what is read.
    expect(compactionReading(view(1), ZH)?.text).toBe("压缩 1 次");
  });

  it("names failed attempts in the hover sentence", () => {
    expect(compactionReading(view(2, 1), ZH)?.tooltip).toBe("本会话上下文已压缩 2 次，另有 1 次压缩失败");
    expect(compactionReading(view(2, 0), ZH)?.tooltip).toBe("本会话上下文已压缩 2 次");
  });

  it("stays silent when no translator is bound", () => {
    // A raw key in the dock would be worse than the meter having one neighbour
    // fewer.
    expect(compactionReading(view(2), undefined)).toBeNull();
  });
});

describe("installCompactionStyles", () => {
  /** A minimal document that records the elements appended to its head. */
  function fakeDocument(): { doc: Document; ids: string[]; texts: string[] } {
    const ids: string[] = [];
    const texts: string[] = [];
    const head = {
      append(element: { id: string; textContent: string }) {
        ids.push(element.id);
        texts.push(element.textContent);
      },
    };
    const doc = {
      head,
      getElementById: (id: string) => (ids.includes(id) ? ({} as Element) : null),
      createElement: () => {
        const element = { id: "", textContent: "" };
        return element;
      },
    } as unknown as Document;
    return { doc, ids, texts };
  }

  it("installs one sheet under a stable id", () => {
    const { doc, ids, texts } = fakeDocument();
    installCompactionStyles(doc);
    expect(ids).toEqual(["dsh-better-compaction"]);
    expect(texts[0]).toContain(COMPACTION_STAT_CLASS);
  });

  it("does not install a second copy over a live document", () => {
    const { doc, ids } = fakeDocument();
    installCompactionStyles(doc);
    installCompactionStyles(doc);
    expect(ids).toHaveLength(1);
  });

  it("does nothing without a document", () => {
    expect(() => installCompactionStyles(undefined)).not.toThrow();
  });

  it("orders the reading after the context meter but in the docked panel's band", () => {
    // The dock is a flex row whose slot outlet is `display: contents`, so this
    // declaration is the entire mechanism placing the count on the meter's right.
    // `order` takes integers, so "just after the meter, before a docked panel"
    // has to be expressed as the panel's own band (1) plus a DOM position ahead of
    // it — which is what COMPACTION_ORDER below pins.
    expect(COMPACTION_CSS).toMatch(/\.dshBetter_compactionStat\s*\{[^}]*order:\s*1;/u);
  });

  it("renders before a docked panel inside that band", () => {
    // Both the reading and a docked terminal are in flex order 1; flexbox then
    // sorts the band by DOM order, so the entry has to register ahead of the
    // terminal (which registers at the default 0) to stay beside the meter.
    expect(COMPACTION_ORDER).toBeLessThan(0);
  });

  it("replaces the spacing the terminal's zero-gap dock removes", () => {
    // While a terminal is docked the row's gap is forced to 0; without this rule
    // the reading would touch the meter's percentage.
    expect(COMPACTION_CSS).toContain('[data-composer-dock]:has([data-workbench-dock="term-dock"])');
    expect(COMPACTION_CSS).toMatch(/margin-left:\s*12px;/u);
  });

  it("registers beside the shipped dock occupants instead of replacing one", () => {
    // Reusing a published id would enter that cell and replace it: the reading
    // would silently take the activity or usage pill's place, and nothing else in
    // this file would notice.
    expect(COMPACTION_SLOT).toBe("conversation.composer.dock");
    expect(COMPACTION_ID).not.toBe("activity");
    expect(COMPACTION_ID).not.toBe("usage");
  });
});
