export interface Notification {
    id: string
    title: string
    message: string
    notification_type: string
    is_read: boolean
    created_at: string
    data?: Record<string, any>
}

export interface PaginatedNotifications {
    count: number
    next: string | null
    previous: string | null
    results: Notification[]
}

export interface NotificationPreferences {
    id: string
    email_booking_confirmation: boolean
    email_booking_cancellation: boolean
    email_booking_reschedule: boolean
    email_booking_reminder: boolean
    email_staff_assignment: boolean
    email_shop_holiday: boolean
    email_marketing: boolean
    push_enabled: boolean
    updated_at: string
}

export interface NotificationCount {
    total: number
    unread: number
}
