import { ArrowRight, MessageCircle, Calendar } from "lucide-react"
import Link from "next/link"

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 pt-16 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-6xl font-bold font-heading tracking-tight">
                  <span className="text-blue-600">AI Assistant</span>
                  <br />
                  <span className="text-gray-900">for your Beauty</span>
                  <br />
                  <span className="text-gray-900">Services</span>
                </h1>
              </div>

              <p className="text-lg text-gray-600 leading-relaxed max-w-md">
                Meet Beauty Drop - your 24/7 AI receptionist that answers calls, books appointments, handles payments,
                and keeps your customers happy while you focus on what you do best.
              </p>

              {/* Feature Pills */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 bg-white rounded-lg p-4 shadow-sm">
                  <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">24/7 Call Handling</h3>
                    <p className="text-sm text-gray-600">Never miss a customer</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-white rounded-lg p-4 shadow-sm">
                  <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Smart Booking</h3>
                    <p className="text-sm text-gray-600">Automated scheduling</p>
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Start Free Trial
                </Link>
                <Link
                  href="/features"
                  className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg border-2 border-gray-200 hover:border-blue-600 transition-colors"
                >
                  <ArrowRight className="w-5 h-5" />
                  See Features
                </Link>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative">
              <div className="bg-white rounded-2xl overflow-hidden shadow-xl">
                <img
                  src="/salon-professional-beauty-consultation.jpg"
                  alt="AI Booking Assistant in Beauty Salon"
                  className="w-full h-auto"
                />
                {/* Booking Badge */}
                <div className="absolute top-4 right-4 bg-white rounded-xl shadow-lg p-4 flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Incoming Call</p>
                    <p className="font-semibold text-gray-900">Booking Request</p>
                  </div>
                </div>

                {/* AI Handling Badge */}
                <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg px-4 py-2 flex items-center gap-2">
                  <span className="text-yellow-500 text-xl">⭐</span>
                  <span className="font-semibold text-gray-900">AI Handling</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Benefits Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold font-heading tracking-tight text-gray-900 mb-4">
              Everything Your Salon Needs in One <span className="text-blue-600">AI Assistant</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Beauty Drop handles every aspect of customer communication so you can focus on delivering exceptional
              beauty services.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: "📞",
                title: "24/7 Call Answering",
                description:
                  "Never miss another customer call. Beauty Drop answers every phone call professionally, day or night, ensuring you capture every business opportunity.",
              },
              {
                icon: "📅",
                title: "Smart Appointment Booking",
                description:
                  "Seamlessly integrates with your technicians' calendars to book appointments automatically, optimizing your schedule and reducing no-shows.",
              },
              {
                icon: "💳",
                title: "Payment Processing",
                description:
                  "Handles credit card collection for cancellation policies and no-shows via secure text messages, protecting your business from lost revenue.",
              },
              {
                icon: "🔔",
                title: "Smart Reminders",
                description:
                  "Automatically sends appointment reminders via call or SMS, reducing no-shows and keeping your schedule full and profitable.",
              },
              {
                icon: "🎁",
                title: "Upselling & Products",
                description:
                  "Intelligently promotes additional services and sells products to customers after visits, with direct shipping to their homes.",
              },
              {
                icon: "🤖",
                title: "Custom AI Training",
                description:
                  "We create and train your AI agent specifically for your salon, ensuring it knows your services, pricing, and policies perfectly.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-xl p-8 hover:shadow-lg transition-shadow"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gray-50" id="pricing">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold font-heading tracking-tight text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose the perfect plan for your salon. All plans include setup, training, and 24/7 support.
            </p>
            <p className="text-lg text-green-600 font-semibold mt-4">Free Credit Card Processing Available</p>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {[
              {
                name: "Starter",
                price: "$88",
                period: "/month",
                minutes: "250 Minutes",
                description: "Perfect for small salons",
                features: ["24/7 Call Answering", "Appointment Booking", "SMS Reminders", "Basic AI Training"],
                popular: false,
              },
              {
                name: "Professional",
                price: "$188",
                period: "/month",
                minutes: "500 Minutes",
                description: "Ideal for growing salons",
                features: ["Everything in Starter", "Payment Processing", "Advanced Upselling", "Priority Support"],
                popular: true,
              },
              {
                name: "Enterprise",
                price: "$388",
                period: "/month",
                minutes: "1000 Minutes",
                description: "For busy multi-location salons",
                features: [
                  "Everything in Professional",
                  "Multi-location Support",
                  "Advanced Analytics",
                  "Dedicated Support",
                ],
                popular: false,
              },
            ].map((plan, index) => (
              <div
                key={index}
                className={`rounded-xl p-8 relative transition-transform hover:scale-105 ${
                  plan.popular
                    ? "bg-blue-600 text-white shadow-2xl ring-4 ring-blue-200"
                    : "bg-white border border-gray-200"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-orange-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                    Most Popular
                  </div>
                )}
                <h3 className={`text-2xl font-bold font-heading mb-2 ${plan.popular ? "text-white" : "text-gray-900"}`}>
                  {plan.name}
                </h3>
                <p className={`text-sm mb-6 ${plan.popular ? "text-blue-100" : "text-gray-600"}`}>{plan.description}</p>
                <div className="mb-2">
                  <span className={`text-4xl font-bold ${plan.popular ? "text-white" : "text-gray-900"}`}>
                    {plan.price}
                  </span>
                  <span className={plan.popular ? "text-blue-100" : "text-gray-600"}>{plan.period}</span>
                </div>
                <p className={`text-sm font-semibold mb-6 ${plan.popular ? "text-blue-100" : "text-gray-600"}`}>
                  {plan.minutes}
                </p>
                <p className={`text-xs mb-6 ${plan.popular ? "text-blue-100" : "text-gray-600"}`}>
                  $0.25 per additional minute
                </p>

                <Link
                  href="/signup"
                  className={`block w-full py-3 rounded-lg font-semibold text-center transition-colors mb-6 ${
                    plan.popular
                      ? "bg-white text-blue-600 hover:bg-blue-50"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  Get Started
                </Link>

                <ul className={`space-y-3 text-sm ${plan.popular ? "text-blue-50" : "text-gray-600"}`}>
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className={`text-lg ${plan.popular ? "text-green-300" : "text-green-500"}`}>✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Credit Card Processing CTA */}
          <div className="bg-blue-50 rounded-xl p-8 border border-blue-200 text-center">
            <h3 className="text-2xl font-bold font-heading text-gray-900 mb-3">
              Waive Monthly Fees with Our Credit Card Processing
            </h3>
            <p className="text-gray-600 mb-4 max-w-2xl mx-auto">
              Let us handle all your credit card processing and we'll waive your monthly SAAS fees. Plus, our zero-fee
              program passes all costs to customers, so you pay nothing.
            </p>
            <Link
              href="/credit-card-processing"
              className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Learn More About Credit Card Processing
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold font-heading tracking-tight text-gray-900 mb-4">
              Why Salon Owners Choose Beauty Drop AI
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Transform your salon operations with AI that understands the beauty industry inside and out.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {[
              { stat: "24/7", label: "Always Available" },
              { stat: "95%", label: "Customer Satisfaction" },
              { stat: "+35%", label: "Revenue Increase" },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="text-5xl font-bold text-blue-600 mb-2 font-heading">{item.stat}</div>
                <p className="text-lg text-gray-600">{item.label}</p>
              </div>
            ))}
          </div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: "Never Miss Another Booking",
                description:
                  "While you're busy with clients, Beauty Drop AI handles incoming calls professionally, capturing every potential booking opportunity 24/7.",
              },
              {
                title: "Reduce No-Shows by 60%",
                description:
                  "Smart reminders and payment collection for cancellation policies protect your revenue and keep your schedule full.",
              },
              {
                title: "Focus On What You Love",
                description:
                  "Stop interrupting treatments to answer the phone. Let Beauty Drop AI handle the business while you create beautiful results for your clients.",
              },
              {
                title: "Increase Revenue Per Client",
                description:
                  "Beauty Drop AI intelligently upsells services and products, then ships purchases directly to clients' homes, creating additional revenue streams.",
              },
            ].map((benefit, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{benefit.title}</h3>
                <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Proven Results Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold font-heading tracking-tight text-gray-900 mb-4">
              Proven Results for Salon Owners
            </h2>
            <p className="text-xl text-gray-600">Real impact from real salons using Beauty Drop AI</p>
          </div>

          {/* Results Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            {[
              { stat: "100%", label: "Calls Answered" },
              { stat: "40%", label: "More Bookings" },
              { stat: "60%", label: "Fewer No-Shows" },
              { stat: "35%", label: "Revenue Growth" },
            ].map((item, index) => (
              <div key={index} className="bg-white rounded-lg p-6 text-center border border-gray-200">
                <div className="text-4xl font-bold text-blue-600 mb-2 font-heading">{item.stat}</div>
                <p className="text-gray-600 font-medium">{item.label}</p>
              </div>
            ))}
          </div>

          {/* Testimonial */}
          <div className="bg-white rounded-xl p-8 border-2 border-blue-200 text-center max-w-2xl mx-auto">
            <p className="text-lg text-gray-700 mb-4">
              "Beauty Drop AI increased our bookings by 40% in the first month!"
            </p>
            <p className="text-gray-600 font-semibold">- Sarah, Salon Owner</p>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl lg:text-5xl font-bold font-heading text-white mb-4">
              Ready to Transform Your Salon with AI Power?
            </h2>
            <p className="text-xl text-blue-100 mb-2">
              Join hundreds of salon owners who've increased their revenue by 35% with Beauty Drop AI.
            </p>
            <p className="text-lg text-blue-100 mb-8">
              Start your free trial today and see the difference in just 24 hours.
            </p>

            {/* Benefits List */}
            <div className="bg-white/20 backdrop-blur rounded-lg p-6 mb-8 max-w-2xl mx-auto text-left">
              <ul className="space-y-3 text-white font-medium">
                <li className="flex items-center gap-3">
                  <span className="text-xl">✓</span> Setup completed in under 30 minutes
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-xl">✓</span> Free AI training customized for your salon
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-xl">✓</span> No contract required - cancel anytime
                </li>
              </ul>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
              >
                Start Free Trial Now
              </Link>
              <Link
                href="/features"
                className="inline-flex items-center justify-center px-8 py-3 bg-transparent text-white font-semibold rounded-lg border-2 border-white hover:bg-white/10 transition-colors"
              >
                See How It Works
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            {[
              { stat: "500+", label: "Happy Salons" },
              { stat: "10k+", label: "Calls Handled" },
              { stat: "24/7", label: "Always Working" },
              { stat: "+$480", label: "Today's Results" },
            ].map((item, index) => (
              <div key={index}>
                <div className="text-3xl font-bold text-blue-600 mb-1 font-heading">{item.stat}</div>
                <p className="text-gray-600">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
