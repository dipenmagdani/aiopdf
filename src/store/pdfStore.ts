import { create } from 'zustand';
import type { TextNode, PageInfo } from '@/types/pdf';

type Tool = 'select' | 'text' | 'add-text';

interface HistoryEntry {
  textNodes: TextNode[];
}

interface PdfStore {
  // File state
  file: File | null;
  pdfData: ArrayBuffer | null;
  fileName: string;

  // Pages
  pages: PageInfo[];
  currentPage: number;
  totalPages: number;

  // View
  zoom: number;
  activeTool: Tool;

  // Text
  textNodes: TextNode[];
  selectedNodeId: string | null;

  // UI
  sidebarOpen: boolean;
  loading: boolean;

  // History
  undoStack: HistoryEntry[];
  redoStack: HistoryEntry[];

  // Actions
  setFile: (file: File, data: ArrayBuffer) => void;
  setPages: (pages: PageInfo[]) => void;
  setCurrentPage: (page: number) => void;
  setZoom: (zoom: number) => void;
  setActiveTool: (tool: Tool) => void;
  setTextNodes: (nodes: TextNode[]) => void;
  updateTextNode: (id: string, content: string) => void;
  updateNodePosition: (id: string, x: number, y: number) => void;
  updateNodeFontSize: (id: string, fontSize: number) => void;
  deleteTextNode: (id: string) => void;
  updateNodeStyle: (id: string, style: Partial<Pick<TextNode, 'bold' | 'italic' | 'underline' | 'color' | 'bgColor'>>) => void;
  addTextNode: (node: TextNode) => void;
  selectNode: (id: string | null) => void;
  toggleSidebar: () => void;
  setLoading: (loading: boolean) => void;
  updateThumbnail: (pageIndex: number, dataUrl: string) => void;
  undo: () => void;
  redo: () => void;
  pushHistory: () => void;
  reset: () => void;
}

export const usePdfStore = create<PdfStore>((set, get) => ({
  file: null,
  pdfData: null,
  fileName: '',
  pages: [],
  currentPage: 0,
  totalPages: 0,
  zoom: 1,
  activeTool: 'select',
  textNodes: [],
  selectedNodeId: null,
  sidebarOpen: true,
  loading: false,
  undoStack: [],
  redoStack: [],

  setFile: (file, data) => {
    // Store a copy so the original ArrayBuffer can't be detached
    const copy = data.slice(0);
    set({
      file, pdfData: copy, fileName: file.name,
      textNodes: [], pages: [], currentPage: 0, totalPages: 0,
      undoStack: [], redoStack: [], selectedNodeId: null,
    });
  },

  setPages: (pages) => set({ pages, totalPages: pages.length }),
  setCurrentPage: (page) => set({ currentPage: page, selectedNodeId: null }),
  setZoom: (zoom) => set({ zoom: Math.max(0.25, Math.min(4, zoom)) }),
  setActiveTool: (tool) => set({ activeTool: tool }),

  setTextNodes: (nodes) => set({ textNodes: nodes }),

  updateTextNode: (id, content) => {
    get().pushHistory();
    set((s) => ({
      textNodes: s.textNodes.map((n) =>
        n.id === id ? { ...n, content, modified: true } : n
      ),
    }));
  },

  updateNodePosition: (id, x, y) => {
    get().pushHistory();
    set((s) => ({
      textNodes: s.textNodes.map((n) =>
        n.id === id ? {
          ...n, x, y, modified: true,
          originalX: n.originalX ?? n.x,
          originalY: n.originalY ?? n.y,
          originalWidth: n.originalWidth ?? n.width,
        } : n
      ),
    }));
  },

  updateNodeFontSize: (id, fontSize) => {
    get().pushHistory();
    set((s) => ({
      textNodes: s.textNodes.map((n) =>
        n.id === id ? { ...n, fontSize, height: fontSize * 1.2, modified: true } : n
      ),
    }));
  },

  deleteTextNode: (id) => {
    get().pushHistory();
    set((s) => ({
      textNodes: s.textNodes.map((n) =>
        n.id === id ? { ...n, deleted: true } : n
      ),
      selectedNodeId: s.selectedNodeId === id ? null : s.selectedNodeId,
    }));
  },

  updateNodeStyle: (id, style) => {
    get().pushHistory();
    set((s) => ({
      textNodes: s.textNodes.map((n) =>
        n.id === id ? { ...n, ...style, modified: true } : n
      ),
    }));
  },

  addTextNode: (node) => {
    get().pushHistory();
    set((s) => ({ textNodes: [...s.textNodes, node] }));
  },

  selectNode: (id) => set({ selectedNodeId: id }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setLoading: (loading) => set({ loading }),

  updateThumbnail: (pageIndex, dataUrl) =>
    set((s) => ({
      pages: s.pages.map((p) =>
        p.pageIndex === pageIndex ? { ...p, thumbnailDataUrl: dataUrl } : p
      ),
    })),

  pushHistory: () => {
    const { textNodes, undoStack } = get();
    set({
      undoStack: [...undoStack.slice(-49), { textNodes: JSON.parse(JSON.stringify(textNodes)) }],
      redoStack: [],
    });
  },

  undo: () => {
    const { undoStack, textNodes } = get();
    if (undoStack.length === 0) return;
    const prev = undoStack[undoStack.length - 1];
    set((s) => ({
      undoStack: s.undoStack.slice(0, -1),
      redoStack: [...s.redoStack, { textNodes: JSON.parse(JSON.stringify(textNodes)) }],
      textNodes: prev.textNodes,
    }));
  },

  redo: () => {
    const { redoStack, textNodes } = get();
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    set((s) => ({
      redoStack: s.redoStack.slice(0, -1),
      undoStack: [...s.undoStack, { textNodes: JSON.parse(JSON.stringify(textNodes)) }],
      textNodes: next.textNodes,
    }));
  },

  reset: () => set({
    file: null, pdfData: null, fileName: '', pages: [], currentPage: 0,
    totalPages: 0, zoom: 1, activeTool: 'select', textNodes: [],
    selectedNodeId: null, loading: false, undoStack: [], redoStack: [],
  }),
}));
