import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { SubscriptionPlan } from '@/types/subscription'

interface PricingState {
    plans: SubscriptionPlan[]
    isLoading: boolean
    error: string | null
    lastFetched: number | null
    setPlans: (plans: SubscriptionPlan[]) => void
    setLoading: (loading: boolean) => void
    setError: (error: string | null) => void
    getPlanByName: (name: string) => SubscriptionPlan | undefined
    getPopularPlan: () => SubscriptionPlan | undefined
    clearPlans: () => void
}

export const usePricingStore = create<PricingState>()(
    persist(
        (set, get) => ({
            plans: [],
            isLoading: false,
            error: null,
            lastFetched: null,

            setPlans: (plans) => set({
                plans,
                error: null,
                lastFetched: Date.now()
            }),

            setLoading: (loading) => set({ isLoading: loading }),

            setError: (error) => set({ error, isLoading: false }),

            getPlanByName: (name) => {
                const state = get()
                return state.plans.find(
                    plan => plan.name.toLowerCase() === name.toLowerCase()
                )
            },

            getPopularPlan: () => {
                const state = get()
                return state.plans.find(plan => plan.is_popular)
            },

            clearPlans: () => set({
                plans: [],
                error: null,
                lastFetched: null
            }),
        }),
        {
            name: 'pricing-storage',
            partialize: (state) => ({
                plans: state.plans,
                lastFetched: state.lastFetched
            }),
        }
    )
)
