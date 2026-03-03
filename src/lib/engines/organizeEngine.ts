import { PDFDocument, degrees } from 'pdf-lib';

export async function organizePages(
  data: ArrayBuffer,
  newOrder: number[],
  deletedPages: Set<number> = new Set(),
  rotations: Map<number, number> = new Map()
): Promise<Blob> {
  const source = await PDFDocument.load(data, { ignoreEncryption: true });
  const doc = await PDFDocument.create();

  const kept = newOrder.filter((i) => !deletedPages.has(i));
  const pages = await doc.copyPages(source, kept);

  pages.forEach((page, idx) => {
    const origIdx = kept[idx];
    const rot = rotations.get(origIdx);
    if (rot) {
      page.setRotation(degrees(rot));
    }
    doc.addPage(page);
  });

  const bytes = await doc.save();
  return new Blob([bytes.buffer as ArrayBuffer], { type: 'application/pdf' });
}
