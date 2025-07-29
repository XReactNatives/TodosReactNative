 // 统一错误处理工具
import type { AppError, ErrorCode } from '../type/error';

/**
 * 创建应用错误对象
 * @param code 错误代码
 * @param message 错误消息
 * @param details 错误详情
 * @returns AppError
 */
export const createAppError = (
    code: ErrorCode,
    message: string,
    details?: any
): AppError => ({
    code,
    message,
    details,
    timestamp: Date.now(),
});

/**
 * 处理API错误，转换为统一的应用错误格式
 * @param error 原始错误
 * @returns AppError
 */
export const handleApiError = (error: any): AppError => {
    // 处理网络错误
    if (error?.status) {
        return createAppError(
            'NETWORK_ERROR',
            `HTTP ${error.status}: ${error.message}`,
            { status: error.status }
        );
    }

    // 处理业务错误
    if (error?.message) {
        return createAppError(
            'BUSINESS_ERROR',
            error.message,
            { originalError: error }
        );
    }

    // 处理未知错误
    return createAppError(
        'UNKNOWN_ERROR',
        'An unknown error occurred',
        { originalError: error }
    );
};
