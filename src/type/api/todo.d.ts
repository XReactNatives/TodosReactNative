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

// 新增：deleteTodo相关的类型定义
export type DeleteTodoParams = {
    todoId: number;
};

export type DeleteTodoResult = {
    success: boolean;
    message: string;
};

export type DeleteTodoError = {
    message: string;
    status?: number;
}; 

// 新增：addTodo相关的类型定义
export type AddTodoParams = {
    title: string;
    userId: number;
    completed?: boolean;
};

export type AddTodoResult = {
    success: boolean;
    todo: Todo;
};

export type AddTodoError = {
    message: string;
    status?: number;
}; 