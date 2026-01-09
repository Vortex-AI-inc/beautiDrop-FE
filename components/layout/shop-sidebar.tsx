"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    LayoutDashboard,
    Building2,
    Users,
    Scissors,
    Calendar,
    Sparkles,
    Layout,
    ArrowLeft,
    ChevronRight,
    Store
} from "lucide-react"
import { cn } from "@/lib/utils"

interface ShopSidebarProps {
    shopId: string
    isMobile?: boolean
}

export function ShopSidebar({ shopId, isMobile }: ShopSidebarProps) {
    const pathname = usePathname()

    const navItems = [
        {
            label: "Dashboard",
            href: `/portal/${shopId}`,
            icon: LayoutDashboard,
            description: "Overview & statistics"
        },
        {
            label: "Company Profile",
            href: `/portal/${shopId}/company`,
            icon: Building2,
            description: "Business info & hours"
        },
        {
            label: "Team Members",
            href: `/portal/${shopId}/staff`,
            icon: Users,
            description: "Manage your staff"
        },
        {
            label: "Services",
            href: `/portal/${shopId}/services`,
            icon: Scissors,
            description: "Service menu & pricing"
        },
        {
            label: "Scheduling",
            href: `/portal/${shopId}/scheduling`,
            icon: Calendar,
            description: "Calendar & availability"
        },
        {
            label: "Deals & Offers",
            href: `/portal/${shopId}/deals`,
            icon: Sparkles,
            description: "Promotions & discounts"
        },
        {
            label: "Booking Widget",
            href: `/portal/${shopId}/widget`,
            icon: Layout,
            description: "Customize your widget"
        }
    ]

    if (isMobile) {
        return (
            <div className="flex overflow-x-auto gap-2 no-scrollbar py-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all",
                                isActive
                                    ? "bg-blue-600 text-white shadow-sm"
                                    : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                            )}
                        >
                            <item.icon className="w-4 h-4" />
                            {item.label}
                        </Link>
                    )
                })}
            </div>
        )
    }

    return (
        <div className="flex flex-col h-full">
            <div className="pb-4">
                <Link
                    href="/portal"
                    className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors text-sm font-medium group"
                >
                    <div className="p-1.5 rounded-lg group-hover:bg-gray-100 transition-colors">
                        <Store className="w-4 h-4" />
                    </div>
                    Switch Shop
                </Link>
            </div>

            <nav className="flex-1 space-y-2 overflow-y-auto">
                {navItems.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2 rounded-xl transition-all group relative",
                                isActive
                                    ? "bg-blue-50 text-blue-700 shadow-[inset_0_0_0_1px_rgba(59,130,246,0.1)]"
                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            )}
                        >
                            <div className={cn(
                                "p-2 rounded-lg transition-colors",
                                isActive ? "bg-blue-100/50" : "bg-gray-100 group-hover:bg-white"
                            )}>
                                <item.icon className={cn("w-4 h-4", isActive ? "text-blue-600" : "text-gray-500")} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-sm truncate">{item.label}</p>
                                <p className={cn(
                                    "text-[10px] truncate",
                                    isActive ? "text-blue-500/80" : "text-gray-400"
                                )}>
                                    {item.description}
                                </p>
                            </div>
                            {isActive && (
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                            )}
                        </Link>
                    )
                })}
            </nav>


        </div>
    )
}
