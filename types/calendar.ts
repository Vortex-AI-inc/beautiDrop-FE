export interface CalendarStatus {
    is_connected: boolean
    google_calendar_id: string | null
    is_sync_enabled: boolean
    last_sync_at: string | null
}

export interface ConnectCalendarResponse {
    is_connected: boolean
    google_calendar_id: string
    is_sync_enabled: boolean
    last_sync_at: string
}

export interface SyncResponse {
    message: string
}

export interface CalendarSettings {
    is_sync_enabled: boolean
    google_calendar_id?: string
}
