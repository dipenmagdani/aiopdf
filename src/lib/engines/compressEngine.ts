export async function compressPdf(
  data: ArrayBuffer,
  quality: number = 0.5
): Promise<Blob> {
  const pdfjsLib = await import('pdfjs-dist');
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
  const { PDFDocument } = await import('pdf-lib');

  const doc = await pdfjsLib.getDocument({ data: new Uint8Array(data) }).promise;
  const newDoc = await PDFDocument.create();

  for (let i = 0; i < doc.numPages; i++) {
    const page = await doc.getPage(i + 1);
    const vp = page.getViewport({ scale: quality < 0.3 ? 0.75 : quality < 0.7 ? 1 : 1.5 });
    const canvas = document.createElement('canvas');
    canvas.width = vp.width;
    canvas.height = vp.height;
    const ctx = canvas.getContext('2d')!;
    await page.render({ canvasContext: ctx, viewport: vp }).promise;

    const imgData = canvas.toDataURL('image/jpeg', quality);
    const raw = atob(imgData.split(',')[1]);
    const arr = new Uint8Array(raw.length);
    for (let j = 0; j < raw.length; j++) arr[j] = raw.charCodeAt(j);
    const img = await newDoc.embedJpg(arr.buffer as ArrayBuffer);
    const newPage = newDoc.addPage([img.width, img.height]);
    newPage.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
  }

  const bytes = await newDoc.save();
  return new Blob([bytes.buffer as ArrayBuffer], { type: 'application/pdf' });
}
