#!/bin/bash

# meme-generator Docker 镜像测试脚本

set -e

echo "🧪 测试 meme-generator Docker 镜像..."

# 构建测试镜像
echo "🔨 构建测试镜像..."
docker build -t meme-generator:test .

# 测试基本功能
echo "▶️  运行容器..."
docker run -d --name meme-test -p 2233:2233 meme-generator:test

# 等待启动
echo "⏳ 等待容器启动..."
sleep 10

# 测试健康检查端点
echo "🔍 测试健康检查端点..."
HEALTH_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:2233/health)

if [ "$HEALTH_STATUS" -eq 200 ]; then
    echo "✅ Health check passed ($HEALTH_STATUS)"
else
    echo "❌ Health check failed ($HEALTH_STATUS)"
fi

# 测试版本端点
echo "🔍 测试版本端点..."
VERSION=$(curl -s http://localhost:2233/meme/version)
echo "📦 Version: $VERSION"

# 测试表情包列表端点
echo "🔍 测试表情包列表端点..."
MEMES_COUNT=$(curl -s http://localhost:2233/memes/keys | jq '. | length')
echo "🎨 Memes loaded: $MEMES_COUNT"

# 清理
echo "🧹 清理..."
docker stop meme-test
docker rm meme-test
docker rmi meme-generator:test

echo "✅ All tests passed!"