/**
 * Cloudflare Workers 主入口文件
 * 遵循统一开发标准的API架构
 */

import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { secureHeaders } from "hono/secure-headers";
import { errorHandler } from "./middleware/errorHandler";
import { v1Routes } from "./routes/v1";
import { blogRoutes } from "./routes/blog";
import { feedbackRoutes } from "./routes/feedback";
import { uploadRoute } from "./routes/feedback/upload";
import { analyticsRoutes } from "./routes/analytics";
import { homepageRoutes } from "./routes/homepage";
import { searchRoutes } from "./routes/search";
import { cookiesRoutes } from "./routes/cookies";
import astrologyRoutes from "./routes/astrology";
import tarotRoutes from "./routes/tarot";
import testResultsRoutes from "./routes/testResults";
import seoRoutes from "./routes/seo";
import { learningQuestionsRoutes } from "./routes/learning-ability/questions";
import { learningTestRoutes } from "./routes/learning-ability/test";
import questionsRouter from "./routes/psychology/questions";
import { optionsRouter } from "./routes/psychology/options";
import { aiRoutes } from "./routes/ai";
import { careerQuestionsRouter } from "./routes/career/questions";
import { careerTestRouter } from "./routes/career/test";
import { relationshipQuestionsRouter } from "./routes/relationship/questions";
import { DatabaseService } from "./services/DatabaseService";
import { CacheService } from "./services/CacheService";

import type { APIResponse } from "../../shared/types/apiResponse";
import type { AppContext } from "./types/env";

// Cloudflare Workers 环境类型定义
export interface Env {
  DB?: any; // D1Database - 可选，支持本地开发
  KV?: any; // KVNamespace - 可选，支持本地开发
  BUCKET?: any; // R2Bucket - 可选，支持本地开发
  ENVIRONMENT: string;
  [key: string]: any; // 添加索引签名
}



const app = new Hono<AppContext>();

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
      "http://localhost:3002", // Vite dev server  
      "http://localhost:5173",
      "https://*.pages.dev",
      "https://*.cloudflare.com",
      "https://getyourluck-testing-platform.pages.dev", // 明确指定Pages域名
      "https://selfatlas.net", // 生产域名
      "https://www.selfatlas.net", // 带www的域名
    ];
    
    if (!origin) {
      return origin; // 允许无origin的请求（如Postman），返回null/undefined表示允许
    }
    
    const allowed = allowedOrigins.some(allowed => {
      if (allowed.includes("*")) {
        // 🔥 修复：正确转义正则表达式并处理通配符
        const pattern = allowed
          .replace(/\./g, "\\.")  // 转义点号
          .replace(/\*/g, ".*");  // 替换通配符
        return new RegExp(`^${pattern}$`).test(origin);
      }
      return allowed === origin;
    });
    return allowed ? origin : null;
  },
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD", "PATCH"],
  allowHeaders: [
    "Content-Type", 
    "Authorization", 
    "X-Request-ID",
    "X-API-Key",
    "Cache-Control",
    "Accept",
    "Origin",
    "X-Requested-With",
  ],
  exposeHeaders: [
    "Content-Length",
    "X-Request-ID",
  ],
  credentials: true,
  maxAge: 86400, // 24小时
}));

// 请求日志中间件
app.use("*", logger());

// 全局OPTIONS处理 - 确保CORS预检请求得到正确处理
app.options("*", (c) => {
  return c.text("", 204 as any);
});

// 请求验证中间件 - 暂时注释掉以诊断问题
// app.use("*", requestValidator);

// 服务初始化中间件
app.use("*", async (c, next) => {
  // 生成请求ID
  const requestId = c.req.header("X-Request-ID") || crypto.randomUUID();
  
  // 检查环境变量
  
  // 初始化数据库服务 - 使用Cloudflare D1
  const dbService = new DatabaseService(c.env);
  
  // 初始化缓存服务 - 使用Cloudflare KV
  const cacheService = new CacheService(c.env.KV || null, 3600);
  
  // 初始化数据库（运行迁移）
  try {
    await dbService.initialize();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Failed to initialize database:", error);
    // 继续执行，但记录错误
  }
  
  // 设置上下文变量
  c.set("requestId", requestId);
  c.set("dbService", dbService);
  c.set("cacheService", cacheService);
  
  await next();
});

// 错误处理中间件
app.onError(errorHandler);

// Root path - Welcome page
app.get("/", (c) => {
  const response: APIResponse = {
    success: true,
    data: {
      message: "Welcome to Comprehensive Testing Platform API",
      version: "1.0.0",
      environment: c.env.ENVIRONMENT || "staging",
      timestamp: new Date().toISOString(),
      endpoints: {
        health: "/health",
        api: "/api",
        v1: "/api/v1",
        blog: "/api/blog",
        feedback: "/api/feedback",
        analytics: "/api/analytics",
        homepage: "/api/homepage",
        search: "/api/search",
        cookies: "/api/cookies",
        system: "/api/system",
      },
    },
    timestamp: new Date().toISOString(),
    requestId: (c.get("requestId") as string) || "",
  };
  
  return c.json(response);
});

// 健康检查端点
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
      requestId: (c.get("requestId") as string) || "",
    };

    return c.json(response, healthCheck.status === "healthy" ? 200 : 503);
  } catch (error) {
    const response: APIResponse = {
      success: false,
      error: "Health check failed",
      timestamp: new Date().toISOString(),
      requestId: (c.get("requestId") as string) || "",
    };
    
    return c.json(response, 503);
  }
});

// API路由
app.route("/api/v1", v1Routes);
app.route("/api/blog", blogRoutes);
app.route("/api/feedback", feedbackRoutes);
app.route("/api/feedback/upload", uploadRoute);
app.route("/api/analytics", analyticsRoutes);
app.route("/api/homepage", homepageRoutes);
app.route("/api/search", searchRoutes);
app.route("/api/cookies", cookiesRoutes);
app.route("/api/astrology", astrologyRoutes);
app.route("/api/tarot", tarotRoutes);
app.route("/api/test-results", testResultsRoutes);
app.route("/api/seo", seoRoutes);
app.route("/api/learning-ability/questions", learningQuestionsRoutes);
app.route("/api/learning-ability/test", learningTestRoutes);
app.route("/api/psychology/questions", questionsRouter);
app.route("/api/career/questions", careerQuestionsRouter);
app.route("/api/career/test", careerTestRouter);
app.route("/api/relationship/questions", relationshipQuestionsRouter);
app.route("/api/psychology/options", optionsRouter);
app.route("/api/ai", aiRoutes);
// app.route("/api/recommendations", recommendationsRoutes); // 暂时注释，未定义
// app.route("/api/seo", seoRoutes); // 暂时注释，未定义

// API版本信息
app.get("/api", (c) => {
  const response: APIResponse = {
    success: true,
    data: {
      name: "Comprehensive Testing Platform API",
      version: "1.0.0",
      description: "Professional psychological testing, astrology analysis, tarot reading and other online testing services API",
              endpoints: {
          v1: "/api/v1",
          blog: "/api/blog", 
          feedback: "/api/feedback",
          analytics: "/api/analytics",
          homepage: "/api/homepage",
          search: "/api/search",
          cookies: "/api/cookies",
          astrology: "/api/astrology",
          // recommendations: "/api/recommendations", // 暂时注释
          seo: "/api/seo",
          system: "/api/system",
        },
      documentation: "https://docs.example.com/api",
    },
    timestamp: new Date().toISOString(),
    requestId: (c.get("requestId") as string) || "",
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
    requestId: (c.get("requestId") as string) || "",
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
    requestId: (c.get("requestId") as string) || "",
  };
  
  return c.json(response, 405);
});

export default app;
