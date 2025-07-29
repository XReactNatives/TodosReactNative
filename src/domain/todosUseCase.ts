// Tips：领域层 - UseCase
// 定义：封装业务规则的应用服务，独立于框架与界面，只关心领域数据转换。
// 职责：
// 1. 协调多个 Service，获取 Todo 与 User 基础数据；
// 2. 执行业务逻辑：按用户名分组、合并数据，转换为 Section 结构；
// 3. 业务规则验证：确保数据符合业务要求；
// 4. 向外暴露纯 Promise<Section[]> 结果，供 State/Thunk 调用。
// 优势：
// • 业务逻辑与状态/UI 解耦，可在 Node 测试或其他前端复用；
// • 单一出口，集中修改复杂规则；
// • 纯函数 + Promise，易于测试与类型推导；
// • 业务规则验证确保数据质量。

import {fetchTodosFromAPI} from "../service/todosService";
import {fetchUsersFromAPI} from "../service/usersService";
import type {Section, TodoForUI} from "../type/ui";
import type {User} from "../type/api/user";
import type {Todo} from "../type/api/todo";

// 业务规则验证1：Todo标题不能为空
const validateTodoTitle = (todo: Todo): boolean => {
    return Boolean(todo.title && todo.title.trim().length > 0);
};

// 业务规则验证2：Todo必须属于有效用户
const validateTodoUser = (todo: Todo, users: User[]): boolean => {
    return users.some(user => Number(user.id) === todo.userId);
};

export const getTodosWithSections = async (): Promise<Section[]> => {
    const todos = await fetchTodosFromAPI();
    const users = await fetchUsersFromAPI();
    
    // 应用业务规则验证：过滤无效数据
    const validTodos = todos.filter(todo => {
        const hasValidTitle = validateTodoTitle(todo);
        const hasValidUser = validateTodoUser(todo, users);
        
        // 记录被过滤的数据（可选，用于调试）
        if (!hasValidTitle) {
            console.warn(`Todo ${todo.id} has empty title, filtered out`);
        }
        if (!hasValidUser) {
            console.warn(`Todo ${todo.id} has invalid userId: ${todo.userId}, filtered out`);
        }
        
        return hasValidTitle && hasValidUser;
    });
    
    // 业务逻辑：将有效的todos按用户名分组，并添加用户名信息
    const grouped = validTodos.reduce((acc, todo) => {
        const findUser = users.find((user: User) => Number(user.id) === todo.userId);
        const username = findUser ? findUser.username : "Unknown";
        if (!acc[username]) {
            acc[username] = [];
        }
        acc[username].push({...todo, username});
        return acc;
    }, {} as Record<string, TodoForUI[]>);

    return Object.keys(grouped).map(username => ({
        title: username,
        data: grouped[username],
        expanded: true,
    }));
};
