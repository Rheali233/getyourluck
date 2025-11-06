/**
 * API URL Builder Utility
 * 统一处理 API URL 构建，确保完整 URL 时自动添加 /api 前缀
 * 
 * 环境差异说明：
 * - Cloudflare Pages: 使用相对路径 /api，Pages Functions 会自动处理
 * - 本地环境（完整 URL）: 需要手动添加 /api 前缀
 */

import { getApiBaseUrl } from '@/config/environment';

/**
 * 构建完整的 API URL
 * @param endpoint API 端点路径（如 /psychology/questions 或 /homepage/modules）
 * @returns 完整的 API URL
 */
export function buildApiUrl(endpoint: string): string {
  const baseUrl = getApiBaseUrl();
  
  // 确保 endpoint 以 / 开头
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  
  // 如果 baseUrl 是完整 URL（http:// 或 https://），需要添加 /api 前缀
  // Cloudflare Pages 环境使用相对路径 /api，不需要这个处理
  if (baseUrl.startsWith('http://') || baseUrl.startsWith('https://')) {
    // 检查 endpoint 是否已经包含 /api
    if (!normalizedEndpoint.startsWith('/api')) {
      return `${baseUrl}/api${normalizedEndpoint}`;
    }
    return `${baseUrl}${normalizedEndpoint}`;
  }
  
  // 如果 baseUrl 是相对路径（如 /api），直接拼接
  // 注意：如果 endpoint 已经包含 /api，这里可能会重复，但 Cloudflare Pages Functions 会正确处理
  if (normalizedEndpoint.startsWith('/api')) {
    return normalizedEndpoint; // endpoint 已包含 /api，直接返回
  }
  
  // baseUrl 是 /api，endpoint 是 /psychology/questions，拼接为 /api/psychology/questions
  return `${baseUrl}${normalizedEndpoint}`;
}

