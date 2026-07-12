---
description: 一键质量门 — lint + 类型检查 + 测试
---

依次运行以下命令并汇总结果：

1. `npx eslint .` —— 硬门，有 error 必须修复。
2. `npx tsc --noEmit` —— 目前有预置类型债（见 `docs/cursor/L5-综合工程.md`），报告新增类型错误即可，勿被历史债卡住。
3. `npm test -- --watchAll=false` —— 硬门，必须全绿。

eslint 与 test 全绿即视为「质量门通过」；tsc 只关注本次改动是否引入**新增**类型错误。这是提交前的标准自查。
