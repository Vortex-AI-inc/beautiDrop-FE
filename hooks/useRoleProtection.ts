"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@clerk/nextjs'
import { getUserRole, type UserRole } from '@/lib/utils/roleManager'

interface UseRoleProtectionOptions {
    requiredRole: UserRole
    redirectTo?: string
}

/**
 * Hook to protect routes based on user role
 * Redirects unauthorized users to appropriate dashboard
 */
export function useRoleProtection({ requiredRole, redirectTo }: UseRoleProtectionOptions) {
    const router = useRouter()
    const { isSignedIn, isLoaded } = useAuth()
    const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null)

    useEffect(() => {
        // Wait for Clerk to load
        if (!isLoaded) return

        // If not signed in, redirect to sign-in
        if (!isSignedIn) {
            router.push('/login')
            return
        }

        // Check role from localStorage
        const userRole = getUserRole()

        if (!userRole) {
            // No role found, redirect to sign-in
            console.warn('No user role found in localStorage')
            router.push('/login')
            return
        }

        if (userRole !== requiredRole) {
            // User has wrong role, redirect
            const defaultRedirect = userRole === 'customer'
                ? '/customer-dashboard'
                : '/portal'

            router.push(redirectTo || defaultRedirect)
            setIsAuthorized(false)
            return
        }

        // User is authorized
        setIsAuthorized(true)
    }, [isLoaded, isSignedIn, requiredRole, redirectTo, router])

    return {
        isAuthorized,
        isLoading: !isLoaded || isAuthorized === null
    }
}
