import { addMeme } from '../../core/manager';
import { BuildImage, createImage } from '../../core/image';
import { MemeParamsType, MemeFunction, MemeArgs } from '../../types';

const params: MemeParamsType = {
  min_images: 1,
  max_images: 1,
  min_texts: 1,
  max_texts: 1,
  default_texts: ['Always'],
};

const memeFn: MemeFunction = async (
  images: BuildImage[],
  texts: string[],
  _args: MemeArgs
): Promise<Buffer> => {
  const img = images[0];
  const { width, height } = await img.getSize();
  const text = texts[0] || 'Always';
  
  // Create a new image with text
  const result = await createImage(width + 200, height, 'white');
  
  // Paste the original image
  await result.paste(img, 0, 0);
  
  // Add text on the right side
  await result.drawText(text, {
    font: 'Arial',
    size: 40,
    color: 'black',
    x: width + 20,
    y: height / 2 - 20,
  });
  
  return result.toBuffer();
};

export function register(): void {
  addMeme(
    'always',
    memeFn,
    params,
    {
      keywords: ['always', '总是'],
      shortcuts: [],
      tags: new Set(['popular']),
    }
  );
}