import {
    ADD_TODO,
    DELETE_TODO,
    FETCH_TODOS_REQUEST,
    FETCH_TODOS_SUCCESS,
    FETCH_TODOS_FAILURE,
    MARK_TODO_AS_DONE,
    TOGGLE_SECTION,
} from "./todosTypes";
import { fetchTodosFromAPI } from "../../services/todosService";
import { fetchUsersFromAPI } from "../../services/usersService";
import type { TodoWithUsername, Section } from "../../types/ui";
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

export const toggleSection = (title: string) => ({
    type: TOGGLE_SECTION,
    payload: title,
});

export const fetchTodosRequest = () => ({
    type: FETCH_TODOS_REQUEST,
});

export const fetchTodosSuccess = (sections: Section[]) => ({
    type: FETCH_TODOS_SUCCESS,
    payload: sections,
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

        const grouped = todos.reduce((acc, todo) => {
            const user = users.find(user => user.id === todo.userId);
            const username = user ? user.username : "Unknown";
            if (!acc[username]) {
                acc[username] = [];
            }
            acc[username].push({ ...todo, username });
            return acc;
        }, {} as Record<string, TodoWithUsername[]>);

        const sections = Object.keys(grouped).map(username => ({
            title: username,
            data: grouped[username],
            expanded: true, // 默认展开
        }));

        dispatch(fetchTodosSuccess(sections));
    } catch (error) {
        dispatch(fetchTodosFailure(error.message));
    }
};

