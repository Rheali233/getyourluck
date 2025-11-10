# BaZi 测试错误排查指南

## 📋 问题描述

BaZi 测试在 staging 环境返回 500 错误，但其他模块（如 tarot, astrology）测试正常。

## 🔍 排查方法

### 1. 检查后端日志

**方法：**
```bash
# 查看 Cloudflare Workers 实时日志
cd comprehensive-testing-platform/backend
npx wrangler tail --env staging
```

**需要关注的信息：**
- `[Test Submit Route]` - 路由匹配日志
- `[Test Submit]` - 测试提交日志
- `[TestResultService]` - 测试结果处理日志
- `[AIService]` - AI 分析日志
- 错误堆栈信息

**关键检查点：**
1. 请求是否到达后端（查看 `[Test Submit Route]` 日志）
2. 测试类型是否正确识别为 `numerology`
3. AI 分析是否启动（查看 `[AIService]` 日志）
4. AI 分析是否超时或失败
5. 错误发生在哪个环节（路由、验证、处理、AI分析）

### 2. 检查前端请求数据

**方法：**
在浏览器开发者工具的 Network 标签中查看失败的请求：

1. 打开浏览器开发者工具（F12）
2. 切换到 Network 标签
3. 执行 BaZi 测试
4. 找到失败的 POST 请求（通常是 `/api/v1/tests/numerology/submit`）
5. 查看 Request Payload 和 Response

**需要检查的数据：**
- Request Payload 中的 `testType` 是否为 `"numerology"`
- `answers` 数组格式是否正确
- `answers[0].answer.type` 是否为 `"bazi"`
- `answers[0].answer.inputData` 是否包含所有必需字段：
  - `fullName`
  - `birthDate`
  - `birthTime`
  - `gender`
  - `calendarType`

### 3. 对比正常工作的模块

**对比模块：** Tarot 模块（工作正常）

**对比点：**

#### 前端对比
1. **数据格式：**
   - Tarot: `answers` 包含多个卡牌答案
   - BaZi: `answers` 只包含一个答案，格式为：
     ```json
     {
       "questionId": "numerology_analysis_type",
       "answer": {
         "type": "bazi",
         "inputData": {
           "fullName": "...",
           "birthDate": "...",
           "birthTime": "...",
           "gender": "...",
           "calendarType": "..."
         }
       }
     }
     ```

2. **提交流程：**
   - 两者都使用 `unifiedStore.endTest()` 提交
   - 都通过 `/api/v1/tests/:testType/submit` 路由

#### 后端对比
1. **处理器：**
   - Tarot: `TarotResultProcessor`
   - BaZi: `NumerologyResultProcessor`
   - 两者都已注册在 `TestResultService` 中

2. **AI 分析：**
   - Tarot: 使用 `parseTarotResponse()`
   - BaZi: 使用 `parseNumerologyResponse()`
   - 两者都在 `criticalAITestTypes` 之外，AI失败不应该阻止结果返回

3. **错误处理：**
   - 检查 `TestResultService.ts` 第147行的 `criticalAITestTypes` 列表
   - `numerology` 不在列表中，所以AI失败应该返回基础结果

### 4. 检查后端代码

**需要检查的文件：**

1. **`backend/src/routes/v1/tests/index.ts`**
   - 第146-306行：测试提交路由处理
   - 检查 numerology 测试类型的验证逻辑
   - 检查错误处理逻辑

2. **`backend/src/services/TestResultService.ts`**
   - 第55-175行：`processTestSubmission` 方法
   - 检查 numerology 处理器的调用
   - 检查 AI 分析的错误处理

3. **`backend/src/services/testEngine/processors/NumerologyResultProcessor.ts`**
   - 第38-72行：`process` 方法
   - 检查答案验证逻辑
   - 检查基础分析生成

4. **`backend/src/services/AIService.ts`**
   - 第1530-1541行：numerology 类型的解析逻辑
   - 第2307行开始：`parseNumerologyResponse` 方法
   - 检查 JSON 解析逻辑
   - 检查错误处理

### 5. 检查环境变量

**方法：**
```bash
cd comprehensive-testing-platform/backend
npx wrangler secret list --env staging
```

**需要确认：**
- `DEEPSEEK_API_KEY` 是否已设置
- API 密钥是否有效

### 6. 测试 API 端点

**方法：**
使用 curl 或 Postman 直接测试后端 API：

```bash
curl -X POST https://selfatlas-backend-staging.cyberlina.workers.dev/api/v1/tests/numerology/submit \
  -H "Content-Type: application/json" \
  -d '{
    "testType": "numerology",
    "answers": [
      {
        "questionId": "numerology_analysis_type",
        "answer": {
          "type": "bazi",
          "inputData": {
            "fullName": "Test User",
            "birthDate": "1990-01-01",
            "birthTime": "12:00",
            "gender": "male",
            "calendarType": "solar"
          }
        },
        "timestamp": "2025-01-01T00:00:00.000Z"
      }
    ],
    "userInfo": {
      "userAgent": "test",
      "timestamp": "2025-01-01T00:00:00.000Z"
    }
  }'
```

**检查响应：**
- 状态码
- 错误消息
- 响应体结构

### 7. 检查数据库

**方法：**
```bash
cd comprehensive-testing-platform/backend
npx wrangler d1 execute getyourluck-staging --remote --command "SELECT * FROM test_types WHERE id = 'numerology';" --json
```

**需要确认：**
- `numerology` 测试类型是否存在于数据库
- `is_active` 是否为 1
- `config_data` 是否正确

### 8. 检查 AI 服务响应

**可能的问题：**
1. **AI API 超时：** BaZi 分析可能需要更长时间
2. **AI 响应格式错误：** JSON 解析失败
3. **AI API 密钥问题：** 密钥无效或过期
4. **AI 服务限流：** 请求频率过高

**检查方法：**
- 查看后端日志中的 AI 分析时间
- 检查 AI 响应是否完整
- 检查 JSON 解析错误

## 🎯 排查优先级

1. **高优先级：**
   - 查看后端实时日志（`wrangler tail`）
   - 检查前端请求数据格式
   - 对比 tarot 模块的请求/响应

2. **中优先级：**
   - 检查后端代码中的错误处理
   - 测试 API 端点
   - 检查数据库中的测试类型配置

3. **低优先级：**
   - 检查环境变量
   - 检查 AI 服务响应格式

## 📝 常见错误原因

1. **数据格式不匹配：** 前端发送的数据格式与后端期望不一致
2. **AI 分析超时：** BaZi 分析需要更长时间，可能超过超时限制
3. **JSON 解析错误：** AI 返回的 JSON 格式不正确
4. **数据库配置缺失：** `numerology` 测试类型未正确配置
5. **错误处理逻辑问题：** AI 失败时的错误处理不正确

## 🔧 修复建议

1. **增加超时时间：** 如果 AI 分析超时，增加 BaZi 分析的超时时间
2. **改进错误处理：** 确保 AI 失败时返回基础结果，而不是抛出错误
3. **添加详细日志：** 在关键步骤添加日志，便于排查问题
4. **数据验证：** 加强前端和后端的数据验证

## 📚 相关代码文件

- 前端：`frontend/src/modules/numerology/stores/useNumerologyStore.ts`
- 后端路由：`backend/src/routes/v1/tests/index.ts`
- 后端服务：`backend/src/services/TestResultService.ts`
- 处理器：`backend/src/services/testEngine/processors/NumerologyResultProcessor.ts`
- AI 服务：`backend/src/services/AIService.ts`

