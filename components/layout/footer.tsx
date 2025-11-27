import Link from "next/link"
import { Facebook, Twitter, Instagram, Linkedin, Phone, Mail, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex items-center font-bold text-2xl tracking-tight">
                <span className="text-blue-500">BEAUTY</span>
                <span className="text-white ml-1">DROP</span>
                <span className="text-amber-400">AI</span>
              </div>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your 24/7 AI receptionist that answers calls, books appointments, and handles payments.
            </p>
            <div className="flex gap-4 pt-2">
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4 text-amber-400">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/features" className="text-gray-400 hover:text-white transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-gray-400 hover:text-white transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/for-salon-owners" className="text-gray-400 hover:text-white transition-colors">
                  For Salon Owners
                </Link>
              </li>

            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold text-lg mb-4 text-amber-400">Services</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/credit-card-processing" className="text-gray-400 hover:text-white transition-colors">
                  Credit Card Processing
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/about-us" className="text-gray-400 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/24-7-ai-call-handling" className="text-gray-400 hover:text-white transition-colors">
                  24/7 AI Call Handling

                </Link>
              </li>
              <li className="text-gray-400 hover:text-white transition-colors">
                {/* <Link href="#" className="text-gray-400 hover:text-white transition-colors"> */}
                Smart Appointment Booking

                {/* </Link> */}
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-lg mb-4 text-amber-400">Contact Team</h3>
            <ul className="space-y-2">
              <li className="flex items-start gap-3 text-gray-400">
                <Phone className="w-4 h-4 mt-0.5" />
                <span>(555) 123-4567</span>
              </li>
              <li className="flex items-start gap-3 text-gray-400">
                <Mail className="w-4 h-4 mt-0.5" />
                <span>support@beautydrop.ai</span>
              </li>
              <li className="flex items-start gap-3 text-gray-400">
                <MapPin className="w-4 h-4 mt-0.5" />
                <span>123 AI Boulevard, Tech City, CA 94043</span>
              </li>
            </ul>
            <Button className="mt-4 w-full bg-amber-400 hover:bg-amber-500 text-gray-900 font-semibold">
              Contact Support
            </Button>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Beauty Drop AI. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link href="/cookies" className="hover:text-white transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
