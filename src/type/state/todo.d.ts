import type { Todo } from "../api/todo";
import type { User } from "../api/user";

// Todo实体类型（包含username）
export type TodoWithUsername = Todo & { username: string };

// 归一化的Todos存储类型
export type NormalizedTodos = Record<number, TodoWithUsername>;

// 归一化的Users存储类型
export type NormalizedUsers = Record<number, User>;

// Sections展开状态类型
export type SectionsExpanded = Record<string, boolean>;
