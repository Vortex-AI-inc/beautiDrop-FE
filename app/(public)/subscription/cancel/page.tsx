'use client'

import { Suspense } from 'react'
import { XCircle, Loader2, ArrowLeft, CreditCard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

function CancelContent() {
    return (
        <main className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
            <div className="max-w-xl w-full">
                <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 text-center">
                    <div className="mb-8 flex justify-center">
                        <div className="relative">
                            <div className="absolute inset-0 bg-red-400 rounded-full blur-2xl opacity-30 animate-pulse"></div>
                            <div className="relative bg-red-100 rounded-full p-6">
                                <XCircle className="w-20 h-20 text-red-600" />
                            </div>
                        </div>
                    </div>

                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Payment Cancelled
                    </h1>
                    <p className="text-lg text-gray-600 mb-8">
                        Your payment was not processed and you have not been charged.
                    </p>

                    <div className="bg-orange-50 rounded-xl p-6 mb-8 text-left border border-orange-100">
                        <h2 className="text-md font-semibold text-gray-900 mb-2">Common reasons for cancellation:</h2>
                        <ul className="space-y-2 text-sm text-gray-600 list-disc ml-4">
                            <li>You clicked "Cancel" during the checkout process</li>
                            <li>The payment session expired</li>
                            <li>You declined the transaction</li>
                        </ul>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/pricing">
                            <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-lg shadow-lg">
                                <CreditCard className="w-4 h-4 mr-2" />
                                Try Again
                            </Button>
                        </Link>
                        <Link href="/">
                            <Button variant="outline" className="w-full sm:w-auto border-2 border-gray-200 hover:border-gray-300 font-semibold px-8 py-4 rounded-lg">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Home
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="mt-8 text-center text-gray-600">
                    <p className="text-sm">
                        Having trouble? <Link href="/contact" className="text-blue-600 hover:underline font-semibold">Contact our support team</Link>
                    </p>
                </div>
            </div>
        </main>
    )
}

export default function SubscriptionCancelPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-red-600" />
            </div>
        }>
            <CancelContent />
        </Suspense>
    )
}
