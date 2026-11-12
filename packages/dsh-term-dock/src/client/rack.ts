/**
 * Ownership ledger for the terminal views this plugin created.
 *
 * The host lets a view outlive its DOM (`mount()`'s detach keeps the process), so
 * somebody has to remember every view the dock started: a detached view that
 * nobody holds is an orphan process, and the plugin's own unload is the last
 * moment anyone can close them. `shell` never does that for us — the host's tab
 * hold belongs to the sidebar plugin and writing it from here would clear it.
 *
 * Views are keyed by `(scopeKey, panelId)` because the same panel id may be
 * reopened in another workspace-branch scope; the rack never hands one scope's
 * view to another. The host view itself is created under the scope's anchor
 * session, because the host terminal service is session-owned and one session has
 * to answer for a shared scope's processes.
 *
 * `contentId` carries the scope too: it is the identity the host persists a
 * terminal association under, and a page reload restarts panel ids from one — a
 * bare panel id would resurrect last visit's terminal from another branch into
 * this one.
 */
import type { TerminalBinding } from "./binding.ts";
import { createTerminalBinding } from "./binding.ts";
import type { DockHost, WebTerminalsFace } from "./host.ts";
import { CONTENT_ID_PREFIX } from "../shared.ts";

/** One live view and the binding the UI drives it through. */
interface RackEntry {
  readonly scopeKey: string;
  readonly panelId: string;
  readonly sessionId: string;
  readonly binding: TerminalBinding;
}

/** The rack the dock and the plugin disposer share. */
export interface TerminalRack {
  /**
   * Binding for one panel, creating the host view on first use.
   * @param scopeKey - workspace-branch scope the panel belongs to.
   * @param panelId - panel identity inside the dock.
   * @param sessionId - scope anchor that owns the host terminal.
   * @returns the binding, or undefined when the host has no terminal service.
   */
  open(scopeKey: string, panelId: string, sessionId: string): TerminalBinding | undefined;
  /** Drop one panel's view, terminating its process. */
  release(scopeKey: string, panelId: string): void;
  /** Terminate every view the plugin created. */
  closeAll(): void;
  /** Number of live views; diagnostics and tests only. */
  size(): number;
}

const keyOf = (scopeKey: string, panelId: string): string => `${scopeKey}\u0000${panelId}`;

/**
 * Create the rack for one plugin mount.
 * @param input - the host face that can mint terminal views.
 * @returns the ledger; empty until a panel asks for a binding.
 */
export function createTerminalRack({ host }: { host: Pick<DockHost, "terminals"> }): TerminalRack {
  const entries = new Map<string, RackEntry>();

  const releaseEntry = (key: string, entry: RackEntry): void => {
    entries.delete(key);
    entry.binding.close();
  };

  return {
    open(scopeKey, panelId, sessionId) {
      const key = keyOf(scopeKey, panelId);
      const existing = entries.get(key);
      if (existing !== undefined) return existing.binding;

      const terminals: WebTerminalsFace | undefined = host.terminals();
      if (terminals === undefined) return undefined;

      let view;
      try {
        view = terminals.view(sessionId, panelId, `${CONTENT_ID_PREFIX}:${scopeKey}:${panelId}`);
      } catch {
        return undefined;
      }
      const binding = createTerminalBinding({ view: () => view, key: `${scopeKey}:${panelId}` });
      entries.set(key, { scopeKey, panelId, sessionId, binding });
      return binding;
    },
    release(scopeKey, panelId) {
      const key = keyOf(scopeKey, panelId);
      const entry = entries.get(key);
      if (entry !== undefined) releaseEntry(key, entry);
    },
    closeAll() {
      for (const [key, entry] of [...entries]) releaseEntry(key, entry);
    },
    size: () => entries.size,
  };
}
