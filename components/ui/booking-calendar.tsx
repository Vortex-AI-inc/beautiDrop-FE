"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, Users } from "lucide-react"
import type { CustomerBooking } from "@/types/booking"
import { Button } from "./button"

interface BookingCalendarProps {
    bookings: CustomerBooking[]
    onBookingClick?: (booking: CustomerBooking) => void
    onDayClick?: (date: Date, bookings: CustomerBooking[]) => void
}

export function BookingCalendar({ bookings, onBookingClick, onDayClick }: BookingCalendarProps) {
    const [currentDate, setCurrentDate] = useState(new Date())

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ]

    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear()
        const month = date.getMonth()
        return new Date(year, month + 1, 0).getDate()
    }

    const getFirstDayOfMonth = (date: Date) => {
        const year = date.getFullYear()
        const month = date.getMonth()
        return new Date(year, month, 1).getDay()
    }

    const getBookingsForDate = (date: Date) => {
        return bookings.filter(booking => {
            const bookingDate = new Date(booking.booking_datetime)
            return (
                bookingDate.getDate() === date.getDate() &&
                bookingDate.getMonth() === date.getMonth() &&
                bookingDate.getFullYear() === date.getFullYear()
            )
        })
    }

    const previousMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
    }

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
    }

    const goToToday = () => {
        setCurrentDate(new Date())
    }

    const daysInMonth = getDaysInMonth(currentDate)
    const firstDayOfMonth = getFirstDayOfMonth(currentDate)
    const today = new Date()

    const calendarDays = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
        calendarDays.push(null)
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
        calendarDays.push(day)
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'confirmed':
                return 'bg-green-500'
            case 'pending':
                return 'bg-yellow-500'
            case 'completed':
                return 'bg-blue-500'
            case 'cancelled':
                return 'bg-red-500'
            case 'no_show':
                return 'bg-gray-500'
            default:
                return 'bg-gray-500'
        }
    }

    const formatTime = (datetime: string) => {
        const date = new Date(datetime)
        const hours = date.getHours()
        const minutes = date.getMinutes()
        const ampm = hours >= 12 ? 'PM' : 'AM'
        const hour12 = hours % 12 || 12
        const minutesStr = minutes.toString().padStart(2, '0')
        return `${hour12}:${minutesStr} ${ampm}`
    }

    return (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            {/* Calendar Header */}
            <div className="bg-white border-b border-gray-200 px-4 py-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <h2 className="text-xl font-semibold text-gray-900">
                            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                        </h2>
                    </div>
                    <div className="flex items-center gap-1">
                        <Button
                            onClick={goToToday}
                            variant="outline"
                            size="sm"
                            className="text-xs border-gray-300 text-gray-700 hover:bg-gray-100"
                        >
                            Today
                        </Button>
                        <Button
                            onClick={previousMonth}
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-gray-600 hover:bg-gray-100"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <Button
                            onClick={nextMonth}
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-gray-600 hover:bg-gray-100"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="p-3">
                {/* Days of Week Header */}
                <div className="grid grid-cols-7 gap-px mb-px">
                    {daysOfWeek.map(day => (
                        <div
                            key={day}
                            className="text-center font-medium text-gray-600 text-xs py-2 bg-gray-50"
                        >
                            {day}
                        </div>
                    ))}
                </div>

                {/* Calendar Days */}
                <div className="grid grid-cols-7 gap-px bg-gray-200">
                    {calendarDays.map((day, index) => {
                        if (day === null) {
                            return <div key={`empty-${index}`} className="bg-gray-50 h-28" />
                        }

                        const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
                        const dayBookings = getBookingsForDate(date)
                        const isToday =
                            date.getDate() === today.getDate() &&
                            date.getMonth() === today.getMonth() &&
                            date.getFullYear() === today.getFullYear()

                        return (
                            <button
                                key={day}
                                onClick={() => onDayClick?.(date, dayBookings)}
                                className={`bg-white h-28 p-1 transition-colors hover:bg-gray-50 cursor-pointer text-left ${isToday ? 'bg-blue-50' : ''
                                    }`}
                            >
                                <div className="flex flex-col h-full">
                                    <div className={`text-xs font-medium mb-0.5 ${isToday
                                        ? 'w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center'
                                        : 'text-gray-700 pl-1'
                                        }`}>
                                        {day}
                                    </div>

                                    {dayBookings.length > 0 && (
                                        <div className="flex-1 space-y-0.5 overflow-hidden">
                                            {dayBookings.slice(0, 2).map((booking) => (
                                                <div
                                                    key={booking.id}
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        onBookingClick?.(booking)
                                                    }}
                                                    className="w-full text-left group cursor-pointer"
                                                >
                                                    <div className={`${getStatusColor(booking.status)} rounded px-1 py-0.5 text-white text-[10px] hover:opacity-90 transition-opacity`}>
                                                        <div className="font-medium truncate">
                                                            {formatTime(booking.booking_datetime)}
                                                        </div>
                                                        <div className="truncate opacity-90">
                                                            {booking.customer_name}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                            {dayBookings.length > 2 && (
                                                <div className="text-[10px] text-gray-600 font-medium pl-1">
                                                    +{dayBookings.length - 2} more
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </button>
                        )
                    })}
                </div>

                {/* Legend */}
                <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="flex flex-wrap gap-3 justify-center">
                        <div className="flex items-center gap-1.5">
                            <div className="w-3 h-3 rounded bg-green-500"></div>
                            <span className="text-xs text-gray-600 font-medium">Confirmed</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-3 h-3 rounded bg-yellow-500"></div>
                            <span className="text-xs text-gray-600 font-medium">Pending</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-3 h-3 rounded bg-blue-500"></div>
                            <span className="text-xs text-gray-600 font-medium">Completed</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-3 h-3 rounded bg-red-500"></div>
                            <span className="text-xs text-gray-600 font-medium">Cancelled</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-3 h-3 rounded bg-gray-500"></div>
                            <span className="text-xs text-gray-600 font-medium">No-Show</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
