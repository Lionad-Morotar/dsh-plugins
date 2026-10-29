/**
 * Ownership ledger for the terminal views this plugin created.
 *
 * The host lets a view outlive its DOM (`mount()`'s detach keeps the process), so
 * somebody has to remember every view the dock started: a detached view that
 * nobody holds is an orphan process, and the plugin's own unload is the last
 * moment anyone can close them. `shell` never does that for us — the host's tab
 * hold belongs to the sidebar plugin and writing it from here would clear it.
 *
 * Views are keyed by `(sessionId, panelId)` because the same panel id may be
 * reopened in another session; the rack never hands one session's view to
 * another.
 */
import type { TerminalBinding } from "./binding.ts";
import { createTerminalBinding } from "./binding.ts";
import type { DockHost, WebTerminalsFace } from "./host.ts";
import { CONTENT_ID_PREFIX } from "../shared.ts";

/** One live view and the binding the UI drives it through. */
interface RackEntry {
  readonly sessionId: string;
  readonly panelId: string;
  readonly binding: TerminalBinding;
}

/** The rack the dock and the plugin disposer share. */
export interface TerminalRack {
  /** Binding for one panel, creating the host view on first use. */
  open(sessionId: string, panelId: string): TerminalBinding | undefined;
  /** Drop one panel's view, terminating its process. */
  release(sessionId: string, panelId: string): void;
  /** Terminate every view the plugin created. */
  closeAll(): void;
  /** Number of live views; diagnostics and tests only. */
  size(): number;
}

const keyOf = (sessionId: string, panelId: string): string => `${sessionId}\u0000${panelId}`;

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
    open(sessionId, panelId) {
      const key = keyOf(sessionId, panelId);
      const existing = entries.get(key);
      if (existing !== undefined) return existing.binding;

      const terminals: WebTerminalsFace | undefined = host.terminals();
      if (terminals === undefined) return undefined;

      let view;
      try {
        view = terminals.view(sessionId, panelId, `${CONTENT_ID_PREFIX}:${panelId}`);
      } catch {
        return undefined;
      }
      const binding = createTerminalBinding({ view: () => view, key: `${sessionId}:${panelId}` });
      entries.set(key, { sessionId, panelId, binding });
      return binding;
    },
    release(sessionId, panelId) {
      const key = keyOf(sessionId, panelId);
      const entry = entries.get(key);
      if (entry !== undefined) releaseEntry(key, entry);
    },
    closeAll() {
      for (const [key, entry] of [...entries]) releaseEntry(key, entry);
    },
    size: () => entries.size,
  };
}
