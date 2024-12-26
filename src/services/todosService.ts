// Todos API 请求
import { apiConfig } from "../config/apiConfig";
import type { Todo } from "../types/api";

const apiUrl = `${apiConfig.baseURL}/todos`;

export const fetchTodosFromAPI = async (): Promise<Todo[]> => {
    const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
            "x-lk-akv": "5020",
        },
    });

    if (!response.ok) {
        throw new Error("Network response was not ok");
    }

    const data: Todo[] = await response.json();
    return data;
};