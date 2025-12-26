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
    schedule: string
    shop_name: string
    start_datetime: string
    end_datetime: string
    duration_minutes: number
    status: string
    is_available: boolean
    created_at: string
    updated_at: string
    staff_member?: string
    staff_member_name?: string
    staff_name?: string
}

export interface Holiday {
    date: string
    name: string
    shop: string
    created_at: string
    updated_at: string
}
