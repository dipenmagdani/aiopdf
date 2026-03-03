import { useEffect } from 'react';
import { usePdfStore } from '@/store/pdfStore';
import { getPdfDoc, renderThumbnail } from '@/lib/pdfEngine';
import { cn } from '@/lib/utils';

export function PageThumbnails() {
  const pages = usePdfStore((s) => s.pages);
  const currentPage = usePdfStore((s) => s.currentPage);
  const setCurrentPage = usePdfStore((s) => s.setCurrentPage);
  const updateThumbnail = usePdfStore((s) => s.updateThumbnail);

  useEffect(() => {
    const doc = getPdfDoc();
    if (!doc) return;
    pages.forEach(async (p) => {
      if (!p.thumbnailDataUrl) {
        const dataUrl = await renderThumbnail(doc, p.pageIndex, 140);
        updateThumbnail(p.pageIndex, dataUrl);
      }
    });
  }, [pages, updateThumbnail]);

  return (
    <div className="flex flex-col gap-2 p-3 editor-scrollbar overflow-y-auto h-full">
      <p className="text-[10px] uppercase tracking-widest text-editor-text-muted font-mono px-1 mb-1">
        Pages
      </p>
      {pages.map((page) => (
        <button
          key={page.pageIndex}
          onClick={() => setCurrentPage(page.pageIndex)}
          className={cn(
            "relative rounded-md overflow-hidden border-2 transition-all flex-shrink-0",
            currentPage === page.pageIndex
              ? "border-editor-accent glow-accent"
              : "border-editor-border hover:border-editor-surface-hover"
          )}
        >
          {page.thumbnailDataUrl ? (
            <img
              src={page.thumbnailDataUrl}
              alt={`Page ${page.pageIndex + 1}`}
              className="w-full"
            />
          ) : (
            <div className="w-full aspect-[3/4] bg-editor-surface animate-pulse" />
          )}
          <span className="absolute bottom-1 right-1 text-[9px] font-mono bg-editor-bg/80 text-editor-text-muted px-1.5 py-0.5 rounded">
            {page.pageIndex + 1}
          </span>
        </button>
      ))}
    </div>
  );
}
