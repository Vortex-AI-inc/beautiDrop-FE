"use client"

import { useState, useEffect } from "react"
import { useUser, useAuth } from "@clerk/nextjs"
import { Header } from "@/components/layout/header"
import { Loader2, Calendar as CalendarIcon, List, Scissors, Clock, DollarSign, MapPin, Settings } from "lucide-react"
import { GoogleCalendarConnect } from "@/components/calendar/google-calendar-connect"
import { fetchMyServices, fetchMyBookings } from "@/lib/api/staff"
import { BookingCalendar } from "@/components/ui/booking-calendar"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import type { Service } from "@/types/service"
import type { CustomerBooking } from "@/types/booking"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"

export default function StaffPortalPage() {
    const { user, isLoaded } = useUser()
    const { getToken } = useAuth()
    const { toast } = useToast()

    const [services, setServices] = useState<Service[]>([])
    const [bookings, setBookings] = useState<CustomerBooking[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar')

    useEffect(() => {
        if (isLoaded && user) {
            const role = (user.unsafeMetadata?.role as string) || (user.publicMetadata?.role as string)
            if (role === 'staff') {
                localStorage.setItem('userRole', 'staff')
            }
            loadData()
        }
    }, [isLoaded, user])

    const loadData = async () => {
        try {
            setIsLoading(true)
            const token = await getToken()
            if (!token) return

            const [servicesData, bookingsData] = await Promise.all([
                fetchMyServices(token),
                fetchMyBookings(token)
            ])


            const servicesList = Array.isArray(servicesData) ? servicesData : (servicesData.results || [])
            const bookingsList = Array.isArray(bookingsData) ? bookingsData : (bookingsData.results || [])

            setServices(servicesList)
            setBookings(bookingsList)
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to load dashboard data.",
                variant: "destructive"
            })
        } finally {
            setIsLoading(false)
        }
    }

    const formatDateTime = (dateStr: string) => {
        return new Date(dateStr).toLocaleString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit'
        })
    }

    const getStatusVariant = (status: string) => {
        switch (status) {
            case 'confirmed': return "success"
            case 'pending': return "warning"
            case 'completed': return "secondary"
            case 'cancelled': return "destructive"
            default: return "default"
        }
    }

    const renderStatusBadge = (status: string) => {
        let className = ""
        switch (status) {
            case 'confirmed': className = "bg-green-100 text-green-800 hover:bg-green-200"; break;
            case 'pending': className = "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"; break;
            case 'completed': className = "bg-blue-100 text-blue-800 hover:bg-blue-200"; break;
            case 'cancelled': className = "bg-red-100 text-red-800 hover:bg-red-200"; break;
            default: className = "bg-gray-100 text-gray-800 hover:bg-gray-200";
        }
        return <Badge variant="outline" className={`${className} border-0`}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>
    }

    if (!isLoaded || isLoading) {
        return (
            <main className="min-h-screen bg-slate-50">
                <Header />
                <div className="flex items-center justify-center min-h-[60vh]">
                    <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                </div>
            </main>
        )
    }

    return (
        <main className="min-h-screen bg-slate-50">
            <Header />
            <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Welcome, {user?.firstName || 'Staff Member'}! 👋
                        </h1>
                        <p className="text-gray-600">
                            Manage your assigned services and view your upcoming schedule.
                        </p>
                    </div>

                    <Tabs defaultValue="schedule" className="space-y-6">
                        <TabsList className="bg-white p-1 border border-gray-200 rounded-xl h-auto">
                            <TabsTrigger value="schedule" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 px-6 py-2 rounded-lg">
                                <CalendarIcon className="w-4 h-4 mr-2" />
                                My Schedule
                            </TabsTrigger>
                            <TabsTrigger value="services" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 px-6 py-2 rounded-lg">
                                <Scissors className="w-4 h-4 mr-2" />
                                Assigned Services
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="schedule" className="space-y-6">
                            <GoogleCalendarConnect />
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold text-gray-900">Your Apppointments</h2>
                                <div className="flex bg-white rounded-lg border border-gray-200 p-1">
                                    <Button
                                        variant={viewMode === 'calendar' ? 'secondary' : 'ghost'}
                                        size="sm"
                                        onClick={() => setViewMode('calendar')}
                                        className={`text-xs ${viewMode === 'calendar' ? 'bg-blue-50 text-blue-700' : 'text-gray-600'}`}
                                    >
                                        <CalendarIcon className="w-4 h-4 mr-2" />
                                        Calendar
                                    </Button>
                                    <Button
                                        variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                                        size="sm"
                                        onClick={() => setViewMode('list')}
                                        className={`text-xs ${viewMode === 'list' ? 'bg-blue-50 text-blue-700' : 'text-gray-600'}`}
                                    >
                                        <List className="w-4 h-4 mr-2" />
                                        List
                                    </Button>
                                </div>
                            </div>

                            {viewMode === 'calendar' ? (
                                <BookingCalendar
                                    bookings={bookings}
                                    onBookingClick={(booking) => {
                                    }}
                                />
                            ) : (
                                <div className="space-y-4">
                                    {bookings.length === 0 ? (
                                        <div className="bg-white p-8 rounded-xl border border-gray-200 text-center">
                                            <CalendarIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                            <h3 className="text-lg font-medium text-gray-900">No bookings found</h3>
                                            <p className="text-gray-500">You don't have any upcoming appointments.</p>
                                        </div>
                                    ) : (
                                        <div className="grid gap-4">
                                            {bookings.map((booking) => (
                                                <Card key={booking.id} className="overflow-hidden hover:shadow-md transition-shadow">
                                                    <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                        <div className="flex items-start gap-4">
                                                            <div className="bg-blue-50 p-3 rounded-lg hidden sm:block">
                                                                <Clock className="w-6 h-6 text-blue-600" />
                                                            </div>
                                                            <div>
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    <h3 className="font-semibold text-gray-900">{booking.customer_name}</h3>
                                                                    {renderStatusBadge(booking.status)}
                                                                </div>
                                                                <p className="text-gray-600 flex items-center gap-2 text-sm mb-1">
                                                                    <Scissors className="w-3.5 h-3.5" />
                                                                    {booking.service_name}
                                                                </p>
                                                                <p className="text-gray-500 flex items-center gap-2 text-sm">
                                                                    <CalendarIcon className="w-3.5 h-3.5" />
                                                                    {formatDateTime(booking.booking_datetime)}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-4">
                                                            <div className="text-right">
                                                                <p className="font-bold text-gray-900">${booking.total_price}</p>
                                                                <p className="text-xs text-gray-500">{booking.payment_status || 'Unpaid'}</p>
                                                            </div>
                                                            {/* Add action buttons here if needed */}
                                                        </div>
                                                    </div>
                                                </Card>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="services" className="space-y-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Services You Can Perform</h2>
                            {services.length === 0 ? (
                                <div className="bg-white p-8 rounded-xl border border-gray-200 text-center">
                                    <Scissors className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                    <h3 className="text-lg font-medium text-gray-900">No services assigned</h3>
                                    <p className="text-gray-500">You haven't been assigned to any services yet.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {services.map((service) => (
                                        <Card key={service.id} className="hover:shadow-md transition-shadow">
                                            <CardHeader className="pb-3">
                                                <CardTitle className="flex items-center justify-between text-base">
                                                    {service.name}
                                                    <span className="text-sm font-normal text-gray-500">{service.duration_minutes} min</span>
                                                </CardTitle>
                                                <CardDescription className="line-clamp-2">
                                                    {service.description || 'No description available'}
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="flex items-center justify-between pt-2 border-t border-gray-100 mt-2">
                                                    <div className="flex items-center text-gray-700 font-medium">
                                                        <DollarSign className="w-4 h-4 mr-1 text-gray-400" />
                                                        {service.price}
                                                    </div>
                                                    <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-100">
                                                        {service.category || 'General'}
                                                    </Badge>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </TabsContent>


                    </Tabs>
                </div>
            </div>
        </main >
    )
}

