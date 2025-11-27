import Link from "next/link"
import { Check, ArrowRight } from "lucide-react"

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-5xl font-bold font-heading">Simple, Transparent Pricing</h1>
          <p className="text-xl text-muted-foreground">No hidden fees. Cancel anytime.</p>
        </div>
      </section>

      {/* Pricing Table */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {[
              {
                name: "Starter",
                price: "$99",
                period: "/month",
                description: "Perfect for small salons",
                features: [
                  "Up to 500 calls/month",
                  "Basic AI agent",
                  "Single phone number",
                  "Email support",
                  "Basic analytics",
                  "Manual appointment entry",
                ],
                highlight: false,
              },
              {
                name: "Professional",
                price: "$299",
                period: "/month",
                description: "Most popular for growing salons",
                features: [
                  "Up to 2,000 calls/month",
                  "Advanced AI agent",
                  "Unlimited phone numbers",
                  "Priority phone support",
                  "Advanced analytics",
                  "Automated appointment booking",
                  "Staff management",
                  "Calendar integration",
                ],
                highlight: true,
              },
              {
                name: "Enterprise",
                price: "Custom",
                period: "pricing",
                description: "For large chains and franchises",
                features: [
                  "Unlimited calls",
                  "Custom AI training",
                  "Multi-location support",
                  "Dedicated account manager",
                  "Custom integrations",
                  "White-label options",
                  "API access",
                  "SLA guarantee",
                ],
                highlight: false,
              },
            ].map((plan, i) => (
              <div
                key={i}
                className={`rounded-xl border-2 p-8 transition-all ${plan.highlight ? "border-primary bg-primary/5 scale-105" : "border-border"}`}
              >
                {plan.highlight && (
                  <div className="text-center mb-4">
                    <span className="inline-block px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
                      MOST POPULAR
                    </span>
                  </div>
                )}
                <h3 className="text-2xl font-bold font-heading">{plan.name}</h3>
                <p className="text-muted-foreground text-sm mb-4">{plan.description}</p>
                <div className="mb-6">
                  <span className="text-5xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
                <button
                  className={`w-full py-3 rounded-lg font-semibold mb-8 transition-colors ${plan.highlight ? "bg-primary text-primary-foreground hover:opacity-90" : "border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground"}`}
                >
                  Get Started
                </button>
                <ul className="space-y-4">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* FAQ */}
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold font-heading mb-12 text-center">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {[
                {
                  q: "Can I change plans anytime?",
                  a: "Yes! Upgrade or downgrade your plan at any time. Changes take effect immediately.",
                },
                {
                  q: "Is there a setup fee?",
                  a: "No setup fee! You can start for free for 14 days with no credit card required.",
                },
                {
                  q: "What if I need more calls?",
                  a: "Overage calls are charged at a discounted rate. We'll let you know before charges occur.",
                },
                {
                  q: "Do you offer discounts?",
                  a: "Yes! Annual plans include 20% discount. Contact sales for volume discounts.",
                },
              ].map((item, i) => (
                <div key={i} className="bg-card rounded-lg border border-border p-6">
                  <h3 className="font-semibold text-lg mb-2">{item.q}</h3>
                  <p className="text-muted-foreground">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-primary text-primary-foreground mt-20">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-4xl font-bold font-heading">Ready to get started?</h2>
          <Link
            href="/signup"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-primary font-semibold rounded-lg hover:bg-gray-100 transition-colors"
          >
            Start Your Free Trial <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </main>
  )
}
