import {
    ADD_TODO,
    DELETE_TODO,
    FETCH_TODOS_REQUEST,
    FETCH_TODOS_SUCCESS,
    FETCH_TODOS_FAILURE,
    MARK_TODO_AS_DONE,
    TOGGLE_SECTION,
    AddTodoAction,
    DeleteTodoAction,
    MarkTodoAsDoneAction,
    ToggleSectionAction,
    FetchTodosRequestAction,
    FetchTodosSuccessAction, FetchTodosFailureAction,
} from "./todosTypes";
import { getTodosWithSections } from "../../domain/todosUseCase";
import type { AppDispatch } from "../rootReducer";
import {Section, TodoWithUsername} from "../../types/ui";

export const addTodo = (todoWithUsername: TodoWithUsername): AddTodoAction => ({
    type: ADD_TODO,
    payload: todoWithUsername,
});


export const deleteTodo = (id: number): DeleteTodoAction => ({
    type: DELETE_TODO,
    payload: id,
});

export const markTodoAsDone = (id: number): MarkTodoAsDoneAction => ({
    type: MARK_TODO_AS_DONE,
    payload: id,
});

export const toggleSection = (title: string): ToggleSectionAction => ({
    type: TOGGLE_SECTION,
    payload: title,
});

export const fetchTodosRequest = (): FetchTodosRequestAction => ({
    type: FETCH_TODOS_REQUEST,
});

export const fetchTodosSuccess = (sections: Section[]): FetchTodosSuccessAction => ({
    type: FETCH_TODOS_SUCCESS,
    payload: sections,
});

export const fetchTodosFailure = (error: string): FetchTodosFailureAction => ({
    type: FETCH_TODOS_FAILURE,
    payload: error,
});

// 异步action：获取并组合Todos和Users数据
export const fetchTodosWithUsernamesAsync = () => async (dispatch: AppDispatch) => {
    dispatch(fetchTodosRequest());
    try {
        const sections = await getTodosWithSections();
        dispatch(fetchTodosSuccess(sections));
    } catch (error) {
        if (error instanceof Error) {
            dispatch(fetchTodosFailure(error.message));
        } else {
            dispatch(fetchTodosFailure("Unknown error occurred"));
        }
    }
};

