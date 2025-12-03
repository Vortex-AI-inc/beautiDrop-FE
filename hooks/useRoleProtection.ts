"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@clerk/nextjs'
import { getUserRole, type UserRole } from '@/lib/utils/roleManager'

interface UseRoleProtectionOptions {
    requiredRole: UserRole
    redirectTo?: string
}


export function useRoleProtection({ requiredRole, redirectTo }: UseRoleProtectionOptions) {
    const router = useRouter()
    const { isSignedIn, isLoaded } = useAuth()
    const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null)

    useEffect(() => {
        if (!isLoaded) return

        if (!isSignedIn) {
            router.push('/login')
            return
        }

        const userRole = getUserRole()

        if (!userRole) {
            router.push('/login')
            return
        }

        if (userRole !== requiredRole) {
            const defaultRedirect = userRole === 'customer'
                ? '/customer-dashboard'
                : '/portal'

            router.push(redirectTo || defaultRedirect)
            setIsAuthorized(false)
            return
        }

        setIsAuthorized(true)
    }, [isLoaded, isSignedIn, requiredRole, redirectTo, router])

    return {
        isAuthorized,
        isLoading: !isLoaded || isAuthorized === null
    }
}
