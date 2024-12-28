// UI相关类型定义

// UI展示用的类型，包含username
export type TodoWithUsername = {
    id: number;
    username: string;
    title: string;
    completed: boolean;
}

// Section类型定义，用于UI展示的二级列表
export interface Section {
    title: string;
    data: TodoWithUsername[];
    expanded: boolean;
} 