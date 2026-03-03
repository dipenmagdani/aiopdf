import { usePdfStore } from '@/store/pdfStore';
import { UploadScreen } from '@/components/editor/UploadScreen';
import { PdfEditor } from '@/components/editor/PdfEditor';

const Editor = () => {
  const pdfData = usePdfStore((s) => s.pdfData);
  return pdfData ? <PdfEditor /> : <UploadScreen />;
};

export default Editor;
