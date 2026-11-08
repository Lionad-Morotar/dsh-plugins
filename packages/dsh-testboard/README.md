# dsh-testboard

会话顶栏的「测试」tab：在「对话 / 文件 / Git / 架构」这一排再加一个标签（order 130），用来浏览当前工作区的测试清单与结果。

当前是骨架切片：标签已经注册并渲染占位内容，数据层与完整 UI 由后续切片补齐。

## 安装

```jsonc
// ~/.dsh/profiles/web/package.json
{
  "dependencies": {
    "dsh-testboard": "link:<checkout>/packages/dsh-testboard"
  },
  "dsh": { "profile": { "bundles": ["…", "dsh-testboard"] } }
}
```

```yaml
# ~/.dsh/profiles/web/cordis.patch.yml
- insert:
    - id: testboard
      name: 'dsh-testboard'
```

`dsh plugin --profile web install` 后重启宿主；desktop 用插件管理器装同一个 `link:` 路径。主入口是会话顶栏的 `conversation.view`，跟文件、Git 与架构同一排。

## 开发命令

```bash
node packages/dsh-testboard/scripts/build.mjs      # 产出 lib/index.js、lib/client.js、lib/client.snapshot.js
node packages/dsh-testboard/scripts/snapshot.mjs   # 重新生成数据快照
node packages/dsh-testboard/scripts/snapshot.mjs --check   # 校验已提交快照是否过期
cd packages/dsh-testboard && ../../node_modules/.bin/vitest run
cd packages/dsh-testboard && ../../node_modules/.bin/tsc -p tsconfig.json
```

worktree 里 `node_modules` 是指向主仓的软链，不要跑 `pnpm install` / `pnpm run`：那会反向改写主仓的 workspace 链接。

## 数据快照

`src/client/data/snapshot.json` 由 `scripts/snapshot.mjs` 扫描本仓 `packages/*/test/**/*.test.{ts,tsx}` 生成，抽取 `it` / `test` 的用例标题（含 `.only` / `.skip` / `.each` 形态），按 `path + name` 的 hash 播种出确定性的状态与耗时。

- 状态与耗时是**合成的**，快照里 `statusSource: "synthetic"` 明写这一点。本包不跑测试。
- 约 0.7% 用例标为 failed、1.2% 标为 skipped，用来让红色语义在界面上真的出现。
- 生成过程不读时钟、不写绝对路径、不用随机数：同一份语料在任一台机器上重算都是同样的字节，所以改动只会以真实差异出现在 diff 里。
- 改了测试文件之后要重跑 `snapshot.mjs`，`--check` 会在快照过期时 exit 1。

数据在 `lib/client.snapshot.js` 这个懒 chunk 里，首次打开标签才拉取，启动包不含任何快照字段（构建会断言 `statusSource` 不在 `lib/client.js` 里）。

## 静态原型边界

这个包读的是静态数据快照，不是实时结果：

- 没有后端，不跑测试，不订阅任何进程或文件变更。
- 没有实时刷新；数据变化要重新加载视图才看得到。
- 不写工作区文件，也不改会话状态。

## lib 是提交入库的产物

宿主安装态不跑构建，直接读 `lib/`。改 `src/` 之后必须重跑上面那条 build 命令再提交，否则线上跑的还是旧代码。`lib/client.js` 有 32KB 启动预算，超了构建直接失败：它每次页面启动都会求值，跟标签有没有被打开无关。
