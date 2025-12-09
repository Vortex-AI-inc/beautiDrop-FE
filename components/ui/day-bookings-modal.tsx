"use client"

import { X, Calendar, Clock, Users, DollarSign, Mail } from "lucide-react"
import type { CustomerBooking } from "@/types/booking"
import { Button } from "./button"

interface DayBookingsModalProps {
    date: Date | null
    bookings: CustomerBooking[]
    isOpen: boolean
    onClose: () => void
    onBookingClick: (booking: CustomerBooking) => void
}

export function DayBookingsModal({
    date,
    bookings,
    isOpen,
    onClose,
    onBookingClick
}: DayBookingsModalProps) {
    if (!isOpen || !date) return null

    const formatTime = (datetime: string) => {
        const date = new Date(datetime)
        const hours = date.getHours()
        const minutes = date.getMinutes()
        const ampm = hours >= 12 ? 'PM' : 'AM'
        const hour12 = hours % 12 || 12
        const minutesStr = minutes.toString().padStart(2, '0')
        return `${hour12}:${minutesStr} ${ampm}`
    }

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'confirmed':
                return 'bg-green-100 text-green-700 border-green-200'
            case 'pending':
                return 'bg-yellow-100 text-yellow-700 border-yellow-200'
            case 'completed':
                return 'bg-blue-100 text-blue-700 border-blue-200'
            case 'cancelled':
                return 'bg-red-100 text-red-700 border-red-200'
            case 'no_show':
                return 'bg-gray-100 text-gray-700 border-gray-200'
            default:
                return 'bg-gray-100 text-gray-700 border-gray-200'
        }
    }

    const sortedBookings = [...bookings].sort((a, b) => {
        return new Date(a.booking_datetime).getTime() - new Date(b.booking_datetime).getTime()
    })

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[85vh] overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-5 relative">
                    <button
                        onClick={onClose}
                        className="absolute top-5 right-6 w-9 h-9 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all"
                    >
                        <X className="w-5 h-5" />
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                            <Calendar className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white">{formatDate(date)}</h2>
                            <p className="text-white/90 mt-1">
                                {bookings.length} {bookings.length === 1 ? 'booking' : 'bookings'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(85vh-120px)]">
                    {sortedBookings.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Calendar className="w-10 h-10 text-gray-400" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">No Bookings</h3>
                            <p className="text-gray-600">There are no bookings scheduled for this day.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {sortedBookings.map((booking) => (
                                <button
                                    key={booking.id}
                                    onClick={() => {
                                        onBookingClick(booking)
                                    }}
                                    className="w-full text-left bg-white border-2 border-gray-200 rounded-xl p-4 hover:border-blue-400 hover:shadow-md transition-all group"
                                >
                                    <div className="flex items-start gap-4">
                                        {/* Time */}
                                        <div className="flex-shrink-0">
                                            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex flex-col items-center justify-center text-white shadow-md">
                                                <Clock className="w-5 h-5 mb-1" />
                                                <span className="text-xs font-bold">{formatTime(booking.booking_datetime)}</span>
                                            </div>
                                        </div>

                                        {/* Booking Details */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-3 mb-2">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-400 rounded-lg flex items-center justify-center text-white font-bold shadow-sm">
                                                        {booking.customer_name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-gray-900 text-lg group-hover:text-blue-600 transition-colors">
                                                            {booking.customer_name}
                                                        </h3>
                                                        {booking.customer_email && (
                                                            <p className="text-xs text-gray-500 flex items-center gap-1">
                                                                <Mail className="w-3 h-3" />
                                                                {booking.customer_email}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                                <span className={`px-3 py-1 rounded-lg text-xs font-bold border-2 whitespace-nowrap ${getStatusColor(booking.status)}`}>
                                                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1).replace('_', ' ')}
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-2 gap-3 mt-3">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                                                        <Users className="w-4 h-4 text-purple-600" />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-gray-500">Service</p>
                                                        <p className="text-sm font-semibold text-gray-900">{booking.service_name}</p>
                                                    </div>
                                                </div>
                                                {booking.staff_member_name && (
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                                                            <Users className="w-4 h-4 text-indigo-600" />
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-gray-500">Staff</p>
                                                            <p className="text-sm font-semibold text-gray-900">{booking.staff_member_name}</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                                                <div className="flex items-center gap-2">
                                                    <DollarSign className="w-4 h-4 text-green-600" />
                                                    <span className="text-lg font-bold text-green-600">${booking.total_price}</span>
                                                </div>
                                                <span className="text-xs text-blue-600 font-medium group-hover:underline">
                                                    Click for details →
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
