import {fetchTodosFromAPI} from "../service/todosService";
import {fetchUsersFromAPI} from "../service/usersService";
import type {Section, TodoWithUsername} from "../types/ui";

export const getTodosWithSections = async (): Promise<Section[]> => {
    const todos = await fetchTodosFromAPI();
    const users = await fetchUsersFromAPI();

    const grouped = todos.reduce((acc, todo) => {
        const findUser = users.find(user => Number(user.id) === todo.userId);
        const username = findUser ? findUser.username : "Unknown";
        if (!acc[username]) {
            acc[username] = [];
        }
        acc[username].push({...todo, username});
        return acc;
    }, {} as Record<string, TodoWithUsername[]>);

    return Object.keys(grouped).map(username => ({
        title: username,
        data: grouped[username],
        expanded: true,
    }));
};
