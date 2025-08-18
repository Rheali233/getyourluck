/**
 * 统一错误处理中间件
 * 负责捕获、记录和处理应用中的各种错误
 */
import { Context, Next } from 'hono';
export declare class AppError extends Error {
    statusCode: number;
    isOperational: boolean;
    code?: string;
    constructor(message: string, statusCode?: number, code?: string, isOperational?: boolean);
}
export declare class ValidationError extends AppError {
    constructor(message: string, code?: string);
}
export declare class AuthenticationError extends AppError {
    constructor(message?: string, code?: string);
}
export declare class AuthorizationError extends AppError {
    constructor(message?: string, code?: string);
}
export declare class NotFoundError extends AppError {
    constructor(message?: string, code?: string);
}
export declare class ConflictError extends AppError {
    constructor(message?: string, code?: string);
}
export declare class RateLimitError extends AppError {
    constructor(message?: string, code?: string);
}
export declare const ERROR_CODES: {
    readonly UNKNOWN_ERROR: "UNKNOWN_ERROR";
    readonly VALIDATION_ERROR: "VALIDATION_ERROR";
    readonly INTERNAL_ERROR: "INTERNAL_ERROR";
    readonly AUTHENTICATION_FAILED: "AUTHENTICATION_FAILED";
    readonly AUTHORIZATION_DENIED: "AUTHORIZATION_DENIED";
    readonly TOKEN_EXPIRED: "TOKEN_EXPIRED";
    readonly INVALID_CREDENTIALS: "INVALID_CREDENTIALS";
    readonly DATA_NOT_FOUND: "DATA_NOT_FOUND";
    readonly DATA_CONFLICT: "DATA_CONFLICT";
    readonly DATA_INVALID: "DATA_INVALID";
    readonly DATABASE_ERROR: "DATABASE_ERROR";
    readonly BUSINESS_RULE_VIOLATION: "BUSINESS_RULE_VIOLATION";
    readonly INVALID_OPERATION: "INVALID_OPERATION";
    readonly RESOURCE_EXHAUSTED: "RESOURCE_EXHAUSTED";
    readonly EXTERNAL_SERVICE_ERROR: "EXTERNAL_SERVICE_ERROR";
    readonly NETWORK_ERROR: "NETWORK_ERROR";
    readonly TIMEOUT_ERROR: "TIMEOUT_ERROR";
};
export declare const errorHandler: (err: Error, c: Context, next: Next) => Promise<(Response & import("hono").TypedResponse<{
    success: boolean;
    data?: any;
    error?: string;
    message?: string;
    timestamp: string;
    requestId?: string;
}>) | undefined>;
export declare function handleError(error: unknown, c: Context): Response & import("hono").TypedResponse<{
    success: boolean;
    data?: any;
    error?: string;
    message?: string;
    timestamp: string;
    requestId?: string;
}>;
export declare function asyncErrorHandler<T extends any[], R>(fn: (...args: T) => Promise<R>): (...args: T) => Promise<R>;
export declare function handleValidationError(errors: any[]): ValidationError;
export declare function handleDatabaseError(error: any): AppError;
export declare function handleNetworkError(error: any): AppError;
export type { AppError, ValidationError, AuthenticationError, AuthorizationError, NotFoundError, ConflictError, RateLimitError };
//# sourceMappingURL=errorHandler.d.ts.map