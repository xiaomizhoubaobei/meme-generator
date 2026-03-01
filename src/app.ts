import express, { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { logger } from './utils/logger';
import { memeConfig } from './config/config';
import { getMeme, getMemes, initializeMemes } from './core/manager';
import { BuildImage } from './core/image';
import { NoSuchMeme } from './types';

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Error handling middleware
function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

// Initialize memes on startup
initializeMemes().catch((error) => {
  logger.error('Failed to initialize memes:', error);
  process.exit(1);
});

// API Routes

// GET /meme/version
app.get('/meme/version', (_req: Request, res: Response) => {
  res.json({ version: '0.0.1' });
});

// GET /memes/keys
app.get('/memes/keys', (_req: Request, res: Response) => {
  const keys = getMemes().map((m) => m.key);
  res.json(keys);
});

// GET /memes/:key/info
app.get(
  '/memes/:key/info',
  asyncHandler(async (req: Request, res: Response) => {
    const { key } = req.params;
    const meme = getMeme(key);

    res.json({
      key: meme.key,
      params_type: meme.params_type,
      keywords: meme.keywords,
      shortcuts: meme.shortcuts,
      tags: Array.from(meme.tags),
      date_created: meme.date_created,
      date_modified: meme.date_modified,
    });
  })
);

// GET /memes/:key/preview
app.get(
  '/memes/:key/preview',
  asyncHandler(async (req: Request, res: Response) => {
    const { key } = req.params;
    const meme = getMeme(key);

    // Generate preview with default images and texts
    const images: BuildImage[] = [];
    const texts: string[] = [];

    // Generate random images for preview
    for (let i = 0; i < meme.params_type.min_images; i++) {
      const buffer = Buffer.from(
        `<svg width="200" height="200"><rect width="200" height="200" fill="#${Math.floor(Math.random()*16777215).toString(16)}"/></svg>`
      );
      images.push(new BuildImage(buffer));
    }

    // Use default texts or random texts
    if (meme.params_type.default_texts.length > 0) {
      texts.push(...meme.params_type.default_texts);
    } else {
      for (let i = 0; i < meme.params_type.min_texts; i++) {
        texts.push(`Text ${i + 1}`);
      }
    }

    const result = await meme.function(images, texts, {});
    const contentType = 'image/png';

    res.set('Content-Type', contentType);
    res.send(result);
  })
);

// POST /memes/:key
app.post(
  '/memes/:key',
  upload.array('images', 10) as any,
  asyncHandler(async (req: Request, res: Response) => {
    const { key } = req.params;
    const files = req.files as Express.Multer.File[];
    const texts = req.body.texts
      ? Array.isArray(req.body.texts)
        ? req.body.texts
        : [req.body.texts]
      : [];
    const args = req.body.args ? JSON.parse(req.body.args) : {};

    const meme = getMeme(key);

    // Validate image count
    if (
      meme.params_type.min_images > files.length ||
      files.length > meme.params_type.max_images
    ) {
      res.status(400).json({
        error: `Image count mismatch: expected ${meme.params_type.min_images}~${meme.params_type.max_images}`,
      });
      return;
    }

    // Validate text count
    if (
      meme.params_type.min_texts > texts.length ||
      texts.length > meme.params_type.max_texts
    ) {
      res.status(400).json({
        error: `Text count mismatch: expected ${meme.params_type.min_texts}~${meme.params_type.max_texts}`,
      });
      return;
    }

    // Load images
    const images: BuildImage[] = [];
    for (const file of files) {
      images.push(new BuildImage(file.buffer));
    }

    // Generate meme
    const result = await meme.function(images, texts, args);
    const contentType = 'image/png';

    res.set('Content-Type', contentType);
    res.send(result);
  })
);

// Health check
app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', memes_count: getMemes().length });
});

// API Documentation
app.get('/docs', (_req: Request, res: Response) => {
  res.json({
    name: 'Meme Generator API',
    version: '0.0.1',
    description: '用于制作趣味图片的Node.js API服务',
    endpoints: [
      {
        path: '/meme/version',
        method: 'GET',
        description: '获取API版本信息',
        response: {
          version: 'API版本号'
        }
      },
      {
        path: '/memes/keys',
        method: 'GET',
        description: '获取所有可用的表情包键值',
        response: ['表情包键值列表']
      },
      {
        path: '/memes/:key/info',
        method: 'GET',
        description: '获取特定表情包的详细信息',
        parameters: {
          ':key': '表情包键值'
        },
        response: {
          key: '表情包键值',
          params_type: '参数类型信息',
          keywords: '关键词列表',
          shortcuts: '快捷方式列表',
          tags: '标签集合',
          date_created: '创建日期',
          date_modified: '修改日期'
        }
      },
      {
        path: '/memes/:key/preview',
        method: 'GET',
        description: '获取表情包预览图',
        parameters: {
          ':key': '表情包键值'
        },
        response: '预览图像'
      },
      {
        path: '/memes/:key',
        method: 'POST',
        description: '生成表情包',
        parameters: {
          ':key': '表情包键值'
        },
        requestBody: {
          images: '图片文件数组（multipart/form-data）',
          texts: '文本数组（可选）',
          args: '附加参数（JSON格式，可选）'
        },
        response: '生成的表情包图像'
      },
      {
        path: '/health',
        method: 'GET',
        description: '健康检查',
        response: {
          status: '服务器状态',
          memes_count: '表情包总数'
        }
      },
      {
        path: '/docs',
        method: 'GET',
        description: '获取API文档',
        response: 'API文档信息'
      }
    ],
    examples: {
      '获取所有表情包': {
        method: 'GET',
        url: '/memes/keys',
        response: ['always', 'slap', 'rip', 'kiss', 'punch', 'shock', 'thumbsup', 'facepalm', 'dance', 'petpet']
      },
      '获取特定表情包信息': {
        method: 'GET',
        url: '/memes/always/info',
        response: {
          key: 'always',
          params_type: {
            min_images: 1,
            max_images: 1,
            min_texts: 0,
            max_texts: 0,
            default_texts: []
          },
          keywords: ['always'],
          shortcuts: [],
          tags: ['funny'],
          date_created: '2023-01-01',
          date_modified: '2023-01-02'
        }
      },
      '生成表情包': {
        method: 'POST',
        url: '/memes/always',
        formData: {
          images: '<image_file>',
          texts: '["text1", "text2"]',
          args: '{"size": 500}'
        }
      }
    }
  });
});

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: 'Not found' });
  return;
});

// Error handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  logger.error('Error:', err);

  if (err instanceof NoSuchMeme) {
    res.status(404).json({ error: err.message });
    return;
  }

  res.status(500).json({ error: err.message || 'Internal server error' });
  return;
});

export function startServer(): void {
  const { host, port } = memeConfig.server;
  app.listen(port, host, () => {
    logger.info(`Server running on http://${host}:${port}`);
  });
}

// 如果此文件是主模块，则启动服务器
if (require.main === module) {
  startServer();
}

export default app;