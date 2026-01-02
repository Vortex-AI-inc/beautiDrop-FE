export interface Deal {
    id: string
    shop: string
    shop_name?: string
    name: string
    description: string
    price: string
    included_items: string[]
    image_url?: string
    is_active: boolean
    created_at?: string
    updated_at?: string
}

export interface CreateDealData {
    shop_id: string
    name: string
    description: string
    price: string
    included_items: string[]
    image_url?: string
    is_active: boolean
}

export interface UpdateDealData {
    name?: string
    description?: string
    price?: string
    included_items?: string[]
    image_url?: string
    is_active?: boolean
}
