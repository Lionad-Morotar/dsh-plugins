// Host half of dsh-command-panel. The Loader mounts both halves by package name,
// so the host entry must resolve even though the whole plugin lives in the
// client half; apply stays empty until a host-side service is actually needed.
export const name = "dsh-command-panel";
export const inject: string[] = [];

export function apply(): void {}
