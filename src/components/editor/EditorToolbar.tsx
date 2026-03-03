import {
  MousePointer2, Type, Plus, ZoomIn, ZoomOut,
  Undo2, Redo2, Download, PanelLeftClose, PanelLeft, Trash2,
} from 'lucide-react';
import { usePdfStore } from '@/store/pdfStore';
import { exportPdf } from '@/lib/pdfEngine';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export function EditorToolbar() {
  const zoom = usePdfStore((s) => s.zoom);
  const setZoom = usePdfStore((s) => s.setZoom);
  const activeTool = usePdfStore((s) => s.activeTool);
  const setActiveTool = usePdfStore((s) => s.setActiveTool);
  const sidebarOpen = usePdfStore((s) => s.sidebarOpen);
  const toggleSidebar = usePdfStore((s) => s.toggleSidebar);
  const undo = usePdfStore((s) => s.undo);
  const redo = usePdfStore((s) => s.redo);
  const undoStack = usePdfStore((s) => s.undoStack);
  const redoStack = usePdfStore((s) => s.redoStack);
  const file = usePdfStore((s) => s.file);
  const pdfData = usePdfStore((s) => s.pdfData);
  const textNodes = usePdfStore((s) => s.textNodes);
  const fileName = usePdfStore((s) => s.fileName);
  const selectedNodeId = usePdfStore((s) => s.selectedNodeId);
  const deleteTextNode = usePdfStore((s) => s.deleteTextNode);

  const handleExport = async () => {
    if (!file && !pdfData) return;
    try {
      const sourceData = file ? await file.arrayBuffer() : (pdfData as ArrayBuffer);
      const blob = await exportPdf(sourceData, textNodes);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName.replace('.pdf', '-edited.pdf');
      a.click();
      URL.revokeObjectURL(url);
      toast.success('PDF exported successfully');
    } catch (err) {
      console.error('Export failed:', err);
      toast.error('Export failed: ' + (err instanceof Error ? err.message : String(err)));
    }
  };

  const tools = [
    { id: 'select' as const, icon: MousePointer2, label: 'Select' },
    { id: 'text' as const, icon: Type, label: 'Edit Text' },
    { id: 'add-text' as const, icon: Plus, label: 'Add Text' },
  ];

  return (
    <div className="flex items-center justify-between h-11 px-3 bg-editor-toolbar border-b border-editor-border flex-shrink-0">
      {/* Left */}
      <div className="flex items-center gap-1">
        <ToolbarButton onClick={toggleSidebar} title="Toggle sidebar">
          {sidebarOpen ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeft className="h-4 w-4" />}
        </ToolbarButton>

        <div className="w-px h-5 bg-editor-border mx-1" />

        {tools.map((t) => (
          <ToolbarButton
            key={t.id}
            active={activeTool === t.id}
            onClick={() => setActiveTool(t.id)}
            title={t.label}
          >
            <t.icon className="h-4 w-4" />
          </ToolbarButton>
        ))}

        <div className="w-px h-5 bg-editor-border mx-1" />

        <ToolbarButton onClick={undo} disabled={undoStack.length === 0} title="Undo">
          <Undo2 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton onClick={redo} disabled={redoStack.length === 0} title="Redo">
          <Redo2 className="h-4 w-4" />
        </ToolbarButton>

        {selectedNodeId && (
          <>
            <div className="w-px h-5 bg-editor-border mx-1" />
            <ToolbarButton onClick={() => deleteTextNode(selectedNodeId)} title="Delete selected">
              <Trash2 className="h-4 w-4" />
            </ToolbarButton>
          </>
        )}
      </div>

      {/* Center - file name */}
      <span className="text-xs font-mono text-editor-text-muted truncate max-w-[200px]">
        {fileName}
      </span>

      {/* Right */}
      <div className="flex items-center gap-1">
        <ToolbarButton onClick={() => setZoom(zoom - 0.25)} title="Zoom out">
          <ZoomOut className="h-4 w-4" />
        </ToolbarButton>
        <span className="text-xs font-mono text-editor-text-muted w-12 text-center">
          {Math.round(zoom * 100)}%
        </span>
        <ToolbarButton onClick={() => setZoom(zoom + 0.25)} title="Zoom in">
          <ZoomIn className="h-4 w-4" />
        </ToolbarButton>

        <div className="w-px h-5 bg-editor-border mx-1" />

        <button
          onClick={handleExport}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-editor-accent text-primary-foreground text-xs font-medium hover:opacity-90 transition-opacity"
        >
          <Download className="h-3.5 w-3.5" />
          Export
        </button>
      </div>
    </div>
  );
}

function ToolbarButton({
  children, active, disabled, onClick, title,
}: {
  children: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  title?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={cn(
        "p-1.5 rounded-md text-editor-text-muted transition-colors",
        active && "bg-editor-accent/20 text-editor-accent",
        !active && !disabled && "hover:bg-editor-surface-hover hover:text-editor-text",
        disabled && "opacity-30 cursor-not-allowed"
      )}
    >
      {children}
    </button>
  );
}
