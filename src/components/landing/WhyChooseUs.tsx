import { motion } from "framer-motion";
import { Shield, Zap, DollarSign, Palette } from "lucide-react";
import { GlassPanel } from "@/components/shared/GlassPanel";

const features = [
  {
    icon: Shield,
    title: "Fully Private",
    description:
      "Your files are processed 100% in your browser. Nothing is uploaded to any server.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description:
      "No server round-trips. Everything happens instantly on your device.",
  },
  {
    icon: DollarSign,
    title: "Free to Use",
    description:
      "Core tools are completely free. No hidden charges or watermarks.",
  },
  {
    icon: Palette,
    title: "Modern Experience",
    description:
      "A beautiful, intuitive interface that feels like a premium native app.",
  },
];

export function WhyChooseUs() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            Why Choose AIOpdf
          </h2>
          <p className="text-muted-foreground">
            Built for speed, privacy, and simplicity.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <GlassPanel className="text-center h-full">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[hsl(var(--gradient-start))] to-[hsl(var(--gradient-end))] mb-4">
                  <f.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.description}</p>
              </GlassPanel>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
