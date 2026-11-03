/**
 * The name card: one small input that turns a typed name into a new entry.
 *
 * Two halves, deliberately separated. `validateEntryName` is a pure function so
 * the rules can be asserted without a DOM, and the card is a thin shell over it
 * that owns focus, the two keys that matter (Enter and Escape) and the error
 * line. The host validates the same rules again — this card is a convenience,
 * not the boundary.
 *
 * The card is not a modal dialog in the shell's sense: it is anchored to the
 * row the reader right-clicked and dismissed by Escape or by clicking away. That
 * is why it does not use the host's `Modal`, which would take over the page.
 */
import { useCallback, useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";

import type { Translate } from "./copy.ts";
import { resolveMenuKit } from "./platform.ts";

/** Longest name the card will let through; the host enforces the same bound. */
export const MAX_ENTRY_NAME = 200;

/** Why one typed name cannot become an entry. */
export type EntryNameProblem = "empty" | "dot" | "separator" | "too-long";

/** What one validation answered. */
export type EntryNameCheck =
  | { readonly ok: true; readonly name: string }
  | { readonly ok: false; readonly reason: EntryNameProblem };

/**
 * Whether one typed name can become an entry, and what to create.
 *
 * The four refusals are the four ways a name stops being a name: nothing at all,
 * a directory alias, a path separator (which would address a different
 * directory), and a length no filesystem accepts. The extension is the reader's
 * business: `Makefile` and `a.md` are both exactly what was typed.
 * @param raw - the name as typed.
 * @param kind - what is being created; the rules are the same for both today.
 * @returns the trimmed name, or the refusal.
 */
export function validateEntryName(raw: string, kind: "file" | "directory"): EntryNameCheck {
  void kind;
  const name = raw.trim();
  if (name === "") return { ok: false, reason: "empty" };
  if (name === "." || name === "..") return { ok: false, reason: "dot" };
  // NUL rides with the separators: it truncates a path in the C layer the
  // backend eventually calls, which is the same escape by another route.
  if (name.includes("/") || name.includes("\\") || name.includes("\u0000")) {
    return { ok: false, reason: "separator" };
  }
  if (name.length > MAX_ENTRY_NAME) return { ok: false, reason: "too-long" };
  return { ok: true, name };
}

/**
 * The name the card opens with, selected so typing replaces it.
 * @param kind - what is being created.
 * @returns a name its own validator accepts.
 */
export function defaultEntryName(kind: "file" | "directory"): string {
  return kind === "directory" ? "新建文件夹" : "untitled.md";
}

/** Props for one name card. */
export interface NamePromptProps {
  readonly kind: "file" | "directory";
  /** The directory the entry will land in, for the card's subtitle. */
  readonly parent: string;
  readonly t: Translate;
  /** Submit one name; the card stays open until the caller closes it. */
  readonly onSubmit: (name: string) => void;
  readonly onCancel: () => void;
  /** A refusal from the host, already translated; shown under the input. */
  readonly error?: string | undefined;
  /** A create is in flight: the input and the button are inert. */
  readonly busy?: boolean;
  /** The name the card opens with; defaults to the kind's suggestion. */
  readonly initialName?: string;
  /** The heading's copy key; defaults to the kind's own title. */
  readonly titleKey?: string;
  /** The submit button's copy key; defaults to `prompt.submit`. */
  readonly submitKey?: string;
}

/**
 * Render the name card.
 *
 * The input is the host's `Input` when the loader seeded one, because it carries
 * the shell's own focus ring and typography; otherwise it is a plain `<input>`
 * with this package's styles. Neither is imported statically: the primitive kit
 * is resolved at runtime and may not exist.
 * @param props - the kind, the parent, the copy and the two gestures.
 * @returns the card.
 */
export function NamePrompt({
  kind,
  parent,
  t,
  onSubmit,
  onCancel,
  error,
  busy = false,
  initialName,
  titleKey,
  submitKey,
}: NamePromptProps) {
  const [value, setValue] = useState(() => initialName ?? defaultEntryName(kind));
  const [localError, setLocalError] = useState<string | undefined>(undefined);
  const field = useRef<HTMLInputElement>(null);
  const kit = resolveMenuKit();

  // A card reused for a different subject must show that subject's name, not the
  // one it was first mounted with. The reset is keyed on the incoming name so a
  // reader's own edit is never overwritten by an unrelated parent render.
  useEffect(() => {
    if (initialName === undefined) return;
    setValue(initialName);
    setLocalError(undefined);
  }, [initialName]);

  // The default name is selected, not just present: a reader who types a name
  // should replace the suggestion rather than append to it.
  useEffect(() => {
    const element = field.current;
    if (element === null) return;
    element.focus();
    element.select();
  }, []);

  const submit = useCallback((): void => {
    if (busy) return;
    const checked = validateEntryName(value, kind);
    if (!checked.ok) {
      setLocalError(t(`prompt.error.${checked.reason}`));
      return;
    }
    setLocalError(undefined);
    onSubmit(checked.name);
  }, [busy, kind, onSubmit, t, value]);

  const onKeyDown = (event: ReactKeyboardEvent<HTMLElement>): void => {
    // An IME candidate window uses Enter to commit; submitting then would create
    // an entry from a half-composed name.
    if (event.nativeEvent.isComposing) return;
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      onCancel();
      return;
    }
    if (event.key === "Enter") {
      event.preventDefault();
      submit();
    }
  };

  const message = localError ?? error;
  const Input = kit.Input;
  const heading = titleKey ?? (kind === "directory" ? "prompt.title.folder" : "prompt.title.file");

  return (
    <div
      className="fx-name-prompt"
      role="dialog"
      aria-modal="false"
      aria-label={t(heading)}
      data-testid="fx-name-prompt"
      data-kind={kind}
      onKeyDown={onKeyDown}
    >
      <div className="fx-name-prompt-head">
        <strong>{t(heading)}</strong>
        <span className="fx-name-prompt-parent">{parent === "" ? t("prompt.root") : parent}</span>
      </div>
      {Input === undefined ? (
        <input
          ref={field}
          className="fx-name-input"
          type="text"
          value={value}
          disabled={busy}
          spellCheck={false}
          autoComplete="off"
          aria-label={t("prompt.input")}
          aria-invalid={message === undefined ? undefined : true}
          data-testid="fx-name-input"
          onChange={event => {
            setValue(event.target.value);
            setLocalError(undefined);
          }}
        />
      ) : (
        <Input
          ref={field}
          className="fx-name-input"
          value={value}
          disabled={busy}
          aria-label={t("prompt.input")}
          aria-invalid={message === undefined ? undefined : true}
          data-testid="fx-name-input"
          onChange={(event: { readonly target: { readonly value: string } }) => {
            setValue(event.target.value);
            setLocalError(undefined);
          }}
        />
      )}
      {message === undefined ? null : (
        <div className="fx-name-prompt-error" role="alert" data-testid="fx-name-error">
          {message}
        </div>
      )}
      <div className="fx-name-prompt-actions">
        <button type="button" className="fx-btn fx-btn-text" disabled={busy} onClick={onCancel}>
          {t("prompt.cancel")}
        </button>
        <button type="button" className="fx-btn fx-btn-primary" disabled={busy} onClick={submit}>
          {t(submitKey ?? "prompt.submit")}
        </button>
      </div>
    </div>
  );
}
