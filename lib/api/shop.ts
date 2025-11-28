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
        console.error('Error fetching shop dashboard:', error)
        throw error
    }
}

export async function createShop(
    formData: ShopFormData,
    token: string
): Promise<ShopDashboardData> {
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

        const data: ApiResponse<ShopDashboardData> = await response.json()
        return data.data
    } catch (error) {
        console.error('Error creating shop:', error)
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
        console.error('Error updating shop:', error)
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
            throw new Error(`Failed to fetch shops: ${response.statusText}`)
        }

        const data: Shop[] = await response.json()
        return data
    } catch (error) {
        console.error('Error fetching my shops:', error)
        throw error
    }
}
