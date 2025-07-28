// Users API 请求
import { apiConfig } from "../configs/apiConfig";
import type { FetchUsersParams, FetchUsersResult, UsersApiError } from "../type/api";

const usersApiUrl = `${apiConfig.baseURL}/users`;

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
 * 获取用户列表
 * @param params - 请求参数（目前为空，保留扩展性）
 * @returns Promise<FetchUsersResult> - 返回用户数组
 * @throws UsersApiError - 网络错误或服务器错误
 */
export const fetchUsersFromAPI = async (_params: FetchUsersParams = {}): Promise<FetchUsersResult> => {
    try {
        const response = await fetch(usersApiUrl, {
            method: "GET",
        });

        if (!response.ok) {
            const error: UsersApiError = {
                message: `HTTP ${response.status}: ${response.statusText}`,
                status: response.status
            };
            throw error;
        }

        const data: FetchUsersResult = await response.json();
        return data;
    } catch (error) {
        if (error instanceof Error) {
            const apiError: UsersApiError = {
                message: error.message
            };
            throw apiError;
        }
        throw error;
    }
};
