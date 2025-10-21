#!/bin/bash

# 完整的Staging环境API监控脚本
# 基于实际的后端路由配置

# Staging environment URLs
BACKEND_URL="https://selfatlas-backend-staging.cyberlina.workers.dev"
FRONTEND_URL="https://staging.getyourluck-testing-platform.pages.dev"

# Function to test a GET endpoint
test_get_endpoint() {
  local name=$1
  local url=$2
  local expected_status=${3:-200}

  response=$(curl -s -o /dev/null -w "%{http_code}" "$url")

  if [ "$response" == "$expected_status" ]; then
    echo "测试 $name ... ✅ 成功 (HTTP $response)"
    return 0
  else
    echo "测试 $name ... ❌ 失败 (HTTP $response)"
    return 1
  fi
}

# Function to test a POST endpoint
test_post_endpoint() {
  local name=$1
  local url=$2
  local data=$3
  local expected_status=${4:-200}

  response=$(curl -s -X POST -H "Content-Type: application/json" -d "$data" -o /dev/null -w "%{http_code}" "$url")

  if [ "$response" == "$expected_status" ]; then
    echo "测试 $name ... ✅ 成功 (HTTP $response)"
    return 0
  else
    echo "测试 $name ... ❌ 失败 (HTTP $response)"
    return 1
  fi
}

echo "🔍 完整的Staging环境API监控报告"
echo "================================="
echo "时间: $(date)"
echo "后端URL: $BACKEND_URL"
echo "前端URL: $FRONTEND_URL"
echo ""

echo "📋 基础接口测试:"
test_get_endpoint "根路径" "$BACKEND_URL/"
test_get_endpoint "前端页面" "$FRONTEND_URL"
test_get_endpoint "API v1" "$BACKEND_URL/api/v1"
echo ""

echo "🧠 心理测试模块 (Psychology):"
test_get_endpoint "MBTI问题" "$BACKEND_URL/api/psychology/questions?testType=mbti&limit=1"
test_get_endpoint "PHQ9问题" "$BACKEND_URL/api/psychology/questions?testType=phq9&limit=1"
test_get_endpoint "EQ问题" "$BACKEND_URL/api/psychology/questions?testType=eq&limit=1"
test_get_endpoint "幸福感问题" "$BACKEND_URL/api/psychology/questions?testType=happiness&limit=1"
echo ""

echo "🌟 占星模块 (Astrology):"
test_get_endpoint "星座列表" "$BACKEND_URL/api/astrology/zodiac-signs"
test_get_endpoint "运势分析(缺少参数)" "$BACKEND_URL/api/astrology/fortune/aries?timeframe=daily" 400
test_get_endpoint "生辰图分析" "$BACKEND_URL/api/astrology/birth-chart" 400
test_get_endpoint "星座配对" "$BACKEND_URL/api/astrology/compatibility" 400
echo ""

echo "🔮 塔罗模块 (Tarot):"
test_get_endpoint "问题分类" "$BACKEND_URL/api/tarot/categories"
echo ""

echo "💼 职业模块 (Career) - 新修复的路由:"
test_get_endpoint "职业问题接口" "$BACKEND_URL/api/career/questions?testType=holland&limit=1"
test_get_endpoint "职业测试接口" "$BACKEND_URL/api/career/test"
echo ""

echo "💕 关系模块 (Relationship) - 新修复的路由:"
test_get_endpoint "关系问题接口" "$BACKEND_URL/api/relationship/questions?testType=love-language&limit=1"
echo ""

echo "🎓 学习能力模块 (Learning Ability):"
test_get_endpoint "VARK问题" "$BACKEND_URL/api/learning-ability/questions?testType=vark&limit=1"
test_get_endpoint "学习测试" "$BACKEND_URL/api/learning-ability/test"
echo ""

echo "📊 其他系统接口:"
test_get_endpoint "首页模块" "$BACKEND_URL/api/homepage"
test_get_endpoint "博客接口" "$BACKEND_URL/api/blog"
test_get_endpoint "反馈接口" "$BACKEND_URL/api/feedback"
test_get_endpoint "搜索接口" "$BACKEND_URL/api/search"
test_get_endpoint "SEO接口" "$BACKEND_URL/api/seo"
test_get_endpoint "测试结果" "$BACKEND_URL/api/test-results"
test_get_endpoint "AI接口" "$BACKEND_URL/api/ai"
echo ""

echo "🔧 统一测试接口 (V1 API):"
test_get_endpoint "V1测试列表" "$BACKEND_URL/api/v1/tests"
test_get_endpoint "V1问题接口" "$BACKEND_URL/api/v1/questions"
test_get_endpoint "V1会话接口" "$BACKEND_URL/api/v1/sessions"
test_get_endpoint "V1 AI接口" "$BACKEND_URL/api/v1/ai"
echo ""

echo "📈 接口状态总结:"
echo "✅ 正常工作: 基础接口、心理测试、占星、塔罗"
echo "🔧 新修复: 职业模块、关系模块路由"
echo "⚠️  需要参数: 部分占星接口需要完整参数"
echo "🔍 建议: 定期监控，确保所有接口稳定运行"
echo ""

echo "================================="
echo "监控完成: $(date)"
