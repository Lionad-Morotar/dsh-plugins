# dsh-better

为原生 DeepSeek Harness 增加能力。当前提供一个功能：`/model` 选择器支持按供应商搜索。

## 解决的问题

原生 `/model` 的搜索框只匹配模型名。你的 profile 里往往有多个供应商（如 `deepseek-account`、`deepseek-official`），它们的模型常常同名，于是输入供应商名时列表直接显示"没有匹配的模型"——即使该供应商下每个模型都符合你的意图。

装上本包后，输入供应商的 **id**（`deepseek-account`）、**显示名**（`DeepSeek Account`）或其中一段（`Account`、`official`）都能筛出该供应商的全部模型。模型名搜索保持原生行为不变。

同时，输入框右下角的模型触发器不再展开它自己那套二级菜单，而是直接打开同一个选择器；每一行右侧平铺该模型支持的**推理等级**，点哪个就按哪个提交，不必先选模型再进二级面板改等级。

## 怎么做的

DSH 的搜索发生在原生选择器组件内部，用一个模块私有函数只读 `label` 字段，外部无法扩展匹配面。所以本包注册到同一个 list slot cell（`conversation.input.overlay` + `id: command-popup`），以负 priority 覆盖原生条目，然后：

- 非 `/model` 的命令、以及 `/model` 的加载中 / 失败 / 带风险确认弹窗等状态，**原样渲染原生组件**——其他所有选择器的行为逐字节不变；
- 只有就绪态的 `/model` 列表由本包绘制，复用原生的 DOM 结构、内容哈希类名与键盘契约，仅替换行列表；
- 点击行一律按**行对象**结算（`settle`），不按索引。原生控制器会用自己那份更短的列表解释索引，按索引选会选中错行；
- 带推理等级的选择不走弹窗的 `onSelect`：它按行 id 重建选择、会丢掉等级，所以这类直接提交给会话的目录服务（`modelDirectories`），再自行关闭弹窗。

推理等级是**逐模型**的，不是全局阶梯：实测同一台机器上 75 个模型里有 5 种不同档位组合、24 个完全没有档位。没有档位的模型平铺一档都不显示，点击即提交；只有一档的也不显示（没有可选项）。

## 安装

profile 的 `package.json` 里加依赖与 bundle：

```json
{
  "dependencies": { "dsh-better": "link:/path/to/dsh-plugins/packages/dsh-better" },
  "dsh": { "profile": { "bundles": ["@deepseek-ai/dsh-web-app", "dsh-better"] } }
}
```

然后 `dsh plugin --profile <name> install`。`lib/` 已提交入库，安装态不跑构建。

## 开发

```sh
pnpm --filter dsh-better test       # 纯逻辑单测
pnpm --filter dsh-better typecheck
pnpm --filter dsh-better build      # 产出 lib/
```

`src/client/search.ts` 是纯排序逻辑（无 DOM、无 React），`groups.ts` 复刻原生分组与 per-group 排序，`overlay.tsx` 负责渲染与遮蔽。
