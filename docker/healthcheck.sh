#!/bin/sh

# meme-generator 的健康检查脚本
# 健康时返回 0，不健康时返回 1

HEALTH_URL="${HEALTH_URL:-http://localhost:2233/health}"

# 尝试连接健康检查端点
if curl -f -s -o /dev/null "$HEALTH_URL"; then
    echo "健康检查通过"
    exit 0
else
    echo "健康检查失败"
    exit 1
fi