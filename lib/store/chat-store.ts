import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface Message {
    id: string
    role: 'user' | 'assistant'
    content: string
    timestamp: string
    actions?: any[] // Support for structured data like services/shops
}

interface ChatState {
    messages: Message[]
    isOpen: boolean
    lastUpdated: number
    sessionId: string | null
    setIsOpen: (isOpen: boolean) => void
    setSessionId: (id: string | null) => void
    addMessage: (message: Message) => void
    clearSession: () => void
    checkExpiry: () => void
}

const ONE_HOUR_MS = 60 * 60 * 1000

export const useChatStore = create<ChatState>()(
    persist(
        (set, get) => ({
            messages: [],
            isOpen: false,
            lastUpdated: 0,
            sessionId: null,
            setIsOpen: (isOpen) => set({ isOpen }),
            setSessionId: (id) => set({ sessionId: id }),
            addMessage: (message) => set((state) => ({
                messages: [...state.messages, message],
                lastUpdated: Date.now()
            })),
            clearSession: () => set({ messages: [], lastUpdated: 0, sessionId: null, isOpen: false }),
            checkExpiry: () => {
                const { lastUpdated } = get()
                if (lastUpdated && (Date.now() - lastUpdated > ONE_HOUR_MS)) {
                    set({ messages: [], lastUpdated: 0, sessionId: null })
                }
            }
        }),
        {
            name: 'beauty-drop-chat',
            storage: createJSONStorage(() => localStorage),
        }
    )
)
