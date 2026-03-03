import { create } from 'zustand';

export type ToolStep = 'upload' | 'configure' | 'preview' | 'download';

interface ToolFile {
  id: string;
  file: File;
  name: string;
  size: number;
  data: ArrayBuffer;
  thumbnailUrl?: string;
}

interface ToolState {
  files: ToolFile[];
  currentStep: ToolStep;
  processing: boolean;
  progress: number;
  resultBlob: Blob | null;
  resultFileName: string;
  error: string | null;

  addFiles: (files: File[]) => Promise<void>;
  removeFile: (id: string) => void;
  reorderFiles: (fromIndex: number, toIndex: number) => void;
  setStep: (step: ToolStep) => void;
  setProcessing: (processing: boolean) => void;
  setProgress: (progress: number) => void;
  setResult: (blob: Blob, fileName: string) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState = {
  files: [] as ToolFile[],
  currentStep: 'upload' as ToolStep,
  processing: false,
  progress: 0,
  resultBlob: null as Blob | null,
  resultFileName: '',
  error: null as string | null,
};

export const useToolStore = create<ToolState>((set, get) => ({
  ...initialState,

  addFiles: async (newFiles) => {
    const toolFiles: ToolFile[] = await Promise.all(
      newFiles.map(async (file) => {
        const data = await file.arrayBuffer();
        return {
          id: Math.random().toString(36).slice(2, 10),
          file,
          name: file.name,
          size: file.size,
          data,
        };
      })
    );
    set((s) => ({
      files: [...s.files, ...toolFiles],
      currentStep: 'configure',
      error: null,
    }));
  },

  removeFile: (id) =>
    set((s) => {
      const files = s.files.filter((f) => f.id !== id);
      return { files, currentStep: files.length === 0 ? 'upload' : s.currentStep };
    }),

  reorderFiles: (from, to) =>
    set((s) => {
      const files = [...s.files];
      const [moved] = files.splice(from, 1);
      files.splice(to, 0, moved);
      return { files };
    }),

  setStep: (step) => set({ currentStep: step }),
  setProcessing: (processing) => set({ processing }),
  setProgress: (progress) => set({ progress }),
  setResult: (blob, fileName) =>
    set({ resultBlob: blob, resultFileName: fileName, currentStep: 'download', processing: false }),
  setError: (error) => set({ error, processing: false }),
  reset: () => set(initialState),
}));
