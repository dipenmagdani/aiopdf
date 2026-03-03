import { PDFDocument } from 'pdf-lib';

export function parseRanges(input: string, totalPages: number): number[][] {
  return input.split(',').map((part) => {
    const trimmed = part.trim();
    if (trimmed.includes('-')) {
      const [start, end] = trimmed.split('-').map(Number);
      const s = Math.max(1, Math.min(start, totalPages));
      const e = Math.max(s, Math.min(end, totalPages));
      return Array.from({ length: e - s + 1 }, (_, i) => s + i - 1);
    }
    const n = Number(trimmed);
    return n >= 1 && n <= totalPages ? [n - 1] : [];
  });
}

export async function splitDocument(data: ArrayBuffer, ranges: number[][]): Promise<Blob[]> {
  const source = await PDFDocument.load(data, { ignoreEncryption: true });
  const results: Blob[] = [];
  for (const range of ranges) {
    const doc = await PDFDocument.create();
    const pages = await doc.copyPages(source, range);
    pages.forEach((p) => doc.addPage(p));
    const bytes = await doc.save();
    results.push(new Blob([bytes.buffer as ArrayBuffer], { type: 'application/pdf' }));
  }
  return results;
}
