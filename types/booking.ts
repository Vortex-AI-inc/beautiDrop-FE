export interface CustomerBooking {
    id: string
    customer?: string
    customer_name: string
    customer_email?: string
    shop?: string
    shop_name: string
    service?: string
    service_name: string
    service_price?: number
    staff_member_name?: string
    time_slot?: string
    booking_datetime: string
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
    total_price: string | number
    payment_status?: string
    cancellation_reason?: string
    cancelled_at?: string
    created_at: string
    updated_at?: string
}

export interface CreateBookingData {
    service_id: string
    time_slot_id: string
    staff_member_id?: string
    notes?: string
}

export interface RescheduleBookingData {
    new_time_slot_id: string
}

export interface CancelBookingData {
    cancellation_reason?: string
}
