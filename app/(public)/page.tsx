import Link from "next/link"
import { Phone, Calendar, Zap, Bell, TrendingUp, Users, CreditCard, Play, Info, ArrowRight, Rocket } from "lucide-react"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* Hero Section */}
      <section className="bg-blue-50 px-4 py-16 md:py-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div>
              <span className="text-blue-600 font-semibold">AI Assistant</span>
              <h1 className="text-5xl md:text-6xl font-bold font-heading text-gray-900 mt-2 leading-tight">
                for your Beauty Services
              </h1>
            </div>

            <p className="text-lg text-gray-600 max-w-md leading-relaxed">
              Meet Beauty Drop - your 24/7 AI receptionist that answers calls, books appointments, handles payments, and
              keeps your customers happy while you focus on what you do best.
            </p>

            {/* Feature Tags */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                  <Phone className="w-6 h-6 text-teal-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">24/7 Call Handling</div>
                  <div className="text-sm text-gray-600">Never miss a customer</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Smart Booking</div>
                  <div className="text-sm text-gray-600">Automated scheduling</div>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Rocket className="w-5 h-5" />
                Start Free Trial
              </Link>
              <Link
                href="/features"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
              >
                <Play className="w-5 h-5 fill-current" />
                See Features
              </Link>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative">
            <div className="bg-white rounded-3xl shadow-lg p-6 space-y-4">
              {/* Call Interface */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-teal-600 font-semibold">Incoming Call</span>
                </div>
                <div className="bg-gray-50 rounded-2xl p-6 space-y-3">
                  <div className="text-sm text-gray-600">Booking Request</div>
                  <div className="text-lg font-semibold text-gray-900">(555) 123-4567</div>
                  <div className="space-y-2">
                    <button className="w-full py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 flex items-center justify-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Book Appointment
                    </button>
                    <button className="w-full py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 flex items-center justify-center gap-2">
                      <Info className="w-4 h-4" />
                      Get Info
                    </button>
                  </div>
                </div>
              </div>

              {/* Demo Badge */}
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-600">✨ AI Handling</div>
                <span className="text-xs text-gray-500">Try Demo Now!</span>
              </div>
            </div>

            {/* Stats Badge */}
            <div className="absolute -bottom-4 right-4 bg-white rounded-xl shadow-lg p-4 border-l-4 border-orange-500">
              <div className="text-orange-600 font-bold text-2xl">156</div>
              <div className="text-sm text-gray-600">Calls Today</div>
              <div className="text-xs text-gray-500 mt-1">⭐ Smart AI Learning</div>
            </div>
          </div>
        </div>
      </section>

      {/* Everything You Need Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-5xl font-bold font-heading text-gray-900">
              Everything Your Salon Needs in One <span className="text-blue-600">AI Assistant</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Beauty Drop handles every aspect of customer communication so you can focus on delivering exceptional
              beauty services.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Phone,
                color: "bg-purple-500",
                title: "24/7 Call Answering",
                desc: "Never miss another customer call. Beauty Drop answers every phone call professionally, 24 hours a day, 7 days a week, ensuring you capture every business opportunity.",
              },
              {
                icon: Calendar,
                color: "bg-orange-500",
                title: "Smart Appointment Booking",
                desc: "Seamlessly integrates with your technicians' calendars to book appointments automatically, optimizing your schedule and reducing no-shows.",
              },
              {
                icon: CreditCard,
                color: "bg-teal-500",
                title: "Payment Processing",
                desc: "Handles credit card collection for cancellation policies and no-shows via secure text messages, protecting your business from lost revenue.",
              },
              {
                icon: Bell,
                color: "bg-pink-500",
                title: "Smart Reminders",
                desc: "Automatically sends appointment reminders via call or SMS, reducing no-shows and keeping your schedule full and profitable.",
              },
              {
                icon: TrendingUp,
                color: "bg-green-500",
                title: "Upselling & Products",
                desc: "Intelligently promotes additional services and sells products to customers after visits, with direct shipping to their homes.",
              },
              {
                icon: Users,
                color: "bg-blue-500",
                title: "Custom AI Training",
                desc: "We create and train your AI agent specifically for your salon, ensuring it knows your services, pricing, and policies perfectly.",
              },
            ].map((feature, i) => {
              const Icon = feature.icon
              return (
                <div
                  key={i}
                  className="bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-lg transition-shadow"
                >
                  <div className={`w-16 h-16 ${feature.color} rounded-2xl flex items-center justify-center mb-4`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold font-heading text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-blue-50">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="font-bold text-gray-900">Ready to transform your salon?</div>
              <div className="text-sm text-gray-600">Start your free trial today and see the difference</div>
            </div>
          </div>
          <Link
            href="/signup"
            className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap gap-2"
          >
            Get Started
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </main>
  )
}
