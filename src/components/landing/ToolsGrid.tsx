import { motion } from 'framer-motion';
import { toolsConfig } from '@/lib/toolsConfig';
import { ToolCard } from '@/components/shared/ToolCard';

export function ToolsGrid() {
  return (
    <section className="py-24 bg-background">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            Every PDF Tool You Need
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            A complete suite of tools for editing, converting, organizing, and securing your documents.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {toolsConfig.map((tool, i) => (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <ToolCard tool={tool} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
