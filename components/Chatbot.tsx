"use client"

import { useState, useRef, useEffect } from "react"
import { useAuth } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { MessageCircle, X, Send, Bot, Sparkles, Clock, Scissors, Calendar, LogOut, MapPin } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import type { Service } from "@/types/service"
import type { Schedule } from "@/types/schedule"
import { useShopStore } from "@/lib/store/shop-store"

import { useChatStore } from "@/lib/store/chat-store"
import { endChatSession, sendMessageToAgent } from "@/lib/api/agent"
import { useToast } from "@/hooks/use-toast"

interface Message {
    id: string
    role: 'user' | 'assistant'
    content: string
    timestamp: Date
    actions?: any[]
}

interface ChatbotProps {
    shopName?: string
    phone?: string
    services?: Service[]
    schedules?: Schedule[]
    address?: string
    email?: string
}

export default function Chatbot({ shopName = "Salon", phone, services = [], schedules = [], address, email }: ChatbotProps) {
    const { selectedShop, services: storeServices, schedules: storeSchedules } = useShopStore()

    // Use props if provided, otherwise fallback to store
    const effectiveShopName = shopName !== "Salon" ? shopName : (selectedShop?.name || "Salon")
    const effectivePhone = phone || selectedShop?.phone
    const effectiveServices = services.length > 0 ? services : storeServices
    const effectiveSchedules = schedules.length > 0 ? schedules : storeSchedules
    const effectiveAddress = address || selectedShop?.address
    const effectiveEmail = email || selectedShop?.email

    const { messages: storeMessages, isOpen, setIsOpen, addMessage, checkExpiry, clearSession, sessionId, setSessionId } = useChatStore()
    const { getToken } = useAuth()
    const [messages, setMessages] = useState<Message[]>([])
    const [inputValue, setInputValue] = useState("")
    const [isTyping, setIsTyping] = useState(false)
    const scrollRef = useRef<HTMLDivElement>(null)
    const viewportRef = useRef<HTMLDivElement>(null)
    const { toast } = useToast()
    const router = useRouter()

    // Sync store messages to local state with Date conversion and check expiry
    useEffect(() => {
        checkExpiry()
    }, [])

    useEffect(() => {
        const convertedMessages = storeMessages.map(msg => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
        }))
        setMessages(convertedMessages)
    }, [storeMessages])

    useEffect(() => {
        if (messages.length === 0 && isOpen) {
            const welcomeMsg = {
                id: '1',
                role: 'assistant' as const,
                content: `Hi there! 👋 Welcome to BeautyDrop AI. How can I make your day beautiful? ✨`,
                timestamp: new Date().toISOString()
            }
            addMessage(welcomeMsg)
        }
    }, [isOpen, messages.length])

    useEffect(() => {
        const timer = setTimeout(() => {
            if (scrollRef.current) {
                scrollRef.current.scrollIntoView({ behavior: "smooth", block: "end" })
            }
        }, 150)
        return () => clearTimeout(timer)
    }, [messages, isOpen, isTyping])

    const handleEndSession = async () => {
        try {
            if (sessionId) {
                await endChatSession(sessionId)
            }
        } catch (error) {
            // Silently fail or log if needed, but still clear local session
        } finally {
            clearSession()
            toast({
                title: "Session Ended",
                description: "Your chat session has been closed.",
            })
        }
    }

    const handleSend = async (text: string = inputValue) => {
        if (!text.trim()) return

        const userMsg = {
            id: Date.now().toString(),
            role: 'user' as const,
            content: text,
            timestamp: new Date().toISOString()
        }

        addMessage(userMsg)
        setInputValue("")
        setIsTyping(true)

        try {
            const token = await getToken()
            const result = await sendMessageToAgent(text, sessionId, token)

            if (result.session_id && result.session_id !== sessionId) {
                setSessionId(result.session_id)
            }

            const botMsg = {
                id: result.message_id || (Date.now() + 1).toString(),
                role: 'assistant' as const,
                content: result.response,
                timestamp: new Date().toISOString(),
                actions: result.actions_taken
            }
            addMessage(botMsg)
        } catch (error) {
            const errorMsg = {
                id: (Date.now() + 1).toString(),
                role: 'assistant' as const,
                content: "I'm sorry, I encountered an error. Please try again later.",
                timestamp: new Date().toISOString()
            }
            addMessage(errorMsg)
        } finally {
            setIsTyping(false)
        }
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSend()
        }
    }

    const renderActions = (msg: Message) => {
        if (!msg.actions) return null

        return (
            <div className="mt-4 space-y-4">
                {msg.actions.map((action, idx) => {
                    if (action.action_type === 'get_services' && action.details?.services) {
                        return (
                            <div key={idx} className="space-y-3">
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Available Services</h4>
                                <div className="grid grid-cols-1 gap-3">
                                    {action.details.services.map((s: any, i: number) => (
                                        <div key={i} className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100/50 p-4 rounded-2xl shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden">
                                            <div className="absolute top-0 right-0 w-16 h-16 bg-blue-400/10 rounded-full -mr-8 -mt-8 blur-xl"></div>
                                            <div className="flex justify-between items-start relative z-10">
                                                <div>
                                                    <h5 className="font-bold text-blue-900 text-base">{s.name}</h5>
                                                    <div className="flex items-center gap-2 mt-1 text-blue-700/70 text-xs font-medium">
                                                        <Clock className="w-3 h-3" />
                                                        <span>{s.duration_minutes || s.duration} mins</span>
                                                    </div>
                                                </div>
                                                <div className="bg-white/80 px-3 py-1 rounded-full text-blue-600 font-bold text-sm shadow-sm border border-blue-100">
                                                    ${parseFloat(s.price).toFixed(0)}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )
                    }

                    if (action.action_type === 'get_business_hours' && action.details?.schedules) {
                        return (
                            <div key={idx} className="space-y-3">
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Business Hours</h4>
                                <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100/50 p-4 rounded-2xl shadow-sm">
                                    <div className="space-y-2">
                                        {action.details.schedules.map((s: any, i: number) => (
                                            <div key={i} className="flex justify-between items-center text-sm">
                                                <span className="font-semibold text-amber-900">{s.day_of_week}</span>
                                                <span className="text-amber-800/80 font-medium">
                                                    {s.is_active ? `${s.start_time.slice(0, 5)} - ${s.end_time.slice(0, 5)}` : 'Closed'}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )
                    }

                    if (action.action_type === 'search_shops' && action.details?.shops) {
                        return (
                            <div key={idx} className="space-y-3">
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Found Salons</h4>
                                <div className="space-y-3">
                                    {action.details.shops.map((shop: any, i: number) => (
                                        <div
                                            key={i}
                                            onClick={() => {
                                                if (shop.id) {
                                                    setIsOpen(false)
                                                    router.push(`/browse-salons/${shop.id}`)
                                                }
                                            }}
                                            className="bg-white border border-purple-100 p-4 rounded-2xl shadow-sm hover:border-purple-300 transition-colors group cursor-pointer active:scale-95"
                                        >
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <h5 className="font-bold text-gray-900 group-hover:text-purple-600 transition-colors">{shop.name}</h5>
                                                    <div className="flex items-center gap-2 mt-1 text-gray-500 text-xs leading-tight">
                                                        <MapPin className="w-3 h-3 text-purple-400" />
                                                        <span>{shop.address}, {shop.city}</span>
                                                    </div>
                                                </div>
                                                <div className="bg-purple-50 text-purple-600 p-2 rounded-xl group-hover:bg-purple-600 group-hover:text-white transition-all">
                                                    <Scissors className="w-4 h-4" />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )
                    }

                    return null
                })}
            </div>
        )
    }

    const cleanContent = (content: string, actions?: any[]) => {
        if (!actions || actions.length === 0) {
            return stripMarkdown(content)
        }

        const hasServices = actions.some(a => a.action_type === 'get_services')
        const hasHours = actions.some(a => a.action_type === 'get_business_hours')
        const hasShops = actions.some(a => a.action_type === 'search_shops')

        let cleaned = content
        if (hasServices) {
            cleaned = cleaned.split(/### Services|Services:|# Services/i)[0]
        }
        if (hasHours) {
            cleaned = cleaned.split(/### Business Hours|Business Hours:|# Business Hours|### Hours/i)[0]
        }
        if (hasShops) {
            cleaned = cleaned.split(/\*\*|### Found Salons|Found Salons:|I found a salon/i)[0]
        }

        return stripMarkdown(cleaned.trim())
    }

    const stripMarkdown = (text: string) => {
        return text
            .replace(/\*\*(.+?)\*\*/g, '$1')
            .replace(/\*(.+?)\*/g, '$1')
            .replace(/\_\_(.+?)\_\_/g, '$1')
            .replace(/\_(.+?)\_/g, '$1')
            .replace(/\~\~(.+?)\~\~/g, '$1')
            .replace(/\`(.+?)\`/g, '$1')
            .replace(/^#+\s+/gm, '')
            .replace(/\[(.+?)\]\(.+?\)/g, '$1')
    }

    const quickActions = [
        { label: "Book Appt", icon: Calendar, query: "How do I book an appointment?" },
        { label: "Services", icon: Scissors, query: "What services do you offer?" },
        { label: "Hours", icon: Clock, query: "What are your opening hours?" },
    ]

    return (
        <>
            <div className="fixed bottom-6 right-6 z-50 group">
                <span className="absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75 animate-ping group-hover:hidden"></span>
                <Button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`relative h-16 w-16 rounded-full shadow-2xl transition-all duration-500 hover:scale-110 hover:shadow-blue-500/50 ${isOpen
                        ? 'bg-red-500 hover:bg-red-600 rotate-90'
                        : 'bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600'
                        }`}
                >
                    {isOpen ? (
                        <X className="h-8 w-8 text-white transition-transform duration-300" />
                    ) : (
                        <MessageCircle className="h-8 w-8 text-white transition-transform duration-300" />
                    )}
                </Button>
            </div>

            {isOpen && (
                <div className="fixed bottom-28 right-6 w-[85vw] md:w-96 h-[600px] max-h-[80vh] bg-white rounded-[2rem] shadow-2xl flex flex-col animate-in slide-in-from-bottom-10 fade-in duration-300 z-50 overflow-hidden border border-gray-100/50 font-sans">
                    <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-6 pb-12 overflow-hidden shrink-0">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -translate-y-12 translate-x-12"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-500/20 rounded-full blur-2xl translate-y-8 -translate-x-8"></div>

                        <div className="relative flex items-center gap-4">
                            <div className="relative">
                                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 shadow-inner">
                                    <Bot className="h-7 w-7 text-white" />
                                </div>
                                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-indigo-600 rounded-full animate-pulse"></span>
                            </div>
                            <div>
                                <h3 className="font-bold text-white text-xl tracking-tight">BeautyDrop AI</h3>
                                <p className="text-blue-100 text-xs font-medium bg-white/10 px-2 py-0.5 rounded-full inline-block backdrop-blur-sm border border-white/10">
                                    AI Assistant
                                </p>
                            </div>
                        </div>

                        {messages.length > 0 && (
                            <Button
                                onClick={handleEndSession}
                                variant="ghost"
                                size="sm"
                                className="absolute top-6 right-6 text-white/70 hover:text-white hover:bg-white/10 rounded-full h-8 px-2 md:px-3 text-xs gap-1.5"
                            >
                                <LogOut className="w-3.5 h-3.5" />
                                <span className="hidden md:inline">End Session</span>
                            </Button>
                        )}
                    </div>

                    <div className="flex-1 min-h-0 bg-gray-50/80 -mt-6 rounded-t-[2rem] overflow-hidden flex flex-col relative z-20 backdrop-blur-sm">
                        <div
                            className="flex-1 overflow-y-auto p-4 pt-8 overscroll-contain scroll-smooth scrollbar-thin scrollbar-thumb-gray-200/50 scrollbar-track-transparent"
                        >
                            <div className="flex justify-center mb-6">
                                <span className="text-[10px] uppercase tracking-wider font-semibold text-gray-400 bg-gray-200/50 px-3 py-1 rounded-full">
                                    {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
                                </span>
                            </div>

                            <div className="space-y-6">
                                {messages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start items-end gap-2'}`}
                                    >
                                        {msg.role === 'assistant' && (
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shrink-0 shadow-sm text-white">
                                                <Sparkles className="w-4 h-4" />
                                            </div>
                                        )}
                                        <div
                                            className={`max-w-[85%] p-4 shadow-sm relative group ${msg.role === 'user'
                                                ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-2xl rounded-tr-none'
                                                : 'bg-white text-gray-800 border border-gray-100/50 rounded-2xl rounded-tl-none'
                                                }`}
                                        >
                                            <p className="text-sm leading-relaxed whitespace-pre-wrap">{cleanContent(msg.content, msg.actions)}</p>

                                            {msg.role === 'assistant' && renderActions(msg)}

                                            <span className={`text-[10px] mt-2 block opacity-40 transition-opacity ${msg.role === 'user' ? 'text-white' : 'text-gray-400'
                                                }`}>
                                                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </div>
                                ))}

                                {isTyping && (
                                    <div className="flex justify-start items-end gap-2">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shrink-0 shadow-sm text-white">
                                            <Sparkles className="w-4 h-4" />
                                        </div>
                                        <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-none border border-gray-100/50 shadow-sm flex gap-1 items-center h-11">
                                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div ref={scrollRef} className="h-2" />
                        </div>
                    </div>

                    {/* Quick Actions & Input */}
                    <div className="bg-white p-4 pt-2 border-t border-gray-100 z-20">
                        {messages.length < 3 && (
                            <div className="flex gap-2 mb-3 overflow-x-auto pb-2 scrollbar-none">
                                {quickActions.map((action, i) => (
                                    <button
                                        key={i}
                                        onClick={() => handleSend(action.query)}
                                        className="flex items-center gap-1.5 whitespace-nowrap px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-full text-xs font-medium transition-colors border border-blue-100"
                                    >
                                        <action.icon className="w-3 h-3" />
                                        {action.label}
                                    </button>
                                ))}
                            </div>
                        )}

                        <div className="relative flex items-center gap-2">
                            <Input
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={handleKeyPress}
                                placeholder="Ask me anything..."
                                className="bg-gray-100/50 border-gray-200 focus-visible:ring-indigo-500 rounded-full pl-5 pr-12 h-12 text-sm shadow-inner"
                            />
                            <Button
                                onClick={() => handleSend()}
                                size="icon"
                                className={`absolute right-1 w-10 h-10 rounded-full transition-all duration-300 ${inputValue.trim()
                                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-lg scale-100 opacity-100'
                                    : 'bg-gray-300 scale-90 opacity-0 pointer-events-none'
                                    }`}
                                disabled={!inputValue.trim()}
                            >
                                <Send className="h-4 w-4 text-white" />
                            </Button>
                        </div>
                        <div className="text-center mt-2 flex items-center justify-center gap-1">
                            <Sparkles className="w-3 h-3 text-indigo-400" />
                            <p className="text-[10px] text-gray-400 font-medium">Powered by BeautiDrop AI</p>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
