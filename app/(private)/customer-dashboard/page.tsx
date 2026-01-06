"use client"

import { useEffect, useState } from "react"
import { useUser, useAuth } from "@clerk/nextjs"
import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, MapPin, Loader2, LayoutList, CalendarDays, CheckCircle, XCircle } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { useRoleProtection } from "@/hooks/useRoleProtection"
import { fetchMyBookings, cancelBooking, fetchCustomerStats, type CustomerBookingStats } from "@/lib/api/bookings"
import type { CustomerBooking } from "@/types/booking"
import { BookingCalendar } from "@/components/ui/booking-calendar"
import { DayBookingsModal } from "@/components/ui/day-bookings-modal"
import { GoogleCalendarConnect } from "@/components/calendar/google-calendar-connect"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"

export default function CustomerDashboardPage() {
    const { user, isLoaded } = useUser()
    const { getToken } = useAuth()
    const { toast } = useToast()
    const { isAuthorized, isLoading: isCheckingRole } = useRoleProtection({ requiredRole: 'customer' })

    const [bookings, setBookings] = useState<CustomerBooking[]>([])
    const [stats, setStats] = useState<CustomerBookingStats | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [cancellingBookingId, setCancellingBookingId] = useState<string | null>(null)
    const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false)
    const [selectedBookingForReschedule, setSelectedBookingForReschedule] = useState<CustomerBooking | null>(null)


    const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list')
    const [selectedDate, setSelectedDate] = useState<Date | null>(null)
    const [selectedDayBookings, setSelectedDayBookings] = useState<CustomerBooking[]>([])
    const [isDayModalOpen, setIsDayModalOpen] = useState(false)

    useEffect(() => {
        if (isLoaded && user) {
            loadData()
        }
    }, [isLoaded, user])

    const loadData = async () => {
        try {
            setIsLoading(true)
            const token = await getToken()
            if (!token) return

            const [bookingsData, statsData] = await Promise.all([
                fetchMyBookings(token),
                fetchCustomerStats(token)
            ])
            setBookings(bookingsData || [])
            setStats(statsData)
        } catch (error) {

        } finally {
            setIsLoading(false)
        }
    }

    const handleCancelBooking = async (bookingId: string, shopName: string) => {
        if (!confirm(`Are you sure you want to cancel your booking at ${shopName}?`)) {
            return
        }

        try {
            setCancellingBookingId(bookingId)
            const token = await getToken()
            if (!token) return

            await cancelBooking(bookingId, { cancellation_reason: "Customer requested cancellation" }, token)

            toast({
                title: "Booking Cancelled",
                description: "Your booking has been cancelled successfully.",
            })

            await loadData()
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to cancel booking. Please try again.",
                variant: "destructive"
            })
        } finally {
            setCancellingBookingId(null)
        }
    }

    const handleReschedule = (booking: CustomerBooking) => {
        setSelectedBookingForReschedule(booking)
        setIsRescheduleModalOpen(true)
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
    }

    const handleCalendarBookingClick = (booking: CustomerBooking) => {
        setSelectedBookingForReschedule(booking)
        setIsRescheduleModalOpen(true)
    }

    if (isCheckingRole || !isAuthorized) {
        return (
            <main className="min-h-screen bg-slate-50">
                <Header />
                <div className="flex items-center justify-center min-h-[60vh]">
                    <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                </div>
            </main>
        )
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'confirmed':
                return 'bg-green-100 text-green-700'
            case 'pending':
                return 'bg-yellow-100 text-yellow-700'
            case 'cancelled':
                return 'bg-red-100 text-red-700'
            case 'completed':
                return 'bg-blue-100 text-blue-700'
            default:
                return 'bg-gray-100 text-gray-700'
        }
    }

    if (!isLoaded || isLoading) {
        return (
            <main className="min-h-screen bg-slate-50">
                <Header />
                <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                </div>
            </main>
        )
    }

    const upcomingBookings = bookings.filter(b => b.status === 'confirmed' || b.status === 'pending')
    const pastBookings = bookings.filter(b => b.status === 'completed' || b.status === 'cancelled')

    return (
        <main className="min-h-screen bg-slate-50">
            <Header />

            <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Welcome back, {user?.firstName || 'there'}! 👋
                        </h1>
                        <p className="text-gray-600">
                            Manage your bookings and discover new beauty experiences
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total</CardTitle>
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats?.total || 0}</div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
                                <Clock className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats?.upcoming || 0}</div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Completed</CardTitle>
                                <CheckCircle className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats?.completed || 0}</div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Cancelled</CardTitle>
                                <XCircle className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats?.cancelled || 0}</div>
                            </CardContent>
                        </Card>
                    </div>



                    {/* Upcoming Bookings */}
                    <div className="mb-8">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                            <h2 className="text-2xl font-bold text-gray-900">Upcoming Bookings</h2>
                            <div className="flex items-center gap-3">
                                <div className="bg-gray-100 p-1 rounded-lg flex items-center">
                                    <button
                                        onClick={() => setViewMode('list')}
                                        className={`p-2 rounded-md transition-all ${viewMode === 'list'
                                            ? 'bg-white text-blue-600 shadow-sm'
                                            : 'text-gray-500 hover:text-gray-700'
                                            }`}
                                        title="List View"
                                    >
                                        <LayoutList className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => setViewMode('calendar')}
                                        className={`p-2 rounded-md transition-all ${viewMode === 'calendar'
                                            ? 'bg-white text-blue-600 shadow-sm'
                                            : 'text-gray-500 hover:text-gray-700'
                                            }`}
                                        title="Calendar View"
                                    >
                                        <CalendarDays className="w-5 h-5" />
                                    </button>
                                </div>
                                <Link href="/browse-salons">
                                    <Button className="bg-purple-600 hover:bg-purple-700">
                                        Book New Appointment
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        <div className="mb-6">
                            <GoogleCalendarConnect />
                        </div>

                        {viewMode === 'calendar' ? (
                            <div className="space-y-4">
                                <BookingCalendar
                                    bookings={upcomingBookings}
                                    onBookingClick={handleCalendarBookingClick}
                                    onDayClick={handleDayClick}
                                />
                                <DayBookingsModal
                                    date={selectedDate}
                                    bookings={selectedDayBookings}
                                    isOpen={isDayModalOpen}
                                    onClose={handleCloseDayModal}
                                    onBookingClick={handleCalendarBookingClick}
                                />
                            </div>
                        ) : (
                            upcomingBookings.length === 0 ? (
                                <Card>
                                    <CardContent className="p-12 text-center">
                                        <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Upcoming Bookings</h3>
                                        <p className="text-gray-600 mb-4">You don't have any upcoming appointments</p>
                                        <Link href="/browse-salons">
                                            <Button className="bg-purple-600 hover:bg-purple-700">
                                                Browse Salons
                                            </Button>
                                        </Link>
                                    </CardContent>
                                </Card>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {upcomingBookings.map((booking) => (
                                        <Card key={booking.id}>
                                            <CardHeader>
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <CardTitle>{booking.shop_name}</CardTitle>
                                                        <CardDescription>
                                                            {booking.item_name || booking.service_name || booking.deal_name}
                                                            {booking.is_deal_booking && (
                                                                <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-purple-100 text-purple-800">
                                                                    Deal
                                                                </span>
                                                            )}
                                                        </CardDescription>
                                                    </div>
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                                                        {booking.status}
                                                    </span>
                                                </div>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="space-y-2">
                                                    <div className="flex items-center text-sm text-gray-600">
                                                        <Clock className="w-4 h-4 mr-2" />
                                                        {new Date(booking.booking_datetime).toLocaleString()}
                                                    </div>
                                                    <div className="flex items-center text-sm text-gray-600">
                                                        <MapPin className="w-4 h-4 mr-2" />
                                                        View Location
                                                    </div>
                                                    <div className="pt-4 flex gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="flex-1"
                                                            onClick={() => handleReschedule(booking)}
                                                        >
                                                            Reschedule
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="flex-1 text-red-600 hover:text-red-700"
                                                            onClick={() => handleCancelBooking(booking.id, booking.shop_name)}
                                                            disabled={cancellingBookingId === booking.id}
                                                        >
                                                            {cancellingBookingId === booking.id ? (
                                                                <>
                                                                    <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                                                                    Cancelling...
                                                                </>
                                                            ) : (
                                                                "Cancel"
                                                            )}
                                                        </Button>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )
                        )}
                    </div>

                    {pastBookings.length > 0 && (
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Past Bookings</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {pastBookings.slice(0, 4).map((booking) => (
                                    <Card key={booking.id}>
                                        <CardHeader>
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <CardTitle>{booking.shop_name}</CardTitle>
                                                    <CardDescription>{booking.item_name || booking.service_name || booking.deal_name}</CardDescription>
                                                </div>
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                                                    {booking.status}
                                                </span>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-2">
                                                <div className="flex items-center text-sm text-gray-600">
                                                    <Clock className="w-4 h-4 mr-2" />
                                                    {new Date(booking.booking_datetime).toLocaleString()}
                                                </div>
                                                <div className="pt-4">
                                                    <Button variant="outline" size="sm" className="w-full">
                                                        Book Again
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <Dialog open={isRescheduleModalOpen} onOpenChange={setIsRescheduleModalOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Reschedule Appointment</DialogTitle>
                        <DialogDescription>
                            Reschedule your appointment at {selectedBookingForReschedule?.shop_name}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        {selectedBookingForReschedule && (
                            <div className="space-y-4">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h4 className="font-semibold text-gray-900 mb-2">Current Booking</h4>
                                    <div className="space-y-1 text-sm text-gray-600">
                                        <p><strong>Service/Deal:</strong> {selectedBookingForReschedule.item_name || selectedBookingForReschedule.service_name || selectedBookingForReschedule.deal_name}</p>
                                        <p><strong>Date & Time:</strong> {new Date(selectedBookingForReschedule.booking_datetime).toLocaleString()}</p>
                                        {selectedBookingForReschedule.staff_member_name && (
                                            <p><strong>Staff:</strong> {selectedBookingForReschedule.staff_member_name}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="text-center py-6">
                                    <p className="text-gray-600 mb-4">
                                        To reschedule your appointment, please contact the salon directly or book a new appointment and cancel this one.
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Full reschedule feature with time slot selection coming soon!
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsRescheduleModalOpen(false)}>
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </main>
    )
}
