# 命理模块设计文档

## 概述

命理模块基于综合测试平台的Cloudflare全栈架构，提供传统中华命理分析服务。模块采用完全AI驱动的架构设计，所有计算和分析均由AI完成，平台仅负责数据管理、缓存和用户界面。为用户提供专业准确的八字分析、五行测算、生肖运势和智能取名服务。设计重点关注简洁性、准确性和用户友好性。

**重要说明：** 本模块严格遵循 [统一开发标准](../comprehensive-testing-platform/development-guide.md)，包括：
- 统一的状态管理接口（ModuleState & ModuleActions）
- 统一的API响应格式（APIResponse<T>）
- 统一的组件架构规范（BaseComponentProps）
- 统一的错误处理机制（ModuleError）
- 统一的数据库设计规范

## 架构设计

### 系统整体架构
┌─────────────────────────────────────────────────────────────────┐
│                    命理模块前端界面 (React + Tailwind)            │
├─────────────────────────────────────────────────────────────────┤
│     八字分析     │     生肖运势     │     姓名分析     │     智能取名     │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ API调用
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   命理模块后端服务 (Cloudflare Workers)           │
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
  styling: 'Tailwind CSS + 中式传统主题',
  stateManagement: 'Zustand (遵循ModuleState接口)',
  dateHandling: 'dayjs + 农历转换库',
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
// stores/numerologyStore.ts
import { create } from 'zustand';
import { ModuleState, ModuleActions } from '../shared/types/moduleState';

interface NumerologyModuleState extends ModuleState {
  currentSession: string | null;
  analysisType: 'bazi' | 'zodiac' | 'name' | 'naming' | null;
  userInfo: {
    birthDate?: string;
    birthTime?: string;
    gender?: 'male' | 'female';
    name?: string;
  };
  analysisResult: any | null;
}

interface NumerologyModuleActions extends ModuleActions {
  setUserInfo: (info: any) => void;
  getBaziAnalysis: (birthData: any) => Promise<void>;
  getZodiacFortune: (year: number) => Promise<void>;
  getNameAnalysis: (name: string, birthData: any) => Promise<void>;
  generateNames: (requirements: any) => Promise<void>;
  submitFeedback: (sessionId: string, feedback: 'like' | 'dislike') => Promise<void>;
  resetAnalysis: () => void;
}

export const useNumerologyStore = create<NumerologyModuleState & NumerologyModuleActions>((set, get) => ({
  // 基础状态
  isLoading: false,
  error: null,
  data: null,
  lastUpdated: null,
  
  // 命理专用状态
  currentSession: null,
  analysisType: null,
  userInfo: {},
  analysisResult: null,
  
  // 基础操作
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  setData: (data) => set({ data, lastUpdated: new Date() }),
  
  // 命理专用操作
  setUserInfo: (info) => set({ userInfo: { ...get().userInfo, ...info } }),
  
  getBaziAnalysis: async (birthData: any) => {
    set({ isLoading: true, error: null, analysisType: 'bazi' });
    try {
      const response = await numerologyService.getBaziAnalysis(birthData);
      if (response.success) {
        set({
          currentSession: response.data.sessionId,
          analysisResult: response.data,
          data: response.data,
          isLoading: false,
          lastUpdated: new Date()
        });
      }
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : '八字分析失败'
      });
    }
  },
  
  getZodiacFortune: async (year: number) => {
    set({ isLoading: true, error: null, analysisType: 'zodiac' });
    try {
      const response = await numerologyService.getZodiacFortune(year);
      if (response.success) {
        set({
          currentSession: response.data.sessionId,
          analysisResult: response.data,
          data: response.data,
          isLoading: false,
          lastUpdated: new Date()
        });
      }
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : '生肖运势分析失败'
      });
    }
  },
  
  getNameAnalysis: async (name: string, birthData: any) => {
    set({ isLoading: true, error: null, analysisType: 'name' });
    try {
      const response = await numerologyService.getNameAnalysis(name, birthData);
      if (response.success) {
        set({
          currentSession: response.data.sessionId,
          analysisResult: response.data,
          data: response.data,
          isLoading: false,
          lastUpdated: new Date()
        });
      }
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : '姓名分析失败'
      });
    }
  },
  
  generateNames: async (requirements: any) => {
    set({ isLoading: true, error: null, analysisType: 'naming' });
    try {
      const response = await numerologyService.generateNames(requirements);
      if (response.success) {
        set({
          currentSession: response.data.sessionId,
          analysisResult: response.data,
          data: response.data,
          isLoading: false,
          lastUpdated: new Date()
        });
      }
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : '智能取名失败'
      });
    }
  },
  
  submitFeedback: async (sessionId: string, feedback: 'like' | 'dislike') => {
    try {
      await numerologyService.submitFeedback(sessionId, feedback);
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
      analysisType: null,
      userInfo: {},
      analysisResult: null
    });
  },
  
  resetAnalysis: () => {
    const { reset } = get();
    reset();
  }
}));
```

#### 后端技术栈
const backendTech = {
  runtime: 'Cloudflare Workers',
  framework: 'Hono.js',
  database: 'Cloudflare D1 (SQLite)',
  cache: 'Cloudflare KV',
  aiService: 'OpenAI API / Claude API'
};
## 数据库设计

### 简化数据表结构

#### 命理分析会话表
```sql
CREATE TABLE IF NOT EXISTS numerology_sessions (
  id TEXT PRIMARY KEY,
  session_type TEXT NOT NULL, -- 'bazi' | 'zodiac' | 'name_analysis' | 'name_generation'
  input_data TEXT NOT NULL, -- JSON存储用户输入信息
  ai_response TEXT NOT NULL, -- JSON存储AI完整响应
  user_feedback TEXT, -- 'like' | 'dislike' | null
  language TEXT DEFAULT 'zh',
  user_agent TEXT,
  ip_address TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_numerology_sessions_type ON numerology_sessions(session_type, created_at);
CREATE INDEX idx_numerology_sessions_feedback ON numerology_sessions(user_feedback, created_at);
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
('ai_prompt_bazi', '八字分析提示词模板', '用于八字分析的AI提示词'),
('ai_prompt_naming', '取名提示词模板', '用于智能取名的AI提示词'),
('ai_prompt_zodiac', '生肖运势提示词模板', '用于生肖运势分析的AI提示词'),
('ai_prompt_name_analysis', '姓名分析提示词模板', '用于姓名分析的AI提示词');
```
## 核心组件设计

### AI驱动的命理分析服务

#### 统一AI分析引擎
```javascript
class NumerologyAIService {
  private prompts = {
    baziAnalysis: `
作为专业命理师，请根据用户提供的出生信息进行完整的八字分析。

用户信息：
- 出生日期：{birthDate}
- 出生时间：{birthTime}
- 日历类型：{calendarType}

请提供完整分析，包括：
1. 八字计算（年柱、月柱、日柱、时柱）
2. 五行分析（金木水火土的分布和缺失）
3. 性格特征分析（300字以内）
4. 事业发展建议（200字以内）
5. 财运分析（200字以内）
6. 感情运势（200字以内）
7. 健康注意事项（150字以内）
8. 改运建议（200字以内）

要求：
- 先进行准确的八字计算，再基于计算结果分析
- 语言通俗易懂，避免过于专业的术语
- 保持积极正面的基调，避免绝对化表述
- 结合现代生活实际情况
- 以JSON格式返回结构化数据
    `,
    
    nameAnalysis: `
作为姓名学专家，请分析姓名"{fullName}"的命理含义。

请提供完整分析：
1. 五格数理计算（天格、人格、地格、外格、总格）
2. 各格数理的吉凶判断和含义
3. 三才配置分析
4. 姓名整体评分（1-100分）
5. 性格特征分析
6. 事业运势分析
7. 改名建议（如果需要）

要求：
- 先进行准确的笔画计算和五格数理
- 提供详细的分析解释
- 语言通俗易懂
- 以JSON格式返回结构化数据
    `,
    
    nameGeneration: `
作为中文取名专家，请为姓氏"{surname}"推荐5个优质名字。

用户需求：
- 性别：{gender}
- 期望寓意：{meanings}
- 喜欢的字：{preferredChars}

请为每个名字提供：
1. 完整姓名和标准拼音
2. 五格数理计算和评分
3. 寓意解释（简洁明了，50字以内）
4. 文化内涵（1-2句话说明文化背景）
5. 适用性说明

要求：
- 名字要好听、好记、好写
- 避免生僻字和多音字
- 寓意积极正面，适合现代使用
- 考虑五格数理的吉凶
- 以JSON格式返回结构化数据
    `,
    
    zodiacFortune: `
作为生肖运势专家，请分析生肖"{zodiac}"在{timeframe}的运势。

请提供详细分析：
1. 整体运势概况
2. 事业运势
3. 财运分析
4. 感情运势
5. 健康运势
6. 幸运元素（颜色、数字、方位等）
7. 注意事项和建议
8. 本命年或犯太岁情况（如适用）

要求：
- 结合当前时间和生肖特征
- 提供实用的生活建议
- 保持积极正面的基调
- 以JSON格式返回结构化数据
    `
  };
  
  async analyzeBazi(birthInfo: BirthInfo): Promise<BaziAnalysisResult> {
    const prompt = this.buildPrompt('baziAnalysis', birthInfo);
    const response = await this.callAI(prompt);
    return this.parseAIResponse(response, 'bazi');
  }
  
  async analyzeName(fullName: string): Promise<NameAnalysisResult> {
    const prompt = this.buildPrompt('nameAnalysis', { fullName });
    const response = await this.callAI(prompt);
    return this.parseAIResponse(response, 'nameAnalysis');
  }
  
  async generateNames(requirements: NamingRequirements): Promise<NameSuggestion[]> {
    const prompt = this.buildPrompt('nameGeneration', requirements);
    const response = await this.callAI(prompt);
    return this.parseAIResponse(response, 'nameGeneration');
  }
  
  async analyzeZodiacFortune(zodiac: string, timeframe: string): Promise<ZodiacFortune> {
    const prompt = this.buildPrompt('zodiacFortune', { zodiac, timeframe });
    const response = await this.callAI(prompt);
    return this.parseAIResponse(response, 'zodiac');
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
        temperature: 0.7
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
    const cacheKey = `numerology:${type}:${inputHash}`;
    return await this.kv.get(cacheKey, 'json');
  }
  
  async setCachedResult(inputHash: string, type: string, result: any, ttl: number = 86400): Promise<void> {
    const cacheKey = `numerology:${type}:${inputHash}`;
    await this.kv.put(cacheKey, JSON.stringify(result), { expirationTtl: ttl });
  }
  
  generateInputHash(input: any): string {
    return crypto.subtle.digest('SHA-256', JSON.stringify(input));
  }
}
```
## 前端组件架构

### 页面组件结构

#### 主要页面组件
const NumerologyModule = () => {
  return (
    <div className="numerology-module bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 min-h-screen">
      <NumerologyNavigation />
      <Routes>
        <Route path="/" element={<NumerologyHomePage />} />
        <Route path="/bazi" element={<BaziAnalysisPage />} />
        <Route path="/zodiac" element={<ZodiacFortunePage />} />
        <Route path="/name-analysis" element={<NameAnalysisPage />} />
        <Route path="/name-generation" element={<NameGenerationPage />} />

      </Routes>
    </div>
  );
};
#### 八字分析页面
const BaziAnalysisPage = () => {
  const [birthInfo, setBirthInfo] = useState<BirthInfo>();
  const [analysisResult, setAnalysisResult] = useState<BaziAnalysisResult>();
  const [isLoading, setIsLoading] = useState(false);
  
  const handleAnalysis = async (info: BirthInfo) => {
    setIsLoading(true);
    try {
      const result = await numerologyService.analyzeBazi(info);
      setAnalysisResult(result);
    } catch (error) {
      // 错误处理
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <PageHeader 
        title="生辰八字分析"
        description="基于传统命理学，分析您的八字命盘和五行属性"
        icon="yin-yang"
        theme="numerology"
      />
      
      {!analysisResult ? (
        <BirthInfoForm onSubmit={handleAnalysis} />
      ) : (
        <BaziResultDisplay 
          result={analysisResult}
          onReset={() => setAnalysisResult(undefined)}
        />
      )}
    </div>
  );
};
### 核心交互组件

#### 出生信息输入组件
const BirthInfoForm = ({ onSubmit }: BirthInfoFormProps) => {
  const [formData, setFormData] = useState({
    year: '',
    month: '',
    day: '',
    hour: '',
    calendarType: 'solar' as 'solar' | 'lunar'
  });
  
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <h3 className="text-2xl font-bold mb-6 text-center">请输入您的出生信息</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">日历类型</label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input 
                type="radio" 
                value="solar"
                checked={formData.calendarType === 'solar'}
                onChange={(e) => setFormData({...formData, calendarType: 'solar'})}
              />
              <span className="ml-2">公历（阳历）</span>
            </label>
            <label className="flex items-center">
              <input 
                type="radio" 
                value="lunar"
                checked={formData.calendarType === 'lunar'}
                onChange={(e) => setFormData({...formData, calendarType: 'lunar'})}
              />
              <span className="ml-2">农历（阴历）</span>
            </label>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">出生年份</label>
          <input 
            type="number"
            value={formData.year}
            onChange={(e) => setFormData({...formData, year: e.target.value})}
            className="w-full px-3 py-2 border rounded-lg"
            placeholder="如：1990"
          />
        </div>
        
        {/* 月、日、时的输入框 */}
      </div>
      
      <button 
        onClick={() => onSubmit(formData)}
        className="w-full mt-6 bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
      >
        开始分析
      </button>
    </div>
  );
};
#### 智能取名组件
const NameGenerationForm = ({ onGenerate }: NameGenerationFormProps) => {
  const [formData, setFormData] = useState({
    surname: '',
    gender: '',
    meanings: [] as string[],
    preferredChars: ''
  });
  
  const meaningOptions = [
    '聪明才智', '健康平安', '事业成功', '温柔善良', 
    '勇敢坚强', '财运亨通', '学业有成', '家庭和睦'
  ];
  
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <h3 className="text-2xl font-bold mb-6 text-center">🎋 智能中文取名</h3>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">姓氏 *</label>
          <input 
            type="text"
            value={formData.surname}
            onChange={(e) => setFormData({...formData, surname: e.target.value})}
            className="w-full px-3 py-2 border rounded-lg"
            placeholder="请输入姓氏"
            maxLength={2}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">性别</label>
          <div className="flex space-x-4">
            {['男孩', '女孩', '不限'].map(option => (
              <label key={option} className="flex items-center">
                <input 
                  type="radio" 
                  value={option}
                  checked={formData.gender === option}
                  onChange={(e) => setFormData({...formData, gender: e.target.value})}
                />
                <span className="ml-2">{option}</span>
              </label>
            ))}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">期望寓意</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {meaningOptions.map(meaning => (
              <label key={meaning} className="flex items-center">
                <input 
                  type="checkbox"
                  checked={formData.meanings.includes(meaning)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFormData({...formData, meanings: [...formData.meanings, meaning]});
                    } else {
                      setFormData({...formData, meanings: formData.meanings.filter(m => m !== meaning)});
                    }
                  }}
                />
                <span className="ml-2 text-sm">{meaning}</span>
              </label>
            ))}
          </div>
        </div>
        
        <button 
          onClick={() => onGenerate(formData)}
          disabled={!formData.surname}
          className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 rounded-xl font-semibold disabled:opacity-50"
        >
          开始取名
        </button>
      </div>
    </div>
  );
};
## API接口设计

### 核心API端点
// 八字分析
POST /api/numerology/bazi/analyze
Request: {
  birthDate: string; // ISO date string
  birthTime: string; // HH:mm format
  calendarType: 'solar' | 'lunar';
  timezone?: string;
}
Response: {
  success: boolean;
  data: {
    sessionId: string;
    bazi: BaziResult;
    wuxing: WuxingAnalysis;
    basicAnalysis: BasicAnalysisResult;
    aiAnalysis?: AIAnalysisResult;
  };
}

// 生肖运势查询
GET /api/numerology/zodiac/:animal/:timeframe
Response: {
  success: boolean;
  data: {
    zodiac: string;
    timeframe: string;
    fortune: ZodiacFortune;
    recommendations: string[];
    luckyElements: LuckyElements;
  };
}

// 姓名分析
POST /api/numerology/name/analyze
Request: {
  fullName: string;
  language?: string;
}
Response: {
  success: boolean;
  data: {
    wugeAnalysis: WugeAnalysis;
    characterAnalysis: CharacterAnalysis[];
    overallScore: number;
    recommendations: string[];
  };
}

// 智能取名
POST /api/numerology/name/generate
Request: {
  surname: string;
  gender?: string;
  meanings?: string[];
  preferredChars?: string;
  language?: string;
}
Response: {
  success: boolean;
  data: {
    suggestions: NameSuggestion[];
    culturalInfo: CulturalInfo;
  };
}

// 农历转换
POST /api/numerology/calendar/convert
Request: {
  date: string;
  fromType: 'solar' | 'lunar';
  toType: 'solar' | 'lunar';
}
Response: {
  success: boolean;
  data: {
    originalDate: DateInfo;
    convertedDate: DateInfo;
    ganzhiInfo: GanzhiInfo;
  };
}
### 缓存策略

#### KV缓存设计
```javascript
const cacheStrategy = {
  // AI分析结果缓存（24小时）
  baziAnalysis: (inputHash: string) => `numerology:bazi:${inputHash}`, // TTL: 86400
  nameAnalysis: (inputHash: string) => `numerology:name:${inputHash}`, // TTL: 86400
  nameGeneration: (inputHash: string) => `numerology:naming:${inputHash}`, // TTL: 86400
  
  // 生肖运势缓存（按时间范围调整TTL）
  zodiacFortune: (zodiac: string, timeframe: string, date: string) => 
    `numerology:zodiac:${zodiac}:${timeframe}:${date}`, // TTL: 根据timeframe调整
  
  // 系统配置缓存（长期）
  systemConfig: 'numerology:config:all', // TTL: 604800 (7天)
  
  // AI提示词模板缓存
  prompts: 'numerology:prompts:all' // TTL: 86400
};
```
## 多语言支持

### 多语言数据结构
interface MultiLanguageContent {
  zh: string;
  en: string;
}

interface NumerologyI18n {
  // 基础术语
  terms: {
    tiangan: MultiLanguageContent;
    dizhi: MultiLanguageContent;
    wuxing: MultiLanguageContent;
    zodiac: MultiLanguageContent;
  };
  
  // 分析结果模板
  templates: {
    personality: MultiLanguageContent;
    career: MultiLanguageContent;
    wealth: MultiLanguageContent;
    relationship: MultiLanguageContent;
    health: MultiLanguageContent;
  };
  
  // 文化解释
  cultural: {
    baziIntro: MultiLanguageContent;
    wuxingTheory: MultiLanguageContent;
    zodiacLegend: MultiLanguageContent;
    namingTradition: MultiLanguageContent;
  };
}
### AI多语言处理
class MultiLanguageAIService {
  async generateAnalysis(
    data: any, 
    language: 'zh' | 'en',
    analysisType: string
  ): Promise<string> {
    const prompt = language === 'zh' 
      ? this.buildChinesePrompt(data, analysisType)
      : this.buildEnglishPrompt(data, analysisType);
    
    return await this.callAI(prompt);
  }
  
  private buildEnglishPrompt(data: any, type: string): string {
    return `
As a Chinese numerology expert, please provide analysis in English for international users.

Please include:
1. Brief introduction to Chinese numerology concepts
2. Analysis based on the provided data
3. Cultural background explanation
4. Practical guidance for modern life

Requirements:
- Use clear, accessible English
- Explain Chinese cultural concepts
- Maintain respectful tone toward traditional culture
- Provide practical, positive guidance
    `;
  }
}
## 错误处理和降级方案

### 错误处理策略
```javascript
const errorHandling = {
  // AI服务不可用
  aiServiceDown: '使用预设分析模板',
  
  // 日期转换失败
  dateConversionError: '提供日期格式帮助和重新输入选项',
  
  // 输入验证失败
  invalidInput: '提供详细的输入格式说明和示例',
  
  // 网络请求失败
  networkError: '提示用户检查网络连接并重试',
  
  // AI响应解析失败
  parseError: '使用备用响应格式或重新请求'
};
```

### 用户体验保障
- **渐进式加载**：显示加载状态，AI分析完成后逐步展示结果
- **友好提示**：为不熟悉传统文化的用户提供简单说明
- **降级方案**：AI服务不可用时提供基础功能
- **缓存优化**：相同输入直接返回缓存结果，提升响应速度