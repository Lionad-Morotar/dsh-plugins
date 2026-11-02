/**
 * The preview's failure block, shared by both preview paths.
 *
 * A text page and a binary family file fail for the same reasons and are read by
 * the same person, so they paint the same block: the classified title, its
 * description, the host's own message when there is one, and one retry gesture.
 * Keeping it here is what lets the family chunks — which cannot import the pane,
 * because the pane is the entry that fetches them — reuse it instead of
 * shipping a second copy of the copy table.
 *
 * The classification itself stays in `preview.ts`; this module only renders a
 * decision someone else already made.
 */
import type { ReactElement } from "react";

import type { Translate } from "./copy.ts";
import type { PreviewFailure } from "./preview.ts";

function failureTitle(failure: PreviewFailure, t: Translate): string {
  switch (failure.kind) {
    case "deleted":
      return t("preview.deleted.title");
    case "denied":
      return t("preview.denied.title");
    case "symlink":
      return t("preview.symlink.title");
    case "binary":
      return t("preview.binary.title");
    case "commit-binary":
      return t("preview.commitBinary.title");
    case "submodule":
      return t("preview.submodule.title");
    case "too-large":
      return t("preview.tooLarge.title");
    case "unavailable":
      return t("preview.unavailable.title");
    default:
      return t("preview.unknown.title");
  }
}

function failureDescription(failure: PreviewFailure, t: Translate): string {
  switch (failure.kind) {
    case "deleted":
      return t("preview.deleted.description");
    case "denied":
      return t("preview.denied.description");
    case "symlink":
      return t("preview.symlink.description");
    case "binary":
      return t("preview.binary.description");
    case "commit-binary":
      return t("preview.commitBinary.description");
    case "submodule":
      return t("preview.submodule.description");
    case "too-large":
      return t("preview.tooLarge.description");
    case "unavailable":
      return t("preview.unavailable.description");
    default:
      return t("preview.unknown.description");
  }
}

/** Props of one failure block. */
export interface PreviewFailureViewProps {
  readonly failure: PreviewFailure;
  readonly t: Translate;
  readonly onRetry: () => void;
}

/**
 * Render one classified failure.
 * @param props - the classification, the translator and the retry gesture.
 * @returns the failure block.
 */
export function PreviewFailureView({ failure, t, onRetry }: PreviewFailureViewProps): ReactElement {
  return (
    <div className="fx-empty" data-state="failed" data-testid="fs-preview-failed" data-kind={failure.kind}>
      <strong>{failureTitle(failure, t)}</strong>
      <span>{failureDescription(failure, t)}</span>
      {failure.message === "" ? null : <code className="fx-preview-hint">{failure.message}</code>}
      <button type="button" className="fx-btn" onClick={onRetry} data-testid="fs-preview-retry">
        {t("preview.retry")}
      </button>
    </div>
  );
}

/** The loading block both paths paint while their read is in flight. */
export function PreviewLoadingView({ t }: { readonly t: Translate }): ReactElement {
  return (
    <div className="fx-loading" data-testid="fs-preview-loading">
      <span className="fx-spinner" aria-hidden="true" />
      {t("preview.loading")}
    </div>
  );
}
