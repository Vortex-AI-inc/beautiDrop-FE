"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar, Loader2, Clock, Plus, BookOpen } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@clerk/nextjs"
import { fetchShopSchedules, deleteSchedule, generateTimeSlots, fetchTimeSlots } from "@/lib/api/schedules"
import { fetchShopBookings } from "@/lib/api/bookings"
import { fetchShopStaff } from "@/lib/api/staff"
import type { Schedule, TimeSlot } from "@/types/schedule"
import type { CustomerBooking } from "@/types/booking"
import type { StaffMember } from "@/types/staff"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export default function SchedulingPage() {
    const params = useParams()
    const shopId = params.shopId as string
    const { toast } = useToast()
    const { getToken } = useAuth()

    const [schedules, setSchedules] = useState<Schedule[]>([])
    const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])
    const [bookings, setBookings] = useState<CustomerBooking[]>([])
    const [staffMembers, setStaffMembers] = useState<StaffMember[]>([])
    const [isLoadingSlots, setIsLoadingSlots] = useState(true)
    const [isLoadingBookings, setIsLoadingBookings] = useState(false)
    const [bookingsLoaded, setBookingsLoaded] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [activeTab, setActiveTab] = useState("generated")

    // Get current date and time for defaults
    const getCurrentDateTime = () => {
        const now = new Date()
        const date = now.toISOString().split('T')[0] // YYYY-MM-DD
        const hours = now.getHours().toString().padStart(2, '0')
        const minutes = now.getMinutes().toString().padStart(2, '0')
        const startTime = `${hours}:${minutes}`

        // Add 30 minutes for end time
        const endDate = new Date(now.getTime() + 30 * 60000)
        const endHours = endDate.getHours().toString().padStart(2, '0')
        const endMinutes = endDate.getMinutes().toString().padStart(2, '0')
        const endTime = `${endHours}:${endMinutes}`

        return { date, startTime, endTime }
    }

    const defaults = getCurrentDateTime()
    const [slotFormData, setSlotFormData] = useState({
        date: defaults.date,
        start_time: defaults.startTime,
        end_time: defaults.endTime,
        staff_member_id: ""
    })


    useEffect(() => {
        loadTimeSlots()
        loadStaff()
    }, [shopId])

    const loadTimeSlots = async () => {
        try {
            setIsLoadingSlots(true)
            const token = await getToken()
            if (!token) return

            // Fetch schedules
            const schedulesData = await fetchShopSchedules(shopId, token)
            setSchedules(schedulesData)

            // Fetch real time slots
            const timeSlotsData = await fetchTimeSlots(shopId, token)
            setTimeSlots(timeSlotsData)

        } catch (error) {
            console.error("Failed to load time slots", error)
            toast({
                title: "Error",
                description: "Failed to load time slots. Please try again.",
                variant: "destructive"
            })
        } finally {
            setIsLoadingSlots(false)
        }
    }

    const loadStaff = async () => {
        try {
            const token = await getToken()
            if (!token) return

            const staffData = await fetchShopStaff(shopId, token)
            setStaffMembers(staffData.filter(s => s.is_active))
        } catch (error) {
            console.error("Failed to load staff", error)
        }
    }

    const loadBookings = async () => {
        if (bookingsLoaded) return // Don't reload if already loaded

        try {
            setIsLoadingBookings(true)
            const token = await getToken()
            if (!token) return

            const bookingsData = await fetchShopBookings(shopId, token)
            setBookings(bookingsData)
            setBookingsLoaded(true)

        } catch (error) {
            console.error("Failed to load bookings", error)
            toast({
                title: "Error",
                description: "Failed to load bookings. Please try again.",
                variant: "destructive"
            })
        } finally {
            setIsLoadingBookings(false)
        }
    }

    const handleTabChange = (value: string) => {
        setActiveTab(value)
        if (value === "booked" && !bookingsLoaded) {
            loadBookings()
        }
    }

    const handleInputChange = (field: string, value: string) => {
        setSlotFormData(prev => ({ ...prev, [field]: value }))
    }

    const handleSubmit = async () => {
        if (isSubmitting) return

        if (!slotFormData.date || !slotFormData.start_time || !slotFormData.end_time) {
            toast({
                title: "Error",
                description: "Please fill in all fields.",
                variant: "destructive"
            })
            return
        }

        try {
            setIsSubmitting(true)
            const token = await getToken()
            if (!token) {
                toast({
                    title: "Error",
                    description: "You must be logged in to generate slots.",
                    variant: "destructive"
                })
                return
            }

            const date = new Date(slotFormData.date)
            const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
            const dayName = days[date.getUTCDay()]

            const payload: any = {
                shop_id: shopId,
                start_date: slotFormData.date,
                day_name: dayName,
                start_time: `${slotFormData.start_time}:00.000Z`,
                end_time: `${slotFormData.end_time}:00.000Z`
            }

            if (slotFormData.staff_member_id) {
                payload.staff_member_id = slotFormData.staff_member_id
            }

            console.log('Payload being sent:', payload) // Debug log

            const result = await generateTimeSlots(payload, token)

            toast({
                title: "Success",
                description: result.message || "Time slots generated successfully.",
            })

            const newDefaults = getCurrentDateTime()
            setSlotFormData({
                date: newDefaults.date,
                start_time: newDefaults.startTime,
                end_time: newDefaults.endTime,
                staff_member_id: ""
            })

            await loadTimeSlots()
        } catch (error: any) {
            console.error("Failed to generate slots", error)
            toast({
                title: "Error",
                description: error.message || "Failed to generate slots. Please try again.",
                variant: "destructive"
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    const formatTime = (datetime: string) => {
        if (!datetime) return ''
        const date = new Date(datetime)
        const hours = date.getUTCHours()
        const minutes = date.getUTCMinutes()
        const ampm = hours >= 12 ? 'PM' : 'AM'
        const hour12 = hours % 12 || 12
        const minutesStr = minutes.toString().padStart(2, '0')
        return `${hour12}:${minutesStr} ${ampm}`
    }


    return (
        <main className="min-h-screen bg-slate-50">
            <Header />

            <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-5xl mx-auto">
                    <Link
                        href={`/portal/${shopId}`}
                        className="mb-6 text-sm text-gray-500 hover:text-gray-900 flex items-center gap-1 inline-flex"
                    >
                        ← Back to Dashboard
                    </Link>

                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <div className="flex items-center gap-2 mb-6">
                                <Calendar className="w-6 h-6 text-blue-600" />
                                <h1 className="text-2xl font-bold text-gray-900">Scheduling Management</h1>
                            </div>
                            <p className="text-gray-600">
                                Manage your business hours, generate time slots, and view bookings.
                            </p>
                        </div>

                        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                            <TabsList className="grid w-full grid-cols-2 mb-6">
                                <TabsTrigger value="generated" className="data-[state=inactive]:text-white">
                                    Generated Time Slots
                                </TabsTrigger>
                                <TabsTrigger value="booked" className="data-[state=inactive]:text-white">
                                    Booked Slots
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="generated">
                                <div className="space-y-6">
                                    {/* Add New Slot Form */}
                                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                        <div className="flex items-center justify-between mb-6">
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-5 h-5 text-blue-600" />
                                                <h2 className="text-lg font-bold text-gray-900">Generate Time Slots</h2>
                                            </div>
                                        </div>

                                        <div className="space-y-4 mb-6">
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="date">Date</Label>
                                                    <Input
                                                        id="date"
                                                        type="date"
                                                        value={slotFormData.date}
                                                        onChange={(e) => handleInputChange('date', e.target.value)}
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="start_time">Start Time</Label>
                                                    <Input
                                                        id="start_time"
                                                        type="time"
                                                        value={slotFormData.start_time}
                                                        onChange={(e) => handleInputChange('start_time', e.target.value)}
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="end_time">End Time</Label>
                                                    <Input
                                                        id="end_time"
                                                        type="time"
                                                        value={slotFormData.end_time}
                                                        onChange={(e) => handleInputChange('end_time', e.target.value)}
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="staff_member">Assign Staff (Optional)</Label>
                                                <Select
                                                    value={slotFormData.staff_member_id || undefined}
                                                    onValueChange={(value) => handleInputChange('staff_member_id', value === 'none' ? '' : value)}
                                                >
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Select staff member" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="none">No staff assigned</SelectItem>
                                                        {staffMembers.map((staff) => (
                                                            <SelectItem key={staff.id} value={staff.id}>
                                                                {staff.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                        </div>

                                        <div className="flex justify-end">
                                            <Button
                                                onClick={handleSubmit}
                                                disabled={isSubmitting || !slotFormData.date || !slotFormData.start_time || !slotFormData.end_time}
                                                className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {isSubmitting ? (
                                                    <>
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                        Generating...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Plus className="w-4 h-4 " />
                                                        Generate Slots
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Generated Time Slots Table */}
                                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                        <div className="bg-teal-500 px-6 py-4 flex items-center gap-2">
                                            <Calendar className="w-5 h-5 text-white" />
                                            <h2 className="text-lg font-bold text-white">Generated Time Slots</h2>
                                        </div>

                                        {isLoadingSlots ? (
                                            <div className="p-12 flex flex-col items-center justify-center">
                                                <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-4" />
                                                <p className="text-gray-600">Loading time slots...</p>
                                            </div>
                                        ) : timeSlots.length === 0 ? (
                                            <div className="p-12 text-center">
                                                <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Time Slots Yet</h3>
                                                <p className="text-gray-600">Generate time slots above to see them here.</p>
                                            </div>
                                        ) : (
                                            <div className="p-6">
                                                <Table>
                                                    <TableHeader>
                                                        <TableRow>
                                                            <TableHead className="font-bold text-gray-900">Date</TableHead>
                                                            <TableHead className="font-bold text-gray-900">Time Range</TableHead>
                                                            <TableHead className="font-bold text-gray-900">Duration</TableHead>
                                                            <TableHead className="font-bold text-gray-900">Status</TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {timeSlots.map((slot) => (
                                                            <TableRow key={slot.id}>
                                                                <TableCell className="font-medium">
                                                                    {new Date(slot.start_datetime).toLocaleDateString()}
                                                                </TableCell>
                                                                <TableCell>
                                                                    {formatTime(slot.start_datetime)} - {formatTime(slot.end_datetime)}
                                                                </TableCell>
                                                                <TableCell>{slot.duration_minutes} min</TableCell>
                                                                <TableCell>
                                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${slot.status === 'available' ? 'bg-green-100 text-green-700' : slot.status === 'booked' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
                                                                        {slot.status.charAt(0).toUpperCase() + slot.status.slice(1)}
                                                                    </span>
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="booked">
                                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                    <div className="bg-blue-500 px-6 py-4 flex items-center gap-2">
                                        <BookOpen className="w-5 h-5 text-white" />
                                        <h2 className="text-lg font-bold text-white">Booked Slots</h2>
                                    </div>

                                    {isLoadingBookings ? (
                                        <div className="p-12 flex flex-col items-center justify-center">
                                            <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-4" />
                                            <p className="text-gray-600">Loading bookings...</p>
                                        </div>
                                    ) : bookings.length === 0 ? (
                                        <div className="p-12 text-center">
                                            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Bookings Yet</h3>
                                            <p className="text-gray-600">Booked appointments will appear here.</p>
                                        </div>
                                    ) : (
                                        <div className="p-6">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead className="font-bold text-gray-900">Customer</TableHead>
                                                        <TableHead className="font-bold text-gray-900">Service</TableHead>
                                                        <TableHead className="font-bold text-gray-900">Staff</TableHead>
                                                        <TableHead className="font-bold text-gray-900">Date & Time</TableHead>
                                                        <TableHead className="font-bold text-gray-900">Status</TableHead>
                                                        <TableHead className="font-bold text-gray-900">Price</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {bookings.map((booking) => (
                                                        <TableRow key={booking.id}>
                                                            <TableCell className="font-medium">
                                                                <div>{booking.customer_name}</div>
                                                                {booking.customer_email && (
                                                                    <div className="text-xs text-gray-500">{booking.customer_email}</div>
                                                                )}
                                                            </TableCell>
                                                            <TableCell>{booking.service_name}</TableCell>
                                                            <TableCell>{booking.staff_member_name || '-'}</TableCell>
                                                            <TableCell>
                                                                {new Date(booking.booking_datetime).toLocaleDateString()} <br />
                                                                {formatTime(booking.booking_datetime)}
                                                            </TableCell>
                                                            <TableCell>
                                                                <span className={`px-2 py-1 rounded-full text-xs font-medium 
                                                                    ${booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                                                                        booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                                            booking.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                                                                'bg-gray-100 text-gray-700'}`}>
                                                                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                                                </span>
                                                            </TableCell>
                                                            <TableCell>${booking.total_price}</TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    )}
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </div>
        </main>
    )
}
