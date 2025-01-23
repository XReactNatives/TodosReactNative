// Todos API 请求
import { apiConfig } from "../config/apiConfig";
import type { Todo } from "../types/api";

const todosApiUrl = `${apiConfig.baseURL}/todos`;

export const fetchTodosFromAPI = async (): Promise<Todo[]> => {
    const response = await fetch(todosApiUrl, {
        method: "GET",
    });

    if (!response.ok) {
        throw new Error("Network response was not ok");
    }

    const data: Todo[] = await response.json();
    return data;
};