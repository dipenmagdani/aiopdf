import { motion } from "framer-motion";
import Link from "next/link";
import { PremiumButton } from "@/components/shared/PremiumButton";
import { GlassPanel } from "@/components/shared/GlassPanel";
import { FileText, ArrowRight } from "lucide-react";

import { Shield } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-[95vh] flex flex-col items-center justify-center overflow-hidden bg-background">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-grid-slate-900/[0.04] bg-[bottom_1px_center] dark:bg-grid-slate-400/[0.05] dark:bg-bottom" />
      <div className="absolute inset-0 bg-background/50 backdrop-blur-[2px]" />

      {/* Glowing Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-[100%] bg-primary/20 blur-[120px] -z-10 animate-pulse pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] rounded-[100%] bg-emerald-500/10 blur-[100px] -z-10 pointer-events-none" />

      <div className="container relative z-10 flex flex-col items-center text-center gap-8 py-24 md:py-32">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-6 max-w-4xl"
        >
          {/* Top Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary shadow-[0_0_15px_rgba(var(--primary),0.1)] backdrop-blur-md"
          >
            <Shield className="h-4 w-4" />
            100% Secure & Private
          </motion.div>

          <h1 className="text-5xl sm:text-6xl md:text-8xl font-bold tracking-tight leading-[1.05]">
            PDFs Perfected. <br />
            <span className="bg-gradient-to-r from-primary to-emerald-400 bg-clip-text text-transparent">
              Zero Uploads.
            </span>
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-light">
            Edit, merge, split, and compress your documents entirely in your
            browser. No servers, no waiting, total privacy.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full sm:w-auto"
        >
          <Link href="/editor" className="w-full sm:w-auto">
            <PremiumButton
              size="lg"
              className="w-full sm:w-auto shadow-2xl shadow-primary/20"
            >
              <FileText className="h-5 w-5" />
              Start Editing
            </PremiumButton>
          </Link>
          <Link href="/tools" className="w-full sm:w-auto">
            <PremiumButton
              variant="secondary"
              size="lg"
              className="w-full sm:w-auto"
            >
              Explore Tools
              <ArrowRight className="h-4 w-4" />
            </PremiumButton>
          </Link>
        </motion.div>

        {/* Dashboard Preview / Glass Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.7, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-5xl mt-16 relative perspective-1000"
        >
          {/* Subtle reflection underneath */}
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-gradient-to-t from-background to-primary/20 blur-2xl" />

          <GlassPanel className="p-2 rounded-[2rem] border-white/10 dark:border-white/5 bg-white/40 dark:bg-black/40 shadow-2xl overflow-hidden group hover:shadow-primary/10 transition-shadow duration-500">
            <div className="bg-white dark:bg-zinc-950 rounded-3xl p-6 min-h-[400px] flex items-center justify-center border border-border/50 relative overflow-hidden">
              {/* Decorative App UI Mockup */}
              <div className="absolute top-0 left-0 w-full h-12 border-b border-border/50 bg-muted/30 flex items-center px-4 gap-2">
                <div className="h-3 w-3 rounded-full bg-red-400/80" />
                <div className="h-3 w-3 rounded-full bg-amber-400/80" />
                <div className="h-3 w-3 rounded-full bg-emerald-400/80" />
              </div>
              <div className="w-full max-w-3xl space-y-6 pt-12">
                <div className="h-8 bg-muted/50 rounded-lg w-1/3 animate-pulse" />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="h-24 bg-muted/50 rounded-xl animate-pulse"
                      style={{ animationDelay: `${i * 150}ms` }}
                    />
                  ))}
                </div>
                <div className="h-40 bg-muted/30 rounded-xl w-full" />
              </div>
            </div>
          </GlassPanel>
        </motion.div>
      </div>
    </section>
  );
}
