import { addMeme } from '../../core/manager';
import { BuildImage, createImage } from '../../core/image';
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

  // Create a shocked effect with color inversion and shake lines
  const result = await img.clone().hueRotate(180);
  await result.contrast(1.5);

  // Add shock lines (simple jagged lines)
  for (let i = 0; i < 5; i++) {
    const line = await createImage(10, height, { r: 255, g: 255, b: 0, alpha: 0.7 });
    await result.overlay(line, width - 20, 0);
  }

  // Add "!" symbols
  await result.drawText('!', {
    font: 'Arial',
    size: 60,
    color: 'red',
    x: width / 2 - 10,
    y: 10,
  });

  return result.toBuffer();
};

export function register(): void {
  addMeme('shock', memeFn, params, {
    keywords: ['shock', '震惊'],
    shortcuts: [],
    tags: new Set(['popular']),
  });
}
