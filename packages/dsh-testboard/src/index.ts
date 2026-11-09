// Host half of dsh-testboard. The Loader mounts both halves by package name,
// so this entry must resolve even though the tab lives entirely in the client
// bundle; apply stays empty until a host-side service is needed.
export const name = "dsh-testboard";
export const inject: string[] = [];

export function apply(): () => void {
  return () => {};
}

export default { name, inject, apply };
