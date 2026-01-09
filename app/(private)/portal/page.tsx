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
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { useRoleProtection } from "@/hooks/useRoleProtection"
import { fetchMyShops, fetchShopDashboard, toggleShopActive, deleteShop } from "@/lib/api/shop"
import { listScrapeJobs, getScrapeJob, deleteScrapeJob, confirmScrapeJob, getScrapingLimits, type ScrapeJob, type ScrapingLimits } from "@/lib/api/scraper"
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
    const [scrapingLimits, setScrapingLimits] = useState<ScrapingLimits | null>(null)

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

            const [jobs, limits] = await Promise.all([
                listScrapeJobs(token),
                getScrapingLimits(token)
            ])

            setScrapingLimits(limits)
            const completedJobs = jobs.filter(job => job.status === 'completed')
            setRecentScrapes(completedJobs.slice(0, 10))
        } catch (error) {
            console.error(error)
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
            <main className="min-h-screen bg-[#fcfcfd]">
                <Header />
                <div className="pt-28 pb-20 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-6xl mx-auto">
                        {/* Dashboard Header */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                            <div className="space-y-1">
                                <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
                                    Your <span className="text-blue-600 font-black">Shops</span>
                                </h1>
                                <p className="text-base text-gray-500 font-medium">
                                    Manage your AI agents and salon settings.
                                </p>
                            </div>

                            <div className="flex items-center gap-3">
                                {scrapingLimits && (
                                    <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Imports</span>
                                            <span className="text-sm font-black text-gray-900">{scrapingLimits.scraping_count}/{scrapingLimits.scraping_limit}</span>
                                        </div>
                                        <div className="h-8 w-[1px] bg-gray-100" />
                                        <Button
                                            size="sm"
                                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-lg shadow-blue-200"
                                            onClick={() => setIsCreateDialogOpen(true)}
                                        >
                                            <Plus className="w-3 h-3 mr-1.5" />
                                            Add Shop
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Shops Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {shops.map((shop) => (
                                <div
                                    key={shop.id}
                                    onClick={() => handleShopSelect(shop)}
                                    className="group relative bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 hover:shadow-2xl hover:shadow-blue-200/50 hover:-translate-y-1 transition-all cursor-pointer"
                                >
                                    <div className="flex items-start justify-between mb-6">
                                        <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center group-hover:bg-blue-600 transition-colors shadow-inner">
                                            <Store className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors" />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={cn(
                                                "px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider",
                                                shop.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                                            )}>
                                                {shop.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-7 w-7 text-gray-300 hover:text-red-600 hover:bg-red-50 rounded-full"
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    setShopToDelete(shop.id)
                                                }}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="space-y-2 mb-6">
                                        <h3 className="text-xl font-black text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                                            {shop.name}
                                        </h3>
                                        <p className="text-gray-500 text-xs font-medium line-clamp-2 leading-relaxed">
                                            {shop.description || "No description provided. Click to manage settings."}
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-between pt-5 border-t border-gray-50">
                                        <div className="flex items-center gap-2">
                                            <Switch
                                                checked={shop.is_active}
                                                onCheckedChange={(checked) => handleToggleActive(shop.id, shop.is_active, event as any)}
                                                disabled={togglingShopId === shop.id}
                                                onClick={(e) => e.stopPropagation()}
                                                className="data-[state=checked]:bg-green-500 scale-90"
                                            />
                                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">
                                                {togglingShopId === shop.id ? 'Updating...' : shop.is_active ? 'Live' : 'Paused'}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-1.5">
                                            <div
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    router.push(`/portal/${shop.id}/widget`)
                                                }}
                                                className="p-1.5 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                                                title="Booking Widget"
                                            >
                                                <Rocket className="w-4.5 h-4.5" />
                                            </div>
                                            <div className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all transform group-hover:translate-x-1">
                                                <ArrowRight className="w-4 h-4" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <div
                                onClick={() => setIsCreateDialogOpen(true)}
                                className="bg-slate-50/50 rounded-[1.5rem] p-6 border-2 border-dashed border-gray-200 hover:border-blue-300 hover:bg-blue-50/30 transition-all cursor-pointer flex flex-col items-center justify-center text-center min-h-[220px] group"
                            >
                                <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <Plus className="w-6 h-6 text-blue-600" />
                                </div>
                                <h3 className="text-lg font-black text-gray-900 mb-1.5">Add New Shop</h3>
                                <p className="text-xs text-gray-400 font-medium max-w-[150px]">Grow your brand with another AI receptionist</p>
                            </div>
                        </div>

                        {/* Recent Activity Section */}
                        <div className="mt-16 space-y-8">
                            <div className="flex items-center justify-between px-2">
                                <h2 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                                    Recent Activity
                                    <span className="text-gray-300 text-lg font-normal">/</span>
                                    <span className="text-gray-400 text-sm font-bold uppercase tracking-widest">Pending Scrapes</span>
                                </h2>
                                <Button variant="ghost" size="sm" className="text-blue-600 font-bold hover:bg-blue-50" onClick={() => setShowUrlModal(true)}>
                                    <Wand2 className="w-4 h-4 mr-2" />
                                    New Scan
                                </Button>
                            </div>

                            <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
                                {isLoadingScrapes ? (
                                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                                        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
                                        <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Processing data...</p>
                                    </div>
                                ) : recentScrapes.length > 0 ? (
                                    <div className="divide-y divide-gray-50">
                                        {recentScrapes.map((job) => (
                                            <div key={job.id} className="p-6 flex items-center justify-between hover:bg-slate-50/30 transition-colors group">
                                                <div className="flex items-center gap-4 flex-1 min-w-0">
                                                    <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100 group-hover:bg-white transition-colors">
                                                        <Globe className="w-5 h-5 text-gray-400" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-base font-bold text-gray-900 truncate mb-1">{job.url}</p>
                                                        <div className="flex items-center gap-3">
                                                            <span className={cn(
                                                                "inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-tighter",
                                                                job.status === 'completed' ? 'bg-green-100 text-green-700' :
                                                                    job.status === 'failed' ? 'bg-red-100 text-red-700' :
                                                                        'bg-blue-100 text-blue-700'
                                                            )}>
                                                                {job.status}
                                                            </span>
                                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                                                {new Date(job.created_at).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    {job.status === 'completed' && (
                                                        <Button
                                                            size="sm"
                                                            className="bg-blue-600 hover:bg-blue-700 text-white font-black px-4 rounded-lg shadow-lg shadow-blue-200"
                                                            onClick={() => handleReviewScrape(job.id)}
                                                        >
                                                            Finalize Setup
                                                        </Button>
                                                    )}
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="text-gray-300 hover:text-red-600 rounded-xl"
                                                        onClick={() => handleDeleteScrape(job.id)}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-24 text-center px-10">
                                        <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-8">
                                            <Wand2 className="w-10 h-10 text-gray-200" />
                                        </div>
                                        <p className="text-xl font-black text-gray-900 mb-2">No pending imports</p>
                                        <p className="text-gray-400 font-medium max-w-[280px] mb-10">
                                            Imported salon data will appear here for your review and final activation.
                                        </p>
                                        <Button
                                            variant="outline"
                                            onClick={() => setShowUrlModal(true)}
                                            className="rounded-2xl border-gray-200 font-black text-gray-600 hover:bg-slate-50 px-8 py-6 h-auto"
                                        >
                                            Start AI Scrape
                                        </Button>
                                    </div>
                                )}
                            </div>
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
        <main className="min-h-screen bg-[#fcfcfd]">
            <Header />

            <div className="pt-28 pb-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                        <div className="space-y-1">
                            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
                                Welcome, <span className="text-blue-600 font-black">{user?.firstName || 'Back'}</span>
                            </h1>
                            <p className="text-base text-gray-500 font-medium">
                                Let's get your salon's AI agent up and running.
                            </p>
                        </div>

                        {scrapingLimits && (
                            <div className="bg-white px-4 py-2.5 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-end min-w-[180px]">
                                <div className="flex items-center gap-2 mb-1.5">
                                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Auto Import Usage</span>
                                </div>
                                <div className="w-full space-y-1.5">
                                    <div className="flex items-center justify-between text-[11px] font-bold">
                                        <span className="text-gray-900">{scrapingLimits.scraping_count}/{scrapingLimits.scraping_limit}</span>
                                        <span className="text-blue-600">{Math.round((scrapingLimits.scraping_count / scrapingLimits.scraping_limit) * 100)}%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className={cn(
                                                "h-full rounded-full transition-all duration-1000",
                                                scrapingLimits.scraping_remaining === 0 ? 'bg-red-500' : 'bg-blue-600'
                                            )}
                                            style={{ width: `${(scrapingLimits.scraping_count / scrapingLimits.scraping_limit) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 gap-8">
                        {/* Hero: Create Shop */}
                        <div className="relative group overflow-hidden bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 rounded-[2rem] p-0.5 shadow-xl shadow-blue-200/50">
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                            <div className="relative bg-white/5 backdrop-blur-sm rounded-[1.85rem] p-8 md:p-12 text-center text-white">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-6 backdrop-blur-md shadow-inner">
                                    <Bot className="w-8 h-8 text-white" />
                                </div>
                                <h2 className="text-3xl font-black mb-3 tracking-tight">Create Your AI Agent</h2>
                                <p className="text-blue-50 text-lg font-medium mb-8 max-w-lg mx-auto leading-relaxed">
                                    Build a custom AI receptionist that handles bookings, answers questions, and grows your salon 24/7.
                                </p>
                                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                    <Button
                                        onClick={() => setIsCreateDialogOpen(true)}
                                        className="h-11 bg-white text-blue-600 hover:bg-blue-50 font-bold px-8 rounded-xl text-sm shadow-sm transition-all flex items-center justify-center"
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Manual Setup
                                    </Button>
                                    <div className="flex items-center gap-3">
                                        <div className="h-[1px] w-4 bg-white/20"></div>
                                        <span className="text-white/40 font-bold uppercase text-[9px] tracking-widest">OR</span>
                                        <div className="h-[1px] w-4 bg-white/20"></div>
                                    </div>
                                    <Button
                                        onClick={() => setShowUrlModal(true)}
                                        className="h-11 bg-blue-400/20 hover:bg-blue-400/30 text-white border border-white/20 font-bold px-8 rounded-xl text-sm backdrop-blur-sm transition-all flex items-center justify-center"
                                    >
                                        <Wand2 className="w-4 h-4 mr-2" />
                                        Use AI Import
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Feature Box: Smart Auto Import */}
                        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl shadow-slate-200/40 border border-gray-100 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-48 h-48 bg-purple-50 rounded-full -mr-24 -mt-24 opacity-40 blur-3xl"></div>
                            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                                <div className="flex-1 space-y-5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-11 h-11 bg-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-200">
                                            <Wand2 className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900">AI Auto-Import</h3>
                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-purple-100 text-purple-700">
                                                Smart Engine v2.0
                                            </span>
                                        </div>
                                    </div>

                                    <p className="text-gray-600 text-base leading-relaxed">
                                        Already have a website? Our AI will extract your <span className="text-purple-600 font-bold">services</span>, <span className="text-purple-600 font-bold">staff</span>, and <span className="text-purple-600 font-bold">hours</span> instantly.
                                    </p>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {[
                                            "Automatic data extraction",
                                            "AI-powered categorization",
                                            "Real-time sync capability",
                                            "Review before import"
                                        ].map((item, idx) => (
                                            <div key={idx} className="flex items-center gap-2.5 bg-slate-50/50 p-2.5 rounded-xl border border-gray-50">
                                                <div className="w-1.5 h-1.5 bg-green-500 rounded-full shadow-lg shadow-green-200" />
                                                <span className="text-xs font-semibold text-gray-700">{item}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex flex-col items-center gap-3 w-full md:w-auto">
                                    <Button
                                        className="w-full md:w-auto h-12 bg-purple-600 hover:bg-purple-700 text-white font-bold px-8 rounded-xl text-sm shadow-sm transition-all"
                                        onClick={() => setShowUrlModal(true)}
                                    >
                                        <Globe className="w-4 h-4 mr-2" />
                                        Scan Website
                                    </Button>
                                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Takes ~2 minutes</p>
                                </div>
                            </div>
                        </div>

                        {/* Recent Activity/Scrapes */}
                        <div className="space-y-6">
                            <div className="flex items-center justify-between px-2">
                                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                    Pending Scrapes
                                    <span className="bg-gray-100 text-gray-500 text-[10px] px-2 py-0.5 rounded-full">{recentScrapes.length}</span>
                                </h2>
                                {recentScrapes.length > 0 && (
                                    <Button variant="ghost" size="sm" className="text-blue-600 font-bold" onClick={() => setShowUrlModal(true)}>
                                        <Plus className="w-4 h-4 mr-2" />
                                        New Import
                                    </Button>
                                )}
                            </div>

                            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                                {isLoadingScrapes ? (
                                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                                        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
                                        <p className="text-gray-400 font-medium">Checking activity...</p>
                                    </div>
                                ) : recentScrapes.length > 0 ? (
                                    <div className="divide-y divide-gray-50">
                                        {recentScrapes.map((job) => (
                                            <div key={job.id} className="p-6 flex items-center justify-between hover:bg-slate-50/50 transition-colors group">
                                                <div className="flex items-center gap-4 flex-1 min-w-0">
                                                    <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100 group-hover:bg-white transition-colors">
                                                        <Globe className="w-5 h-5 text-gray-400" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-bold text-gray-900 truncate mb-1">{job.url}</p>
                                                        <div className="flex items-center gap-3">
                                                            <span className={cn(
                                                                "inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-tighter",
                                                                job.status === 'completed' ? 'bg-green-100 text-green-700' :
                                                                    job.status === 'failed' ? 'bg-red-100 text-red-700' :
                                                                        'bg-blue-100 text-blue-700'
                                                            )}>
                                                                {job.status}
                                                            </span>
                                                            <span className="text-[10px] font-bold text-gray-400 tabular-nums">
                                                                {new Date(job.created_at).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    {job.status === 'completed' && (
                                                        <Button
                                                            size="sm"
                                                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl"
                                                            onClick={() => handleReviewScrape(job.id)}
                                                        >
                                                            Finalize Shop
                                                        </Button>
                                                    )}
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="text-gray-300 hover:text-red-600 rounded-xl"
                                                        onClick={() => handleDeleteScrape(job.id)}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-20 text-center px-6">
                                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                                            <Wand2 className="w-8 h-8 text-gray-300" />
                                        </div>
                                        <p className="text-gray-900 font-bold mb-2">No pending scrapes</p>
                                        <p className="text-gray-400 text-sm max-w-[240px] mb-8">
                                            Your imported shop data will appear here until you review it.
                                        </p>
                                        <Button
                                            variant="outline"
                                            onClick={() => setShowUrlModal(true)}
                                            className="rounded-2xl border-gray-200 font-bold text-gray-600 hover:bg-slate-50"
                                        >
                                            Start Your First Import
                                        </Button>
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
                <AlertDialogContent className="max-w-md rounded-[0.7rem] p-8">
                    <AlertDialogHeader className="mb-6">
                        <AlertDialogTitle className="text-2xl font-black text-gray-900 flex items-center gap-3">
                            <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                                <Wand2 className="w-5 h-5 text-purple-600" />
                            </div>
                            {scrapingLimits?.scraping_remaining === 0 ? 'Limit Reached' : 'Start Auto-Import'}
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-base text-gray-500 font-medium">
                            {scrapingLimits?.scraping_remaining === 0
                                ? "You have reached your monthly limit for auto-imports. Please upgrade your plan to continue importing shops."
                                : "Enter your website URL and we'll automatically extract your services, staff, and business details."
                            }
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    {scrapingLimits?.scraping_remaining === 0 ? (
                        <div className="py-4 flex flex-col items-center justify-center text-center space-y-3">
                            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center">
                                <Shield className="w-8 h-8 text-red-500" />
                            </div>
                            <p className="text-sm text-gray-600">
                                You've used {scrapingLimits.scraping_count} of {scrapingLimits.scraping_limit} available imports.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                                    Website URL
                                </label>
                                <div className="relative group">
                                    <Globe className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-purple-600 transition-colors" />
                                    <input
                                        type="url"
                                        value={scrapeUrl}
                                        onChange={(e) => setScrapeUrl(e.target.value)}
                                        placeholder="https://yourbusiness.com"
                                        className="w-full h-14 pl-12 pr-4 bg-gray-50/50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none transition-all font-medium text-gray-900 placeholder:text-gray-300"
                                    />
                                </div>
                                <div className="flex items-center gap-2 ml-1">
                                    <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                                        Make sure the URL is publicly accessible
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    <AlertDialogFooter className="mt-8 gap-3 sm:gap-2">
                        <AlertDialogCancel
                            onClick={() => {
                                setScrapeUrl("")
                                setShowUrlModal(false)
                            }}
                            className="h-11 rounded-xl font-bold text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-all border-none"
                        >
                            {scrapingLimits?.scraping_remaining === 0 ? 'Close' : 'Cancel'}
                        </AlertDialogCancel>
                        {scrapingLimits?.scraping_remaining !== 0 && (
                            <AlertDialogAction
                                onClick={() => {
                                    setShowUrlModal(false)
                                    setIsCreateDialogOpen(true)
                                }}
                                disabled={!scrapeUrl || !scrapeUrl.startsWith('http')}
                                className="h-11 bg-purple-600 hover:bg-purple-700 text-white font-bold px-8 rounded-xl shadow-sm transition-all"
                            >
                                <Wand2 className="w-4 h-4 mr-2" />
                                Start Scraping
                            </AlertDialogAction>
                        )}
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </main>
    )
}
