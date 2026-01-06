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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

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
        <main className="min-h-screen bg-gray-50/50">
            <Header />

            <div className="pt-28 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Link href={`/portal/${shopId}`} className="hover:text-foreground transition-colors">Dashboard</Link>
                    <span>/</span>
                    <span className="text-foreground font-medium">Schedule</span>
                </div>

                {/* Page Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Bookings</h1>
                        <p className="text-muted-foreground mt-1">Manage appointments and track your schedule.</p>
                    </div>
                    <div className="flex items-center gap-1 bg-white p-1 rounded-lg border shadow-sm self-start sm:self-auto">
                        <button
                            onClick={() => setViewMode('calendar')}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === 'calendar'
                                ? 'bg-primary text-primary-foreground shadow-sm'
                                : 'text-muted-foreground hover:bg-gray-100 hover:text-foreground'
                                }`}
                        >
                            <CalendarDays className="w-4 h-4" />
                            Calendar
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === 'list'
                                ? 'bg-primary text-primary-foreground shadow-sm'
                                : 'text-muted-foreground hover:bg-gray-100 hover:text-foreground'
                                }`}
                        >
                            <List className="w-4 h-4" />
                            List
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                {isLoadingStats ? (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="h-32 bg-white rounded-xl border animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
                                <Clock className="h-4 w-4 text-yellow-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats?.pending || 0}</div>
                                <p className="text-xs text-muted-foreground">Requires attention</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Confirmed Upcoming</CardTitle>
                                <Calendar className="h-4 w-4 text-blue-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats?.confirmed || 0}</div>
                                <p className="text-xs text-muted-foreground">Scheduled visits</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Completed</CardTitle>
                                <CheckCircle className="h-4 w-4 text-green-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats?.completed || 0}</div>
                                <p className="text-xs text-muted-foreground">Successfully served</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                                <TrendingUp className="h-4 w-4 text-gray-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats?.total_bookings || 0}</div>
                                <p className="text-xs text-muted-foreground">All time</p>
                            </CardContent>
                        </Card>
                    </div>
                )}

                <div className="bg-white rounded-xl border shadow-sm p-4">
                    <GoogleCalendarConnect />
                </div>

                {/* Content Area */}
                <div className="bg-white rounded-xl border shadow-sm min-h-[500px] overflow-hidden">
                    {viewMode === 'calendar' ? (
                        isLoadingBookings ? (
                            <div className="flex items-center justify-center h-96">
                                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                            </div>
                        ) : (
                            <div className="p-4">
                                <BookingCalendar
                                    bookings={bookings}
                                    onBookingClick={handleBookingClick}
                                    onDayClick={handleDayClick}
                                />
                            </div>
                        )
                    ) : (
                        // List View
                        isLoadingBookings ? (
                            <div className="flex flex-col items-center justify-center h-96">
                                <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
                                <p className="text-muted-foreground">Loading bookings...</p>
                            </div>
                        ) : bookings.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-96 text-center p-8">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                    <Calendar className="w-8 h-8 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900">No bookings found</h3>
                                <p className="text-gray-500 max-w-sm mt-1">Bookings will appear here when customers schedule appointments.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-gray-50/50">
                                            <TableHead>Customer</TableHead>
                                            <TableHead>Service</TableHead>
                                            <TableHead>Staff</TableHead>
                                            <TableHead>Date & Time</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Price</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {bookings.map((booking) => (
                                            <TableRow key={booking.id} className="hover:bg-gray-50/50">
                                                <TableCell className="font-medium">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center text-blue-700 font-bold text-xs uppercase">
                                                            {booking.customer_name.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <div className="font-medium text-gray-900">{booking.customer_name}</div>
                                                            {booking.customer_email && (
                                                                <div className="text-xs text-gray-500">{booking.customer_email}</div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div>
                                                        <span className="font-medium text-gray-900">
                                                            {booking.item_name || booking.service_name || booking.deal_name}
                                                        </span>
                                                        {booking.is_deal_booking && (
                                                            <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-purple-100 text-purple-700">
                                                                Deal
                                                            </span>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <Users className="w-3.5 h-3.5 text-gray-400" />
                                                        <span className="text-gray-600">{booking.staff_member_name || 'Any Staff'}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-medium text-gray-900">
                                                            {new Date(booking.booking_datetime).toLocaleDateString()}
                                                        </span>
                                                        <span className="text-xs text-gray-500">{formatTime(booking.booking_datetime)}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(booking.status)}`}>
                                                        {booking.status.replace('_', ' ')}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    <span className="font-medium text-gray-900">${booking.total_price}</span>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex items-center justify-end gap-1">
                                                        {booking.status === 'pending' && (
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                onClick={() => handleConfirmBooking(booking.id)}
                                                                disabled={actioningBookingId === booking.id}
                                                                className="h-8 w-8 p-0 hover:bg-green-50 hover:text-green-600 text-green-500"
                                                                title="Confirm"
                                                            >
                                                                {actioningBookingId === booking.id ? (
                                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                                ) : (
                                                                    <Check className="w-4 h-4" />
                                                                )}
                                                            </Button>
                                                        )}
                                                        {booking.status === 'confirmed' && (
                                                            <>
                                                                <Button
                                                                    size="sm"
                                                                    variant="ghost"
                                                                    onClick={() => handleCompleteBooking(booking.id)}
                                                                    disabled={actioningBookingId === booking.id}
                                                                    className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600 text-blue-500"
                                                                    title="Complete"
                                                                >
                                                                    {actioningBookingId === booking.id ? (
                                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                                    ) : (
                                                                        <CheckCircle className="w-4 h-4" />
                                                                    )}
                                                                </Button>
                                                                <Button
                                                                    size="sm"
                                                                    variant="ghost"
                                                                    onClick={() => handleMarkNoShow(booking.id)}
                                                                    disabled={actioningBookingId === booking.id}
                                                                    className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600 text-red-500"
                                                                    title="No Show"
                                                                >
                                                                    {actioningBookingId === booking.id ? (
                                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                                    ) : (
                                                                        <X className="w-4 h-4" />
                                                                    )}
                                                                </Button>
                                                            </>
                                                        )}
                                                        {/* Always show details button? Or just row click? Row click is handled by nothing currently in Table. Let's add detail trigger */}
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            onClick={() => handleBookingClick(booking)}
                                                            className="h-8 w-8 p-0 text-gray-400 hover:text-gray-900"
                                                            title="View Details"
                                                        >
                                                            <MoreVertical className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )
                    )}
                </div>

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
        </main>
    )
}
