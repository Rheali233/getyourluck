#!/bin/bash

# 生产环境部署脚本
# 使用方法: ./scripts/deploy.sh [environment] [version]

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 默认值
ENVIRONMENT=${1:-staging}
VERSION=${2:-$(git rev-parse --short HEAD)}
DEPLOY_TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

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

# 检查依赖
check_dependencies() {
    log_info "检查部署依赖..."
    
    if ! command -v wrangler &> /dev/null; then
        log_error "wrangler 未安装，请先安装 Cloudflare CLI"
        exit 1
    fi
    
    if ! command -v pnpm &> /dev/null; then
        log_error "pnpm 未安装，请先安装 pnpm"
        exit 1
    fi
    
    if ! command -v git &> /dev/null; then
        log_error "git 未安装"
        exit 1
    fi
    
    log_success "依赖检查完成"
}

# 检查环境
check_environment() {
    log_info "检查部署环境: $ENVIRONMENT"
    
    case $ENVIRONMENT in
        "development"|"dev")
            ENVIRONMENT="development"
            ;;
        "staging"|"stage")
            ENVIRONMENT="staging"
            ;;
        "production"|"prod")
            ENVIRONMENT="production"
            ;;
        *)
            log_error "无效的环境: $ENVIRONMENT"
            log_info "支持的环境: development, staging, production"
            exit 1
            ;;
    esac
    
    log_success "环境设置: $ENVIRONMENT"
}

# 检查Git状态
check_git_status() {
    log_info "检查Git状态..."
    
    if [[ -n $(git status --porcelain) ]]; then
        log_warning "工作目录有未提交的更改"
        read -p "是否继续部署? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            log_info "部署已取消"
            exit 0
        fi
    fi
    
    if [[ $ENVIRONMENT == "production" ]]; then
        if [[ $(git branch --show-current) != "main" ]]; then
            log_error "生产环境部署必须在 main 分支上进行"
            exit 1
        fi
    fi
    
    log_success "Git状态检查完成"
}

# 安装依赖
install_dependencies() {
    log_info "安装项目依赖..."
    
    # 安装前端依赖
    cd comprehensive-testing-platform/frontend
    pnpm install --frozen-lockfile
    cd ../..
    
    # 安装后端依赖
    cd comprehensive-testing-platform/backend
    pnpm install --frozen-lockfile
    cd ../..
    
    log_success "依赖安装完成"
}

# 运行测试
run_tests() {
    log_info "运行测试..."
    
    # 前端测试
    cd comprehensive-testing-platform/frontend
    pnpm test:ci
    cd ../..
    
    # 后端测试
    cd comprehensive-testing-platform/backend
    pnpm test:ci
    cd ../..
    
    log_success "测试完成"
}

# 构建项目
build_project() {
    log_info "构建项目..."
    
    # 构建前端
    cd comprehensive-testing-platform/frontend
    pnpm build
    cd ../..
    
    # 构建后端
    cd comprehensive-testing-platform/backend
    pnpm build
    cd ../..
    
    log_success "构建完成"
}

# 部署前端
deploy_frontend() {
    log_info "部署前端到 Cloudflare Pages..."
    
    cd comprehensive-testing-platform/frontend
    
    # 设置环境变量
    export NODE_ENV=$ENVIRONMENT
    
    # 部署到Cloudflare Pages
    wrangler pages deploy dist \
        --project-name="getyourluck-frontend-$ENVIRONMENT" \
        --branch="$ENVIRONMENT" \
        --commit-dirty=true
    
    cd ../..
    
    log_success "前端部署完成"
}

# 部署后端
deploy_backend() {
    log_info "部署后端到 Cloudflare Workers..."
    
    cd comprehensive-testing-platform/backend
    
    # 部署到Cloudflare Workers
    wrangler deploy --env $ENVIRONMENT
    
    cd ../..
    
    log_success "后端部署完成"
}

# 数据库迁移
migrate_database() {
    log_info "执行数据库迁移..."
    
    cd comprehensive-testing-platform/backend
    
    # 执行数据库迁移
    wrangler d1 execute "getyourluck-$ENVIRONMENT" \
        --file="./scripts/setup-production-db.sql" \
        --env $ENVIRONMENT
    
    cd ../..
    
    log_success "数据库迁移完成"
}

# 配置KV存储
setup_kv_storage() {
    log_info "配置KV存储..."
    
    cd comprehensive-testing-platform/backend
    
    # 创建KV命名空间（如果不存在）
    wrangler kv:namespace create "getyourluck-$ENVIRONMENT-cache" \
        --env $ENVIRONMENT || true
    
    # 设置KV配置
    wrangler kv:bulk put \
        --env $ENVIRONMENT \
        --preview=false \
        --prefix="config:" \
        ./scripts/kv-config.json
    
    cd ../..
    
    log_success "KV存储配置完成"
}

# 配置R2存储
setup_r2_storage() {
    log_info "配置R2存储..."
    
    cd comprehensive-testing-platform/backend
    
    # 创建R2存储桶（如果不存在）
    wrangler r2 bucket create "getyourluck-$ENVIRONMENT-storage" \
        --env $ENVIRONMENT || true
    
    # 设置R2策略
    wrangler r2 bucket put-bucket-policy \
        --env $ENVIRONMENT \
        "getyourluck-$ENVIRONMENT-storage" \
        ./scripts/r2-policy.json
    
    cd ../..
    
    log_success "R2存储配置完成"
}

# 健康检查
health_check() {
    log_info "执行健康检查..."
    
    local base_url=""
    case $ENVIRONMENT in
        "development")
            base_url="https://dev.getyourluck.com"
            ;;
        "staging")
            base_url="https://staging.getyourluck.com"
            ;;
        "production")
            base_url="https://getyourluck.com"
            ;;
    esac
    
    # 检查前端
    local frontend_status=$(curl -s -o /dev/null -w "%{http_code}" "$base_url")
    if [[ $frontend_status == "200" ]]; then
        log_success "前端健康检查通过"
    else
        log_error "前端健康检查失败: HTTP $frontend_status"
        return 1
    fi
    
    # 检查后端API
    local api_base_url="${base_url//www./api.}"
    local api_status=$(curl -s -o /dev/null -w "%{http_code}" "$api_base_url/health")
    if [[ $api_status == "200" ]]; then
        log_success "后端API健康检查通过"
    else
        log_error "后端API健康检查失败: HTTP $api_status"
        return 1
    fi
    
    log_success "健康检查完成"
}

# 清理
cleanup() {
    log_info "清理临时文件..."
    
    # 清理构建产物
    rm -rf comprehensive-testing-platform/frontend/dist
    rm -rf comprehensive-testing-platform/backend/dist
    
    log_success "清理完成"
}

# 部署后处理
post_deploy() {
    log_info "执行部署后处理..."
    
    # 创建部署标签
    git tag "deploy-$ENVIRONMENT-$VERSION-$DEPLOY_TIMESTAMP"
    git push origin "deploy-$ENVIRONMENT-$VERSION-$DEPLOY_TIMESTAMP"
    
    # 更新部署状态
    echo "{
        \"environment\": \"$ENVIRONMENT\",
        \"version\": \"$VERSION\",
        \"timestamp\": \"$DEPLOY_TIMESTAMP\",
        \"status\": \"success\",
        \"commit\": \"$(git rev-parse HEAD)\",
        \"branch\": \"$(git branch --show-current)\"
    }" > "deploy-status-$ENVIRONMENT.json"
    
    log_success "部署后处理完成"
}

# 主部署流程
main() {
    log_info "开始部署流程..."
    log_info "环境: $ENVIRONMENT"
    log_info "版本: $VERSION"
    log_info "时间戳: $DEPLOY_TIMESTAMP"
    
    # 执行部署步骤
    check_dependencies
    check_environment
    check_git_status
    install_dependencies
    run_tests
    build_project
    deploy_frontend
    deploy_backend
    migrate_database
    setup_kv_storage
    setup_r2_storage
    health_check
    cleanup
    post_deploy
    
    log_success "部署完成！"
    log_info "环境: $ENVIRONMENT"
    log_info "版本: $VERSION"
    log_info "时间戳: $DEPLOY_TIMESTAMP"
}

# 错误处理
trap 'log_error "部署过程中发生错误，退出码: $?"; exit 1' ERR

# 执行主流程
main "$@"
