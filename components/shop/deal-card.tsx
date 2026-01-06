import { useState } from "react"
import { Deal } from "@/types/deal"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Sparkles, Tag } from "lucide-react"
import Image from "next/image"

interface DealCardProps {
    deal: Deal
    index: number
    onBook?: (deal: Deal) => void
}

export function DealCard({ deal, index, onBook }: DealCardProps) {
    const [isExpanded, setIsExpanded] = useState(false)

    const allItems = deal.included_items || []
    const displayCount = 3
    const shouldTruncate = allItems.length > displayCount
    const displayedItems = isExpanded ? allItems : allItems.slice(0, displayCount)

    return (
        <div
            className="group flex flex-col bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden h-full w-full"
            style={{ animationDelay: `${index * 100}ms` }}
        >
            {/* Image Header */}
            <div className="relative h-48 w-full bg-gray-100 shrink-0">
                {deal.image_url ? (
                    <Image
                        src={deal.image_url}
                        alt={deal.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-purple-50">
                        <Tag className="w-10 h-10 text-purple-200" />
                    </div>
                )}
                <div className="absolute top-4 right-4">
                    <Badge className="bg-white/90 text-purple-700 hover:bg-white font-bold backdrop-blur-sm shadow-sm border-0">
                        <Sparkles className="w-3 h-3 mr-1 fill-purple-700" /> Deal
                    </Badge>
                </div>
            </div>

            {/* Content */}
            <div className="flex flex-col flex-1 p-5">
                <div className="mb-4">
                    <h3 className="font-bold text-lg text-gray-900 mb-1 group-hover:text-purple-600 transition-colors leading-tight">
                        {deal.name}
                    </h3>
                    <p className="text-2xl font-bold text-gray-900">
                        ${parseFloat(deal.price).toFixed(0)}
                    </p>
                </div>

                {deal.description && (
                    <p className="text-gray-500 text-sm mb-4 line-clamp-2 leading-relaxed">
                        {deal.description}
                    </p>
                )}

                {/* Items List */}
                {allItems.length > 0 && (
                    <div className="mt-auto mb-4 bg-gray-50 rounded-lg p-3">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                            Includes
                        </p>
                        <ul className="space-y-2">
                            {displayedItems.map((item, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                                    <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                                    <span className="leading-tight">{item}</span>
                                </li>
                            ))}
                        </ul>
                        {shouldTruncate && (
                            <button
                                onClick={(e) => {
                                    e.preventDefault()
                                    setIsExpanded(!isExpanded)
                                }}
                                className="text-xs font-medium text-purple-600 hover:text-purple-700 mt-2 block hover:underline"
                            >
                                {isExpanded ? "Show less" : `+ ${allItems.length - displayCount} more items`}
                            </button>
                        )}
                    </div>
                )}

                <Button
                    onClick={() => onBook?.(deal)}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg mt-auto shadow-sm"
                >
                    Book Deal
                </Button>
            </div>
        </div>
    )
}
