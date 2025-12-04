export interface SubscriptionPlan {
    id: string
    name: string
    stripe_price_id: string
    stripe_product_id: string
    amount: string
    billing_period: string
    description: string
    features: string[]
    is_active: boolean
    is_popular: boolean
    display_order: number
    created_at: string
    updated_at: string
}

export interface SubscriptionPlansResponse {
    count: number
    next: string | null
    previous: string | null
    results: SubscriptionPlan[]
}
