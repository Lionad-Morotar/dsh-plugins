// 宿主半。Loader 按包名挂载两半，所以这个入口必须能解析，即使这一片的全部
// 工作都在客户端半；apply 保持为空，等真的需要宿主服务再填。
export const name = "dsh-sequential-chords";
export const inject: string[] = [];

export function apply(): void {}
