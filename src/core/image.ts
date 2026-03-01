import sharp from 'sharp';
import * as fs from 'fs';
import * as path from 'path';

export class BuildImage {
  private instance: sharp.Sharp;
  private inputData: Buffer | string;

  constructor(input: Buffer | string) {
    this.inputData = input;
    this.instance = sharp(input);
  }

  clone(): BuildImage {
    return new BuildImage(this.inputData);
  }

  static async open(input: string | Buffer): Promise<BuildImage> {
    if (typeof input === 'string') {
      const buffer = await fs.promises.readFile(input);
      return new BuildImage(buffer);
    }
    return new BuildImage(input);
  }

  async resize(
    width: number,
    height?: number,
    options?: sharp.ResizeOptions
  ): Promise<BuildImage> {
    this.instance = this.instance.resize(width, height, options);
    return this;
  }

  async crop(
    left: number,
    top: number,
    width: number,
    height: number
  ): Promise<BuildImage> {
    this.instance = this.instance.extract({ left, top, width, height });
    return this;
  }

  async rotate(angle: number): Promise<BuildImage> {
    this.instance = this.instance.rotate(angle);
    return this;
  }

  async flip(): Promise<BuildImage> {
    this.instance = this.instance.flip();
    return this;
  }

  async flop(): Promise<BuildImage> {
    this.instance = this.instance.flop();
    return this;
  }

  async grayscale(): Promise<BuildImage> {
    this.instance = this.instance.grayscale();
    return this;
  }

  async blur(sigma?: number): Promise<BuildImage> {
    this.instance = this.instance.blur(sigma);
    return this;
  }

  async sharpen(sigma?: number, flat?: number, jagged?: number): Promise<BuildImage> {
    this.instance = this.instance.sharpen(sigma, flat, jagged);
    return this;
  }

  async brightness(value: number): Promise<BuildImage> {
    this.instance = this.instance.modulate({ brightness: value });
    return this;
  }

  async contrast(value: number): Promise<BuildImage> {
    this.instance = this.instance.linear(value, -(128 * value) + 128);
    return this;
  }

  async hueRotate(deg: number): Promise<BuildImage> {
    this.instance = this.instance.modulate({ hue: deg });
    return this;
  }

  async saturate(value: number): Promise<BuildImage> {
    this.instance = this.instance.modulate({ saturation: value });
    return this;
  }

  async overlay(
    overlay: BuildImage,
    x: number = 0,
    y: number = 0,
    blend: sharp.Blend = 'over'
  ): Promise<BuildImage> {
    const overlayBuffer = await overlay.toPng();
    this.instance = this.instance.composite([{ input: overlayBuffer, left: x, top: y, blend }]);
    return this;
  }

  async paste(
    paste: BuildImage,
    x: number = 0,
    y: number = 0
  ): Promise<BuildImage> {
    const pasteBuffer = await paste.toPng();
    this.instance = this.instance.composite([{ input: pasteBuffer, left: x, top: y }]);
    return this;
  }

  async drawText(
    text: string,
    options: {
      font?: string;
      size?: number;
      color?: string;
      x?: number;
      y?: number;
      maxWidth?: number;
    } = {}
  ): Promise<BuildImage> {
    const {
      font = 'Arial',
      size = 40,
      color = 'black',
      x = 0,
      y = 0,
      maxWidth,
    } = options;

    // This is a simplified version. For full text support, we would need to use a library like canvas
    const textSvg = `
      <svg width="${maxWidth || 1000}" height="${size + 10}">
        <text x="${x}" y="${y + size}" font-family="${font}" font-size="${size}" fill="${color}">
          ${text}
        </text>
      </svg>
    `;

    const textBuffer = Buffer.from(textSvg);
    this.instance = this.instance.composite([{ input: textBuffer, blend: 'over' }]);
    return this;
  }

  async circle(): Promise<BuildImage> {
    const { width, height } = await this.instance.metadata();
    const size = Math.min(width || 0, height || 0);
    const circleSvg = `
      <svg width="${width}" height="${height}">
        <circle cx="${width! / 2}" cy="${height! / 2}" r="${size / 2}" fill="white"/>
      </svg>
    `;
    const circleBuffer = Buffer.from(circleSvg);
    this.instance = this.instance.composite([{ input: circleBuffer, blend: 'dest-in' }]);
    return this;
  }

  async pixelate(size: number): Promise<BuildImage> {
    const { width, height } = await this.instance.metadata();
    const w = Math.floor((width || 0) / size);
    const h = Math.floor((height || 0) / size);
    await this.resize(w, h);
    await this.resize(width || 100, height || 100, {
      kernel: 'nearest',
    });
    return this;
  }

  async toBuffer(format: 'png' | 'jpeg' | 'webp' | 'gif' = 'png'): Promise<Buffer> {
    return this.instance.toFormat(format).toBuffer();
  }

  async toJpeg(quality: number = 80): Promise<Buffer> {
    return this.instance.jpeg({ quality }).toBuffer();
  }

  async toPng(): Promise<Buffer> {
    return this.instance.png().toBuffer();
  }

  async toWebp(quality: number = 80): Promise<Buffer> {
    return this.instance.webp({ quality }).toBuffer();
  }

  async toGif(options: sharp.GifOptions = {}): Promise<Buffer> {
    return this.instance.gif(options).toBuffer();
  }

  async save(filePath: string): Promise<void> {
    const ext = path.extname(filePath).toLowerCase();
    let format: 'png' | 'jpeg' | 'webp' = 'png';

    if (ext === '.jpg' || ext === '.jpeg') {
      format = 'jpeg';
    } else if (ext === '.webp') {
      format = 'webp';
    }

    const buffer = await this.toBuffer(format);
    await fs.promises.writeFile(filePath, buffer);
  }

  async getMetadata(): Promise<sharp.Metadata> {
    return this.instance.metadata();
  }

  async getWidth(): Promise<number> {
    const meta = await this.instance.metadata();
    return meta.width || 0;
  }

  async getHeight(): Promise<number> {
    const meta = await this.instance.metadata();
    return meta.height || 0;
  }

  async getSize(): Promise<{ width: number; height: number }> {
    const meta = await this.instance.metadata();
    return {
      width: meta.width || 0,
      height: meta.height || 0,
    };
  }
}

export async function createImage(
  width: number,
  height: number,
  color: string | { r: number; g: number; b: number; alpha: number } = 'white'
): Promise<BuildImage> {
  const buffer = await sharp({
    create: {
      width,
      height,
      channels: 4,
      background: color,
    },
  }).toBuffer();
  return new BuildImage(buffer);
}

export async function loadImages(paths: string[]): Promise<BuildImage[]> {
  return Promise.all(paths.map((p) => BuildImage.open(p)));
}

export async function loadImagesFromBuffers(buffers: Buffer[]): Promise<BuildImage[]> {
  return Promise.all(buffers.map((b) => BuildImage.open(b)));
}