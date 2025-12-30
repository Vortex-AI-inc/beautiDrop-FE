"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Phone, PhoneOff, Mic, MicOff, Volume2, User, Bot, Loader2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useVoiceAgent } from "@/hooks/useVoiceAgent"
import { useAuth } from "@clerk/nextjs"
import { cn } from "@/lib/utils"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"

interface VoiceCallModalProps {
    isOpen: boolean
    onClose: () => void
    shopName: string
    shopId?: string
}

interface Message {
    role: "user" | "assistant"
    text: string
}

export function VoiceCallModal({ isOpen, onClose, shopName, shopId }: VoiceCallModalProps) {
    const [messages, setMessages] = useState<Message[]>([])
    const [status, setStatus] = useState("Initializing...")
    const [token, setToken] = useState<string | undefined>()
    const { getToken } = useAuth()
    const transcriptRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const fetchToken = async () => {
            try {
                const t = await getToken()
                setToken(t || undefined)
            } catch (error) {
                console.error("Error fetching token:", error)
            }
        }
        fetchToken()
    }, [getToken])

    const handleTranscript = useCallback((role: "user" | "assistant", text: string) => {
        setMessages((prev) => [...prev, { role, text }])
    }, [])

    const handleError = useCallback((error: string) => {
        setStatus(`Error: ${error}`)
    }, [])

    const {
        isConnected,
        isRecording,
        isPlaying,
        connect,
        disconnect,
        startRecording,
        stopRecording,
    } = useVoiceAgent({
        shopId,
        token,
        onTranscript: handleTranscript,
        onStatusChange: setStatus,
        onError: handleError,
    })

    useEffect(() => {
        if (isOpen) {
            connect()
            setMessages([])
        }

        return () => {
            disconnect()
        }
    }, [isOpen, connect, disconnect])

    useEffect(() => {
        if (isConnected && isOpen && !isRecording) {
            const timer = setTimeout(() => {
                startRecording()
            }, 500)
            return () => clearTimeout(timer)
        }
    }, [isConnected, isOpen])

    useEffect(() => {
        if (transcriptRef.current) {
            transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight
        }
    }, [messages])

    const handleCallToggle = () => {
        if (isRecording) {
            stopRecording()
        } else {
            startRecording()
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden bg-white border-gray-200 rounded-3xl shadow-2xl" showCloseButton={false}>
                <DialogHeader className="sr-only">
                    <DialogTitle>Voice Call with {shopName} AI Assistant</DialogTitle>
                    <DialogDescription>
                        Have a voice conversation with the AI assistant to ask questions about services, pricing, and availability.
                    </DialogDescription>
                </DialogHeader>
                <div className="relative h-[600px] flex flex-col">
                    {/* Header with Gradient */}
                    <div className="relative p-6 pb-8 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 overflow-hidden">
                        <div className="absolute inset-0 bg-black/10"></div>
                        <div className="relative z-10 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border-2 border-white/30">
                                    <Bot className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-lg leading-tight">{shopName} AI</h3>
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                        <div className={cn("w-2 h-2 rounded-full", isConnected ? "bg-green-400" : "bg-orange-400")} />
                                        <span className="text-xs font-medium text-white/90">
                                            {status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={onClose}
                                className="rounded-full hover:bg-white/20 text-white h-10 w-10"
                            >
                                <X className="w-5 h-5" />
                            </Button>
                        </div>
                    </div>

                    {/* Visualizer Area */}
                    <div className="flex-1 flex flex-col items-center justify-center p-8 relative overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-200/20 via-transparent to-transparent"></div>

                        {/* Animated Pulses */}
                        <div className="relative">
                            <div className={cn(
                                "absolute inset-0 rounded-full bg-blue-400/30 animate-ping",
                                isRecording ? "duration-700" : "opacity-0"
                            )} />
                            <div className={cn(
                                "relative w-32 h-32 rounded-full flex items-center justify-center border-4 transition-all duration-500 shadow-xl",
                                isPlaying ? "border-green-500 bg-green-50 scale-110" :
                                    isRecording ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-white"
                            )}>
                                {isPlaying ? (
                                    <Volume2 className="w-12 h-12 text-green-500 animate-pulse" />
                                ) : isRecording ? (
                                    <Mic className="w-12 h-12 text-blue-500" />
                                ) : (
                                    <Bot className="w-12 h-12 text-gray-400" />
                                )}
                            </div>
                        </div>

                        <p className="mt-8 text-gray-700 font-semibold text-center max-w-[250px]">
                            {isPlaying ? "AI is speaking..." : isRecording ? "Listening to you..." : "Tap to start speaking"}
                        </p>
                    </div>

                    {/* Transcript Area */}
                    <div
                        ref={transcriptRef}
                        className="h-40 bg-white border-t border-gray-200 p-4 overflow-y-auto space-y-3"
                    >
                        {messages.length === 0 ? (
                            <p className="text-center text-gray-400 text-sm mt-8">Your conversation will appear here</p>
                        ) : (
                            messages.map((msg, i) => (
                                <div key={i} className={cn(
                                    "flex gap-3 animate-in fade-in slide-in-from-bottom-2",
                                    msg.role === 'user' ? "flex-row-reverse" : "flex-row"
                                )}>
                                    <div className={cn(
                                        "w-7 h-7 rounded-full flex items-center justify-center shrink-0 shadow-sm",
                                        msg.role === 'user' ? "bg-gradient-to-br from-blue-500 to-purple-500" : "bg-gradient-to-br from-green-500 to-emerald-500"
                                    )}>
                                        {msg.role === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
                                    </div>
                                    <div className={cn(
                                        "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm shadow-sm",
                                        msg.role === 'user'
                                            ? "bg-gradient-to-br from-blue-500 to-purple-500 text-white rounded-tr-none"
                                            : "bg-gray-100 text-gray-800 rounded-tl-none border border-gray-200"
                                    )}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Controls */}
                    <div className="p-6 bg-white border-t border-gray-200 flex items-center justify-center gap-4">
                        <Button
                            onClick={handleCallToggle}
                            disabled={!isConnected}
                            size="lg"
                            className={cn(
                                "w-16 h-16 rounded-full shadow-xl transition-all duration-300 border-2",
                                isRecording
                                    ? "bg-red-500 hover:bg-red-600 border-red-300 shadow-red-200"
                                    : "bg-gradient-to-br from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 border-blue-300 shadow-blue-200"
                            )}
                        >
                            {isRecording ? <MicOff className="w-6 h-6 text-white" /> : <Mic className="w-6 h-6 text-white" />}
                        </Button>

                        <Button
                            onClick={onClose}
                            variant="outline"
                            size="lg"
                            className="w-16 h-16 rounded-full border-2 border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400 shadow-lg"
                        >
                            <PhoneOff className="w-6 h-6" />
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
