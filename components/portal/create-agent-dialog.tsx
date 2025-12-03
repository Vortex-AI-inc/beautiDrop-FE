"use client"

import { useState } from "react"
import { useAuth } from "@clerk/nextjs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Loader2 } from "lucide-react"
import { createShop } from "@/lib/api/shop"
import type { ShopFormData } from "@/types/shop"
import { useToast } from "@/hooks/use-toast"

interface CreateAgentDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSuccess: () => void
}

export function CreateAgentDialog({ open, onOpenChange, onSuccess }: CreateAgentDialogProps) {
    const { getToken } = useAuth()
    const { toast } = useToast()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formData, setFormData] = useState<ShopFormData>({
        name: "",
        description: "",
        address: "",
        city: "",
        state: "",
        postal_code: "",
        country: "",
        phone: "",
        email: "",
        website: "",
        cover_image_url: "",
        is_active: false,
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const token = await getToken()
            if (!token) {
                throw new Error("Not authenticated")
            }

            await createShop(formData, token)

            toast({
                title: "Success!",
                description: "Your AI agent has been created successfully.",
            })

            onSuccess()
            onOpenChange(false)

            setFormData({
                name: "",
                description: "",
                address: "",
                city: "",
                state: "",
                postal_code: "",
                country: "",
                phone: "",
                email: "",
                website: "",
                cover_image_url: "",
                is_active: true,
            })
        } catch (error) {
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to create agent",
                variant: "destructive",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    const updateField = (field: keyof ShopFormData, value: string | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">Create Your AI Shop Agent</DialogTitle>
                    <DialogDescription>
                        Fill in your business details to create your AI receptionist
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Business Name *</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => updateField("name", e.target.value)}
                                required
                                placeholder="e.g., Blush Beauty Salon"
                                className="placeholder:text-gray-400"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email *</Label>
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => updateField("email", e.target.value)}
                                required
                                placeholder="contact@example.com"
                                className="placeholder:text-gray-400"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description *</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => updateField("description", e.target.value)}
                            required
                            placeholder="Describe your business..."
                            rows={3}
                            className="placeholder:text-gray-400"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone *</Label>
                            <Input
                                id="phone"
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => updateField("phone", e.target.value)}
                                required
                                placeholder="(555) 123-4567"
                                className="placeholder:text-gray-400"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="website">Website</Label>
                            <Input
                                id="website"
                                type="url"
                                value={formData.website}
                                onChange={(e) => updateField("website", e.target.value)}
                                placeholder="https://example.com"
                                className="placeholder:text-gray-400"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="address">Address *</Label>
                        <Input
                            id="address"
                            value={formData.address}
                            onChange={(e) => updateField("address", e.target.value)}
                            required
                            placeholder="123 Main Street"
                            className="placeholder:text-gray-400"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="city">City *</Label>
                            <Input
                                id="city"
                                value={formData.city}
                                onChange={(e) => updateField("city", e.target.value)}
                                required
                                placeholder="New York"
                                className="placeholder:text-gray-400"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="state">State *</Label>
                            <Input
                                id="state"
                                value={formData.state}
                                onChange={(e) => updateField("state", e.target.value)}
                                required
                                placeholder="NY"
                                className="placeholder:text-gray-400"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="postal_code">Postal Code *</Label>
                            <Input
                                id="postal_code"
                                value={formData.postal_code}
                                onChange={(e) => updateField("postal_code", e.target.value)}
                                required
                                placeholder="10001"
                                className="placeholder:text-gray-400"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="country">Country *</Label>
                            <Input
                                id="country"
                                value={formData.country}
                                onChange={(e) => updateField("country", e.target.value)}
                                required
                                placeholder="United States"
                                className="placeholder:text-gray-400"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="cover_image_url">Cover Image URL</Label>
                            <Input
                                id="cover_image_url"
                                type="url"
                                value={formData.cover_image_url}
                                onChange={(e) => updateField("cover_image_url", e.target.value)}
                                placeholder="https://example.com/image.jpg"
                                className="placeholder:text-gray-400"
                            />
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Switch
                            id="is_active"
                            checked={formData.is_active}
                            onCheckedChange={(checked) => updateField("is_active", checked)}
                        />
                        <Label htmlFor="is_active">Activate Shop immediately</Label>
                    </div>

                    <div className="flex gap-3 justify-end pt-4 border-t">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700">
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                "Create Shop"
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
