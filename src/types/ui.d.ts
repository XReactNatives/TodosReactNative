// UI相关类型定义
import { Todo } from "./api"; // 导入API类型

// UI展示用的类型，包含username
export type TodoWithUsername = {
    username: string;
} & Todo;

// Section类型定义，用于UI展示的二级列表
export interface Section {
    title: string;
    data: TodoWithUsername[];
    expanded: boolean;
} 