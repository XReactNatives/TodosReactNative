import { api } from "../utils/api.ts";
import type {
    FetchTodosResult,
    ToggleTodoStatusParams,
    ToggleTodoStatusResult,
    DeleteTodoParams,
    DeleteTodoResult,
    AddTodoParams,
    AddTodoResult
} from "../type/api";

const todosEndpoint = "/todos";

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
 * @returns Promise<FetchTodosResult> - 返回待办事项数组
 * @throws ApiError - 网络错误或服务器错误
 */
export const fetchTodosFromAPI = async (): Promise<FetchTodosResult> => {
    return api.get<FetchTodosResult>(todosEndpoint);
};

/**
 * 切换待办事项状态
 * @param params - 请求参数，包含 todoId 和 completed 状态
 * @returns Promise<ToggleTodoStatusResult> - 返回更新结果
 * @throws ApiError - 网络错误或服务器错误
 */
export const toggleTodoStatusFromAPI = async (
    params: ToggleTodoStatusParams
): Promise<ToggleTodoStatusResult> => {
    const { todoId, completed } = params;
    return api.patch<ToggleTodoStatusResult>(`${todosEndpoint}/${todoId}`, { completed });
};

/**
 * 删除待办事项
 * @param params - 请求参数，包含 todoId
 * @returns Promise<DeleteTodoResult> - 返回删除结果
 * @throws ApiError - 网络错误或服务器错误
 */
export const deleteTodoFromAPI = async (
    params: DeleteTodoParams
): Promise<DeleteTodoResult> => {
    const { todoId } = params;
    return api.delete<DeleteTodoResult>(`${todosEndpoint}/${todoId}`);
};

/**
 * 添加待办事项
 * @param params - 请求参数，包含 title, completed
 * @returns Promise<AddTodoResult> - 返回添加结果
 * @throws ApiError - 网络错误或服务器错误
 */
export const addTodoFromAPI = async (
    params: AddTodoParams
): Promise<AddTodoResult> => {
    return api.post<AddTodoResult>(todosEndpoint, params);
};
