# 首页模块设计文档

## 概述
首页模块基于综合测试平台的Cloudflare全栈架构，作为平台的核心入口提供功能导航、内容展示、用户引导和个性化推荐服务。模块采用React + Tailwind CSS前端技术栈，结合Cloudflare Workers后端服务，实现高性能、响应式的用户体验。

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
│                    首页前端界面 (React + Tailwind)                │
├─────────────────────────────────────────────────────────────────┤
│  导航栏  │  英雄区域  │  功能展示  │  热门推荐  │  搜索  │  页脚    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ API调用
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   首页后端服务 (Cloudflare Workers)               │
├─────────────────────────────────────────────────────────────────┤
│  模块信息API  │  推荐算法  │  搜索服务  │  统计收集  │  Cookies管理  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ 数据访问
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      数据存储层 (D1 + KV)                       │
├─────────────────────────────────────────────────────────────────┤
│  模块配置  │  用户行为  │  推荐数据  │  搜索索引  │  Cookies偏好    │
└─────────────────────────────────────────────────────────────────┘
```

### 技术栈选择

#### 前端技术栈
```javascript
const frontendTech = {
  framework: 'React.js 18+',
  styling: 'Tailwind CSS',
  stateManagement: 'Zustand',
  routing: 'React Router',
  
  buildTool: 'Vite',
  deployment: 'Cloudflare Pages'
};
```

#### 后端技术栈
```javascript
const backendTech = {
  runtime: 'Cloudflare Workers',
  framework: 'Hono.js',
  database: 'Cloudflare D1 (SQLite)',
  cache: 'Cloudflare KV',
  search: 'Cloudflare D1 + 自定义搜索算法'
};
```

## 数据库设计

### 首页相关数据表

#### 模块配置表
```sql
CREATE TABLE IF NOT EXISTS homepage_modules (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT NOT NULL,
  category TEXT NOT NULL,
  theme_color TEXT,
  is_active BOOLEAN DEFAULT 1,
  sort_order INTEGER DEFAULT 0,
  usage_count INTEGER DEFAULT 0,
  average_rating REAL DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### 用户行为统计表
```sql
CREATE TABLE IF NOT EXISTS homepage_analytics (
  id TEXT PRIMARY KEY,
  session_id TEXT NOT NULL,
  event_type TEXT NOT NULL, -- 'page_view', 'module_click', 'search', 'language_switch'
  event_data TEXT, -- JSON存储事件详细数据
  user_agent TEXT,
  ip_address TEXT,
  language TEXT DEFAULT 'zh',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_homepage_analytics_session ON homepage_analytics(session_id, created_at);
CREATE INDEX idx_homepage_analytics_event ON homepage_analytics(event_type, created_at);
```

#### 搜索索引表
```sql
CREATE TABLE IF NOT EXISTS search_index (
  id TEXT PRIMARY KEY,
  content_type TEXT NOT NULL, -- 'module', 'blog', 'test'
  content_id TEXT NOT NULL,
  title TEXT,
  keywords TEXT, -- 空格分隔的关键词
  description TEXT,
  popularity_score INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_search_content ON search_index(content_type, popularity_score);
```

#### Cookies偏好表
```sql
CREATE TABLE IF NOT EXISTS user_preferences (
  id TEXT PRIMARY KEY,
  session_id TEXT UNIQUE NOT NULL,
  language TEXT DEFAULT 'zh',
  cookies_consent TEXT, -- JSON存储cookies同意状态
  search_history TEXT, -- JSON存储搜索历史
  module_preferences TEXT, -- JSON存储模块偏好
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  expires_at DATETIME -- 偏好过期时间
);

CREATE INDEX idx_user_preferences_session ON user_preferences(session_id);
CREATE INDEX idx_user_preferences_expires ON user_preferences(expires_at);
```

## API接口设计

### 首页数据接口

#### 获取首页配置
```javascript
// GET /api/homepage/config?lang=zh-CN
Response: {
  success: boolean,
  data: {
    modules: [
      {
        id: string,
        name: string,
        description: string,
        icon: string,
        category: string,
        themeColor: string,
        usageCount: number,
        averageRating: number,
        isActive: boolean
      }
    ],
    hotTests: [
      {
        id: string,
        name: string,
        description: string,
        category: string,
        popularity: number
      }
    ],
    blogArticles: [
      {
        id: string,
        title: string,
        excerpt: string,
        viewCount: number,
        publishedAt: string
      }
    ]
  }
}
```

#### 搜索接口
```javascript
// GET /api/homepage/search?q=keyword&lang=zh-CN&limit=10
Response: {
  success: boolean,
  data: {
    modules: [
      {
        id: string,
        name: string,
        description: string,
        relevanceScore: number
      }
    ],
    blogs: [
      {
        id: string,
        title: string,
        excerpt: string,
        relevanceScore: number
      }
    ],
    suggestions: string[]
  }
}
```

#### 用户行为记录接口
```javascript
// POST /api/homepage/analytics
Request: {
  sessionId: string,
  eventType: 'page_view' | 'module_click' | 'search' | 'language_switch',
  eventData: {
    moduleId?: string,
    searchQuery?: string,
    language?: string,
    clickPosition?: number
  }
}
Response: {
  success: boolean
}
```

### Cookies管理接口

#### 获取Cookies偏好
```javascript
// GET /api/homepage/cookies/preferences?sessionId=xxx
Response: {
  success: boolean,
  data: {
    sessionId: string,
    language: string,
    cookiesConsent: {
      necessary: boolean,
      functional: boolean,
      analytics: boolean,
      marketing: boolean
    },
    searchHistory: string[],
    modulePreferences: object
  }
}
```

#### 更新Cookies偏好
```javascript
// POST /api/homepage/cookies/preferences
Request: {
  sessionId: string,
  language?: string,
  cookiesConsent: {
    necessary: boolean,
    functional: boolean,
    analytics: boolean,
    marketing: boolean
  }
}
Response: {
  success: boolean
}
```

## 前端组件设计

### 核心组件架构

#### 页面主组件
```typescript
// components/HomePage/HomePage.tsx
interface HomePageProps {
  language: string;
  onLanguageChange: (lang: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  language,
  onLanguageChange
}) => {
  const { modules, hotTests, blogArticles, isLoading } = useHomepageData(language);
  const { showCookieBanner, cookiePreferences } = useCookieManager();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navigation language={language} onLanguageChange={onLanguageChange} />
      <HeroSection />
      <ModulesGrid modules={modules} />
      <PopularTests tests={hotTests} />
      <FeaturesSection />
      <BlogSection articles={blogArticles} />
      <SearchSection />
      <Footer />
      {showCookieBanner && <CookieBanner />}
    </div>
  );
};
```

#### 模块网格组件
```typescript
// components/HomePage/ModulesGrid.tsx
interface Module {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  themeColor: string;
  usageCount: number;
  averageRating: number;
}

interface ModulesGridProps {
  modules: Module[];
}

export const ModulesGrid: React.FC<ModulesGridProps> = ({ modules }) => {
  const { trackModuleClick } = useAnalytics();

  const handleModuleClick = (module: Module) => {
    trackModuleClick(module.id);
    // 导航到模块页面
    window.location.href = `/tests/${module.id}`;
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {modules.map((module) => (
          <ModuleCard
            key={module.id}
            module={module}
            onClick={() => handleModuleClick(module)}
          />
        ))}
      </div>
    </section>
  );
};
```

#### 搜索组件
```typescript
// components/HomePage/SearchSection.tsx
export const SearchSection: React.FC = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const { search, isSearching } = useSearch();
  const { t } = useTranslation();

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    const results = await search(searchQuery);
    // 处理搜索结果
  };

  const handleInputChange = async (value: string) => {
    setQuery(value);
    if (value.length > 2) {
      const suggestions = await getSuggestions(value);
      setSuggestions(suggestions);
    }
  };

  return (
    <section className="max-w-4xl mx-auto px-4 py-16">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          {t('search.title')}
        </h2>
      </div>
      
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder={t('search.placeholder')}
          className="w-full px-6 py-4 text-lg border-2 border-gray-300 rounded-full focus:border-blue-500 focus:outline-none"
        />
        
        {suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg mt-2 shadow-lg z-10">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSearch(suggestion)}
                className="w-full px-4 py-2 text-left hover:bg-gray-100"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>
      
      <div className="mt-6 text-center">
        <p className="text-gray-600 mb-4">{t('search.hotKeywords')}</p>
        <div className="flex flex-wrap justify-center gap-2">
          {['MBTI测试', '今日运势', '塔罗占卜', '职业测试'].map((keyword) => (
            <button
              key={keyword}
              onClick={() => handleSearch(keyword)}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
            >
              {keyword}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
```

#### Cookies横幅组件
```typescript
// components/HomePage/CookieBanner.tsx
interface CookiePreferences {
  necessary: boolean;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
}

export const CookieBanner: React.FC = () => {
  const [showCustomSettings, setShowCustomSettings] = useState(false);
  const { updateCookiePreferences, hideBanner } = useCookieManager();
  const { t } = useTranslation();

  const handleAcceptAll = () => {
    updateCookiePreferences({
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true
    });
    hideBanner();
  };

  const handleNecessaryOnly = () => {
    updateCookiePreferences({
      necessary: true,
      functional: false,
      analytics: false,
      marketing: false
    });
    hideBanner();
  };

  const handleCustomSettings = () => {
    setShowCustomSettings(true);
  };

  if (showCustomSettings) {
    return <CookieSettingsModal onClose={() => setShowCustomSettings(false)} />;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">🍪</span>
              <h3 className="text-lg font-semibold text-gray-900">
                {t('cookies.title')}
              </h3>
            </div>
            <p className="text-gray-600 text-sm">
              {t('cookies.description')}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleAcceptAll}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {t('cookies.acceptAll')}
            </button>
            <button
              onClick={handleNecessaryOnly}
              className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              {t('cookies.necessaryOnly')}
            </button>
            <button
              onClick={handleCustomSettings}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {t('cookies.customize')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
```

## 状态管理设计

### Zustand Store结构
```typescript
// stores/homepageStore.ts
interface HomepageState {
  // 数据状态
  modules: Module[];
  hotTests: Test[];
  blogArticles: BlogArticle[];
  searchResults: SearchResult[];
  
  // UI状态
  isLoading: boolean;
  language: string;
  showCookieBanner: boolean;
  cookiePreferences: CookiePreferences;
  
  // 用户行为
  sessionId: string;
  searchHistory: string[];
}

interface HomepageActions {
  // 数据操作
  loadHomepageData: (language: string) => Promise<void>;
  searchContent: (query: string) => Promise<void>;
  
  // 用户行为
  trackEvent: (eventType: string, eventData: any) => void;
  updateLanguage: (language: string) => void;
  
  // Cookies管理
  updateCookiePreferences: (preferences: CookiePreferences) => void;
  hideCookieBanner: () => void;
}

export const useHomepageStore = create<HomepageState & HomepageActions>((set, get) => ({
  // 初始状态
  modules: [],
  hotTests: [],
  blogArticles: [],
  searchResults: [],
  isLoading: false,
  language: 'zh',
  showCookieBanner: false,
  cookiePreferences: {
    necessary: true,
    functional: false,
    analytics: false,
    marketing: false
  },
  sessionId: generateSessionId(),
  searchHistory: [],

  // 操作方法
  loadHomepageData: async (language: string) => {
    set({ isLoading: true });
    try {
      const response = await fetch(`/api/homepage/config?lang=${language}`);
      const data = await response.json();
      
      if (data.success) {
        set({
          modules: data.data.modules,
          hotTests: data.data.hotTests,
          blogArticles: data.data.blogArticles,
          isLoading: false
        });
      }
    } catch (error) {
      console.error('Failed to load homepage data:', error);
      set({ isLoading: false });
    }
  },

  searchContent: async (query: string) => {
    const { language, sessionId } = get();
    try {
      const response = await fetch(`/api/homepage/search?q=${encodeURIComponent(query)}&lang=${language}`);
      const data = await response.json();
      
      if (data.success) {
        set({ searchResults: [...data.data.modules, ...data.data.blogs] });
        
        // 记录搜索行为
        get().trackEvent('search', { query, resultsCount: data.data.modules.length + data.data.blogs.length });
      }
    } catch (error) {
      console.error('Search failed:', error);
    }
  },

  trackEvent: async (eventType: string, eventData: any) => {
    const { sessionId, cookiePreferences } = get();
    
    // 只有在用户同意分析cookies时才记录
    if (!cookiePreferences.analytics) return;
    
    try {
      await fetch('/api/homepage/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          eventType,
          eventData
        })
      });
    } catch (error) {
      console.error('Failed to track event:', error);
    }
  },

  updateLanguage: (language: string) => {
    set({ language });
    get().loadHomepageData(language);
    get().trackEvent('language_switch', { language });
  },

  updateCookiePreferences: async (preferences: CookiePreferences) => {
    const { sessionId } = get();
    set({ cookiePreferences: preferences });
    
    try {
      await fetch('/api/homepage/cookies/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          cookiesConsent: preferences
        })
      });
    } catch (error) {
      console.error('Failed to update cookie preferences:', error);
    }
  },

  hideCookieBanner: () => {
    set({ showCookieBanner: false });
  }
}));
```

## 搜索算法设计

### 简化搜索实现
```typescript
class HomepageSearchEngine {
  constructor(private db: D1Database, private kv: KVNamespace) {}

  async search(query: string, language: string, limit: number = 10): Promise<SearchResult[]> {
    const cacheKey = `search:${language}:${query}:${limit}`;
    
    // 1. 尝试从缓存获取
    const cached = await this.kv.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    // 2. 执行搜索
    const results = await this.performSearch(query, language, limit);
    
    // 3. 缓存结果
    await this.kv.put(cacheKey, JSON.stringify(results), {
      expirationTtl: 3600 // 1小时
    });

    return results;
  }

  private async performSearch(query: string, language: string, limit: number): Promise<SearchResult[]> {
    const keywords = this.tokenizeQuery(query);
    const titleField = language === 'zh' ? 'title_zh' : 'title_en';
    const keywordsField = language === 'zh' ? 'keywords_zh' : 'keywords_en';
    
    // 构建搜索SQL
    const searchConditions = keywords.map(() => 
      `(${titleField} LIKE ? OR ${keywordsField} LIKE ?)`
    ).join(' OR ');
    
    const searchParams = keywords.flatMap(keyword => [
      `%${keyword}%`,
      `%${keyword}%`
    ]);

    const results = await this.db
      .prepare(`
        SELECT content_type, content_id, ${titleField} as title, popularity_score,
               (CASE 
                 WHEN ${titleField} LIKE ? THEN 10
                 WHEN ${keywordsField} LIKE ? THEN 5
                 ELSE 1
               END) as relevance_score
        FROM search_index 
        WHERE ${searchConditions}
        ORDER BY relevance_score DESC, popularity_score DESC
        LIMIT ?
      `)
      .bind(
        `%${query}%`, // 完整匹配标题
        `%${query}%`, // 完整匹配关键词
        ...searchParams,
        limit
      )
      .all();

    return results.results?.map(row => ({
      id: row.content_id as string,
      type: row.content_type as string,
      title: row.title as string,
      relevanceScore: row.relevance_score as number
    })) || [];
  }

  private tokenizeQuery(query: string): string[] {
    return query
      .toLowerCase()
      .split(/\s+/)
      .filter(word => word.length > 1);
  }

  async getSuggestions(query: string, language: string): Promise<string[]> {
    const titleField = language === 'zh' ? 'title_zh' : 'title_en';
    
    const results = await this.db
      .prepare(`
        SELECT DISTINCT ${titleField} as title
        FROM search_index 
        WHERE ${titleField} LIKE ?
        ORDER BY popularity_score DESC
        LIMIT 5
      `)
      .bind(`%${query}%`)
      .all();

    return results.results?.map(row => row.title as string) || [];
  }
}
```

## 性能优化策略

### 缓存策略
```typescript
class HomepageCacheManager {
  constructor(private kv: KVNamespace) {}

  // 首页配置缓存
  async cacheHomepageConfig(language: string, data: any) {
    const key = `homepage:config:${language}`;
    await this.kv.put(key, JSON.stringify(data), {
      expirationTtl: 1800 // 30分钟
    });
  }

  // 热门测试缓存
  async cacheHotTests(language: string, tests: any[]) {
    const key = `homepage:hot_tests:${language}`;
    await this.kv.put(key, JSON.stringify(tests), {
      expirationTtl: 3600 // 1小时
    });
  }

  // 搜索结果缓存
  async cacheSearchResults(query: string, language: string, results: any[]) {
    const key = `search:${language}:${this.hashQuery(query)}`;
    await this.kv.put(key, JSON.stringify(results), {
      expirationTtl: 3600 // 1小时
    });
  }

  private hashQuery(query: string): string {
    // 简单哈希函数
    return btoa(query).replace(/[^a-zA-Z0-9]/g, '').substring(0, 16);
  }
}
```

### 前端性能优化
```typescript
// 组件懒加载
const ModulesGrid = lazy(() => import('./components/ModulesGrid'));
const SearchSection = lazy(() => import('./components/SearchSection'));

// 图片懒加载
const LazyImage: React.FC<{ src: string; alt: string }> = ({ src, alt }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={imgRef} className="relative">
      {!isLoaded && <div className="animate-pulse bg-gray-200 w-full h-full" />}
      {isInView && (
        <img
          src={src}
          alt={alt}
          onLoad={() => setIsLoaded(true)}
          className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        />
      )}
    </div>
  );
};
```



## 错误处理

### 前端错误边界
```typescript

// components/ErrorBoundary.tsx
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class HomepageErrorBoundary extends Component<
  { children: ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Homepage error:', error, errorInfo);
    
    // 发送错误报告
    fetch('/api/homepage/error', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
        error: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString()
      })
    }).catch(console.error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              页面加载出现问题
            </h2>
            <p className="text-gray-600 mb-6">
              我们正在修复这个问题，请稍后刷新页面重试
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              刷新页面
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
```

### 后端错误处理
```typescript
// utils/errorHandler.ts
export class HomepageError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message);
    this.name = 'HomepageError';
  }
}

export const handleHomepageError = (error: Error, c: Context) => {
  console.error('Homepage error:', error);

  if (error instanceof HomepageError) {
    return c.json({
      success: false,
      error: error.message,
      code: error.code
    }, error.statusCode);
  }

  // 数据库错误
  if (error.message.includes('D1_ERROR')) {
    return c.json({
      success: false,
      error: '数据加载失败，请稍后重试'
    }, 500);
  }

  // 搜索错误
  if (error.message.includes('SEARCH_ERROR')) {
    return c.json({
      success: false,
      error: '搜索服务暂时不可用'
    }, 503);
  }

  return c.json({
    success: false,
    error: '系统暂时不可用，请稍后重试'
  }, 500);
};
```

## Cookies管理详细实现

### Cookies分类管理
```typescript
// utils/cookieManager.ts
export enum CookieCategory {
  NECESSARY = 'necessary',
  FUNCTIONAL = 'functional',
  ANALYTICS = 'analytics',
  MARKETING = 'marketing'
}

export interface CookieDefinition {
  name: string;
  category: CookieCategory;
  description: string;
  duration: string;
  purpose: string;
}

export const COOKIE_DEFINITIONS: CookieDefinition[] = [
  {
    name: 'session_id',
    category: CookieCategory.NECESSARY,
    description: '用户会话标识',
    duration: '会话期间',
    purpose: '维持用户会话状态，确保网站正常功能'
  },
  {
    name: 'language_preference',
    category: CookieCategory.FUNCTIONAL,
    description: '语言偏好设置',
    duration: '1年',
    purpose: '记住用户的语言选择'
  },
  {
    name: 'analytics_consent',
    category: CookieCategory.ANALYTICS,
    description: '分析数据收集同意',
    duration: '1年',
    purpose: '用于网站使用情况分析和改进'
  },
  {
    name: 'search_history',
    category: CookieCategory.FUNCTIONAL,
    description: '搜索历史记录',
    duration: '30天',
    purpose: '提供搜索建议和个性化推荐'
  }
];

export class CookieManager {
  private preferences: CookiePreferences;

  constructor() {
    this.preferences = this.loadPreferences();
  }

  private loadPreferences(): CookiePreferences {
    const saved = localStorage.getItem('cookie_preferences');
    if (saved) {
      return JSON.parse(saved);
    }
    
    return {
      necessary: true,
      functional: false,
      analytics: false,
      marketing: false
    };
  }

  updatePreferences(preferences: CookiePreferences) {
    this.preferences = preferences;
    localStorage.setItem('cookie_preferences', JSON.stringify(preferences));
    
    // 清除不被允许的cookies
    this.cleanupCookies();
  }

  private cleanupCookies() {
    COOKIE_DEFINITIONS.forEach(cookie => {
      if (!this.isCategoryAllowed(cookie.category)) {
        this.deleteCookie(cookie.name);
      }
    });
  }

  private isCategoryAllowed(category: CookieCategory): boolean {
    return this.preferences[category] === true;
  }

  private deleteCookie(name: string) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }

  canSetCookie(category: CookieCategory): boolean {
    return this.isCategoryAllowed(category);
  }

  setCookie(name: string, value: string, category: CookieCategory, days: number = 30) {
    if (!this.canSetCookie(category)) {
      return false;
    }

    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    
    document.cookie = `${name}=${value}; expires=${expires.toUTCString()}; path=/; SameSite=Strict`;
    return true;
  }

  getCookie(name: string): string | null {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    
    return null;
  }
}
```

### Cookies设置弹窗
```typescript
// components/CookieSettingsModal.tsx
interface CookieSettingsModalProps {
  onClose: () => void;
}

export const CookieSettingsModal: React.FC<CookieSettingsModalProps> = ({ onClose }) => {
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    functional: false,
    analytics: false,
    marketing: false
  });
  
  const { updateCookiePreferences } = useCookieManager();
  const { t } = useTranslation();

  const handleSave = () => {
    updateCookiePreferences(preferences);
    onClose();
  };

  const handleToggle = (category: keyof CookiePreferences) => {
    if (category === 'necessary') return; // 必要cookies不能关闭
    
    setPreferences(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {t('cookies.settings.title')}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-6">
            {COOKIE_DEFINITIONS.reduce((acc, cookie) => {
              const category = cookie.category;
              if (!acc.find(item => item.category === category)) {
                acc.push({
                  category,
                  name: t(`cookies.categories.${category}.name`),
                  description: t(`cookies.categories.${category}.description`),
                  cookies: COOKIE_DEFINITIONS.filter(c => c.category === category)
                });
              }
              return acc;
            }, [] as any[]).map((categoryGroup) => (
              <div key={categoryGroup.category} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {categoryGroup.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {categoryGroup.description}
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences[categoryGroup.category as keyof CookiePreferences]}
                      onChange={() => handleToggle(categoryGroup.category as keyof CookiePreferences)}
                      disabled={categoryGroup.category === 'necessary'}
                      className="sr-only"
                    />
                    <div className={`w-11 h-6 rounded-full transition-colors ${
                      preferences[categoryGroup.category as keyof CookiePreferences]
                        ? 'bg-blue-600' 
                        : 'bg-gray-300'
                    } ${categoryGroup.category === 'necessary' ? 'opacity-50' : ''}`}>
                      <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
                        preferences[categoryGroup.category as keyof CookiePreferences]
                          ? 'translate-x-5' 
                          : 'translate-x-0'
                      }`} />
                    </div>
                  </label>
                </div>
                
                <div className="space-y-2">
                  {categoryGroup.cookies.map((cookie: CookieDefinition) => (
                    <div key={cookie.name} className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                      <div className="font-medium">{cookie.name}</div>
                      <div>{cookie.description}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        持续时间: {cookie.duration} | 用途: {cookie.purpose}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-3 mt-8">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {t('common.cancel')}
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {t('cookies.settings.save')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
SEO优化实现
元数据管理
// utils/seoManager.ts
interface SEOMetadata {
  title: string;
  description: string;
  keywords: string[];
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  canonicalUrl?: string;
}

export class SEOManager {
  static updateMetadata(metadata: SEOMetadata, language: string) {
    // 更新页面标题
    document.title = metadata.title;

    // 更新meta标签
    this.updateMetaTag('description', metadata.description);
    this.updateMetaTag('keywords', metadata.keywords.join(', '));
    
    // 更新Open Graph标签
    this.updateMetaTag('og:title', metadata.ogTitle || metadata.title, 'property');
    this.updateMetaTag('og:description', metadata.ogDescription || metadata.description, 'property');
    this.updateMetaTag('og:type', 'website', 'property');
    this.updateMetaTag('og:locale', language === 'zh' ? 'zh_CN' : 'en_US', 'property');
    
    if (metadata.ogImage) {
      this.updateMetaTag('og:image', metadata.ogImage, 'property');
    }

    // 更新canonical链接
    if (metadata.canonicalUrl) {
      this.updateLinkTag('canonical', metadata.canonicalUrl);
    }

    // 更新语言标签
    this.updateMetaTag('language', language);
    document.documentElement.lang = language;
  }

  private static updateMetaTag(name: string, content: string, attribute: string = 'name') {
    let meta = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement;
    
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute(attribute, name);
      document.head.appendChild(meta);
    }
    
    meta.content = content;
  }

  private static updateLinkTag(rel: string, href: string) {
    let link = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;
    
    if (!link) {
      link = document.createElement('link');
      link.rel = rel;
      document.head.appendChild(link);
    }
    
    link.href = href;
  }

  static getHomepageMetadata(language: string): SEOMetadata {
    if (language === 'zh') {
      return {
        title: '免费心理测试_性格分析_MBTI测试_星座运势_塔罗占卜 - 专业测试平台',
        description: '提供专业的心理测试、性格分析、MBTI测试、星座运势查询、塔罗牌占卜等服务。基于科学理论，AI智能分析，无需注册即可获得详细报告。',
        keywords: [
          '心理测试', '性格测试', 'MBTI', '星座运势', '塔罗占卜',
          '抑郁症测试', '职业测试', '情商测试', '免费测试', '性格分析'
        ],
        ogTitle: '发现真实的自己，遇见更好的未来 - 专业心理测试平台',
        ogDescription: '3分钟get你的性格密码！科学靠谱、准到心坎、绝对保密、秒出结果。',
        canonicalUrl: 'https://yourdomain.com/'
      };
    } else {
      return {
        title: 'Free Personality Test | MBTI Assessment | Horoscope | Tarot Reading - Professional Psychology Platform',
        description: 'Take professional personality tests, MBTI assessments, get daily horoscope readings, and tarot card insights. AI-powered analysis with instant results. No registration required.',
        keywords: [
          'personality test', 'MBTI', 'psychology test', 'horoscope', 'tarot reading',
          'depression screening', 'career test', 'emotional intelligence', 'free test'
        ],
        ogTitle: 'Discover Your True Self, Meet a Better Future - Professional Psychology Platform',
        ogDescription: 'Get your personality code in 3 minutes! Scientific, accurate, private, instant results.',
        canonicalUrl: 'https://yourdomain.com/en'
      };
    }
  }
}
```

### 结构化数据
```typescript
// utils/structuredData.ts
export class StructuredDataManager {
  static addWebsiteSchema(language: string) {
    const schema = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": language === 'zh' ? "专业心理测试平台" : "Professional Psychology Platform",
      "description": language === 'zh' 
        ? "提供专业的心理测试、性格分析、MBTI测试、星座运势查询、塔罗牌占卜等服务"
        : "Professional personality tests, MBTI assessments, horoscope readings, and tarot card insights",
      "url": "https://yourdomain.com",
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://yourdomain.com/search?q={search_term_string}"
        },
        "query-input": "required name=search_term_string"
      },
      "inLanguage": language === 'zh' ? "zh-CN" : "en-US"
    };

    this.addJsonLd(schema);
  }

  static addOrganizationSchema(language: string) {
    const schema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": language === 'zh' ? "专业心理测试平台" : "Professional Psychology Platform",
      "description": language === 'zh'
        ? "基于科学理论的专业心理测试和性格分析服务平台"
        : "Professional psychology testing and personality analysis platform based on scientific theories",
      "url": "https://yourdomain.com",
      "logo": "https://yourdomain.com/logo.png",
      "sameAs": [
        // 社交媒体链接
      ]
    };

    this.addJsonLd(schema);
  }

  private static addJsonLd(schema: object) {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
  }
}
```

## 部署和监控

### 部署配置
```toml
# wrangler.toml for homepage module
name = "homepage-module"
main = "src/index.ts"
compatibility_date = "2024-01-01"

[env.production]
vars = { ENVIRONMENT = "production" }

[[env.production.d1_databases]]
binding = "DB"
database_name = "homepage-prod"
database_id = "your-database-id"

[[env.production.kv_namespaces]]
binding = "KV"
id = "your-kv-namespace-id"
```

### 监控和分析
```typescript
// utils/monitoring.ts
export class HomepageMonitoring {
  static async trackPerformance(metricName: string, value: number, tags?: Record<string, string>) {
    try {
      await fetch('/api/homepage/metrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          metric: metricName,
          value,
          tags,
          timestamp: Date.now()
        })
      });
    } catch (error) {
      console.error('Failed to track performance:', error);
    }
  }

  static trackPageLoad() {
    const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
    this.trackPerformance('page_load_time', loadTime, { page: 'homepage' });
  }

  static trackSearchPerformance(query: string, resultCount: number, responseTime: number) {
    this.trackPerformance('search_response_time', responseTime, {
      query_length: query.length.toString(),
      result_count: resultCount.toString()
    });
  }

  static trackModuleClick(moduleId: string, position: number) {
    this.trackPerformance('module_click_rate', 1, {
      module_id: moduleId,
      position: position.toString()
    });
  }
}
```

## 总结

这个设计文档涵盖了首页模块的完整技术实现方案，包括：

- **架构设计**: 基于Cloudflare全栈方案的系统架构
- **数据库设计**: 完整的数据表结构和索引设计
- **API接口**: RESTful API设计和数据格式规范
- **前端组件**: React组件架构和状态管理
- **搜索算法**: 基于D1数据库的搜索引擎实现
- **Cookies管理**: GDPR合规的完整实现方案
- **性能优化**: 缓存策略和前端优化方案

- **错误处理**: 前后端错误处理机制
- **SEO优化**: 元数据管理和结构化数据
- **部署监控**: 生产环境配置和性能监控

设计遵循了综合测试平台的整体架构规范，确保了技术方案的可行性、一致性和可维护性。
