// Todos API数据类型定义
export type Todo = {
    userId: number;
    id: number;
    title: string;
    completed: boolean;
}; 

// API 请求参数类型定义
export type FetchTodosParams = {
    userId?: number;
};

// API 响应结果类型定义
export type FetchTodosResult = Todo[];

// API 错误类型定义
export type TodosApiError = {
    message: string;
    status?: number;
}; 

// 新增：toggleTodoStatus相关的类型定义
export type ToggleTodoStatusParams = {
    todoId: number;
    completed: boolean;
};

export type ToggleTodoStatusResult = {
    success: boolean;
    todo: Todo;
};

export type ToggleTodoStatusError = {
    message: string;
    status?: number;
}; 