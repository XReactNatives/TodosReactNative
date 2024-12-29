// Todos API 请求
import { apiConfig } from "../config/apiConfig";
import type { Todo } from "../types/api";
import { fetchUsersFromAPI } from "./usersService";
import type { TodoWithUsername, Section } from "../types/ui";

const apiUrl = `${apiConfig.baseURL}/todos`;

export const fetchTodosFromAPI = async (): Promise<Todo[]> => {
    const response = await fetch(apiUrl, {
        method: "GET",
    });

    if (!response.ok) {
        throw new Error("Network response was not ok");
    }

    const data: Todo[] = await response.json();
    return data;
};

// export const fetchTodosWithSections = async (): Promise<Section[]> => {
//     const todos = await fetchTodosFromAPI();
//     const users = await fetchUsersFromAPI();
//
//     const grouped = todos.reduce((acc, todo) => {
//         const user = users.find(user => user.id === todo.userId);
//         const username = user ? user.username : "Unknown";
//         if (!acc[username]) {
//             acc[username] = [];
//         }
//         acc[username].push({ ...todo, username });
//         return acc;
//     }, {} as Record<string, TodoWithUsername[]>);
//
//     return Object.keys(grouped).map(username => ({
//         title: username,
//         data: grouped[username],
//         expanded: true,
//     }));
// };