"use client"

import { useState } from "react"
import { Phone } from "lucide-react"
import { VoiceCallModal } from "@/components/portal/voice-call-modal"
import { usePathname } from "next/navigation"
import { useShopStore } from "@/lib/store/shop-store"
import { Button } from "@/components/ui/button"

export function GlobalVoiceAgent() {
    const [isVoiceCallOpen, setIsVoiceCallOpen] = useState(false)
    const pathname = usePathname()
    const { selectedShop } = useShopStore()

    const isShopPage = pathname?.includes('/browse-salons/') && selectedShop

    const shopName = isShopPage ? selectedShop.name : "BeautyDrop AI"
    const shopId = isShopPage ? selectedShop.id : undefined

    const shouldShowButton = !pathname?.includes('/portal') && !pathname?.includes('/staff')

    if (!shouldShowButton) {
        return null
    }

    return (
        <>
            <div className="fixed bottom-24 right-6 z-50 group">
                <span className="absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75 animate-ping group-hover:hidden"></span>
                <Button
                    onClick={() => setIsVoiceCallOpen(!isVoiceCallOpen)}
                    className={`relative h-16 w-16 rounded-full shadow-2xl transition-all duration-500 hover:scale-110 hover:shadow-purple-500/50 ${
                        isVoiceCallOpen
                            ? 'bg-red-500 hover:bg-red-600'
                            : 'bg-gradient-to-tr from-purple-600 via-pink-600 to-rose-600'
                    }`}
                >
                    <Phone className={`h-8 w-8 text-white transition-transform duration-300 ${isVoiceCallOpen ? 'rotate-135' : ''}`} />
                </Button>
            </div>

            <VoiceCallModal
                isOpen={isVoiceCallOpen}
                onClose={() => setIsVoiceCallOpen(false)}
                shopName={shopName}
                shopId={shopId}
            />
        </>
    )
}
