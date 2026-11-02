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
import {
  createBranchStore,
  getBranchStore,
  initBranchStore,
  type BranchListState,
  type BranchStoreFace,
} from "../src/client/branch-store.ts";
import { setBranchKitForTest, type BranchKit, type DismissHook } from "../src/client/platform.ts";
import { GIT_STYLES } from "../src/client/styles.ts";
import { watchBranchRevision } from "../src/client/view.tsx";
import type { GitBranchList, GitBranchListResult, GitSwitchResult } from "../src/host/types.ts";
import type { GitRemoteFace, RemoteResult } from "../src/client/wire.ts";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const CLEAN_WORKTREE = { dirty: false, additions: 0, deletions: 0, trackedFiles: 0, untrackedFiles: 0 };
const CLEAN_STASH = { stashed: false, restored: false };

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
  worktree: CLEAN_WORKTREE,
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

/** A promise a test resolves by hand, so two replies can be ordered at will. */
function deferred<T>(): { readonly promise: Promise<T>; resolve(value: T): void } {
  let settle!: (value: T) => void;
  const promise = new Promise<T>(resolve => {
    settle = resolve;
  });
  return { promise, resolve: settle };
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

async function renderReady(
  decide?: (name: string) => Promise<boolean>,
  list: GitBranchList = LIST,
): Promise<FakeStore> {
  const fake = createFakeStore({ status: "ready", list, revision: 0, sessionId: "s1" }, decide);
  const Action = createBranchAction({ store: fake.store, t });
  await mount(<Action sessionId="s1" />);
  return fake;
}

function searchBox(): HTMLInputElement | null {
  return document.querySelector<HTMLInputElement>('[data-testid="gx-branch-search"]');
}

async function typeQuery(value: string): Promise<void> {
  const input = searchBox();
  if (input === null) throw new Error("search box is missing");
  const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
  await act(async () => {
    // React tracks the value through the element instance; going through the
    // prototype setter makes the dispatched input event look like a real edit.
    setter?.call(input, value);
    input.dispatchEvent(new Event("input", { bubbles: true }));
  });
}

interface KeyModifiers {
  readonly metaKey?: boolean;
  readonly ctrlKey?: boolean;
  readonly altKey?: boolean;
  readonly isComposing?: boolean;
}

async function press(key: string, modifiers: KeyModifiers = {}): Promise<void> {
  const target: EventTarget = searchBox() ?? document;
  await act(async () => {
    target.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true, ...modifiers }));
    await new Promise(resolve => setTimeout(resolve, 0));
  });
}

function activeRow(): HTMLElement | null {
  return document.querySelector<HTMLElement>('[data-testid^="gx-branch-row-"][data-active="true"]');
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

  it("names the trigger, the dialog and the search seat for assistive tech", async () => {
    await renderReady();

    const button = trigger();
    expect(button?.getAttribute("aria-label")).toBe("branch.title: main");
    expect(button?.getAttribute("aria-haspopup")).toBe("dialog");
    expect(button?.getAttribute("aria-expanded")).toBe("false");

    await click(trigger());

    expect(trigger()?.getAttribute("aria-expanded")).toBe("true");
    expect(trigger()?.getAttribute("aria-controls")).toBe(panel()?.id);
    expect(panel()?.getAttribute("role")).toBe("dialog");
    expect(panel()?.getAttribute("aria-label")).toBe("branch.title");
    expect(searchBox()?.getAttribute("aria-label")).toBe("branch.search");
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

describe("branch popover search and keyboard", () => {
  it("focuses the search box on open and names it for assistive tech", async () => {
    await renderReady();

    await click(trigger());

    const input = searchBox();
    expect(input).not.toBeNull();
    expect(document.activeElement).toBe(input);
    expect(input?.placeholder).toBe("branch.search");
    expect(input?.getAttribute("aria-label")).toBe("branch.search");
    expect(input?.getAttribute("aria-expanded")).toBe("true");
  });

  it("filters on a case-insensitive subsequence and highlights every hit", async () => {
    await renderReady();
    await click(trigger());

    await typeQuery("mn");

    expect(row("main")).not.toBeNull();
    expect(row("feature")).toBeNull();
    expect(row("taken")).toBeNull();
    const hit = [...document.querySelectorAll(".gx-branch-match")].map(node => node.textContent).join("");
    expect(hit).toBe("mn");
    expect(activeRow()?.getAttribute("data-testid")).toBe("gx-branch-row-main");
  });

  it("moves the cursor with the arrow keys and switches the row Enter lands on", async () => {
    const fake = await renderReady();
    await click(trigger());
    expect(activeRow()?.getAttribute("data-testid")).toBe("gx-branch-row-main");

    await press("ArrowDown");

    expect(activeRow()?.getAttribute("data-testid")).toBe("gx-branch-row-feature");

    await press("Enter");

    expect(fake.switches).toEqual([{ sessionId: "s1", name: "feature" }]);
    expect(panel()).toBeNull();
    expect(document.activeElement).toBe(trigger());
  });

  it("skips a row another worktree holds in both directions", async () => {
    await renderReady(undefined, {
      ...LIST,
      branches: [LIST.branches[0]!, LIST.branches[2]!, LIST.branches[1]!],
    });
    await click(trigger());

    await press("ArrowDown");
    expect(activeRow()?.getAttribute("data-testid")).toBe("gx-branch-row-feature");
    expect(row("taken")?.getAttribute("data-active")).toBeNull();

    await press("ArrowUp");
    expect(activeRow()?.getAttribute("data-testid")).toBe("gx-branch-row-main");
  });

  it("keeps the cursor at the end instead of wrapping", async () => {
    await renderReady(undefined, {
      ...LIST,
      branches: [LIST.branches[0]!, LIST.branches[1]!],
    });
    await click(trigger());

    await press("ArrowDown");
    await press("ArrowDown");

    expect(activeRow()?.getAttribute("data-testid")).toBe("gx-branch-row-feature");
  });

  it("leaves modifier chords to the host shortcuts", async () => {
    const fake = await renderReady();
    await click(trigger());

    await press("ArrowDown", { metaKey: true });
    expect(activeRow()?.getAttribute("data-testid")).toBe("gx-branch-row-main");

    await press("Enter", { metaKey: true });
    expect(fake.switches).toHaveLength(0);
  });

  it("does not treat an IME confirmation as a switch", async () => {
    const fake = await renderReady();
    await click(trigger());

    await press("Enter", { isComposing: true });

    expect(fake.switches).toHaveLength(0);
    expect(panel()).not.toBeNull();
  });

  it("closes on Escape and hands focus back to the trigger", async () => {
    await renderReady();
    await click(trigger());

    await press("Escape");

    expect(panel()).toBeNull();
    expect(document.activeElement).toBe(trigger());
  });

  it("closes on Escape even when focus has fallen outside the search box", async () => {
    await renderReady();
    await click(trigger());
    expect(document.activeElement).toBe(searchBox());

    await act(async () => {
      (document.activeElement as HTMLElement | null)?.blur();
      document.body.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true, cancelable: true }));
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(panel()).toBeNull();
    expect(document.activeElement).toBe(trigger());
  });

  it("puts focus back into the search box on every open", async () => {
    await renderReady();
    await click(trigger());

    await press("Escape");
    await click(trigger());

    expect(document.activeElement).toBe(searchBox());
  });

  it("restores focus after an outside pointer closes the popover", async () => {
    setBranchKitForTest({});
    const fake = createFakeStore({ status: "ready", list: LIST, revision: 0, sessionId: "s1" });
    const Action = createBranchAction({ store: fake.store, t });
    await mount(<Action sessionId="s1" />);
    await click(trigger());
    expect(panel()).not.toBeNull();

    await act(async () => {
      document.body.dispatchEvent(new Event("pointerdown", { bubbles: true }));
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(panel()).toBeNull();
    expect(document.activeElement).toBe(trigger());
  });

  it("shows one centered hint when nothing matches and keeps Enter inert", async () => {
    const fake = await renderReady();
    await click(trigger());

    await typeQuery("zzz");

    expect(document.querySelector('[data-testid="gx-branch-no-match"]')?.textContent).toBe("branch.noMatch");
    expect(document.querySelectorAll('[data-testid^="gx-branch-row-"]')).toHaveLength(0);
    expect(activeRow()).toBeNull();

    await press("Enter");

    expect(fake.switches).toHaveLength(0);
    expect(panel()).not.toBeNull();
  });
});

describe("branch popover width and full names", () => {
  const LONG = "worktree-command-panel-restart-dsh";

  it("fixes the panel width and keeps the full name reachable from every row", async () => {
    await renderReady(undefined, {
      ...LIST,
      branches: [{ name: LONG, hash: "d4", current: false }, ...LIST.branches],
    });

    await click(trigger());

    expect(panel()?.style.width).toBe("320px");
    expect(panel()?.style.maxWidth).toContain("420px");
    expect(panel()?.style.maxWidth).toContain("100vw");
    expect(row(LONG)?.title).toBe(LONG);
    expect(row("taken")?.title).toContain("taken");
    expect(row("taken")?.title).toContain("/repo/.worktrees/taken");
  });

  it("keeps the stylesheet width fixed and clips names inside the row", () => {
    expect(GIT_STYLES).toMatch(/\.gx-branch-panel \{[^}]*width: 320px/u);
    expect(GIT_STYLES).toMatch(/\.gx-branch-row-name \{[^}]*text-overflow: ellipsis/u);
    expect(GIT_STYLES).toMatch(/\.gx-branch-row \{[^}]*box-sizing: border-box/u);
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
        switchBranch: () => Promise.resolve({ ok: true, value: { ok: true, branch: "feature", stash: CLEAN_STASH } }),
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

  // The store is shared across sessions, so a switch started in one session can
  // be answered after the header already belongs to another one. Its optimistic
  // patch and its error describe the old worktree and must not be adopted.

  const OTHER: GitBranchList = {
    ...LIST,
    root: "/other-repo",
    branches: [{ name: "trunk", hash: "e5", current: true }],
  };

  function storeWithDeferredReplies(
    switchReply: Promise<RemoteResult<GitSwitchResult>>,
    otherReply: Promise<RemoteResult<GitBranchListResult>>,
  ) {
    return createBranchStore(() =>
      face({
        branches: request =>
          request.sessionId === "s2"
            ? otherReply
            : Promise.resolve({ ok: true, value: { ok: true, list: LIST } }),
        switchBranch: () => switchReply,
      }),
    );
  }

  it("keeps the new session when a switch reply lands after the header moved", async () => {
    const switchReply = deferred<RemoteResult<GitSwitchResult>>();
    const otherReply = deferred<RemoteResult<GitBranchListResult>>();
    const store = storeWithDeferredReplies(switchReply.promise, otherReply.promise);

    await store.load("s1");
    const switching = store.switchTo("s1", "feature");
    const loading = store.load("s2");
    otherReply.resolve({ ok: true, value: { ok: true, list: OTHER } });
    await loading;
    const settled = store.getSnapshot();
    expect(settled.sessionId).toBe("s2");

    switchReply.resolve({ ok: true, value: { ok: true, branch: "feature", stash: CLEAN_STASH } });

    expect(await switching).toBe(true);
    expect(store.getSnapshot()).toBe(settled);
    expect(store.getSnapshot().list?.root).toBe("/other-repo");
    expect(store.getSnapshot().list?.branches.find(branch => branch.current)?.name).toBe("trunk");
  });

  it("does not paint a late refusal onto the new session", async () => {
    const switchReply = deferred<RemoteResult<GitSwitchResult>>();
    const otherReply = deferred<RemoteResult<GitBranchListResult>>();
    const store = storeWithDeferredReplies(switchReply.promise, otherReply.promise);

    await store.load("s1");
    const switching = store.switchTo("s1", "feature");
    const loading = store.load("s2");
    otherReply.resolve({ ok: true, value: { ok: true, list: OTHER } });
    await loading;
    const settled = store.getSnapshot();

    switchReply.resolve({ ok: true, value: { ok: false, error: { code: "git-failed", message: "local changes" } } });

    expect(await switching).toBe(false);
    expect(store.getSnapshot()).toBe(settled);
    expect(store.getSnapshot().error).toBeUndefined();
  });

  it("lets the new inventory land when a switch reply arrives during its load", async () => {
    const switchReply = deferred<RemoteResult<GitSwitchResult>>();
    const otherReply = deferred<RemoteResult<GitBranchListResult>>();
    const store = storeWithDeferredReplies(switchReply.promise, otherReply.promise);

    await store.load("s1");
    const switching = store.switchTo("s1", "feature");
    const loading = store.load("s2");
    const loadingState = store.getSnapshot();
    expect(loadingState.sessionId).toBe("s2");

    switchReply.resolve({ ok: true, value: { ok: true, branch: "feature", stash: CLEAN_STASH } });
    await switching;
    expect(store.getSnapshot()).toBe(loadingState);

    otherReply.resolve({ ok: true, value: { ok: true, list: OTHER } });
    await loading;

    const after = store.getSnapshot();
    expect(after.sessionId).toBe("s2");
    expect(after.status).toBe("ready");
    expect(after.list?.root).toBe("/other-repo");
    expect(after.list?.branches.find(branch => branch.current)?.name).toBe("trunk");
  });
});

describe("branch popover scope row", () => {
  it("names the worktree the switch applies to and keeps the full path in the title", async () => {
    const root = "/tmp/example-repo";
    await renderReady(undefined, { ...LIST, root });

    await click(trigger());

    const scope = document.querySelector<HTMLElement>('[data-testid="gx-branch-scope"]');
    expect(scope).not.toBeNull();
    expect(scope?.textContent).toContain("example-repo");
    expect(scope?.getAttribute("title")).toBe(root);
  });

  it("keeps the scope row on a detached HEAD", async () => {
    const root = "/tmp/example-repo";
    const detached: GitBranchList = {
      ...LIST,
      root,
      detached: true,
      headHash: "abc1234",
      branches: LIST.branches.map(branch => ({ ...branch, current: false })),
    };
    const fake = createFakeStore({ status: "ready", list: detached, revision: 0, sessionId: "s1" });
    const Action = createBranchAction({ store: fake.store, t });
    await mount(<Action sessionId="s1" />);

    await click(trigger());

    expect(document.querySelector('[data-testid="gx-branch-scope"]')?.textContent).toContain("example-repo");
  });

  it("clips the parent chain first so the repository name stays readable", async () => {
    await renderReady(undefined, { ...LIST, root: "/tmp/example-repo" });

    await click(trigger());

    const parent = document.querySelector(".gx-branch-scope-parent");
    const name = document.querySelector(".gx-branch-scope-name");
    expect(parent?.textContent).toBe("/tmp/");
    expect(name?.textContent).toBe("example-repo");
    expect(GIT_STYLES).toMatch(/\.gx-branch-scope-parent \{[^}]*text-overflow: ellipsis/u);
    expect(GIT_STYLES).toMatch(/\.gx-branch-scope-name \{[^}]*flex: none/u);
  });
});

describe("shared branch store", () => {
  it("installs the store it creates so the header and the view read the same one", () => {
    const first = createBranchStore(() => undefined);
    expect(getBranchStore()).toBe(first);

    const second = initBranchStore(() => undefined);
    expect(getBranchStore()).toBe(second);
    expect(getBranchStore()).not.toBe(first);
  });

  it("builds a fresh store per apply instead of reusing the previous state", () => {
    const first = initBranchStore(() => undefined);
    const second = createBranchStore(() => undefined);

    expect(first).not.toBe(second);
    expect(getBranchStore()).toBe(second);
  });
});

describe("branch revision watch", () => {
  function fakeRevision(start: number) {
    let revision = start;
    const listeners = new Set<() => void>();
    return {
      source: {
        subscribe(listener: () => void) {
          listeners.add(listener);
          return () => {
            listeners.delete(listener);
          };
        },
        getSnapshot: () => ({ revision }),
      },
      bumpRevision() {
        revision += 1;
        for (const listener of [...listeners]) listener();
      },
      notifyOnly() {
        for (const listener of [...listeners]) listener();
      },
      size: () => listeners.size,
    };
  }

  it("reloads once per revision change and ignores plain notifications", () => {
    const fake = fakeRevision(2);
    let calls = 0;

    const stop = watchBranchRevision(fake.source, () => {
      calls += 1;
    });

    // What the view already fetched at mount is not a change.
    expect(calls).toBe(0);

    fake.notifyOnly();
    expect(calls).toBe(0);

    fake.bumpRevision();
    expect(calls).toBe(1);

    stop();
  });

  it("subscribes on mount and unsubscribes on dispose", () => {
    const fake = fakeRevision(0);
    let calls = 0;

    const stop = watchBranchRevision(fake.source, () => {
      calls += 1;
    });
    expect(fake.size()).toBe(1);

    stop();
    expect(fake.size()).toBe(0);

    fake.bumpRevision();
    expect(calls).toBe(0);
  });

  it("stays inert without a store installed", () => {
    const stop = watchBranchRevision(undefined, () => {
      throw new Error("an absent store must not reload the view");
    });

    expect(typeof stop).toBe("function");
    expect(() => stop()).not.toThrow();
  });
});
