"use client"

import { MessageCircle, Phone, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useChatStore } from "@/lib/store/chat-store"
import { useVoiceStore } from "@/lib/store/voice-store"

interface ContactFabProps {
    className?: string
}

export function ContactFab({ className }: ContactFabProps) {
    const { isOpen: isChatOpen, setIsOpen: setChatOpen } = useChatStore()
    const { isOpen: isVoiceOpen, setIsOpen: setVoiceOpen } = useVoiceStore()

    const toggleChat = () => {
        if (isVoiceOpen) setVoiceOpen(false)
        setChatOpen(!isChatOpen)
    }

    const toggleVoice = () => {
        if (isChatOpen) setChatOpen(false)
        setVoiceOpen(!isVoiceOpen)
    }

    return (
        <div className={cn("fixed bottom-8 right-8 z-50 flex flex-col items-center group", className)}>
            {/* Phone Button (Secondary) - Appears on hover */}
            <button
                className="absolute bottom-0 h-14 w-14 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg transition-all duration-500 ease-out transform group-hover:-translate-y-20 opacity-0 group-hover:opacity-100 -z-10 flex items-center justify-center hover:scale-110 active:scale-95"
                onClick={toggleVoice}
                type="button"
                aria-label="Call AI Agent"
            >
                <div className="absolute inset-0 rounded-full bg-pink-500/30 blur-xl scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                {isVoiceOpen ? <X className="h-6 w-6 relative z-10" /> : <Phone className="h-6 w-6 relative z-10" />}
            </button>

            {/* Chat Button (Main) */}
            <button
                className={cn(
                    "relative h-14 w-14 rounded-full text-white shadow-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-300 z-10",
                    isChatOpen ? "bg-red-500 hover:bg-red-600 rotate-90" : "bg-gradient-to-r from-blue-600 to-indigo-600"
                )}
                onClick={toggleChat}
                type="button"
                aria-label="Contact options"
            >
                <div className="absolute inset-0 rounded-full bg-blue-600/30 blur-xl scale-150 opacity-50" />
                {isChatOpen ? <X className="h-6 w-6 relative z-10" /> : <MessageCircle className="h-6 w-6 relative z-10" />}
            </button>
        </div>
    )
}
