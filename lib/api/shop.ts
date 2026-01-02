import type { ShopDashboardData, ShopFormData, ApiResponse, Shop } from '@/types/shop'

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || ''

export async function fetchShopDashboard(
    shopId: string,
    token: string
): Promise<ShopDashboardData | null> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/shops/${shopId}/dashboard/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        })

        if (!response.ok) {
            if (response.status === 404) {
                return null
            }
            throw new Error(`Failed to fetch dashboard: ${response.statusText}`)
        }

        const data: ShopDashboardData = await response.json()
        return data
    } catch (error) {
        throw error
    }
}

export async function fetchShop(
    shopId: string,
    token: string
): Promise<Shop | null> {
    try {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        }

        if (token) {
            headers['Authorization'] = `Bearer ${token}`
        }

        const response = await fetch(`${API_BASE_URL}/api/v1/shops/${shopId}/`, {
            method: 'GET',
            headers,
        })

        if (!response.ok) {
            if (response.status === 404) {
                return null
            }
            throw new Error(`Failed to fetch shop: ${response.statusText}`)
        }

        const data: Shop = await response.json()
        return data
    } catch (error) {
        throw error
    }
}

export async function createShop(
    formData: ShopFormData,
    token: string
): Promise<Shop> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/shops/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(formData),
        })

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || `Failed to create shop: ${response.statusText}`)
        }

        const data: ApiResponse<Shop> = await response.json()
        return data.data
    } catch (error) {
        throw error
    }
}

export async function updateShop(shopId: string, data: Partial<Shop>, token: string): Promise<Shop> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/shops/${shopId}/`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        })


        if (!response.ok) {
            throw new Error(`Failed to update shop: ${response.statusText}`)
        }

        return await response.json()
    } catch (error) {
        throw error
    }
}

export async function fetchMyShops(token: string): Promise<Shop[]> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/shops/my_shops/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        })

        if (!response.ok) {
            if (response.status === 404) {
                return []
            }
            throw new Error(`Failed to fetch shops: ${response.statusText}`)
        }

        const data: Shop[] = await response.json()
        return data
    } catch (error) {
        throw error
    }
}

export async function generateTimeSlots(
    shopId: string,
    startDate: string,
    endDate: string,
    token: string
): Promise<void> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/schedules/time-slots/generate/`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify([{
                shop_id: parseInt(shopId),
                start_date: startDate,
                end_date: endDate
            }]),
        })

        if (!response.ok) {
            throw new Error(`Failed to generate time slots: ${response.statusText}`)
        }
    } catch (error) {
        throw error
    }
}
export async function fetchPublicShops(): Promise<Shop[]> {
    try {
        const apiUrl = `${API_BASE_URL}/api/v1/shops/`
        console.log('[fetchPublicShops] Fetching from:', apiUrl)

        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })

        console.log('[fetchPublicShops] Response status:', response.status)

        if (!response.ok) {
            const errorText = await response.text()
            console.error('[fetchPublicShops] Error response:', errorText)
            throw new Error(`Failed to fetch shops: ${response.statusText}`)
        }

        const data = await response.json()
        console.log('[fetchPublicShops] Data received:', {
            isArray: Array.isArray(data),
            hasResults: !!data.results,
            hasData: !!data.data,
            count: data.count || data.length
        })

        if (Array.isArray(data)) {
            return data
        } else if (data.results && Array.isArray(data.results)) {
            return data.results
        } else if (data.data && Array.isArray(data.data)) {
            return data.data
        }

        console.warn('[fetchPublicShops] Unexpected data format:', data)
        return []
    } catch (error) {
        console.error('[fetchPublicShops] Exception:', error)
        throw error
    }
}

export async function fetchPublicShop(shopId: string): Promise<Shop | null> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/shops/${shopId}/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })

        if (!response.ok) {
            if (response.status === 404) {
                return null
            }
            throw new Error(`Failed to fetch shop: ${response.statusText}`)
        }

        const data: Shop = await response.json()
        return data
    } catch (error) {
        throw error
    }
}

export async function toggleShopActive(
    shopId: string,
    token: string
): Promise<Shop> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/shops/${shopId}/toggle_active/`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        })

        if (!response.ok) {
            throw new Error(`Failed to toggle shop status: ${response.statusText}`)
        }

        const data: Shop = await response.json()
        return data
    } catch (error) {
        throw error
    }
}

export async function deleteShop(shopId: string, token: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/v1/shops/${shopId}/`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    })

    if (!response.ok) {
        throw new Error('Failed to delete shop')
    }
}
