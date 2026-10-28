/**
 * Registration constants and the preset catalog, kept free of React so they can
 * be asserted without a renderer.
 *
 * The section id is `mcp` (the settings nav's address) while the settings
 * namespace stays `more-config` (the Loader row id). They differ on purpose:
 * the nav label the user sees is "MCP", while every config path and the
 * reconciler's event filter keep using the row id.
 */

/** The settings nav slot this panel registers a section into. */
export const SECTION_SLOT = "settings.section";

/** The section's id in the settings nav. */
export const SECTION_ID = "mcp";

/** Position in the settings nav; 0 is the shipped General section. */
export const SECTION_ORDER = 10;

/** Locale namespace owned by this plugin's client half. */
export const LOCALE_NAMESPACE = "more-config";

/** The settings namespace this panel reads and writes (the Loader row id). */
export const SETTINGS_NAMESPACE = "more-config";

/** The shadow's single field, as the settings path ops address it. */
export const TIMEOUTS_FIELD = "mcpTimeouts";

/** One offered (entryId, timeoutMs) pair, for the servers this install actually runs. */
export interface TimeoutPreset {
  readonly key: string;
  readonly entryId: string;
  readonly timeoutMs: number;
  readonly labelKey: string;
}

/**
 * The presets this plugin ships, distilled from the timeout races actually
 * observed: kimi's video tool needs 11 minutes of headroom, its image tool 6.
 * Entry ids are profile row ids; `/mcp-timeout` with an unknown name lists the
 * live ones, and the panel copy says so.
 */
export const PRESETS: readonly TimeoutPreset[] = [
  { key: "kimi-video", entryId: "mcp-kimi-tools", timeoutMs: 660_000, labelKey: "preset.kimiVideo" },
  { key: "kimi-image", entryId: "mcp-kimi-tools", timeoutMs: 360_000, labelKey: "preset.kimiImage" },
];
