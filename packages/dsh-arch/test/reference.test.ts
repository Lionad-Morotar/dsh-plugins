/**
 * Element references: the payload's spellings, the source that gives a chip its
 * send-time identity, the two-channel writer's state machine, and the action
 * bar's third button.
 *
 * The writer is exercised through an injected deps object rather than a host,
 * because the interesting behaviour is entirely in the order it tries the
 * channels and in what it does when the composer refuses.
 */
import { describe, expect, it, vi } from "vitest";

import {
  ARCH_REFERENCE_SOURCE,
  archRefClipboardText,
  archRefModelText,
  archReferenceFromModel,
  archReferencePayload,
  createArchReferenceSource,
  insertArchReference,
  registerArchReferenceSource,
  type ArchInsertionDeps,
  type ArchReferenceInsert,
  type ArchReferenceSpan,
} from "../src/client/reference.ts";

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
    const dispose = registerArchReferenceSource(ctx);
    expect(registerSource).toHaveBeenCalledTimes(1);
    expect(registerSource.mock.calls[0]?.[0]).toMatchObject({ name: "lionad.arch", trigger: "@" });
    dispose();
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
