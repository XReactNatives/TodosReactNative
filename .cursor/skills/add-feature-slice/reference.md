# 纵切代码模板（从本项目现有实现抽取）

把 `<Feature>` / `<feature>` 替换为你的功能名（如 `Comment` / `comment`）。风格对齐 `src/**` 现有代码：中文「Tips」注释、`AppError` 统一错误、Toast 副作用、归一化 store。

## 1. API 类型 `src/type/api/<feature>.d.ts`

```typescript
export type <Feature> = {
  id: number;
  // ...业务字段
};

export type Fetch<Feature>sParams = { /* 查询参数，可空 */ };
export type Fetch<Feature>sResult = <Feature>[];

export type Add<Feature>Params = { /* 新增入参 */ };
export type Add<Feature>Result = { success: boolean; <feature>: <Feature> };
```

然后在 `src/type/api.d.ts` 追加：`export * from "./<feature>";`

## 2. 服务层 `src/service/<feature>Service.ts`

```typescript
import { api } from "../utils/api";
import type { Fetch<Feature>sResult, Add<Feature>Params, Add<Feature>Result } from "../type/api";

const <feature>sEndpoint = "/<feature>s";

export const fetch<Feature>sFromAPI = async (): Promise<Fetch<Feature>sResult> =>
  api.get<Fetch<Feature>sResult>(<feature>sEndpoint);

export const add<Feature>FromAPI = async (params: Add<Feature>Params): Promise<Add<Feature>Result> =>
  api.post<Add<Feature>Result>(<feature>sEndpoint, params);
```

## 3. 领域层（可选）`src/domain/<feature>UseCase.ts`

```typescript
import { fetch<Feature>sFromAPI } from "../service/<feature>Service";
import type { <Feature> } from "../type/api/<feature>";

// 业务规则校验 + API→State 转换（纯函数，不依赖 React/Redux）
export const get<Feature>s = async (): Promise<<Feature>[]> => {
  const list = await fetch<Feature>sFromAPI();
  return list.filter(x => /* 业务校验 */ Boolean(x.id));
};
```

## 4. 状态层 thunk `src/state/store/<feature>/<feature>Thunks.ts`

```typescript
import { createAsyncThunk } from "@reduxjs/toolkit";
import type { Add<Feature>Params, Add<Feature>Result, Fetch<Feature>sResult } from "../../../type/api";
import type { AppError } from "../../../type/error";
import { handleApiError } from "../../../utils/error";
import { showSuccessToast, showErrorToast } from "../../../utils/toast";
import { fetch<Feature>sFromAPI, add<Feature>FromAPI } from "../../../service/<feature>Service";

export const fetch<Feature>sAsync = createAsyncThunk<Fetch<Feature>sResult, void, { rejectValue: AppError }>(
  "<feature>s/fetch",
  async (_, { rejectWithValue }) => {
    try {
      return await fetch<Feature>sFromAPI();
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  },
);

export const add<Feature>Async = createAsyncThunk<Add<Feature>Result, Add<Feature>Params, { rejectValue: AppError }>(
  "<feature>s/add",
  async (params, { rejectWithValue }) => {
    try {
      const result = await add<Feature>FromAPI(params);
      showSuccessToast("<Feature> added successfully");
      return result;
    } catch (error) {
      const appError = handleApiError(error);
      showErrorToast(`Failed to add <feature>: ${appError.message}`);
      return rejectWithValue(appError);
    }
  },
);
```

## 5. 状态层 slice `src/state/store/<feature>/<feature>Slice.ts`

```typescript
import { createSlice, type SerializedError } from "@reduxjs/toolkit";
import type { AppError } from "../../../type/error";
import type { <Feature> } from "../../../type/api/<feature>";
import { fetch<Feature>sAsync, add<Feature>Async } from "./<feature>Thunks";

interface <Feature>sState {
  byId: Record<number, <Feature>>;
  ids: number[];
  loading: boolean;
  error: AppError | null;
}

const initialState: <Feature>sState = { byId: {}, ids: [], loading: false, error: null };

const handleRejected = (state: <Feature>sState, action: { payload?: AppError; error?: SerializedError }) => {
  state.loading = false;
  state.error = action.payload ?? { code: "UNKNOWN_ERROR", message: action.error?.message ?? "unknown", timestamp: Date.now() };
};

const <feature>sSlice = createSlice({
  name: "<feature>s",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetch<Feature>sAsync.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetch<Feature>sAsync.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.byId = {}; state.ids = [];
        payload.forEach((x) => { state.byId[x.id] = x; state.ids.push(x.id); });
      })
      .addCase(fetch<Feature>sAsync.rejected, handleRejected)
      .addCase(add<Feature>Async.fulfilled, (state, { payload }) => {
        state.byId[payload.<feature>.id] = payload.<feature>;
        if (!state.ids.includes(payload.<feature>.id)) state.ids.push(payload.<feature>.id);
      })
      .addCase(add<Feature>Async.rejected, handleRejected);
  },
});

export default <feature>sSlice.reducer;
```

## 6. 注册 reducer（改 `rootReducer.ts`）

见 `scripts/register-slice.md`。

## 7. 选择器 `src/state/store/<feature>/<feature>Selectors.ts`

```typescript
import { createSelector } from "reselect";
import type { RootState } from "../rootReducer";

const select<Feature>sState = (state: RootState) => state.<feature>s;

export const select<Feature>s = createSelector(
  [select<Feature>sState],
  (s) => s.ids.map((id) => s.byId[id]).filter(Boolean),
);
export const select<Feature>sLoading = createSelector([select<Feature>sState], (s) => s.loading);
export const select<Feature>sError = createSelector([select<Feature>sState], (s) => s.error);
```

## 8. 展示层容器/组件

```tsx
// containers/<Feature>ListContainer.tsx
const <Feature>ListContainer: React.FC = () => {
  const dispatch = useAppDispatch();
  const fetch = React.useCallback(() => { dispatch(fetch<Feature>sAsync()); }, [dispatch]);
  React.useEffect(() => { fetch(); }, [fetch]);
  return (<View style={commonStyles.container}><<Feature>List /></View>);
};

// components/<Feature>List.tsx
const <Feature>List: React.FC = React.memo(() => {
  const list = useAppSelector(select<Feature>s);
  const loading = useAppSelector(select<Feature>sLoading);
  if (loading) return <ActivityIndicator size="large" color="#0000ff" />;
  return (
    <FlatList
      data={list}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => <<Feature>Item item={item} />}
    />
  );
});
```
