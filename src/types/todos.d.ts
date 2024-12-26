//全局类型定义
export type Todo = {
    userId: number;
    id: number;
    title: string;
    completed: boolean;
};

// 新的类型定义，包含username
export type TodoWithUsername = {
    username: string;
} & Todo;
