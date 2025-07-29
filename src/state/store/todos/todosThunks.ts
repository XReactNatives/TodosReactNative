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
import type { UserForUI } from "../../../type/ui/user";
import { getTodosWithSections } from "../../../domain/todosUseCase.ts";
import { fetchUsersFromAPI } from "../../../service/usersService.ts";
import { toggleTodoStatusFromAPI, deleteTodoFromAPI, addTodoFromAPI } from "../../../service/todosService.ts";
import type { ToggleTodoStatusError, DeleteTodoError, AddTodoError, AddTodoParams } from "../../../type/api";
import type { User } from "../../../type/api/user";
import type { RootState } from "../rootReducer.ts";
import { showSuccessToast, showErrorToast } from "../../../utils/toast";

// 数据转换函数：将 API 层的 User 转换为 UI 层的 UserForUI
const transformUserToUI = (user: User): UserForUI => ({
    id: user.id,
    username: user.username,
    name: user.name,
});

// 异步获取用户列表（页面级）
export const fetchUsersAsync = createAsyncThunk<
  UserForUI[],
  void,
  { rejectValue: string }
>("users/fetch", async (_, { rejectWithValue }) => {
  try {
    const users = await fetchUsersFromAPI();
    // 转换为 UI 层类型
    return users.map(transformUserToUI);
  } catch (err) {
    if (err instanceof Error) return rejectWithValue(err.message);
    return rejectWithValue("Unknown error");
  }
});

// 异步 thunk：获取 todos 并按用户名分组（简化版本）
export const fetchTodosWithSectionsAsync = createAsyncThunk<
    Section[],
    void,
    { rejectValue: string }
>("todos/fetchTodosWithSections", async (_, { rejectWithValue }) => {
    try {
        return await getTodosWithSections();
    } catch (err) {
        if (err instanceof Error) {
            return rejectWithValue(err.message);
        }
        return rejectWithValue("Unknown error occurred");
    }
});

// 异步 thunk：获取 todos 并按用户名分组
export const fetchTodosAsync = createAsyncThunk<
    Section[],
    void,
    { state: RootState; rejectValue: string }
>("todos/fetchTodos", async (_, { rejectWithValue, getState }) => {
    try {
        const usersCache = getState().todos.users;
        if (usersCache.length === 0) {
            return rejectWithValue("Users not loaded");
        }
        return await getTodosWithSections(usersCache);
    } catch (err) {
        if (err instanceof Error) {
            return rejectWithValue(err.message);
        }
        return rejectWithValue("Unknown error occurred");
    }
});

// 异步 thunk：切换待办事项状态
export const toggleTodoStatusAsync = createAsyncThunk<
    any, // ToggleTodoStatusResult
    number, // todoId
    {
        state: RootState;
        rejectValue: ToggleTodoStatusError;
    }
>(
    "todos/toggleTodoStatus",
    async (todoId, { getState, rejectWithValue }) => {
        try {
            // 获取当前todo状态
            const state = getState();
            const todo = state.todos.sections
                .flatMap(section => section.data)
                .find(t => t.id === todoId);
            
            if (!todo) {
                throw new Error("Todo not found");
            }

            // 调用API
            const result = await toggleTodoStatusFromAPI({
                todoId,
                completed: !todo.completed
            });

            // 成功提示 - 使用Toast
            showSuccessToast("Todo status updated successfully");
            return result;
        } catch (error) {
            // 失败提示 - 使用Toast
            const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
            showErrorToast(`Failed to update todo status: ${errorMessage}`);
            
            if (error instanceof Error) {
                return rejectWithValue({
                    message: error.message
                });
            }
            return rejectWithValue({
                message: "Unknown error occurred"
            });
        }
    }
);

// 异步 thunk：删除待办事项
export const deleteTodoAsync = createAsyncThunk<
    any, // DeleteTodoResult
    number, // todoId
    {
        state: RootState;
        rejectValue: DeleteTodoError;
    }
>(
    "todos/deleteTodo",
    async (todoId, { rejectWithValue }) => {
        try {
            // 调用API
            const result = await deleteTodoFromAPI({ todoId });

            // 成功提示 - 使用Toast
            showSuccessToast("Todo deleted successfully");
            return result;
        } catch (error) {
            // 失败提示 - 使用Toast
            const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
            showErrorToast(`Failed to delete todo: ${errorMessage}`);
            
            if (error instanceof Error) {
                return rejectWithValue({
                    message: error.message
                });
            }
            return rejectWithValue({
                message: "Unknown error occurred"
            });
        }
    }
);

// 异步 thunk：添加待办事项
export const addTodoAsync = createAsyncThunk<
    any, // AddTodoResult
    AddTodoParams,
    {
        state: RootState;
        rejectValue: AddTodoError;
    }
>(
    "todos/addTodo",
    async (params, { rejectWithValue }) => {
        try {
            const result = await addTodoFromAPI(params);
            showSuccessToast("Todo added successfully");
            return result;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
            showErrorToast(`Failed to add todo: ${errorMessage}`);
            
            if (error instanceof Error) {
                return rejectWithValue({
                    message: error.message
                });
            }
            return rejectWithValue({
                message: "Unknown error occurred"
            });
        }
    }
);
