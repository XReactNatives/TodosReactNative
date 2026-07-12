# 无人值守护栏（headless guardrails）

本地 headless Agent 默认**不经审批直接执行**工具调用（shell/edit/write）。任何无人值守运行前必须叠加护栏。三层按强度组合：

## 1. 沙箱 `sandboxOptions`（硬边界）

```js
local: { sandboxOptions: { enabled: true } }
```

- 写操作限工作目录；shell 进平台沙箱；出网默认拒绝。
- 放行特定 host 用 `.cursor/sandbox.json`。

## 2. autoReview（便利分类器，**非安全边界**）

```js
local: { autoReview: true }
```

- 拦截危险 shell/mcp/fetch。它只是分类器，严格场景必须叠加 sandbox 或 allowlist。

## 3. 生命周期 Hooks（文件级、进仓库）

- `.cursor/hooks.json` 的 `beforeShellExecution` 已拦截 `rm -rf` / force push 等（见 `.cursor/scripts/hooks/guard-shell.js`）。

## 使用建议

- `gen-slice.mjs` 已开 `sandboxOptions` + `autoReview`。
- 生产接入前，先在 local + 全部护栏下跑通，再考虑云端。
- 错误处理：`AgentBusyError` 不可重试（需先取消）；其余按 `error.isRetryable` + 指数退避。
- 记录 `result.requestId` 以关联后端日志。
