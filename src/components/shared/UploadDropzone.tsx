import { useCallback, useState } from 'react';
import { cn } from '@/lib/utils';
import { Upload, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface UploadDropzoneProps {
  accept?: string;
  multiple?: boolean;
  onFiles: (files: File[]) => void;
  label?: string;
  sublabel?: string;
  className?: string;
}

export function UploadDropzone({
  accept = '.pdf',
  multiple = false,
  onFiles,
  label = 'Drop your PDF here',
  sublabel = 'or click to browse',
  className,
}: UploadDropzoneProps) {
  const [dragOver, setDragOver] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const files = Array.from(e.dataTransfer.files);
      if (files.length) onFiles(files);
    },
    [onFiles]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      if (files.length) onFiles(files);
    },
    [onFiles]
  );

  return (
    <label
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      className={cn(
        'relative flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed p-12 cursor-pointer transition-all duration-300',
        dragOver
          ? 'border-[hsl(var(--editor-accent))] bg-[hsl(var(--editor-accent)/0.05)]'
          : 'border-border hover:border-muted-foreground/40 hover:bg-muted/30',
        className
      )}
    >
      <input
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleChange}
        className="sr-only"
      />
      <AnimatePresence mode="wait">
        <motion.div
          key={dragOver ? 'drag' : 'idle'}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="flex flex-col items-center gap-3"
        >
          {dragOver ? (
            <FileText className="h-12 w-12 text-[hsl(var(--editor-accent))]" />
          ) : (
            <Upload className="h-12 w-12 text-muted-foreground" />
          )}
          <div className="text-center">
            <p className="font-semibold text-foreground">{label}</p>
            <p className="text-sm text-muted-foreground">{sublabel}</p>
          </div>
        </motion.div>
      </AnimatePresence>
    </label>
  );
}
