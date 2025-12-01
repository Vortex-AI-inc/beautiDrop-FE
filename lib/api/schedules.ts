import type { Schedule, CreateScheduleData, UpdateScheduleData, TimeSlotGenerateData } from '@/types/schedule'

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || ''

export async function fetchShopSchedules(
    shopId: string,
    token: string
): Promise<Schedule[]> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/schedules/shop-schedules/?shop_id=${shopId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        })

        if (!response.ok) {
            throw new Error(`Failed to fetch schedules: ${response.statusText}`)
        }

        const data = await response.json()

        if (Array.isArray(data)) {
            return data
        }

        if (data.data && Array.isArray(data.data)) {
            return data.data
        }

        if (data.results && Array.isArray(data.results)) {
            return data.results
        }

        console.warn('Unexpected API response format for schedules:', data)
        return []
    } catch (error) {
        console.error('Error fetching schedules:', error)
        throw error
    }
}

export async function createSchedule(
    data: CreateScheduleData,
    token: string
): Promise<Schedule> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/schedules/shop-schedules/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        })

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || `Failed to create schedule: ${response.statusText}`)
        }

        const responseData = await response.json()
        return responseData.data || responseData
    } catch (error) {
        console.error('Error creating schedule:', error)
        throw error
    }
}

export async function updateSchedule(
    scheduleId: number,
    data: Partial<CreateScheduleData>,
    token: string
): Promise<Schedule> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/schedules/shop-schedules/${scheduleId}/`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        })

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || `Failed to update schedule: ${response.statusText}`)
        }

        const responseData = await response.json()
        return responseData.data || responseData
    } catch (error) {
        console.error('Error updating schedule:', error)
        throw error
    }
}

export async function deleteSchedule(
    scheduleId: number,
    token: string
): Promise<void> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/schedules/shop-schedules/${scheduleId}/`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        })

        if (!response.ok) {
            throw new Error(`Failed to delete schedule: ${response.statusText}`)
        }
    } catch (error) {
        console.error('Error deleting schedule:', error)
        throw error
    }
}

export async function generateTimeSlots(
    data: TimeSlotGenerateData,
    token: string
): Promise<void> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/schedules/time-slots/generate/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        })

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || `Failed to generate time slots: ${response.statusText}`)
        }
    } catch (error) {
        console.error('Error generating time slots:', error)
        throw error
    }
}
