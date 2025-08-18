# 心理测试模块设计文档

## 概述

心理测试模块基于综合测试平台的Cloudflare全栈架构，提供科学的心理健康评估和自我认知服务。模块采用完全AI驱动的架构设计，结合标准化心理量表和AI智能解读，为用户提供专业准确的MBTI性格测试、PHQ-9抑郁筛查、情商测试和幸福指数评估。设计重点关注科学性、准确性和用户心理安全。

**重要说明：** 本模块严格遵循 [统一开发标准](../comprehensive-testing-platform/development-guide.md)，包括：
- 统一的状态管理接口（ModuleState & ModuleActions）
- 统一的API响应格式（APIResponse<T>）
- 统一的组件架构规范（BaseComponentProps）
- 统一的错误处理机制（ModuleError）
- 统一的数据库设计规范

## 架构设计

### 系统整体架构
┌─────────────────────────────────────────────────────────────────┐
│                    心理测试模块前端界面 (React + Tailwind)        │
├─────────────────────────────────────────────────────────────────┤
│     MBTI测试     │     PHQ-9测试     │     情商测试     │     幸福指数     │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ API调用
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   心理测试模块后端服务 (Cloudflare Workers)       │
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
  styling: 'Tailwind CSS + 专业医疗主题',
  stateManagement: 'Zustand (遵循ModuleState接口)',
  charts: 'Chart.js (用于结果可视化)',
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
// types/psychologyTypes.ts
export interface PsychologyQuestion {
  id: number;
  test_type: 'mbti' | 'phq9' | 'eq' | 'happiness';
  question_number: number;
  question_zh: string;
  question_en: string;
  options_zh?: string[]; // 选择题选项
  options_en?: string[];
  scale_type: 'likert_5' | 'likert_7' | 'binary' | 'multiple_choice';
  dimension?: string; // MBTI维度或其他分类
  reverse_scored: boolean;
}

export interface PsychologyAnswer {
  questionId: number;
  answer: number | string;
  responseTime?: number; // 答题用时（毫秒）
}

export interface PsychologyTestResult {
  sessionId: string;
  testType: string;
  scores: Record<string, number>;
  interpretation: string;
  recommendations: string[];
  riskLevel?: 'low' | 'medium' | 'high'; // 用于PHQ-9等风险评估
  mbtiType?: string; // MBTI专用
  completedAt: string;
}

export interface TestSession {
  id: string;
  testType: string;
  currentQuestion: number;
  answers: PsychologyAnswer[];
  startTime: Date;
  isCompleted: boolean;
}
```
## 统一数据库设计

### 标准化数据表结构

#### 心理测试会话表（遵循统一命名规范）
```sql
CREATE TABLE IF NOT EXISTS psychology_sessions (
  id TEXT PRIMARY KEY,
  session_type TEXT NOT NULL DEFAULT 'psychology_test',
  test_type TEXT NOT NULL, -- 'mbti' | 'phq9' | 'eq' | 'happiness'
  input_data TEXT NOT NULL, -- JSON存储用户答题数据
  ai_response_data TEXT NOT NULL, -- JSON存储AI完整分析
  user_feedback TEXT, -- 'like' | 'dislike' | null
  language TEXT DEFAULT 'zh',
  user_agent TEXT,
  ip_address_hash TEXT, -- 哈希后的IP地址
  session_duration INTEGER, -- 测试用时（秒）
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 统一索引命名规范
CREATE INDEX idx_psychology_sessions_type_date ON psychology_sessions(test_type, created_at);
CREATE INDEX idx_psychology_sessions_feedback ON psychology_sessions(user_feedback, created_at);
CREATE INDEX idx_psychology_sessions_created ON psychology_sessions(created_at DESC);
```

#### 测试题库表
```sql
CREATE TABLE IF NOT EXISTS psychology_questions (
  id INTEGER PRIMARY KEY,
  test_type TEXT NOT NULL, -- 'mbti' | 'phq9' | 'eq' | 'happiness'
  question_number INTEGER NOT NULL,
  question_zh TEXT NOT NULL,
  question_en TEXT NOT NULL,
  options_zh TEXT, -- JSON存储选项（单选/多选题）
  options_en TEXT, -- JSON存储选项
  scale_type TEXT NOT NULL, -- 'likert_5' | 'likert_7' | 'binary' | 'multiple_choice'
  dimension TEXT, -- MBTI维度(E/I, S/N, T/F, J/P)或其他分类
  reverse_scored BOOLEAN DEFAULT 0, -- 是否反向计分
  weight REAL DEFAULT 1.0, -- 题目权重
  is_active BOOLEAN DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_psychology_questions_test_type ON psychology_questions(test_type, question_number);
CREATE INDEX idx_psychology_questions_active ON psychology_questions(is_active, test_type);
```

#### 测试类型配置表
```sql
CREATE TABLE IF NOT EXISTS psychology_test_types (
  id TEXT PRIMARY KEY,
  name_zh TEXT NOT NULL,
  name_en TEXT NOT NULL,
  description_zh TEXT,
  description_en TEXT,
  category TEXT NOT NULL, -- 'personality' | 'mental_health' | 'emotional' | 'cognitive'
  question_count INTEGER NOT NULL,
  estimated_time INTEGER, -- 预估完成时间（分钟）
  scoring_algorithm TEXT NOT NULL, -- 'mbti' | 'sum_score' | 'weighted_average'
  result_interpretation_data TEXT, -- JSON存储结果解释规则
  is_active BOOLEAN DEFAULT 1,
  sort_order INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_psychology_test_types_active_order ON psychology_test_types(is_active, sort_order);
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

-- 插入心理测试模块配置
INSERT INTO sys_configs (key, value, description, is_public) VALUES
('psychology_ai_prompt_mbti', 'MBTI分析AI提示词模板', '用于MBTI性格分析的AI提示词', 0),
('psychology_ai_prompt_phq9', 'PHQ-9分析AI提示词模板', '用于抑郁筛查分析的AI提示词', 0),
('psychology_ai_prompt_eq', '情商分析AI提示词模板', '用于情商测试分析的AI提示词', 0),
('psychology_ai_prompt_happiness', '幸福指数分析AI提示词模板', '用于幸福指数分析的AI提示词', 0),
('psychology_max_session_time', '3600', '测试会话最大时长（秒）', 1),
('psychology_enable_risk_warning', 'true', '是否启用风险警告功能', 1);
```

#### 分析事件表（统一规范）
```sql
CREATE TABLE IF NOT EXISTS analytics_events (
  id TEXT PRIMARY KEY,
  event_type TEXT NOT NULL,
  event_data TEXT, -- JSON对象
  session_id TEXT,
  module_name TEXT DEFAULT 'psychology',
  ip_address_hash TEXT,
  user_agent TEXT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (session_id) REFERENCES psychology_sessions(id)
);

CREATE INDEX idx_analytics_events_module_type_time ON analytics_events(module_name, event_type, timestamp);
CREATE INDEX idx_analytics_events_session ON analytics_events(session_id);
```
  question_zh TEXT NOT NULL,
  question_en TEXT NOT NULL,
  options_zh TEXT, -- JSON存储选项（单选/多选题）
  options_en TEXT, -- JSON存储选项
  scale_type TEXT, -- 'likert_5' | 'likert_7' | 'binary' | 'multiple_choice'
  dimension TEXT, -- MBTI维度(E/I, S/N, T/F, J/P)或其他分类
  reverse_scored BOOLEAN DEFAULT 0, -- 是否反向计分
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_psychology_questions_type ON psychology_questions(test_type, question_number);
CREATE INDEX idx_psychology_questions_dimension ON psychology_questions(test_type, dimension);
```

### 题库内容设计

#### MBTI题库示例
```sql
-- MBTI测试题目示例（60道题，每个维度15道）
INSERT INTO psychology_questions (test_type, question_number, question_zh, question_en, options_zh, options_en, scale_type, dimension) VALUES
('mbti', 1, '在聚会中，你更倾向于：', 'At a party, you tend to:', 
 '["与很多人交谈", "与少数几个人深入交谈"]', 
 '["Talk to many people", "Talk deeply with a few people"]', 
 'binary', 'E/I'),
('mbti', 2, '你更喜欢：', 'You prefer:', 
 '["具体的事实和细节", "抽象的概念和可能性"]', 
 '["Concrete facts and details", "Abstract concepts and possibilities"]', 
 'binary', 'S/N'),
('mbti', 3, '做决定时，你更依赖：', 'When making decisions, you rely more on:', 
 '["逻辑分析", "个人价值观和感受"]', 
 '["Logical analysis", "Personal values and feelings"]', 
 'binary', 'T/F'),
('mbti', 4, '你更喜欢：', 'You prefer:', 
 '["有计划和结构", "保持灵活和开放"]', 
 '["Having plans and structure", "Staying flexible and open"]', 
 'binary', 'J/P');
```

#### PHQ-9题库示例
```sql
-- PHQ-9标准题目（9道题）
INSERT INTO psychology_questions (test_type, question_number, question_zh, question_en, options_zh, options_en, scale_type) VALUES
('phq9', 1, '在过去两周里，你有多少时候被以下问题困扰：做事时提不起劲或没有兴趣', 
 'Over the last 2 weeks, how often have you been bothered by: Little interest or pleasure in doing things',
 '["完全没有", "几天", "一半以上的天数", "几乎每天"]',
 '["Not at all", "Several days", "More than half the days", "Nearly every day"]',
 'likert_4'),
('phq9', 2, '感到心情低落、沮丧或绝望', 
 'Feeling down, depressed, or hopeless',
 '["完全没有", "几天", "一半以上的天数", "几乎每天"]',
 '["Not at all", "Several days", "More than half the days", "Nearly every day"]',
 'likert_4');
```

#### 情商测试题库示例
```sql
-- 情商测试题目示例（40道题）
INSERT INTO psychology_questions (test_type, question_number, question_zh, question_en, options_zh, options_en, scale_type, dimension) VALUES
('eq', 1, '我能够准确识别自己的情绪', 'I can accurately identify my emotions',
 '["完全不同意", "不同意", "中立", "同意", "完全同意"]',
 '["Strongly disagree", "Disagree", "Neutral", "Agree", "Strongly agree"]',
 'likert_5', 'self_awareness'),
('eq', 2, '当我感到愤怒时，我能够有效控制自己的反应', 'When I feel angry, I can effectively control my reactions',
 '["完全不同意", "不同意", "中立", "同意", "完全同意"]',
 '["Strongly disagree", "Disagree", "Neutral", "Agree", "Strongly agree"]',
 'likert_5', 'self_management');
```

#### 幸福指数题库示例
```sql
-- 幸福指数测试题目示例（30道题）
INSERT INTO psychology_questions (test_type, question_number, question_zh, question_en, options_zh, options_en, scale_type, dimension) VALUES
('happiness', 1, '总的来说，我对自己的生活感到满意', 'Overall, I am satisfied with my life',
 '["完全不同意", "不同意", "中立", "同意", "完全同意"]',
 '["Strongly disagree", "Disagree", "Neutral", "Agree", "Strongly agree"]',
 'likert_5', 'life_satisfaction'),
('happiness', 2, '我对自己的工作/学习感到满意', 'I am satisfied with my work/studies',
 '["完全不同意", "不同意", "中立", "同意", "完全同意"]',
 '["Strongly disagree", "Disagree", "Neutral", "Agree", "Strongly agree"]',
 'likert_5', 'work_satisfaction');
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

### AI驱动的心理测试分析服务

#### 统一AI分析引擎
class PsychologyAIService {
  private prompts = {
    mbtiAnalysis: `
作为专业心理学家，请基于用户的MBTI测试答题结果进行完整分析。

用户答题数据：
{answers}

维度得分统计：
外向(E): {dimensionScores.E}分 vs 内向(I): {dimensionScores.I}分
感觉(S): {dimensionScores.S}分 vs 直觉(N): {dimensionScores.N}分  
思考(T): {dimensionScores.T}分 vs 情感(F): {dimensionScores.F}分
判断(J): {dimensionScores.J}分 vs 知觉(P): {dimensionScores.P}分

请提供完整的MBTI分析，包括：
1. 四个维度的得分计算（E/I, S/N, T/F, J/P）
2. 确定16种性格类型中的具体类型
3. 性格特征详细描述（500字以内）
4. 优势和潜在发展领域分析
5. 职业发展建议和适合的工作环境
6. 人际关系和沟通风格分析
7. 学习和成长建议

要求：
- 基于标准MBTI理论进行分析
- 语言专业但通俗易懂
- 保持积极正面的基调
- 避免刻板印象和绝对化表述
- 以JSON格式返回结构化数据
    `,
    
    phq9Analysis: `
作为专业心理健康评估师，请基于用户的PHQ-9量表答题结果进行科学分析。

用户答题数据：{answers}

请提供完整的PHQ-9分析，包括：
1. 按照标准PHQ-9计分方法计算总分
2. 根据得分范围确定抑郁程度评估
3. 各症状维度的详细分析
4. 心理健康状况评估和建议
5. 生活方式改善建议
6. 专业求助建议（如适用）

要求：
- 严格按照PHQ-9标准进行评估
- 语言谨慎、专业、关怀
- 避免诊断性语言，强调筛查性质
- 为高风险用户提供专业建议
- 保持希望和积极的基调
- 以JSON格式返回结构化数据
    `,
    
    eqAnalysis: `
作为情商研究专家，请基于用户的情商测试答题结果进行综合分析。

用户答题数据：{answers}

请提供完整的情商分析，包括：
1. 总体情商得分和等级评估
2. 四个维度的分项分析（自我意识、自我管理、社会意识、人际关系管理）
3. 情绪管理能力评估
4. 社交技能和人际交往分析
5. 情商提升的具体建议和方法
6. 日常生活中的实践指导

要求：
- 基于情商理论进行科学分析
- 提供实用的情商提升建议
- 语言鼓励性和建设性
- 结合现代生活场景
- 以JSON格式返回结构化数据
    `,
    
    happinessAnalysis: `
作为积极心理学专家，请基于用户的幸福指数测试答题结果进行全面分析。

用户答题数据：{answers}

请提供完整的幸福指数分析，包括：
1. 总体幸福指数得分和水平评估
2. 各生活领域的幸福感分析（工作、人际、健康、成长、平衡）
3. 幸福感的优势领域和改善空间
4. 提升幸福感的科学方法和建议
5. 生活质量改善的具体行动计划
6. 长期幸福感维护策略

要求：
- 基于积极心理学理论
- 提供科学的幸福提升方法
- 语言积极正面，充满希望
- 建议具体可行
- 以JSON格式返回结构化数据
    `
  };
  
  async analyzeMBTI(userAnswers: UserAnswers): Promise<MBTIAnalysisResult> {
    // 1. 处理答题数据
    const analysisInput = await this.answerProcessor.processAnswers(userAnswers);
    
    // 2. 生成AI提示词
    const answerDescription = this.answerProcessor.generateAnswerDescription(analysisInput);
    const prompt = this.buildPrompt('mbtiAnalysis', { 
      answers: answerDescription,
      dimensionScores: analysisInput.processedData.dimensionScores 
    });
    
    // 3. 调用AI分析
    const response = await this.callAI(prompt);
    return this.parseAIResponse(response, 'mbti');
  }
  
  async analyzePHQ9(answers: any[]): Promise<PHQ9AnalysisResult> {
    const prompt = this.buildPrompt('phq9Analysis', { answers });
    const response = await this.callAI(prompt);
    return this.parseAIResponse(response, 'phq9');
  }
  
  async analyzeEQ(answers: any[]): Promise<EQAnalysisResult> {
    const prompt = this.buildPrompt('eqAnalysis', { answers });
    const response = await this.callAI(prompt);
    return this.parseAIResponse(response, 'eq');
  }
  
  async analyzeHappiness(answers: any[]): Promise<HappinessAnalysisResult> {
    const prompt = this.buildPrompt('happinessAnalysis', { answers });
    const response = await this.callAI(prompt);
    return this.parseAIResponse(response, 'happiness');
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
### 答题数据处理流程

#### 答题数据结构设计
```javascript
// 用户答题数据格式
interface UserAnswers {
  testType: 'mbti' | 'phq9' | 'eq' | 'happiness';
  answers: Array<{
    questionId: number;
    questionNumber: number;
    answer: string | number; // 具体答案内容
    answerIndex: number; // 选项索引（0,1,2...）
    dimension?: string; // 题目所属维度
    reverseScored?: boolean; // 是否反向计分
  }>;
  completedAt: string; // 完成时间
  language: string; // 答题语言
}

// AI分析输入数据格式
interface AIAnalysisInput {
  testType: string;
  rawAnswers: UserAnswers;
  processedData: {
    dimensionScores?: Record<string, number>; // 各维度得分
    totalScore?: number; // 总分
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
```javascript
class AnswerProcessingService {
  // 处理用户答题数据，转换为AI可理解的格式
  async processAnswers(userAnswers: UserAnswers): Promise<AIAnalysisInput> {
    const { testType, answers } = userAnswers;
    
    switch (testType) {
      case 'mbti':
        return this.processMBTIAnswers(userAnswers);
      case 'phq9':
        return this.processPHQ9Answers(userAnswers);
      case 'eq':
        return this.processEQAnswers(userAnswers);
      case 'happiness':
        return this.processHappinessAnswers(userAnswers);
      default:
        throw new Error(`Unsupported test type: ${testType}`);
    }
  }
  
  // MBTI答题数据处理
  private async processMBTIAnswers(userAnswers: UserAnswers): Promise<AIAnalysisInput> {
    const dimensionScores = { 'E': 0, 'I': 0, 'S': 0, 'N': 0, 'T': 0, 'F': 0, 'J': 0, 'P': 0 };
    const questionContext = [];
    
    for (const answer of userAnswers.answers) {
      // 获取题目详细信息
      const question = await this.getQuestionById(answer.questionId);
      
      // 计算维度得分
      if (question.dimension) {
        const [dim1, dim2] = question.dimension.split('/');
        if (answer.answerIndex === 0) {
          dimensionScores[dim1]++;
        } else {
          dimensionScores[dim2]++;
        }
      }
      
      // 构建问题上下文
      questionContext.push({
        questionNumber: answer.questionNumber,
        questionText: question.question_zh,
        userAnswer: answer.answer,
        dimension: question.dimension
      });
    }
    
    return {
      testType: 'mbti',
      rawAnswers: userAnswers,
      processedData: {
        dimensionScores,
        answerPattern: this.generateMBTIPattern(dimensionScores)
      },
      questionContext
    };
  }
  
  // PHQ-9答题数据处理
  private async processPHQ9Answers(userAnswers: UserAnswers): Promise<AIAnalysisInput> {
    let totalScore = 0;
    const questionContext = [];
    
    for (const answer of userAnswers.answers) {
      const question = await this.getQuestionById(answer.questionId);
      
      // PHQ-9计分：0-3分制
      const score = answer.answerIndex; // 选项索引直接对应分数
      totalScore += score;
      
      questionContext.push({
        questionNumber: answer.questionNumber,
        questionText: question.question_zh,
        userAnswer: answer.answer,
        score: score
      });
    }
    
    return {
      testType: 'phq9',
      rawAnswers: userAnswers,
      processedData: {
        totalScore,
        riskLevel: this.getPHQ9RiskLevel(totalScore),
        answerPattern: this.generatePHQ9Pattern(totalScore, questionContext)
      },
      questionContext
    };
  }
  
  // 生成AI提示词中的答题数据描述
  generateAnswerDescription(analysisInput: AIAnalysisInput): string {
    const { testType, processedData, questionContext } = analysisInput;
    
    let description = `测试类型：${testType}\n\n`;
    
    if (testType === 'mbti') {
      description += `维度得分：\n`;
      Object.entries(processedData.dimensionScores).forEach(([dim, score]) => {
        description += `${dim}: ${score}分\n`;
      });
      description += `\n答题模式：${processedData.answerPattern}\n\n`;
    } else if (testType === 'phq9') {
      description += `总分：${processedData.totalScore}/27分\n`;
      description += `风险等级：${processedData.riskLevel}\n\n`;
    }
    
    description += `详细答题情况：\n`;
    questionContext.forEach(q => {
      description += `问题${q.questionNumber}：${q.questionText}\n`;
      description += `用户回答：${q.userAnswer}\n`;
      if (q.dimension) description += `维度：${q.dimension}\n`;
      description += `\n`;
    });
    
    return description;
  }
}
```

### 题库管理服务

#### 题库查询服务
```javascript
class QuestionBankService {
  async getQuestions(testType: string, language: string = 'zh'): Promise<Question[]> {
    // 从数据库获取题目
    const questions = await this.db
      .prepare('SELECT * FROM psychology_questions WHERE test_type = ? ORDER BY question_number')
      .bind(testType)
      .all();
    
    return questions.map(q => ({
      id: q.id,
      questionNumber: q.question_number,
      question: language === 'zh' ? q.question_zh : q.question_en,
      options: JSON.parse(language === 'zh' ? q.options_zh : q.options_en),
      scaleType: q.scale_type,
      dimension: q.dimension,
      reverseScored: q.reverse_scored
    }));
  }
  
  async getQuestionsByDimension(testType: string, dimension: string): Promise<Question[]> {
    const questions = await this.db
      .prepare('SELECT * FROM psychology_questions WHERE test_type = ? AND dimension = ? ORDER BY question_number')
      .bind(testType, dimension)
      .all();
    
    return questions;
  }
  
  // 获取题目总数
  async getQuestionCount(testType: string): Promise<number> {
    const result = await this.db
      .prepare('SELECT COUNT(*) as count FROM psychology_questions WHERE test_type = ?')
      .bind(testType)
      .first();
    
    return result.count;
  }
}
```

### 缓存和会话管理

#### 智能缓存服务
class CacheService {
  async getCachedResult(inputHash: string, type: string): Promise<any> {
    const cacheKey = `psychology:${type}:${inputHash}`;
    return await this.kv.get(cacheKey, 'json');
  }
  
  async setCachedResult(inputHash: string, type: string, result: any, ttl: number = 86400): Promise<void> {
    const cacheKey = `psychology:${type}:${inputHash}`;
    await this.kv.put(cacheKey, JSON.stringify(result), { expirationTtl: ttl });
  }
  
  generateInputHash(input: any): string {
    return crypto.subtle.digest('SHA-256', JSON.stringify(input));
  }
}
## 统一状态管理设计

### Zustand Store实现
```typescript
// stores/psychologyStore.ts
import { create } from 'zustand';
import { ModuleState, ModuleActions } from '../shared/types/moduleState';

// 心理测试模块专用状态扩展
interface PsychologyModuleState extends ModuleState {
  currentSession: string | null;
  testType: 'mbti' | 'phq9' | 'eq' | 'happiness' | null;
  currentQuestion: number;
  totalQuestions: number;
  answers: PsychologyAnswer[];
  testResult: PsychologyTestResult | null;
  questions: PsychologyQuestion[];
  progress: number;
}

interface PsychologyModuleActions extends ModuleActions {
  startTest: (testType: string) => Promise<void>;
  submitAnswer: (answer: PsychologyAnswer) => void;
  nextQuestion: () => void;
  submitTest: () => Promise<void>;
  getTestResult: (sessionId: string) => Promise<void>;
  submitFeedback: (sessionId: string, feedback: 'like' | 'dislike') => Promise<void>;
  resetTest: () => void;
}

export const usePsychologyStore = create<PsychologyModuleState & PsychologyModuleActions>((set, get) => ({
  // 基础状态
  isLoading: false,
  error: null,
  data: null,
  lastUpdated: null,
  
  // 心理测试专用状态
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
  
  // 心理测试专用操作
  startTest: async (testType: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await psychologyService.getQuestions(testType);
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
  
  submitAnswer: (answer: PsychologyAnswer) => {
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
      const response = await psychologyService.analyzeTest(testType!, answers);
      
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
      const response = await psychologyService.getTestResult(sessionId);
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
      await psychologyService.submitFeedback(sessionId, feedback);
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

## 统一组件架构设计

### 标准化组件接口
```typescript
// types/psychologyComponentTypes.ts
import { BaseComponentProps } from '../shared/types/componentInterfaces';

export interface TestQuestionProps extends BaseComponentProps {
  question: PsychologyQuestion;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (answer: PsychologyAnswer) => void;
}

export interface TestResultProps extends BaseComponentProps {
  result: PsychologyTestResult;
  onReset: () => void;
  onShare?: () => void;
}

export interface ProgressBarProps extends BaseComponentProps {
  current: number;
  total: number;
  percentage: number;
}
```

## 前端组件架构

### 页面组件结构

#### 主要页面组件
const PsychologyModule = () => {
  return (
    <div className="psychology-module bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 min-h-screen">
      <PsychologyNavigation />
      <Routes>
        <Route path="/" element={<PsychologyHomePage />} />
        <Route path="/mbti" element={<MBTITestPage />} />
        <Route path="/phq9" element={<PHQ9TestPage />} />
        <Route path="/eq" element={<EQTestPage />} />
        <Route path="/happiness" element={<HappinessTestPage />} />
      </Routes>
    </div>
  );
};
#### MBTI测试页面
const MBTITestPage = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [testResult, setTestResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleAnswer = (answer) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);
    
    if (currentQuestion < 59) { // MBTI有60道题
      setCurrentQuestion(currentQuestion + 1);
    } else {
      submitTest(newAnswers);
    }
  };
  
  const submitTest = async (finalAnswers) => {
    setIsLoading(true);
    try {
      const result = await psychologyService.analyzeMBTI(finalAnswers);
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
        title="MBTI性格测试"
        description="基于心理学理论，深入了解您的性格类型和特征"
        icon="brain"
        theme="psychology"
      />
      
      {!testResult ? (
        <TestInterface 
          currentQuestion={currentQuestion}
          totalQuestions={60}
          onAnswer={handleAnswer}
          isLoading={isLoading}
        />
      ) : (
        <MBTIResultDisplay 
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
### 核心交互组件

#### 测试题目组件
const TestQuestion = ({ question, options, onAnswer, questionNumber, totalQuestions }) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-gray-500">
            问题 {questionNumber} / {totalQuestions}
          </span>
          <div className="w-32 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
            />
          </div>
        </div>
        <h3 className="text-xl font-semibold mb-4">{question}</h3>
      </div>
      
      <div className="space-y-3">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => onAnswer(option.value)}
            className="w-full text-left p-4 rounded-xl border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all"
          >
            <div className="flex items-center">
              <div className="w-6 h-6 rounded-full border-2 border-gray-300 mr-3 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <span>{option.text}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
#### 结果展示组件
const MBTIResultDisplay = ({ result, onReset }) => {
  return (
    <div className="space-y-8">
      {/* 性格类型卡片 */}
      <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mb-6 mx-auto">
          <span className="text-white text-2xl font-bold">{result.personalityType}</span>
        </div>
        <h2 className="text-3xl font-bold mb-4">{result.typeName}</h2>
        <p className="text-gray-600 text-lg">{result.typeDescription}</p>
      </div>
      
      {/* 维度分析 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {result.dimensions.map((dimension, index) => (
          <div key={index} className="bg-white rounded-2xl shadow-xl p-6">
            <h3 className="text-xl font-semibold mb-4">{dimension.name}</h3>
            <div className="flex justify-between items-center mb-2">
              <span>{dimension.leftLabel}</span>
              <span>{dimension.rightLabel}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
              <div 
                className="bg-gradient-to-r from-blue-500 to-indigo-500 h-3 rounded-full transition-all duration-1000"
                style={{ width: `${dimension.score}%` }}
              />
            </div>
            <p className="text-sm text-gray-600">{dimension.description}</p>
          </div>
        ))}
      </div>
      
      {/* 详细分析 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h3 className="text-xl font-semibold mb-4">🎯 优势特征</h3>
          <ul className="space-y-2">
            {result.strengths.map((strength, index) => (
              <li key={index} className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>{strength}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h3 className="text-xl font-semibold mb-4">🚀 发展建议</h3>
          <ul className="space-y-2">
            {result.developmentAreas.map((area, index) => (
              <li key={index} className="flex items-start">
                <span className="text-blue-500 mr-2">→</span>
                <span>{area}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      {/* 操作按钮 */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button 
          onClick={onReset}
          className="flex-1 bg-gray-500 text-white py-3 px-6 rounded-xl font-semibold hover:bg-gray-600 transition-colors"
        >
          重新测试
        </button>
        <button className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg transition-all">
          分享结果
        </button>
      </div>
    </div>
  );
};
## 统一API接口设计

### API响应格式标准化
```typescript
// types/psychologyApiTypes.ts
import { APIResponse } from '../shared/types/apiResponse';

export interface PsychologyTestRequest {
  testType: 'mbti' | 'phq9' | 'eq' | 'happiness';
  answers: PsychologyAnswer[];
  language?: string;
}

export interface PsychologyTestResponse {
  sessionId: string;
  testType: string;
  result: PsychologyTestResult;
  analysis: any;
}

export interface PsychologyFeedbackRequest {
  sessionId: string;
  feedback: 'like' | 'dislike';
  comment?: string;
}
```

### 标准化API服务
```typescript
// services/psychologyService.ts
import { apiClient } from './apiClient';
import { APIResponse } from '../shared/types/apiResponse';

export const psychologyService = {
  // 获取测试题目
  async getQuestions(testType: string, language = 'zh'): Promise<APIResponse<{
    questions: PsychologyQuestion[];
    totalQuestions: number;
  }>> {
    return apiClient.get(`/psychology/${testType}/questions?language=${language}`);
  },

  // 分析测试结果
  async analyzeTest(testType: string, answers: PsychologyAnswer[]): Promise<APIResponse<PsychologyTestResponse>> {
    return apiClient.post(`/psychology/${testType}/analyze`, {
      testType,
      answers
    });
  },

  // 获取测试结果
  async getTestResult(sessionId: string): Promise<APIResponse<PsychologyTestResult>> {
    return apiClient.get(`/psychology/results/${sessionId}`);
  },

  // 提交反馈
  async submitFeedback(sessionId: string, feedback: 'like' | 'dislike'): Promise<APIResponse<void>> {
    return apiClient.post('/psychology/feedback', {
      sessionId,
      feedback
    });
  }
};
```

### 后端API实现
```typescript
// routes/psychology.ts
import { Hono } from 'hono';
import { PsychologyService } from '../services/PsychologyService';
import { errorHandler } from '../utils/errorHandler';
import { ModuleError, ERROR_CODES } from '../shared/types/errors';

const psychologyRoutes = new Hono<{
  Bindings: {
    DB: D1Database;
    KV: KVNamespace;
    AI_API_KEY: string;
  };
}>();

// 获取测试题目
psychologyRoutes.get('/:testType/questions', async (c) => {
  try {
    const testType = c.req.param('testType');
    const language = c.req.query('language') || 'zh';
    
    if (!['mbti', 'phq9', 'eq', 'happiness'].includes(testType)) {
      throw new ModuleError(
        '不支持的测试类型',
        ERROR_CODES.VALIDATION_ERROR,
        400
      );
    }

    const psychologyService = new PsychologyService(c.env.DB, c.env.KV);
    const questions = await psychologyService.getQuestions(testType, language);
    
    return c.json({
      success: true,
      data: {
        questions,
        totalQuestions: questions.length
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return errorHandler(error, c);
  }
});

// 分析测试结果
psychologyRoutes.post('/:testType/analyze', async (c) => {
  try {
    const testType = c.req.param('testType');
    const request = await c.req.json();
    
    // 验证请求数据
    if (!request.answers || !Array.isArray(request.answers)) {
      throw new ModuleError(
        '答题数据不能为空',
        ERROR_CODES.VALIDATION_ERROR,
        400
      );
    }

    const psychologyService = new PsychologyService(c.env.DB, c.env.KV, c.env.AI_API_KEY);
    const result = await psychologyService.analyzeTest(testType, request.answers);
    
    return c.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return errorHandler(error, c);
  }
});

// 获取测试结果
psychologyRoutes.get('/results/:sessionId', async (c) => {
  try {
    const sessionId = c.req.param('sessionId');
    
    if (!sessionId) {
      throw new ModuleError(
        '会话ID不能为空',
        ERROR_CODES.VALIDATION_ERROR,
        400
      );
    }

    const psychologyService = new PsychologyService(c.env.DB, c.env.KV);
    const result = await psychologyService.getTestResult(sessionId);
    
    return c.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return errorHandler(error, c);
  }
});

// 提交反馈
psychologyRoutes.post('/feedback', async (c) => {
  try {
    const request = await c.req.json();
    
    if (!request.sessionId || !request.feedback) {
      throw new ModuleError(
        '会话ID和反馈类型不能为空',
        ERROR_CODES.VALIDATION_ERROR,
        400
      );
    }

    const psychologyService = new PsychologyService(c.env.DB, c.env.KV);
    await psychologyService.submitFeedback(request.sessionId, request.feedback);
    
    return c.json({
      success: true,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return errorHandler(error, c);
  }
});

export { psychologyRoutes };
```

## API接口设计

### 核心API端点

```javascript
// 获取测试题目
GET /api/psychology/{testType}/questions?language=zh
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
// MBTI性格测试
POST /api/psychology/mbti/analyze
Request: {
  answers: Array<{questionId: number, answer: string}>,
  language?: string
}
Response: {
  success: boolean,
  data: {
    sessionId: string,
    personalityType: string,
    typeName: string,
    dimensions: Array<DimensionScore>,
    analysis: MBTIAnalysis
  }
}

// PHQ-9抑郁筛查
POST /api/psychology/phq9/analyze
Request: {
  answers: Array<{questionId: number, score: number}>,
  language?: string
}
Response: {
  success: boolean,
  data: {
    sessionId: string,
    totalScore: number,
    riskLevel: string,
    analysis: PHQ9Analysis,
    recommendations: Array<string>
  }
}

// 情商测试
POST /api/psychology/eq/analyze
Request: {
  answers: Array<{questionId: number, answer: string}>,
  language?: string
}
Response: {
  success: boolean,
  data: {
    sessionId: string,
    totalScore: number,
    dimensions: Array<EQDimension>,
    analysis: EQAnalysis
  }
}

// 幸福指数评估
POST /api/psychology/happiness/analyze
Request: {
  answers: Array<{questionId: number, score: number}>,
  language?: string
}
Response: {
  success: boolean,
  data: {
    sessionId: string,
    happinessIndex: number,
    domains: Array<HappinessDomain>,
    analysis: HappinessAnalysis
  }
}
### 缓存策略

#### KV缓存设计
const cacheStrategy = {
  // 题库缓存（长期，题目不经常变化）
  questions: (testType: string, language: string) => `psychology:questions:${testType}:${language}`, // TTL: 604800 (7天)
  
  // AI分析结果缓存（24小时）
  mbtiAnalysis: (inputHash: string) => `psychology:mbti:${inputHash}`, // TTL: 86400
  phq9Analysis: (inputHash: string) => `psychology:phq9:${inputHash}`, // TTL: 86400
  eqAnalysis: (inputHash: string) => `psychology:eq:${inputHash}`, // TTL: 86400
  happinessAnalysis: (inputHash: string) => `psychology:happiness:${inputHash}`, // TTL: 86400
  
  // 系统配置缓存（长期）
  systemConfig: 'psychology:config:all', // TTL: 604800 (7天)
  
  // AI提示词模板缓存
  prompts: 'psychology:prompts:all' // TTL: 86400
};
## 多语言支持

### 多语言数据结构
interface PsychologyI18n {
  // 测试题目
  questions: {
    mbti: MultiLanguageContent[];
    phq9: MultiLanguageContent[];
    eq: MultiLanguageContent[];
    happiness: MultiLanguageContent[];
  };
  
  // 结果解读模板
  results: {
    personalityTypes: Record<string, MultiLanguageContent>;
    riskLevels: Record<string, MultiLanguageContent>;
    recommendations: MultiLanguageContent[];
  };
  
  // 界面文字
  ui: {
    buttons: MultiLanguageContent;
    labels: MultiLanguageContent;
    descriptions: MultiLanguageContent;
  };
}
## 统一错误处理设计

### 错误处理实现
```typescript
// services/PsychologyService.ts
import { ModuleError, ERROR_CODES, errorHandler } from '../shared/types/errors';

export class PsychologyService {
  constructor(
    private db: D1Database,
    private kv: KVNamespace,
    private aiApiKey?: string
  ) {}

  async analyzeTest(testType: string, answers: PsychologyAnswer[]): Promise<PsychologyTestResponse> {
    try {
      // 验证输入
      this.validateTestRequest(testType, answers);
      
      // 检查AI服务可用性
      if (!this.aiApiKey) {
        throw new ModuleError(
          'AI分析服务暂时不可用，请稍后重试',
          ERROR_CODES.AI_SERVICE_UNAVAILABLE,
          503
        );
      }

      // 执行测试分析
      const result = await this.performAnalysis(testType, answers);
      return result;
      
    } catch (error) {
      if (error instanceof ModuleError) {
        throw error;
      }
      
      // 处理未知错误
      throw new ModuleError(
        '心理测试分析服务暂时不可用',
        ERROR_CODES.UNKNOWN_ERROR,
        500,
        error
      );
    }
  }

  private validateTestRequest(testType: string, answers: PsychologyAnswer[]): void {
    const validTestTypes = ['mbti', 'phq9', 'eq', 'happiness'];
    if (!validTestTypes.includes(testType)) {
      throw new ModuleError(
        '不支持的测试类型',
        ERROR_CODES.VALIDATION_ERROR,
        400
      );
    }

    if (!answers || answers.length === 0) {
      throw new ModuleError(
        '答题数据不能为空',
        ERROR_CODES.VALIDATION_ERROR,
        400
      );
    }

    // 验证答题完整性
    const expectedQuestionCount = this.getExpectedQuestionCount(testType);
    if (answers.length !== expectedQuestionCount) {
      throw new ModuleError(
        `答题不完整，期望${expectedQuestionCount}道题，实际${answers.length}道题`,
        ERROR_CODES.VALIDATION_ERROR,
        400
      );
    }
  }

  private async performAnalysis(testType: string, answers: PsychologyAnswer[]): Promise<PsychologyTestResponse> {
    // 实现分析逻辑，包含降级方案
    try {
      return await this.aiDrivenAnalysis(testType, answers);
    } catch (aiError) {
      console.warn('AI分析失败，使用备用方案:', aiError);
      return await this.fallbackAnalysis(testType, answers);
    }
  }

  private async fallbackAnalysis(testType: string, answers: PsychologyAnswer[]): Promise<PsychologyTestResponse> {
    // 降级方案：使用预设分析模板
    const sessionId = crypto.randomUUID();
    const basicResult = this.calculateBasicScores(testType, answers);
    const templateAnalysis = this.getAnalysisTemplate(testType, basicResult);

    return {
      sessionId,
      testType,
      result: basicResult,
      analysis: templateAnalysis
    };
  }
}
```

### 前端错误处理
```typescript
// components/common/PsychologyErrorBoundary.tsx
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ModuleError } from '../../shared/types/errors';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: ModuleError;
}

export class PsychologyErrorBoundary extends Component<Props, State> {
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
    console.error('心理测试模块错误:', error, errorInfo);
    
    // 发送错误报告
    this.reportError(error, errorInfo);
  }

  private async reportError(error: Error, errorInfo: ErrorInfo) {
    try {
      await fetch('/api/psychology/error-report', {
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
        <div className="psychology-error-container min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
          <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
            <div className="text-6xl mb-4">🧠</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              测试过程中出现了问题
            </h2>
            <p className="text-gray-600 mb-6">
              {this.state.error?.message || '系统暂时无法处理您的请求，请稍后再试'}
            </p>
            <div className="space-x-4">
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                重新开始
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
// utils/psychologyErrorHandling.ts
export const psychologyErrorHandling = {
  // AI服务降级
  handleAIServiceDown: () => ({
    message: '正在使用基础分析方法为您生成结果',
    action: 'fallback_analysis',
    showRetry: true
  }),
  
  // 网络错误处理
  handleNetworkError: () => ({
    message: '网络连接不稳定，请检查网络后重试',
    action: 'retry',
    showOfflineMode: false
  }),
  
  // 答题数据验证错误
  handleValidationError: (error: string) => ({
    message: error,
    action: 'show_help',
    showExamples: true
  }),
  
  // 会话过期处理
  handleSessionExpired: () => ({
    message: '测试会话已过期，请重新开始测试',
    action: 'restart_test',
    autoRedirect: true
  }),
  
  // PHQ-9高风险处理
  handleHighRiskResult: () => ({
    message: '检测到您可能需要专业帮助，建议咨询心理健康专家',
    action: 'show_resources',
    showProfessionalHelp: true
  })
};
```

## 错误处理和降级方案

### 错误处理策略
const errorHandling = {
  // AI服务不可用
  aiServiceDown: '使用预设分析模板',
  
  // 答题数据不完整
  incompleteAnswers: '提示用户完成所有题目',
  
  // 网络请求失败
  networkError: '提示用户检查网络连接并重试',
  
  // AI响应解析失败
  parseError: '使用备用响应格式或重新请求',
  
  // 心理健康风险处理
  highRiskResult: '提供专业咨询建议和求助渠道'
};
### 数据传递示例

#### MBTI测试数据传递完整示例
```javascript
// 1. 用户答题数据（前端收集）
const userAnswers = {
  testType: 'mbti',
  answers: [
    {
      questionId: 1,
      questionNumber: 1,
      answer: "与很多人交谈",
      answerIndex: 0,
      dimension: "E/I"
    },
    {
      questionId: 2,
      questionNumber: 2,
      answer: "抽象的概念和可能性",
      answerIndex: 1,
      dimension: "S/N"
    }
    // ... 更多答题数据
  ],
  completedAt: "2024-01-15T10:30:00Z",
  language: "zh"
};

// 2. 处理后的分析输入（后端处理）
const analysisInput = {
  testType: 'mbti',
  rawAnswers: userAnswers,
  processedData: {
    dimensionScores: { E: 8, I: 7, S: 6, N: 9, T: 10, F: 5, J: 7, P: 8 },
    answerPattern: "ENTP倾向，外向直觉思考知觉型"
  },
  questionContext: [
    {
      questionNumber: 1,
      questionText: "在聚会中，你更倾向于：",
      userAnswer: "与很多人交谈",
      dimension: "E/I"
    }
    // ... 更多问题上下文
  ]
};

// 3. 发送给AI的提示词内容
const aiPrompt = `
作为专业心理学家，请基于用户的MBTI测试答题结果进行完整分析。

用户答题数据：
测试类型：mbti

维度得分：
E: 8分
I: 7分
S: 6分
N: 9分
T: 10分
F: 5分
J: 7分
P: 8分

答题模式：ENTP倾向，外向直觉思考知觉型

详细答题情况：
问题1：在聚会中，你更倾向于：
用户回答：与很多人交谈
维度：E/I

问题2：你更喜欢：
用户回答：抽象的概念和可能性
维度：S/N

[... 包含所有60道题的详细答题情况]

请提供完整的MBTI分析，包括：
1. 四个维度的得分计算（E/I, S/N, T/F, J/P）
2. 确定16种性格类型中的具体类型
3. 性格特征详细描述（500字以内）
...
`;

// 4. AI返回的分析结果
const aiResponse = {
  personalityType: "ENTP",
  typeName: "辩论家",
  dimensions: [
    { name: "外向/内向", leftLabel: "外向(E)", rightLabel: "内向(I)", score: 53, description: "略偏外向..." },
    { name: "感觉/直觉", leftLabel: "感觉(S)", rightLabel: "直觉(N)", score: 60, description: "明显偏直觉..." }
  ],
  analysis: {
    personality: "您是一个充满创意和热情的人...",
    strengths: ["创新思维", "适应能力强", "善于沟通"],
    developmentAreas: ["需要更多耐心", "注意细节"],
    careerSuggestions: ["创业", "咨询", "媒体"]
  }
};
```

### 用户体验保障

- **渐进式测试**：支持测试过程中的暂停和继续
- **隐私保护**：匿名测试，不收集个人信息
- **心理安全**：谨慎处理敏感结果，提供积极建议
- **专业建议**：为高风险用户提供专业求助渠道
- **缓存优化**：相同答案组合直接返回缓存结果