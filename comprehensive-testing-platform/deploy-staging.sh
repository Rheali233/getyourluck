#!/bin/bash

# 部署到Staging环境的脚本
echo "🚀 开始部署到Staging环境..."

# 检查API Token
if [ -z "$CLOUDFLARE_API_TOKEN" ]; then
    echo "❌ 错误: 请设置 CLOUDFLARE_API_TOKEN 环境变量"
    echo "   export CLOUDFLARE_API_TOKEN=your_token_here"
    exit 1
fi

# 1. 部署后端
echo "📦 部署后端到Staging..."
cd backend
npm run build
npx wrangler deploy --env staging

if [ $? -ne 0 ]; then
    echo "❌ 后端部署失败"
    exit 1
fi

echo "✅ 后端部署成功"

# 2. 构建前端
echo "📦 构建前端..."
cd ../frontend
npm run build

if [ $? -ne 0 ]; then
    echo "❌ 前端构建失败"
    exit 1
fi

echo "✅ 前端构建成功"

# 3. 部署前端到Cloudflare Pages
echo "📦 部署前端到Staging..."
npx wrangler pages deploy dist --project-name getyourluck-testing-platform --branch staging

if [ $? -ne 0 ]; then
    echo "❌ 前端部署失败"
    exit 1
fi

echo "✅ 前端部署成功"

echo "🎉 Staging环境部署完成！"
echo "🔗 后端API: https://selfatlas-backend-staging.cyberlina.workers.dev"
echo "🔗 前端URL: https://staging.getyourluck-testing-platform.pages.dev"
