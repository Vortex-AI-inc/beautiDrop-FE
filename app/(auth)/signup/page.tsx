"use client"

import { useEffect } from 'react'
import { useAuth, useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Building2, User } from "lucide-react"
import Link from "next/link"
import { getUserRole } from '@/lib/utils/roleManager'

export default function SignUpSelectionPage() {
  const { isSignedIn, isLoaded } = useAuth()
  const { user } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      const role = getUserRole()

      if (role === 'customer') {
        router.push('/customer-dashboard')
      } else if (role === 'client') {
        router.push('/portal')
      }
    }
  }, [isLoaded, isSignedIn, user, router])

  if (!isLoaded) {
    return null
  }

  if (isSignedIn) {
    return null
  }

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col pt-20">
      <Header />

      <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl w-full space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Join Beauty Drop AI
            </h1>
            <p className="text-xl text-gray-600">
              Choose how you want to use the platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            {/* Salon Owner Card */}
            <Link
              href="/signup/business"
              className="group relative bg-white rounded-2xl p-8 shadow-sm border-2 border-transparent hover:border-blue-500 hover:shadow-xl transition-all duration-300"
            >
              <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-xl">
                FOR BUSINESS
              </div>
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Building2 className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                I am a Salon Owner
              </h2>
              <p className="text-gray-600 mb-6">
                I want to automate my reception, manage bookings, and grow my beauty business with AI.
              </p>
              <ul className="space-y-3 text-sm text-gray-500 mb-8">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                  AI Receptionist
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                  Booking Management
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                  Business Analytics
                </li>
              </ul>
              <span className="inline-block w-full text-center py-3 px-6 bg-blue-50 text-blue-700 font-semibold rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                Create Business Account
              </span>
            </Link>

            {/* Customer Card */}
            <Link
              href="/signup/customer"
              className="group relative bg-white rounded-2xl p-8 shadow-sm border-2 border-transparent hover:border-purple-500 hover:shadow-xl transition-all duration-300"
            >
              <div className="absolute top-0 right-0 bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-xl">
                FOR CUSTOMERS
              </div>
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <User className="w-8 h-8 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                I am a Customer
              </h2>
              <p className="text-gray-600 mb-6">
                I want to book appointments, discover salons, and manage my beauty schedule.
              </p>
              <ul className="space-y-3 text-sm text-gray-500 mb-8">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                  Easy Online Booking
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                  Appointment Reminders
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                  Discover New Salons
                </li>
              </ul>
              <span className="inline-block w-full text-center py-3 px-6 bg-purple-50 text-purple-700 font-semibold rounded-lg group-hover:bg-purple-600 group-hover:text-white transition-colors">
                Create Customer Account
              </span>
            </Link>
          </div>

          <div className="text-center mt-8">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link href="/login" className="text-blue-600 font-semibold hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
