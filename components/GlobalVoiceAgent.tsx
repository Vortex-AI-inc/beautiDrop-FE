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

    const finalShopName = storeShopName || (isShopPage ? selectedShop.name : "BeautyDrop AI")
    const finalShopId = storeShopId || (isShopPage ? selectedShop.id : undefined)

    return (
        <>


            <VoiceCallModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                shopName={finalShopName}
                shopId={finalShopId}
            />
        </>
    )
}

