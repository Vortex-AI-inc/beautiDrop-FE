"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight, Check } from "lucide-react"

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    salonName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 px-4">
      <div className="w-full max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Form Column */}
          <div className="space-y-8">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg" />
              <span className="font-heading font-bold text-lg text-primary">BeautyDrop AI</span>
            </Link>

            {/* Form Card */}
            <div className="bg-card text-card-foreground rounded-lg border border-border shadow-sm p-6 space-y-6">
              <div className="space-y-2">
                <h1 className="font-heading text-3xl font-bold tracking-tight">Create Your Account</h1>
                <p className="font-sans text-base leading-relaxed text-muted-foreground">
                  Get started with BeautyDrop AI in minutes
                </p>
              </div>

              {/* Social Signup */}
              <button className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-border rounded-lg hover:bg-muted transition-colors">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span className="font-medium">Sign up with Google</span>
              </button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-card text-muted-foreground">or</span>
                </div>
              </div>

              {/* Form */}
              <form className="space-y-4">
                <div>
                  <label htmlFor="salonName" className="block text-sm font-medium text-foreground mb-2">
                    Salon Name
                  </label>
                  <input
                    id="salonName"
                    name="salonName"
                    type="text"
                    value={formData.salonName}
                    onChange={handleChange}
                    placeholder="Your Salon Name"
                    className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@salon.com"
                    className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground mb-2">
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed w-full justify-center"
                >
                  Create Account
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Sign In Link */}
              <div className="text-center pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link href="/login" className="text-primary hover:underline font-medium">
                    Sign in
                  </Link>
                </p>
              </div>
            </div>

            {/* Footer Text */}
            <p className="text-center text-xs text-muted-foreground">
              By signing up, you agree to our{" "}
              <Link href="/terms" className="text-primary hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </Link>
            </p>
          </div>

          {/* Benefits Column */}
          <div className="hidden md:flex flex-col justify-center space-y-8">
            <div>
              <h2 className="font-heading text-3xl font-bold tracking-tight mb-4">Why Choose BeautyDrop AI?</h2>
              <p className="font-sans text-lg leading-relaxed text-muted-foreground">
                Join hundreds of salons already transforming their business
              </p>
            </div>

            <div className="space-y-6">
              {[
                {
                  title: "AI Booking",
                  description: "Never miss a customer call again with 24/7 AI assistance",
                },
                {
                  title: "Save Time",
                  description: "Eliminate hours of manual scheduling every week",
                },
                {
                  title: "Increase Revenue",
                  description: "Book 35% more appointments and reduce no-shows by 40%",
                },
                {
                  title: "Enterprise Security",
                  description: "HIPAA, SOC 2, and GDPR compliant data protection",
                },
                {
                  title: "24/7 Support",
                  description: "Get help when you need it with dedicated support",
                },
                {
                  title: "No Setup Fee",
                  description: "Start free for 14 days with no credit card required",
                },
              ].map((benefit, i) => (
                <div key={i} className="flex gap-4">
                  <Check className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-heading text-xl font-semibold text-foreground">{benefit.title}</h3>
                    <p className="font-sans text-sm leading-relaxed text-muted-foreground">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Testimonial */}
            <div className="bg-card text-card-foreground rounded-lg border border-border shadow-sm p-6 mt-8">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-accent text-lg">
                    ★
                  </span>
                ))}
              </div>
              <p className="italic text-muted-foreground mb-4">
                "This platform has been a game-changer for our salon. We've increased bookings significantly!"
              </p>
              <p className="font-semibold text-foreground">Sarah Chen</p>
              <p className="font-sans text-sm leading-relaxed text-muted-foreground">Owner, Glow Studio NYC</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
