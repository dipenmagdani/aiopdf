import { PDFDocument } from 'pdf-lib';

export async function mergeDocuments(buffers: ArrayBuffer[]): Promise<Blob> {
  const merged = await PDFDocument.create();
  for (const buf of buffers) {
    const doc = await PDFDocument.load(buf, { ignoreEncryption: true });
    const pages = await merged.copyPages(doc, doc.getPageIndices());
    pages.forEach((p) => merged.addPage(p));
  }
  const bytes = await merged.save();
  return new Blob([bytes.buffer as ArrayBuffer], { type: 'application/pdf' });
}
