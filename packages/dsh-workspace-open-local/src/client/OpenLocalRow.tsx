import { createElement, type ReactElement } from "react";

/** One application the host can open a directory with. */
export interface OpenLocalApplication {
  readonly id: string;
  /** Display name; the id when the host has no name for it. */
  readonly label: string;
  /** Host icon route (what {@link openInAppIconRoute} produces). */
  readonly iconUrl: string;
}

/** Copy the row renders. Callers override per locale; Chinese is the default. */
export interface OpenLocalRowLabels {
  /** Primary button text. */
  readonly open: string;
  /**
   * Primary button tooltip template. `<app>` and `<path>` are filled with the
   * resolved application name and the directory, so a locale override stays a
   * string instead of a function the controller would have to rebuild.
   */
  readonly openTooltip: string;
  /** Accessible name of the icon button. */
  readonly choose: string;
  /** Icon button tooltip. */
  readonly chooseTooltip: string;
  /** Suffix on the remembered application's row. */
  readonly defaultMark: string;
  /** Announced while the catalog is still being read. */
  readonly loading: string;
}

/** What the controller hands the row. The row keeps none of this itself. */
export interface OpenLocalRowProps {
  /** Absolute path of the directory, used in the tooltip and accessible names. */
  readonly path: string;
  readonly applications: readonly OpenLocalApplication[];
  /** Remembered application id; the first application when null or unknown. */
  readonly defaultApplication?: string | null;
  /** Whether the application menu is expanded. */
  readonly menuOpen?: boolean;
  /** "launching" disables both segments and marks them busy. */
  readonly phase?: "idle" | "launching";
  /** Failure copy; null means none. */
  readonly error?: string | null;
  /** Locale overrides. Missing keys keep the Chinese default. */
  readonly labels?: Partial<OpenLocalRowLabels>;
  /** Primary click: open with the remembered application. */
  readonly onOpen?: () => void;
  /** Icon click. Receives the openness the click is asking for. */
  readonly onToggleMenu?: (open: boolean) => void;
  /** A menu row was chosen. Remembering is the controller's job. */
  readonly onPickApplication?: (applicationId: string) => void;
  /** Escape inside the menu. Outside clicks belong to the controller. */
  readonly onDismissMenu?: () => void;
}

/** Chinese copy, and the shape every override is merged into. */
export const OPEN_LOCAL_ROW_DEFAULT_LABELS: OpenLocalRowLabels = {
  open: "在本地打开",
  openTooltip: "用 <app> 打开 <path>",
  choose: "选择应用",
  chooseTooltip: "选择用来打开的应用",
  defaultMark: "（默认）",
  loading: "读取应用…",
};

/**
 * The application the primary action will use.
 *
 * A remembered id the catalog no longer contains (uninstalled, or a choice made
 * on another machine) must not disable the row: the first application is a
 * usable answer, and the menu still shows what was actually used.
 */
export function resolveDefaultApplication(
  applications: readonly OpenLocalApplication[],
  remembered: string | null | undefined,
): OpenLocalApplication | undefined {
  return applications.find((application) => application.id === remembered) ?? applications[0];
}

/** An arrow leaving a box: the "open elsewhere" glyph, stroked so it inherits color. */
function OpenIcon(): ReactElement {
  return createElement(
    "svg",
    {
      className: "olr-open-icon",
      width: 12,
      height: 12,
      viewBox: "0 0 12 12",
      fill: "none",
      "aria-hidden": true,
    },
    createElement("path", {
      d: "M4 2.5H2.5v7h7V8M6.5 2.5H9.5V5.5M9.3 2.7 5.5 6.5",
      stroke: "currentColor",
      strokeWidth: 1,
      strokeLinecap: "round",
      strokeLinejoin: "round",
    }),
  );
}

/** A downward chevron, the menu affordance. */
function ChevronIcon(): ReactElement {
  return createElement(
    "svg",
    { width: 10, height: 10, viewBox: "0 0 10 10", fill: "none", "aria-hidden": true },
    createElement("path", {
      d: "M2.5 4 5 6.5 7.5 4",
      stroke: "currentColor",
      strokeWidth: 1,
      strokeLinecap: "round",
      strokeLinejoin: "round",
    }),
  );
}

/**
 * The "open locally" split row.
 *
 * Returns nothing when the catalog is empty: a disabled row would promise an
 * action the host cannot perform (no local app, or an SSH session whose probe
 * came back empty), whereas absence says the capability is not here.
 */
export function OpenLocalRow(props: OpenLocalRowProps): ReactElement | null {
  const applications = props.applications;
  if (applications.length === 0) return null;

  const labels = { ...OPEN_LOCAL_ROW_DEFAULT_LABELS, ...props.labels };
  const preferred = resolveDefaultApplication(applications, props.defaultApplication);
  // The empty catalog already returned. Indexed access stays `T | undefined`
  // under noUncheckedIndexedAccess, so the fallback is named rather than asserted.
  if (preferred === undefined) return null;
  const launching = props.phase === "launching";
  const menuOpen = props.menuOpen === true;

  // The list stays out of the document while closed. Hiding it with
  // `display: none` would leave a role="menu" in the accessibility tree and in
  // every static snapshot, so "closed" and "absent" would be indistinguishable.
  const menu = menuOpen
    ? createElement(
        "div",
        {
          "data-testid": "open-local-menu",
          className: "olr-menu",
          role: "menu",
          "aria-label": labels.choose,
          onKeyDown: (event: { key: string }) => {
            if (event.key === "Escape") props.onDismissMenu?.();
          },
        },
        applications.map((application) => {
          const isDefault = application.id === preferred.id;
          return createElement(
            "button",
            {
              key: application.id,
              type: "button",
              className: "olr-app",
              role: "menuitemradio",
              "data-testid": "open-local-app",
              "data-app-id": application.id,
              "data-default": isDefault ? "true" : undefined,
              "aria-checked": isDefault,
              onClick: () => props.onPickApplication?.(application.id),
            },
            createElement("img", {
              className: "olr-app-icon",
              src: application.iconUrl,
              alt: "",
              width: 16,
              height: 16,
              draggable: false,
            }),
            createElement("span", { className: "olr-app-label" }, application.label),
            isDefault ? createElement("span", { className: "olr-app-default" }, labels.defaultMark) : null,
          );
        }),
      )
    : null;

  return createElement(
    "div",
    { className: "olr", "data-open-local-path": props.path },
    createElement(
      "div",
      { className: "olr-split", "data-phase": launching ? "launching" : "idle" },
      createElement(
        "button",
        {
          type: "button",
          className: "olr-main",
          "data-testid": "open-local-main",
          disabled: launching,
          "aria-busy": launching || undefined,
          title: labels.openTooltip.replace("<app>", preferred.label).replace("<path>", props.path),
          onClick: () => props.onOpen?.(),
        },
        createElement(OpenIcon),
        labels.open,
      ),
      createElement(
        "button",
        {
          type: "button",
          className: "olr-choose",
          "data-testid": "open-local-choose",
          disabled: launching,
          "aria-busy": launching || undefined,
          "aria-haspopup": "menu",
          "aria-expanded": menuOpen,
          "aria-label": labels.choose,
          title: labels.chooseTooltip,
          onClick: () => props.onToggleMenu?.(!menuOpen),
        },
        createElement(ChevronIcon),
      ),
    ),
    props.error ? createElement("span", { className: "olr-error", role: "alert" }, props.error) : null,
    menu,
  );
}
