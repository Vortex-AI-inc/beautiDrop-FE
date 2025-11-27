"use client"

import { useState } from "react"
import { Header } from "../../../components/layout/header"
import { Footer } from "../../../components/layout/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
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
  Star
} from "lucide-react"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    salonName: "",
    businessType: "",
    teamSize: "",
    bestTime: "",
    challenge: ""
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 bg-gradient-to-br from-blue-50 via-purple-50 to-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="text-sm font-semibold text-blue-600 mb-2 tracking-wide uppercase">
                Contact Us
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Let's Transform <br />
                Your Salon <br />
                <span className="text-blue-600">Together</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-lg">
                Ready to automate your booking? Our team is here to help you set up the perfect AI receptionist for your business.
              </p>

              <div className="flex flex-wrap gap-4 mb-10">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 min-w-[200px]">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Phone className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-900">Call Us</div>
                    <div className="text-sm text-blue-600 font-medium">1-800-BEAUTY-AI</div>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 min-w-[200px]">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                    <Mail className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-900">Email Us</div>
                    <div className="text-sm text-blue-600 font-medium">hello@beautydrop.ai</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-y-3 gap-x-6">
                {[
                  "Free installation & setup",
                  "Dedicated support team",
                  "30-day money-back guarantee",
                  "Training for your whole team"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-600 font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-200 rounded-full blur-3xl opacity-30"></div>
              <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-purple-200 rounded-full blur-3xl opacity-30"></div>

              <img
                src="https://images.unsplash.com/photo-1600948836101-f9ffda59d250?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                alt="Salon Consultation"
                className="relative rounded-2xl shadow-2xl w-full object-cover h-[500px] z-10"
              />

              {/* Overlay Card */}
              <div className="absolute top-10 -right-6 z-20 bg-white p-4 rounded-xl shadow-xl border border-gray-100 max-w-xs animate-bounce-slow">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Phone className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 font-medium">Incoming Call...</div>
                    <div className="text-sm font-bold text-gray-900">New Client Booking</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 w-2/3"></div>
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-500 flex justify-between">
                  <span>AI Handling Call</span>
                  <span>00:24</span>
                </div>
              </div>

              <div className="absolute -bottom-6 -left-6 z-20 bg-white p-4 rounded-xl shadow-xl border border-gray-100 flex items-center gap-3">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-[10px] font-bold text-gray-600">
                      <Users className="w-4 h-4" />
                    </div>
                  ))}
                </div>
                <div>
                  <div className="text-sm font-bold text-gray-900">500+ Salons</div>
                  <div className="text-xs text-green-600 font-medium">Joined this month</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Consultation Form Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Form Column */}
            <div className="lg:col-span-7">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Get Your Free <span className="text-blue-600">Consultation</span>
                </h2>
                <p className="text-gray-600">
                  Tell us about your salon and we'll show you how Beauty Drop AI can help you grow.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="salonName">Salon/Spa Name *</Label>
                    <Input
                      id="salonName"
                      name="salonName"
                      placeholder="Your salon name"
                      value={formData.salonName}
                      onChange={handleChange}
                      className="h-12"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="businessType">Business Type</Label>
                    <select
                      id="businessType"
                      name="businessType"
                      value={formData.businessType}
                      onChange={handleChange}
                      className="w-full h-12 px-3 bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    >
                      <option value="">Select type</option>
                      <option value="nail-salon">Nail Salon</option>
                      <option value="day-spa">Day Spa</option>
                      <option value="hair-salon">Hair Salon</option>
                      <option value="medical-spa">Medical Spa</option>
                      <option value="full-service">Full-Service Beauty Salon</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="teamSize">How many team members do you have?</Label>
                  <select
                    id="teamSize"
                    name="teamSize"
                    value={formData.teamSize}
                    onChange={handleChange}
                    className="w-full h-12 px-3 bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="">Select team size</option>
                    <option value="1-2">1-2 team members</option>
                    <option value="3-5">3-5 team members</option>
                    <option value="6-10">6-10 team members</option>
                    <option value="11-20">11-20 team members</option>
                    <option value="20+">20+ team members</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="challenge">What's your biggest challenge with phone calls and bookings?</Label>
                  <textarea
                    id="challenge"
                    name="challenge"
                    placeholder="Tell us about missed calls, booking difficulties, or any other challenges you're facing..."
                    value={formData.challenge}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-3 py-3 bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bestTime">Best time to reach you?</Label>
                  <select
                    id="bestTime"
                    name="bestTime"
                    value={formData.bestTime}
                    onChange={handleChange}
                    className="w-full h-12 px-3 bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="">Select preferred time</option>
                    <option value="morning">Morning (9 AM - 12 PM)</option>
                    <option value="afternoon">12 PM - 5 PM)</option>
                    <option value="evening">Evening (5 PM - 8 PM)</option>
                    <option value="anytime">Anytime</option>
                  </select>
                </div>

                <Button type="submit" className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg rounded-lg shadow-lg">
                  <Calendar className="w-5 h-5 mr-2" />
                  Schedule My Free Consultation
                </Button>

                <p className="text-xs text-gray-500 text-center">
                  By submitting this form, you agree to receive communications from Beauty Drop AI. We respect your privacy.
                </p>
              </form>
            </div>

            {/* Sidebar Column */}
            <div className="lg:col-span-5 space-y-8">
              {/* What Happens Next */}
              <div className="bg-slate-50 rounded-2xl p-8 border border-gray-100">
                <h3 className="font-bold text-lg text-gray-900 mb-6">What Happens Next?</h3>
                <div className="space-y-6">
                  {[
                    { number: "1", title: "We'll Call You", desc: "One of our salon experts will call you to discuss your needs.", color: "bg-blue-600" },
                    { number: "2", title: "Custom Demo", desc: "We'll show you exactly how Beauty Drop AI works for your specific salon.", color: "bg-amber-400" },
                    { number: "3", title: "Free 14-Day Trial", desc: "Start your risk-free trial with full access to all features.", color: "bg-green-500" }
                  ].map((step, i) => (
                    <div key={i} className="flex gap-4 items-start">
                      <div className={`w-8 h-8 rounded-full ${step.color} flex items-center justify-center flex-shrink-0 text-white font-bold text-sm`}>
                        {step.number}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm mb-1">{step.title}</h4>
                        <p className="text-xs text-gray-600 leading-relaxed">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Real Results */}
              <div className="bg-[#6366f1] bg-gradient-to-br from-[#4f46e5] to-[#a855f7] rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
                <div className="relative z-10">
                  <h3 className="font-bold text-xl mb-6">Real Results from Real Salons</h3>

                  <div className="space-y-4">
                    <div className="bg-white/10 backdrop-blur-md rounded-xl p-5 border border-white/20">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                          <Phone className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="font-bold text-lg">Salon de Paris</div>
                      </div>
                      <p className="text-sm text-white/90 italic mb-3 leading-relaxed">
                        "Beauty Drop AI answered 45 calls in the first week that we would have missed. That's $3,000 in revenue saved!"
                      </p>
                      <div className="flex items-center gap-2 text-sm font-medium text-[#4ade80]">
                        <Check className="w-4 h-4" />
                        Verified Customer
                      </div>
                    </div>

                    <div className="bg-white/10 backdrop-blur-md rounded-xl p-5 border border-white/20">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                          <Clock className="w-5 h-5 text-purple-600" />
                        </div>
                        <div className="font-bold text-lg">Glow Bar Spa</div>
                      </div>
                      <p className="text-sm text-white/90 italic mb-3 leading-relaxed">
                        "Setup took less than 30 minutes. It's like having a receptionist who never sleeps."
                      </p>
                      <div className="flex items-center gap-2 text-sm font-medium text-[#4ade80]">
                        <Check className="w-4 h-4" />
                        Verified Customer
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Available To Talk */}
              <div className="bg-[#f0f9ff] rounded-2xl p-8 border border-blue-100">
                <h3 className="font-bold text-lg text-gray-900 mb-2">Available To Talk Right Now?</h3>
                <p className="text-gray-600 mb-6">
                  Skip the form and call us directly. Our specialists are ready to help.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button className="w-full h-12 bg-[#00c853] hover:bg-[#00b54b] text-white font-bold text-base">
                    <Phone className="w-4 h-4 mr-2" />
                    (555) 123-4567
                  </Button>
                  <Button variant="outline" className="w-full h-12 bg-white border-orange-400 text-orange-500 hover:bg-orange-50 font-bold text-base">
                    Chat with Sales
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 bg-slate-50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Frequently Asked <span className="text-blue-600">Questions</span>
            </h2>
            <p className="text-gray-600">
              Everything you need to know about Beauty Drop AI and how it works for your salon.
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full space-y-4">
            {[
              {
                q: "How quickly can Beauty Drop AI be set up for my salon?",
                a: "Setup is incredibly fast! Once you sign up, our team will have Beauty Drop AI trained for your specific salon within 30 minutes. We'll learn your services, pricing, policies, and staff schedules, then test everything to ensure it's working perfectly before going live."
              },
              {
                q: "What happens to my existing phone number?",
                a: "You keep your existing phone number! Beauty Drop AI integrates seamlessly with your current phone system. Customers will call the same number they always have, but now Beauty Drop will answer professionally and handle bookings 24/7. No disruption to your business."
              },
              {
                q: "How does Beauty Drop AI know my salon's services and pricing?",
                a: "During setup, our team works with you to train Beauty Drop on everything specific to your salon: service menu, pricing, staff schedules, policies, and even your preferred way of speaking to customers. Beauty Drop learns your business inside and out, so it can represent you perfectly on every call."
              },
              {
                q: "What if a customer wants to speak to a human?",
                a: "No problem! Beauty Drop AI can instantly transfer calls to you or your staff whenever requested. We also set up escalation rules - for example, complex questions or VIP customers can be automatically transferred. You're always in control of when you want to take calls personally."
              },
              {
                q: "How does the appointment booking system work?",
                a: "Beauty Drop AI connects directly to your existing scheduling system or calendar. It can check availability in real-time, book appointments, send confirmations, and even handle rescheduling. Your team sees new bookings appear automatically in your usual booking system - no extra work required."
              },
              {
                q: "What about payment processing and cancellation policies?",
                a: "Beauty Drop AI can collect credit card information securely via text message for deposits or cancellation policies. It automatically enforces your cancellation rules and charges no-show fees when appropriate. Plus, if you use our credit card processing service, we can waive your monthly subscription fees entirely."
              },
              {
                q: "Is there a long-term contract required?",
                a: "No contracts, no commitments! We offer month-to-month pricing because we're confident you'll love the results. You can cancel anytime if you're not completely satisfied. Most salon owners see such great results that they never want to go back to missing calls again."
              },
              {
                q: "How much support do you provide after setup?",
                a: "We provide 24/7 support and continuous optimization. Our team monitors Beauty Drop's performance, makes improvements based on your feedback, and updates the AI as your business grows. We're not just a software provider - we're your technology partner committed to your success."
              }
            ].map((item, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="bg-white border border-gray-200 rounded-xl px-6">
                <AccordionTrigger className="text-left font-semibold text-gray-900 hover:no-underline py-6">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 leading-relaxed pb-6">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Support Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              We're Here to <span className="text-blue-600">Support You</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our mission is to ensure you succeed. Our team is always just a click or call away when you need us.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow flex gap-6 items-start">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-600/20">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">24/7 Phone Support</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Call us anytime, day or night. Our US-based support team is always ready to help with urgent issues or questions.
                  </p>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    Call Support
                  </Button>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow flex gap-6 items-start">
                <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-orange-500/20">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Email Support</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Send us a detailed email for complex issues. We typically respond within 2 hours with a comprehensive solution.
                  </p>
                  <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                    Email Us
                  </Button>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow flex gap-6 items-start">
                <div className="w-12 h-12 bg-teal-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-teal-500/20">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Live Chat Support</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Chat with our support engineers in real-time right from your dashboard. Perfect for quick questions and guidance.
                  </p>
                  <Button size="sm" className="bg-teal-500 hover:bg-teal-600">
                    Start Chat
                  </Button>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl transform rotate-3 opacity-10"></div>
              <img
                src="https://images.unsplash.com/photo-1573497620053-ea5300f94f21?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                alt="Customer Support Team"
                className="relative rounded-3xl shadow-2xl w-full object-cover h-[600px]"
              />

              <div className="absolute bottom-8 left-8 right-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white shadow-xl">
                <h3 className="font-bold text-lg mb-4">Our Support Promise</h3>
                <div className="space-y-2">
                  {[
                    "Real humans, no robots for support",
                    "No long hold times or transfers",
                    "Experts who understand salon business",
                    "We don't rest until your problem is solved"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <div className="w-4 h-4 bg-white/20 rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <span className="opacity-90">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="absolute top-8 right-8 bg-white p-4 rounded-xl shadow-xl flex items-center gap-3 animate-pulse">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <Clock className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <div className="text-xs text-gray-500 font-bold uppercase">Avg Response Time</div>
                  <div className="text-lg font-bold text-gray-900">&lt; 2 mins</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-3xl p-12">
            <div className="text-center mb-10">
              <h3 className="text-2xl font-bold text-gray-900">Support by the Numbers</h3>
              <p className="text-gray-600">Our performance speaks for itself</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { icon: Clock, value: "< 15 min", label: "Average Resolution", color: "bg-indigo-500" },
                { icon: Star, value: "98%", label: "Customer Satisfaction", color: "bg-orange-500" },
                { icon: Shield, value: "99.9%", label: "Service Uptime", color: "bg-cyan-500" },
                { icon: Headphones, value: "24/7", label: "Support Availability", color: "bg-pink-500" }
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className={`w-14 h-14 ${stat.color} rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-gray-200`}>
                    <stat.icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
