"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2, Plus, X, Tag } from "lucide-react"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { useAuth } from "@clerk/nextjs"
import { fetchServices } from "@/lib/api/services"
import { createDeal, updateDeal } from "@/lib/api/deals"
import type { Service } from "@/types/service"
import type { Deal } from "@/types/deal"
import { useToast } from "@/hooks/use-toast"

interface CreateDealModalProps {
    isOpen: boolean
    onClose: () => void
    onDealCreated: () => void
    shopId: string
    dealToEdit?: Deal | null
}

export function CreateDealModal({ isOpen, onClose, onDealCreated, shopId, dealToEdit }: CreateDealModalProps) {
    const { getToken } = useAuth()
    const { toast } = useToast()
    const [isLoading, setIsLoading] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [services, setServices] = useState<Service[]>([])
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(false)

    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [price, setPrice] = useState("")
    const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([])
    const [manualItems, setManualItems] = useState<string[]>([])
    const [newItemText, setNewItemText] = useState("")


    useEffect(() => {
        if (isOpen && shopId) {
            setPage(1)
            loadServices(1)
        }
    }, [isOpen, shopId])

    useEffect(() => {
        if (isOpen && dealToEdit) {
            setName(dealToEdit.name)
            setDescription(dealToEdit.description || "")
            setPrice(dealToEdit.price.toString())

            if (services.length > 0) {
                const newSelectedServiceIds: string[] = []
                const newManualItems: string[] = []

                dealToEdit.included_items.forEach(item => {
                    const service = services.find(s => s.name === item)
                    if (service) {
                        newSelectedServiceIds.push(service.id)
                    } else {
                        newManualItems.push(item)
                    }
                })
                setSelectedServiceIds(newSelectedServiceIds)
                setManualItems(newManualItems)
            } else if (!isLoading) {
                setManualItems(dealToEdit.included_items)
            }
        } else if (isOpen && !dealToEdit) {
            resetForm()
        }
    }, [isOpen, dealToEdit, services, isLoading])

    const loadServices = async (pageNum: number = 1) => {
        try {
            setIsLoading(true)
            const token = await getToken()
            if (!token) return

            const data = await fetchServices(shopId, token, pageNum)
            const servicesList = data.results || []
            const activeServices = servicesList.filter((s: Service) => s.is_active !== false)

            if (pageNum === 1) {
                setServices(activeServices)
            } else {
                setServices(prev => {
                    const existingIds = new Set(prev.map(s => s.id))
                    const newUnique = activeServices.filter(s => !existingIds.has(s.id))
                    return [...prev, ...newUnique]
                })
            }

            setHasMore(!!data.next)
            setPage(pageNum)
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to list services.",
                variant: "destructive"
            })
        } finally {
            setIsLoading(false)
        }
    }

    const handleAddManualItem = () => {
        if (newItemText.trim()) {
            setManualItems([...manualItems, newItemText.trim()])
            setNewItemText("")
        }
    }

    const handleRemoveManualItem = (index: number) => {
        setManualItems(manualItems.filter((_, i) => i !== index))
    }

    const handleServiceToggle = (serviceId: string) => {
        setSelectedServiceIds(prev =>
            prev.includes(serviceId)
                ? prev.filter(id => id !== serviceId)
                : [...prev, serviceId]
        )
    }

    const resetForm = () => {
        setName("")
        setDescription("")
        setPrice("")
        setSelectedServiceIds([])
        setManualItems([])
        setNewItemText("")

    }

    const handleSubmit = async () => {
        if (!name || !price) {
            toast({
                title: "Missing fields",
                description: "Name and Price are required.",
                variant: "destructive"
            })
            return
        }

        try {
            setIsSubmitting(true)
            const token = await getToken()
            if (!token) return

            const selectedServiceNames = services
                .filter(s => selectedServiceIds.includes(s.id))
                .map(s => s.name)

            const allIncludedItems = [...selectedServiceNames, ...manualItems]

            const dealData = {
                shop_id: shopId,
                name,
                description,
                price,
                included_items: allIncludedItems,
                is_active: dealToEdit ? dealToEdit.is_active : true
            }

            if (dealToEdit) {
                await updateDeal(dealToEdit.id, dealData, token)
                toast({
                    title: "Success",
                    description: "Deal updated successfully!",
                })
            } else {
                await createDeal(dealData, token)
                toast({
                    title: "Success",
                    description: "Deal created successfully!",
                })
            }

            onDealCreated()
            resetForm()
            onClose()

        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to create deal.",
                variant: "destructive"
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Tag className="w-5 h-5 text-purple-600" />
                        {dealToEdit ? "Edit Deal" : "Create New Deal"}
                    </DialogTitle>
                    <DialogDescription>
                        {dealToEdit ? "Modify your package details." : "Create a package or special offer."}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="deal-name">Deal Name *</Label>
                        <Input
                            id="deal-name"
                            placeholder="e.g. Summer Glow Package"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="deal-desc">Description</Label>
                        <Textarea
                            id="deal-desc"
                            placeholder="Describe what's special about this deal..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="deal-price">Price ($) *</Label>
                        <Input
                            id="deal-price"
                            type="number"
                            placeholder="99.00"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                        />
                    </div>

                    <div className="space-y-4 pt-2 border-t border-gray-100">
                        <h4 className="font-semibold text-sm text-gray-900">Include Services</h4>
                        {isLoading && services.length === 0 ? (
                            <div className="flex justify-center p-4">
                                <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                            </div>
                        ) : services.length === 0 ? (
                            <p className="text-sm text-gray-500 italic">No services available.</p>
                        ) : (
                            <div className="space-y-2">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-2">
                                    {services.map(service => (
                                        <div key={service.id} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={`svc-${service.id}`}
                                                checked={selectedServiceIds.includes(service.id)}
                                                onCheckedChange={() => handleServiceToggle(service.id)}
                                            />
                                            <Label htmlFor={`svc-${service.id}`} className="text-sm cursor-pointer font-normal truncate">
                                                {service.name} (${service.price})
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                                {hasMore && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => loadServices(page + 1)}
                                        className="w-full text-xs text-purple-600 h-8"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : "Load More"}
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="space-y-4 pt-2 border-t border-gray-100">
                        <h4 className="font-semibold text-sm text-gray-900">Add Custom Items (Add-ons)</h4>
                        <div className="flex gap-2">
                            <Input
                                placeholder="e.g. Free Consultation"
                                value={newItemText}
                                onChange={(e) => setNewItemText(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleAddManualItem()}
                            />
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={handleAddManualItem}
                                disabled={!newItemText.trim()}
                            >
                                <Plus className="w-4 h-4" />
                            </Button>
                        </div>

                        {manualItems.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                                {manualItems.map((item, idx) => (
                                    <span key={idx} className="bg-purple-50 text-purple-700 text-xs px-2 py-1 rounded-full flex items-center gap-1 border border-purple-100">
                                        {item}
                                        <button onClick={() => handleRemoveManualItem(idx)} className="hover:text-purple-900">
                                            <X className="w-3 h-3" />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-purple-600 hover:bg-purple-700 text-white">
                        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                        {dealToEdit ? "Save Changes" : "Create Deal"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
