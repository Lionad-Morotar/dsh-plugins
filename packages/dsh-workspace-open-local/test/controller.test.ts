/**
 * The row's phase machine, without a DOM. The cases pin the rules a click has
 * to obey: one launch at a time, the catalog read settles before anything is
 * clickable, and a failed launch does not overwrite the remembered choice.
 */
import { describe, expect, it, vi } from "vitest";

import { createRowController, ROW_ERROR_COPY, type RowView } from "../src/client/controller.ts";
import { OPEN_IN_APP_CHOICE_KEY, type OpenInAppHost, type StorageLike } from "../src/client/host-api.ts";

/** A promise whose settlement the test holds, since the target lib predates `Promise.withResolvers`. */
interface Deferred<T> {
  readonly promise: Promise<T>;
  resolve(value: T): void;
  reject(reason: unknown): void;
}

function deferred<T>(): Deferred<T> {
  let resolve: (value: T) => void = () => {};
  let reject: (reason: unknown) => void = () => {};
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

/** A host whose two calls the test resolves by hand. */
function deferredHost(): { host: OpenInAppHost; catalog: Deferred<string[]>; launch: Deferred<void> } {
  const catalog = deferred<string[]>();
  const launch = deferred<void>();
  const host: OpenInAppHost = {
    listApplications: () => catalog.promise,
    openDirectory: vi.fn(() => launch.promise),
    iconUrl: (id) => `open-in-app/icon/${id}`,
  };
  return { host, catalog, launch };
}

/** Memory storage that records the raw slot. */
function memory(): StorageLike & { raw: () => string | null } {
  const slots = new Map<string, string>();
  return {
    getItem: (key) => slots.get(key) ?? null,
    setItem: (key, value) => { slots.set(key, value); },
    raw: () => slots.get(OPEN_IN_APP_CHOICE_KEY) ?? null,
  };
}

/** Drive one controller and keep the latest view it published. */
function drive(host: OpenInAppHost, storage: StorageLike | null, remembered: string | null = null) {
  const views: RowView[] = [];
  const controller = createRowController({ host, storage, path: "/work/one", remembered, onChange: (view) => { views.push(view); } });
  return { controller, views };
}

async function settled(): Promise<void> {
  await Promise.resolve();
  await Promise.resolve();
}

describe("row controller", () => {
  it("reads the catalog once and settles on the remembered application", async () => {
    const { host, catalog } = deferredHost();
    const { controller, views } = drive(host, memory(), "cursor");

    controller.load();
    expect(views.at(-1)?.phase).toBe("loading");

    catalog.resolve(["code", "cursor"]);
    await settled();

    expect(views.at(-1)).toMatchObject({ phase: "idle", applications: ["code", "cursor"], defaultApplication: "cursor", error: null });
  });

  it("falls back to the first application when nothing is remembered", async () => {
    const { host, catalog } = deferredHost();
    const { controller, views } = drive(host, null);

    controller.load();
    catalog.resolve(["code", "cursor"]);
    await settled();

    expect(views.at(-1)?.defaultApplication).toBe("code");
  });

  it("shows the catalog failure and offers nothing to launch", async () => {
    const { host, catalog } = deferredHost();
    const { controller, views } = drive(host, null);

    controller.load();
    catalog.reject(new Error("down"));
    await settled();

    expect(views.at(-1)).toMatchObject({ phase: "error", applications: [], error: ROW_ERROR_COPY.catalog });
    controller.open();
    expect(host.openDirectory).not.toHaveBeenCalled();
  });

  it("opens with the default and remembers only after the launch succeeds", async () => {
    const { host, catalog, launch } = deferredHost();
    const storage = memory();
    const { controller, views } = drive(host, storage, "cursor");

    controller.load();
    catalog.resolve(["cursor"]);
    await settled();

    controller.open();
    expect(views.at(-1)?.phase).toBe("launching");
    expect(host.openDirectory).toHaveBeenCalledOnce();
    expect(host.openDirectory).toHaveBeenCalledWith("cursor", "/work/one");
    expect(storage.raw()).toBeNull();

    controller.open();
    expect(host.openDirectory).toHaveBeenCalledOnce();

    launch.resolve();
    await settled();

    expect(views.at(-1)?.phase).toBe("idle");
    expect(storage.raw()).toBe(JSON.stringify("cursor"));
  });

  it("reports a failed launch without writing the choice", async () => {
    const { host, catalog, launch } = deferredHost();
    const storage = memory();
    const { controller, views } = drive(host, storage);

    controller.load();
    catalog.resolve(["code"]);
    await settled();
    controller.open();
    launch.reject(new Error("busy"));
    await settled();

    expect(views.at(-1)).toMatchObject({ phase: "error", error: ROW_ERROR_COPY.launch });
    expect(storage.raw()).toBeNull();
  });

  it("remembers the application a menu pick launched", async () => {
    const { host, catalog, launch } = deferredHost();
    const storage = memory();
    const { controller } = drive(host, storage, "code");

    controller.load();
    catalog.resolve(["code", "cursor"]);
    await settled();
    controller.pick("cursor");
    launch.resolve();
    await settled();

    expect(host.openDirectory).toHaveBeenCalledWith("cursor", "/work/one");
    expect(storage.raw()).toBe(JSON.stringify("cursor"));
  });

  it("ignores a launch that settles after the row was disposed", async () => {
    const { host, catalog, launch } = deferredHost();
    const storage = memory();
    const { controller, views } = drive(host, storage);

    controller.load();
    catalog.resolve(["code"]);
    await settled();
    controller.open();
    controller.dispose();
    launch.resolve();
    await settled();

    expect(views.at(-1)?.phase).toBe("launching");
    expect(storage.raw()).toBeNull();
  });
});
