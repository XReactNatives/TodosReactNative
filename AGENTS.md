# TodosReactNative — Agent 指南

React Native 0.76.5 + React 18.3.1 + TypeScript 的 Todo 应用，采用**四层单向依赖架构**。
本文件是给 Agent 的"常识"（每次都该知道的事），细则见 `.cursor/rules/*.mdc`。

## 技术栈（以实际实现为准）

- 状态：**Redux Toolkit**（`createSlice` / `createAsyncThunk` / `reselect`），store 使用**归一化结构**（`todosById` / `ids` / `usersById` / `sectionsExpanded`）。不是 Zustand / TanStack Query。
- 导航：React Navigation v7 `native-stack`（路由常量见 `src/configs/routeConfig.ts`，注册见 `src/App.tsx`，用 `lazyScreen` 懒加载）。
- Mock：MirageJS（`src/mirage/mirageServer.ts`，`App.tsx` 挂载前 `ensureMirageServer()` 注入）。
- 网络：统一走 `src/utils/api.ts` 的 `api.get/post/patch/delete`，baseURL 见 `src/configs/apiConfig.ts`。
- 分包：`scripts/bundle/build.js`（`npm run bundle:split:ios|android`）。
- 质量工具：ESLint `@react-native`、Prettier 2.8.8、Jest（preset `react-native`）。

## 四层单向依赖（不可违反）

```
service → domain(可选) → state(thunk → slice → selector) → presentation(container → component)
```

- 数据只能自下而上流动；**禁止反向依赖或跨层调用**（如展示层直接 import service）。
- 各层单一职责：
  - 服务层 `src/service`：只封装网络请求，无业务规则。
  - 领域层 `src/domain`：只做业务规则校验 + API→State 数据转换，不依赖 React/Redux。
  - 状态层 `src/state/store`：thunk 处理副作用、slice 管状态、selector 派生数据。
  - 展示层 `src/presentation`：容器组合布局取数、组件渲染订阅，不含业务逻辑。

## 目录地图

| 层 | 目录 | 关键文件 |
|---|---|---|
| 服务层 | `src/service` | `todosService.ts` `usersService.ts` |
| 领域层 | `src/domain` | `todosUseCase.ts`（`getTodosAndUsersNormalized`）|
| 状态层 | `src/state/store` | `todos/{todosThunks,todosSlice,todosSelectors}.ts` `rootReducer.ts` `hooks.ts` |
| 展示层 | `src/presentation` | `features/todos/{containers,components}` `components/` `styles/` |
| 类型 | `src/type` | `api/` `state/` `ui/` `error.d.ts` `navigation.d.ts` |

## 约定

- 注释沿用中文「Tips：xxx」块，说明"定义 / 职责 / 优势"。
- 错误统一：`src/utils/error.ts` 的 `handleApiError` → `src/type/error.ts` 的 `AppError`。
- 副作用提示统一走 `src/utils/toast.ts` 的 `showSuccessToast` / `showErrorToast`。
- thunk 一律 `createAsyncThunk<Result, Arg, { rejectValue: AppError }>`。
- TypeScript 不写 `any`；API 类型放 `type/api`，State 类型放 `type/state`。

## 常用命令

- 起 Metro：`npm start`
- 跑端：`npm run ios` / `npm run android`
- 质量门：`npx eslint .` ／ `npx tsc --noEmit` ／ `npm test`
- 分包：`npm run bundle:split:ios` / `npm run bundle:split:android`
