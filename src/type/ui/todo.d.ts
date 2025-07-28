// UI展示用的类型，包含username
export type TodoForUI = {
    id: number;
    username: string;
    title: string;
    completed: boolean;
}

// Section类型定义，用于UI展示的二级列表
export interface Section {
    title: string;
    data: TodoForUI[];
    expanded: boolean;
}
