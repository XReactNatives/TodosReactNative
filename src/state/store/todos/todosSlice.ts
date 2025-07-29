import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Section } from "../../../type/ui";
import type { UserForUI } from "../../../type/ui/user";
import { fetchTodosAsync, fetchUsersAsync, fetchTodosWithSectionsAsync, toggleTodoStatusAsync, deleteTodoAsync, addTodoAsync } from "./todosThunks.ts";

interface TodosState {
    users: UserForUI[];
    sections: Section[];
    loading: boolean;
    error: string | null;
}

const initialState: TodosState = {
    users: [],
    sections: [],
    loading: false,
    error: null,
};

// Tips：状态层-Slice
// 定义：由 Redux Toolkit 的 createSlice 生成的 state 片段，内聚 Reducer 与同步 Action Creator。
// 职责：
// 1. 声明 todos 状态结构与初始值；
// 2. 提供 addTodo / deleteTodo 等同步更新逻辑；
// 3. 在 extraReducers 中消费异步 Thunk 的生命周期 Action。
// 优势：
// • 自动生成 Action Type，减少 switch 树与样板；
// • 内置 Immer，可用"可变"语法编写纯函数；
// • 状态、逻辑、Action 同文件集中，易于维护与重构。
const todosSlice = createSlice({
    name: "todos",
    initialState,
    reducers: {
        // 移除同步 addTodo reducer
        toggleSection: (state, { payload }: PayloadAction<string>) => {
            state.sections = state.sections.map((section) =>
                section.title === payload
                    ? { ...section, expanded: !section.expanded }
                    : section
            );
        },
    },
    // Tips：状态层-extraReducers
    // 定义：在 Slice 外部响应其它 action（通常是异步 Thunk 生命周期）的配置区。
    // 职责：
    // 1. 监听 fetchTodosWithUsernamesAsync 的 pending / fulfilled / rejected。
    // 2. 根据不同阶段更新 loading / error / sections 状态。
    // 优势：
    // • 保持同步 reducers 与异步结果处理分离，代码清晰；
    // • 支持链式 builder API，类型安全且自动补全。
    extraReducers: (builder) => {
        builder
            // fetchTodosWithSections async - 简化版本，直接获取todos和users
            .addCase(fetchTodosWithSectionsAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTodosWithSectionsAsync.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.sections = payload;
            })
            .addCase(fetchTodosWithSectionsAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? action.error.message ?? "Unknown error";
            })
            // users async
            .addCase(fetchUsersAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUsersAsync.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.users = payload;
            })
            .addCase(fetchUsersAsync.rejected, (state, action) => {
                state.error = action.payload ?? action.error.message ?? "Unknown error";
            })
            // todos async
            .addCase(fetchTodosAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTodosAsync.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.sections = payload;
            })
            .addCase(fetchTodosAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? action.error.message ?? "Unknown error";
            })
            // toggleTodoStatus async - 移除loading状态，避免按钮点击时显示loading
            .addCase(toggleTodoStatusAsync.fulfilled, (state, { payload }) => {
                // 更新对应的todo状态
                state.sections = state.sections.map(section => ({
                    ...section,
                    data: section.data.map(todo => 
                        todo.id === payload.todo.id 
                            ? { ...todo, completed: payload.todo.completed }
                            : todo
                    )
                }));
            })
            .addCase(toggleTodoStatusAsync.rejected, (state, action) => {
                state.error = action.payload?.message ?? action.error.message ?? "Toggle todo failed";
            })
            // deleteTodo async - 移除loading状态，避免按钮点击时显示loading
            .addCase(deleteTodoAsync.fulfilled, (state, { meta }) => {
                // 从sections中删除对应的todo
                const todoId = meta.arg;
                state.sections = state.sections
                    .map((section) => ({
                        ...section,
                        data: section.data.filter((todo) => todo.id !== todoId),
                    }))
                    .filter((section) => section.data.length > 0);
            })
            .addCase(deleteTodoAsync.rejected, (state, action) => {
                state.error = action.payload?.message ?? action.error.message ?? "Delete todo failed";
            })
            // addTodo async - 移除loading状态，避免按钮点击时显示loading
            .addCase(addTodoAsync.fulfilled, (state, { payload }) => {
                // 将新todo添加到对应的section中
                const newTodo = payload.todo;
                const sectionExists = state.sections.some(
                    (section) => section.title === newTodo.username
                );
                if (sectionExists) {
                    state.sections = state.sections.map((section) =>
                        section.title === newTodo.username
                            ? { ...section, data: [...section.data, newTodo] }
                            : section
                    );
                } else {
                    state.sections.push({
                        title: newTodo.username,
                        data: [newTodo],
                        expanded: true,
                    });
                }
            })
            .addCase(addTodoAsync.rejected, (state, action) => {
                state.error = action.payload?.message ?? action.error.message ?? "Add todo failed";
            });
    },
});

// Tips：状态层-同步 Action
// 定义：由 createSlice 自动生成的同步 Action Creator 与对应 reducer。
// 职责：
// 1. 处理无需副作用的本地状态变更（如 add/delete/mark）。
// 2. 返回新的状态或通过 Immer 直接修改草稿 state。
// 优势：
// • Action Type 自动生成，少写常量；
// • 与 Slice 同文件，逻辑集中；
// • 受益于 Immer，可写"可变"语法提升可读性。
export const {
    // 移除 addTodo 导出
    toggleSection,
} = todosSlice.actions;

export default todosSlice.reducer;
