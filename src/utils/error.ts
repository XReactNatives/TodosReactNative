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
    details?: unknown
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
export const handleApiError = (error: unknown): AppError => {
    const err = error as { status?: number; message?: string };
    if (err?.status) {
        return createAppError(
            'NETWORK_ERROR',
            `HTTP ${err.status}: ${err.message ?? ''}`,
            { status: err.status }
        );
    }
    if (err?.message) {
        return createAppError(
            'BUSINESS_ERROR',
            err.message,
            { originalError: error }
        );
    }
    return createAppError(
        'UNKNOWN_ERROR',
        'An unknown error occurred',
        { originalError: error }
    );
};
