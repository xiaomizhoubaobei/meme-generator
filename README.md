# Meme Generator (Node.js)

一个基于Node.js和TypeScript的表情包生成器API服务，支持300+内置表情模板。

## 特性

- 🎨 支持300+内置表情模板
- 🚀 高性能图像处理（基于Sharp）
- 🌐 REST API服务（API优先设计）
- 💻 仅API模式
- 🐳 Docker容器化部署
- 📝 TypeScript类型安全
- 📄 自动API文档 (/docs)

## 快速开始

### 安装

```bash
# 克隆仓库
git clone https://github.com/xiaomizhoubaobei/meme-generator.git
cd meme-generator

# 安装依赖
npm install

# 构建项目
npm run build
```

### 启动API服务器

```bash
# 开发模式运行API服务器
npm run dev:api

# 或者生产模式运行
npm start
```

### REST API

```bash
# 启动服务器
npm run dev:api

# API端点
GET  /meme/version              # 获取版本信息
GET  /memes/keys                # 获取所有表情键
GET  /memes/:key/info           # 获取表情详情
GET  /memes/:key/preview        # 生成表情预览
POST /memes/:key                # 生成表情（上传图片）
GET  /health                    # 健康检查
GET  /docs                      # API文档
```

### 示例：使用curl生成表情

```bash
# 生成petpet表情
curl -X POST http://localhost:8080/memes/petpet \
  -F "images=@/path/to/image.jpg" \
  -o result.png
```

### 示例：使用curl查看API文档

```bash
# 获取API文档
curl http://localhost:8080/docs

# 获取所有表情包列表
curl http://localhost:8080/memes/keys

# 获取特定表情包信息
curl http://localhost:8080/memes/petpet/info
```

## Docker部署

### 使用 Docker Compose（推荐）

```bash
# 生产环境
docker-compose up -d

# 开发环境（支持热重载）
docker-compose -f docker-compose.dev.yml up -d

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

### 使用 Docker 命令

```bash
# 构建Docker镜像
docker build -t meme-generator:latest .

# 运行容器
docker run -d \
  --name meme-generator \
  -p 8080:8080 \
  -v $(pwd)/data/memes:/data/memes \
  -v $(pwd)/logs:/app/logs \
  -e TZ=Asia/Shanghai \
  -e LOG_LEVEL=INFO \
  meme-generator:latest

# 查看日志
docker logs -f meme-generator

# 停止容器
docker stop meme-generator
docker rm meme-generator
```

## 配置

通过环境变量或配置文件配置：

```bash
# .env 文件
SERVER_HOST=0.0.0.0
SERVER_PORT=8080
LOAD_BUILTIN_MEMES=true
MEME_DIRS=["/data/memes"]
GIF_MAX_SIZE=10.0
GIF_MAX_FRAMES=100
LOG_LEVEL=INFO
```

## API文档

启动服务后，访问 `http://localhost:8080/docs` 查看详细的API文档和使用示例。

## 表情模板

当前已实现的核心表情模板：

1. **petpet** - 摸摸表情
2. **always** - 总是表情
3. **slap** - 打脸表情
4. **rip** - 安息表情
5. **kiss** - 亲亲表情
6. **punch** - 拳击表情
7. **shock** - 震惊表情
8. **thumbsup** - 点赞表情
9. **facepalm** - 扶额表情
10. **dance** - 跳舞表情

更多表情模板正在迁移中...（共285个模板）

## 开发

```bash
# 开发模式运行API服务器
npm run dev:api

# 代码检查
npm run lint

# 代码格式化
npm run format

# 运行测试
npm test
```

## 技术栈

- **Node.js** 18+
- **TypeScript** 5.3+
- **Express.js** - Web框架
- **Sharp** - 图像处理
- **Multer** - 文件上传处理
- **Winston** - 日志系统
- **Zod** - 数据验证

## 许可证

AGPL-3.0 License

## 贡献

欢迎提交Issue和Pull Request！请参阅 [CONTRIBUTING.md](CONTRIBUTING.md) 了解更多信息。
