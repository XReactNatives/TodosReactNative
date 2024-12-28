import type {Section, TodoWithUsername} from "../../types/ui";

export const ADD_TODO = "ADD_TODO";
export const DELETE_TODO = "DELETE_TODO";
export const MARK_TODO_AS_DONE = "MARK_TODO_AS_DONE";
export const FETCH_TODOS_REQUEST = "FETCH_TODOS_REQUEST";
export const FETCH_TODOS_SUCCESS = "FETCH_TODOS_SUCCESS";
export const FETCH_TODOS_FAILURE = "FETCH_TODOS_FAILURE";
export const TOGGLE_SECTION = "TOGGLE_SECTION";

export interface AddTodoAction {
    type: typeof ADD_TODO;
    payload: TodoWithUsername;
}

export interface DeleteTodoAction {
    type: typeof DELETE_TODO;
    payload: number;
}

export interface MarkTodoAsDoneAction {
    type: typeof MARK_TODO_AS_DONE;
    payload: number;
}

export interface FetchTodosRequestAction {
    type: typeof FETCH_TODOS_REQUEST;
}

export interface FetchTodosSuccessAction {
    type: typeof FETCH_TODOS_SUCCESS;
    payload: Section[]; // 假设根据实际需要
}

export interface FetchTodosFailureAction {
    type: typeof FETCH_TODOS_FAILURE;
    payload: string; // 错误信息
}

export interface ToggleSectionAction {
    type: typeof TOGGLE_SECTION;
    payload: string; // section title
}

export type TodoAction =
    | AddTodoAction
    | DeleteTodoAction
    | MarkTodoAsDoneAction
    | FetchTodosRequestAction
    | FetchTodosSuccessAction
    | FetchTodosFailureAction
    | ToggleSectionAction;