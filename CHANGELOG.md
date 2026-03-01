# 更新日志

本项目的所有重要变更都将记录在此文件中。

## [0.0.1] - 2026-03-01

### 新增
- Meme Generator 的 Node.js/TypeScript 实现
- 基于 Express.js 的 REST API 支持
- 基于 Commander.js 的 CLI 工具
- Docker 支持，采用多阶段构建
- 开发和生产环境的 Docker 配置
- 健康检查支持
- 完整的文档

### 技术详情
- **Node.js**: 18+
- **TypeScript**: 5.3+
- **框架**: Express.js
- **图像处理**: Sharp
- **构建工具**: Docker 多阶段构建

### Docker 镜像
- 优化的多阶段 Dockerfile
- 支持开发和生产环境
- 包含健康检查
- 支持自定义表情和日志的卷挂载
