"use client"

import { useState, useEffect } from "react"
import { BookingDialog, BookingDialogContent, BookingDialogTitle } from "@/components/ui/booking-dialog"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { getDynamicAvailability, type AvailableSlot, type DynamicAvailabilityResponse } from "@/lib/api/schedules"
import { fetchAvailableStaffForService } from "@/lib/api/staff"
import { createDynamicBooking } from "@/lib/api/bookings"
import type { Service } from "@/types/service"
import type { StaffMember } from "@/types/staff"
import { Clock, Loader2, X, Calendar as CalendarIcon, Users, DollarSign, XCircle } from "lucide-react"
import { format } from "date-fns"
import { useAuth, useUser, SignIn } from "@clerk/nextjs"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface BookingModalProps {
    isOpen: boolean
    onClose: () => void
    service: Service | null
    shopId: string
}

interface SlotWithStaff extends AvailableSlot {
    id: string
}

export default function BookingModal({ isOpen, onClose, service, shopId }: BookingModalProps) {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
    const [availabilityData, setAvailabilityData] = useState<DynamicAvailabilityResponse | null>(null)
    const [selectedSlot, setSelectedSlot] = useState<SlotWithStaff | null>(null)
    const [selectedStaffId, setSelectedStaffId] = useState<string>("")
    const [isLoadingSlots, setIsLoadingSlots] = useState(false)
    const [availableStaff, setAvailableStaff] = useState<StaffMember[]>([])
    const { getToken, isSignedIn } = useAuth()
    const { user } = useUser()
    const { toast } = useToast()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showSignInModal, setShowSignInModal] = useState(false)

    useEffect(() => {
        if (isOpen && service) {
            const today = new Date()
            today.setHours(0, 0, 0, 0)
            setSelectedDate(today)
            handleDateSelect(today)
            loadAvailableStaff()
        }
    }, [isOpen, service])

    const loadAvailableStaff = async () => {
        if (!service) return
        try {
            const staff = await fetchAvailableStaffForService(service.id.toString(), shopId)
            setAvailableStaff(staff.filter(s => s.is_active))
        } catch (error) {
            setAvailableStaff([])
        }
    }

    useEffect(() => {
        if (isSignedIn && user) {
            const role = user.unsafeMetadata?.role as string | undefined

            if (!role) {
                toast({
                    title: "Please Sign Up First",
                    description: "You need to complete the signup process to make bookings.",
                    variant: "destructive"
                })

                setShowSignInModal(false)

                window.location.href = '/signup'
                return
            }

            const pendingBooking = localStorage.getItem('pendingBooking')
            if (pendingBooking) {
                try {
                    const bookingData = JSON.parse(pendingBooking)
                    processPendingBooking(bookingData)
                } catch (error) {
                    localStorage.removeItem('pendingBooking')
                }
            }
        }
    }, [isSignedIn, user])

    const handleDateSelect = async (date: Date | undefined) => {
        if (!date || !service) return

        setSelectedDate(date)
        setSelectedSlot(null)
        setSelectedStaffId("")
        setIsLoadingSlots(true)
        setAvailabilityData(null)

        try {
            const formattedDate = format(date, 'yyyy-MM-dd')
            const data = await getDynamicAvailability({
                service_id: service.id.toString(),
                date: formattedDate,
                buffer_minutes_override: 0
            })
            setAvailabilityData(data)
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to load available slots. Please try again.",
                variant: "destructive"
            })
            setAvailabilityData(null)
        } finally {
            setIsLoadingSlots(false)
        }
    }

    const handleSlotSelect = (slot: AvailableSlot, index: number) => {
        const slotWithId: SlotWithStaff = {
            ...slot,
            id: `slot-${index}`
        }
        setSelectedSlot(slotWithId)
        setSelectedStaffId("")
    }

    const getStaffForSlot = (slot: AvailableSlot): StaffMember[] => {
        return slot.available_staff.map(staff => ({
            id: staff.id,
            name: staff.name,
            email: staff.email || '',
            phone: staff.phone || '',
            profile_image_url: staff.profile_image_url || '',
            is_active: true,
            is_primary: staff.is_primary,
            shop: '',
            shop_name: '',
            assigned_services: [],
            created_at: '',
            updated_at: ''
        }))
    }

    const handleBooking = async () => {
        if (!selectedSlot || !selectedDate || !service || !selectedStaffId) return

        if (!isSignedIn) {
            const bookingData = {
                serviceId: service.id.toString(),
                serviceName: service.name,
                date: format(selectedDate, 'yyyy-MM-dd'),
                time: selectedSlot.start_time,
                staffMemberId: selectedStaffId,
                shopId: shopId,
                timestamp: new Date().toISOString()
            }

            localStorage.setItem('pendingBooking', JSON.stringify(bookingData))

            toast({
                title: "Sign in required",
                description: "Please sign in to complete your booking.",
            })

            setShowSignInModal(true)
            return
        }
        await processBooking()
    }

    const processPendingBooking = async (bookingData: any) => {
        try {
            const token = await getToken()
            if (!token) throw new Error("No authentication token found")

            await createDynamicBooking({
                service_id: bookingData.serviceId,
                date: bookingData.date,
                start_time: bookingData.time,
                staff_member_id: bookingData.staffMemberId,
                notes: ""
            }, token)

            toast({
                title: "Booking Confirmed!",
                description: `Your appointment for ${bookingData.serviceName} has been scheduled.`,
            })

            localStorage.removeItem('pendingBooking')

        } catch (error) {
            toast({
                title: "Booking Failed",
                description: error instanceof Error ? error.message : "Failed to create booking. Please try again.",
                variant: "destructive",
            })
            localStorage.removeItem('pendingBooking')
        }
    }

    const processBooking = async () => {
        if (!selectedSlot || !selectedDate || !service || !selectedStaffId) return

        setIsSubmitting(true)

        try {
            const token = await getToken()
            if (!token) throw new Error("No authentication token found")

            const formattedDate = format(selectedDate, 'yyyy-MM-dd')

            const timeMatch = selectedSlot.start_time.match(/T(\d{2}:\d{2}:\d{2})/)
            const timeOnly = timeMatch ? timeMatch[1] : selectedSlot.start_time

            await createDynamicBooking({
                service_id: service.id.toString(),
                date: formattedDate,
                start_time: timeOnly,
                staff_member_id: selectedStaffId,
                notes: ""
            }, token)

            toast({
                title: "Booking Confirmed!",
                description: `Your appointment for ${service.name} has been scheduled for ${format(selectedDate, 'MMM d, yyyy')} at ${formatTime(selectedSlot.start_time)}.`,
            })

            setTimeout(() => {
                handleClose()
            }, 2000)
        } catch (error) {
            toast({
                title: "Booking Failed",
                description: error instanceof Error ? error.message : "Failed to create booking. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleClose = () => {
        setSelectedDate(undefined)
        setAvailabilityData(null)
        setSelectedSlot(null)
        setSelectedStaffId("")
        onClose()
    }

    const formatTime = (timeStr: string): string => {

        const timeMatch = timeStr.match(/T(\d{2}):(\d{2})/)
        if (!timeMatch) return timeStr

        const hours = parseInt(timeMatch[1])
        const minutes = parseInt(timeMatch[2])
        const period = hours >= 12 ? 'PM' : 'AM'
        const displayHours = hours % 12 || 12
        return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`
    }

    if (!service) return null

    return (
        <>
            <BookingDialog open={isOpen} onOpenChange={handleClose}>
                <BookingDialogContent className="max-w-5xl w-[95vw] max-h-[90vh] bg-white border-0 p-0 gap-0 overflow-y-auto shadow-2xl rounded-3xl">
                    {/* Header */}
                    <div className="px-8 py-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                        <div className="relative flex justify-between items-start">
                            <div>
                                <BookingDialogTitle className="text-3xl font-bold text-white mb-2">
                                    Book Appointment
                                </BookingDialogTitle>
                                <p className="text-white/90 text-lg font-medium">
                                    {service.name}
                                </p>
                            </div>
                            <button
                                onClick={handleClose}
                                className="rounded-full p-2 hover:bg-white/20 transition-colors focus:outline-none"
                            >
                                <X className="h-6 w-6 text-white" />
                            </button>
                        </div>

                        <div className="flex items-center gap-6 mt-6 relative">
                            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl">

                                <span className="text-2xl font-bold text-white">
                                    ${parseFloat(service.price).toFixed(0)}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl">
                                <Clock className="w-5 h-5 text-white" />
                                <span className="font-semibold text-white">{service.duration_minutes} mins</span>
                            </div>
                            {availabilityData && (
                                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl">
                                    <Users className="w-5 h-5 text-white" />
                                    <span className="font-semibold text-white">{availabilityData.eligible_staff_count} Staff Available</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                        {/* Date Selection */}
                        <div className="p-8 border-b lg:border-b-0 lg:border-r border-gray-200 bg-gray-50">
                            <div className="flex items-center gap-2 mb-6">
                                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                                    <CalendarIcon className="w-5 h-5 text-blue-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">Select Date</h3>
                            </div>

                            <div className="flex justify-center">
                                <Calendar
                                    mode="single"
                                    selected={selectedDate}
                                    onSelect={handleDateSelect}
                                    disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                                    className="rounded-2xl border-2 border-gray-200 bg-white p-4 shadow-sm"
                                    classNames={{
                                        months: "flex flex-col space-y-4",
                                        month: "space-y-4 w-full",
                                        caption: "flex justify-center pt-1 relative items-center mb-4",
                                        caption_label: "text-lg font-bold text-gray-900",
                                        nav: "space-x-1 flex items-center",
                                        button_previous: "h-10 w-10 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-all",
                                        button_next: "h-10 w-10 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-all",
                                        weekdays: "flex w-full mb-2",
                                        weekday: "text-gray-600 rounded-md w-full font-semibold text-sm flex-1 text-center uppercase tracking-wide",
                                        week: "flex w-full mt-1",
                                        day: "relative p-0.5 text-center flex-1",
                                        day_button: "h-12 w-12 mx-auto p-0 font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all inline-flex items-center justify-center text-base",
                                        selected: "bg-gradient-to-br from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 font-bold shadow-lg",
                                        today: "bg-blue-50 text-blue-600 font-semibold ring-2 ring-blue-200",
                                        outside: "text-gray-300 opacity-50 hover:bg-transparent hover:text-gray-300",
                                        disabled: "text-gray-200 cursor-not-allowed hover:bg-transparent hover:text-gray-200",
                                        hidden: "invisible",
                                    }}
                                />
                            </div>
                        </div>

                        {/* Time & Staff Selection */}
                        <div className="p-8 bg-white">
                            <div className="flex items-center gap-2 mb-6">
                                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                                    <Clock className="w-5 h-5 text-purple-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">Select Time & Staff</h3>
                            </div>

                            {!selectedDate ? (
                                <div className="flex flex-col items-center justify-center h-[400px] text-gray-400 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50">
                                    <CalendarIcon className="w-16 h-16 mb-4 opacity-40" />
                                    <p className="text-base font-semibold">Select a date to view available slots</p>
                                </div>
                            ) : isLoadingSlots ? (
                                <div className="flex items-center justify-center h-[400px] border-2 border-gray-200 rounded-2xl bg-gray-50">
                                    <div className="text-center">
                                        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-3" />
                                        <p className="text-gray-600 font-medium">Loading available slots...</p>
                                    </div>
                                </div>
                            ) : !availabilityData || !availabilityData.is_shop_open ? (
                                <div className="flex flex-col items-center justify-center h-[400px] text-gray-400 border-2 border-gray-200 rounded-2xl bg-gray-50">
                                    <XCircle className="w-16 h-16 mb-4 text-red-400" />
                                    <p className="text-base font-semibold text-gray-600">Shop is closed on this date</p>
                                </div>
                            ) : availabilityData.available_slots.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-[400px] text-gray-400 border-2 border-gray-200 rounded-2xl bg-gray-50">
                                    <Clock className="w-16 h-16 mb-4 opacity-40" />
                                    <p className="text-base font-semibold text-gray-600">No slots available for this date</p>
                                </div>
                            ) : (
                                <div className="space-y-5 h-full flex flex-col">
                                    <div className={`grid grid-cols-2 gap-3 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent ${selectedSlot ? 'max-h-[280px]' : 'max-h-[480px]'}`}>
                                        {availabilityData.available_slots
                                            .filter(slot => {
                                                if (!selectedDate) return true

                                                const today = new Date()
                                                const slotDate = new Date(selectedDate)

                                                const isToday = slotDate.getDate() === today.getDate() &&
                                                    slotDate.getMonth() === today.getMonth() &&
                                                    slotDate.getFullYear() === today.getFullYear()

                                                if (!isToday) return true

                                                const slotTime = new Date(slot.start_time)
                                                return slotTime > today
                                            })
                                            .map((slot, index) => {
                                                const isSelected = selectedSlot?.id === `slot-${index}`
                                                const startTime = formatTime(slot.start_time)

                                                return (
                                                    <button
                                                        key={index}
                                                        onClick={() => handleSlotSelect(slot, index)}
                                                        className={`
                                                        px-4 py-4 rounded-xl text-sm font-semibold transition-all duration-200 flex flex-col items-start gap-2 w-full border-2
                                                        ${isSelected
                                                                ? 'bg-gradient-to-br from-blue-600 to-purple-600 text-white border-transparent shadow-lg'
                                                                : 'bg-white text-gray-700 hover:bg-blue-50 hover:border-blue-300 border-gray-200 hover:shadow-md'
                                                            }
                                                    `}
                                                    >
                                                        <span className="text-lg font-bold">{startTime}</span>
                                                        <div className={`flex items-center gap-1.5 text-xs ${isSelected ? 'text-white/90' : 'text-purple-600'}`}>
                                                            <Users className="w-3.5 h-3.5" />
                                                            <span className="font-semibold">{slot.available_staff_count} available</span>
                                                        </div>
                                                    </button>
                                                )
                                            })}
                                    </div>

                                    {/* Staff Selection */}
                                    {selectedSlot && (
                                        <div className="space-y-3 pt-4 border-t-2 border-gray-200">
                                            <label className="block text-sm font-bold text-gray-900">
                                                Select Staff Member <span className="text-red-500">*</span>
                                            </label>
                                            <Select value={selectedStaffId} onValueChange={setSelectedStaffId}>
                                                <SelectTrigger className="w-full h-12 bg-gray-50 border-2 border-gray-200 text-gray-900 hover:border-blue-300 rounded-xl font-medium">
                                                    <SelectValue placeholder="Choose a staff member" />
                                                </SelectTrigger>
                                                <SelectContent className="bg-white border-2 border-gray-200 rounded-xl">
                                                    {getStaffForSlot(selectedSlot).map((staff) => (
                                                        <SelectItem
                                                            key={staff.id}
                                                            value={staff.id}
                                                            className="text-gray-900 hover:bg-blue-50 focus:bg-blue-50 font-medium py-3"
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                <Users className="w-4 h-4 text-purple-600" />
                                                                {staff.name}
                                                            </div>
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-between items-center px-8 py-6 bg-gray-50 border-t-2 border-gray-200">
                        <div className="text-sm text-gray-600">
                            {selectedDate && selectedSlot && selectedStaffId ? (
                                <span className="font-medium">
                                    <span className="text-gray-500">Selected:</span>{" "}
                                    <span className="text-gray-900 font-bold">{format(selectedDate, 'MMM d, yyyy')}</span>{" "}
                                    <span className="text-gray-500">at</span>{" "}
                                    <span className="text-gray-900 font-bold">{formatTime(selectedSlot.start_time)}</span>
                                    {selectedStaffId && (
                                        <>
                                            <span className="text-gray-500"> with </span>
                                            <span className="text-gray-900 font-bold">{availableStaff.find(s => s.id === selectedStaffId)?.name}</span>
                                        </>
                                    )}
                                </span>
                            ) : (
                                <span>Select a date, time, and staff member to continue</span>
                            )}
                        </div>
                        <div className="flex gap-3">
                            <Button
                                onClick={handleClose}
                                variant="outline"
                                className="px-6 h-12 border-2 border-gray-300 hover:bg-gray-100 text-gray-700 font-semibold rounded-xl"
                                disabled={isSubmitting}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleBooking}
                                disabled={!selectedSlot || !selectedDate || !selectedStaffId || isSubmitting}
                                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 h-12 shadow-lg rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition-all font-bold text-base"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        Booking...
                                    </>
                                ) : (
                                    "Confirm Booking"
                                )}
                            </Button>
                        </div>
                    </div>
                </BookingDialogContent>
            </BookingDialog>

            <Dialog open={showSignInModal} onOpenChange={setShowSignInModal}>
                <DialogContent className="sm:max-w-[425px] bg-white p-0 gap-0 rounded-2xl">
                    <div className="flex flex-col items-center justify-center p-6">
                        <SignIn
                            appearance={{
                                elements: {
                                    rootBox: "w-full",
                                    card: "shadow-none w-full"
                                }
                            }}
                            afterSignInUrl={window.location.pathname}
                            afterSignUpUrl={window.location.pathname}
                        />
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}
