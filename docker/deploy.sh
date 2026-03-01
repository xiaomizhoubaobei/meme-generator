#!/bin/bash

# Deployment script for meme-generator

set -e

echo "🚀 Starting deployment of meme-generator..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker-compose down 2>/dev/null || true

# Build new image
echo "🔨 Building Docker image..."
docker-compose build

# Start containers
echo "▶️  Starting containers..."
docker-compose up -d

# Wait for service to be ready
echo "⏳ Waiting for service to be ready..."
sleep 5

# Check health
echo "🔍 Checking service health..."
if curl -f http://localhost:2233/health > /dev/null 2>&1; then
    echo "✅ Deployment successful! Service is running at http://localhost:2233"
else
    echo "⚠️  Deployment completed, but health check failed. Check logs with: docker-compose logs"
fi

echo "📊 View logs: docker-compose logs -f"
echo "🛑 Stop service: docker-compose down"