# 统一反馈和分析API实施文档

## 概述

本文档描述了任务3.3"实现统一反馈和分析API"的实施细节。该API提供了用户反馈收集、行为分析和数据统计功能，并集成了内容过滤功能，以确保平台数据的质量和安全性。

## 实现组件

### 1. 统一反馈API

#### 1.1 反馈提交接口

`POST /api/feedback` - 提交用户反馈

**功能特点:**
- 支持点赞/差评 (like/dislike) 反馈
- 支持文本评论
- 支持会话关联（与测试关联）
- 集成自动内容过滤
- 防滥用限流保护（每分钟最多5次提交）

**数据验证:**
- 使用Zod验证模式确保数据格式正确
- 验证会话ID是否存在
- 使用内容过滤服务验证评论内容

**示例响应:**
```json
{
  "success": true,
  "data": {
    "feedbackId": "550e8400-e29b-41d4-a716-446655440000",
    "status": "recorded",
    "contentFiltered": false
  },
  "message": "Feedback submitted successfully",
  "timestamp": "2023-01-01T12:00:00.000Z",
  "requestId": "8f7d9b41-4c37-4a5a-8c8c-033a2a2f8b3a"
}
```

#### 1.2 反馈统计接口

`GET /api/feedback/stats` - 获取反馈统计数据

**功能特点:**
- 支持时间范围过滤（7d、30d、90d、all）
- 提供点赞/差评比例
- 提供平均评分

**示例响应:**
```json
{
  "success": true,
  "data": {
    "totalFeedback": 1250,
    "positiveCount": 950,
    "negativeCount": 300,
    "averageRating": 4.2,
    "commentCount": 450,
    "timeRange": "30d",
    "likeRatio": 76
  },
  "message": "Feedback statistics retrieved successfully",
  "timestamp": "2023-01-01T12:00:00.000Z",
  "requestId": "8f7d9b41-4c37-4a5a-8c8c-033a2a2f8b3a"
}
```

#### 1.3 反馈评论接口

`GET /api/feedback/comments` - 获取用户评论

**功能特点:**
- 支持分页
- 评论按时间排序
- 统一的分页响应格式

#### 1.4 会话反馈接口

`GET /api/feedback/session/:sessionId` - 获取特定会话的反馈

**功能特点:**
- 根据会话ID查询相关反馈
- 支持测试结果与反馈关联

### 2. 统一分析API

#### 2.1 事件记录接口

`POST /api/analytics/events` - 记录单个分析事件

**功能特点:**
- 支持自定义事件类型和数据
- IP地址和用户代理自动记录
- 支持会话关联
- 防滥用限流（每分钟100次事件）

#### 2.2 批量事件接口

`POST /api/analytics/events/batch` - 批量记录分析事件

**功能特点:**
- 批量提交多个事件
- 提高高频事件记录性能
- 共享IP和用户代理

#### 2.3 统计概览接口

`GET /api/analytics/stats` - 获取分析统计数据

**功能特点:**
- 支持时间范围过滤
- 提供总体概览统计
- 提供每日数据趋势

#### 2.4 事件类型统计接口

`GET /api/analytics/stats/:eventType` - 获取特定事件类型的统计

**功能特点:**
- 按事件类型分析数据
- 提供时间趋势分析
- 列出最近事件记录

#### 2.5 用户行为路径分析

`GET /api/analytics/sessions/:sessionId` - 获取会话用户行为路径

**功能特点:**
- 跟踪完整用户旅程
- 分析用户行为模式
- 与测试结果关联

#### 2.6 热门测试分析

`GET /api/analytics/popular-tests` - 获取热门测试类型

**功能特点:**
- 按使用频率排名测试类型
- 提供百分比分析
- 关联测试名称和描述

### 3. 内容过滤系统

`ContentFilterService` - 内容审核和过滤服务

**功能特点:**
- 多类别敏感内容检测（脏话、仇恨言论、个人信息等）
- 可配置的过滤严格程度
- 区分拒绝内容与警告内容
- 自动替换敏感词汇

**过滤类别:**
- 脏话 (PROFANITY)
- 仇恨言论 (HATE_SPEECH)
- 个人信息 (PERSONAL_INFO)
- 垃圾信息 (SPAM)
- 成人内容 (ADULT)

## 数据模型

### 用户反馈模型

- `id`: 唯一标识符
- `sessionId`: 关联会话ID
- `feedbackType`: 反馈类型（like/dislike/comment）
- `content`: 评论内容
- `rating`: 评分（1-5）
- `createdAt`: 创建时间

### 分析事件模型

- `id`: 唯一标识符
- `eventType`: 事件类型
- `eventData`: 事件数据（JSON）
- `sessionId`: 关联会话ID
- `ipAddressHash`: IP地址哈希
- `userAgent`: 用户代理
- `timestamp`: 事件时间戳

## 安全考虑

1. **数据隐私保护**
   - IP地址哈希化存储
   - 敏感个人信息过滤
   - 合规的数据存储和访问控制

2. **滥用防护**
   - 接口速率限制
   - 内容过滤和检测
   - 输入验证

3. **数据完整性**
   - 统一的验证和过滤机制
   - 错误处理和日志记录
   - 缓存与数据同步

## 缓存策略

- 反馈统计数据缓存30分钟
- 测试结果数据缓存24小时
- 批量事件处理提高性能

## API响应格式

所有API返回标准化的响应格式，符合统一开发标准：

```typescript
interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
  requestId?: string;
}
```

分页数据使用扩展格式：

```typescript
interface PaginatedResponse<T = any> extends APIResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}
```

## 测试和验收

- 已完成内容过滤有效性测试
- 已验证API响应格式符合统一标准
- 已确认数据模型实现符合设计规范
- 已测试缓存机制有效性

## 下一步计划

1. 扩展事件类型和分析报告
2. 增强内容过滤能力
3. 实现高级数据可视化
4. 添加实时数据流分析

## 总结

统一反馈和分析API的实现为平台提供了强大的用户反馈收集和行为分析功能，同时确保了数据安全性和质量。该实现完全符合统一开发标准，提供了一致的接口格式、错误处理和数据验证机制。 