import Link from "next/link"
import { ArrowRight, Phone, Calendar, Shield, BarChart3 } from "lucide-react"

export default function FeaturesPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-5xl font-bold font-heading">Powerful Features Built for Salons</h1>
          <p className="text-xl text-muted-foreground">Everything you need to automate and grow your beauty business</p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto space-y-20">
          {[
            {
              icon: Phone,
              title: "24/7 Intelligent Call Handling",
              description:
                "Your AI agent answers calls 24/7, books appointments, and handles customer inquiries - even after you close.",
              points: ["Natural voice conversations", "Multi-language support", "Smart call routing"],
            },
            {
              icon: Calendar,
              title: "Automated Appointment System",
              description:
                "Customers book appointments through voice or web. Reduce no-shows with automated reminders.",
              points: ["Real-time availability", "Automatic confirmations", "No-show prevention"],
            },
            {
              icon: Shield,
              title: "Enterprise Security",
              description: "Your data is protected with industry-leading security standards.",
              points: ["HIPAA compliant", "SOC 2 certified", "End-to-end encryption"],
            },
            {
              icon: BarChart3,
              title: "Analytics & Insights",
              description: "Track calls, bookings, and revenue with detailed analytics.",
              points: ["Real-time dashboards", "Revenue tracking", "Customer insights"],
            },
          ].map((feature, i) => {
            const Icon = feature.icon
            return (
              <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className={i % 2 === 1 ? "md:order-2" : ""}>
                  <Icon className="w-16 h-16 text-primary mb-6" />
                  <h2 className="text-3xl font-bold font-heading mb-4">{feature.title}</h2>
                  <p className="text-lg text-muted-foreground mb-6">{feature.description}</p>
                  <ul className="space-y-3">
                    {feature.points.map((point, j) => (
                      <li key={j} className="flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-primary" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div
                  className={`bg-muted rounded-lg p-12 flex items-center justify-center h-80 ${i % 2 === 1 ? "md:order-1" : ""}`}
                >
                  <div className="text-center text-muted-foreground">Demo coming soon</div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-4xl font-bold font-heading">See These Features in Action</h2>
          <Link
            href="/signup"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-primary font-medium rounded-lg hover:bg-gray-100 transition-colors"
          >
            Start Free Trial <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </main>
  )
}
