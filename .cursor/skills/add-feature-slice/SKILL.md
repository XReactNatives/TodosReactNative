---
name: add-feature-slice
description: 在 TodosReactNative 按四层单向依赖架构新增一个完整功能纵切（vertical slice）。当用户要"新增一个功能 / 加一个 CRUD 操作 / 加一条 API / 端到端加个特性 / vertical slice / 加一个新页面并接数据"时使用。
---

# 新增功能纵切（vertical slice）

按四层顺序自下而上生成文件，严格遵守 `.cursor/rules/00-architecture-layers.mdc`。
每一步的**可直接套用代码模板**见 `reference.md`；改 `rootReducer.ts` / `App.tsx` 等锚点插入见 `scripts/register-slice.md`。

## 工作流（顺序固定，缺步即违反架构）

1. **API 类型** → `src/type/api/<feature>.d.ts`：声明请求参数与响应结果类型，并在 `src/type/api.d.ts` 追加 `export *`。
2. **服务层** → `src/service/<feature>Service.ts`：端点常量 + `xxxFromAPI` 函数，只走 `utils/api`。
3. **领域层（仅在有业务规则/数据转换时）** → `src/domain/<feature>UseCase.ts`：校验 + API→State 转换，返回纯 Promise。
4. **状态层 thunk** → `src/state/store/<feature>/<feature>Thunks.ts`：`createAsyncThunk<Result, Arg, { rejectValue: AppError }>` + `handleApiError` + Toast。
5. **状态层 slice** → `src/state/store/<feature>/<feature>Slice.ts`：`initialState` + `extraReducers`（pending/fulfilled/rejected）。
6. **注册 reducer** → 在 `src/state/store/rootReducer.ts` 的 `combineReducers` 加一行。
7. **选择器** → `src/state/store/<feature>/<feature>Selectors.ts`：`createSelector` 派生数据。
8. **展示层** → `src/presentation/features/<feature>/{containers,components}`：容器组合、组件订阅，`React.memo` + `useCallback`。
9. **Mock 路由** → 在 `src/mirage/mirageServer.ts` 增加对应 endpoint（沿用现有 `getWithOpts`/`postWithOpts` 写法与 `timing`）。
10. **新页面（可选）** → `src/configs/routeConfig.ts` 加路由常量、`src/type/navigation.d.ts` 加参数类型、`src/App.tsx` 用 `lazyScreen` 注册 `Stack.Screen`。

## 完成后自检

- 展示层无 `service`/`domain` 的 import（跑 `grep -rn "service\|domain" src/presentation` 应为空匹配）。
- thunk 泛型第三项为 `{ rejectValue: AppError }`，无 `any`。
- 组件 `React.memo` + 稳定 `keyExtractor`。
- `npx eslint .` 与 `npx tsc --noEmit` 无新增报错。
- 若加了页面：`App.tsx` 已 `lazyScreen` 注册且 `RouteConfig` 有常量。

## 何时不建 domain 层

纯透传（无分组/校验/合并）时可省略 domain，thunk 直接调 service（架构允许 domain 可选）。一旦出现业务规则，必须下沉到 domain。
