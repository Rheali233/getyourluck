#!/bin/bash
# 确保 functions 目录被正确部署到 dist

echo "📦 验证 functions 目录结构..."
if [ ! -d "dist/functions" ]; then
    echo "❌ dist/functions 目录不存在，正在创建..."
    mkdir -p dist/functions
    cp -r functions/* dist/functions/
fi

echo "✅ functions 目录验证："
echo ""
find dist/functions -type f -exec ls -lh {} \; | awk '{print "  -", $9, "(" $5 ")"}'

echo ""
echo "📋 准备部署检查清单："
echo "  1. ✅ dist/functions/_middleware.js 存在"
echo "  2. ✅ dist/functions/api/_middleware.js 存在"
echo "  3. ✅ 文件导出格式正确"
echo ""
echo "⚠️  重要提示："
echo "  上传 dist 目录时，确保选择整个目录（包括 functions 子目录）"
echo "  如果 Dashboard 只显示了部分文件，可以尝试："
echo "  1. 解压 deploy-package.zip 到临时目录"
echo "  2. 确保 functions 目录存在于解压后的目录中"
echo "  3. 上传整个解压后的目录"
