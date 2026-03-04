# 表情包生成器 API

![Python](https://img.shields.io/badge/Python-3.10+-blue.svg)
![License](https://img.shields.io/badge/License-AGPL--3.0-orange.svg)
![Docker](https://img.shields.io/badge/Docker-Multi--platform-blue?logo=docker)
![GitHub Repo stars](https://img.shields.io/github/stars/xiaomizhoubaobei/meme-generator)
![GitHub forks](https://img.shields.io/github/forks/xiaomizhoubaobei/meme-generator)
![GitHub watchers](https://img.shields.io/github/watchers/xiaomizhoubaobei/meme-generator)
[![GitHub issues](https://img.shields.io/github/issues/xiaomizhoubaobei/meme-generator)](https://github.com/xiaomizhoubaobei/meme-generator/issues)
[![GitHub license](https://img.shields.io/github/license/xiaomizhoubaobei/meme-generator)](https://github.com/xiaomizhoubaobei/meme-generator/blob/main/LICENSE)
[![GitHub release (latest by date)](https://img.shields.io/github/v/release/xiaomizhoubaobei/meme-generator)](https://github.com/xiaomizhoubaobei/meme-generator/releases)
[![Commit Activity](https://img.shields.io/github/commit-activity/w/xiaomizhoubaobei/meme-generator)](https://github.com/xiaomizhoubaobei/meme-generator)
![GitHub last commit](https://img.shields.io/github/last-commit/xiaomizhoubaobei/meme-generator)
![GitHub contributors](https://img.shields.io/github/contributors/xiaomizhoubaobei/meme-generator)
![Python Version](https://img.shields.io/badge/Python-3.12+-blue.svg)
![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)
![Status](https://img.shields.io/badge/status-active-success.svg)
![Code Review](https://img.shields.io/badge/code_review-100%25-brightgreen.svg)
![Repo Size](https://img.shields.io/github/repo-size/xiaomizhoubaobei/meme-generator.svg)

这是一个功能强大的 Python 表情包生成器服务，提供丰富的表情包模板和灵活的图像处理功能。支持通过 CLI 命令行工具和 RESTful API 两种方式使用，方便集成到各种应用场景中。

## ✨ 功能特点

- 🎨 **丰富的表情模板**：内置 300+ 种表情包模板，涵盖各种流行表情和梗图
- 🖼️ **灵活的图像处理**：支持自定义图片上传、文字输入和各种参数配置
- 🌐 **多种使用方式**：支持RESTful API 使用方式
- 🚀 **易于部署**：提供 Docker 镜像，支持多平台（amd64/arm64），一键部署
- 🔧 **高度可定制**：每个表情包都可以配置不同的参数、图片数量和文字内容
- 📦 **现代化技术栈**：基于 FastAPI、Pillow 等现代化 Python 库构建
- 🔐 **安全可信**：Docker 镜像使用 cosign 进行数字签名，确保完整性和可信度

## 📋 目录

- [安装](#安装)
- [启动服务](#启动服务)
- [Docker 使用](#docker-使用)
- [项目结构](#项目结构)
- [许可证](#许可证)
- [相关链接](#相关链接)

## 安装

### 直接运行源代码

```bash
# 克隆当前仓库
git clone https://github.com/xiaomizhoubaobei/meme-generator
cd meme-generator

# 通过 python -m meme_generator.app 运行 web 服务器
python -m meme_generator.app

# 通过 python -m meme_generator.cli meme 运行命令行程序
python -m meme_generator.cli meme
```

#### 图片下载

由于表情包图片体积较大，meme-generator 包含的表情中的图片并不随代码一起打包，需要在安装后手动下载。

如果是以 pip 方式安装的，可以运行如下命令下载：

```bash
meme download
```

如果是直接克隆仓库，则不需要额外下载。

#### 字体安装

为确保表情包中的文字生成正常，需要将仓库中的字体自行安装到系统中。

仓库中的字体位于 `resources/fonts`

不同系统的字体安装方式：

**Windows:**

- 双击通过字体查看器安装
- 或者直接复制到字体文件夹：`C:\Windows\Fonts`

**Linux:**

- 在 `/usr/share/fonts` 目录下新建文件夹，如 `myfonts`，将字体文件复制到该路径下
- 运行如下命令建立字体缓存：`fc-cache -fv`

建议安装 Noto Color Emoji 字体以支持 emoji，对于 Ubuntu 系统可以通过 apt 安装：

```bash
sudo apt install fonts-noto-color-emoji
```

**Mac:**

- 使用字体册打开字体文件安装

**具体字体及对应的表情如下：**

| 字体名 | 字体文件名 | 用到该字体的表情 | 备注 |
|--------|-----------|-----------------|------|
| Consolas | consola.ttf | charpic | |
| FZKaTong-M19S | FZKATJW.ttf | capoo_say、thermometer_gun | 方正卡通 |
| FZXS14 | FZXS14.ttf | nokia | 方正像素 14 |
| FZSJ-QINGCRJ | FZSJ-QINGCRJ.ttf | psyduck、nijika_holdsign | 方正手迹-青春日记 |
| FZShaoEr-M11S | FZSEJW.ttf | raise_sign、nekoha_holdsign、atri_pillow、kokona_seal | 方正少儿 |
| Noto Sans SC | NotoSansSC-Regular.ttf | 5000choyen | |
| Noto Serif SC | NotoSerifSC-Regular.otf | 5000choyen | |
| HiraginoMin | HiraginoMin-W5-90-RKSJ-H-2.ttc | oshi_no_ko | 明朝体 |
| Aller | Aller_Bd.ttf | osu | |
| Ro GSan Serif Std | RoGSanSrfStd-Bd.otf | bluearchive | |
| Glow Sans SC | GlowSansSC-Normal-Heavy.otf | bluearchive | 未来荧黑 |
| PangMenZhengDao-Cu | 庞门正道粗书体.ttf | ace_attorney_dialog | |
| Neo Sans | Neo Sans Bold.ttf | intel_inside | |

### 🐳 推荐：使用 Docker（最简单的方式）

我们强烈推荐使用 Docker 来运行本项目，因为它具有以下优点：
- **简单快捷**：无需配置 Python 环境和依赖库
- **环境隔离**：避免依赖冲突和环境配置问题
- **多平台支持**：支持 amd64/arm64 架构，适配不同硬件平台
- **一致性**：开发、测试、生产环境保持一致

跳转到 [Docker 使用](#docker-使用) 部分查看详细的 Docker 部署说明。

### 使用 Poetry 安装

```bash
# 克隆项目
git clone <repository-url>
cd meme-generator

# 安装依赖
poetry install

# 激活虚拟环境
poetry shell
```

### 使用 Docker

本项目提供预构建的 Docker 镜像，支持多平台（linux/amd64, linux/arm64）。

#### 从 DockerHub 拉取

```bash
docker pull qixiaoxin/meme-generator:latest
# 或指定版本
docker pull qixiaoxin/meme-generator:0.0.3
```

#### 从 GitHub Container Registry 拉取

```bash
docker pull ghcr.io/xiaomizhoubaobei/meme-generator:latest
# 或指定版本
docker pull ghcr.io/xiaomizhoubaobei/meme-generator:0.0.3
```

#### 从阿里云容器注册表拉取

```bash
docker pull crpi-wk2d8umombj539de.cn-shanghai.personal.cr.aliyuncs.com/xmz-1/meme-generator:latest
# 或指定版本
docker pull crpi-wk2d8umombj539de.cn-shanghai.personal.cr.aliyuncs.com/xmz-1/meme-generator:0.0.3
```

#### 运行容器

从任意镜像源运行：

```bash
# 使用 DockerHub 镜像
docker run -p 8000:8000 qixiaoxin/meme-generator:latest

# 使用 GitHub Container Registry 镜像
docker run -p 8000:8000 ghcr.io/xiaomizhoubaobei/meme-generator:latest

# 使用阿里云容器注册表镜像
docker run -p 8000:8000 crpi-wk2d8umombj539de.cn-shanghai.personal.cr.aliyuncs.com/xmz-1/meme-generator:latest
```

#### 自定义端口运行

```bash
# DockerHub 镜像
docker run -p 8080:8080 -e HOST=0.0.0.0 -e PORT=8080 qixiaoxin/meme-generator:latest

# GitHub Container Registry 镜像
docker run -p 8080:8080 -e HOST=0.0.0.0 -e PORT=8080 ghcr.io/xiaomizhoubaobei/meme-generator:latest

# 阿里云容器注册表镜像
docker run -p 8080:8080 -e HOST=0.0.0.0 -e PORT=8080 crpi-wk2d8umombj539de.cn-shanghai.personal.cr.aliyuncs.com/xmz-1/meme-generator:latest
```

## 启动服务

### 使用 Poetry

```bash
# 安装依赖后启动
poetry run python -m meme_generator.app
```

### 使用 Docker

```bash
# 运行容器（使用 DockerHub 镜像）
docker run -p 8000:8000 qixiaoxin/meme-generator:latest

# 或使用 GitHub Container Registry 镜像
docker run -p 8000:8000 ghcr.io/xiaomizhoubaobei/meme-generator:latest

# 或使用阿里云容器注册表镜像
docker run -p 8000:8000 crpi-wk2d8umombj539de.cn-shanghai.personal.cr.aliyuncs.com/xmz-1/meme-generator:latest
```



### 环境变量配置

服务支持通过环境变量进行配置，可用的环境变量如下：

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| MEME_DIRS | `'["/data/memes"]'` | 额外表情路径 |
| MEME_DISABLED_LIST | `'[]'` | 禁用表情列表 |
| GIF_MAX_SIZE | `10.0` | 限制生成的 gif 文件大小（MB） |
| GIF_MAX_FRAMES | `100` | 限制生成的 gif 文件帧数 |
| BAIDU_TRANS_APPID | `''` | 百度翻译 appid |
| BAIDU_TRANS_APIKEY | `''` | 百度翻译 apikey |
| LOG_LEVEL | `'INFO'` | 日志等级 |

使用环境变量示例：

```bash
# 使用 Poetry
MEME_DIRS='["/custom/memes"]' GIF_MAX_SIZE=5.0 poetry run python -m meme_generator.app

# 使用 Docker
docker run -p 8000:8000 \
  -e MEME_DIRS='["/custom/memes"]' \
  -e GIF_MAX_SIZE=5.0 \
  qixiaoxin/meme-generator:latest
```

## Docker 镜像信息

- **基础镜像**: 多平台支持 (linux/amd64, linux/arm64)
- **维护者**: 祁筱欣
- **许可证**: AGPL-3.0
- **主要依赖**:
  - Python 3.10+
  - FastAPI
  - Pillow
  - httpx

### 镜像特性

- **预构建资源**: 镜像构建时会自动下载必要的资源文件，包括字体和表情包模板
- **动态下载**: 镜像会在启动时根据需要下载额外的资源文件
- **体积优化**: 镜像经过优化，只包含必需的运行时依赖

镜像已使用 cosign 进行数字签名，确保镜像的完整性和可信度。

## 📁 项目结构

```
meme_generator/
├── app.py              # FastAPI 应用和路由定义
├── cli.py              # CLI 命令行工具
├── config.py           # 配置管理
├── manager.py          # 表情包管理和加载
├── meme.py             # 表情包核心类定义
├── download.py         # 资源下载功能
├── exception.py        # 异常定义
├── log.py              # 日志配置
├── utils.py            # 工具函数
├── version.py          # 版本信息
├── memes/              # 表情包模板目录
│   ├── petpet/         # 具体表情包实现
│   ├── raise_sign/     # 具体表情包实现
│   └── ...             # 更多表情包
└── resources/          # 资源文件
    ├── fonts/          # 字体文件
    └── ...
```

## 贡献

欢迎提交 Issue 和 Pull Request 来帮助改进这个项目。详细信息请查看 [CONTRIBUTING.md](CONTRIBUTING.md)。

## 📄 许可证

本项目采用 [AGPL-3.0](LICENSE) 许可证开源。

## 🔗 相关链接

- [GitHub 仓库](https://github.com/xiaomizhoubaobei/meme-generator)
- [贡献指南](CONTRIBUTING.md)
- [安全策略](SECURITY.md)
- [问题反馈](https://github.com/xiaomizhoubaobei/meme-generator/issues)

## 🙏 致谢

感谢所有为本项目做出贡献的开发者和使用者！

---

**注意**: 本项目仅供学习和娱乐使用，请勿用于商业用途或违法用途。