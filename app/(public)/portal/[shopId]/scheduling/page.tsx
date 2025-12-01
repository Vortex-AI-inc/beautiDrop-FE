"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar, Loader2, Trash2, Edit2, Clock, Plus, Sparkles } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@clerk/nextjs"
import { fetchShopSchedules, createSchedule, updateSchedule, deleteSchedule, generateTimeSlots } from "@/lib/api/schedules"
import type { Schedule } from "@/types/schedule"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"

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
    const [isLoading, setIsLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null)

    const [formData, setFormData] = useState({
        day_of_week: "",
        start_time: "",
        end_time: "",
        slot_duration_minutes: "30"
    })

    const [timeSlotData, setTimeSlotData] = useState({
        start_date: "",
        end_date: ""
    })

    const [isGenerating, setIsGenerating] = useState(false)

    useEffect(() => {
        loadSchedules()
    }, [shopId])

    const loadSchedules = async () => {
        try {
            setIsLoading(true)
            const token = await getToken()
            if (!token) return

            const data = await fetchShopSchedules(shopId, token)
            setSchedules(data)
        } catch (error) {
            console.error("Failed to load schedules", error)
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
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const handleSubmit = async () => {
        if (isSubmitting) return

        if (!formData.day_of_week || !formData.start_time || !formData.end_time || !formData.slot_duration_minutes) {
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
                    description: "You must be logged in to manage schedules.",
                    variant: "destructive"
                })
                return
            }

            const payload = {
                shop_id: shopId,
                day_of_week: formData.day_of_week,
                start_time: formData.start_time,
                end_time: formData.end_time,
                slot_duration_minutes: parseInt(formData.slot_duration_minutes),
                is_active: true
            }

            if (editingSchedule) {
                const updatedSchedule = await updateSchedule(editingSchedule.id, payload, token)
                setSchedules(prev => prev.map(s => s.id === editingSchedule.id ? updatedSchedule : s))
                toast({
                    title: "Success",
                    description: "Schedule updated successfully.",
                })
                setIsEditModalOpen(false)
            } else {
                const newSchedule = await createSchedule(payload, token)
                setSchedules(prev => [...prev, newSchedule])
                toast({
                    title: "Success",
                    description: "Schedule created successfully.",
                })
                setFormData({
                    day_of_week: "",
                    start_time: "",
                    end_time: "",
                    slot_duration_minutes: "30"
                })
            }
        } catch (error: any) {
            console.error("Failed to save schedule", error)
            toast({
                title: "Error",
                description: error.message || "Failed to save schedule. Please try again.",
                variant: "destructive"
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleEditClick = (schedule: Schedule) => {
        setEditingSchedule(schedule)
        setFormData({
            day_of_week: schedule.day_of_week,
            start_time: schedule.start_time,
            end_time: schedule.end_time,
            slot_duration_minutes: schedule.slot_duration_minutes.toString()
        })
        setIsEditModalOpen(true)
    }

    const handleDeleteSchedule = async (id: number) => {
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

    const handleToggleActive = async (id: number, currentStatus: boolean) => {
        try {
            const token = await getToken()
            if (!token) return

            setSchedules(prev => prev.map(s => s.id === id ? { ...s, is_active: !currentStatus } : s))

            await updateSchedule(id, { is_active: !currentStatus }, token)

            toast({
                title: "Status updated",
                description: `Schedule is now ${!currentStatus ? 'active' : 'inactive'}.`,
            })
        } catch (error) {
            console.error("Failed to toggle schedule status", error)
            setSchedules(prev => prev.map(s => s.id === id ? { ...s, is_active: currentStatus } : s))
            toast({
                title: "Error",
                description: "Failed to update status. Please try again.",
                variant: "destructive"
            })
        }
    }

    const handleGenerateTimeSlots = async () => {
        if (!timeSlotData.start_date || !timeSlotData.end_date) {
            toast({
                title: "Error",
                description: "Please select both start and end dates.",
                variant: "destructive"
            })
            return
        }

        try {
            setIsGenerating(true)
            const token = await getToken()
            if (!token) {
                toast({
                    title: "Error",
                    description: "You must be logged in to generate time slots.",
                    variant: "destructive"
                })
                return
            }

            await generateTimeSlots({
                shop_id: shopId,
                start_date: timeSlotData.start_date,
                end_date: timeSlotData.end_date
            }, token)

            toast({
                title: "Success",
                description: "Time slots generated successfully.",
            })

            setTimeSlotData({
                start_date: "",
                end_date: ""
            })
        } catch (error: any) {
            console.error("Failed to generate time slots", error)
            toast({
                title: "Error",
                description: error.message || "Failed to generate time slots. Please try again.",
                variant: "destructive"
            })
        } finally {
            setIsGenerating(false)
        }
    }

    const groupedSchedules = DAYS_OF_WEEK.reduce((acc, day) => {
        acc[day] = schedules.filter(s => s.day_of_week === day)
        return acc
    }, {} as Record<string, Schedule[]>)

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
                                    <h2 className="text-lg font-bold text-gray-900">Add New Schedule</h2>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                                <div className="space-y-2">
                                    <Label htmlFor="day_of_week">Day of Week</Label>
                                    <Select value={formData.day_of_week} onValueChange={(value) => handleInputChange('day_of_week', value)}>
                                        <SelectTrigger id="day_of_week">
                                            <SelectValue placeholder="Select day" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {DAYS_OF_WEEK.map((day) => (
                                                <SelectItem key={day} value={day}>
                                                    {day.charAt(0).toUpperCase() + day.slice(1)}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="start_time">Start Time</Label>
                                    <Input
                                        id="start_time"
                                        type="time"
                                        value={formData.start_time}
                                        onChange={(e) => handleInputChange('start_time', e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="end_time">End Time</Label>
                                    <Input
                                        id="end_time"
                                        type="time"
                                        value={formData.end_time}
                                        onChange={(e) => handleInputChange('end_time', e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="slot_duration">Slot Duration (min)</Label>
                                    <Input
                                        id="slot_duration"
                                        type="number"
                                        min="15"
                                        step="15"
                                        value={formData.slot_duration_minutes}
                                        onChange={(e) => handleInputChange('slot_duration_minutes', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <Button
                                    className="bg-blue-600 hover:bg-blue-700 text-white"
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    ) : (
                                        <Plus className="w-4 h-4 mr-2" />
                                    )}
                                    {isSubmitting ? "Adding..." : "Add Schedule"}
                                </Button>
                            </div>
                        </div>

                        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                            <DialogContent className="sm:max-w-[600px]">
                                <DialogHeader>
                                    <DialogTitle>Edit Schedule</DialogTitle>
                                    <DialogDescription>
                                        Make changes to your schedule here. Click save when you're done.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="edit-day">Day of Week</Label>
                                            <Select value={formData.day_of_week} onValueChange={(value) => handleInputChange('day_of_week', value)}>
                                                <SelectTrigger id="edit-day">
                                                    <SelectValue placeholder="Select day" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {DAYS_OF_WEEK.map((day) => (
                                                        <SelectItem key={day} value={day}>
                                                            {day.charAt(0).toUpperCase() + day.slice(1)}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="edit-slot">Slot Duration (min)</Label>
                                            <Input
                                                id="edit-slot"
                                                type="number"
                                                min="15"
                                                step="15"
                                                value={formData.slot_duration_minutes}
                                                onChange={(e) => handleInputChange('slot_duration_minutes', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="edit-start">Start Time</Label>
                                            <Input
                                                id="edit-start"
                                                type="time"
                                                value={formData.start_time}
                                                onChange={(e) => handleInputChange('start_time', e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="edit-end">End Time</Label>
                                            <Input
                                                id="edit-end"
                                                type="time"
                                                value={formData.end_time}
                                                onChange={(e) => handleInputChange('end_time', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
                                    <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-blue-600 text-white">
                                        {isSubmitting ? "Saving..." : "Save Changes"}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="bg-teal-500 px-6 py-4 flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-white" />
                                <h2 className="text-lg font-bold text-white">Weekly Schedule</h2>
                            </div>

                            {isLoading ? (
                                <div className="p-12 flex flex-col items-center justify-center">
                                    <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-4" />
                                    <p className="text-gray-600">Loading schedules...</p>
                                </div>
                            ) : schedules.length === 0 ? (
                                <div className="p-12 text-center">
                                    <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Schedules Yet</h3>
                                    <p className="text-gray-600">Start by adding your first schedule above.</p>
                                </div>
                            ) : (
                                <div className="p-6">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="font-bold text-gray-900">Day</TableHead>
                                                <TableHead className="font-bold text-gray-900">Start Time</TableHead>
                                                <TableHead className="font-bold text-gray-900">End Time</TableHead>
                                                <TableHead className="font-bold text-gray-900">Slot Duration</TableHead>
                                                <TableHead className="font-bold text-gray-900">Status</TableHead>
                                                <TableHead className="text-right font-bold text-gray-900">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {DAYS_OF_WEEK.map((day) => {
                                                const daySchedules = groupedSchedules[day]
                                                if (daySchedules.length === 0) return null

                                                return daySchedules.map((schedule) => (
                                                    <TableRow key={schedule.id}>
                                                        <TableCell className="font-medium capitalize">{schedule.day_of_week}</TableCell>
                                                        <TableCell>{schedule.start_time}</TableCell>
                                                        <TableCell>{schedule.end_time}</TableCell>
                                                        <TableCell>{schedule.slot_duration_minutes} min</TableCell>
                                                        <TableCell>
                                                            <div className="flex items-center gap-2">
                                                                <Label htmlFor={`active-${schedule.id}`} className="text-xs text-gray-500">
                                                                    {schedule.is_active ? "Active" : "Inactive"}
                                                                </Label>
                                                                <Switch
                                                                    id={`active-${schedule.id}`}
                                                                    checked={schedule.is_active}
                                                                    onCheckedChange={() => handleToggleActive(schedule.id, schedule.is_active)}
                                                                />
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <div className="flex items-center justify-end gap-1">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => handleEditClick(schedule)}
                                                                    className="h-8 px-2 text-gray-500 hover:text-blue-600"
                                                                >
                                                                    <Edit2 className="w-3 h-3" />
                                                                </Button>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => handleDeleteSchedule(schedule.id)}
                                                                    className="h-8 px-2 text-red-500 hover:text-red-700 hover:bg-red-50 text-xs font-medium"
                                                                >
                                                                    <Trash2 className="w-3 h-3 mr-1" />
                                                                    Delete
                                                                </Button>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            })}
                                        </TableBody>
                                    </Table>
                                </div>
                            )}
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <div className="flex items-center gap-2 mb-6">
                                <Sparkles className="w-5 h-5 text-purple-600" />
                                <h2 className="text-lg font-bold text-gray-900">Generate Time Slots</h2>
                            </div>
                            <p className="text-sm text-gray-600 mb-6">
                                Generate available time slots based on your schedules for a specific date range.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="start_date">Start Date</Label>
                                    <Input
                                        id="start_date"
                                        type="date"
                                        value={timeSlotData.start_date}
                                        onChange={(e) => setTimeSlotData(prev => ({ ...prev, start_date: e.target.value }))}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="end_date">End Date</Label>
                                    <Input
                                        id="end_date"
                                        type="date"
                                        value={timeSlotData.end_date}
                                        onChange={(e) => setTimeSlotData(prev => ({ ...prev, end_date: e.target.value }))}
                                    />
                                </div>

                                <div className="flex items-end">
                                    <Button
                                        className="bg-purple-600 hover:bg-purple-700 text-white w-full"
                                        onClick={handleGenerateTimeSlots}
                                        disabled={isGenerating}
                                    >
                                        {isGenerating ? (
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        ) : (
                                            <Sparkles className="w-4 h-4 mr-2" />
                                        )}
                                        {isGenerating ? "Generating..." : "Generate Slots"}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
