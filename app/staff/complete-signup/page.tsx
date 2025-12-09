"use client"

import { SignUp } from "@clerk/nextjs"
import { useSearchParams } from "next/navigation"

export default function StaffCompleteSignupPage() {
    const searchParams = useSearchParams()


    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold text-gray-900">Complete Your Account Setup</h1>
                <p className="mt-2 text-gray-600">
                    Welcome to BeautyDrop! Please verify your information to join your team.
                </p>
            </div>

            <SignUp
                path="/staff/complete-signup"
                routing="path"
                signInUrl="/login"
                forceRedirectUrl="/staff-portal"
                unsafeMetadata={{ role: 'staff' }}
            />
        </div>
    )
}
