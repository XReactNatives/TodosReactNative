# 锚点插入：注册新 slice 与新页面

这些是易漏、需要精确改动既有文件的步骤。按锚点最小改动，不重写整个文件。

## A. 注册 reducer（`src/state/store/rootReducer.ts`）

1. 顶部 import 区加一行：

```ts
import <feature>sReducer from "./<feature>s/<feature>sSlice.ts";
```

2. `combineReducers({ ... })` 里加一行：

```ts
const rootReducer = combineReducers({
  todos: todosReducer,
  counter: counterReducer,
  <feature>s: <feature>sReducer, // 新增
});
```

`RootState` 会自动推断出 `state.<feature>s`，selector 可直接用。

## B. 注册新页面（仅当纵切含新屏幕）

1. `src/configs/routeConfig.ts` 的 `RouteConfig` 加常量：

```ts
export const RouteConfig = {
  // ...
  <FEATURE>: "<Feature>Screen",
} as const;
```

2. `src/type/navigation.d.ts` 的 `RootStackParamList` 加路由与参数类型。

3. `src/App.tsx`：

```tsx
const Lazy<Feature> = lazyScreen(
  () => import("./presentation/features/<feature>s/containers/<Feature>ListContainer"),
);
// 在 <Stack.Navigator> 内：
<Stack.Screen name={RouteConfig.<FEATURE>} component={Lazy<Feature>} options={{ headerShown: false }} />
```

## C. Mirage mock 路由（`src/mirage/mirageServer.ts`）

- 在 `models` 加 `<feature>: Model`；在 `seeds` 造几条种子数据。
- 在 `routes()` 里用现有 `getWithOpts` / `postWithOpts` 风格加端点，带 `{ timing: 500 }` 模拟延迟。
