/**
 * The four editable language blocks.
 *
 * The edit surface is one bundle that holds ten grammars statically, which is
 * why the other 44 languages were monochrome here. Putting them into that bundle
 * would push a Markdown first-open from about 214 KB to about 400 KB, so each
 * batch gets its own chunk that carries CodeMirror plus that batch's grammars.
 *
 * These assertions pin the two things a block can get wrong without any error:
 * its `ids` drifting from the catalogue, and its grammar table missing an id the
 * catalogue says it draws.
 */
import { describe, expect, it } from "vitest";

import { LANGUAGE_CHUNK_LANGUAGES } from "dsh-text-languages/index.ts";

import { EDITABLE_LANG_CHUNKS } from "../src/shared.ts";

/** The four batch blocks, which are the ones the edit surface ships chunks for. */
const BLOCKS = ["batch-systems", "batch-script", "batch-webstyle", "batch-datadoc"] as const;

/** Load one block entry by name. */
async function entryOf(block: string): Promise<{
  readonly renderer: string;
  readonly ids: readonly string[];
  readonly grammars: Readonly<Record<string, () => unknown>>;
}> {
  return (await import(`../src/client/chunk/editor-langs-${block}.tsx`)) as never;
}

describe("editable language chunks", () => {
  it("names one artifact per batch block", () => {
    expect(Object.keys(EDITABLE_LANG_CHUNKS).sort()).toEqual([...BLOCKS].sort());
    for (const block of BLOCKS) {
      expect(EDITABLE_LANG_CHUNKS[block]).toBe(`client.editor-langs-${block}.js`);
    }
  });

  it("covers exactly the catalogue's batch blocks", () => {
    const batchBlocks = Object.keys(LANGUAGE_CHUNK_LANGUAGES).filter(name => name.startsWith("batch-"));
    expect([...BLOCKS].sort()).toEqual(batchBlocks.sort());
  });

  for (const block of BLOCKS) {
    it(`${block} declares its own marker`, async () => {
      const entry = await entryOf(block);
      expect(entry.renderer).toBe(block);
    });

    it(`${block} lists the catalogue's ids in order`, async () => {
      const entry = await entryOf(block);
      expect(entry.ids).toEqual(LANGUAGE_CHUNK_LANGUAGES[block]);
    });

    it(`${block} has a grammar factory for every id it lists`, async () => {
      const entry = await entryOf(block);
      // The table is exported for exactly this check: a copy of the id list in a
      // test would drift from the block the same way the block could drift from
      // the catalogue.
      expect(Object.keys(entry.grammars).sort()).toEqual([...entry.ids].sort());
    });
  }
});
