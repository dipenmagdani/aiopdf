import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { FileText, ChevronDown } from 'lucide-react';
import { PremiumButton } from './PremiumButton';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { toolsConfig } from '@/lib/toolsConfig';

export function Navbar() {
  const location = useLocation();
  const isLanding = location.pathname === '/';

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full border-b transition-all',
        isLanding ? 'border-transparent bg-background/80 backdrop-blur-lg' : 'border-border bg-background/80 backdrop-blur-lg'
      )}
    >
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[hsl(var(--gradient-start))] to-[hsl(var(--gradient-end))]">
            <FileText className="h-4 w-4 text-white" />
          </div>
          <span className="font-mono">PDFCraft</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
              Tools <ChevronDown className="h-3 w-3" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="w-56">
              {toolsConfig.map((tool) => (
                <DropdownMenuItem key={tool.id} asChild>
                  <Link to={tool.route} className="flex items-center gap-2">
                    <tool.icon className="h-4 w-4" />
                    {tool.name}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {isLanding && (
            <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </a>
          )}
        </nav>

        <div className="flex items-center gap-3">
          <Link to="/editor">
            <PremiumButton size="default">Edit PDF</PremiumButton>
          </Link>
        </div>
      </div>
    </header>
  );
}
