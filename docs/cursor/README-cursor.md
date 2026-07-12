# TodosReactNative × Cursor 五层全景实践

本目录把 Cursor 的五层全景能力（L1~L5）落到 `TodosReactNative` 项目里，每个产物都标注它命中的知识库知识点，目标是**以实践促掌握**。

## 五层产物索引

| 层 | 主题 | 本项目产物 | 说明文档 |
|---|---|---|---|
| L1 | 交互内核 | 用法手册（入口选择 + 上下文预算）| `L1-交互内核.md`、`L1-上下文预算.md` |
| L2 | 定制体系（七组件）| `AGENTS.md`、`.cursor/rules`、`.cursor/skills`、`.cursor/commands`、`.cursor/agents`、`.cursor/hooks.json`、`.cursor/mcp.json`、`.cursor-plugin` | `L2-定制体系.md` |
| L3 | 编排与自动化 | `automation/*.mjs`（Cursor SDK）| `L3-SDK编排.md` |
| L4 | 团队治理 | Team Rules + Plugin 分发方案 | `L4-团队治理.md` |
| L5 | 综合工程 | `.github/workflows` + `__tests__` | `L5-综合工程.md` |

## 组件全景对照（L2 七组件是否落地）

| 组件 | 本质 | 落地位置 |
|---|---|---|
| Rules | 静态常识（每次带）| `.cursor/rules/00~40.mdc` + `AGENTS.md` |
| Skills | 动态能力（相关才加载）| `.cursor/skills/{add-feature-slice,layer-audit,redux-slice}` |
| Commands | 可复用提示词（`/` 触发）| `.cursor/commands/*.md` |
| Subagents | 独立上下文子助手 | `.cursor/agents/{layer-guardian,perf-reviewer}.md` |
| Hooks | 生命周期脚本 | `.cursor/hooks.json` + `.cursor/scripts/hooks/*.js` |
| MCP | 外部工具/数据 | `.cursor/mcp.json`（token 走 `.env`）|
| Plugins | 打包分发 | `.cursor-plugin/plugin.json` |

## 全景自检清单

L1~L2（定制体系）：
- [ ] 能说清 Tab/Cmd+K/Ask/Agent/Plan 各自适用的任务大小（见 L1）
- [ ] Rules 按 glob 精确触发，无关文件不误触发
- [ ] Skill `description` 含 WHAT+WHEN+触发词，换说法也能触发
- [ ] 能说清七组件各自何时用

L3~L4（SDK / 治理）：
- [ ] 本地流式 Agent 跑通并读到 token（`npm run summarize`）
- [ ] headless 已加护栏（sandbox / autoReview / hooks）
- [ ] 云端 `auto-fix.mjs` 能开 PR
- [ ] `.cursor/rules` 已纳入版本控制；有 Team Rules + Plugin 分发方案

L5（综合工程）：
- [ ] CI（lint+tsc+jest）可跑；关键纯函数有单测
- [ ] CI 失败自动修复链路（cursor-autofix）就位

## 一句话总纲

给对上下文、选对表面、先计划后执行、永远读 diff；定制上 Rules 管常识、Skills 管能力、SDK 管编排；自动化必先护栏。
