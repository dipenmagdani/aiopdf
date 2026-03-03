import { useEffect, useCallback } from 'react';
import { usePdfStore } from '@/store/pdfStore';
import { exportPdf } from '@/lib/pdfEngine';
import { toast } from 'sonner';

export function useKeyboardShortcuts() {
  const undo = usePdfStore((s) => s.undo);
  const redo = usePdfStore((s) => s.redo);
  const selectedNodeId = usePdfStore((s) => s.selectedNodeId);
  const deleteTextNode = usePdfStore((s) => s.deleteTextNode);
  const setActiveTool = usePdfStore((s) => s.setActiveTool);
  const pdfData = usePdfStore((s) => s.pdfData);
  const textNodes = usePdfStore((s) => s.textNodes);
  const fileName = usePdfStore((s) => s.fileName);
  const zoom = usePdfStore((s) => s.zoom);
  const setZoom = usePdfStore((s) => s.setZoom);

  const handleExport = useCallback(async () => {
    if (!pdfData) return;
    try {
      const blob = await exportPdf(pdfData, textNodes);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName.replace('.pdf', '-edited.pdf');
      a.click();
      URL.revokeObjectURL(url);
      toast.success('PDF exported successfully');
    } catch {
      toast.error('Export failed');
    }
  }, [pdfData, textNodes, fileName]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const mod = e.ctrlKey || e.metaKey;

      // Ctrl+Z / Ctrl+Shift+Z
      if (mod && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      }
      if (mod && e.key === 'z' && e.shiftKey) {
        e.preventDefault();
        redo();
      }
      // Ctrl+Y
      if (mod && e.key === 'y') {
        e.preventDefault();
        redo();
      }
      // Ctrl+S
      if (mod && e.key === 's') {
        e.preventDefault();
        handleExport();
      }
      // Delete / Backspace
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedNodeId) {
        const activeEl = document.activeElement;
        if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA')) return;
        e.preventDefault();
        deleteTextNode(selectedNodeId);
      }
      // Tool shortcuts
      if (e.key === 'v' || e.key === 'V') {
        if (!mod) setActiveTool('select');
      }
      if (e.key === 't' || e.key === 'T') {
        if (!mod) setActiveTool('text');
      }
      if (e.key === 'a' || e.key === 'A') {
        if (!mod) setActiveTool('add-text');
      }
      // Zoom
      if (mod && (e.key === '=' || e.key === '+')) {
        e.preventDefault();
        setZoom(zoom + 0.25);
      }
      if (mod && e.key === '-') {
        e.preventDefault();
        setZoom(zoom - 0.25);
      }
      if (mod && e.key === '0') {
        e.preventDefault();
        setZoom(1);
      }
      // Escape
      if (e.key === 'Escape') {
        setActiveTool('select');
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [undo, redo, selectedNodeId, deleteTextNode, setActiveTool, handleExport, zoom, setZoom]);
}
