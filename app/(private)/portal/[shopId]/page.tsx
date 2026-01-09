"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@clerk/nextjs"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import {
    Shield,
    Loader2,
    Building2,
    Users,
    Sparkles,
    Phone,
    Calendar,
    CreditCard,
    Rocket,
    Headphones,
    ExternalLink,
    Scissors
} from "lucide-react"
import { fetchShopDashboard, fetchShop } from "@/lib/api/shop"
import type { ShopDashboardData } from "@/types/shop"
import { useShopStore } from "@/lib/store/shop-store"
import { PricingModal } from "@/components/PricingModal"
import { DealsCard } from "@/components/portal/deals-card"

export default function ShopDashboardPage() {
    const { getToken } = useAuth()
    const router = useRouter()
    const params = useParams()
    const shopId = params.shopId as string

    const { selectedShop, setSelectedShop, dashboardData, setDashboardData } = useShopStore()

    const [isLoading, setIsLoading] = useState(true)
    const [showPricingModal, setShowPricingModal] = useState(false)

    useEffect(() => {
        const loadShopDashboard = async () => {
            try {
                setIsLoading(true)
                const token = await getToken()
                if (!token) {
                    router.push('/login')
                    return
                }

                const [data, shop] = await Promise.all([
                    fetchShopDashboard(shopId, token),
                    fetchShop(shopId, token)
                ])

                if (!data || !shop) {
                    router.push('/portal')
                    return
                }

                setDashboardData(data)
                setSelectedShop(shop)
            } catch (error) {
                router.push('/portal')
            } finally {
                setIsLoading(false)
            }
        }

        loadShopDashboard()
    }, [shopId, getToken, router, setDashboardData, setSelectedShop])

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
                <h2 className="text-xl font-bold text-gray-900 mb-2">Loading Dashboard</h2>
                <p className="text-gray-600 font-medium">Fetching your shop data...</p>
            </div>
        )
    }

    if (!dashboardData || !selectedShop) {
        return null
    }

    return (
        <>
            <div className="space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 underline decoration-blue-500/30 underline-offset-8">{selectedShop.name}</h1>
                        <p className="text-muted-foreground mt-1">{selectedShop.description || "Overview of your shop's performance."}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className={`px-4 py-1.5 rounded-full text-sm font-semibold shadow-sm ${selectedShop.is_active ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-gray-100 text-gray-700 border border-gray-200'}`}>
                            {selectedShop.is_active ? 'Active' : 'Inactive'}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 group hover:border-blue-200 transition-colors">
                        <p className="text-sm font-medium text-gray-500 mb-2">Total Bookings</p>
                        <p className="text-3xl font-bold text-gray-900">{dashboardData.total_bookings}</p>
                        <p className="text-xs font-semibold text-green-600 mt-2 flex items-center gap-1">
                            <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
                            +{dashboardData.bookings_today} today
                        </p>
                    </div>
                    <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 group hover:border-blue-200 transition-colors">
                        <p className="text-sm font-medium text-gray-500 mb-2">Revenue</p>
                        <p className="text-3xl font-bold text-gray-900">${dashboardData.total_revenue}</p>
                        <p className="text-xs font-semibold text-green-600 mt-2 flex items-center gap-1">
                            <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
                            +${dashboardData.revenue_this_month} this month
                        </p>
                    </div>
                    <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 group hover:border-blue-200 transition-colors">
                        <p className="text-sm font-medium text-gray-500 mb-2">Pending Bookings</p>
                        <p className="text-3xl font-bold text-gray-900">{dashboardData.pending_bookings}</p>
                        <p className="text-xs font-medium text-gray-400 mt-2">Waiting for confirmation</p>
                    </div>
                    <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 group hover:border-blue-200 transition-colors">
                        <p className="text-sm font-medium text-gray-500 mb-2">Total Services</p>
                        <p className="text-3xl font-bold text-gray-900">{dashboardData.total_services}</p>
                        <p className="text-xs font-medium text-gray-400 mt-2">Active in menu</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Link href={`/portal/${shopId}/company`} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -mr-4 -mt-4 opacity-50 group-hover:scale-110 transition-transform"></div>
                        <div className="relative z-10">
                            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Building2 className="w-6 h-6 text-blue-600" />
                            </div>
                            <h3 className="font-bold text-gray-900">Company</h3>
                            <p className="text-sm text-gray-500 mt-1">Manage your business details & hours</p>
                        </div>
                    </Link>

                    <Link href={`/portal/${shopId}/staff`} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-orange-50 rounded-bl-full -mr-4 -mt-4 opacity-50 group-hover:scale-110 transition-transform"></div>
                        <div className="relative z-10">
                            <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Users className="w-6 h-6 text-orange-600" />
                            </div>
                            <h3 className="font-bold text-gray-900">Staff</h3>
                            <p className="text-sm text-gray-500 mt-1">Manage your team and assignments</p>
                        </div>
                    </Link>

                    <Link href={`/portal/${shopId}/services`} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-teal-50 rounded-bl-full -mr-4 -mt-4 opacity-50 group-hover:scale-110 transition-transform"></div>
                        <div className="relative z-10">
                            <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Scissors className="w-6 h-6 text-teal-600" />
                            </div>
                            <h3 className="font-bold text-gray-900">Services</h3>
                            <p className="text-sm text-gray-500 mt-1">Customize your service menu</p>
                        </div>
                    </Link>

                    <Link href={`/portal/${shopId}/deals`} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-purple-50 rounded-bl-full -mr-4 -mt-4 opacity-50 group-hover:scale-110 transition-transform"></div>
                        <div className="relative z-10">
                            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Sparkles className="w-6 h-6 text-purple-600" />
                            </div>
                            <h3 className="font-bold text-gray-900">Deals & Offers</h3>
                            <p className="text-sm text-gray-500 mt-1">Create packages and promotions</p>
                        </div>
                    </Link>

                    <Link href={`/portal/${shopId}/scheduling`} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-red-50 rounded-bl-full -mr-4 -mt-4 opacity-50 group-hover:scale-110 transition-transform"></div>
                        <div className="relative z-10">
                            <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Calendar className="w-6 h-6 text-red-600" />
                            </div>
                            <h3 className="font-bold text-gray-900">Scheduling</h3>
                            <p className="text-sm text-gray-500 mt-1">Manage bookings and availability</p>
                        </div>
                    </Link>

                    <div
                        onClick={() => setShowPricingModal(true)}
                        className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer group relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-24 h-24 bg-rose-50 rounded-bl-full -mr-4 -mt-4 opacity-50 group-hover:scale-110 transition-transform"></div>
                        <div className="relative z-10">
                            <div className="w-12 h-12 bg-rose-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <CreditCard className="w-6 h-6 text-rose-600" />
                            </div>
                            <h3 className="font-bold text-gray-900">Billing</h3>
                            <p className="text-sm text-gray-500 mt-1">Manage your subscription & invoices</p>
                        </div>
                    </div>
                </div>

                {/* Additional Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm transition-all opacity-70 group relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-orange-50 rounded-bl-full -mr-4 -mt-4 opacity-50"></div>
                        <div className="relative z-10 flex items-center gap-4">
                            <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center flex-shrink-0">
                                <Rocket className="w-6 h-6 text-orange-600" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h3 className="font-bold text-gray-900">Publish Agent</h3>
                                    <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-[10px] font-bold rounded-lg uppercase">Coming Soon</span>
                                </div>
                                <p className="text-sm text-gray-500">Deploy your AI receptionist to handle calls</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm transition-all opacity-70 group relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-bl-full -mr-4 -mt-4 opacity-50"></div>
                        <div className="relative z-10 flex items-center gap-4">
                            <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center flex-shrink-0">
                                <Phone className="w-6 h-6 text-indigo-600" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h3 className="font-bold text-gray-900">Phone Integration</h3>
                                    <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-[10px] font-bold rounded-lg uppercase">Coming Soon</span>
                                </div>
                                <p className="text-sm text-gray-500">Connect your business number</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm transition-all opacity-70 group relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-purple-50 rounded-bl-full -mr-4 -mt-4 opacity-50"></div>
                        <div className="relative z-10 flex items-center gap-4">
                            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center flex-shrink-0">
                                <CreditCard className="w-6 h-6 text-purple-600" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h3 className="font-bold text-gray-900">Stripe Connect</h3>
                                    <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-[10px] font-bold rounded-lg uppercase">Coming Soon</span>
                                </div>
                                <p className="text-sm text-gray-500">Accept payments directly</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <PricingModal
                isOpen={showPricingModal}
                onClose={() => setShowPricingModal(false)}
            />
        </>
    )
}
