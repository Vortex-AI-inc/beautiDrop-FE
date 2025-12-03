import type { CustomerBooking, CreateBookingData, RescheduleBookingData, CancelBookingData } from '@/types/booking'

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || ''

export async function fetchMyBookings(token: string): Promise<CustomerBooking[]> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/bookings/my_bookings/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        })

        if (!response.ok) {
            throw new Error(`Failed to fetch bookings: ${response.statusText}`)
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
        console.error('Error fetching bookings:', error)
        throw error
    }
}

export async function fetchAllBookings(token: string): Promise<CustomerBooking[]> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/bookings/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        })

        if (!response.ok) {
            throw new Error(`Failed to fetch bookings: ${response.statusText}`)
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
        console.error('Error fetching bookings:', error)
        throw error
    }
}

export async function fetchShopBookings(
    shopId: string,
    token: string
): Promise<CustomerBooking[]> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/bookings/shop/${shopId}/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        })

        if (!response.ok) {
            throw new Error(`Failed to fetch shop bookings: ${response.statusText}`)
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
        console.error('Error fetching shop bookings:', error)
        throw error
    }
}

export async function createBooking(
    data: CreateBookingData,
    token: string
): Promise<CustomerBooking> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/bookings/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        })

        if (!response.ok) {
            const errorData = await response.json()
            const errorMessage = errorData.error || errorData.detail || errorData.message || `Failed to create booking: ${response.statusText}`
            throw new Error(errorMessage)
        }

        const responseData = await response.json()
        return responseData.data || responseData
    } catch (error) {
        console.error('Error creating booking:', error)
        throw error
    }
}

export async function fetchBookingDetails(
    bookingId: string,
    token: string
): Promise<CustomerBooking> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/bookings/${bookingId}/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        })

        if (!response.ok) {
            throw new Error(`Failed to fetch booking details: ${response.statusText}`)
        }

        const data = await response.json()
        return data.data || data
    } catch (error) {
        console.error('Error fetching booking details:', error)
        throw error
    }
}

export async function cancelBooking(
    bookingId: string,
    data: CancelBookingData,
    token: string
): Promise<void> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/bookings/${bookingId}/cancel/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        })

        if (!response.ok) {
            const errorData = await response.json()
            const errorMessage = errorData.error || errorData.detail || errorData.message || `Failed to cancel booking: ${response.statusText}`
            throw new Error(errorMessage)
        }
    } catch (error) {
        console.error('Error cancelling booking:', error)
        throw error
    }
}

export async function rescheduleBooking(
    bookingId: string,
    data: RescheduleBookingData,
    token: string
): Promise<CustomerBooking> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/bookings/${bookingId}/reschedule/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        })

        if (!response.ok) {
            const errorData = await response.json()
            const errorMessage = errorData.error || errorData.detail || errorData.message || `Failed to reschedule booking: ${response.statusText}`
            throw new Error(errorMessage)
        }

        const responseData = await response.json()
        return responseData.data || responseData
    } catch (error) {
        console.error('Error rescheduling booking:', error)
        throw error
    }
}
