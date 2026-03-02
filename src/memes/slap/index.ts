import { addMeme } from '../../core/manager';
import { BuildImage, createImage } from '../../core/image';
import { MemeParamsType, MemeFunction, MemeArgs } from '../../types';

const params: MemeParamsType = {
  min_images: 2,
  max_images: 2,
  min_texts: 0,
  max_texts: 0,
  default_texts: [],
};

const memeFn: MemeFunction = async (
  images: BuildImage[],
  _texts: string[],
  _args: MemeArgs
): Promise<Buffer> => {
  const leftImg = images[0];
  const rightImg = images[1];

  const leftSize = await leftImg.getSize();
  const rightSize = await rightImg.getSize();

  const width = leftSize.width + rightSize.width;
  const height = Math.max(leftSize.height, rightSize.height);

  // Create a canvas
  const result = await createImage(width, height, 'white');

  // Paste left image
  await result.paste(leftImg, 0, 0);

  // Paste right image
  await result.paste(rightImg, leftSize.width, 0);

  // Add a slap effect (simple red overlay)
  const slapOverlay = await createImage(Math.min(width, 100), Math.min(height, 100), {
    r: 255,
    g: 0,
    b: 0,
    alpha: 0.3,
  });
  await result.overlay(slapOverlay, width / 2 - 50, height / 2 - 50);

  return result.toBuffer();
};

export function register(): void {
  addMeme('slap', memeFn, params, {
    keywords: ['slap', '打'],
    shortcuts: [],
    tags: new Set(['popular']),
  });
}
