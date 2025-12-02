export interface Schedule {
    id: string
    shop: string
    shop_name: string
    day_of_week: string
    start_time: string
    end_time: string
    slot_duration_minutes: number
    is_active: boolean
    created_at: string
    updated_at: string
}

export interface CreateScheduleData {
    shop_id: string
    day_of_week: string
    start_time: string
    end_time: string
    slot_duration_minutes?: number
    is_active: boolean
}

export interface UpdateScheduleData {
    day_of_week?: string
    start_time?: string
    end_time?: string
    slot_duration_minutes?: number
    is_active?: boolean
}

export interface TimeSlotGenerateData {
    shop_id: string
    start_date: string
    day_name: string
    start_time: string
    end_time: string
}

export interface TimeSlot {
    id: string
    shop: string
    date: string
    start_time: string
    end_time: string
    is_booked: boolean
    created_at: string
    updated_at: string
}
