import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Shop, ShopDashboardData } from '@/types/shop'
import type { Service } from '@/types/service'
import type { Schedule, Holiday } from '@/types/schedule'

interface ShopState {
    selectedShop: Shop | null
    dashboardData: ShopDashboardData | null
    services: Service[]
    schedules: Schedule[]
    holidays: Holiday[]
    setSelectedShop: (shop: Shop | null) => void
    setDashboardData: (data: ShopDashboardData | null) => void
    setShopData: (services: Service[], schedules: Schedule[], holidays: Holiday[]) => void
    clearShop: () => void
}

export const useShopStore = create<ShopState>()(
    persist(
        (set) => ({
            selectedShop: null,
            dashboardData: null,
            services: [],
            schedules: [],
            holidays: [],
            setSelectedShop: (shop) => set({ selectedShop: shop }),
            setDashboardData: (data) => set({ dashboardData: data }),
            setShopData: (services, schedules, holidays) => set({ services, schedules, holidays }),
            clearShop: () => set({ selectedShop: null, dashboardData: null, services: [], schedules: [], holidays: [] }),
        }),
        {
            name: 'shop-storage',
            partialize: (state) => ({ selectedShop: state.selectedShop }),
        }
    )
)
