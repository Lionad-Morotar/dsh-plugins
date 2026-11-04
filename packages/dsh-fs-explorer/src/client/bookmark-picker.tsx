/**
 * The bookmark destination picker: choose which group a bookmark goes into.
 *
 * One card, one level at a time. The reader starts at the root and walks down
 * through groups; the breadcrumb walks back up. Every level offers the two
 * actions that make sense there, "add/move it here" and "make a group", so an
 * empty group is still a usable destination rather than a dead end.
 *
 * The tree is the model's, not this card's: every commit hands a whole new tree
 * back to the caller, which is what keeps the store's optimistic copy and the
 * saved copy one value instead of two that can drift.
 */
import { useCallback, useEffect, useRef, useState } from "react";

import type { BookmarkGroup, BookmarkNode, BookmarkTree } from "../bookmarks.ts";
import { findNode, insertNode, makeNode, moveNode } from "./bookmarks-model.ts";
import type { Translate } from "./copy.ts";
import { NamePrompt } from "./name-prompt.tsx";

/** What the picker is being opened for. */
export type BookmarkPickerMode = "add" | "move";

/** The row being bookmarked, when the picker is adding one. */
export interface BookmarkPickerTarget {
  readonly name: string;
  readonly path: string;
  readonly kind: "file" | "directory";
}

/** Props for one picker. */
export interface BookmarkPickerProps {
  readonly tree: BookmarkTree;
  readonly target: BookmarkPickerTarget | undefined;
  readonly t: Translate;
  readonly mode: BookmarkPickerMode;
  /** The node being moved, in move mode. */
  readonly node?: BookmarkNode;
  /** Hand the new tree back; the caller persists it. */
  readonly onCommit: (next: BookmarkTree) => void;
  readonly onClose: () => void;
}

/** One id nothing else will collide with. */
function newId(): string {
  const uuid = globalThis.crypto?.randomUUID;
  if (typeof uuid === "function") return uuid.call(globalThis.crypto);
  return `bm-${String(Date.now())}-${Math.random().toString(36).slice(2)}`;
}

/**
 * The groups on the path from the root to one group, outermost first.
 *
 * The breadcrumb is built from this rather than from a stored trail, so a group
 * renamed or moved elsewhere still reads correctly.
 */
function trailTo(tree: BookmarkTree, groupId: string | null): BookmarkGroup[] {
  if (groupId === null) return [];
  const trail: BookmarkGroup[] = [];
  const walk = (nodes: readonly BookmarkNode[], path: BookmarkGroup[]): boolean => {
    for (const node of nodes) {
      if (node.kind !== "group") continue;
      const next = [...path, node];
      if (node.id === groupId) {
        trail.push(...next);
        return true;
      }
      if (walk(node.children, next)) return true;
    }
    return false;
  };
  walk(tree.roots, []);
  return trail;
}

/**
 * Render the destination picker.
 * @param props - the tree, what is being placed, and the two gestures.
 * @returns the card.
 */
export function BookmarkPicker({ tree, target, t, mode, node, onCommit, onClose }: BookmarkPickerProps) {
  const [current, setCurrent] = useState<string | null>(null);
  // The tree as this card has edited it. A group created here has to exist
  // before the caller persists anything, or the reader would be naming a
  // destination that is not on screen yet.
  const [draft, setDraft] = useState<BookmarkTree>(tree);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const card = useRef<HTMLDivElement>(null);

  // A click outside closes the card. The pointerdown is captured on the
  // document because the card is positioned over the panel, not inside it.
  useEffect(() => {
    const onPointerDown = (event: PointerEvent): void => {
      if (!(event.target instanceof Node)) return;
      if (card.current?.contains(event.target) === true) return;
      onClose();
    };
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key !== "Escape" || event.isComposing) return;
      // Escape belongs to the name card while it is open, not to this one.
      if (creating) return;
      event.preventDefault();
      event.stopPropagation();
      onClose();
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown, true);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown, true);
    };
  }, [creating, onClose]);

  /** The groups directly inside the current level. */
  const levelGroups = (): readonly BookmarkGroup[] => {
    const children = current === null ? draft.roots : (findNode(draft, current)?.kind === "group" ? (findNode(draft, current) as BookmarkGroup).children : []);
    return children.filter((child): child is BookmarkGroup => child.kind === "group");
  };

  /** Place the bookmark, or the moved node, in the current level. */
  const commitHere = useCallback((): void => {
    try {
      if (mode === "move") {
        if (node === undefined) return;
        onCommit(moveNode(draft, node.id, current));
        return;
      }
      if (target === undefined) return;
      const created = makeNode(target.kind === "directory" ? "folder" : "file", {
        id: newId(),
        name: target.name,
        path: target.path,
        createdAt: Date.now(),
      });
      onCommit(insertNode(draft, current, created));
    } catch (failure) {
      // The model refuses a move into the node's own subtree; that refusal is a
      // sentence the reader can act on, not a crash.
      setError(failure instanceof Error ? failure.message : String(failure));
    }
  }, [current, draft, mode, node, onCommit, target]);

  /** Create one group inside the current level and step into it. */
  const createGroup = (name: string): void => {
    try {
      const created = makeNode("group", { id: newId(), name, createdAt: Date.now() });
      const next = insertNode(draft, current, created);
      setDraft(next);
      setCreating(false);
      setError(undefined);
      // Step into the group just made: the reader's next click is almost always
      // "put it in there", and making them find it again would be busywork.
      setCurrent(created.id);
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : String(failure));
    }
  };

  const trail = trailTo(draft, current);
  const heading = mode === "move" ? t("bookmarks.picker.move") : t("bookmarks.picker.add");
  const here = mode === "move" ? t("bookmarks.picker.moveHere") : t("bookmarks.picker.addHere");

  return (
    <div
      ref={card}
      className="fx-bookmark-picker"
      role="dialog"
      aria-modal="false"
      aria-label={heading}
      data-testid="fx-bookmark-picker"
      data-mode={mode}
    >
      <div className="fx-bookmark-picker-head">
        <strong>{heading}</strong>
        {mode === "add" && target !== undefined ? (
          <span className="fx-bookmark-picker-target">{target.name}</span>
        ) : null}
        {mode === "move" && node !== undefined ? (
          <span className="fx-bookmark-picker-target">{node.name}</span>
        ) : null}
      </div>

      <nav className="fx-bookmark-crumbs" aria-label={t("bookmarks.picker.root")}>
        <button
          type="button"
          className="fx-bookmark-crumb"
          data-testid="fx-bookmark-crumb"
          onClick={() => setCurrent(null)}
        >
          {t("bookmarks.picker.root")}
        </button>
        {trail.map(group => (
          <button
            key={group.id}
            type="button"
            className="fx-bookmark-crumb"
            data-testid="fx-bookmark-crumb"
            onClick={() => setCurrent(group.id)}
          >
            {group.name}
          </button>
        ))}
      </nav>

      <div className="fx-bookmark-picker-list" role="group">
        {levelGroups().length === 0 ? (
          <span className="fx-bookmark-empty">{t("bookmarks.picker.empty")}</span>
        ) : (
          levelGroups().map(group => (
            <button
              key={group.id}
              type="button"
              className="fx-bookmark-item"
              data-testid="fx-bookmark-picker-group"
              onClick={() => setCurrent(group.id)}
            >
              <span className="fx-bookmark-name">{group.name}</span>
            </button>
          ))
        )}
      </div>

      {error === undefined ? null : (
        <div className="fx-name-prompt-error" role="alert" data-testid="fx-bookmark-picker-error">
          {error}
        </div>
      )}

      {creating ? (
        <NamePrompt
          kind="directory"
          parent={current ?? ""}
          t={t}
          initialName={t("bookmarks.newGroup")}
          titleKey="bookmarks.newGroup"
          onSubmit={createGroup}
          onCancel={() => setCreating(false)}
        />
      ) : (
        <div className="fx-bookmark-picker-actions">
          <button type="button" className="fx-btn fx-btn-text" onClick={() => setCreating(true)}>
            {t("bookmarks.newGroup")}
          </button>
          <button
            type="button"
            className="fx-btn fx-btn-primary"
            data-testid="fx-bookmark-picker-commit"
            onClick={commitHere}
          >
            {here}
          </button>
        </div>
      )}
    </div>
  );
}
