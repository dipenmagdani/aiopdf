"use client";
import { useState, useCallback } from 'react';
import { ToolLayoutWrapper } from '@/components/shared/ToolLayoutWrapper';
import { UploadDropzone } from '@/components/shared/UploadDropzone';
import { PremiumButton } from '@/components/shared/PremiumButton';
import { useToolStore } from '@/store/toolStore';
import { getToolBySlug } from '@/lib/toolsConfig';
import { compressPdf } from '@/lib/engines/compressEngine';
import { Slider } from '@/components/ui/slider';
import { Download } from 'lucide-react';

const tool = getToolBySlug('compress')!;

export default function CompressPdf() {
  const { files, addFiles, processing, resultBlob, currentStep, setProcessing, setResult, setError } = useToolStore();
  const [quality, setQuality] = useState(0.5);

  const labels = quality < 0.3 ? 'High Compression' : quality < 0.7 ? 'Medium' : 'Low Compression';

  const handleCompress = useCallback(async () => {
    if (!files[0]) return;
    setProcessing(true);
    try {
      const blob = await compressPdf(files[0].data, quality);
      setResult(blob, `compressed-${files[0].name}`);
    } catch (e: any) {
      setError(e.message);
    }
  }, [files, quality, setProcessing, setResult, setError]);

  const handleDownload = () => {
    if (!resultBlob) return;
    const url = URL.createObjectURL(resultBlob);
    const a = document.createElement('a');
    a.href = url; a.download = 'compressed.pdf'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <ToolLayoutWrapper tool={tool}>
      {currentStep === 'upload' && (
        <UploadDropzone accept=".pdf" onFiles={(f) => addFiles(f)} label="Drop a PDF to compress" />
      )}
      {(currentStep === 'configure' || currentStep === 'preview') && (
        <div className="space-y-6">
          <p className="text-sm text-muted-foreground">File: {files[0]?.name} ({(files[0]?.size / 1024).toFixed(0)} KB)</p>
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium">Compression Level</label>
              <span className="text-sm text-muted-foreground">{labels}</span>
            </div>
            <Slider value={[quality]} onValueChange={([v]) => setQuality(v)} min={0.1} max={0.95} step={0.05} />
          </div>
          <PremiumButton onClick={handleCompress} loading={processing} className="w-full">Compress PDF</PremiumButton>
        </div>
      )}
      {currentStep === 'download' && (
        <div className="flex flex-col items-center gap-6 py-12">
          <Download className="h-12 w-12 text-emerald-500" />
          <p className="font-semibold">Compressed! New size: {resultBlob && (resultBlob.size / 1024).toFixed(0)} KB</p>
          <PremiumButton onClick={handleDownload}>Download</PremiumButton>
        </div>
      )}
    </ToolLayoutWrapper>
  );
}
