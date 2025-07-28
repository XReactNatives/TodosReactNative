// Tips：领域层 - UseCase
// 定义：封装业务规则的应用服务，独立于框架与界面，只关心领域数据转换。
// 职责：
// 1. 协调多个 Service，获取 Todo 与 User 基础数据；
// 2. 执行业务逻辑：按用户名分组、合并数据，转换为 Section 结构；
// 3. 向外暴露纯 Promise<Section[]> 结果，供 State/Thunk 调用。
// 优势：
// • 业务逻辑与状态/UI 解耦，可在 Node 测试或其他前端复用；
// • 单一出口，集中修改复杂规则；
// • 纯函数 + Promise，易于测试与类型推导。

import {fetchTodosFromAPI} from "../service/todosService";
import type {Section, TodoForUI, UserForUI} from "../type/ui";

export const getTodosWithSections = async (
    userId: number | undefined,
    usersCache: UserForUI[]
): Promise<Section[]> => {
    const todos = await fetchTodosFromAPI({ userId });

    // 直接使用传入的 usersCache，因为调用方已经确保其有效性
    const grouped = todos.reduce((acc, todo) => {
        const findUser = usersCache.find(user => Number(user.id) === todo.userId);
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
