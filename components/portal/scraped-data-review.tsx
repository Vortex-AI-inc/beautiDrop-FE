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
            <DialogContent className="max-w-7xl max-h-[95vh] flex flex-col p-0">
                <DialogHeader className="px-6 py-4 border-b bg-gradient-to-r from-blue-50 to-purple-50">
                    <DialogTitle className="text-2xl font-bold text-gray-900">Review & Edit Extracted Data</DialogTitle>
                    <DialogDescription className="text-gray-600">
                        Review the data we found from {editedData.shop?.name || "your website"}. Make any changes before creating your shop.
                    </DialogDescription>
                </DialogHeader>

                {/* Stepper */}
                <div className="px-6 py-3 border-b bg-white">
                    <div className="flex items-center justify-between">
                        {STEPS.map((step, index) => (
                            <div key={step.id} className="flex items-center flex-1">
                                <div className="flex flex-col items-center flex-1">
                                    <div className={cn(
                                        "w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all",
                                        currentStep === step.id
                                            ? "bg-blue-600 border-blue-600 text-white shadow-lg scale-110"
                                            : currentStep > step.id
                                                ? "bg-green-500 border-green-500 text-white"
                                                : "bg-white border-gray-300 text-gray-400"
                                    )}>
                                        {currentStep > step.id ? (
                                            <Check className="w-6 h-6" />
                                        ) : (
                                            <step.icon className="w-6 h-6" />
                                        )}
                                    </div>
                                    <span className={cn(
                                        "text-xs mt-2 font-medium text-center",
                                        currentStep === step.id ? "text-blue-600" : "text-gray-500"
                                    )}>
                                        {step.name}
                                    </span>
                                </div>
                                {index < STEPS.length - 1 && (
                                    <div className={cn(
                                        "h-0.5 flex-1 mx-2 transition-all",
                                        currentStep > step.id ? "bg-green-500" : "bg-gray-200"
                                    )} />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex-1 overflow-hidden">
                    <ScrollArea className="h-[60vh] px-6 py-4">
                        {/* Step 1: Shop Details */}
                        {currentStep === 1 && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-right-5 duration-300">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-sm font-semibold text-gray-700">Business Name *</Label>
                                        <Input
                                            value={editedData.shop?.name || ""}
                                            onChange={(e) => updateShopField("name", e.target.value)}
                                            placeholder="Enter business name"
                                            className="h-11"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-sm font-semibold text-gray-700">Email *</Label>
                                        <Input
                                            type="email"
                                            value={editedData.shop?.email || ""}
                                            onChange={(e) => updateShopField("email", e.target.value)}
                                            placeholder="Email address"
                                            className="h-11"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-sm font-semibold text-gray-700">Phone</Label>
                                        <Input
                                            value={editedData.shop?.phone || ""}
                                            onChange={(e) => updateShopField("phone", e.target.value)}
                                            placeholder="Phone number"
                                            className="h-11"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-sm font-semibold text-gray-700">Website</Label>
                                        <Input
                                            value={editedData.shop?.website || ""}
                                            onChange={(e) => updateShopField("website", e.target.value)}
                                            placeholder="Website URL"
                                            className="h-11"
                                        />
                                    </div>
                                    <div className="col-span-2 space-y-2">
                                        <Label className="text-sm font-semibold text-gray-700">Description</Label>
                                        <Textarea
                                            value={editedData.shop?.description || ""}
                                            onChange={(e) => updateShopField("description", e.target.value)}
                                            placeholder="Describe your business..."
                                            rows={4}
                                            className="resize-none"
                                        />
                                    </div>
                                    <div className="col-span-2 space-y-2">
                                        <Label className="text-sm font-semibold text-gray-700">Address</Label>
                                        <Input
                                            value={typeof editedData.shop?.address === 'object' ? JSON.stringify(editedData.shop.address) : editedData.shop?.address || ""}
                                            onChange={(e) => updateShopField("address", e.target.value)}
                                            placeholder="Full address"
                                            className="h-11"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-sm font-semibold text-gray-700">City</Label>
                                        <Input
                                            value={editedData.shop?.city || ""}
                                            onChange={(e) => updateShopField("city", e.target.value)}
                                            placeholder="City"
                                            className="h-11"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-sm font-semibold text-gray-700">Country</Label>
                                        <Input
                                            value={editedData.shop?.country || ""}
                                            onChange={(e) => updateShopField("country", e.target.value)}
                                            placeholder="Country"
                                            className="h-11"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Services */}
                        {currentStep === 2 && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-right-5 duration-300">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-gray-900">Services ({editedData.services?.length || 0})</h3>
                                    <Button onClick={addService} size="sm" className="bg-blue-600 hover:bg-blue-700">
                                        <Plus className="w-4 h-4 mr-2" /> Add Service
                                    </Button>
                                </div>

                                {editedData.services?.length === 0 ? (
                                    <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                                        <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                                        <p className="text-gray-500 mb-4">No services found. Add your first service!</p>
                                        <Button onClick={addService} variant="outline">
                                            <Plus className="w-4 h-4 mr-2" /> Add Service
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {editedData.services?.map((service: any, index: number) => (
                                            <div key={index} className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                                                <div className="space-y-3">
                                                    <div className="flex items-start gap-3">
                                                        <div className="flex-1 space-y-2">
                                                            <Label className="text-xs text-gray-600">Service Name *</Label>
                                                            <Input
                                                                value={service.name || ""}
                                                                onChange={(e) => updateService(index, "name", e.target.value)}
                                                                placeholder="Enter service name"
                                                                className="h-9"
                                                            />
                                                        </div>
                                                        <Button variant="ghost" size="icon" onClick={() => removeService(index)} className="h-9 w-9 text-red-500 hover:text-red-700 hover:bg-red-50 mt-6">
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                    <div className="grid grid-cols-3 gap-3">
                                                        <div className="space-y-2">
                                                            <Label className="text-xs text-gray-600">Price ($)</Label>
                                                            <Input
                                                                value={service.price || ""}
                                                                onChange={(e) => updateService(index, "price", e.target.value)}
                                                                placeholder="Price"
                                                                className="h-9"
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label className="text-xs text-gray-600">Duration (min)</Label>
                                                            <Input
                                                                type="number"
                                                                value={service.duration_minutes || ""}
                                                                onChange={(e) => updateService(index, "duration_minutes", parseInt(e.target.value) || 0)}
                                                                placeholder="Minutes"
                                                                className="h-9"
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label className="text-xs text-gray-600">Category</Label>
                                                            <Input
                                                                value={service.category || ""}
                                                                onChange={(e) => updateService(index, "category", e.target.value)}
                                                                placeholder="Category"
                                                                className="h-9"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className="text-xs text-gray-600">Description (Optional)</Label>
                                                        <Input
                                                            value={service.description || ""}
                                                            onChange={(e) => updateService(index, "description", e.target.value)}
                                                            placeholder="Add description (optional)"
                                                            className="h-9"
                                                        />
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
                            <div className="space-y-4 animate-in fade-in slide-in-from-right-5 duration-300">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-gray-900">Deals & Packages ({editedData.deals?.length || 0})</h3>
                                    <Button onClick={addDeal} size="sm" className="bg-purple-600 hover:bg-purple-700">
                                        <Plus className="w-4 h-4 mr-2" /> Add Deal
                                    </Button>
                                </div>

                                {editedData.deals?.length === 0 ? (
                                    <div className="text-center py-12 bg-purple-50 rounded-lg border-2 border-dashed border-purple-300">
                                        <Gift className="w-12 h-12 text-purple-400 mx-auto mb-3" />
                                        <p className="text-gray-600 mb-2 font-medium">No deals found</p>
                                        <p className="text-gray-500 text-sm mb-4">Create package deals to attract more customers!</p>
                                        <Button onClick={addDeal} variant="outline" className="border-purple-300 text-purple-600 hover:bg-purple-50">
                                            <Plus className="w-4 h-4 mr-2" /> Add Deal
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {editedData.deals?.map((deal: any, index: number) => (
                                            <div key={index} className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-lg hover:shadow-md transition-shadow">
                                                <div className="space-y-3">
                                                    <div className="flex items-start gap-3">
                                                        <div className="flex-1 space-y-2">
                                                            <Label className="text-xs text-gray-700 font-semibold">Deal Name *</Label>
                                                            <Input
                                                                value={deal.name || ""}
                                                                onChange={(e) => updateDeal(index, "name", e.target.value)}
                                                                placeholder="Enter deal name"
                                                                className="h-9 bg-white"
                                                            />
                                                        </div>
                                                        <Button variant="ghost" size="icon" onClick={() => removeDeal(index)} className="h-9 w-9 text-red-500 hover:text-red-700 hover:bg-red-50 mt-6">
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <div className="space-y-2">
                                                            <Label className="text-xs text-gray-700 font-semibold">Price ($)</Label>
                                                            <Input
                                                                value={deal.price || ""}
                                                                onChange={(e) => updateDeal(index, "price", e.target.value)}
                                                                placeholder="Price"
                                                                className="h-9 bg-white"
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label className="text-xs text-gray-700 font-semibold">Duration (min)</Label>
                                                            <Input
                                                                type="number"
                                                                value={deal.duration_minutes || ""}
                                                                onChange={(e) => updateDeal(index, "duration_minutes", parseInt(e.target.value) || 0)}
                                                                placeholder="Minutes"
                                                                className="h-9 bg-white"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className="text-xs text-gray-700 font-semibold">Description</Label>
                                                        <Textarea
                                                            value={deal.description || ""}
                                                            onChange={(e) => updateDeal(index, "description", e.target.value)}
                                                            placeholder="Add description"
                                                            rows={2}
                                                            className="resize-none bg-white"
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
                            <div className="space-y-3 animate-in fade-in slide-in-from-right-5 duration-300">
                                <h3 className="text-lg font-semibold text-gray-900 mb-3">Business Hours</h3>
                                <div className="space-y-2">
                                    {editedData.schedule?.map((day: any, index: number) => (
                                        <div key={index} className="p-2 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
                                            <div className="flex items-center ">
                                                <div className="flex items-center gap-2 min-w-[180px]">
                                                    <Switch
                                                        id={`closed-${index}`}
                                                        checked={!day.is_closed}
                                                        onCheckedChange={(checked) => updateSchedule(index, "is_closed", !checked)}
                                                    />
                                                    <Label htmlFor={`closed-${index}`} className="font-semibold capitalize text-gray-900 cursor-pointer">
                                                        {day.day_of_week}
                                                    </Label>
                                                </div>
                                                {!day.is_closed ? (
                                                    <div className="flex items-center gap-2 flex-1">
                                                        <Input
                                                            type="time"
                                                            className="h-9 w-28"
                                                            value={day.start_time || "09:00"}
                                                            onChange={(e) => updateSchedule(index, "start_time", e.target.value)}
                                                        />
                                                        <span className="text-gray-400 text-sm">to</span>
                                                        <Input
                                                            type="time"
                                                            className="h-9 w-28"
                                                            value={day.end_time || "17:00"}
                                                            onChange={(e) => updateSchedule(index, "end_time", e.target.value)}
                                                        />
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-400 italic">Closed</span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </ScrollArea>
                </div>

                {/* Footer */}
                <DialogFooter className="px-6 py-4 border-t bg-gray-50 flex justify-between items-center">
                    <div className="flex gap-2">
                        {currentStep > 1 && (
                            <Button variant="outline" onClick={handlePrevious} className="gap-2">
                                <ChevronLeft className="w-4 h-4" />
                                Previous
                            </Button>
                        )}
                    </div>
                    <div className="flex gap-2">
                        <Button variant="ghost" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        {currentStep < STEPS.length ? (
                            <Button
                                onClick={handleNext}
                                disabled={!canProceed()}
                                className="bg-blue-600 hover:bg-blue-700 gap-2"
                            >
                                Next
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                        ) : (
                            <Button
                                onClick={handleSubmit}
                                disabled={isSubmitting || !canProceed()}
                                className="bg-green-600 hover:bg-green-700 gap-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Creating Shop...
                                    </>
                                ) : (
                                    <>
                                        <Check className="w-4 h-4" />
                                        Confirm & Create Shop
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
