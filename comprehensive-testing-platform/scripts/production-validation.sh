#!/bin/bash

# 生产环境验证脚本
# 使用方法: ./scripts/production-validation.sh [environment]

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# 默认值
ENVIRONMENT=${1:-production}
BASE_URL=""
API_BASE_URL=""

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

# 设置环境URL
setup_environment() {
    case $ENVIRONMENT in
        "production")
            BASE_URL="https://selfatlas.net"
            API_BASE_URL="https://api.selfatlas.net"
            ;;
        "staging")
            BASE_URL="https://staging.selfatlas.net"
            API_BASE_URL="https://staging-api.selfatlas.net"
            ;;
        "development")
            BASE_URL="https://dev.selfatlas.net"
            API_BASE_URL="https://dev-api.selfatlas.net"
            ;;
        *)
            log_error "无效的环境: $ENVIRONMENT"
            exit 1
            ;;
    esac
    
    log_info "验证环境: $ENVIRONMENT"
    log_info "前端地址: $BASE_URL"
    log_info "API地址: $API_BASE_URL"
}

# 检查依赖
check_dependencies() {
    log_info "检查验证依赖..."
    
    if ! command -v curl &> /dev/null; then
        log_error "curl 未安装"
        exit 1
    fi
    
    if ! command -v jq &> /dev/null; then
        log_warning "jq 未安装，JSON解析可能受限"
    fi
    
    log_success "依赖检查完成"
}

# 验证部署状态
validate_deployment() {
    log_info "验证部署状态..."
    
    # 检查前端
    local frontend_status=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL")
    if [[ $frontend_status == "200" ]]; then
        log_success "前端部署正常 (HTTP $frontend_status)"
    else
        log_error "前端部署异常 (HTTP $frontend_status)"
        return 1
    fi
    
    # 检查后端API
    local api_status=$(curl -s -o /dev/null -w "%{http_code}" "$API_BASE_URL/health")
    if [[ $api_status == "200" ]]; then
        log_success "后端API部署正常 (HTTP $api_status)"
    else
        log_error "后端API部署异常 (HTTP $api_status)"
        return 1
    fi
    
    # 检查数据库连接
    local db_status=$(curl -s "$API_BASE_URL/health" | jq -r '.database' 2>/dev/null || echo "unknown")
    if [[ $db_status == "healthy" ]]; then
        log_success "数据库连接正常"
    else
        log_warning "数据库状态: $db_status"
    fi
    
    log_success "部署状态验证完成"
}

# 健康检查
health_check() {
    log_info "执行健康检查..."
    
    # 检查核心API端点
    local endpoints=(
        "/api/homepage/config"
        "/api/homepage/modules"
        "/api/search"
        "/api/security/status"
    )
    
    for endpoint in "${endpoints[@]}"; do
        local response=$(curl -s -o /dev/null -w "%{http_code}" "$API_BASE_URL$endpoint")
        if [[ $response == "200" ]]; then
            log_success "API端点正常: $endpoint"
        else
            log_warning "API端点异常: $endpoint (HTTP $response)"
        fi
    done
    
    log_success "健康检查完成"
}

# 性能基准测试
performance_benchmark() {
    log_info "执行性能基准测试..."
    
    # 首页加载时间测试
    log_info "测试首页加载时间..."
    local start_time=$(date +%s%3N)
    curl -s "$BASE_URL" > /dev/null
    local end_time=$(date +%s%3N)
    local load_time=$((end_time - start_time))
    
    if [[ $load_time -lt 2000 ]]; then
        log_success "首页加载时间: ${load_time}ms (目标<2s) ✅"
    elif [[ $load_time -lt 3000 ]]; then
        log_warning "首页加载时间: ${load_time}ms (目标<2s) ⚠️"
    else
        log_error "首页加载时间: ${load_time}ms (目标<2s) ❌"
    fi
    
    # 搜索性能测试
    log_info "测试搜索性能..."
    start_time=$(date +%s%3N)
    curl -s "$API_BASE_URL/search?q=test" > /dev/null
    end_time=$(date +%s%3N)
    local search_time=$((end_time - start_time))
    
    if [[ $search_time -lt 500 ]]; then
        log_success "搜索响应时间: ${search_time}ms (目标<500ms) ✅"
    elif [[ $search_time -lt 1000 ]]; then
        log_warning "搜索响应时间: ${search_time}ms (目标<500ms) ⚠️"
    else
        log_error "搜索响应时间: ${search_time}ms (目标<500ms) ❌"
    fi
    
    log_success "性能基准测试完成"
}

# 功能验证测试
functional_validation() {
    log_info "执行功能验证测试..."
    
    # 测试搜索功能
    log_info "验证搜索功能..."
    local search_response=$(curl -s "$API_BASE_URL/search?q=心理测试")
    if echo "$search_response" | grep -q "success"; then
        log_success "搜索功能正常"
    else
        log_warning "搜索功能可能存在问题"
    fi
    
    # 测试首页配置
    log_info "验证首页配置..."
    local config_response=$(curl -s "$API_BASE_URL/homepage/config")
    if echo "$config_response" | grep -q "success"; then
        log_success "首页配置加载正常"
    else
        log_warning "首页配置加载可能存在问题"
    fi
    
    
    
    log_success "功能验证测试完成"
}

# 安全验证测试
security_validation() {
    log_info "执行安全验证测试..."
    
    # 测试XSS防护
    log_info "验证XSS防护..."
    local xss_response=$(curl -s -X POST "$API_BASE_URL/security/test" \
        -H "Content-Type: application/json" \
        -d '{"testType":"xss","data":{"input":"<script>alert(1)</script>"}}')
    
    if echo "$xss_response" | grep -q "400"; then
        log_success "XSS防护正常工作"
    else
        log_warning "XSS防护可能存在问题"
    fi
    
    # 测试CSRF防护
    log_info "验证CSRF防护..."
    local csrf_response=$(curl -s -X POST "$API_BASE_URL/homepage/config" \
        -H "Origin: https://malicious-site.com" \
        -d '{"test":"data"}')
    
    if echo "$csrf_response" | grep -q "403"; then
        log_success "CSRF防护正常工作"
    else
        log_warning "CSRF防护可能存在问题"
    fi
    
    # 测试安全头
    log_info "验证安全头..."
    local security_headers=$(curl -s -I "$BASE_URL" | grep -E "(X-Frame-Options|X-XSS-Protection|Content-Security-Policy)")
    if [[ -n "$security_headers" ]]; then
        log_success "安全头设置正常"
    else
        log_warning "安全头设置可能不完整"
    fi
    
    log_success "安全验证测试完成"
}

# SEO验证测试
seo_validation() {
    log_info "执行SEO验证测试..."
    
    # 检查meta标签
    log_info "验证Meta标签..."
    local html_content=$(curl -s "$BASE_URL")
    
    if echo "$html_content" | grep -q "<title>"; then
        log_success "页面标题存在"
    else
        log_warning "页面标题缺失"
    fi
    
    if echo "$html_content" | grep -q 'name="description"'; then
        log_success "页面描述存在"
    else
        log_warning "页面描述缺失"
    fi
    
    # 检查sitemap
    log_info "验证Sitemap..."
    local sitemap_status=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/sitemap.xml")
    if [[ $sitemap_status == "200" ]]; then
        log_success "Sitemap可访问"
    else
        log_warning "Sitemap不可访问 (HTTP $sitemap_status)"
    fi
    
    # 检查robots.txt
    log_info "验证Robots.txt..."
    local robots_status=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/robots.txt")
    if [[ $robots_status == "200" ]]; then
        log_success "Robots.txt可访问"
    else
        log_warning "Robots.txt不可访问 (HTTP $robots_status)"
    fi
    
    log_success "SEO验证测试完成"
}

# 生成验证报告
generate_report() {
    log_info "生成验证报告..."
    
    local report_file="validation-report-$ENVIRONMENT-$(date +%Y%m%d_%H%M%S).json"
    
    cat > "$report_file" << EOF
{
  "environment": "$ENVIRONMENT",
  "timestamp": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "baseUrl": "$BASE_URL",
  "apiBaseUrl": "$API_BASE_URL",
  "validationResults": {
    "deployment": "completed",
    "healthCheck": "completed",
    "performance": "completed",
    "functional": "completed",
    "security": "completed",
    "seo": "completed"
  },
  "summary": "生产环境验证完成，请查看详细日志"
}
EOF
    
    log_success "验证报告已生成: $report_file"
}

# 主验证流程
main() {
    log_info "开始生产环境验证..."
    log_info "环境: $ENVIRONMENT"
    
    setup_environment
    check_dependencies
    validate_deployment
    health_check
    performance_benchmark
    functional_validation
    security_validation
    seo_validation
    generate_report
    
    log_success "生产环境验证完成！"
    log_info "请查看验证报告和日志确认所有测试通过"
}

# 错误处理
trap 'log_error "验证过程中发生错误，退出码: $?"; exit 1' ERR

# 执行主流程
main "$@"
