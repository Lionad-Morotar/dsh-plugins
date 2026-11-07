/**
 * Element references: the payload's spellings, the source that gives a chip its
 * send-time identity, the two-channel writer's state machine, and the action
 * bar's third button.
 *
 * The writer is exercised through an injected deps object rather than a host,
 * because the interesting behaviour is entirely in the order it tries the
 * channels and in what it does when the composer refuses.
 */
// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from "vitest";

import { createInsertReference } from "../src/client/entry.ts";

import {
  ARCH_REFERENCE_SOURCE,
  archRefClipboardText,
  archRefModelText,
  archReferenceFromModel,
  archReferencePayload,
  archReferenceSeam,
  createArchReferenceSource,
  insertArchReference,
  openArchReference,
  registerArchReferenceSource,
  type ArchInsertionDeps,
  type ArchReferenceInsert,
  type ArchReferenceSeam,
  type ArchReferenceSpan,
} from "../src/client/reference.ts";
import { clearArchFocus, takeArchFocus } from "../src/client/focus-store.ts";

const ID = "dshPlugins.jump.jumpApp";
const FACTS = { title: "client/app", kind: "component", technology: "jump" };
const SOURCE = { file: ".planning/c4/dsh-plugins.c4", line: 93 };
const CODE = { file: "packages/dsh-jump/src/client/app.ts" };

describe("archReferencePayload", () => {
  it("spells the full reference with both locations", () => {
    const payload = archReferencePayload(ID, FACTS, SOURCE, CODE);
    expect(payload.kind).toBe("arch.element");
    expect(payload.id).toBe(ID);
    expect(payload.label).toBe("client/app");
    expect(payload.clipboardText).toBe(`[arch element ${ID}]`);
    expect(payload.modelText).toBe(
      `[arch element ${ID}] client/app · component · jump · def .planning/c4/dsh-plugins.c4:93 · code packages/dsh-jump/src/client/app.ts`,
    );
  });

  it("drops the code segment when no file resolved", () => {
    const payload = archReferencePayload(ID, FACTS, SOURCE);
    expect(payload.modelText).toBe(
      `[arch element ${ID}] client/app · component · jump · def .planning/c4/dsh-plugins.c4:93`,
    );
    expect(payload.modelText).not.toContain("code ");
    expect(payload.code).toBeUndefined();
  });

  it("drops the def segment when the model reported no source", () => {
    const payload = archReferencePayload(ID, FACTS, undefined, CODE);
    expect(payload.modelText).toBe(
      `[arch element ${ID}] client/app · component · jump · code packages/dsh-jump/src/client/app.ts`,
    );
    expect(payload.modelText).not.toContain("def ");
    expect(payload.c4).toBeUndefined();
  });

  it("degrades to the bare id when the element has no title", () => {
    const payload = archReferencePayload(ID, undefined);
    expect(payload.label).toBe(ID);
    expect(payload.modelText).toBe(`[arch element ${ID}]`);
    expect(payload.modelText).not.toContain(" · ");
  });

  it("keeps the kind when there is no technology", () => {
    const payload = archReferencePayload(ID, { title: "client/app", kind: "component" });
    expect(payload.modelText).toBe(`[arch element ${ID}] client/app · component`);
  });

  it("flattens a title that carries newlines", () => {
    const payload = archReferencePayload(ID, { title: "client/\napp", kind: "component" });
    expect(payload.modelText).not.toContain("\n");
    expect(payload.label).not.toContain("\n");
    expect(payload.label).toBe("client/ app");
  });

  it("never starts the draft text with a character the host parses", () => {
    const payload = archReferencePayload(ID, FACTS, SOURCE, CODE);
    expect(payload.clipboardText.startsWith("/")).toBe(false);
    expect(payload.clipboardText.startsWith("@")).toBe(false);
    expect(payload.clipboardText.startsWith("[arch element ")).toBe(true);
    expect(payload.modelText.startsWith("/")).toBe(false);
    expect(payload.modelText.startsWith("@")).toBe(false);
    expect(payload.modelText.startsWith("dsh-session:")).toBe(false);
  });

  it("carries the same facts in the chip ref as in the model text", () => {
    const payload = archReferencePayload(ID, FACTS, SOURCE, CODE);
    expect(archRefModelText(payload.ref)).toBe(payload.modelText);
    expect(archRefClipboardText(payload.ref)).toBe(payload.clipboardText);
  });

  it("falls back to the raw ref instead of throwing on a malformed chip", () => {
    expect(archRefModelText("{not json")).toBe("[arch element {not json]");
    expect(archRefClipboardText("{not json")).toBe("[arch element {not json]");
    expect(archRefModelText("null")).toBe("[arch element null]");
    expect(archRefModelText(JSON.stringify({ title: "no id" }))).toBe(
      `[arch element ${JSON.stringify({ title: "no id" })}]`,
    );
  });
});

describe("archReferenceFromModel", () => {
  it("reads the element and both maps out of one model response", () => {
    const payload = archReferenceFromModel(
      { elements: { [ID]: FACTS }, elementSources: { [ID]: SOURCE }, elementCode: { [ID]: CODE } },
      ID,
    );
    expect(payload?.c4).toEqual(SOURCE);
    expect(payload?.code).toEqual(CODE);
    expect(payload?.modelText).toContain("def .planning/c4/dsh-plugins.c4:93");
  });

  it("answers undefined for an element the model does not have", () => {
    expect(archReferenceFromModel({ elements: {} }, ID)).toBeUndefined();
    expect(archReferenceFromModel({}, ID)).toBeUndefined();
  });

  it("tolerates a host that reports neither map", () => {
    const payload = archReferenceFromModel({ elements: { [ID]: FACTS } }, ID);
    expect(payload?.modelText).toBe(`[arch element ${ID}] client/app · component · jump`);
  });
});

describe("insertArchReference", () => {
  const span = (draftRev: number): ArchReferenceSpan => ({ start: 0, end: 0, draftRev });
  const payload = archReferencePayload(ID, FACTS, SOURCE, CODE);

  function deps(
    script: {
      readonly spans?: readonly (ArchReferenceSpan | undefined)[];
      readonly reference?: readonly boolean[];
      readonly text?: readonly boolean[];
      readonly canInsertReference?: boolean;
    } = {},
  ): ArchInsertionDeps & { readonly inserts: ArchReferenceInsert[]; readonly texts: string[] } {
    const inserts: ArchReferenceInsert[] = [];
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
      canInsertReference: script.canInsertReference ?? true,
    };
  }

  it("writes the chip and stops there when the first attempt lands", () => {
    const d = deps();
    expect(insertArchReference(d, payload)).toBe("reference");
    expect(d.inserts).toHaveLength(1);
    expect(d.texts).toHaveLength(0);
    expect(d.inserts[0]?.source).toBe(ARCH_REFERENCE_SOURCE);
    expect(d.inserts[0]?.appearance).toBe("session");
  });

  it("retries once with a fresh span when the revision went stale", () => {
    const d = deps({ spans: [span(1), span(2)], reference: [false, true] });
    expect(insertArchReference(d, payload)).toBe("reference");
    expect(d.inserts).toHaveLength(2);
    expect(d.texts).toHaveLength(0);
  });

  it("never builds a chip when the source is not registered", () => {
    const d = deps({ canInsertReference: false });
    expect(insertArchReference(d, payload)).toBe("text");
    expect(d.inserts).toHaveLength(0);
    expect(d.texts).toEqual([`[arch element ${ID}]`]);
  });

  it("degrades to plain text when the chip path refuses twice", () => {
    const d = deps({ reference: [false] });
    expect(insertArchReference(d, payload)).toBe("text");
    expect(d.inserts).toHaveLength(2);
    expect(d.texts).toEqual([`[arch element ${ID}]`]);
  });

  it("reports failure when neither channel accepts the write", () => {
    const d = deps({ reference: [false], text: [false] });
    expect(insertArchReference(d, payload)).toBe("failed");
  });

  it("goes straight to plain text when the chip path has no span", () => {
    const d = deps({ spans: [undefined, span(1)] });
    expect(insertArchReference(d, payload)).toBe("text");
    expect(d.inserts).toHaveLength(0);
    expect(d.texts).toEqual([`[arch element ${ID}]`]);
  });

  it("reports failure when no span is available for the fallback either", () => {
    const d = deps({ spans: [undefined] });
    expect(insertArchReference(d, payload)).toBe("failed");
    expect(d.texts).toHaveLength(0);
  });
});

describe("createInsertReference", () => {
  function ctxWith(facade: unknown) {
    return {
      get: (name: string) => {
        if (name === "sessions") return { scope: () => ({ id: "actx" }) };
        if (name === "conversation") return { input: { for: () => facade } };
        return undefined;
      },
    } as never;
  }

  const actions = {
    captureInsertion: () => ({ start: 0, end: 0, draftRev: 1 }),
    insertText: vi.fn(() => true),
  };

  it("falls back to plain text when the facade has no insertReference", () => {
    // A facade without `insertReference` is a real host shape. The old wrapper
    // exposed the method anyway, so the write threw a TypeError and the
    // plain-text fallback was unreachable.
    const insert = createInsertReference(ctxWith({ focus: vi.fn() }));
    const payload = archReferencePayload(ID, FACTS, SOURCE, CODE);
    expect(insert("s1", payload, actions, true)).toBe("text");
    expect(actions.insertText).toHaveBeenCalled();
  });

  it("never builds a chip when the source is not registered", () => {
    const insertReference = vi.fn(() => true);
    const insert = createInsertReference(ctxWith({ insertReference, focus: vi.fn() }));
    const payload = archReferencePayload(ID, FACTS, SOURCE, CODE);
    expect(insert("s1", payload, actions, false)).toBe("text");
    expect(insertReference).not.toHaveBeenCalled();
  });
});

describe("createArchReferenceSource", () => {
  it("declares an identity-only source on the @ trigger", async () => {
    const source = createArchReferenceSource();
    expect(source.trigger).toBe("@");
    expect(source.name).toBe("lionad.arch");
    expect(source.showGroupTitle).toBe(false);
    await expect(source.candidates()).resolves.toEqual([]);
    expect(source.onPick()).toBeUndefined();
  });

  it("serializes a valid ref into the model text", async () => {
    const source = createArchReferenceSource();
    const payload = archReferencePayload(ID, FACTS, SOURCE, CODE);
    await expect(source.codec.serialize(payload.ref, new AbortController().signal)).resolves.toBe(
      payload.modelText,
    );
  });

  it("serializes a malformed ref into a readable fallback without throwing", async () => {
    const source = createArchReferenceSource();
    await expect(source.codec.serialize("not-json", new AbortController().signal)).resolves.toBe(
      "[arch element not-json]",
    );
  });
});

describe("registerArchReferenceSource", () => {
  it("registers through the scoped injection when the service is injected", () => {
    const registerSource = vi.fn((_source: unknown) => () => {});
    const ctx = {
      inject: <T,>(_names: string[], apply: (scope: T) => void): unknown => {
        apply({ inputTriggers: { registerSource }, effect: (fn: () => () => void) => fn() } as T);
        return undefined;
      },
    };
    const handle = registerArchReferenceSource(ctx);
    expect(registerSource).toHaveBeenCalledTimes(1);
    expect(registerSource.mock.calls[0]?.[0]).toMatchObject({ name: "lionad.arch", trigger: "@" });
    // The handle reports the live registration, which is what the view reads
    // when it decides whether to draw the button.
    expect(handle.available).toBe(true);
    handle.dispose();
    expect(handle.available).toBe(false);
  });

  it("falls back to the resolver when injection is absent", () => {
    const registerSource = vi.fn((_source: unknown) => () => {});
    const ctx = { get: (name: string) => (name === "inputTriggers" ? { registerSource } : undefined) };
    registerArchReferenceSource(ctx);
    expect(registerSource).toHaveBeenCalledTimes(1);
  });

  it("stays inert on a host with neither probe", () => {
    expect(() => registerArchReferenceSource({})).not.toThrow();
    expect(() =>
      registerArchReferenceSource({
        get: () => {
          throw new Error("unknown service");
        },
      }),
    ).not.toThrow();
  });
});

/** A seam that records what the click drove. */
function fakeSeam(overrides: Partial<ArchReferenceSeam> = {}) {
  const calls: string[] = [];
  const clickTab = vi.fn(() => {
    calls.push("clickTab");
    return true;
  });
  const seam: ArchReferenceSeam = {
    currentSessionId: () => "s1",
    activeTab: () => false,
    clickTab,
    ...overrides,
  };
  return { seam, calls, clickTab };
}

describe("openArchReference", () => {
  beforeEach(() => {
    clearArchFocus();
  });

  it("files the element and presses the tab when the panel is not up", () => {
    const { seam, clickTab } = fakeSeam();
    const ref = archReferencePayload(ID, FACTS, SOURCE, CODE).ref;
    expect(openArchReference(seam, "s1", ref)).toBe(true);
    expect(clickTab).toHaveBeenCalledTimes(1);
    // The request must be waiting before the tab is pressed: the view mounts on
    // selection and takes whatever is already there.
    expect(takeArchFocus()).toBe(ID);
  });

  it("does not press the tab when the panel is already on screen", () => {
    const { seam, clickTab } = fakeSeam({ activeTab: () => true });
    const ref = archReferencePayload(ID, FACTS, SOURCE, CODE).ref;
    expect(openArchReference(seam, "s1", ref)).toBe(true);
    expect(clickTab).not.toHaveBeenCalled();
    expect(takeArchFocus()).toBe(ID);
  });

  it("refuses a chip from another session without filing anything", () => {
    const { seam, clickTab } = fakeSeam();
    const ref = archReferencePayload(ID, FACTS, SOURCE, CODE).ref;
    expect(openArchReference(seam, "s2", ref)).toBe(false);
    expect(clickTab).not.toHaveBeenCalled();
    expect(takeArchFocus()).toBeUndefined();
  });

  it("refuses a malformed ref", () => {
    const { seam, clickTab } = fakeSeam();
    expect(openArchReference(seam, "s1", "not-json")).toBe(false);
    expect(openArchReference(seam, "s1", JSON.stringify({ id: "" }))).toBe(false);
    expect(openArchReference(seam, "s1", JSON.stringify({ id: "   " }))).toBe(false);
    expect(clickTab).not.toHaveBeenCalled();
    expect(takeArchFocus()).toBeUndefined();
  });

  it("drops the request when the host's row has no arch tab", () => {
    const { seam } = fakeSeam({ clickTab: () => false });
    const ref = archReferencePayload(ID, FACTS, SOURCE, CODE).ref;
    expect(openArchReference(seam, "s1", ref)).toBe(false);
    // A request left behind would move the diagram on the next unrelated mount.
    expect(takeArchFocus()).toBeUndefined();
  });

  it("stays inert on a host with no tab row at all", () => {
    const ref = archReferencePayload(ID, FACTS, SOURCE, CODE).ref;
    expect(openArchReference({}, "s1", ref)).toBe(false);
    expect(takeArchFocus()).toBeUndefined();
  });
});

describe("archReferenceSeam", () => {
  /** A tab row shaped like the host's: a container of `role="tab"` buttons. */
  function tabRow(titles: readonly string[], selected?: string): { doc: Document; clicks: string[] } {
    const doc = document.implementation.createHTMLDocument("tabs");
    const row = doc.createElement("div");
    row.setAttribute("data-conversation-tabs", "");
    const clicks: string[] = [];
    for (const title of titles) {
      const tab = doc.createElement("button");
      tab.setAttribute("role", "tab");
      tab.setAttribute("aria-selected", title === selected ? "true" : "false");
      tab.textContent = title;
      tab.addEventListener("click", () => clicks.push(title));
      row.append(tab);
    }
    doc.body.append(row);
    return { doc, clicks };
  }

  it("finds the arch tab by its exact label and presses it", () => {
    const { doc, clicks } = tabRow(["聊天", "文件", "架构"]);
    const seam = archReferenceSeam(doc, ["架构", "Arch"]);
    expect(seam.activeTab?.()).toBe(false);
    expect(seam.clickTab?.()).toBe(true);
    expect(clicks).toEqual(["架构"]);
  });

  it("reads the selected state off the tab", () => {
    const { doc } = tabRow(["聊天", "架构"], "架构");
    expect(archReferenceSeam(doc, ["架构", "Arch"]).activeTab?.()).toBe(true);
  });

  it("accepts the English label too", () => {
    const { doc, clicks } = tabRow(["Chat", "Arch"]);
    const seam = archReferenceSeam(doc, ["架构", "Arch"]);
    expect(seam.clickTab?.()).toBe(true);
    expect(clicks).toEqual(["Arch"]);
  });

  it("never matches a tab that merely contains the label", () => {
    const { doc, clicks } = tabRow(["架构图预览", "聊天"]);
    const seam = archReferenceSeam(doc, ["架构", "Arch"]);
    expect(seam.clickTab?.()).toBe(false);
    expect(clicks).toEqual([]);
  });

  it("answers nothing without a document or a row", () => {
    expect(archReferenceSeam(undefined, ["架构"]).clickTab).toBeUndefined();
    const doc = document.implementation.createHTMLDocument("no-row");
    expect(archReferenceSeam(doc, ["架构"]).clickTab?.()).toBe(false);
  });
});

describe("createArchReferenceSource openReference", () => {
  beforeEach(() => {
    clearArchFocus();
  });

  it("drives the seam the source resolved at click time", () => {
    const { seam, clickTab } = fakeSeam();
    const source = createArchReferenceSource(() => seam);
    const ref = archReferencePayload(ID, FACTS, SOURCE, CODE).ref;
    expect(source.openReference({ id: "s1" }, { ref, appearance: "session" })).toBe(true);
    expect(clickTab).toHaveBeenCalledTimes(1);
    expect(takeArchFocus()).toBe(ID);
  });

  it("addresses the session on screen when the host's session carries no id", () => {
    const { seam, clickTab } = fakeSeam();
    const source = createArchReferenceSource(() => seam);
    const ref = archReferencePayload(ID, FACTS, SOURCE, CODE).ref;
    expect(source.openReference({}, { ref })).toBe(true);
    expect(clickTab).toHaveBeenCalledTimes(1);
  });

  it("stays inert without a seam and never throws out of a click", () => {
    const ref = archReferencePayload(ID, FACTS, SOURCE, CODE).ref;
    expect(createArchReferenceSource().openReference({ id: "s1" }, { ref })).toBe(false);
    expect(
      createArchReferenceSource(() => {
        throw new Error("no host");
      }).openReference({ id: "s1" }, { ref }),
    ).toBe(false);
    expect(createArchReferenceSource(() => fakeSeam().seam).openReference({ id: "s1" }, {})).toBe(false);
  });

  it("is part of the object the registration hands the host", () => {
    const registerSource = vi.fn((_source: unknown) => () => {});
    const ctx = { get: (name: string) => (name === "inputTriggers" ? { registerSource } : undefined) };
    registerArchReferenceSource(ctx, () => fakeSeam().seam);
    const registered = registerSource.mock.calls[0]?.[0] as { openReference?: unknown } | undefined;
    expect(typeof registered?.openReference).toBe("function");
  });
});
