"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Calendar, Loader2, Clock, TrendingUp, Users, CheckCircle, XCircle, AlertCircle, MoreVertical, Check, X, CalendarDays, List } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@clerk/nextjs"
import { fetchShopBookings, fetchBookingStats, completeBooking, confirmBooking, markBookingNoShow, type BookingStats } from "@/lib/api/bookings"
import type { CustomerBooking } from "@/types/booking"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { GoogleCalendarConnect } from "@/components/calendar/google-calendar-connect"
import { BookingCalendar } from "@/components/ui/booking-calendar"
import { BookingDetailModal } from "@/components/ui/booking-detail-modal"
import { DayBookingsModal } from "@/components/ui/day-bookings-modal"

export default function SchedulingPage() {
    const params = useParams()
    const shopId = params.shopId as string
    const { toast } = useToast()
    const { getToken } = useAuth()

    const [bookings, setBookings] = useState<CustomerBooking[]>([])
    const [stats, setStats] = useState<BookingStats | null>(null)
    const [isLoadingBookings, setIsLoadingBookings] = useState(true)
    const [isLoadingStats, setIsLoadingStats] = useState(true)
    const [actioningBookingId, setActioningBookingId] = useState<string | null>(null)
    const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar')
    const [selectedBooking, setSelectedBooking] = useState<CustomerBooking | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedDate, setSelectedDate] = useState<Date | null>(null)
    const [selectedDayBookings, setSelectedDayBookings] = useState<CustomerBooking[]>([])
    const [isDayModalOpen, setIsDayModalOpen] = useState(false)

    useEffect(() => {
        loadData()
    }, [shopId])

    const loadData = async () => {
        await Promise.all([loadBookings(), loadStats()])
    }

    const loadBookings = async () => {
        try {
            setIsLoadingBookings(true)
            const token = await getToken()
            if (!token) return

            const bookingsData = await fetchShopBookings(shopId, token)
            setBookings(bookingsData)

        } catch (error) {
        } finally {
            setIsLoadingBookings(false)
        }
    }

    const loadStats = async () => {
        try {
            setIsLoadingStats(true)
            const token = await getToken()
            if (!token) return

            const statsData = await fetchBookingStats(shopId, token)
            setStats(statsData)

        } catch (error) {
        } finally {
            setIsLoadingStats(false)
        }
    }

    const handleConfirmBooking = async (bookingId: string) => {
        try {
            setActioningBookingId(bookingId)
            const token = await getToken()
            if (!token) return

            await confirmBooking(bookingId, token)

            toast({
                title: "Booking Confirmed",
                description: "The booking has been confirmed successfully.",
            })

            await loadData()
            setIsModalOpen(false)
            setSelectedBooking(null)
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to confirm booking.",
                variant: "destructive"
            })
        } finally {
            setActioningBookingId(null)
        }
    }

    const handleCompleteBooking = async (bookingId: string) => {
        try {
            setActioningBookingId(bookingId)
            const token = await getToken()
            if (!token) return

            await completeBooking(bookingId, token)

            toast({
                title: "Booking Completed",
                description: "The booking has been marked as completed.",
            })

            await loadData()
            setIsModalOpen(false)
            setSelectedBooking(null)
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to complete booking.",
                variant: "destructive"
            })
        } finally {
            setActioningBookingId(null)
        }
    }

    const handleMarkNoShow = async (bookingId: string) => {
        try {
            setActioningBookingId(bookingId)
            const token = await getToken()
            if (!token) return

            await markBookingNoShow(bookingId, token)

            toast({
                title: "Marked as No-Show",
                description: "The booking has been marked as no-show.",
            })

            await loadData()
            setIsModalOpen(false)
            setSelectedBooking(null)
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to mark as no-show.",
                variant: "destructive"
            })
        } finally {
            setActioningBookingId(null)
        }
    }

    const handleBookingClick = (booking: CustomerBooking) => {
        setSelectedBooking(booking)
        setIsModalOpen(true)
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
        setSelectedBooking(null)
    }

    const handleDayClick = (date: Date, dayBookings: CustomerBooking[]) => {
        setSelectedDate(date)
        setSelectedDayBookings(dayBookings)
        setIsDayModalOpen(true)
    }

    const handleCloseDayModal = () => {
        setIsDayModalOpen(false)
        setSelectedDate(null)
        setSelectedDayBookings([])
        setIsModalOpen(false)
        setSelectedBooking(null)
    }

    const formatTime = (datetime: string) => {
        if (!datetime) return ''
        const date = new Date(datetime)
        const hours = date.getHours()
        const minutes = date.getMinutes()
        const ampm = hours >= 12 ? 'PM' : 'AM'
        const hour12 = hours % 12 || 12
        const minutesStr = minutes.toString().padStart(2, '0')
        return `${hour12}:${minutesStr} ${ampm}`
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
        <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30">
            <Header />

            <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <Link
                        href={`/portal/${shopId}`}
                        className="mb-6 text-sm text-gray-500 hover:text-gray-900 flex items-center gap-1 inline-flex transition-colors"
                    >
                        ← Back to Dashboard
                    </Link>

                    <div className="space-y-8">
                        {/* Header */}
                        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"></div>
                            <div className="relative">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                                        <Calendar className="w-7 h-7 text-white" />
                                    </div>
                                    <div>
                                        <h1 className="text-4xl font-bold text-gray-900">Booking Management</h1>
                                        <p className="text-gray-600 text-lg mt-1">
                                            View and manage all your salon bookings
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>


                        {isLoadingStats ? (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-md">
                                        <Loader2 className="w-8 h-8 text-gray-300 animate-spin mx-auto" />
                                    </div>
                                ))}
                            </div>
                        ) : stats && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Total Bookings */}
                                <div className="group bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl p-8 text-white shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                                    <div className="relative">
                                        <div className="flex items-center justify-between mb-6">
                                            <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <Calendar className="w-7 h-7" />
                                            </div>
                                            <TrendingUp className="w-6 h-6 opacity-60" />
                                        </div>
                                        <p className="text-white/90 text-sm font-semibold mb-2 uppercase tracking-wide">Total Bookings</p>
                                        <p className="text-5xl font-bold">{stats.total_bookings || 0}</p>
                                    </div>
                                </div>

                                {/* Upcoming */}
                                <div className="group bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl p-8 text-white shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                                    <div className="relative">
                                        <div className="flex items-center justify-between mb-6">
                                            <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <Clock className="w-7 h-7" />
                                            </div>
                                        </div>
                                        <p className="text-white/90 text-sm font-semibold mb-2 uppercase tracking-wide">Upcoming</p>
                                        <p className="text-5xl font-bold">{stats.upcoming_bookings || 0}</p>
                                    </div>
                                </div>

                                {/* Completed */}
                                <div className="group bg-gradient-to-br from-green-500 to-green-600 rounded-3xl p-8 text-white shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                                    <div className="relative">
                                        <div className="flex items-center justify-between mb-6">
                                            <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <CheckCircle className="w-7 h-7" />
                                            </div>
                                        </div>
                                        <p className="text-white/90 text-sm font-semibold mb-2 uppercase tracking-wide">Completed</p>
                                        <p className="text-5xl font-bold">{stats.completed || 0}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {stats && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-md hover:shadow-lg transition-all">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                                            <CheckCircle className="w-5 h-5 text-green-600" />
                                        </div>
                                        <p className="text-xs text-gray-500 font-semibold uppercase">Confirmed</p>
                                    </div>
                                    <p className="text-3xl font-bold text-green-600">{stats.confirmed || 0}</p>
                                </div>
                                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-md hover:shadow-lg transition-all">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
                                            <Clock className="w-5 h-5 text-yellow-600" />
                                        </div>
                                        <p className="text-xs text-gray-500 font-semibold uppercase">Pending</p>
                                    </div>
                                    <p className="text-3xl font-bold text-yellow-600">{stats.pending || 0}</p>
                                </div>
                                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-md hover:shadow-lg transition-all">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                                            <XCircle className="w-5 h-5 text-red-600" />
                                        </div>
                                        <p className="text-xs text-gray-500 font-semibold uppercase">Cancelled</p>
                                    </div>
                                    <p className="text-3xl font-bold text-red-600">{stats.cancelled || 0}</p>
                                </div>
                                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-md hover:shadow-lg transition-all">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                                            <AlertCircle className="w-5 h-5 text-gray-600" />
                                        </div>
                                        <p className="text-xs text-gray-500 font-semibold uppercase">No-Show</p>
                                    </div>
                                    <p className="text-3xl font-bold text-gray-600">{stats.no_show || 0}</p>
                                </div>
                            </div>
                        )}
                        <GoogleCalendarConnect />

                        <div className="flex justify-center gap-2">
                            <Button
                                onClick={() => setViewMode('calendar')}
                                variant={viewMode === 'calendar' ? 'default' : 'outline'}
                                className={`flex items-center gap-2 ${viewMode === 'calendar'
                                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                                    : 'border-2 border-gray-300 text-gray-700 hover:border-blue-500'
                                    }`}
                            >
                                <CalendarDays className="w-5 h-5" />
                                Calendar View
                            </Button>
                            <Button
                                onClick={() => setViewMode('list')}
                                variant={viewMode === 'list' ? 'default' : 'outline'}
                                className={`flex items-center gap-2 ${viewMode === 'list'
                                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                                    : 'border-2 border-gray-300 text-gray-700 hover:border-blue-500'
                                    }`}
                            >
                                <List className="w-5 h-5" />
                                List View
                            </Button>
                        </div>

                        {/* Calendar View */}
                        {viewMode === 'calendar' && (
                            isLoadingBookings ? (
                                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-16 flex flex-col items-center justify-center">
                                    <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
                                    <p className="text-gray-600 font-medium">Loading calendar...</p>
                                </div>
                            ) : (
                                <BookingCalendar
                                    bookings={bookings}
                                    onBookingClick={handleBookingClick}
                                    onDayClick={handleDayClick}
                                />
                            )
                        )}

                        {/* List View (Bookings Table) */}
                        {viewMode === 'list' && (
                            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                                <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 px-8 py-8">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                                            <Calendar className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold text-white">All Bookings</h2>
                                            <p className="text-white/90 mt-1">Manage and track all your appointments</p>
                                        </div>
                                    </div>
                                </div>

                                {isLoadingBookings ? (
                                    <div className="p-16 flex flex-col items-center justify-center">
                                        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
                                        <p className="text-gray-600 font-medium">Loading bookings...</p>
                                    </div>
                                ) : bookings.length === 0 ? (
                                    <div className="p-20 text-center">
                                        <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <Calendar className="w-12 h-12 text-gray-400" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-900 mb-3">No Bookings Yet</h3>
                                        <p className="text-gray-600 text-lg">Booked appointments will appear here.</p>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <Table>
                                            <TableHeader>
                                                <TableRow className="bg-gray-50 border-b-2 border-gray-200">
                                                    <TableHead className="font-bold text-gray-900 text-sm">Customer</TableHead>
                                                    <TableHead className="font-bold text-gray-900 text-sm">Service</TableHead>
                                                    <TableHead className="font-bold text-gray-900 text-sm">Staff</TableHead>
                                                    <TableHead className="font-bold text-gray-900 text-sm">Date & Time</TableHead>
                                                    <TableHead className="font-bold text-gray-900 text-sm">Status</TableHead>
                                                    <TableHead className="font-bold text-gray-900 text-sm">Price</TableHead>
                                                    <TableHead className="font-bold text-gray-900 text-sm text-right">Actions</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {bookings.map((booking) => (
                                                    <TableRow key={booking.id} className="hover:bg-blue-50/50 transition-colors border-b border-gray-100">
                                                        <TableCell className="font-medium py-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-400 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md">
                                                                    {booking.customer_name.charAt(0).toUpperCase()}
                                                                </div>
                                                                <div>
                                                                    <div className="font-semibold text-gray-900 text-base">{booking.customer_name}</div>
                                                                    {booking.customer_email && (
                                                                        <div className="text-xs text-gray-500 mt-0.5">{booking.customer_email}</div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <span className="font-semibold text-gray-900">{booking.service_name}</span>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                                                                    <Users className="w-4 h-4 text-purple-600" />
                                                                </div>
                                                                <span className="text-gray-700 font-medium">{booking.staff_member_name || '-'}</span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="flex flex-col">
                                                                <span className="font-semibold text-gray-900">
                                                                    {new Date(booking.booking_datetime).toLocaleDateString('en-US', {
                                                                        month: 'short',
                                                                        day: 'numeric',
                                                                        year: 'numeric'
                                                                    })}
                                                                </span>
                                                                <span className="text-sm text-gray-500 mt-0.5">{formatTime(booking.booking_datetime)}</span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <span className={`px-3 py-1.5 rounded-xl text-xs font-bold border-2 ${getStatusColor(booking.status)}`}>
                                                                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1).replace('_', ' ')}
                                                            </span>
                                                        </TableCell>
                                                        <TableCell>
                                                            <span className="font-bold text-gray-900 text-lg">${booking.total_price}</span>
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <div className="flex items-center justify-end gap-2">
                                                                {booking.status === 'pending' && (
                                                                    <button
                                                                        onClick={() => handleConfirmBooking(booking.id)}
                                                                        disabled={actioningBookingId === booking.id}
                                                                        className="w-10 h-10 rounded-full bg-green-100 hover:bg-green-600 text-green-600 hover:text-white transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center group"
                                                                        title="Confirm Booking"
                                                                    >
                                                                        {actioningBookingId === booking.id ? (
                                                                            <Loader2 className="w-5 h-5 animate-spin" />
                                                                        ) : (
                                                                            <Check className="w-5 h-5" />
                                                                        )}
                                                                    </button>
                                                                )}
                                                                {booking.status === 'confirmed' && (
                                                                    <>
                                                                        <button
                                                                            onClick={() => handleCompleteBooking(booking.id)}
                                                                            disabled={actioningBookingId === booking.id}
                                                                            className="w-10 h-10 rounded-full bg-blue-100 hover:bg-blue-600 text-blue-600 hover:text-white transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                                                                            title="Mark as Completed"
                                                                        >
                                                                            {actioningBookingId === booking.id ? (
                                                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                                            ) : (
                                                                                <CheckCircle className="w-5 h-5" />
                                                                            )}
                                                                        </button>
                                                                        <button
                                                                            onClick={() => handleMarkNoShow(booking.id)}
                                                                            disabled={actioningBookingId === booking.id}
                                                                            className="w-10 h-10 rounded-full bg-red-100 hover:bg-red-600 text-red-600 hover:text-white transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                                                                            title="Mark as No-Show"
                                                                        >
                                                                            {actioningBookingId === booking.id ? (
                                                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                                            ) : (
                                                                                <X className="w-5 h-5" />
                                                                            )}
                                                                        </button>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                )}
                            </div>
                        )}

                        <DayBookingsModal
                            date={selectedDate}
                            bookings={selectedDayBookings}
                            isOpen={isDayModalOpen}
                            onClose={handleCloseDayModal}
                            onBookingClick={handleBookingClick}
                        />

                        <BookingDetailModal
                            booking={selectedBooking}
                            isOpen={isModalOpen}
                            onClose={handleCloseModal}
                            onConfirm={handleConfirmBooking}
                            onComplete={handleCompleteBooking}
                            onNoShow={handleMarkNoShow}
                            isActioning={actioningBookingId === selectedBooking?.id}
                        />
                    </div>
                </div>
            </div>
        </main>
    )
}
