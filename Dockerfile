# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Install build dependencies
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

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev dependencies for building)
RUN npm install && \
    npm cache clean --force

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Production stage
FROM node:18-alpine AS app

WORKDIR /app

# Install runtime dependencies
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

# Copy package files
COPY package*.json* ./

# Install production dependencies only
RUN npm install --production && \
    npm cache clean --force

# Copy built application
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

# Copy resources
COPY resources/fonts/* /usr/share/fonts/meme-fonts/
RUN fc-cache -fv

# Copy meme templates
COPY src/memes /app/src/memes
COPY src/config /app/src/config
COPY src/types /app/src/types
COPY src/utils /app/src/utils
COPY src/core /app/src/core

# Create logs directory
RUN mkdir -p /app/logs

# Create data directory for custom memes
RUN mkdir -p /data/memes

# Environment variables
ENV TZ=Asia/Shanghai \
    NODE_ENV=production \
    LOAD_BUILTIN_MEMES=true \
    MEME_DIRS='["/data/memes"]' \
    MEME_DISABLED_LIST='[]' \
    GIF_MAX_SIZE=10.0 \
    GIF_MAX_FRAMES=100 \
    BAIDU_TRANS_APPID="" \
    BAIDU_TRANS_APIKEY="" \
    LOG_LEVEL="INFO" \
    SERVER_HOST="0.0.0.0" \
    SERVER_PORT=8080 \
    RESOURCE_URL=""

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:8080/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the application
CMD ["node", "dist/app.js"]
