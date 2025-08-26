# 情感关系模块设计文档

## 概述

情感关系模块基于综合测试平台的Cloudflare全栈架构，提供科学的情感表达和人际关系评估服务。模块采用完全AI驱动的架构设计，结合标准化心理学测试工具和AI智能解读，为用户提供专业准确的爱之语测试、恋爱风格测试和人际关系测试。设计重点关注科学性、实用性和情感指导的建设性。

**重要说明：** 本模块严格遵循 [统一开发标准](../basic/development-guide.md)，包括：
- 统一的状态管理接口（ModuleState & ModuleActions）
- 统一的API响应格式（APIResponse<T>）
- 统一的组件架构规范（BaseComponentProps）
- 统一的错误处理机制（ModuleError）
- 统一的数据库设计规范

## 架构设计

### 系统整体架构
```
┌─────────────────────────────────────────────────────────────────┐
│                    情感关系模块前端界面 (React + Tailwind)        │
├─────────────────────────────────────────────────────────────────┤
│     爱之语测试     │     恋爱风格测试     │     人际关系测试     │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ API调用
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   情感关系模块后端服务 (Cloudflare Workers)       │
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
```


### 技术栈选择

#### 前端技术栈
```typescript
const frontendTech = {
  framework: 'React.js 18+',
  styling: 'Tailwind CSS + 温馨情感主题',
  stateManagement: 'Zustand (遵循ModuleState接口)',
  charts: 'Chart.js (用于关系能力可视化)',
  icons: 'Lucide React (情感相关图标)',
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

## 统一状态管理设计

### Zustand Store实现
```typescript
// stores/relationshipStore.ts
import { create } from 'zustand';
import { ModuleState, ModuleActions } from '../shared/types/moduleState';

interface RelationshipModuleState extends ModuleState {
  currentSession: string | null;
  testType: 'love_language' | 'love_style' | 'interpersonal' | null;
  currentQuestion: number;
  totalQuestions: number;
  answers: any[];
  testResult: any | null;
  questions: any[];
  progress: number;
}

interface RelationshipModuleActions extends ModuleActions {
  startTest: (testType: string) => Promise<void>;
  submitAnswer: (answer: any) => void;
  nextQuestion: () => void;
  submitTest: () => Promise<void>;
  getTestResult: (sessionId: string) => Promise<void>;
  submitFeedback: (sessionId: string, feedback: 'like' | 'dislike') => Promise<void>;
  resetTest: () => void;
}

export const useRelationshipStore = create<RelationshipModuleState & RelationshipModuleActions>((set, get) => ({
  // 基础状态
  isLoading: false,
  error: null,
  data: null,
  lastUpdated: null,
  
  // 情感关系专用状态
  currentSession: null,
  testType: null,
  currentQuestion: 0,
  totalQuestions: 0,
  answers: [],
  testResult: null,
  questions: [],
  progress: 0,
  
  // 基础操作
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  setData: (data) => set({ data, lastUpdated: new Date() }),
  
  // 情感关系专用操作
  startTest: async (testType: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await relationshipService.getQuestions(testType);
      if (response.success) {
        set({
          testType: testType as any,
          questions: response.data.questions,
          totalQuestions: response.data.totalQuestions,
          currentQuestion: 0,
          answers: [],
          progress: 0,
          isLoading: false,
          data: response.data,
          lastUpdated: new Date()
        });
      }
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : '加载测试失败'
      });
    }
  },
  
  submitAnswer: (answer: any) => {
    const { answers, currentQuestion, totalQuestions } = get();
    const newAnswers = [...answers, answer];
    const progress = ((currentQuestion + 1) / totalQuestions) * 100;
    
    set({
      answers: newAnswers,
      progress
    });
  },
  
  nextQuestion: () => {
    const { currentQuestion, totalQuestions } = get();
    if (currentQuestion < totalQuestions - 1) {
      set({ currentQuestion: currentQuestion + 1 });
    }
  },
  
  submitTest: async () => {
    set({ isLoading: true, error: null });
    try {
      const { testType, answers } = get();
      const response = await relationshipService.analyzeTest(testType!, answers);
      
      if (response.success) {
        set({
          currentSession: response.data.sessionId,
          testResult: response.data,
          isLoading: false,
          data: response.data,
          lastUpdated: new Date()
        });
      }
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : '分析测试结果失败'
      });
    }
  },
  
  getTestResult: async (sessionId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await relationshipService.getTestResult(sessionId);
      if (response.success) {
        set({
          testResult: response.data,
          isLoading: false,
          lastUpdated: new Date()
        });
      }
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : '获取测试结果失败'
      });
    }
  },
  
  submitFeedback: async (sessionId: string, feedback: 'like' | 'dislike') => {
    try {
      await relationshipService.submitFeedback(sessionId, feedback);
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
      testType: null,
      currentQuestion: 0,
      totalQuestions: 0,
      answers: [],
      testResult: null,
      questions: [],
      progress: 0
    });
  },
  
  resetTest: () => {
    const { reset } = get();
    reset();
  }
}));
```

## 数据库设计

### 简化数据表结构

#### 情感关系测试会话表
```sql
CREATE TABLE IF NOT EXISTS relationship_sessions (
  id TEXT PRIMARY KEY,
  test_type TEXT NOT NULL, -- 'love_language' | 'love_style' | 'interpersonal'
  input_data TEXT NOT NULL, -- JSON存储用户答题数据
  ai_response TEXT NOT NULL, -- JSON存储AI完整分析
  user_feedback TEXT, -- 'like' | 'dislike' | null
  language TEXT DEFAULT 'zh',
  user_agent TEXT,
  ip_address TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_relationship_sessions_type ON relationship_sessions(test_type, created_at);
CREATE INDEX idx_relationship_sessions_feedback ON relationship_sessions(user_feedback, created_at);
```

#### 系统配置表
```sql
CREATE TABLE IF NOT EXISTS system_config (
  id INTEGER PRIMARY KEY,
  config_key TEXT UNIQUE NOT NULL,
  config_value TEXT NOT NULL,
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 存储AI提示词模板、系统参数等配置
INSERT INTO system_config (config_key, config_value, description) VALUES
('ai_prompt_love_language', '爱之语分析提示词模板', '用于爱之语测试分析的AI提示词'),
('ai_prompt_love_style', '恋爱风格分析提示词模板', '用于恋爱风格分析的AI提示词'),
('ai_prompt_interpersonal', '人际关系分析提示词模板', '用于人际关系测试分析的AI提示词'),
('love_language_theory', '爱之语理论数据', 'JSON格式的五种爱之语理论基础');
```

#### 测试题库表
```sql
CREATE TABLE IF NOT EXISTS relationship_questions (
  id INTEGER PRIMARY KEY,
  test_type TEXT NOT NULL, -- 'love_language' | 'love_style' | 'interpersonal'
  question_number INTEGER NOT NULL,
  question TEXT NOT NULL,
  options TEXT, -- JSON存储选项
  scale_type TEXT, -- 'likert_5' | 'likert_7' | 'binary' | 'multiple_choice'
  dimension TEXT, -- 爱之语类型或恋爱风格维度
  reverse_scored BOOLEAN DEFAULT 0, -- 是否反向计分
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_relationship_questions_type ON relationship_questions(test_type, question_number);
CREATE INDEX idx_relationship_questions_dimension ON relationship_questions(test_type, dimension);
```

### 题库内容设计

#### 爱之语测试题库示例
```sql
-- 爱之语测试题目示例（30道题，每种爱之语6道）
INSERT INTO relationship_questions (test_type, question_number, question_zh, question_en, options_zh, options_en, scale_type, dimension) VALUES
('love_language', 1, '当伴侣对你说"我爱你"时，你的感受是：', 'When your partner says "I love you", you feel:', 
 '["非常感动和被爱", "还好，更希望看到行动", "开心，但更喜欢拥抱", "感谢，但更希望收到礼物", "温暖，但更希望共度时光"]', 
 '["Very touched and loved", "Okay, prefer actions", "Happy, but prefer hugs", "Grateful, but prefer gifts", "Warm, but prefer quality time"]', 
 'multiple_choice', 'words_of_affirmation'),
('love_language', 2, '你最希望伴侣为你做的事情是：', 'What you most want your partner to do for you:', 
 '["经常赞美和鼓励我", "帮我做家务或解决问题", "给我一个长长的拥抱", "送我一份贴心的礼物", "放下手机专心陪伴我"]', 
 '["Praise and encourage me often", "Help with chores or problems", "Give me a long hug", "Give me a thoughtful gift", "Put down phone and spend time with me"]', 
 'multiple_choice', 'acts_of_service');
```

#### 恋爱风格测试题库示例
```sql
-- 恋爱风格测试题目示例（42道题，每种风格7道）
INSERT INTO relationship_questions (test_type, question_number, question_zh, question_en, options_zh, options_en, scale_type, dimension) VALUES
('love_style', 1, '我相信一见钟情', 'I believe in love at first sight', 
 '["完全不同意", "不同意", "中立", "同意", "完全同意"]', 
 '["Strongly disagree", "Disagree", "Neutral", "Agree", "Strongly agree"]', 
 'likert_5', 'eros'),
('love_style', 2, '我喜欢和不同的人约会，不想太快确定关系', 'I like dating different people and don\'t want to commit too quickly', 
 '["完全不同意", "不同意", "中立", "同意", "完全同意"]', 
 '["Strongly disagree", "Disagree", "Neutral", "Agree", "Strongly agree"]', 
 'likert_5', 'ludus');
```

#### 人际关系测试题库示例
```sql
-- 人际关系测试题目示例（36道题，每个维度9道）
INSERT INTO relationship_questions (test_type, question_number, question_zh, question_en, options_zh, options_en, scale_type, dimension) VALUES
('interpersonal', 1, '在社交场合，我通常会主动与陌生人交谈', 'In social situations, I usually initiate conversations with strangers', 
 '["从不", "很少", "有时", "经常", "总是"]', 
 '["Never", "Rarely", "Sometimes", "Often", "Always"]', 
 'likert_5', 'social_initiative'),
('interpersonal', 2, '当朋友遇到困难时，我能够提供情感支持', 'When friends face difficulties, I can provide emotional support', 
 '["从不", "很少", "有时", "经常", "总是"]', 
 '["Never", "Rarely", "Sometimes", "Often", "Always"]', 
 'likert_5', 'emotional_support');
```

## 核心组件设计

### 测试数据流程图
```
用户答题 → 数据处理 → AI分析 → 结果展示
    ↓         ↓         ↓         ↓
1. 前端收集   2. 后端处理  3. AI解读   4. 格式化输出
   答题数据     计算得分     生成分析     返回结果

详细流程：
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  用户答题    │    │  数据验证    │    │  得分计算    │    │  AI分析     │
│             │    │             │    │             │    │             │
│ 选择答案     │───▶│ 检查完整性   │───▶│ 维度统计     │───▶│ 生成提示词   │
│ 提交测试     │    │ 格式校验     │    │ 总分计算     │    │ 调用AI      │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
                                                                  │
┌─────────────┐    ┌─────────────┐    ┌─────────────┐           │
│  结果展示    │    │  数据存储    │    │  结果解析    │           │
│             │    │             │    │             │           │
│ 格式化展示   │◀───│ 保存会话     │◀───│ JSON解析    │◀──────────┘
│ 用户反馈     │    │ 缓存结果     │    │ 结构化数据   │
└─────────────┘    └─────────────┘    └─────────────┘
```

### AI驱动的情感关系分析服务

#### 统一AI分析引擎
class RelationshipAIService {
  private prompts = {
    loveLanguageAnalysis: `
作为情感关系专家，请基于用户的爱之语测试答题结果进行完整分析。

用户答题数据：
{answers}

维度得分统计：
肯定言辞: {dimensionScores.words_of_affirmation}分
精心时刻: {dimensionScores.quality_time}分  
接受礼物: {dimensionScores.receiving_gifts}分
服务行动: {dimensionScores.acts_of_service}分
身体接触: {dimensionScores.physical_touch}分

请提供完整的爱之语分析，包括：
1. 五种爱之语的得分分析和排序
2. 确定主要爱之语类型和次要类型
3. 爱之语特征详细描述（400字以内）
4. 个性化的爱的表达和接受建议
5. 与不同爱之语类型伴侣的相处指导
6. 亲密关系改善的具体实践方法
7. 日常生活中的爱之语应用建议

要求：
- 基于Gary Chapman的五种爱之语理论
- 提供具体可操作的关系改善建议
- 语言温暖贴心，富有情感色彩
- 以JSON格式返回结构化数据
    `,
    
    loveStyleAnalysis: `
作为恋爱心理学专家，请基于用户的恋爱风格测试结果进行专业分析。

测试结果：
激情之爱(Eros): {scores.eros}分
游戏之爱(Ludus): {scores.ludus}分
友谊之爱(Storge): {scores.storge}分
占有之爱(Mania): {scores.mania}分
现实之爱(Pragma): {scores.pragma}分
利他之爱(Agape): {scores.agape}分

详细答题表现：{detailedAnswers}

请提供完整的恋爱风格分析，包括：
1. 六种恋爱风格的得分分析和主导风格识别
2. 恋爱风格特征和行为模式详细描述
3. 恋爱关系中的优势和潜在挑战分析
4. 不同恋爱阶段的表现特点
5. 与不同恋爱风格的兼容性分析
6. 健康恋爱关系的建设性建议
7. 个人成长和关系发展指导

要求：
- 基于Lee的爱情类型学理论
- 客观分析恋爱模式的优缺点
- 提供建设性的关系发展建议
- 语言专业但温暖理解
- 以JSON格式返回结构化数据
    `,
    
    interpersonalAnalysis: `
作为人际关系专家，请基于用户的人际关系测试结果进行综合分析。

测试结果：
社交主动性: {scores.social_initiative}分
情感支持: {scores.emotional_support}分
冲突解决: {scores.conflict_resolution}分
边界设定: {scores.boundary_setting}分

详细答题表现：{detailedPerformance}

请提供完整的人际关系分析，包括：
1. 四个人际关系维度的能力水平评估
2. 人际交往优势和需要改善的领域识别
3. 社交模式和沟通风格分析
4. 不同关系类型的表现特点（家人、朋友、同事、恋人）
5. 人际冲突的处理模式和改善建议
6. 社交技能提升的具体训练方法
7. 建立和维护健康人际关系的策略

要求：
- 基于人际关系心理学理论
- 整合多个维度的综合评估
- 提供实用的社交技能改善方法
- 语言鼓励性和建设性
- 以JSON格式返回结构化数据
    `
  };
  
  async analyzeLoveLanguage(userAnswers: UserAnswers): Promise<LoveLanguageAnalysisResult> {
    // 1. 处理答题数据
    const analysisInput = await this.answerProcessor.processLoveLanguageAnswers(userAnswers);
    
    // 2. 生成AI提示词
    const prompt = this.buildPrompt('loveLanguageAnalysis', analysisInput);
    
    // 3. 调用AI分析
    const response = await this.callAI(prompt);
    return this.parseAIResponse(response, 'love_language');
  }
  
  async analyzeLoveStyle(userAnswers: UserAnswers): Promise<LoveStyleAnalysisResult> {
    const analysisInput = await this.answerProcessor.processLoveStyleAnswers(userAnswers);
    const prompt = this.buildPrompt('loveStyleAnalysis', analysisInput);
    const response = await this.callAI(prompt);
    return this.parseAIResponse(response, 'love_style');
  }
  
  async analyzeInterpersonal(userAnswers: UserAnswers): Promise<InterpersonalAnalysisResult> {
    const analysisInput = await this.answerProcessor.processInterpersonalAnswers(userAnswers);
    const prompt = this.buildPrompt('interpersonalAnalysis', analysisInput);
    const response = await this.callAI(prompt);
    return this.parseAIResponse(response, 'interpersonal');
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
        temperature: 0.3 // 较低的温度确保结果的一致性
      })
    });
    
    const data = await response.json();
    return data.choices[0].message.content;
  }
}
```

### 答题数据处理流程

#### 答题数据结构设计
// 用户答题数据格式
interface UserAnswers {
  testType: 'love_language' | 'love_style' | 'interpersonal';
  answers: Array<{
    questionId: number;
    questionNumber: number;
    answer: string | number; // 具体答案内容
    answerIndex: number; // 选项索引
    dimension?: string; // 题目所属维度
    reverseScored?: boolean; // 是否反向计分
  }>;
  completedAt: string;
  language: string;
}

// AI分析输入数据格式
interface AIAnalysisInput {
  testType: string;
  rawAnswers: UserAnswers;
  processedData: {
    dimensionScores?: Record<string, number>; // 各维度得分
    totalScore?: number; // 总分
    dominantTypes?: string[]; // 主导类型
    answerPattern: string; // 答题模式描述
  };
  questionContext: Array<{
    questionNumber: number;
    questionText: string;
    userAnswer: string;
    dimension?: string;
  }>;
}
```

#### 答题数据处理服务
class RelationshipAnswerProcessor {
  // 爱之语答题数据处理
  async processLoveLanguageAnswers(userAnswers: UserAnswers): Promise<AIAnalysisInput> {
    const dimensionScores = {
      'words_of_affirmation': 0,
      'quality_time': 0,
      'receiving_gifts': 0,
      'acts_of_service': 0,
      'physical_touch': 0
    };
    const questionContext = [];
    
    for (const answer of userAnswers.answers) {
      const question = await this.getQuestionById(answer.questionId);
      
      // 爱之语计分：根据选择的选项确定得分维度
      const selectedDimension = this.getLoveLanguageDimension(answer.answerIndex);
      if (selectedDimension) {
        dimensionScores[selectedDimension]++;
      }
      
      questionContext.push({
        questionNumber: answer.questionNumber,
        questionText: question.question_zh,
        userAnswer: answer.answer,
        dimension: question.dimension
      });
    }
    
    return {
      testType: 'love_language',
      rawAnswers: userAnswers,
      processedData: {
        dimensionScores,
        dominantTypes: this.getDominantLoveLanguages(dimensionScores),
        answerPattern: this.generateLoveLanguagePattern(dimensionScores)
      },
      questionContext
    };
  }
  
  // 恋爱风格答题数据处理
  async processLoveStyleAnswers(userAnswers: UserAnswers): Promise<AIAnalysisInput> {
    const dimensionScores = {
      'eros': 0,      // 激情之爱
      'ludus': 0,     // 游戏之爱
      'storge': 0,    // 友谊之爱
      'mania': 0,     // 占有之爱
      'pragma': 0,    // 现实之爱
      'agape': 0      // 利他之爱
    };
    const questionContext = [];
    
    for (const answer of userAnswers.answers) {
      const question = await this.getQuestionById(answer.questionId);
      const dimension = question.dimension;
      
      // 恋爱风格计分：李克特量表计分
      let score = answer.answerIndex + 1; // 1-5分
      if (question.reverse_scored) {
        score = 6 - score; // 反向计分
      }
      
      dimensionScores[dimension] += score;
      
      questionContext.push({
        questionNumber: answer.questionNumber,
        questionText: question.question_zh,
        userAnswer: answer.answer,
        dimension: dimension,
        score: score
      });
    }
    
    return {
      testType: 'love_style',
      rawAnswers: userAnswers,
      processedData: {
        dimensionScores,
        dominantTypes: this.getDominantLoveStyles(dimensionScores),
        answerPattern: this.generateLoveStylePattern(dimensionScores)
      },
      questionContext
    };
  }
  
  // 人际关系答题数据处理
  async processInterpersonalAnswers(userAnswers: UserAnswers): Promise<AIAnalysisInput> {
    const dimensionScores = {
      'social_initiative': 0,    // 社交主动性
      'emotional_support': 0,    // 情感支持
      'conflict_resolution': 0,  // 冲突解决
      'boundary_setting': 0      // 边界设定
    };
    const dimensionCounts = {
      'social_initiative': 0,
      'emotional_support': 0,
      'conflict_resolution': 0,
      'boundary_setting': 0
    };
    
    for (const answer of userAnswers.answers) {
      const question = await this.getQuestionById(answer.questionId);
      const dimension = question.dimension;
      
      // 人际关系计分：李克特量表计分
      let score = answer.answerIndex + 1; // 1-5分
      if (question.reverse_scored) {
        score = 6 - score;
      }
      
      dimensionScores[dimension] += score;
      dimensionCounts[dimension]++;
    }
    
    // 计算各维度平均分
    Object.keys(dimensionScores).forEach(dimension => {
      if (dimensionCounts[dimension] > 0) {
        dimensionScores[dimension] = dimensionScores[dimension] / dimensionCounts[dimension];
      }
    });
    
    return {
      testType: 'interpersonal',
      rawAnswers: userAnswers,
      processedData: {
        dimensionScores: dimensionScores,
        totalScore: Object.values(dimensionScores).reduce((a, b) => a + b, 0) / 4,
        answerPattern: this.generateInterpersonalPattern(dimensionScores)
      }
    };
  }
}
```

## 前端组件架构

### 页面组件结构

#### 主要页面组件
const RelationshipModule = () => {
  return (
    <div className="relationship-module bg-gradient-to-br from-pink-50 via-rose-50 to-red-50 min-h-screen">
      <RelationshipNavigation />
      <Routes>
        <Route path="/" element={<RelationshipHomePage />} />
        <Route path="/love-language" element={<LoveLanguageTestPage />} />
        <Route path="/love-style" element={<LoveStyleTestPage />} />
        <Route path="/interpersonal" element={<InterpersonalTestPage />} />
      </Routes>
    </div>
  );
};
```

#### 爱之语测试页面
```javascript
const LoveLanguageTestPage = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [testResult, setTestResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleAnswer = (answer) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);
    
    if (currentQuestion < 29) { // 爱之语有30道题
      setCurrentQuestion(currentQuestion + 1);
    } else {
      submitTest(newAnswers);
    }
  };
  
  const submitTest = async (finalAnswers) => {
    setIsLoading(true);
    try {
      const result = await relationshipService.analyzeLoveLanguage(finalAnswers);
      setTestResult(result);
    } catch (error) {
      // 错误处理
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <PageHeader 
        title="爱之语测试"
        description="发现您独特的爱的表达和接受方式，改善亲密关系"
        icon="heart"
        theme="relationship"
      />
      
      {!testResult ? (
        <TestInterface 
          currentQuestion={currentQuestion}
          totalQuestions={30}
          onAnswer={handleAnswer}
          isLoading={isLoading}
        />
      ) : (
        <LoveLanguageResultDisplay 
          result={testResult}
          onReset={() => {
            setCurrentQuestion(0);
            setAnswers([]);
            setTestResult(null);
          }}
        />
      )}
    </div>
  );
};
```

### 核心交互组件

#### 爱之语结果展示组件
```javascript
const LoveLanguageResultDisplay = ({ result, onReset }) => {
  return (
    <div className="space-y-8">
      {/* 主要爱之语卡片 */}
      <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="w-24 h-24 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center mb-6 mx-auto">
          <Heart className="w-12 h-12 text-white" />
        </div>
        <h2 className="text-3xl font-bold mb-4">{result.primaryLoveLanguage.name}</h2>
        <p className="text-gray-600 text-lg mb-4">{result.primaryLoveLanguage.description}</p>
        <div className="text-sm text-gray-500">
          次要爱之语: {result.secondaryLoveLanguage.name}
        </div>
      </div>
      
      {/* 五种爱之语得分分布 */}
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h3 className="text-2xl font-semibold mb-6 text-center">爱之语分析</h3>
        <div className="space-y-4">
          {result.loveLanguageScores.map((language, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 flex items-center justify-center mr-3">
                  <span className="text-white text-sm font-bold">{index + 1}</span>
                </div>
                <span className="font-medium">{language.name}</span>
              </div>
              <div className="flex items-center">
                <div className="w-32 bg-gray-200 rounded-full h-3 mr-3">
                  <div 
                    className="bg-gradient-to-r from-pink-500 to-rose-500 h-3 rounded-full transition-all duration-1000"
                    style={{ width: `${(language.score / 30) * 100}%` }}
                  />
                </div>
                <span className="font-semibold">{language.score}/30</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* 爱的表达和接受建议 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h3 className="text-xl font-semibold mb-4">💝 如何表达爱</h3>
          <ul className="space-y-3">
            {result.expressionSuggestions.map((suggestion, index) => (
              <li key={index} className="flex items-start">
                <span className="text-pink-500 mr-2 mt-1">♥</span>
                <span>{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h3 className="text-xl font-semibold mb-4">💖 如何接受爱</h3>
          <ul className="space-y-3">
            {result.receptionSuggestions.map((suggestion, index) => (
              <li key={index} className="flex items-start">
                <span className="text-rose-500 mr-2 mt-1">♥</span>
                <span>{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      {/* 关系改善建议 */}
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <h3 className="text-xl font-semibold mb-4">💕 关系改善建议</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {result.relationshipAdvice.map((advice, index) => (
            <div key={index} className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">{advice.title}</h4>
              <p className="text-sm text-gray-600">{advice.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
```

## API接口设计

### 核心API端点

```javascript
// 获取测试题目
GET /api/relationship/{testType}/questions?language=zh
Response: {
  success: boolean,
  data: {
    questions: Array<{
      id: number,
      questionNumber: number,
      question: string,
      options: Array<string>,
      scaleType: string,
      dimension?: string
    }>,
    totalQuestions: number
  }
}

// 爱之语测试
POST /api/relationship/love-language/analyze
Request: {
  answers: Array<{questionId: number, answerIndex: number}>,
  language?: string
}
Response: {
  success: boolean,
  data: {
    sessionId: string,
    primaryLoveLanguage: LoveLanguageType,
    secondaryLoveLanguage: LoveLanguageType,
    loveLanguageScores: Array<LoveLanguageScore>,
    analysis: LoveLanguageAnalysis
  }
}

// 恋爱风格测试
POST /api/relationship/love-style/analyze
Request: {
  answers: Array<{questionId: number, answerIndex: number}>,
  language?: string
}
Response: {
  success: boolean,
  data: {
    sessionId: string,
    dominantStyles: Array<string>,
    styleScores: Record<string, number>,
    analysis: LoveStyleAnalysis
  }
}

// 人际关系测试
POST /api/relationship/interpersonal/analyze
Request: {
  answers: Array<{questionId: number, answerIndex: number}>,
  language?: string
}
Response: {
  success: boolean,
  data: {
    sessionId: string,
    dimensionScores: Record<string, number>,
    overallScore: number,
    analysis: InterpersonalAnalysis
  }
}
```

### 缓存策略

#### KV缓存设计
```javascript
const cacheStrategy = {
  // 题库缓存（长期，题目不经常变化）
  questions: (testType: string, language: string) => `relationship:questions:${testType}:${language}`, // TTL: 604800 (7天)
  
  // AI分析结果缓存（24小时）
  loveLanguageAnalysis: (inputHash: string) => `relationship:love_language:${inputHash}`, // TTL: 86400
  loveStyleAnalysis: (inputHash: string) => `relationship:love_style:${inputHash}`, // TTL: 86400
  interpersonalAnalysis: (inputHash: string) => `relationship:interpersonal:${inputHash}`, // TTL: 86400
  
  // 爱之语理论数据缓存
  loveLanguageTheory: 'relationship:love_language:theory', // TTL: 604800 (7天)
  
  // 系统配置缓存
  systemConfig: 'relationship:config:all', // TTL: 604800 (7天)
};
```



## 错误处理和降级方案

### 错误处理策略
```javascript
const errorHandling = {
  // AI服务不可用
  aiServiceDown: '使用预设分析模板和标准解读',
  
  // 答题数据不完整
  incompleteAnswers: '提示用户完成所有题目',
  
  // 网络请求失败
  networkError: '本地缓存结果或提示重试',
  
  // 情感分析解析失败
  parseError: '使用备用响应格式或重新请求',
  
  // 敏感情感内容处理
  sensitiveContent: '提供积极建设性的建议和专业指导'
};
```

### 情感安全保障

#### 积极情感引导
```javascript
class EmotionalSafetyService {
  // 确保所有结果都以积极正面的方式呈现
  ensurePositiveFraming(analysisResult: any): any {
    // 将潜在的负面特征重新框架为成长机会
    return this.reframeNegativeTraits(analysisResult);
  }
  
  // 提供建设性的关系建议
  generateConstructiveAdvice(relationshipType: string, userProfile: any): string[] {
    const adviceTemplates = {
      love_language: [
        '学会识别伴侣的爱之语，用他们理解的方式表达爱',
        '定期与伴侣沟通各自的情感需求和表达偏好',
        '在日常生活中有意识地实践不同的爱之语表达方式'
      ],
      love_style: [
        '认识到每种恋爱风格都有其独特的价值和美好',
        '学会平衡不同恋爱风格的特点，发展更成熟的爱情观',
        '与伴侣开诚布公地讨论各自的恋爱期望和需求'
      ],
      interpersonal: [
        '持续练习和提升人际交往技能',
        '学会在不同社交场合调整自己的沟通方式',
        '建立健康的人际边界，既关爱他人也保护自己'
      ]
    };
    
    return adviceTemplates[relationshipType] || [];
  }
}
```