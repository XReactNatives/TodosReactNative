---
description: 执行分包构建（复用现有 scripts/bundle）
---

按平台执行分包脚本（对应 package.json 的 bundle:split:*）：

- iOS：`npm run bundle:split:ios`（等价 `node scripts/bundle/build.js ios`）
- Android：`npm run bundle:split:android`（等价 `node scripts/bundle/build.js android`）

产物与 metro 分包配置见 `scripts/bundle/`（base/common/business 三份 metro config）。运行后检查产物是否生成、无 polyfill 重复。
