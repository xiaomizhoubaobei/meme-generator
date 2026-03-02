import * as fs from 'fs';
import * as path from 'path';
import { logger } from '../utils/logger';
import {
  Meme,
  MemeFunction,
  MemeParamsType,
  CommandShortcut,
  NoSuchMeme,
} from '../types';
import { memeConfig } from '../config/config';

const _memes: Map<string, Meme> = new Map();

export function addMeme(
  key: string,
  fn: MemeFunction,
  params: MemeParamsType,
  options: {
    keywords?: string[];
    shortcuts?: CommandShortcut[];
    tags?: Set<string>;
    date_created?: Date;
    date_modified?: Date;
  } = {}
): void {
  if (_memes.has(key)) {
    logger.warning(`Meme with key "${key}" already exists!`);
    return;
  }

  if (memeConfig.meme.meme_disabled_list.includes(key)) {
    logger.warning(`The key "${key}" is in the disabled list!`);
    return;
  }

  const meme: Meme = {
    key,
    function: fn,
    params_type: params,
    keywords: options.keywords || [],
    shortcuts: options.shortcuts || [],
    tags: options.tags || new Set(),
    date_created: options.date_created || new Date('2021-05-04'),
    date_modified: options.date_modified || new Date(),
  };

  _memes.set(key, meme);
  logger.info(`Meme "${key}" added successfully`);
}

export function getMeme(key: string): Meme {
  const meme = _memes.get(key);
  if (!meme) {
    throw new NoSuchMeme(key);
  }
  return meme;
}

export function getMemes(): Meme[] {
  return Array.from(_memes.values());
}

export function getMemeKeys(): string[] {
  return Array.from(_memes.keys());
}

export function hasMeme(key: string): boolean {
  return _memes.has(key);
}

export async function loadMemeFromModule(modulePath: string): Promise<void> {
  try {
    const resolvedPath = path.resolve(modulePath);
    if (!fs.existsSync(resolvedPath)) {
      logger.error(`Module not found: ${resolvedPath}`);
      return;
    }

    // Dynamic import of the module
    const module = await import(resolvedPath);

    // Check if the module exports a register function
    if (typeof module.register === 'function') {
      module.register();
      logger.info(`Meme module loaded: ${resolvedPath}`);
    } else {
      logger.warning(`Module ${resolvedPath} does not export a register function`);
    }
  } catch (error) {
    logger.error(`Failed to load meme module ${modulePath}: ${error}`);
  }
}

export async function loadMemesFromDirectory(dirPath: string): Promise<void> {
  if (!fs.existsSync(dirPath)) {
    logger.warning(`Directory not found: ${dirPath}`);
    return;
  }

  const files = fs.readdirSync(dirPath);

  for (const file of files) {
    if (file.startsWith('_') || file.startsWith('.')) {
      continue;
    }

    const fullPath = path.join(dirPath, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      // Load memes from subdirectory
      await loadMemesFromDirectory(fullPath);
    } else if (file.endsWith('.js') || file.endsWith('.ts')) {
      // Load meme from file
      await loadMemeFromModule(fullPath);
    }
  }
}

export async function loadBuiltInMemes(): Promise<void> {
  const memesDir = path.join(__dirname, '../memes');
  await loadMemesFromDirectory(memesDir);
}

export async function loadCustomMemes(): Promise<void> {
  for (const dir of memeConfig.meme.meme_dirs) {
    await loadMemesFromDirectory(dir);
  }
}

export async function initializeMemes(): Promise<void> {
  if (memeConfig.meme.load_builtin_memes) {
    await loadBuiltInMemes();
  }
  await loadCustomMemes();
  logger.info(`Loaded ${_memes.size} memes`);
}
