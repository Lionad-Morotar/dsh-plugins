export const PLACEHOLDER_COMMAND_NAME = "placeholder";
export const PLACEHOLDER_COMMAND_DESCRIPTION = "Append a user message without running the model";
export const PLACEHOLDER_USAGE = "用法：/placeholder <text>";

export type PlaceholderRequest =
  | { readonly ok: true; readonly text: string }
  | { readonly ok: false; readonly message: string };

export function parsePlaceholderInput(rawInput: string): PlaceholderRequest {
  const text = rawInput.trim();
  if (text.length === 0) return { ok: false, message: PLACEHOLDER_USAGE };
  return { ok: true, text };
}
