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

// 新增：toggleTodoStatus相关的类型定义
export type ToggleTodoStatusParams = {
    todoId: number;
    completed: boolean;
};

export type ToggleTodoStatusResult = {
    success: boolean;
    todo: Todo;
};

// 新增：deleteTodo相关的类型定义
export type DeleteTodoParams = {
    todoId: number;
};

export type DeleteTodoResult = {
    success: boolean;
    message: string;
};

// 新增：addTodo相关的类型定义
export type AddTodoParams = {
    title: string;
    username: string; // 修改：传递用户名而不是userId
    completed?: boolean;
};

export type AddTodoResult = {
    success: boolean;
    todo: Todo & { username: string }; // 修改：确保返回的todo包含用户名
}; 