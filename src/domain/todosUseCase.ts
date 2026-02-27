// Tips：领域层 - UseCase
// 定义：封装业务规则的应用服务，独立于框架与界面，只关心领域数据转换。
// 职责：
// 1. 协调多个 Service，获取 Todo 与 User 基础数据；
// 2. 执行业务逻辑：按用户名分组、合并数据，转换为 Section 结构；
// 3. 业务规则验证：确保数据符合业务要求；
// 4. 数据格式转换：将业务数据转换为UI展示格式；
// 5. 向外暴露纯 Promise<Section[]> 结果，供 State/Thunk 调用。
// 优势：
// • 业务逻辑与状态/UI 解耦，可在 Node 测试或其他前端复用；
// • 单一出口，集中修改复杂规则；
// • 纯函数 + Promise，易于测试与类型推导；
// • 业务规则验证确保数据质量；
// • 数据格式转换确保UI展示一致性。

import {fetchTodosFromAPI} from '../service/todosService';
import {fetchUsersFromAPI} from '../service/usersService';
import type {TodoWithUsername, NormalizedTodos, NormalizedUsers, SectionsExpanded} from '../type/state/todo';
import type {User} from '../type/api/user';
import type {Todo} from '../type/api/todo';

// 业务规则验证1：Todo标题不能为空
const validateTodoTitle = (todo: Todo): boolean => {
    return Boolean(todo.title && todo.title.trim().length > 0);
};

// 业务规则验证2：Todo必须属于有效用户
const validateTodoUser = (todo: Todo, users: User[]): boolean => {
    return users.some(user => Number(user.id) === todo.userId);
};

// 业务规则：生成section标题（用户名 + 邮箱）
const generateSectionTitle = (username: string, email: string): string => {
    return `${username} (${email})`;
};

export const getTodosAndUsersNormalized = async (): Promise<{
    todos: NormalizedTodos;
    users: NormalizedUsers;
    ids: number[];
    sectionsExpanded: SectionsExpanded;
}> => {
    const todosFromAPI = await fetchTodosFromAPI();
    const usersFromAPI = await fetchUsersFromAPI();

    // 应用业务规则验证：过滤无效数据
    const validTodos = todosFromAPI.filter(todo => {
        const hasValidTitle = validateTodoTitle(todo);
        const hasValidUser = validateTodoUser(todo, usersFromAPI);

        if (!hasValidTitle) {
            console.warn(`Todo ${todo.id} has empty title, filtered out`);
        }
        if (!hasValidUser) {
            console.warn(`Todo ${todo.id} has invalid userId: ${todo.userId}, filtered out`);
        }

        return hasValidTitle && hasValidUser;
    });

    // 构建归一化数据结构，同时收集usernames
    const todosNormalized: NormalizedTodos = {};
    const ids: number[] = [];
    const usernamesSet = new Set<string>();

    validTodos.forEach(todo => {
        const user = usersFromAPI.find(u => Number(u.id) === todo.userId);
        const username = user ? user.username : 'Unknown';
        const todoWithUsername: TodoWithUsername = {
            ...todo,
            username,
        };

        todosNormalized[todo.id] = todoWithUsername;
        ids.push(todo.id);
        usernamesSet.add(username);
    });

    const usersNormalized: NormalizedUsers = {};
    usersFromAPI.forEach(user => {
        usersNormalized[user.id] = user;
    });

    // 初始化sectionsExpanded（业务逻辑：生成section标题）
    const sectionsExpanded: SectionsExpanded = {};
    usernamesSet.forEach(username => {
        const user = usersFromAPI.find(u => u.username === username);
        const email = user?.email || 'unknown@example.com';
        const sectionTitle = generateSectionTitle(username, email);
        sectionsExpanded[sectionTitle] = true;
    });

    return { todos: todosNormalized, users: usersNormalized, ids, sectionsExpanded };
};
