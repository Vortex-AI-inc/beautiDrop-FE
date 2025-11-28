import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Shop, ShopDashboardData } from '@/types/shop'

interface ShopState {
    selectedShop: Shop | null
    dashboardData: ShopDashboardData | null
    setSelectedShop: (shop: Shop | null) => void
    setDashboardData: (data: ShopDashboardData | null) => void
    clearShop: () => void
}

export const useShopStore = create<ShopState>()(
    persist(
        (set) => ({
            selectedShop: null,
            dashboardData: null,
            setSelectedShop: (shop) => set({ selectedShop: shop }),
            setDashboardData: (data) => set({ dashboardData: data }),
            clearShop: () => set({ selectedShop: null, dashboardData: null }),
        }),
        {
            name: 'shop-storage',
            partialize: (state) => ({ selectedShop: state.selectedShop }), // Only persist selectedShop
        }
    )
)
