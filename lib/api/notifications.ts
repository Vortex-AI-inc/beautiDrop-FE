import { Notification, NotificationPreferences, PaginatedNotifications, NotificationCount } from '@/types/notification'

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || ''

export async function fetchNotifications(token: string, pageUrl?: string | null): Promise<PaginatedNotifications> {
    try {
        const url = pageUrl || `${API_BASE_URL}/api/v1/notifications/`
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        })

        if (!response.ok) {
            throw new Error(`Failed to fetch notifications: ${response.statusText}`)
        }

        return await response.json()
    } catch (error) {
        console.error("Error fetching notifications:", error)
        return { count: 0, next: null, previous: null, results: [] }
    }
}

export async function fetchNotificationCount(token: string): Promise<NotificationCount> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/notifications/count/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        })

        if (!response.ok) {
            throw new Error(`Failed to fetch notification count`)
        }

        return await response.json()
    } catch (error) {
        console.error("Error fetching notification count:", error)
        return { total: 0, unread: 0 }
    }
}

export async function deleteNotification(id: string, token: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/v1/notifications/${id}/`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    })

    if (!response.ok) {
        throw new Error('Failed to delete notification')
    }
}

export async function clearAllNotifications(token: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/v1/notifications/clear-all/`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    })

    if (!response.ok) {
        throw new Error('Failed to clear notifications')
    }
}

export async function markAllNotificationsAsRead(token: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/v1/notifications/mark-all-read/`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    })

    if (!response.ok) {
        throw new Error('Failed to mark all notifications as read')
    }
}

export async function markNotificationAsRead(id: string, token: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/v1/notifications/mark-read/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ ids: [id] })
    })

    if (!response.ok) {
        throw new Error('Failed to mark notification as read')
    }
}

export async function fetchNotificationPreferences(token: string): Promise<NotificationPreferences | null> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/notifications/preferences/`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        })

        if (!response.ok) return null
        return await response.json()
    } catch (error) {
        return null
    }
}

export async function updateNotificationPreferences(preferences: Partial<NotificationPreferences>, token: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/v1/notifications/preferences/`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(preferences)
    })

    if (!response.ok) {
        throw new Error('Failed to update preferences')
    }
}
