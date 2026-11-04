// Host half of dsh-workspace-open-local. The Loader mounts both halves by
// package name, so this entry must resolve even though the feature lives
// entirely in the client half; apply stays empty until a host-side service
// is needed.
export const name = "dsh-workspace-open-local";
export const inject: string[] = [];

export function apply(): void {}
