/**
 * Role Management Utility
 * Manages user roles in localStorage for access control
 */

export type UserRole = 'client' | 'customer'

const ROLE_KEY = 'userRole'

/**
 * Save user role to localStorage
 */
export function saveUserRole(role: UserRole): void {
    try {
        localStorage.setItem(ROLE_KEY, role)
    } catch (error) {
        console.error('Failed to save user role:', error)
    }
}

/**
 * Get user role from localStorage
 */
export function getUserRole(): UserRole | null {
    try {
        const role = localStorage.getItem(ROLE_KEY)
        if (role === 'client' || role === 'customer') {
            return role as UserRole
        }
        return null
    } catch (error) {
        console.error('Failed to get user role:', error)
        return null
    }
}

/**
 * Clear user role from localStorage
 */
export function clearUserRole(): void {
    try {
        localStorage.removeItem(ROLE_KEY)
    } catch (error) {
        console.error('Failed to clear user role:', error)
    }
}

/**
 * Check if user is a customer
 */
export function isCustomer(): boolean {
    return getUserRole() === 'customer'
}

/**
 * Check if user is a client (business owner)
 */
export function isClient(): boolean {
    return getUserRole() === 'client'
}

/**
 * Check if user has a specific role
 */
export function hasRole(role: UserRole): boolean {
    return getUserRole() === role
}
