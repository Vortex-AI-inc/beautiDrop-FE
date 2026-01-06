"use client"

import { X, Calendar, Clock, User, Mail, DollarSign, Tag, Users, CheckCircle, Loader2 } from "lucide-react"
import type { CustomerBooking } from "@/types/booking"
import { Button } from "./button"

interface BookingDetailModalProps {
    booking: CustomerBooking | null
    isOpen: boolean
    onClose: () => void
    onConfirm?: (bookingId: string) => void
    onComplete?: (bookingId: string) => void
    onNoShow?: (bookingId: string) => void
    isActioning?: boolean
}

export function BookingDetailModal({
    booking,
    isOpen,
    onClose,
    onConfirm,
    onComplete,
    onNoShow,
    isActioning = false
}: BookingDetailModalProps) {
    if (!isOpen || !booking) return null

    const formatTime = (datetime: string) => {
        const date = new Date(datetime)
        const hours = date.getHours()
        const minutes = date.getMinutes()
        const ampm = hours >= 12 ? 'PM' : 'AM'
        const hour12 = hours % 12 || 12
        const minutesStr = minutes.toString().padStart(2, '0')
        return `${hour12}:${minutesStr} ${ampm}`
    }

    const formatDate = (datetime: string) => {
        return new Date(datetime).toLocaleDateString('en-US', {
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

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm sm:p-6 transition-opacity animate-in fade-in-0">
            <div className="bg-white rounded-xl shadow-lg max-w-lg w-full max-h-[90vh] overflow-y-auto border border-gray-200 animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">Booking Details</h2>
                        <p className="text-sm text-gray-500">View and manage this appointment</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Customer Info */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-lg">
                                {booking.customer_name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h3 className="font-medium text-gray-900 text-lg">{booking.customer_name}</h3>
                                {booking.customer_email && (
                                    <div className="flex items-center gap-1.5 text-sm text-gray-500">
                                        <Mail className="w-3.5 h-3.5" />
                                        <a href={`mailto:${booking.customer_email}`} className="hover:text-blue-600 hover:underline">
                                            {booking.customer_email}
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(booking.status)}`}>
                            {booking.status.replace('_', ' ').toUpperCase()}
                        </span>
                    </div>

                    <div className="border-t border-gray-100"></div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-3 bg-gray-50 rounded-lg space-y-1">
                            <div className="flex items-center gap-2 text-xs font-medium text-gray-500 uppercase">
                                <Calendar className="w-3.5 h-3.5" />
                                Date
                            </div>
                            <div className="text-sm font-semibold text-gray-900">{formatDate(booking.booking_datetime)}</div>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg space-y-1">
                            <div className="flex items-center gap-2 text-xs font-medium text-gray-500 uppercase">
                                <Clock className="w-3.5 h-3.5" />
                                Time
                            </div>
                            <div className="text-sm font-semibold text-gray-900">{formatTime(booking.booking_datetime)}</div>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg space-y-1 col-span-1 sm:col-span-2">
                            <div className="flex items-center gap-2 text-xs font-medium text-gray-500 uppercase">
                                <Tag className="w-3.5 h-3.5" />
                                Service
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold text-gray-900">{booking.item_name || booking.service_name || booking.deal_name}</span>
                                {booking.is_deal_booking && (
                                    <span className="px-1.5 py-0.5 bg-purple-100 text-purple-700 rounded text-[10px] font-bold">DEAL</span>
                                )}
                            </div>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg space-y-1 col-span-1 sm:col-span-2">
                            <div className="flex items-center gap-2 text-xs font-medium text-gray-500 uppercase">
                                <Users className="w-3.5 h-3.5" />
                                Staff Member
                            </div>
                            <div className="text-sm font-semibold text-gray-900">{booking.staff_member_name || 'Unassigned'}</div>
                        </div>
                    </div>

                    {/* Price */}
                    <div className="flex justify-between items-center p-4 bg-green-50 border border-green-100 rounded-xl">
                        <span className="text-sm font-medium text-green-800">Total Price</span>
                        <span className="text-2xl font-bold text-green-700">${booking.total_price}</span>
                    </div>

                </div>

                {/* Footer Actions */}
                <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row gap-3 rounded-b-xl">
                    {booking.status === 'pending' && onConfirm && (
                        <Button
                            onClick={() => onConfirm(booking.id)}
                            disabled={isActioning}
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-lg shadow-sm transition-all"
                        >
                            {isActioning ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Confirming...
                                </>
                            ) : (
                                <>
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Confirm Booking
                                </>
                            )}
                        </Button>
                    )}
                    {booking.status === 'confirmed' && (
                        <>
                            {onComplete && (
                                <Button
                                    onClick={() => onComplete(booking.id)}
                                    disabled={isActioning}
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg shadow-sm transition-all"
                                >
                                    {isActioning ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle className="w-4 h-4 mr-2" />
                                            Complete
                                        </>
                                    )}
                                </Button>
                            )}
                            {onNoShow && (
                                <Button
                                    onClick={() => onNoShow(booking.id)}
                                    disabled={isActioning}
                                    variant="outline"
                                    className="flex-1 border-red-200 text-red-600 hover:bg-red-50 font-medium py-2 rounded-lg transition-all"
                                >
                                    {isActioning ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <X className="w-4 h-4 mr-2" />
                                            No Show
                                        </>
                                    )}
                                </Button>
                            )}
                        </>
                    )}
                    {!['pending', 'confirmed'].includes(booking.status) && (
                        <Button
                            onClick={onClose}
                            variant="outline"
                            className="w-full sm:w-auto ml-auto"
                        >
                            Close
                        </Button>
                    )}
                </div>
            </div>
        </div>
    )
}
