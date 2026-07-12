# todos-rn-toolkit 插件

把本项目 `.cursor/` 下的定制组件打包成可分发插件，供团队一键获得一致的 AI 行为。

## 包含组件

| 组件 | 位置 |
|---|---|
| Rules | `.cursor/rules/*.mdc`（四层架构、状态层、展示层性能、TS、服务层）|
| Skills | `.cursor/skills/{add-feature-slice,layer-audit,redux-slice}` |
| Commands | `.cursor/commands/*.md`（verify / run-ios / run-android / bundle-split / new-slice）|
| Agents | `.cursor/agents/*.md`（layer-guardian / perf-reviewer）|
| Hooks | `.cursor/hooks.json` + `.cursor/scripts/hooks/*.js` |
| MCP | `.cursor/mcp.json`（github / filesystem，token 走 env 占位）|

## 说明

- 这些组件已作为**项目级**配置直接生效（随仓库克隆即可用），无需安装插件。
- 插件清单（`.cursor-plugin/plugin.json`）用于把它们**打包分发**到 Marketplace / Team Marketplace。
- 官方约定：清单只强制 `name`，组件按默认目录自动发现。本仓库组件位于 `.cursor/`，发布前如需符合插件根目录约定，把 `rules/skills/agents/commands/mcp.json` 置于插件根，或按官方 Plugins reference 配置自定义路径。

## 本地测试

```bash
ln -s "$(pwd)" ~/.cursor/plugins/local/todos-rn-toolkit
# 然后 Developer: Reload Window，在 Customize 里确认组件已加载
```

## 发布

到 cursor.com/marketplace/publish 提交（需开源、人工审核）。团队分发见 `docs/cursor/L4-团队治理.md`。
