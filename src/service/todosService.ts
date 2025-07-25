import { apiConfig } from "../configs/apiConfig";
import type { Todo } from "../type/api";

const todosApiUrl = `${apiConfig.getConfigByEnv.baseURL}/todos`;

// Tips：服务层 - Service
// 定义：直接与后端或 Mock API 交互的纯网络请求封装，不包含业务规则。
// 职责：
// 1. 负责发起 HTTP 请求，返回 Promise 数据；
// 2. 处理最基本的网络错误并抛出异常；
// 3. 与 Domain/UseCase 解耦，便于替换数据源或做单元测试。
// 优势：
// • 单一职责，易于 Mock 和复用；
// • 给上层提供干净、统一的数据获取接口。
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
