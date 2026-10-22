# dsh-tui-copy

在 dsh-tui 里用 `/copy` 把最近几轮的最终回复放进系统剪贴板，省掉从终端里划选的动作。

## 用法

```
/copy          # 最近 1 轮的最终回复
/copy 3        # 最近 3 轮，从旧到新排列
/copy --all    # 一起复制你这些轮次的发言（默认只要回复）
/copy 2 --all  # 参数顺序随意
```

「一轮」指一次完整交流：你的提问与助手读完的那条回复。助手在一轮里可能调工具改成多条消息，只取该轮最后一条非空正文——也就是你实际读到的那条。轮次里没有正文回复的（例如刚被打断）会被跳过。

`--all` 只带上真人输入（`source.kind === 'user'`）；文件变更通知、技能正文、cron 通知那类注入的上下文不算你的发言，不会被带上。

回复以空行分隔，末尾不留换行，粘进编辑器就是干净的几段。

## 剪贴板路径

这三条路径没有一条处处管用，所以一次复制会把该环境能用的全都触发：

| 路径 | 何时触发 | 说明 |
| --- | --- | --- |
| `native` | 非 SSH 会话，按平台选工具 | macOS `pbcopy`、Windows `clip`、Linux 依次试 `wl-copy` / `xclip` / `xsel`；唯一能用退出码确认成功的路径 |
| `tmux-buffer` | `$TMUX` 存在 | `tmux load-buffer`，断线重连后缓冲仍在；iTerm2 下会去掉 `-w`，因为 tmux 自己的 OSC 52 会让 iTerm2 会话崩溃 |
| `osc52` | 总是 | 终端转义序列，能穿 SSH；iTerm2 默认关掉了它，VS Code 首次用会弹权限框，普通 tmux 需 `allow-passthrough on` 才转发，所以本机永远验证不了 |

Fire-and-forget 不是偷懒：本地 macOS + tmux 里，只发 tmux buffer 的话系统剪贴板没变（passthrough 默认关）；只发转义的话终端一忽略就什么都没有。任何单独一条都会让人粘到旧内容。

SSH 会话里绝不尝试 `native`：那会写远端机器的剪贴板，写了个寂寞。

只有转义发出、本机没有任何路径确认成功时，提示用警告色写明「仅经 OSC 52 转义发出，是否落地取决于终端设置」，不会假装完整成功。

## 安装

包根带 `dsh-plugin.json`（Community Draft 0.15），会把 `/copy` 作为声明式命令贡献给 TUI 并申请 `commands.invoke`。

**A. 以 profile 依赖安装（推荐）**

```json
// ~/.dsh/profiles/dsh-tui/package.json
{
  "dependencies": { "dsh-tui-copy": "link:/path/to/dsh-plugins/packages/dsh-tui-copy" },
  "dsh": { "profile": { "bundles": ["...", "dsh-tui-copy"] } }
}
```

然后 `dsh plugin --profile dsh-tui install`，重启 DSH。

**B. 手工 patch**

在 profile 的 `cordis.patch.yml` 末尾加：

```yaml
- insert:
    - id: dsh-tui-copy
      name: 'dsh-tui-copy'
```

## 实现要点

- `src/arguments.ts` 独占 `/copy` 的文法：无法解析就报用法，绝不猜一个「差不多」的范围去复制。
- `src/history.ts` 从会话日志选轮次并渲染，纯函数，不碰终端。
- `src/clipboard.ts` 是剪贴板三档路径，effects 全注入，每个分支都能在无终端环境下测。
- `src/command.ts` 组装命令；优先走宿主中介的 `tuiPluginHost.registerCommand`（命令会带插件身份，宿主能按 `commands.invoke` 逐插件管控），未准入时回落到 `commands.register`，让命令仍然可用。
- `src/index.ts` 是宿主半，`inject` 为空：服务缺失时要出我们自己的诊断，而不是让这一行静默不加载。

`lib/` 是构建产物且**要提交**：harness 从安装包直接读它，不会替你跑构建。改了 `src/` 就 `pnpm build` 再提交。

## 开发

```sh
pnpm build
pnpm test
pnpm typecheck
```

## 许可

MIT。
