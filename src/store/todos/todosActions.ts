import {
    ADD_TODO,
    DELETE_TODO,
    FETCH_TODOS_REQUEST,
    FETCH_TODOS_SUCCESS,
    FETCH_TODOS_FAILURE,
    MARK_TODO_AS_DONE,
} from "./todosTypes";
import { fetchTodosFromAPI } from "../../services/todosService";
import { fetchUsersFromAPI } from "../../services/usersService";
import type { TodoWithUsername } from "../../types/ui";
import type { AppDispatch } from "../rootReducer";

export const addTodo = (todo: TodoWithUsername) => ({
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

export const fetchTodosRequest = () => ({
    type: FETCH_TODOS_REQUEST,
});

export const fetchTodosSuccess = (todos: TodoWithUsername[]) => ({
    type: FETCH_TODOS_SUCCESS,
    payload: todos,
});

export const fetchTodosFailure = (error: string) => ({
    type: FETCH_TODOS_FAILURE,
    payload: error,
});

// 异步action：获取并组合Todos和Users数据
export const fetchTodosWithUsernamesAsync = () => async (dispatch: AppDispatch) => {
    dispatch(fetchTodosRequest());
    try {
        const todos = await fetchTodosFromAPI();
        const users = await fetchUsersFromAPI();

        const todosWithUsernames: TodoWithUsername[] = todos.map(todo => {
            const user = users.find(user => user.id === todo.userId);
            return {
                username: user ? user.username : "Unknown",
                ...todo,
            };
        });

        dispatch(fetchTodosSuccess(todosWithUsernames));
    } catch (error) {
        dispatch(fetchTodosFailure(error.message));
    }
};

