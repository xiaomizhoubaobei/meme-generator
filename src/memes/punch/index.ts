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
  
  // Create a comic-style punch effect
  const result = img.clone();
  
  // Add impact burst (star shape)
  const burst = await createImage(Math.min(width, 200), Math.min(height, 200), 'yellow');
  
  // Add burst to the center
  await result.overlay(burst, width / 2 - 100, height / 2 - 100);
  
  // Add "POW" text
  await result.drawText('POW!', {
    font: 'Arial',
    size: 50,
    color: 'red',
    x: width / 2 - 50,
    y: height / 2 - 25,
  });
  
  return result.toBuffer();
};

export function register(): void {
  addMeme(
    'punch',
    memeFn,
    params,
    {
      keywords: ['punch', '拳击'],
      shortcuts: [],
      tags: new Set(['popular']),
    }
  );
}