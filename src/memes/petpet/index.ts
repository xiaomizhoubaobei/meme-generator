import { addMeme } from '../../core/manager';
import { BuildImage } from '../../core/image';
import { MemeParamsType, MemeFunction, MemeArgs } from '../../types';

const params: MemeParamsType = {
  min_images: 1,
  max_images: 1,
  min_texts: 0,
  max_texts: 0,
  default_texts: [],
};

const memeFn: MemeFunction = async (
  images: BuildImage[],
  _texts: string[],
  _args: MemeArgs
): Promise<Buffer> => {
  const img = images[0];
  const { width, height } = await img.getSize();

  // Create a simple animation-like effect by resizing the image
  const frames: Buffer[] = [];
  const sizes = [0.9, 0.8, 0.7, 0.8, 0.9];

  for (const scale of sizes) {
    const w = Math.floor(width * scale);
    const h = Math.floor(height * scale);
    const clonedImg = await img.clone();
    await clonedImg.resize(w, h);
    const frame = await clonedImg.toBuffer();
    frames.push(frame);
  }

  // For now, just return the first frame (simplified version)
  return frames[0];
};

export function register(): void {
  addMeme('petpet', memeFn, params, {
    keywords: ['petpet', '摸摸'],
    shortcuts: [],
    tags: new Set(['popular']),
  });
}
