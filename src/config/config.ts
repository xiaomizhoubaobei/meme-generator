import * as toml from 'toml';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

export interface MemeConfig {
  load_builtin_memes: boolean;
  meme_dirs: string[];
  meme_disabled_list: string[];
}

export interface ResourceConfig {
  resource_url?: string;
  resource_urls: string[];
}

export interface GifConfig {
  gif_max_size: number;
  gif_max_frames: number;
}

export interface TranslatorConfig {
  baidu_trans_appid: string;
  baidu_trans_apikey: string;
}

export interface ServerConfig {
  host: string;
  port: number;
}

export interface LogConfig {
  log_level: string | number;
}

export interface Config {
  meme: MemeConfig;
  resource: ResourceConfig;
  gif: GifConfig;
  translate: TranslatorConfig;
  server: ServerConfig;
  log: LogConfig;
}

const DEFAULT_CONFIG: Config = {
  meme: {
    load_builtin_memes: true,
    meme_dirs: [],
    meme_disabled_list: [],
  },
  resource: {
    resource_urls: [
      'https://raw.githubusercontent.com/MemeCrafters/meme-generator/',
      'https://mirror.ghproxy.com/https://raw.githubusercontent.com/MemeCrafters/meme-generator/',
      'https://cdn.jsdelivr.net/gh/MemeCrafters/meme-generator@',
      'https://fastly.jsdelivr.net/gh/MemeCrafters/meme-generator@',
      'https://raw.gitmirror.com/MemeCrafters/meme-generator/',
    ],
  },
  gif: {
    gif_max_size: 10,
    gif_max_frames: 100,
  },
  translate: {
    baidu_trans_appid: '',
    baidu_trans_apikey: '',
  },
  server: {
    host: '0.0.0.0',
    port: 2233,
  },
  log: {
    log_level: 'INFO',
  },
};

function getConfigFilePath(): string {
  const configDir = path.join(os.homedir(), '.config', 'meme-generator');
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
  }
  return path.join(configDir, 'config.toml');
}

function parseEnvValue(value: string): any {
  if (value.startsWith('[') && value.endsWith(']')) {
    try {
      return JSON.parse(value);
    } catch {
      return [];
    }
  }
  return value;
}

function loadFromEnv(): Partial<Config> {
  const env: Partial<Config> = {};

  if (process.env.LOAD_BUILTIN_MEMES) {
    env.meme = {
      ...DEFAULT_CONFIG.meme,
      load_builtin_memes: process.env.LOAD_BUILTIN_MEMES.toLowerCase() === 'true',
    };
  }

  if (process.env.MEME_DIRS) {
    env.meme = env.meme || { ...DEFAULT_CONFIG.meme };
    env.meme.meme_dirs = parseEnvValue(process.env.MEME_DIRS);
  }

  if (process.env.MEME_DISABLED_LIST) {
    env.meme = env.meme || { ...DEFAULT_CONFIG.meme };
    env.meme.meme_disabled_list = parseEnvValue(process.env.MEME_DISABLED_LIST);
  }

  if (process.env.GIF_MAX_SIZE) {
    env.gif = {
      ...DEFAULT_CONFIG.gif,
      gif_max_size: parseFloat(process.env.GIF_MAX_SIZE),
    };
  }

  if (process.env.GIF_MAX_FRAMES) {
    env.gif = env.gif || { ...DEFAULT_CONFIG.gif };
    env.gif.gif_max_frames = parseInt(process.env.GIF_MAX_FRAMES, 10);
  }

  if (process.env.BAIDU_TRANS_APPID) {
    env.translate = {
      ...DEFAULT_CONFIG.translate,
      baidu_trans_appid: process.env.BAIDU_TRANS_APPID,
    };
  }

  if (process.env.BAIDU_TRANS_APIKEY) {
    env.translate = env.translate || { ...DEFAULT_CONFIG.translate };
    env.translate.baidu_trans_apikey = process.env.BAIDU_TRANS_APIKEY;
  }

  if (process.env.SERVER_HOST) {
    env.server = {
      ...DEFAULT_CONFIG.server,
      host: process.env.SERVER_HOST,
    };
  }

  if (process.env.SERVER_PORT) {
    env.server = env.server || { ...DEFAULT_CONFIG.server };
    env.server.port = parseInt(process.env.SERVER_PORT, 10);
  }

  if (process.env.LOG_LEVEL) {
    env.log = {
      ...DEFAULT_CONFIG.log,
      log_level: process.env.LOG_LEVEL,
    };
  }

  if (process.env.RESOURCE_URL) {
    env.resource = {
      ...DEFAULT_CONFIG.resource,
      resource_url: process.env.RESOURCE_URL,
    };
  }

  return env;
}

function loadFromFile(): Partial<Config> {
  const configPath = getConfigFilePath();
  if (!fs.existsSync(configPath)) {
    return {};
  }

  try {
    const content = fs.readFileSync(configPath, 'utf-8');
    const parsed = toml.parse(content) as Partial<Config>;
    return parsed;
  } catch (error) {
    console.error(`Failed to load config file: ${error}`);
    return {};
  }
}

export function loadConfig(): Config {
  const fileConfig = loadFromFile();
  const envConfig = loadFromEnv();

  return {
    meme: {
      ...DEFAULT_CONFIG.meme,
      ...fileConfig.meme,
      ...envConfig.meme,
    },
    resource: {
      ...DEFAULT_CONFIG.resource,
      ...fileConfig.resource,
      ...envConfig.resource,
    },
    gif: {
      ...DEFAULT_CONFIG.gif,
      ...fileConfig.gif,
      ...envConfig.gif,
    },
    translate: {
      ...DEFAULT_CONFIG.translate,
      ...fileConfig.translate,
      ...envConfig.translate,
    },
    server: {
      ...DEFAULT_CONFIG.server,
      ...fileConfig.server,
      ...envConfig.server,
    },
    log: {
      ...DEFAULT_CONFIG.log,
      ...fileConfig.log,
      ...envConfig.log,
    },
  };
}

export function saveConfig(config: Config): void {
  const configPath = getConfigFilePath();
  const jsonPath = configPath.replace('.toml', '.json');
  const content = JSON.stringify(config, null, 2);
  fs.writeFileSync(jsonPath, content, 'utf-8');
}

export const memeConfig = loadConfig();