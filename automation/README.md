# automation — Cursor SDK 编排（L3）

用 `@cursor/sdk`（Node 22.13+）把本项目的 Agent 变成可编程基础设施。

## 准备

```bash
cd automation
npm install
export CURSOR_API_KEY=...   # 见根目录 .env.example
```

## 脚本

| 脚本 | 运行时 | 作用 | 对应知识库 |
|---|---|---|---|
| `summarize.mjs` | local 流式 | 总结仓库四层架构，验证 SDK 打通 + token 用量 | 实践落地·项目0 |
| `gen-slice.mjs` | local + 子代理 + 自定义工具 | 按 add-feature-slice 生成纵切并自审，含护栏 | 项目5 编排 |
| `auto-fix.mjs` | cloud + autoCreatePR | CI 失败自动修复并开 PR | 项目4 CI 修复 |

```bash
npm run summarize
npm run gen-slice -- "Comment 评论功能：列表 + 新增"
REPO_URL=https://github.com/<org>/TodosReactNative FAILURE_LOG="..." npm run auto-fix
```

## 要点

- 模型不硬编码：`_model.mjs` 用 `Cursor.models.list()` 发现并回退 `{ id: "auto" }`。
- `await using` 自动释放 Agent。
- 护栏见 `guardrails.md`。云端 run 在 Agents Window（Filter → Source → SDK）可见。
