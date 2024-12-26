// Users API 请求
import { apiConfig } from "../config/apiConfig";
import type { User } from "../types/api";

const usersApiUrl = `${apiConfig.baseURL}/users`;

export const fetchUsersFromAPI = async (): Promise<User[]> => {
    const response = await fetch(usersApiUrl, {
        method: "GET",
    });

    if (!response.ok) {
        throw new Error("Network response was not ok");
    }

    const data: User[] = await response.json();
    return data;
}; 