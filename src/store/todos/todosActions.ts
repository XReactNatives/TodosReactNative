import {
    ADD_TODO,
    DELETE_TODO,
    FETCH_TODOS,
    MARK_TODO_AS_DONE,
} from "./todosTypes";
import { fetchTodosFromAPI } from "../../services/todosService";
import type { Todo } from "../../types/todos";
import type { AppDispatch } from "../rootReducer";

export const addTodo = (todo: Todo) => ({
    type: ADD_TODO,
    payload: todo,
});

export const deleteTodo = (id: number) => ({
    type: DELETE_TODO,
    payload: id,
});

export const markTodoAsDone = (id: number) => ({
    type: MARK_TODO_AS_DONE,
    payload: id,
});

export const fetchTodosAsync = () => async (dispatch: AppDispatch) => {
    try {
        const todos = await fetchTodosFromAPI();
        // Tip：建议单行行注释样例：用户演示，只取前10个Todo展示
        const firstTenTodos = todos.slice(0, 10);
        dispatch({ type: FETCH_TODOS, payload: firstTenTodos });
    } catch (error) {
        console.error("Failed to fetch todos", error);
    }
};
