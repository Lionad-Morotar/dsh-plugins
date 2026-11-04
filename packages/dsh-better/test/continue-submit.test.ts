/**
 * The send action behind the continue button, pinned at the host seam.
 *
 * Everything here is about a call this plugin does not own. The session object
 * comes from the host, its `prompt` is the host's own submission path, and the
 * shape of what that call returns is not this package's to decide. So the cases
 * below fix the two things that would fail silently: the message that goes out
 * (a wrong shape is accepted by nobody, or worse, accepted as a different kind
 * of input) and the mode it is sent in (`queue` rather than interrupting).
 *
 * The failure cases matter as much as the happy one: a host that cannot send, or
 * that refuses the message, has to surface as a rejection so the button can show
 * it, not as a resolved promise that leaves the row looking like it worked.
 */
import { describe, expect, it, vi } from "vitest";

import { CONTINUE_MESSAGE } from "../src/client/continue-turn.ts";
import { submitContinue, type ContinueSubmitContextLike } from "../src/client/continue-submit.ts";

/** A context whose session answers with the given prompt implementation. */
function contextWith(prompt: unknown): ContinueSubmitContextLike {
  return { sessions: { binding: () => ({ session: { prompt } }) } };
}

describe("submitContinue", () => {
  it("sends one text part reading continue, in queue mode", async () => {
    // The spy's parameters are declared rather than inferred: `vi.fn` with a
    // zero-argument implementation types `mock.calls` as empty tuples, and the
    // assertions below read the arguments it was actually given.
    const prompt = vi.fn(async (_parts: unknown, _mode?: unknown) => undefined);
    await submitContinue(contextWith(prompt), "session-1");
    expect(prompt).toHaveBeenCalledTimes(1);
    expect(prompt.mock.calls[0]?.[0]).toEqual([{ type: "text", text: CONTINUE_MESSAGE }]);
    expect(prompt.mock.calls[0]?.[1]).toBe("queue");
  });

  it("calls the prompt on the session object, not detached from it", async () => {
    // The host's submission path reads its own state off `this`; a bare call
    // would throw or, worse, act on whatever the module scope holds.
    const seen: unknown[] = [];
    const session = {
      prompt(this: unknown) {
        seen.push(this);
        return Promise.resolve(undefined);
      },
    };
    const ctx: ContinueSubmitContextLike = { sessions: { binding: () => ({ session }) } };
    await submitContinue(ctx, "session-1");
    expect(seen).toEqual([session]);
  });

  it("asks the host for the session it was given", async () => {
    const binding = vi.fn(() => ({ session: { prompt: async () => undefined } }));
    await submitContinue({ sessions: { binding } }, "session-42");
    expect(binding).toHaveBeenCalledWith("session-42");
  });

  it("resolves when the host accepts the message", async () => {
    await expect(submitContinue(contextWith(async () => ({ ok: true })), "session-1")).resolves.toBeUndefined();
  });

  it("resolves when the host reports nothing at all", async () => {
    // A host that returns void has said "sent" by not refusing.
    await expect(submitContinue(contextWith(async () => undefined), "session-1")).resolves.toBeUndefined();
    await expect(submitContinue(contextWith(async () => null), "session-1")).resolves.toBeUndefined();
  });

  it("rejects when the host refuses the message", async () => {
    await expect(submitContinue(contextWith(async () => ({ ok: false })), "session-1")).rejects.toThrow();
  });

  it("rejects when the session is gone", async () => {
    await expect(submitContinue({ sessions: { binding: () => undefined } }, "session-1")).rejects.toThrow();
  });

  it("rejects when the host has no session service at all", async () => {
    await expect(submitContinue({}, "session-1")).rejects.toThrow();
  });

  it("rejects with a readable reason when the session cannot send", async () => {
    // The message reaches the user through the button's alert, so it has to say
    // something; an empty rejection renders as a blank line under the row.
    const failure = submitContinue(contextWith(undefined), "session-1");
    await expect(failure).rejects.toThrow();
    await expect(failure).rejects.toSatisfy((error: unknown) => String(error).trim() !== "");
  });

  it("rejects rather than throwing synchronously, so the caller can await it", async () => {
    await expect(submitContinue(contextWith(undefined), "session-1")).rejects.toBeInstanceOf(Error);
  });
});
