# 星座模块设计文档

## 概述

星座模块基于综合测试平台的Cloudflare全栈架构，提供专业的星座运势和配对分析服务。模块采用完全AI驱动的架构设计，所有运势计算、配对分析和星盘解读均由AI完成，平台仅负责数据管理、缓存和用户界面。设计重点关注简洁性、准确性和用户友好性。

**重要说明：** 本模块严格遵循 [统一开发标准](../basic/development-guide.md)，包括：
- 统一的状态管理接口（ModuleState & ModuleActions）
- 统一的API响应格式（APIResponse<T>）
- 统一的组件架构规范（BaseComponentProps）
- 统一的错误处理机制（ModuleError）
- 统一的数据库设计规范

## 架构设计

### 系统整体架构
┌─────────────────────────────────────────────────────────────────┐
│                    星座模块前端界面 (React + Tailwind)            │
├─────────────────────────────────────────────────────────────────┤
│     星座运势     │     星座配对     │     星盘分析     │     星座百科     │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ API调用
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   星座模块后端服务 (Cloudflare Workers)           │
├─────────────────────────────────────────────────────────────────┤
│     AI服务集成     │     缓存管理     │     会话管理     │     API路由     │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ 数据访问
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      数据存储层 (D1 + KV)                       │
├─────────────────────────────────────────────────────────────────┤
│     用户会话     │     AI响应缓存     │     统计数据     │     配置信息     │
└─────────────────────────────────────────────────────────────────┘

### 技术栈选择

#### 前端技术栈
```typescript
const frontendTech = {
  framework: 'React.js 18+',
  styling: 'Tailwind CSS + 星空主题',
  stateManagement: 'Zustand (遵循ModuleState接口)',
  dateHandling: 'dayjs',
  buildTool: 'Vite',
  deployment: 'Cloudflare Pages'
};
```

#### 后端技术栈
```typescript
const backendTech = {
  runtime: 'Cloudflare Workers',
  framework: 'Hono.js',
  database: 'Cloudflare D1 (SQLite)',
  cache: 'Cloudflare KV',
  aiService: 'OpenAI API / Claude API'
};
```

### 统一数据类型定义
```typescript
// types/astrologyTypes.ts
export interface ZodiacSign {
  id: string;
  name: string;
  symbol: string;
  element: 'fire' | 'earth' | 'air' | 'water';
  quality: 'cardinal' | 'fixed' | 'mutable';
  ruling_planet: string;
  date_range: {
    start: string; // MM-DD
    end: string;   // MM-DD
  };
  traits: string[];
  compatibility: Record<string, number>; // 与其他星座的兼容度
}

export interface FortuneReading {
  zodiacSign: string;
  date: string;
  timeframe: 'daily' | 'weekly' | 'monthly' | 'yearly';
  overall: { score: number; description: string };
  love: { score: number; description: string };
  career: { score: number; description: string };
  wealth: { score: number; description: string };
  health: { score: number; description: string };
  luckyElements: {
    colors: string[];
    numbers: number[];
    directions: string[];
  };
  advice: string;
}

export interface CompatibilityAnalysis {
  sign1: string;
  sign2: string;
  relationType: 'friendship' | 'love' | 'work';
  overallScore: number;
  specificScore: number;
  strengths: string[];
  challenges: string[];
  advice: string;
  elementCompatibility: string;
  qualityCompatibility: string;
}

export interface BirthChart {
  birthDate: string;
  birthTime: string;
  birthLocation: string;
  sunSign: string;
  moonSign: string;
  risingSign: string;
  planetPositions: Record<string, string>;
  housePositions: Record<string, string>;
  aspects: Array<{
    planet1: string;
    planet2: string;
    aspect: string;
    degree: number;
  }>;
  interpretation: string;
}
```

## 统一状态管理设计

### Zustand Store实现
```typescript
// stores/astrologyStore.ts
import { create } from 'zustand';
import { ModuleState, ModuleActions } from '../shared/types/moduleState';

// 星座模块专用状态扩展
interface AstrologyModuleState extends ModuleState {
  currentSession: string | null;
  selectedZodiacSign: string | null;
  selectedDate: string | null;
  fortuneReading: FortuneReading | null;
  compatibilityAnalysis: CompatibilityAnalysis | null;
  birthChart: BirthChart | null;
  zodiacSigns: ZodiacSign[];
  analysisType: 'fortune' | 'compatibility' | 'birth_chart' | null;
}

interface AstrologyModuleActions extends ModuleActions {
  selectZodiacSign: (sign: string) => void;
  setDate: (date: string) => void;
  getFortune: (sign: string, timeframe: string) => Promise<void>;
  getCompatibility: (sign1: string, sign2: string, type: string) => Promise<void>;
  getBirthChart: (birthData: any) => Promise<void>;
  submitFeedback: (sessionId: string, feedback: 'like' | 'dislike') => Promise<void>;
  resetAnalysis: () => void;
}

export const useAstrologyStore = create<AstrologyModuleState & AstrologyModuleActions>((set, get) => ({
  // 基础状态
  isLoading: false,
  error: null,
  data: null,
  lastUpdated: null,
  
  // 星座专用状态
  currentSession: null,
  selectedZodiacSign: null,
  selectedDate: null,
  fortuneReading: null,
  compatibilityAnalysis: null,
  birthChart: null,
  zodiacSigns: [],
  analysisType: null,
  
  // 基础操作
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  setData: (data) => set({ data, lastUpdated: new Date() }),
  
  // 星座专用操作
  selectZodiacSign: (sign) => set({ selectedZodiacSign: sign }),
  setDate: (date) => set({ selectedDate: date }),
  
  getFortune: async (sign: string, timeframe: string) => {
    set({ isLoading: true, error: null, analysisType: 'fortune' });
    try {
      const response = await astrologyService.getFortune(sign, timeframe);
      if (response.success) {
        set({
          currentSession: response.data.sessionId,
          fortuneReading: response.data,
          data: response.data,
          isLoading: false,
          lastUpdated: new Date()
        });
      }
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : '获取运势失败'
      });
    }
  },
  
  getCompatibility: async (sign1: string, sign2: string, type: string) => {
    set({ isLoading: true, error: null, analysisType: 'compatibility' });
    try {
      const response = await astrologyService.getCompatibility(sign1, sign2, type);
      if (response.success) {
        set({
          currentSession: response.data.sessionId,
          compatibilityAnalysis: response.data,
          data: response.data,
          isLoading: false,
          lastUpdated: new Date()
        });
      }
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : '获取配对分析失败'
      });
    }
  },
  
  getBirthChart: async (birthData: any) => {
    set({ isLoading: true, error: null, analysisType: 'birth_chart' });
    try {
      const response = await astrologyService.getBirthChart(birthData);
      if (response.success) {
        set({
          currentSession: response.data.sessionId,
          birthChart: response.data,
          data: response.data,
          isLoading: false,
          lastUpdated: new Date()
        });
      }
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : '生成星盘失败'
      });
    }
  },
  
  submitFeedback: async (sessionId: string, feedback: 'like' | 'dislike') => {
    try {
      await astrologyService.submitFeedback(sessionId, feedback);
    } catch (error) {
      console.error('提交反馈失败:', error);
    }
  },
  
  reset: () => {
    set({
      isLoading: false,
      error: null,
      data: null,
      lastUpdated: null,
      currentSession: null,
      selectedZodiacSign: null,
      selectedDate: null,
      fortuneReading: null,
      compatibilityAnalysis: null,
      birthChart: null,
      analysisType: null
    });
  },
  
  resetAnalysis: () => {
    const { reset } = get();
    reset();
  }
}));
```

## 统一数据库设计

### 标准化数据表结构

#### 星座分析会话表（遵循统一命名规范）
```sql
CREATE TABLE IF NOT EXISTS astrology_sessions (
  id TEXT PRIMARY KEY,
  session_type TEXT NOT NULL DEFAULT 'astrology_analysis',
  analysis_type TEXT NOT NULL, -- 'fortune' | 'compatibility' | 'birth_chart'
  input_data TEXT NOT NULL, -- JSON存储用户输入信息
  ai_response_data TEXT NOT NULL, -- JSON存储AI完整响应
  user_feedback TEXT, -- 'like' | 'dislike' | null
  language TEXT DEFAULT 'zh',
  user_agent TEXT,
  ip_address_hash TEXT, -- 哈希后的IP地址
  session_duration INTEGER, -- 分析用时（秒）
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 统一索引命名规范
CREATE INDEX idx_astrology_sessions_type_date ON astrology_sessions(analysis_type, created_at);
CREATE INDEX idx_astrology_sessions_feedback ON astrology_sessions(user_feedback, created_at);
CREATE INDEX idx_astrology_sessions_created ON astrology_sessions(created_at DESC);
```

#### 星座基础信息表
```sql
CREATE TABLE IF NOT EXISTS astrology_zodiac_signs (
  id TEXT PRIMARY KEY,
  name_zh TEXT NOT NULL,
  name_en TEXT NOT NULL,
  symbol TEXT NOT NULL,
  element TEXT NOT NULL, -- 'fire' | 'earth' | 'air' | 'water'
  quality TEXT NOT NULL, -- 'cardinal' | 'fixed' | 'mutable'
  ruling_planet TEXT NOT NULL,
  date_range_start TEXT NOT NULL, -- MM-DD格式
  date_range_end TEXT NOT NULL,   -- MM-DD格式
  traits_data TEXT, -- JSON存储特征列表
  compatibility_data TEXT, -- JSON存储兼容度数据
  is_active BOOLEAN DEFAULT 1,
  sort_order INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_astrology_zodiac_signs_active ON astrology_zodiac_signs(is_active, sort_order);
```

#### 运势缓存表
```sql
CREATE TABLE IF NOT EXISTS astrology_fortune_cache (
  id TEXT PRIMARY KEY,
  zodiac_sign TEXT NOT NULL,
  timeframe TEXT NOT NULL, -- 'daily' | 'weekly' | 'monthly' | 'yearly'
  target_date TEXT NOT NULL, -- YYYY-MM-DD格式
  fortune_data TEXT NOT NULL, -- JSON存储运势数据
  language TEXT DEFAULT 'zh',
  expires_at DATETIME NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_astrology_fortune_cache_sign_date ON astrology_fortune_cache(zodiac_sign, target_date, timeframe);
CREATE INDEX idx_astrology_fortune_cache_expires ON astrology_fortune_cache(expires_at);
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

-- 插入星座模块配置
INSERT INTO sys_configs (key, value, description, is_public) VALUES
('astrology_ai_prompt_fortune', '星座运势AI提示词模板', '用于星座运势分析的AI提示词', 0),
('astrology_ai_prompt_compatibility', '星座配对AI提示词模板', '用于星座配对分析的AI提示词', 0),
('astrology_ai_prompt_birth_chart', '星盘分析AI提示词模板', '用于星盘分析的AI提示词', 0),
('astrology_fortune_cache_hours', '24', '运势缓存时长（小时）', 1),
('astrology_enable_birth_chart', 'true', '是否启用星盘分析功能', 1);
```

#### 分析事件表（统一规范）
```sql
CREATE TABLE IF NOT EXISTS analytics_events (
  id TEXT PRIMARY KEY,
  event_type TEXT NOT NULL,
  event_data TEXT, -- JSON对象
  session_id TEXT,
  module_name TEXT DEFAULT 'astrology',
  ip_address_hash TEXT,
  user_agent TEXT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (session_id) REFERENCES astrology_sessions(id)
);

CREATE INDEX idx_analytics_events_module_type_time ON analytics_events(module_name, event_type, timestamp);
CREATE INDEX idx_analytics_events_session ON analytics_events(session_id);
```

## 统一API接口设计

### API响应格式标准化
```typescript
// types/astrologyApiTypes.ts
import { APIResponse } from '../shared/types/apiResponse';

export interface FortuneRequest {
  zodiacSign: string;
  timeframe: 'daily' | 'weekly' | 'monthly' | 'yearly';
  date?: string;
  language?: string;
}

export interface CompatibilityRequest {
  sign1: string;
  sign2: string;
  relationType: 'friendship' | 'love' | 'work';
  language?: string;
}

export interface BirthChartRequest {
  birthDate: string;
  birthTime: string;
  birthLocation: string;
  language?: string;
}

export interface AstrologyFeedbackRequest {
  sessionId: string;
  feedback: 'like' | 'dislike';
  comment?: string;
}
```

### 标准化API服务
```typescript
// services/astrologyService.ts
import { apiClient } from './apiClient';
import { APIResponse } from '../shared/types/apiResponse';

export const astrologyService = {
  // 获取星座列表
  async getZodiacSigns(): Promise<APIResponse<ZodiacSign[]>> {
    return apiClient.get('/astrology/zodiac-signs');
  },

  // 获取运势
  async getFortune(sign: string, timeframe: string, date?: string): Promise<APIResponse<FortuneReading>> {
    const params = new URLSearchParams({
      timeframe,
      ...(date && { date })
    });
    return apiClient.get(`/astrology/fortune/${sign}?${params}`);
  },

  // 获取星座配对分析
  async getCompatibility(sign1: string, sign2: string, relationType: string): Promise<APIResponse<CompatibilityAnalysis>> {
    return apiClient.post('/astrology/compatibility', {
      sign1,
      sign2,
      relationType
    });
  },

  // 生成星盘分析
  async getBirthChart(birthData: BirthChartRequest): Promise<APIResponse<BirthChart>> {
    return apiClient.post('/astrology/birth-chart', birthData);
  },

  // 提交反馈
  async submitFeedback(sessionId: string, feedback: 'like' | 'dislike'): Promise<APIResponse<void>> {
    return apiClient.post('/astrology/feedback', {
      sessionId,
      feedback
    });
  }
};
```

### 后端API实现
```typescript
// routes/astrology.ts
import { Hono } from 'hono';
import { AstrologyService } from '../services/AstrologyService';
import { errorHandler } from '../utils/errorHandler';
import { ModuleError, ERROR_CODES } from '../shared/types/errors';

const astrologyRoutes = new Hono<{
  Bindings: {
    DB: D1Database;
    KV: KVNamespace;
    AI_API_KEY: string;
  };
}>();

// 获取星座列表
astrologyRoutes.get('/zodiac-signs', async (c) => {
  try {
    const astrologyService = new AstrologyService(c.env.DB, c.env.KV);
    const signs = await astrologyService.getZodiacSigns();
    
    return c.json({
      success: true,
      data: signs,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return errorHandler(error, c);
  }
});

// 获取运势
astrologyRoutes.get('/fortune/:sign', async (c) => {
  try {
    const sign = c.req.param('sign');
    const timeframe = c.req.query('timeframe') || 'daily';
    const date = c.req.query('date');
    
    if (!sign) {
      throw new ModuleError(
        '星座参数不能为空',
        ERROR_CODES.VALIDATION_ERROR,
        400
      );
    }

    const astrologyService = new AstrologyService(c.env.DB, c.env.KV, c.env.AI_API_KEY);
    const fortune = await astrologyService.getFortune(sign, timeframe, date);
    
    return c.json({
      success: true,
      data: fortune,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return errorHandler(error, c);
  }
});

// 星座配对分析
astrologyRoutes.post('/compatibility', async (c) => {
  try {
    const request = await c.req.json();
    
    if (!request.sign1 || !request.sign2) {
      throw new ModuleError(
        '两个星座参数都不能为空',
        ERROR_CODES.VALIDATION_ERROR,
        400
      );
    }

    const astrologyService = new AstrologyService(c.env.DB, c.env.KV, c.env.AI_API_KEY);
    const compatibility = await astrologyService.getCompatibility(
      request.sign1,
      request.sign2,
      request.relationType || 'love'
    );
    
    return c.json({
      success: true,
      data: compatibility,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return errorHandler(error, c);
  }
});

// 生成星盘分析
astrologyRoutes.post('/birth-chart', async (c) => {
  try {
    const request = await c.req.json();
    
    if (!request.birthDate || !request.birthTime || !request.birthLocation) {
      throw new ModuleError(
        '出生日期、时间和地点都不能为空',
        ERROR_CODES.VALIDATION_ERROR,
        400
      );
    }

    const astrologyService = new AstrologyService(c.env.DB, c.env.KV, c.env.AI_API_KEY);
    const birthChart = await astrologyService.getBirthChart(request);
    
    return c.json({
      success: true,
      data: birthChart,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return errorHandler(error, c);
  }
});

// 提交反馈
astrologyRoutes.post('/feedback', async (c) => {
  try {
    const request = await c.req.json();
    
    if (!request.sessionId || !request.feedback) {
      throw new ModuleError(
        '会话ID和反馈类型不能为空',
        ERROR_CODES.VALIDATION_ERROR,
        400
      );
    }

    const astrologyService = new AstrologyService(c.env.DB, c.env.KV);
    await astrologyService.submitFeedback(request.sessionId, request.feedback);
    
    return c.json({
      success: true,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return errorHandler(error, c);
  }
});

export { astrologyRoutes };
```

## API接口设计

### 运势查询接口

#### 获取每日运势
```javascript
// GET /api/astrology/fortune/:sign?timeframe=daily&date=2024-01-01
Response: APIResponse<FortuneReading>
```

#### 获取星座配对分析
```javascript
// POST /api/astrology/compatibility
Request: CompatibilityRequest
Response: APIResponse<CompatibilityAnalysis>
```

#### 生成星盘分析
```javascript
// POST /api/astrology/birth-chart
Request: {
  birthDate: string, // YYYY-MM-DD
  birthTime: string, // HH:MM
  birthLocation: {
    city: string,
    country: string,
    latitude: number,
    longitude: number,
    timezone: string
  },
  language: string
}
Response: {
  success: boolean,
  data: {
    chartId: string,
    sunSign: string,
    moonSign: string,
    risingSign: string,
    planetaryPositions: object,
    houseAnalysis: object,
    personalityAnalysis: object
  }
}
```

## AI驱动的内容生成策略

### 基于占星学理论的数据准备

#### 1. 星座基础数据结构
```typescript
interface ZodiacSign {
  id: string;
  name_zh: string;
  name_en: string;
  element: 'fire' | 'earth' | 'air' | 'water';
  modality: 'cardinal' | 'fixed' | 'mutable';
  ruling_planet: string;
  date_range: string;
  traits: {
    positive: string[];
    negative: string[];
    keywords: string[];
  };
  compatibility_factors: {
    elements: Record<string, number>;
    modalities: Record<string, number>;
  };
}
```

#### 2. 占星学理论参考数据
```typescript
// 四元素理论
const ELEMENT_COMPATIBILITY = {
  fire: { fire: 0.9, air: 0.8, earth: 0.4, water: 0.3 },
  earth: { earth: 0.9, water: 0.8, fire: 0.4, air: 0.3 },
  air: { air: 0.9, fire: 0.8, water: 0.4, earth: 0.3 },
  water: { water: 0.9, earth: 0.8, air: 0.4, fire: 0.3 }
};

// 三性质理论
const MODALITY_HARMONY = {
  cardinal: { cardinal: 0.7, fixed: 0.8, mutable: 0.9 },
  fixed: { fixed: 0.7, cardinal: 0.8, mutable: 0.9 },
  mutable: { mutable: 0.7, cardinal: 0.9, fixed: 0.8 }
};
```

### AI Prompt模板系统

#### 1. 运势查询Prompt模板

##### 1.1 今日运势Prompt
```typescript
class DailyFortunePromptBuilder {
  buildPrompt(zodiacSign: string, date: string, language: string): string {
    const signData = this.getZodiacData(zodiacSign);
    
    return `作为专业占星师，为${signData.name_zh}座生成${date}的今日运势分析。

星座基础信息：
- 元素：${signData.element}
- 性质：${signData.modality}
- 守护星：${signData.ruling_planet}
- 核心特质：${signData.traits.keywords.join(', ')}

请生成今日运势分析：
1. 综合运势（1-10分）：今日整体运势概况
2. 爱情运势（1-10分）：感情状况和建议
3. 事业运势（1-10分）：工作学习方面
4. 财运（1-10分）：财务状况
5. 健康运势（1-10分）：身心健康
6. 幸运元素：今日幸运颜色、数字、方位

要求：
- 针对今日的具体建议和提醒
- 内容积极正面，避免过于绝对化表述
- 语言生动有趣，易于理解`;
  }
}
```

##### 1.2 本周运势Prompt
```typescript
class WeeklyFortunePromptBuilder {
  buildPrompt(zodiacSign: string, weekStart: string, language: string): string {
    const signData = this.getZodiacData(zodiacSign);
    
    return `作为专业占星师，为${signData.name_zh}座生成${weekStart}开始的本周运势分析。

星座基础信息：
- 元素：${signData.element}
- 性质：${signData.modality}
- 守护星：${signData.ruling_planet}

请生成本周运势分析：
1. 本周运势概览：整体趋势和重点关注
2. 爱情运势：感情发展趋势和关键时间点
3. 事业运势：工作进展和机遇挑战
4. 财运分析：财务状况和投资建议
5. 健康提醒：身心健康注意事项
6. 关键日期：本周需要特别关注的日子

要求：
- 提供一周的整体规划建议
- 标注重要的时间节点
- 内容实用且具有指导性`;
  }
}
```

##### 1.3 月度运势Prompt
```typescript
class MonthlyFortunePromptBuilder {
  buildPrompt(zodiacSign: string, month: string, language: string): string {
    const signData = this.getZodiacData(zodiacSign);
    
    return `作为专业占星师，为${signData.name_zh}座生成${month}的月度运势分析。

星座基础信息：
- 元素：${signData.element}
- 性质：${signData.modality}
- 守护星：${signData.ruling_planet}

请生成月度运势分析：
1. 月度主题：本月的核心发展方向
2. 爱情运势：感情发展的月度趋势
3. 事业运势：职场发展和重要机遇
4. 财运分析：财务规划和投资时机
5. 健康指导：月度健康管理建议
6. 重要时期：月内的关键时间段分析

要求：
- 提供月度的战略性建议
- 分析月内的重要转折点
- 内容深度且具有前瞻性`;
  }
}
```

##### 1.4 年度运势Prompt
```typescript
class YearlyFortunePromptBuilder {
  buildPrompt(zodiacSign: string, year: string, language: string): string {
    const signData = this.getZodiacData(zodiacSign);
    
    return `作为专业占星师，为${signData.name_zh}座生成${year}年的年度运势分析。

星座基础信息：
- 元素：${signData.element}
- 性质：${signData.modality}
- 守护星：${signData.ruling_planet}

请生成年度运势分析：
1. 年度总览：全年的整体运势走向和主要主题
2. 爱情运势：全年感情发展趋势和重要时期
3. 事业运势：职业发展机遇和挑战分析
4. 财运分析：全年财务状况和重大投资时机
5. 健康运势：年度健康管理重点和注意事项
6. 关键时间：全年的重要转折点和关键月份
7. 发展建议：个人成长和目标实现的策略

要求：
- 提供全年的宏观规划指导
- 分析年度的重大机遇和挑战
- 内容具有长远的指导价值
- 结合重要天象和节气影响`;
  }
}
```

#### 2. 星座配对Prompt模板

##### 2.1 恋爱配对Prompt
```typescript
class LoveCompatibilityPromptBuilder {
  buildPrompt(sign1: string, sign2: string, language: string): string {
    const sign1Data = this.getZodiacData(sign1);
    const sign2Data = this.getZodiacData(sign2);
    const elementScore = ELEMENT_COMPATIBILITY[sign1Data.element][sign2Data.element];
    
    return `作为专业占星师，分析${sign1Data.name_zh}座与${sign2Data.name_zh}座的恋爱配对。

星座信息：
${sign1Data.name_zh}座：元素${sign1Data.element}，性质${sign1Data.modality}
${sign2Data.name_zh}座：元素${sign2Data.element}，性质${sign2Data.modality}
元素兼容性参考：${elementScore}

请生成恋爱配对分析：
1. 恋爱配对指数（1-100分）
2. 吸引力分析：相互吸引的原因
3. 恋爱优势：关系中的积极因素
4. 潜在挑战：需要注意的问题
5. 相处建议：具体的恋爱指导
6. 长期发展：关系的发展前景

要求：
- 专注于恋爱关系的特点
- 提供实用的恋爱建议
- 分析感情发展的可能性`;
  }
}
```

##### 2.2 友情分析Prompt
```typescript
class FriendshipCompatibilityPromptBuilder {
  buildPrompt(sign1: string, sign2: string, language: string): string {
    const sign1Data = this.getZodiacData(sign1);
    const sign2Data = this.getZodiacData(sign2);
    
    return `作为专业占星师，分析${sign1Data.name_zh}座与${sign2Data.name_zh}座的友情兼容性。

请生成友情分析报告：
1. 友情匹配度（1-100分）
2. 友谊基础：建立友谊的共同点
3. 互补优势：相互补充的特质
4. 交往模式：典型的相处方式
5. 友谊建议：维护友谊的方法
6. 长期友谊：友谊的持久性分析

要求：
- 专注于友谊关系的特点
- 分析友谊的稳定性
- 提供友谊维护的建议`;
  }
}
```

##### 2.3 工作合作Prompt
```typescript
class WorkCompatibilityPromptBuilder {
  buildPrompt(sign1: string, sign2: string, language: string): string {
    const sign1Data = this.getZodiacData(sign1);
    const sign2Data = this.getZodiacData(sign2);
    
    return `作为专业占星师，分析${sign1Data.name_zh}座与${sign2Data.name_zh}座的工作合作兼容性。

请生成工作合作分析：
1. 合作指数（1-100分）
2. 工作风格：各自的工作特点
3. 合作优势：团队协作的优势
4. 潜在冲突：可能的工作分歧
5. 合作建议：提高合作效率的方法
6. 角色分工：适合的工作分工建议

要求：
- 专注于职场合作关系
- 分析工作效率和团队协作
- 提供实用的职场建议`;
  }
}
```

#### 3. 星盘分析Prompt模板

```typescript
class BirthChartAnalysisPromptBuilder {
  buildPrompt(birthInfo: BirthInfo, language: string): string {
    const sunSign = this.getSunSign(birthInfo.date);
    const moonSign = this.estimateMoonSign(birthInfo.date);
    const risingSign = this.estimateRisingSign(birthInfo.time);
    
    return `作为专业占星师，基于出生信息进行完整的星盘分析。

出生信息：
- 日期：${birthInfo.date}
- 时间：${birthInfo.time}
- 地点：${birthInfo.location.city}

主要星座配置：
- 太阳星座：${sunSign}（核心自我）
- 月亮星座：${moonSign}（情感内心）
- 上升星座：${risingSign}（外在表现）

请生成完整的星盘分析报告：

一、星盘概览
1. 三大星座配置解读
2. 整体性格特征概述
3. 星盘能量分布分析

二、性格深度分析
1. 核心性格：基于太阳星座的主要特征和行为模式
2. 情感模式：基于月亮星座的内在需求和情感表达
3. 外在形象：基于上升星座的社交风格和第一印象
4. 性格整合：三大星座的相互影响和平衡

三、生活领域分析
1. 事业发展：适合的职业方向和发展建议
2. 感情关系：恋爱模式和理想伴侣特质
3. 人际交往：社交风格和人际关系处理
4. 财富观念：金钱态度和理财建议
5. 健康状况：体质特点和养生建议

四、宫位重点解读
1. 重要宫位分析（根据星座配置确定重点宫位）
2. 生活重心领域
3. 发展机遇和挑战

五、成长指导
1. 个人优势和天赋潜能
2. 需要改善的性格弱点
3. 人生发展建议和目标设定
4. 重要人生阶段的注意事项

要求：
- 内容专业且深入，基于占星学理论
- 整合三大星座的综合影响
- 提供实用的人生指导和建议
- 语言通俗易懂，避免过于专业的术语`;
  }
}
```

### 简化的占星学计算

#### 1. 基础星座确定
```typescript
class SimpleAstrologyCalculator {
  // 根据出生日期确定太阳星座
  getSunSign(birthDate: string): string {
    const date = new Date(birthDate);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    // 简化的星座日期范围判断
    const zodiacRanges = [
      { sign: '摩羯座', start: [12, 22], end: [1, 19] },
      { sign: '水瓶座', start: [1, 20], end: [2, 18] },
      // ... 其他星座范围
    ];
    
    return this.findZodiacSign(month, day, zodiacRanges);
  }
  
  // 简化的月亮星座估算（基于出生日期的周期性）
  estimateMoonSign(birthDate: string): string {
    const date = new Date(birthDate);
    const daysSinceEpoch = Math.floor(date.getTime() / (1000 * 60 * 60 * 24));
    const moonCycle = daysSinceEpoch % 354; // 月亮周期约354天
    const signIndex = Math.floor(moonCycle / 29.5) % 12; // 每个星座约29.5天
    
    return this.getZodiacByIndex(signIndex);
  }
  
  // 简化的上升星座估算（基于出生时间）
  estimateRisingSign(birthTime: string): string {
    const [hours] = birthTime.split(':').map(Number);
    const signIndex = Math.floor(hours / 2) % 12; // 每2小时一个星座
    
    return this.getZodiacByIndex(signIndex);
  }
}

## 缓存策略

### 运势内容缓存

```typescript
class FortuneCache {
  private cacheKey(zodiacSign: string, type: string, date: string, lang: string): string {
    return `fortune:${zodiacSign}:${type}:${date}:${lang}`;
  }
  
  async getFortune(zodiacSign: string, type: string, date: string, lang: string) {
    const key = this.cacheKey(zodiacSign, type, date, lang);
    
    // 1. 尝试从KV缓存获取
    const cached = await this.kv.get(key);
    if (cached) {
      return JSON.parse(cached);
    }
    
    // 2. 尝试从数据库获取
    const dbResult = await this.getFromDatabase(zodiacSign, type, date, lang);
    if (dbResult && !this.isExpired(dbResult.expires_at)) {
      // 回填到KV缓存
      await this.kv.put(key, JSON.stringify(dbResult.content), {
        expirationTtl: this.getTTL(type)
      });
      return dbResult.content;
    }
    
    // 3. 生成新内容
    return await this.generateNewFortune(zodiacSign, type, date, lang);
  }
  
  private getTTL(type: string): number {
    const ttlMap = {
      'daily': 86400,    // 24小时
      'weekly': 604800,  // 7天
      'monthly': 2592000 // 30天
    };
    return ttlMap[type] || 86400;
  }
}
```



```typescript
class MultilingualAIGenerator {
  async generateFortuneContent(
    zodiacSign: string, 
    type: string, 
    date: string, 
    language: string
  ): Promise<FortuneContent> {
    const prompt = this.buildPrompt(zodiacSign, type, date, language);
    
    const startTime = Date.now();
    try {
      const aiResponse = await this.callAI(prompt, language);
      const responseTime = Date.now() - startTime;
      
      // 记录AI性能数据
      await this.logAIPerformance({
        module: 'astrology',
        function: 'fortune_generation',
        zodiacSign,
        language,
        responseTime,
        success: true
      });
      
      return this.parseAIResponse(aiResponse, language);
    } catch (error) {
      const responseTime = Date.now() - startTime;
      
      await this.logAIPerformance({
        module: 'astrology',
        function: 'fortune_generation',
        zodiacSign,
        language,
        responseTime,
        success: false,
        error: error.message
      });
      
      throw error;
    }
  }
  
  private buildPrompt(zodiacSign: string, type: string, date: string, language: string): string {
    const basePrompt = language === 'zh-CN' 
      ? `请为${zodiacSign}座生成${date}的${type}运势分析`
      : `Generate ${type} horoscope analysis for ${zodiacSign} on ${date}`;
    
    return `${basePrompt}，包含综合运势、爱情、事业、财运、健康五个维度的分析，以及幸运元素建议。要求内容积极正面，避免过于绝对化的表述。`;
  }
}
```

## 统一错误处理设计

### 错误处理实现
```typescript
// services/AstrologyService.ts
import { ModuleError, ERROR_CODES, errorHandler } from '../shared/types/errors';

export class AstrologyService {
  constructor(
    private db: D1Database,
    private kv: KVNamespace,
    private aiApiKey?: string
  ) {}

  async getFortune(sign: string, timeframe: string, date?: string): Promise<FortuneReading> {
    try {
      // 验证输入
      this.validateFortuneRequest(sign, timeframe, date);
      
      // 检查缓存
      const cached = await this.getCachedFortune(sign, timeframe, date);
      if (cached) {
        return cached;
      }
      
      // 检查AI服务可用性
      if (!this.aiApiKey) {
        throw new ModuleError(
          'AI占星服务暂时不可用，请稍后重试',
          ERROR_CODES.AI_SERVICE_UNAVAILABLE,
          503
        );
      }

      // 生成运势
      const fortune = await this.generateFortune(sign, timeframe, date);
      
      // 缓存结果
      await this.cacheFortune(sign, timeframe, date, fortune);
      
      return fortune;
      
    } catch (error) {
      if (error instanceof ModuleError) {
        throw error;
      }
      
      // 处理未知错误
      throw new ModuleError(
        '星座运势服务暂时不可用',
        ERROR_CODES.UNKNOWN_ERROR,
        500,
        error
      );
    }
  }

  private validateFortuneRequest(sign: string, timeframe: string, date?: string): void {
    const validSigns = [
      'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
      'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'
    ];
    
    if (!validSigns.includes(sign.toLowerCase())) {
      throw new ModuleError(
        '不支持的星座类型',
        ERROR_CODES.VALIDATION_ERROR,
        400
      );
    }

    const validTimeframes = ['daily', 'weekly', 'monthly', 'yearly'];
    if (!validTimeframes.includes(timeframe)) {
      throw new ModuleError(
        '不支持的时间范围',
        ERROR_CODES.VALIDATION_ERROR,
        400
      );
    }

    if (date && !this.isValidDate(date)) {
      throw new ModuleError(
        '日期格式不正确，请使用YYYY-MM-DD格式',
        ERROR_CODES.VALIDATION_ERROR,
        400
      );
    }
  }

  private async generateFortune(sign: string, timeframe: string, date?: string): Promise<FortuneReading> {
    // 实现运势生成逻辑，包含降级方案
    try {
      return await this.aiDrivenFortune(sign, timeframe, date);
    } catch (aiError) {
      console.warn('AI运势生成失败，使用备用方案:', aiError);
      return await this.fallbackFortune(sign, timeframe, date);
    }
  }

  private async fallbackFortune(sign: string, timeframe: string, date?: string): Promise<FortuneReading> {
    // 降级方案：使用预设运势模板
    const basicFortune = this.getBasicFortuneTemplate(sign, timeframe);
    const randomizedFortune = this.randomizeFortune(basicFortune);

    return {
      zodiacSign: sign,
      date: date || new Date().toISOString().split('T')[0],
      timeframe: timeframe as any,
      ...randomizedFortune
    };
  }
}
```

### 前端错误处理
```typescript
// components/common/AstrologyErrorBoundary.tsx
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ModuleError } from '../../shared/types/errors';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: ModuleError;
}

export class AstrologyErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { 
      hasError: true, 
      error: error instanceof ModuleError ? error : new ModuleError(error.message, 'UNKNOWN_ERROR')
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('星座模块错误:', error, errorInfo);
    
    // 发送错误报告
    this.reportError(error, errorInfo);
  }

  private async reportError(error: Error, errorInfo: ErrorInfo) {
    try {
      await fetch('/api/astrology/error-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          error: error.message,
          stack: error.stack,
          componentStack: errorInfo.componentStack,
          timestamp: new Date().toISOString()
        })
      });
    } catch (reportError) {
      console.error('错误报告发送失败:', reportError);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="astrology-error-container min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900">
          <div className="text-center p-8 bg-black bg-opacity-30 rounded-lg backdrop-blur-sm">
            <div className="text-6xl mb-4">⭐</div>
            <h2 className="text-2xl font-bold text-white mb-4">
              星座分析过程中出现了问题
            </h2>
            <p className="text-purple-200 mb-6">
              {this.state.error?.message || '星象暂时无法解读，请稍后再试'}
            </p>
            <div className="space-x-4">
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                重新分析
              </button>
              <button
                onClick={() => window.location.href = '/'}
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

### 用户体验保障策略
```typescript
// utils/astrologyErrorHandling.ts
export const astrologyErrorHandling = {
  // AI服务降级
  handleAIServiceDown: () => ({
    message: '正在使用传统占星方法为您解读',
    action: 'fallback_reading',
    showRetry: true
  }),
  
  // 网络错误处理
  handleNetworkError: () => ({
    message: '星象连接不稳定，请检查网络后重试',
    action: 'retry',
    showOfflineMode: false
  }),
  
  // 日期验证错误
  handleDateValidationError: (error: string) => ({
    message: error,
    action: 'show_date_picker',
    showExamples: true
  }),
  
  // 星座验证错误
  handleZodiacValidationError: () => ({
    message: '请选择一个有效的星座',
    action: 'show_zodiac_selector',
    showZodiacList: true
  }),
  
  // 缓存过期处理
  handleCacheExpired: () => ({
    message: '运势数据已过期，正在为您重新生成',
    action: 'refresh_fortune',
    autoRefresh: true
  })
};
```

## 错误处理

### 星座模块特有错误处理

```typescript
class AstrologyErrorHandler {
  handleError(error: Error, context: string): ErrorResponse {
    switch (error.name) {
      case 'InvalidBirthDataError':
        return {
          success: false,
          error: 'INVALID_BIRTH_DATA',
          message: '出生信息格式不正确，请检查日期、时间和地点',
          code: 'ASTRO_001'
        };
        
      case 'EphemerisDataError':
        return {
          success: false,
          error: 'EPHEMERIS_UNAVAILABLE',
          message: '天体位置数据暂时不可用，请稍后重试',
          code: 'ASTRO_002'
        };
        
      case 'AIGenerationTimeoutError':
        return {
          success: false,
          error: 'AI_TIMEOUT',
          message: '内容生成超时，请稍后重试',
          code: 'ASTRO_003'
        };
        
      default:
        return {
          success: false,
          error: 'UNKNOWN_ERROR',
          message: '系统暂时不可用，请稍后重试',
          code: 'ASTRO_999'
        };
    }
  }
}
```