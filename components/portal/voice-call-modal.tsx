"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Phone, PhoneOff, Mic, MicOff, Volume2, User, Bot, Loader2, X, Activity } from "lucide-react"
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
            <DialogContent
                className="sm:max-w-[450px] p-0 overflow-hidden bg-white border-gray-200 rounded-2xl shadow-2xl gap-0"
                showCloseButton={false}
                onInteractOutside={(e) => e.preventDefault()}
                onPointerDownOutside={(e) => e.preventDefault()}
            >
                {/* Custom Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center border border-blue-100">
                            <Bot className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <h2 className="font-bold text-gray-900 leading-tight">{shopName}</h2>
                            <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="relative flex h-2 w-2">
                                    {isConnected && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>}
                                    <span className={cn("relative inline-flex rounded-full h-2 w-2", isConnected ? "bg-green-500" : "bg-orange-400")}></span>
                                </span>
                                <span className="text-xs font-medium text-gray-500 truncate max-w-[150px]">
                                    {status}
                                </span>
                            </div>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        className="rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-50"
                    >
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                {/* Main Visualizer Area */}
                <div className="bg-gray-50/50 flex flex-col items-center justify-center py-10 relative overflow-hidden h-[280px]">
                    {/* Background decoration */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-50 via-transparent to-transparent opacity-50"></div>

                    <div className="relative z-10">
                        {/* Status Ring Animation */}
                        {isRecording && (
                            <div className="absolute inset-0 -m-4 rounded-full border border-blue-200 animate-[ping_2s_linear_infinite] opacity-50"></div>
                        )}
                        {isPlaying && (
                            <div className="absolute inset-0 -m-4 rounded-full border border-green-200 animate-[ping_1.5s_linear_infinite] opacity-50"></div>
                        )}

                        <div className={cn(
                            "w-28 h-28 rounded-full bg-white shadow-xl flex items-center justify-center transition-all duration-300 border-4",
                            isPlaying ? "border-green-400 scale-105 shadow-green-200/50" :
                                isRecording ? "border-blue-400 shadow-blue-200/50" :
                                    "border-gray-200"
                        )}>
                            {isPlaying ? (
                                <div className="flex gap-1 items-center h-8">
                                    <span className="w-1.5 h-full bg-green-500 rounded-full animate-[bounce_1s_infinite]"></span>
                                    <span className="w-1.5 h-full bg-green-500 rounded-full animate-[bounce_1s_infinite_0.2s]"></span>
                                    <span className="w-1.5 h-8 bg-green-500 rounded-full animate-[bounce_1s_infinite_0.4s]"></span>
                                    <span className="w-1.5 h-full bg-green-500 rounded-full animate-[bounce_1s_infinite_0.2s]"></span>
                                    <span className="w-1.5 h-full bg-green-500 rounded-full animate-[bounce_1s_infinite]"></span>
                                </div>
                            ) : isRecording ? (
                                <Mic className="w-10 h-10 text-blue-500" />
                            ) : (
                                <Bot className="w-10 h-10 text-gray-300" />
                            )}
                        </div>
                    </div>

                    <p className="mt-6 text-sm font-semibold text-gray-600 uppercase tracking-wide">
                        {isPlaying ? "AI Speaking..." : isRecording ? "Listening..." : "Connecting..."}
                    </p>
                </div>

                {/* Transcript Area */}
                <div
                    ref={transcriptRef}
                    className="h-48 bg-white border-t border-gray-100 p-4 overflow-y-auto space-y-3"
                >
                    {messages.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center text-gray-400 p-4">
                            <Activity className="w-8 h-8 mb-2 opacity-20" />
                            <p className="text-sm">Conversation started</p>
                            <p className="text-xs opacity-70">Say "Hello" to begin</p>
                        </div>
                    ) : (
                        messages.map((msg, i) => (
                            <div key={i} className={cn(
                                "flex gap-2 max-w-[90%]",
                                msg.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto flex-row"
                            )}>
                                <div className={cn(
                                    "w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-1",
                                    msg.role === 'user' ? "bg-blue-100" : "bg-green-100"
                                )}>
                                    {msg.role === 'user' ? <User className="w-3 h-3 text-blue-700" /> : <Bot className="w-3 h-3 text-green-700" />}
                                </div>
                                <div className={cn(
                                    "px-3 py-2 rounded-2xl text-sm",
                                    msg.role === 'user'
                                        ? "bg-blue-600 text-white rounded-tr-sm"
                                        : "bg-gray-100 text-gray-800 rounded-tl-sm border border-gray-200"
                                )}>
                                    {msg.text}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer Controls */}
                <div className="p-4 bg-gray-50 border-t border-gray-200 flex items-center justify-center gap-6">
                    <Button
                        onClick={onClose}
                        variant="outline"
                        className="h-12 w-12 rounded-full border-gray-200 text-gray-500 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-all shadow-sm"
                        title="End Call"
                    >
                        <PhoneOff className="w-5 h-5" />
                    </Button>

                    <Button
                        onClick={handleCallToggle}
                        disabled={!isConnected}
                        className={cn(
                            "h-14 w-14 rounded-full shadow-lg transition-all scale-100 active:scale-95 flex items-center justify-center",
                            isRecording
                                ? "bg-red-500 hover:bg-red-600 text-white shadow-red-200"
                                : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200"
                        )}
                    >
                        {isRecording ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
