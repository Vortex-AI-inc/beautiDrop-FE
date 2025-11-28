"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Building2, Clock, Sparkles, Save, Users, Scissors, Loader2 } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { useShopStore } from "@/lib/store/shop-store"
import { updateShop, fetchShop, generateTimeSlots } from "@/lib/api/shop"
import { useAuth } from "@clerk/nextjs"

export default function CompanyProfilePage() {
    const params = useParams()
    const shopId = params.shopId as string
    const router = useRouter()
    const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    const { selectedShop, setSelectedShop } = useShopStore()
    const { toast } = useToast()
    const { getToken } = useAuth()
    const [isSaving, setIsSaving] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        website: '',
        address: '',
        suite: '',
        city: '',
        state: '',
        postal_code: '',
        timezone: 'asia-karachi'
    })

    // Fetch shop data if not in store or doesn't match
    useEffect(() => {
        const loadShopData = async () => {
            // If we have the correct shop in store, just use it
            if (selectedShop && selectedShop.id === shopId) {
                setIsLoading(false)
                return
            }

            // Otherwise fetch it
            try {
                setIsLoading(true)
                const token = await getToken()
                if (!token) {
                    router.push('/login')
                    return
                }

                const shop = await fetchShop(shopId, token)
                if (!shop) {
                    router.push('/portal')
                    return
                }

                setSelectedShop(shop)
            } catch (error) {
                console.error("Failed to load shop data", error)
                router.push('/portal')
            } finally {
                setIsLoading(false)
            }
        }

        loadShopData()
    }, [shopId, selectedShop, getToken, router, setSelectedShop])

    useEffect(() => {
        if (selectedShop) {
            setFormData({
                name: selectedShop.name || '',
                website: selectedShop.website || '',
                address: selectedShop.address || '',
                suite: '', // Not in Shop type currently
                city: selectedShop.city || '',
                state: selectedShop.state || '',
                postal_code: selectedShop.postal_code || '',
                timezone: 'asia-karachi' // Default or from DB if added
            })
        }
    }, [selectedShop])

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const [sameHours, setSameHours] = useState(false)
    const [schedule, setSchedule] = useState<Record<string, { isOpen: boolean; start: string; end: string }>>({
        Monday: { isOpen: true, start: '09:00 AM', end: '05:00 PM' },
        Tuesday: { isOpen: true, start: '09:00 AM', end: '05:00 PM' },
        Wednesday: { isOpen: true, start: '09:00 AM', end: '05:00 PM' },
        Thursday: { isOpen: true, start: '09:00 AM', end: '05:00 PM' },
        Friday: { isOpen: true, start: '09:00 AM', end: '05:00 PM' },
        Saturday: { isOpen: false, start: '09:00 AM', end: '05:00 PM' },
        Sunday: { isOpen: false, start: '09:00 AM', end: '05:00 PM' },
    })

    const handleDayToggle = (day: string, checked: boolean) => {
        if (sameHours) {
            setSchedule(prev => {
                const newSchedule = { ...prev }
                DAYS.forEach(d => {
                    newSchedule[d] = { ...newSchedule[d], isOpen: checked }
                })
                return newSchedule
            })
        } else {
            setSchedule(prev => ({
                ...prev,
                [day]: { ...prev[day], isOpen: checked }
            }))
        }
    }

    const handleTimeChange = (day: string, field: 'start' | 'end', value: string) => {
        if (sameHours) {
            setSchedule(prev => {
                const newSchedule = { ...prev }
                DAYS.forEach(d => {
                    newSchedule[d] = { ...newSchedule[d], [field]: value }
                })
                return newSchedule
            })
        } else {
            setSchedule(prev => ({
                ...prev,
                [day]: { ...prev[day], [field]: value }
            }))
        }
    }

    const handleSameHoursToggle = (checked: boolean) => {
        setSameHours(checked)
        if (checked) {
            const base = schedule['Monday']
            setSchedule(prev => {
                const newSchedule = { ...prev }
                DAYS.forEach(d => {
                    newSchedule[d] = { ...base }
                })
                return newSchedule
            })
        }
    }

    const handleSave = async () => {
        if (!selectedShop) return

        try {
            setIsSaving(true)
            const token = await getToken()
            if (!token) {
                toast({
                    title: "Authentication Error",
                    description: "Please sign in to save changes.",
                    variant: "destructive"
                })
                return
            }

            // Prepare data for API
            // Note: schedule is not yet part of the shop update API based on the provided schema
            // We will only update the fields present in the schema for now
            const updateData = {
                name: formData.name,
                website: formData.website,
                address: formData.address,
                city: formData.city,
                state: formData.state,
                postal_code: formData.postal_code,
                // Add other fields as they become available in the form/schema
            }

            const updatedShop = await updateShop(selectedShop.id, updateData, token)

            // Update local store
            setSelectedShop(updatedShop)

            toast({
                title: "Changes saved",
                description: "Your business information has been updated successfully.",
            })
        } catch (error) {
            console.error("Failed to save shop:", error)
            toast({
                title: "Error",
                description: "Failed to save changes. Please try again.",
                variant: "destructive"
            })
        } finally {
            setIsSaving(false)
        }
    }

    const handleSaveBusinessHours = async () => {
        if (!selectedShop) return

        try {
            setIsSaving(true)
            const token = await getToken()
            if (!token) {
                toast({
                    title: "Authentication Error",
                    description: "Please sign in to save changes.",
                    variant: "destructive"
                })
                return
            }

            // Generate time slots for the next 30 days
            const today = new Date()
            const endDate = new Date()
            endDate.setDate(today.getDate() + 30)

            const startDateStr = today.toISOString().split('T')[0]
            const endDateStr = endDate.toISOString().split('T')[0]

            await generateTimeSlots(selectedShop.id, startDateStr, endDateStr, token)

            toast({
                title: "Business hours saved",
                description: "Your business hours have been updated successfully.",
            })
        } catch (error) {
            console.error("Failed to save business hours:", error)
            toast({
                title: "Error",
                description: "Failed to save business hours. Please try again.",
                variant: "destructive"
            })
        } finally {
            setIsSaving(false)
        }
    }

    const HOURS = [
        "12:00", "12:30", "01:00", "01:30", "02:00", "02:30",
        "03:00", "03:30", "04:00", "04:30", "05:00", "05:30",
        "06:00", "06:30", "07:00", "07:30", "08:00", "08:30",
        "09:00", "09:30", "10:00", "10:30", "11:00", "11:30"
    ]

    const PERIODS = ["AM", "PM"]

    const updateTime = (day: string, field: 'start' | 'end', type: 'time' | 'period', value: string) => {
        const current = schedule[day][field]
        const [time, period] = current.split(' ')

        let newTime = current
        if (type === 'time') {
            newTime = `${value} ${period}`
        } else {
            newTime = `${time} ${value}`
        }

        handleTimeChange(day, field, newTime)
    }

    return (
        <main className="min-h-screen bg-slate-50">
            <Header />

            {isLoading ? (
                <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 mb-8">
                            <div className="flex flex-col items-center justify-center">
                                <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
                                <h2 className="text-xl font-bold text-gray-900 mb-2">Loading Company Profile</h2>
                                <p className="text-gray-600">Fetching your shop data...</p>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Company Profile</h1>
                                <p className="text-gray-600">Manage your business information and operating hours</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <Link href={`/portal/${shopId}/staff`} className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1">
                                    <Users className="w-4 h-4" /> Manage Staff
                                </Link>
                                <Link href={`/portal/${shopId}/services`} className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1">
                                    <Scissors className="w-4 h-4" /> Manage Services
                                </Link>
                                <Link href={`/portal/${shopId}`} className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1">
                                    <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                                </Link>
                            </div>
                        </div>

                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-8 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <Sparkles className="w-4 h-4 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">Let AI Fill This In</h3>
                                    <p className="text-sm text-gray-600">Save time by having our AI scan your website and automatically fill in your business hours, services, and staff information.</p>
                                </div>
                            </div>
                            <Button className="bg-teal-400 hover:bg-teal-500 text-black/50 hover:text-black border-0">
                                <Sparkles className="w-4 h-4 " />
                                Have AI Fill This In
                                <span className=" bg-white/20 px-1.5 py-0.5 rounded text-[10px] font-bold">Beta</span>
                            </Button>
                        </div>

                        {/* Business Information Card */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
                            <div className="flex items-center gap-2 mb-6">
                                <Building2 className="w-5 h-5 text-blue-600" />
                                <h2 className="text-lg font-bold text-gray-900">Business Information</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div className="space-y-2">
                                    <Label htmlFor="companyName">Company Name <span className="text-red-500">*</span></Label>
                                    <Input
                                        id="companyName"
                                        placeholder="LHS"
                                        className="placeholder:text-gray-400"
                                        value={formData.name}
                                        onChange={(e) => handleInputChange('name', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="website">Website</Label>
                                    <Input
                                        id="website"
                                        placeholder="https://yourwebsite.com"
                                        className="placeholder:text-gray-400"
                                        value={formData.website}
                                        onChange={(e) => handleInputChange('website', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-4 mb-6">
                                <Label>Business Address</Label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Input
                                        placeholder="123 Main Street"
                                        className="placeholder:text-gray-400"
                                        value={formData.address}
                                        onChange={(e) => handleInputChange('address', e.target.value)}
                                    />
                                    <Input
                                        placeholder="City"
                                        className="placeholder:text-gray-400"
                                        value={formData.city}
                                        onChange={(e) => handleInputChange('city', e.target.value)}
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                                    <Input
                                        placeholder="State"
                                        className="placeholder:text-gray-400"
                                        value={formData.state}
                                        onChange={(e) => handleInputChange('state', e.target.value)}
                                    />
                                    <Input
                                        placeholder="Postal Code"
                                        className="placeholder:text-gray-400"
                                        value={formData.postal_code}
                                        onChange={(e) => handleInputChange('postal_code', e.target.value)}
                                    />
                                </div>
                            </div>


                            <div className="flex justify-end pt-4 border-t border-gray-100 mt-6">
                                <Button
                                    className="bg-teal-400 hover:bg-teal-500 text-white"
                                    onClick={handleSave}
                                    disabled={isSaving}
                                >
                                    {isSaving ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4 mr-2" />
                                            Save Changes
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>

                        {/* Business Hours Card */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
                            <div className="flex items-center gap-2 mb-6">
                                <Clock className="w-5 h-5 text-blue-600" />
                                <h2 className="text-lg font-bold text-gray-900">Business Hours</h2>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-4 mb-6 flex items-center gap-3">
                                <Checkbox
                                    id="same-hours"
                                    checked={sameHours}
                                    onCheckedChange={(checked) => handleSameHoursToggle(checked as boolean)}
                                />
                                <div>
                                    <Label htmlFor="same-hours" className="font-semibold">Same hours every day</Label>
                                    <p className="text-sm text-gray-500">Check this box to use the same hours for all days of the week</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {DAYS.map((day) => (
                                    <div
                                        key={day}
                                        className={`flex items-center justify-between p-4 border border-gray-100 rounded-lg transition-colors ${schedule[day].isOpen ? 'bg-white' : 'bg-gray-50/50'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <Checkbox
                                                id={`day-${day}`}
                                                checked={schedule[day].isOpen}
                                                onCheckedChange={(checked) => handleDayToggle(day, checked as boolean)}
                                            />
                                            <Label
                                                htmlFor={`day-${day}`}
                                                className={`font-medium w-24 ${schedule[day].isOpen ? 'text-gray-900' : 'text-gray-500'}`}
                                            >
                                                {day}
                                            </Label>
                                        </div>
                                        <div className={`flex items-center gap-2 transition-opacity ${schedule[day].isOpen ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
                                            {/* Start Time */}
                                            <div className="flex gap-1">
                                                <div className="w-24">
                                                    <Select
                                                        value={schedule[day].start.split(' ')[0]}
                                                        onValueChange={(value) => updateTime(day, 'start', 'time', value)}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Time" />
                                                        </SelectTrigger>
                                                        <SelectContent className="h-48">
                                                            {HOURS.map((time) => (
                                                                <SelectItem key={time} value={time}>
                                                                    {time}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="w-20">
                                                    <Select
                                                        value={schedule[day].start.split(' ')[1]}
                                                        onValueChange={(value) => updateTime(day, 'start', 'period', value)}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="AM/PM" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {PERIODS.map((period) => (
                                                                <SelectItem key={period} value={period}>
                                                                    {period}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>

                                            <span className="text-gray-400 text-sm px-1">to</span>

                                            {/* End Time */}
                                            <div className="flex gap-1">
                                                <div className="w-24">
                                                    <Select
                                                        value={schedule[day].end.split(' ')[0]}
                                                        onValueChange={(value) => updateTime(day, 'end', 'time', value)}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Time" />
                                                        </SelectTrigger>
                                                        <SelectContent className="h-48">
                                                            {HOURS.map((time) => (
                                                                <SelectItem key={time} value={time}>
                                                                    {time}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="w-20">
                                                    <Select
                                                        value={schedule[day].end.split(' ')[1]}
                                                        onValueChange={(value) => updateTime(day, 'end', 'period', value)}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="AM/PM" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {PERIODS.map((period) => (
                                                                <SelectItem key={period} value={period}>
                                                                    {period}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Save Business Hours Button */}
                            <div className="flex justify-end pt-4 border-t border-gray-100 mt-6">
                                <Button
                                    className="bg-teal-400 hover:bg-teal-500 text-white"
                                    onClick={handleSaveBusinessHours}
                                    disabled={isSaving}
                                >
                                    {isSaving ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4 mr-2" />
                                            Save Business Hours
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex justify-between items-center">
                            <Button variant="outline" className="text-gray-600">Cancel Changes</Button>
                            <Button
                                className="bg-teal-400 hover:bg-teal-500 text-white"
                                onClick={handleSave}
                                disabled={isSaving}
                            >
                                {isSaving ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4 mr-2" />
                                        Save Changes
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    )
}
