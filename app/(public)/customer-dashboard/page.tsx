"use client"

import { useEffect, useState } from "react"
import { useUser, useAuth } from "@clerk/nextjs"
import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, MapPin, Loader2, Star, Heart } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { useRoleProtection } from "@/hooks/useRoleProtection"
import { fetchMyBookings } from "@/lib/api/bookings"
import type { CustomerBooking } from "@/types/booking"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

export default function CustomerDashboardPage() {
    const { user, isLoaded } = useUser()
    const { getToken } = useAuth()
    const { toast } = useToast()
    const { isAuthorized, isLoading: isCheckingRole } = useRoleProtection({ requiredRole: 'customer' })

    const [bookings, setBookings] = useState<CustomerBooking[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (isLoaded && user) {
            loadBookings()
        }
    }, [isLoaded, user])

    const loadBookings = async () => {
        try {
            setIsLoading(true)
            const token = await getToken()
            if (!token) return

            const data = await fetchMyBookings(token)
            setBookings(data)
        } catch (error) {
            console.error("Failed to load bookings", error)
            toast({
                title: "Error",
                description: "Failed to load your bookings. Please try again.",
                variant: "destructive"
            })
        } finally {
            setIsLoading(false)
        }
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
                    {/* Welcome Section */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Welcome back, {user?.firstName || 'there'}! 👋
                        </h1>
                        <p className="text-gray-600">
                            Manage your bookings and discover new beauty experiences
                        </p>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Upcoming Bookings</CardTitle>
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{upcomingBookings.length}</div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Visits</CardTitle>
                                <Star className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{pastBookings.length}</div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Favorite Salons</CardTitle>
                                <Heart className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">0</div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Upcoming Bookings */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-2xl font-bold text-gray-900">Upcoming Bookings</h2>
                            <Link href="/browse-salons">
                                <Button className="bg-purple-600 hover:bg-purple-700">
                                    Book New Appointment
                                </Button>
                            </Link>
                        </div>

                        {upcomingBookings.length === 0 ? (
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
                                                    <CardDescription>{booking.service_name}</CardDescription>
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
                                                    <Button variant="outline" size="sm" className="flex-1">
                                                        Reschedule
                                                    </Button>
                                                    <Button variant="outline" size="sm" className="flex-1 text-red-600 hover:text-red-700">
                                                        Cancel
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Past Bookings */}
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
                                                    <CardDescription>{booking.service_name}</CardDescription>
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
        </main>
    )
}
