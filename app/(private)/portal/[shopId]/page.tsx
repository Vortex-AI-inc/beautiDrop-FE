"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@clerk/nextjs"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
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
            <main className="min-h-screen bg-slate-50">
                <Header />
                <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-5xl mx-auto">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 mb-8">
                            <div className="flex flex-col items-center justify-center">
                                <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
                                <h2 className="text-xl font-bold text-gray-900 mb-2">Loading Dashboard</h2>
                                <p className="text-gray-600">Fetching your shop data...</p>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </main>
        )
    }

    if (!dashboardData || !selectedShop) {
        return null
    }

    return (
        <main className="min-h-screen bg-slate-50">
            <Header />

            <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-5xl mx-auto">
                    <Link
                        href="/portal"
                        className="mb-6 text-sm text-gray-500 hover:text-gray-900 flex items-center gap-1 inline-flex"
                    >
                        ← Back to all shops
                    </Link>

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

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <Link href={`/portal/${shopId}/company`} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer text-center group relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -mr-4 -mt-4 opacity-50 group-hover:scale-110 transition-transform"></div>
                                <div className="relative z-10">
                                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                                        <Building2 className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <h3 className="font-semibold text-gray-900 text-sm">Company</h3>
                                    <p className="text-xs text-gray-500 mt-1">Business information</p>
                                </div>
                            </Link>
                            <Link href={`/portal/${shopId}/staff`} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer text-center group relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-orange-50 rounded-bl-full -mr-4 -mt-4 opacity-50 group-hover:scale-110 transition-transform"></div>
                                <div className="relative z-10">
                                    <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center mx-auto mb-3">
                                        <Users className="w-5 h-5 text-orange-600" />
                                    </div>
                                    <h3 className="font-semibold text-gray-900 text-sm">Staff</h3>
                                    <p className="text-xs text-gray-500 mt-1">Team management</p>
                                </div>
                            </Link>

                            <Link href={`/portal/${shopId}/services`} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer text-center group relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-teal-50 rounded-bl-full -mr-4 -mt-4 opacity-50 group-hover:scale-110 transition-transform"></div>
                                <div className="relative z-10">
                                    <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                                        <Scissors className="w-5 h-5 text-teal-600" />
                                    </div>
                                    <h3 className="font-semibold text-gray-900 text-sm">Services</h3>
                                    <p className="text-xs text-gray-500 mt-1">Service offerings</p>
                                </div>
                            </Link>

                            <DealsCard shopId={shopId} />

                            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm text-center opacity-50 pointer-events-none group relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-purple-50 rounded-bl-full -mr-4 -mt-4 opacity-50"></div>
                                <div className="relative z-10">
                                    <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center mx-auto mb-3">
                                        <Phone className="w-5 h-5 text-purple-600" />
                                    </div>
                                    <h3 className="font-semibold text-gray-900 text-sm">Phone</h3>
                                    <p className="text-xs text-gray-500 mt-1">Call routing</p>
                                </div>
                            </div>
                            <Link href={`/portal/${shopId}/scheduling`} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer text-center group relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-red-50 rounded-bl-full -mr-4 -mt-4 opacity-50 group-hover:scale-110 transition-transform"></div>
                                <div className="relative z-10">
                                    <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                                        <Calendar className="w-5 h-5 text-red-600" />
                                    </div>
                                    <h3 className="font-semibold text-gray-900 text-sm">Scheduling</h3>
                                    <p className="text-xs text-gray-500 mt-1">Appointment management</p>
                                </div>
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div
                                onClick={() => setShowPricingModal(true)}
                                className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-lg transition-all cursor-pointer flex items-center gap-4 group relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-24 h-24 bg-red-50 rounded-bl-full -mr-4 -mt-4 opacity-50 group-hover:scale-110 transition-transform"></div>
                                <div className="relative z-10 flex items-center gap-4 w-full">
                                    <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                                        <CreditCard className="w-5 h-5 text-red-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Billing</h3>
                                        <p className="text-sm text-gray-500">Manage subscription</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4 opacity-50 pointer-events-none group relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-orange-50 rounded-bl-full -mr-4 -mt-4 opacity-50"></div>
                                <div className="relative z-10 flex items-center gap-4 w-full">
                                    <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Rocket className="w-5 h-5 text-orange-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Publish Agent</h3>
                                        <p className="text-sm text-gray-500">Deploy your AI receptionist</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 shadow-sm flex items-center gap-4 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-100 rounded-bl-full -mr-4 -mt-4 opacity-50"></div>
                                <div className="relative z-10 flex items-center gap-4 w-full">
                                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Headphones className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Need Help?</h3>
                                        <p className="text-xs text-gray-600 mt-1 mb-2">Our support team is here to assist you</p>
                                        <Link href="/contact" className="text-blue-600 text-sm font-semibold flex items-center hover:underline">
                                            Contact Support <ExternalLink className="w-3 h-3 ml-1" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />

            <PricingModal
                isOpen={showPricingModal}
                onClose={() => setShowPricingModal(false)}
            />
        </main>
    )
}
