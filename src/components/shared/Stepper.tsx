import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import { motion } from 'framer-motion';
import type { ToolStep } from '@/store/toolStore';

const steps: { key: ToolStep; label: string }[] = [
  { key: 'upload', label: 'Upload' },
  { key: 'configure', label: 'Configure' },
  { key: 'preview', label: 'Preview' },
  { key: 'download', label: 'Download' },
];

const stepOrder: ToolStep[] = ['upload', 'configure', 'preview', 'download'];

interface StepperProps {
  currentStep: ToolStep;
}

export function Stepper({ currentStep }: StepperProps) {
  const currentIdx = stepOrder.indexOf(currentStep);

  return (
    <div className="flex flex-col gap-1">
      {steps.map((step, i) => {
        const isComplete = i < currentIdx;
        const isActive = i === currentIdx;

        return (
          <div key={step.key} className="flex items-center gap-3">
            <motion.div
              initial={false}
              animate={{
                scale: isActive ? 1.1 : 1,
                backgroundColor: isComplete
                  ? 'hsl(var(--editor-accent))'
                  : isActive
                  ? 'hsl(var(--editor-accent) / 0.2)'
                  : 'hsl(var(--muted))',
              }}
              className={cn(
                'flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors',
                isComplete && 'text-primary-foreground',
                isActive && 'text-[hsl(var(--editor-accent))] ring-2 ring-[hsl(var(--editor-accent)/0.4)]',
                !isComplete && !isActive && 'text-muted-foreground'
              )}
            >
              {isComplete ? <Check className="h-4 w-4" /> : i + 1}
            </motion.div>
            <span
              className={cn(
                'text-sm font-medium',
                isActive && 'text-foreground',
                isComplete && 'text-muted-foreground',
                !isActive && !isComplete && 'text-muted-foreground/60'
              )}
            >
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
