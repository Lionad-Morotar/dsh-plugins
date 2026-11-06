/**
 * File references: the payload's three spellings, the source that gives a chip
 * its send-time identity, the two-channel writer's state machine, and the two
 * menus that offer the row.
 *
 * The writer is exercised through an injected deps object rather than a host,
 * because the interesting behaviour is entirely in the order it tries the
 * channels and in what it does when the composer refuses. The menus are called
 * directly: they are pure functions of their input, which is the whole reason
 * they live outside React.
 */
import { describe, expect, it, vi } from "vitest";

import {
  FS_REFERENCE_SOURCE,
  createFsReferenceSource,
  fsRefClipboardText,
  fsRefModelText,
  fsReferencePayload,
  insertFsReference,
  normalizeReferencePath,
  referenceBlockReason,
  referenceLabel,
  registerFsReferenceSource,
  type FsInsertionDeps,
  type FsReferenceInsert,
  type FsReferenceSpan,
} from "../src/client/reference.ts";
import {
  MENU_ACTION,
  TAB_MENU_ACTION,
  buildContextMenu,
  buildTabMenu,
  tabReferenceBlockReason,
  type ContextMenuEntry,
  type ContextMenuRow,
} from "../src/client/context-menu.ts";
import type { PanelEntry } from "../src/client/panels.ts";

/** Identity translator: labels come back as their keys, which is what we assert. */
const t = (key: string): string => key;

function fileRow(): ContextMenuRow {
  return { type: "entry", path: "src/client/view.tsx", name: "view.tsx", kind: "file" };
}

function directoryRow(): ContextMenuRow {
  return { type: "entry", path: "src/client", name: "client", kind: "directory" };
}

function panel(path: string, extra: Partial<PanelEntry> = {}): PanelEntry {
  return { key: path, path, line: 1, absolute: false, ...extra };
}

/** The reference row of a built menu. */
function referenceEntry(entries: readonly ContextMenuEntry[]): ContextMenuEntry | undefined {
  return entries.find(candidate => candidate.id === MENU_ACTION.reference);
}

describe("normalizeReferencePath", () => {
  it("reduces every spelling to the tree's own vocabulary", () => {
    expect(normalizeReferencePath("src/client/view.tsx")).toBe("src/client/view.tsx");
    expect(normalizeReferencePath("/src/client/view.tsx")).toBe("src/client/view.tsx");
    expect(normalizeReferencePath("./src/client/view.tsx")).toBe("src/client/view.tsx");
    expect(normalizeReferencePath("src/client/")).toBe("src/client");
    expect(normalizeReferencePath("src\\client\\view.tsx")).toBe("src/client/view.tsx");
    expect(normalizeReferencePath("  src/a.ts  ")).toBe("src/a.ts");
    expect(normalizeReferencePath("/")).toBe("");
    expect(normalizeReferencePath("")).toBe("");
  });
});

describe("referenceLabel", () => {
  it("takes the last segment", () => {
    expect(referenceLabel("src/client/view.tsx")).toBe("view.tsx");
    expect(referenceLabel("src/client")).toBe("client");
    expect(referenceLabel("README.md")).toBe("README.md");
    expect(referenceLabel("")).toBe("");
  });
});

describe("fsReferencePayload", () => {
  it("spells a file as @path in both the draft and the model text", () => {
    const payload = fsReferencePayload("src/client/view.tsx", "view.tsx", "file");
    expect(payload.kind).toBe("fs.file");
    expect(payload.path).toBe("src/client/view.tsx");
    expect(payload.label).toBe("view.tsx");
    expect(payload.clipboardText).toBe("@src/client/view.tsx");
    expect(payload.modelText).toBe("@src/client/view.tsx");
  });

  it("keeps the trailing slash that marks a directory", () => {
    const payload = fsReferencePayload("src/client", "client", "directory");
    expect(payload.kind).toBe("fs.directory");
    expect(payload.path).toBe("src/client");
    expect(payload.clipboardText).toBe("@src/client/");
    expect(payload.modelText).toBe("@src/client/");
  });

  it("normalises the path it was handed", () => {
    const payload = fsReferencePayload("/src\\client/view.tsx", "view.tsx", "file");
    expect(payload.path).toBe("src/client/view.tsx");
    expect(payload.clipboardText).toBe("@src/client/view.tsx");
  });

  it("falls back to the path's own last segment when no name is given", () => {
    expect(fsReferencePayload("src/client/view.tsx", "  ", "file").label).toBe("view.tsx");
  });

  it("never starts with a character the host parses as a command or a session", () => {
    const payload = fsReferencePayload("src/a.ts", "a.ts", "file");
    expect(payload.clipboardText.startsWith("/")).toBe(false);
    expect(payload.clipboardText.startsWith("dsh-session:")).toBe(false);
    // `@` is deliberate: that is the host's own file-reference spelling.
    expect(payload.clipboardText.startsWith("@")).toBe(true);
  });

  it("carries the same facts in the chip ref as in the text", () => {
    const payload = fsReferencePayload("src/client", "client", "directory");
    expect(fsRefModelText(payload.ref)).toBe(payload.modelText);
    expect(fsRefClipboardText(payload.ref)).toBe(payload.clipboardText);
  });

  it("falls back to the raw ref instead of throwing on a malformed chip", () => {
    expect(fsRefModelText("{not json")).toBe("@{not json");
    expect(fsRefClipboardText("{not json")).toBe("@{not json");
    expect(fsRefModelText("null")).toBe("@null");
    expect(fsRefModelText(JSON.stringify({ label: "no path" }))).toBe(
      `@${JSON.stringify({ label: "no path" })}`,
    );
  });
});

describe("insertFsReference", () => {
  const span = (draftRev: number): FsReferenceSpan => ({ start: 0, end: 0, draftRev });

  /**
   * A deps object whose channels answer from a script, so each test states only
   * the sequence it cares about while every call is still recorded.
   */
  function deps(
    script: {
      readonly spans?: readonly (FsReferenceSpan | undefined)[];
      readonly reference?: readonly boolean[];
      readonly text?: readonly boolean[];
    } = {},
  ): FsInsertionDeps & { readonly inserts: FsReferenceInsert[]; readonly texts: string[] } {
    const inserts: FsReferenceInsert[] = [];
    const texts: string[] = [];
    const spans = script.spans ?? [span(1)];
    const reference = script.reference ?? [true];
    const text = script.text ?? [true];
    let spanCall = 0;
    let referenceCall = 0;
    let textCall = 0;
    return {
      inserts,
      texts,
      captureSpan: () => spans[Math.min(spanCall++, spans.length - 1)],
      insertReference: (insert, _at) => {
        inserts.push(insert);
        return reference[Math.min(referenceCall++, reference.length - 1)] ?? false;
      },
      insertText: (value) => {
        texts.push(value);
        return text[Math.min(textCall++, text.length - 1)] ?? false;
      },
    };
  }

  it("writes the chip and stops there when the first attempt lands", () => {
    const d = deps();
    expect(insertFsReference(d, fsReferencePayload("src/a.ts", "a.ts", "file"))).toBe("reference");
    expect(d.inserts).toHaveLength(1);
    expect(d.texts).toHaveLength(0);
    expect(d.inserts[0]?.source).toBe(FS_REFERENCE_SOURCE);
    expect(d.inserts[0]?.appearance).toBe("file");
  });

  it("marks a directory chip as a folder", () => {
    const d = deps();
    insertFsReference(d, fsReferencePayload("src/client", "client", "directory"));
    expect(d.inserts[0]?.appearance).toBe("folder");
    expect(d.inserts[0]?.clipboardText).toBe("@src/client/");
  });

  it("retries once with a fresh span when the revision went stale", () => {
    const d = deps({ spans: [span(1), span(2)], reference: [false, true] });
    expect(insertFsReference(d, fsReferencePayload("src/a.ts", "a.ts", "file"))).toBe("reference");
    expect(d.inserts).toHaveLength(2);
    expect(d.texts).toHaveLength(0);
  });

  it("degrades to plain text when the chip path refuses twice", () => {
    const d = deps({ reference: [false] });
    expect(insertFsReference(d, fsReferencePayload("src/a.ts", "a.ts", "file"))).toBe("text");
    expect(d.inserts).toHaveLength(2);
    expect(d.texts).toEqual(["@src/a.ts"]);
  });

  it("reports failure when neither channel accepts the write", () => {
    const d = deps({ reference: [false], text: [false] });
    expect(insertFsReference(d, fsReferencePayload("src/a.ts", "a.ts", "file"))).toBe("failed");
  });

  it("goes straight to plain text when the chip path has no span", () => {
    const d = deps({ spans: [undefined, span(1)] });
    expect(insertFsReference(d, fsReferencePayload("src/a.ts", "a.ts", "file"))).toBe("text");
    expect(d.inserts).toHaveLength(0);
    expect(d.texts).toEqual(["@src/a.ts"]);
  });

  it("reports failure when no span is available for the fallback either", () => {
    const d = deps({ spans: [undefined] });
    expect(insertFsReference(d, fsReferencePayload("src/a.ts", "a.ts", "file"))).toBe("failed");
    expect(d.inserts).toHaveLength(0);
    expect(d.texts).toHaveLength(0);
  });
});

describe("referenceBlockReason", () => {
  it("lets the row run when a session and the facade are both there", () => {
    expect(referenceBlockReason({ session: true, insertReference: true })).toBeUndefined();
  });

  it("names the missing fact", () => {
    expect(referenceBlockReason(undefined)).toBe("noSession");
    expect(referenceBlockReason({ session: false, insertReference: true })).toBe("noSession");
    expect(referenceBlockReason({ session: true, insertReference: false })).toBe("noReference");
  });
});

describe("tabReferenceBlockReason", () => {
  it("refuses the two tab kinds that are not workspace paths", () => {
    expect(tabReferenceBlockReason(panel("src/a.ts"))).toBeUndefined();
    expect(tabReferenceBlockReason(panel("/etc/hosts", { absolute: true }))).toBe("absolute");
    expect(tabReferenceBlockReason(panel("src/a.ts", { revision: "abc1234" }))).toBe("revision");
  });

  it("prefers the revision when a tab is both", () => {
    expect(tabReferenceBlockReason(panel("/etc/hosts", { absolute: true, revision: "abc1234" }))).toBe(
      "revision",
    );
  });
});

describe("createFsReferenceSource", () => {
  it("declares an identity-only source on the @ trigger", async () => {
    const source = createFsReferenceSource();
    expect(source.trigger).toBe("@");
    expect(source.name).toBe("lionad.fs");
    expect(source.showGroupTitle).toBe(false);
    await expect(source.candidates()).resolves.toEqual([]);
    expect(source.onPick()).toBeUndefined();
  });

  it("serializes a valid ref into the model text", async () => {
    const source = createFsReferenceSource();
    const payload = fsReferencePayload("src/client", "client", "directory");
    await expect(source.codec.serialize(payload.ref, new AbortController().signal)).resolves.toBe(
      "@src/client/",
    );
    expect(source.codec.clipboardText(payload.ref)).toBe("@src/client/");
  });

  it("serializes a malformed ref into a readable fallback without throwing", async () => {
    const source = createFsReferenceSource();
    await expect(source.codec.serialize("not-json", new AbortController().signal)).resolves.toBe(
      "@not-json",
    );
  });
});

describe("registerFsReferenceSource", () => {
  it("registers through the scoped injection when the service is injected", () => {
    const registerSource = vi.fn((_source: unknown) => () => {});
    const ctx = {
      inject: <T,>(_names: string[], apply: (scope: T) => void): unknown => {
        apply({ inputTriggers: { registerSource }, effect: (fn: () => () => void) => fn() } as T);
        return undefined;
      },
    };
    const dispose = registerFsReferenceSource(ctx);
    expect(registerSource).toHaveBeenCalledTimes(1);
    expect(registerSource.mock.calls[0]?.[0]).toMatchObject({ name: "lionad.fs", trigger: "@" });
    dispose();
  });

  it("falls back to the resolver when injection is absent", () => {
    const registerSource = vi.fn((_source: unknown) => () => {});
    const ctx = { get: (name: string) => (name === "inputTriggers" ? { registerSource } : undefined) };
    registerFsReferenceSource(ctx);
    expect(registerSource).toHaveBeenCalledTimes(1);
  });

  it("stays inert on a host with neither probe", () => {
    expect(() => registerFsReferenceSource({})).not.toThrow();
    expect(() =>
      registerFsReferenceSource({
        get: () => {
          throw new Error("unknown service");
        },
      }),
    ).not.toThrow();
  });

  it("does not register twice when both probes are available", () => {
    const registerSource = vi.fn((_source: unknown) => () => {});
    const ctx = {
      inject: <T,>(_names: string[], apply: (scope: T) => void): unknown => {
        apply({ inputTriggers: { registerSource }, effect: (fn: () => () => void) => fn() } as T);
        return undefined;
      },
      get: () => ({ registerSource }),
    };
    registerFsReferenceSource(ctx);
    expect(registerSource).toHaveBeenCalledTimes(1);
  });
});

describe("buildContextMenu reference row", () => {
  function menu(row: ContextMenuRow | undefined, inputTarget?: { session: boolean; insertReference: boolean }) {
    return buildContextMenu(
      {
        row,
        notices: { workspace: true },
        capabilities: { fileManager: "finder", canReveal: true },
        absolutePath: "/workspace/src/a.ts",
        createParent: "src",
        remoteLinks: undefined,
        bookmarkTarget: undefined,
        ...(inputTarget === undefined ? {} : { inputTarget }),
      },
      t,
    );
  }

  it("offers an enabled row for a file and for a directory", () => {
    for (const row of [fileRow(), directoryRow()]) {
      const entry = referenceEntry(menu(row, { session: true, insertReference: true }));
      expect(entry?.label).toBe("menu.reference");
      expect(entry?.disabled).toBeUndefined();
      expect(entry?.reason).toBeUndefined();
    }
  });

  it("sits after the copy rows and before the bookmark row", () => {
    const ids = menu(fileRow(), { session: true, insertReference: true }).map(entry => entry.id);
    expect(ids.indexOf(MENU_ACTION.reference)).toBeGreaterThan(ids.indexOf(MENU_ACTION.copyRemote));
    expect(ids.indexOf(MENU_ACTION.reference)).toBeLessThan(ids.indexOf(MENU_ACTION.addBookmark));
  });

  it("is disabled with a reason when the view could not read the composer", () => {
    const entry = referenceEntry(menu(fileRow()));
    expect(entry?.disabled).toBe(true);
    expect(entry?.reason).toBe("menu.reference.reason.noSession");
  });

  it("is disabled with its own reason when the facade has no insertReference", () => {
    const entry = referenceEntry(menu(fileRow(), { session: true, insertReference: false }));
    expect(entry?.disabled).toBe(true);
    expect(entry?.reason).toBe("menu.reference.reason.noReference");
  });

  it("does not appear on the tree's blank area", () => {
    expect(referenceEntry(menu(undefined, { session: true, insertReference: true }))).toBeUndefined();
  });
});

describe("buildTabMenu reference row", () => {
  function menu(panels: readonly PanelEntry[], key: string, inputTarget?: { session: boolean; insertReference: boolean }) {
    return buildTabMenu(
      { panels, key, ...(inputTarget === undefined ? {} : { inputTarget }) },
      t,
    );
  }

  it("offers an enabled row for a workspace tab", () => {
    const entry = menu([panel("src/a.ts")], "src/a.ts", { session: true, insertReference: true }).find(
      row => row.id === TAB_MENU_ACTION.reference,
    );
    expect(entry?.disabled).toBeUndefined();
  });

  it("disables an absolute tab with its own reason", () => {
    const entry = menu([panel("/etc/hosts", { absolute: true })], "/etc/hosts", {
      session: true,
      insertReference: true,
    }).find(row => row.id === TAB_MENU_ACTION.reference);
    expect(entry?.disabled).toBe(true);
    expect(entry?.reason).toBe("menu.reference.reason.absolute");
  });

  it("disables a commit-version tab with its own reason", () => {
    const entry = menu([panel("src/a.ts", { revision: "abc1234" })], "src/a.ts", {
      session: true,
      insertReference: true,
    }).find(row => row.id === TAB_MENU_ACTION.reference);
    expect(entry?.disabled).toBe(true);
    expect(entry?.reason).toBe("menu.reference.reason.revision");
  });

  it("disables the row when there is no composer to write into", () => {
    const entry = menu([panel("src/a.ts")], "src/a.ts").find(row => row.id === TAB_MENU_ACTION.reference);
    expect(entry?.disabled).toBe(true);
    expect(entry?.reason).toBe("menu.reference.reason.noSession");
  });

  it("still offers nothing at all for a tab the strip no longer holds", () => {
    expect(menu([panel("src/a.ts")], "src/gone.ts", { session: true, insertReference: true })).toEqual([]);
  });
});
