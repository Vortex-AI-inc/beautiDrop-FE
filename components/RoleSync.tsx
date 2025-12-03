"use client"

import { useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { saveUserRole, clearUserRole, type UserRole } from '@/lib/utils/roleManager'


export default function RoleSync() {
    const { user, isSignedIn } = useUser()

    useEffect(() => {
        if (isSignedIn && user) {
            const role = user.unsafeMetadata?.role as UserRole | undefined

            if (role === 'client' || role === 'customer') {
                saveUserRole(role)
            } else {
                clearUserRole()
            }
        } else {
            clearUserRole()
        }
    }, [isSignedIn, user])

    return null
}
