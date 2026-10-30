/**
 * The address bridge: the host's own file surfaces land in this view.
 *
 * Every native way of opening a file — a chat file link, a tool row's
 * `file:line`, an `@` reference, a present card — goes through
 * `ctx.sidebarRight.openResource(address)`, which asks the tab-type registry
 * which type claims that address. Without a claimant the reader gets the
 * built-in document preview in a sidebar tab; with this bridge the address
 * becomes a focus request on the file workbench, so the file opens in the same
 * tree, panel stack and binary-family renderer the reader uses everywhere else.
 *
 * The tab registered here is a forwarding tab: it exists for one commit, hands
 * its address to the view and closes itself. That is why the body renders
 * nothing — there is no state worth drawing between the mount and the close.
 * Two consequences are deliberate: the column may flash between the two
 * surfaces (not addressed here), and a session mismatch leaves the tab standing
 * rather than opening another session's file inside this one's view, because a
 * wrong file is worse than a visible tab.
 *
 * What this file may claim is an allow-list, never a block-list: a suffix is
 * forwarded only when this view renders it at least as well as the host, and
 * the host's stronger previews are excluded even when they are text. A block
 * list would silently claim every future format.
 */
import { createElement, useEffect, useRef } from "react";

import { baseName, parseSessionFileAddress } from "dsh-preview-viewers/address.ts";
import { claimedExtensions } from "dsh-preview-viewers/formats.ts";

import { isAbsolutePath } from "./model.ts";
import { PACKAGE_NAME, VIEW_ID } from "../shared.ts";

/** Identity of the forwarding tab type in the host's registry. */
export const BRIDGE_TYPE_ID = "dsh-fs-explorer:bridge";

/** The kind this bridge declares; also what `tab.kind` reads on a forwarded tab. */
export const BRIDGE_KIND = "fs-explorer-bridge";

/** Address glob the host ranks tab types by. */
export const BRIDGE_PATTERN = "dsh-resource://file/**";

/** Slot a tab type's body registers under. */
const SIDEBAR_TAB_SLOT = "sidebar.right.pane.tab";

/**
 * Suffixes this view previews as text, unioned from the package's own language
 * table and the host's editor vocabulary.
 *
 * `csv`, `tsv` and `svg` are text and appear here on purpose: they are also in
 * {@link HOST_STRONG_SUFFIXES}, so they exercise the rule that the exclusion
 * wins over this list instead of hiding it behind an omission.
 */
const TEXT_SUFFIXES: ReadonlySet<string> = new Set([
  // Documents
  "md", "markdown", "mdx", "mdown", "rst", "adoc", "txt", "text", "log",
  // Data
  "json", "jsonc", "json5", "jsonl", "ndjson", "yml", "yaml", "toml", "xml", "csv", "tsv",
  // Code
  "ts", "tsx", "mts", "cts", "js", "jsx", "mjs", "cjs", "vue", "svelte", "astro",
  "py", "pyi", "rb", "go", "rs", "java", "kt", "kts", "scala", "clj", "cljs",
  "c", "cc", "cpp", "cxx", "h", "hh", "hpp", "cs", "fs", "fsx", "php", "swift",
  "m", "mm", "lua", "r", "pl", "sql", "graphql", "gql", "proto",
  // Shell
  "sh", "bash", "zsh", "fish", "ps1", "bat", "cmd",
  // Style and markup
  "css", "scss", "sass", "less", "styl", "html", "htm", "svg",
  // Configuration, including the dotfile suffixes the editor treats as one
  "ini", "cfg", "conf", "env", "properties",
  "gitignore", "gitattributes", "gitmodules", "npmrc", "nvmrc",
  "editorconfig", "prettierrc", "eslintrc", "browserslistrc",
  // Generated text
  "lock", "diff", "patch",
]);

/** Suffixes the host renders better than this view, whatever else says. */
const HOST_STRONG_SUFFIXES: ReadonlySet<string> = new Set([
  "pdf", "docx", "pptx", "xlsx", "xls", "fods", "csv", "tsv",
  "png", "jpg", "jpeg", "gif", "webp", "svg", "bmp", "ico",
  "doc", "ppt",
]);

/** Suffix-less basenames this view still previews as text. */
const TEXT_NAMES: ReadonlySet<string> = new Set(["makefile", "dockerfile", "license", "readme", "changelog"]);

/** Every suffix this view can render, from the two catalogues it owns. */
const BRIDGE_SUFFIXES: ReadonlySet<string> = new Set([...claimedExtensions(), ...TEXT_SUFFIXES]);

/**
 * The suffix of one basename.
 *
 * A leading dot is the whole name rather than an extension, so `.gitignore`
 * answers `gitignore`: that is the spelling the editor vocabulary lists, and
 * treating it as extensionless would send every dotfile to the name whitelist.
 */
function suffixOf(name: string): string {
  const dot = name.lastIndexOf(".");
  return dot < 0 ? "" : name.slice(dot + 1).toLowerCase();
}

/**
 * Whether this view may take one file over from the host.
 *
 * The decision is the allow-list plus one exception: the host's own renderers
 * beat this view for the suffixes in {@link HOST_STRONG_SUFFIXES}, so a file
 * whose suffix appears in both catalogues stays with the host. Both halves run
 * on the basename, because a directory named `notes.txt.d` must not decide the
 * file's fate.
 * @param path - decoded path or bare filename.
 * @returns true when the address bridge should claim the file.
 */
export function canBridgeFile(path: string): boolean {
  if (typeof path !== "string" || path === "") return false;
  const name = baseName(path).toLowerCase();
  if (name === "") return false;
  const suffix = suffixOf(name);
  if (HOST_STRONG_SUFFIXES.has(suffix)) return false;
  if (TEXT_NAMES.has(name)) return true;
  return BRIDGE_SUFFIXES.has(suffix);
}

/** Read the optional `line` the address query or fragment carries. */
function lineOfAddress(address: string): number | undefined {
  const cut = address.search(/[?#]/u);
  if (cut < 0) return undefined;
  const match = /[?&#]line=(\d+)/u.exec(address.slice(cut));
  if (match === null) return undefined;
  return Math.max(1, Number.parseInt(match[1] ?? "", 10));
}

/** The first usable line number: the caller's, then the address's, then line 1. */
function pickLine(explicit: number | undefined, fromAddress: number | undefined): number {
  for (const candidate of [explicit, fromAddress]) {
    if (typeof candidate === "number" && Number.isFinite(candidate) && candidate >= 1) return Math.trunc(candidate);
  }
  return 1;
}

/**
 * Turn one host file address into the focus string this view consumes.
 *
 * The address grammar is the shared package's `parseSessionFileAddress`, not a
 * second parser written here: the host's own rules decide what a path segment
 * means, and two readers that disagree would address two different files.
 *
 * A session address carries a workspace-relative path or an absolute one, and
 * the leading slash is the only difference between them — `path:` strips it, so
 * an absolute target has to travel as `abs:`. The line comes from the caller
 * (a tab's `navigation.params.line`) and otherwise from the address query.
 * @param address - a `dsh-resource://file/session/<id>/<path>` address.
 * @param line - the 1-based line the opener asked for, if any.
 * @returns the focus string, or undefined when the address is not a readable file.
 */
export function focusForFileAddress(address: string, line?: number): string | undefined {
  if (typeof address !== "string") return undefined;
  const parsed = parseSessionFileAddress(address);
  if (parsed === null) return undefined;
  const path = parsed.path.replace(/\\/gu, "/");
  if (path === "") return undefined;
  const chosen = pickLine(line, lineOfAddress(address));
  return `${isAbsolutePath(path) ? "abs:" : "path:"}${path}:${String(chosen)}`;
}

/** Why a forwarded tab was left standing. */
export type BridgeKeepReason =
  | "no-address"
  | "not-a-file-address"
  | "no-session"
  | "other-session"
  | "refused";

/** What one mounted forwarding tab should do. */
export type BridgeDecision =
  | { readonly action: "open"; readonly focus: string }
  | { readonly action: "keep"; readonly reason: BridgeKeepReason };

/**
 * Decide whether one tab's address may be forwarded.
 *
 * Kept pure and separate from the body so every refusal — no address, a foreign
 * session, an unreadable format — is unit-testable without a renderer. The
 * session comparison is the safety property: the host records the address of
 * whichever conversation opened the file, and this view reads through one
 * session's workspace root, so forwarding a foreign address would show a
 * different file with the right name.
 * @param address - the tab's `contentId`, if it has one.
 * @param currentSessionId - the session on screen.
 * @param line - the line the opener asked for.
 * @returns the focus to open, or the reason to keep the tab.
 */
export function decideBridge(
  address: string | undefined,
  currentSessionId: string | undefined,
  line?: number,
): BridgeDecision {
  if (address === undefined || address === "") return { action: "keep", reason: "no-address" };
  const parsed = parseSessionFileAddress(address);
  if (parsed === null) return { action: "keep", reason: "not-a-file-address" };
  if (currentSessionId === undefined) return { action: "keep", reason: "no-session" };
  if (parsed.sessionId !== currentSessionId) return { action: "keep", reason: "other-session" };
  if (!canBridgeFile(parsed.path)) return { action: "keep", reason: "refused" };
  const focus = focusForFileAddress(address, line);
  if (focus === undefined) return { action: "keep", reason: "not-a-file-address" };
  return { action: "open", focus };
}

/** The tab-type registry face this bridge registers into. */
export interface SidebarRightTabsFace {
  register(definition: SidebarRightTabType): () => void;
  /** Ranked claimants for one address; absent on hosts that do not publish it. */
  candidates?(address: string): readonly SidebarRightTabType[];
}

/** One tab-type declaration, as the host reads it. */
export interface SidebarRightTabType {
  readonly id: string;
  readonly kind: string;
  readonly patterns?: readonly string[];
  readonly priority?: string;
  readonly canOpen?: (address: string) => boolean;
  readonly title: (address: string) => string;
}

/** The navigation controller face this bridge closes its own tab through. */
export interface SidebarRightFace {
  close(tabId: string): void;
}

/** The slice of the client context this bridge probes. */
export interface BridgeContextLike {
  readonly slots: {
    inject(slot: string, factory: () => () => void): unknown;
    register(options: Record<string, unknown>, component: unknown): () => void;
  };
  readonly sidebarRightTabs?: unknown;
  readonly sidebarRight?: unknown;
  get?(name: string): unknown;
  inject?(services: string[], callback: (scope: InjectionScopeLike) => (() => void) | void): unknown;
}

/** The scope Cordis hands an injection callback. */
export interface InjectionScopeLike {
  get?(name: string): unknown;
}

/** The slice of the workbench service the bridge drives. */
export interface BridgeWorkbenchFace {
  currentSessionId(): string | undefined;
  openViewOrSwitch(id: string, focus?: string): { readonly opened: boolean; readonly focused: boolean };
  openView?(id: string, focus?: string): boolean;
  readonly viewFocus?: {
    request?(view: string, focus: string): void;
    take(view: string): string | undefined;
  };
}

/** The record fields one mounted tab carries, as far as this bridge reads them. */
export interface BridgeTabLike {
  readonly id?: string;
  /** The record's address field; the fallbacks cover a renamed host build. */
  readonly contentId?: string;
  readonly address?: string;
  readonly record?: { readonly contentId?: string };
  readonly navigation?: { readonly params?: { readonly line?: unknown } };
}

/** What the host's slot-owned reader answers for one mounted tab. */
export interface BridgeTabInfo {
  readonly tab?: BridgeTabLike;
}

/** The reader the host injects into a tab body as a prop. */
export type BridgeTabInfoHook = () => BridgeTabInfo | undefined;

/** One diagnostic line, prefixed so the console attributes it to this package. */
function warn(message: string, detail?: unknown): void {
  if (detail === undefined) console.warn(`[${PACKAGE_NAME}] ${message}`);
  else console.warn(`[${PACKAGE_NAME}] ${message}`, detail);
}

/**
 * One debug line for a state the host may legitimately be in.
 *
 * A deployment without the right sidebar is not a defect — the workbench view
 * still works — so it is reported at the level a reader has to ask for.
 */
function debug(message: string): void {
  console.debug(`[${PACKAGE_NAME}] ${message}`);
}

/** Whether a value is the tab-type registry rather than a Cordis stub. */
function isTabsFace(value: unknown): value is SidebarRightTabsFace {
  return value !== null && typeof value === "object" && typeof (value as { register?: unknown }).register === "function";
}

/** Whether a value is the navigation controller rather than a Cordis stub. */
function isNavigationFace(value: unknown): value is SidebarRightFace {
  return value !== null && typeof value === "object" && typeof (value as { close?: unknown }).close === "function";
}

/**
 * Read one optional host service without trusting the read itself.
 *
 * A service this plugin did not declare in `inject` answers with a guarded
 * facade that throws on its first member access, so the probe has to treat a
 * throw exactly like an absent service: the bridge is an enhancement and must
 * never take the view registration down with it.
 */
function probe<T>(read: () => unknown, guard: (value: unknown) => value is T): T | undefined {
  try {
    const value = read();
    return guard(value) ? value : undefined;
  } catch {
    return undefined;
  }
}

function tabsOf(ctx: BridgeContextLike): SidebarRightTabsFace | undefined {
  return (
    probe(() => ctx.sidebarRightTabs, isTabsFace) ??
    probe(() => (typeof ctx.get === "function" ? ctx.get("sidebarRightTabs") : undefined), isTabsFace)
  );
}

function navigationOf(ctx: BridgeContextLike): SidebarRightFace | undefined {
  return (
    probe(() => ctx.sidebarRight, isNavigationFace) ??
    probe(() => (typeof ctx.get === "function" ? ctx.get("sidebarRight") : undefined), isNavigationFace)
  );
}

/** Coerce an unknown disposer into a callable one. */
function asDisposer(value: unknown): () => void {
  return typeof value === "function" ? (value as () => void) : () => {};
}

/** A sample address used to ask the registry who else claims this glob. */
const PROBE_ADDRESS = "dsh-resource://file/session/probe/src/main.ts";

/**
 * Warn when another extension-band type already claims the same glob.
 *
 * The bands rank first and the glob length second, so two types claiming
 * `dsh-resource://file/**` tie and registration order decides — which is not
 * something this package can promise. Saying so at boot is the only honest
 * move: refusing to register would take the bridge away from every host that
 * merely has a better-behaved neighbour.
 */
function warnOnRivalClaim(tabs: SidebarRightTabsFace): void {
  const rivals = probe(
    () => {
      const candidates = typeof tabs.candidates === "function" ? tabs.candidates(PROBE_ADDRESS) : [];
      return candidates.filter(type => type.priority === "extension" && type.id !== BRIDGE_TYPE_ID);
    },
    (value): value is SidebarRightTabType[] => Array.isArray(value) && value.length > 0,
  );
  if (rivals === undefined) return;
  warn(
    `another extension-band tab type already claims ${BRIDGE_PATTERN}: ${rivals
      .map(type => String(type.id))
      .join(", ")}; ranking falls back to registration order, so a file link may still land there`,
  );
}

/** The address a tab carries, whichever field the host build names it. */
function addressOf(tab: BridgeTabLike | undefined): string | undefined {
  for (const candidate of [tab?.contentId, tab?.record?.contentId, tab?.address]) {
    if (typeof candidate === "string" && candidate !== "") return candidate;
  }
  return undefined;
}

/** The line the opener recorded for this tab, if any. */
function lineOfParams(tab: BridgeTabLike | undefined): number | undefined {
  const raw = tab?.navigation?.params?.line;
  if (typeof raw === "number" && Number.isFinite(raw) && raw >= 1) return Math.trunc(raw);
  if (typeof raw === "string" && /^\d+$/u.test(raw)) return Math.max(1, Number.parseInt(raw, 10));
  return undefined;
}

/**
 * Switch to this view and hand it one focus.
 *
 * The queued copy goes first, and it is dropped again on both settled
 * outcomes: delivered through the host's seam, or not delivered at all. The
 * reason is the fallback seam — the host's own view switcher changes the view
 * but has no way to carry a focus, so a request that is not queued first is
 * lost exactly when the view is not mounted yet, which is the normal case for a
 * link clicked from chat; and a request left behind by a failed switch would
 * replay on the view's next unrelated mount.
 *
 * `openView` is tried when the newer seam is missing because it delivers the
 * focus itself and answers whether it switched; a host that exposes neither
 * leaves the tab standing, which is what the caller checks.
 * @param workbench - the workbench service.
 * @param focus - the focus string.
 * @returns whether the view took the request.
 */
function switchTo(workbench: BridgeWorkbenchFace, focus: string): { opened: boolean; focused: boolean } {
  const queue = workbench.viewFocus;
  queue?.request?.(VIEW_ID, focus);
  if (typeof workbench.openViewOrSwitch === "function") {
    const result = workbench.openViewOrSwitch(VIEW_ID, focus);
    // Delivered through the seam, or nothing will ever consume it: either way
    // the queued copy must go, so a stale focus cannot replay on the next mount.
    if (!result.opened || result.focused) queue?.take(VIEW_ID);
    return result;
  }
  if (typeof workbench.openView === "function" && workbench.openView(VIEW_ID, focus)) {
    queue?.take(VIEW_ID);
    return { opened: true, focused: true };
  }
  queue?.take(VIEW_ID);
  return { opened: false, focused: false };
}

/**
 * Forward one address to the view and close the tab it arrived in.
 *
 * Exported because it is the bridge's whole side-effect surface: the body only
 * decides *whether* to call it, and a test can drive this half with two fakes.
 * @param workbench - the workbench service.
 * @param navigation - the sidebar controller that closes the tab.
 * @param tabId - the forwarding tab to close.
 * @param focus - the focus string the view consumes.
 * @returns whether the tab was closed.
 */
export function forwardFocus(
  workbench: BridgeWorkbenchFace,
  navigation: SidebarRightFace,
  tabId: string,
  focus: string,
): boolean {
  let result: { opened: boolean; focused: boolean };
  try {
    result = switchTo(workbench, focus);
  } catch (error) {
    // The switch runs inside the sidebar's content tree; a throwing seam must
    // leave the reader with the tab rather than blank the column.
    warn("the file workbench threw while switching views", error);
    workbench.viewFocus?.take(VIEW_ID);
    return false;
  }
  if (!result.opened) {
    warn(`the file workbench did not switch to ${VIEW_ID}; the tab stays as the reader's only route to the file`);
    return false;
  }
  try {
    navigation.close(tabId);
    return true;
  } catch (error) {
    // The tab may already be gone (a reader closed it while the switch ran), and
    // that is not a failure worth surfacing.
    warn("the forwarded tab could not be closed", error);
    return false;
  }
}

/**
 * Build the body a forwarded tab mounts.
 *
 * The host injects the tab reader as a prop, so a body without it has nothing
 * to read the address from: that mount logs once and renders nothing rather
 * than throwing inside the sidebar's content tree.
 * @param workbench - the workbench service.
 * @param navigation - the sidebar controller that closes the tab.
 * @returns the component to register under the bridge's type id.
 */
function createBridgeBody(workbench: BridgeWorkbenchFace, navigation: SidebarRightFace) {
  /**
   * The inner body, split out so `useTabInfo` is called unconditionally: a
   * conditional hook would break the moment the host stops injecting it.
   */
  function ForwardingBody({ useTabInfo }: { readonly useTabInfo: BridgeTabInfoHook }) {
    const info = useTabInfo();
    const tab = info?.tab;
    const tabId = typeof tab?.id === "string" && tab.id !== "" ? tab.id : undefined;
    const address = addressOf(tab);
    const line = lineOfParams(tab);
    const handled = useRef<string | undefined>(undefined);

    useEffect(() => {
      if (tabId === undefined) {
        warn("a forwarded tab arrived without an id; it cannot be closed after the switch");
        return;
      }
      if (handled.current === tabId) return;
      // Recorded before the decision so a refusal is logged once rather than on
      // every render; the tab stays up in every refusal branch.
      handled.current = tabId;
      const decision = decideBridge(address, workbench.currentSessionId(), line);
      if (decision.action !== "open") {
        warn(`left the forwarded tab standing (${decision.reason})`, address);
        return;
      }
      forwardFocus(workbench, navigation, tabId, decision.focus);
    }, [tabId, address, line]);

    return null;
  }

  /** The registered body: it only checks that the host injected its reader. */
  return function AddressBridgeBody(props: { readonly useTabInfo?: BridgeTabInfoHook }) {
    if (typeof props.useTabInfo !== "function") {
      warn(`the host did not inject useTabInfo into ${SIDEBAR_TAB_SLOT}; the bridge cannot forward`);
      return null;
    }
    return createElement(ForwardingBody, { useTabInfo: props.useTabInfo });
  };
}

/**
 * Register the forwarding tab type and its body.
 *
 * Both services are optional: a host without the right sidebar simply never
 * runs this, and the view keeps working. The callback form of `ctx.inject` is
 * used when the services are not mounted yet, because sampling once would miss
 * a sidebar that loads after this plugin.
 * @param ctx - the client context this plugin was applied to.
 * @param workbench - the workbench service.
 * @returns a disposer; a no-op when the host has no right sidebar.
 */
export function registerAddressBridge(ctx: BridgeContextLike, workbench: BridgeWorkbenchFace): () => void {
  const attach = (
    tabs: SidebarRightTabsFace | undefined,
    navigation: SidebarRightFace | undefined,
  ): (() => void) | undefined => {
    if (tabs === undefined || navigation === undefined) return undefined;
    warnOnRivalClaim(tabs);
    let offType: () => void;
    try {
      offType = tabs.register({
        id: BRIDGE_TYPE_ID,
        kind: BRIDGE_KIND,
        patterns: [BRIDGE_PATTERN],
        priority: "extension",
        // The host hands `canOpen` the whole address, so the policy reads the
        // path out of it first; the allow-list itself stays `canBridgeFile`.
        canOpen: (address: string) => {
          const parsed = parseSessionFileAddress(address);
          return parsed !== null && canBridgeFile(parsed.path);
        },
        title: (address: string) => baseName(parseSessionFileAddress(address)?.path ?? address) || address,
      });
    } catch (error) {
      // A second registration of one id throws; a repeat apply on a live host
      // meets its own earlier type. The bridge it registered is still mounted,
      // so the missing half is this one only.
      warn("the sidebar right refused the address bridge tab type", error);
      return undefined;
    }
    const Body = createBridgeBody(workbench, navigation);
    let offBody: () => void;
    try {
      offBody = asDisposer(
        ctx.slots.inject(SIDEBAR_TAB_SLOT, () =>
          ctx.slots.register({ name: SIDEBAR_TAB_SLOT, key: BRIDGE_TYPE_ID }, Body),
        ),
      );
    } catch (error) {
      // The tab type is already in the registry here, and a half registration is
      // worse than none: the type would claim every file address while nothing
      // can mount its body, and the next apply would meet it as a duplicate id.
      // Withdraw the type before giving up so the failure leaves no trace.
      offType();
      warn("the sidebar right refused the address bridge body", error);
      return undefined;
    }
    return () => {
      offBody();
      offType();
    };
  };

  // Two probe orders, because a service this plugin did not declare in `inject`
  // answers with a facade that throws until it is mounted: sample the context
  // first for the host that already has it, then wait on `ctx.inject` for the
  // one whose sidebar loads later. Sampling once and giving up would miss that
  // second host entirely.
  const tabs = tabsOf(ctx);
  const navigation = navigationOf(ctx);
  if (tabs !== undefined && navigation !== undefined) {
    // A refusal here is already reported; there is no second chance to take.
    return attach(tabs, navigation) ?? (() => {});
  }

  const inject = ctx.inject;
  if (typeof inject !== "function") {
    debug("the right sidebar is not mounted, so the address bridge stays unregistered");
    return () => {};
  }
  const off = inject.call(ctx, ["sidebarRightTabs", "sidebarRight"], (scope: InjectionScopeLike) => {
    const scopedTabs = probe(() => scope.get?.("sidebarRightTabs"), isTabsFace) ?? tabsOf(scope as BridgeContextLike);
    const scopedNavigation =
      probe(() => scope.get?.("sidebarRight"), isNavigationFace) ?? navigationOf(scope as BridgeContextLike);
    return attach(scopedTabs, scopedNavigation);
  });
  return asDisposer(off);
}
