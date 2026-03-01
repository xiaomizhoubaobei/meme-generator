# Quick Start Guide

快速开始使用 Meme Generator (Node.js)

## 前置要求

- Node.js 18+
- npm 或 yarn
- Docker (可选)

## 1. 本地安装

```bash
# 克隆项目
git clone https://github.com/xiaomizhoubaobei/meme-generator.git
cd meme-generator

# 安装依赖
npm install

# 构建项目
npm run build
```

## 2. 运行CLI

```bash
# 查看所有可用命令
npm run dev -- --help

# 列出所有表情
npm run dev list

# 查看特定表情详情
npm run dev info petpet

# 生成表情预览
npm run dev preview petpet

# 制作表情
npm run dev generate petpet -i /path/to/image.jpg

# 启动Web服务器
npm run dev run
```

## 3. 使用API

```bash
# 启动API服务器
npm run dev:api

# 在另一个终端测试API
curl http://localhost:2233/meme/version
curl http://localhost:2233/memes/keys
curl http://localhost:2233/memes/petpet/info
```

## 4. Docker部署

### 快速启动

```bash
# 使用docker-compose
docker-compose up -d

# 查看日志
docker-compose logs -f
```

### 自定义配置

```bash
# 编辑环境变量
cp .env.example .env
vi .env

# 启动服务
docker-compose up -d
```

## 5. 常见问题

### 端口被占用

```bash
# 修改docker-compose.yml中的端口映射
ports:
  - "8080:2233"  # 将2233改为8080
```

### 依赖安装失败

```bash
# 清除缓存重新安装
rm -rf node_modules package-lock.json
npm install
```

### Docker构建失败

```bash
# 清除Docker缓存重新构建
docker system prune -a
docker-compose build --no-cache
```

## 6. 下一步

- 阅读 [README.md](README.md) 了解完整功能
- 查看 [CONTRIBUTING.md](CONTRIBUTING.md) 了解如何贡献
- 查看 [API文档](https://github.com/xiaomizhoubaobei/meme-generator/wiki) 了解API详情

## 7. 获取帮助

- 提交 Issue: https://github.com/xiaomizhoubaobei/meme-generator/issues
- 查看文档: https://github.com/xiaomizhoubaobei/meme-generator/wiki