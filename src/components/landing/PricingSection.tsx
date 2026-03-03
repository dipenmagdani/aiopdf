import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { GlassPanel } from '@/components/shared/GlassPanel';
import { PremiumButton } from '@/components/shared/PremiumButton';
import { Badge } from '@/components/ui/badge';

const tiers = [
  {
    name: 'Free',
    price: '$0',
    description: 'For casual users',
    features: ['5 tools per day', 'Basic compression', 'Standard export', 'Community support'],
    cta: 'Get Started',
    highlight: false,
  },
  {
    name: 'Pro',
    price: '$9',
    period: '/mo',
    description: 'For power users',
    features: ['Unlimited tools', 'Max compression', 'Batch processing', 'Priority support', 'No watermarks', 'Organize pages'],
    cta: 'Upgrade to Pro',
    highlight: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'For teams',
    features: ['Everything in Pro', 'Team management', 'SSO integration', 'Custom branding', 'SLA guarantee', 'Dedicated support'],
    cta: 'Contact Sales',
    highlight: false,
  },
];

export function PricingSection() {
  return (
    <section id="pricing" className="py-24 bg-background">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-3">Simple Pricing</h2>
          <p className="text-muted-foreground">Start free. Upgrade when you need more.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {tiers.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <GlassPanel
                glow={tier.highlight}
                className={`h-full flex flex-col ${tier.highlight ? 'ring-2 ring-[hsl(var(--editor-accent))]' : ''}`}
              >
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-bold">{tier.name}</h3>
                    {tier.highlight && (
                      <Badge className="bg-gradient-to-r from-[hsl(var(--gradient-start))] to-[hsl(var(--gradient-end))] border-0 text-white text-[10px]">
                        POPULAR
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold">{tier.price}</span>
                    {tier.period && <span className="text-muted-foreground">{tier.period}</span>}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{tier.description}</p>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                <PremiumButton
                  variant={tier.highlight ? 'primary' : 'secondary'}
                  className="w-full"
                >
                  {tier.cta}
                </PremiumButton>
              </GlassPanel>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
