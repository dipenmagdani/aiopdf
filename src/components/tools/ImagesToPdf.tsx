"use client";
import { useCallback } from 'react';
import { ToolLayoutWrapper } from '@/components/shared/ToolLayoutWrapper';
import { UploadDropzone } from '@/components/shared/UploadDropzone';
import { PremiumButton } from '@/components/shared/PremiumButton';
import { useToolStore } from '@/store/toolStore';
import { getToolBySlug } from '@/lib/toolsConfig';
import { imagesToPdf } from '@/lib/engines/convertEngine';
import { X, Download } from 'lucide-react';

const tool = getToolBySlug('images-to-pdf')!;

export default function ImagesToPdf() {
  const { files, addFiles, removeFile, processing, resultBlob, currentStep, setProcessing, setResult, setError } = useToolStore();

  const handleConvert = useCallback(async () => {
    if (files.length === 0) return;
    setProcessing(true);
    try {
      const images = files.map((f) => ({ data: f.data, type: f.file.type }));
      const blob = await imagesToPdf(images);
      setResult(blob, 'images.pdf');
    } catch (e: any) {
      setError(e.message);
    }
  }, [files, setProcessing, setResult, setError]);

  const handleDownload = () => {
    if (!resultBlob) return;
    const url = URL.createObjectURL(resultBlob);
    const a = document.createElement('a');
    a.href = url; a.download = 'images.pdf'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <ToolLayoutWrapper tool={tool}>
      {currentStep === 'upload' && (
        <UploadDropzone
          accept="image/png,image/jpeg,image/jpg"
          multiple
          onFiles={(f) => addFiles(f)}
          label="Drop images here"
          sublabel="PNG, JPEG supported"
        />
      )}
      {(currentStep === 'configure' || currentStep === 'preview') && (
        <div className="space-y-4">
          <UploadDropzone
            accept="image/png,image/jpeg,image/jpg"
            multiple
            onFiles={(f) => addFiles(f)}
            label="Add more images"
            className="min-h-0 py-6"
          />
          <div className="grid grid-cols-3 gap-3">
            {files.map((f) => (
              <div key={f.id} className="relative rounded-lg border border-border overflow-hidden">
                <img src={URL.createObjectURL(f.file)} alt={f.name} className="w-full aspect-[3/4] object-cover" />
                <button onClick={() => removeFile(f.id)} className="absolute top-1 right-1 bg-background/80 rounded-full p-1">
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
          <PremiumButton onClick={handleConvert} loading={processing} className="w-full">
            Create PDF from {files.length} images
          </PremiumButton>
        </div>
      )}
      {currentStep === 'download' && (
        <div className="flex flex-col items-center gap-6 py-12">
          <Download className="h-12 w-12 text-emerald-500" />
          <p className="font-semibold">PDF Created!</p>
          <PremiumButton onClick={handleDownload}>Download PDF</PremiumButton>
        </div>
      )}
    </ToolLayoutWrapper>
  );
}
