// @vitest-environment jsdom
/**
 * Commit references: the three spellings of a payload, the source that gives a
 * chip its send-time identity, the two-channel writer's state machine, and the
 * button's own admission rules.
 *
 * The writer is exercised through an injected deps object rather than a host,
 * because the interesting behaviour is entirely in the order it tries the
 * channels and in what it does when the composer refuses.
 */
import { act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  GIT_REFERENCE_SOURCE,
  commitRefClipboardText,
  commitRefModelText,
  commitReferenceDate,
  commitReferencePayload,
  createGitReferenceSource,
  gitReferenceSeam,
  insertCommitReference,
  openGitReference,
  referenceAvailability,
  registerGitReferenceSource,
  type CommitReferencePayload,
  type GitReferenceSeam,
  type ReferenceInsert,
  type ReferenceInsertionDeps,
  type ReferenceSpan,
} from "../src/client/reference.ts";
import { DetailPane } from "../src/client/detail-pane.tsx";
import { createReferenceResolver } from "../src/client/entry.ts";
import type { GitCommitDetail } from "../src/host/types.ts";
import type { GitRemoteFace } from "../src/client/wire.ts";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const t = (key: string): string => key;

const detail: GitCommitDetail = {
  hash: "17b6a55c0ffee1234567890abcdef1234567890ab",
  parents: ["0000000000000000000000000000000000000000"],
  author: "Alice",
  // 2026-11-06T12:00:00Z; the payload formats it in the reader's zone.
  time: 1_762_430_400,
  subject: "fix: keep the caret after a reference insert",
  body: "",
  files: [],
};

const SHORT = "17b6a55";

function payloadOf(overrides: Partial<GitCommitDetail> = {}, refs: readonly string[] = []) {
  return commitReferencePayload({ ...detail, ...overrides }, SHORT, refs);
}

describe("commitReferencePayload", () => {
  it("keeps the full hash as the identity and the short one in the chip", () => {
    const payload = payloadOf();
    expect(payload.kind).toBe("git.commit");
    expect(payload.id).toBe(detail.hash);
    expect(payload.label.startsWith(`${SHORT} `)).toBe(true);
    expect(payload.clipboardText).toBe(`[git commit ${SHORT}]`);
    expect(payload.modelText).toContain(detail.hash);
    expect(payload.modelText).toContain(detail.subject);
  });

  it("spells the model text as one line of facts", () => {
    expect(payloadOf({}, ["main", "origin/main"]).modelText).toBe(
      `[git commit ${detail.hash}] ${detail.subject} · main, origin/main · Alice · ${commitReferenceDate(detail.time)}`,
    );
  });

  it("leaves the refs segment out entirely when there are none", () => {
    const text = payloadOf().modelText;
    expect(text).not.toContain("()");
    expect(text).not.toContain("·  ·");
    // hash+subject, author, date: the refs slot is absent, not empty.
    expect(text.split(" · ")).toHaveLength(3);
  });

  it("cuts a long subject to one bounded line", () => {
    const long = "refactor: ".repeat(20).trim();
    const payload = payloadOf({ subject: long });
    expect(payload.label).not.toContain("\n");
    expect(payload.label.endsWith("…")).toBe(true);
    expect(payload.label.length).toBeLessThanOrEqual(SHORT.length + 1 + 61);
  });

  it("flattens a subject that carries newlines", () => {
    const payload = payloadOf({ subject: "first line\nsecond line" });
    expect(payload.label).not.toContain("\n");
    expect(payload.modelText).not.toContain("\n");
    expect(payload.clipboardText).not.toContain("\n");
  });

  it("never starts the draft text with a character the host parses", () => {
    const payload = payloadOf();
    expect(payload.clipboardText.startsWith("/")).toBe(false);
    expect(payload.clipboardText.startsWith("@")).toBe(false);
    expect(payload.clipboardText.startsWith("dsh-session:")).toBe(false);
    expect(payload.modelText.startsWith("/")).toBe(false);
    expect(payload.modelText.startsWith("@")).toBe(false);
    expect(payload.modelText.startsWith("dsh-session:")).toBe(false);
  });

  it("carries the same facts in the chip ref as in the model text", () => {
    const payload = payloadOf({}, ["main"]);
    expect(commitRefModelText(payload.ref)).toBe(payload.modelText);
    expect(commitRefClipboardText(payload.ref)).toBe(payload.clipboardText);
  });

  it("falls back to the raw ref instead of throwing on a malformed chip", () => {
    expect(commitRefModelText("{not json")).toBe("[git commit {not json]");
    expect(commitRefClipboardText("{not json")).toBe("[git commit {not json]");
    expect(commitRefModelText("null")).toBe("[git commit null]");
    expect(commitRefModelText(JSON.stringify({ subject: "no hash" }))).toBe(
      `[git commit ${JSON.stringify({ subject: "no hash" })}]`,
    );
  });
});

describe("insertCommitReference", () => {
  const span = (draftRev: number): ReferenceSpan => ({ start: 0, end: 0, draftRev });

  /**
   * A deps object whose channels answer from a script, so each test states only
   * the sequence it cares about while every call is still recorded.
   */
  function deps(
    script: {
      readonly spans?: readonly (ReferenceSpan | undefined)[];
      readonly reference?: readonly boolean[];
      readonly text?: readonly boolean[];
      readonly canInsertReference?: boolean;
    } = {},
  ): ReferenceInsertionDeps & { readonly inserts: ReferenceInsert[]; readonly texts: string[] } {
    const inserts: ReferenceInsert[] = [];
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
      // The last scripted answer repeats, so a test that only cares about the
      // first refusal does not have to spell out every later call.
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
    expect(insertCommitReference(d, payloadOf())).toBe("reference");
    expect(d.inserts).toHaveLength(1);
    expect(d.texts).toHaveLength(0);
    expect(d.inserts[0]?.source).toBe(GIT_REFERENCE_SOURCE);
    expect(d.inserts[0]?.appearance).toBe("session");
  });

  it("retries once with a fresh span when the revision went stale", () => {
    const d = deps({ spans: [span(1), span(2)], reference: [false, true] });
    expect(insertCommitReference(d, payloadOf())).toBe("reference");
    expect(d.inserts).toHaveLength(2);
    expect(d.texts).toHaveLength(0);
  });

  it("never builds a chip when the source is not registered", () => {
    // The chip path is skipped outright: a chip with no codec is worse than
    // plain text because the host refuses the send and keeps the draft.
    const d = deps({ canInsertReference: false });
    expect(insertCommitReference(d, payloadOf())).toBe("text");
    expect(d.inserts).toHaveLength(0);
    expect(d.texts).toEqual([`[git commit ${SHORT}]`]);
  });

  it("degrades to plain text when the chip path refuses twice", () => {
    const d = deps({ reference: [false] });
    expect(insertCommitReference(d, payloadOf())).toBe("text");
    expect(d.inserts).toHaveLength(2);
    expect(d.texts).toEqual([`[git commit ${SHORT}]`]);
  });

  it("reports failure when neither channel accepts the write", () => {
    const d = deps({ reference: [false], text: [false] });
    expect(insertCommitReference(d, payloadOf())).toBe("failed");
  });

  it("goes straight to plain text when the chip path has no span", () => {
    const d = deps({ spans: [undefined, span(1)] });
    expect(insertCommitReference(d, payloadOf())).toBe("text");
    expect(d.inserts).toHaveLength(0);
    expect(d.texts).toEqual([`[git commit ${SHORT}]`]);
  });

  it("reports failure when no span is available for the fallback either", () => {
    const d = deps({ spans: [undefined] });
    expect(insertCommitReference(d, payloadOf())).toBe("failed");
    expect(d.inserts).toHaveLength(0);
    expect(d.texts).toHaveLength(0);
  });
});

describe("referenceAvailability", () => {
  it("enables the button for a plain composer on a session", () => {
    expect(referenceAvailability({ sessionId: "s1", hasComposer: true, phase: "plain", sourceAvailable: true })).toEqual({
      enabled: true,
    });
  });

  it("names a reason for each way the write cannot happen", () => {
    expect(referenceAvailability({ sessionId: undefined, hasComposer: true, phase: "plain", sourceAvailable: true })).toEqual({
      enabled: false,
      reasonKey: "reference.disabled.noSession",
    });
    expect(referenceAvailability({ sessionId: "s1", hasComposer: false, phase: "plain", sourceAvailable: true })).toEqual({
      enabled: false,
      reasonKey: "reference.disabled.noComposer",
    });
    expect(referenceAvailability({ sessionId: "s1", hasComposer: true, phase: "sending", sourceAvailable: true })).toEqual({
      enabled: false,
      reasonKey: "reference.disabled.busy",
    });
  });

  it("refuses the button when the source is not registered", () => {
    // A chip whose codec never registered is refused at send time and keeps the
    // draft, so the button must not offer the write at all.
    expect(
      referenceAvailability({ sessionId: "s1", hasComposer: true, phase: "plain", sourceAvailable: false }),
    ).toEqual({ enabled: false, reasonKey: "reference.disabled.noSource" });
  });

  it("treats an unpublished phase as unknown rather than busy", () => {
    expect(referenceAvailability({ sessionId: "s1", hasComposer: true, phase: undefined, sourceAvailable: true })).toEqual({
      enabled: true,
    });
  });
});

describe("createGitReferenceSource", () => {
  it("declares an identity-only source on the @ trigger", async () => {
    const source = createGitReferenceSource();
    expect(source.trigger).toBe("@");
    expect(source.name).toBe("lionad.git");
    expect(source.showGroupTitle).toBe(false);
    await expect(source.candidates()).resolves.toEqual([]);
    expect(source.onPick()).toBeUndefined();
  });

  it("serializes a valid ref into the model text", async () => {
    const source = createGitReferenceSource();
    const payload = payloadOf({}, ["main"]);
    await expect(source.codec.serialize(payload.ref, new AbortController().signal)).resolves.toBe(
      payload.modelText,
    );
  });

  it("serializes a malformed ref into a readable fallback without throwing", async () => {
    const source = createGitReferenceSource();
    await expect(source.codec.serialize("not-json", new AbortController().signal)).resolves.toBe(
      "[git commit not-json]",
    );
  });
});

describe("registerGitReferenceSource", () => {
  it("registers through the scoped injection when the service is injected", () => {
    const registerSource = vi.fn((_source: unknown) => () => {});
    const effect = vi.fn((apply: () => () => void) => {
      apply();
    });
    const ctx = {
      inject: <T,>(_names: string[], apply: (scope: T) => void): unknown => {
        apply({ inputTriggers: { registerSource }, effect } as T);
        return undefined;
      },
    };
    const handle = registerGitReferenceSource(ctx);
    expect(registerSource).toHaveBeenCalledTimes(1);
    expect(registerSource.mock.calls[0]?.[0]).toMatchObject({ name: "lionad.git", trigger: "@" });
    // The handle reports the live registration, which is what the entry reads
    // when it decides whether a chip could be sent.
    expect(handle.available).toBe(true);
    handle.dispose();
    expect(handle.available).toBe(false);
  });

  it("falls back to the resolver when injection is absent", () => {
    const registerSource = vi.fn((_source: unknown) => () => {});
    const ctx = { get: (name: string) => (name === "inputTriggers" ? { registerSource } : undefined) };
    registerGitReferenceSource(ctx);
    expect(registerSource).toHaveBeenCalledTimes(1);
  });

  it("stays inert on a host with neither probe", () => {
    expect(() => registerGitReferenceSource({})).not.toThrow();
    expect(() =>
      registerGitReferenceSource({
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
    registerGitReferenceSource(ctx);
    expect(registerSource).toHaveBeenCalledTimes(1);
  });
});

describe("createReferenceResolver", () => {
  function host(overrides: { readonly scope?: unknown; readonly facade?: unknown } = {}) {
    const facade =
      overrides.facade ??
      {
        insertReference: vi.fn(() => true),
        focus: vi.fn(),
        notify: vi.fn(),
      };
    const scope = overrides.scope ?? (() => ({ id: "actx" }));
    return {
      facade: facade as { insertReference: ReturnType<typeof vi.fn>; focus: ReturnType<typeof vi.fn> },
      ctx: {
        get: (name: string) => {
          if (name === "sessions") return { scope };
          if (name === "conversation") return { input: { for: () => facade } };
          return undefined;
        },
      },
    };
  }

  it("resolves the facade per call rather than capturing it at apply time", () => {
    const { ctx, facade } = host();
    const resolve = createReferenceResolver(ctx as never);
    const wiring = resolve("s1");
    expect(wiring).toBeDefined();
    expect(wiring?.insertReference?.({ source: "s", ref: "r", label: "l", clipboardText: "c" }, { start: 0, end: 0, draftRev: 1 })).toBe(true);
    expect(facade.insertReference).toHaveBeenCalledTimes(1);
    wiring?.focus?.();
    expect(facade.focus).toHaveBeenCalledTimes(1);
  });

  it("answers undefined when the input plane is not up yet", () => {
    const resolve = createReferenceResolver({ get: () => undefined } as never);
    expect(resolve("s1")).toBeUndefined();
  });

  it("answers undefined when the session generation was released", () => {
    const { ctx } = host({
      scope: () => {
        throw new Error("released");
      },
    });
    expect(createReferenceResolver(ctx as never)("s1")).toBeUndefined();
  });

  it("answers undefined when the scope is unknown", () => {
    const { ctx } = host({ scope: () => undefined });
    expect(createReferenceResolver(ctx as never)("s1")).toBeUndefined();
  });

  it("does not expose a method the facade does not have", () => {
    // A facade without `insertReference` is a real host shape. Wrapping it
    // anyway would pass the caller's capability check and then throw on the
    // write, which the plain-text fallback can never recover from.
    const { ctx } = host({ facade: { focus: vi.fn() } });
    const wiring = createReferenceResolver(ctx as never)("s1");
    expect(wiring).toBeDefined();
    expect(wiring?.insertReference).toBeUndefined();
    expect(typeof wiring?.focus).toBe("function");
    expect(wiring?.notify).toBeUndefined();
  });

  it("exposes every method the facade really has", () => {
    const { ctx } = host();
    const wiring = createReferenceResolver(ctx as never)("s1");
    expect(typeof wiring?.insertReference).toBe("function");
    expect(typeof wiring?.focus).toBe("function");
    expect(typeof wiring?.notify).toBe("function");
  });
});

describe("DetailPane reference button", () => {
  let host: HTMLDivElement;
  let root: Root;

  function remote(withDetail: GitCommitDetail = detail): GitRemoteFace {
    return {
      snapshot: vi.fn(),
      query: vi.fn(),
      commit: vi.fn(async () => ({ ok: true, value: { ok: true, detail: withDetail } })),
      show: vi.fn(),
    } as unknown as GitRemoteFace;
  }

  async function mount(props: Record<string, unknown>): Promise<HTMLButtonElement> {
    await act(async () => {
      root.render(
        createElement(DetailPane, {
          sessionId: "s1",
          hash: detail.hash,
          remote: remote(),
          t,
          onSelect: () => {},
          ...props,
        } as never),
      );
    });
    // The detail arrives from a promise; one more turn paints the header.
    await act(async () => {
      await Promise.resolve();
    });
    const button = host.querySelector<HTMLButtonElement>('[data-testid="gx-reference-commit"]');
    if (button === null) throw new Error("reference button missing");
    return button;
  }

  beforeEach(() => {
    host = document.createElement("div");
    document.body.append(host);
    root = createRoot(host);
  });

  afterEach(async () => {
    await act(async () => root.unmount());
    host.remove();
  });

  it("is disabled with a reason when there is no session", async () => {
    const button = await mount({
      sessionId: undefined,
      inputActions: { captureInsertion: () => ({ start: 0, end: 0, draftRev: 1 }) },
    });
    expect(button.disabled).toBe(true);
    expect(button.getAttribute("aria-disabled")).toBe("true");
    expect(button.title).toBe("reference.disabled.noSession");
  });

  it("is disabled with a reason when the host publishes no composer", async () => {
    const button = await mount({});
    expect(button.disabled).toBe(true);
    expect(button.title).toBe("reference.disabled.noComposer");
  });

  it("is disabled while the composer is sending", async () => {
    const button = await mount({
      inputActions: { captureInsertion: () => ({ start: 0, end: 0, draftRev: 1 }) },
      phase: "sending",
      sourceAvailable: true,
    });
    expect(button.disabled).toBe(true);
    expect(button.title).toBe("reference.disabled.busy");
  });

  it("is disabled with a reason when the source is not registered", async () => {
    const button = await mount({
      inputActions: { captureInsertion: () => ({ start: 0, end: 0, draftRev: 1 }) },
      phase: "plain",
      sourceAvailable: false,
    });
    expect(button.disabled).toBe(true);
    expect(button.title).toBe("reference.disabled.noSource");
  });

  it("writes exactly one payload per click", async () => {
    const onReference = vi.fn((_payload: CommitReferencePayload) => "reference" as const);
    const button = await mount({
      inputActions: { captureInsertion: () => ({ start: 0, end: 0, draftRev: 1 }) },
      phase: "plain",
      sourceAvailable: true,
      onReference,
      refs: ["main"],
    });
    expect(button.disabled).toBe(false);
    expect(button.title).toBe("reference.hint");
    await act(async () => button.click());
    expect(onReference).toHaveBeenCalledTimes(1);
    const payload = onReference.mock.calls[0]?.[0];
    expect(payload?.id).toBe(detail.hash);
    expect(payload?.modelText).toContain("main");
  });
});

/** A seam that records every path it was driven through. */
function fakeSeam(overrides: Partial<GitReferenceSeam> = {}) {
  const calls: string[] = [];
  const openView = vi.fn((sessionId: string, viewId: string, focus: string) => {
    calls.push(`openView:${sessionId}:${viewId}:${focus}`);
    return true;
  });
  const requestFocus = vi.fn((viewId: string, focus: string) => {
    calls.push(`requestFocus:${viewId}:${focus}`);
  });
  const takeFocus = vi.fn((viewId: string) => {
    calls.push(`takeFocus:${viewId}`);
  });
  const openViewOrSwitch = vi.fn((viewId: string, focus?: string) => {
    calls.push(`openViewOrSwitch:${viewId}:${focus ?? ""}`);
    return { opened: true, focused: focus !== undefined };
  });
  const seam: GitReferenceSeam = {
    openView,
    requestFocus,
    takeFocus,
    openViewOrSwitch,
    currentSessionId: () => "s1",
    ...overrides,
  };
  return { seam, calls, openView, requestFocus, takeFocus, openViewOrSwitch };
}

describe("openGitReference", () => {
  it("selects the commit through the session-addressed seam", () => {
    const { seam, openView } = fakeSeam();
    expect(openGitReference(seam, "s1", payloadOf().ref)).toBe(true);
    expect(openView).toHaveBeenCalledWith("s1", "git-explorer", `commit:${detail.hash}`);
  });

  it("normalizes an upper-case hash to the spelling the focus parser accepts", () => {
    const { seam, openView } = fakeSeam();
    const ref = JSON.stringify({ hash: detail.hash.toUpperCase(), short: SHORT });
    expect(openGitReference(seam, "s1", ref)).toBe(true);
    expect(openView).toHaveBeenCalledWith("s1", "git-explorer", `commit:${detail.hash}`);
  });

  it("refuses a chip from another session without touching the seam", () => {
    const { seam, openView, openViewOrSwitch } = fakeSeam();
    expect(openGitReference(seam, "s2", payloadOf().ref)).toBe(false);
    expect(openView).not.toHaveBeenCalled();
    expect(openViewOrSwitch).not.toHaveBeenCalled();
  });

  it("refuses a malformed ref", () => {
    const { seam, openView } = fakeSeam();
    expect(openGitReference(seam, "s1", "not-json")).toBe(false);
    expect(openGitReference(seam, "s1", JSON.stringify({ hash: "" }))).toBe(false);
    // A hash the view's own parser would reject must not switch the tab and
    // leave the cursor where it was.
    expect(openGitReference(seam, "s1", JSON.stringify({ hash: "zzzz" }))).toBe(false);
    expect(openView).not.toHaveBeenCalled();
  });

  it("queues the focus before switching when the seam cannot deliver it", () => {
    const { seam, calls, requestFocus, openViewOrSwitch, takeFocus } = fakeSeam({ openView: () => false });
    expect(openGitReference(seam, "s1", payloadOf().ref)).toBe(true);
    expect(requestFocus).toHaveBeenCalledWith("git-explorer", `commit:${detail.hash}`);
    expect(openViewOrSwitch).toHaveBeenCalledWith("git-explorer");
    // The queue must be filled before the switch: a lazily mounted view takes
    // what is waiting at mount time and nothing that arrives afterwards.
    expect(calls).toEqual([
      `requestFocus:git-explorer:commit:${detail.hash}`,
      "openViewOrSwitch:git-explorer:",
    ]);
    expect(takeFocus).not.toHaveBeenCalled();
  });

  it("withdraws the queued focus when the switch did not land", () => {
    const { seam, takeFocus } = fakeSeam({
      openView: () => false,
      openViewOrSwitch: () => ({ opened: false, focused: false }),
    });
    expect(openGitReference(seam, "s1", payloadOf().ref)).toBe(false);
    expect(takeFocus).toHaveBeenCalledWith("git-explorer");
  });

  it("falls back to a switch that carries the focus when there is no queue", () => {
    const { seam, openViewOrSwitch } = fakeSeam({ openView: undefined, requestFocus: undefined });
    expect(openGitReference(seam, "s1", payloadOf().ref)).toBe(true);
    expect(openViewOrSwitch).toHaveBeenCalledWith("git-explorer", `commit:${detail.hash}`);
  });

  it("stays inert on a host with no view-switching capability at all", () => {
    expect(openGitReference({}, "s1", payloadOf().ref)).toBe(false);
  });
});

describe("gitReferenceSeam", () => {
  it("reads the core service's members as the seam", () => {
    const open = vi.fn(() => true);
    const request = vi.fn();
    const take = vi.fn();
    const switchView = vi.fn(() => ({ opened: true, focused: true }));
    const seam = gitReferenceSeam({
      views: { open },
      viewFocus: { request, take },
      openViewOrSwitch: switchView,
      currentSessionId: () => "s1",
    });
    expect(seam.openView?.("s1", "git-explorer", "commit:abcd")).toBe(true);
    expect(open).toHaveBeenCalledWith("s1", "git-explorer", "commit:abcd");
    seam.requestFocus?.("git-explorer", "commit:abcd");
    expect(request).toHaveBeenCalledWith("git-explorer", "commit:abcd");
    seam.takeFocus?.("git-explorer");
    expect(take).toHaveBeenCalledWith("git-explorer");
    expect(seam.openViewOrSwitch?.("git-explorer")).toEqual({ opened: true, focused: true });
    expect(seam.currentSessionId?.()).toBe("s1");
  });

  it("treats a void answer from the view-side face as not delivered", () => {
    // The view's own `ViewSeamFace` widens the answer to `boolean | void`; a
    // seam that reported delivery on undefined would skip the queue path.
    const seam = gitReferenceSeam({ views: { open: () => undefined } });
    expect(seam.openView?.("s1", "git-explorer", "commit:abcd")).toBe(false);
  });

  it("stays empty without a workbench", () => {
    expect(gitReferenceSeam(undefined)).toEqual({});
    expect(gitReferenceSeam(null)).toEqual({});
    expect(gitReferenceSeam("workbench")).toEqual({});
  });
});

describe("createGitReferenceSource openReference", () => {
  it("drives the seam the source resolved at click time", () => {
    const { seam, openView } = fakeSeam();
    const source = createGitReferenceSource(() => seam);
    expect(source.openReference({ id: "s1" }, { ref: payloadOf().ref, appearance: "session" })).toBe(true);
    expect(openView).toHaveBeenCalledWith("s1", "git-explorer", `commit:${detail.hash}`);
  });

  it("addresses the session on screen when the host's session carries no id", () => {
    const { seam, openView } = fakeSeam();
    const source = createGitReferenceSource(() => seam);
    expect(source.openReference({}, { ref: payloadOf().ref })).toBe(true);
    expect(openView).toHaveBeenCalledWith("s1", "git-explorer", `commit:${detail.hash}`);
  });

  it("stays inert without a workbench and never throws out of a click", () => {
    expect(createGitReferenceSource().openReference({ id: "s1" }, { ref: payloadOf().ref })).toBe(false);
    expect(
      createGitReferenceSource(() => {
        throw new Error("no workbench");
      }).openReference({ id: "s1" }, { ref: payloadOf().ref }),
    ).toBe(false);
    expect(createGitReferenceSource(() => fakeSeam().seam).openReference({ id: "s1" }, {})).toBe(false);
  });

  it("is part of the object the registration hands the host", () => {
    const registerSource = vi.fn((_source: unknown) => () => {});
    const ctx = { get: (name: string) => (name === "inputTriggers" ? { registerSource } : undefined) };
    registerGitReferenceSource(ctx, () => fakeSeam().seam);
    const registered = registerSource.mock.calls[0]?.[0] as { openReference?: unknown } | undefined;
    expect(typeof registered?.openReference).toBe("function");
  });
});
