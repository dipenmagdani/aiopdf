import { cn } from '@/lib/utils';
import { motion, type HTMLMotionProps } from 'framer-motion';

interface GlassPanelProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
}

export function GlassPanel({ children, className, glow, ...props }: GlassPanelProps) {
  return (
    <motion.div
      className={cn(
        'glass-panel rounded-xl p-6',
        glow && 'glow-accent',
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}
