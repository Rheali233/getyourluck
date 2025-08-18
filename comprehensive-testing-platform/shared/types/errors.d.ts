/**
 * 统一错误处理类型定义
 * 遵循统一开发标准中的ModuleError规范
 */
export declare class ModuleError extends Error {
    code: string;
    statusCode: number;
    details?: any | undefined;
    constructor(message: string, code: string, statusCode?: number, details?: any | undefined);
}
export declare const ERROR_CODES: {
    readonly VALIDATION_ERROR: "VALIDATION_ERROR";
    readonly NETWORK_ERROR: "NETWORK_ERROR";
    readonly TEST_NOT_FOUND: "TEST_NOT_FOUND";
    readonly CALCULATION_ERROR: "CALCULATION_ERROR";
    readonly DATABASE_ERROR: "DATABASE_ERROR";
    readonly UNAUTHORIZED: "UNAUTHORIZED";
    readonly RATE_LIMITED: "RATE_LIMITED";
    readonly NOT_FOUND: "NOT_FOUND";
};
export type ErrorCode = typeof ERROR_CODES[keyof typeof ERROR_CODES];
//# sourceMappingURL=errors.d.ts.map