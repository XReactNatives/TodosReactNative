# L3 · SDK 编排与自动化

知识点来源：《Cursor 核心知识》七、《方法论》方法6/7/8、《实践落地》项目0/4/5。
核心：用 `@cursor/sdk`（Node 22.13+）把 IDE 里的同一个 Agent 变成可编程基础设施；一套代码，local/cloud 两种运行时。

## 产物（`automation/`）

| 脚本 | 运行时 | 命中知识点 |
|---|---|---|
| `summarize.mjs` | Local 流式 | 项目0：`run.stream()` 消费事件 + `result.usage.totalTokens` |
| `gen-slice.mjs` | Local + 子代理 + 自定义工具 | 项目5：`local.customTools`、inline `agents`、护栏 |
| `auto-fix.mjs` | Cloud + `autoCreatePR` | 项目4：`cloud.repos`、`result.git.branches[].prUrl`、`IntegrationNotConnectedError` |
| `_model.mjs` | 共享 | 方法4：`Cursor.models.list()` 发现并回退 `{id:"auto"}`，不硬编码 |

## 关键最佳实践（已落实）

- 模型不硬编码，发现失败回退 `auto`。
- `await using agent` 自动释放，避免资源泄漏。
- headless 护栏三件套（`sandboxOptions` + `autoReview` + hooks），见 `automation/guardrails.md`；autoReview 只是分类器，非安全边界。
- 秘钥用 env / inline `envVars`（加密、run 级用完即删），不写进提交的配置。
- 错误：`AgentBusyError` 不可重试（先取消），其余按 `isRetryable` + 指数退避；记录 `requestId`。

## 运行

```bash
cd automation && npm install && export CURSOR_API_KEY=...
npm run summarize
npm run gen-slice -- "Comment 评论功能：列表 + 新增"
```

检验：终端看到流式输出并拿到最终文本与 token；云端 run 在 Agents Window（Filter→Source→SDK）可见。
