import { useState, useRef, useEffect, useCallback } from 'react';
import { usePdfStore } from '@/store/pdfStore';
import { cn } from '@/lib/utils';
import type { TextNode } from '@/types/pdf';

interface TextOverlayProps {
  zoom: number;
  pageIndex: number;
}

export function TextOverlay({ zoom, pageIndex }: TextOverlayProps) {
  const textNodes = usePdfStore((s) => s.textNodes);
  const selectedNodeId = usePdfStore((s) => s.selectedNodeId);
  const selectNode = usePdfStore((s) => s.selectNode);
  const updateTextNode = usePdfStore((s) => s.updateTextNode);
  const updateNodePosition = usePdfStore((s) => s.updateNodePosition);
  const activeTool = usePdfStore((s) => s.activeTool);

  const visibleNodes = textNodes.filter(
    (n) => n.pageIndex === pageIndex && !n.deleted
  );

  const isEditable = activeTool === 'text' || activeTool === 'add-text';

  const movedNodes = textNodes.filter(
    (n) => n.pageIndex === pageIndex && !n.deleted && !n.isNew && n.originalX !== undefined
  );

  const deletedNodes = textNodes.filter(
    (n) => n.pageIndex === pageIndex && n.deleted && !n.isNew
  );

  return (
    <div className="absolute inset-0 pointer-events-none">
      {movedNodes.map((node) => (
        <div
          key={`ghost-${node.id}`}
          style={{
            position: 'absolute',
            left: (node.originalX!) * zoom,
            top: (node.originalY!) * zoom,
            width: (node.originalWidth ?? node.width) * zoom + 4,
            height: node.height * zoom + 4,
            backgroundColor: 'white',
          }}
        />
      ))}
      {deletedNodes.map((node) => (
        <div
          key={`del-${node.id}`}
          style={{
            position: 'absolute',
            left: node.x * zoom - 1,
            top: node.y * zoom - 2,
            width: node.width * zoom + 4,
            height: node.height * zoom + 6,
            backgroundColor: 'white',
          }}
        />
      ))}
      {visibleNodes.map((node) => (
        <TextNodeElement
          key={node.id}
          node={node}
          zoom={zoom}
          isSelected={selectedNodeId === node.id}
          isEditable={isEditable}
          onSelect={() => selectNode(node.id)}
          onUpdate={(content) => updateTextNode(node.id, content)}
          onMove={(x, y) => updateNodePosition(node.id, x, y)}
        />
      ))}
    </div>
  );
}

function getFontFamily(fontRef: string): string {
  const lower = fontRef.toLowerCase();
  if (lower.includes('courier') || lower.includes('mono')) return '"Courier New", Courier, monospace';
  if (lower.includes('times') || lower.includes('serif') || lower.includes('roman')) return '"Times New Roman", Times, serif';
  if (lower.includes('arial') || lower.includes('helvetica') || lower.includes('sans')) return 'Arial, Helvetica, sans-serif';
  return 'Arial, Helvetica, sans-serif';
}

function estimateTextWidth(content: string, fontSize: number, bold: boolean): number {
  const factor = bold ? 0.68 : 0.62;
  return content.length * fontSize * factor;
}

function TextNodeElement({
  node,
  zoom,
  isSelected,
  isEditable,
  onSelect,
  onUpdate,
  onMove,
}: {
  node: TextNode;
  zoom: number;
  isSelected: boolean;
  isEditable: boolean;
  onSelect: () => void;
  onUpdate: (content: string) => void;
  onMove: (x: number, y: number) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(node.content);
  const [dragging, setDragging] = useState(false);
  const dragRef = useRef<{ startX: number; startY: number; nodeX: number; nodeY: number } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setValue(node.content);
  }, [node.content]);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  const handleDoubleClick = useCallback(() => {
    if (isEditable) {
      setEditing(true);
      onSelect();
    }
  }, [isEditable, onSelect]);

  const handleBlur = useCallback(() => {
    setEditing(false);
    if (value !== node.content) {
      onUpdate(value);
    }
  }, [value, node.content, onUpdate]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      (e.target as HTMLInputElement).blur();
    }
    if (e.key === 'Escape') {
      setValue(node.content);
      setEditing(false);
    }
  }, [node.content]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (editing || !isSelected) return;
    e.preventDefault();
    e.stopPropagation();
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      nodeX: node.x,
      nodeY: node.y,
    };
    setDragging(true);
  }, [editing, isSelected, node.x, node.y]);

  useEffect(() => {
    if (!dragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!dragRef.current) return;
      const dx = (e.clientX - dragRef.current.startX) / zoom;
      const dy = (e.clientY - dragRef.current.startY) / zoom;
      onMove(dragRef.current.nodeX + dx, dragRef.current.nodeY + dy);
    };

    const handleMouseUp = () => {
      setDragging(false);
      dragRef.current = null;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging, zoom, onMove]);

  const fontFamily = getFontFamily(node.fontRef);
  const estimatedW = estimateTextWidth(node.content, node.fontSize, node.bold);
  const displayWidth = Math.max(node.width, estimatedW);

  const textStyle: React.CSSProperties = {
    fontWeight: node.bold ? 700 : 400,
    fontStyle: node.italic ? 'italic' : 'normal',
    textDecoration: node.underline ? 'underline' : 'none',
    color: (node.modified || node.isNew) ? node.color : 'transparent',
  };

  return (
    <div
      className={cn(
        "absolute pointer-events-auto transition-all duration-75",
        !editing && !isSelected && isEditable && "hover:text-node-hover cursor-pointer",
        isSelected && !editing && !dragging && "text-node-selected cursor-move",
        isSelected && dragging && "text-node-selected opacity-80",
        !isEditable && !isSelected && "cursor-default",
      )}
      style={{
        left: node.x * zoom,
        top: node.y * zoom,
        width: Math.max(displayWidth * zoom, 20),
        height: node.height * zoom,
        fontSize: node.fontSize * zoom,
        lineHeight: `${node.height * zoom}px`,
        fontFamily,
        backgroundColor: (node.modified || node.isNew)
          ? (node.bgColor !== 'transparent' ? node.bgColor : 'white')
          : 'transparent',
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      onDoubleClick={handleDoubleClick}
      onMouseDown={handleMouseDown}
    >
      {editing ? (
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="w-full h-full border border-editor-accent outline-none px-0.5"
          style={{
            fontSize: node.fontSize * zoom,
            lineHeight: `${node.height * zoom}px`,
            color: node.color,
            fontFamily,
            fontWeight: node.bold ? 700 : 400,
            fontStyle: node.italic ? 'italic' : 'normal',
            textDecoration: node.underline ? 'underline' : 'none',
            backgroundColor: node.bgColor !== 'transparent' ? node.bgColor : 'white',
          }}
        />
      ) : (
        <span
          className="block w-full h-full whitespace-pre select-none overflow-visible"
          style={textStyle}
        >
          {node.content}
        </span>
      )}
    </div>
  );
}
