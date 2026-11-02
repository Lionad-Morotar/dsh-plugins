// Host half of dsh-fs-markdown.
//
// The whole feature is a browser surface: it registers a renderer into the
// file explorer's client registry and reads whole documents through that
// plugin's host channel. The Loader mounts both halves by package name, so
// this entry must resolve even though apply stays empty.
export const name = "dsh-fs-markdown";
export const inject: string[] = [];

export function apply(): void {}
