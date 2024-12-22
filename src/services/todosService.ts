// Todos API 请求
import { apiConfig } from "../config/apiConfig";

const apiUrl = `${apiConfig.baseURL}/todos`;

export const fetchTodosFromAPI = async () => {
    const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
            "x-lk-akv": "5020",
        },
    });

    if (!response.ok) {
        throw new Error("Network response was not ok");
    }

    return await response.json();
};
