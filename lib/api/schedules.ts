import type { Schedule, CreateScheduleData, UpdateScheduleData, TimeSlotGenerateData, TimeSlot } from '@/types/schedule'

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || ''

export async function fetchShopSchedules(
    shopId: string,
    token: string
): Promise<Schedule[]> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/schedules/shop-schedules/`, {
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

        let schedules: Schedule[] = []

        if (Array.isArray(data)) {
            schedules = data
        } else if (data.data && Array.isArray(data.data)) {
            schedules = data.data
        } else if (data.results && Array.isArray(data.results)) {
            schedules = data.results
        } else {
            return []
        }

        return schedules.filter(schedule => schedule.shop === shopId)
    } catch (error) {
        throw error
    }
}

export async function fetchPublicShopSchedules(
    shopId: string
): Promise<Schedule[]> {
    try {
        const queryParams = new URLSearchParams({ shop_id: shopId })
        const response = await fetch(`${API_BASE_URL}/api/v1/schedules/shop-schedules/?${queryParams.toString()}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })

        if (!response.ok) {
            throw new Error(`Failed to fetch schedules: ${response.statusText}`)
        }

        const data = await response.json()

        let schedules: Schedule[] = []

        if (Array.isArray(data)) {
            schedules = data
        } else if (data.data && Array.isArray(data.data)) {
            schedules = data.data
        } else if (data.results && Array.isArray(data.results)) {
            schedules = data.results
        }

        return schedules
    } catch (error) {
        return []
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
        throw error
    }
}

export async function updateSchedule(
    scheduleId: string,
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
        throw error
    }
}

export async function deleteSchedule(
    scheduleId: string,
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
        throw error
    }
}

export async function generateTimeSlots(
    data: TimeSlotGenerateData,
    token: string
): Promise<{ message?: string }> {
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
            const errorMessage = errorData.error || errorData.detail || errorData.message || (errorData.non_field_errors && errorData.non_field_errors[0]) || `Failed to generate time slots: ${response.statusText}`
            throw new Error(errorMessage)
        }

        const responseData = await response.json()
        return { message: responseData.message || responseData.detail || 'Time slots generated successfully' }
    } catch (error) {
        throw error
    }
}

export async function fetchTimeSlots(
    shopId: string,
    token: string,
    params?: { start_date?: string; end_date?: string }
): Promise<TimeSlot[]> {
    try {
        const queryParams = new URLSearchParams({ shop_id: shopId })
        if (params?.start_date) queryParams.append('start_date', params.start_date)
        if (params?.end_date) queryParams.append('end_date', params.end_date)

        const response = await fetch(`${API_BASE_URL}/api/v1/schedules/time-slots/?${queryParams.toString()}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        })

        if (!response.ok) {
            throw new Error(`Failed to fetch time slots: ${response.statusText}`)
        }

        const data = await response.json()

        if (Array.isArray(data)) {
            return data
        } else if (data.results && Array.isArray(data.results)) {
            return data.results
        } else if (data.data && Array.isArray(data.data)) {
            return data.data
        }

        return []
    } catch (error) {
        throw error
    }
}

export async function checkTimeSlotAvailability(
    shopId: string,
    serviceId: string,
    date: string
): Promise<TimeSlot[]> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/schedules/time-slots/check_availability/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                shop_id: shopId,
                service_id: serviceId,
                date: date,
            }),
        })

        if (!response.ok) {
            throw new Error(`Failed to check availability: ${response.statusText}`)
        }

        const data = await response.json()

        if (Array.isArray(data)) {
            return data
        } else if (data.results && Array.isArray(data.results)) {
            return data.results
        } else if (data.data && Array.isArray(data.data)) {
            return data.data
        }

        return []
    } catch (error) {
        throw error
    }
}

export async function fetchPublicTimeSlots(
    shopId: string,
    date: string
): Promise<TimeSlot[]> {
    try {
        const queryParams = new URLSearchParams({
            shop_id: shopId,
            date: date,
            status: 'available'
        })

        const response = await fetch(`${API_BASE_URL}/api/v1/schedules/time-slots/?${queryParams.toString()}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })

        if (!response.ok) {
            throw new Error(`Failed to fetch time slots: ${response.statusText}`)
        }

        const data = await response.json()

        if (Array.isArray(data)) {
            return data
        } else if (data.results && Array.isArray(data.results)) {
            return data.results
        } else if (data.data && Array.isArray(data.data)) {
            return data.data
        }

        return []
    } catch (error) {
        throw error
    }
}
