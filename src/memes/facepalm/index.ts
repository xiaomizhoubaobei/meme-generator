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

  // Create a facepalm effect with darkness
  const result = await img.clone().grayscale();
  await result.brightness(0.6);
  await result.contrast(1.2);

  // Add a dark overlay on the face area (simplified)
  const darkOverlay = await createImage(width, height / 2, {
    r: 0,
    g: 0,
    b: 0,
    alpha: 0.5,
  });
  await result.overlay(darkOverlay, 0, 0);

  // Add "🤦" text (facepalm emoji)
  await result.drawText('🤦', {
    font: 'Arial',
    size: Math.min(100, height / 3),
    color: 'black',
    x: width / 2 - 30,
    y: height / 2 - 30,
  });

  return result.toBuffer();
};

export function register(): void {
  addMeme('facepalm', memeFn, params, {
    keywords: ['facepalm', '扶额'],
    shortcuts: [],
    tags: new Set(['popular']),
  });
}
