"use client"

import { useParams } from "next/navigation"
import { Header } from "@/components/layout/header"
import { ShopSidebar } from "@/components/layout/shop-sidebar"

export default function ShopSettingsLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const params = useParams()
    const shopId = params.shopId as string

    return (
        <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
            <Header />
            <div className="flex-1 pt-20">
                <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Sidebar for Desktop */}
                        <aside className="hidden md:block w-72 flex-shrink-0 sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto py-8">
                            <ShopSidebar shopId={shopId} />
                        </aside>

                        {/* Main Content Area */}
                        <main className="flex-1 min-w-0 pt-0 pb-8 md:py-8 flex flex-col min-h-[calc(100vh-5rem)]">
                            {/* Mobile Navigation */}
                            <div className="md:hidden sticky top-20 z-30 -mx-4 sm:-mx-6 px-4 sm:px-6 py-3 bg-white/80 backdrop-blur-md border-b border-gray-100 mb-2">
                                <ShopSidebar shopId={shopId} isMobile />
                            </div>

                            <div className="flex-1">
                                {children}
                            </div>

                            <footer className="mt-12 py-8 border-t border-gray-100 text-center text-xs text-gray-400">
                                &copy; {new Date().getFullYear()} Beauty Drop AI. All rights reserved.
                            </footer>
                        </main>
                    </div>
                </div>
            </div>
        </div>
    )
}
