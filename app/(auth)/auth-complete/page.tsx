"use client"

import { useEffect } from 'react'
import { useAuth, useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"

export default function AuthCompletePage() {
  const { isSignedIn, isLoaded } = useAuth()
  const { user } = useUser()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    if (!isLoaded) return

    if (!isSignedIn) {
      router.push('/login')
      return
    }

    if (user) {
      const role = user.unsafeMetadata?.role as string | undefined

      if (!role) {
        toast({
          title: "Please Sign Up First",
          description: "You need to complete the signup process to access your account.",
          variant: "destructive"
        })

        router.push('/signup')
      } else {
        if (role === 'customer') {
          router.push('/customer-dashboard')
        } else if (role === 'client') {
          router.push('/portal')
        }
        else if (role === 'staff') {
          router.push('/staff-portal')
        } else {
          router.push('/signup')
        }
      }
    }
  }, [isLoaded, isSignedIn, user, router, toast])

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
