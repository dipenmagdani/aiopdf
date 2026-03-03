"use client";
import { useState, useCallback } from 'react';
import { ToolLayoutWrapper } from '@/components/shared/ToolLayoutWrapper';
import { UploadDropzone } from '@/components/shared/UploadDropzone';
import { PremiumButton } from '@/components/shared/PremiumButton';
import { useToolStore } from '@/store/toolStore';
import { getToolBySlug } from '@/lib/toolsConfig';
import { encryptPdf } from '@/lib/engines/securityEngine';
import { Input } from '@/components/ui/input';
import { Download, Shield } from 'lucide-react';

const tool = getToolBySlug('encrypt')!;

export default function EncryptPdf() {
  const { files, addFiles, processing, resultBlob, currentStep, setProcessing, setResult, setError } = useToolStore();
  const [password, setPassword] = useState('');

  const strength = password.length < 4 ? 'Weak' : password.length < 8 ? 'Medium' : 'Strong';
  const strengthColor = strength === 'Weak' ? 'text-destructive' : strength === 'Medium' ? 'text-yellow-500' : 'text-emerald-500';

  const handleEncrypt = useCallback(async () => {
    if (!files[0] || !password) return;
    setProcessing(true);
    try {
      const blob = await encryptPdf(files[0].data, password);
      setResult(blob, `encrypted-${files[0].name}`);
    } catch (e: any) {
      setError(e.message);
    }
  }, [files, password, setProcessing, setResult, setError]);

  const handleDownload = () => {
    if (!resultBlob) return;
    const url = URL.createObjectURL(resultBlob);
    const a = document.createElement('a');
    a.href = url; a.download = 'encrypted.pdf'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <ToolLayoutWrapper tool={tool}>
      {currentStep === 'upload' && (
        <UploadDropzone accept=".pdf" onFiles={(f) => addFiles(f)} label="Drop a PDF to encrypt" />
      )}
      {(currentStep === 'configure' || currentStep === 'preview') && (
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <p className="text-sm text-muted-foreground">File: {files[0]?.name}</p>
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Password</label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" />
            {password && <p className={`text-xs mt-1 ${strengthColor}`}>Strength: {strength}</p>}
          </div>
          <PremiumButton onClick={handleEncrypt} loading={processing} disabled={!password} className="w-full">Encrypt PDF</PremiumButton>
        </div>
      )}
      {currentStep === 'download' && (
        <div className="flex flex-col items-center gap-6 py-12">
          <Download className="h-12 w-12 text-emerald-500" />
          <p className="font-semibold">PDF Encrypted!</p>
          <PremiumButton onClick={handleDownload}>Download</PremiumButton>
        </div>
      )}
    </ToolLayoutWrapper>
  );
}
