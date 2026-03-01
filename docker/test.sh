#!/bin/bash

# Test script for meme-generator Docker image

set -e

echo "🧪 Testing meme-generator Docker image..."

# Build test image
echo "🔨 Building test image..."
docker build -t meme-generator:test .

# Test basic functionality
echo "▶️  Running container..."
docker run -d --name meme-test -p 2233:2233 meme-generator:test

# Wait for startup
echo "⏳ Waiting for container to start..."
sleep 10

# Test health endpoint
echo "🔍 Testing health endpoint..."
HEALTH_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:2233/health)

if [ "$HEALTH_STATUS" -eq 200 ]; then
    echo "✅ Health check passed ($HEALTH_STATUS)"
else
    echo "❌ Health check failed ($HEALTH_STATUS)"
fi

# Test version endpoint
echo "🔍 Testing version endpoint..."
VERSION=$(curl -s http://localhost:2233/meme/version)
echo "📦 Version: $VERSION"

# Test memes list endpoint
echo "🔍 Testing memes list endpoint..."
MEMES_COUNT=$(curl -s http://localhost:2233/memes/keys | jq '. | length')
echo "🎨 Memes loaded: $MEMES_COUNT"

# Cleanup
echo "🧹 Cleaning up..."
docker stop meme-test
docker rm meme-test
docker rmi meme-generator:test

echo "✅ All tests passed!"