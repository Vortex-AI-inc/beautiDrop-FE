import { useState } from "react"
import { Deal } from "@/types/deal"
import { Button } from "@/components/ui/button"
import { Tag, Check, Sparkles } from "lucide-react"
import Image from "next/image"

interface DealCardProps {
    deal: Deal
    index: number
}

export function DealCard({ deal, index }: DealCardProps) {
    const [isExpanded, setIsExpanded] = useState(false)

    const allItems = deal.included_items || []
    const displayCount = 3
    const shouldTruncate = allItems.length > displayCount
    const displayedItems = isExpanded ? allItems : allItems.slice(0, displayCount)

    return (
        <div
            className={`group relative flex flex-col rounded-[1.5rem] bg-white shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 cursor-pointer overflow-hidden ${isExpanded ? 'h-auto' : 'h-full'}`}
            style={{ animationDelay: `${index * 100}ms` }}
        >
            <div className="relative h-48 w-full bg-gray-100">
                {deal.image_url ? (
                    <Image
                        src={deal.image_url}
                        alt={deal.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
                        <div className="w-16 h-16 bg-white/50 rounded-full flex items-center justify-center backdrop-blur-sm">
                            <Tag className="w-8 h-8 text-purple-300" />
                        </div>
                    </div>
                )}

                {/* Badge */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm z-10">
                    <span className="text-[10px] font-bold tracking-wider uppercase text-purple-900">
                        Special Deal
                    </span>
                </div>
            </div>

            {/* Content Container - Overlaps Image */}
            <div
                className={`relative z-10 mx-auto w-full flex-1 flex flex-col bg-white rounded-t-[2rem] px-5 pt-6 pb-4 text-center transition-all duration-500 ease-in-out ${isExpanded ? '-mt-32 min-h-[350px]' : '-mt-8'}`}
            >
                <h3 className="font-bold text-gray-900 text-xl mb-2 group-hover:text-purple-600 transition-colors">
                    {deal.name}
                </h3>

                <div className="inline-flex items-center justify-center bg-gray-900 text-white px-5 py-1.5 rounded-full text-sm font-bold shadow-md mb-3 mx-auto">
                    ${parseFloat(deal.price).toFixed(0)} <span className="text-[10px] font-normal opacity-70 ml-1 pt-0.5">USD</span>
                </div>

                {!isExpanded && deal.description && (
                    <p className="text-gray-500 text-xs leading-relaxed line-clamp-2 mb-3">
                        {deal.description}
                    </p>
                )}

                {/* Included Items List */}
                {allItems.length > 0 && (
                    <div className={`w-full text-left mb-3 ${isExpanded ? 'overflow-y-auto max-h-52 px-1' : ''}`}>
                        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2 text-center border-b border-gray-100 pb-2">
                            Includes ({allItems.length} items)
                        </p>
                        <ul className="space-y-1">
                            {displayedItems.map((item, i) => (
                                <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
                                    <div className="w-4 h-4 rounded-full bg-green-50 flex items-center justify-center shrink-0 mt-0.5">
                                        <Check className="w-2.5 h-2.5 text-green-600" />
                                    </div>
                                    <span className="leading-snug">{item}</span>
                                </li>
                            ))}
                        </ul>
                        {!isExpanded && shouldTruncate && (
                            <div className="text-center mt-1">
                                <button
                                    onClick={(e) => {
                                        e.preventDefault()
                                        setIsExpanded(true)
                                    }}
                                    className="text-[10px] font-medium text-purple-600 hover:text-purple-700 hover:underline"
                                >
                                    + {allItems.length - displayCount} more items
                                </button>
                            </div>
                        )}
                        {isExpanded && (
                            <div className="text-center mt-3">
                                <button
                                    onClick={(e) => {
                                        e.preventDefault()
                                        setIsExpanded(false)
                                    }}
                                    className="text-[10px] font-medium text-gray-400 hover:text-gray-600 hover:underline"
                                >
                                    Show less
                                </button>
                            </div>
                        )}
                    </div>
                )}

                <div className="mt-auto pt-2 w-full">

                    <Button
                        disabled
                        variant="ghost"
                        className="w-full text-purple-600 hover:text-purple-700 hover:bg-purple-50 font-semibold h-12 rounded-xl"
                    >
                        Book Deal
                    </Button>
                </div>
            </div>
        </div>
    )
}
