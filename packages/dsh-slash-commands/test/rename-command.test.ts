import { describe, expect, it } from "vitest";

import {
  createRenameCommand,
  registerRenameCommand,
  rejectionMessage,
  titleRejectionOf,
} from "../src/rename-command.ts";
import type { RenameContextLike, TitleServiceLike } from "../src/rename-command.ts";
import { RENAME_COMMAND_NAME, RENAME_USAGE } from "../src/rename.ts";

/** A title service that records what it was asked to do. */
function service(behaviour?: (title: string) => { readonly title: string }): TitleServiceLike & {
  calls: Array<{ session: unknown; title: string }>;
} {
  const calls: Array<{ session: unknown; title: string }> = [];
  return {
    calls,
    rename(session, title) {
      calls.push({ session, title });
      return behaviour === undefined ? { title } : behaviour(title);
    },
  };
}

/** The minimum context the command needs. */
function context(title?: TitleServiceLike): RenameContextLike {
  return { sessionTitle: title, get: () => undefined };
}

/** One invocation carrying a live-looking session. */
const session = { id: "session-1" };
const invocation = (rawInput: string) => ({ agent: { session }, rawInput });

describe("/rename command", () => {
  it("advertises the name the manifest contributes", () => {
    expect(createRenameCommand(context()).name).toBe(RENAME_COMMAND_NAME);
  });

  it("renames the invoking agent's session with the parsed title", async () => {
    const titles = service();
    const command = createRenameCommand(context(titles));

    const result = await command.handler(invocation("  Fix the parser  "));

    expect(result).toEqual({ kind: "success", text: "会话已改名为：Fix the parser" });
    expect(titles.calls).toEqual([{ session, title: "Fix the parser" }]);
  });

  it("reports the accepted title as the service normalized it, not as typed", async () => {
    // The service may truncate for its byte budget; echoing the typed text
    // would claim a title the session does not actually carry.
    const titles = service(title => ({ title: title.slice(0, 4) }));
    const command = createRenameCommand(context(titles));

    const result = await command.handler(invocation("a long proposed title"));

    expect(result).toEqual({ kind: "success", text: "会话已改名为：a lo" });
  });

  it("rejects empty input before touching the title service", async () => {
    const titles = service();
    const command = createRenameCommand(context(titles));

    const result = await command.handler(invocation("   "));

    expect(result).toEqual({ kind: "error", text: RENAME_USAGE });
    expect(titles.calls).toEqual([]);
  });

  it("explains a missing title service instead of failing silently", async () => {
    const result = await createRenameCommand(context()).handler(invocation("x"));
    expect(result.kind).toBe("error");
    expect(result.text).toContain("session-title");
  });

  it("explains an unavailable session", async () => {
    const command = createRenameCommand(context(service()));
    const result = await command.handler({ agent: {}, rawInput: "x" });
    expect(result).toEqual({ kind: "error", text: "/rename 当前会话不可用，无法改名" });
  });

  it("turns an input rejection into the empty-title sentence", async () => {
    const titles = service(() => {
      throw Object.assign(new Error("session title must contain visible characters"), {
        name: "SessionTitleInvalidError",
      });
    });
    const command = createRenameCommand(context(titles));

    const result = await command.handler(invocation("x"));

    expect(result).toEqual({ kind: "error", text: rejectionMessage("invalid") });
  });

  it("turns a liveness failure into its own sentence", async () => {
    const titles = service(() => {
      throw new Error('session "session-1" is not live in this store');
    });
    const command = createRenameCommand(context(titles));

    const result = await command.handler(invocation("x"));

    expect(result).toEqual({ kind: "error", text: rejectionMessage("not-live") });
  });

  it("falls back to the disposal sentence for an unrecognized failure", async () => {
    const titles = service(() => {
      throw new Error("something else entirely");
    });
    const command = createRenameCommand(context(titles));

    const result = await command.handler(invocation("x"));

    expect(result).toEqual({ kind: "error", text: rejectionMessage("disposed") });
  });

  it("resolves the title service lazily through get()", async () => {
    // The registry outlives sessions and a composition can mount the service
    // after this row, so a registration-time lookup would miss it.
    const titles = service();
    const lazy: RenameContextLike = { get: name => (name === "sessionTitle" ? titles : undefined) };

    const result = await createRenameCommand(lazy).handler(invocation("late mount"));

    expect(result.kind).toBe("success");
    expect(titles.calls).toHaveLength(1);
  });
});

describe("title rejection classification", () => {
  it("recognizes the service's invalid-input error by name", () => {
    expect(titleRejectionOf(Object.assign(new Error("x"), { name: "SessionTitleInvalidError" }))).toBe("invalid");
  });

  it("recognizes a liveness failure", () => {
    expect(titleRejectionOf(new Error('session "s" is not live in this store'))).toBe("not-live");
  });

  it("treats an unknown failure as disposal rather than blaming the input", () => {
    expect(titleRejectionOf(new Error("???"))).toBe("disposed");
  });

  it("handles a non-Error throw without crashing", () => {
    expect(titleRejectionOf("plain string")).toBe("disposed");
  });
});

describe("registration", () => {
  it("registers the definition and returns the registry's disposer", () => {
    const registered: Array<{ name: string }> = [];
    const dispose = () => {};
    const ctx: RenameContextLike = {
      sessionTitle: service(),
      get: name =>
        name === "commands"
          ? {
              register: (definition: { name: string }) => {
                registered.push(definition);
                return dispose;
              },
            }
          : undefined,
    };

    expect(registerRenameCommand(ctx)).toBe(dispose);
    expect(registered.map(entry => entry.name)).toEqual([RENAME_COMMAND_NAME]);
  });

  it("throws rather than registering nothing when no registry is mounted", () => {
    expect(() => registerRenameCommand({ sessionTitle: service(), get: () => undefined })).toThrow(/commands service/u);
  });
});
