import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { Navbar } from '@/components/shared/Navbar';
import { ToolCard } from '@/components/shared/ToolCard';
import { toolsConfig, type ToolCategory } from '@/lib/toolsConfig';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Footer } from '@/components/landing/Footer';

const categories: (ToolCategory | 'All')[] = ['All', 'Edit', 'Convert', 'Organize', 'Security'];

const ToolsDirectory = () => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<ToolCategory | 'All'>('All');

  const filtered = useMemo(() => {
    return toolsConfig.filter((t) => {
      const matchesCategory = category === 'All' || t.category === category;
      const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.description.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [search, category]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="container py-12 flex-1">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">All PDF Tools</h1>
          <p className="text-muted-foreground">Everything you need to work with PDFs, in one place.</p>
        </motion.div>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tools..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <Badge
                key={cat}
                variant={category === cat ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => setCategory(cat)}
              >
                {cat}
              </Badge>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((tool, i) => (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <ToolCard tool={tool} />
            </motion.div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ToolsDirectory;
