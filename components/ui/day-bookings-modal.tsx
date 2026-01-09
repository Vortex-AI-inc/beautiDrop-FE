"use client"

import { X, Calendar, Clock, Users, DollarSign, Mail, ChevronRight } from "lucide-react"
import type { CustomerBooking } from "@/types/booking"

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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm transition-opacity animate-in fade-in-0">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[85vh] overflow-hidden border border-gray-200 animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 rounded-lg">
                            <Calendar className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">{formatDate(date)}</h2>
                            <p className="text-sm text-gray-500">
                                {bookings.length} {bookings.length === 1 ? 'booking' : 'bookings'}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-4 overflow-y-auto max-h-[calc(85vh-90px)]">
                    {sortedBookings.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                                <Calendar className="w-8 h-8 text-gray-300" />
                            </div>
                            <h3 className="text-sm font-semibold text-gray-900 mb-1">No Bookings</h3>
                            <p className="text-sm text-gray-500">There are no bookings scheduled for this day.</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {sortedBookings.map((booking) => (
                                <button
                                    key={booking.id}
                                    onClick={() => onBookingClick(booking)}
                                    className="w-full text-left bg-white border border-gray-200 rounded-lg p-3 hover:border-blue-300 hover:shadow-sm hover:bg-blue-50/30 transition-all group flex items-start gap-4"
                                >
                                    {/* Time Column */}
                                    <div className="flex flex-col items-center justify-center w-16 pt-1">
                                        <span className="text-sm font-bold text-gray-900">{formatTime(booking.booking_datetime).split(' ')[0]}</span>
                                        <span className="text-xs text-gray-500 uppercase">{formatTime(booking.booking_datetime).split(' ')[1]}</span>
                                    </div>

                                    {/* Info Column */}
                                    <div className="flex-1 min-w-0 border-l border-gray-100 pl-4">
                                        <div className="flex items-center justify-between mb-1">
                                            <h3 className="font-semibold text-gray-900 truncate pr-2 group-hover:text-blue-700 transition-colors">
                                                {booking.customer_name}
                                            </h3>
                                            <span className={`flex-shrink-0 px-2 py-0.5 rounded text-[10px] uppercase font-bold border ${getStatusColor(booking.status)}`}>
                                                {booking.status.replace('_', ' ')}
                                            </span>
                                        </div>

                                        <div className="text-sm text-gray-600 mb-1 truncate">
                                            {booking.item_name || booking.service_name || booking.deal_name}
                                        </div>

                                        <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                                            <div className="flex items-center gap-1">
                                                <Users className="w-3 h-3" />
                                                {booking.staff_member_name || 'Unassigned'}
                                            </div>
                                            <div className="flex items-center gap-1 font-medium text-green-700">
                                                <DollarSign className="w-3 h-3" />
                                                {booking.total_price}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Arrow */}
                                    <div className="flex items-center justify-center self-center text-gray-300 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all">
                                        <ChevronRight className="w-5 h-5" />
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
