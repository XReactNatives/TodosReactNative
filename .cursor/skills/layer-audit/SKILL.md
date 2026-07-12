---
name: layer-audit
description: 审查 TodosReactNative 的代码改动是否违反四层单向依赖、单一职责与过渡渲染优化。当用户要"审查架构 / 检查分层 / 这段改动合规吗 / layer audit / 提交前自查 / 有没有跨层调用"时使用。
---

# 分层与性能审查

对给定文件或 diff 做只读审查，产出结构化报告，**不改代码**（如需修复，交给 add-feature-slice 或人工）。

## 审查清单

### 1. 四层单向依赖（对照 `.cursor/rules/00-architecture-layers.mdc`）

- 展示层（`src/presentation`）是否 import 了 `src/service` 或 `src/domain`？→ 违规。
- 领域层（`src/domain`）是否 import 了 `react` / `react-native` / `@reduxjs/toolkit` / `react-redux`？→ 违规。
- 服务层（`src/service`）是否出现分组/校验/数据转换等业务规则？→ 应下沉 domain。
- 是否绕过 `utils/api` 直接 `fetch`？→ 违规。

### 2. 单一职责

- 组件是否混入业务逻辑（分组、聚合、复杂校验）？→ 应移到 selector/domain。
- 容器是否直接订阅业务数据并渲染列表？→ 应交给组件。

### 3. 状态层规范（对照 `10-state-redux.mdc`）

- thunk 是否 `createAsyncThunk<Result, Arg, { rejectValue: AppError }>`、有 `handleApiError`？
- 是否残留 `any` 泛型？
- 派生数据是否用 `createSelector`？

### 4. 过渡渲染（对照 `20-presentation-rn.mdc`）

- 纯展示组件是否 `React.memo`？事件是否 `useCallback` 且依赖精确？
- 列表 `keyExtractor` 是否稳定？`renderItem` 是否内联新引用？

## 输出格式

```
## 审查结论：通过 / 有 N 处违规

### 违规项
1. [严重] src/presentation/.../X.tsx:12 展示层直接 import service —— 依据 rule 00 —— 建议：收敛到 thunk
2. [提示] src/.../Y.tsx:30 组件未 memo —— 依据 rule 20 —— 建议：React.memo 包裹

### 合规项（简述）
- 四层依赖：OK
- 状态层：OK
```

## 快速取证命令（只读）

- 跨层依赖：`grep -rn "from .*\(service\|domain\)" src/presentation`
- 领域层污染：`grep -rn "react\|redux" src/domain`
- 绕过 api：`grep -rn "fetch(" src/service`
