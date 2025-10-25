#!/bin/bash

# 部署到Production环境的脚本
echo "🚀 开始部署到Production环境..."

# 检查API Token
if [ -z "$CLOUDFLARE_API_TOKEN" ]; then
    echo "❌ 错误: 请设置 CLOUDFLARE_API_TOKEN 环境变量"
    echo "   export CLOUDFLARE_API_TOKEN=your_token_here"
    exit 1
fi

# 确认生产环境部署
echo "⚠️  即将部署到生产环境！"
echo "🔍 检查当前配置..."
echo "📦 后端: selfatlas-backend-prod"
echo "🌐 前端: getyourluck-testing-platform"
echo ""
read -p "确认继续部署到生产环境？(y/N): " confirm

if [[ $confirm != [yY] && $confirm != [yY][eE][sS] ]]; then
    echo "❌ 部署已取消"
    exit 0
fi

# 1. 部署后端
echo ""
echo "📦 部署后端到Production..."
cd backend
npm run build

if [ $? -ne 0 ]; then
    echo "❌ 后端构建失败"
    exit 1
fi

npx wrangler deploy --env production

if [ $? -ne 0 ]; then
    echo "❌ 后端部署失败"
    exit 1
fi

echo "✅ 后端部署成功"

# 2. 构建前端
echo ""
echo "📦 构建前端..."
cd ../frontend
npm run build

if [ $? -ne 0 ]; then
    echo "❌ 前端构建失败"
    exit 1
fi

echo "✅ 前端构建成功"

# 3. 部署前端到Cloudflare Pages (production分支)
echo ""
echo "📦 部署前端到Production..."
npx wrangler pages deploy dist --project-name getyourluck-testing-platform --branch production

if [ $? -ne 0 ]; then
    echo "❌ 前端部署失败"
    exit 1
fi

echo "✅ 前端部署成功"

# 4. 验证部署
echo ""
echo "🧪 验证部署状态..."
echo "正在检查后端服务..."
sleep 5

backend_status=$(curl -s -o /dev/null -w "%{http_code}" https://selfatlas-backend-prod.workers.dev/health)
if [ "$backend_status" = "200" ]; then
    echo "✅ 后端服务正常运行"
else
    echo "⚠️  后端服务状态检查: HTTP $backend_status"
fi

# 🔥 新增：验证图片资源
echo ""
echo "🖼️  验证图片资源..."
image_status=$(curl -s -o /dev/null -w "%{http_code}" https://getyourluck-testing-platform.pages.dev/assets/logo.png)
if [ "$image_status" = "200" ]; then
    echo "✅ 图片资源正常"
else
    echo "⚠️  图片资源状态: HTTP $image_status"
fi

# 验证博客图片
blog_image_status=$(curl -s -o /dev/null -w "%{http_code}" https://getyourluck-testing-platform.pages.dev/assets/blog/psychology/mbti-compatibility/cover.png)
if [ "$blog_image_status" = "200" ]; then
    echo "✅ 博客图片资源正常"
else
    echo "⚠️  博客图片资源状态: HTTP $blog_image_status"
fi

echo ""
echo "🎉 Production环境部署完成！"
echo ""
echo "📋 部署信息："
echo "🔗 后端API: https://selfatlas-backend-prod.workers.dev"
echo "🔗 后端健康检查: https://selfatlas-backend-prod.workers.dev/health"
echo "🔗 前端URL: https://getyourluck-testing-platform.pages.dev"
echo "🖼️  图片CDN: https://getyourluck-testing-platform.pages.dev"
echo ""
echo "📊 请验证以下功能："
echo "   - 后端API响应正常"
echo "   - 前端页面加载正常" 
echo "   - 图片资源加载正常"
echo "   - 数据库连接正常"
echo "   - 各模块功能正常"
