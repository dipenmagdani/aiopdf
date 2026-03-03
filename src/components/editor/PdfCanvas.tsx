import { useEffect, useRef, useCallback, useState } from "react";
import { usePdfStore } from "@/store/pdfStore";
import { getPdfDoc, renderPage, extractTextNodes } from "@/lib/pdfEngine";
import { TextOverlay } from "./TextOverlay";

export function PdfCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const currentPage = usePdfStore((s) => s.currentPage);
  const zoom = usePdfStore((s) => s.zoom);
  const setTextNodes = usePdfStore((s) => s.setTextNodes);
  const textNodes = usePdfStore((s) => s.textNodes);
  const pages = usePdfStore((s) => s.pages);
  const activeTool = usePdfStore((s) => s.activeTool);
  const addTextNode = usePdfStore((s) => s.addTextNode);
  const selectNode = usePdfStore((s) => s.selectNode);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  // Render current page
  useEffect(() => {
    const doc = getPdfDoc();
    if (!doc || !canvasRef.current) return;
    renderPage(doc, currentPage, canvasRef.current, zoom).then(() => {
      if (canvasRef.current) {
        setCanvasSize({
          width: canvasRef.current.width,
          height: canvasRef.current.height,
        });
      }
    });
  }, [currentPage, zoom]);

  // Extract text for current page (only if not already done)
  useEffect(() => {
    const doc = getPdfDoc();
    if (!doc) return;
    const pageNodes = textNodes.filter((n) => n.pageIndex === currentPage);
    if (pageNodes.length > 0) return;

    extractTextNodes(doc, currentPage).then((nodes) => {
      setTextNodes([
        ...textNodes.filter((n) => n.pageIndex !== currentPage),
        ...nodes,
      ]);
    });
  }, [currentPage]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleCanvasClick = useCallback(
    (e: React.MouseEvent) => {
      if (activeTool !== "add-text") {
        selectNode(null);
        return;
      }

      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;

      const x = (e.clientX - rect.left) / zoom;
      const y = (e.clientY - rect.top) / zoom;

      const newNode = {
        id: `new-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        pageIndex: currentPage,
        content: "New Text",
        x,
        y,
        fontRef: "Helvetica",
        fontSize: 14,
        transform: [14, 0, 0, 14, x, y],
        width: 80,
        height: 18,
        originalOperatorIndex: -1,
        modified: false,
        deleted: false,
        isNew: true,
        bold: false,
        italic: false,
        underline: false,
        color: "#000000",
        bgColor: "transparent",
      };

      addTextNode(newNode);
    },
    [activeTool, currentPage, zoom, addTextNode, selectNode]
  );

  const pageInfo = pages[currentPage];

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-auto editor-scrollbar bg-editor-canvas flex items-start justify-center p-8"
    >
      <div
        className="relative shadow-2xl"
        style={{
          width: canvasSize.width || (pageInfo ? pageInfo.width * zoom : 0),
          height: canvasSize.height || (pageInfo ? pageInfo.height * zoom : 0),
        }}
      >
        <canvas
          ref={canvasRef}
          onClick={handleCanvasClick}
          className="block"
          style={{
            cursor: activeTool === "add-text" ? "crosshair" : "default",
          }}
        />
        <TextOverlay zoom={zoom} pageIndex={currentPage} />
      </div>
    </div>
  );
}
