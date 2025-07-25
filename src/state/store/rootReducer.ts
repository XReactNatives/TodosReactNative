//根 Reducer
import { combineReducers } from "redux";

import todosReducer from "./todos/todosSlice.ts";
import counterReducer from "./counter/counterSlice.ts";
import type store from "../../store.ts";

// Tips：状态层-combineReducers（RootReducer）
// 定义：应用的根 Reducer，通过 combineReducers 把各 Slice Reducer 汇聚为单一 reducer 函数。
// 职责：
// 1. 决定全局 state 树的顶层命名空间结构；
// 2. 导出 RootState / AppDispatch 类型，供 Selector 与 Typed Hooks 使用。
// 优势：
// • 让不同领域 slice 解耦并独立演化；
// • 类型推断 RootState，避免手写重复类型。
//根 Reducer

/**
 * reduce 拆分融合
 * todosReducer 普通实现
 * counterReducer createSlice实现
 */
const rootReducer = combineReducers({
    todos: todosReducer,
    counter: counterReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

export default rootReducer;
