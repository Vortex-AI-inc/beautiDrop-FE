"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-white/95 backdrop-blur">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-1 font-heading font-bold text-lg">
          <span className="text-gray-900">BEAUTY</span>
          <span className="text-gray-900">DROP</span>
          <span className="text-yellow-500 text-2xl font-bold">AI</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/features" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">
            Features
          </Link>
          <Link href="/pricing" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">
            Pricing
          </Link>
          <Link href="/for-salon-owners" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">
            For Salon Owners
          </Link>
        </div>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <Link href="/login" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">
            Sign In
          </Link>
          <Link
            href="/signup"
            className="inline-flex items-center justify-center px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Start Free Trial
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="max-w-7xl mx-auto px-4 py-4 space-y-4">
            <Link
              href="/features"
              className="block text-gray-600 hover:text-gray-900 transition-colors py-2 font-medium"
            >
              Features
            </Link>
            <Link
              href="/pricing"
              className="block text-gray-600 hover:text-gray-900 transition-colors py-2 font-medium"
            >
              Pricing
            </Link>
            <Link
              href="/for-salon-owners"
              className="block text-gray-600 hover:text-gray-900 transition-colors py-2 font-medium"
            >
              For Salon Owners
            </Link>
            <div className="flex flex-col gap-3 pt-4 border-t border-gray-200">
              <Link
                href="/login"
                className="text-center text-gray-600 hover:text-gray-900 transition-colors font-medium py-2"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="inline-flex items-center justify-center w-full px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Start Free Trial
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
