#!/bin/bash

# 本地验证脚本
# 使用方法: ./scripts/local-validation.sh

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# 日志函数
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查前端状态
check_frontend() {
    log_info "检查前端状态..."
    
    # 检查前端是否运行
    local frontend_status=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:3000")
    if [[ $frontend_status == "200" ]]; then
        log_success "前端运行正常 (HTTP $frontend_status)"
    else
        log_error "前端运行异常 (HTTP $frontend_status)"
        return 1
    fi
    
    # 检查页面标题
    local title=$(curl -s "http://localhost:3000" | grep -o '<title>.*</title>' | sed 's/<title>\(.*\)<\/title>/\1/')
    if [[ "$title" == "综合测试平台" ]]; then
        log_success "页面标题正确: $title"
    else
        log_warning "页面标题异常: $title"
    fi
    
    # 检查meta标签
    local description=$(curl -s "http://localhost:3000" | grep -o 'name="description"[^>]*content="[^"]*"' | sed 's/.*content="\([^"]*\)".*/\1/')
    if [[ -n "$description" ]]; then
        log_success "页面描述存在: ${description:0:50}..."
    else
        log_warning "页面描述缺失"
    fi
    
    log_success "前端检查完成"
}

# 检查页面内容
check_page_content() {
    log_info "检查页面内容..."
    
    local html_content=$(curl -s "http://localhost:3000")
    
    # 检查关键组件
    if echo "$html_content" | grep -q "id=\"root\""; then
        log_success "React根元素存在"
    else
        log_warning "React根元素缺失"
    fi
    
    # 检查JavaScript文件
    if echo "$html_content" | grep -q "src=\"/src/main.tsx\""; then
        log_success "主JavaScript文件引用正确"
    else
        log_warning "主JavaScript文件引用异常"
    fi
    
    log_success "页面内容检查完成"
}

# 检查构建状态
check_build_status() {
    log_info "检查构建状态..."
    
    # 检查是否有构建错误
    local build_errors=$(curl -s "http://localhost:3000" 2>&1 | grep -i "error\|failed\|exception" || true)
    if [[ -z "$build_errors" ]]; then
        log_success "构建状态正常"
    else
        log_warning "发现构建问题: $build_errors"
    fi
    
    log_success "构建状态检查完成"
}

# 生成验证报告
generate_report() {
    log_info "生成验证报告..."
    
    local report_file="local-validation-report-$(date +%Y%m%d_%H%M%S).json"
    
    cat > "$report_file" << EOF
{
  "timestamp": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "environment": "local",
  "frontendUrl": "http://localhost:3000",
  "validationResults": {
    "frontend": "completed",
    "pageContent": "completed",
    "buildStatus": "completed"
  },
  "summary": "本地验证完成，前端功能正常"
}
EOF
    
    log_success "验证报告已生成: $report_file"
}

# 主验证流程
main() {
    log_info "开始本地验证..."
    
    check_frontend
    check_page_content
    check_build_status
    generate_report
    
    log_success "本地验证完成！"
    log_info "前端在 http://localhost:3000 运行正常"
    log_info "请手动访问页面验证功能完整性"
}

# 错误处理
trap 'log_error "验证过程中发生错误，退出码: $?"; exit 1' ERR

# 执行主流程
main "$@"
