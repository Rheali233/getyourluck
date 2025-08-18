/**
 * Cloudflare Workers 主入口文件
 * 遵循统一开发标准的API架构
 */

import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { secureHeaders } from "hono/secure-headers";
import { errorHandler } from "./middleware/errorHandler";
import { requestValidator } from "./middleware/requestValidator";
import { testRoutes } from "./routes/tests";
import { blogRoutes } from "./routes/blog";
import { feedbackRoutes } from "./routes/feedback";
import { analyticsRoutes } from "./routes/analytics";
import { systemRoutes } from "./routes/system";
import { homepageRoutes } from "./routes/homepage";
import { searchRoutes } from "./routes/search";
import { cookiesRoutes } from "./routes/cookies";
import { DatabaseService } from "./services/DatabaseService";

import type { APIResponse } from "../../shared/types/apiResponse";
import type { AppContext } from "./types/env";

// Cloudflare Workers 环境类型定义
export interface Env {
  DB?: D1Database; // 可选，支持本地开发
  KV?: KVNamespace; // 可选，支持本地开发
  BUCKET?: R2Bucket; // 可选，支持本地开发
  ENVIRONMENT: string;
  [key: string]: any; // 添加索引签名
}



const app = new Hono<{ Bindings: Env }>();

// 安全头中间件
app.use("*", secureHeaders({
  xFrameOptions: "DENY",
  xContentTypeOptions: "nosniff",
  referrerPolicy: "strict-origin-when-cross-origin",
  crossOriginEmbedderPolicy: false, // Cloudflare Workers不支持
}));

// CORS中间件
app.use("*", cors({
  origin: (origin) => {
    // 允许的域名列表
    const allowedOrigins = [
      "http://localhost:3000",
      "http://localhost:5173",
      "https://*.pages.dev",
      "https://*.cloudflare.com",
    ];
    
    if (!origin) return true; // 允许无origin的请求（如Postman）
    
    return allowedOrigins.some(allowed => {
      if (allowed.includes("*")) {
        const pattern = allowed.replace("*", ".*");
        return new RegExp(pattern).test(origin);
      }
      return allowed === origin;
    });
  },
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD"],
  allowHeaders: [
    "Content-Type", 
    "Authorization", 
    "X-Request-ID",
    "X-API-Key",
    "Cache-Control",
  ],
  credentials: true,
  maxAge: 86400, // 24小时
}));

// 请求日志中间件
app.use("*", logger());

// 请求验证中间件
app.use("*", requestValidator);

// 服务初始化中间件
app.use("*", async (c, next) => {
  // 生成请求ID
  const requestId = c.req.header("X-Request-ID") || crypto.randomUUID();
  
  // 初始化数据库服务 - 使用Cloudflare D1
  const dbService = new DatabaseService(c.env);
  
  // 设置上下文变量
  c.set("requestId", requestId);
  c.set("dbService", dbService);
  
  await next();
});

// 错误处理中间件
app.onError(errorHandler);

// 系统健康检查和管理端点
app.route("/api/system", systemRoutes);

// 调试端点 - 检查环境变量
app.get("/debug/env", async (c) => {
  return c.json({
    success: true,
    data: {
      hasDB: !!c.env.DB,
      hasKV: !!c.env.KV,
      hasBUCKET: !!c.env.BUCKET,
      environment: c.env.ENVIRONMENT,
      envKeys: Object.keys(c.env),
    },
    timestamp: new Date().toISOString(),
  });
});

// 增强的健康检查端点
app.get("/health", async (c) => {
  try {
    const dbService = c.get("dbService");
    const healthCheck = await dbService.healthCheck();
    
    const response: APIResponse = {
      success: true,
      data: {
        status: healthCheck.status,
        timestamp: new Date().toISOString(),
        environment: c.env.ENVIRONMENT,
        version: "1.0.0",
        services: {
          database: healthCheck.status,
          cache: "healthy", // 简化版本，实际应该检查KV
          storage: "healthy", // 简化版本，实际应该检查R2
        },
      },
      timestamp: new Date().toISOString(),
      requestId: c.get("requestId"),
    };

    return c.json(response, healthCheck.status === "healthy" ? 200 : 503);
  } catch (error) {
    const response: APIResponse = {
      success: false,
      error: "Health check failed",
      timestamp: new Date().toISOString(),
      requestId: c.get("requestId"),
    };
    
    return c.json(response, 503);
  }
});

// API路由
app.route("/api/tests", testRoutes);
app.route("/api/blog", blogRoutes);
app.route("/api/feedback", feedbackRoutes);
app.route("/api/analytics", analyticsRoutes);
app.route("/api/homepage", homepageRoutes);
app.route("/api/search", searchRoutes);
app.route("/api/cookies", cookiesRoutes);
// app.route("/api/recommendations", recommendationsRoutes); // 暂时注释，未定义
// app.route("/api/seo", seoRoutes); // 暂时注释，未定义

// API版本信息
app.get("/api", (c) => {
  const response: APIResponse = {
    success: true,
    data: {
      name: "综合测试平台 API",
      version: "1.0.0",
      description: "专业的心理测试、占星分析、塔罗占卜等在线测试服务API",
              endpoints: {
          tests: "/api/tests",
          blog: "/api/blog", 
          feedback: "/api/feedback",
          analytics: "/api/analytics",
          homepage: "/api/homepage",
          search: "/api/search",
          cookies: "/api/cookies",
          // recommendations: "/api/recommendations", // 暂时注释
          // seo: "/api/seo", // 暂时注释
          system: "/api/system",
        },
      documentation: "https://docs.example.com/api",
    },
    timestamp: new Date().toISOString(),
    requestId: c.get("requestId"),
  };
  
  return c.json(response);
});

// 404处理
app.notFound((c) => {
  const response: APIResponse = {
    success: false,
    error: "Not Found",
    message: "The requested resource was not found",
    timestamp: new Date().toISOString(),
    requestId: c.get("requestId"),
  };
  
  return c.json(response, 404);
});

// 405 Method Not Allowed处理
app.all("*", (c) => {
  const response: APIResponse = {
    success: false,
    error: "Method Not Allowed",
    message: `Method ${c.req.method} is not allowed for this endpoint`,
    timestamp: new Date().toISOString(),
    requestId: c.get("requestId"),
  };
  
  return c.json(response, 405);
});

export default app;