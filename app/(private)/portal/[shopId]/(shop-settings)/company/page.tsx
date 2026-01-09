"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Building2, Clock, Save, Loader2, Check, PencilLine, Upload, X, Image as ImageIcon } from "lucide-react"
import { useParams } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { useShopStore } from "@/lib/store/shop-store"
import { updateShop, fetchShop } from "@/lib/api/shop"
import { fetchShopSchedules, bulkCreateSchedules, fetchHolidays, bulkCreateHolidays, bulkDeleteHolidays } from "@/lib/api/schedules"
import type { Schedule, Holiday } from "@/types/schedule"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { useAuth } from "@clerk/nextjs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useRef } from "react"

function getImagePath(url: string | null | undefined): string {
    if (!url) return ""

    try {
        const urlObj = new URL(url)
        const currentDomain = typeof window !== 'undefined' ? window.location.hostname : ''

        if (urlObj.hostname === currentDomain ||
            urlObj.hostname === 'staging.beautydrop.ai' ||
            urlObj.hostname === 'beautydrop.ai' ||
            urlObj.hostname === 'localhost') {
            return urlObj.pathname
        }

        return url
    } catch {
        return url || ""
    }
}

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

    const [holidays, setHolidays] = useState<Holiday[]>([])
    const [isLoadingHolidays, setIsLoadingHolidays] = useState(false)
    const [selectedHolidayDates, setSelectedHolidayDates] = useState<Date[] | undefined>([])
    const [isSavingHolidays, setIsSavingHolidays] = useState(false)

    const [formData, setFormData] = useState({
        name: '',
        website: '',
        address: '',
        suite: '',
        city: '',
        state: '',
        postal_code: '',
        timezone: 'Asia/Karachi'
    })
    const [originalData, setOriginalData] = useState<any>(null)
    const isDirty = originalData && JSON.stringify(formData) !== JSON.stringify(originalData)

    const [coverImageFile, setCoverImageFile] = useState<File | null>(null)
    const [coverImagePreview, setCoverImagePreview] = useState<string>("")
    const [isUploadingImage, setIsUploadingImage] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (isDirty) {
                e.preventDefault()
                e.returnValue = ''
            }
        }
        window.addEventListener('beforeunload', handleBeforeUnload)
        return () => window.removeEventListener('beforeunload', handleBeforeUnload)
    }, [isDirty])

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
            const data = {
                name: selectedShop.name || '',
                website: selectedShop.website || '',
                address: selectedShop.address || '',
                suite: '',
                city: selectedShop.city || '',
                state: selectedShop.state || '',
                postal_code: selectedShop.postal_code || '',
                timezone: 'Asia/Karachi'
            }
            setFormData(data)
            setOriginalData(data)
        }
    }, [selectedShop])

    useEffect(() => {
        if (selectedShop) {
            loadSchedules()
            loadHolidays()
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

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        if (!file.type.startsWith('image/')) {
            toast({
                title: "Invalid file",
                description: "Please select an image file",
                variant: "destructive"
            })
            return
        }

        if (file.size > 5 * 1024 * 1024) {
            toast({
                title: "File too large",
                description: "Image must be less than 5MB",
                variant: "destructive"
            })
            return
        }

        setCoverImageFile(file)
        const reader = new FileReader()
        reader.onloadend = () => {
            setCoverImagePreview(reader.result as string)
        }
        reader.readAsDataURL(file)
    }

    const handleRemoveImage = () => {
        setCoverImageFile(null)
        setCoverImagePreview("")
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }

    const uploadCoverImage = async (file: File): Promise<string> => {
        const timestamp = Date.now()
        const fileName = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
        const relativePath = `/images/shops-cover-images/${fileName}`

        try {
            const reader = new FileReader()
            return new Promise((resolve, reject) => {
                reader.onload = async (e) => {
                    try {
                        const base64Data = e.target?.result as string

                        const response = await fetch('/api/save-image', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                imageData: base64Data,
                                fileName: fileName,
                                directory: 'shops-cover-images'
                            }),
                        })

                        if (!response.ok) {
                            throw new Error('Failed to save image')
                        }

                        const fullUrl = `${window.location.origin}${relativePath}`
                        resolve(fullUrl)
                    } catch (error) {
                        reject(error)
                    }
                }
                reader.onerror = () => reject(new Error('Failed to read file'))
                reader.readAsDataURL(file)
            })
        } catch (error) {
            throw new Error('Failed to upload image')
        }
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

    const handleEditDay = (day: string, e: React.MouseEvent) => {
        e.stopPropagation()
        const schedule = schedules.find(s => s.day_of_week === day.toLowerCase())
        setSelectedDays([day])
        if (schedule) {
            setBusinessHours({
                start_time: schedule.start_time.substring(0, 5),
                end_time: schedule.end_time.substring(0, 5)
            })
        }
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
                days: selectedDays.map(day => day.toLowerCase()),
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
        if (!formData.name.trim()) {
            toast({
                title: "Validation Error",
                description: "Company name is required.",
                variant: "destructive"
            })
            return
        }

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

            let coverImageUrl = selectedShop.cover_image_url

            if (coverImageFile) {
                setIsUploadingImage(true)
                try {
                    coverImageUrl = await uploadCoverImage(coverImageFile)
                } catch (error) {
                    toast({
                        title: "Image upload failed",
                        description: "Failed to upload cover image. Saving other changes.",
                        variant: "destructive"
                    })
                } finally {
                    setIsUploadingImage(false)
                }
            }

            const updateData = {
                name: formData.name.trim(),
                website: formData.website.trim(),
                address: formData.address.trim(),
                city: formData.city.trim(),
                state: formData.state.trim(),
                postal_code: formData.postal_code.trim(),
                cover_image_url: coverImageUrl,
            }

            const updatedShop = await updateShop(selectedShop.id, updateData, token)

            setSelectedShop(updatedShop)
            setOriginalData({ ...formData })
            setCoverImageFile(null)
            setCoverImagePreview("")

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

    const toggleStatus = async () => {
        if (!selectedShop) return
        try {
            const token = await getToken()
            if (!token) return
            const updatedShop = await updateShop(selectedShop.id, { is_active: !selectedShop.is_active }, token)
            setSelectedShop(updatedShop)
            toast({
                title: updatedShop.is_active ? "Shop Published" : "Shop Set to Draft",
                description: `Your shop is now ${updatedShop.is_active ? 'visible' : 'hidden'} to customers.`,
            })
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update status.",
                variant: "destructive"
            })
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

    const loadHolidays = async () => {
        try {
            setIsLoadingHolidays(true)
            const token = await getToken()
            if (!token) return

            const data = await fetchHolidays(shopId, token)
            setHolidays(data)
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to load holidays.",
                variant: "destructive"
            })
        } finally {
            setIsLoadingHolidays(false)
        }
    }

    const handleCreateHolidays = async () => {
        if (!selectedHolidayDates || selectedHolidayDates.length === 0) return

        try {
            setIsSavingHolidays(true)
            const token = await getToken()
            if (!token) return

            const dates = selectedHolidayDates.map(date => format(date, 'yyyy-MM-dd'))

            await bulkCreateHolidays({
                shop_id: shopId,
                dates: dates,
                name: 'Holiday'
            }, token)

            toast({
                title: "Success",
                description: "Holidays added successfully.",
            })

            await loadHolidays()
            setSelectedHolidayDates([])
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to add holidays.",
                variant: "destructive"
            })
        } finally {
            setIsSavingHolidays(false)
        }
    }

    const handleDeleteHolidays = async () => {
        if (!selectedHolidayDates || selectedHolidayDates.length === 0) return

        try {
            setIsSavingHolidays(true)
            const token = await getToken()
            if (!token) return

            const dates = selectedHolidayDates.map(date => format(date, 'yyyy-MM-dd'))

            await bulkDeleteHolidays({
                shop_id: shopId,
                dates: dates
            }, token)

            toast({
                title: "Success",
                description: "Holidays removed successfully.",
            })

            await loadHolidays()
            setSelectedHolidayDates([])
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to remove holidays.",
                variant: "destructive"
            })
        } finally {
            setIsSavingHolidays(false)
        }
    }

    const areAllSelectedHolidays = () => {
        if (!selectedHolidayDates || selectedHolidayDates.length === 0) return false

        const holidayDatesSet = new Set(holidays.map(h => h.date))
        return selectedHolidayDates.every(date => holidayDatesSet.has(format(date, 'yyyy-MM-dd')))
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {isLoading ? (
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-12">
                    <div className="flex flex-col items-center justify-center">
                        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Loading Company Profile</h2>
                        <p className="text-gray-600">Syncing your business data...</p>
                    </div>
                </div>
            ) : (
                <>
                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-gray-100/80">
                        <div className="space-y-1">
                            <div className="flex items-center gap-3">
                                <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
                                    Company Profile
                                </h1>
                                <Badge
                                    onClick={toggleStatus}
                                    className={cn(
                                        "px-3 py-1 cursor-pointer transition-all hover:scale-105 active:scale-95 border-none shadow-sm font-bold",
                                        selectedShop?.is_active
                                            ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                                            : "bg-slate-400 hover:bg-slate-500 text-white"
                                    )}
                                >
                                    {selectedShop?.is_active ? 'Active' : 'Draft'}
                                </Badge>
                            </div>
                            <p className="text-slate-500 font-medium">Configure your business identity and operational availability.</p>
                        </div>
                        {(isDirty || coverImageFile) && (
                            <div className="flex items-center gap-3 px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-2xl animate-in fade-in slide-in-from-right duration-300">
                                <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">Unsaved Changes</span>
                                <Button
                                    size="sm"
                                    onClick={handleSave}
                                    disabled={isSaving || isUploadingImage}
                                    className="h-8 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-md shadow-indigo-100"
                                >
                                    {isUploadingImage ? (
                                        <><Loader2 className="w-3 h-3 mr-1 animate-spin" />Uploading...</>
                                    ) : isSaving ? (
                                        <><Loader2 className="w-3 h-3 mr-1 animate-spin" />Saving...</>
                                    ) : (
                                        'Save'
                                    )}
                                </Button>
                            </div>
                        )}
                    </div>

                    <div className="grid xl:grid-cols-12 gap-8 items-start">
                        {/* LEFT COLUMN: Main Information */}
                        <div className="xl:col-span-7 space-y-8">
                            {/* Business Information Card */}
                            <Card className="shadow-xl shadow-slate-200/40 border-none rounded-[2rem] overflow-hidden">
                                <CardHeader className="bg-slate-50/50 px-8 py-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-100 rotate-3">
                                            <Building2 className="w-6 h-6 text-white -rotate-3" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-xl font-bold">Business Information</CardTitle>
                                            <CardDescription className="font-medium text-slate-500">The essential details displayed to your customers</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-8 space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-2.5">
                                            <div className="flex justify-between items-center ml-1">
                                                <Label htmlFor="companyName" className="text-xs font-black uppercase tracking-widest text-gray-400">Company Name <span className="text-red-500">*</span></Label>
                                                <span className={cn("text-[10px] font-bold", formData.name.length > 40 ? "text-red-500" : "text-gray-300")}>
                                                    {formData.name.length}/50
                                                </span>
                                            </div>
                                            <Input
                                                id="companyName"
                                                maxLength={50}
                                                placeholder="e.g. Nabila Islamabad"
                                                className="h-14 rounded-2xl border-gray-100 bg-slate-50/30 focus:bg-white focus:ring-blue-500 transition-all font-semibold"
                                                value={formData.name}
                                                onChange={(e) => handleInputChange('name', e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2.5">
                                            <div className="flex justify-between items-center ml-1">
                                                <Label htmlFor="website" className="text-xs font-black uppercase tracking-widest text-gray-400">Website</Label>
                                                <span className="text-[10px] text-gray-300 font-bold">Optional</span>
                                            </div>
                                            <Input
                                                id="website"
                                                placeholder="https://yourwebsite.com"
                                                className="h-14 rounded-2xl border-gray-100 bg-slate-50/30 focus:bg-white focus:ring-blue-500 transition-all font-semibold"
                                                value={formData.website}
                                                onChange={(e) => handleInputChange('website', e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="w-1.5 h-6 bg-indigo-100 rounded-full" />
                                            <Label className="text-xs font-black uppercase tracking-widest text-gray-400">Cover Image</Label>
                                        </div>
                                        {coverImagePreview || selectedShop?.cover_image_url ? (
                                            <div className="relative group">
                                                <img
                                                    src={coverImagePreview || getImagePath(selectedShop?.cover_image_url)}
                                                    alt="Cover preview"
                                                    className="w-full h-48 object-cover rounded-2xl border-2 border-slate-100 shadow-sm"
                                                />
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="icon"
                                                    className="absolute top-3 right-3 h-10 w-10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                                    onClick={handleRemoveImage}
                                                >
                                                    <X className="h-5 w-5" />
                                                </Button>
                                            </div>
                                        ) : (
                                            <div
                                                onClick={() => fileInputRef.current?.click()}
                                                className="border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/30 transition-all group"
                                            >
                                                <ImageIcon className="w-16 h-16 mx-auto text-slate-300 mb-4 group-hover:text-indigo-400 transition-colors" />
                                                <p className="text-sm font-bold text-slate-600 mb-1">
                                                    Click to upload cover image
                                                </p>
                                                <p className="text-xs text-slate-400 font-medium">
                                                    PNG, JPG up to 5MB
                                                </p>
                                            </div>
                                        )}
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="hidden"
                                        />
                                    </div>

                                    <div className="space-y-5">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="w-1.5 h-6 bg-blue-100 rounded-full" />
                                            <Label className="text-xs font-black uppercase tracking-widest text-gray-400">Business Location</Label>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <Input
                                                placeholder="Street Address"
                                                className="h-14 rounded-2xl border-gray-100 bg-slate-50/30 font-semibold"
                                                value={formData.address}
                                                onChange={(e) => handleInputChange('address', e.target.value)}
                                            />
                                            <Input
                                                placeholder="City"
                                                className="h-14 rounded-2xl border-gray-100 bg-slate-50/30 font-semibold"
                                                value={formData.city}
                                                onChange={(e) => handleInputChange('city', e.target.value)}
                                            />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <Input
                                                placeholder="State / Province"
                                                className="h-14 rounded-2xl border-gray-100 bg-slate-50/30 font-semibold"
                                                value={formData.state}
                                                onChange={(e) => handleInputChange('state', e.target.value)}
                                            />
                                            <Input
                                                placeholder="Postal Code"
                                                className="h-14 rounded-2xl border-gray-100 bg-slate-50/30 font-semibold"
                                                value={formData.postal_code}
                                                onChange={(e) => handleInputChange('postal_code', e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-gray-50 flex justify-end">
                                        <Button
                                            onClick={handleSave}
                                            disabled={isSaving}
                                            className="h-14 px-10 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-xl shadow-blue-100 transition-all hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-3"
                                        >
                                            {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                            Update Profile
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Holiday Management Card */}
                            <Card className="shadow-xl shadow-slate-200/40 border-none rounded-[2rem] overflow-hidden">
                                <CardHeader className="bg-slate-50/50 px-8 py-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-100 -rotate-3">
                                            <Clock className="w-6 h-6 text-white rotate-3" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-xl font-bold">Holiday Management</CardTitle>
                                            <CardDescription className="font-medium text-slate-500">Define dates when your salon will be closed</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-8">
                                    <div className="flex flex-col xl:flex-row gap-10">
                                        <div className="p-4 border border-slate-100 rounded-[1.5rem] bg-slate-50/50 flex justify-center scale-95 origin-top">
                                            <Calendar
                                                mode="multiple"
                                                selected={selectedHolidayDates}
                                                onSelect={setSelectedHolidayDates}
                                                className="bg-white rounded-2xl shadow-xl shadow-slate-200/20 inline-block border-none"
                                                modifiers={{ holiday: holidays.map(h => new Date(h.date)) }}
                                                modifiersStyles={{
                                                    holiday: { color: 'white', backgroundColor: '#ef4444', borderRadius: '50%', fontWeight: '900' }
                                                }}
                                            />
                                        </div>

                                        <div className="flex-1 flex flex-col justify-between">
                                            <div className="space-y-6">
                                                <div>
                                                    <h3 className="text-lg font-black text-gray-900 mb-2">Manage Closed Dates</h3>
                                                    <p className="text-sm text-slate-500 leading-relaxed font-medium">
                                                        Booking will be disabled for the selected dates. You can mark holidays or temporary breaks.
                                                    </p>
                                                </div>

                                                <div className="flex flex-wrap gap-2">
                                                    {holidays.filter(h => new Date(h.date) >= new Date()).slice(0, 10).map(h => (
                                                        <Badge key={h.date} className="px-3 py-1.5 bg-slate-50 text-slate-600 border-slate-100 hover:bg-slate-100 transition-colors font-bold rounded-lg border">
                                                            {format(new Date(h.date), 'MMM d, yyyy')}
                                                        </Badge>
                                                    ))}
                                                    {holidays.length > 10 && (
                                                        <span className="text-xs text-slate-400 font-bold self-center bg-slate-50 px-2 py-1 rounded-md">+{holidays.length - 10} more</span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="pt-8 mt-4 border-t border-slate-50 space-y-4">
                                                <Button
                                                    onClick={areAllSelectedHolidays() ? handleDeleteHolidays : handleCreateHolidays}
                                                    disabled={isSavingHolidays || !selectedHolidayDates?.length}
                                                    variant={areAllSelectedHolidays() ? "destructive" : "default"}
                                                    className={cn(
                                                        "w-full h-14 rounded-2xl font-black shadow-lg transition-all flex items-center justify-center gap-3",
                                                        !areAllSelectedHolidays() && "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-100 shadow-xl"
                                                    )}
                                                >
                                                    {isSavingHolidays && <Loader2 className="w-5 h-5 animate-spin" />}
                                                    {areAllSelectedHolidays() ? "Delete Selected Dates" : "Mark as Closed"}
                                                </Button>
                                                <div className="flex items-center justify-center gap-2">
                                                    <div className="h-px bg-slate-100 flex-1" />
                                                    <span className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">
                                                        {selectedHolidayDates?.length || 0} dates selected
                                                    </span>
                                                    <div className="h-px bg-slate-100 flex-1" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* RIGHT COLUMN: Business Hours */}
                        <div className="xl:col-span-5">
                            <Card className="shadow-xl shadow-slate-200/40 border-none rounded-[2rem] overflow-hidden sticky top-24">
                                <CardHeader className="bg-slate-50/50 px-8 py-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-100">
                                            <Clock className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-xl font-bold">Business Hours</CardTitle>
                                            <CardDescription className="font-medium text-slate-500">Standard weekly operating hours</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-0">
                                    {isLoadingSchedules ? (
                                        <div className="p-16 flex flex-col items-center justify-center">
                                            <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
                                            <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Updating Scheduler</p>
                                        </div>
                                    ) : (
                                        <div className="divide-y divide-slate-50">
                                            <div className="p-6 space-y-1">
                                                {DAYS.map((day) => {
                                                    const schedule = schedules.find(s => s.day_of_week === day.toLowerCase())
                                                    const isSelected = selectedDays.includes(day)
                                                    return (
                                                        <div
                                                            key={day}
                                                            onClick={() => handleDayToggle(day)}
                                                            className={cn(
                                                                "group flex flex-wrap sm:flex-nowrap items-center justify-between py-3 px-4 cursor-pointer transition-all rounded-xl my-0.5 gap-y-2",
                                                                isSelected ? "bg-indigo-50/50" : "hover:bg-slate-50/50"
                                                            )}
                                                        >
                                                            <div className="flex items-center gap-4">
                                                                <div className={cn(
                                                                    "w-7 h-7 rounded-lg flex items-center justify-center border-2 transition-all",
                                                                    isSelected ? "bg-indigo-600 border-indigo-600 shadow-md shadow-indigo-100" : "border-slate-100 bg-white group-hover:border-slate-200"
                                                                )}>
                                                                    {isSelected && <Check className="w-3.5 h-3.5 text-white stroke-[3.5px]" />}
                                                                </div>
                                                                <span className={cn(
                                                                    "font-bold text-sm tracking-tight",
                                                                    isSelected ? "text-indigo-950" : "text-slate-500"
                                                                )}>{day}</span>
                                                            </div>

                                                            <div className="flex items-center gap-3">
                                                                {schedule ? (
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="text-xs font-black tabular-nums text-slate-900 bg-white px-3 py-1.5 rounded-lg shadow-sm border border-slate-50 transition-all group-hover:border-indigo-100">
                                                                            {formatTimeTo12Hour(schedule.start_time)} — {formatTimeTo12Hour(schedule.end_time)}
                                                                        </span>
                                                                        <button
                                                                            onClick={(e) => handleEditDay(day, e)}
                                                                            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-all opacity-0 group-hover:opacity-100"
                                                                        >
                                                                            <PencilLine className="w-3.5 h-3.5" />
                                                                        </button>
                                                                    </div>
                                                                ) : (
                                                                    <div className="flex items-center gap-2">
                                                                        <Badge variant="secondary" className="bg-slate-100 text-slate-400 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded">Closed</Badge>
                                                                        <button
                                                                            onClick={(e) => handleEditDay(day, e)}
                                                                            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-all opacity-0 group-hover:opacity-100"
                                                                        >
                                                                            <PencilLine className="w-3.5 h-3.5" />
                                                                        </button>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )
                                                })}
                                            </div>

                                            <div className="p-8 bg-indigo-50/20 border-t border-slate-100 space-y-6">
                                                <div className="grid grid-cols-2 gap-6">
                                                    <div className="space-y-2">
                                                        <div className="flex items-center gap-2 ml-1">
                                                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                                                            <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Opens at</Label>
                                                        </div>
                                                        <Input
                                                            type="time"
                                                            value={businessHours.start_time}
                                                            onChange={(e) => setBusinessHours(prev => ({ ...prev, start_time: e.target.value }))}
                                                            className="h-12 rounded-2xl border-slate-100 shadow-sm font-black tabular-nums bg-white focus:ring-indigo-500"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <div className="flex items-center gap-2 ml-1">
                                                            <div className="w-1.5 h-1.5 bg-rose-500 rounded-full" />
                                                            <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Closes at</Label>
                                                        </div>
                                                        <Input
                                                            type="time"
                                                            value={businessHours.end_time}
                                                            onChange={(e) => setBusinessHours(prev => ({ ...prev, end_time: e.target.value }))}
                                                            className="h-12 rounded-2xl border-slate-100 shadow-sm font-black tabular-nums bg-white focus:ring-indigo-500"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="space-y-4">
                                                    <Button
                                                        onClick={handleSaveBusinessHours}
                                                        disabled={isSavingSchedules || selectedDays.length === 0}
                                                        className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl shadow-xl shadow-indigo-100 transition-all flex items-center justify-center gap-3 active:scale-95"
                                                    >
                                                        {isSavingSchedules ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                                        {selectedDays.length === 1 ? `Save for ${selectedDays[0]}` : `Apply to ${selectedDays.length} Days`}
                                                    </Button>

                                                    <button
                                                        onClick={handleSelectAllDays}
                                                        className="w-full py-2 text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] hover:bg-indigo-50/50 rounded-xl transition-colors"
                                                    >
                                                        {selectedDays.length === DAYS.length ? "Deselect All" : "Select All Weekdays"}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}
