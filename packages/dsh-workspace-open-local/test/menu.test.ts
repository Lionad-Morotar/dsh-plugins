/**
 * The workspace menu rows.
 *
 * These cases pin the product rules rather than the host's plumbing: no rows
 * when there is no catalog, the remembered application first, the captured
 * directory passed through untouched, and the shared choice written only after
 * a launch succeeds.
 */
import { describe, expect, it, vi } from "vitest";

import {
  APPLICATION_ICON_KEY,
  resolveWorkspaceActions,
  type MenuActionLike,
  type WorkspaceTargetLike,
} from "../src/client/menu.ts";
import {
  OPEN_IN_APP_CHOICE_KEY,
  readRememberedApplication,
  type OpenInAppHost,
  type StorageLike,
} from "../src/client/host-api.ts";

const COPY = { open: "在本地打开", failed: "打开失败" };

const TARGET: WorkspaceTargetLike = {
  workspaceId: "ws-1",
  displayTitle: "work",
  path: "/Users/lionad/work",
};

/** A catalog read the test holds open. */
interface Deferred<T> {
  readonly promise: Promise<T>;
  settle(value: T): void;
}

function deferred<T>(): Deferred<T> {
  let settle: (value: T) => void = () => {};
  const promise = new Promise<T>((resolve) => {
    settle = resolve;
  });
  return { promise, settle };
}

/** A host face that records launches and the signal each catalog read got. */
function fakeHost(
  catalog: readonly string[] | Error,
  launch: (applicationId: string, path: string) => Promise<void> = async () => {},
): OpenInAppHost & { readonly launched: { applicationId: string; path: string }[]; readonly signals: (AbortSignal | undefined)[] } {
  const launched: { applicationId: string; path: string }[] = [];
  const signals: (AbortSignal | undefined)[] = [];
  return {
    launched,
    signals,
    async listApplications(signal) {
      signals.push(signal);
      if (catalog instanceof Error) throw catalog;
      return [...catalog];
    },
    async openDirectory(applicationId, path) {
      await launch(applicationId, path);
      launched.push({ applicationId, path });
    },
    iconUrl: (applicationId) => `open-in-app/icon/${applicationId}`,
  };
}

/** In-memory storage that can report its raw slot. */
function memory(seed: Record<string, string> = {}): StorageLike & { raw(): string | null } {
  const values = { ...seed };
  return {
    getItem: (key) => values[key] ?? null,
    setItem: (key, value) => {
      values[key] = value;
    },
    raw: () => values[OPEN_IN_APP_CHOICE_KEY] ?? null,
  };
}

/** The only child row, failing the test instead of returning undefined. */
function childOf(actions: readonly MenuActionLike[], index = 0): MenuActionLike {
  const parent = actions[0];
  if (parent === undefined) throw new Error("resolve returned no parent row");
  const child = parent.children?.[index];
  if (child === undefined) throw new Error(`parent row has no child at ${String(index)}`);
  return child;
}

describe("workspace menu rows", () => {
  it("offers one parent row and one child per application", async () => {
    const host = fakeHost(["finder", "cursor"]);
    const actions = await resolveWorkspaceActions(TARGET, new AbortController().signal, {
      host,
      storage: memory(),
      copy: COPY,
    });

    expect(actions).toHaveLength(1);
    const parent = actions[0];
    expect(parent).toMatchObject({
      id: "open-local.open",
      label: COPY.open,
      icon: { key: APPLICATION_ICON_KEY, src: "open-in-app/icon/finder" },
    });
    // A row with children must not run on click: the shared menu only expands it.
    expect(parent?.run).toBeUndefined();

    expect(parent?.children?.map((row) => row.id)).toEqual(["app:finder", "app:cursor"]);
    expect(parent?.children?.map((row) => row.label)).toEqual(["finder", "cursor"]);
    expect(parent?.children?.map((row) => row.icon?.src)).toEqual([
      "open-in-app/icon/finder",
      "open-in-app/icon/cursor",
    ]);
    expect(parent?.children?.every((row) => row.failureLabel === COPY.failed)).toBe(true);
    expect(host.launched).toEqual([]);
  });

  it("renders no rows when the host resolves no application", async () => {
    await expect(
      resolveWorkspaceActions(TARGET, new AbortController().signal, {
        host: fakeHost([]),
        storage: memory(),
        copy: COPY,
      }),
    ).resolves.toEqual([]);
  });

  it("stays quiet when the catalog read fails", async () => {
    const host = fakeHost(new Error("no capability"));
    await expect(
      resolveWorkspaceActions(TARGET, new AbortController().signal, { host, storage: memory(), copy: COPY }),
    ).resolves.toEqual([]);
  });

  it("leads with the remembered application and keeps the rest in catalog order", async () => {
    const actions = await resolveWorkspaceActions(TARGET, new AbortController().signal, {
      host: fakeHost(["finder", "cursor", "terminal"]),
      storage: memory({ [OPEN_IN_APP_CHOICE_KEY]: '"cursor"' }),
      copy: COPY,
    });

    expect(actions[0]?.children?.map((row) => row.label)).toEqual(["cursor", "finder", "terminal"]);
    expect(actions[0]?.icon?.src).toBe("open-in-app/icon/cursor");
  });

  it("ignores a remembered application the catalog no longer lists", async () => {
    const actions = await resolveWorkspaceActions(TARGET, new AbortController().signal, {
      host: fakeHost(["finder", "cursor"]),
      storage: memory({ [OPEN_IN_APP_CHOICE_KEY]: '"gone"' }),
      copy: COPY,
    });

    expect(actions[0]?.children?.map((row) => row.label)).toEqual(["finder", "cursor"]);
  });

  it("opens the captured directory and remembers only after the launch succeeded", async () => {
    const storage = memory({ [OPEN_IN_APP_CHOICE_KEY]: '"finder"' });
    const host = fakeHost(["finder", "cursor"]);
    const actions = await resolveWorkspaceActions(TARGET, new AbortController().signal, {
      host,
      storage,
      copy: COPY,
    });

    await childOf(actions, 1).run?.();

    expect(host.launched).toEqual([{ applicationId: "cursor", path: TARGET.path }]);
    expect(readRememberedApplication(storage)).toBe("cursor");
  });

  it("rejects a failed launch and keeps the previous choice", async () => {
    const storage = memory({ [OPEN_IN_APP_CHOICE_KEY]: '"finder"' });
    const failure = new Error("launch refused");
    const host = fakeHost(["finder", "cursor"], async () => {
      throw failure;
    });
    const actions = await resolveWorkspaceActions(TARGET, new AbortController().signal, {
      host,
      storage,
      copy: COPY,
    });

    await expect(childOf(actions, 1).run?.()).rejects.toBe(failure);
    expect(readRememberedApplication(storage)).toBe("finder");
    expect(host.launched).toEqual([]);
  });

  it("forwards the resolution signal to the catalog read", async () => {
    const host = fakeHost(["finder"]);
    const controller = new AbortController();
    await resolveWorkspaceActions(TARGET, controller.signal, { host, storage: memory(), copy: COPY });

    expect(host.signals[0]).toBe(controller.signal);
  });

  it("drops its rows when the menu closes before the catalog settles", async () => {
    const catalog = deferred<string[]>();
    const host: OpenInAppHost = {
      listApplications: vi.fn(() => catalog.promise),
      openDirectory: async () => {},
      iconUrl: (applicationId) => applicationId,
    };
    const controller = new AbortController();
    const pending = resolveWorkspaceActions(TARGET, controller.signal, { host, storage: memory(), copy: COPY });

    controller.abort();
    catalog.settle(["cursor"]);

    await expect(pending).resolves.toEqual([]);
  });
});
