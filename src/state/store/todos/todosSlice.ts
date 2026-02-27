import { createSlice, PayloadAction, type SerializedError } from "@reduxjs/toolkit";
import type { AppError } from "../../../type/error";
import type { TodoWithUsername, NormalizedTodos, NormalizedUsers, SectionsExpanded } from "../../../type/state/todo";
import type { User } from "../../../type/api/user";
import { fetchTodosAndUsersNormalizedAsync, toggleTodoStatusAsync, deleteTodoAsync, addTodoAsync, fetchTodoDetailAsync } from "./todosThunks.ts";

interface TodosState {
    todosById: NormalizedTodos;
    ids: number[];
    usersById: NormalizedUsers;
    sectionsExpanded: SectionsExpanded;
    listLoading: boolean;
    listError: AppError | null;
    detailLoading: boolean;
    detailError: AppError | null;
}

const initialState: TodosState = {
    todosById: {} as NormalizedTodos,
    ids: [] as number[],
    usersById: {} as NormalizedUsers,
    sectionsExpanded: {} as SectionsExpanded,
    listLoading: false,
    listError: null,
    detailLoading: false,
    detailError: null,
};

// Tips：状态层-Slice
// 定义：由 Redux Toolkit 的 createSlice 生成的 state 片段，内聚 Reducer 与同步 Action Creator。
// 职责：
// 1. 声明 todos 状态结构与初始值；
// 2. 提供 addTodo / deleteTodo 等同步更新逻辑；
// 3. 在 extraReducers 中消费异步 Thunk 的生命周期 Action；
// 4. 统一错误处理：使用统一的错误类型和处理策略。
// 优势：
// • 自动生成 Action Type，减少 switch 树与样板；
// • 内置 Immer，可用"可变"语法编写纯函数；
// • 状态、逻辑、Action 同文件集中，易于维护与重构；
// • 统一的错误处理策略，提高可维护性。

interface RejectedActionLike {
    payload?: AppError;
    error?: SerializedError;
}

const handleListRejectedAction = (state: TodosState, action: RejectedActionLike) => {
    state.listLoading = false;
    state.listError = action.payload ?? {
        code: 'UNKNOWN_ERROR',
        message: action.error?.message ?? 'An unknown error occurred',
        timestamp: Date.now(),
    };
};

const handleDetailRejectedAction = (state: TodosState, action: RejectedActionLike) => {
    state.detailLoading = false;
    state.detailError = action.payload ?? {
        code: 'UNKNOWN_ERROR',
        message: action.error?.message ?? 'An unknown error occurred',
        timestamp: Date.now(),
    };
};

// 辅助函数：生成section标题（在addTodoAsync中仍需要使用）
const generateSectionTitle = (username: string, email: string): string => {
    return `${username} (${email})`;
};

const todosSlice = createSlice({
    name: "todos",
    initialState,
    reducers: {
        toggleSection: (state, { payload }: PayloadAction<string>) => {
            state.sectionsExpanded[payload] = !state.sectionsExpanded[payload];
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
            // fetchTodosWithSections async
            .addCase(fetchTodosAndUsersNormalizedAsync.pending, (state) => {
                state.listLoading = true;
                state.listError = null;
            })
            .addCase(fetchTodosAndUsersNormalizedAsync.fulfilled, (state, { payload }) => {
                state.listLoading = false;

                // 直接赋值所有归一化数据（包括 sectionsExpanded）
                state.todosById = payload.todos;
                state.ids = payload.ids;
                state.usersById = payload.users;
                state.sectionsExpanded = payload.sectionsExpanded;
            })
            .addCase(fetchTodosAndUsersNormalizedAsync.rejected, handleListRejectedAction)

            // toggleTodoStatus async
            .addCase(toggleTodoStatusAsync.fulfilled, (state, { payload }) => {
                // 直接更新 todosById 中的 todo，无需同步多处
                if (state.todosById[payload.todo.id]) {
                    state.todosById[payload.todo.id].completed = payload.todo.completed;
                }
            })
            .addCase(toggleTodoStatusAsync.rejected, handleListRejectedAction)

            // deleteTodo async
            .addCase(deleteTodoAsync.fulfilled, (state, { meta }) => {
                const todoId = meta.arg;

                // 从 todosById 中删除
                delete state.todosById[todoId];

                // 从ids中移除
                state.ids = state.ids.filter(id => id !== todoId);
            })
            .addCase(deleteTodoAsync.rejected, handleListRejectedAction)

            // addTodo async
            .addCase(addTodoAsync.fulfilled, (state, { payload }) => {
                const newTodo = payload.todo;

                // 确保newTodo包含username字段
                if (!newTodo.username) {
                    console.warn('New todo missing username field');
                    return;
                }

                // 添加到 todosById 和 ids
                state.todosById[newTodo.id] = newTodo;
                if (!state.ids.includes(newTodo.id)) {
                    state.ids.push(newTodo.id);
                }

                // 初始化sections展开状态
                const user = Object.values(state.usersById).find(u => u.username === newTodo.username);
                const email = user?.email || 'unknown@example.com';
                const sectionTitle = generateSectionTitle(newTodo.username, email);
                if (!(sectionTitle in state.sectionsExpanded)) {
                    state.sectionsExpanded[sectionTitle] = true;
                }
            })
            .addCase(addTodoAsync.rejected, handleListRejectedAction)

            // fetchTodoDetail async
            .addCase(fetchTodoDetailAsync.pending, (state) => {
                state.detailLoading = true;
                state.detailError = null;
            })
            .addCase(fetchTodoDetailAsync.fulfilled, (state, { payload }) => {
                state.detailLoading = false;

                // 将获取的 todo 合并到 todosById
                state.todosById[payload.id] = payload;

                // 如果todo不在ids中，添加到ids
                if (!state.ids.includes(payload.id)) {
                    state.ids.push(payload.id);
                }
            })
            .addCase(fetchTodoDetailAsync.rejected, handleDetailRejectedAction);
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
