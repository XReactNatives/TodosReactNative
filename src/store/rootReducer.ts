//根 Reducer
import { combineReducers } from "redux";

import todosReducer from "./todos/todosReducer";
import counterReducer from "./counter/counterSlice";
import type store from "../store";

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
