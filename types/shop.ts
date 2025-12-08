export interface ShopFormData {
    name: string
    description: string
    address: string
    city: string
    state: string
    postal_code: string
    country: string
    phone: string
    email: string
    website: string
    cover_image_url: string
    is_active: boolean
    timezone: string
}

export interface ShopDashboardData {
    total_services: number
    total_bookings: number
    bookings_today: number
    bookings_this_week: number
    bookings_this_month: number
    pending_bookings: number
    confirmed_bookings: number
    total_revenue: number
    revenue_this_month: number
}

export interface Shop {
    id: string
    client: string
    client_name: string
    name: string
    description: string
    address: string
    city: string
    state: string
    postal_code: string
    country: string
    phone: string
    email: string
    website: string
    logo_url: string
    cover_image_url: string
    is_active: boolean
    services_count: number
    created_at: string
    updated_at: string
}

export interface ApiResponse<T> {
    data: T
    message?: string
    error?: string
}
