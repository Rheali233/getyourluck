# 塔罗牌占卜模块设计文档

## 1. 概述

塔罗牌占卜模块基于综合测试平台的Cloudflare全栈架构，提供专业的在线塔罗牌占卜体验。模块采用完全AI驱动的架构设计，所有占卜逻辑、牌面解读和推荐均由AI完成，平台仅负责数据管理、缓存和用户界面。设计重点关注简洁性、准确性和用户友好性。

**重要说明：** 本模块严格遵循
[统一开发标准](../basic/development-guide.md)，包括：

- 统一的状态管理接口（ModuleState & ModuleActions）
- 统一的API响应格式（APIResponse<T>）
- 统一的组件架构规范（BaseComponentProps）
- 统一的错误处理机制（ModuleError）
- 统一的数据库设计规范

## 2. 架构设计

### 2.1 系统整体架构

┌─────────────────────────────────────────────────────────────────┐ │
塔罗牌前端界面 (React + Tailwind) │
├─────────────────────────────────────────────────────────────────┤ │ 问题分类 │
推荐展示 │ 抽牌体验 │ 解读结果 │ 用户反馈 │
└─────────────────────────────────────────────────────────────────┘ │ │ API调用
▼ ┌─────────────────────────────────────────────────────────────────┐ │
塔罗牌后端服务 (Cloudflare Workers) │
├─────────────────────────────────────────────────────────────────┤ │ AI服务集成
│ 缓存管理 │ 会话管理 │ API路由 │
└─────────────────────────────────────────────────────────────────┘ │ │ 数据访问
▼ ┌─────────────────────────────────────────────────────────────────┐ │
数据存储层 (D1 + KV) │
├─────────────────────────────────────────────────────────────────┤ │ 用户会话 │
AI响应缓存 │ 统计数据 │ 配置信息 │
└─────────────────────────────────────────────────────────────────┘

### 2.2 技术栈选择

#### 前端技术栈

```typescript
const frontendTech = {
  framework: "React.js 18+",
  styling: "Tailwind CSS + 深色神秘主题",
  stateManagement: "Zustand (遵循ModuleState接口)",
  animation: "Framer Motion (3D翻牌动画)",
  buildTool: "Vite",
  deployment: "Cloudflare Pages",
};
```

#### 后端技术栈

```typescript
const backendTech = {
  runtime: "Cloudflare Workers",
  framework: "Hono.js",
  database: "Cloudflare D1 (SQLite)",
  cache: "Cloudflare KV",
  aiService: "OpenAI API / Claude API",
};
```

### 2.3 统一数据类型定义

```typescript
// types/tarotTypes.ts
export interface TarotCard {
  id: string;
  name_zh: string;
  name_en: string;
  suit: string; // 'major' | 'wands' | 'cups' | 'swords' | 'pentacles'
  number: number;
  image_url: string;
  keywords_zh: string[];
  keywords_en: string[];
  meaning_upright_zh: string;
  meaning_upright_en: string;
  meaning_reversed_zh: string;
  meaning_reversed_en: string;
}

export interface DrawnCard {
  card: TarotCard;
  position: number;
  isReversed: boolean;
  positionMeaning: string;
}

export interface QuestionCategory {
  id: string;
  name_zh: string;
  name_en: string;
  description_zh: string;
  description_en: string;
  icon: string;
  color_theme: string;
  sort_order: number;
}

export interface TarotSpread {
  id: string;
  name_zh: string;
  name_en: string;
  description_zh: string;
  description_en: string;
  card_count: number;
  layout_config: {
    positions: Array<{
      x: number;
      y: number;
      rotation?: number;
    }>;
  };
  positions: Array<{
    name: string;
    meaning: string;
  }>;
}

export interface AIReading {
  sessionId: string;
  overall_interpretation: string;
  card_interpretations: Array<{
    position: number;
    card_name: string;
    interpretation: string;
    advice: string;
  }>;
  synthesis: string;
  action_guidance: string[];
  timing_advice?: string;
  generated_at: string;
}

export interface BasicReading {
  summary: string;
  key_themes: string[];
  general_advice: string;
}
```

## 3. 统一数据库设计

### 3.1 标准化数据表结构

#### 塔罗占卜会话表（遵循统一命名规范）

```sql
CREATE TABLE IF NOT EXISTS tarot_sessions (
  id TEXT PRIMARY KEY,
  session_type TEXT NOT NULL DEFAULT 'tarot_reading',
  question_text TEXT,
  question_category_id TEXT,
  input_data TEXT NOT NULL, -- JSON存储用户输入数据
  ai_response_data TEXT NOT NULL, -- JSON存储AI完整响应
  user_feedback TEXT, -- 'like' | 'dislike' | null
  language TEXT DEFAULT 'zh',
  user_agent TEXT,
  ip_address_hash TEXT, -- 哈希后的IP地址
  session_duration INTEGER, -- 占卜用时（秒）
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 统一索引命名规范
CREATE INDEX idx_tarot_sessions_category_date ON tarot_sessions(question_category_id, created_at);
CREATE INDEX idx_tarot_sessions_feedback ON tarot_sessions(user_feedback, created_at);
CREATE INDEX idx_tarot_sessions_created ON tarot_sessions(created_at DESC);
```

#### 问题分类表

```sql
CREATE TABLE IF NOT EXISTS tarot_question_categories (
  id TEXT PRIMARY KEY,
  name_zh TEXT NOT NULL,
  name_en TEXT NOT NULL,
  description_zh TEXT,
  description_en TEXT,
  icon TEXT,
  color_theme TEXT,
  sort_order INTEGER DEFAULT 0,
  usage_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_tarot_categories_active_order ON tarot_question_categories(is_active, sort_order);
```

#### 牌阵配置表

```sql
CREATE TABLE IF NOT EXISTS tarot_spreads (
  id TEXT PRIMARY KEY,
  name_zh TEXT NOT NULL,
  name_en TEXT NOT NULL,
  description_zh TEXT,
  description_en TEXT,
  card_count INTEGER NOT NULL,
  layout_config_data TEXT NOT NULL, -- JSON存储牌阵布局配置
  difficulty_level INTEGER DEFAULT 1, -- 1-5难度等级
  usage_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_tarot_spreads_active_difficulty ON tarot_spreads(is_active, difficulty_level);
```

#### 系统配置表（统一规范）

```sql
CREATE TABLE IF NOT EXISTS sys_configs (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT 0,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 插入塔罗模块配置
INSERT INTO sys_configs (key, value, description, is_public) VALUES
('tarot_ai_prompt_reading', '塔罗占卜AI提示词模板', '用于塔罗占卜的AI提示词', 0),
('tarot_ai_prompt_quick', '快速占卜AI提示词模板', '用于快速占卜的AI提示词', 0),
('tarot_default_language', 'zh', '默认语言设置', 1),
('tarot_max_question_length', '500', '问题文本最大长度', 1);
```

#### 分析事件表（统一规范）

```sql
CREATE TABLE IF NOT EXISTS analytics_events (
  id TEXT PRIMARY KEY,
  event_type TEXT NOT NULL,
  event_data TEXT, -- JSON对象
  session_id TEXT,
  module_name TEXT DEFAULT 'tarot',
  ip_address_hash TEXT,
  user_agent TEXT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (session_id) REFERENCES tarot_sessions(id)
);

CREATE INDEX idx_analytics_events_module_type_time ON analytics_events(module_name, event_type, timestamp);
CREATE INDEX idx_analytics_events_session ON analytics_events(session_id);
```

## 核心组件设计

### AI驱动的塔罗占卜服务

#### 统一AI分析引擎

```javascript
class TarotAIService {
  private prompts = {
    tarotReading: `
作为专业塔罗牌占卜师，请根据用户的问题进行完整的塔罗占卜。

用户问题：{questionText}
问题分类：{questionCategory}

请提供完整的占卜服务，包括：
1. 根据问题推荐合适的牌阵（单张牌、三张牌、凯尔特十字等）
2. 进行抽牌（随机选择塔罗牌，包括正逆位）
3. 详细解读每张牌的含义
4. 分析牌与牌之间的关系
5. 针对用户问题给出具体建议
6. 提供行动指导和时间建议

要求：
- 基于传统塔罗牌知识进行解读
- 语言专业、温和、富有启发性
- 避免绝对化表述，保持积极正面
- 结合现代生活实际情况
- 以JSON格式返回结构化数据，包含抽到的牌、解读内容等
    `,
    
    quickReading: `
作为塔罗牌占卜师，为用户进行简单的日常指导占卜。

请提供：
1. 抽取一张塔罗牌（随机选择，包含正逆位）
2. 解读这张牌对今日的指导意义
3. 给出具体的行动建议
4. 提供注意事项

要求：
- 内容简洁明了，适合日常参考
- 保持积极正面的基调
- 以JSON格式返回结构化数据
    `
  };
  
  async performTarotReading(questionText: string, questionCategory: string): Promise<TarotReadingResult> {
    const prompt = this.buildPrompt('tarotReading', { questionText, questionCategory });
    const response = await this.callAI(prompt);
    return this.parseAIResponse(response, 'tarot_reading');
  }
  
  async performQuickReading(): Promise<QuickReadingResult> {
    const prompt = this.buildPrompt('quickReading', {});
    const response = await this.callAI(prompt);
    return this.parseAIResponse(response, 'quick_reading');
  }
  
  private async callAI(prompt: string): Promise<string> {
    // 调用OpenAI或Claude API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.8
      })
    });
    
    const data = await response.json();
    return data.choices[0].message.content;
  }
}
```

### 缓存和会话管理

#### 智能缓存服务

```javascript
class CacheService {
  async getCachedResult(inputHash: string, type: string): Promise<any> {
    const cacheKey = `tarot:${type}:${inputHash}`;
    return await this.kv.get(cacheKey, 'json');
  }
  
  async setCachedResult(inputHash: string, type: string, result: any, ttl: number = 86400): Promise<void> {
    const cacheKey = `tarot:${type}:${inputHash}`;
    await this.kv.put(cacheKey, JSON.stringify(result), { expirationTtl: ttl });
  }
  
  generateInputHash(input: any): string {
    return crypto.subtle.digest('SHA-256', JSON.stringify(input));
  }
}
```

## 5. 统一状态管理设计

### 5.1 Zustand Store实现

```typescript
// stores/tarotStore.ts
import { create } from "zustand";
import { ModuleActions, ModuleState } from "../shared/types/moduleState";

// 塔罗模块专用状态扩展
interface TarotModuleState extends ModuleState {
  currentSession: string | null;
  questionText: string;
  selectedCategory: string | null;
  drawnCards: DrawnCard[];
  aiReading: AIReading | null;
  spread: TarotSpread | null;
  categories: QuestionCategory[];
}

interface TarotModuleActions extends ModuleActions {
  setQuestion: (text: string) => void;
  selectCategory: (categoryId: string) => void;
  drawCards: (spreadId: string) => Promise<void>;
  getAIReading: (sessionId: string) => Promise<void>;
  submitFeedback: (
    sessionId: string,
    feedback: "like" | "dislike",
  ) => Promise<void>;
  resetSession: () => void;
}

export const useTarotStore = create<TarotModuleState & TarotModuleActions>((
  set,
  get,
) => ({
  // 基础状态
  isLoading: false,
  error: null,
  data: null,
  lastUpdated: null,

  // 塔罗专用状态
  currentSession: null,
  questionText: "",
  selectedCategory: null,
  drawnCards: [],
  aiReading: null,
  spread: null,
  categories: [],

  // 基础操作
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  setData: (data) => set({ data, lastUpdated: new Date() }),

  // 塔罗专用操作
  setQuestion: (text) => set({ questionText: text }),
  selectCategory: (categoryId) => set({ selectedCategory: categoryId }),

  drawCards: async (spreadId: string) => {
    set({ isLoading: true, error: null });
    try {
      const { questionText, selectedCategory } = get();
      const response = await tarotService.drawCards({
        spreadId,
        questionText,
        categoryId: selectedCategory,
      });

      if (response.success) {
        set({
          currentSession: response.data.sessionId,
          drawnCards: response.data.drawnCards,
          spread: response.data.spread,
          data: response.data,
          isLoading: false,
          lastUpdated: new Date(),
        });
      }
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : "抽牌失败",
      });
    }
  },

  getAIReading: async (sessionId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await tarotService.getAIReading(sessionId);
      if (response.success) {
        set({
          aiReading: response.data,
          isLoading: false,
          lastUpdated: new Date(),
        });
      }
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : "AI解读失败",
      });
    }
  },

  submitFeedback: async (sessionId: string, feedback: "like" | "dislike") => {
    try {
      await tarotService.submitFeedback(sessionId, feedback);
    } catch (error) {
      console.error("提交反馈失败:", error);
    }
  },

  reset: () => {
    set({
      isLoading: false,
      error: null,
      data: null,
      lastUpdated: null,
      currentSession: null,
      questionText: "",
      selectedCategory: null,
      drawnCards: [],
      aiReading: null,
      spread: null,
    });
  },

  resetSession: () => {
    const { reset } = get();
    reset();
  },
}));
```

## 6. 统一组件架构设计

### 6.1 标准化组件接口

```typescript
// types/tarotTypes.ts
import { BaseComponentProps } from "../shared/types/componentInterfaces";

export interface TarotCardProps extends BaseComponentProps {
  card: TarotCard;
  isReversed: boolean;
  isFlipped: boolean;
  onFlip: () => void;
}

export interface QuestionCategoryProps extends BaseComponentProps {
  categories: QuestionCategory[];
  selectedCategory: string | null;
  onSelect: (categoryId: string) => void;
}

export interface SpreadLayoutProps extends BaseComponentProps {
  spread: TarotSpread;
  drawnCards: DrawnCard[];
  onCardClick: (card: DrawnCard) => void;
}
```

### 6.2 页面组件结构

```typescript
// components/TarotModule.tsx
import React from "react";
import { Route, Routes } from "react-router-dom";
import { ErrorBoundary } from "../common/ErrorBoundary";
import { cn } from "../../utils/classNames";

export const TarotModule: React.FC = () => {
  return (
    <ErrorBoundary>
      <div
        className={cn(
          "tarot-module",
          "bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900",
          "min-h-screen",
        )}
      >
        <Routes>
          <Route path="/" element={<QuestionCategoryPage />} />
          <Route path="/recommendation" element={<RecommendationPage />} />
          <Route path="/drawing" element={<CardDrawingPage />} />
          <Route path="/reading" element={<ReadingResultPage />} />
        </Routes>
      </div>
    </ErrorBoundary>
  );
};

// components/pages/QuestionCategoryPage.tsx
import React, { useEffect } from "react";
import { useTarotStore } from "../../stores/tarotStore";
import { PageHeader } from "../common/PageHeader";
import { QuestionInput } from "../tarot/QuestionInput";
import { CategoryGrid } from "../tarot/CategoryGrid";
import { Button } from "../common/Button";
import { LoadingSpinner } from "../common/LoadingSpinner";

export const QuestionCategoryPage: React.FC = () => {
  const {
    categories,
    selectedCategory,
    questionText,
    isLoading,
    error,
    setQuestion,
    selectCategory,
    loadCategories,
  } = useTarotStore();

  useEffect(() => {
    loadCategories();
  }, []);

  const handleProceed = () => {
    if (selectedCategory) {
      // 导航到推荐页面
      window.location.href =
        `/tarot/recommendation?category=${selectedCategory}`;
    }
  };

  if (isLoading) {
    return <LoadingSpinner size="large" text="加载问题分类..." />;
  }

  if (error) {
    return (
      <div className="error-container p-8 text-center">
        <p className="text-red-400 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>重新加载</Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <PageHeader
        title="塔罗牌占卜"
        description="选择你关心的问题类型，获得专业的塔罗牌指导"
        icon="crystal-ball"
        theme="tarot"
        testId="tarot-page-header"
      />

      <QuestionInput
        value={questionText}
        onChange={setQuestion}
        placeholder="描述你的具体问题（可选）"
        className="mb-8"
        testId="question-input"
      />

      <CategoryGrid
        categories={categories}
        selectedCategory={selectedCategory}
        onSelect={selectCategory}
        className="mb-8"
        testId="category-grid"
      />

      <div className="text-center">
        <Button
          variant="primary"
          size="large"
          onClick={handleProceed}
          disabled={!selectedCategory}
          testId="proceed-button"
        >
          获取推荐
        </Button>
      </div>
    </div>
  );
};
```

### 5.2 核心交互组件

#### 3D翻牌动画组件

const TarotCard = ({ card, isReversed, isFlipped, onFlip }: TarotCardProps) => {
return ( <motion.div className="tarot-card-container" style={{ perspective: 1000
}} onClick={onFlip} > <motion.div className="tarot-card" animate={{ rotateY:
isFlipped ? 180 : 0 }} transition={{ duration: 0.8, ease: "easeInOut" }}
style={{ transformStyle: "preserve-3d" }} > {/* 卡牌背面 */}

<div className="card-back">
<img src="/images/tarot-back.jpg" alt="塔罗牌背面" />
</div>

        {/* 卡牌正面 */}
        <div 
          className={`card-front ${isReversed ? 'reversed' : ''}`}
          style={{ transform: "rotateY(180deg)" }}
        >
          <img 
            src={card.image_url} 
            alt={card.name_zh}
            className={isReversed ? 'rotate-180' : ''}
          />
          <div className="card-info">
            <h3>{card.name_zh}</h3>
            <p className="position-indicator">
              {isReversed ? '逆位' : '正位'}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>

); };

#### 牌阵布局组件

const SpreadLayout = ({ spread, drawnCards, onCardClick }: SpreadLayoutProps) =>
{ const getCardPosition = (position: number) => { const config =
spread.layout_config.positions[position - 1]; return { left: `${config.x}%`,
top: `${config.y}%`, transform: `rotate(${config.rotation || 0}deg)` }; };

return (

<div className="spread-container relative w-full h-96">
{drawnCards.map((drawnCard, index) => (
<div
          key={index}
          className="absolute transition-all duration-500"
          style={getCardPosition(drawnCard.position)}
        > <TarotCard card={drawnCard.card} isReversed={drawnCard.isReversed}
isFlipped={true} onFlip={() => onCardClick(drawnCard)} />
<div className="position-label text-center mt-2">
<span className="text-gold text-sm"> {spread.positions[drawnCard.position -
1].name}
</span>
</div>
</div> ))}
</div> ); };

## 7. 统一API接口设计

### 7.1 API响应格式标准化

```typescript
// types/apiTypes.ts
import { APIResponse } from "../shared/types/apiResponse";

export interface TarotDrawRequest {
  spreadId: string;
  questionText?: string;
  categoryId?: string;
}

export interface TarotDrawResponse {
  sessionId: string;
  drawnCards: DrawnCard[];
  spread: TarotSpread;
  basicReading: BasicReading;
}

export interface TarotFeedbackRequest {
  sessionId: string;
  feedback: "like" | "dislike";
  comment?: string;
}
```

### 7.2 标准化API端点

```typescript
// services/tarotService.ts
import { apiClient } from "./apiClient";
import { APIResponse } from "../shared/types/apiResponse";

export const tarotService = {
  // 获取问题分类
  async getCategories(): Promise<APIResponse<QuestionCategory[]>> {
    return apiClient.get("/tarot/categories");
  },

  // 获取推荐
  async getRecommendation(request: {
    categoryId: string;
    questionText?: string;
    language?: string;
  }): Promise<APIResponse<Recommendation>> {
    return apiClient.post("/tarot/recommendation", request);
  },

  // 抽牌
  async drawCards(
    request: TarotDrawRequest,
  ): Promise<APIResponse<TarotDrawResponse>> {
    return apiClient.post("/tarot/draw", request);
  },

  // 获取AI解读
  async getAIReading(sessionId: string): Promise<APIResponse<AIReading>> {
    return apiClient.get(`/tarot/ai-reading/${sessionId}`);
  },

  // 提交反馈
  async submitFeedback(
    sessionId: string,
    feedback: "like" | "dislike",
  ): Promise<APIResponse<void>> {
    return apiClient.post("/tarot/feedback", {
      sessionId,
      feedback,
    });
  },
};
```

### 7.3 后端API实现

```typescript
// routes/tarot.ts
import { Hono } from "hono";
import { TarotService } from "../services/TarotService";
import { errorHandler } from "../utils/errorHandler";
import { ERROR_CODES, ModuleError } from "../shared/types/errors";

const tarotRoutes = new Hono<{
  Bindings: {
    DB: D1Database;
    KV: KVNamespace;
    AI_API_KEY: string;
  };
}>();

// 获取问题分类
tarotRoutes.get("/categories", async (c) => {
  try {
    const tarotService = new TarotService(c.env.DB, c.env.KV);
    const categories = await tarotService.getCategories();

    return c.json({
      success: true,
      data: categories,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return errorHandler(error, c);
  }
});

// 抽牌
tarotRoutes.post("/draw", async (c) => {
  try {
    const request = await c.req.json();

    // 验证请求数据
    if (!request.spreadId) {
      throw new ModuleError(
        "牌阵ID不能为空",
        ERROR_CODES.VALIDATION_ERROR,
        400,
      );
    }

    const tarotService = new TarotService(c.env.DB, c.env.KV, c.env.AI_API_KEY);
    const result = await tarotService.drawCards(request);

    return c.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return errorHandler(error, c);
  }
});

// 获取AI解读
tarotRoutes.get("/ai-reading/:sessionId", async (c) => {
  try {
    const sessionId = c.req.param("sessionId");

    if (!sessionId) {
      throw new ModuleError(
        "会话ID不能为空",
        ERROR_CODES.VALIDATION_ERROR,
        400,
      );
    }

    const tarotService = new TarotService(c.env.DB, c.env.KV, c.env.AI_API_KEY);
    const reading = await tarotService.getAIReading(sessionId);

    return c.json({
      success: true,
      data: reading,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return errorHandler(error, c);
  }
});

// 提交反馈
tarotRoutes.post("/feedback", async (c) => {
  try {
    const request = await c.req.json();

    if (!request.sessionId || !request.feedback) {
      throw new ModuleError(
        "会话ID和反馈类型不能为空",
        ERROR_CODES.VALIDATION_ERROR,
        400,
      );
    }

    const tarotService = new TarotService(c.env.DB, c.env.KV);
    await tarotService.submitFeedback(request.sessionId, request.feedback);

    return c.json({
      success: true,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return errorHandler(error, c);
  }
});

export { tarotRoutes };
```

### 缓存策略

#### KV缓存设计

```javascript
const cacheStrategy = {
  // AI占卜结果缓存（24小时）
  tarotReading: (inputHash: string) => `tarot:reading:${inputHash}`, // TTL: 86400
  quickReading: (inputHash: string) => `tarot:quick:${inputHash}`, // TTL: 86400
  
  // 系统配置缓存（长期）
  systemConfig: 'tarot:config:all', // TTL: 604800 (7天)
  
  // AI提示词模板缓存
  prompts: 'tarot:prompts:all' // TTL: 86400
};
```

## 7. 性能优化策略

### 7.1 前端优化

- **图片懒加载**：塔罗牌图片按需加载
- **组件懒加载**：路由级别的代码分割
- **动画优化**：使用CSS transform而非layout属性
- **状态管理**：Zustand轻量级状态管理

### 7.2 后端优化

- **数据预加载**：启动时将常用数据加载到KV
- **批量查询**：减少数据库查询次数
- **AI缓存**：相同牌面组合复用AI解读
- **CDN加速**：塔罗牌图片使用R2+CDN

## 8. 统一错误处理设计

### 8.1 错误处理实现

```typescript
// services/TarotService.ts
import { ERROR_CODES, errorHandler, ModuleError } from "../shared/types/errors";

export class TarotService {
  constructor(
    private db: D1Database,
    private kv: KVNamespace,
    private aiApiKey?: string,
  ) {}

  async drawCards(request: TarotDrawRequest): Promise<TarotDrawResponse> {
    try {
      // 验证输入
      this.validateDrawRequest(request);

      // 检查AI服务可用性
      if (!this.aiApiKey) {
        throw new ModuleError(
          "AI服务暂时不可用，请稍后重试",
          ERROR_CODES.AI_SERVICE_UNAVAILABLE,
          503,
        );
      }

      // 执行抽牌逻辑
      const result = await this.performDrawing(request);
      return result;
    } catch (error) {
      if (error instanceof ModuleError) {
        throw error;
      }

      // 处理未知错误
      throw new ModuleError(
        "占卜服务暂时不可用",
        ERROR_CODES.UNKNOWN_ERROR,
        500,
        error,
      );
    }
  }

  private validateDrawRequest(request: TarotDrawRequest): void {
    if (!request.spreadId) {
      throw new ModuleError(
        "请选择一个牌阵",
        ERROR_CODES.VALIDATION_ERROR,
        400,
      );
    }

    if (request.questionText && request.questionText.length > 500) {
      throw new ModuleError(
        "问题描述不能超过500个字符",
        ERROR_CODES.VALIDATION_ERROR,
        400,
      );
    }
  }

  private async performDrawing(
    request: TarotDrawRequest,
  ): Promise<TarotDrawResponse> {
    // 实现抽牌逻辑，包含降级方案
    try {
      return await this.aiDrivenDrawing(request);
    } catch (aiError) {
      console.warn("AI抽牌失败，使用备用方案:", aiError);
      return await this.fallbackDrawing(request);
    }
  }

  private async fallbackDrawing(
    request: TarotDrawRequest,
  ): Promise<TarotDrawResponse> {
    // 降级方案：使用预设模板
    const sessionId = crypto.randomUUID();
    const spread = await this.getSpread(request.spreadId);
    const drawnCards = this.generateRandomCards(spread.card_count);
    const basicReading = this.generateBasicReading(drawnCards);

    return {
      sessionId,
      drawnCards,
      spread,
      basicReading,
    };
  }
}
```

### 8.2 前端错误处理

```typescript
// components/common/TarotErrorBoundary.tsx
import React, { Component, ErrorInfo, ReactNode } from "react";
import { ModuleError } from "../../shared/types/errors";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: ModuleError;
}

export class TarotErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error: error instanceof ModuleError
        ? error
        : new ModuleError(error.message, "UNKNOWN_ERROR"),
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("塔罗模块错误:", error, errorInfo);

    // 发送错误报告
    this.reportError(error, errorInfo);
  }

  private async reportError(error: Error, errorInfo: ErrorInfo) {
    try {
      await fetch("/api/tarot/error-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          error: error.message,
          stack: error.stack,
          componentStack: errorInfo.componentStack,
          timestamp: new Date().toISOString(),
        }),
      });
    } catch (reportError) {
      console.error("错误报告发送失败:", reportError);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="tarot-error-container min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 to-indigo-900">
          <div className="text-center p-8 bg-black bg-opacity-30 rounded-lg backdrop-blur-sm">
            <div className="text-6xl mb-4">🔮</div>
            <h2 className="text-2xl font-bold text-white mb-4">
              占卜过程中出现了问题
            </h2>
            <p className="text-purple-200 mb-6">
              {this.state.error?.message ||
                "神秘的力量暂时无法连接，请稍后再试"}
            </p>
            <div className="space-x-4">
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                重新开始
              </button>
              <button
                onClick={() => window.location.href = "/"}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                返回首页
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
```

### 8.3 用户体验保障策略

```typescript
// utils/tarotErrorHandling.ts
export const tarotErrorHandling = {
  // AI服务降级
  handleAIServiceDown: () => ({
    message: "正在使用传统占卜方式为您解读",
    action: "fallback_reading",
    showRetry: true,
  }),

  // 网络错误处理
  handleNetworkError: () => ({
    message: "网络连接不稳定，请检查网络后重试",
    action: "retry",
    showOfflineMode: true,
  }),

  // 输入验证错误
  handleValidationError: (error: string) => ({
    message: error,
    action: "show_help",
    showExamples: true,
  }),

  // 会话过期处理
  handleSessionExpired: () => ({
    message: "占卜会话已过期，请重新开始",
    action: "restart_session",
    autoRedirect: true,
  }),
};
```

## 9. 性能优化和缓存策略

### 9.1 统一缓存实现

```typescript
// utils/tarotCache.ts
export class TarotCacheManager {
  constructor(private kv: KVNamespace) {}

  // AI响应缓存
  async cacheAIResponse(inputHash: string, response: any, ttl: number = 86400) {
    const key = `tarot:ai_response:${inputHash}`;
    await this.kv.put(key, JSON.stringify(response), { expirationTtl: ttl });
  }

  async getCachedAIResponse(inputHash: string): Promise<any | null> {
    const key = `tarot:ai_response:${inputHash}`;
    const cached = await this.kv.get(key);
    return cached ? JSON.parse(cached) : null;
  }

  // 配置数据缓存
  async cacheConfig(configType: string, data: any, ttl: number = 604800) {
    const key = `tarot:config:${configType}`;
    await this.kv.put(key, JSON.stringify(data), { expirationTtl: ttl });
  }

  // 生成输入哈希
  generateInputHash(input: any): string {
    return btoa(JSON.stringify(input)).replace(/[^a-zA-Z0-9]/g, "").substring(
      0,
      32,
    );
  }
}
```
