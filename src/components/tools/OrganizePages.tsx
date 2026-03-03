import { useCallback } from 'react';
import { ToolLayoutWrapper } from '@/components/shared/ToolLayoutWrapper';
import { UploadDropzone } from '@/components/shared/UploadDropzone';
import { PremiumButton } from '@/components/shared/PremiumButton';
import { useToolStore } from '@/store/toolStore';
import { getToolBySlug } from '@/lib/toolsConfig';
import { organizePages } from '@/lib/engines/organizeEngine';
import { Download } from 'lucide-react';

const tool = getToolBySlug('organize')!;

export default function OrganizePages() {
  const { files, addFiles, processing, resultBlob, currentStep, setProcessing, setResult, setError } = useToolStore();

  const handleOrganize = useCallback(async () => {
    if (!files[0]) return;
    setProcessing(true);
    try {
      const pdfjsLib = await import('pdfjs-dist');
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
      const doc = await pdfjsLib.getDocument({ data: new Uint8Array(files[0].data) }).promise;
      const order = Array.from({ length: doc.numPages }, (_, i) => i);
      const blob = await organizePages(files[0].data, order);
      setResult(blob, `organized-${files[0].name}`);
    } catch (e: any) {
      setError(e.message);
    }
  }, [files, setProcessing, setResult, setError]);

  const handleDownload = () => {
    if (!resultBlob) return;
    const url = URL.createObjectURL(resultBlob);
    const a = document.createElement('a');
    a.href = url; a.download = 'organized.pdf'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <ToolLayoutWrapper tool={tool}>
      {currentStep === 'upload' && (
        <UploadDropzone accept=".pdf" onFiles={(f) => addFiles(f)} label="Drop a PDF to organize" />
      )}
      {(currentStep === 'configure' || currentStep === 'preview') && (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">File: {files[0]?.name}</p>
          <p className="text-sm text-muted-foreground">Page reordering UI coming soon. Click below to process.</p>
          <PremiumButton onClick={handleOrganize} loading={processing} className="w-full">Organize Pages</PremiumButton>
        </div>
      )}
      {currentStep === 'download' && (
        <div className="flex flex-col items-center gap-6 py-12">
          <Download className="h-12 w-12 text-emerald-500" />
          <p className="font-semibold">Done!</p>
          <PremiumButton onClick={handleDownload}>Download</PremiumButton>
        </div>
      )}
    </ToolLayoutWrapper>
  );
}
