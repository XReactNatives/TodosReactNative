//Todos Reducer
import {
    ADD_TODO,
    DELETE_TODO,
    FETCH_TODOS_REQUEST,
    FETCH_TODOS_SUCCESS,
    FETCH_TODOS_FAILURE,
    MARK_TODO_AS_DONE,
} from "./todosTypes";
import type { Todo } from "../../types/todos";
import type { TodoAction } from "./todosTypes";

//Tips：复杂的全局状态管理-redux实现，Todo应用全局状态todos，使用react-redux全局保存
const initialState = {
    todos: [] as Todo[],
    loading: false,
    error: null as string | null,
};

const todosReducer = (state = initialState, action: TodoAction) => {
    switch (action.type) {
        case FETCH_TODOS_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case FETCH_TODOS_SUCCESS:
            return {
                ...state,
                loading: false,
                todos: action.payload as Todo[],
            };
        case FETCH_TODOS_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload as string,
            };
        case ADD_TODO:
            return {
                ...state,
                todos: [...state.todos, action.payload as Todo],
            };
        case DELETE_TODO:
            return {
                ...state,
                todos: state.todos.filter((todo) => todo.id !== action.payload),
            };
        case MARK_TODO_AS_DONE:
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