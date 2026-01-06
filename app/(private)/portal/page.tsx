"use client"

import { useEffect, useState } from "react"
import { useUser, useAuth } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Header } from "../../../components/layout/header"
import { Footer } from "../../../components/layout/footer"
import {
    Shield,
    Loader2,
    Bot,
    Wand2,
    Building2,
    Users,
    Sparkles,
    Phone,
    Calendar,
    CreditCard,
    Rocket,
    Headphones,
    ExternalLink,
    Plus,
    Store,
    ArrowRight,
    Trash2,
    Globe
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { useRoleProtection } from "@/hooks/useRoleProtection"
import { fetchMyShops, fetchShopDashboard, toggleShopActive, deleteShop } from "@/lib/api/shop"
import { listScrapeJobs, getScrapeJob, deleteScrapeJob, confirmScrapeJob, type ScrapeJob } from "@/lib/api/scraper"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import type { ShopDashboardData, Shop } from "@/types/shop"
import { CreateAgentDialog } from "@/components/portal/create-agent-dialog"
import { ScrapedDataReview } from "@/components/portal/scraped-data-review"

import { useShopStore } from "@/lib/store/shop-store"

export default function PortalPage() {
    const { isLoaded, isSignedIn, user } = useUser()
    const { getToken } = useAuth()
    const router = useRouter()
    const { toast } = useToast()
    const { isAuthorized, isLoading: isCheckingRole } = useRoleProtection({ requiredRole: 'client' })

    const { selectedShop, setSelectedShop, dashboardData, setDashboardData } = useShopStore()

    const [isLoading, setIsLoading] = useState(true)
    const [shops, setShops] = useState<Shop[]>([])
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
    const [togglingShopId, setTogglingShopId] = useState<string | null>(null)
    const [shopToDelete, setShopToDelete] = useState<string | null>(null)
    const [recentScrapes, setRecentScrapes] = useState<ScrapeJob[]>([])
    const [isLoadingScrapes, setIsLoadingScrapes] = useState(false)
    const [selectedScrapeJob, setSelectedScrapeJob] = useState<ScrapeJob | null>(null)
    const [showReviewModal, setShowReviewModal] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showUrlModal, setShowUrlModal] = useState(false)
    const [scrapeUrl, setScrapeUrl] = useState("")

    const loadShops = async () => {
        try {
            setIsLoading(true)
            const token = await getToken()
            if (!token) return

            const myShops = await fetchMyShops(token)
            setShops(myShops)
        } catch (error) {
        } finally {
            setIsLoading(false)
        }
    }

    const loadRecentScrapes = async () => {
        try {
            setIsLoadingScrapes(true)
            const token = await getToken()
            if (!token) return

            const jobs = await listScrapeJobs(token)
            const completedJobs = jobs.filter(job => job.status === 'completed')
            setRecentScrapes(completedJobs.slice(0, 10))
        } catch (error) {
        } finally {
            setIsLoadingScrapes(false)
        }
    }

    const handleShopSelect = (shop: Shop) => {
        router.push(`/portal/${shop.id}`)
    }

    const handleToggleActive = async (shopId: string, currentStatus: boolean, e: React.MouseEvent) => {
        e.stopPropagation()

        try {
            setTogglingShopId(shopId)
            const token = await getToken()
            if (!token) return

            const updatedShop = await toggleShopActive(shopId, token)

            setShops(prev => prev.map(shop =>
                shop.id === shopId ? updatedShop : shop
            ))

            toast({
                title: "Success",
                description: `Shop ${updatedShop.is_active ? 'activated' : 'deactivated'} successfully.`,
            })
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update shop status. Please try again.",
                variant: "destructive"
            })
        } finally {
            setTogglingShopId(null)
        }
    }

    const handleDeleteShop = async () => {
        if (!shopToDelete) return

        const shopToRemove = shops.find(s => s.id === shopToDelete)
        if (!shopToRemove) return

        setShops(prev => prev.filter(s => s.id !== shopToDelete))
        setShopToDelete(null)

        try {
            const token = await getToken()
            if (!token) {
                setShops(prev => [...prev, shopToRemove])
                toast({
                    title: "Error",
                    description: "Authentication required.",
                    variant: "destructive"
                })
                return
            }

            await deleteShop(shopToDelete, token)
            toast({
                title: "Shop deleted",
                description: "The shop has been permanently deleted.",
            })
        } catch (error) {
            setShops(prev => [...prev, shopToRemove])
            toast({
                title: "Error",
                description: "Failed to delete shop. It has been restored.",
                variant: "destructive"
            })
        }
    }

    const handleDeleteScrape = async (scrapeId: string) => {
        const scrapeToRemove = recentScrapes.find(s => s.id === scrapeId)
        if (!scrapeToRemove) return

        setRecentScrapes(prev => prev.filter(s => s.id !== scrapeId))

        try {
            const token = await getToken()
            if (!token) {
                setRecentScrapes(prev => [...prev, scrapeToRemove])
                toast({
                    title: "Error",
                    description: "Authentication required.",
                    variant: "destructive"
                })
                return
            }

            await deleteScrapeJob(scrapeId, token)
            toast({
                title: "Scrape deleted",
                description: "The scrape job has been cancelled.",
            })
        } catch (error) {
            setRecentScrapes(prev => [...prev, scrapeToRemove])
            toast({
                title: "Error",
                description: "Failed to delete scrape. It has been restored.",
                variant: "destructive"
            })
        }
    }

    const handleReviewScrape = async (scrapeId: string) => {
        try {
            const token = await getToken()
            if (!token) {
                toast({
                    title: "Error",
                    description: "Authentication required.",
                    variant: "destructive"
                })
                return
            }

            const fullJob = await getScrapeJob(scrapeId, token)

            if (!fullJob.extracted_data) {
                toast({
                    title: "No Data",
                    description: "This scrape job has no extracted data.",
                    variant: "destructive"
                })
                return
            }


            setSelectedScrapeJob(fullJob)
            setShowReviewModal(true)
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to load scrape details.",
                variant: "destructive"
            })
        }
    }

    const handleConfirmScrapeImport = async (overrides?: any) => {
        if (!selectedScrapeJob?.id) return
        setIsSubmitting(true)
        try {
            const token = await getToken()
            if (!token) throw new Error("Not authenticated")

            const newShop = await confirmScrapeJob(selectedScrapeJob.id, token, true, overrides) as unknown as Shop
            toast({
                title: "Success!",
                description: "Shop created from website data.",
            })
            setShowReviewModal(false)
            setSelectedScrapeJob(null)
            loadShops()
            loadRecentScrapes()
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

    useEffect(() => {
        if (isLoaded && !isSignedIn) {
            router.push('/login')
        } else if (isLoaded && isSignedIn) {
            loadShops()
            loadRecentScrapes()
        }
    }, [isLoaded, isSignedIn, router])

    useEffect(() => {
    }, [showReviewModal, selectedScrapeJob])

    if (isCheckingRole || !isAuthorized) {
        return (
            <main className="min-h-screen bg-slate-50">
                <Header />
                <div className="flex items-center justify-center min-h-[60vh]">
                    <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                </div>
            </main>
        )
    }

    if (!isLoaded || !isSignedIn) {
        return null
    }

    if (isLoading) {
        return (
            <main className="min-h-screen bg-slate-50">
                <Header />
                <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-5xl mx-auto">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 mb-8">
                            <div className="flex flex-col items-center justify-center">
                                <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
                                <h2 className="text-xl font-bold text-gray-900 mb-2">Loading Portal</h2>
                                <p className="text-gray-600">Syncing your data...</p>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </main>
        )
    }

    if (shops.length > 0) {
        return (
            <main className="min-h-screen bg-slate-50">
                <Header />
                <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-5xl mx-auto">
                        <div className="text-center mb-12">
                            <h1 className="text-3xl font-bold text-gray-900 mb-4">Select Your Shop</h1>
                            <p className="text-gray-600">Choose a shop to manage</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {shops.map((shop) => (
                                <div
                                    key={shop.id}
                                    onClick={() => handleShopSelect(shop)}
                                    className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all cursor-pointer group"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                                            <Store className="w-6 h-6 text-blue-600" />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${shop.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                                                {shop.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-6 w-6 text-gray-400 hover:text-red-600 hover:bg-red-50"
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    setShopToDelete(shop.id)
                                                }}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{shop.name}</h3>
                                    <p className="text-sm text-gray-500 mb-4 line-clamp-2">{shop.description}</p>

                                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                        <div className="flex items-center gap-2">
                                            <Switch
                                                checked={shop.is_active}
                                                onCheckedChange={(checked) => handleToggleActive(shop.id, shop.is_active, event as any)}
                                                disabled={togglingShopId === shop.id}
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                            <span className="text-sm text-gray-600">
                                                {togglingShopId === shop.id ? 'Updating...' : shop.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    router.push(`/portal/${shop.id}/widget`)
                                                }}
                                                className="flex items-center text-purple-600 text-sm font-medium hover:underline z-10"
                                            >
                                                <Rocket className="w-4 h-4 mr-1" />
                                                Widget
                                            </div>
                                            <div className="flex items-center text-blue-600 text-sm font-medium group-hover:translate-x-1 transition-transform">
                                                Manage <ArrowRight className="w-4 h-4 ml-1" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <div
                                onClick={() => setIsCreateDialogOpen(true)}
                                className="bg-slate-50 rounded-xl p-6 border-2 border-dashed border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all cursor-pointer flex flex-col items-center justify-center text-center min-h-[200px]"
                            >
                                <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-4">
                                    <Plus className="w-6 h-6 text-blue-600" />
                                </div>
                                <h3 className="font-semibold text-gray-900 mb-1">Add New Shop</h3>
                                <p className="text-sm text-gray-500">Create another AI agent</p>
                            </div>
                        </div>
                    </div>

                    <div className="max-w-5xl mx-auto mt-8">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-gray-900">Pending Scrapes</h2>
                                <Button variant="outline" size="sm" onClick={() => setIsCreateDialogOpen(true)}>
                                    <Wand2 className="w-4 h-4 mr-2" />
                                    New Import
                                </Button>
                            </div>
                            {isLoadingScrapes ? (
                                <div className="text-center py-8">
                                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-gray-400" />
                                </div>
                            ) : recentScrapes.length > 0 ? (
                                <div className="space-y-3">
                                    {recentScrapes.map((job) => (
                                        <div key={job.id} className="bg-gray-50 border rounded-lg p-4 flex items-center justify-between hover:bg-gray-100 transition-colors">
                                            <div className="flex-1 min-w-0 mr-4">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Globe className="w-4 h-4 text-gray-400" />
                                                    <p className="text-sm font-medium text-gray-900 truncate">{job.url}</p>
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                                    <span className={`capitalize px-2 py-1 rounded-sm font-medium ${job.status === 'completed' ? 'bg-green-100 text-green-700' :
                                                        job.status === 'failed' ? 'bg-red-100 text-red-700' :
                                                            'bg-blue-100 text-blue-700'
                                                        }`}>
                                                        {job.status}
                                                    </span>
                                                    <span>{new Date(job.created_at).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {job.status === 'completed' && (
                                                    <Button
                                                        size="sm"
                                                        onClick={() => {
                                                            handleReviewScrape(job.id)
                                                        }}
                                                    >
                                                        Review & Create
                                                    </Button>
                                                )}
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        handleDeleteScrape(job.id)
                                                    }}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 bg-gray-50 rounded-lg">
                                    <Wand2 className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                    <p className="text-sm text-gray-500">No recent scrapes found.</p>
                                    <Button variant="link" onClick={() => setIsCreateDialogOpen(true)} className="mt-2">
                                        Start importing from a website
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <Footer />
                <CreateAgentDialog
                    open={isCreateDialogOpen}
                    onOpenChange={setIsCreateDialogOpen}
                    onSuccess={() => {
                        loadShops()
                    }}
                />

                <AlertDialog open={!!shopToDelete} onOpenChange={(open) => !open && setShopToDelete(null)}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete your shop and all associated data including appointments and customers.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDeleteShop} className="bg-red-600 hover:bg-red-700">
                                Delete Shop
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                <ScrapedDataReview
                    open={showReviewModal && !!selectedScrapeJob?.extracted_data}
                    onOpenChange={setShowReviewModal}
                    data={selectedScrapeJob?.extracted_data || {}}
                    onConfirm={handleConfirmScrapeImport}
                    isSubmitting={isSubmitting}
                />
            </main>
        )
    }

    return (
        <main className="min-h-screen bg-slate-50">
            <Header />

            <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-6 shadow-lg shadow-blue-600/20">
                            <Shield className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">
                            Customer Portal
                        </h1>
                        <p className="text-lg text-gray-600">
                            Manage your AI receptionist, view analytics, and configure your business settings
                        </p>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                Welcome back, {user?.primaryEmailAddress?.emailAddress}!
                            </h2>
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium mt-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full" />
                                {user?.primaryEmailAddress?.emailAddress}
                            </div>

                            <div className="mt-8 bg-gradient-to-r from-blue-500 to-teal-400 rounded-xl p-8 text-white relative overflow-hidden">
                                <div className="relative z-10">
                                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                                        <Bot className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-2">Create Your AI Agent</h3>
                                    <p className="text-blue-50 mb-6 max-w-md mx-auto">
                                        Get started by creating your AI receptionist
                                    </p>
                                    <Button
                                        onClick={() => setIsCreateDialogOpen(true)}
                                        className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Create Shop
                                    </Button>
                                </div>
                            </div>

                            <div className="mt-6 bg-purple-50 rounded-xl p-6 border border-purple-100 flex flex-col md:flex-row items-center justify-between gap-6">
                                <div className="flex items-start gap-4 text-left">
                                    <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Wand2 className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-bold text-gray-900">AI Auto-Import</h3>
                                            <span className="px-2 py-0.5 bg-purple-600 text-white text-[10px] font-bold rounded uppercase">Smart Setup</span>
                                        </div>
                                        <p className="text-sm text-gray-600 mb-3">
                                            Let AI extract your services, staff, and business details from your website in under 2 minutes.
                                        </p>
                                        <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                                            <span className="flex items-center gap-1">
                                                <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                                                Automatic data extraction
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                                                AI-powered categorization
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                                                Review before import
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <Button
                                    className="bg-purple-600 hover:bg-purple-700 text-white whitespace-nowrap"
                                    onClick={() => setShowUrlModal(true)}
                                >
                                    <Wand2 className="w-4 h-4 mr-2" />
                                    Start Auto-Import
                                </Button>
                            </div>

                            <div className="mt-6 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-bold text-gray-900">Pending Scrapes</h2>
                                    <Button variant="outline" size="sm" onClick={() => setShowUrlModal(true)}>
                                        <Wand2 className="w-4 h-4 mr-2" />
                                        New Import
                                    </Button>
                                </div>
                                {isLoadingScrapes ? (
                                    <div className="text-center py-8">
                                        <Loader2 className="w-8 h-8 animate-spin mx-auto text-gray-400" />
                                    </div>
                                ) : recentScrapes.length > 0 ? (
                                    <div className="space-y-3">
                                        {recentScrapes.map((job) => (
                                            <div key={job.id} className="bg-gray-50 border rounded-lg p-4 flex items-center justify-between hover:bg-gray-100 transition-colors">
                                                <div className="flex-1 min-w-0 mr-4">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <Globe className="w-4 h-4 text-gray-400" />
                                                        <p className="text-sm font-medium text-gray-900 truncate">{job.url}</p>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                                        <span className={`capitalize px-2 py-1 rounded-sm font-medium ${job.status === 'completed' ? 'bg-green-100 text-green-700' :
                                                            job.status === 'failed' ? 'bg-red-100 text-red-700' :
                                                                'bg-blue-100 text-blue-700'
                                                            }`}>
                                                            {job.status}
                                                        </span>
                                                        <span>{new Date(job.created_at).toLocaleDateString()}</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {job.status === 'completed' && (
                                                        <Button
                                                            size="sm"
                                                            onClick={() => {
                                                                handleReviewScrape(job.id)
                                                            }}
                                                        >
                                                            Review & Create
                                                        </Button>
                                                    )}
                                                    <Button
                                                        size="sm"
                                                        variant="destructive"
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            handleDeleteScrape(job.id)
                                                        }}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-gray-500">
                                        <p>No pending scrapes. Start an auto-import to get started!</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />

            <CreateAgentDialog
                open={isCreateDialogOpen}
                onOpenChange={setIsCreateDialogOpen}
                initialUrl={scrapeUrl}
                onSuccess={() => {
                    loadShops()
                    setScrapeUrl("")
                }}
            />

            <AlertDialog open={!!shopToDelete} onOpenChange={(open) => !open && setShopToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your shop and all associated data including appointments and customers.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteShop} className="bg-red-600 hover:bg-red-700">
                            Delete Shop
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <ScrapedDataReview
                open={showReviewModal && !!selectedScrapeJob?.extracted_data}
                onOpenChange={setShowReviewModal}
                data={selectedScrapeJob?.extracted_data || {}}
                onConfirm={handleConfirmScrapeImport}
                isSubmitting={isSubmitting}
            />

            <AlertDialog open={showUrlModal} onOpenChange={setShowUrlModal}>
                <AlertDialogContent className="max-w-md">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                            <Wand2 className="w-5 h-5 text-purple-600" />
                            Start Auto-Import
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Enter your website URL and we'll automatically extract your services, staff, and business details.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="py-4">
                        <label className="text-sm font-medium text-gray-700 mb-2 block">
                            Website URL
                        </label>
                        <div className="relative">
                            <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="url"
                                value={scrapeUrl}
                                onChange={(e) => setScrapeUrl(e.target.value)}
                                placeholder="https://yourbusiness.com"
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                            Make sure the URL is publicly accessible
                        </p>
                    </div>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => {
                            setScrapeUrl("")
                            setShowUrlModal(false)
                        }}>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => {
                                setShowUrlModal(false)
                                setIsCreateDialogOpen(true)
                            }}
                            disabled={!scrapeUrl || !scrapeUrl.startsWith('http')}
                            className="bg-purple-600 hover:bg-purple-700"
                        >
                            <Wand2 className="w-4 h-4 mr-2" />
                            Start Scraping
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </main>
    )
}
