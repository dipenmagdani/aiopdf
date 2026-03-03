import { useState, useCallback } from 'react';
import { ToolLayoutWrapper } from '@/components/shared/ToolLayoutWrapper';
import { UploadDropzone } from '@/components/shared/UploadDropzone';
import { PremiumButton } from '@/components/shared/PremiumButton';
import { useToolStore } from '@/store/toolStore';
import { getToolBySlug } from '@/lib/toolsConfig';
import { splitDocument, parseRanges } from '@/lib/engines/splitEngine';
import { Input } from '@/components/ui/input';
import { Download } from 'lucide-react';

const tool = getToolBySlug('split')!;

export default function SplitPdf() {
  const { files, addFiles, processing, resultBlob, currentStep, setProcessing, setResult, setError } = useToolStore();
  const [rangeInput, setRangeInput] = useState('1-3, 4-6');

  const handleSplit = useCallback(async () => {
    if (!files[0]) return;
    setProcessing(true);
    try {
      const pdfjsLib = await import('pdfjs-dist');
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
      const doc = await pdfjsLib.getDocument({ data: new Uint8Array(files[0].data) }).promise;
      const ranges = parseRanges(rangeInput, doc.numPages);
      const blobs = await splitDocument(files[0].data, ranges);
      // For simplicity, download first split
      setResult(blobs[0], 'split-1.pdf');
    } catch (e: any) {
      setError(e.message);
    }
  }, [files, rangeInput, setProcessing, setResult, setError]);

  const handleDownload = () => {
    if (!resultBlob) return;
    const url = URL.createObjectURL(resultBlob);
    const a = document.createElement('a');
    a.href = url; a.download = 'split.pdf'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <ToolLayoutWrapper tool={tool}>
      {currentStep === 'upload' && (
        <UploadDropzone accept=".pdf" onFiles={(f) => addFiles(f)} label="Drop a PDF to split" />
      )}
      {(currentStep === 'configure' || currentStep === 'preview') && (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">File: {files[0]?.name}</p>
          <div>
            <label className="text-sm font-medium mb-1 block">Page Ranges</label>
            <Input value={rangeInput} onChange={(e) => setRangeInput(e.target.value)} placeholder="e.g. 1-3, 5, 7-10" />
            <p className="text-xs text-muted-foreground mt-1">Separate ranges with commas</p>
          </div>
          <PremiumButton onClick={handleSplit} loading={processing} className="w-full">Split PDF</PremiumButton>
        </div>
      )}
      {currentStep === 'download' && (
        <div className="flex flex-col items-center gap-6 py-12">
          <Download className="h-12 w-12 text-emerald-500" />
          <p className="text-lg font-semibold">Split Complete!</p>
          <PremiumButton onClick={handleDownload}>Download</PremiumButton>
        </div>
      )}
    </ToolLayoutWrapper>
  );
}
