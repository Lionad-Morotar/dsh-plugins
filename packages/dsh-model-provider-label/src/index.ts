// Host half of dsh-model-provider-label. The Loader mounts both halves by
// package name, so this entry must resolve even though the label lives entirely
// in the client half; apply stays empty until a host-side service is needed.
export const name = "dsh-model-provider-label";
export const inject: string[] = [];

export function apply(): void {}
