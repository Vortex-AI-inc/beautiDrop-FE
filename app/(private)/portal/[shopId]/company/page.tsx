"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Building2, Clock, Sparkles, Save, Users, Scissors, Loader2, Check } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { useShopStore } from "@/lib/store/shop-store"
import { updateShop, fetchShop } from "@/lib/api/shop"
import { fetchShopSchedules, bulkCreateSchedules } from "@/lib/api/schedules"
import type { Schedule } from "@/types/schedule"
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
    const [schedules, setSchedules] = useState<Schedule[]>([])
    const [isLoadingSchedules, setIsLoadingSchedules] = useState(false)
    const [isSavingSchedules, setIsSavingSchedules] = useState(false)

    const [selectedDays, setSelectedDays] = useState<string[]>([])
    const [businessHours, setBusinessHours] = useState({ start_time: "09:00", end_time: "17:00" })

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

    useEffect(() => {
        const loadShopData = async () => {
            if (selectedShop && selectedShop.id === shopId) {
                setIsLoading(false)
                return
            }

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
                suite: '',
                city: selectedShop.city || '',
                state: selectedShop.state || '',
                postal_code: selectedShop.postal_code || '',
                timezone: 'asia-karachi'
            })
        }
    }, [selectedShop])

    useEffect(() => {
        if (selectedShop) {
            loadSchedules()
        }
    }, [selectedShop])

    const loadSchedules = async () => {
        try {
            setIsLoadingSchedules(true)
            const token = await getToken()
            if (!token) return

            const data = await fetchShopSchedules(shopId, token)
            setSchedules(data)

            const daysWithSchedules = data
                .filter(s => s.is_active)
                .map(s => s.day_of_week.charAt(0).toUpperCase() + s.day_of_week.slice(1).toLowerCase())

            setSelectedDays(daysWithSchedules)

            if (data.length > 0) {
                const firstSchedule = data[0]
                setBusinessHours({
                    start_time: firstSchedule.start_time.substring(0, 5),
                    end_time: firstSchedule.end_time.substring(0, 5)
                })
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to load schedules. Please try again.",
                variant: "destructive"
            })
        } finally {
            setIsLoadingSchedules(false)
        }
    }

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const handleDayToggle = (day: string) => {
        setSelectedDays(prev => {
            if (prev.includes(day)) {
                return prev.filter(d => d !== day)
            } else {
                return [...prev, day]
            }
        })
    }

    const handleSelectAllDays = () => {
        if (selectedDays.length === DAYS.length) {
            setSelectedDays([])
        } else {
            setSelectedDays([...DAYS])
        }
    }

    const handleSaveBusinessHours = async () => {
        if (selectedDays.length === 0) {
            toast({
                title: "Error",
                description: "Please select at least one day.",
                variant: "destructive"
            })
            return
        }

        if (!businessHours.start_time || !businessHours.end_time) {
            toast({
                title: "Error",
                description: "Please set start and end times.",
                variant: "destructive"
            })
            return
        }

        try {
            setIsSavingSchedules(true)
            const token = await getToken()
            if (!token) return

            const payload = {
                shop_id: shopId,
                start_day: selectedDays[0].toLowerCase(),
                end_day: selectedDays[selectedDays.length - 1].toLowerCase(),
                start_time: businessHours.start_time,
                end_time: businessHours.end_time
            }

            await bulkCreateSchedules(payload, token)

            toast({
                title: "Success",
                description: "Business hours saved successfully.",
            })

            await loadSchedules()
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to save business hours. Please try again.",
                variant: "destructive"
            })
        } finally {
            setIsSavingSchedules(false)
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

            const updateData = {
                name: formData.name,
                website: formData.website,
                address: formData.address,
                city: formData.city,
                state: formData.state,
                postal_code: formData.postal_code,
            }

            const updatedShop = await updateShop(selectedShop.id, updateData, token)

            setSelectedShop(updatedShop)

            toast({
                title: "Changes saved",
                description: "Your business information has been updated successfully.",
            })
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to save changes. Please try again.",
                variant: "destructive"
            })
        } finally {
            setIsSaving(false)
        }
    }

    const formatTimeTo12Hour = (time24: string): string => {
        const [hours, minutes] = time24.substring(0, 5).split(':')
        const hour = parseInt(hours, 10)
        const period = hour >= 12 ? 'PM' : 'AM'
        const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
        return `${hour12}:${minutes} ${period}`
    }

    const getDaySchedules = (day: string) => {
        return schedules.filter(s => s.day_of_week === day.toLowerCase())
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

                            {isLoadingSchedules ? (
                                <div className="p-12 flex flex-col items-center justify-center">
                                    <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-4" />
                                    <p className="text-gray-600">Loading schedules...</p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {/* Select All Days */}
                                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                                        <div className="flex items-center gap-3 mb-4">
                                            <Checkbox
                                                id="select-all"
                                                checked={selectedDays.length === DAYS.length}
                                                onCheckedChange={handleSelectAllDays}
                                                className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                                            />
                                            <Label htmlFor="select-all" className="font-semibold text-gray-900 cursor-pointer">
                                                Select All Days
                                            </Label>
                                        </div>
                                    </div>

                                    {/* Days Selection */}
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        {DAYS.map((day) => {
                                            const daySchedules = getDaySchedules(day)
                                            const hasSchedule = daySchedules.length > 0
                                            const isSelected = selectedDays.includes(day)

                                            return (
                                                <div
                                                    key={day}
                                                    onClick={() => handleDayToggle(day)}
                                                    className={`relative border-2 rounded-lg p-4 cursor-pointer transition-all ${isSelected
                                                        ? 'border-blue-600 bg-blue-50'
                                                        : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                                                        }`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <Checkbox
                                                            checked={isSelected}
                                                            onCheckedChange={() => handleDayToggle(day)}
                                                            className="pointer-events-none data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                                                        />
                                                        <div className="flex-1">
                                                            <Label className="font-semibold text-gray-900 cursor-pointer">
                                                                {day}
                                                            </Label>
                                                            {hasSchedule && (
                                                                <div className="flex items-center gap-1 mt-1">
                                                                    <Check className="w-3 h-3 text-green-600" />
                                                                    <span className="text-xs text-green-600 font-medium">Set</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>

                                    {/* Time Selection */}
                                    <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                                        <Label className="text-base font-semibold text-gray-900 mb-4 block">
                                            Set Business Hours
                                        </Label>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="start-time">Start Time</Label>
                                                <Input
                                                    id="start-time"
                                                    type="time"
                                                    value={businessHours.start_time}
                                                    onChange={(e) => setBusinessHours(prev => ({ ...prev, start_time: e.target.value }))}
                                                    className="text-lg font-medium"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="end-time">End Time</Label>
                                                <Input
                                                    id="end-time"
                                                    type="time"
                                                    value={businessHours.end_time}
                                                    onChange={(e) => setBusinessHours(prev => ({ ...prev, end_time: e.target.value }))}
                                                    className="text-lg font-medium"
                                                />
                                            </div>
                                        </div>

                                        {selectedDays.length > 0 && (
                                            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                                <p className="text-sm text-blue-800">
                                                    <strong>Selected days:</strong> {selectedDays.join(', ')}
                                                </p>
                                                <p className="text-sm text-blue-800 mt-1">
                                                    <strong>Hours:</strong> {formatTimeTo12Hour(businessHours.start_time)} - {formatTimeTo12Hour(businessHours.end_time)}
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Save Button */}
                                    <div className="flex justify-end pt-4 border-t border-gray-100">
                                        <Button
                                            onClick={handleSaveBusinessHours}
                                            disabled={isSavingSchedules || selectedDays.length === 0}
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-8"
                                        >
                                            {isSavingSchedules ? (
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
                            )}
                        </div>
                    </div>
                </div>
            )}
        </main>
    )
}
