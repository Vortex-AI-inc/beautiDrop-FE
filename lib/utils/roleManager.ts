
export type UserRole = 'client' | 'customer'

const ROLE_KEY = 'userRole'

export function saveUserRole(role: UserRole): void {
    try {
        localStorage.setItem(ROLE_KEY, role)
    } catch (error) {
    }
}

export function getUserRole(): UserRole | null {
    try {
        const role = localStorage.getItem(ROLE_KEY)
        if (role === 'client' || role === 'customer') {
            return role as UserRole
        }
        return null
    } catch (error) {
        return null
    }
}

export function clearUserRole(): void {
    try {
        localStorage.removeItem(ROLE_KEY)
    } catch (error) {
    }
}


export function isCustomer(): boolean {
    return getUserRole() === 'customer'
}


export function isClient(): boolean {
    return getUserRole() === 'client'
}


export function hasRole(role: UserRole): boolean {
    return getUserRole() === role
}
