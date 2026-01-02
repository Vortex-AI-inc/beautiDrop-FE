import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Loader2, Plus, Trash2 } from "lucide-react"

interface ScrapedDataReviewProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    data: any
    onConfirm: (data: any) => void
    isSubmitting: boolean
}

export function ScrapedDataReview({ open, onOpenChange, data, onConfirm, isSubmitting }: ScrapedDataReviewProps) {
    const [editedData, setEditedData] = useState(data)

    useEffect(() => {
        if (open && data) {
            setEditedData(data)
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

    const updateSchedule = (index: number, field: string, value: any) => {
        const newSchedule = [...(editedData.schedule || [])]
        newSchedule[index] = { ...newSchedule[index], [field]: value }
        setEditedData((prev: any) => ({ ...prev, schedule: newSchedule }))
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0">
                <DialogHeader className="px-6 py-4 border-b">
                    <DialogTitle>Review & Edit Extracted Data</DialogTitle>
                    <DialogDescription>
                        Review the data we found. Make any changes before creating your shop.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-hidden">
                    <ScrollArea className="h-[60vh] px-6 py-4">
                        <Tabs defaultValue="shop" className="w-full">
                            <TabsList className="mb-4">
                                <TabsTrigger value="shop">Shop Details</TabsTrigger>
                                <TabsTrigger value="services">Services ({editedData.services?.length || 0})</TabsTrigger>
                                <TabsTrigger value="schedule">Hours</TabsTrigger>
                            </TabsList>

                            <TabsContent value="shop" className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Business Name</Label>
                                        <Input
                                            value={editedData.shop?.name || ""}
                                            onChange={(e) => updateShopField("name", e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Email</Label>
                                        <Input
                                            value={editedData.shop?.email || ""}
                                            onChange={(e) => updateShopField("email", e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Phone</Label>
                                        <Input
                                            value={editedData.shop?.phone || ""}
                                            onChange={(e) => updateShopField("phone", e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Website</Label>
                                        <Input
                                            value={editedData.shop?.website || ""}
                                            onChange={(e) => updateShopField("website", e.target.value)}
                                        />
                                    </div>
                                    <div className="col-span-2 space-y-2">
                                        <Label>Description</Label>
                                        <Textarea
                                            value={editedData.shop?.description || ""}
                                            onChange={(e) => updateShopField("description", e.target.value)}
                                        />
                                    </div>
                                    <div className="col-span-2 space-y-2">
                                        <Label>Address</Label>
                                        <Input
                                            value={typeof editedData.shop?.address === 'object' ? JSON.stringify(editedData.shop.address) : editedData.shop?.address || ""}
                                            onChange={(e) => updateShopField("address", e.target.value)}
                                        />
                                        <p className="text-xs text-muted-foreground">JSON string or plain text info</p>
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="services" className="space-y-4">
                                <div className="grid grid-cols-12 gap-2 pb-2 border-b font-medium text-xs text-gray-500">
                                    <div className="col-span-4">Name</div>
                                    <div className="col-span-2">Price</div>
                                    <div className="col-span-2">Duration (min)</div>
                                    <div className="col-span-3">Description</div>
                                    <div className="col-span-1"></div>
                                </div>

                                {editedData.services?.map((service: any, index: number) => (
                                    <div key={index} className="grid grid-cols-12 gap-2 items-center mb-2">
                                        <div className="col-span-4">
                                            <Input
                                                value={service.name || ""}
                                                onChange={(e) => updateService(index, "name", e.target.value)}
                                                placeholder="Service Name"
                                            />
                                        </div>
                                        <div className="col-span-2">
                                            <Input
                                                value={service.price || ""}
                                                onChange={(e) => updateService(index, "price", e.target.value)}
                                                placeholder="0.00"
                                            />
                                        </div>
                                        <div className="col-span-2">
                                            <Input
                                                type="number"
                                                value={service.duration_minutes || ""}
                                                onChange={(e) => updateService(index, "duration_minutes", parseInt(e.target.value) || 0)}
                                                placeholder="30"
                                            />
                                        </div>
                                        <div className="col-span-3">
                                            <Input
                                                value={service.description || ""}
                                                onChange={(e) => updateService(index, "description", e.target.value)}
                                                placeholder="Description (optional)"
                                            />
                                        </div>
                                        <div className="col-span-1 text-right">
                                            <Button variant="ghost" size="icon" onClick={() => removeService(index)}>
                                                <Trash2 className="w-4 h-4 text-red-500" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                                <Button variant="outline" className="w-full mt-4" onClick={() => {
                                    setEditedData((prev: any) => ({
                                        ...prev,
                                        services: [...(prev.services || []), { name: "", price: "0", duration_minutes: 30 }]
                                    }))
                                }}>
                                    <Plus className="w-4 h-4 mr-2" /> Add Service
                                </Button>
                            </TabsContent>

                            <TabsContent value="schedule" className="space-y-4">
                                <div className="grid grid-cols-12 gap-4 pb-2 border-b font-medium text-xs text-gray-500">
                                    <div className="col-span-3">Day</div>
                                    <div className="col-span-2 text-center">Status</div>
                                    <div className="col-span-7">Business Hours</div>
                                </div>
                                {editedData.schedule?.map((day: any, index: number) => (
                                    <div key={index} className="grid grid-cols-12 gap-4 items-center py-2 border-b border-gray-50 last:border-0">
                                        <div className="col-span-3 font-medium capitalize text-sm text-gray-900">{day.day_of_week}</div>
                                        <div className="col-span-2 flex justify-center">
                                            <div className="flex items-center gap-2">
                                                <Label htmlFor={`closed-${index}`} className="text-xs text-gray-500 cursor-pointer">Closed</Label>
                                                <Switch
                                                    id={`closed-${index}`}
                                                    checked={day.is_closed}
                                                    onCheckedChange={(checked) => updateSchedule(index, "is_closed", checked)}
                                                    className="scale-75"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-span-7">
                                            {!day.is_closed ? (
                                                <div className="flex items-center gap-2">
                                                    <Input
                                                        type="time"
                                                        className="h-8 text-xs"
                                                        value={day.start_time || "09:00"}
                                                        onChange={(e) => updateSchedule(index, "start_time", e.target.value)}
                                                    />
                                                    <span className="text-xs text-gray-400">to</span>
                                                    <Input
                                                        type="time"
                                                        className="h-8 text-xs"
                                                        value={day.end_time || "17:00"}
                                                        onChange={(e) => updateSchedule(index, "end_time", e.target.value)}
                                                    />
                                                </div>
                                            ) : (
                                                <div className="text-xs text-gray-400 italic">Shop is closed</div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </TabsContent>
                        </Tabs>
                    </ScrollArea>
                </div>

                <DialogFooter className="px-6 py-4 border-t bg-gray-50 flex justify-between items-center">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button
                        onClick={() => onConfirm(editedData)}
                        disabled={isSubmitting}
                        className="bg-blue-600 hover:bg-blue-700"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Creating Shop...
                            </>
                        ) : (
                            "Confirm & Create Shop"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
