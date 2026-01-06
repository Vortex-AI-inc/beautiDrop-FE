import { Deal, CreateDealData, UpdateDealData } from '@/types/deal'

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || ''

export async function fetchShopDeals(
    shopId: string,
    token: string,
    options?: {
        isActive?: boolean
        search?: string
        page?: number
        pageSize?: number
    }
): Promise<Deal[]> {
    try {
        const params = new URLSearchParams()
        params.append('shop_id', shopId)

        if (options?.isActive !== undefined) {
            params.append('is_active', options.isActive.toString())
        }
        if (options?.search) {
            params.append('search', options.search)
        }
        if (options?.page) {
            params.append('page', options.page.toString())
        }
        if (options?.pageSize) {
            params.append('page_size', options.pageSize.toString())
        }

        const response = await fetch(`${API_BASE_URL}/api/v1/services/deals/?${params.toString()}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        })

        if (!response.ok) {
            if (response.status === 404) return []
            throw new Error(`Failed to fetch deals: ${response.statusText}`)
        }

        const data = await response.json()
        return Array.isArray(data) ? data : (data.results || data.data || [])
    } catch (error) {
        return []
    }
}

export async function getDeal(dealId: string, token?: string): Promise<Deal> {
    try {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        }

        if (token) {
            headers['Authorization'] = `Bearer ${token}`
        }

        const response = await fetch(`${API_BASE_URL}/api/v1/services/deals/${dealId}/`, {
            method: 'GET',
            headers,
        })

        if (!response.ok) {
            throw new Error(`Failed to fetch deal: ${response.statusText}`)
        }

        const data = await response.json()
        return data
    } catch (error) {
        throw error
    }
}

export async function createDeal(data: CreateDealData, token: string): Promise<Deal> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/services/deals/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        })

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || errorData.detail || `Failed to create deal: ${response.statusText}`)
        }

        const responseData = await response.json()
        return responseData.data || responseData
    } catch (error) {
        throw error
    }
}

export async function updateDeal(dealId: string, data: UpdateDealData, token: string): Promise<Deal> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/services/deals/${dealId}/`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        })

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || errorData.detail || `Failed to update deal: ${response.statusText}`)
        }

        const responseData = await response.json()
        return responseData.data || responseData
    } catch (error) {
        throw error
    }
}

export async function deleteDeal(dealId: string, token: string): Promise<void> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/services/deals/${dealId}/`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        })

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || errorData.detail || `Failed to delete deal: ${response.statusText}`)
        }
    } catch (error) {
        throw error
    }
}

export async function toggleDealActive(dealId: string, token: string): Promise<Deal> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/services/deals/${dealId}/toggle_active/`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        })

        if (!response.ok) {
            throw new Error(`Failed to toggle deal status: ${response.statusText}`)
        }

        const responseData = await response.json()
        return responseData.data || responseData
    } catch (error) {
        throw error
    }
}

export async function fetchPublicShopDeals(
    shopId: string,
    options?: {
        isActive?: boolean
        search?: string
    }
): Promise<Deal[]> {
    try {
        const params = new URLSearchParams()
        params.append('shop_id', shopId)

        if (options?.isActive !== undefined) {
            params.append('is_active', options.isActive.toString())
        }
        if (options?.search) {
            params.append('search', options.search)
        }

        const response = await fetch(`${API_BASE_URL}/api/v1/services/deals/?${params.toString()}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })

        if (!response.ok) {
            if (response.status === 404) return []
            throw new Error(`Failed to fetch deals: ${response.statusText}`)
        }

        const data = await response.json()
        return Array.isArray(data) ? data : (data.results || data.data || [])
    } catch (error) {
        return []
    }
}

export async function getDealAvailableSlots(
    dealId: string,
    date: string,
    token: string
): Promise<any> {
    try {
        const response = await fetch(
            `${API_BASE_URL}/api/v1/bookings/deal_slots/?deal_id=${dealId}&date=${date}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            }
        )

        if (!response.ok) {
            throw new Error(`Failed to fetch deal slots: ${response.statusText}`)
        }

        return await response.json()
    } catch (error) {
        throw error
    }
}

export async function bookDeal(
    data: {
        deal_id: string
        date: string
        start_time: string
        staff_member_id?: string
        notes?: string
    },
    token: string
): Promise<any> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/bookings/dynamic_book_deal/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        })

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || errorData.detail || `Failed to book deal: ${response.statusText}`)
        }

        return await response.json()
    } catch (error) {
        throw error
    }
}

export async function dynamicBookDeal(
    data: {
        service_id: string
        date: string
        start_time: string
        staff_member_id?: string
        notes?: string
    },
    token: string
): Promise<any> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/bookings/dynamic_book/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        })

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || errorData.detail || `Failed to create booking: ${response.statusText}`)
        }

        return await response.json()
    } catch (error) {
        throw error
    }
}
