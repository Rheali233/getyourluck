#!/bin/bash

# 本地开发环境初始化脚本
# 用于设置本地开发环境，包括数据库迁移和种子数据初始化

set -e  # 遇到错误立即退出

echo "🚀 开始初始化本地开发环境..."
echo ""

# 检查 wrangler 是否安装
if ! command -v wrangler &> /dev/null; then
    echo "❌ 错误: 未找到 wrangler 命令"
    echo "   请先安装: npm install -g wrangler"
    exit 1
fi

# 检查是否在 backend 目录
if [ ! -f "wrangler.toml" ]; then
    echo "❌ 错误: 请在 backend 目录下运行此脚本"
    echo "   使用方法: cd backend && npm run init:local"
    exit 1
fi

# 步骤 1: 检查本地数据库配置
echo "📋 步骤 1: 检查本地数据库配置..."
echo "💡 提示: 本地数据库会在首次运行时自动创建"
echo "   如果数据库不存在，迁移时会自动创建"
echo ""

# 步骤 2: 运行数据库迁移
echo "📦 步骤 2: 运行数据库迁移..."
if wrangler d1 migrations apply selfatlas-local --local; then
    echo "✅ 数据库迁移完成"
else
    echo "❌ 数据库迁移失败"
    exit 1
fi
echo ""

# 步骤 3: 初始化种子数据
echo "🌱 步骤 3: 初始化种子数据..."
if npm run seed:local; then
    echo "✅ 种子数据初始化完成"
else
    echo "⚠️  种子数据初始化失败，但可以继续使用"
    echo "   提示: 可以稍后手动运行 'npm run seed:local'"
fi
echo ""

# 完成提示
echo "🎉 本地开发环境初始化完成！"
echo ""
echo "📋 下一步操作："
echo "   1. 启动后端服务: npm run dev"
echo "   2. 在另一个终端启动前端: cd ../frontend && npm run dev"
echo "   3. 访问 http://localhost:3000 开始开发"
echo ""
echo "💡 提示："
echo "   - 后端运行在: http://localhost:8787"
echo "   - 前端运行在: http://localhost:3000"
echo "   - 数据库: selfatlas-local (本地)"
echo "   - 所有操作都在本地，不会影响远程环境"

