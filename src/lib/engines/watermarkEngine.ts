import { PDFDocument, rgb, StandardFonts, degrees } from 'pdf-lib';

export interface WatermarkOptions {
  text: string;
  fontSize?: number;
  opacity?: number;
  rotation?: number;
  color?: { r: number; g: number; b: number };
  position?: 'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

export async function addWatermark(
  data: ArrayBuffer,
  options: WatermarkOptions
): Promise<Blob> {
  const doc = await PDFDocument.load(data, { ignoreEncryption: true });
  const font = await doc.embedFont(StandardFonts.HelveticaBold);
  const {
    text,
    fontSize = 48,
    opacity = 0.15,
    rotation = -45,
    color = { r: 0.5, g: 0.5, b: 0.5 },
    position = 'center',
  } = options;

  const textWidth = font.widthOfTextAtSize(text, fontSize);

  for (let i = 0; i < doc.getPageCount(); i++) {
    const page = doc.getPage(i);
    const { width, height } = page.getSize();

    let x: number, y: number;
    switch (position) {
      case 'top-left': x = 40; y = height - 60; break;
      case 'top-right': x = width - textWidth - 40; y = height - 60; break;
      case 'bottom-left': x = 40; y = 40; break;
      case 'bottom-right': x = width - textWidth - 40; y = 40; break;
      default: x = (width - textWidth) / 2; y = height / 2;
    }

    page.drawText(text, {
      x,
      y,
      size: fontSize,
      font,
      color: rgb(color.r, color.g, color.b),
      opacity,
      rotate: degrees(rotation),
    });
  }

  const bytes = await doc.save();
  return new Blob([bytes.buffer as ArrayBuffer], { type: 'application/pdf' });
}
