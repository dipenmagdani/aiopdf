import { PDFDocument } from 'pdf-lib';

export async function pdfToImages(
  data: ArrayBuffer,
  format: 'png' | 'jpeg' = 'png',
  quality: number = 0.92
): Promise<string[]> {
  const pdfjsLib = await import('pdfjs-dist');
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

  const doc = await pdfjsLib.getDocument({ data: new Uint8Array(data) }).promise;
  const urls: string[] = [];

  for (let i = 0; i < doc.numPages; i++) {
    const page = await doc.getPage(i + 1);
    const vp = page.getViewport({ scale: 2 });
    const canvas = document.createElement('canvas');
    canvas.width = vp.width;
    canvas.height = vp.height;
    const ctx = canvas.getContext('2d')!;
    await page.render({ canvasContext: ctx, viewport: vp }).promise;
    const url = canvas.toDataURL(`image/${format}`, quality);
    urls.push(url);
  }
  return urls;
}

export async function imagesToPdf(
  images: { data: ArrayBuffer; type: string }[],
  pageSize: 'A4' | 'Letter' | 'Original' = 'A4'
): Promise<Blob> {
  const doc = await PDFDocument.create();
  const sizes = { A4: [595.28, 841.89] as const, Letter: [612, 792] as const };

  for (const img of images) {
    const isJpg = img.type.includes('jpeg') || img.type.includes('jpg');
    const embedded = isJpg
      ? await doc.embedJpg(img.data)
      : await doc.embedPng(img.data);

    let w: number, h: number;
    if (pageSize === 'Original') {
      w = embedded.width;
      h = embedded.height;
    } else {
      const [pw, ph] = sizes[pageSize];
      const ratio = Math.min(pw / embedded.width, ph / embedded.height);
      w = embedded.width * ratio;
      h = embedded.height * ratio;
    }

    const page = doc.addPage(pageSize === 'Original' ? [w, h] : sizes[pageSize] as [number, number]);
    const { width: pgW, height: pgH } = page.getSize();
    page.drawImage(embedded, {
      x: (pgW - w) / 2,
      y: (pgH - h) / 2,
      width: w,
      height: h,
    });
  }

  const bytes = await doc.save();
  return new Blob([bytes.buffer as ArrayBuffer], { type: 'application/pdf' });
}
