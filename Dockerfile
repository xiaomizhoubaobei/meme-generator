# 构建阶段
FROM node:18-alpine AS builder

WORKDIR /app

# 安装构建依赖
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    cairo-dev \
    jpeg-dev \
    pango-dev \
    musl-dev \
    giflib-dev \
    pixman-dev \
    pangomm-dev \
    libjpeg-turbo-dev \
    freetype-dev

# 复制 package 文件
COPY package*.json ./

# 安装所有依赖（包括构建所需的开发依赖）
RUN npm install && \
    npm cache clean --force

# 复制源代码
COPY . .

# 构建 TypeScript（可选使用 secrets）
# 如需在构建时访问私有资源，使用：
# docker build --secret id=BAIDU_TRANS_APPID --secret id=BAIDU_TRANS_APIKEY .
RUN --mount=type=secret,id=BAIDU_TRANS_APPID,required=false \
    --mount=type=secret,id=BAIDU_TRANS_APIKEY,required=false \
    sh -c 'if [ -f /run/secrets/BAIDU_TRANS_APPID ]; then echo "Build with secrets provided"; else echo "Build without secrets"; fi && npm run build'

# 生产阶段
FROM node:18-alpine AS app

WORKDIR /app

# 安装运行时依赖
RUN apk add --no-cache \
    vips-dev \
    vips \
    cairo \
    pango \
    jpeg \
    giflib \
    pixman \
    freetype \
    fontconfig \
    ttf-dejavu \
    ttf-freefont \
    tzdata && \
    apk cache purge

# 复制 package 文件
COPY package*.json* ./

# 仅安装生产依赖
RUN npm install --production && \
    npm cache clean --force

# 复制构建好的应用
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

# 复制资源文件
COPY resources/fonts/* /usr/share/fonts/meme-fonts/
RUN fc-cache -fv

# 复制表情包模板
COPY src/memes /app/src/memes
COPY src/config /app/src/config
COPY src/types /app/src/types
COPY src/utils /app/src/utils
COPY src/core /app/src/core

# 创建日志目录
RUN mkdir -p /app/logs

# 创建自定义表情包数据目录
RUN mkdir -p /data/memes

# 环境变量
ENV TZ=Asia/Shanghai \
    NODE_ENV=production \
    LOAD_BUILTIN_MEMES=true \
    MEME_DIRS='["/data/memes"]' \
    MEME_DISABLED_LIST='[]' \
    GIF_MAX_SIZE=10.0 \
    GIF_MAX_FRAMES=100 \
    LOG_LEVEL="INFO" \
    SERVER_HOST="0.0.0.0" \
    SERVER_PORT=8080 \
    RESOURCE_URL=""

# 暴露端口
EXPOSE 8080

# 健康检查
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:8080/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# 启动应用
CMD ["node", "dist/app.js"]
