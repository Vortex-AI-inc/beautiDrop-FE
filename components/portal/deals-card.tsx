"use client"

import { Tag } from "lucide-react"
import Link from "next/link"

interface DealsCardProps {
    shopId: string
}

export function DealsCard({ shopId }: DealsCardProps) {
    return (
        <Link
            href={`/portal/${shopId}/deals`}
            className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer text-center group relative overflow-hidden"
        >
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-50 rounded-bl-full -mr-4 -mt-4 opacity-50 group-hover:scale-110 transition-transform"></div>

            <div className="relative z-10">
                <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                    <Tag className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 text-sm">Deals & Offers</h3>
                <p className="text-xs text-gray-500 mt-1">Manage salon packages</p>
            </div>
        </Link>
    )
}
