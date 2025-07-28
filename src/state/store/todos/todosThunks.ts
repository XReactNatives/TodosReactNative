// Tips：状态层-Thunk（异步 Action）
// 定义：返回函数的 Action Creator，由 redux-thunk 中间件执行，用于处理副作用与异步流程。
// 职责：
// 1. 调用 Domain/Service 获得数据或执行副作用。
// 2. 根据结果自动派发 pending / fulfilled / rejected 等生命周期 Action。
// 3. 将数据写入 Slice，间接驱动 UI 更新。
// 优势：
// • 隔离网络 / IO 等副作用，保持 Reducer 纯净；
// • 配合 createAsyncThunk 自动生成 Action Type，减少样板；
// • 完整的类型推断与统一错误处理。
import { createAsyncThunk } from "@reduxjs/toolkit";
import type { Section } from "../../../type/ui";
import { getTodosWithSections } from "../../../domain/todosUseCase.ts";
import { fetchUsersFromAPI } from "../../../service/usersService.ts";
import type { User } from "../../../type/api";
import type { RootState } from "../rootReducer.ts";

// 异步获取用户列表（页面级）
export const fetchUsersAsync = createAsyncThunk<
  User[],
  void,
  { rejectValue: string }
>("users/fetch", async (_, { rejectWithValue }) => {
  try {
    return await fetchUsersFromAPI();
  } catch (err) {
    if (err instanceof Error) return rejectWithValue(err.message);
    return rejectWithValue("Unknown error");
  }
});


// 异步 thunk：获取 todos 并按用户名分组
export const fetchTodosAsync = createAsyncThunk<
    Section[],
    number | undefined,
    { state: RootState; rejectValue: string }
>("todos/fetchTodos", async (userId, { rejectWithValue, getState }) => {
    try {
        const usersCache = getState().todos.users;
        if (usersCache.length === 0) {
            return rejectWithValue("Users not loaded");
        }
        return await getTodosWithSections(userId, usersCache);
    } catch (err) {
        if (err instanceof Error) {
            return rejectWithValue(err.message);
        }
        return rejectWithValue("Unknown error occurred");
    }
});
