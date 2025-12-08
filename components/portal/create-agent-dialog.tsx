"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@clerk/nextjs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Globe } from "lucide-react"
import { createShop } from "@/lib/api/shop"
import type { ShopFormData } from "@/types/shop"
import { useToast } from "@/hooks/use-toast"

interface CreateAgentDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSuccess: () => void
}

const TIMEZONES = [
    { value: "America/New_York", label: "Eastern Time - New York (ET)" },
    { value: "America/Detroit", label: "Eastern Time - Detroit (ET)" },
    { value: "America/Kentucky/Louisville", label: "Eastern Time - Louisville (ET)" },
    { value: "America/Indiana/Indianapolis", label: "Eastern Time - Indianapolis (ET)" },
    { value: "America/Chicago", label: "Central Time - Chicago (CT)" },
    { value: "America/Denver", label: "Mountain Time - Denver (MT)" },
    { value: "America/Phoenix", label: "Mountain Time - Phoenix (MT - No DST)" },
    { value: "America/Los_Angeles", label: "Pacific Time - Los Angeles (PT)" },
    { value: "America/Anchorage", label: "Alaska Time - Anchorage (AKT)" },
    { value: "America/Juneau", label: "Alaska Time - Juneau (AKT)" },
    { value: "Pacific/Honolulu", label: "Hawaii Time - Honolulu (HT)" },

    { value: "America/Toronto", label: "Toronto (ET)" },
    { value: "America/Montreal", label: "Montreal (ET)" },
    { value: "America/Halifax", label: "Halifax (AT)" },
    { value: "America/St_Johns", label: "St. John's (NT)" },
    { value: "America/Winnipeg", label: "Winnipeg (CT)" },
    { value: "America/Regina", label: "Regina (CT - No DST)" },
    { value: "America/Edmonton", label: "Edmonton (MT)" },
    { value: "America/Vancouver", label: "Vancouver (PT)" },
    { value: "America/Whitehorse", label: "Whitehorse (PT)" },

    { value: "America/Mexico_City", label: "Mexico City (CT)" },
    { value: "America/Cancun", label: "Cancun (ET)" },
    { value: "America/Tijuana", label: "Tijuana (PT)" },
    { value: "America/Guatemala", label: "Guatemala (CT)" },
    { value: "America/Belize", label: "Belize (CT)" },
    { value: "America/Costa_Rica", label: "Costa Rica (CT)" },
    { value: "America/Panama", label: "Panama (ET)" },

    { value: "America/Bogota", label: "Bogota (COT)" },
    { value: "America/Lima", label: "Lima (PET)" },
    { value: "America/Caracas", label: "Caracas (VET)" },
    { value: "America/Guyana", label: "Georgetown (GYT)" },
    { value: "America/La_Paz", label: "La Paz (BOT)" },
    { value: "America/Santiago", label: "Santiago (CLT)" },
    { value: "America/Argentina/Buenos_Aires", label: "Buenos Aires (ART)" },
    { value: "America/Sao_Paulo", label: "São Paulo (BRT)" },
    { value: "America/Montevideo", label: "Montevideo (UYT)" },

    { value: "Europe/London", label: "London (GMT/BST)" },
    { value: "Europe/Dublin", label: "Dublin (GMT/IST)" },
    { value: "Europe/Lisbon", label: "Lisbon (WET/WEST)" },
    { value: "Atlantic/Reykjavik", label: "Reykjavik (GMT)" },
    { value: "Atlantic/Azores", label: "Azores (AZOT/AZOST)" },

    { value: "Europe/Paris", label: "Paris (CET/CEST)" },
    { value: "Europe/Berlin", label: "Berlin (CET/CEST)" },
    { value: "Europe/Rome", label: "Rome (CET/CEST)" },
    { value: "Europe/Madrid", label: "Madrid (CET/CEST)" },
    { value: "Europe/Amsterdam", label: "Amsterdam (CET/CEST)" },
    { value: "Europe/Brussels", label: "Brussels (CET/CEST)" },
    { value: "Europe/Vienna", label: "Vienna (CET/CEST)" },
    { value: "Europe/Prague", label: "Prague (CET/CEST)" },
    { value: "Europe/Warsaw", label: "Warsaw (CET/CEST)" },
    { value: "Europe/Budapest", label: "Budapest (CET/CEST)" },
    { value: "Europe/Stockholm", label: "Stockholm (CET/CEST)" },
    { value: "Europe/Copenhagen", label: "Copenhagen (CET/CEST)" },
    { value: "Europe/Oslo", label: "Oslo (CET/CEST)" },
    { value: "Europe/Zurich", label: "Zurich (CET/CEST)" },

    { value: "Europe/Helsinki", label: "Helsinki (EET/EEST)" },
    { value: "Europe/Athens", label: "Athens (EET/EEST)" },
    { value: "Europe/Bucharest", label: "Bucharest (EET/EEST)" },
    { value: "Europe/Sofia", label: "Sofia (EET/EEST)" },
    { value: "Europe/Tallinn", label: "Tallinn (EET/EEST)" },
    { value: "Europe/Riga", label: "Riga (EET/EEST)" },
    { value: "Europe/Vilnius", label: "Vilnius (EET/EEST)" },
    { value: "Europe/Kiev", label: "Kyiv (EET/EEST)" },
    { value: "Europe/Istanbul", label: "Istanbul (TRT)" },
    { value: "Europe/Moscow", label: "Moscow (MSK)" },
    { value: "Europe/Minsk", label: "Minsk (MSK)" },

    { value: "Africa/Cairo", label: "Cairo (EET)" },
    { value: "Africa/Johannesburg", label: "Johannesburg (SAST)" },
    { value: "Africa/Lagos", label: "Lagos (WAT)" },
    { value: "Africa/Nairobi", label: "Nairobi (EAT)" },
    { value: "Africa/Algiers", label: "Algiers (CET)" },
    { value: "Africa/Casablanca", label: "Casablanca (WET)" },
    { value: "Africa/Tunis", label: "Tunis (CET)" },
    { value: "Africa/Accra", label: "Accra (GMT)" },

    { value: "Asia/Dubai", label: "Dubai (GST)" },
    { value: "Asia/Riyadh", label: "Riyadh (AST)" },
    { value: "Asia/Kuwait", label: "Kuwait (AST)" },
    { value: "Asia/Qatar", label: "Qatar (AST)" },
    { value: "Asia/Bahrain", label: "Bahrain (AST)" },
    { value: "Asia/Jerusalem", label: "Jerusalem (IST)" },
    { value: "Asia/Beirut", label: "Beirut (EET)" },
    { value: "Asia/Tehran", label: "Tehran (IRST)" },

    { value: "Asia/Karachi", label: "Karachi (PKT)" },
    { value: "Asia/Kolkata", label: "India - Kolkata/Mumbai/Delhi (IST)" },
    { value: "Asia/Dhaka", label: "Dhaka (BST)" },
    { value: "Asia/Kathmandu", label: "Kathmandu (NPT)" },
    { value: "Asia/Colombo", label: "Colombo (IST)" },

    { value: "Asia/Bangkok", label: "Bangkok (ICT)" },
    { value: "Asia/Jakarta", label: "Jakarta (WIB)" },
    { value: "Asia/Singapore", label: "Singapore (SGT)" },
    { value: "Asia/Kuala_Lumpur", label: "Kuala Lumpur (MYT)" },
    { value: "Asia/Manila", label: "Manila (PHT)" },
    { value: "Asia/Ho_Chi_Minh", label: "Ho Chi Minh (ICT)" },
    { value: "Asia/Yangon", label: "Yangon (MMT)" },

    { value: "Asia/Hong_Kong", label: "Hong Kong (HKT)" },
    { value: "Asia/Shanghai", label: "Shanghai/Beijing (CST)" },
    { value: "Asia/Taipei", label: "Taipei (CST)" },
    { value: "Asia/Tokyo", label: "Tokyo (JST)" },
    { value: "Asia/Seoul", label: "Seoul (KST)" },
    { value: "Asia/Pyongyang", label: "Pyongyang (KST)" },

    { value: "Asia/Almaty", label: "Almaty (ALMT)" },
    { value: "Asia/Tashkent", label: "Tashkent (UZT)" },
    { value: "Asia/Yekaterinburg", label: "Yekaterinburg (YEKT)" },
    { value: "Asia/Novosibirsk", label: "Novosibirsk (NOVT)" },
    { value: "Asia/Vladivostok", label: "Vladivostok (VLAT)" },

    { value: "Australia/Sydney", label: "Sydney (AEDT/AEST)" },
    { value: "Australia/Melbourne", label: "Melbourne (AEDT/AEST)" },
    { value: "Australia/Brisbane", label: "Brisbane (AEST)" },
    { value: "Australia/Perth", label: "Perth (AWST)" },
    { value: "Australia/Adelaide", label: "Adelaide (ACDT/ACST)" },
    { value: "Australia/Darwin", label: "Darwin (ACST)" },
    { value: "Australia/Hobart", label: "Hobart (AEDT/AEST)" },
    { value: "Pacific/Auckland", label: "Auckland (NZDT/NZST)" },
    { value: "Pacific/Fiji", label: "Fiji (FJT)" },
    { value: "Pacific/Guam", label: "Guam (ChST)" },
    { value: "Pacific/Port_Moresby", label: "Port Moresby (PGT)" },

    { value: "Pacific/Tahiti", label: "Tahiti (TAHT)" },
    { value: "Pacific/Samoa", label: "Samoa (SST)" },
    { value: "Pacific/Tongatapu", label: "Tonga (TOT)" },
    { value: "Pacific/Majuro", label: "Marshall Islands (MHT)" },
    { value: "Pacific/Pago_Pago", label: "Pago Pago (SST)" },

    { value: "Atlantic/Bermuda", label: "Bermuda (AST)" },
    { value: "Atlantic/Cape_Verde", label: "Cape Verde (CVT)" },
    { value: "Atlantic/Canary", label: "Canary Islands (WET)" },
]

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
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "America/New_York",
    })

    useEffect(() => {
        if (open) {
            const browserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone
            setFormData(prev => ({
                ...prev,
                timezone: browserTimezone || "America/New_York"
            }))
        }
    }, [open])

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
                description: "Your shop has been created successfully.",
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
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "America/New_York",
            })
        } catch (error) {
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to create shop",
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
                            <Label htmlFor="timezone">
                                <div className="flex items-center gap-2">
                                    <Globe className="w-4 h-4" />
                                    Timezone *
                                </div>
                            </Label>
                            <Select
                                value={formData.timezone}
                                onValueChange={(value) => updateField("timezone", value)}
                                required
                            >
                                <SelectTrigger id="timezone" className="w-full">
                                    <SelectValue placeholder="Select timezone" />
                                </SelectTrigger>
                                <SelectContent className="max-h-[300px]">
                                    {TIMEZONES.map((tz) => (
                                        <SelectItem key={tz.value} value={tz.value}>
                                            {tz.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
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
