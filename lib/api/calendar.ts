import { CalendarStatus, ConnectCalendarResponse, SyncResponse, CalendarSettings } from '@/types/calendar'

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || ''

export async function connectGoogleCalendar(token: string): Promise<ConnectCalendarResponse> {
    const response = await fetch(`${API_BASE_URL}/api/v1/calendars/google/connect/`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    })

    if (!response.ok) {
        throw new Error('Failed to connect Google Calendar')
    }

    return await response.json()
}

export async function disconnectGoogleCalendar(token: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/v1/calendars/google/disconnect/`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    })

    if (!response.ok) {
        throw new Error('Failed to disconnect Google Calendar')
    }
}

export async function fetchCalendarStatus(token: string): Promise<CalendarStatus> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/calendars/status/`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        })

        if (!response.ok) {
            // If 404 or other error, return default unconnected status
            // The API doc implies it returns default values if no integration exists, but just in case
            if (response.status === 404) {
                return {
                    is_connected: false,
                    google_calendar_id: null,
                    is_sync_enabled: false,
                    last_sync_at: null
                }
            }
            throw new Error('Failed to fetch calendar status')
        }

        return await response.json()
    } catch (error) {
        console.error("Error fetching calendar status:", error)
        return {
            is_connected: false,
            google_calendar_id: null,
            is_sync_enabled: false,
            last_sync_at: null
        }
    }
}

export async function syncCalendar(token: string): Promise<SyncResponse> {
    const response = await fetch(`${API_BASE_URL}/api/v1/calendars/sync/`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    })

    if (!response.ok) {
        throw new Error('Failed to init sync')
    }

    // Status 202 is typical for async processing
    if (response.status === 202) {
        return await response.json()
    }

    return await response.json()
}

export async function updateCalendarSettings(settings: CalendarSettings, token: string): Promise<CalendarStatus> {
    const response = await fetch(`${API_BASE_URL}/api/v1/calendars/settings/`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings)
    })

    if (!response.ok) {
        throw new Error('Failed to update calendar settings')
    }

    return await response.json()
}
