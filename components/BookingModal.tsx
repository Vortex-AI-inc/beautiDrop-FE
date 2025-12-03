"use client"

import { useState, useEffect } from "react"
import { BookingDialog, BookingDialogContent } from "@/components/ui/booking-dialog"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { fetchPublicTimeSlots } from "@/lib/api/schedules"
import { fetchAvailableStaffForService } from "@/lib/api/staff"
import type { Service } from "@/types/service"
import type { TimeSlot } from "@/types/schedule"
import type { StaffMember } from "@/types/staff"
import { Clock, Loader2, X, ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react"
import { format } from "date-fns"

import { useAuth, useUser, SignIn } from "@clerk/nextjs"
import { useToast } from "@/components/ui/use-toast"
import { createBooking } from "@/lib/api/bookings"
import { Dialog, DialogContent } from "@/components/ui/dialog"

interface BookingModalProps {
    isOpen: boolean
    onClose: () => void
    service: Service | null
    shopId: string
}

export default function BookingModal({ isOpen, onClose, service, shopId }: BookingModalProps) {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
    const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])
    const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null)
    const [isLoadingSlots, setIsLoadingSlots] = useState(false)
    const [availableStaff, setAvailableStaff] = useState<StaffMember[]>([])
    const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null)
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
            console.error('Failed to fetch available staff:', error)
            setAvailableStaff([])
        }
    }

    useEffect(() => {
        if (isSignedIn && user) {
            const pendingBooking = localStorage.getItem('pendingBooking')
            if (pendingBooking) {
                try {
                    const bookingData = JSON.parse(pendingBooking)
                    processPendingBooking(bookingData)
                } catch (error) {
                    console.error('Failed to parse pending booking:', error)
                    localStorage.removeItem('pendingBooking')
                }
            }
        }
    }, [isSignedIn, user])

    const handleDateSelect = async (date: Date | undefined) => {
        if (!date || !service) return

        setSelectedDate(date)
        setSelectedSlot(null)
        setSelectedStaff(null)
        setIsLoadingSlots(true)

        try {
            const formattedDate = format(date, 'yyyy-MM-dd')
            const allSlots = await fetchPublicTimeSlots(shopId, formattedDate)
            setTimeSlots(allSlots)
        } catch (error) {
            console.error('Failed to fetch time slots:', error)
            setTimeSlots([])
        } finally {
            setIsLoadingSlots(false)
        }
    }

    const handleBooking = async () => {
        if (!selectedSlot || !selectedDate || !service) return

        if (!isSignedIn) {
            const bookingData = {
                serviceId: service.id.toString(),
                serviceName: service.name,
                timeSlotId: selectedSlot.id,
                date: format(selectedDate, 'yyyy-MM-dd'),
                time: selectedSlot.start_datetime,
                staffMemberId: (!selectedSlot.staff_member_name && !selectedSlot.staff_name) ? selectedStaff?.id : undefined,
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
        await processBooking(selectedSlot, selectedDate, service)
    }

    const processPendingBooking = async (bookingData: any) => {
        try {
            const token = await getToken()
            if (!token) throw new Error("No authentication token found")

            await createBooking({
                service_id: bookingData.serviceId,
                time_slot_id: bookingData.timeSlotId,
                staff_member_id: bookingData.staffMemberId,
                notes: ""
            }, token)

            toast({
                title: "Booking Confirmed!",
                description: `Your appointment for ${bookingData.serviceName} has been scheduled.`,
            })

            localStorage.removeItem('pendingBooking')

        } catch (error) {
            console.error('Pending booking failed:', error)
            toast({
                title: "Booking Failed",
                description: error instanceof Error ? error.message : "Failed to create booking. Please try again.",
                variant: "destructive",
            })
            localStorage.removeItem('pendingBooking')
        }
    }

    const processBooking = async (slot: TimeSlot, date: Date, svc: Service) => {
        setIsSubmitting(true)

        try {
            const token = await getToken()
            if (!token) throw new Error("No authentication token found")

            await createBooking({
                service_id: svc.id.toString(),
                time_slot_id: slot.id,
                staff_member_id: (!slot.staff_member_name && !slot.staff_name) ? selectedStaff?.id : undefined,
                notes: ""
            }, token)

            toast({
                title: "Booking Confirmed!",
                description: `Your appointment for ${svc.name} has been scheduled.`,
            })

            setTimeout(() => {
                onClose()
            }, 1000)
        } catch (error) {
            console.error('Booking failed:', error)
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
        setTimeSlots([])
        setSelectedSlot(null)
        onClose()
    }

    if (!service) return null

    return (
        <>
            <BookingDialog open={isOpen} onOpenChange={handleClose}>
                <BookingDialogContent className="max-w-5xl w-[90vw] bg-[#1a1d24] border border-white/10 p-0 gap-0 overflow-hidden shadow-2xl rounded-2xl">
                    {/* Header */}
                    <div className="px-10 py-8 bg-gradient-to-b from-white/5 to-transparent border-b border-white/5">
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="text-3xl font-bold text-white mb-2">
                                    Book Appointment
                                </h2>
                                <p className="text-white/50 text-base">
                                    {service.name}
                                </p>
                            </div>
                            <button
                                onClick={handleClose}
                                className="rounded-full p-2 hover:bg-white/10 transition-colors focus:outline-none"
                            >
                                <X className="h-5 w-5 text-white/60 hover:text-white" />
                            </button>
                        </div>

                        <div className="flex items-center gap-6 mt-6">
                            <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                                ${parseFloat(service.price).toFixed(0)}
                            </span>
                            <div className="h-6 w-[1px] bg-white/10"></div>
                            <div className="flex items-center gap-2 text-white/70 bg-white/5 px-3 py-1.5 rounded-full text-sm">
                                <Clock className="w-4 h-4 text-purple-400" />
                                <span className="font-medium">{service.duration_minutes} mins</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                        <div className="p-10 border-b lg:border-b-0 lg:border-r border-white/5">
                            <div className="flex items-center gap-2 mb-6">
                                <CalendarIcon className="w-5 h-5 text-purple-400" />
                                <h3 className="text-base font-semibold text-white">Select Date</h3>
                            </div>

                            <div className="flex justify-center">
                                <Calendar
                                    mode="single"
                                    selected={selectedDate}
                                    onSelect={handleDateSelect}
                                    disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                                    className="rounded-xl border border-white/5 bg-white/[0.02] p-4"
                                    classNames={{
                                        months: "flex flex-col space-y-4",
                                        month: "space-y-4 w-full",
                                        caption: "flex justify-center pt-1 relative items-center mb-4",
                                        caption_label: "text-base font-semibold text-white",
                                        nav: "space-x-1 flex items-center",
                                        button_previous: "h-8 w-8 bg-transparent hover:bg-white/10 text-white/60 hover:text-white rounded-lg transition-all",
                                        button_next: "h-8 w-8 bg-transparent hover:bg-white/10 text-white/60 hover:text-white rounded-lg transition-all",
                                        weekdays: "flex w-full mb-2",
                                        weekday: "!text-white/90 rounded-md w-full font-medium text-xs flex-1 text-center uppercase tracking-wide",
                                        week: "flex w-full mt-1",
                                        day: "relative p-0.5 text-center flex-1",
                                        day_button: "h-11 w-11 mx-auto p-0 font-normal !text-white/80 hover:!bg-white/10 hover:!text-white rounded-lg transition-all inline-flex items-center justify-center text-sm",
                                        selected: "!bg-purple-600 !text-white hover:!bg-purple-700 font-semibold shadow-lg shadow-purple-500/20",
                                        today: "!bg-transparent !text-white font-medium ring-1 ring-white/20",
                                        outside: "!text-white/20 opacity-50 hover:!bg-transparent hover:!text-white/20",
                                        disabled: "!text-white/10 cursor-not-allowed hover:!bg-transparent hover:!text-white/10",
                                        hidden: "invisible",
                                    }}
                                />
                            </div>
                        </div>

                        <div className="p-10 bg-gradient-to-br from-white/[0.02] to-transparent">
                            <div className="flex items-center gap-2 mb-6">
                                <Clock className="w-5 h-5 text-purple-400" />
                                <h3 className="text-base font-semibold text-white">Select Time</h3>
                            </div>

                            {!selectedDate ? (
                                <div className="flex flex-col items-center justify-center h-[380px] text-white/30 border-2 border-dashed border-white/5 rounded-xl bg-white/[0.01]">
                                    <CalendarIcon className="w-10 h-10 mb-3 opacity-20" />
                                    <p className="text-sm font-medium">Select a date to view available slots</p>
                                </div>
                            ) : isLoadingSlots ? (
                                <div className="flex items-center justify-center h-[380px] border border-white/5 rounded-xl bg-white/[0.01]">
                                    <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
                                </div>
                            ) : timeSlots.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-[380px] text-white/30 border border-white/5 rounded-xl bg-white/[0.01]">
                                    <p className="text-sm font-medium">No slots available for this date</p>
                                </div>
                            ) : (() => {
                                const hasUnassignedSlots = timeSlots.some(slot =>
                                    !slot.staff_member_name && !slot.staff_name
                                )


                                const filteredSlots = timeSlots

                                return (
                                    <>
                                        {hasUnassignedSlots && availableStaff.length > 0 && (
                                            <div className="mb-4">
                                                <label className="block text-sm font-medium text-white/70 mb-2">
                                                    Select Staff Member {selectedSlot && !selectedSlot.staff_member_name && !selectedSlot.staff_name && <span className="text-red-400">*</span>}
                                                </label>
                                                <select
                                                    value={selectedStaff?.id || ""}
                                                    onChange={(e) => {
                                                        const staffId = e.target.value
                                                        if (!staffId) {
                                                            setSelectedStaff(null)
                                                        } else {
                                                            const staff = availableStaff.find(s => s.id === staffId)
                                                            setSelectedStaff(staff || null)
                                                        }
                                                    }}
                                                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                                >
                                                    <option value="" className="bg-[#1a1d24] text-white">Select a staff member</option>
                                                    {availableStaff.map((staff) => (
                                                        <option key={staff.id} value={staff.id} className="bg-[#1a1d24] text-white">
                                                            {staff.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        )}

                                        {filteredSlots.length === 0 ? (
                                            <div className="flex flex-col items-center justify-center h-[380px] text-white/30 border border-white/5 rounded-xl bg-white/[0.01]">
                                                <p className="text-sm font-medium">No slots available</p>
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-2 gap-2.5 max-h-[380px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                                                {filteredSlots.map((slot) => {
                                                    const isAvailable = slot.is_available
                                                    const isSelected = selectedSlot?.id === slot.id
                                                    const timeStr = slot.start_datetime.split('T')[1]?.substring(0, 5) || ''
                                                    const [hours, minutes] = timeStr.split(':').map(Number)
                                                    const period = hours >= 12 ? 'PM' : 'AM'
                                                    const displayHours = hours % 12 || 12
                                                    const startTime = `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`
                                                    const staffName = slot.staff_member_name || slot.staff_name

                                                    return (
                                                        <button
                                                            key={slot.id}
                                                            onClick={() => isAvailable && setSelectedSlot(slot)}
                                                            disabled={!isAvailable}
                                                            className={`
                                                            px-4 py-3.5 rounded-lg text-sm font-medium transition-all duration-200 flex flex-col items-start gap-1 w-full
                                                            ${isSelected
                                                                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30 ring-2 ring-purple-400/50'
                                                                    : isAvailable
                                                                        ? 'bg-white/5 text-white hover:bg-white/10 hover:shadow-md border border-white/5'
                                                                        : 'bg-transparent text-white/20 cursor-not-allowed border border-white/5'
                                                                }
                                                        `}
                                                        >
                                                            <span className="font-semibold">{startTime}</span>
                                                            {staffName && (
                                                                <span className={`text-xs ${isSelected ? 'text-white/80' : 'text-purple-400'}`}>
                                                                    {staffName}
                                                                </span>
                                                            )}
                                                        </button>
                                                    )
                                                })}
                                            </div>
                                        )}
                                    </>
                                )
                            })()}
                        </div>
                    </div>

                    <div className="flex justify-between items-center px-10 py-6 bg-white/[0.02] border-t border-white/5">
                        <div className="text-sm text-white/40">
                            {selectedDate && selectedSlot ? (
                                <span>
                                    <span className="text-white/60">Selected:</span> <span className="text-white font-medium">{format(selectedDate, 'MMM d, yyyy')}</span> <span className="text-white/60">at</span> <span className="text-white font-medium">{(() => {
                                        const timeStr = selectedSlot.start_datetime.split('T')[1]?.substring(0, 5) || ''
                                        const [hours, minutes] = timeStr.split(':').map(Number)
                                        const period = hours >= 12 ? 'PM' : 'AM'
                                        const displayHours = hours % 12 || 12
                                        return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`
                                    })()}</span>
                                </span>
                            ) : (
                                <span>Select a date and time to continue</span>
                            )}
                        </div>
                        <div className="flex gap-3">
                            <Button
                                onClick={handleClose}
                                variant="ghost"
                                className="text-white/60 hover:text-white hover:bg-white/5 px-6 h-11"
                                disabled={isSubmitting}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleBooking}
                                disabled={!selectedSlot || !selectedDate || isSubmitting || (selectedSlot && !selectedSlot.staff_member_name && !selectedSlot.staff_name && !selectedStaff)}
                                className="bg-purple-600 hover:bg-purple-700 text-white px-8 h-11 shadow-lg shadow-purple-900/30 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:shadow-purple-900/40"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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
                <DialogContent className="sm:max-w-[425px] bg-white p-0 gap-0">
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
