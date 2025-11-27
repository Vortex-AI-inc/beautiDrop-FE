import Link from "next/link"
import { Mail, Phone, Facebook, Twitter, Linkedin, Instagram } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg" />
              <span className="font-heading font-bold text-lg text-primary">BeautyDrop AI</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              AI-powered solutions transforming beauty salons with intelligent automation and customer engagement.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-semibold text-foreground mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/features" className="text-muted-foreground hover:text-primary transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-muted-foreground hover:text-primary transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-heading font-semibold text-foreground mb-4">Services</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Voice Agents
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Appointment Booking
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Phone Automation
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Analytics
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading font-semibold text-foreground mb-4">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                <Mail className="w-4 h-4" />
                <span>support@beautydrop.ai</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                <Phone className="w-4 h-4" />
                <span>1-800-BEAUTY-AI</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-border pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
            <p className="text-sm text-muted-foreground">© 2025 BeautyDrop AI. All rights reserved.</p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <Link href="/terms" className="hover:text-primary transition-colors">
                Terms of Service
              </Link>
              <span className="text-border">|</span>
              <Link href="/privacy" className="hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <span className="text-border">|</span>
              <Link href="/cookies" className="hover:text-primary transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="flex items-center justify-center gap-6 py-4 border-t border-border">
            <div className="flex items-center gap-1 text-xs font-semibold text-muted-foreground">
              <span className="w-4 h-4 bg-primary rounded-full" />
              HIPAA
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold text-muted-foreground">
              <span className="w-4 h-4 bg-accent rounded-full" />
              SOC 2
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold text-muted-foreground">
              <span className="w-4 h-4 bg-secondary rounded-full" />
              GDPR
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold text-muted-foreground">
              <span className="w-4 h-4 bg-tertiary rounded-full" />
              SSL
            </div>
          </div>

          {/* Social Media */}
          <div className="flex items-center justify-center gap-6 pt-4">
            <Link
              href="#"
              className="p-2 text-muted-foreground hover:text-primary transition-colors hover:bg-muted-foreground/10 rounded-full"
            >
              <Facebook className="w-5 h-5" />
            </Link>
            <Link
              href="#"
              className="p-2 text-muted-foreground hover:text-primary transition-colors hover:bg-muted-foreground/10 rounded-full"
            >
              <Twitter className="w-5 h-5" />
            </Link>
            <Link
              href="#"
              className="p-2 text-muted-foreground hover:text-primary transition-colors hover:bg-muted-foreground/10 rounded-full"
            >
              <Linkedin className="w-5 h-5" />
            </Link>
            <Link
              href="#"
              className="p-2 text-muted-foreground hover:text-primary transition-colors hover:bg-muted-foreground/10 rounded-full"
            >
              <Instagram className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
