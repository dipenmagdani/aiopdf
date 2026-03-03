import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Editor from "./pages/Editor";
import ToolsDirectory from "./pages/ToolsDirectory";
import NotFound from "./pages/NotFound";

// Tool pages
import MergePdf from "./components/tools/MergePdf";
import SplitPdf from "./components/tools/SplitPdf";
import CompressPdf from "./components/tools/CompressPdf";
import RotatePdf from "./components/tools/RotatePdf";
import PdfToImages from "./components/tools/PdfToImages";
import ImagesToPdf from "./components/tools/ImagesToPdf";
import OrganizePages from "./components/tools/OrganizePages";
import AddWatermark from "./components/tools/AddWatermark";
import EncryptPdf from "./components/tools/EncryptPdf";
import DecryptPdf from "./components/tools/DecryptPdf";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/editor" element={<Editor />} />
          <Route path="/tools" element={<ToolsDirectory />} />
          <Route path="/tools/merge" element={<MergePdf />} />
          <Route path="/tools/split" element={<SplitPdf />} />
          <Route path="/tools/compress" element={<CompressPdf />} />
          <Route path="/tools/rotate" element={<RotatePdf />} />
          <Route path="/tools/pdf-to-images" element={<PdfToImages />} />
          <Route path="/tools/images-to-pdf" element={<ImagesToPdf />} />
          <Route path="/tools/organize" element={<OrganizePages />} />
          <Route path="/tools/watermark" element={<AddWatermark />} />
          <Route path="/tools/encrypt" element={<EncryptPdf />} />
          <Route path="/tools/decrypt" element={<DecryptPdf />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
