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
        <div className="flex flex-col min-h-screen bg-slate-50">
            <Header />
            <div className="flex flex-1 pt-20">
                {/* Sidebar for Desktop */}
                <aside className="hidden md:block w-72 border-r border-gray-100 bg-white fixed left-0 top-20 bottom-0 pointer-events-auto overflow-y-auto">
                    <ShopSidebar shopId={shopId} />
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 md:ml-72 flex flex-col min-h-[calc(100vh-5rem)]">
                    {/* Mobile Navigation */}
                    <div className="md:hidden sticky top-20 z-30 px-4 py-2 bg-white/80 backdrop-blur-md border-b border-gray-100">
                        <ShopSidebar shopId={shopId} isMobile />
                    </div>

                    <div className="flex-1 p-4 sm:p-6 lg:p-8">
                        <div className="max-w-6xl mx-auto">
                            {children}
                        </div>
                    </div>

                    {/* Minimal interior footer or extra space */}
                    <footer className="p-8 text-center text-xs text-gray-400">
                        &copy; {new Date().getFullYear()} Beauty Drop AI. All rights reserved.
                    </footer>
                </main>
            </div>
        </div>
    )
}
