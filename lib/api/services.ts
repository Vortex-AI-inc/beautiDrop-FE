import type { Service, CreateServiceData } from '@/types/service'

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || ''

export async function createService(
    data: CreateServiceData,
    token: string
): Promise<Service> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/services/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        })

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || `Failed to create service: ${response.statusText}`)
        }

        const responseData = await response.json()
        return responseData.data || responseData
    } catch (error) {
        console.error('Error creating service:', error)
        throw error
    }
}

export async function fetchServices(
    shopId: string,
    token: string
): Promise<Service[]> {
    try {
        // Assuming the endpoint to list services filters by shop_id via query param
        const response = await fetch(`${API_BASE_URL}/api/v1/services/?shop_id=${shopId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        })

        if (!response.ok) {
            throw new Error(`Failed to fetch services: ${response.statusText}`)
        }

        const data = await response.json()

        // Handle different response structures
        if (Array.isArray(data)) {
            return data
        }

        if (data.data && Array.isArray(data.data)) {
            return data.data
        }

        if (data.results && Array.isArray(data.results)) {
            return data.results
        }

        console.warn('Unexpected API response format for services:', data)
        return []
    } catch (error) {
        console.error('Error fetching services:', error)
        throw error
    }
}

export async function updateService(
    serviceId: number,
    data: Partial<CreateServiceData>,
    token: string
): Promise<Service> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/services/${serviceId}/`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        })

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || `Failed to update service: ${response.statusText}`)
        }

        const responseData = await response.json()
        return responseData.data || responseData
    } catch (error) {
        console.error('Error updating service:', error)
        throw error
    }
}

export async function toggleServiceActive(
    serviceId: number,
    token: string
): Promise<Service> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/services/${serviceId}/toggle_active/`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        })

        if (!response.ok) {
            throw new Error(`Failed to toggle service status: ${response.statusText}`)
        }

        const responseData = await response.json()
        return responseData.data || responseData
    } catch (error) {
        console.error('Error toggling service status:', error)
        throw error
    }
}

export async function deleteService(
    serviceId: number,
    token: string
): Promise<void> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/services/${serviceId}/`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        })

        if (!response.ok) {
            throw new Error(`Failed to delete service: ${response.statusText}`)
        }
    } catch (error) {
        console.error('Error deleting service:', error)
        throw error
    }
}
