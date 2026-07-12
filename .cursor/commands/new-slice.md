---
description: 新增功能纵切（触发 add-feature-slice 技能）
---

我要新增一个功能纵切。请使用 `add-feature-slice` 技能，按四层顺序（service → domain(可选) → state → presentation）生成文件，并遵守 `.cursor/rules` 全部约束。

功能名与需求：$ARGUMENTS

生成后按技能内的自检清单验证，并提醒我在 `rootReducer.ts` / `App.tsx` 的注册改动。
