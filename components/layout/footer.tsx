import Link from "next/link"
import { Facebook, Twitter, Instagram, Linkedin, Phone, Mail, MapPin, Shield, Lock, Award, Rocket } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/ui/logo"

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">

          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <Logo variant="stacked" size="lg" theme="dark" />
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Meet <span className="text-white font-semibold">Beauty Drop</span> - your 24/7 AI receptionist that:
            </p>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-0.5">✓</span>
                <span>Answers calls</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-0.5">✓</span>
                <span>Books appointments</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-0.5">✓</span>
                <span>Handles payments</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-0.5">✓</span>
                <span>Keeps your customers happy</span>
              </li>
            </ul>
            <p className="text-gray-400 text-sm italic">
              Focus on what you do best - we'll handle the rest.
            </p>
            <div className="flex gap-4 pt-2">
              <Link href="https://www.facebook.com/beautydropai" className="text-gray-400 hover:text-blue-500 transition-colors">
                <Facebook className="w-5 h-5" />
              </Link>
              <Link href="https://www.linkedin.com/company/beautydropai" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Linkedin className="w-5 h-5" />
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4 text-amber-400">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-[#ffba00] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/features" className="text-gray-400 hover:text-[#ffba00] transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-gray-400 hover:text-[#ffba00] transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/for-salon-owners" className="text-gray-400 hover:text-[#ffba00] transition-colors">
                  For Salon Owners
                </Link>
              </li>

            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4 text-amber-400">Services</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/credit-card-processing" className="text-gray-400 hover:text-[#ffba00] transition-colors">
                  Credit Card Processing
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-[#ffba00] transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/about-us" className="text-gray-400 hover:text-[#ffba00] transition-colors">
                  About Us
                </Link>
              </li>
              <li className="text-gray-400  transition-colors">
                {/* <Link href="/24-7-ai-call-handling" className="text-gray-400 hover:text-[#ffba00] transition-colors"> */}
                24/7 AI Call Handling

              </li>
              <li className="text-gray-400  transition-colors">
                {/* <Link href="#" className="text-gray-400 hover:text-[#ffba00] transition-colors"> */}
                Smart Appointment Booking

              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4 text-amber-400">Get in Touch</h3>
            <ul className="space-y-3">
              <li className="space-y-1">
                <div className="flex items-start gap-3 text-gray-400">
                  <Phone className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-white font-semibold">Call Us</p>
                    <Link href="tel:916-268-1877" className="hover:text-amber-400 transition-colors">
                      916-268-1877
                    </Link>
                    <p className="text-xs text-gray-500">Available 24/7</p>
                  </div>
                </div>
              </li>
              <li className="space-y-1">
                <div className="flex items-start gap-3 text-gray-400">
                  <Mail className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-white font-semibold">Email Support</p>
                    <Link href="mailto:support@beautydropai.com" className="hover:text-amber-400 transition-colors break-all">
                      support@beautydropai.com
                    </Link>
                  </div>
                </div>
              </li>
              <li className="space-y-1">
                <div className="flex items-start gap-3 text-gray-400">
                  <div className="w-4 h-4 mt-0.5 flex-shrink-0 flex items-center justify-center">
                    <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                  </div>
                  <div>
                    <p className="text-white font-semibold">Response Time</p>
                    <p className="text-sm">Under 1 hour</p>
                  </div>
                </div>
              </li>
            </ul>
            <Link href="/signup">
              <Button className="mt-4 w-full bg-amber-400 hover:bg-amber-500 text-gray-900 font-bold">
                <Rocket className="w-4 h-4 mr-2" />
                Start Free Trial
              </Button>
            </Link>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Beauty Drop AI. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy-policy" className="hover:text-[#ffba00] transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" className="hover:text-[#ffba00] transition-colors">
              Terms of Service
            </Link>
            <Link href="/cookie-policy" className="hover:text-[#ffba00] transition-colors">
              Cookie Policy
            </Link>
            <Link href="/accessibility" className="hover:text-[#ffba00] transition-colors">
              Accessibility
            </Link>
          </div>
        </div>
      </div>

      {/* Security Badges */}
      <div className="border-t border-gray-800 mt-8 pt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-16 text-sm font-medium text-gray-400">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-emerald-500" />
              <span>SSL Secured</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-emerald-500" />
              <span>GDPR Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-500" />
              <span>Industry Leading</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
