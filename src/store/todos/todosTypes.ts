import type { Todo } from "../../types/todos";

export const ADD_TODO = "ADD_TODO";
export const DELETE_TODO = "DELETE_TODO";
export const MARK_TODO_AS_DONE = "MARK_TODO_AS_DONE";
export const FETCH_TODOS_REQUEST = "FETCH_TODOS_REQUEST";
export const FETCH_TODOS_SUCCESS = "FETCH_TODOS_SUCCESS";
export const FETCH_TODOS_FAILURE = "FETCH_TODOS_FAILURE";


export interface TodoAction {
    type: string;
    payload?: Todo | number | Todo[] | string;
}
