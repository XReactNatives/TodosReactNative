# 双 Bundle 原生加载（可选 / Phase D）

日常开发与默认 `yarn android` / `yarn ios` 仍使用 **单包**（`index.ts` → 完整 App）。

`yarn bundle:split:android` / `yarn bundle:split:ios` 会生成：

- `bundle-output/core.{android|ios}.bundle` — 基础能力（框架 + 共享层）
- `bundle-output/business.{android|ios}.bundle` — 业务代码（已去掉与 core 重复的 polyfill 行）

要在真机上 **先加载 core 再加载 business**，需要改造原生工程（本仓库未默认开启，避免与官方 `react.gradle` / Xcode 打包流程冲突）。

## Android（思路）

1. 将 `core.android.bundle` 与 `business.android.bundle` 放入 `android/app/src/main/assets/`（或构建阶段拷贝）。
2. 在 React Native 实例就绪后（例如 `ReactInstanceEventListener`），在 **core 已执行** 的前提下调用加载第二段脚本，例如通过 `CatalystInstance` / 当前 RN 版本文档中的等价 API 加载 `business.android.bundle`。
3. 调整 Release 构建：避免默认任务用单入口覆盖你的 core；或让默认 bundle 仅含 core，再在运行时拉取 business。

具体 API 随 RN 版本变化，请以 [React Native 源码](https://github.com/facebook/react-native) 与团队内既有拆包方案为准。

## iOS（思路）

1. 将两份 bundle 加入 Copy Bundle Resources（或自定义 Build Phase）。
2. 在加载主 bundle 之后、展示 RootView 之前，按 RN 版本使用 `RCTBridge` / `RCTJavaScriptLoader` 等加载 business 段。

## 注意事项

- Hermes bytecode 与多段加载策略需单独验证。
- Source Map / 崩溃符号化需对应两份 map。
- Sentry 等工具需配置多 bundle 上传策略。

当前推荐：**用分包脚本做体积分析与离线交付**；原生双包作为独立里程碑由有原生人力时落地。
