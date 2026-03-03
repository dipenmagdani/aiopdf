"use client";
import { useState, useCallback } from 'react';
import { ToolLayoutWrapper } from '@/components/shared/ToolLayoutWrapper';
import { UploadDropzone } from '@/components/shared/UploadDropzone';
import { PremiumButton } from '@/components/shared/PremiumButton';
import { useToolStore } from '@/store/toolStore';
import { getToolBySlug } from '@/lib/toolsConfig';
import { pdfToImages } from '@/lib/engines/convertEngine';
import { Download } from 'lucide-react';

const tool = getToolBySlug('pdf-to-images')!;

export default function PdfToImages() {
  const { files, addFiles, processing, currentStep, setProcessing, setStep, setError } = useToolStore();
  const [format, setFormat] = useState<'png' | 'jpeg'>('png');
  const [images, setImages] = useState<string[]>([]);

  const handleConvert = useCallback(async () => {
    if (!files[0]) return;
    setProcessing(true);
    try {
      const urls = await pdfToImages(files[0].data, format);
      setImages(urls);
      setStep('download');
      setProcessing(false);
    } catch (e: any) {
      setError(e.message);
    }
  }, [files, format, setProcessing, setStep, setError]);

  const downloadImage = (url: string, idx: number) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = `page-${idx + 1}.${format}`;
    a.click();
  };

  return (
    <ToolLayoutWrapper tool={tool}>
      {currentStep === 'upload' && (
        <UploadDropzone accept=".pdf" onFiles={(f) => addFiles(f)} label="Drop a PDF to convert" />
      )}
      {(currentStep === 'configure' || currentStep === 'preview') && (
        <div className="space-y-6">
          <p className="text-sm text-muted-foreground">File: {files[0]?.name}</p>
          <div className="flex gap-3">
            {(['png', 'jpeg'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFormat(f)}
                className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                  format === f ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:bg-muted'
                }`}
              >
                {f.toUpperCase()}
              </button>
            ))}
          </div>
          <PremiumButton onClick={handleConvert} loading={processing} className="w-full">Convert to Images</PremiumButton>
        </div>
      )}
      {currentStep === 'download' && (
        <div className="space-y-4">
          <p className="font-semibold">{images.length} pages converted</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {images.map((url, i) => (
              <div key={i} className="rounded-lg border border-border overflow-hidden cursor-pointer hover:ring-2 ring-primary transition-all" onClick={() => downloadImage(url, i)}>
                <img src={url} alt={`Page ${i + 1}`} className="w-full" />
                <div className="p-2 text-center text-xs text-muted-foreground flex items-center justify-center gap-1">
                  <Download className="h-3 w-3" /> Page {i + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </ToolLayoutWrapper>
  );
}
