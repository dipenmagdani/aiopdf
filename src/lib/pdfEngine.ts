import type { TextNode, PageInfo } from '@/types/pdf';

let pdfjsLib: typeof import('pdfjs-dist') | null = null;
let pdfDoc: any | null = null;

async function getPdfjs() {
  if (!pdfjsLib) {
    pdfjsLib = await import('pdfjs-dist');
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
  }
  return pdfjsLib;
}

export async function loadPdf(data: ArrayBuffer) {
  const lib = await getPdfjs();
  pdfDoc = await lib.getDocument({ data: new Uint8Array(data) }).promise;
  return pdfDoc;
}

export function getPdfDoc() {
  return pdfDoc;
}

export async function getPageInfo(doc: any): Promise<PageInfo[]> {
  const pages: PageInfo[] = [];
  for (let i = 0; i < doc.numPages; i++) {
    const page = await doc.getPage(i + 1);
    const vp = page.getViewport({ scale: 1 });
    pages.push({ pageIndex: i, width: vp.width, height: vp.height });
  }
  return pages;
}

export async function renderPage(
  doc: any,
  pageIndex: number,
  canvas: HTMLCanvasElement,
  scale: number
): Promise<void> {
  const page = await doc.getPage(pageIndex + 1);
  const viewport = page.getViewport({ scale });
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  const ctx = canvas.getContext('2d')!;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  await page.render({ canvasContext: ctx, viewport }).promise;
}

export async function renderThumbnail(
  doc: any,
  pageIndex: number,
  maxWidth: number = 150
): Promise<string> {
  const page = await doc.getPage(pageIndex + 1);
  const vp = page.getViewport({ scale: 1 });
  const scale = maxWidth / vp.width;
  const viewport = page.getViewport({ scale });
  const canvas = document.createElement('canvas');
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  const ctx = canvas.getContext('2d')!;
  await page.render({ canvasContext: ctx, viewport }).promise;
  return canvas.toDataURL();
}

export async function extractTextNodes(
  doc: any,
  pageIndex: number
): Promise<TextNode[]> {
  const page = await doc.getPage(pageIndex + 1);
  const textContent = await page.getTextContent();
  const viewport = page.getViewport({ scale: 1 });
  const nodes: TextNode[] = [];

  textContent.items.forEach((item: any, idx: number) => {
    if (!('str' in item) || !item.str.trim()) return;
    const tx = item.transform;
    const fontSize = Math.sqrt(tx[0] * tx[0] + tx[1] * tx[1]);
    const x = tx[4];
    const y = viewport.height - tx[5];
    const fontName = (item.fontName || 'unknown').toLowerCase();
    const bold = fontName.includes('bold') || fontName.includes('heavy') || fontName.includes('black');
    const italic = fontName.includes('italic') || fontName.includes('oblique');

    nodes.push({
      id: `p${pageIndex}-t${idx}-${Math.random().toString(36).slice(2, 8)}`,
      pageIndex,
      content: item.str,
      x,
      y: y - fontSize,
      fontRef: item.fontName || 'unknown',
      fontSize,
      transform: tx,
      width: item.width || fontSize * item.str.length * 0.6,
      height: item.height || fontSize * 1.2,
      originalOperatorIndex: idx,
      modified: false,
      deleted: false,
      bold,
      italic,
      underline: false,
      color: '#000000',
      bgColor: 'transparent',
    });
  });

  return nodes;
}

export async function exportPdf(
  originalData: ArrayBuffer,
  textNodes: TextNode[]
): Promise<Blob> {
  const { PDFDocument, rgb, StandardFonts } = await import('pdf-lib');
  const dataCopy = originalData.slice(0);
  const doc = await PDFDocument.load(dataCopy, { ignoreEncryption: true });

  // Embed all 4 standard font variants
  const fonts = {
    regular: await doc.embedFont(StandardFonts.Helvetica),
    bold: await doc.embedFont(StandardFonts.HelveticaBold),
    italic: await doc.embedFont(StandardFonts.HelveticaOblique),
    boldItalic: await doc.embedFont(StandardFonts.HelveticaBoldOblique),
  };

  function pickFont(node: TextNode) {
    if (node.bold && node.italic) return fonts.boldItalic;
    if (node.bold) return fonts.bold;
    if (node.italic) return fonts.italic;
    return fonts.regular;
  }

  function hexToRgb(hex: string) {
    const h = hex.replace('#', '');
    const r = parseInt(h.substring(0, 2), 16) / 255;
    const g = parseInt(h.substring(2, 4), 16) / 255;
    const b = parseInt(h.substring(4, 6), 16) / 255;
    return rgb(r, g, b);
  }

  // Handle new text nodes
  const newNodes = textNodes.filter((n) => n.isNew && !n.deleted);
  for (const node of newNodes) {
    const page = doc.getPage(node.pageIndex);
    const { height } = page.getSize();
    const font = pickFont(node);
    const color = hexToRgb(node.color);

    if (node.bgColor && node.bgColor !== 'transparent') {
      page.drawRectangle({
        x: node.x,
        y: height - node.y - node.height,
        width: font.widthOfTextAtSize(node.content, node.fontSize) + 2,
        height: node.height,
        color: hexToRgb(node.bgColor),
      });
    }

    page.drawText(node.content, {
      x: node.x,
      y: height - node.y - node.fontSize,
      size: node.fontSize,
      font,
      color,
    });
  }

  // Handle modified original text nodes
  const modifiedNodes = textNodes.filter((n) => !n.isNew && n.modified && !n.deleted);
  for (const node of modifiedNodes) {
    const page = doc.getPage(node.pageIndex);
    const { height } = page.getSize();
    const font = pickFont(node);
    const color = hexToRgb(node.color);

    // White-out original position
    const origX = node.originalX ?? node.x;
    const origY = node.originalY ?? node.y;
    const origW = node.originalWidth ?? node.width;
    const origPdfY = height - origY - node.height;

    page.drawRectangle({
      x: origX - 1,
      y: origPdfY - 2,
      width: origW + 2,
      height: node.height + 4,
      color: rgb(1, 1, 1),
    });

    // Draw bg color if set
    const pdfY = height - node.y - node.height;
    if (node.bgColor && node.bgColor !== 'transparent') {
      page.drawRectangle({
        x: node.x,
        y: pdfY,
        width: font.widthOfTextAtSize(node.content, node.fontSize) + 2,
        height: node.height,
        color: hexToRgb(node.bgColor),
      });
    }

    page.drawText(node.content, {
      x: node.x,
      y: pdfY + 2,
      size: node.fontSize,
      font,
      color,
    });
  }

  // Handle deleted original text nodes
  const deletedNodes = textNodes.filter((n) => !n.isNew && n.deleted);
  for (const node of deletedNodes) {
    const page = doc.getPage(node.pageIndex);
    const { height } = page.getSize();
    const pdfY = height - node.y - node.height;

    page.drawRectangle({
      x: node.x - 1,
      y: pdfY - 2,
      width: node.width + 2,
      height: node.height + 4,
      color: rgb(1, 1, 1),
    });
  }

  const bytes = await doc.save();
  return new Blob([bytes.buffer as ArrayBuffer], { type: 'application/pdf' });
}
