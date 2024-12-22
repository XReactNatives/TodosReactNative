import type { Todo } from "../../types/todos";

export const ADD_TODO = "ADD_TODO";
export const DELETE_TODO = "DELETE_TODO";
export const FETCH_TODOS = "FETCH_TODOS";
export const MARK_TODO_AS_DONE = "MARK_TODO_AS_DONE";

export interface TodoAction {
    type: string;
    payload?: Todo | number | Todo[];
}
