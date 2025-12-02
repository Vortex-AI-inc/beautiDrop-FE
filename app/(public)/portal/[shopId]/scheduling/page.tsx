"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar, Loader2, Trash2, Clock, Plus } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@clerk/nextjs"
import { fetchShopSchedules, deleteSchedule, generateTimeSlots, fetchTimeSlots } from "@/lib/api/schedules"
import type { Schedule, TimeSlot } from "@/types/schedule"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

const DAYS_OF_WEEK = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday"
]

export default function SchedulingPage() {
    const params = useParams()
    const shopId = params.shopId as string
    const { toast } = useToast()
    const { getToken } = useAuth()

    const [schedules, setSchedules] = useState<Schedule[]>([])
    const [timeSlots, setTimeSlots] = useState<Schedule[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const [slotFormData, setSlotFormData] = useState({
        date: "",
        start_time: "",
        end_time: ""
    })

    useEffect(() => {
        loadData()
    }, [shopId])

    const loadData = async () => {
        try {
            setIsLoading(true)
            const token = await getToken()
            if (!token) return

            const schedulesData = await fetchShopSchedules(shopId, token)

            console.log('Schedules Data:', schedulesData)

            setSchedules(schedulesData)
            setTimeSlots(schedulesData) // Use schedules data for time slots display
        } catch (error) {
            console.error("Failed to load data", error)
            toast({
                title: "Error",
                description: "Failed to load schedules. Please try again.",
                variant: "destructive"
            })
        } finally {
            setIsLoading(false)
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

            const result = await generateTimeSlots({
                shop_id: shopId,
                start_date: slotFormData.date,
                day_name: dayName,
                start_time: `${slotFormData.start_time}:00.000Z`,
                end_time: `${slotFormData.end_time}:00.000Z`
            }, token)

            toast({
                title: "Success",
                description: result.message || "Time slots generated successfully.",
            })

            setSlotFormData({
                date: "",
                start_time: "",
                end_time: ""
            })

            await loadData()
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


    const handleDeleteSchedule = async (id: string) => {
        try {
            const token = await getToken()
            if (!token) return

            await deleteSchedule(id, token)
            setSchedules(prev => prev.filter(s => s.id !== id))
            toast({
                title: "Success",
                description: "Schedule deleted successfully.",
            })
        } catch (error) {
            console.error("Failed to delete schedule", error)
            toast({
                title: "Error",
                description: "Failed to delete schedule. Please try again.",
                variant: "destructive"
            })
        }
    }

    const convertTo12Hour = (time24: string) => {
        if (!time24) return ''
        const [hours, minutes] = time24.split(':')
        const hour = parseInt(hours)
        const ampm = hour >= 12 ? 'PM' : 'AM'
        const hour12 = hour % 12 || 12
        return `${hour12}:${minutes} ${ampm}`
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
                                Manage your business hours and generate time slots for appointments.
                            </p>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-blue-600" />
                                    <h2 className="text-lg font-bold text-gray-900">Add New Slot</h2>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
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
                                            Add Slots
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>


                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="bg-teal-500 px-6 py-4 flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-white" />
                                <h2 className="text-lg font-bold text-white">Generated Time Slots</h2>
                            </div>

                            {isLoading ? (
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
                                                <TableHead className="font-bold text-gray-900">Day of Week</TableHead>
                                                <TableHead className="font-bold text-gray-900">Time Range</TableHead>
                                                <TableHead className="font-bold text-gray-900">Slot Duration</TableHead>
                                                <TableHead className="font-bold text-gray-900">Next Occurrence</TableHead>
                                                <TableHead className="font-bold text-gray-900">Status</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {timeSlots.map((slot: any) => (
                                                <TableRow key={slot.id}>
                                                    <TableCell className="font-medium capitalize">{slot.day_of_week}</TableCell>
                                                    <TableCell>{convertTo12Hour(slot.start_time)} - {convertTo12Hour(slot.end_time)}</TableCell>
                                                    <TableCell>{slot.slot_duration_minutes} min</TableCell>
                                                    <TableCell>{slot.next_occurrence ? new Date(slot.next_occurrence).toLocaleDateString() : 'N/A'}</TableCell>
                                                    <TableCell>
                                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${slot.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                                                            {slot.is_active ? 'Active' : 'Inactive'}
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
                </div>
            </div>
        </main>
    )
}
