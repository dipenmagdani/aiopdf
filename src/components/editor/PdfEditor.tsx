import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePdfStore } from '@/store/pdfStore';
import { loadPdf, getPageInfo } from '@/lib/pdfEngine';
import { EditorToolbar } from './EditorToolbar';
import { PageThumbnails } from './PageThumbnails';
import { PdfCanvas } from './PdfCanvas';
import { PropertiesPanel } from './PropertiesPanel';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { Loader2 } from 'lucide-react';

export function PdfEditor() {
  const pdfData = usePdfStore((s) => s.pdfData);
  const setPages = usePdfStore((s) => s.setPages);
  const setLoading = usePdfStore((s) => s.setLoading);
  const loading = usePdfStore((s) => s.loading);
  const sidebarOpen = usePdfStore((s) => s.sidebarOpen);
  const totalPages = usePdfStore((s) => s.totalPages);
  
  useKeyboardShortcuts();

  useEffect(() => {
    if (!pdfData) return;
    setLoading(true);
    const renderData = pdfData.slice(0);
    loadPdf(renderData).then(async (doc) => {
      const pages = await getPageInfo(doc);
      setPages(pages);
      setLoading(false);
    }).catch((err) => {
      console.error('Error loading PDF:', err);
      setLoading(false);
    });
  }, [pdfData, setPages, setLoading]);

  if (loading || totalPages === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-editor-bg">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-3"
        >
          <Loader2 className="h-8 w-8 animate-spin text-editor-accent" />
          <p className="text-sm text-editor-text-muted font-mono">Loading PDF…</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-editor-bg overflow-hidden">
      <EditorToolbar />
      <div className="flex flex-1 overflow-hidden relative">
        <AnimatePresence>
          {sidebarOpen && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 170, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="border-r border-editor-border bg-editor-surface overflow-hidden flex-shrink-0"
            >
              <PageThumbnails />
            </motion.aside>
          )}
        </AnimatePresence>
        <PdfCanvas />
        <PropertiesPanel />
      </div>
    </div>
  );
}
