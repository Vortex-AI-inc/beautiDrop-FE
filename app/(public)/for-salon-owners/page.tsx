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
    Megaphone
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Header } from "../../../components/layout/header"
import { Footer } from "../../../components/layout/footer"
import { useState } from "react"

export default function ForSalonOwnersPage() {
    return (
        <main className="min-h-screen bg-white">
            <Header />

            {/* Hero Section */}
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
                                <Button className="h-14 px-8 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-lg shadow-lg flex items-center gap-2">
                                    <Rocket className="w-5 h-5" />
                                    Start Free Trial
                                </Button>
                                <Button className="h-14 px-8 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg backdrop-blur-sm border border-white/20 flex items-center gap-2">
                                    <Play className="w-5 h-5 fill-current" />
                                    Watch Demo
                                </Button>
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

            {/* Features Grid */}
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

            {/* Pricing Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <div className="inline-block bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-bold mb-4">
                            PRICING PLANS
                        </div>
                        <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                            Choose the Perfect Plan for <span className="text-blue-600">Your Salon</span>
                        </h2>
                        <p className="text-xl text-gray-600">
                            Flexible plans designed to grow with your business.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {/* Starter Plan */}
                        <div className="bg-white rounded-2xl p-8 border-2 border-gray-200 hover:border-blue-300 transition-all duration-300 hover:shadow-xl">
                            <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center mb-4">
                                <Sparkles className="w-6 h-6 text-cyan-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Starter</h3>
                            <p className="text-gray-600 mb-6">Perfect for independent stylists</p>
                            <div className="mb-6">
                                <span className="text-5xl font-bold text-gray-900">$88</span>
                                <span className="text-gray-600">/month</span>
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
                            <Button className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg">
                                Get Started
                            </Button>
                        </div>

                        {/* Professional Plan - Popular */}
                        <div className="bg-white rounded-2xl p-8 border-2 border-blue-600 relative shadow-2xl transform scale-105 z-10">
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-6 py-1.5 rounded-full text-sm font-bold uppercase tracking-wide">
                                Most Popular
                            </div>
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                                <Store className="w-6 h-6 text-blue-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Professional</h3>
                            <p className="text-gray-600 mb-6">Best for growing salons</p>
                            <div className="mb-6">
                                <span className="text-5xl font-bold text-gray-900">$188</span>
                                <span className="text-gray-600">/month</span>
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
                            <Button className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-lg">
                                Get Started
                            </Button>
                        </div>

                        {/* Enterprise Plan */}
                        <div className="bg-white rounded-2xl p-8 border-2 border-gray-200 hover:border-orange-300 transition-all duration-300 hover:shadow-xl">
                            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                                <Building2 className="w-6 h-6 text-orange-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Enterprise</h3>
                            <p className="text-gray-600 mb-6">For multi-location salons</p>
                            <div className="mb-6">
                                <span className="text-5xl font-bold text-gray-900">$388</span>
                                <span className="text-gray-600">/month</span>
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
                            <Button className="w-full h-12 bg-gray-50 hover:bg-gray-100 text-gray-900 font-semibold rounded-lg border border-gray-200">
                                Contact Sales
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA Section */}
            <section className="py-24 bg-gradient-to-br from-blue-900 via-purple-900 to-purple-800 relative overflow-hidden">
                {/* Background Elements */}
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

                        {/* Feature Cards */}
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

                        {/* Main CTAs */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                            <Button className="h-14 px-8 bg-yellow-400 hover:bg-yellow-500 text-gray-900 text-lg font-bold rounded-xl shadow-lg shadow-yellow-400/20 flex items-center gap-2">
                                <Rocket className="w-5 h-5" />
                                Start Free Trial
                                <span className="text-xs bg-gray-900/10 px-2 py-0.5 rounded-full ml-1">INSTANT ACCESS</span>
                            </Button>
                            <Button className="h-14 px-8 bg-white/10 hover:bg-white/20 text-white text-lg font-semibold rounded-xl backdrop-blur-sm border border-white/20 flex items-center gap-2">
                                <Phone className="w-5 h-5" />
                                Schedule Demo Call
                            </Button>
                        </div>

                        {/* Orange Banner */}
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
