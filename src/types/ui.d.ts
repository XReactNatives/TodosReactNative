// UI相关类型定义

import { Todo } from "./api"; // 导入API类型

// UI展示用的类型，包含username
export type TodoWithUsername = {
    username: string;
} & Todo; 