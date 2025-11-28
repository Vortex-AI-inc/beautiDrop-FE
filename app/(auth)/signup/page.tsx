import { SignUp } from '@clerk/nextjs'
import { Header } from "../../../components/layout/header"
import { Footer } from "../../../components/layout/footer"
import { Zap, Headphones, FileText, TrendingUp } from "lucide-react"

export default function SignUpPage() {
  return (
    <main className="min-h-screen bg-slate-50 flex flex-col pt-20">
      <Header />

      <div className="flex-grow py-12 px-4 sm:px-6 lg:px-8 min-h-[calc(100vh-12rem)]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Left: Clerk SignUp Form */}
            <div className="flex items-center justify-center">
              <div className="w-full max-w-md">
                <SignUp
                  appearance={{
                    elements: {
                      formButtonPrimary:
                        'bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg',
                      card: 'bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 rounded-2xl',
                      headerTitle: 'text-3xl font-bold text-gray-900',
                      headerSubtitle: 'text-gray-500',
                      socialButtonsBlockButton:
                        'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 font-medium rounded-lg',
                      formFieldInput:
                        'border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500',
                      footerActionLink: 'text-blue-600 hover:text-blue-500 font-medium',
                    },
                  }}
                  routing="path"
                  path="/signup"
                  signInUrl="/login"
                  afterSignUpUrl="/"
                />
              </div>
            </div>

            {/* Right: Benefits Card */}
            <div className="hidden lg:block space-y-8">
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8">
                <div className="inline-block bg-green-400 text-white px-4 py-1 rounded-full text-sm font-bold mb-6">
                  ✓ Trusted Platform
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Join <span className="text-blue-600">Successful</span><br />
                  Beauty Professionals
                </h2>
                <p className="text-gray-600 mb-8">
                  Start your free trial today and see why beauty professionals trust Beauty Drop AI to grow their business.
                </p>

                <div className="space-y-6">
                  {[
                    { Icon: Zap, title: "Quick Setup", desc: "Get started in under 5 minutes with our guided setup process", color: "bg-green-100" },
                    { Icon: Headphones, title: "24/7 Support", desc: "Our team is here to help you succeed every step of the way", color: "bg-orange-100" },
                    { Icon: FileText, title: "No Contracts", desc: "Cancel anytime with no hidden fees or long-term commitments", color: "bg-purple-100" },
                    { Icon: TrendingUp, title: "Proven Results", desc: "Average 40% increase in bookings within the first month", color: "bg-yellow-100" }
                  ].map((benefit, i) => (
                    <div key={i} className="flex gap-4 items-start">
                      <div className={`w-12 h-12 ${benefit.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                        <benefit.Icon className="w-6 h-6 text-gray-700" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 mb-1">{benefit.title}</h3>
                        <p className="text-sm text-gray-600">{benefit.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Testimonial */}
                <div className="mt-8 bg-white rounded-xl p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                      SJ
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">Sarah Johnson</p>
                      <p className="text-sm text-gray-500">Owner, Blush Beauty Salon</p>
                    </div>
                  </div>
                  <p className="text-gray-700 italic mb-3">
                    "Beauty Drop AI has completely transformed my business. I never miss a call now, and my booking rate has doubled!"
                  </p>
                  <div className="flex gap-1 text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <span key={i}>★</span>
                    ))}
                    <span className="text-gray-900 ml-2 text-sm font-semibold">5.0/5</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
