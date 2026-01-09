import type { SubscriptionPlansResponse, SubscriptionPlan } from '@/types/subscription'

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || ''


export async function fetchSubscriptionPlans(): Promise<SubscriptionPlan[]> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/subscriptions/plans/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })

        if (!response.ok) {
            throw new Error(`Failed to fetch subscription plans: ${response.statusText}`)
        }

        const data: SubscriptionPlansResponse = await response.json()

        return data.results.sort((a, b) => a.display_order - b.display_order)
    } catch (error) {
        throw error
    }
}


export async function createCheckoutSession(
    stripePriceId: string,
    getToken: () => Promise<string | null>
): Promise<string> {
    try {
        const token = await getToken()

        if (!token) {
            throw new Error('Authentication required')
        }

        const response = await fetch(`${API_BASE_URL}/api/v1/subscriptions/checkout/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                stripe_price_id: stripePriceId
            }),
        })

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            throw new Error(errorData.message || `Failed to create checkout session: ${response.statusText}`)
        }

        const data = await response.json()

        if (!data.checkout_url) {
            throw new Error('No checkout URL received from server')
        }

        return data.checkout_url
    } catch (error) {
        throw error
    }
}
