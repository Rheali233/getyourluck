# 综合测试平台 (Comprehensive Testing Platform)

基于Cloudflare全栈架构的现代化在线测试平台，提供心理测试、占星分析、塔罗占卜等多种测试服务。

## 🏗️ 项目架构

- **前端**: React.js + TypeScript + Tailwind CSS + Vite
- **后端**: Cloudflare Workers + Hono.js + TypeScript  
- **数据库**: Cloudflare D1 (SQLite)
- **缓存**: Cloudflare KV
- **存储**: Cloudflare R2
- **部署**: Cloudflare Pages + Workers

## 📁 项目结构

```
comprehensive-testing-platform/
├── frontend/                    # 用户端前端项目
├── backend/                     # 后端API项目
├── admin/                       # 管理端前端项目
├── shared/                      # 共享代码
│   ├── types/                   # 统一类型定义
│   ├── constants/               # 常量定义
│   └── utils/                   # 共享工具函数
├── docs/                        # 项目文档
└── scripts/                     # 构建和部署脚本
```

## 🚀 快速开始

### 环境要求

- Node.js 18+
- npm 或 yarn
- Cloudflare账户

### 后端开发

```bash
cd backend
npm install
npm run dev
```

### 前端开发

```bash
cd frontend  
npm install
npm run dev
```

## 📋 开发规范

本项目严格遵循[统一开发标准](./docs/development-guide.md)，包括：

- 统一的状态管理接口（ModuleState & ModuleActions）
- 统一的API响应格式（APIResponse<T>）
- 统一的组件架构规范（BaseComponentProps）
- 统一的错误处理机制（ModuleError）
- 统一的数据库设计规范

## 🧪 测试模块

- **心理测试**: MBTI、大五人格等专业心理评估
- **占星分析**: 星座运势、星盘解读
- **塔罗占卜**: 塔罗牌占卜和解读
- **职业发展**: 职业兴趣和能力评估
- **学习能力**: 学习风格和认知能力测试
- **情感关系**: 恋爱和人际关系分析
- **命理分析**: 数字命理学分析

## 📖 文档

- [开发规范](./docs/development-guide.md)
- [UI设计规范](./docs/ui-guide.md)
- [API文档](./docs/api-reference.md)
- [部署指南](./docs/deployment-guide.md)

## 🔒 合规性

- **数据隐私**: 严格遵循GDPR、CCPA等国际数据保护法规
- **可访问性**: 符合WCAG 2.1 AA级别标准
- **移动端优化**: 移动优先的响应式设计
- **内容质量**: 科学严谨的内容管理体系

## 📄 许可证

MIT License