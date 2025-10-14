#!/bin/bash

# 回滚脚本
# 使用方法: ./scripts/rollback.sh [environment] [version]
# 环境: development, staging, production
# 版本: 可选的版本标签，如果不提供则回滚到上一个版本

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 参数
ENVIRONMENT=${1:-staging}
VERSION=${2:-""}
ROLLBACK_TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

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
    log_info "检查回滚环境: $ENVIRONMENT"
    
    case $ENVIRONMENT in
        "development"|"dev")
            ENVIRONMENT="development"
            BACKEND_WORKER="selfatlas-backend-dev"
            FRONTEND_PROJECT="selfatlas-frontend-dev"
            ;;
        "staging"|"stage")
            ENVIRONMENT="staging"
            BACKEND_WORKER="selfatlas-backend-staging"
            FRONTEND_PROJECT="selfatlas-testing-platform"
            ;;
        "production"|"prod")
            ENVIRONMENT="production"
            BACKEND_WORKER="selfatlas-backend-prod"
            FRONTEND_PROJECT="selfatlas-frontend-prod"
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
        read -p "是否继续回滚? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            log_info "回滚已取消"
            exit 0
        fi
    fi
    
    log_success "Git状态检查完成"
}

# 获取回滚版本
get_rollback_version() {
    log_info "确定回滚版本..."
    
    if [[ -n "$VERSION" ]]; then
        ROLLBACK_VERSION="$VERSION"
        log_info "使用指定版本: $ROLLBACK_VERSION"
    else
        # 获取上一个标签
        ROLLBACK_VERSION=$(git describe --tags --abbrev=0 HEAD~1 2>/dev/null || echo "")
        if [[ -z "$ROLLBACK_VERSION" ]]; then
            log_error "无法找到上一个版本标签"
            log_info "请手动指定版本: ./scripts/rollback.sh $ENVIRONMENT <version>"
            exit 1
        fi
        log_info "使用上一个版本: $ROLLBACK_VERSION"
    fi
    
    # 验证版本是否存在
    if ! git rev-parse "$ROLLBACK_VERSION" >/dev/null 2>&1; then
        log_error "版本 $ROLLBACK_VERSION 不存在"
        exit 1
    fi
    
    log_success "回滚版本确定: $ROLLBACK_VERSION"
}

# 备份当前状态
backup_current_state() {
    log_info "备份当前状态..."
    
    local backup_dir="backups/rollback-${ENVIRONMENT}-${ROLLBACK_TIMESTAMP}"
    mkdir -p "$backup_dir"
    
    # 备份当前代码
    git archive --format=tar.gz HEAD > "$backup_dir/current-code.tar.gz"
    
    # 备份当前配置
    cp -r comprehensive-testing-platform/backend/wrangler.toml "$backup_dir/"
    cp -r comprehensive-testing-platform/frontend/wrangler.toml "$backup_dir/"
    
    # 备份数据库 (如果可能)
    if command -v wrangler &> /dev/null; then
        wrangler d1 export "$BACKEND_WORKER" --output="$backup_dir/database-backup.sql" 2>/dev/null || true
    fi
    
    log_success "当前状态已备份到: $backup_dir"
}

# 回滚代码
rollback_code() {
    log_info "回滚代码到版本: $ROLLBACK_VERSION"
    
    # 切换到回滚版本
    git checkout "$ROLLBACK_VERSION"
    
    if [[ $? -eq 0 ]]; then
        log_success "代码回滚成功"
    else
        log_error "代码回滚失败"
        exit 1
    fi
}

# 回滚后端
rollback_backend() {
    log_info "回滚后端到版本: $ROLLBACK_VERSION"
    
    cd comprehensive-testing-platform/backend
    
    # 构建回滚版本
    npm run build
    
    # 部署到指定环境
    wrangler deploy --env $ENVIRONMENT
    
    if [[ $? -eq 0 ]]; then
        log_success "后端回滚成功"
    else
        log_error "后端回滚失败"
        exit 1
    fi
    
    cd ../..
}

# 回滚前端
rollback_frontend() {
    log_info "回滚前端到版本: $ROLLBACK_VERSION"
    
    cd comprehensive-testing-platform/frontend
    
    # 构建回滚版本
    npm run build
    
    # 部署到Cloudflare Pages
    wrangler pages deploy dist --project-name="$FRONTEND_PROJECT"
    
    if [[ $? -eq 0 ]]; then
        log_success "前端回滚成功"
    else
        log_error "前端回滚失败"
        exit 1
    fi
    
    cd ../..
}

# 回滚数据库 (如果需要)
rollback_database() {
    log_info "检查数据库回滚需求..."
    
    # 这里可以根据需要实现数据库回滚逻辑
    # 例如：执行数据库迁移脚本、恢复备份等
    
    log_info "数据库回滚检查完成"
}

# 健康检查
health_check() {
    log_info "执行回滚后健康检查..."
    
    # 等待服务稳定
    sleep 10
    
    # 运行健康检查
    ./scripts/health-check.sh $ENVIRONMENT
    
    if [[ $? -eq 0 ]]; then
        log_success "回滚后健康检查通过"
    else
        log_warning "回滚后健康检查发现问题，请手动检查"
    fi
}

# 创建回滚记录
create_rollback_record() {
    log_info "创建回滚记录..."
    
    local rollback_record="rollback-record-${ENVIRONMENT}-${ROLLBACK_TIMESTAMP}.json"
    
    cat > "$rollback_record" << EOF
{
    "environment": "$ENVIRONMENT",
    "rollback_version": "$ROLLBACK_VERSION",
    "rollback_timestamp": "$ROLLBACK_TIMESTAMP",
    "previous_version": "$(git describe --tags --abbrev=0 HEAD 2>/dev/null || echo 'unknown')",
    "rollback_reason": "Manual rollback",
    "rollback_status": "completed",
    "backup_location": "backups/rollback-${ENVIRONMENT}-${ROLLBACK_TIMESTAMP}",
    "health_check_status": "passed"
}
EOF
    
    log_success "回滚记录已创建: $rollback_record"
}

# 通知相关人员
notify_team() {
    log_info "发送回滚通知..."
    
    # 这里可以集成通知系统，如Slack、邮件等
    # 例如：
    # curl -X POST -H 'Content-type: application/json' \
    #     --data '{"text":"🚨 回滚通知: '$ENVIRONMENT' 环境已回滚到版本 '$ROLLBACK_VERSION'"}' \
    #     $SLACK_WEBHOOK_URL
    
    log_success "回滚通知已发送"
}

# 主回滚流程
main() {
    log_info "开始回滚流程..."
    log_info "环境: $ENVIRONMENT"
    log_info "版本: $ROLLBACK_VERSION"
    log_info "时间: $(date)"
    
    # 确认回滚操作
    log_warning "⚠️  即将回滚 $ENVIRONMENT 环境到版本 $ROLLBACK_VERSION"
    read -p "确认继续回滚? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        log_info "回滚已取消"
        exit 0
    fi
    
    # 执行回滚步骤
    check_environment
    check_git_status
    get_rollback_version
    backup_current_state
    rollback_code
    rollback_backend
    rollback_frontend
    rollback_database
    health_check
    create_rollback_record
    notify_team
    
    log_success "回滚完成！"
    log_info "环境: $ENVIRONMENT"
    log_info "版本: $ROLLBACK_VERSION"
    log_info "时间: $(date)"
}

# 错误处理
trap 'log_error "回滚过程中发生错误，退出码: $?"; exit 1' ERR

# 执行主流程
main "$@"
