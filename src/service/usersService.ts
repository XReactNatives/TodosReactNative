// Users API 请求
import { apiConfig } from "../configs/apiConfig";
import type { User } from "../type/api";

const usersApiUrl = `${apiConfig.getConfigByEnv.baseURL}/users`;

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
