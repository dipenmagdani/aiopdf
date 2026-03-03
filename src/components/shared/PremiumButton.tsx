import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface PremiumButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  variant?: 'primary' | 'secondary';
  size?: 'default' | 'lg';
}

export function PremiumButton({
  children,
  className,
  loading,
  variant = 'primary',
  size = 'default',
  disabled,
  ...props
}: PremiumButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        'relative inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none',
        variant === 'primary' &&
          'bg-gradient-to-r from-[hsl(var(--gradient-start))] to-[hsl(var(--gradient-end))] text-primary-foreground shadow-lg hover:shadow-[0_0_30px_-4px_hsl(var(--editor-accent)/0.4)]',
        variant === 'secondary' &&
          'border border-border bg-secondary text-secondary-foreground hover:bg-secondary/80',
        size === 'default' && 'h-10 px-6 text-sm',
        size === 'lg' && 'h-12 px-8 text-base',
        className
      )}
      disabled={disabled || loading}
      {...(props as any)}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </motion.button>
  );
}
