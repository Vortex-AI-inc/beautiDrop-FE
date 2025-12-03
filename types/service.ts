export interface AssignedStaff {
    staff_id: string
    staff_name: string
    is_primary: boolean
}

export interface Service {
    id: string
    shop: string
    shop_name: string
    name: string
    description: string
    price: string
    category?: string
    duration_minutes: number
    is_active: boolean
    assigned_staff?: AssignedStaff[]
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
