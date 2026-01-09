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
    Play,
    BarChart3,
    Megaphone,
    ArrowRight
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Header } from "../../../components/layout/header"
import { Footer } from "../../../components/layout/footer"
import { useState } from "react"
import { usePricingPlans } from "@/hooks/use-pricing-plans"
import { useAuth } from "@clerk/nextjs"
import { useToast } from "@/hooks/use-toast"
import { createCheckoutSession } from "@/lib/api/subscriptions"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

export default function ForSalonOwnersPage() {
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
        return getPlanByName(`${baseName} Monthly`) || getPlanByName(baseName)
    }

    const starterPlan = getActivePlan('Starter')
    const professionalPlan = getActivePlan('Professional')
    const enterprisePlan = getActivePlan('Enterprise')

    const getMonthlyPlan = (baseName: string) => {
        return getPlanByName(`${baseName} Monthly`) || getPlanByName(baseName)
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

            <section className="relative pt-20 pb-32 overflow-hidden min-h-[90dvh]">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-orange-900 opacity-90"></div>
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&auto=format&fit=crop&w=2074&q=80')] bg-cover bg-center mix-blend-overlay"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative mt-20 z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white px-4 py-1.5 rounded-full text-sm font-medium mb-6">
                                <Sparkles className="w-4 h-4 text-yellow-400" />
                                #1 AI Platform for Salons
                            </div>
                            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                                Transform Your <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                                    Salon Business
                                </span>
                            </h1>
                            <p className="text-xl text-gray-200 mb-8 max-w-lg">
                                Streamline operations, boost client satisfaction, and increase revenue with our comprehensive salon management platform designed specifically for beauty professionals.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <Button
                                    variant="outline"
                                    className="h-12 px-6 border-2 border-gray-200 hover:border-blue-600 hover:text-blue-600 font-semibold rounded-lg flex items-center gap-2"
                                    onClick={() => handleCheckout(enterprisePlan?.stripe_price_id || '')}
                                    disabled={!!checkoutLoading}
                                >
                                    {checkoutLoading === enterprisePlan?.stripe_price_id ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <Mail className="w-4 h-4" />
                                            Contact Sales
                                        </>
                                    )}
                                </Button>
                                <Link href="/features">
                                    <Button className="h-14 px-8 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg backdrop-blur-sm border border-white/20 flex items-center gap-2">
                                        <Play className="w-5 h-5 fill-current" />
                                        Watch Demo
                                    </Button>
                                </Link>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="absolute -inset-4 bg-gradient-to-r from-yellow-500 to-purple-600 rounded-2xl blur-lg opacity-30"></div>
                            <img
                                src="https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&auto=format&fit=crop&w=2074&q=80"
                                alt="Modern Salon Interior"
                                className="relative rounded-2xl shadow-2xl border border-white/10 w-full object-cover h-[500px]"
                            />
                            <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-xl flex items-center gap-4 animate-bounce-slow">
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                    <TrendingUp className="w-6 h-6 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Revenue Growth</p>
                                    <p className="text-xl font-bold text-gray-900">+45%</p>
                                </div>
                            </div>
                            <div className="absolute top-6 -right-6 bg-white p-2 rounded-lg shadow-xl">
                                <div className="flex items-center gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Sparkles key={star} className="w-4 h-4 text-yellow-400 fill-current" />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <div className="inline-block bg-blue-100 text-blue-600 px-4 py-1 rounded-full text-sm font-bold mb-4">
                            ALL-IN-ONE SOLUTION
                        </div>
                        <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                            Everything Your Salon <span className="text-blue-600">Needs to Thrive</span>
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Open your salon to new possibilities with tools designed to manage every aspect of your business efficiently.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Calendar,
                                color: "bg-purple-100 text-purple-600",
                                title: "Smart Scheduling",
                                desc: "Automated appointment booking that syncs with your calendar and reduces no-shows.",
                                features: ["24/7 Online Booking", "Automated Reminders", "Staff Management"]
                            },
                            {
                                icon: Users,
                                color: "bg-orange-100 text-orange-600",
                                title: "Client Profiles",
                                desc: "Keep detailed records of client preferences, history, and notes for personalized service.",
                                features: ["Client History Tracking", "Preference Notes", "Photo Gallery"]
                            },
                            {
                                icon: Store,
                                color: "bg-cyan-100 text-cyan-600",
                                title: "Inventory Control",
                                desc: "Track products, manage stock levels, and automate reordering to never run out.",
                                features: ["Stock Tracking", "Low Stock Alerts", "Supplier Management"]
                            },
                            {
                                icon: CreditCard,
                                color: "bg-pink-100 text-pink-600",
                                title: "Payment Solutions",
                                desc: "Secure and fast payment processing for services and products with competitive rates.",
                                features: ["Integrated POS", "Contactless Payments", "Split Payments"]
                            },
                            {
                                icon: BarChart3,
                                color: "bg-green-100 text-green-600",
                                title: "Business Analytics",
                                desc: "Deep insights into your salon's performance to make data-driven decisions.",
                                features: ["Revenue Reports", "Staff Performance", "Client Retention"]
                            },
                            {
                                icon: Megaphone,
                                color: "bg-blue-100 text-blue-600",
                                title: "Marketing Suite",
                                desc: "Powerful tools to attract new clients and keep existing ones coming back.",
                                features: ["Email Campaigns", "SMS Marketing", "Loyalty Programs"]
                            }
                        ].map((feature, i) => (
                            <div key={i} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group">
                                <div className={`w-14 h-14 ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                    <feature.icon className="w-7 h-7" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                                <p className="text-gray-600 mb-6 leading-relaxed">{feature.desc}</p>
                                <ul className="space-y-2">
                                    {feature.features.map((item, j) => (
                                        <li key={j} className="flex items-center gap-2 text-sm text-gray-500">
                                            <Check className="w-4 h-4 text-green-500" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <div className="inline-block bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-bold mb-4">
                            PRICING PLANS
                        </div>
                        <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                            Choose the Perfect Plan for <span className="text-blue-600">Your Salon</span>
                        </h2>
                        <p className="text-xl text-gray-600 mb-8">
                            Flexible plans designed to grow with your business.
                        </p>

                        {/* Billing Period Toggle */}
                        <div className="flex items-center justify-center gap-4 mb-8">
                            <div className="inline-flex items-center bg-gray-100 rounded-full p-1">
                                <button
                                    onClick={() => setBillingPeriod('monthly')}
                                    className={`px-6 py-2 rounded-full font-semibold transition-all ${billingPeriod === 'monthly'
                                        ? 'bg-white text-blue-600 shadow-md'
                                        : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                >
                                    Monthly
                                </button>
                                <button
                                    onClick={() => setBillingPeriod('yearly')}
                                    className={`px-6 py-2 rounded-full font-semibold transition-all ${billingPeriod === 'yearly'
                                        ? 'bg-white text-blue-600 shadow-md'
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
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="bg-white rounded-2xl p-8 border-2 border-gray-200 shadow-sm animate-pulse">
                                    <div className="h-12 bg-gray-200 rounded-xl w-12 mb-4"></div>
                                    <div className="h-8 bg-gray-200 rounded w-32 mb-2"></div>
                                    <div className="h-4 bg-gray-200 rounded w-40 mb-6"></div>
                                    <div className="h-12 bg-gray-200 rounded w-24 mb-6"></div>
                                    <div className="h-4 bg-gray-200 rounded w-32 mb-6"></div>
                                    <div className="space-y-3 mb-8">
                                        {[1, 2, 3, 4, 5].map((j) => (
                                            <div key={j} className="h-4 bg-gray-200 rounded"></div>
                                        ))}
                                    </div>
                                    <div className="h-12 bg-gray-200 rounded"></div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                            <div className="bg-white rounded-2xl p-8 border-2 border-gray-200 hover:border-blue-300 transition-all duration-300 hover:shadow-xl">
                                <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center mb-4">
                                    <Sparkles className="w-6 h-6 text-cyan-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">{starterPlan?.name}</h3>
                                <p className="text-gray-600 mb-6">Perfect for independent stylists</p>
                                <div className="mb-6">
                                    <div className="flex items-baseline justify-center gap-2">
                                        <span className="text-5xl font-bold text-gray-900">
                                            ${getDisplayPrice(starterPlan)}
                                        </span>
                                        <span className="text-gray-600">{getBillingLabel()}</span>
                                    </div>
                                    {billingPeriod === 'yearly' && starterPlan?.billing_period === 'year' && (
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-500 line-through">
                                                ${getMonthlyPlan('Starter')?.amount}/month
                                            </p>
                                            <p className="text-sm font-semibold text-green-600">
                                                Save ${calculateSavings('Starter')}/year
                                            </p>
                                        </div>
                                    )}
                                </div>
                                <div className="text-sm text-blue-600 font-semibold mb-6">
                                    14-Day Free Trial
                                </div>
                                <ul className="space-y-3 mb-8">
                                    {[
                                        "Up to 100 appointments/mo",
                                        "Basic Client Profiles",
                                        "Email Reminders",
                                        "1 Staff Login",
                                        "Basic Reports"
                                    ].map((feature, i) => (
                                        <li key={i} className="flex items-center gap-2 text-gray-700">
                                            <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                                <Button
                                    className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg flex items-center justify-center"
                                    onClick={() => handleCheckout(starterPlan?.stripe_price_id || '')}
                                    disabled={!!checkoutLoading}
                                >
                                    {checkoutLoading === starterPlan?.stripe_price_id ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            Get Started
                                            <ArrowRight className="w-4 h-4 ml-2" />
                                        </>
                                    )}
                                </Button>
                            </div>

                            <div className="bg-white rounded-2xl p-8 border-2 border-blue-600 relative shadow-2xl transform scale-105 z-10">
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-6 py-1.5 rounded-full text-sm font-bold uppercase tracking-wide">
                                    Most Popular
                                </div>
                                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                                    <Store className="w-6 h-6 text-blue-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">{professionalPlan?.name}</h3>
                                <p className="text-gray-600 mb-6">Best for growing salons</p>
                                <div className="mb-6">
                                    <div className="flex items-baseline justify-center gap-2">
                                        <span className="text-5xl font-bold text-gray-900">
                                            ${getDisplayPrice(professionalPlan)}
                                        </span>
                                        <span className="text-gray-600">{getBillingLabel()}</span>
                                    </div>
                                    {billingPeriod === 'yearly' && professionalPlan?.billing_period === 'year' && (
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-500 line-through">
                                                ${getMonthlyPlan('Professional')?.amount}/month
                                            </p>
                                            <p className="text-sm font-semibold text-green-600">
                                                Save ${calculateSavings('Professional')}/year
                                            </p>
                                        </div>
                                    )}
                                </div>
                                <div className="text-sm text-blue-600 font-semibold mb-6">
                                    Everything in Starter +
                                </div>
                                <ul className="space-y-3 mb-8">
                                    {[
                                        "Unlimited Appointments",
                                        "SMS & Email Reminders",
                                        "Inventory Management",
                                        "Up to 5 Staff Logins",
                                        "Advanced Analytics",
                                        "Marketing Suite"
                                    ].map((feature, i) => (
                                        <li key={i} className="flex items-center gap-2 text-gray-700">
                                            <Check className="w-5 h-5 text-blue-600 flex-shrink-0" />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                                <Button
                                    className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-lg"
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

                            <div className="bg-white rounded-2xl p-8 border-2 border-gray-200 hover:border-orange-300 transition-all duration-300 hover:shadow-xl">
                                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                                    <Building2 className="w-6 h-6 text-orange-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">{enterprisePlan?.name}</h3>
                                <p className="text-gray-600 mb-6">For multi-location salons</p>
                                <div className="mb-6">
                                    <div className="flex items-baseline justify-center gap-2">
                                        <span className="text-5xl font-bold text-gray-900">
                                            ${getDisplayPrice(enterprisePlan)}
                                        </span>
                                        <span className="text-gray-600">{getBillingLabel()}</span>
                                    </div>
                                    {billingPeriod === 'yearly' && enterprisePlan?.billing_period === 'year' && (
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-500 line-through">
                                                ${getMonthlyPlan('Enterprise')?.amount}/month
                                            </p>
                                            <p className="text-sm font-semibold text-green-600">
                                                Save ${calculateSavings('Enterprise')}/year
                                            </p>
                                        </div>
                                    )}
                                </div>
                                <div className="text-sm text-blue-600 font-semibold mb-6">
                                    Everything in Professional +
                                </div>
                                <ul className="space-y-3 mb-8">
                                    {[
                                        "Multi-Location Support",
                                        "Dedicated Account Manager",
                                        "Custom API Access",
                                        "Unlimited Staff",
                                        "White-label Options",
                                        "Priority Support"
                                    ].map((feature, i) => (
                                        <li key={i} className="flex items-center gap-2 text-gray-700">
                                            <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                                <Button
                                    className="w-full h-12 bg-gray-50 hover:bg-gray-100 text-gray-900 font-semibold rounded-lg border border-gray-200 flex items-center justify-center"
                                    onClick={() => handleCheckout(enterprisePlan?.stripe_price_id || '')}
                                    disabled={!!checkoutLoading}
                                >
                                    {checkoutLoading === enterprisePlan?.stripe_price_id ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <Mail className="w-4 h-4 mr-2" />
                                            Contact Sales
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            <section className="py-24 bg-gradient-to-br from-blue-900 via-purple-900 to-purple-800 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
                <div className="absolute top-20 left-10 w-4 h-4 bg-yellow-400 rounded-full blur-[2px]"></div>
                <div className="absolute top-40 right-10 w-6 h-6 bg-green-400 rounded-full blur-[2px]"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center max-w-4xl mx-auto mb-16">
                        <div className="inline-flex items-center gap-2 bg-orange-500 text-white px-4 py-1.5 rounded-full text-sm font-bold mb-8 shadow-lg">
                            <ClockIcon className="w-4 h-4" />
                            Limited Time: 3-Day Free Trial + 100 Bonus Minutes
                        </div>

                        <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight">
                            Ready to Transform Your <span className="text-yellow-400">Salon Business?</span>
                        </h2>
                        <p className="text-xl text-purple-100 mb-12 max-w-2xl mx-auto">
                            Join thousands of successful salon owners who have increased their revenue by an average of 45% with our platform. Start your 14-day free trial today!
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
                            {[
                                { icon: Rocket, title: "Quick Setup", desc: "Get started in minutes", color: "text-yellow-400", bg: "bg-yellow-400/20" },
                                { icon: Shield, title: "Risk Free", desc: "14-day money back guarantee", color: "text-green-400", bg: "bg-green-400/20" },
                                { icon: Headphones, title: "Expert Support", desc: "24/7 dedicated assistance", color: "text-orange-400", bg: "bg-orange-400/20" }
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

                        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                            <Button
                                className="h-14 px-8 bg-yellow-400 hover:bg-yellow-500 text-gray-900 text-lg font-bold rounded-xl shadow-lg shadow-yellow-400/20 flex items-center gap-2"
                                onClick={() => handleCheckout(starterPlan?.stripe_price_id || '')}
                                disabled={!!checkoutLoading}
                            >
                                {checkoutLoading === starterPlan?.stripe_price_id ? (
                                    <>
                                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <Rocket className="w-5 h-5" />
                                        Start Free Trial
                                        <span className="text-xs bg-gray-900/10 px-2 py-0.5 rounded-full ml-1">INSTANT ACCESS</span>
                                    </>
                                )}
                            </Button>
                            <Link href="/contact/">
                                <Button className="h-14 px-8 bg-white/10 hover:bg-white/20 text-white text-lg font-semibold rounded-xl backdrop-blur-sm border border-white/20 flex items-center gap-2">
                                    <Phone className="w-5 h-5" />
                                    Schedule Demo Call
                                </Button>
                            </Link>
                        </div>

                        <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-4 max-w-3xl mx-auto shadow-xl transform hover:scale-105 transition-transform duration-300">
                            <p className="text-white font-bold text-lg flex items-center justify-center gap-2">
                                <Zap className="w-5 h-5 fill-current" />
                                Don't Wait - Your Competitors Are Already Ahead!
                            </p>
                            <p className="text-white/90 text-sm mt-1">
                                Claim your exclusive offer before it expires in 24 hours.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    )
}
