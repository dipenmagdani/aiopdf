import { usePdfStore } from '@/store/pdfStore';
import { Bold, Italic, Underline, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function PropertiesPanel() {
  const selectedNodeId = usePdfStore((s) => s.selectedNodeId);
  const textNodes = usePdfStore((s) => s.textNodes);
  const updateTextNode = usePdfStore((s) => s.updateTextNode);
  const updateNodePosition = usePdfStore((s) => s.updateNodePosition);
  const updateNodeFontSize = usePdfStore((s) => s.updateNodeFontSize);
  const updateNodeStyle = usePdfStore((s) => s.updateNodeStyle);
  const deleteTextNode = usePdfStore((s) => s.deleteTextNode);

  if (!selectedNodeId) return null;

  const node = textNodes.find((n) => n.id === selectedNodeId);
  if (!node || node.deleted) return null;

  return (
    <div className="absolute right-4 top-4 w-60 bg-editor-surface border border-editor-border rounded-lg shadow-2xl p-3 z-50 space-y-3 overflow-y-auto max-h-[calc(100vh-6rem)]">
      <p className="text-[10px] uppercase tracking-widest text-editor-text-muted font-mono">
        Properties
      </p>

      {/* Content */}
      <Section label="Content">
        <input
          value={node.content}
          onChange={(e) => updateTextNode(node.id, e.target.value)}
          className="w-full bg-editor-bg border border-editor-border rounded px-2 py-1 text-xs text-editor-text outline-none focus:border-editor-accent"
        />
      </Section>

      {/* Font Style Toggles */}
      <Section label="Style">
        <div className="flex gap-1">
          <StyleToggle
            active={node.bold}
            onClick={() => updateNodeStyle(node.id, { bold: !node.bold })}
            title="Bold"
          >
            <Bold className="h-3.5 w-3.5" />
          </StyleToggle>
          <StyleToggle
            active={node.italic}
            onClick={() => updateNodeStyle(node.id, { italic: !node.italic })}
            title="Italic"
          >
            <Italic className="h-3.5 w-3.5" />
          </StyleToggle>
          <StyleToggle
            active={node.underline}
            onClick={() => updateNodeStyle(node.id, { underline: !node.underline })}
            title="Underline"
          >
            <Underline className="h-3.5 w-3.5" />
          </StyleToggle>
        </div>
      </Section>

      {/* Colors */}
      <Section label="Colors">
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <label className="text-[10px] text-editor-text-muted font-mono">Text</label>
            <div className="flex items-center gap-1.5">
              <input
                type="color"
                value={node.color}
                onChange={(e) => updateNodeStyle(node.id, { color: e.target.value })}
                className="w-6 h-6 rounded border border-editor-border cursor-pointer bg-transparent p-0"
              />
              <input
                value={node.color}
                onChange={(e) => updateNodeStyle(node.id, { color: e.target.value })}
                className="flex-1 bg-editor-bg border border-editor-border rounded px-1.5 py-0.5 text-[10px] text-editor-text outline-none focus:border-editor-accent font-mono"
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] text-editor-text-muted font-mono">Background</label>
            <div className="flex items-center gap-1.5">
              <input
                type="color"
                value={node.bgColor === 'transparent' ? '#ffffff' : node.bgColor}
                onChange={(e) => updateNodeStyle(node.id, { bgColor: e.target.value })}
                className="w-6 h-6 rounded border border-editor-border cursor-pointer bg-transparent p-0"
              />
              <button
                onClick={() => updateNodeStyle(node.id, { bgColor: 'transparent' })}
                className={cn(
                  "text-[9px] px-1.5 py-0.5 rounded border font-mono",
                  node.bgColor === 'transparent'
                    ? "border-editor-accent text-editor-accent"
                    : "border-editor-border text-editor-text-muted hover:text-editor-text"
                )}
              >
                None
              </button>
            </div>
          </div>
        </div>
      </Section>

      {/* Position */}
      <Section label="Position">
        <div className="grid grid-cols-2 gap-2">
          <NumberInput
            label="X"
            value={Math.round(node.x)}
            onChange={(v) => updateNodePosition(node.id, v, node.y)}
          />
          <NumberInput
            label="Y"
            value={Math.round(node.y)}
            onChange={(v) => updateNodePosition(node.id, node.x, v)}
          />
        </div>
      </Section>

      {/* Font size */}
      <Section label="Font Size">
        <div className="flex items-center gap-2">
          <input
            type="range"
            min={4}
            max={120}
            value={Math.round(node.fontSize)}
            onChange={(e) => updateNodeFontSize(node.id, Number(e.target.value))}
            className="flex-1 accent-editor-accent h-1"
          />
          <input
            type="number"
            value={Math.round(node.fontSize)}
            onChange={(e) => updateNodeFontSize(node.id, Number(e.target.value))}
            className="w-14 bg-editor-bg border border-editor-border rounded px-2 py-1 text-xs text-editor-text outline-none focus:border-editor-accent text-center"
            min={4}
            max={200}
          />
        </div>
      </Section>

      {/* Font ref (read only) */}
      <Section label="Font">
        <p className="text-xs text-editor-text truncate">{node.fontRef}</p>
      </Section>

      {/* Size */}
      <div className="grid grid-cols-2 gap-2 text-[10px] text-editor-text-muted font-mono">
        <span>W: {Math.round(node.width)}</span>
        <span>H: {Math.round(node.height)}</span>
      </div>

      {/* Status badges */}
      <div className="flex gap-1 flex-wrap">
        {node.isNew && (
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-editor-accent/20 text-editor-accent font-mono">NEW</span>
        )}
        {node.modified && (
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-editor-accent/20 text-editor-accent font-mono">MODIFIED</span>
        )}
      </div>

      {/* Delete */}
      <button
        onClick={() => deleteTextNode(node.id)}
        className="w-full py-1.5 rounded bg-destructive/20 text-destructive text-xs font-medium hover:bg-destructive/30 transition-colors flex items-center justify-center gap-1.5"
      >
        <Trash2 className="h-3.5 w-3.5" />
        Delete Node
      </button>
    </div>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="text-[10px] text-editor-text-muted font-mono">{label}</label>
      {children}
    </div>
  );
}

function NumberInput({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div className="space-y-1">
      <label className="text-[10px] text-editor-text-muted font-mono">{label}</label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full bg-editor-bg border border-editor-border rounded px-2 py-1 text-xs text-editor-text outline-none focus:border-editor-accent"
      />
    </div>
  );
}

function StyleToggle({
  active,
  onClick,
  title,
  children,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={cn(
        "p-1.5 rounded-md transition-colors border",
        active
          ? "bg-editor-accent/20 text-editor-accent border-editor-accent"
          : "text-editor-text-muted border-editor-border hover:bg-editor-surface-hover hover:text-editor-text"
      )}
    >
      {children}
    </button>
  );
}
