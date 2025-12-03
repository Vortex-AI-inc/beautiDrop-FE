export interface AssignedService {
    id: string
    service_id: string
    service_name: string
    service_price: string
    is_primary: boolean
}

export interface StaffMember {
    id: string
    shop: string
    shop_name: string
    name: string
    email?: string
    phone?: string
    bio?: string
    profile_image_url?: string
    is_active: boolean
    assigned_services: AssignedService[]
    total_bookings?: number
    created_at: string
    updated_at: string
}

export interface CreateStaffData {
    shop_id: string
    name: string
    email?: string
    phone?: string
    bio?: string
    profile_image_url?: string
    is_active?: boolean
}

export interface UpdateStaffData {
    name?: string
    email?: string
    phone?: string
    bio?: string
    profile_image_url?: string
    is_active?: boolean
}

export interface AssignServicesData {
    service_ids: number[]
}
