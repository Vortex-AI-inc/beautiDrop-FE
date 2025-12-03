"use client"

import { useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { saveUserRole, clearUserRole, type UserRole } from '@/lib/utils/roleManager'

/**
 * RoleSync Component
 * Automatically syncs user role from Clerk to localStorage
 * Should be placed in root layout
 */
export default function RoleSync() {
    const { user, isSignedIn } = useUser()

    useEffect(() => {
        if (isSignedIn && user) {
            // Get role from Clerk's unsafe_metadata
            const role = user.unsafeMetadata?.role as UserRole | undefined

            if (role === 'client' || role === 'customer') {
                saveUserRole(role)
                console.log('User role synced:', role)
            } else {
                console.warn('User has no valid role in metadata')
            }
        } else {
            // User signed out, clear role
            clearUserRole()
        }
    }, [isSignedIn, user])

    // This component doesn't render anything
    return null
}
