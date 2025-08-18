/**
 * 统一请求验证中间件
 * 遵循统一开发标准的请求验证规范
 */

import type { Context, Next } from "hono";
import { ModuleError, ERROR_CODES } from "../../../shared/types/errors";
import { ValidationService } from "../services/ValidationService";
import type { APIResponse } from "../../../shared/types/apiResponse";

export const requestValidator = async (c: Context, next: Next): Promise<void> => {
  try {
    // 验证请求头
    await validateHeaders(c);
    
    // 验证请求大小
    await validateRequestSize(c);
    
    // 验证Content-Type（对于POST/PUT请求）
    await validateContentType(c);
    
    // 验证User-Agent
    validateUserAgent(c);
    
    await next();
  } catch (error) {
    if (error instanceof ModuleError) {
      const response: APIResponse = {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
        requestId: c.req.header("X-Request-ID") || crypto.randomUUID(),
      };
      
      c.status(error.statusCode);
      await c.json(response);
      return;
    }
    
    // 未知错误
    const response: APIResponse = {
      success: false,
      error: "Request validation failed",
      timestamp: new Date().toISOString(),
      requestId: c.req.header("X-Request-ID") || crypto.randomUUID(),
    };
    
    c.status(400);
    await c.json(response);
    return;
  }
};

/**
 * 验证请求头
 */
async function validateHeaders(c: Context): Promise<void> {
  const headers = c.req.header();
  
  // 检查必需的请求头
  const requiredHeaders = ["host"];
  for (const header of requiredHeaders) {
    if (!headers[header]) {
      throw new ModuleError(
        `Missing required header: ${header}`,
        ERROR_CODES.VALIDATION_ERROR,
        400
      );
    }
  }
  
  // 验证Authorization头格式（如果存在）
  const authHeader = c.req.header("Authorization");
  if (authHeader && !isValidAuthHeader(authHeader)) {
    throw new ModuleError(
      "Invalid Authorization header format",
      ERROR_CODES.UNAUTHORIZED,
      401
    );
  }
  
  // 验证X-Request-ID格式（如果存在）
  const requestId = c.req.header("X-Request-ID");
  if (requestId && !isValidUUID(requestId)) {
    throw new ModuleError(
      "Invalid X-Request-ID format, must be a valid UUID",
      ERROR_CODES.VALIDATION_ERROR,
      400
    );
  }
}

/**
 * 验证请求大小
 */
async function validateRequestSize(c: Context): Promise<void> {
  const contentLength = c.req.header("Content-Length");
  
  if (contentLength) {
    const size = parseInt(contentLength);
    const maxSize = 10 * 1024 * 1024; // 10MB
    
    if (size > maxSize) {
      throw new ModuleError(
        "Request body too large",
        ERROR_CODES.VALIDATION_ERROR,
        413
      );
    }
  }
}

/**
 * 验证Content-Type
 */
async function validateContentType(c: Context): Promise<void> {
  const method = c.req.method;
  const contentType = c.req.header("Content-Type");
  
  // POST和PUT请求需要Content-Type
  if (["POST", "PUT", "PATCH"].includes(method)) {
    if (!contentType) {
      throw new ModuleError(
        "Content-Type header is required for this method",
        ERROR_CODES.VALIDATION_ERROR,
        400
      );
    }
    
    // 验证支持的Content-Type
    const supportedTypes = [
      "application/json",
      "application/x-www-form-urlencoded",
      "multipart/form-data",
    ];
    
    const ct = contentType || "";
    const baseType = ct.includes(";") ? (ct.split(";")[0] || "").trim() : ct.trim();
    if (!supportedTypes.includes(baseType)) {
      throw new ModuleError(
        `Unsupported Content-Type: ${baseType}`,
        ERROR_CODES.VALIDATION_ERROR,
        415
      );
    }
  }
}

/**
 * 验证User-Agent
 */
function validateUserAgent(c: Context): void {
  const userAgent = c.req.header("User-Agent");
  
  if (userAgent && !ValidationService.validateUserAgent(userAgent)) {
    throw new ModuleError(
      "Invalid User-Agent header",
      ERROR_CODES.VALIDATION_ERROR,
      400
    );
  }
}

/**
 * 验证Authorization头格式
 */
function isValidAuthHeader(authHeader: string): boolean {
  // 支持的格式：Bearer <token>, Basic <credentials>, API-Key <key>
  const patterns = [
    /^Bearer\s+[A-Za-z0-9\-._~+/]+=*$/,
    /^Basic\s+[A-Za-z0-9+/]+=*$/,
    /^API-Key\s+[A-Za-z0-9\-._~]+$/,
  ];
  
  return patterns.some(pattern => pattern.test(authHeader));
}

/**
 * 验证UUID格式
 */
function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}