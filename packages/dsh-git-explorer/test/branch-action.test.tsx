// @vitest-environment jsdom
/**
 * The Session header's branch trigger, its popover, and the store that feeds
 * them.
 *
 * The component is mounted through `createRoot` under jsdom because the host
 * hands it a live DOM: the assertions are about rendered text, disabled rows and
 * what a click calls, not about a React element tree. The platform kit is
 * injected so a missing primitive path stays testable without the host.
 */
import { act, type ReactElement } from "react";
import { createPortal } from "react-dom";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { createBranchAction } from "../src/client/branch-action.tsx";
import { createBranchStore, type BranchListState, type BranchStoreFace } from "../src/client/branch-store.ts";
import { setBranchKitForTest, type BranchKit, type DismissHook } from "../src/client/platform.ts";
import type { GitBranchList } from "../src/host/types.ts";
import type { GitRemoteFace } from "../src/client/wire.ts";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const LIST: GitBranchList = {
  root: "/repo",
  isRepository: true,
  detached: false,
  headHash: null,
  branches: [
    { name: "main", hash: "a1", current: true },
    { name: "feature", hash: "b2", current: false },
    { name: "taken", hash: "c3", current: false, worktreePath: "/repo/.worktrees/taken" },
  ],
};

const NO_DISMISS: DismissHook = () => {};

const KIT: BranchKit = {
  IconBranch: props => <svg data-icon="branch" className={props.className} />,
  IconChevron: props => <svg data-icon="chevron" className={props.className} />,
  useAnchoredPosition: () => ({ left: 40, top: 80 }),
  useDismissOnOutsidePointer: NO_DISMISS,
  createPortal: (children, container) => createPortal(children, container),
};

const t = (key: string): string => key;

interface FakeStore {
  readonly store: BranchStoreFace;
  readonly switches: { sessionId: string; name: string }[];
  readonly loads: string[];
}

function createFakeStore(
  initial: BranchListState,
  decide: (name: string) => Promise<boolean> = () => Promise.resolve(true),
): FakeStore {
  let state = initial;
  const listeners = new Set<() => void>();
  const switches: { sessionId: string; name: string }[] = [];
  const loads: string[] = [];
  const emit = (): void => {
    for (const listener of [...listeners]) listener();
  };
  return {
    switches,
    loads,
    store: {
      subscribe(listener) {
        listeners.add(listener);
        return () => {
          listeners.delete(listener);
        };
      },
      getSnapshot: () => state,
      load(sessionId) {
        loads.push(sessionId);
        return Promise.resolve();
      },
      async switchTo(sessionId, name) {
        switches.push({ sessionId, name });
        const ok = await decide(name);
        if (ok) {
          state = {
            ...state,
            error: undefined,
            revision: state.revision + 1,
            list:
              state.list === undefined
                ? undefined
                : { ...state.list, branches: state.list.branches.map(branch => ({ ...branch, current: branch.name === name })) },
          };
        } else {
          state = { ...state, error: "boom" };
        }
        emit();
        return ok;
      },
      bump() {
        state = { ...state, revision: state.revision + 1 };
        emit();
      },
    },
  };
}

let container: HTMLDivElement;
let root: Root;

beforeEach(() => {
  setBranchKitForTest(KIT);
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
});

afterEach(async () => {
  await act(async () => {
    root.unmount();
  });
  container.remove();
  document.body.innerHTML = "";
  setBranchKitForTest(null);
});

async function mount(element: ReactElement): Promise<void> {
  await act(async () => {
    root.render(element);
  });
}

async function click(element: Element | null): Promise<void> {
  if (element === null) throw new Error("clicked element is missing");
  await act(async () => {
    element.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
    // The select handler awaits the store round trip before closing; give the
    // microtask queue one real turn so React sees the state change.
    await new Promise(resolve => setTimeout(resolve, 0));
  });
}

function trigger(): HTMLButtonElement | null {
  return document.querySelector<HTMLButtonElement>('[data-testid="gx-branch-trigger"]');
}

function panel(): HTMLElement | null {
  return document.querySelector<HTMLElement>('[data-testid="gx-branch-panel"]');
}

function row(name: string): HTMLButtonElement | null {
  return document.querySelector<HTMLButtonElement>(`[data-testid="gx-branch-row-${name}"]`);
}

async function renderReady(decide?: (name: string) => Promise<boolean>): Promise<FakeStore> {
  const fake = createFakeStore({ status: "ready", list: LIST, revision: 0, sessionId: "s1" }, decide);
  const Action = createBranchAction({ store: fake.store, t });
  await mount(<Action sessionId="s1" />);
  return fake;
}

describe("header branch action", () => {
  it("shows the current branch and reports a collapsed popover", async () => {
    await renderReady();

    const button = trigger();
    expect(button).not.toBeNull();
    expect(button?.textContent).toContain("main");
    expect(button?.getAttribute("aria-expanded")).toBe("false");
    expect(panel()).toBeNull();
  });

  it("renders nothing outside a Git repository", async () => {
    const fake = createFakeStore({
      status: "ready",
      revision: 0,
      sessionId: "s1",
      list: { ...LIST, isRepository: false, branches: [] },
    });
    const Action = createBranchAction({ store: fake.store, t });
    await mount(<Action sessionId="s1" />);

    expect(container.childElementCount).toBe(0);
    expect(trigger()).toBeNull();
  });

  it("lists the local branches on open and marks the checked out one", async () => {
    const fake = await renderReady();

    await click(trigger());

    expect(panel()).not.toBeNull();
    expect(fake.loads).toContain("s1");
    expect(row("main")).not.toBeNull();
    expect(row("feature")).not.toBeNull();
    expect(row("main")?.getAttribute("aria-current")).toBe("true");
    expect(row("main")?.getAttribute("data-current")).toBe("true");
    expect(row("feature")?.getAttribute("aria-current")).toBeNull();
  });

  it("switches on a row click, then closes and shows the new branch", async () => {
    const fake = await renderReady();

    await click(trigger());
    await click(row("feature"));

    expect(fake.switches).toEqual([{ sessionId: "s1", name: "feature" }]);
    expect(panel()).toBeNull();
    expect(trigger()?.textContent).toContain("feature");
    expect(trigger()?.getAttribute("aria-expanded")).toBe("false");
  });

  it("keeps the popover open with a readable message when the switch is refused", async () => {
    const fake = await renderReady(() => Promise.resolve(false));

    await click(trigger());
    await click(row("feature"));

    expect(fake.switches).toHaveLength(1);
    expect(panel()).not.toBeNull();
    expect(document.querySelector('[data-testid="gx-branch-error"]')?.textContent).toContain("boom");
    expect(trigger()?.textContent).toContain("main");
  });

  it("disables a branch another worktree already holds", async () => {
    await renderReady();

    await click(trigger());

    const taken = row("taken");
    expect(taken?.disabled).toBe(true);
    expect(taken?.title).toContain("/repo/.worktrees/taken");
    expect(row("feature")?.disabled).toBe(false);
  });

  it("labels a detached HEAD with the short hash and keeps every branch clickable", async () => {
    const detached: GitBranchList = {
      ...LIST,
      detached: true,
      headHash: "abc1234",
      branches: LIST.branches.map(branch => ({ ...branch, current: false })),
    };
    const fake = createFakeStore({ status: "ready", list: detached, revision: 0, sessionId: "s1" });
    const Action = createBranchAction({ store: fake.store, t });
    await mount(<Action sessionId="s1" />);

    expect(trigger()?.textContent).toContain("abc1234");
    expect(trigger()?.title).toContain("abc1234");

    await click(trigger());

    expect(row("main")?.disabled).toBe(false);
    expect(row("feature")?.disabled).toBe(false);
  });

  it("falls back to inline glyphs and a measured panel without the primitive kit", async () => {
    setBranchKitForTest({});
    const fake = createFakeStore({ status: "ready", list: LIST, revision: 0, sessionId: "s1" });
    const Action = createBranchAction({ store: fake.store, t });
    await mount(<Action sessionId="s1" />);

    expect(trigger()?.querySelector("svg")).not.toBeNull();
    await click(trigger());
    expect(panel()).not.toBeNull();
  });

  it("resets the popover when the session changes", async () => {
    const fake = createFakeStore({ status: "ready", list: LIST, revision: 0, sessionId: "s1" });
    const Action = createBranchAction({ store: fake.store, t });
    await mount(<Action sessionId="s1" />);
    await click(trigger());
    expect(panel()).not.toBeNull();

    await mount(<Action sessionId="s2" />);

    expect(panel()).toBeNull();
    expect(fake.loads).toContain("s2");
  });
});

describe("branch store", () => {
  function face(overrides: Partial<GitRemoteFace>): GitRemoteFace {
    return overrides as GitRemoteFace;
  }

  it("loads the inventory and keeps the snapshot reference stable", async () => {
    const store = createBranchStore(() =>
      face({
        branches: () => Promise.resolve({ ok: true, value: { ok: true, list: LIST } }),
      }),
    );

    const initial = store.getSnapshot();
    expect(store.getSnapshot()).toBe(initial);

    await store.load("s1");

    const ready = store.getSnapshot();
    expect(ready.status).toBe("ready");
    expect(ready.list?.branches).toHaveLength(3);
    expect(store.getSnapshot()).toBe(ready);
  });

  it("surfaces the host message and keeps the list when a switch is refused", async () => {
    const store = createBranchStore(() =>
      face({
        branches: () => Promise.resolve({ ok: true, value: { ok: true, list: LIST } }),
        switchBranch: () =>
          Promise.resolve({ ok: true, value: { ok: false, error: { code: "git-failed", message: "local changes" } } }),
      }),
    );
    await store.load("s1");
    const listed = store.getSnapshot().list;

    const switched = await store.switchTo("s1", "feature");

    expect(switched).toBe(false);
    expect(store.getSnapshot().error).toBe("local changes");
    expect(store.getSnapshot().list).toBe(listed);
  });

  it("marks the switched branch current and advances the revision", async () => {
    const store = createBranchStore(() =>
      face({
        branches: () => Promise.resolve({ ok: true, value: { ok: true, list: LIST } }),
        switchBranch: () => Promise.resolve({ ok: true, value: { ok: true, branch: "feature" } }),
      }),
    );
    await store.load("s1");
    const before = store.getSnapshot().revision;

    expect(await store.switchTo("s1", "feature")).toBe(true);

    const after = store.getSnapshot();
    expect(after.revision).toBe(before + 1);
    expect(after.error).toBeUndefined();
    expect(after.list?.branches.find(branch => branch.current)?.name).toBe("feature");
    expect(after.list?.detached).toBe(false);
  });

  it("reports a dismissed request without touching the list", async () => {
    const store = createBranchStore(() =>
      face({
        branches: () => Promise.resolve({ ok: true, value: { ok: true, list: LIST } }),
        switchBranch: () => Promise.resolve({ ok: false, error: { code: "gateway/offline", message: "offline" } }),
      }),
    );
    await store.load("s1");
    const listed = store.getSnapshot().list;

    expect(await store.switchTo("s1", "feature")).toBe(false);
    expect(store.getSnapshot().error).toBe("offline");
    expect(store.getSnapshot().list).toBe(listed);
  });
});
