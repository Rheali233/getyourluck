/**
 * 统一题目管理API路由
 * 整合所有题目类型的统一接口
 * 遵循RESTful API设计原则
 */

import { Hono } from "hono";
import type { Context } from "hono";
import type { AppContext } from "../../../types/env";
import { rateLimiter } from "../../../middleware/rateLimiter";
import { QuestionBankModel } from "../../../models/QuestionBankModel";
import type { APIResponse } from "../../../types/v1Types";
import { ModuleError, ERROR_CODES } from "../../../types/v1Types";

const questionRoutes = new Hono<AppContext>();

// 应用中间件
questionRoutes.use("*", rateLimiter());

// 获取所有题目分类
questionRoutes.get("/categories", async (c: Context<AppContext>) => {
  try {
    const dbService = c.get("dbService");
    const questionModel = new QuestionBankModel(dbService.env);
    
    console.log("Debug: Attempting to get question categories...");
    const categories = await questionModel.getQuestionCategories();
    console.log("Debug: Categories retrieved:", categories);

    const response: APIResponse = {
      success: true,
      data: categories,
      message: "Question categories retrieved successfully",
      timestamp: new Date().toISOString(),
      requestId: c.get("requestId"),
      version: "1.0.0"
    };

    return c.json(response);
  } catch (error) {
    console.error("Debug: Error in getQuestionCategories:", error);
    if (error instanceof ModuleError) {
      throw error;
    }
    throw new ModuleError(
      "Failed to retrieve question categories",
      ERROR_CODES.DATABASE_ERROR,
      500
    );
  }
});

// 获取特定分类的详情
questionRoutes.get("/categories/:categoryId", async (c: Context<AppContext>) => {
  const categoryId = c.req.param("categoryId");

  try {
    const dbService = c.get("dbService");
    const questionModel = new QuestionBankModel(dbService.env);
    
    const category = await questionModel.getCategoryById(categoryId);

    if (!category) {
      const response: APIResponse = {
        success: false,
        error: "CATEGORY_NOT_FOUND",
        message: "Category not found",
        timestamp: new Date().toISOString(),
        requestId: c.get("requestId"),
        version: "1.0.0"
      };
      return c.json(response, 404);
    }

    const response: APIResponse = {
      success: true,
      data: category,
      message: "Category details retrieved successfully",
      timestamp: new Date().toISOString(),
      requestId: c.get("requestId"),
      version: "1.0.0"
    };

    return c.json(response);
  } catch (error) {
    if (error instanceof ModuleError) {
      throw error;
    }
    throw new ModuleError(
      `Failed to retrieve category details for: ${categoryId}`,
      ERROR_CODES.DATABASE_ERROR,
      500
    );
  }
});

// 获取特定分类的题目
questionRoutes.get("/categories/:categoryId/questions", async (c: Context<AppContext>) => {
  const categoryId = c.req.param("categoryId");
  const language = c.req.query("language") || "en";
  const limit = parseInt(c.req.query("limit") || "50");
  const offset = parseInt(c.req.query("offset") || "0");

  try {
    const dbService = c.get("dbService");
    const questionModel = new QuestionBankModel(dbService.env);
    
    const questions = await questionModel.getQuestionsWithOptionsByCategory(
      categoryId, 
      language, 
      limit, 
      offset
    );

    const response: APIResponse = {
      success: true,
      data: questions,
      message: "Questions retrieved successfully",
      timestamp: new Date().toISOString(),
      requestId: c.get("requestId"),
      version: "1.0.0"
    };

    return c.json(response);
  } catch (error) {
    if (error instanceof ModuleError) {
      throw error;
    }
    throw new ModuleError(
      `Failed to retrieve questions for category: ${categoryId}`,
      ERROR_CODES.DATABASE_ERROR,
      500
    );
  }
});

// 获取特定题目的详情
questionRoutes.get("/questions/:questionId", async (c: Context<AppContext>) => {
  const questionId = c.req.param("questionId");
  const language = c.req.query("language") || "en";

  try {
    const dbService = c.get("dbService");
    const questionModel = new QuestionBankModel(dbService.env);
    
    const question = await questionModel.getQuestionById(questionId, language);

    if (!question) {
      const response: APIResponse = {
        success: false,
        error: "QUESTION_NOT_FOUND",
        message: "Question not found",
        timestamp: new Date().toISOString(),
        requestId: c.get("requestId"),
        version: "1.0.0"
      };
      return c.json(response, 404);
    }

    const response: APIResponse = {
      success: true,
      data: question,
      message: "Question details retrieved successfully",
      timestamp: new Date().toISOString(),
      requestId: c.get("requestId"),
      version: "1.0.0"
    };

    return c.json(response);
  } catch (error) {
    if (error instanceof ModuleError) {
      throw error;
    }
    throw new ModuleError(
      `Failed to retrieve question details for: ${questionId}`,
      ERROR_CODES.DATABASE_ERROR,
      500
    );
  }
});

// 搜索题目
questionRoutes.get("/search", async (c: Context<AppContext>) => {
  const query = c.req.query("q");
  const category = c.req.query("category");
  const language = c.req.query("language") || "en";
  const limit = parseInt(c.req.query("limit") || "20");
  const offset = parseInt(c.req.query("offset") || "0");

  try {
    if (!query) {
      const response: APIResponse = {
        success: false,
        error: "MISSING_QUERY",
        message: "Search query is required",
        timestamp: new Date().toISOString(),
        requestId: c.get("requestId"),
        version: "1.0.0"
      };
      return c.json(response, 400);
    }

    const dbService = c.get("dbService");
    const questionModel = new QuestionBankModel(dbService.env);
    
    const results = await questionModel.searchQuestions(query, category, language, limit, offset);

    const response: APIResponse = {
      success: true,
      data: results,
      message: "Search completed successfully",
      timestamp: new Date().toISOString(),
      requestId: c.get("requestId"),
      version: "1.0.0"
    };

    return c.json(response);
  } catch (error) {
    if (error instanceof ModuleError) {
      throw error;
    }
    throw new ModuleError(
      "Failed to search questions",
      ERROR_CODES.DATABASE_ERROR,
      500
    );
  }
});

// 获取指定维度的题目
questionRoutes.get("/dimensions/:dimension", async (c: Context<AppContext>) => {
  const dimension = c.req.param("dimension");

  try {
    const dbService = c.get("dbService");
    const questionModel = new QuestionBankModel(dbService.env);
    
    const questions = await questionModel.getQuestionsByDimension(dimension);

    const response: APIResponse = {
      success: true,
      data: questions,
      message: "Questions retrieved successfully",
      timestamp: new Date().toISOString(),
      requestId: c.get("requestId"),
      version: "1.0.0"
    };

    return c.json(response);
  } catch (error) {
    if (error instanceof ModuleError) {
      throw error;
    }
    throw new ModuleError(
      `Failed to retrieve questions for dimension: ${dimension}`,
      ERROR_CODES.DATABASE_ERROR,
      500
    );
  }
});

export { questionRoutes };
