// 统一错误类型定义
export interface AppError {
    code: string;
    message: string;
    details?: unknown;
    timestamp: number;
}

export type ErrorCode = 
    | 'NETWORK_ERROR'
    | 'VALIDATION_ERROR'
    | 'BUSINESS_ERROR'
    | 'UNKNOWN_ERROR'; 