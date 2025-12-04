'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { CheckCircle, Loader2, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

function SuccessContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [countdown, setCountdown] = useState(5)

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer)
                    router.push('/portal')
                    return 0
                }
                return prev - 1
            })
        }, 1000)

        return () => clearInterval(timer)
    }, [router])

    const sessionId = searchParams.get('session_id')

    return (
        <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full">
                <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 text-center">
                    <div className="mb-8 flex justify-center">
                        <div className="relative">
                            <div className="absolute inset-0 bg-green-400 rounded-full blur-2xl opacity-30 animate-pulse"></div>
                            <div className="relative bg-green-100 rounded-full p-6">
                                <CheckCircle className="w-20 h-20 text-green-600" />
                            </div>
                        </div>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Payment Successful! 🎉
                    </h1>
                    <p className="text-xl text-gray-600 mb-8">
                        Thank you for subscribing to Beauty Drop AI
                    </p>

                    <div className="bg-blue-50 rounded-xl p-6 mb-8 text-left">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">What's Next?</h2>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-3">
                                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                                <span className="text-gray-700">Your subscription is now active</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                                <span className="text-gray-700">You'll receive a confirmation email shortly</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                                <span className="text-gray-700">Access your dashboard to get started</span>
                            </li>
                        </ul>
                    </div>

                    {sessionId && (
                        <div className="mb-6 text-sm text-gray-500">
                            <p>Session ID: {sessionId}</p>
                        </div>
                    )}

                    <div className="mb-6 flex items-center justify-center gap-2 text-gray-600">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <p>Redirecting to your dashboard in {countdown} seconds...</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/portal">
                            <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-6 text-lg rounded-lg shadow-lg">
                                Go to Dashboard
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </Button>
                        </Link>
                        <Link href="/">
                            <Button variant="outline" className="w-full sm:w-auto border-2 border-gray-200 hover:border-blue-600 hover:text-blue-600 font-semibold px-8 py-6 text-lg rounded-lg">
                                Back to Home
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="mt-8 text-center text-gray-600">
                    <p className="text-sm">
                        Need help? <Link href="/contact" className="text-blue-600 hover:underline font-semibold">Contact our support team</Link>
                    </p>
                </div>
            </div>
        </main>
    )
}

export default function SubscriptionSuccessPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        }>
            <SuccessContent />
        </Suspense>
    )
}
