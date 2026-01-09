import type { Service, CreateServiceData, PaginatedResponse } from '@/types/service'

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
        throw error
    }
}

export async function fetchServices(
    shopId: string,
    token: string,
    page: number = 1
): Promise<PaginatedResponse<Service>> {
    try {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        }

        if (token) {
            headers['Authorization'] = `Bearer ${token}`
        }

        const response = await fetch(`${API_BASE_URL}/api/v1/services/?shop_id=${shopId}&page=${page}`, {
            method: 'GET',
            headers,
        })

        if (!response.ok) {
            throw new Error(`Failed to fetch services: ${response.statusText}`)
        }

        const data = await response.json()

        if (Array.isArray(data)) {
            return {
                count: data.length,
                next: null,
                previous: null,
                results: data
            }
        }

        if (data.data && Array.isArray(data.data)) {
            return {
                count: data.data.length,
                next: null,
                previous: null,
                results: data.data
            }
        }

        if (data.results && Array.isArray(data.results)) {
            return data as PaginatedResponse<Service>
        }

        return {
            count: 0,
            next: null,
            previous: null,
            results: []
        }
    } catch (error) {
        throw error
    }
}

export async function updateService(
    serviceId: string,
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
        throw error
    }
}

export async function toggleServiceActive(
    serviceId: string,
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
        throw error
    }
}

export async function deleteService(
    serviceId: string,
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
            const errorData = await response.json()
            const errorMessage = (errorData.error && errorData.message)
                ? `${errorData.error}: ${errorData.message}`
                : (errorData.message || errorData.error || `Failed to delete service: ${response.statusText}`)
            throw new Error(errorMessage)
        }
    } catch (error) {
        throw error
    }
}



export async function fetchPublicServices(shopId: string, page: number = 1): Promise<PaginatedResponse<Service>> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/services/?shop_id=${shopId}&page=${page}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })

        if (!response.ok) {
            throw new Error(`Failed to fetch services: ${response.statusText}`)
        }

        const data = await response.json()

        if (Array.isArray(data)) {
            return {
                count: data.length,
                next: null,
                previous: null,
                results: data
            }
        }

        if (data.data && Array.isArray(data.data)) {
            return {
                count: data.data.length,
                next: null,
                previous: null,
                results: data.data
            }
        }

        if (data.results && Array.isArray(data.results)) {
            return data as PaginatedResponse<Service>
        }

        return {
            count: 0,
            next: null,
            previous: null,
            results: []
        }
    } catch (error) {
        throw error
    }
}
