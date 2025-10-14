# SelfAtlas Testing Platform

基于 Cloudflare 全栈架构的现代化在线测试平台，提供心理测试、占星分析、塔罗占卜等多种测试服务。

## 🌍 语言要求

**重要说明：** 本项目的所有用户界面、内容展示、API响应等均使用英文作为主要语言。

- **用户界面**: 所有前端组件、页面标题、按钮文字、提示信息等必须使用英文
- **内容展示**: 测试题目、结果分析、推荐内容、博客文章等必须使用英文  
- **API接口**: 所有API响应中的message、error等字段必须使用英文
- **数据库内容**: 存储的测试题目、结果模板、内容配置等必须使用英文
- **错误信息**: 所有错误提示、验证消息等必须使用英文

## 🏗️ 项目架构

```
comprehensive-testing-platform/
├── frontend/                      # 前端应用 (React + TypeScript)
│   ├── src/
│   │   ├── modules/              # 功能模块
│   │   │   ├── psychology/       # 心理测试模块
│   │   │   ├── career/           # 职业发展模块
│   │   │   ├── relationship/     # 关系测试模块
│   │   │   ├── learning-ability/ # 学习能力模块
│   │   │   ├── testing/          # 统一测试框架
│   │   │   └── homepage/         # 首页模块
│   │   ├── shared/               # 共享组件和工具
│   │   ├── stores/               # 状态管理 (Zustand)
│   │   └── services/             # API服务
├── backend/                       # 后端服务 (Cloudflare Workers)
│   ├── src/
│   │   ├── routes/               # API路由
│   │   ├── services/             # 业务逻辑服务
│   │   ├── models/               # 数据模型
│   │   └── middleware/           # 中间件
├── shared/                        # 共享代码
│   ├── types/                    # 统一类型定义
│   ├── services/                  # 共享服务基类
│   ├── utils/                     # 工具函数
│   └── tests/                     # 测试文件
└── docs/                          # 项目文档
```

## 🚀 技术栈

### 前端技术栈
- **框架**: React.js 18+ (函数组件 + Hooks)
- **语言**: TypeScript (严格模式)
- **样式**: Tailwind CSS + 自定义设计系统
- **构建**: Vite
- **状态管理**: Zustand
- **路由**: React Router v6
- **测试**: Vitest + React Testing Library

### 后端技术栈
- **运行环境**: Cloudflare Workers
- **框架**: Hono.js
- **语言**: TypeScript
- **数据库**: Cloudflare D1 (SQLite)
- **缓存**: Cloudflare KV
- **存储**: Cloudflare R2

## 🎯 核心特性

### 统一架构设计
- **模块化架构**: 每个功能模块独立，可单独开发和部署
- **共享服务基类**: 提供AI服务、错误处理等基础功能
- **统一类型系统**: 跨模块的类型定义和接口规范
- **懒加载优化**: 大型组件的按需加载，提升性能

### 测试系统
- **多类型测试**: 支持心理、职业、关系、学习能力等测试
- **AI分析**: 基于DeepSeek API的智能结果分析
- **统一流程**: 标准化的测试流程和结果生成
- **会话管理**: 完整的测试会话生命周期管理

### 错误处理
- **统一错误码**: 标准化的错误分类和处理
- **用户友好**: 提供清晰的错误信息和解决建议
- **错误监控**: 生产环境的错误跟踪和日志
- **重试机制**: 智能的错误重试和恢复

## 🔧 本地开发

### 环境要求
- Node.js 20+
- npm 或 yarn
- Git

### 前端开发
```bash
cd frontend
npm install
npm run dev          # 启动开发服务器
npm run build        # 构建生产版本
npm run test         # 运行测试
npm run test:coverage # 测试覆盖率报告
```

### 后端开发
```bash
cd backend
npm install
npm run dev          # 启动本地开发环境
npm run test         # 运行测试
npm run deploy       # 部署到 Cloudflare Workers
```

### 共享模块开发
```bash
cd shared
npm install
npm run test         # 运行共享模块测试
```

## 🧪 测试策略

### 测试覆盖
- **单元测试**: 核心工具函数和服务类的测试
- **组件测试**: React组件的渲染和交互测试
- **集成测试**: 模块间的协作测试
- **端到端测试**: 完整的用户流程测试

### 测试工具
- **Vitest**: 快速的单元测试框架
- **React Testing Library**: React组件测试
- **Jest Mocks**: 模拟外部依赖
- **测试环境配置**: 统一的测试环境设置

## 📚 开发指南

### 代码规范
- **TypeScript**: 严格模式，完整的类型定义
- **ESLint**: 代码质量检查
- **Prettier**: 代码格式化
- **Git Hooks**: 提交前的代码检查

### 组件开发
```typescript
interface ComponentProps extends BaseComponentProps {
  // 组件特定属性
}

export const Component: React.FC<ComponentProps> = ({ 
  className, 
  testId, 
  ...props 
}) => {
  return (
    <div className={cn("component-base", className)} data-testid={testId}>
      {/* 组件内容 */}
    </div>
  );
};
```

### 状态管理
```typescript
interface ModuleState extends BaseModuleState {
  // 模块特定状态
}

interface ModuleActions extends BaseModuleActions {
  // 模块特定操作
}

export const useModuleStore = create<ModuleState & ModuleActions>((set, get) => ({
  // 实现
}));
```

### 错误处理
```typescript
import { createError, handleError } from '@/shared/utils/errorHandler';

try {
  // 业务逻辑
} catch (error) {
  throw createError('VALIDATION_ERROR', 'Invalid input');
}

// 或者使用统一处理
const processedError = handleError(error, { logError: true });
```

## 🚀 性能优化

### 前端优化
- **组件懒加载**: 大型组件的按需加载
- **代码分割**: 基于路由的代码分割
- **图片优化**: 懒加载和压缩优化
- **缓存策略**: 智能的API响应缓存

### 后端优化
- **数据库查询**: 优化的SQL查询和索引
- **缓存层**: 多层缓存策略
- **异步处理**: 非阻塞的异步操作
- **资源压缩**: 响应数据的压缩

## 🔒 安全特性

### 数据安全
- **输入验证**: 严格的输入数据验证
- **SQL注入防护**: 参数化查询
- **XSS防护**: 输出数据的安全处理
- **CSRF防护**: 跨站请求伪造防护

### 访问控制
- **身份验证**: 用户身份验证机制
- **权限管理**: 基于角色的访问控制
- **API限流**: 防止API滥用
- **审计日志**: 完整的操作日志记录

## 📊 监控和分析

### 性能监控
- **响应时间**: API响应时间监控
- **错误率**: 错误发生率和类型统计
- **资源使用**: 内存和CPU使用监控
- **用户行为**: 用户交互行为分析

### 日志系统
- **结构化日志**: JSON格式的结构化日志
- **日志级别**: 不同级别的日志分类
- **日志聚合**: 集中化的日志收集
- **日志分析**: 日志数据的分析和报告

## 🚀 部署和运维

### 环境架构
我们采用三环境部署架构，确保代码质量和部署稳定性：

- **🧪 开发环境 (Development)**: 本地开发和调试
- **🧪 测试环境 (Staging)**: 功能测试和验收
- **🚀 生产环境 (Production)**: 正式发布和运营

### 部署流程
完整的部署流程包括四个阶段：

1. **开发验收完成** - 代码质量检查和本地功能验证
2. **开发环境部署** - 部署到开发环境进行初步验证
3. **测试环境部署** - 部署到测试环境进行全面验收
4. **生产环境部署** - 部署到生产环境正式发布

### 自动化部署
- **GitHub Actions CI/CD**: 基于分支的自动部署
- **分支策略**: 
  - `main` 分支 → 生产环境
  - `feature/*` 分支 → 测试环境
  - Pull Request → 预览环境
- **质量门禁**: 自动执行代码检查、测试和构建验证

### 监控告警
- **健康检查**: 服务健康状态监控
- **性能告警**: 性能指标异常告警
- **错误告警**: 错误率异常告警
- **容量告警**: 资源使用率告警

### 详细部署指南
📖 查看 [完整部署流程指南](./docs/deployment-guide.md) 了解详细的部署步骤、验收标准和故障处理流程。

📋 查看 [部署快速参考](./docs/deployment-quick-reference.md) 获取常用部署命令和故障排除方法。

## 🤝 贡献指南

### 开发流程
1. Fork项目仓库
2. 创建功能分支
3. 编写代码和测试
4. 提交Pull Request
5. 代码审查和合并

### 代码审查
- **功能完整性**: 功能实现是否完整
- **代码质量**: 代码规范和最佳实践
- **测试覆盖**: 测试用例是否充分
- **文档更新**: 相关文档是否更新

## 📝 更新日志

### v2.0.0 (2024-12-19)
- ✨ 重构项目架构，实现统一API接口
- ✨ 创建共享服务基类，减少代码重复
- ✨ 实现统一错误处理系统
- ✨ 添加完整的测试覆盖
- ✨ 实现组件懒加载优化
- ✨ 创建TODO管理系统

### v1.0.0 (2024-12-01)
- 🎉 项目初始版本发布
- ✨ 基础测试功能实现
- ✨ 前端界面开发完成
- ✨ 后端API服务部署

## 📞 支持和反馈

- **问题报告**: 使用GitHub Issues
- **功能建议**: 提交Feature Request
- **技术支持**: 联系开发团队
- **文档反馈**: 提交文档改进建议

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

---

**注意**: 本项目正在积极开发中，API和功能可能会有变化。请查看最新文档获取最新信息。
