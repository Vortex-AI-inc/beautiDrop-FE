"use client"

import { useState } from "react"
import Link from "next/link"
import { Header } from "../../../components/layout/header"
import { Footer } from "../../../components/layout/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Building2,
    User,
    CreditCard,
    Check,
    ArrowRight,
    Calculator,
    Zap,
    Shield,
    Headphones,
    Sparkles,
    Rocket,
    Phone,
    Gift,
    X,
    MessageCircle
} from "lucide-react"

export default function CreditCardProcessingPage() {
    const [formData, setFormData] = useState({
        businessName: "",
        businessType: "",
        processingVolume: "",
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        currentProcessor: "",
        additionalInfo: "",
        serviceNeeds: {
            mobileReader: false,
            countertopTerminal: false,
            onlinePayments: false,
            recurringBilling: false
        }
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            serviceNeeds: {
                ...formData.serviceNeeds,
                [e.target.name]: e.target.checked
            }
        })
    }

    const scrollToForm = () => {
        document.getElementById('application-form')?.scrollIntoView({ behavior: 'smooth' })
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
    }

    return (
        <main className="min-h-screen bg-slate-50 flex flex-col">
            <Header />

            {/* Hero Section */}
            <section className="bg-gradient-to-br from-blue-50 to-purple-50 pt-32 pb-20 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-600 px-4 py-1.5 rounded-full text-sm font-bold mb-6">
                                <CreditCard className="w-4 h-4" />
                                Credit Card Processing
                            </div>
                            <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
                                Seamless Credit Card Processing for <span className=" font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-[#980ffa]">Your Salon</span>
                            </h1>
                            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                                Secure, fast, and affordable payment processing integrated with Beauty Drop AI. Accept payments seamlessly and get your funds faster with next-day funding and transparent pricing.
                            </p>

                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                                        <Check className="w-4 h-4 text-green-600" />
                                    </div>
                                    <span className="text-gray-700 font-medium">No hidden fees or contracts</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                                        <Check className="w-4 h-4 text-blue-600" />
                                    </div>
                                    <span className="text-gray-700 font-medium">PCI Compliant security</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center">
                                        <Check className="w-4 h-4 text-orange-600" />
                                    </div>
                                    <span className="text-gray-700 font-medium">Next-Day Funding</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center">
                                        <Check className="w-4 h-4 text-purple-600" />
                                    </div>
                                    <span className="text-gray-700 font-medium">Fraud Protection</span>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <Link href="/signup">
                                    <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-6 text-lg rounded-lg shadow-lg shadow-blue-600/20 flex items-center gap-2">
                                        <Rocket className="w-5 h-5" />
                                        Get Started Today
                                    </Button>
                                </Link>
                                <Link href="tel:916-268-1877">
                                    <Button variant="outline" className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-bold px-8 py-6 text-lg rounded-lg flex items-center gap-2">
                                        <Phone className="w-5 h-5" />
                                        916-268-1877
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-yellow-200 rounded-full blur-3xl opacity-50"></div>
                            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-200 rounded-full blur-3xl opacity-50"></div>

                            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-2xl border border-white/50 relative z-10">
                                <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl p-8 text-white shadow-inner">
                                    <div className="flex justify-between items-start mb-12">
                                        <div>
                                            <div className="text-sm font-medium opacity-80 mb-2">Secure Payment Processing</div>
                                            <div className="w-12 h-8 bg-white/20 rounded flex items-center justify-center">
                                                <div className="w-8 h-5 bg-white/30 rounded-sm"></div>
                                            </div>
                                        </div>
                                        <div className="bg-white text-blue-600 text-xs font-bold px-2 py-1 rounded">
                                            2.6% <span className="font-normal opacity-70">Processing Rate</span>
                                        </div>
                                    </div>

                                    <div className="text-3xl font-mono mb-8 tracking-widest">
                                        •••• •••• •••• 4242
                                    </div>

                                    <div className="flex justify-between items-end">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                                <span className="text-xs font-bold uppercase tracking-wider">Digital Approval</span>
                                            </div>
                                            <div className="text-xs opacity-70">Transaction Verified</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                                                <Check className="w-6 h-6 text-white" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing Comparison Section */}
            <section className="py-20 px-4 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            Transparent Pricing That <span className="text-blue-600">Saves You Money</span>
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            No hidden fees, no surprises. Just simple, competitive rates that help your salon keep more of what you earn.
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                        {/* Header */}
                        <div className="grid grid-cols-5 bg-blue-600 text-white">
                            <div className="col-span-1 p-6 font-bold flex items-center">Feature</div>
                            <div className="col-span-1 p-6 text-center bg-blue-700/50 flex flex-col justify-center">
                                <div className="font-bold text-lg">Beauty Drop AI Payments</div>
                                <div className="text-xs opacity-80">Our Solution</div>
                            </div>
                            <div className="col-span-1 p-6 text-center flex items-center justify-center font-semibold">Square</div>
                            <div className="col-span-1 p-6 text-center flex items-center justify-center font-semibold">Stripe</div>
                            <div className="col-span-1 p-6 text-center flex items-center justify-center font-semibold">Traditional Processors</div>
                        </div>

                        {/* Rows */}
                        <div className="divide-y divide-gray-100">
                            {/* Processing Rate */}
                            <div className="grid grid-cols-5 hover:bg-gray-50 transition-colors">
                                <div className="col-span-1 p-6 font-semibold text-gray-900">Processing Rate</div>
                                <div className="col-span-1 p-6 text-center font-bold text-blue-600 bg-blue-50/30">2.6% + 10¢</div>
                                <div className="col-span-1 p-6 text-center text-gray-600">2.9% + 30¢</div>
                                <div className="col-span-1 p-6 text-center text-gray-600">2.9% + 30¢</div>
                                <div className="col-span-1 p-6 text-center text-gray-600">3.5% + fees</div>
                            </div>

                            {/* Monthly Fee */}
                            <div className="grid grid-cols-5 hover:bg-gray-50 transition-colors">
                                <div className="col-span-1 p-6 font-semibold text-gray-900">Monthly Fee</div>
                                <div className="col-span-1 p-6 text-center font-bold text-green-600 bg-blue-50/30">$0</div>
                                <div className="col-span-1 p-6 text-center text-gray-600">$0</div>
                                <div className="col-span-1 p-6 text-center text-gray-600">$0</div>
                                <div className="col-span-1 p-6 text-center text-gray-600">$15-50+</div>
                            </div>

                            {/* Setup Fee */}
                            <div className="grid grid-cols-5 hover:bg-gray-50 transition-colors">
                                <div className="col-span-1 p-6 font-semibold text-gray-900">Setup Fee</div>
                                <div className="col-span-1 p-6 text-center font-bold text-green-600 bg-blue-50/30">$0</div>
                                <div className="col-span-1 p-6 text-center text-gray-600">$0</div>
                                <div className="col-span-1 p-6 text-center text-gray-600">$0</div>
                                <div className="col-span-1 p-6 text-center text-gray-600">$99-500+</div>
                            </div>

                            {/* Card Reader */}
                            <div className="grid grid-cols-5 hover:bg-gray-50 transition-colors">
                                <div className="col-span-1 p-6 font-semibold text-gray-900">Card Reader</div>
                                <div className="col-span-1 p-6 text-center font-bold text-blue-600 bg-blue-50/30">Free with signup</div>
                                <div className="col-span-1 p-6 text-center text-gray-600">$59-169</div>
                                <div className="col-span-1 p-6 text-center text-gray-600">$59-199</div>
                                <div className="col-span-1 p-6 text-center text-gray-600">$200-800+</div>
                            </div>

                            {/* Integration */}
                            <div className="grid grid-cols-5 bg-green-50/50">
                                <div className="col-span-1 p-6 font-semibold text-gray-900">Beauty Drop AI Integration</div>
                                <div className="col-span-1 p-6 text-center bg-green-100/50">
                                    <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-600">
                                        <Check className="w-5 h-5" />
                                    </div>
                                </div>
                                <div className="col-span-1 p-6 text-center text-red-400 flex items-center justify-center gap-2">
                                    <X className="w-4 h-4" /> Not Available
                                </div>
                                <div className="col-span-1 p-6 text-center text-red-400 flex items-center justify-center gap-2">
                                    <X className="w-4 h-4" /> Not Available
                                </div>
                                <div className="col-span-1 p-6 text-center text-red-400 flex items-center justify-center gap-2">
                                    <X className="w-4 h-4" /> Not Available
                                </div>
                            </div>

                            {/* Contract */}
                            <div className="grid grid-cols-5 hover:bg-gray-50 transition-colors">
                                <div className="col-span-1 p-6 font-semibold text-gray-900">Contract Required</div>
                                <div className="col-span-1 p-6 text-center font-bold text-green-600 bg-blue-50/30">No</div>
                                <div className="col-span-1 p-6 text-center text-gray-600">No</div>
                                <div className="col-span-1 p-6 text-center text-gray-600">No</div>
                                <div className="col-span-1 p-6 text-center text-gray-600">Usually</div>
                            </div>

                            {/* Support */}
                            <div className="grid grid-cols-5 hover:bg-gray-50 transition-colors">
                                <div className="col-span-1 p-6 font-semibold text-gray-900">Support</div>
                                <div className="col-span-1 p-6 text-center font-bold text-blue-600 bg-blue-50/30">24/7 Phone & Email</div>
                                <div className="col-span-1 p-6 text-center text-gray-600">Email/Chat</div>
                                <div className="col-span-1 p-6 text-center text-gray-600">Email/Chat</div>
                                <div className="col-span-1 p-6 text-center text-gray-600">Limited Hours</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Calculator & Features Split */}
            <section className="py-20 px-4 bg-slate-50">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Calculator */}
                        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <Calculator className="w-6 h-6 text-blue-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900">Calculate Your Savings</h3>
                            </div>
                            <p className="text-gray-600 mb-8">
                                See how much you could save by switching to our payment processing solution.
                            </p>

                            <div className="space-y-6">
                                <div className="bg-blue-50/50 rounded-lg p-4 flex justify-between items-center">
                                    <span className="text-gray-900 font-medium">Monthly Processing Volume:</span>
                                    <span className="text-blue-600 font-bold text-lg">$10,000</span>
                                </div>

                                <div className="space-y-3 pt-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Traditional Processor:</span>
                                        <span className="text-gray-600 font-medium">$350 + $25 monthly fee</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Beauty Drop AI Payments:</span>
                                        <span className="text-blue-600 font-medium">$290 + $0 monthly fee</span>
                                    </div>
                                    <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                                        <span className="text-gray-900 font-bold">Monthly Savings:</span>
                                        <span className="text-green-500 font-bold text-xl">$85</span>
                                    </div>
                                </div>

                                <div className="bg-emerald-400 rounded-xl p-8 text-center text-white">
                                    <div className="text-emerald-100 font-medium mb-1">Annual Savings</div>
                                    <div className="text-4xl font-bold">$1,020</div>
                                </div>

                                <Button
                                    onClick={scrollToForm}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-6 rounded-lg text-lg"
                                >
                                    <span className="flex items-center gap-2">
                                        <Zap className="w-5 h-5 fill-current" />
                                        Get My Custom Quote
                                    </span>
                                </Button>
                            </div>
                        </div>
                        {/* Why Choose Us */}
                        <div className="space-y-8 pt-4">
                            <h3 className="text-3xl font-bold text-gray-900 mb-8">Why Salons Choose Our Processing</h3>

                            <div className="grid gap-8">
                                {[
                                    { icon: Zap, title: "Next-Day Funding", desc: "Get access to your money faster. Payments processed today are in your account tomorrow morning.", color: "bg-blue-100 text-blue-600" },
                                    { icon: Shield, title: "Free Security Shield", desc: "State-of-the-art encryption and tokenization protects your business and your clients' data.", color: "bg-green-100 text-green-600" },
                                    { icon: Headphones, title: "24/7 Support", desc: "Real humans, ready to help whenever you need it. No robots, no long hold times.", color: "bg-orange-100 text-orange-600" },
                                    { icon: Gift, title: "Free Equipment", desc: "Get a free modern card reader when you sign up. Accepts chip, swipe, and contactless payments.", color: "bg-purple-100 text-purple-600" }
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-5">
                                        <div className={`w-14 h-14 ${item.color} rounded-2xl flex items-center justify-center flex-shrink-0`}>
                                            <item.icon className="w-7 h-7" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 text-lg mb-2">{item.title}</h4>
                                            <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Application Section */}
            <section id="application-form" className="py-20 px-4 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {/* Form Column */}
                        <div className="lg:col-span-2">
                            <h2 className="text-5xl font-bold text-gray-900 mb-3">Start Processing Payments <br /> <span className=" font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-[#980ffa]">Today</span></h2>
                            <p className="text-gray-600 text-lg mb-4 px-3">Get approved for payment processing in minutes and start accepting payments securely. Plus, get your free Beauty Drop AI subscription when you sign up.</p>
                            <div className="bg-slate-50 rounded-2xl p-8 border border-gray-100">
                                <form onSubmit={handleSubmit} className="space-y-8">
                                    {/* Business Information */}
                                    <div>
                                        <div className="flex items-center gap-3 mb-6">
                                            <Building2 className="w-5 h-5 text-blue-600" />
                                            <h3 className="text-xl font-bold text-gray-900">Business Information</h3>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <Label htmlFor="businessName" className="text-gray-900 font-semibold text-sm mb-2 block">
                                                    Business Name *
                                                </Label>
                                                <Input
                                                    id="businessName"
                                                    name="businessName"
                                                    placeholder="Your salon/spa name"
                                                    value={formData.businessName}
                                                    onChange={handleChange}
                                                    className="h-12 bg-white border-gray-200"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="businessType" className="text-gray-900 font-semibold text-sm mb-2 block">
                                                    Business Type *
                                                </Label>
                                                <select
                                                    id="businessType"
                                                    name="businessType"
                                                    value={formData.businessType}
                                                    onChange={handleChange}
                                                    className="w-full h-12 px-3 bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                                    required
                                                >
                                                    <option value="">Select type</option>
                                                    <option value="nail-salon">Nail Salon</option>
                                                    <option value="day-spa">Day Spa</option>
                                                    <option value="hair-salon">Hair Salon</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="mt-6">
                                            <Label htmlFor="processingVolume" className="text-gray-900 font-semibold text-sm mb-2 block">
                                                Estimated Monthly Processing Volume *
                                            </Label>
                                            <select
                                                id="processingVolume"
                                                name="processingVolume"
                                                value={formData.processingVolume}
                                                onChange={handleChange}
                                                className="w-full h-12 px-3 bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                                required
                                            >
                                                <option value="">Select volume</option>
                                                <option value="under-5k">Under $5,000</option>
                                                <option value="5k-10k">$5,000 - $10,000</option>
                                                <option value="over-10k">Over $10,000</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Contact Information */}
                                    <div>
                                        <div className="flex items-center gap-3 mb-6">
                                            <User className="w-5 h-5 text-blue-600" />
                                            <h3 className="text-xl font-bold text-gray-900">Contact Information</h3>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <Label htmlFor="firstName" className="text-gray-900 font-semibold text-sm mb-2 block">
                                                    First Name *
                                                </Label>
                                                <Input
                                                    id="firstName"
                                                    name="firstName"
                                                    placeholder="Your first name"
                                                    value={formData.firstName}
                                                    onChange={handleChange}
                                                    className="h-12 bg-white border-gray-200"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="lastName" className="text-gray-900 font-semibold text-sm mb-2 block">
                                                    Last Name *
                                                </Label>
                                                <Input
                                                    id="lastName"
                                                    name="lastName"
                                                    placeholder="Your last name"
                                                    value={formData.lastName}
                                                    onChange={handleChange}
                                                    className="h-12 bg-white border-gray-200"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="email" className="text-gray-900 font-semibold text-sm mb-2 block">
                                                    Email Address *
                                                </Label>
                                                <Input
                                                    id="email"
                                                    name="email"
                                                    type="email"
                                                    placeholder="your@email.com"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    className="h-12 bg-white border-gray-200"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="phone" className="text-gray-900 font-semibold text-sm mb-2 block">
                                                    Phone Number *
                                                </Label>
                                                <Input
                                                    id="phone"
                                                    name="phone"
                                                    type="tel"
                                                    placeholder="(555) 123-4567"
                                                    value={formData.phone}
                                                    onChange={handleChange}
                                                    className="h-12 bg-white border-gray-200"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Current Payment Setup */}
                                    <div>
                                        <div className="flex items-center gap-3 mb-6">
                                            <CreditCard className="w-5 h-5 text-blue-600" />
                                            <h3 className="text-xl font-bold text-gray-900">Current Payment Setup</h3>
                                        </div>
                                        <div className="mb-6">
                                            <Label htmlFor="currentProcessor" className="text-gray-900 font-semibold text-sm mb-2 block">
                                                Current Payment Processor
                                            </Label>
                                            <select
                                                id="currentProcessor"
                                                name="currentProcessor"
                                                value={formData.currentProcessor}
                                                onChange={handleChange}
                                                className="w-full h-12 px-3 bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                            >
                                                <option value="">Select current processor</option>
                                                <option value="square">Square</option>
                                                <option value="stripe">Stripe</option>
                                                <option value="other">Other</option>
                                            </select>
                                        </div>

                                        <div className="space-y-3 mb-6">
                                            <div className="text-sm font-semibold text-gray-900">Service Needs (Select all that apply)</div>
                                            <div className="grid grid-cols-2 gap-3">
                                                <label className="flex items-center gap-2 text-sm text-gray-600">
                                                    <input
                                                        type="checkbox"
                                                        name="mobileReader"
                                                        checked={formData.serviceNeeds.mobileReader}
                                                        onChange={handleCheckboxChange}
                                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                    />
                                                    Mobile card reader
                                                </label>
                                                <label className="flex items-center gap-2 text-sm text-gray-600">
                                                    <input
                                                        type="checkbox"
                                                        name="countertopTerminal"
                                                        checked={formData.serviceNeeds.countertopTerminal}
                                                        onChange={handleCheckboxChange}
                                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                    />
                                                    Countertop terminal
                                                </label>
                                                <label className="flex items-center gap-2 text-sm text-gray-600">
                                                    <input
                                                        type="checkbox"
                                                        name="onlinePayments"
                                                        checked={formData.serviceNeeds.onlinePayments}
                                                        onChange={handleCheckboxChange}
                                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                    />
                                                    Online payments
                                                </label>
                                                <label className="flex items-center gap-2 text-sm text-gray-600">
                                                    <input
                                                        type="checkbox"
                                                        name="recurringBilling"
                                                        checked={formData.serviceNeeds.recurringBilling}
                                                        onChange={handleCheckboxChange}
                                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                    />
                                                    Recurring billing
                                                </label>
                                            </div>
                                        </div>

                                        <div>
                                            <Label htmlFor="additionalInfo" className="text-gray-900 font-semibold text-sm mb-2 block">
                                                Additional Information (Optional)
                                            </Label>
                                            <textarea
                                                id="additionalInfo"
                                                name="additionalInfo"
                                                placeholder="Tell us about your specific needs..."
                                                value={formData.additionalInfo}
                                                onChange={handleChange}
                                                rows={3}
                                                className="w-full px-3 py-3 bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                            />
                                        </div>
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg rounded-lg shadow-lg shadow-blue-600/20"
                                    >
                                        <span className="flex items-center gap-2">
                                            <Zap className="w-5 h-5 fill-current" />
                                            Get My Free Quote Startup
                                        </span>
                                    </Button>

                                    <p className="text-xs text-center text-gray-500">
                                        By submitting this form, you agree to our Terms of Service and Privacy Policy. You also agree to receive marketing communications from Beauty Drop AI.
                                    </p>
                                </form>
                            </div>
                        </div>

                        {/* Sidebar Column */}
                        <div className="space-y-8">
                            {/* What You Get When You Sign Up */}
                            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
                                <h3 className="font-bold text-xl text-gray-900 mb-6">What You Get When You Sign Up</h3>
                                <div className="space-y-6">
                                    <div className="flex gap-4 items-start">
                                        <div className="w-8 h-8 rounded-full bg-emerald-400 flex items-center justify-center flex-shrink-0 text-white font-bold">1</div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 mb-1">Free Setup & Card Reader</h4>
                                            <p className="text-sm text-gray-600 leading-relaxed">
                                                No setup fees and a free card reader delivered to your salon within 2-3 business days.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 items-start">
                                        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 text-white font-bold">2</div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 mb-1">24/7 Personal Support</h4>
                                            <p className="text-sm text-gray-600 leading-relaxed">
                                                Direct access to our payment specialists who understand the salon industry and can help anytime.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 items-start">
                                        <div className="w-8 h-8 rounded-full bg-amber-400 flex items-center justify-center flex-shrink-0 text-white font-bold">3</div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 mb-1">Free Beauty Drop AI Subscription</h4>
                                            <p className="text-sm text-gray-600 leading-relaxed">
                                                Your Beauty Drop AI subscription is completely free while you process payments with us - saving you $88-$388/month.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Limited Time Offer */}
                            <div className="bg-gradient-to-b from-cyan-400 to-blue-500 rounded-2xl p-8 text-white text-center shadow-lg">
                                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Gift className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="font-bold text-2xl mb-2">Limited Time Offer</h3>
                                <p className="text-white/90 text-sm mb-8">
                                    Sign up this month and get your first 30 days of processing fees waived!
                                </p>
                                <div className="bg-white/20 rounded-xl p-6 backdrop-blur-sm border border-white/30 mb-4">
                                    <div className="text-xs uppercase tracking-wider font-bold opacity-80 mb-1">SAVE UP TO</div>
                                    <div className="text-5xl font-bold mb-1">$500</div>
                                    <div className="text-xs opacity-80">in processing fees</div>
                                </div>
                                <p className="text-[10px] opacity-70">
                                    *Offer valid for new customers only. Terms and conditions apply.
                                </p>
                            </div>

                            {/* Contact */}
                            <div className="bg-blue-50 rounded-2xl p-8 border border-blue-100">
                                <h3 className="font-bold text-gray-900 mb-4">Available To Talk Right Now?</h3>
                                <p className="text-sm text-gray-600 mb-6">
                                    Our payment experts are available 9am - 6pm EST to answer any questions.
                                </p>
                                <div className="flex gap-3">
                                    <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-sm h-10">
                                        <Phone className="w-4 h-4 mr-2" />
                                        (555) 123-4567
                                    </Button>
                                    <Button variant="outline" className="flex-1 bg-white text-sm h-10">
                                        <MessageCircle className="w-4 h-4 mr-2" />
                                        Chat Now
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main >
    )
}
