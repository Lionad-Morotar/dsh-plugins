// Host half of dsh-better-keybindings. The Loader mounts both halves by
// package name, so this entry must resolve even though the fix lives entirely
// in the client half; apply stays empty until a host-side service is needed.
export const name = "dsh-better-keybindings";
export const inject: string[] = [];

export function apply(): void {}
