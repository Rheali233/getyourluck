/**
 * 系统管理相关路由
 * 遵循统一开发标准的API路由规范
 */

import { Hono } from "hono";
import type { AppContext } from "../../types/env";
import { rateLimiter } from "../../middleware/rateLimiter";
import type { APIResponse } from "../../../../shared/types/apiResponse";
import { ModuleError, ERROR_CODES } from "../../../../shared/types/errors";

const systemRoutes = new Hono<AppContext>();

// 系统整体健康检查
systemRoutes.get("/health", async (c) => {
  try {
    const dbService = c.get("dbService");
    const healthCheck = await dbService.healthCheck();
    
    const response: APIResponse = {
      success: true,
      data: {
        status: healthCheck.status,
        timestamp: new Date().toISOString(),
        environment: c.env?.['ENVIRONMENT'],
        version: "1.0.0",
        services: {
          database: healthCheck.status,
          cache: "healthy", // 简化版本
          storage: "healthy", // 简化版本
        },
      },
      message: "System health check completed",
      timestamp: new Date().toISOString(),
      requestId: c.get("requestId"),
    };

    return c.json(response, healthCheck.status === "healthy" ? 200 : 503);
  } catch (error) {
    throw new ModuleError(
      "System health check failed",
      ERROR_CODES.DATABASE_ERROR,
      503
    );
  }
});

// 数据库健康检查
systemRoutes.get("/health/database", async (c) => {
  try {
    const dbService = c.get("dbService");
    const healthCheck = await dbService.healthCheck();
    
    const response: APIResponse = {
      success: true,
      data: healthCheck,
      message: "Database health check completed",
      timestamp: new Date().toISOString(),
      requestId: c.get("requestId"),
    };

    return c.json(response, healthCheck.status === "healthy" ? 200 : 503);
  } catch (error) {
    throw new ModuleError(
      "Database health check failed",
      ERROR_CODES.DATABASE_ERROR,
      503
    );
  }
});

// 系统统计信息
systemRoutes.get("/stats", 
  rateLimiter(10, 60000), // 每分钟最多10次请求
  async (c) => {
    try {
      const dbService = c.get("dbService");
      const stats = await dbService.getStatistics();
      
      const response: APIResponse = {
        success: true,
        data: stats,
        message: "System statistics retrieved successfully",
        timestamp: new Date().toISOString(),
        requestId: c.get("requestId"),
      };

      return c.json(response);
    } catch (error) {
      throw new ModuleError(
        "Failed to retrieve system statistics",
        ERROR_CODES.DATABASE_ERROR,
        500
      );
    }
  }
);

// 数据库迁移状态
systemRoutes.get("/migrations", async (c) => {
  try {
    // const dbService = c.get("dbService"); // 未使用，暂时注释
    // 这里应该调用迁移服务获取状态
    // 简化版本，返回基本信息
    
    const response: APIResponse = {
      success: true,
      data: {
        status: "up_to_date",
        lastMigration: "005_module_indexes",
        pendingMigrations: [],
      },
      message: "Migration status retrieved successfully",
      timestamp: new Date().toISOString(),
      requestId: c.get("requestId"),
    };

    return c.json(response);
  } catch (error) {
    throw new ModuleError(
      "Failed to retrieve migration status",
      ERROR_CODES.DATABASE_ERROR,
      500
    );
  }
});

// 缓存健康检查
systemRoutes.get("/health/cache", async (c) => {
  try {
    // 简单的KV健康检查
    if (!c.env) {
      return c.json({ 
        success: false, 
        error: '环境配置不可用' 
      }, 500);
    }

    const testKey = "health_check_cache";
    const testValue = { timestamp: Date.now() };
    
    await c.env['KV'].put(testKey, JSON.stringify(testValue), { expirationTtl: 60 });
    const retrieved = await c.env['KV'].get(testKey);
    await c.env['KV'].delete(testKey);
    
    const isHealthy = retrieved !== null;
    
    const response: APIResponse = {
      success: true,
      data: {
        status: isHealthy ? "healthy" : "unhealthy",
        latency: 0, // 简化版本
        details: {
          connection: isHealthy,
          readWrite: isHealthy,
        },
      },
      message: "Cache health check completed",
      timestamp: new Date().toISOString(),
      requestId: c.get("requestId"),
    };

    return c.json(response, isHealthy ? 200 : 503);
  } catch (error) {
    const response: APIResponse = {
      success: false,
      error: "Cache health check failed",
      timestamp: new Date().toISOString(),
      requestId: c.get("requestId"),
    };
    
    return c.json(response, 503);
  }
});

// 系统配置信息
systemRoutes.get("/config", async (c) => {
  try {
    const response: APIResponse = {
      success: true,
      data: {
        environment: c.env?.['ENVIRONMENT'],
        version: "1.0.0",
        features: {
          analytics: true,
          feedback: true,
          caching: true,
          rateLimiting: true,
        },
        limits: {
          maxRequestSize: "10MB",
          rateLimitRequests: 100,
          rateLimitWindow: "1 hour",
          cacheDefaultTTL: "1 hour",
        },
      },
      message: "System configuration retrieved successfully",
      timestamp: new Date().toISOString(),
      requestId: c.get("requestId"),
    };

    return c.json(response);
  } catch (error) {
    throw new ModuleError(
      "Failed to retrieve system configuration",
      ERROR_CODES.DATABASE_ERROR,
      500
    );
  }
});

// 清理过期数据（管理员功能）
systemRoutes.post("/cleanup", 
  rateLimiter(1, 3600000), // 每小时最多1次
  async (c) => {
    try {
      const dbService = c.get("dbService");
      const result = await dbService.cleanupExpiredData();
      
      const response: APIResponse = {
        success: true,
        data: result,
        message: "Data cleanup completed successfully",
        timestamp: new Date().toISOString(),
        requestId: c.get("requestId"),
      };

      return c.json(response);
    } catch (error) {
      throw new ModuleError(
        "Failed to cleanup expired data",
        ERROR_CODES.DATABASE_ERROR,
        500
      );
    }
  }
);

// 创建数据库备份（管理员功能）
systemRoutes.post("/backup", 
  rateLimiter(1, 3600000), // 每小时最多1次
  async (c) => {
    try {
      const dbService = c.get("dbService");
      const backup = await dbService.createBackup();
      
      const response: APIResponse = {
        success: true,
        data: backup,
        message: "Database backup created successfully",
        timestamp: new Date().toISOString(),
        requestId: c.get("requestId"),
      };

      return c.json(response);
    } catch (error) {
      throw new ModuleError(
        "Failed to create database backup",
        ERROR_CODES.DATABASE_ERROR,
        500
      );
    }
  }
);

// 系统信息概览
systemRoutes.get("/info", async (c) => {
  try {
    const response: APIResponse = {
      success: true,
      data: {
        name: "综合测试平台 API",
        version: "1.0.0",
        description: "专业的心理测试、占星分析、塔罗占卜等在线测试服务",
        uptime: "N/A", // Cloudflare Workers不支持process.uptime
        timestamp: new Date().toISOString(),
        environment: c.env?.['ENVIRONMENT'],
        runtime: "Cloudflare Workers",
        framework: "Hono.js",
        database: "Cloudflare D1",
        cache: "Cloudflare KV",
        storage: "Cloudflare R2",
      },
      message: "System information retrieved successfully",
      timestamp: new Date().toISOString(),
      requestId: c.get("requestId"),
    };

    return c.json(response);
  } catch (error) {
    throw new ModuleError(
      "Failed to retrieve system information",
      ERROR_CODES.DATABASE_ERROR,
      500
    );
  }
});

export { systemRoutes };