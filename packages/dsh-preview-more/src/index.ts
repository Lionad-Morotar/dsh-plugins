// Host half of dsh-preview-more. The preview plumbing lives entirely in the
// browser half: the document registry, the keyed slot body and the
// better-sidebar viewer are all client services. This entry has to resolve
// because the Loader mounts both halves by package name, so it declares the
// name and stays empty until a host-side service is actually needed.
export const name = "dsh-preview-more";
export const inject: string[] = [];

export function apply(): void {}
