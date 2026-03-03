"use client";
import { useState, useCallback } from 'react';
import { ToolLayoutWrapper } from '@/components/shared/ToolLayoutWrapper';
import { UploadDropzone } from '@/components/shared/UploadDropzone';
import { PremiumButton } from '@/components/shared/PremiumButton';
import { useToolStore } from '@/store/toolStore';
import { getToolBySlug } from '@/lib/toolsConfig';
import { decryptPdf } from '@/lib/engines/securityEngine';
import { Input } from '@/components/ui/input';
import { Download, Unlock } from 'lucide-react';

const tool = getToolBySlug('decrypt')!;

export default function DecryptPdf() {
  const { files, addFiles, processing, resultBlob, currentStep, setProcessing, setResult, setError } = useToolStore();
  const [password, setPassword] = useState('');

  const handleDecrypt = useCallback(async () => {
    if (!files[0] || !password) return;
    setProcessing(true);
    try {
      const blob = await decryptPdf(files[0].data, password);
      setResult(blob, `decrypted-${files[0].name}`);
    } catch (e: any) {
      setError(e.message);
    }
  }, [files, password, setProcessing, setResult, setError]);

  const handleDownload = () => {
    if (!resultBlob) return;
    const url = URL.createObjectURL(resultBlob);
    const a = document.createElement('a');
    a.href = url; a.download = 'decrypted.pdf'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <ToolLayoutWrapper tool={tool}>
      {currentStep === 'upload' && (
        <UploadDropzone accept=".pdf" onFiles={(f) => addFiles(f)} label="Drop an encrypted PDF" />
      )}
      {(currentStep === 'configure' || currentStep === 'preview') && (
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Unlock className="h-5 w-5 text-primary" />
            <p className="text-sm text-muted-foreground">File: {files[0]?.name}</p>
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Password</label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter PDF password" />
          </div>
          <PremiumButton onClick={handleDecrypt} loading={processing} disabled={!password} className="w-full">Decrypt PDF</PremiumButton>
        </div>
      )}
      {currentStep === 'download' && (
        <div className="flex flex-col items-center gap-6 py-12">
          <Download className="h-12 w-12 text-emerald-500" />
          <p className="font-semibold">PDF Decrypted!</p>
          <PremiumButton onClick={handleDownload}>Download</PremiumButton>
        </div>
      )}
    </ToolLayoutWrapper>
  );
}
