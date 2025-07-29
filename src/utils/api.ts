// Tips：通用API客户端工具
// 定义：封装fetch API，提供统一的HTTP请求和错误处理
// 职责：
// 1. 统一处理HTTP请求和响应
// 2. 统一错误处理逻辑
// 3. 提供类型安全的API调用接口
// 优势：
// • 消除重复的HTTP请求代码
// • 统一错误处理模式
// • 类型安全，易于维护

import { apiConfig } from '../configs/apiConfig';

// 通用API错误类型
export interface ApiError {
    message: string;
    status?: number;
}

// 通用API客户端配置
interface ApiClientConfig {
    baseURL: string;
    defaultHeaders?: Record<string, string>;
}

// 通用API客户端
export class Api {
    private baseURL: string;
    private defaultHeaders: Record<string, string>;

    constructor(config: ApiClientConfig) {
        this.baseURL = config.baseURL;
        this.defaultHeaders = {
            'Content-Type': 'application/json',
            ...config.defaultHeaders,
        };
    }

    /**
     * 通用HTTP请求方法
     * @param url 请求URL
     * @param options 请求选项
     * @returns Promise<T> 响应数据
     * @throws ApiError 网络错误或服务器错误
     */
    private async request<T>(url: string, options: RequestInit = {}): Promise<T> {
        try {
            const response = await fetch(url, {
                headers: {
                    ...this.defaultHeaders,
                    ...options.headers,
                },
                ...options,
            });

            if (!response.ok) {
                const error: ApiError = {
                    message: `HTTP ${response.status}: ${response.statusText}`,
                    status: response.status,
                };
                throw error;
            }

            // 处理空响应
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                return response.json();
            }

            return response.text() as T;
        } catch (error) {
            if (error instanceof Error) {
                const apiError: ApiError = {
                    message: error.message,
                };
                throw apiError;
            }
            throw error;
        }
    }

    /**
     * GET请求
     * @param endpoint 端点路径
     * @param options 请求选项
     * @returns Promise<T> 响应数据
     */
    async get<T>(endpoint: string, options?: RequestInit): Promise<T> {
        const url = `${this.baseURL}${endpoint}`;
        return this.request<T>(url, { method: 'GET', ...options });
    }

    /**
     * POST请求
     * @param endpoint 端点路径
     * @param data 请求数据
     * @param options 请求选项
     * @returns Promise<T> 响应数据
     */
    async post<T>(endpoint: string, data?: any, options?: RequestInit): Promise<T> {
        const url = `${this.baseURL}${endpoint}`;
        return this.request<T>(url, {
            method: 'POST',
            body: data ? JSON.stringify(data) : undefined,
            ...options,
        });
    }

    /**
     * PATCH请求
     * @param endpoint 端点路径
     * @param data 请求数据
     * @param options 请求选项
     * @returns Promise<T> 响应数据
     */
    async patch<T>(endpoint: string, data?: any, options?: RequestInit): Promise<T> {
        const url = `${this.baseURL}${endpoint}`;
        return this.request<T>(url, {
            method: 'PATCH',
            body: data ? JSON.stringify(data) : undefined,
            ...options,
        });
    }

    /**
     * DELETE请求
     * @param endpoint 端点路径
     * @param options 请求选项
     * @returns Promise<T> 响应数据
     */
    async delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
        const url = `${this.baseURL}${endpoint}`;
        return this.request<T>(url, { method: 'DELETE', ...options });
    }
}

// 创建默认API客户端实例
export const api = new Api({
    baseURL: apiConfig.baseURL,
});
