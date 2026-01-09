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
import type { Deal } from "@/types/deal"
import { getDealAvailableSlots, bookDeal } from "@/lib/api/deals"
import { Clock, Loader2, X, Calendar as CalendarIcon, Users, DollarSign, XCircle, Check } from "lucide-react"
import { format } from "date-fns"
import { useAuth, useUser, SignIn } from "@clerk/nextjs"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
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
    deal?: Deal | null
    shopId: string
}

interface SlotWithStaff extends AvailableSlot {
    id: string
}

export default function BookingModal({ isOpen, onClose, service, deal, shopId }: BookingModalProps) {
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
        if (isOpen && (service || deal)) {
            const today = new Date()
            today.setHours(0, 0, 0, 0)
            setSelectedDate(today)
            handleDateSelect(today)
        }
    }, [isOpen, service, deal])

    useEffect(() => {
        if (service) {
            loadAvailableStaff()
        } else {
            setAvailableStaff([])
        }
    }, [service, shopId])

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
        if (!date || (!service && !deal)) return

        setSelectedDate(date)
        setSelectedSlot(null)
        setSelectedStaffId("")
        setIsLoadingSlots(true)
        setAvailabilityData(null)

        try {
            const formattedDate = format(date, 'yyyy-MM-dd')

            if (deal) {
                const token = await getToken()

                const validToken = token || ""
                const data = await getDealAvailableSlots(deal.id, formattedDate, validToken)

                if (data.slots && Array.isArray(data.slots)) {
                    setAvailabilityData({
                        shop_id: shopId,
                        shop_name: deal.shop_name || "",
                        service_id: deal.id,
                        service_name: deal.name,
                        service_duration_minutes: data.deal_duration_minutes || 60,
                        date: formattedDate,
                        is_shop_open: true,
                        shop_hours: {
                            start_time: data.shop_open || "09:00",
                            end_time: data.shop_close || "21:00",
                            slot_duration_minutes: 60,
                            day_of_week: ""
                        },
                        available_slots: data.slots.map((s: any) => ({
                            start_time: s.start_time,
                            end_time: s.end_time,
                            available_staff: [],
                            available_staff_count: s.slots_left
                        })),
                        total_available_slots: data.slots.length,
                        eligible_staff_count: 0
                    })
                } else if (Array.isArray(data)) {
                    setAvailabilityData({
                        shop_id: shopId,
                        shop_name: deal.shop_name || "",
                        service_id: deal.id,
                        service_name: deal.name,
                        service_duration_minutes: 60,
                        date: formattedDate,
                        is_shop_open: true,
                        shop_hours: { start_time: "09:00", end_time: "17:00", slot_duration_minutes: 60, day_of_week: "" },
                        available_slots: data,
                        total_available_slots: data.length,
                        eligible_staff_count: 0
                    })
                } else {
                    setAvailabilityData(data)
                }
            } else if (service) {
                const data = await getDynamicAvailability({
                    service_id: service.id.toString(),
                    date: formattedDate,
                    buffer_minutes_override: 0
                })
                setAvailabilityData(data)
            }
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
        if (!selectedSlot || !selectedDate || (!service && !deal)) return

        // If staff is available and required, check it
        const staffOptions = selectedSlot ? getStaffForSlot(selectedSlot) : [];
        if (!deal && staffOptions.length > 0 && !selectedStaffId) return;

        if (!deal && availableStaff.length > 0 && !selectedStaffId) return;

        if (!isSignedIn) {
            const bookingData = {
                serviceId: service?.id.toString() || deal?.id || "",
                serviceName: service?.name || deal?.name || "",
                date: format(selectedDate, 'yyyy-MM-dd'),
                time: selectedSlot.start_time,
                staffMemberId: selectedStaffId,
                shopId: shopId,
                timestamp: new Date().toISOString(),
                isDeal: !!deal
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

            if (bookingData.isDeal) {
                await bookDeal({
                    deal_id: bookingData.serviceId,
                    date: bookingData.date,
                    start_time: bookingData.time,
                    staff_member_id: bookingData.staffMemberId || undefined,
                    notes: ""
                }, token)
            } else {
                await createDynamicBooking({
                    service_id: bookingData.serviceId,
                    date: bookingData.date,
                    start_time: bookingData.time,
                    staff_member_id: bookingData.staffMemberId || undefined,
                    notes: ""
                }, token)
            }

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
        if (!selectedSlot || !selectedDate || (!service && !deal)) return
        if (!deal && !selectedStaffId) return

        setIsSubmitting(true)

        try {
            const token = await getToken()
            if (!token) throw new Error("No authentication token found")

            const formattedDate = format(selectedDate, 'yyyy-MM-dd')

            const timeMatch = selectedSlot.start_time.match(/T(\d{2}:\d{2}:\d{2})/)
            const timeOnly = timeMatch ? timeMatch[1] : selectedSlot.start_time

            if (deal) {
                await bookDeal({
                    deal_id: deal.id,
                    date: formattedDate,
                    start_time: timeOnly,
                    staff_member_id: selectedStaffId || undefined,
                    notes: ""
                }, token)
            } else if (service) {
                await createDynamicBooking({
                    service_id: service.id.toString(),
                    date: formattedDate,
                    start_time: timeOnly,
                    staff_member_id: selectedStaffId,
                    notes: ""
                }, token)
            }

            toast({
                title: "Booking Confirmed!",
                description: `Your appointment for ${service?.name || deal?.name} has been scheduled for ${format(selectedDate, 'MMM d, yyyy')} at ${formatTime(selectedSlot.start_time)}.`,
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

    if (!service && !deal) return null

    const itemName = service?.name || deal?.name
    const itemPrice = service?.price || deal?.price || "0"
    const itemDuration = service?.duration_minutes || deal?.duration_minutes || 60

    return (
        <>
            <BookingDialog open={isOpen} onOpenChange={handleClose}>
                <BookingDialogContent className="max-w-3xl w-[90vw] max-h-[85vh] bg-white border-0 p-0 gap-0 overflow-y-auto shadow-2xl rounded-2xl">
                    {/* Header - Cleaned Up */}
                    <div className="px-6 py-5 border-b border-gray-100 bg-white sticky top-0 z-10">
                        <div className="flex justify-between items-start">
                            <div>
                                <BookingDialogTitle className="text-xl font-bold text-gray-900 mb-1">
                                    Book Appointment
                                </BookingDialogTitle>
                                <p className="text-gray-500 text-sm font-medium">
                                    {itemName}
                                </p>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleClose}
                                className="rounded-full hover:bg-gray-100 -mr-2 text-gray-400 hover:text-gray-600"
                            >
                                <X className="h-5 w-5" />
                            </Button>
                        </div>

                        <div className="flex items-center gap-3 mt-4">
                            <Badge variant="secondary" className="px-3 py-1 flex items-center gap-1.5 bg-gray-100 text-gray-700 font-medium">
                                <DollarSign className="w-3.5 h-3.5 text-gray-500" />
                                {parseFloat(itemPrice).toFixed(0)}
                            </Badge>
                            <Badge variant="secondary" className="px-3 py-1 flex items-center gap-1.5 bg-gray-100 text-gray-700 font-medium">
                                <Clock className="w-3.5 h-3.5 text-gray-500" />
                                {itemDuration} min
                            </Badge>
                            {availabilityData && availabilityData.eligible_staff_count > 0 && (
                                <Badge variant="secondary" className="px-3 py-1 flex items-center gap-1.5 bg-blue-50 text-blue-700 font-medium">
                                    <Users className="w-3.5 h-3.5 text-blue-500" />
                                    {availabilityData.eligible_staff_count} Staff
                                </Badge>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 h-[550px]">
                        {/* Date Selection */}
                        <div className="p-6 border-b lg:border-b-0 lg:border-r border-gray-100 bg-gray-50/50 flex flex-col">
                            <div className="flex items-center gap-2 mb-4 shrink-0">
                                <CalendarIcon className="w-4 h-4 text-gray-500" />
                                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Select Date</h3>
                            </div>

                            <div className="flex justify-center bg-white rounded-xl border border-gray-100 p-4 shadow-sm flex-1 items-center">
                                <Calendar
                                    mode="single"
                                    selected={selectedDate}
                                    onSelect={handleDateSelect}
                                    disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                                    className="p-0"
                                    classNames={{
                                        months: "flex flex-col space-y-4",
                                        month: "space-y-4 w-full",
                                        caption: "flex justify-center pt-1 relative items-center mb-2",
                                        caption_label: "text-sm font-bold text-gray-900",
                                        nav: "space-x-1 flex items-center",
                                        button_previous: "h-7 w-7 bg-transparent hover:bg-gray-100 text-gray-500 hover:text-gray-900 rounded-md transition-colors",
                                        button_next: "h-7 w-7 bg-transparent hover:bg-gray-100 text-gray-500 hover:text-gray-900 rounded-md transition-colors",
                                        weekdays: "flex w-full mb-2",
                                        weekday: "text-gray-400 rounded-md w-full font-medium text-[0.7rem] flex-1 text-center uppercase tracking-wider",
                                        week: "flex w-full mt-1",
                                        day: "relative p-0 text-center flex-1",
                                        day_button: "h-8 w-8 mx-auto p-0 font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all inline-flex items-center justify-center text-sm",
                                        selected: "bg-blue-600 text-white hover:bg-blue-700 font-bold shadow-md hover:text-white",
                                        today: "text-blue-600 font-bold bg-blue-50",
                                        outside: "text-gray-300 opacity-50 hover:bg-transparent hover:text-gray-300",
                                        disabled: "text-gray-200 cursor-not-allowed hover:bg-transparent hover:text-gray-200",
                                        hidden: "invisible",
                                    }}
                                />
                            </div>
                        </div>

                        {/* Time & Staff Selection */}
                        <div className="p-6 bg-white flex flex-col h-full overflow-hidden">
                            <div className="flex items-center gap-2 mb-4 shrink-0">
                                <Clock className="w-4 h-4 text-gray-500" />
                                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">{deal ? "Select Time" : "Select Time & Staff"}</h3>
                            </div>

                            <div className="flex-1 overflow-hidden flex flex-col">
                                {!selectedDate ? (
                                    <div className="flex flex-col items-center justify-center h-full text-gray-400 border border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                                        <CalendarIcon className="w-10 h-10 mb-3 opacity-20" />
                                        <p className="text-sm font-medium text-gray-500">Select a date first</p>
                                    </div>
                                ) : isLoadingSlots ? (
                                    <div className="flex flex-col items-center justify-center h-full">
                                        <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-3" />
                                        <p className="text-sm text-gray-500">Checking availability...</p>
                                    </div>
                                ) : !availabilityData || !availabilityData.is_shop_open ? (
                                    <div className="flex flex-col items-center justify-center h-full text-gray-400 border border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                                        <XCircle className="w-10 h-10 mb-3 text-gray-300" />
                                        <p className="text-sm font-medium text-gray-500">Shop is closed on this date</p>
                                    </div>
                                ) : availabilityData.available_slots.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full text-gray-400 border border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                                        <Clock className="w-10 h-10 mb-3 opacity-20" />
                                        <p className="text-sm font-medium text-gray-500">No fully open slots</p>
                                    </div>
                                ) : (
                                    <div className="flex flex-col h-full gap-4">
                                        <div className={`grid grid-cols-2 sm:grid-cols-3 gap-2 overflow-y-auto pr-1 flex-1 content-start`}>
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
                                                        px-2 py-2.5 rounded-lg text-xs font-medium transition-all duration-200 flex flex-col items-center gap-1 w-full border relative
                                                        ${isSelected
                                                                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm ring-2 ring-blue-100 ring-offset-1'
                                                                    : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-200 hover:border-gray-300'
                                                                }
                                                    `}
                                                        >
                                                            <span className="text-sm font-bold">{startTime}</span>
                                                            <span className={`text-[10px] ${isSelected ? 'text-blue-100' : 'text-gray-400'}`}>
                                                                {slot.available_staff_count} spots
                                                            </span>
                                                        </button>
                                                    )
                                                })}
                                        </div>

                                        {/* Staff Selection in Right Panel */}
                                        {selectedSlot && getStaffForSlot(selectedSlot).length > 0 && (
                                            <div className="space-y-2 pt-2 border-t border-gray-100 shrink-0">
                                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                                    Professional
                                                </label>
                                                <Select value={selectedStaffId} onValueChange={setSelectedStaffId}>
                                                    <SelectTrigger className="w-full h-10 bg-white border border-gray-200 text-gray-900 rounded-lg">
                                                        <SelectValue placeholder="Anyone available" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {getStaffForSlot(selectedSlot).map((staff) => (
                                                            <SelectItem key={staff.id} value={staff.id}>
                                                                <div className="flex items-center gap-2">
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
                    </div>

                    {/* Footer */}
                    <div className="flex flex-col sm:flex-row justify-between items-center px-6 py-4 bg-gray-50 border-t border-gray-200 gap-4">
                        <div className="text-sm text-gray-600 w-full sm:w-auto text-center sm:text-left">
                            {selectedDate && selectedSlot && (selectedStaffId || !deal) ? (
                                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                                    <span className="font-semibold text-gray-900 border-b border-gray-300 pb-0.5 inline-block">{format(selectedDate, 'MMM d, yyyy')}</span>
                                    <span className="hidden sm:inline text-gray-300">•</span>
                                    <span className="font-semibold text-gray-900">{formatTime(selectedSlot.start_time)}</span>
                                    {selectedStaffId && (
                                        <>
                                            <span className="hidden sm:inline text-gray-300">•</span>
                                            <span className="text-gray-600">
                                                with <span className="font-medium text-gray-900">{availableStaff.find(s => s.id === selectedStaffId)?.name ||
                                                    selectedSlot.available_staff.find(s => s.id === selectedStaffId)?.name}</span>
                                            </span>
                                        </>
                                    )}
                                </div>
                            ) : (
                                <span className="text-gray-400 italic">Select date & time to continue</span>
                            )}
                        </div>
                        <div className="flex gap-2 w-full sm:w-auto">
                            <Button
                                onClick={handleClose}
                                variant="outline"
                                className="px-4 h-10 border-gray-300 text-gray-700 hover:bg-gray-100 rounded-lg flex-1 sm:flex-none"
                                disabled={isSubmitting}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleBooking}
                                disabled={!selectedSlot || !selectedDate || (!deal && !selectedStaffId) || isSubmitting}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 h-10 rounded-lg shadow-sm flex-1 sm:flex-none disabled:opacity-50"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Processing...
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
