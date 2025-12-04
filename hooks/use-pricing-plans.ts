'use client'

import { useEffect } from 'react'
import { usePricingStore } from '@/lib/store/pricing-store'
import { fetchSubscriptionPlans } from '@/lib/api/subscriptions'

export function usePricingPlans() {
    const {
        plans,
        isLoading,
        error,
        lastFetched,
        setPlans,
        setLoading,
        setError,
        getPlanByName,
        getPopularPlan
    } = usePricingStore()

    useEffect(() => {
        const CACHE_DURATION = 5 * 60 * 1000
        const now = Date.now()

        const shouldFetch = !plans.length ||
            !lastFetched ||
            (now - lastFetched > CACHE_DURATION)

        if (shouldFetch && !isLoading) {
            loadPlans()
        }
    }, [])

    const loadPlans = async () => {
        setLoading(true)
        try {
            const fetchedPlans = await fetchSubscriptionPlans()
            setPlans(fetchedPlans)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch pricing plans')
        } finally {
            setLoading(false)
        }
    }

    const refetch = () => {
        loadPlans()
    }

    return {
        plans,
        isLoading,
        error,
        refetch,
        getPlanByName,
        getPopularPlan
    }
}
