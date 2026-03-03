import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Navbar } from './Navbar';
import { Stepper } from './Stepper';
import { useToolStore } from '@/store/toolStore';
import type { ToolConfig } from '@/lib/toolsConfig';

interface ToolLayoutWrapperProps {
  tool: ToolConfig;
  children: React.ReactNode;
}

export function ToolLayoutWrapper({ tool, children }: ToolLayoutWrapperProps) {
  const currentStep = useToolStore((s) => s.currentStep);
  const reset = useToolStore((s) => s.reset);
  const Icon = tool.icon;

  useEffect(() => {
    return () => reset();
  }, [reset]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8"
        >
          {/* Left panel */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className={`inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${tool.color}`}>
                <Icon className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">{tool.name}</h1>
                <p className="text-sm text-muted-foreground">{tool.description}</p>
              </div>
            </div>
            <Stepper currentStep={currentStep} />
          </div>

          {/* Right panel */}
          <div className="min-h-[500px]">{children}</div>
        </motion.div>
      </div>
    </div>
  );
}
