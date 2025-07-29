// 统一错误类型定义
export interface AppError {
    code: string;
    message: string;
    details?: any;
    timestamp: number;
}

export type ErrorCode = 
    | 'NETWORK_ERROR'
    | 'VALIDATION_ERROR'
    | 'BUSINESS_ERROR'
    | 'UNKNOWN_ERROR';

// 错误代码常量
export const ERROR_CODES = {
    NETWORK_ERROR: 'NETWORK_ERROR',
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    BUSINESS_ERROR: 'BUSINESS_ERROR',
    UNKNOWN_ERROR: 'UNKNOWN_ERROR',
} as const; 