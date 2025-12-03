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
        console.error('Error fetching staff:', error)
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
        console.error('Error creating staff member:', error)
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
        console.error('Error updating staff member:', error)
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
            throw new Error(`Failed to delete staff member: ${response.statusText}`)
        }
    } catch (error) {
        console.error('Error deleting staff member:', error)
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
        console.error('Error assigning services:', error)
        throw error
    }
}

export async function removeService(
    staffId: string,
    serviceId: number,
    token: string
): Promise<void> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/staff/${staffId}/remove_service/`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ service_id: serviceId }),
        })

        if (!response.ok) {
            throw new Error(`Failed to remove service: ${response.statusText}`)
        }
    } catch (error) {
        console.error('Error removing service:', error)
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
        console.error('Error toggling availability:', error)
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
        console.error('Error fetching available staff:', error)
        throw error
    }
}
