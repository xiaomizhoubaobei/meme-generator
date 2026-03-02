#! /usr/bin/env bash

# 创建配置目录
mkdir -p ~/.config/meme_generator

# 使用环境变量替换模板并生成配置文件
envsubst < /app/config.toml.template > ~/.config/meme_generator/config.toml

# 启动应用
exec python -m meme_generator.app
