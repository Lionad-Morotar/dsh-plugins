/**
 * The host face the menu row will call.
 *
 * A fake fetch and an in-memory storage stand in for the page, so the cases
 * can assert the wire exactly: which relative route is addressed, what body
 * leaves, and which remembered shapes still resolve to an application id.
 */
import { describe, expect, it } from "vitest";
import {
  OPEN_IN_APP_APPS_ROUTE,
  OPEN_IN_APP_CHOICE_KEY,
  OPEN_IN_APP_OPEN_ROUTE,
  OpenInAppError,
  createOpenInAppHost,
  openInAppIconRoute,
  readRememberedApplication,
  rememberApplication,
  orderApplications,
  type FetchLike,
  type StorageLike,
} from "../src/client/host-api.ts";

interface Captured {
  input: string;
  init: Parameters<FetchLike>[1];
}

/** One scripted response, optionally asserting the request that fetched it. */
function scripted(
  response: { ok: boolean; status: number; json?: unknown; text?: string },
  captured: Captured[],
): FetchLike {
  return async (input, init) => {
    captured.push({ input, init });
    return {
      ok: response.ok,
      status: response.status,
      json: async () => {
        if (response.text !== undefined) return JSON.parse(response.text);
        return response.json;
      },
    };
  };
}

/** A storage that records writes and can throw on either side. */
function memoryStorage(seed: Record<string, string> = {}, broken?: "get" | "set"): StorageLike & {
  dump(): Record<string, string>;
} {
  const values = { ...seed };
  return {
    getItem(key) {
      if (broken === "get") throw new Error("storage locked");
      return Object.prototype.hasOwnProperty.call(values, key) ? values[key]! : null;
    },
    setItem(key, value) {
      if (broken === "set") throw new Error("quota");
      values[key] = value;
    },
    dump: () => ({ ...values }),
  };
}

describe("application catalog", () => {
  it("reads the host's app id list and drops anything that is not a string", async () => {
    const captured: Captured[] = [];
    const host = createOpenInAppHost({
      fetchImpl: scripted({ ok: true, status: 200, json: { apps: ["cursor", "cursor", 3, null, "finder"] } }, captured),
    });

    await expect(host.listApplications()).resolves.toEqual(["cursor", "finder"]);
    expect(captured[0]?.input).toBe(OPEN_IN_APP_APPS_ROUTE);
    expect(OPEN_IN_APP_APPS_ROUTE.startsWith("/")).toBe(false);
  });

  it("prefixes a configured base without doubling a slash", async () => {
    const captured: Captured[] = [];
    const host = createOpenInAppHost({
      baseUrl: "https://desk.example/dsh/",
      fetchImpl: scripted({ ok: true, status: 200, json: { apps: [] } }, captured),
    });

    await host.listApplications();
    expect(captured[0]?.input).toBe("https://desk.example/dsh/open-in-app/apps");
  });

  it("forwards an abort signal on the catalog read", async () => {
    const captured: Captured[] = [];
    const host = createOpenInAppHost({
      fetchImpl: scripted({ ok: true, status: 200, json: { apps: ["cursor"] } }, captured),
    });
    const signal = new AbortController().signal;

    await host.listApplications(signal);
    expect(captured[0]?.init?.signal).toBe(signal);
  });

  it("rejects a non-2xx catalog as unavailable rather than an empty list", async () => {
    const host = createOpenInAppHost({
      fetchImpl: scripted({ ok: false, status: 503, json: {} }, []),
    });

    await expect(host.listApplications()).rejects.toMatchObject({ name: "OpenInAppError", kind: "catalog" });
  });

  it("rejects a catalog whose JSON is not the host's apps array", async () => {
    const host = createOpenInAppHost({
      fetchImpl: scripted({ ok: true, status: 200, json: ["cursor"] }, []),
    });

    await expect(host.listApplications()).rejects.toBeInstanceOf(OpenInAppError);
    await expect(
      createOpenInAppHost({
        fetchImpl: scripted({ ok: true, status: 200, text: "not json" }, []),
      }).listApplications(),
    ).rejects.toMatchObject({ kind: "catalog" });
  });

  it("returns an empty list when the host has no resolvable application", async () => {
    const host = createOpenInAppHost({
      fetchImpl: scripted({ ok: true, status: 200, json: { apps: [] } }, []),
    });

    await expect(host.listApplications()).resolves.toEqual([]);
  });
});

describe("icon route", () => {
  it("encodes the application id so a space or a slash stays inside one path segment", () => {
    const host = createOpenInAppHost();
    expect(host.iconUrl("visual studio")).toBe("open-in-app/icon/visual%20studio");
    expect(openInAppIconRoute("a/b")).toBe("open-in-app/icon/a%2Fb");
    expect(host.iconUrl("cursor")).toBe(`${openInAppIconRoute("cursor")}`);
  });
});

describe("launch", () => {
  it("posts the host body verbatim and treats any non-2xx as a failed launch", async () => {
    const captured: Captured[] = [];
    const host = createOpenInAppHost({
      fetchImpl: scripted({ ok: true, status: 200, json: { ok: true } }, captured),
    });

    await host.openDirectory("cursor", "/Users/lionad/work");
    expect(captured[0]?.input).toBe(OPEN_IN_APP_OPEN_ROUTE);
    expect(captured[0]?.init?.method).toBe("POST");
    expect(captured[0]?.init?.headers).toEqual({ "content-type": "application/json" });
    expect(captured[0]?.init?.body).toBe('{"app":"cursor","path":"/Users/lionad/work"}');

    const failing = createOpenInAppHost({
      fetchImpl: scripted({ ok: false, status: 502, json: { code: "launch-failed" } }, []),
    });
    await expect(failing.openDirectory("cursor", "/tmp")).rejects.toMatchObject({
      name: "OpenInAppError",
      kind: "launch",
    });
  });
});

describe("application order", () => {
  it("moves an installed remembered id to the front and leaves the rest alone", () => {
    expect(orderApplications(["finder", "cursor"], "cursor")).toEqual(["cursor", "finder"]);
    expect(orderApplications(["finder", "cursor"], "gone")).toEqual(["finder", "cursor"]);
    expect(orderApplications(["finder", "cursor"], null)).toEqual(["finder", "cursor"]);
    expect(orderApplications([], "cursor")).toEqual([]);
    // A caller's array is not mutated: the menu may keep the catalog snapshot.
    const catalog = ["finder", "cursor"];
    orderApplications(catalog, "cursor");
    expect(catalog).toEqual(["finder", "cursor"]);
  });
});

describe("remembered choice", () => {
  it("accepts the shapes a snapshot store or a hand edit might have left", () => {
    expect(readRememberedApplication(memoryStorage({ [OPEN_IN_APP_CHOICE_KEY]: "cursor" }))).toBe("cursor");
    expect(readRememberedApplication(memoryStorage({ [OPEN_IN_APP_CHOICE_KEY]: '"cursor"' }))).toBe("cursor");
    expect(readRememberedApplication(memoryStorage({ [OPEN_IN_APP_CHOICE_KEY]: '{"value":"zed"}' }))).toBe("zed");
    expect(readRememberedApplication(memoryStorage({ [OPEN_IN_APP_CHOICE_KEY]: '{"choice":"finder"}' }))).toBe("finder");
    expect(readRememberedApplication(memoryStorage({ [OPEN_IN_APP_CHOICE_KEY]: '{"app":"iterm"}' }))).toBe("iterm");
  });

  it("returns null for an absent, empty, garbage, or throwing store", () => {
    expect(readRememberedApplication(null)).toBeNull();
    expect(readRememberedApplication(undefined)).toBeNull();
    expect(readRememberedApplication(memoryStorage())).toBeNull();
    expect(readRememberedApplication(memoryStorage({ [OPEN_IN_APP_CHOICE_KEY]: "" }))).toBeNull();
    expect(readRememberedApplication(memoryStorage({ [OPEN_IN_APP_CHOICE_KEY]: '""' }))).toBeNull();
    expect(readRememberedApplication(memoryStorage({ [OPEN_IN_APP_CHOICE_KEY]: "not json {" }))).toBeNull();
    expect(readRememberedApplication(memoryStorage({ [OPEN_IN_APP_CHOICE_KEY]: '{"other":1}' }))).toBeNull();
    expect(readRememberedApplication(memoryStorage({ [OPEN_IN_APP_CHOICE_KEY]: "7" }))).toBeNull();
    expect(readRememberedApplication(memoryStorage({}, "get"))).toBeNull();
  });

  it("rewrites inside the wrapper it read and writes a JSON string when nothing was stored", () => {
    const wrapped = memoryStorage({ [OPEN_IN_APP_CHOICE_KEY]: '{"choice":"finder"}' });
    rememberApplication(wrapped, "cursor", wrapped.getItem(OPEN_IN_APP_CHOICE_KEY));
    expect(wrapped.dump()[OPEN_IN_APP_CHOICE_KEY]).toBe('{"choice":"cursor"}');

    const valued = memoryStorage({ [OPEN_IN_APP_CHOICE_KEY]: '{"value":"zed","extra":1}' });
    rememberApplication(valued, "cursor", valued.getItem(OPEN_IN_APP_CHOICE_KEY));
    expect(JSON.parse(valued.dump()[OPEN_IN_APP_CHOICE_KEY] ?? "")).toEqual({ value: "cursor", extra: 1 });

    const bare = memoryStorage({ [OPEN_IN_APP_CHOICE_KEY]: "finder" });
    rememberApplication(bare, "cursor", bare.getItem(OPEN_IN_APP_CHOICE_KEY));
    expect(bare.dump()[OPEN_IN_APP_CHOICE_KEY]).toBe('"cursor"');

    const fresh = memoryStorage();
    rememberApplication(fresh, "cursor", fresh.getItem(OPEN_IN_APP_CHOICE_KEY));
    expect(fresh.dump()[OPEN_IN_APP_CHOICE_KEY]).toBe('"cursor"');

    const quoted = memoryStorage({ [OPEN_IN_APP_CHOICE_KEY]: '"finder"' });
    rememberApplication(quoted, "cursor", quoted.getItem(OPEN_IN_APP_CHOICE_KEY));
    expect(quoted.dump()[OPEN_IN_APP_CHOICE_KEY]).toBe('"cursor"');
  });

  it("swallows a storage that throws on write", () => {
    expect(() => rememberApplication(memoryStorage({}, "set"), "cursor", null)).not.toThrow();
    expect(() => rememberApplication(null, "cursor")).not.toThrow();
  });
});
