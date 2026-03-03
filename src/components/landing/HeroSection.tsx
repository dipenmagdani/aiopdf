import { motion } from "framer-motion";
import Link from "next/link";
import { PremiumButton } from "@/components/shared/PremiumButton";
import { GlassPanel } from "@/components/shared/GlassPanel";
import { FileText, ArrowRight } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden grain-bg">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-[hsl(var(--gradient-start)/0.08)]" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-[hsl(var(--gradient-start)/0.06)] blur-[120px]" />

      <div className="container relative z-10 flex flex-col items-center text-center gap-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="space-y-4 max-w-3xl"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-1.5 text-sm text-muted-foreground"
          >
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            100% browser-based · No uploads
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1]">
            Your PDFs.{" "}
            <span className="bg-gradient-to-r from-[hsl(var(--gradient-start))] to-[hsl(var(--gradient-end))] bg-clip-text text-transparent">
              Your Browser.
            </span>
            <br />
            Zero Uploads.
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto">
            Edit, merge, split, compress, and transform your PDFs — all
            processed locally in your browser. Your files never leave your
            device.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap gap-4 justify-center"
        >
          <Link href="/editor">
            <PremiumButton size="lg">
              <FileText className="h-5 w-5" />
              Edit PDF
            </PremiumButton>
          </Link>
          <Link href="/tools">
            <PremiumButton variant="secondary" size="lg">
              Explore Tools
              <ArrowRight className="h-4 w-4" />
            </PremiumButton>
          </Link>
        </motion.div>

        {/* Glassmorphism preview mockup */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="w-full max-w-4xl mt-8"
        >
          <GlassPanel className="p-1 rounded-2xl">
            <div className="bg-editor-bg rounded-xl p-6 min-h-[300px] flex items-center justify-center">
              <div className="space-y-4 w-full max-w-md">
                <div className="flex gap-3">
                  <div className="h-3 w-3 rounded-full bg-red-400/60" />
                  <div className="h-3 w-3 rounded-full bg-yellow-400/60" />
                  <div className="h-3 w-3 rounded-full bg-green-400/60" />
                </div>
                <div className="space-y-3">
                  <div className="h-4 bg-editor-surface rounded w-3/4" />
                  <div className="h-4 bg-editor-surface rounded w-1/2" />
                  <div className="h-4 bg-editor-surface rounded w-5/6" />
                  <div className="h-4 bg-editor-surface rounded w-2/3" />
                  <div className="h-20 bg-editor-surface rounded w-full" />
                  <div className="h-4 bg-editor-surface rounded w-4/5" />
                </div>
              </div>
            </div>
          </GlassPanel>
        </motion.div>
      </div>
    </section>
  );
}
