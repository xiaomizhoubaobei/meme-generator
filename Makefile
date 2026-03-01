.PHONY: help install build dev dev:api lint format test clean docker:build docker:up docker:down docker:logs

help: ## 显示此帮助信息
	@echo '用法: make [target]'
	@echo ''
	@echo '可用目标:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-20s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

install: ## 安装依赖
	npm install

build: ## 构建 TypeScript 代码
	npm run build

dev: ## 在开发模式下运行 CLI
	npm run dev

dev:api: ## 在开发模式下运行 API 服务器
	npm run dev:api

lint: ## 运行 ESLint
	npm run lint

format: ## 运行 Prettier
	npm run format

test: ## 运行测试
	npm test

clean: ## 清理构建产物
	npm run clean

docker:build: ## 构建 Docker 镜像
	docker build -t meme-generator:latest .

docker:up: ## 启动 Docker 容器
	docker-compose up -d

docker:down: ## 停止 Docker 容器
	docker-compose down

docker:logs: ## 显示 Docker 日志
	docker-compose logs -f

docker:dev: ## 在开发模式下启动 Docker 容器
	docker-compose -f docker-compose.dev.yml up -d

rebuild: clean install build ## 重新构建项目
	@echo "项目重建成功!"