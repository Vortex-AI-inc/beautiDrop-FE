'use client'

import {
  ArrowRight,
  MessageCircle,
  Calendar,
  Phone,
  CreditCard,
  Bell,
  Gift,
  Bot,
  Check,
  Star,
  Play,
  Loader2,
  Sparkles
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Header } from "../components/layout/header"
import { Footer } from "../components/layout/footer"
import { usePricingPlans } from "@/hooks/use-pricing-plans"
import { useAuth } from "@clerk/nextjs"
import { useToast } from "@/hooks/use-toast"
import { createCheckoutSession } from "@/lib/api/subscriptions"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function Home() {
  const { getPlanByName, isLoading } = usePricingPlans()
  const { getToken, isSignedIn } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null)
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly')

  const getActivePlan = (baseName: string) => {
    if (billingPeriod === 'yearly') {
      return getPlanByName(`${baseName} Yearly`) || getPlanByName(baseName)
    }
    return getPlanByName(baseName)
  }

  const starterPlan = getActivePlan('Starter')
  const professionalPlan = getActivePlan('Professional')
  const enterprisePlan = getActivePlan('Enterprise')

  const getMonthlyPlan = (baseName: string) => {
    return getPlanByName(baseName)
  }

  const getDisplayPrice = (plan: any) => {
    if (!plan?.amount) return '0'
    const price = parseFloat(plan.amount)

    if (billingPeriod === 'yearly' && plan?.billing_period === 'year') {
      return (price / 12).toFixed(0)
    }

    return price.toFixed(0)
  }

  const calculateSavings = (baseName: string) => {
    const monthlyPlan = getMonthlyPlan(baseName)
    const yearlyPlan = getPlanByName(`${baseName} Yearly`)

    if (!monthlyPlan?.amount || !yearlyPlan?.amount) return '0'

    const monthlyTotal = parseFloat(monthlyPlan.amount) * 12
    const yearlyTotal = parseFloat(yearlyPlan.amount)
    const savings = monthlyTotal - yearlyTotal

    return savings.toFixed(0)
  }

  const getBillingLabel = () => {
    return billingPeriod === 'monthly' ? '/month' : '/month (billed yearly)'
  }

  const handleCheckout = async (stripePriceId: string) => {
    if (!isSignedIn) {
      toast({
        title: "Authentication Required",
        description: "Please sign in As Saloon Owner to subscribe to a plan.",
        variant: "destructive",
      })
      router.push('/login')
      return
    }

    setCheckoutLoading(stripePriceId)

    try {
      const checkoutUrl = await createCheckoutSession(stripePriceId, getToken)
      window.location.href = checkoutUrl
    } catch (error) {
      toast({
        title: "Checkout Failed",
        description: error instanceof Error ? error.message : "Failed to create checkout session. Please try again.",
        variant: "destructive",
      })
      setCheckoutLoading(null)
    }
  }

  return (
    <main className="min-h-screen bg-white">
      <Header />

      <section className="pt-32 pb-20 bg-gradient-to-br from-blue-50 via-white to-blue-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 relative z-10">
              <div className="space-y-2">
                <h1 className="text-5xl lg:text-7xl font-bold font-heading tracking-tight leading-[1.1]">
                  <span className="text-blue-600 block">AI Assistant</span>
                  <span className="text-gray-900 block">for your Beauty</span>
                  <span className="text-gray-900 block">Services</span>
                </h1>
              </div>

              <p className="text-lg text-gray-600 leading-relaxed max-w-lg">
                Meet Beauty Drop - your 24/7 AI receptionist that answers calls, books appointments, handles payments,
                and keeps your customers happy while you focus on what you do best.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <div className="flex items-center gap-3 bg-white rounded-full px-2 py-2 pr-6 shadow-sm border border-gray-100 w-fit">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">24/7 Call Handling</p>
                    <p className="text-xs text-gray-500">Never miss a customer</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-white rounded-full px-2 py-2 pr-6 shadow-sm border border-gray-100 w-fit">
                  <div className="w-10 h-10 bg-amber-400 rounded-full flex items-center justify-center shrink-0">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">Smart Booking</p>
                    <p className="text-xs text-gray-500">Automated scheduling</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 pt-4">
                <Link href="/contact">
                  <Button
                    className="h-14 px-8 bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold rounded-lg shadow-lg shadow-blue-200 transition-all hover:scale-105"
                  >
                    Start Free Trial
                  </Button>
                </Link>

                <Button variant="outline" className="h-14 px-8 border-2 border-blue-100 text-blue-600 hover:bg-blue-50 text-lg font-semibold rounded-lg transition-all">
                  <Play className="w-5 h-5 mr-2 fill-current" />
                  Watch Demo
                </Button>
              </div>
            </div>

            <div className="relative lg:h-[600px] flex items-center justify-center">
              <div className="relative w-full max-w-lg mx-auto">
                <div className="bg-white p-4 rounded-3xl shadow-2xl relative z-10">
                  <img
                    src="/hero.webp"
                    alt="AI Booking Assistant"
                    className="w-full h-auto rounded-2xl object-cover aspect-[4/3]"
                  />

                  <div className="absolute -top-6 -right-6 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-3 animate-bounce-slow">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <Phone className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Incoming Call</p>
                      <p className="font-bold text-gray-900">Booking Request</p>
                    </div>
                  </div>

                  <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-3 animate-bounce-slow delay-700">
                    <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                      <Star className="w-5 h-5 text-amber-500 fill-current" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Customer Rating</p>
                      <div className="flex items-center gap-1">
                        <span className="font-bold text-gray-900">5.0</span>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map(i => (
                            <Star key={i} className="w-3 h-3 text-amber-400 fill-current" />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-100/50 rounded-full blur-3xl -z-10" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white" id="features">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-bold font-heading text-gray-900 mb-6">
              Everything Your Salon Needs in One <span className="text-blue-600">AI Assistant</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Beauty Drop handles every aspect of customer communication so you can focus on delivering exceptional beauty services.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Phone,
                color: "bg-blue-500",
                title: "24/7 Call Answering",
                desc: "No more missed calls. Your AI receptionist answers every call professionally, any time of day."
              },
              {
                icon: Calendar,
                color: "bg-amber-500",
                title: "Smart Appointment Booking",
                desc: "Seamlessly integrates with your calendar to book appointments automatically."
              },
              {
                icon: CreditCard,
                color: "bg-teal-500",
                title: "Payment Processing",
                desc: "Securely handle payments and deposits to reduce no-shows and protect your revenue."
              },
              {
                icon: Bell,
                color: "bg-rose-500",
                title: "Smart Reminders",
                desc: "Automated SMS and call reminders to keep your schedule full and organized."
              },
              {
                icon: Gift,
                color: "bg-orange-500",
                title: "Upselling & Products",
                desc: "Intelligently suggest add-on services and products to increase ticket value."
              },
              {
                icon: Bot,
                color: "bg-indigo-500",
                title: "Custom AI Training",
                desc: "Trained specifically on your salon's services, pricing, and policies."
              }
            ].map((feature, i) => (
              <div key={i} className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group">
                <div className={`w-14 h-14 ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-blue-50/50" id="pricing">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold font-heading text-gray-900 mb-6">
              Simple, Transparent <span className="text-blue-600">Pricing</span>
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Choose the perfect plan for your salon. No hidden fees.
            </p>

            {/* Billing Period Toggle */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="inline-flex items-center bg-white rounded-full p-1 shadow-md">
                <button
                  onClick={() => setBillingPeriod('monthly')}
                  className={`px-6 py-2 rounded-full font-semibold transition-all ${billingPeriod === 'monthly'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingPeriod('yearly')}
                  className={`px-6 py-2 rounded-full font-semibold transition-all ${billingPeriod === 'yearly'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                  Yearly
                </button>
              </div>
              {billingPeriod === 'yearly' && (
                <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-bold animate-in fade-in slide-in-from-right-5">
                  <Sparkles className="w-4 h-4" />
                  Save 10% with yearly billing
                </div>
              )}
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm animate-pulse">
                  <div className="h-8 bg-gray-200 rounded w-32 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-40 mb-6"></div>
                  <div className="h-12 bg-gray-200 rounded w-24 mb-6"></div>
                  <div className="h-10 bg-gray-200 rounded mb-8"></div>
                  <div className="space-y-4 mb-8">
                    {[1, 2, 3, 4].map((j) => (
                      <div key={j} className="h-4 bg-gray-200 rounded"></div>
                    ))}
                  </div>
                  <div className="h-12 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
              <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm hover:shadow-lg transition-all">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {starterPlan?.name}
                </h3>
                <p className="text-gray-500 text-sm mb-6">Perfect for solo stylists</p>
                <div className="mb-6">
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-4xl font-bold text-gray-900">
                      ${getDisplayPrice(starterPlan)}
                    </span>
                    <span className="text-gray-500">{getBillingLabel()}</span>
                  </div>
                  {billingPeriod === 'yearly' && starterPlan?.billing_period === 'year' && (
                    <div className="mt-2">
                      <p className="text-xs text-gray-400 line-through">
                        ${getMonthlyPlan('Starter')?.amount}/month
                      </p>
                      <p className="text-xs font-semibold text-green-600">
                        Save ${calculateSavings('Starter')}/year
                      </p>
                    </div>
                  )}
                </div>
                <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm font-semibold text-center mb-8">
                  250 Minutes Included
                </div>
                <ul className="space-y-4 mb-8">
                  {[
                    "24/7 Call Answering",
                    "Basic Appointment Booking",
                    "SMS Reminders",
                    "Email Support"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-gray-600 text-sm">
                      <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 text-green-600" />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                  onClick={() => handleCheckout(starterPlan?.stripe_price_id || '')}
                  disabled={!!checkoutLoading}
                >
                  {checkoutLoading === starterPlan?.stripe_price_id ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Get Started"
                  )}
                </Button>
              </div>

              <div className="bg-white rounded-2xl p-8 border-2 border-blue-600 shadow-xl relative transform md:-translate-y-4">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                  Most Popular
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {professionalPlan?.name}
                </h3>
                <p className="text-gray-500 text-sm mb-6">For growing salons</p>
                <div className="mb-6">
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-4xl font-bold text-gray-900">
                      ${getDisplayPrice(professionalPlan)}
                    </span>
                    <span className="text-gray-500">{getBillingLabel()}</span>
                  </div>
                  {billingPeriod === 'yearly' && professionalPlan?.billing_period === 'year' && (
                    <div className="mt-2">
                      <p className="text-xs text-gray-400 line-through">
                        ${getMonthlyPlan('Professional')?.amount}/month
                      </p>
                      <p className="text-xs font-semibold text-green-600">
                        Save ${calculateSavings('Professional')}/year
                      </p>
                    </div>
                  )}
                </div>
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold text-center mb-8 shadow-md">
                  500 Minutes Included
                </div>
                <ul className="space-y-4 mb-8">
                  {[
                    "Everything in Starter",
                    "Advanced Booking Logic",
                    "Payment Processing",
                    "Priority Support",
                    "Custom AI Training"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-gray-700 font-medium text-sm">
                      <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 text-blue-600" />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold h-12 text-lg shadow-lg shadow-blue-200"
                  onClick={() => handleCheckout(professionalPlan?.stripe_price_id || '')}
                  disabled={!!checkoutLoading}
                >
                  {checkoutLoading === professionalPlan?.stripe_price_id ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Get Started"
                  )}
                </Button>
              </div>

              <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm hover:shadow-lg transition-all">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {enterprisePlan?.name}
                </h3>
                <p className="text-gray-500 text-sm mb-6">For multi-location salons</p>
                <div className="mb-6">
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-4xl font-bold text-gray-900">
                      ${getDisplayPrice(enterprisePlan)}
                    </span>
                    <span className="text-gray-500">{getBillingLabel()}</span>
                  </div>
                  {billingPeriod === 'yearly' && enterprisePlan?.billing_period === 'year' && (
                    <div className="mt-2">
                      <p className="text-xs text-gray-400 line-through">
                        ${getMonthlyPlan('Enterprise')?.amount}/month
                      </p>
                      <p className="text-xs font-semibold text-green-600">
                        Save ${calculateSavings('Enterprise')}/year
                      </p>
                    </div>
                  )}
                </div>
                <div className="bg-amber-50 text-amber-700 px-4 py-2 rounded-lg text-sm font-semibold text-center mb-8">
                  1000 Minutes Included
                </div>
                <ul className="space-y-4 mb-8">
                  {[
                    "Everything in Professional",
                    "Multi-location Support",
                    "Dedicated Account Manager",
                    "API Access",
                    "White-label Options"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-gray-600 text-sm">
                      <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 text-green-600" />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
                <Button
                  variant="outline"
                  className="w-full border-2 border-gray-200 hover:border-blue-600 hover:text-blue-600 font-semibold"
                  onClick={() => handleCheckout(enterprisePlan?.stripe_price_id || '')}
                  disabled={!!checkoutLoading}
                >
                  {checkoutLoading === enterprisePlan?.stripe_price_id ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Contact Sales"
                  )}
                </Button>
              </div>
            </div>
          )}

          <div className="mt-16 bg-white rounded-2xl p-8 border border-gray-200 shadow-lg flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-5 h-5 text-amber-400 fill-current" />
                <span className="font-bold text-gray-900">Special Offer</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Waive Monthly Fees with Our Credit Card Processing
              </h3>
              <p className="text-gray-600 max-w-2xl">
                Switch your payment processing to us and get the Professional plan for free.
                Plus, eliminate credit card fees by passing them to customers.
              </p>
            </div>
            <Link href="/credit-card-processing">
              <Button className="whitespace-nowrap px-8 bg-gray-900 hover:bg-gray-800 text-white font-semibold">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold font-heading text-gray-900 mb-6">
              Why Salon Owners Choose <span className="text-blue-600">Beauty Drop AI</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Transform your salon operations with AI that understands the beauty industry inside and out.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-600 rounded-3xl rotate-3 opacity-10"></div>
              <div className="relative rounded-3xl shadow-2xl overflow-hidden">
                <img
                  src="/home2.webp"
                  alt="Salon Owner Happy"
                  className="w-full object-cover h-[500px]"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                <div className="absolute top-8 right-8 bg-white rounded-2xl p-4 shadow-xl flex items-center gap-3">
                  <div className="w-12 h-12 bg-teal-400 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Revenue Increase</p>
                    <p className="text-2xl font-bold text-gray-900">+35%</p>
                  </div>
                </div>

                <div className="absolute bottom-8 left-8 right-8 grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <p className="text-5xl font-bold text-white mb-1">24/7</p>
                    <p className="text-sm text-white/90 font-medium">Always Available</p>
                  </div>
                  <div className="text-center">
                    <p className="text-5xl font-bold text-white mb-1">100%</p>
                    <p className="text-sm text-white/90 font-medium">Customer Satisfaction</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              {[
                {
                  icon: Phone,
                  color: "bg-blue-100 text-blue-600",
                  title: "Never Miss Another Booking",
                  desc: "While you're busy with clients, Beauty Drop AI handles incoming calls professionally, capturing every potential booking opportunity."
                },
                {
                  icon: Calendar,
                  color: "bg-amber-100 text-amber-600",
                  title: "Reduce No-Shows by 60%",
                  desc: "Smart reminders and payment collection for cancellation policies protect your revenue and keep your schedule full."
                },
                {
                  icon: Star,
                  color: "bg-teal-100 text-teal-600",
                  title: "Focus On What You Love",
                  desc: "Stop interrupting treatments to answer the phone. Let Beauty Drop AI handle the business while you create beautiful results."
                },
                {
                  icon: Gift,
                  color: "bg-rose-100 text-rose-600",
                  title: "Increase Revenue Per Client",
                  desc: "Intelligently upsell services and products, creating additional revenue streams without being pushy."
                }
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center shrink-0`}>
                    <item.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-heading text-gray-900 mb-4">
              Proven Results for Salon Owners
            </h2>
            <p className="text-gray-600">Real impact from real salons using Beauty Drop AI</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { stat: "100%", label: "Calls Answered", icon: Phone, color: "text-blue-600" },
              { stat: "40%", label: "More Bookings", icon: Calendar, color: "text-amber-500" },
              { stat: "60%", label: "Fewer No-Shows", icon: UserX, color: "text-rose-500" },
              { stat: "35%", label: "Revenue Growth", icon: TrendingUp, color: "text-green-500" }
            ].map((item, i) => (
              <div key={i} className="bg-white p-6 rounded-xl shadow-sm text-center border border-gray-100">
                <div className={`w-12 h-12 mx-auto mb-4 rounded-full bg-gray-50 flex items-center justify-center ${item.color}`}>
                  {i === 0 && <Phone className="w-6 h-6" />}
                  {i === 1 && <Calendar className="w-6 h-6" />}
                  {i === 2 && <span className="text-2xl font-bold">✕</span>}
                  {i === 3 && <span className="text-2xl font-bold">📈</span>}
                </div>
                <p className={`text-4xl font-bold mb-2 ${item.color}`}>{item.stat}</p>
                <p className="text-gray-600 font-medium">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-24 bg-[#111827] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl lg:text-5xl font-bold font-heading text-white leading-tight">
                Ready to Transform Your Salon with <span className="text-amber-400">AI Power?</span>
              </h2>
              <p className="text-lg text-gray-300 leading-relaxed max-w-lg">
                Join over 1,000+ salon owners who have automated their bookings, increased their revenue, and reclaimed their time.
              </p>

              <ul className="space-y-4">
                {[
                  "Zero setup cost & 14-day free trial",
                  "Seamless integration with your current tools",
                  "24/7 support from our dedicated team"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-300">
                    <div className="w-6 h-6 rounded-full border border-green-500 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-green-500" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap gap-4 pt-4">
                <Link href="/contact">
                  <Button
                    className="h-14 px-8 bg-amber-400 hover:bg-amber-500 text-gray-900 text-lg font-bold rounded-lg shadow-lg"

                  >
                    Start Your Free Trial
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button className="h-14 px-8 bg-white/10 hover:bg-white/20 text-white border border-white/20 text-lg font-semibold rounded-lg backdrop-blur-sm">
                    Book Live Demo
                  </Button>
                </Link>
              </div>

              <p className="text-gray-400 text-sm">
                No credit card required. Cancel anytime.
              </p>
            </div>

            <div className="relative lg:h-[500px] flex items-center justify-center">
              <div className="relative w-full max-w-lg transform rotate-2 hover:rotate-0 transition-transform duration-500">
                <div className="absolute inset-0 bg-blue-600 rounded-2xl transform translate-x-2 translate-y-2"></div>
                <img
                  src="/salon-professional-beauty-consultation.jpg"
                  alt="Salon Professional"
                  className="relative w-full h-auto rounded-2xl shadow-2xl border-4 border-gray-800"
                />

                {/* Testimonial Card */}
                <div className="absolute -bottom-12 left-8 right-8 bg-white p-6 rounded-xl shadow-xl">
                  <div className="flex gap-1 mb-3">
                    {[1, 2, 3, 4, 5].map(i => (
                      <Star key={i} className="w-4 h-4 text-amber-400 fill-current" />
                    ))}
                    <span className="text-xs text-gray-400 ml-2 mt-0.5">Verified Review</span>
                  </div>
                  <p className="text-gray-900 italic text-sm mb-4">
                    "Beauty Drop AI changed my life! I have so much more free time and my clients love the instant responses."
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xs">
                      SJ
                    </div>
                    <p className="text-xs font-bold text-gray-900">Sarah Jenkins, Glow Salon</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

function UserX(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <line x1="17" x2="22" y1="8" y2="13" />
      <line x1="22" x2="17" y1="8" y2="13" />
    </svg>
  )
}

function TrendingUp(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  )
}
