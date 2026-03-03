import { useEffect } from "react";
import { motion } from "framer-motion";
import { Navbar } from "./Navbar";
import { Stepper } from "./Stepper";
import { useToolStore } from "@/store/toolStore";
import type { ToolConfig } from "@/lib/toolsConfig";

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
              <div
                className={`inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${tool.color}`}
              >
                <Icon className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">{tool.name}</h1>
                <p className="text-sm text-muted-foreground">
                  {tool.description}
                </p>
              </div>
            </div>
            <Stepper currentStep={currentStep} />
          </div>

          {/* Right panel */}
          <div className="min-h-[500px]">{children}</div>
        </motion.div>
      </div>

      {/* SEO Rich Content Section */}
      <section className="container py-16 mt-16 border-t border-border">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Intro Section */}
          <div className="space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-tight">
              The Best Way to {tool.name.replace(" PDF", "")} PDFs Online
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              AIOpdf provides a lightning-fast, highly secure way to{" "}
              {tool.name.toLowerCase()} directly in your browser. Built for
              professionals who need precision and efficiency, this tool gives
              you desktop-class performance without the need to install any
              heavy software. Whether you are managing invoices, consolidating
              reports, or protecting sensitive legal documents, AIOpdf’s robust
              browser-side engine guarantees pristine quality and uncompromising
              security.
            </p>
          </div>

          {/* Security & Features */}
          <div className="grid md:grid-cols-2 gap-8 pt-8">
            <div className="space-y-3">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                100% Private & Secure
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Unlike traditional PDF editors that upload your sensitive files
                to cloud servers, AIOpdf processes everything locally on your
                device. Your data never leaves your browser, ensuring complete
                privacy and compliance with secure data handling standards.
              </p>
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-blue-500" />
                Blazing Fast Execution
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Because there are no uploads or server queues, your PDF
                manipulations happen instantly. Experience seamless
                multi-gigabyte document processing leveraging modern WebAssembly
                and native browser APIs.
              </p>
            </div>
          </div>

          {/* How-To Steps */}
          <div className="space-y-6 pt-8">
            <h3 className="text-2xl font-bold text-center">
              How to {tool.name.toLowerCase()}
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  step: "1",
                  title: "Select Files",
                  desc: "Drag and drop your PDF files into the designated dropzone above.",
                },
                {
                  step: "2",
                  title: "Configure",
                  desc: `Apply your desired settings and preferences for the ${tool.name.toLowerCase()} operation.`,
                },
                {
                  step: "3",
                  title: "Download",
                  desc: "Instantly download your processed document to your local device.",
                },
              ].map((s) => (
                <div
                  key={s.step}
                  className="p-5 rounded-xl border border-border bg-muted/20 relative"
                >
                  <div className="absolute -top-3 -left-3 h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold font-mono text-sm shadow-md">
                    {s.step}
                  </div>
                  <h4 className="font-semibold mb-2 mt-2">{s.title}</h4>
                  <p className="text-sm text-muted-foreground">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
