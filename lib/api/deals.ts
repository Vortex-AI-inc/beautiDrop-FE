import { Deal, CreateDealData, UpdateDealData } from '@/types/deal'

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || ''

export async function fetchShopDeals(shopId: string, token: string): Promise<Deal[]> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/services/deals/?shop_id=${shopId}`, {
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

export async function fetchPublicShopDeals(shopId: string): Promise<Deal[]> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/services/deals/?shop_id=${shopId}`, {
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
