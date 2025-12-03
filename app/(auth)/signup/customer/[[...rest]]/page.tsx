"use client"

import { useEffect } from 'react'
import { useAuth, useUser, SignUp } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Star, Heart, Calendar, Clock } from "lucide-react"
import { getUserRole } from '@/lib/utils/roleManager'

export default function CustomerSignUpPage() {
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

            <div className="flex-grow py-12 px-4 sm:px-6 lg:px-8 min-h-[calc(100vh-12rem)]">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                        <div className="flex items-center justify-center">
                            <div className="w-full max-w-md">
                                <SignUp
                                    appearance={{
                                        elements: {
                                            formButtonPrimary:
                                                'bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg',
                                            card: 'bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 rounded-2xl',
                                            headerTitle: 'text-3xl font-bold text-gray-900',
                                            headerSubtitle: 'text-gray-500',
                                            socialButtonsBlockButton:
                                                'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 font-medium rounded-lg',
                                            formFieldInput:
                                                'border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500',
                                            footerActionLink: 'text-purple-600 hover:text-purple-500 font-medium',
                                        },
                                    }}
                                    routing="path"
                                    path="/signup/customer"
                                    signInUrl="/login"
                                    afterSignUpUrl="/customer-dashboard"
                                    unsafeMetadata={{ role: 'customer' }}
                                />
                            </div>
                        </div>

                        <div className="hidden lg:block space-y-8">
                            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8">
                                <div className="inline-block bg-purple-400 text-white px-4 py-1 rounded-full text-sm font-bold mb-6">
                                    ✓ For Customers
                                </div>
                                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                    Book Your Next <span className="text-purple-600">Beauty Experience</span>
                                </h2>
                                <p className="text-gray-600 mb-8">
                                    Join thousands of happy customers booking their favorite beauty services with ease.
                                </p>

                                <div className="space-y-6">
                                    {[
                                        { Icon: Calendar, title: "Easy Booking", desc: "Book appointments 24/7 with your favorite salons", color: "bg-purple-100" },
                                        { Icon: Clock, title: "Real-time Availability", desc: "See open slots instantly and book what fits your schedule", color: "bg-blue-100" },
                                        { Icon: Heart, title: "Personalized Care", desc: "Keep track of your favorite styles and preferences", color: "bg-pink-100" },
                                        { Icon: Star, title: "Verified Reviews", desc: "Read real reviews from other customers before you book", color: "bg-yellow-100" }
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


                                <div className="mt-8 bg-white rounded-xl p-6 shadow-sm">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                                            EM
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900">Emily Martinez</p>
                                            <p className="text-sm text-gray-500">Loyal Customer</p>
                                        </div>
                                    </div>
                                    <p className="text-gray-700 italic mb-3">
                                        "I love how easy it is to find and book appointments. No more phone tag!"
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
