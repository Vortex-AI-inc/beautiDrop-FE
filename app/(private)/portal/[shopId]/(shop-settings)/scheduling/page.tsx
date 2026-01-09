"use client"

import { useEffect, useState } from "react"
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
import { cn } from "@/lib/utils"

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
                return 'bg-indigo-50 text-indigo-700'
            case 'pending':
                return 'bg-amber-50 text-amber-700'
            case 'completed':
                return 'bg-teal-50 text-teal-700'
            case 'cancelled':
                return 'bg-rose-50 text-rose-700'
            case 'no_show':
                return 'bg-slate-100 text-slate-700'
            default:
                return 'bg-slate-50 text-slate-500'
        }
    }

    return (
        <>
            <div className="space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-gray-100/80">
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
                                Scheduling
                            </h1>
                        </div>
                        <p className="text-slate-500 font-medium">Manage your shop's booking calendar and staff availability.</p>
                    </div>
                    <div className="flex items-center gap-1 bg-slate-50 p-1.5 rounded-2xl border border-slate-100 shadow-sm self-start sm:self-auto">
                        <button
                            onClick={() => setViewMode('calendar')}
                            className={cn(
                                "flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                viewMode === 'calendar'
                                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100"
                                    : "text-slate-400 hover:text-slate-600 hover:bg-white"
                            )}
                        >
                            <CalendarDays className="w-3.5 h-3.5" />
                            Calendar
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={cn(
                                "flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                viewMode === 'list'
                                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100"
                                    : "text-slate-400 hover:text-slate-600 hover:bg-white"
                            )}
                        >
                            <List className="w-3.5 h-3.5" />
                            List View
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                {isLoadingStats ? (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="h-40 bg-white rounded-[2rem] border-none shadow-xl shadow-slate-200/40 animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        <Card className="shadow-xl shadow-slate-200/40 border-none rounded-[2rem] overflow-hidden group hover:shadow-2xl hover:shadow-indigo-100/50 transition-all">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-8 pt-8">
                                <CardTitle className="text-xs font-black uppercase tracking-widest text-slate-400">Pending</CardTitle>
                                <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center group-hover:bg-amber-100 transition-colors">
                                    <Clock className="h-5 w-5 text-amber-600" />
                                </div>
                            </CardHeader>
                            <CardContent className="px-8 pb-8">
                                <div className="text-4xl font-black text-slate-900 tracking-tighter">{stats?.pending || 0}</div>
                                <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-tight">Requires attention</p>
                            </CardContent>
                        </Card>
                        <Card className="shadow-xl shadow-slate-200/40 border-none rounded-[2rem] overflow-hidden group hover:shadow-2xl hover:shadow-indigo-100/50 transition-all">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-8 pt-8">
                                <CardTitle className="text-xs font-black uppercase tracking-widest text-slate-400">Confirmed</CardTitle>
                                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
                                    <Calendar className="h-5 w-5 text-indigo-600" />
                                </div>
                            </CardHeader>
                            <CardContent className="px-8 pb-8">
                                <div className="text-4xl font-black text-slate-900 tracking-tighter">{stats?.confirmed || 0}</div>
                                <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-tight">Scheduled visits</p>
                            </CardContent>
                        </Card>
                        <Card className="shadow-xl shadow-slate-200/40 border-none rounded-[2rem] overflow-hidden group hover:shadow-2xl hover:shadow-teal-100/50 transition-all">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-8 pt-8">
                                <CardTitle className="text-xs font-black uppercase tracking-widest text-slate-400">Completed</CardTitle>
                                <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center group-hover:bg-teal-100 transition-colors">
                                    <CheckCircle className="h-5 w-5 text-teal-600" />
                                </div>
                            </CardHeader>
                            <CardContent className="px-8 pb-8">
                                <div className="text-4xl font-black text-slate-900 tracking-tighter">{stats?.completed || 0}</div>
                                <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-tight">Successfully served</p>
                            </CardContent>
                        </Card>
                        <Card className="shadow-xl shadow-slate-200/40 border-none rounded-[2rem] overflow-hidden group hover:shadow-2xl hover:shadow-slate-300/50 transition-all">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-8 pt-8">
                                <CardTitle className="text-xs font-black uppercase tracking-widest text-slate-400">Total</CardTitle>
                                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center group-hover:bg-slate-100 transition-colors">
                                    <TrendingUp className="h-5 w-5 text-slate-600" />
                                </div>
                            </CardHeader>
                            <CardContent className="px-8 pb-8">
                                <div className="text-4xl font-black text-slate-900 tracking-tighter">{stats?.total_bookings || 0}</div>
                                <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-tight">All-time bookings</p>
                            </CardContent>
                        </Card>
                    </div>
                )}

                <div className="bg-white rounded-[2rem] border-none shadow-xl shadow-slate-200/40 p-1.5 overflow-hidden">
                    <GoogleCalendarConnect />
                </div>

                {/* Content Area */}
                <Card className="shadow-xl shadow-slate-200/40 border-none rounded-[2rem] overflow-hidden min-h-[500px]">
                    {viewMode === 'calendar' ? (
                        isLoadingBookings ? (
                            <div className="flex flex-col items-center justify-center py-40">
                                <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
                                <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Updating Calendar</p>
                            </div>
                        ) : (
                            <div className="p-8">
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
                            <div className="flex flex-col items-center justify-center py-40">
                                <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
                                <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Loading Bookings</p>
                            </div>
                        ) : bookings.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-40 text-center px-4">
                                <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-6 shadow-inner">
                                    <Calendar className="w-10 h-10 text-slate-300" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900">No bookings yet</h3>
                                <p className="text-slate-500 font-medium max-w-sm mt-2">Bookings will appear here when customers schedule appointments.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="border-none hover:bg-transparent">
                                            <TableHead className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-400">Customer</TableHead>
                                            <TableHead className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-400">Service</TableHead>
                                            <TableHead className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-400">Staff</TableHead>
                                            <TableHead className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-400">Schedule</TableHead>
                                            <TableHead className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-400">Status</TableHead>
                                            <TableHead className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-400">Amount</TableHead>
                                            <TableHead className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-400 text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {bookings.map((booking) => (
                                            <TableRow key={booking.id} className="group border-slate-50 hover:bg-slate-50/50 transition-colors">
                                                <TableCell className="px-8 py-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600 font-black text-sm uppercase shadow-sm">
                                                            {booking.customer_name.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-slate-900">{booking.customer_name}</div>
                                                            {booking.customer_email && (
                                                                <div className="text-[11px] font-medium text-slate-400 mt-0.5">{booking.customer_email}</div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="px-8 py-6">
                                                    <div>
                                                        <span className="font-bold text-slate-900">
                                                            {booking.item_name || booking.service_name || booking.deal_name}
                                                        </span>
                                                        {booking.is_deal_booking && (
                                                            <div className="mt-1 text-[10px] font-black uppercase tracking-wider text-indigo-600 bg-indigo-50 inline-block px-2 py-0.5 rounded-lg">
                                                                Special Deal
                                                            </div>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="px-8 py-6">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-6 h-6 bg-slate-50 rounded-lg flex items-center justify-center">
                                                            <Users className="w-3 h-3 text-slate-400" />
                                                        </div>
                                                        <span className="text-sm font-bold text-slate-600">{booking.staff_member_name || 'Unassigned'}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="px-8 py-6">
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-black text-slate-900">
                                                            {new Date(booking.booking_datetime).toLocaleDateString()}
                                                        </span>
                                                        <span className="text-[11px] font-bold text-slate-400 mt-0.5 uppercase tracking-wider">{formatTime(booking.booking_datetime)}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="px-8 py-6">
                                                    <span className={cn(
                                                        "inline-flex items-center px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest border-none",
                                                        getStatusColor(booking.status)
                                                    )}>
                                                        {booking.status.replace('_', ' ')}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="px-8 py-6">
                                                    <span className="text-base font-black text-slate-900 tracking-tighter">${booking.total_price}</span>
                                                </TableCell>
                                                <TableCell className="px-8 py-6 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        {booking.status === 'pending' && (
                                                            <Button
                                                                size="icon"
                                                                variant="ghost"
                                                                onClick={() => handleConfirmBooking(booking.id)}
                                                                disabled={actioningBookingId === booking.id}
                                                                className="h-9 w-9 text-teal-600 hover:bg-teal-50 rounded-xl"
                                                                title="Confirm Booking"
                                                            >
                                                                {actioningBookingId === booking.id ? (
                                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                                ) : (
                                                                    <Check className="w-4 h-4 stroke-[3px]" />
                                                                )}
                                                            </Button>
                                                        )}
                                                        {booking.status === 'confirmed' && (
                                                            <>
                                                                <Button
                                                                    size="icon"
                                                                    variant="ghost"
                                                                    onClick={() => handleCompleteBooking(booking.id)}
                                                                    disabled={actioningBookingId === booking.id}
                                                                    className="h-9 w-9 text-indigo-600 hover:bg-indigo-50 rounded-xl"
                                                                    title="Mark as Completed"
                                                                >
                                                                    {actioningBookingId === booking.id ? (
                                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                                    ) : (
                                                                        <CheckCircle className="w-4 h-4" />
                                                                    )}
                                                                </Button>
                                                                <Button
                                                                    size="icon"
                                                                    variant="ghost"
                                                                    onClick={() => handleMarkNoShow(booking.id)}
                                                                    disabled={actioningBookingId === booking.id}
                                                                    className="h-9 w-9 text-rose-500 hover:bg-rose-50 rounded-xl"
                                                                    title="Report No-Show"
                                                                >
                                                                    {actioningBookingId === booking.id ? (
                                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                                    ) : (
                                                                        <XCircle className="w-4 h-4" />
                                                                    )}
                                                                </Button>
                                                            </>
                                                        )}
                                                        <Button
                                                            size="icon"
                                                            variant="ghost"
                                                            onClick={() => handleBookingClick(booking)}
                                                            className="h-9 w-9 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-xl"
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
                </Card>

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
        </>
    )
}
