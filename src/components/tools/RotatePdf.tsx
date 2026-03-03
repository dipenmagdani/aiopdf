"use client";
import { useState, useCallback } from 'react';
import { ToolLayoutWrapper } from '@/components/shared/ToolLayoutWrapper';
import { UploadDropzone } from '@/components/shared/UploadDropzone';
import { PremiumButton } from '@/components/shared/PremiumButton';
import { useToolStore } from '@/store/toolStore';
import { getToolBySlug } from '@/lib/toolsConfig';
import { rotatePages } from '@/lib/engines/rotateEngine';
import { RotateCw, Download } from 'lucide-react';

const tool = getToolBySlug('rotate-pdf')!;

export default function RotatePdf() {
  const { files, addFiles, processing, resultBlob, currentStep, setProcessing, setResult, setError } = useToolStore();
  const [rotation, setRotation] = useState(90);

  const handleRotate = useCallback(async () => {
    if (!files[0]) return;
    setProcessing(true);
    try {
      const pdfjsLib = await import('pdfjs-dist');
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
      const doc = await pdfjsLib.getDocument({ data: new Uint8Array(files[0].data) }).promise;
      const rotations = new Map<number, number>();
      for (let i = 0; i < doc.numPages; i++) rotations.set(i, rotation);
      const blob = await rotatePages(files[0].data, rotations);
      setResult(blob, `rotated-${files[0].name}`);
    } catch (e: any) {
      setError(e.message);
    }
  }, [files, rotation, setProcessing, setResult, setError]);

  const handleDownload = () => {
    if (!resultBlob) return;
    const url = URL.createObjectURL(resultBlob);
    const a = document.createElement('a');
    a.href = url; a.download = 'rotated.pdf'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <ToolLayoutWrapper tool={tool}>
      {currentStep === 'upload' && (
        <UploadDropzone accept=".pdf" onFiles={(f) => addFiles(f)} label="Drop a PDF to rotate" />
      )}
      {(currentStep === 'configure' || currentStep === 'preview') && (
        <div className="space-y-6">
          <p className="text-sm text-muted-foreground">File: {files[0]?.name}</p>
          <div className="flex gap-3">
            {[90, 180, 270].map((deg) => (
              <button
                key={deg}
                onClick={() => setRotation(deg)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                  rotation === deg ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:bg-muted'
                }`}
              >
                <RotateCw className="h-4 w-4" /> {deg}°
              </button>
            ))}
          </div>
          <PremiumButton onClick={handleRotate} loading={processing} className="w-full">Rotate All Pages</PremiumButton>
        </div>
      )}
      {currentStep === 'download' && (
        <div className="flex flex-col items-center gap-6 py-12">
          <Download className="h-12 w-12 text-emerald-500" />
          <p className="font-semibold">Rotation Complete!</p>
          <PremiumButton onClick={handleDownload}>Download</PremiumButton>
        </div>
      )}
    </ToolLayoutWrapper>
  );
}
