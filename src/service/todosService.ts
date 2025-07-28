import { apiConfig } from "../configs/apiConfig";
import type { 
    FetchTodosParams, 
    FetchTodosResult, 
    TodosApiError,
    ToggleTodoStatusParams,
    ToggleTodoStatusResult,
    ToggleTodoStatusError,
    DeleteTodoParams,
    DeleteTodoResult,
    DeleteTodoError
} from "../type/api";

const todosApiUrl = `${apiConfig.baseURL}/todos`;

// Tips：服务层 - Service
// 定义：直接与后端或 Mock API 交互的纯网络请求封装，不包含业务规则。
// 职责：
// 1. 负责发起 HTTP 请求，返回 Promise 数据；
// 2. 处理最基本的网络错误并抛出异常；
// 3. 与 Domain/UseCase 解耦，便于替换数据源或做单元测试。
// 优势：
// • 单一职责，易于 Mock 和复用；
// • 给上层提供干净、统一的数据获取接口。

/**
 * 获取待办事项列表
 * @param params - 请求参数，包含可选的 userId
 * @returns Promise<FetchTodosResult> - 返回待办事项数组
 * @throws TodosApiError - 网络错误或服务器错误
 */
export const fetchTodosFromAPI = async (params: FetchTodosParams): Promise<FetchTodosResult> => {
    const { userId } = params;
    const url = userId ? `${todosApiUrl}?userId=${userId}` : todosApiUrl;
    
    try {
        const response = await fetch(url, {
            method: "GET",
        });

        if (!response.ok) {
            const error: TodosApiError = {
                message: `HTTP ${response.status}: ${response.statusText}`,
                status: response.status
            };
            throw error;
        }

        const data: FetchTodosResult = await response.json();
        return data;
    } catch (error) {
        if (error instanceof Error) {
            const apiError: TodosApiError = {
                message: error.message
            };
            throw apiError;
        }
        throw error;
    }
};

/**
 * 切换待办事项状态
 * @param params - 请求参数，包含 todoId 和 completed 状态
 * @returns Promise<ToggleTodoStatusResult> - 返回更新结果
 * @throws ToggleTodoStatusError - 网络错误或服务器错误
 */
export const toggleTodoStatusFromAPI = async (
    params: ToggleTodoStatusParams
): Promise<ToggleTodoStatusResult> => {
    const { todoId, completed } = params;
    const url = `${todosApiUrl}/${todoId}`;
    
    try {
        const response = await fetch(url, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ completed }),
        });

        if (!response.ok) {
            const error: ToggleTodoStatusError = {
                message: `HTTP ${response.status}: ${response.statusText}`,
                status: response.status
            };
            throw error;
        }

        const data: ToggleTodoStatusResult = await response.json();
        return data;
    } catch (error) {
        if (error instanceof Error) {
            const apiError: ToggleTodoStatusError = {
                message: error.message
            };
            throw apiError;
        }
        throw error;
    }
};

/**
 * 删除待办事项
 * @param params - 请求参数，包含 todoId
 * @returns Promise<DeleteTodoResult> - 返回删除结果
 * @throws DeleteTodoError - 网络错误或服务器错误
 */
export const deleteTodoFromAPI = async (
    params: DeleteTodoParams
): Promise<DeleteTodoResult> => {
    const { todoId } = params;
    const url = `${todosApiUrl}/${todoId}`;
    
    try {
        const response = await fetch(url, {
            method: "DELETE",
        });

        if (!response.ok) {
            const error: DeleteTodoError = {
                message: `HTTP ${response.status}: ${response.statusText}`,
                status: response.status
            };
            throw error;
        }

        const data: DeleteTodoResult = await response.json();
        return data;
    } catch (error) {
        if (error instanceof Error) {
            const apiError: DeleteTodoError = {
                message: error.message
            };
            throw apiError;
        }
        throw error;
    }
};
