"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X, Rocket, UserCircle } from "lucide-react"
import { useState } from "react"
import { Logo } from "@/components/ui/logo"
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Logo variant="stacked" size="md" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/features" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
              Features
            </Link>
            <Link href="/pricing" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
              Pricing
            </Link>
            <Link href="/for-salon-owners" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
              For Salon Owners
            </Link>

          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            <SignedOut>
              <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
                Sign in
              </Link>
              <Link href="/signup">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 rounded-lg">
                  <Rocket className="w-4 h-4 mr-2" />
                  Start Free Trial
                </Button>
              </Link>
            </SignedOut>
            <SignedIn>
              <Link href="/portal">
                <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50 font-medium px-4 rounded-lg flex items-center gap-2">
                  <UserCircle className="w-4 h-4" />
                  Customer Portal
                </Button>
              </Link>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-10 h-10"
                  }
                }}
              />
            </SignedIn>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-blue-600 transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <nav className="flex flex-col space-y-4">
              <Link
                href="/features"
                className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Features
              </Link>
              <Link
                href="/pricing"
                className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Pricing
              </Link>
              <Link
                href="/for-salon-owners"
                className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                For Salon Owners
              </Link>

              <SignedOut>
                <Link
                  href="/login"
                  className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign in
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 rounded-lg w-full">
                    Start Free Trial
                  </Button>
                </Link>
              </SignedOut>
              <SignedIn>
                <Link
                  href="/portal"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Button variant="outline" className="w-full border-blue-600 text-blue-600 hover:bg-blue-50 font-medium px-4 rounded-lg flex items-center justify-center gap-2">
                    <UserCircle className="w-4 h-4" />
                    Customer Portal
                  </Button>
                </Link>
                <div className="py-2">
                  <UserButton
                    appearance={{
                      elements: {
                        avatarBox: "w-10 h-10"
                      }
                    }}
                  />
                </div>
              </SignedIn>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
