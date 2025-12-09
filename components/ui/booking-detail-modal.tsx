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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 px-8 py-6 relative">
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all"
                    >
                        <X className="w-5 h-5" />
                    </button>
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-400 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                            {booking.customer_name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white">{booking.customer_name}</h2>
                            <p className="text-white/90 mt-1">Booking Details</p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-8 space-y-6">
                    {/* Status */}
                    <div className="flex items-center justify-between">
                        <span className="text-gray-600 font-medium">Status</span>
                        <span className={`px-4 py-2 rounded-xl text-sm font-bold border-2 ${getStatusColor(booking.status)}`}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1).replace('_', ' ')}
                        </span>
                    </div>

                    {/* Date & Time */}
                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 space-y-4">
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                <Calendar className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <div className="text-sm text-gray-600 font-medium mb-1">Date</div>
                                <div className="text-lg font-bold text-gray-900">{formatDate(booking.booking_datetime)}</div>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                <Clock className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                                <div className="text-sm text-gray-600 font-medium mb-1">Time</div>
                                <div className="text-lg font-bold text-gray-900">{formatTime(booking.booking_datetime)}</div>
                            </div>
                        </div>
                    </div>

                    {/* Service Details */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-pink-100 rounded-xl flex items-center justify-center">
                                <Tag className="w-5 h-5 text-pink-600" />
                            </div>
                            <div className="flex-1">
                                <div className="text-sm text-gray-600 font-medium">Service</div>
                                <div className="text-lg font-bold text-gray-900">{booking.service_name}</div>
                            </div>
                        </div>

                        {booking.staff_member_name && (
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                                    <Users className="w-5 h-5 text-indigo-600" />
                                </div>
                                <div className="flex-1">
                                    <div className="text-sm text-gray-600 font-medium">Staff Member</div>
                                    <div className="text-lg font-bold text-gray-900">{booking.staff_member_name}</div>
                                </div>
                            </div>
                        )}

                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                                <DollarSign className="w-5 h-5 text-green-600" />
                            </div>
                            <div className="flex-1">
                                <div className="text-sm text-gray-600 font-medium">Total Price</div>
                                <div className="text-2xl font-bold text-green-600">${booking.total_price}</div>
                            </div>
                        </div>
                    </div>

                    {/* Customer Contact */}
                    {booking.customer_email && (
                        <div className="border-t border-gray-200 pt-6 space-y-3">
                            <h3 className="font-bold text-gray-900 text-lg mb-4">Customer Contact</h3>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                                    <Mail className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <div className="text-sm text-gray-600">Email</div>
                                    <a href={`mailto:${booking.customer_email}`} className="text-blue-600 hover:underline font-medium">
                                        {booking.customer_email}
                                    </a>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="border-t border-gray-200 pt-6 flex gap-3">
                        {booking.status === 'pending' && onConfirm && (
                            <Button
                                onClick={() => onConfirm(booking.id)}
                                disabled={isActioning}
                                className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all"
                            >
                                {isActioning ? (
                                    <>
                                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                        Confirming...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle className="w-5 h-5 mr-2" />
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
                                        className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all"
                                    >
                                        {isActioning ? (
                                            <>
                                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                                Completing...
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle className="w-5 h-5 mr-2" />
                                                Mark Completed
                                            </>
                                        )}
                                    </Button>
                                )}
                                {onNoShow && (
                                    <Button
                                        onClick={() => onNoShow(booking.id)}
                                        disabled={isActioning}
                                        variant="outline"
                                        className="flex-1 border-2 border-red-200 text-red-600 hover:bg-red-50 font-bold py-3 rounded-xl transition-all"
                                    >
                                        {isActioning ? (
                                            <>
                                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                                Processing...
                                            </>
                                        ) : (
                                            <>
                                                <X className="w-5 h-5 mr-2" />
                                                Mark No-Show
                                            </>
                                        )}
                                    </Button>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
