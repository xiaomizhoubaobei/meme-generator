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

  // Create a dance effect with colorful overlays
  const result = img.clone();
  await result.hueRotate(90);

  // Add colorful circles (disco lights effect)
  const colors = [
    { r: 255, g: 0, b: 0, alpha: 0.3 },
    { r: 0, g: 255, b: 0, alpha: 0.3 },
    { r: 0, g: 0, b: 255, alpha: 0.3 },
    { r: 255, g: 255, b: 0, alpha: 0.3 },
  ];

  const circleSize = Math.min(width, height) / 5;
  for (let i = 0; i < colors.length; i++) {
    const circle = await createImage(circleSize, circleSize, colors[i]);
    await circle.circle();
    const x = (width / (colors.length + 1)) * (i + 1) - circleSize / 2;
    const y = height - circleSize - 10;
    await result.overlay(circle, x, y);
  }

  // Add "💃" text (dance emoji)
  await result.drawText('💃', {
    font: 'Arial',
    size: Math.min(100, height / 3),
    color: 'black',
    x: width / 2 - 30,
    y: 10,
  });

  return result.toBuffer();
};

export function register(): void {
  addMeme('dance', memeFn, params, {
    keywords: ['dance', '跳舞'],
    shortcuts: [],
    tags: new Set(['popular']),
  });
}
