//Todos Reducer
import {
    ADD_TODO,
    DELETE_TODO,
    FETCH_TODOS,
    MARK_TODO_AS_DONE,
} from "./todosTypes";
import type { Todo } from "../../types/todos";
import type { TodoAction } from "./todosTypes";

//Tips：复杂的全局状态管理-redux实现，Todo应用全局状态todos，使用react-redux全局保存
const initialState = {
    todos: [] as Todo[],
};

const todosReducer = (state = initialState, action: TodoAction) => {
    switch (action.type) {
        case ADD_TODO:
            return {
                ...state,
                todos: [...state.todos, action.payload],
            };
        case DELETE_TODO:
            return {
                ...state,
                todos: state.todos.filter((todo) => todo.id !== action.payload),
            };
        case FETCH_TODOS:
            return {
                ...state,
                todos: action.payload,
            };
        case MARK_TODO_AS_DONE: // 新增处理
            return {
                ...state,
                todos: state.todos.map((todo) =>
                    todo.id === action.payload
                        ? { ...todo, completed: true }
                        : todo,
                ),
            };
        default:
            return state;
    }
};

export default todosReducer;