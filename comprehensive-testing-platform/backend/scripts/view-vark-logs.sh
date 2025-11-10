#!/bin/bash

# 查看 VARK 测试相关的 Cloudflare Workers 日志
# 使用方法: ./scripts/view-vark-logs.sh [staging|production]

ENV=${1:-staging}
SERVICE_NAME="selfatlas-backend-${ENV}"

echo "🔍 查看 VARK 测试日志 (环境: ${ENV})"
echo "=========================================="
echo ""
echo "正在启动日志流，查找 VARK 相关的错误..."
echo "按 Ctrl+C 停止"
echo ""

# 使用 wrangler tail 查看实时日志，过滤 VARK 相关的日志
cd "$(dirname "$0")/.." || exit

npx wrangler tail --env "${ENV}" --format pretty 2>&1 | grep -i -E "(vark|VARK|TestResultService|AIService|AI analysis|dimensionsAnalysis|learningStrategiesImplementation|Missing required)" --color=always

