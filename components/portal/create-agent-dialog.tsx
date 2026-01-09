import { useState, useEffect, useRef } from "react"
import { useAuth } from "@clerk/nextjs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Globe, Wand2, Store, CheckCircle2, AlertCircle, ChevronRight, Upload, X, Image as ImageIcon } from "lucide-react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { createShop } from "@/lib/api/shop"
import { submitScrapeJob, getScrapeJob, confirmScrapeJob, listScrapeJobs, getScrapingLimits, type ScrapeJob, type ScrapingLimits } from "@/lib/api/scraper"
import type { ShopFormData, Shop } from "@/types/shop"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ScrapedDataReview } from "./scraped-data-review"

interface CreateAgentDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSuccess: (shop: Shop) => void
    initialUrl?: string
}

const TIMEZONES = Intl.supportedValuesOf('timeZone').map(tz => ({
    value: tz,
    label: tz.replace(/_/g, ' ')
}))

export function CreateAgentDialog({ open, onOpenChange, onSuccess, initialUrl }: CreateAgentDialogProps) {
    const { getToken } = useAuth()
    const { toast } = useToast()
    const [activeTab, setActiveTab] = useState("manual")
    const [manualStep, setManualStep] = useState(1)
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

    const [scrapeUrl, setScrapeUrl] = useState(initialUrl || "")
    const [scrapeJob, setScrapeJob] = useState<ScrapeJob | null>(null)
    const [isScraping, setIsScraping] = useState(false)
    const [recentScrapes, setRecentScrapes] = useState<ScrapeJob[]>([])
    const [isLoadingScrapes, setIsLoadingScrapes] = useState(false)
    const [showReviewModal, setShowReviewModal] = useState(false)
    const pollInterval = useRef<NodeJS.Timeout | null>(null)
    const [scrapingLimits, setScrapingLimits] = useState<ScrapingLimits | null>(null)
    // const [coverImageFile, setCoverImageFile] = useState<File | null>(null)
    // const [coverImagePreview, setCoverImagePreview] = useState<string>("")
    // const [isUploadingImage, setIsUploadingImage] = useState(false)
    // const fileInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (open) {
            const browserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone
            setFormData(prev => ({
                ...prev,
                timezone: browserTimezone
            }))
            setManualStep(1)
            setScrapeUrl(initialUrl || "")
            if (initialUrl) {
                setActiveTab("import")
            }
            setScrapeJob(null)
            setIsScraping(false)
            setShowReviewModal(false)
            if (pollInterval.current) clearInterval(pollInterval.current)
        }
        return () => {
            if (pollInterval.current) clearInterval(pollInterval.current)
        }
    }, [open])

    useEffect(() => {
        if (open && activeTab === 'import') {
            fetchRecentScrapes()
            fetchLimits()
        }
    }, [open, activeTab])

    const fetchLimits = async () => {
        try {
            const token = await getToken()
            if (!token) return
            const limits = await getScrapingLimits(token)
            setScrapingLimits(limits)
        } catch (error) {
            console.error(error)
        }
    }

    const fetchRecentScrapes = async () => {
        try {
            setIsLoadingScrapes(true)
            const token = await getToken()
            if (!token) return

            const jobs = await listScrapeJobs(token)
            setRecentScrapes(jobs.slice(0, 5))
        } catch (error) {
        } finally {
            setIsLoadingScrapes(false)
        }
    }

    const startPolling = async (jobId: string, token: string) => {
        if (pollInterval.current) clearInterval(pollInterval.current)

        pollInterval.current = setInterval(async () => {
            try {
                const job = await getScrapeJob(jobId, token)
                setScrapeJob(job)

                if (job.status === 'completed' || job.status === 'failed') {
                    if (pollInterval.current) clearInterval(pollInterval.current)
                    setIsScraping(false)
                    if (job.status === 'completed') {
                        toast({ title: "Analysis Complete", description: "Website data extracted successfully." })
                    } else {
                        toast({ title: "Analysis Failed", description: "Could not extract data from the website.", variant: "destructive" })
                    }
                }
            } catch (err) {
            }
        }, 20000)
    }

    const handleScrapeSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!scrapeUrl) return

        setIsScraping(true)
        setScrapeJob(null)
        try {
            const token = await getToken()
            if (!token) throw new Error("Not authenticated")

            const job = await submitScrapeJob(scrapeUrl, token)
            setScrapeJob(job)
            startPolling(job.id, token)

        } catch (error) {
            setIsScraping(false)
            toast({
                title: "Error",
                description: "Failed to start website analysis",
                variant: "destructive"
            })
        }
    }

    const handleConfirmImport = async (overrides?: any) => {
        if (!scrapeJob?.id) return
        setIsSubmitting(true)
        try {
            const token = await getToken()
            if (!token) throw new Error("Not authenticated")

            const newShop = await confirmScrapeJob(scrapeJob.id, token, true, overrides) as unknown as Shop
            toast({
                title: "Success!",
                description: "Shop created from website data.",
            })
            onSuccess(newShop)
            onOpenChange(false)
        } catch (error) {
            toast({
                title: "Creation Failed",
                description: "Could not create shop from extracted data.",
                variant: "destructive"
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleManualSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const token = await getToken()
            if (!token) throw new Error("Not authenticated")

            // let coverImageUrl = formData.cover_image_url

            // if (coverImageFile) {
            //     setIsUploadingImage(true)
            //     try {
            //         coverImageUrl = await uploadCoverImage(coverImageFile)
            //     } catch (error) {
            //         toast({
            //             title: "Image upload failed",
            //             description: "Failed to upload cover image. Creating shop without image.",
            //             variant: "destructive"
            //         })
            //     } finally {
            //         setIsUploadingImage(false)
            //     }
            // }

            const shopData = {
                ...formData,
                // cover_image_url: coverImageUrl
            }

            const newShop = await createShop(shopData, token)

            toast({
                title: "Success!",
                description: "Your shop has been created successfully.",
            })

            onSuccess(newShop)
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
            // setCoverImageFile(null)
            // setCoverImagePreview("")
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
                    <DialogTitle className="text-2xl font-bold">Create New Shop</DialogTitle>
                    <DialogDescription>
                        Choose how you would like to set up your new business profile.
                    </DialogDescription>
                </DialogHeader>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mt-6">
                    <TabsList className="grid w-full grid-cols-2 p-1 bg-gray-100/50 rounded-xl h-11 mb-6">
                        <TabsTrigger
                            value="manual"
                            className="flex items-center justify-center gap-2 rounded-lg transition-all data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm font-bold text-gray-500 h-full text-xs"
                        >
                            <Store className="w-3.5 h-3.5" />
                            Manual Setup
                        </TabsTrigger>
                        <TabsTrigger
                            value="import"
                            className="flex items-center justify-center gap-2 rounded-lg transition-all data-[state=active]:bg-white data-[state=active]:text-purple-600 data-[state=active]:shadow-sm font-bold text-gray-500 h-full text-xs"
                        >
                            <Wand2 className="w-3.5 h-3.5" />
                            Import from Web
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="manual">
                        <div className="mb-6">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-500">Step {manualStep} of 2</span>
                                <span className="text-sm font-medium text-purple-600">{manualStep === 1 ? "Business Info" : "Location & Settings"}</span>
                            </div>
                            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                                <div
                                    className="bg-purple-600 h-full transition-all duration-300 ease-in-out"
                                    style={{ width: manualStep === 1 ? '50%' : '100%' }}
                                />
                            </div>
                        </div>

                        <form onSubmit={handleManualSubmit} className="space-y-6">
                            {manualStep === 1 && (
                                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Business Name *</Label>
                                            <Input
                                                id="name"
                                                value={formData.name}
                                                onChange={(e) => updateField("name", e.target.value)}
                                                required
                                                className="text-gray-900 placeholder:text-gray-400 h-12 rounded-xl border-gray-200"

                                                placeholder="e.g., Blush Beauty Salon"
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
                                                className="h-11 rounded-lg border-gray-200"
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
                                            className="rounded-xl border-gray-200"
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
                                                className="h-11 rounded-lg border-gray-200"
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
                                                className="h-11 rounded-lg border-gray-200"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex gap-4 justify-end pt-6 border-t border-gray-100">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            onClick={() => onOpenChange(false)}
                                            className="font-bold text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-xl px-6"
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            type="button"
                                            onClick={(e) => {
                                                const form = e.currentTarget.closest('form')
                                                if (form?.checkValidity()) {
                                                    setManualStep(2)
                                                } else {
                                                    form?.reportValidity()
                                                }
                                            }}
                                            className="bg-purple-600 hover:bg-purple-700 text-white font-bold h-11 px-6 rounded-lg shadow-sm group transition-all"
                                        >
                                            Next Step
                                            <ChevronRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" />
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {manualStep === 2 && (
                                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                                    <div className="space-y-3">
                                        <h4 className="text-sm font-semibold text-gray-900">Location Details</h4>
                                        <div>
                                            <Label htmlFor="address">Address *</Label>
                                            <Input
                                                id="address"
                                                value={formData.address}
                                                onChange={(e) => updateField("address", e.target.value)}
                                                required
                                                placeholder="123 Main Street"
                                                className="h-11 rounded-lg border-gray-200"
                                            />
                                        </div>
                                        <div className="grid grid-cols-3 gap-3">
                                            <div>
                                                <Label htmlFor="city">City *</Label>
                                                <Input
                                                    id="city"
                                                    value={formData.city}
                                                    onChange={(e) => updateField("city", e.target.value)}
                                                    required
                                                    className="h-11 rounded-lg border-gray-200"
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="state">State *</Label>
                                                <Input
                                                    id="state"
                                                    value={formData.state}
                                                    onChange={(e) => updateField("state", e.target.value)}
                                                    required
                                                    className="h-11 rounded-lg border-gray-200"
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="postal_code">Zip *</Label>
                                                <Input
                                                    id="postal_code"
                                                    value={formData.postal_code}
                                                    onChange={(e) => updateField("postal_code", e.target.value)}
                                                    required
                                                    className="h-11 rounded-lg border-gray-200"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <Label htmlFor="country">Country *</Label>
                                            <Input
                                                id="country"
                                                value={formData.country}
                                                onChange={(e) => updateField("country", e.target.value)}
                                                required
                                                defaultValue="United States"
                                                className="h-11 rounded-lg border-gray-200"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="timezone">Timezone *</Label>
                                            <Select
                                                value={formData.timezone}
                                                onValueChange={(value) => updateField("timezone", value)}
                                                required
                                            >
                                                <SelectTrigger id="timezone" className="h-11 rounded-lg border-gray-200">
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
                                        <div className="space-y-2">
                                            <Label htmlFor="cover_image_url">Cover Image URL</Label>
                                            <Input
                                                id="cover_image_url"
                                                value={formData.cover_image_url}
                                                onChange={(e) => updateField("cover_image_url", e.target.value)}
                                                placeholder="https://..."
                                                className="h-11 rounded-lg border-gray-200"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-3 pt-2 bg-gray-50 p-4 rounded-xl border border-gray-100">
                                        <Switch
                                            id="is_active"
                                            checked={formData.is_active}
                                            onCheckedChange={(checked) => updateField("is_active", checked)}
                                        />
                                        <div className="space-y-0.5">
                                            <Label htmlFor="is_active" className="text-sm font-semibold text-gray-900 cursor-pointer">Activate Shop immediately</Label>
                                            <p className="text-xs text-gray-500">Your shop will be visible to customers right away.</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-4 justify-end pt-6 border-t border-gray-100">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            onClick={() => setManualStep(1)}
                                            className="font-bold text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-xl px-6"
                                        >
                                            Back
                                        </Button>
                                        <Button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="bg-purple-600 hover:bg-purple-700 text-white font-bold h-11 px-8 rounded-lg shadow-sm transition-all"
                                        >
                                            {isSubmitting ? (
                                                <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Creating...</>
                                            ) : (
                                                <>
                                                    <Store className="w-4 h-4 mr-2" />
                                                    Create Shop
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </form>
                    </TabsContent>

                    <TabsContent value="import" className="space-y-6">
                        <div className="bg-purple-50 rounded-xl p-6 border border-purple-100 text-center">
                            <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mx-auto mb-4">
                                <Wand2 className="w-6 h-6 text-purple-600" />
                            </div>

                            {scrapingLimits?.scraping_remaining === 0 ? (
                                <>
                                    <h3 className="text-lg font-bold text-red-600 mb-2">Limit Reached</h3>
                                    <p className="text-sm text-gray-600 max-w-sm mx-auto mb-6">
                                        You have reached your monthly limit of {scrapingLimits.scraping_limit} imports.
                                        Please upgrade your plan to continue using the AI auto-import feature.
                                    </p>
                                    <div className="flex justify-center mb-2">
                                        <div className="px-4 py-2 bg-red-100 rounded-lg text-red-700 font-medium text-sm">
                                            Usage: {scrapingLimits.scraping_count} / {scrapingLimits.scraping_limit}
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">Automated Setup</h3>
                                    <p className="text-sm text-gray-600 max-w-sm mx-auto mb-6">
                                        Enter your business website URL, and our AI will automatically extract your services, contact info, and business details.
                                    </p>

                                    {scrapingLimits && (
                                        <div className="mb-4 max-w-xs mx-auto">
                                            <div className="flex justify-between text-xs text-gray-500 mb-1">
                                                <span>Imports Used</span>
                                                <span>{scrapingLimits.scraping_count} / {scrapingLimits.scraping_limit}</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-purple-600 rounded-full"
                                                    style={{ width: `${(scrapingLimits.scraping_count / scrapingLimits.scraping_limit) * 100}%` }}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    <form onSubmit={handleScrapeSubmit} className="flex gap-2 max-w-md mx-auto">
                                        <div className="relative flex-1 group">
                                            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-purple-600 transition-colors" />
                                            <Input
                                                placeholder="https://your-salon-website.com"
                                                value={scrapeUrl}
                                                onChange={(e) => setScrapeUrl(e.target.value)}
                                                disabled={isScraping || (scrapeJob?.status === 'completed')}
                                                required
                                                type="url"
                                                className="pl-10 bg-white h-11 rounded-lg border-gray-200 focus:ring-purple-600 focus:border-purple-600 transition-all"
                                            />
                                        </div>
                                        <Button
                                            type="submit"
                                            disabled={!scrapeUrl || isScraping || (scrapeJob?.status === 'completed')}
                                            className="bg-purple-600 hover:bg-purple-700 text-white font-bold h-11 px-6 rounded-lg shadow-sm whitespace-nowrap group transition-all"
                                        >
                                            {isScraping ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <>
                                                    <Wand2 className="w-4 h-4 mr-2 group-hover:animate-bounce" />
                                                    Scan
                                                </>
                                            )}
                                        </Button>
                                    </form>
                                </>
                            )}
                        </div>

                        {scrapeJob && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                                {scrapeJob.status === 'pending' || scrapeJob.status === 'processing' || scrapeJob.status === 'scraping' || scrapeJob.status === 'parsing' ? (
                                    <div className="bg-white border rounded-xl p-6 flex flex-col items-center justify-center text-center space-y-3">
                                        <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
                                        <div>
                                            <h4 className="font-semibold text-gray-900">Analyzing Website...</h4>
                                            <p className="text-xs text-gray-500">This usually takes about 30 seconds.</p>
                                        </div>
                                    </div>
                                ) : scrapeJob.status === 'completed' ? (
                                    <div className="bg-green-50 border border-green-100 rounded-xl p-6">
                                        <div className="flex items-start gap-4">
                                            <div className="bg-white p-2 rounded-full shadow-sm">
                                                <CheckCircle2 className="w-6 h-6 text-green-600" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-green-900 mb-1">Analysis Complete!</h4>
                                                <p className="text-sm text-green-700 mb-4">
                                                    We successfully extracted data from your website. You can now create your shop with this data.
                                                </p>
                                                <div className="flex justify-end gap-3 flex-wrap">
                                                    <Button variant="outline" onClick={() => setShowReviewModal(true)} className="bg-green-600 hover:bg-green-700 text-white cursor-pointer">
                                                        Review & Edit Data
                                                    </Button>
                                                    <Button variant="outline" onClick={() => {
                                                        setScrapeJob(null)
                                                        setIsScraping(false)
                                                        setScrapeUrl("")
                                                        setShowReviewModal(false)
                                                    }} className="bg-white hover:bg-green-50 text-green-700 border-green-200 cursor-pointer">
                                                        Start Over
                                                    </Button>

                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-red-50 border border-red-100 rounded-xl p-6 flex items-start gap-4">
                                        <AlertCircle className="w-6 h-6 text-red-600 mt-0.5" />
                                        <div>
                                            <h4 className="font-semibold text-red-900">Analysis Failed</h4>
                                            <p className="text-sm text-red-700 mb-2">
                                                We couldn't extract enough information from that URL. Please try again or use manual setup.
                                            </p>
                                            <Button variant="link" onClick={() => {
                                                setScrapeJob(null)
                                                setIsScraping(false)
                                            }} className="text-red-700 px-0 underline">
                                                Try Again
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}




                        <div className="flex justify-end pt-4 border-t">
                            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
                        </div>
                    </TabsContent>
                </Tabs>
            </DialogContent>

            {showReviewModal && scrapeJob?.extracted_data && (
                <ScrapedDataReview
                    open={showReviewModal}
                    onOpenChange={setShowReviewModal}
                    data={scrapeJob.extracted_data}
                    onConfirm={handleConfirmImport}
                    isSubmitting={isSubmitting}
                />
            )}
        </Dialog>
    )
}
