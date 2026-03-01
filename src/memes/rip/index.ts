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
  const { height } = await img.getSize();
  
  // Make the image grayscale and darker
  const result = await img.clone().grayscale();
  await result.contrast(0.5);
  await result.brightness(0.7);
  
  // Add RIP text
  await result.drawText('R.I.P.', {
    font: 'Arial',
    size: Math.max(30, Math.floor(height / 10)),
    color: 'black',
    x: 20,
    y: height / 2,
  });
  
  return result.toBuffer();
};

export function register(): void {
  addMeme(
    'rip',
    memeFn,
    params,
    {
      keywords: ['rip', '安息'],
      shortcuts: [],
      tags: new Set(['popular']),
    }
  );
}