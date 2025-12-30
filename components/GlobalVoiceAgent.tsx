"use client"

import { Phone } from "lucide-react"
import { VoiceCallModal } from "@/components/portal/voice-call-modal"
import { usePathname } from "next/navigation"
import { useShopStore } from "@/lib/store/shop-store"
import { useVoiceStore } from "@/lib/store/voice-store"
import { Button } from "@/components/ui/button"

export function GlobalVoiceAgent() {
    const { isOpen, setIsOpen, shopId: storeShopId, shopName: storeShopName } = useVoiceStore()
    const pathname = usePathname()
    const { selectedShop } = useShopStore()

    const isShopPage = pathname?.includes('/browse-salons/') && selectedShop

    // Priority: Store context -> Page context -> Default
    const finalShopName = storeShopName || (isShopPage ? selectedShop.name : "BeautyDrop AI")
    const finalShopId = storeShopId || (isShopPage ? selectedShop.id : undefined)

    return (
        <>
            <div className="fixed bottom-24 right-6 z-50 group">
                <span className="absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75 animate-ping group-hover:hidden"></span>
                <Button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`relative h-16 w-16 rounded-full shadow-2xl transition-all duration-500 hover:scale-110 hover:shadow-purple-500/50 ${isOpen
                        ? 'bg-red-500 hover:bg-red-600'
                        : 'bg-gradient-to-tr from-purple-600 via-pink-600 to-rose-600'
                        }`}
                >
                    <Phone className={`h-8 w-8 text-white transition-transform duration-300 ${isOpen ? 'rotate-135' : ''}`} />
                </Button>
            </div>

            <VoiceCallModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                shopName={finalShopName}
                shopId={finalShopId}
            />
        </>
    )
}

