/**
 * 博客相关路由
 * 遵循统一开发标准的API路由规范
 */

import { Hono } from "hono";
import type { AppContext } from "../../types/env";
import { rateLimiter } from "../../middleware/rateLimiter";
import type { APIResponse, PaginatedResponse } from "../../../../shared/types/apiResponse";
import { ModuleError, ERROR_CODES } from "../../../../shared/types/errors";

const blogRoutes = new Hono<AppContext>();

// 博客模块根路径
blogRoutes.get("/", async (c) => {
  const response: APIResponse = {
    success: true,
    data: {
      name: "Blog Module",
      description: "Provides blog article management functionality",
      endpoints: {
        articles: "/articles",
        article: "/articles/:id",
        viewCount: "/articles/:id/view"
      },
      version: "1.0.0"
    },
    message: "Blog module information",
    timestamp: new Date().toISOString(),
    requestId: c.get("requestId") || "",
  };

  return c.json(response);
});

// 获取博客文章列表（分页）
blogRoutes.get("/articles", async (c) => {
  const page = parseInt(c.req.query("page") || "1");
  const limit = parseInt(c.req.query("limit") || "10");

  try {
    const dbService = c.get("dbService");
    const category = c.req.query("category") || undefined;
    const articles = await dbService.blogArticles.getList(page, limit, category);
    
    const response: PaginatedResponse = {
      success: true,
      data: articles.data.map((a: any) => ({
        ...a,
        slug: a.slug || a.id,
        coverImage: a.coverImage || a.cover_image || undefined,
      })),
      pagination: articles.pagination,
      message: "Blog articles retrieved successfully",
      timestamp: new Date().toISOString(),
      requestId: c.get("requestId") || "",
    };

    return c.json(response);
  } catch (error) {
    throw new ModuleError(
      "Failed to retrieve blog articles",
      ERROR_CODES.DATABASE_ERROR,
      500
    );
  }
});

// 获取单篇博客文章（仅 slug）
blogRoutes.get("/articles/:slug", async (c) => {
  const slug = c.req.param("slug");

  try {
    const dbService = c.get("dbService");
    const article = await dbService.blogArticles.findBySlug?.(slug) || null;
    
    if (!article) {
      throw new ModuleError(
        `Blog article not found: ${slug}`,
        ERROR_CODES.NOT_FOUND,
        404
      );
    }
    
    // Increment view count
    await dbService.blogArticles.incrementViewCount(article.id);

    const response: APIResponse = {
      success: true,
      data: {
        ...article,
        // 兼容前端字段命名
        coverImage: (article as any).cover_image || (article as any).coverImage,
        slug: (article as any).slug || (article as any).id,
        contentHtml: (article as any).content,
      },
      message: `Blog article ${article.id} retrieved successfully`,
      timestamp: new Date().toISOString(),
      requestId: c.get("requestId") || "",
    };

    return c.json(response);
  } catch (error) {
    throw new ModuleError(
      `Failed to retrieve blog article: ${slug}`,
      ERROR_CODES.DATABASE_ERROR,
      404
    );
  }
});

// 增加文章浏览量
// 基于 slug 的浏览量统计
blogRoutes.post("/articles/:slug/view", 
  rateLimiter(30, 60000), // 每分钟最多30次浏览记录
  async (c) => {
    const slug = c.req.param("slug");

    try {
      const dbService = c.get("dbService");
      // Check article by slug
      const article = await dbService.blogArticles.findBySlug?.(slug);
      if (!article) {
        throw new ModuleError(
          `Blog article not found: ${slug}`,
          ERROR_CODES.NOT_FOUND,
          404
        );
      }
      
      // Update view count
      await dbService.blogArticles.incrementViewCount(article.id);
      
      const response: APIResponse = {
        success: true,
        message: `View count updated for article ${article.id}`,
        timestamp: new Date().toISOString(),
        requestId: c.get("requestId") || "",
      };

      return c.json(response);
    } catch (error) {
      throw new ModuleError(
        `Failed to update view count for article slug`,
        ERROR_CODES.DATABASE_ERROR,
        500
      );
    }
  }
);

export { blogRoutes };