"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

export default function SSOCallback() {
    const router = useRouter()

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            router.push('/auth-complete')
        }, 10000)

        return () => clearTimeout(timeoutId)
    }, [router])

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
            <div className="text-center">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
                <h2 className="text-xl font-bold text-gray-900 mb-2">Completing Sign In...</h2>
                <p className="text-gray-600">Please wait while we redirect you.</p>
            </div>
        </div>
    )
}
