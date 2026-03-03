"use client";
import { useCallback } from 'react';
import { ToolLayoutWrapper } from '@/components/shared/ToolLayoutWrapper';
import { UploadDropzone } from '@/components/shared/UploadDropzone';
import { PremiumButton } from '@/components/shared/PremiumButton';
import { useToolStore } from '@/store/toolStore';
import { getToolBySlug } from '@/lib/toolsConfig';
import { mergeDocuments } from '@/lib/engines/mergeEngine';
import { X, GripVertical, Download } from 'lucide-react';

const tool = getToolBySlug('merge')!;

export default function MergePdf() {
  const { files, addFiles, removeFile, reorderFiles, processing, resultBlob, currentStep, setProcessing, setResult, setError } = useToolStore();

  const handleMerge = useCallback(async () => {
    if (files.length < 2) return;
    setProcessing(true);
    try {
      const blob = await mergeDocuments(files.map((f) => f.data));
      setResult(blob, 'merged.pdf');
    } catch (e: any) {
      setError(e.message);
    }
  }, [files, setProcessing, setResult, setError]);

  const handleDownload = () => {
    if (!resultBlob) return;
    const url = URL.createObjectURL(resultBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'merged.pdf';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <ToolLayoutWrapper tool={tool}>
      {currentStep === 'upload' && (
        <UploadDropzone
          accept=".pdf"
          multiple
          onFiles={(f) => addFiles(f)}
          label="Drop PDFs here to merge"
          sublabel="You can add multiple files"
        />
      )}

      {(currentStep === 'configure' || currentStep === 'preview') && (
        <div className="space-y-4">
          <UploadDropzone
            accept=".pdf"
            multiple
            onFiles={(f) => addFiles(f)}
            label="Add more PDFs"
            className="min-h-0 py-6"
          />
          <div className="space-y-2">
            {files.map((file, i) => (
              <div key={file.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border">
                <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                <span className="flex-1 text-sm truncate">{file.name}</span>
                <span className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(0)} KB</span>
                <button onClick={() => removeFile(file.id)} className="text-muted-foreground hover:text-destructive">
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
          <PremiumButton
            onClick={handleMerge}
            loading={processing}
            disabled={files.length < 2}
            className="w-full"
          >
            Merge {files.length} PDFs
          </PremiumButton>
        </div>
      )}

      {currentStep === 'download' && (
        <div className="flex flex-col items-center justify-center gap-6 py-12">
          <div className="h-16 w-16 rounded-full bg-emerald-500/10 flex items-center justify-center">
            <Download className="h-8 w-8 text-emerald-500" />
          </div>
          <p className="text-lg font-semibold">Merge Complete!</p>
          <PremiumButton onClick={handleDownload}>Download Merged PDF</PremiumButton>
        </div>
      )}
    </ToolLayoutWrapper>
  );
}
