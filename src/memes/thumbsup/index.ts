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
  
  // Create a thumbs-up effect with green overlay
  const result = img.clone();
  await result.brightness(1.1);
  
  // Add green tint
  const greenOverlay = await createImage(width, height, {
    r: 0,
    g: 255,
    b: 0,
    alpha: 0.2,
  });
  await result.overlay(greenOverlay, 0, 0);
  
  // Add "👍" text (thumbs up emoji)
  await result.drawText('👍', {
    font: 'Arial',
    size: Math.min(100, height / 3),
    color: 'black',
    x: width / 2 - 30,
    y: height / 2 - 30,
  });
  
  return result.toBuffer();
};

export function register(): void {
  addMeme(
    'thumbsup',
    memeFn,
    params,
    {
      keywords: ['thumbsup', '点赞'],
      shortcuts: [],
      tags: new Set(['popular']),
    }
  );
}