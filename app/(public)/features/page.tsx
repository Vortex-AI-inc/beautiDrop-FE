import {
    Phone,
    Calendar,
    Users,
    CreditCard,
    TrendingUp,
    UserCheck,
    Scissors,
    Sparkles,
    Heart,
    Stethoscope,
    Check,
    Play
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Header } from "../../../components/layout/header"
import { Footer } from "../../../components/layout/footer"

export default function FeaturesPage() {
    return (
        <main className="min-h-screen bg-white">
            <Header />

            {/* Hero Section */}
            <section className="pt-32 pb-20 bg-gradient-to-br from-blue-50 via-white to-purple-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        {/* Left Content */}
                        <div className="space-y-8">
                            <div>
                                <div className="flex items-center gap-2 text-sm mb-4">
                                    <Link href="/" className="text-blue-600 hover:text-blue-700 font-medium">
                                        Home
                                    </Link>
                                    <span className="text-blue-600">→</span>
                                    <span className="text-blue-600 font-medium">Features</span>
                                </div>
                                <h1 className="text-5xl lg:text-6xl font-bold font-heading leading-tight">
                                    Powerful Features That <span className="text-purple-600">Transform</span> Your Salon
                                </h1>
                            </div>

                            <p className="text-lg text-gray-600 leading-relaxed max-w-lg">
                                Discover how Beauty Drop AI's advanced features work together to handle calls, book appointments, and grow your salon—all while you focus on making your clients beautiful.
                            </p>

                            {/* Feature Badges */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 border border-gray-200">
                                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                                        <Phone className="w-4 h-4 text-orange-600" />
                                    </div>
                                    <span className="text-sm font-medium text-gray-700">24/7 Call Answering</span>
                                </div>
                                <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 border border-gray-200">
                                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                                        <Sparkles className="w-4 h-4 text-purple-600" />
                                    </div>
                                    <span className="text-sm font-medium text-gray-700">AI-Powered Intelligence</span>
                                </div>
                                <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 border border-gray-200">
                                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                        <Calendar className="w-4 h-4 text-blue-600" />
                                    </div>
                                    <span className="text-sm font-medium text-gray-700">Smart Scheduling</span>
                                </div>
                                <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 border border-gray-200">
                                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                        <TrendingUp className="w-4 h-4 text-green-600" />
                                    </div>
                                    <span className="text-sm font-medium text-gray-700">Revenue Analytics</span>
                                </div>
                            </div>

                            {/* CTA Buttons */}
                            <div className="flex flex-wrap gap-4">
                                <Button className="h-12 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg">
                                    <Play className="w-4 h-4 mr-2" />
                                    See It In Action
                                </Button>
                                <Button variant="outline" className="h-12 px-6 border-2 border-gray-200 hover:border-blue-600 hover:text-blue-600 font-semibold rounded-lg">
                                    <Phone className="w-4 h-4 mr-2" />
                                    Call 916-266-9677
                                </Button>
                            </div>
                        </div>

                        {/* Right Preview Card */}
                        <div className="relative">
                            <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl p-8 text-white shadow-2xl">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                                        <Phone className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-sm opacity-90">Incoming Call</p>
                                        <p className="font-bold">Sarah Johnson</p>
                                    </div>
                                </div>

                                <div className="bg-white/10 backdrop-blur rounded-xl p-4 mb-4">
                                    <p className="text-sm mb-2 opacity-90">Beauty Drop AI Response:</p>
                                    <p className="text-sm leading-relaxed">
                                        "Hi Sarah! I'd be happy to help book your appointment. We have availability this week on Tuesday at 2pm or Thursday at 4pm. Which works better for you?"
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <Button className="bg-green-500 hover:bg-green-600 text-white">
                                        <Check className="w-4 h-4 mr-2" />
                                        Book Appointment
                                    </Button>
                                    <Button className="bg-white/20 hover:bg-white/30 text-white">
                                        <Phone className="w-4 h-4 mr-2" />
                                        Call Back
                                    </Button>
                                </div>

                                <div className="grid grid-cols-3 gap-4 text-center">
                                    <div className="bg-white/10 rounded-lg p-3">
                                        <p className="text-2xl font-bold">156</p>
                                        <p className="text-xs opacity-75">Calls Today</p>
                                    </div>
                                    <div className="bg-white/10 rounded-lg p-3">
                                        <p className="text-2xl font-bold">98%</p>
                                        <p className="text-xs opacity-75">Booking Rate</p>
                                    </div>
                                    <div className="bg-white/10 rounded-lg p-3">
                                        <p className="text-2xl font-bold">4.9</p>
                                        <p className="text-xs opacity-75">Satisfaction</p>
                                    </div>
                                </div>
                            </div>

                            {/* Floating badge */}
                            <div className="absolute -top-4 -right-4 bg-white rounded-xl p-3 shadow-lg">
                                <p className="text-xs text-gray-500 mb-1">24/7</p>
                                <p className="text-sm font-bold text-gray-900">Always Active</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Everything You Need Section */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl lg:text-5xl font-bold font-heading text-gray-900 mb-6">
                            Everything You Need to <span className="text-blue-600">Grow Your Salon</span>
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Beauty Drop AI combines powerful automation with intelligent assistant features to handle every aspect of customer communication, booking appointments, and growing revenue.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Phone,
                                color: "bg-cyan-500",
                                iconBg: "bg-cyan-100",
                                iconColor: "text-cyan-600",
                                title: "24/7 Smart Call Answering",
                                description: "Never miss a call again. Our AI answers instantly every time, 24 hours a day, 7 days a week. Whether it's midnight or midday, your customers get immediate, professional service.",
                                features: [
                                    "Natural AI conversation flow",
                                    "Handles multiple calls at once",
                                    "Custom greetings for your salon",
                                    "Learn and improve"
                                ]
                            },
                            {
                                icon: Calendar,
                                color: "bg-blue-500",
                                iconBg: "bg-blue-100",
                                iconColor: "text-blue-600",
                                title: "Intelligent Appointment Booking",
                                description: "Seamlessly book appointments by understanding your calendar, service durations, and staff availability. Reschedule, cancel, or modify bookings with ease.",
                                features: [
                                    "Real-time calendar syncing",
                                    "Automatic availability checking",
                                    "Staff-specific scheduling",
                                    "Self-service for clients"
                                ]
                            },
                            {
                                icon: Users,
                                color: "bg-orange-500",
                                iconBg: "bg-orange-100",
                                iconColor: "text-orange-600",
                                title: "Smart Customer Management",
                                description: "Keep track of every customer, their preferences, appointment history, and purchase patterns. Build stronger relationships with personalized service.",
                                features: [
                                    "Complete customer profiles",
                                    "Service history tracking",
                                    "Preference management",
                                    "Personalized recommendations"
                                ]
                            },
                            {
                                icon: CreditCard,
                                color: "bg-pink-500",
                                iconBg: "bg-pink-100",
                                iconColor: "text-pink-600",
                                title: "Secure Payment Processing",
                                description: "Accept deposits, process payments, and manage transactions securely. Reduce no-shows and protect your revenue with automated payment processing.",
                                features: [
                                    "PCI-compliant processing",
                                    "Automated deposit collection",
                                    "Multiple payment methods",
                                    "No show fee enforcement"
                                ]
                            },
                            {
                                icon: TrendingUp,
                                color: "bg-green-500",
                                iconBg: "bg-green-100",
                                iconColor: "text-green-600",
                                title: "Revenue Analytics & Insights",
                                description: "Get valuable insights into your salon's performance with real-time analytics on bookings, revenue, customer trends, and staff productivity.",
                                features: [
                                    "Real-time revenue tracking",
                                    "Booking trend analysis",
                                    "Customer retention insights",
                                    "Performance reports"
                                ]
                            },
                            {
                                icon: UserCheck,
                                color: "bg-blue-600",
                                iconBg: "bg-blue-100",
                                iconColor: "text-blue-700",
                                title: "Seamless Staff Coordination",
                                description: "Simplify staff scheduling with smart coordination features. Manage multiple stylists, track their availability, and optimize your team's productivity.",
                                features: [
                                    "Multi-staff scheduling",
                                    "Availability management",
                                    "Performance tracking",
                                    "Commission calculations"
                                ]
                            }
                        ].map((feature, i) => (
                            <div key={i} className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 group">
                                <div className={`w-16 h-16 ${feature.iconBg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                    <feature.icon className={`w-8 h-8 ${feature.iconColor}`} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                                <p className="text-gray-600 leading-relaxed mb-6">{feature.description}</p>
                                <ul className="space-y-2">
                                    {feature.features.map((item, j) => (
                                        <li key={j} className="flex items-center gap-2 text-sm text-gray-600">
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

            <section className="py-24 bg-gradient-to-br from-blue-50 to-purple-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl lg:text-5xl font-bold font-heading text-gray-900 mb-4">
                            Built for Every Type of Salon
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Beauty Drop AI adapts to your specific business needs and industry requirements
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            {
                                icon: Scissors,
                                iconBg: "bg-purple-500",
                                title: "Hair Salons",
                                description: "Color services, cuts, styling appointments with proper timing and stylist matching"
                            },
                            {
                                icon: Sparkles,
                                iconBg: "bg-orange-500",
                                title: "Nail Salons",
                                description: "Manicures, pedicures, nail art with service duration awareness and equipment scheduling"
                            },
                            {
                                icon: Heart,
                                iconBg: "bg-teal-500",
                                title: "Day Spas",
                                description: "Facials, massages, body treatments with room coordination and therapist specializations"
                            },
                            {
                                icon: Stethoscope,
                                iconBg: "bg-pink-500",
                                title: "Medical Spas",
                                description: "Advanced treatments, consultations, compliance requirements with specialized booking protocols"
                            }
                        ].map((salon, i) => (
                            <div key={i} className="text-center">
                                <div className={`w-16 h-16 ${salon.iconBg} rounded-full flex items-center justify-center mx-auto mb-4`}>
                                    <salon.icon className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">{salon.title}</h3>
                                <p className="text-sm text-gray-600 leading-relaxed">{salon.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>



            <Footer />
        </main>
    )
}
