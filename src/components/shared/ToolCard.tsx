import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import type { ToolConfig } from '@/lib/toolsConfig';

interface ToolCardProps {
  tool: ToolConfig;
}

export function ToolCard({ tool }: ToolCardProps) {
  const Icon = tool.icon;

  return (
    <Link to={tool.route}>
      <motion.div
        whileHover={{ y: -4 }}
        className="glow-card glass-panel rounded-xl p-5 flex flex-col gap-3 cursor-pointer group relative overflow-hidden"
      >
        <div className={cn('inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br', tool.color)}>
          <Icon className="h-5 w-5 text-white" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-foreground">{tool.name}</h3>
            {tool.tier === 'pro' && (
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0 bg-gradient-to-r from-[hsl(var(--gradient-start))] to-[hsl(var(--gradient-end))] text-white border-0">
                PRO
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-1">{tool.description}</p>
        </div>
        <Badge variant="outline" className="w-fit text-[10px]">
          {tool.category}
        </Badge>
      </motion.div>
    </Link>
  );
}
