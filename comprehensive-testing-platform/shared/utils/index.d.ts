/**
 * 统一工具函数
 * 遵循统一开发标准的工具函数规范
 */
import type { ClassValue } from "clsx";
export declare function cn(...inputs: ClassValue[]): string;
export declare function generateUUID(): string;
export declare function formatDate(date: Date | string): string;
export declare function delay(ms: number): Promise<void>;
export declare function safeJsonParse<T>(json: string, fallback: T): T;
export declare function hashString(input: string): Promise<string>;
export declare function isValidUUID(uuid: string): boolean;
export declare function sanitizeString(input: string, maxLength?: number): string;
