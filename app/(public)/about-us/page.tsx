"use client"

import { Header } from "../../../components/layout/header"
import { Footer } from "../../../components/layout/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
    Phone,
    Mail,
    Check,
    MessageSquare,
    Calendar,
    Clock,
    Users,
    Zap,
    Shield,
    Headphones,
    Gift,
    ArrowRight,
    Play,
    MapPin,
    Star,
    Target,
    Heart,
    Sparkles,
    TrendingUp,
    Award,
    Rocket,
    Building2,
    Globe
} from "lucide-react"

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-white">
            <Header />

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-4 bg-gradient-to-br from-blue-50 via-purple-50 to-white">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-600 px-4 py-1.5 rounded-full text-sm font-bold mb-6">
                                <Sparkles className="w-4 h-4" />
                                About Us
                            </div>
                            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                                Empowering <br />
                                <span className="text-blue-600">Beauty Businesses</span> <br />
                                With AI Innovation
                            </h1>
                            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                                We're on a mission to help salon and spa owners reclaim their time, grow their revenue, and deliver exceptional customer experiences through intelligent automation.
                            </p>

                            <div className="flex flex-wrap gap-4 mb-8">
                                <Link href="/contact">
                                    <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-6 text-lg rounded-lg shadow-lg flex items-center gap-2">
                                        <Rocket className="w-5 h-5" />
                                        Get Started
                                    </Button>
                                </Link>
                                <Button variant="outline" className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-bold px-8 py-6 text-lg rounded-lg flex items-center gap-2">
                                    <Play className="w-5 h-5 fill-current" />
                                    Watch Demo
                                </Button>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { icon: Users, value: "500+", label: "Active Salons" },
                                    { icon: Phone, value: "50K+", label: "Calls Handled" }
                                ].map((stat, i) => (
                                    <div key={i} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                <stat.icon className="w-5 h-5 text-blue-600" />
                                            </div>
                                            <div>
                                                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                                                <div className="text-sm text-gray-600">{stat.label}</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="relative">
                            <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-200 rounded-full blur-3xl opacity-30"></div>
                            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-purple-200 rounded-full blur-3xl opacity-30"></div>

                            <img
                                src="https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                                alt="Beauty Salon"
                                className="relative rounded-2xl shadow-2xl w-full object-cover h-[500px] z-10"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Our Story Section */}
            <section className="py-20 px-4 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            Our Story: Born from <span className="text-blue-600">Real Experience</span>
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Beauty Drop AI was created by salon owners who experienced firsthand the challenges of managing a busy beauty business.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Phone,
                                color: "bg-red-100 text-red-600",
                                title: "The Problem We Faced",
                                desc: "Missing 20+ calls daily meant losing thousands in revenue. Our team was overwhelmed, and customers were frustrated."
                            },
                            {
                                icon: Sparkles,
                                color: "bg-blue-100 text-blue-600",
                                title: "The AI Solution",
                                desc: "We built an AI receptionist that never sleeps, never misses a call, and books appointments 24/7 with perfect accuracy."
                            },
                            {
                                icon: TrendingUp,
                                color: "bg-green-100 text-green-600",
                                title: "The Results",
                                desc: "Our revenue increased 45% in 3 months. We decided to share this technology with other salon owners facing the same challenges."
                            },
                            {
                                icon: Heart,
                                color: "bg-pink-100 text-pink-600",
                                title: "Our Commitment",
                                desc: "We're committed to helping beauty professionals succeed by automating the tedious parts of running a salon."
                            },
                            {
                                icon: Shield,
                                color: "bg-purple-100 text-purple-600",
                                title: "Built for Salons",
                                desc: "Unlike generic AI tools, Beauty Drop is specifically designed for the beauty industry with features salons actually need."
                            },
                            {
                                icon: Rocket,
                                color: "bg-orange-100 text-orange-600",
                                title: "Always Improving",
                                desc: "We continuously improve our AI based on real salon feedback, ensuring it gets smarter and more helpful every day."
                            }
                        ].map((item, i) => (
                            <div key={i} className="bg-slate-50 rounded-2xl p-8 border border-gray-100 hover:shadow-lg transition-shadow">
                                <div className={`w-14 h-14 ${item.color} rounded-xl flex items-center justify-center mb-6`}>
                                    <item.icon className="w-7 h-7" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Our Values Section */}
            <section className="py-20 px-4 bg-slate-50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            Our Values & <span className="text-blue-600">Approach</span>
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            These core principles guide everything we do at Beauty Drop AI.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Target,
                                color: "from-blue-500 to-blue-600",
                                title: "Customer-Obsessed",
                                desc: "Every feature we build starts with understanding what salon owners actually need, not what we think they need.",
                                points: ["Direct salon owner feedback", "Real-world testing", "Continuous improvement"]
                            },
                            {
                                icon: Award,
                                color: "from-orange-500 to-orange-600",
                                title: "AI Excellence",
                                desc: "We use cutting-edge AI technology to deliver the most natural, helpful, and accurate virtual receptionist possible.",
                                points: ["Natural conversations", "Context awareness", "Learning from interactions"]
                            },
                            {
                                icon: Heart,
                                color: "from-purple-500 to-purple-600",
                                title: "Partnership Mindset",
                                desc: "We're not just a software provider - we're your technology partner invested in your long-term success.",
                                points: ["24/7 support", "Proactive optimization", "Growth partnership"]
                            }
                        ].map((value, i) => (
                            <div key={i} className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                                <div className={`w-16 h-16 bg-gradient-to-br ${value.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}>
                                    <value.icon className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-3">{value.title}</h3>
                                <p className="text-gray-600 mb-6 leading-relaxed">{value.desc}</p>
                                <ul className="space-y-2">
                                    {value.points.map((point, j) => (
                                        <li key={j} className="flex items-center gap-2 text-sm text-gray-600">
                                            <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                                            {point}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Meet the Team Section */}
            <section className="py-20 px-4 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            Meet the Team Behind <span className="text-blue-600">Beauty Drop AI</span>
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            A passionate group of salon owners, AI engineers, and customer success experts dedicated to your success.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
                        <div>
                            <img
                                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                                alt="Team Meeting"
                                className="rounded-2xl shadow-2xl w-full object-cover h-[400px]"
                            />
                        </div>
                        <div className="space-y-6">
                            <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                                        <Users className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-gray-900">Leadership Team</h3>
                                        <p className="text-sm text-gray-600">Former salon owners & tech leaders</p>
                                    </div>
                                </div>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    Our founders ran successful salons for over 15 years before building Beauty Drop AI. They understand your challenges because they've lived them.
                                </p>
                            </div>

                            <div className="bg-orange-50 rounded-2xl p-6 border border-orange-100">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center">
                                        <Zap className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-gray-900">AI Engineering</h3>
                                        <p className="text-sm text-gray-600">World-class AI & ML experts</p>
                                    </div>
                                </div>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    Our AI team includes engineers from leading tech companies who specialize in natural language processing and conversational AI.
                                </p>
                            </div>

                            <div className="bg-teal-50 rounded-2xl p-6 border border-teal-100">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center">
                                        <Headphones className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-gray-900">Customer Success</h3>
                                        <p className="text-sm text-gray-600">Dedicated support specialists</p>
                                    </div>
                                </div>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    Our support team is available 24/7 to ensure your Beauty Drop AI is always working perfectly for your salon.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Join Us CTA Section */}
            <section className="py-24 px-4 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>

                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        Join Salon Owners Who <span className="text-yellow-400">Never Miss a Call</span>
                    </h2>
                    <p className="text-xl text-purple-100 mb-12 max-w-2xl mx-auto">
                        Start your 14-day free trial today and see why hundreds of salons trust Beauty Drop AI to handle their phone calls and bookings.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                        <Link href="/contact">
                            <Button className="h-14 px-8 bg-yellow-400 hover:bg-yellow-500 text-gray-900 text-lg font-bold rounded-xl shadow-lg flex items-center gap-2">
                                <Rocket className="w-5 h-5" />
                                Start Free Trial
                            </Button>
                        </Link>
                        <Link href="/pricing">
                            <Button className="h-14 px-8 bg-white/10 hover:bg-white/20 text-white text-lg font-semibold rounded-xl backdrop-blur-sm border border-white/20 flex items-center gap-2">
                                <ArrowRight className="w-5 h-5" />
                                View Pricing
                            </Button>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
                        {[
                            { icon: Check, text: "No credit card required" },
                            { icon: Shield, text: "Cancel anytime" },
                            { icon: Headphones, text: "24/7 support included" }
                        ].map((item, i) => (
                            <div key={i} className="flex items-center justify-center gap-2 text-white">
                                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                                    <item.icon className="w-3 h-3 text-white" />
                                </div>
                                <span className="text-sm font-medium">{item.text}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-20 px-4 bg-slate-50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            Trusted by the Numbers
                        </h2>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {[
                            { icon: Building2, value: "500+", label: "Active Salons", color: "bg-blue-600" },
                            { icon: Phone, value: "50K+", label: "Calls Answered", color: "bg-orange-600" },
                            { icon: Calendar, value: "98%", label: "Booking Success", color: "bg-teal-600" },
                            { icon: Star, value: "4.9/5", label: "Customer Rating", color: "bg-pink-600" }
                        ].map((stat, i) => (
                            <div key={i} className="text-center">
                                <div className={`w-16 h-16 ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                                    <stat.icon className="w-8 h-8 text-white" />
                                </div>
                                <div className="text-4xl font-bold text-gray-900 mb-2">{stat.value}</div>
                                <div className="text-gray-600 font-medium">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>



            <Footer />
        </main>
    )
}
