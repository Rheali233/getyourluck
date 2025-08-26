# 综合测试平台设计文档

## 1. 概述

本设计文档基于需求文档，定义了一个综合性在线测试平台的完整技术架构和实现方案。系统采用前后端分离的架构，支持用户端网站和管理端网站两个独立应用，提供多种测试功能、博客内容和数据统计分析。

**重要说明：** 本设计文档遵循
[统一开发标准](./development-guide.md)，所有模块必须严格按照统一的架构模式、接口定义、状态管理、错误处理和数据库设计规范进行实现。

## 2. 架构设计

### 2.1 系统整体架构

```
┌─────────────────────────────────────────────────────────────────┐
│                        用户端网站 (Frontend)                      │
├─────────────────────────────────────────────────────────────────┤
│  首页  │  测试模块集合  │  博客展示  │  结果页面  │  反馈系统      │
│        │  ├─塔罗占卜    │           │           │               │
│        │  ├─命理分析    │           │           │               │
│        │  ├─星座系统    │           │           │               │
│        │  ├─心理测试    │           │           │               │
│        │  ├─职业发展    │           │           │               │
│        │  ├─学习能力    │           │           │               │
│        │  └─情感关系    │           │           │               │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ API调用
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      后端API服务 (Backend API)                   │
├─────────────────────────────────────────────────────────────────┤
│  测试引擎  │  内容管理  │  数据统计  │  用户反馈  │  博客API      │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ 数据访问
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        数据存储层 (Database)                     │
├─────────────────────────────────────────────────────────────────┤
│  测试题库  │  博客内容  │  统计数据  │  反馈数据  │  系统配置      │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ 管理接口
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        管理端网站 (Admin)                        │
├─────────────────────────────────────────────────────────────────┤
│  数据统计  │  内容管理  │  博客管理  │  反馈管理  │  系统监控      │
└─────────────────────────────────────────────────────────────────┘
```

## 3. 技术栈选择

### 3.1 第一阶段：Cloudflare全栈方案

#### 用户端网站（前端）

```javascript
const phase1UserFrontend = {
  // 核心框架
  framework: "React.js 18+",
  reason: "组件化开发，适合复杂的测试界面交互",

  // 样式方案
  styling: "Tailwind CSS",
  reason: "与原型保持一致，快速响应式开发",

  // 状态管理
  stateManagement: "Zustand",
  reason: "轻量级，适合Cloudflare Workers环境",

  // 构建工具
  buildTool: "Vite",
  reason: "快速构建，与Cloudflare Pages完美集成",

  // 部署平台
  deployment: "Cloudflare Pages",
  reason: "全球CDN，自动部署，成本极低",
};
```

#### 后端API服务

```javascript
const phase1Backend = {
  // 运行环境
  runtime: "Cloudflare Workers",
  reason: "边缘计算，全球低延迟，无服务器管理",

  // 开发框架
  framework: "Hono.js",
  reason: "专为Workers优化的轻量级框架",

  // 数据库
  database: "Cloudflare D1 (SQLite)",
  reason: "边缘数据库，与Workers完美集成",

  // 缓存存储
  cache: "Cloudflare KV",
  reason: "全球分布式键值存储，适合缓存测试结果",

  // 文件存储
  fileStorage: "Cloudflare R2",
  reason: "对象存储，用于博客图片等静态资源",

  // 身份验证
  authentication: "JWT + Cloudflare Access",
  reason: "无状态认证，适合边缘计算环境",
};
```

#### 管理端网站

```javascript
const phase1Admin = {
  // 框架选择
  framework: "React.js + Ant Design",
  reason: "快速构建管理界面",

  // 部署
  deployment: "Cloudflare Pages (独立项目)",
  reason: "与用户端分离部署，便于权限控制",

  // 权限控制
  access: "Cloudflare Access",
  reason: "企业级访问控制，无需自建认证系统",
};
```

### 3.2 数据隐私和合规架构设计

#### GDPR合规实现

```typescript
// 数据隐私合规架构
interface PrivacyComplianceArchitecture {
  // 数据分类和处理
  dataClassification: {
    personalData: "个人身份信息（严格保护）";
    behavioralData: "匿名行为数据（统计用途）";
    technicalData: "技术日志数据（运维用途）";
  };

  // 用户权利实现
  userRights: {
    dataAccess: "API接口提供数据查看";
    dataPortability: "数据导出功能";
    dataErasure: "数据删除和匿名化";
    consentManagement: "Cookie同意管理系统";
  };

  // 数据保护措施
  dataProtection: {
    encryption: "AES-256数据加密";
    pseudonymization: "数据假名化处理";
    accessControl: "基于角色的访问控制";
    auditLogging: "完整的审计日志";
  };
}
```

#### 数据加密和安全传输

```typescript
// 数据安全架构
class DataSecurityManager {
  // 敏感数据加密
  async encryptSensitiveData(data: any): Promise<string> {
    // 使用Web Crypto API进行AES-GCM加密
    const key = await crypto.subtle.generateKey(
      { name: "AES-GCM", length: 256 },
      false,
      ["encrypt", "decrypt"],
    );

    const encrypted = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv: crypto.getRandomValues(new Uint8Array(12)) },
      key,
      new TextEncoder().encode(JSON.stringify(data)),
    );

    return btoa(String.fromCharCode(...new Uint8Array(encrypted)));
  }

  // 数据匿名化处理
  anonymizeUserData(userData: any): any {
    return {
      ...userData,
      userId: this.hashUserId(userData.userId),
      ipAddress: this.hashIP(userData.ipAddress),
      timestamp: userData.timestamp,
      // 移除所有可识别信息
      personalInfo: undefined,
    };
  }
}
```

### 3.3 可访问性架构设计

#### WCAG 2.1 AA合规实现

```typescript
// 可访问性架构
interface AccessibilityArchitecture {
  // 键盘导航支持
  keyboardNavigation: {
    focusManagement: "Tab顺序和焦点指示器";
    skipLinks: "跳转链接和快捷键";
    keyboardShortcuts: "自定义键盘快捷键";
  };

  // 屏幕阅读器支持
  screenReaderSupport: {
    semanticHTML: "语义化HTML标记";
    ariaLabels: "ARIA标签和描述";
    liveRegions: "动态内容通知";
  };

  // 视觉辅助
  visualAccessibility: {
    colorContrast: "4.5:1对比度标准";
    textScaling: "200%文字缩放支持";
    colorIndependence: "不依赖颜色的信息传达";
  };
}
```

#### 无障碍组件设计

```typescript
// 无障碍测试组件
const AccessibleTestComponent: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [announcement, setAnnouncement] = useState("");

  // 屏幕阅读器通知
  const announceToScreenReader = (message: string) => {
    setAnnouncement(message);
    setTimeout(() => setAnnouncement(""), 1000);
  };

  return (
    <div role="main" aria-labelledby="test-title">
      <h1 id="test-title">心理测试</h1>

      {/* 屏幕阅读器实时通知区域 */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {announcement}
      </div>

      {/* 进度指示器 */}
      <div
        role="progressbar"
        aria-valuenow={currentQuestion + 1}
        aria-valuemax={totalQuestions}
        aria-label={`问题 ${currentQuestion + 1} / ${totalQuestions}`}
      >
        <div
          className="progress-bar"
          style={{ width: `${(currentQuestion + 1) / totalQuestions * 100}%` }}
        />
      </div>

      {/* 测试题目 */}
      <fieldset>
        <legend>第 {currentQuestion + 1} 题</legend>
        {/* 选项使用radio button确保键盘可访问 */}
      </fieldset>
    </div>
  );
};
```

### 3.4 移动端优化架构

#### 移动优先响应式设计

```typescript
// 移动端优化架构
interface MobileOptimizationArchitecture {
  // 响应式断点
  breakpoints: {
    mobile: "320px - 768px";
    tablet: "768px - 1024px";
    desktop: "1024px+";
  };

  // 触摸交互优化
  touchOptimization: {
    minTouchTarget: "44px × 44px";
    gestureSupport: "滑动、捏合、长按";
    touchFeedback: "触觉反馈和视觉反馈";
  };

  // 性能优化
  performanceOptimization: {
    lazyLoading: "图片和组件懒加载";
    codesplitting: "按路由分割代码";
    serviceWorker: "离线缓存支持";
  };
}
移动端特定功能;
// 移动端测试体验优化
class MobileTestExperience {
  // 触摸手势支持
  setupGestureHandlers() {
    // 滑动切换题目
    const hammer = new Hammer(document.getElementById("test-container"));
    hammer.get("swipe").set({ direction: Hammer.DIRECTION_HORIZONTAL });

    hammer.on("swipeleft", () => this.nextQuestion());
    hammer.on("swiperight", () => this.previousQuestion());
  }

  // 移动端状态保存
  saveMobileState() {
    const state = {
      currentQuestion: this.currentQuestion,
      answers: this.answers,
      startTime: this.startTime,
      timestamp: Date.now(),
    };

    localStorage.setItem("mobile_test_state", JSON.stringify(state));
  }

  // 网络状态检测
  handleNetworkChange() {
    window.addEventListener("online", () => {
      this.syncOfflineData();
    });

    window.addEventListener("offline", () => {
      this.enableOfflineMode();
    });
  }
}
```

#### 移动端特定功能

```typescript
// 移动端测试体验优化
class MobileTestExperience {
  // 触摸手势支持
  setupGestureHandlers() {
    // 滑动切换题目
    const hammer = new Hammer(document.getElementById("test-container"));
    hammer.get("swipe").set({ direction: Hammer.DIRECTION_HORIZONTAL });

    hammer.on("swipeleft", () => this.nextQuestion());
    hammer.on("swiperight", () => this.previousQuestion());
  }

  // 移动端状态保存
  saveMobileState() {
    const state = {
      currentQuestion: this.currentQuestion,
      answers: this.answers,
      startTime: this.startTime,
      timestamp: Date.now(),
    };

    localStorage.setItem("mobile_test_state", JSON.stringify(state));
  }

  // 网络状态检测
  handleNetworkChange() {
    window.addEventListener("online", () => {
      this.syncOfflineData();
    });

    window.addEventListener("offline", () => {
      this.enableOfflineMode();
    });
  }
}
```

### 3.5 内容管理和质量控制架构

#### 内容版本管理系统

```typescript
// 内容管理架构
interface ContentManagementArchitecture {
  // 版本控制
  versionControl: {
    contentVersioning: "Git-like内容版本管理";
    approvalWorkflow: "内容审核和发布流程";
    rollbackSupport: "版本回滚和恢复";
  };



  // 质量控制
  qualityControl: {
    contentValidation: "内容格式和质量验证";
    abTesting: "A/B测试框架";
    performanceMonitoring: "内容性能监控";
  };
}
内容质量评估系统;
// 内容质量评估
class ContentQualityAssessment {
  // 科学性验证
  validateScientificAccuracy(content: any): QualityScore {
    return {
      accuracy: this.checkFactualAccuracy(content),
      citations: this.validateCitations(content),
      methodology: this.assessMethodology(content),
      bias: this.detectBias(content),
    };
  }

  // 可读性分析
  analyzeReadability(text: string): ReadabilityMetrics {
    return {
      fleschScore: this.calculateFleschScore(text),
      averageSentenceLength: this.getAverageSentenceLength(text),
      complexWords: this.countComplexWords(text),
      readingLevel: this.determineReadingLevel(text),
    };
  }


}
```

#### 内容质量评估系统

```typescript
// 内容质量评估
class ContentQualityAssessment {
  // 科学性验证
  validateScientificAccuracy(content: any): QualityScore {
    return {
      accuracy: this.checkFactualAccuracy(content),
      citations: this.validateCitations(content),
      methodology: this.assessMethodology(content),
      bias: this.detectBias(content),
    };
  }

  // 可读性分析
  analyzeReadability(text: string): ReadabilityMetrics {
    return {
      fleschScore: this.calculateFleschScore(text),
      averageSentenceLength: this.getAverageSentenceLength(text),
      complexWords: this.countComplexWords(text),
      readingLevel: this.determineReadingLevel(text),
    };
  }


}
```

### 3.6 灾难恢复和业务连续性架构

#### 备份和恢复策略

```typescript
// 灾难恢复架构
interface DisasterRecoveryArchitecture {
  // 数据备份策略
  backupStrategy: {
    frequency: "每日自动备份";
    retention: "30天本地 + 1年异地";
    verification: "备份完整性验证";
    encryption: "备份数据加密";
  };

  // 故障切换
  failoverStrategy: {
    healthChecks: "服务健康检查";
    automaticFailover: "自动故障切换";
    loadBalancing: "负载均衡和流量分发";
    gracefulDegradation: "优雅降级服务";
  };

  // 恢复目标
  recoveryObjectives: {
    rto: "恢复时间目标 < 4小时";
    rpo: "数据丢失目标 < 1小时";
    mttr: "平均修复时间 < 2小时";
  };
}
服务降级策略;
// 服务降级管理
class ServiceDegradationManager {
  // 服务健康检查
  async performHealthCheck(): Promise<ServiceHealth> {
    const checks = await Promise.allSettled([
      this.checkDatabaseHealth(),
      this.checkAIServiceHealth(),
      this.checkCacheHealth(),
      this.checkStorageHealth(),
    ]);

    return this.aggregateHealthStatus(checks);
  }

  // 降级服务实现
  async enableDegradedMode(failedServices: string[]) {
    if (failedServices.includes("ai-service")) {
      // AI服务故障时使用预设结果模板
      this.enableStaticResultMode();
    }

    if (failedServices.includes("database")) {
      // 数据库故障时使用缓存数据
      this.enableCacheOnlyMode();
    }

    // 通知用户当前服务状态
    this.notifyServiceStatus();
  }

  // 自动恢复检测
  async monitorServiceRecovery() {
    setInterval(async () => {
      const health = await this.performHealthCheck();
      if (health.allServicesHealthy) {
        await this.restoreFullService();
      }
    }, 60000); // 每分钟检查一次
  }
}
```

#### 服务降级策略

```typescript
// 服务降级管理
class ServiceDegradationManager {
  // 服务健康检查
  async performHealthCheck(): Promise<ServiceHealth> {
    const checks = await Promise.allSettled([
      this.checkDatabaseHealth(),
      this.checkAIServiceHealth(),
      this.checkCacheHealth(),
      this.checkStorageHealth(),
    ]);

    return this.aggregateHealthStatus(checks);
  }

  // 降级服务实现
  async enableDegradedMode(failedServices: string[]) {
    if (failedServices.includes("ai-service")) {
      // AI服务故障时使用预设结果模板
      this.enableStaticResultMode();
    }

    if (failedServices.includes("database")) {
      // 数据库故障时使用缓存数据
      this.enableCacheOnlyMode();
    }

    // 通知用户当前服务状态
    this.notifyServiceStatus();
  }

  // 自动恢复检测
  async monitorServiceRecovery() {
    setInterval(async () => {
      const health = await this.performHealthCheck();
      if (health.allServicesHealthy) {
        await this.restoreFullService();
      }
    }, 60000); // 每分钟检查一次
  }
}
```

## 4. 数据库设计扩展

### 4.1 隐私合规数据表

```sql
-- 用户数据处理记录表（GDPR合规）
CREATE TABLE IF NOT EXISTS data_processing_records (
  id TEXT PRIMARY KEY,
  session_id TEXT NOT NULL,
  processing_purpose TEXT NOT NULL, -- 'analytics', 'testing', 'improvement'
  data_categories TEXT NOT NULL, -- JSON数组：['behavioral', 'technical']
  legal_basis TEXT NOT NULL, -- 'consent', 'legitimate_interest'
  consent_timestamp DATETIME,
  retention_period INTEGER, -- 保留天数
  anonymization_date DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 用户权利请求表
CREATE TABLE IF NOT EXISTS user_rights_requests (
  id TEXT PRIMARY KEY,
  session_id TEXT NOT NULL,
  request_type TEXT NOT NULL, -- 'access', 'portability', 'erasure', 'rectification'
  request_details TEXT, -- JSON存储请求详情
  status TEXT DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'rejected'
  response_data TEXT, -- 响应数据
  completed_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 数据泄露事件记录表
CREATE TABLE IF NOT EXISTS data_breach_incidents (
  id TEXT PRIMARY KEY,
  incident_type TEXT NOT NULL,
  affected_data_types TEXT NOT NULL, -- JSON数组
  affected_records_count INTEGER,
  discovery_date DATETIME NOT NULL,
  notification_date DATETIME,
  resolution_date DATETIME,
  impact_assessment TEXT,
  mitigation_measures TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### 4.2 内容管理数据表

```sql
-- 内容版本管理表
CREATE TABLE IF NOT EXISTS content_versions (
  id TEXT PRIMARY KEY,
  content_type TEXT NOT NULL, -- 'test', 'blog', 'result_template'
  content_id TEXT NOT NULL,
  version_number INTEGER NOT NULL,
  content_data TEXT NOT NULL, -- JSON存储内容
  change_summary TEXT,
  author_id TEXT,
  status TEXT DEFAULT 'draft', -- 'draft', 'review', 'approved', 'published'
  approved_by TEXT,
  approved_at DATETIME,
  published_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 内容质量评估表
CREATE TABLE IF NOT EXISTS content_quality_assessments (
  id TEXT PRIMARY KEY,
  content_version_id TEXT NOT NULL,
  assessment_type TEXT NOT NULL, -- 'scientific', 'readability', 'consistency'
  quality_score REAL,
  assessment_details TEXT, -- JSON存储详细评估结果
  assessor_type TEXT, -- 'automated', 'human', 'peer_review'
  assessor_id TEXT,
  recommendations TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (content_version_id) REFERENCES content_versions(id)
);

-- A/B测试配置表
CREATE TABLE IF NOT EXISTS ab_test_configs (
  id TEXT PRIMARY KEY,
  test_name TEXT NOT NULL,
  content_type TEXT NOT NULL,
  variant_a_id TEXT NOT NULL, -- 内容版本ID
  variant_b_id TEXT NOT NULL, -- 内容版本ID
  traffic_split REAL DEFAULT 0.5, -- 流量分配比例
  success_metrics TEXT, -- JSON数组：成功指标
  start_date DATETIME,
  end_date DATETIME,
  status TEXT DEFAULT 'draft', -- 'draft', 'running', 'completed', 'paused'
  results TEXT, -- JSON存储测试结果
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### 4.3 系统监控数据表

```sql
-- 系统健康检查记录表
CREATE TABLE IF NOT EXISTS system_health_checks (
  id TEXT PRIMARY KEY,
  check_timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  service_name TEXT NOT NULL, -- 'database', 'ai_service', 'cache', 'storage'
  status TEXT NOT NULL, -- 'healthy', 'degraded', 'unhealthy'
  response_time INTEGER, -- 毫秒
  error_message TEXT,
  metrics TEXT, -- JSON存储详细指标
  alert_sent BOOLEAN DEFAULT 0
);

-- 服务降级记录表
CREATE TABLE IF NOT EXISTS service_degradation_logs (
  id TEXT PRIMARY KEY,
  degradation_start DATETIME DEFAULT CURRENT_TIMESTAMP,
  degradation_end DATETIME,
  affected_services TEXT NOT NULL, -- JSON数组
  degradation_level TEXT NOT NULL, -- 'partial', 'major', 'complete'
  trigger_reason TEXT,
  impact_description TEXT,
  recovery_actions TEXT, -- JSON数组
  user_notification_sent BOOLEAN DEFAULT 0
);

-- 备份记录表
CREATE TABLE IF NOT EXISTS backup_records (
  id TEXT PRIMARY KEY,
  backup_type TEXT NOT NULL, -- 'full', 'incremental', 'differential'
  backup_scope TEXT NOT NULL, -- 'database', 'files', 'complete'
  backup_location TEXT NOT NULL,
  backup_size INTEGER, -- 字节
  backup_duration INTEGER, -- 秒
  verification_status TEXT, -- 'pending', 'verified', 'failed'
  retention_until DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## 5. 成本预估和扩展计划

```javascript
const costAndScaling = {
  // 第一阶段成本（月）
  phase1Cost: {
    freeUsage: {
      workers: "100,000 requests/day",
      pages: "无限制",
      d1: "5GB存储 + 25M读取/day",
      kv: "100,000 reads/day",
      r2: "10GB存储",
    },

    paidUsage: {
      workers: "$5/月（超出后）",
      d1: "$5/月（超出后）",
      kv: "$5/月（超出后）",
      估计总成本: "$0-20/月（初期）",
    },
  },

  // 合规成本估算
  complianceCosts: {
    gdprCompliance: "$500-2000（一次性实施）",
    accessibilityAudit: "$1000-3000（年度审计）",
    securityAssessment: "$2000-5000（年度评估）",
    legalConsultation: "$200-500/月（持续咨询）",
  },

  // 扩展阈值
  scalingThresholds: {
    用户量: "10,000+ DAU时考虑迁移",
    数据量: "5GB+ 数据时考虑迁移",
    复杂度: "需要复杂数据分析时迁移",
    成本: "月成本超过$100时评估迁移",
    合规要求: "需要更严格合规时考虑专业方案",
  },
};
```

## 6. 安全和合规实施计划

### 6.1 安全架构实施

```typescript
// 安全实施计划
const securityImplementationPlan = {
  phase1: {
    dataEncryption: "实施端到端数据加密",
    accessControl: "基于角色的访问控制",
    inputValidation: "全面的输入验证和清理",
    secureHeaders: "安全HTTP头配置",
  },

  phase2: {
    threatModeling: "威胁建模和风险评估",
    penetrationTesting: "渗透测试和漏洞扫描",
    securityMonitoring: "安全事件监控和响应",
    incidentResponse: "安全事件响应计划",
  },

  ongoing: {
    securityTraining: "团队安全培训",
    vulnerabilityManagement: "漏洞管理流程",
    complianceAudits: "定期合规审计",
    securityUpdates: "安全更新和补丁管理",
  },
};
```

### 6.2 合规监控和报告

```typescript
// 合规监控系统
class ComplianceMonitoringSystem {
  // GDPR合规监控
  async monitorGDPRCompliance(): Promise<ComplianceReport> {
    return {
      dataProcessingActivities: await this.auditDataProcessing(),
      consentManagement: await this.auditConsentRecords(),
      dataSubjectRights: await this.auditRightsRequests(),
      dataBreaches: await this.checkBreachNotifications(),
      privacyByDesign: await this.assessPrivacyByDesign(),
    };
  }

  // 可访问性合规监控
  async monitorAccessibilityCompliance(): Promise<AccessibilityReport> {
    return {
      wcagCompliance: await this.runWCAGAudit(),
      keyboardNavigation: await this.testKeyboardAccess(),
      screenReaderCompatibility: await this.testScreenReaders(),
      colorContrast: await this.checkColorContrast(),
      userFeedback: await this.collectAccessibilityFeedback(),
    };
  }

  // 生成合规报告
  async generateComplianceReport(): Promise<void> {
    const report = {
      reportDate: new Date().toISOString(),
      gdprCompliance: await this.monitorGDPRCompliance(),
      accessibilityCompliance: await this.monitorAccessibilityCompliance(),
      securityCompliance: await this.monitorSecurityCompliance(),
      recommendations: await this.generateRecommendations(),
    };

    await this.saveComplianceReport(report);
    await this.notifyStakeholders(report);
  }
}
```
