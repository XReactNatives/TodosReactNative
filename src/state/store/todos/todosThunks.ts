// Tips：状态层-Thunk（异步 Action）
// 定义：返回函数的 Action Creator，由 redux-thunk 中间件执行，用于处理副作用与异步流程。
// 职责：
// 1. 调用 Domain/Service 获得数据或执行副作用。
// 2. 根据结果自动派发 pending / fulfilled / rejected 等生命周期 Action。
// 3. 将数据写入 Slice，间接驱动 UI 更新。
// 4. 统一错误处理：使用统一的错误类型和处理策略。
// 优势：
// • 隔离网络 / IO 等副作用，保持 Reducer 纯净；
// • 配合 createAsyncThunk 自动生成 Action Type，减少样板；
// • 完整的类型推断与统一错误处理；
// • 统一的错误处理策略，提高可维护性。

import { createAsyncThunk } from "@reduxjs/toolkit";
import type { Section } from "../../../type/ui";
import { getTodosWithSections } from "../../../domain/todosUseCase.ts";
import { toggleTodoStatusFromAPI, deleteTodoFromAPI, addTodoFromAPI } from "../../../service/todosService.ts";
import type { AddTodoParams } from "../../../type/api";
import type { AppError } from "../../../type/error";
import { handleApiError } from "../../../utils/error";
import { showSuccessToast, showErrorToast } from "../../../utils/toast.ts";

// 异步 thunk：获取 todos 并按用户名分组
export const fetchTodosWithSectionsAsync = createAsyncThunk<
    Section[],
    void,
    { rejectValue: AppError }
>("todos/fetchTodosWithSections", async (_, { rejectWithValue }) => {
    try {
        return await getTodosWithSections();
    } catch (error) {
        const appError = handleApiError(error);
        return rejectWithValue(appError);
    }
});

// 异步 thunk：切换待办事项状态
export const toggleTodoStatusAsync = createAsyncThunk<
    any, // ToggleTodoStatusResult
    { todoId: number; currentCompleted: boolean },
    { rejectValue: AppError }
>(
    "todos/toggleTodoStatus",
    async ({ todoId, currentCompleted }, { rejectWithValue }) => {
        try {
            // 直接使用传入的参数，无需查找state
            const result = await toggleTodoStatusFromAPI({
                todoId,
                completed: !currentCompleted
            });

            // 成功提示 - 使用Toast
            showSuccessToast("Todo status updated successfully");
            return result;
        } catch (error) {
            const appError = handleApiError(error);
            showErrorToast(`Failed to update todo status: ${appError.message}`);
            return rejectWithValue(appError);
        }
    }
);

// 异步 thunk：删除待办事项
export const deleteTodoAsync = createAsyncThunk<
    any, // DeleteTodoResult
    number, // todoId
    { rejectValue: AppError }
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
            const appError = handleApiError(error);
            showErrorToast(`Failed to delete todo: ${appError.message}`);
            return rejectWithValue(appError);
        }
    }
);

// 异步 thunk：添加待办事项
export const addTodoAsync = createAsyncThunk<
    any, // AddTodoResult
    AddTodoParams,
    { rejectValue: AppError }
>(
    "todos/addTodo",
    async (params, { rejectWithValue }) => {
        try {
            const result = await addTodoFromAPI(params);
            showSuccessToast("Todo added successfully");
            return result;
        } catch (error) {
            const appError = handleApiError(error);
            showErrorToast(`Failed to add todo: ${appError.message}`);
            return rejectWithValue(appError);
        }
    }
);
