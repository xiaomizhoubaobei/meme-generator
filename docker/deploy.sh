#!/bin/bash

# meme-generator 部署脚本

set -e

echo "🚀 开始部署 meme-generator..."

# 检查 Docker 是否已安装
if ! command -v docker &> /dev/null; then
    echo "❌ Docker 未安装。请先安装 Docker。"
    exit 1
fi

# 检查 Docker Compose 是否已安装
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose 未安装。请先安装 Docker Compose。"
    exit 1
fi

# 停止现有容器
echo "🛑 停止现有容器..."
docker-compose down 2>/dev/null || true

# 构建新镜像
echo "🔨 构建 Docker 镜像..."
docker-compose build

# 启动容器
echo "▶️  启动容器..."
docker-compose up -d

# 等待服务就绪
echo "⏳ 等待服务就绪..."
sleep 5

# 检查健康状态
echo "🔍 检查服务健康状态..."
if curl -f http://localhost:2233/health > /dev/null 2>&1; then
    echo "✅ 部署成功！服务运行在 http://localhost:2233"
else
    echo "⚠️  部署完成，但健康检查失败。使用以下命令查看日志：docker-compose logs"
fi

echo "📊 查看日志：docker-compose logs -f"
echo "🛑 停止服务：docker-compose down"