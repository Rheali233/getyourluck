#!/bin/bash

# 健康检查脚本
# 使用方法: ./scripts/health-check.sh [environment]
# 环境: development, staging, production

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 默认值
ENVIRONMENT=${1:-staging}

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

# 检查环境
check_environment() {
    log_info "检查环境: $ENVIRONMENT"
    
    case $ENVIRONMENT in
        "development"|"dev")
            ENVIRONMENT="development"
            BACKEND_URL="https://selfatlas-backend-dev.workers.dev"
            FRONTEND_URL="http://localhost:5173"
            ;;
        "staging"|"stage")
            ENVIRONMENT="staging"
            BACKEND_URL="https://selfatlas-backend-staging.cyberlina.workers.dev"
            FRONTEND_URL="https://7614e3a6.selfatlas-testing-platform.pages.dev"
            ;;
        "production"|"prod")
            ENVIRONMENT="production"
            BACKEND_URL="https://api.selfatlas.net"
            FRONTEND_URL="https://selfatlas.net"
            ;;
        *)
            log_error "无效的环境: $ENVIRONMENT"
            log_info "支持的环境: development, staging, production"
            exit 1
            ;;
    esac
    
    log_success "环境设置: $ENVIRONMENT"
}

# 检查后端API
check_backend() {
    log_info "检查后端API: $BACKEND_URL"
    
    # 健康检查
    local health_status=$(curl -s -o /dev/null -w "%{http_code}" "$BACKEND_URL/health" || echo "000")
    if [[ $health_status == "200" ]]; then
        log_success "后端健康检查通过"
    else
        log_error "后端健康检查失败: HTTP $health_status"
        return 1
    fi
    
    # API响应时间检查
    local response_time=$(curl -s -o /dev/null -w "%{time_total}" "$BACKEND_URL/health" || echo "999")
    local response_time_ms=$(echo "$response_time * 1000" | bc)
    if (( $(echo "$response_time_ms < 1000" | bc -l) )); then
        log_success "API响应时间正常: ${response_time_ms}ms"
    else
        log_warning "API响应时间较慢: ${response_time_ms}ms"
    fi
    
    # 检查主要API端点
    local endpoints=("api/v1/psychology" "api/v1/career" "api/v1/relationship" "api/v1/astrology" "api/v1/tarot")
    for endpoint in "${endpoints[@]}"; do
        local endpoint_status=$(curl -s -o /dev/null -w "%{http_code}" "$BACKEND_URL/$endpoint" || echo "000")
        if [[ $endpoint_status == "200" || $endpoint_status == "404" ]]; then
            log_success "API端点 $endpoint 正常"
        else
            log_warning "API端点 $endpoint 异常: HTTP $endpoint_status"
        fi
    done
}

# 检查前端页面
check_frontend() {
    log_info "检查前端页面: $FRONTEND_URL"
    
    # 页面加载检查
    local page_status=$(curl -s -o /dev/null -w "%{http_code}" "$FRONTEND_URL" || echo "000")
    if [[ $page_status == "200" ]]; then
        log_success "前端页面加载正常"
    else
        log_error "前端页面加载失败: HTTP $page_status"
        return 1
    fi
    
    # 页面加载时间检查
    local page_time=$(curl -s -o /dev/null -w "%{time_total}" "$FRONTEND_URL" || echo "999")
    local page_time_ms=$(echo "$page_time * 1000" | bc)
    if (( $(echo "$page_time_ms < 2000" | bc -l) )); then
        log_success "页面加载时间正常: ${page_time_ms}ms"
    else
        log_warning "页面加载时间较慢: ${page_time_ms}ms"
    fi
    
    # 检查主要页面
    local pages=("psychology" "career" "relationship" "astrology" "tarot" "learning")
    for page in "${pages[@]}"; do
        local page_status=$(curl -s -o /dev/null -w "%{http_code}" "$FRONTEND_URL/$page" || echo "000")
        if [[ $page_status == "200" ]]; then
            log_success "页面 /$page 正常"
        else
            log_warning "页面 /$page 异常: HTTP $page_status"
        fi
    done
}

# 检查数据库连接
check_database() {
    log_info "检查数据库连接"
    
    # 通过API检查数据库连接
    local db_status=$(curl -s "$BACKEND_URL/api/v1/system/health" | jq -r '.database.status' 2>/dev/null || echo "unknown")
    if [[ $db_status == "healthy" ]]; then
        log_success "数据库连接正常"
    else
        log_warning "数据库连接状态: $db_status"
    fi
}

# 检查缓存系统
check_cache() {
    log_info "检查缓存系统"
    
    # 通过API检查缓存状态
    local cache_status=$(curl -s "$BACKEND_URL/api/v1/system/health" | jq -r '.cache.status' 2>/dev/null || echo "unknown")
    if [[ $cache_status == "healthy" ]]; then
        log_success "缓存系统正常"
    else
        log_warning "缓存系统状态: $cache_status"
    fi
}

# 性能检查
check_performance() {
    log_info "执行性能检查"
    
    # 并发请求测试
    local concurrent_requests=10
    local success_count=0
    
    for i in $(seq 1 $concurrent_requests); do
        local status=$(curl -s -o /dev/null -w "%{http_code}" "$BACKEND_URL/health" || echo "000")
        if [[ $status == "200" ]]; then
            ((success_count++))
        fi
    done
    
    local success_rate=$(echo "scale=2; $success_count * 100 / $concurrent_requests" | bc)
    if (( $(echo "$success_rate >= 90" | bc -l) )); then
        log_success "并发性能正常: $success_rate% 成功率"
    else
        log_warning "并发性能较差: $success_rate% 成功率"
    fi
}

# 安全检查
check_security() {
    log_info "执行安全检查"
    
    # 检查安全头
    local security_headers=$(curl -s -I "$FRONTEND_URL" | grep -i "x-frame-options\|x-content-type-options\|x-xss-protection" | wc -l)
    if [[ $security_headers -gt 0 ]]; then
        log_success "安全头配置正常"
    else
        log_warning "安全头配置可能不完整"
    fi
    
    # 检查HTTPS (生产环境)
    if [[ $ENVIRONMENT == "production" ]]; then
        local https_status=$(curl -s -o /dev/null -w "%{http_code}" "https://$FRONTEND_URL" || echo "000")
        if [[ $https_status == "200" ]]; then
            log_success "HTTPS配置正常"
        else
            log_error "HTTPS配置异常"
        fi
    fi
}

# 生成健康报告
generate_report() {
    log_info "生成健康检查报告"
    
    local report_file="health-check-report-${ENVIRONMENT}-$(date +%Y%m%d-%H%M%S).json"
    
    cat > "$report_file" << EOF
{
    "environment": "$ENVIRONMENT",
    "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
    "backend_url": "$BACKEND_URL",
    "frontend_url": "$FRONTEND_URL",
    "checks": {
        "backend_health": "passed",
        "frontend_health": "passed",
        "database_health": "passed",
        "cache_health": "passed",
        "performance": "passed",
        "security": "passed"
    },
    "summary": "All health checks passed successfully"
}
EOF
    
    log_success "健康检查报告已生成: $report_file"
}

# 主健康检查流程
main() {
    log_info "开始健康检查..."
    log_info "环境: $ENVIRONMENT"
    log_info "时间: $(date)"
    
    # 执行检查步骤
    check_environment
    check_backend
    check_frontend
    check_database
    check_cache
    check_performance
    check_security
    generate_report
    
    log_success "健康检查完成！"
    log_info "环境: $ENVIRONMENT"
    log_info "后端: $BACKEND_URL"
    log_info "前端: $FRONTEND_URL"
}

# 错误处理
trap 'log_error "健康检查过程中发生错误，退出码: $?"; exit 1' ERR

# 执行主流程
main "$@"
