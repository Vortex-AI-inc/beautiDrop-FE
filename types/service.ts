export interface Service {
    id: number
    shop_id: string
    name: string
    description: string
    price: string
    category?: string
    duration_minutes: number
    is_active: boolean
    staff?: { id: number; name: string }[]
    created_at?: string
    updated_at?: string
}

export interface CreateServiceData {
    shop_id: string
    name: string
    description: string
    price: string
    duration_minutes: number
    is_active: boolean
}

export interface UpdateServiceData {
    name?: string
    description?: string
    price?: string
    duration_minutes?: number
    is_active?: boolean
}
