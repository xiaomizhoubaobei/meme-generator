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

  const width = Math.max(leftSize.width, rightSize.width) + 100;
  const height = Math.max(leftSize.height, rightSize.height);

  // Create a canvas
  const result = await createImage(width, height, '#FFE4E1');

  // Paste left image
  await result.paste(leftImg, 10, 10);

  // Paste right image
  await result.paste(rightImg, width - rightSize.width - 10, 10);

  // Add hearts (simple pink circles)
  const heart1 = await createImage(50, 50, { r: 255, g: 182, b: 193, alpha: 1 });
  await result.overlay(heart1, width / 2 - 25, 20);

  const heart2 = await createImage(40, 40, { r: 255, g: 105, b: 180, alpha: 1 });
  await result.overlay(heart2, width / 2 - 20, 80);

  return result.toBuffer();
};

export function register(): void {
  addMeme('kiss', memeFn, params, {
    keywords: ['kiss', '亲亲'],
    shortcuts: [],
    tags: new Set(['popular']),
  });
}
