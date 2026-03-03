import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { cardHoverVariants } from "@/lib/motion";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import type { ToolConfig } from "@/lib/toolsConfig";

interface ToolCardProps {
  tool: ToolConfig;
}

export function ToolCard({ tool }: ToolCardProps) {
  const Icon = tool.icon;

  return (
    <Link href={tool.route}>
      <motion.div
        variants={cardHoverVariants}
        initial="idle"
        whileHover="hover"
        whileTap="tap"
        className="glass-panel rounded-2xl p-6 flex flex-col gap-4 cursor-pointer group relative overflow-hidden bg-background/40 hover:bg-background/80 hover:shadow-[var(--depth-2)] transition-colors duration-300"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div
          className={cn(
            "inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br shadow-sm group-hover:shadow-md transition-shadow",
            tool.color
          )}
        >
          <Icon className="h-6 w-6 text-white transform group-hover:scale-110 transition-transform duration-300" />
        </div>
        <div className="z-10">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
              {tool.name}
            </h3>
            {tool.tier === "pro" && (
              <Badge
                variant="secondary"
                className="text-[10px] px-2 py-0.5 bg-gradient-to-r from-emerald-400 to-emerald-600 text-white border-0 shadow-sm shadow-emerald-500/20"
              >
                PRO
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {tool.description}
          </p>
        </div>
        <Badge
          variant="outline"
          className="w-fit text-xs px-2 py-0.5 mt-auto z-10 bg-background/50 backdrop-blur-sm group-hover:border-primary/30 transition-colors"
        >
          {tool.category}
        </Badge>
      </motion.div>
    </Link>
  );
}
