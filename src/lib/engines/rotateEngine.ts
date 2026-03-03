import { PDFDocument, degrees } from 'pdf-lib';

export async function rotatePages(
  data: ArrayBuffer,
  rotations: Map<number, number>
): Promise<Blob> {
  const doc = await PDFDocument.load(data, { ignoreEncryption: true });
  for (const [pageIdx, deg] of rotations) {
    const page = doc.getPage(pageIdx);
    const current = page.getRotation().angle;
    page.setRotation(degrees(current + deg));
  }
  const bytes = await doc.save();
  return new Blob([bytes.buffer as ArrayBuffer], { type: 'application/pdf' });
}
