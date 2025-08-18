/**
 * 统一工具函数
 * 遵循统一开发标准的工具函数规范
 */
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
// 样式类名合并工具
export function cn(...inputs) {
    return twMerge(clsx(inputs));
}
// 生成UUID
export function generateUUID() {
    return crypto.randomUUID();
}
// 格式化日期
export function formatDate(date) {
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toISOString();
}
// 延迟函数
export function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
// 安全的JSON解析
export function safeJsonParse(json, fallback) {
    try {
        return JSON.parse(json);
    }
    catch {
        return fallback;
    }
}
// 哈希字符串（用于IP地址等敏感信息）
export async function hashString(input) {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
// 验证UUID格式
export function isValidUUID(uuid) {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
}
// 清理和验证字符串输入
export function sanitizeString(input, maxLength = 1000) {
    return input.trim().slice(0, maxLength);
}
//# sourceMappingURL=index.js.map