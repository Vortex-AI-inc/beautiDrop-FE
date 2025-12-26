import type { StaffMember, CreateStaffData, UpdateStaffData, AssignServicesData } from '@/types/staff'

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || ''

export async function fetchShopStaff(
    shopId: string,
    token: string
): Promise<StaffMember[]> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/staff/?shop_id=${shopId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        })

        if (!response.ok) {
            throw new Error(`Failed to fetch staff: ${response.statusText}`)
        }

        const data = await response.json()

        if (Array.isArray(data)) {
            return data
        } else if (data.results && Array.isArray(data.results)) {
            return data.results
        } else if (data.data && Array.isArray(data.data)) {
            return data.data
        }

        return []
    } catch (error) {
        throw error
    }
}

export async function createStaff(
    data: CreateStaffData,
    token: string
): Promise<StaffMember> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/staff/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        })

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || `Failed to create staff member: ${response.statusText}`)
        }

        const responseData = await response.json()
        return responseData.data || responseData
    } catch (error) {
        throw error
    }
}

export async function updateStaff(
    staffId: string,
    data: UpdateStaffData,
    token: string
): Promise<StaffMember> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/staff/${staffId}/`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        })

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || `Failed to update staff member: ${response.statusText}`)
        }

        const responseData = await response.json()
        return responseData.data || responseData
    } catch (error) {
        throw error
    }
}

export async function deleteStaff(
    staffId: string,
    token: string
): Promise<void> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/staff/${staffId}/`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        })

        if (!response.ok) {
            const errorData = await response.json()
            const errorMessage = (errorData.error && errorData.message)
                ? `${errorData.error}: ${errorData.message}`
                : (errorData.message || errorData.error || `Failed to delete staff member: ${response.statusText}`)
            throw new Error(errorMessage)
        }
    } catch (error) {
        throw error
    }
}

export async function assignServices(
    staffId: string,
    data: AssignServicesData,
    token: string
): Promise<void> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/staff/${staffId}/assign_services/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        })

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || `Failed to assign services: ${response.statusText}`)
        }
    } catch (error) {
        throw error
    }
}

export async function removeService(
    staffId: string,
    serviceId: string,
    token: string
): Promise<void> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/staff/${staffId}/remove_service/?service_id=${serviceId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        })

        if (!response.ok) {
            throw new Error(`Failed to remove service: ${response.statusText}`)
        }
    } catch (error) {
        throw error
    }
}

export async function toggleAvailability(
    staffId: string,
    token: string
): Promise<StaffMember> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/staff/${staffId}/toggle_availability/`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        })

        if (!response.ok) {
            throw new Error(`Failed to toggle availability: ${response.statusText}`)
        }

        const responseData = await response.json()
        return responseData.data || responseData
    } catch (error) {
        throw error
    }
}

export async function fetchAvailableStaffForService(
    serviceId: string,
    shopId: string
): Promise<StaffMember[]> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/staff/available_for_service/?service_id=${serviceId}&shop_id=${shopId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })

        if (!response.ok) {
            throw new Error(`Failed to fetch available staff: ${response.statusText}`)
        }

        const data = await response.json()

        if (Array.isArray(data)) {
            return data
        } else if (data.results && Array.isArray(data.results)) {
            return data.results
        } else if (data.data && Array.isArray(data.data)) {
            return data.data
        }

        return []
    } catch (error) {
        throw error
    }
}

export async function resendInvite(
    staffId: string,
    email: string,
    token: string
): Promise<void> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/staff/${staffId}/resend_invite/?email=${encodeURIComponent(email)}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        })

        if (!response.ok) {
            throw new Error(`Failed to resend invite: ${response.statusText}`)
        }
    } catch (error) {
        throw error
    }
}


export async function fetchMyServices(
    token: string,
    params?: {
        page?: number
        page_size?: number
        search?: string
    }
): Promise<any> {
    try {
        const queryParams = new URLSearchParams()
        if (params?.page) queryParams.append('page', params.page.toString())
        if (params?.page_size) queryParams.append('page_size', params.page_size.toString())
        if (params?.search) queryParams.append('search', params.search)

        const queryString = queryParams.toString()
        const url = `${API_BASE_URL}/api/v1/staff/dashboard/my-services/${queryString ? `?${queryString}` : ''}`

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        })

        if (!response.ok) {
            if (response.status === 404) {
                return []
            }
            throw new Error(`Failed to fetch my services: ${response.statusText}`)
        }

        const data = await response.json()

        if (Array.isArray(data)) return data
        if (data.results && Array.isArray(data.results)) return data.results
        if (data.data && Array.isArray(data.data)) return data.data

        return []
    } catch (error) {
        throw error
    }
}

export async function fetchMyBookings(
    token: string,
    params?: {
        page?: number
        page_size?: number
        search?: string
        ordering?: string
    }
): Promise<any> {
    try {
        const queryParams = new URLSearchParams()
        if (params?.page) queryParams.append('page', params.page.toString())
        if (params?.page_size) queryParams.append('page_size', params.page_size.toString())
        if (params?.search) queryParams.append('search', params.search)
        if (params?.ordering) queryParams.append('ordering', params.ordering)

        const queryString = queryParams.toString()
        const url = `${API_BASE_URL}/api/v1/staff/dashboard/my-bookings/${queryString ? `?${queryString}` : ''}`

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        })

        if (!response.ok) {
            if (response.status === 404) {
                return []
            }
            throw new Error(`Failed to fetch my bookings: ${response.statusText}`)
        }

        const data = await response.json()

        if (Array.isArray(data)) return data
        if (data.results && Array.isArray(data.results)) return data.results
        if (data.data && Array.isArray(data.data)) return data.data

        return []
    } catch (error) {
        throw error
    }
}
