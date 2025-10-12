/**
 * API v1 统一路由入口
 * 整合所有v1版本的API路由
 * 遵循统一开发标准的API架构
 */

import { Hono } from "hono";
import type { AppContext } from "../../types/env";
import { testRoutes } from "./tests";
import { questionRoutes } from "./questions";
import { sessionRoutes } from "./sessions";
import { aiRoutes } from "./ai";

const v1Routes = new Hono<AppContext>();

// 注册v1版本的所有路由
v1Routes.route("/tests", testRoutes);
v1Routes.route("/questions", questionRoutes);
v1Routes.route("/sessions", sessionRoutes);
v1Routes.route("/ai", aiRoutes);

// v1版本信息端点
v1Routes.get("/", (c) => {
  return c.json({
    success: true,
    data: {
      version: "1.0.0",
      status: "stable",
      endpoints: {
        tests: "/api/v1/tests",
        questions: "/api/v1/questions",
        sessions: "/api/v1/sessions",
        ai: "/api/v1/ai"
      },
      documentation: "https://docs.example.com/api/v1",
      changelog: "https://docs.example.com/api/v1/changelog"
    },
    message: "API v1 endpoints available",
    timestamp: new Date().toISOString(),
    requestId: c.get("requestId"),
    version: "1.0.0"
  });
});

export { v1Routes };
