"use client"

import {
  Check,
  Phone,
  Calendar,
  MessageSquare,
  CreditCard,
  TrendingUp,
  Users,
  Sparkles,
  Heart,
  Zap,
  ChevronDown,
  Store,
  Building2,
  Mail,
  Gift,
  RefreshCw,
  Headphones,
  Rocket,
  Shield,
  Lock as LockIcon,
  FileCheck,
  Server,
  Clock as ClockIcon,
  ZapIcon,
  ArrowRight
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Header } from "../../../components/layout/header"
import { Footer } from "../../../components/layout/footer"
import { useState } from "react"

function CostCalculator() {
  const [minutes, setMinutes] = useState(1402)

  const basePlanCost = 388
  const additionalMinutes = Math.max(0, minutes - 1000)
  const additionalCost = (additionalMinutes * 0.25).toFixed(2)
  const totalCost = (basePlanCost + parseFloat(additionalCost)).toFixed(2)
  const costPerMinute = (parseFloat(totalCost) / minutes).toFixed(3)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center justify-center">
      {/* Left Side - Usage Estimator */}
      <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 flex flex-col justify-center">
        <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">Estimate Your Usage</h3>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
            Expected monthly minutes
          </label>
          <input
            type="range"
            min="0"
            max="1500"
            value={minutes}
            onChange={(e) => setMinutes(parseInt(e.target.value))}
            className="w-full h-2 rounded-lg appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, #ff693c 0%, #ff693c ${(minutes / 1500) * 100}%, #e5e7eb ${(minutes / 1500) * 100}%, #e5e7eb 100%)`
            }}
          />
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>0</span>
            <span>500</span>
            <span>1000</span>
            <span>1500</span>
          </div>
        </div>

        <div className="text-center mb-6">
          <p className="text-6xl font-bold text-blue-600 mb-1">{minutes.toLocaleString()}</p>
          <p className="text-sm text-gray-600">minutes per month</p>
        </div>

        <div className="bg-blue-600 rounded-xl p-5 text-white text-center">
          <p className="text-sm mb-1 opacity-90">Recommended Plan</p>
          <p className="text-2xl font-bold mb-1">Enterprise Plan</p>
          <p className="text-xs opacity-80">For high-volume usage</p>
        </div>
      </div>

      {/* Right Side - Cost Breakdown */}
      <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Monthly Cost Breakdown</h3>

        <div className="space-y-4 mb-6">
          <div className="flex justify-between items-start pb-4 border-b border-gray-200">
            <div>
              <p className="font-semibold text-gray-900 mb-1">Base Plan Cost</p>
              <p className="text-sm text-gray-500">1,000 minutes included</p>
            </div>
            <p className="text-3xl font-bold text-gray-900">${basePlanCost}</p>
          </div>

          <div className="flex justify-between items-start pb-4 border-b border-gray-200">
            <div>
              <p className="font-semibold text-gray-900 mb-1">Additional Minutes</p>
              <p className="text-sm text-gray-500">{additionalMinutes} minutes × $0.25</p>
            </div>
            <p className="text-3xl font-bold text-gray-900">${additionalCost}</p>
          </div>
        </div>

        <div className="bg-blue-600 rounded-xl p-6 text-white mb-6">
          <p className="text-sm mb-2 opacity-90">Total Monthly Cost</p>
          <p className="text-5xl font-bold mb-1">${totalCost}</p>
          <p className="text-sm opacity-90">All features included</p>
        </div>

        <div className="text-center mb-6">
          <p className="text-sm text-gray-600 mb-1">Effective cost per minute</p>
          <p className="text-4xl font-bold text-green-600">${costPerMinute}</p>
        </div>

        <Link href="/signup">
          <Button className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl">
            Get Started with Enterprise Plan
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>
    </div>
  )
}

function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqs = [
    {
      question: "What happens after my free trial?",
      answer: "After your 14-day free trial, you'll be automatically enrolled in the plan you selected. You can cancel anytime before the trial ends with no charges."
    },
    {
      question: "Can I change my plan later?",
      answer: "Yes! You can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, Mastercard, American Express) and ACH bank transfers for annual plans."
    },
    {
      question: "Is there a setup fee?",
      answer: "No setup fees! We believe in transparent pricing. The monthly price you see is all you pay."
    },
    {
      question: "What if I exceed my call limit?",
      answer: "We'll notify you when you're approaching your limit. You can upgrade your plan or purchase additional call credits as needed."
    }
  ]

  return (
    <div className="space-y-3">
      {faqs.map((faq, i) => (
        <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <button
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
          >
            <h3 className="text-lg font-bold text-gray-900">{faq.question}</h3>
            <ChevronDown
              className={`w-5 h-5 text-gray-500 transition-transform ${openIndex === i ? 'rotate-180' : ''}`}
            />
          </button>
          {openIndex === i && (
            <div className="px-6 pb-4">
              <p className="text-gray-600">{faq.answer}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="h-[90dvh] bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="text-center mb-12">
            <div className="flex items-center gap-2 text-sm mb-4 justify-center">
              <Link href="/" className="text-blue-600 hover:text-blue-700 font-medium">
                Home
              </Link>
              <span className="text-blue-600">→</span>
              <span className="text-blue-600 font-medium">Pricing</span>
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold font-heading leading-tight mb-6">
              Choose Your Perfect <span className="text-blue-600">Plan</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Simple, transparent pricing that grows with your salon. No hidden fees.
            </p>
          </div>

          {/* Feature Badges */}
          <div className="flex flex-wrap justify-center gap-4">
            <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 border border-gray-200 shadow-sm">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Check className="w-4 h-4 text-green-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">14-Day Free Trial</span>
            </div>
            <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 border border-gray-200 shadow-sm">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <CreditCard className="w-4 h-4 text-blue-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">No Credit Card Required</span>
            </div>
            <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 border border-gray-200 shadow-sm">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <ZapIcon className="w-4 h-4 text-purple-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">Cancel Anytime</span>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold font-heading text-gray-900 mb-4">
              Our Pricing Plans
            </h2>
            <p className="text-lg text-gray-600">
              Choose the plan that best fits your salon's needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Starter Plan */}
            <div className="bg-white rounded-2xl p-8 border-2 border-gray-200 hover:border-blue-300 transition-all duration-300 hover:shadow-xl">
              <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-cyan-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Starter</h3>
              <p className="text-gray-600 mb-6">Perfect for small salons</p>
              <div className="mb-6">
                <span className="text-5xl font-bold text-gray-900">$99</span>
                <span className="text-gray-600">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                {[
                  "Up to 100 calls/month",
                  "Basic appointment booking",
                  "Email support",
                  "1 staff member",
                  "Basic analytics"
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-gray-700">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link href="/signup">
                <Button className="w-full h-12 bg-white hover:bg-blue-50 text-blue-600 font-semibold rounded-lg">
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>

            {/* Professional Plan - Popular */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-8 border-2 border-blue-600 relative shadow-2xl transform scale-105">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-400 text-gray-900 px-4 py-1 rounded-full text-sm font-bold">
                Most Popular
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Professional</h3>
              <p className="text-blue-100 mb-6">For growing salons</p>
              <div className="mb-6">
                <span className="text-5xl font-bold text-white">$199</span>
                <span className="text-blue-100">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                {[
                  "Up to 500 calls/month",
                  "Advanced booking features",
                  "Priority support",
                  "Up to 5 staff members",
                  "Advanced analytics",
                  "Payment processing",
                  "Custom greetings"
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-white">
                    <Check className="w-5 h-5 text-amber-400 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link href="/signup">
                <Button className="w-full h-12 bg-amber-400 hover:bg-amber-500 text-gray-900 font-bold rounded-lg shadow-lg">
                  Get Started
                </Button>
              </Link>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-white rounded-2xl p-8 border-2 border-gray-200 hover:border-orange-300 transition-all duration-300 hover:shadow-xl">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Enterprise</h3>
              <p className="text-gray-600 mb-6">For large salon chains</p>
              <div className="mb-6">
                <span className="text-5xl font-bold text-gray-900">$399</span>
                <span className="text-gray-600">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                {[
                  "Unlimited calls",
                  "All Professional features",
                  "24/7 dedicated support",
                  "Unlimited staff members",
                  "Custom integrations",
                  "API access",
                  "White-label option"
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-gray-700">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link href="/contact">
                <Button className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg">
                  Contact Sales
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Cost Calculator */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold font-heading text-gray-900 mb-4">
              Calculate Your Monthly Cost
            </h2>
            <p className="text-lg text-gray-600">
              Use our calculator to estimate your monthly costs based on your expected usage. All plans include the same features.
            </p>
          </div>

          <CostCalculator />
        </div>
      </section>

      {/* Real Usage Examples */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold font-heading text-gray-900 mb-4">
              Real Usage Examples
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Small Business */}
            <div className="bg-white rounded-2xl p-8 border-2 border-gray-200 hover:border-blue-300 transition-all duration-300 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                <Store className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Small Business</h3>
              <p className="text-4xl font-bold text-blue-600 mb-3">180 min/mo</p>
              <p className="text-sm text-gray-600 mb-4">Customer support, basic automation</p>
              <p className="text-sm text-gray-500">Starter Plan: <span className="font-semibold">$88/mo</span></p>
            </div>

            {/* Growing Company - Popular */}
            <div className="bg-white rounded-2xl p-8 border-2 border-blue-600 relative shadow-lg transform scale-105 text-center">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-bold">
                POPULAR
              </div>
              <div className="w-16 h-16 bg-blue-100 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Growing Company</h3>
              <p className="text-4xl font-bold text-blue-600 mb-3">450 min/mo</p>
              <p className="text-sm text-gray-600 mb-4">Sales calls, customer service, workflows</p>
              <Link href="/signup">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg">
                  Professional Plan: $188/mo
                </Button>
              </Link>
            </div>

            {/* Enterprise */}
            <div className="bg-white rounded-2xl p-8 border-2 border-gray-200 hover:border-orange-300 transition-all duration-300 text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                <Building2 className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Enterprise</h3>
              <p className="text-4xl font-bold text-blue-600 mb-3">850 min/mo</p>
              <p className="text-sm text-gray-600 mb-4">Multiple departments, high volume</p>
              <p className="text-sm text-gray-500">Enterprise Plan: <span className="font-semibold">$388/mo</span></p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold font-heading text-gray-900 mb-4">
              Why Choose Beauty Drop AI?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Phone,
                iconBg: "bg-cyan-100",
                iconColor: "text-cyan-600",
                title: "24/7 Availability",
                description: "Never miss a call, even after hours"
              },
              {
                icon: Calendar,
                iconBg: "bg-blue-100",
                iconColor: "text-blue-600",
                title: "Smart Booking",
                description: "Intelligent appointment scheduling"
              },
              {
                icon: Users,
                iconBg: "bg-orange-100",
                iconColor: "text-orange-600",
                title: "Customer Management",
                description: "Track preferences and history"
              }
            ].map((feature, i) => (
              <div key={i} className="text-center">
                <div className={`w-16 h-16 ${feature.iconBg} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <feature.icon className={`w-8 h-8 ${feature.iconColor}`} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold font-heading text-gray-900 mb-4">
              Pricing Questions?
            </h2>
            <p className="text-lg text-gray-600">
              Get answers to common questions about our pricing
            </p>
          </div>

          <FAQAccordion />
        </div>
      </section>


      {/* Still have questions? */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 md:p-12 text-center text-white shadow-xl relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-4">Still have questions?</h2>
              <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
                Our team is here to help you choose the right plan for your needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact">
                  <Button className="h-12 px-8 bg-white text-blue-600 hover:bg-blue-50 font-semibold rounded-lg flex items-center gap-2">
                    <Phone className="w-5 h-5" />
                    Call Sales
                  </Button>
                </Link>
                <Link href="/support">
                  <Button className="h-12 px-8 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-lg backdrop-blur-sm flex items-center gap-2 border border-white/30">
                    <Mail className="w-5 h-5" />
                    Email Support
                  </Button>
                </Link>
              </div>
            </div>

            {/* Decorative circles */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-500/30 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl"></div>
          </div>
        </div>
      </section>

      {/* Ready to Get Started - Final CTA */}
      <section className="py-24 bg-gradient-to-br from-blue-900 via-purple-900 to-purple-800 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-20 left-10 w-4 h-4 bg-yellow-400 rounded-full blur-[2px]"></div>
        <div className="absolute top-40 right-10 w-6 h-6 bg-green-400 rounded-full blur-[2px]"></div>
        <div className="absolute bottom-20 left-1/4 w-3 h-3 bg-yellow-400 rounded-full blur-[2px]"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 bg-orange-500 text-white px-4 py-1.5 rounded-full text-sm font-bold mb-8 shadow-lg">
              <ClockIcon className="w-4 h-4" />
              Limited Time: 3-Day Free Trial + 100 Bonus Minutes
            </div>

            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-purple-100 mb-12 max-w-2xl mx-auto">
              Join thousands of businesses already using our platform. Start with a free trial and experience the difference today.
            </p>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-12">
              {[
                { icon: Gift, title: "Free Trial", desc: "3 days + 100 minutes", color: "text-green-400", bg: "bg-green-400/20" },
                { icon: CreditCard, title: "No Credit Card", desc: "Required to start", color: "text-yellow-400", bg: "bg-yellow-400/20" },
                { icon: RefreshCw, title: "Cancel Anytime", desc: "No contracts or fees", color: "text-blue-400", bg: "bg-blue-400/20" },
                { icon: Headphones, title: "Expert Support", desc: "Setup assistance included", color: "text-orange-400", bg: "bg-orange-400/20" }
              ].map((item, i) => (
                <div key={i} className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300">
                  <div className={`w-12 h-12 ${item.bg} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                    <item.icon className={`w-6 h-6 ${item.color}`} />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1">{item.title}</h3>
                  <p className="text-sm text-purple-200">{item.desc}</p>
                </div>
              ))}
            </div>

            {/* Main CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link href="/signup">
                <Button className="h-14 px-8 bg-amber-400 hover:bg-amber-500 text-gray-900 text-lg font-bold rounded-xl shadow-lg shadow-amber-400/20 flex items-center gap-2">
                  <Rocket className="w-5 h-5" />
                  Start Free Trial Now
                  <span className="text-xs bg-gray-900/10 px-2 py-0.5 rounded-full ml-1">100 Minutes Free</span>
                </Button>
              </Link>
              <Link href="/contact">
                <Button className="h-14 px-8 bg-white/10 hover:bg-white/20 text-white text-lg font-semibold rounded-xl backdrop-blur-sm border border-white/20 flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Schedule Demo
                </Button>
              </Link>
            </div>

            <p className="text-purple-200 text-sm">
              Or choose your plan directly:
            </p>
            <div className="flex gap-4 justify-center mt-4 text-sm">
              <Link href="#" className="text-white/60 hover:text-white border border-white/20 px-4 py-2 rounded-lg hover:bg-white/10 transition-colors">
                Starter Plan: $88/mo
              </Link>
              <Link href="#" className="text-blue-300 hover:text-white border border-blue-500/30 bg-blue-500/10 px-4 py-2 rounded-lg hover:bg-blue-500/20 transition-colors">
                Professional Plan: $188/mo
              </Link>
              <Link href="#" className="text-white/60 hover:text-white border border-white/20 px-4 py-2 rounded-lg hover:bg-white/10 transition-colors">
                Enterprise Plan: $388/mo
              </Link>
            </div>
          </div>

          <div className="border-t border-white/10 my-12"></div>

          {/* Stats */}
          <div className="text-center mb-12">
            <p className="text-purple-200 text-sm mb-8 uppercase tracking-wider">Trusted by businesses worldwide</p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-8">
              {[
                { value: "10K+", label: "Active Users" },
                { value: "99.9%", label: "Uptime" },
                { value: "50M+", label: "Minutes Processed" },
                { value: "4.9/5", label: "Customer Rating" },
                { value: "24/7", label: "Support" }
              ].map((stat, i) => (
                <div key={i} className="bg-white/5 rounded-xl p-4 border border-white/5">
                  <div className="text-2xl md:text-3xl font-bold text-amber-400 mb-1">{stat.value}</div>
                  <div className="text-xs text-purple-200">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Compliance Badges */}
          <div className="flex flex-wrap justify-center gap-6 md:gap-12 text-xs text-purple-200 opacity-70">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-green-400" />
              SOC 2 Compliant
            </div>
            <div className="flex items-center gap-2">
              <LockIcon className="w-4 h-4 text-green-400" />
              256-bit Encryption
            </div>
            <div className="flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-green-400" />
              GDPR Compliant
            </div>
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4 text-green-400" />
              99.9% SLA
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
