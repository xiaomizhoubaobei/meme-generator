import { BuildImage } from '../core/image';

export interface UserInfo {
  name: string;
  gender: 'male' | 'female' | 'unknown';
}

export interface MemeArgs {
  user_infos?: UserInfo[];
  [key: string]: any;
}

export interface CommandShortcut {
  key: string;
  args?: string[];
  humanized?: string;
}

export interface MemeParamsType {
  min_images: number;
  max_images: number;
  min_texts: number;
  max_texts: number;
  default_texts: string[];
  args_type?: MemeArgsType;
}

export interface MemeArgsType {
  args_model: MemeArgs;
  args_examples: MemeArgs[];
}

export type MemeFunction = (
  images: BuildImage[],
  texts: string[],
  args: MemeArgs
) => Promise<Buffer>;

export interface Meme {
  key: string;
  function: MemeFunction;
  params_type: MemeParamsType;
  keywords: string[];
  shortcuts: CommandShortcut[];
  tags: Set<string>;
  date_created: Date;
  date_modified: Date;
}

export interface MemeGeneratorException extends Error {
  status_code: number;
  message: string;
}

export class ImageNumberMismatch extends Error implements MemeGeneratorException {
  status_code = 400;
  constructor(public min_images: number, public max_images: number) {
    super(`Image number mismatch: expected ${min_images}~${max_images}`);
    this.name = 'ImageNumberMismatch';
  }
}

export class TextNumberMismatch extends Error implements MemeGeneratorException {
  status_code = 400;
  constructor(public min_texts: number, public max_texts: number) {
    super(`Text number mismatch: expected ${min_texts}~${max_texts}`);
    this.name = 'TextNumberMismatch';
  }
}

export class OpenImageFailed extends Error implements MemeGeneratorException {
  status_code = 400;
  constructor(message: string) {
    super(`Failed to open image: ${message}`);
    this.name = 'OpenImageFailed';
  }
}

export class NoSuchMeme extends Error implements MemeGeneratorException {
  status_code = 404;
  constructor(public key: string) {
    super(`No such meme: ${key}`);
    this.name = 'NoSuchMeme';
  }
}

export class ArgModelMismatch extends Error implements MemeGeneratorException {
  status_code = 400;
  constructor(message: string) {
    super(`Arg model mismatch: ${message}`);
    this.name = 'ArgModelMismatch';
  }
}