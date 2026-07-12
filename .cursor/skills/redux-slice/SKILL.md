---
name: redux-slice
description: 在 TodosReactNative 只生成状态层三件套（slice + thunk + selector），不含服务/展示层。当用户要"加一个 slice / 新增 redux 状态 / 加一组 thunk / 只要状态层"时使用；若要端到端功能请改用 add-feature-slice。
---

# 生成 Redux 状态层三件套

仅覆盖状态层，比 `add-feature-slice` 轻量。假设 service（或 domain）已存在或用户会自行提供数据源。

## 生成内容（`src/state/store/<feature>/`）

1. `<feature>Thunks.ts`：`createAsyncThunk<Result, Arg, { rejectValue: AppError }>`，失败走 `handleApiError` + `rejectWithValue`，副作用用 Toast。
2. `<feature>Slice.ts`：`initialState`（优先归一化 `byId`/`ids`）+ `extraReducers` 三生命周期 + 统一 `handleRejected`。
3. `<feature>Selectors.ts`：`createSelector` 记忆化派生。

## 强制约定

- 严格遵守 `.cursor/rules/10-state-redux.mdc`：泛型写全、禁 `any`、Immer 语法、selector 记忆化。
- 生成后提醒用户在 `src/state/store/rootReducer.ts` 注册 reducer（见 add-feature-slice 的 `scripts/register-slice.md` A 节）。

## 模板

复用 `../add-feature-slice/reference.md` 的第 4、5、7 节，去掉服务/展示层部分。
