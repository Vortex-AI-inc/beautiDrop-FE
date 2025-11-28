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
    ArrowRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { fetchMyShops, fetchShopDashboard } from "@/lib/api/shop"
import type { ShopDashboardData, Shop } from "@/types/shop"
import { CreateAgentDialog } from "@/components/portal/create-agent-dialog"

import { useShopStore } from "@/lib/store/shop-store"

export default function PortalPage() {
    const { isLoaded, isSignedIn, user } = useUser()
    const { getToken } = useAuth()
    const router = useRouter()

    // Global State
    const { selectedShop, setSelectedShop, dashboardData, setDashboardData } = useShopStore()

    const [isLoading, setIsLoading] = useState(true)
    const [shops, setShops] = useState<Shop[]>([])
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

    const loadShops = async () => {
        try {
            setIsLoading(true)
            const token = await getToken()
            if (!token) return

            const myShops = await fetchMyShops(token)
            setShops(myShops)
        } catch (error) {
            console.error("Failed to load shops", error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleShopSelect = async (shop: Shop) => {
        try {
            setIsLoading(true)
            setSelectedShop(shop)
            const token = await getToken()
            if (!token) return

            const data = await fetchShopDashboard(shop.id, token)
            setDashboardData(data)
        } catch (error) {
            console.error("Failed to load dashboard data", error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (isLoaded && !isSignedIn) {
            router.push('/login')
        } else if (isLoaded && isSignedIn) {
            loadShops()
        }
    }, [isLoaded, isSignedIn, router])

    if (!isLoaded || !isSignedIn) {
        return null
    }

    // View: Loading
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

    // View: Shop Selection (if multiple shops or no shop selected yet)
    if (!selectedShop && shops.length > 0) {
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
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${shop.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                                            {shop.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{shop.name}</h3>
                                    <p className="text-sm text-gray-500 mb-4 line-clamp-2">{shop.description}</p>
                                    <div className="flex items-center text-blue-600 text-sm font-medium group-hover:translate-x-1 transition-transform">
                                        Manage Shop <ArrowRight className="w-4 h-4 ml-1" />
                                    </div>
                                </div>
                            ))}

                            {/* Add New Shop Card */}
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
                </div>
                <Footer />
                <CreateAgentDialog
                    open={isCreateDialogOpen}
                    onOpenChange={setIsCreateDialogOpen}
                    onSuccess={() => {
                        loadShops()
                    }}
                />
            </main>
        )
    }

    // View: Dashboard (if shop selected) OR Empty State (if no shops exist)
    return (
        <main className="min-h-screen bg-slate-50">
            <Header />

            <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-5xl mx-auto">

                    {/* Back to Shops Link (only if we have shops) */}
                    {shops.length > 0 && (
                        <button
                            onClick={() => setSelectedShop(null)}
                            className="mb-6 text-sm text-gray-500 hover:text-gray-900 flex items-center gap-1"
                        >
                            ← Back to all shops
                        </button>
                    )}

                    {!selectedShop && (
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
                    )}

                    {selectedShop && dashboardData ? (
                        /* Dashboard View (When data exists) */
                        <div className="space-y-6">
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900">{selectedShop.name}</h2>
                                        <p className="text-gray-600">{selectedShop.description}</p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${selectedShop.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                                        {selectedShop.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div className="p-4 bg-slate-50 rounded-xl">
                                        <p className="text-sm text-gray-500 mb-1">Total Bookings</p>
                                        <p className="text-2xl font-bold text-gray-900">{dashboardData.total_bookings}</p>
                                        <p className="text-xs text-green-600 mt-1">+{dashboardData.bookings_today} today</p>
                                    </div>
                                    <div className="p-4 bg-slate-50 rounded-xl">
                                        <p className="text-sm text-gray-500 mb-1">Revenue</p>
                                        <p className="text-2xl font-bold text-gray-900">${dashboardData.total_revenue}</p>
                                        <p className="text-xs text-green-600 mt-1">+${dashboardData.revenue_this_month} this month</p>
                                    </div>
                                    <div className="p-4 bg-slate-50 rounded-xl">
                                        <p className="text-sm text-gray-500 mb-1">Pending Bookings</p>
                                        <p className="text-2xl font-bold text-gray-900">{dashboardData.pending_bookings}</p>
                                    </div>
                                    <div className="p-4 bg-slate-50 rounded-xl">
                                        <p className="text-sm text-gray-500 mb-1">Total Services</p>
                                        <p className="text-2xl font-bold text-gray-900">{dashboardData.total_services}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Actions Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                <Link href="/portal/company" className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer text-center group">
                                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                                        <Building2 className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <h3 className="font-semibold text-gray-900 text-sm">Company</h3>
                                    <p className="text-xs text-gray-500 mt-1">Business information</p>
                                </Link>
                                {[
                                    { icon: Users, label: "Staff", sub: "Team management", color: "text-orange-600", bg: "bg-orange-50" },
                                    { icon: Sparkles, label: "Services", sub: "Service offerings", color: "text-teal-600", bg: "bg-teal-50" },
                                    { icon: Phone, label: "Phone", sub: "Call routing", color: "text-purple-600", bg: "bg-purple-50" },
                                    { icon: Calendar, label: "Scheduling", sub: "Appointment management", color: "text-red-600", bg: "bg-red-50" },
                                ].map((item, i) => (
                                    <div key={i} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer text-center group">
                                        <div className={`w-10 h-10 ${item.bg} rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                                            <item.icon className={`w-5 h-5 ${item.color}`} />
                                        </div>
                                        <h3 className="font-semibold text-gray-900 text-sm">{item.label}</h3>
                                        <p className="text-xs text-gray-500 mt-1">{item.sub}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Bottom Actions */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
                                    <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <CreditCard className="w-5 h-5 text-red-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Billing</h3>
                                        <p className="text-sm text-gray-500">Manage subscription</p>
                                    </div>
                                </div>

                                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
                                    <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Rocket className="w-5 h-5 text-orange-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Publish Agent</h3>
                                        <p className="text-sm text-gray-500">Deploy your AI receptionist</p>
                                    </div>
                                </div>

                                <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 shadow-sm flex items-center gap-4">
                                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Headphones className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Need Help?</h3>
                                        <p className="text-xs text-gray-600 mt-1 mb-2">Our support team is here to assist you</p>
                                        <a href="#" className="text-blue-600 text-sm font-semibold flex items-center hover:underline">
                                            Contact Support <ExternalLink className="w-3 h-3 ml-1" />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* Empty State / Create Agent View */
                        <div className="space-y-6">
                            {/* Welcome Card */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                    Welcome back, {user?.primaryEmailAddress?.emailAddress}!
                                </h2>
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium mt-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                                    {user?.primaryEmailAddress?.emailAddress}
                                </div>

                                {/* Create Agent CTA */}
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
                                            <Plus className="w-4 h-4 mr-2" />
                                            Create Agent
                                        </Button>
                                    </div>
                                </div>

                                {/* Auto Import CTA */}
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
                                    <Button className="bg-purple-600 hover:bg-purple-700 text-white whitespace-nowrap">
                                        <Wand2 className="w-4 h-4 mr-2" />
                                        Start Auto-Import
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
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
        </main>
    )
}
