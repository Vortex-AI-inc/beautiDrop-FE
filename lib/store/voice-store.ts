import { create } from 'zustand'

interface VoiceState {
    isOpen: boolean
    shopId?: string
    shopName?: string
    setIsOpen: (isOpen: boolean) => void
    openWithShop: (shopId: string, shopName: string) => void
    close: () => void
}

export const useVoiceStore = create<VoiceState>((set) => ({
    isOpen: false,
    shopId: undefined,
    shopName: undefined,
    setIsOpen: (isOpen: boolean) => set({ isOpen }),
    openWithShop: (shopId: string, shopName: string) => set({ isOpen: true, shopId, shopName }),
    close: () => set({ isOpen: false }),
}))
