"use client";
import { useState, useCallback } from 'react';
import { ToolLayoutWrapper } from '@/components/shared/ToolLayoutWrapper';
import { UploadDropzone } from '@/components/shared/UploadDropzone';
import { PremiumButton } from '@/components/shared/PremiumButton';
import { useToolStore } from '@/store/toolStore';
import { getToolBySlug } from '@/lib/toolsConfig';
import { addWatermark } from '@/lib/engines/watermarkEngine';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Download } from 'lucide-react';

const tool = getToolBySlug('watermark-pdf')!;

export default function AddWatermark() {
  const { files, addFiles, processing, resultBlob, currentStep, setProcessing, setResult, setError } = useToolStore();
  const [text, setText] = useState('CONFIDENTIAL');
  const [opacity, setOpacity] = useState(0.15);
  const [fontSize, setFontSize] = useState(48);

  const handleWatermark = useCallback(async () => {
    if (!files[0]) return;
    setProcessing(true);
    try {
      const blob = await addWatermark(files[0].data, { text, opacity, fontSize });
      setResult(blob, `watermarked-${files[0].name}`);
    } catch (e: any) {
      setError(e.message);
    }
  }, [files, text, opacity, fontSize, setProcessing, setResult, setError]);

  const handleDownload = () => {
    if (!resultBlob) return;
    const url = URL.createObjectURL(resultBlob);
    const a = document.createElement('a');
    a.href = url; a.download = 'watermarked.pdf'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <ToolLayoutWrapper tool={tool}>
      {currentStep === 'upload' && (
        <UploadDropzone accept=".pdf" onFiles={(f) => addFiles(f)} label="Drop a PDF to watermark" />
      )}
      {(currentStep === 'configure' || currentStep === 'preview') && (
        <div className="space-y-6">
          <div>
            <label className="text-sm font-medium mb-1 block">Watermark Text</label>
            <Input value={text} onChange={(e) => setText(e.target.value)} />
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium">Opacity</label>
              <span className="text-sm text-muted-foreground">{Math.round(opacity * 100)}%</span>
            </div>
            <Slider value={[opacity]} onValueChange={([v]) => setOpacity(v)} min={0.05} max={0.5} step={0.05} />
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium">Font Size</label>
              <span className="text-sm text-muted-foreground">{fontSize}px</span>
            </div>
            <Slider value={[fontSize]} onValueChange={([v]) => setFontSize(v)} min={12} max={120} step={4} />
          </div>
          <PremiumButton onClick={handleWatermark} loading={processing} className="w-full">Add Watermark</PremiumButton>
        </div>
      )}
      {currentStep === 'download' && (
        <div className="flex flex-col items-center gap-6 py-12">
          <Download className="h-12 w-12 text-emerald-500" />
          <p className="font-semibold">Watermark Added!</p>
          <PremiumButton onClick={handleDownload}>Download</PremiumButton>
        </div>
      )}
    </ToolLayoutWrapper>
  );
}
