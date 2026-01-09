import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Loader2, Plus, Trash2, ChevronRight, ChevronLeft, Check, Store, Package, Clock, Gift } from "lucide-react"
import { cn } from "@/lib/utils"

interface ScrapedDataReviewProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    data: any
    onConfirm: (data: any) => void
    isSubmitting: boolean
}

const STEPS = [
    { id: 1, name: "Details", icon: Store },
    { id: 2, name: "Services", icon: Package },
    { id: 3, name: "Deals", icon: Gift },
    { id: 4, name: "Hours", icon: Clock },
]

export function ScrapedDataReview({ open, onOpenChange, data, onConfirm, isSubmitting }: ScrapedDataReviewProps) {
    const [editedData, setEditedData] = useState(data)
    const [currentStep, setCurrentStep] = useState(1)

    useEffect(() => {
        if (open && data) {
            setEditedData(data)
            setCurrentStep(1)
        }
    }, [open, data])

    const updateShopField = (field: string, value: string) => {
        setEditedData((prev: any) => ({
            ...prev,
            shop: {
                ...prev.shop,
                [field]: value
            }
        }))
    }

    const updateService = (index: number, field: string, value: string | number) => {
        const newServices = [...(editedData.services || [])]
        newServices[index] = { ...newServices[index], [field]: value }
        setEditedData((prev: any) => ({ ...prev, services: newServices }))
    }

    const removeService = (index: number) => {
        const newServices = [...(editedData.services || [])]
        newServices.splice(index, 1)
        setEditedData((prev: any) => ({ ...prev, services: newServices }))
    }

    const addService = () => {
        const lastService = editedData.services?.[0]
        if (editedData.services?.length > 0 && lastService && !lastService.name) {
            return
        }
        setEditedData((prev: any) => ({
            ...prev,
            services: [{ name: "", price: "0", duration_minutes: 30, description: "", category: "" }, ...(prev.services || [])]
        }))
    }

    const updateDeal = (index: number, field: string, value: string | number | string[]) => {
        const newDeals = [...(editedData.deals || [])]
        newDeals[index] = { ...newDeals[index], [field]: value }
        setEditedData((prev: any) => ({ ...prev, deals: newDeals }))
    }

    const removeDeal = (index: number) => {
        const newDeals = [...(editedData.deals || [])]
        newDeals.splice(index, 1)
        setEditedData((prev: any) => ({ ...prev, deals: newDeals }))
    }

    const addDeal = () => {
        const lastDeal = editedData.deals?.[0]
        if (editedData.deals?.length > 0 && lastDeal && !lastDeal.name) {
            return
        }
        setEditedData((prev: any) => ({
            ...prev,
            deals: [{ name: "", description: "", price: "0", duration_minutes: 60, included_items: [] }, ...(prev.deals || [])]
        }))
    }

    const updateSchedule = (index: number, field: string, value: any) => {
        const newSchedule = [...(editedData.schedule || [])]
        newSchedule[index] = { ...newSchedule[index], [field]: value }
        setEditedData((prev: any) => ({ ...prev, schedule: newSchedule }))
    }

    const canProceed = () => {
        if (currentStep === 1) {
            return editedData.shop?.name && editedData.shop?.email
        }
        if (currentStep === 2) {
            if (editedData.services?.length > 0) {
                return editedData.services.every((service: any) => service.name && service.name.trim() !== "")
            }
            return true
        }
        if (currentStep === 3) {
            if (editedData.deals?.length > 0) {
                return editedData.deals.every((deal: any) => deal.name && deal.name.trim() !== "")
            }
            return true
        }
        return true
    }

    const handleNext = () => {
        if (currentStep < STEPS.length) {
            setCurrentStep(currentStep + 1)
        }
    }

    const handlePrevious = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1)
        }
    }

    const handleSubmit = () => {
        onConfirm(editedData)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="lg:max-w-6xl max-w-4xl md:max-w-5xl sm:max-w-4xl max-h-[90dvh] flex flex-col p-0 ">
                <DialogHeader className="px-8 py-6 border-b bg-white relative">
                    <DialogTitle className="text-2xl font-black text-gray-900 tracking-tight">Review Extracted Data</DialogTitle>
                    <DialogDescription className="text-gray-500 font-medium mt-1">
                        We found this information from <span className="text-blue-600 font-bold">{editedData.shop?.name || "your website"}</span>.
                    </DialogDescription>
                </DialogHeader>

                {/* Stepper */}
                <div className="px-8 py-4 border-b bg-gray-50/50">
                    <div className="flex items-center justify-between max-w-2xl mx-auto">
                        {STEPS.map((step, index) => {
                            const Icon = step.icon
                            const isActive = currentStep === step.id
                            const isCompleted = currentStep > step.id

                            return (
                                <div key={step.id} className="flex items-center group">
                                    <div className="flex flex-col items-center gap-2">
                                        <div className={cn(
                                            "w-10 h-10 rounded-xl flex items-center justify-center border transition-all duration-300",
                                            isActive
                                                ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-900/20 scale-105"
                                                : isCompleted
                                                    ? "bg-green-500 border-green-500 text-white"
                                                    : "bg-white border-gray-200 text-gray-400"
                                        )}>
                                            {isCompleted ? <Check className="w-5 h-5 stroke-[3]" /> : <Icon className="w-5 h-5" />}
                                        </div>
                                        <span className={cn(
                                            "text-[10px] font-black uppercase tracking-widest",
                                            isActive ? "text-blue-600" : isCompleted ? "text-green-600" : "text-gray-400"
                                        )}>
                                            {step.name}
                                        </span>
                                    </div>
                                    {index < STEPS.length - 1 && (
                                        <div className="w-12 h-[2px] mx-4 mb-6 bg-gray-200 rounded-full overflow-hidden">
                                            <div className={cn(
                                                "h-full bg-blue-600 transition-all duration-500",
                                                isCompleted ? "w-full" : "w-0"
                                            )} />
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>

                <div className="flex-1 overflow-hidden">
                    <ScrollArea className="h-[60vh] px-6 py-4">
                        {/* Step 1: Shop Details */}
                        {currentStep === 1 && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-400">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Business Name *</Label>
                                        <Input
                                            value={editedData.shop?.name || ""}
                                            onChange={(e) => updateShopField("name", e.target.value)}
                                            placeholder="Enter business name"
                                            className="h-11 rounded-xl border-gray-200 focus:ring-blue-600 transition-all font-medium"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Email *</Label>
                                        <Input
                                            type="email"
                                            value={editedData.shop?.email || ""}
                                            onChange={(e) => updateShopField("email", e.target.value)}
                                            placeholder="Email address"
                                            className="h-11 rounded-xl border-gray-200 focus:ring-blue-600 transition-all font-medium"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Phone</Label>
                                        <Input
                                            value={editedData.shop?.phone || ""}
                                            onChange={(e) => updateShopField("phone", e.target.value)}
                                            placeholder="Phone number"
                                            className="h-11 rounded-xl border-gray-200 focus:ring-blue-600 transition-all font-medium"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Website</Label>
                                        <Input
                                            value={editedData.shop?.website || ""}
                                            onChange={(e) => updateShopField("website", e.target.value)}
                                            placeholder="Website URL"
                                            className="h-11 rounded-xl border-gray-200 focus:ring-blue-600 transition-all font-medium"
                                        />
                                    </div>
                                    <div className="col-span-2 space-y-2">
                                        <Label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Description</Label>
                                        <Textarea
                                            value={editedData.shop?.description || ""}
                                            onChange={(e) => updateShopField("description", e.target.value)}
                                            placeholder="Describe your business..."
                                            rows={4}
                                            className="rounded-xl border-gray-200 focus:ring-blue-600 transition-all font-medium resize-none leading-relaxed"
                                        />
                                    </div>
                                    <div className="col-span-2 space-y-2">
                                        <Label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Address</Label>
                                        <Input
                                            value={typeof editedData.shop?.address === 'object' ? JSON.stringify(editedData.shop.address) : editedData.shop?.address || ""}
                                            onChange={(e) => updateShopField("address", e.target.value)}
                                            placeholder="Full address"
                                            className="h-11 rounded-xl border-gray-200 focus:ring-blue-600 transition-all font-medium"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">City</Label>
                                        <Input
                                            value={editedData.shop?.city || ""}
                                            onChange={(e) => updateShopField("city", e.target.value)}
                                            placeholder="City"
                                            className="h-11 rounded-xl border-gray-200 focus:ring-blue-600 transition-all font-medium"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Country</Label>
                                        <Input
                                            value={editedData.shop?.country || ""}
                                            onChange={(e) => updateShopField("country", e.target.value)}
                                            placeholder="Country"
                                            className="h-11 rounded-xl border-gray-200 focus:ring-blue-600 transition-all font-medium"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Services */}
                        {currentStep === 2 && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-400">
                                <div className="flex items-center justify-between">
                                    <div className="">
                                        <h3 className="text-lg font-black text-gray-900">Services</h3>
                                        <p className="text-sm text-gray-500 font-medium">Add or edit the services extracted from your site.</p>
                                    </div>
                                    <Button onClick={addService} size="sm" className="bg-blue-600 hover:bg-blue-700 rounded-xl px-4 font-bold shadow-sm mt-4">
                                        <Plus className="w-4 h-4 " /> Add Service
                                    </Button>
                                </div>

                                {editedData.services?.length === 0 ? (
                                    <div className="text-center py-20 bg-gray-50/50 rounded-2xl border-2 border-dashed border-gray-200">
                                        <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-4">
                                            <Package className="w-8 h-8 text-gray-300" />
                                        </div>
                                        <p className="text-gray-900 font-bold">No services found</p>
                                        <p className="text-gray-500 text-sm mb-6">Manually add services to get started.</p>
                                        <Button onClick={addService} variant="outline" className="rounded-xl font-bold">
                                            <Plus className="w-4 h-4 mr-2" /> Add Your First Service
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 gap-4">
                                        {editedData.services?.map((service: any, index: number) => (
                                            <div key={index} className="p-6 bg-white border border-gray-100 rounded-2xl hover:shadow-xl hover:shadow-gray-200/40 transition-all duration-300 group relative">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => removeService(index)}
                                                    className="absolute top-4 right-4 h-8 w-8 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>

                                                <div className="space-y-4">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div className="space-y-2">
                                                            <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Service Name *</Label>
                                                            <Input
                                                                value={service.name || ""}
                                                                onChange={(e) => updateService(index, "name", e.target.value)}
                                                                placeholder="e.g. Haircut"
                                                                className="h-10 rounded-xl border-gray-200 font-medium"
                                                            />
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div className="space-y-2">
                                                                <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Price ($)</Label>
                                                                <Input
                                                                    value={service.price || ""}
                                                                    onChange={(e) => updateService(index, "price", e.target.value)}
                                                                    placeholder="0.00"
                                                                    className="h-10 rounded-xl border-gray-200 font-medium text-blue-600"
                                                                />
                                                            </div>
                                                            <div className="space-y-2">
                                                                <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Dur. (min)</Label>
                                                                <Input
                                                                    type="number"
                                                                    value={service.duration_minutes || ""}
                                                                    onChange={(e) => updateService(index, "duration_minutes", parseInt(e.target.value) || 0)}
                                                                    placeholder="30"
                                                                    className="h-10 rounded-xl border-gray-200 font-medium"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div className="space-y-2">
                                                            <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Category</Label>
                                                            <Input
                                                                value={service.category || ""}
                                                                onChange={(e) => updateService(index, "category", e.target.value)}
                                                                placeholder="e.g. Styling"
                                                                className="h-10 rounded-xl border-gray-200 font-medium text-gray-500"
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Description</Label>
                                                            <Input
                                                                value={service.description || ""}
                                                                onChange={(e) => updateService(index, "description", e.target.value)}
                                                                placeholder="Optional details..."
                                                                className="h-10 rounded-xl border-gray-200 font-medium text-gray-500"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Step 3: Deals */}
                        {currentStep === 3 && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-400">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <h3 className="text-lg font-black text-gray-900">Deals & Packages</h3>
                                        <p className="text-sm text-gray-500 font-medium">Bundle services to create special offers.</p>
                                    </div>
                                    <Button onClick={addDeal} size="sm" className="bg-purple-600 hover:bg-purple-700 rounded-xl px-4 font-bold shadow-sm">
                                        <Plus className="w-4 h-4  " /> Add Deal
                                    </Button>
                                </div>

                                {editedData.deals?.length === 0 ? (
                                    <div className="text-center py-20 bg-purple-50/30 rounded-2xl border-2 border-dashed border-purple-100">
                                        <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-4">
                                            <Gift className="w-8 h-8 text-purple-200" />
                                        </div>
                                        <p className="text-gray-900 font-bold">No deals found</p>
                                        <p className="text-gray-500 text-sm mb-6">Create promotional bundles for your clients.</p>
                                        <Button onClick={addDeal} variant="outline" className="rounded-xl font-bold border-purple-100 text-purple-600 hover:bg-purple-50">
                                            <Plus className="w-4 h-4 mr-2" /> Create First Deal
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 gap-4">
                                        {editedData.deals?.map((deal: any, index: number) => (
                                            <div key={index} className="p-6 bg-gradient-to-br from-white to-purple-50/30 border border-purple-100 rounded-2xl hover:shadow-xl hover:shadow-purple-200/20 transition-all duration-300 group relative">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => removeDeal(index)}
                                                    className="absolute top-4 right-4 h-8 w-8 text-purple-200 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>

                                                <div className="space-y-4">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div className="space-y-2">
                                                            <Label className="text-[10px] font-black text-purple-400 uppercase tracking-widest ml-1">Deal Name *</Label>
                                                            <Input
                                                                value={deal.name || ""}
                                                                onChange={(e) => updateDeal(index, "name", e.target.value)}
                                                                placeholder="e.g. Summer Special"
                                                                className="h-10 rounded-xl border-purple-100 bg-white font-medium"
                                                            />
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div className="space-y-2">
                                                                <Label className="text-[10px] font-black text-purple-400 uppercase tracking-widest ml-1">Bundle Price ($)</Label>
                                                                <Input
                                                                    value={deal.price || ""}
                                                                    onChange={(e) => updateDeal(index, "price", e.target.value)}
                                                                    placeholder="0.00"
                                                                    className="h-10 rounded-xl border-purple-100 bg-white font-black text-purple-600"
                                                                />
                                                            </div>
                                                            <div className="space-y-2">
                                                                <Label className="text-[10px] font-black text-purple-400 uppercase tracking-widest ml-1">Dur. (min)</Label>
                                                                <Input
                                                                    type="number"
                                                                    value={deal.duration_minutes || ""}
                                                                    onChange={(e) => updateDeal(index, "duration_minutes", parseInt(e.target.value) || 0)}
                                                                    placeholder="60"
                                                                    className="h-10 rounded-xl border-purple-100 bg-white font-medium"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className="text-[10px] font-black text-purple-400 uppercase tracking-widest ml-1">Description</Label>
                                                        <Textarea
                                                            value={deal.description || ""}
                                                            onChange={(e) => updateDeal(index, "description", e.target.value)}
                                                            placeholder="What's included in this package?"
                                                            rows={2}
                                                            className="rounded-xl border-purple-100 bg-white font-medium resize-none leading-relaxed"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Step 4: Hours */}
                        {currentStep === 4 && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-400">
                                <div className="space-y-1">
                                    <h3 className="text-lg font-black text-gray-900">Business Hours</h3>
                                    <p className="text-sm text-gray-500 font-medium">Set when your salon is open for bookings.</p>
                                </div>

                                <div className="grid grid-cols-1 gap-2">
                                    {editedData.schedule?.map((day: any, index: number) => (
                                        <div key={index} className={cn(
                                            "p-4 rounded-2xl border transition-all duration-300 flex items-center justify-between",
                                            !day.is_closed
                                                ? "bg-white border-gray-100 shadow-sm"
                                                : "bg-gray-50/50 border-transparent opacity-60"
                                        )}>
                                            <div className="flex items-center gap-4 min-w-[140px]">
                                                <Switch
                                                    id={`closed-${index}`}
                                                    checked={!day.is_closed}
                                                    onCheckedChange={(checked) => updateSchedule(index, "is_closed", !checked)}
                                                    className="data-[state=checked]:bg-green-500"
                                                />
                                                <Label htmlFor={`closed-${index}`} className="font-black capitalize text-gray-900 cursor-pointer text-sm tracking-tight">
                                                    {day.day_of_week}
                                                </Label>
                                            </div>

                                            {!day.is_closed ? (
                                                <div className="flex items-center gap-3">
                                                    <div className="relative group">
                                                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                                                        <Input
                                                            type="time"
                                                            className="h-10 w-32 pl-9 rounded-xl border-gray-100 bg-gray-50/50 font-bold text-sm focus:bg-white transition-all"
                                                            value={day.start_time || "09:00"}
                                                            onChange={(e) => updateSchedule(index, "start_time", e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="h-[2px] w-3 bg-gray-200 rounded-full" />
                                                    <div className="relative group">
                                                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                                                        <Input
                                                            type="time"
                                                            className="h-10 w-32 pl-9 rounded-xl border-gray-100 bg-gray-50/50 font-bold text-sm focus:bg-white transition-all"
                                                            value={day.end_time || "17:00"}
                                                            onChange={(e) => updateSchedule(index, "end_time", e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="px-4 py-1.5 bg-gray-100 rounded-full">
                                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Closed</span>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </ScrollArea>
                </div>

                {/* Footer */}
                <DialogFooter className="px-6 py-4 border-t bg-gray-50 flex justify-between items-center h-20">
                    <div className="flex gap-2">
                        {currentStep > 1 && (
                            <Button
                                variant="ghost"
                                onClick={handlePrevious}
                                className="gap-2 font-bold text-gray-500 hover:text-gray-700 hover:bg-gray-100/50 rounded-xl px-4"
                            >
                                <ChevronLeft className="w-4 h-4" />
                                Previous
                            </Button>
                        )}
                    </div>
                    <div className="flex gap-3">
                        <Button
                            variant="ghost"
                            onClick={() => onOpenChange(false)}
                            className="font-bold text-gray-400 hover:text-gray-600 rounded-xl px-4"
                        >
                            Cancel
                        </Button>
                        {currentStep < STEPS.length ? (
                            <Button
                                onClick={handleNext}
                                disabled={!canProceed()}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-11 px-8 rounded-xl shadow-lg shadow-blue-900/20 group transition-all"
                            >
                                Next
                                <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        ) : (
                            <Button
                                onClick={handleSubmit}
                                disabled={isSubmitting || !canProceed()}
                                className="bg-green-600 hover:bg-green-700 text-white font-bold h-11 px-8 rounded-xl shadow-lg shadow-green-900/20 transition-all"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Creating...
                                    </>
                                ) : (
                                    <>
                                        <Check className="w-4 h-4 mr-2" />
                                        Confirm & Create
                                    </>
                                )}
                            </Button>
                        )}
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
