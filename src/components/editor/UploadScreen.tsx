import { useCallback } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText } from 'lucide-react';
import { usePdfStore } from '@/store/pdfStore';

export function UploadScreen() {
  const setFile = usePdfStore((s) => s.setFile);
  const setLoading = usePdfStore((s) => s.setLoading);

  const handleFile = useCallback(async (file: File) => {
    if (file.type !== 'application/pdf') return;
    setLoading(true);
    try {
      const data = await file.arrayBuffer();
      setFile(file, data);
    } catch (error) {
      console.error('Error reading file:', error);
      setLoading(false);
    }
  }, [setFile, setLoading]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleClick = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) handleFile(file);
    };
    input.click();
  }, [handleFile]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-editor-bg">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center gap-8"
      >
        <div className="flex items-center gap-3">
          <FileText className="h-8 w-8 text-editor-accent" />
          <h1 className="text-3xl font-semibold text-editor-text font-mono">
            PDF Editor
          </h1>
        </div>
        <p className="text-editor-text-muted text-sm max-w-md text-center">
          Browser-based PDF editing. Extract text, modify content, add annotations, and export — all client-side.
        </p>

        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={handleClick}
          className="w-[420px] cursor-pointer rounded-xl border-2 border-dashed border-editor-border bg-editor-surface p-12 text-center transition-colors hover:border-editor-accent hover:bg-editor-surface-hover group"
        >
          <Upload className="mx-auto h-10 w-10 text-editor-text-muted group-hover:text-editor-accent transition-colors" />
          <p className="mt-4 text-sm font-medium text-editor-text">
            Drop your PDF here
          </p>
          <p className="mt-1 text-xs text-editor-text-muted">
            or click to browse
          </p>
        </motion.div>

        <p className="text-xs text-editor-text-muted font-mono">
          100% client-side • No uploads • No servers
        </p>
      </motion.div>
    </div>
  );
}
